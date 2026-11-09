import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleEvents, similarName, deleteUserEvents } from "../src/events.js";
import { handleEventImport, runEventImport, CAP } from "../src/eventimport.js";
import { parseAllView, parseProfilePage, profileSlug, syncSessionize, linkSessionize, previewProfile, confirmProfile, SYNC_CAP } from "../src/sessionize.js";
import { parseJsonLd, parseIcs, parseSitemap, runCommunityDays, isMicrosoftRelated } from "../src/communitydays.js";
import { robotsAllowed, UA, politeGet, CACHE_MAX } from "../src/botfetch.js";
import { normEventName, normSessionTitle, normLink, normUrl, upsertEvent, upsertSession, listDupes, listMerges, decideDupe, unmerge, mergeEvents, slugHandle, backfillKeys, cleanCand, normEnd, EVENT_TABLES } from "../src/eventmerge.js";
import { mergeStatements } from "../src/identities.js";
import { queueSessionReminders } from "../src/topic_notifications.js";
import { TOOLS, handleMcp } from "../src/mcp.js";
import { createHash } from "node:crypto";

const fx = (n) => readFileSync(new URL("./fixtures/" + n, import.meta.url), "utf8");
const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf8"));
  // wie D1: batch liefert je Anweisung ein Ergebnis ({ results, meta }); n.calls zaehlt die D1-Aufrufe (ein batch = ein Aufruf)
  const n = { calls: 0 }, reads = (sql) => /^\s*(SELECT|WITH)\b/i.test(sql);
  const db = { prepare(sql) { let args = []; const exec = () => { if (reads(sql)) return { results: raw.prepare(sql).all(...args), meta: { changes: 0, last_row_id: 0 } }; const r = raw.prepare(sql).run(...args); return { results: [], meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; };
    const o = { bind(...a) { args = a; return o; }, exec: async () => exec(), all: async () => { n.calls++; return { results: raw.prepare(sql).all(...args) }; }, first: async () => { n.calls++; return raw.prepare(sql).get(...args) ?? null; }, run: async () => { n.calls++; return exec(); } }; return o; }, async batch(s) { n.calls++; const out = []; for (const x of s) out.push(await x.exec()); return out; } };
  const calls = [];
  const pages = {};
  const fetch = async (url, init) => { calls.push({ url: String(url), ua: init?.headers?.["user-agent"] }); const p = pages[String(url)]; return p === undefined ? new Response("nf", { status: 404 }) : new Response(typeof p === "string" ? p : JSON.stringify(p), { status: 200 }); };
  raw.prepare("INSERT INTO meta(k,v) VALUES('entity_source','db')").run();   // Entitaeten nur aus der Datenbank: kein Abruf der Seite im Test
  const puts = [], env = { DB: db, SITE: "https://site.test", IMPORT_OPTS: { fetch, sleep: async () => {} }, PAGES: { put: async (k) => { puts.push(k); } } };
  return { raw, env, pages, calls, n, puts, opts: env.IMPORT_OPTS };
}
const user = (raw, id, name, handle, role) => { raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(?,'github',?,?,1)").run(id, "s" + id, name); if (handle) raw.prepare("INSERT INTO profiles(user_id,public,handle,updated) VALUES(?,1,?,1)").run(id, handle); return { id, name }; };
const SZ = "https://sessionize.com/api/v2/abc123/view/All";

const HANDLE = /^[a-z0-9][a-z0-9-]{2,39}$/;   // wie events.js und die Routen /api/event/<handle>
const via = (handler, env) => (u, path, method = "GET", b) => { const req = new Request("https://x" + path, { method, body: b ? JSON.stringify(b) : undefined }); return handler(env, req, new URL(req.url), path, u, J).then(async (r) => [r.status, await r.json()]); };
const visible = (raw) => raw.prepare("SELECT * FROM events WHERE merged_into=0 ORDER BY id").all();
const liveSessions = (raw, eventId) => raw.prepare("SELECT * FROM event_sessions WHERE event_id=? AND merged_into=0 ORDER BY id").all(eventId);
const cdPages = (pages, list) => { pages["https://communitydays.org/robots.txt"] = ""; pages["https://communitydays.org/events.ics"] = "nope"; pages["https://communitydays.org/calendar.ics"] = "nope"; pages["https://communitydays.org/feed.ics"] = "nope"; pages["https://communitydays.org/events"] = list; };
const ldList = (events) => `<html><head><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": events.map((e) => ({ "@type": "Event", ...e })) }).replace(/<\//g, "<\\/")}</script></head></html>`;
const profilePage = (name, events, extra = "") => `<html><body><h1>${name}</h1>${extra}${events.map((e, i) => `<section class="s-event" data-event="${i}"><a href="https://sessionize.com/${e.slug}/">${e.title}</a>${e.date ? `<time datetime="${e.date}">x</time>` : ""}${e.place ? `<span class="s-place">${e.place}</span>` : ""}<ul>${e.sessions.map((s) => `<li class="s-session" data-session="${s.id}">${s.title}</li>`).join("")}</ul></section>`).join("")}</body></html>`;
// Sessionize view/All mit n Sessions und m Speakern (jede Session zwei Speaker)
const feed = (n, m, mut = (x) => x) => ({ sessions: Array.from({ length: n }, (_, i) => mut({ id: String(1000 + i), title: `Session ${i} about topic ${i * 7}`, description: `Abstract ${i}`, startsAt: `2026-05-16T${String(9 + (i % 8)).padStart(2, "0")}:00:00`, endsAt: `2026-05-16T${String(9 + (i % 8)).padStart(2, "0")}:45:00`, isServiceSession: false, speakers: [`sp-${i % m}`, `sp-${(i + 1) % m}`], categoryItems: [], roomId: 1 + (i % 3) }, i)),
  speakers: Array.from({ length: m }, (_, i) => ({ id: `sp-${i}`, fullName: `Speaker Number${i} Person`, tagLine: "Tag", bio: "Bio ".repeat(50), profilePicture: `https://sessionize.com/image/p${i}.jpg`, links: [{ url: `https://www.linkedin.com/in/sp${i}` }] })), categories: [], rooms: [{ id: 1, name: "Room A" }, { id: 2, name: "Room B" }, { id: 3, name: "Room C" }] });

test("Normalisierung: Namen, Titel, Links, URLs", () => {
  assert.equal(normEventName("The 3rd Annual Hamburg Copilot Day 2026 GmbH").key, "hamburg copilot day");
  assert.equal(normEventName("Hamburg Copilot Day 2026 – Edition").year, "2026");
  assert.equal(normSessionTitle("“Fabric 101” 😀!"), normSessionTitle("fabric 101"));
  assert.equal(normLink("https://www.linkedin.com/in/Jane-Doe/?x=1"), normLink("http://linkedin.com/in/jane-doe"));
  assert.equal(normLink("https://x.com/janedoe"), normLink("https://twitter.com/JaneDoe/"));
  assert.equal(normUrl("https://www.Example.com/a/?utm_source=x#f"), normUrl("http://example.com/a"));
  assert.equal(normUrl("javascript:alert(1)"), "");
});
test("Sessionize All: Mapping, Zeitplan nur wenn angekuendigt, Servicesessions weg; von Speakern nur Kennung und Name (317-10)", () => {
  const p = parseAllView(JSON.parse(fx("sessionize_all.json")));
  assert.equal(p.sessions.length, 2);
  const a = p.sessions[0], b = p.sessions[1];
  assert.equal(a.start, "2026-05-16T09:00"); assert.equal(a.room, "Room A"); assert.equal(a.track, "AI"); assert.equal(a.level, "200"); assert.equal(a.speakers.length, 2);
  assert.ok(!/https?:|<b>/.test(a.abstract));
  assert.equal(b.start, ""); assert.equal(b.end, ""); assert.equal(b.room, "");
  assert.deepEqual(a.speakers[0], { sz: "aaaa-1", n: "Jane Doe" });   // keine Kurzvorstellung, kein Slogan, kein Foto, keine Links
  assert.ok(!/Principal Architect|Jane builds things|image\/abcd|linkedin/.test(JSON.stringify(p)));
  assert.equal(parseAllView({}), null);
});
test("Sessionize-Profil: Parser und freundlicher Rueckfall; Bio, Slogan und Foto werden nicht gelesen (317-10)", () => {
  const p = parseProfilePage(fx("sessionize_profile.html"));
  assert.equal(p.name, "Jane Doe"); assert.equal(p.events.length, 2); assert.equal(p.events[0].slug, "hamburg-copilot-day"); assert.equal(p.events[0].sessions.length, 2); assert.equal(p.events[0].place, "Hamburg, Germany"); assert.equal(p.events[1].online, true);
  assert.deepEqual(Object.keys(p).sort(), ["events", "links", "name"]); assert.ok(!/Jane builds things|Principal Architect|image\/abcd/.test(JSON.stringify(p)));
  assert.ok(parseProfilePage("<html><body>nothing</body></html>").error);
  assert.equal(profileSlug("https://sessionize.com/jane-doe"), "jane-doe"); assert.equal(profileSlug("https://evil.example/jane"), ""); assert.equal(profileSlug("https://sessionize.com/api/v2/x"), "");
});
test("robots.txt: eigener Token vor *, laengste Regel", () => {
  const r = fx("communitydays_robots.txt");
  assert.equal(robotsAllowed(r, "/events/hamburg"), true); assert.equal(robotsAllowed(r, "/events/secret-one"), false); assert.equal(robotsAllowed(r, "/private/x"), true);   // Gruppe des Bots gilt, "*" nicht mehr
  assert.equal(robotsAllowed("User-agent: *\nDisallow: /", "/x"), false); assert.equal(robotsAllowed("", "/x"), true);
  assert.ok(!/@/.test(UA) && UA.includes("https://www.m365.fm/bot/"));
});
test("Community Days: Parser JSON-LD, ICS, Sitemap, Microsoft-Filter; Kennung ist nie die Listen- oder Feed-Adresse (317-04)", () => {
  const l = parseJsonLd(fx("communitydays_list.html"));
  assert.equal(l.length, 3); assert.equal(l[0].city, "Hamburg"); assert.equal(l[0].mode, "onsite"); assert.equal(l[0].organizer_name, "Hamburg M365 User Group e.V.");
  assert.deepEqual(l[0].sources[0], { kind: "communitydays", ref: "communitydays.org/events/hamburg-copilot-day", url: "https://communitydays.org/events/hamburg-copilot-day" });
  // Sessionize-Adresse nur im Beschreibungstext: Hinweis, keine Kennung; in sameAs: Kennung des Events
  assert.deepEqual(l[0].sources[1], { kind: "sessionize_mention", ref: "hamburg-copilot-day" });
  assert.ok(parseJsonLd(ldList([{ name: "Azure Day", startDate: "2027-01-10", url: "https://communitydays.org/events/azure-day", sameAs: "https://sessionize.com/Azure-Day-2027/" }]))[0].sources.some((s) => s.kind === "sessionize_event" && s.ref === "azure-day-2027"));
  assert.equal(l[2].mode, "online");
  assert.equal(isMicrosoftRelated(l[0]), true); assert.equal(isMicrosoftRelated(l[1]), false);
  const i = parseIcs(fx("communitydays.ics")); assert.equal(i.length, 1); assert.equal(i[0].start, "2026-06-10T09:00"); assert.equal(i[0].city, "Vienna");
  // Eintraege ohne eigene Adresse: Listen-/Feed-Adresse ist weder URL noch Kennung; jeder Eintrag bekommt seine eigene Kennung (UID bzw. Name+Beginn)
  const feedUrl = "https://communitydays.org/events.ics", vev = (t, d, uid) => `BEGIN:VEVENT\nSUMMARY:${t}\nDTSTART:${d}T090000\nLOCATION:Berlin\\, Germany\n${uid ? "UID:" + uid + "\n" : ""}END:VEVENT\n`;
  const three = parseIcs("BEGIN:VCALENDAR\n" + vev("Azure Community Day Berlin", "20270610", "a1@cd") + vev("Power Platform Day", "20270611", "") + vev("Microsoft Fabric Day Zurich", "20270612", "") + "END:VCALENDAR", feedUrl);
  assert.equal(new Set(three.map((c) => c.sources[0].ref)).size, 3); assert.equal(three[0].sources[0].ref, "uid:a1@cd");
  assert.ok(three.every((c) => c.url === "" && !c.sources[0].ref.includes("events.ics") && c.sources.every((s) => !s.url)));
  const noUrl = parseJsonLd(ldList([{ name: "Azure Day A", startDate: "2027-02-01" }, { name: "Azure Day B", startDate: "2027-02-02" }]), "https://communitydays.org/events");
  assert.equal(new Set(noUrl.map((c) => c.sources[0].ref)).size, 2); assert.ok(noUrl.every((c) => c.url === ""));
  assert.deepEqual(parseSitemap("<urlset><url><loc>https://communitydays.org/events/a</loc></url><url><loc>https://communitydays.org/about</loc></url><url><loc>https://evil.example/events/x</loc></url></urlset>"), ["https://communitydays.org/events/a"]);
});
test("Community Days: Probelauf schreibt nichts, Lauf legt herrenlose Events an, vergangene retired, Bot-UA, robots, Cache; erneuter Lauf frischt nur auf", async () => {
  const { raw, env, pages, calls, opts } = await setup();
  pages["https://communitydays.org/robots.txt"] = "User-agent: *\nDisallow: /private/\n";
  pages["https://communitydays.org/events.ics"] = "nope"; pages["https://communitydays.org/calendar.ics"] = "nope"; pages["https://communitydays.org/feed.ics"] = "nope";
  pages["https://communitydays.org/events"] = fx("communitydays_list.html");
  const dry = await runCommunityDays(env, { ...opts, dry: true, today: "2026-05-01" });
  assert.equal(dry.created, 2); assert.equal(dry.skipped_non_ms, 1); assert.equal(raw.prepare("SELECT COUNT(*) n FROM events").get().n, 0);
  const real = await runCommunityDays(env, { ...opts, today: "2026-05-01" });
  assert.equal(real.created, 2);
  const evs = raw.prepare("SELECT * FROM events ORDER BY start").all();
  assert.equal(evs.length, 2); assert.ok(evs.every((e) => e.source === "communitydays" && e.unclaimed === 1 && e.owner_id === 0 && e.merged_into === 0 && e.source_url.startsWith("https://communitydays.org/")));
  assert.equal(evs.find((e) => /Azure/.test(e.title)).retired, 1); assert.equal(evs.find((e) => /Hamburg/.test(e.title)).retired, 0);   // vergangen: markiert, nicht geloescht
  assert.ok(raw.prepare("SELECT 1 FROM event_source WHERE kind='sessionize_mention' AND ref='hamburg-copilot-day' AND url_key=''").get());
  assert.ok(calls.every((c) => c.ua === UA)); assert.equal(calls.filter((c) => c.url.endsWith("/events")).length, 1);   // zweiter Lauf aus dem Cache
  assert.equal((await runCommunityDays(env, { ...opts, today: "2026-05-01" })).skipped_run, "done");   // ein Durchgang je Tag
  const again = await runCommunityDays(env, { ...opts, today: "2026-05-02" });
  assert.equal(again.created, 0); assert.equal(again.merged, 2); assert.equal(raw.prepare("SELECT COUNT(*) n FROM events").get().n, 2);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM merge_log").get().n, 0);   // derselbe Datensatz erneut gelesen ist keine Zusammenfuehrung
  // robots verbietet die Seite -> nichts abgerufen
  const s2 = await setup(); s2.pages["https://communitydays.org/robots.txt"] = "User-agent: *\nDisallow: /"; s2.pages["https://communitydays.org/events"] = fx("communitydays_list.html");
  const r2 = await runCommunityDays(s2.env, { ...s2.opts, today: "2026-05-01" }); assert.equal(r2.found, 0); assert.ok(!s2.calls.some((c) => c.url.endsWith("/events")));
});
test("Dedupe: dasselbe Event aus Community Days und Sessionize wird EIN Event (gleicher Name, Tag und Ort), protokolliert", async () => {
  const { raw, env, pages, opts } = await setup();
  pages["https://communitydays.org/robots.txt"] = ""; pages["https://communitydays.org/events"] = fx("communitydays_list.html");
  await runCommunityDays(env, { ...opts, today: "2026-05-01" });
  const u = user(raw, 1, "Jane Doe", "jane-doe");
  pages["https://sessionize.com/robots.txt"] = ""; pages["https://sessionize.com/jane-doe"] = fx("sessionize_profile.html");
  const pv = await previewProfile(env, u, "https://sessionize.com/jane-doe", similarName, opts); assert.ok(pv.ok, JSON.stringify(pv));
  const cf = await confirmProfile(env, u, pv.token, pv.items.filter((i) => i.event.startsWith("Hamburg")).map((i) => i.id), opts);
  assert.equal(cf.ok, true); assert.equal(cf.sessions, 2);
  const hh = visible(raw).filter((e) => e.name_key === "hamburg copilot day"); assert.equal(hh.length, 1); assert.equal(hh[0].source, "communitydays");
  assert.deepEqual(raw.prepare("SELECT kind FROM event_source WHERE event_id=? ORDER BY kind").all(hh[0].id).map((r) => r.kind), ["communitydays", "sessionize_event", "sessionize_mention"]);
  const log = raw.prepare("SELECT * FROM merge_log").all(); assert.equal(log.length, 1); assert.equal(log[0].kind, "event"); assert.equal(log[0].auto, 1); assert.equal(log[0].into_id, hh[0].id); assert.equal(JSON.parse(log[0].snapshot).reason, "name+day+city");
  assert.equal(liveSessions(raw, hh[0].id).length, 2);
  // Anderer Name, aber die Sessionize-Adresse steht nur im Beschreibungstext des anderen Events: kein automatisches Zusammenfuehren, Warteschlange
  const s2 = await setup(), db = s2.env.DB;
  const a = await upsertEvent(db, { title: "North Cloud Conference", start: "2026-05-16", city: "Hamburg", source: "communitydays", sources: [{ kind: "communitydays", ref: "communitydays.org/events/ncc" }, { kind: "sessionize_mention", ref: "hamburg-copilot-day" }] });
  const b = await upsertEvent(db, { title: "Hamburg Copilot Day 2026", start: "2026-05-16", city: "Hamburg", source: "sessionize", sources: [{ kind: "sessionize_event", ref: "hamburg-copilot-day", url: "https://sessionize.com/hamburg-copilot-day" }] });
  assert.equal(a.action, "created"); assert.equal(b.action, "queued"); assert.equal(b.reason, "mentioned_link"); assert.equal(visible(s2.raw).length, 2);
});
test("Dedupe: zwei Speaker importieren dieselbe Session -> eine Session mit zwei Speakern", async () => {
  const { raw, env, pages, opts } = await setup();
  const jane = user(raw, 1, "Jane Doe", "jane-doe"), max = user(raw, 2, "Max Muster", "max-muster");
  pages["https://sessionize.com/robots.txt"] = ""; pages["https://sessionize.com/jane-doe"] = fx("sessionize_profile.html"); pages["https://sessionize.com/max-muster"] = fx("sessionize_profile_max.html");
  const p1 = await previewProfile(env, jane, "https://sessionize.com/jane-doe", similarName, opts);
  await confirmProfile(env, jane, p1.token, ["0.0"], opts);
  const p2 = await previewProfile(env, max, "sessionize.com/max-muster", similarName, opts);
  await confirmProfile(env, max, p2.token, ["0.0"], opts);   // Titel weicht in Satzzeichen ab
  const ev = raw.prepare("SELECT * FROM events").all(); assert.equal(ev.length, 1);   // dieselbe Sessionize-Seite des Events: derselbe Datensatz, keine zweite Zeile
  const ss = liveSessions(raw, ev[0].id); assert.equal(ss.length, 1);
  const sp = JSON.parse(ss[0].speakers); assert.deepEqual(sp.map((x) => x.h).sort(), ["jane-doe", "max-muster"]); assert.ok(sp.every((x) => x.s === "confirmed"));
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM session_source WHERE session_id=?").get(ss[0].id).n, 2);
  const log = raw.prepare("SELECT * FROM merge_log WHERE kind='session'").all(); assert.equal(log.length, 1); assert.equal(log[0].auto, 1); assert.equal(log[0].into_id, ss[0].id);   // protokolliert und damit umkehrbar
  // Vorschau enthaelt nur Name, Events und Sessions (keine Bio, keine Links, kein Foto)
  await previewProfile(env, jane, "https://sessionize.com/jane-doe", similarName, opts);
  const data = raw.prepare("SELECT data FROM import_preview WHERE user_id=1").get().data; assert.ok(!/Jane builds things|Principal Architect|image\/abcd|linkedin/.test(data));
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM import_preview WHERE user_id=1").get().n, 1);
  // Fremdes Profil kann nicht uebernommen werden
  const eve = user(raw, 3, "Eve Other", "eve-other");
  assert.equal((await previewProfile(env, eve, "https://sessionize.com/jane-doe", similarName, opts)).error, "not_your_profile");
  assert.equal((await previewProfile(env, jane, "https://example.com/x", similarName, opts)).error, "bad_url");
});
test("Dedupe (317-03): von Hand eingetragene Session und Sessionize-Abgleich werden EINE Session; Re-Sync idempotent; Speaker-Import in ein fremdes Event braucht den Veranstalter (317-07)", async () => {
  const { raw, env, pages, opts } = await setup(), ev = via(handleEvents, env);
  const orga = user(raw, 9, "Orga", "orga-p");
  assert.equal((await ev(orga, "/api/event", "POST", { handle: "hh-copilot", title: "Hamburg Copilot Day 2026", start: "2026-05-16", end: "2026-05-16", mode: "onsite", location: "Hamburg" }))[0], 200);
  assert.deepEqual((await ev(orga, "/api/event/hh-copilot/session", "POST", { title: "Copilot Studio: Agents that actually ship", room: "Saal 1" }))[1], { ok: true, status: "live" });   // echter Weg des Formulars
  const e = () => raw.prepare("SELECT * FROM events WHERE handle='hh-copilot'").get();
  assert.equal(raw.prepare("SELECT title_key FROM event_sessions").get().title_key, normSessionTitle("Copilot Studio: Agents that actually ship"));
  pages[SZ] = JSON.parse(fx("sessionize_all.json"));
  const link = await linkSessionize(env, e(), "abc123", opts); assert.equal(link.ok, true, JSON.stringify(link)); assert.equal(link.sync.created, 1); assert.equal(link.sync.merged, 1);
  let ss = liveSessions(raw, e().id); assert.equal(ss.length, 2);   // nicht drei: die von Hand eingetragene und die aus Sessionize sind dieselbe
  const hand = ss.find((s) => s.sessionize_id === "101"); assert.equal(hand.id, 1); assert.equal(hand.room, "Saal 1"); assert.equal(hand.start, "2026-05-16T09:00"); assert.equal(JSON.parse(hand.speakers).length, 2);   // Eingetragenes bleibt, Leeres wird gefuellt
  assert.deepEqual(hand.edited_fields.split(",").sort(), ["room", "title"]);
  const lg = raw.prepare("SELECT * FROM merge_log WHERE kind='session'").all(); assert.equal(lg.length, 1); assert.equal(lg[0].auto, 1); assert.equal(lg[0].into_id, hand.id);
  const snap = () => JSON.stringify([raw.prepare("SELECT id,title,speakers,start,status FROM event_sessions ORDER BY id").all(), raw.prepare("SELECT COUNT(*) n FROM speaker_ref").get(), raw.prepare("SELECT COUNT(*) n FROM speaker_invites").get(), raw.prepare("SELECT COUNT(*) n FROM merge_log").get()]);
  const before = snap();
  const re = await syncSessionize(env, e(), opts); assert.equal(re.created, 0); assert.equal(re.unchanged, 2); assert.equal(snap(), before);   // idempotent
  // Zeitplan nicht veroeffentlicht -> keine Zeiten; von Speakern nur Name und Kennung, nichts kopiert (317-10)
  assert.equal(raw.prepare("SELECT start FROM event_sessions WHERE sessionize_id='102'").get().start, "");
  // Speaker Jane importiert ihr Profil: das Event hat einen Veranstalter, sie verwaltet es nicht -> nichts geht ohne ihn live
  const jane = user(raw, 1, "Jane Doe", "jane-doe");
  pages["https://sessionize.com/robots.txt"] = ""; pages["https://sessionize.com/jane-doe"] = fx("sessionize_profile.html");
  const pv = await previewProfile(env, jane, "https://sessionize.com/jane-doe", similarName, opts), cf = await confirmProfile(env, jane, pv.token, ["0.0", "0.1"], opts);
  assert.equal(cf.sessions, 0); assert.equal(cf.requested, 1); assert.equal(cf.proposed, 1);
  assert.equal(visible(raw).length, 1);   // gleiches Event ueber Name+Tag+Ort, obwohl von Hand angelegt
  const sp = JSON.parse(raw.prepare("SELECT speakers FROM event_sessions WHERE id=?").get(hand.id).speakers);
  assert.equal(sp.length, 2); assert.equal(sp.find((x) => x.h === "jane-doe").s, "invited"); assert.ok(sp.find((x) => x.n === "Max Muster").t);   // Anfrage "Bist du das?", nicht bestaetigt
  const prop = raw.prepare("SELECT * FROM event_sessions WHERE title='Governance for Copilot'").get(); assert.equal(prop.status, "pending"); assert.equal(prop.proposer_id, 1);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM speaker_ref WHERE handle<>''").get().n, 0);   // Name allein merkt kein Profil an der Speaker-Identitaet
  // Veranstalter gibt den Vorschlag frei
  assert.equal((await ev(orga, `/api/event/hh-copilot/session/${prop.id}/approve`, "POST", { ok: true }))[0], 200);
  assert.equal(raw.prepare("SELECT status FROM event_sessions WHERE id=?").get(prop.id).status, "live");
  // Session verschwindet bei Sessionize -> retired, nicht geloescht
  pages[SZ] = { ...JSON.parse(fx("sessionize_all.json")), sessions: JSON.parse(fx("sessionize_all.json")).sessions.slice(0, 1) };
  raw.exec("DELETE FROM import_cache");   // Sessionize cached 5 Minuten, wir ebenfalls
  const gone = await syncSessionize(env, e(), { ...opts, now: 5 }); assert.equal(gone.retired, 1);
  assert.equal(raw.prepare("SELECT status FROM event_sessions WHERE sessionize_id='102'").get().status, "retired");
  // die von Hand eingetragene Session bleibt, auch wenn Sessionize ihr Gegenstueck nicht mehr liefert
  pages[SZ] = { ...JSON.parse(fx("sessionize_all.json")), sessions: [] }; raw.exec("DELETE FROM import_cache");
  assert.equal((await syncSessionize(env, e(), { ...opts, now: 6 })).retired, 0); assert.equal(raw.prepare("SELECT status FROM event_sessions WHERE id=?").get(hand.id).status, "live");
});
test("Sessionize-Abgleich uebernimmt Aenderungen (317-05): Titel, Zeit, Raum, zurueckgezogene Speaker; von Hand Geaendertes bleibt", async () => {
  const { raw, env, pages, opts } = await setup(), ev = via(handleEvents, env);
  const orga = user(raw, 9, "Orga", "orga-p"), jane = user(raw, 1, "Jane Doe", "jane-doe");
  await ev(orga, "/api/event", "POST", { handle: "hh-copilot", title: "Hamburg Copilot Day 2026", start: "2026-05-16", mode: "onsite", location: "Hamburg" });
  const e = () => raw.prepare("SELECT * FROM events WHERE handle='hh-copilot'").get(), base = JSON.parse(fx("sessionize_all.json"));
  pages[SZ] = base; assert.equal((await linkSessionize(env, e(), "abc123", opts)).sync.created, 2);
  const s101 = () => raw.prepare("SELECT * FROM event_sessions WHERE sessionize_id='101' AND merged_into=0").get();
  // Jane ist verknuepft und bestaetigt; Max hat einen Einladungslink
  const sp0 = JSON.parse(s101().speakers); sp0[0] = { n: "Jane Doe", h: "jane-doe", s: "confirmed", sz: "aaaa-1", r: sp0[0].r }; raw.prepare("UPDATE event_sessions SET speakers=? WHERE id=?").run(JSON.stringify(sp0), s101().id);
  const next = structuredClone(base); Object.assign(next.sessions[0], { title: "Copilot Studio: Agents in production (updated)", startsAt: "2026-05-16T14:00:00", endsAt: "2026-05-16T14:45:00", speakers: ["aaaa-1"] }); next.rooms[0].name = "Room B";
  pages[SZ] = next; raw.exec("DELETE FROM import_cache");
  const r = await syncSessionize(env, e(), opts); assert.equal(r.ok, true); assert.equal(r.updated, 1); assert.equal(r.created, 0); assert.equal(r.unchanged, 1);
  let s = s101(); assert.equal(s.title, "Copilot Studio: Agents in production (updated)"); assert.equal(s.title_key, normSessionTitle(s.title)); assert.equal(s.start, "2026-05-16T14:00"); assert.equal(s.end, "2026-05-16T14:45"); assert.equal(s.room, "Room B");
  assert.deepEqual(JSON.parse(s.speakers).map((x) => [x.n, x.h || "", x.s]), [["Jane Doe", "jane-doe", "confirmed"]]);   // Max zurueckgezogen; Janes Profil und Status bleiben
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM speaker_invites WHERE session_id=?").get(s.id).n, 0);   // Einladungslink des zurueckgezogenen Speakers entfaellt
  assert.equal(liveSessions(raw, e().id).length, 2);
  // Veranstalter aendert die Beschreibung von Hand, Sessionize aendert danach Beschreibung und Zeit: Beschreibung bleibt, Zeit kommt
  assert.equal((await ev(orga, "/api/event/hh-copilot/session", "POST", { id: s.id, title: s.title, abstract: "Vom Veranstalter geschrieben.", start: s.start, end: s.end, room: s.room, track: s.track, level: s.level, lang: s.lang, speakers: JSON.parse(s.speakers) }))[0], 200);
  assert.equal(s101().edited_fields, "abstract");
  const third = structuredClone(next); Object.assign(third.sessions[0], { description: "Neuer Text aus Sessionize", startsAt: "2026-05-16T15:00:00", endsAt: "2026-05-16T15:45:00" });
  pages[SZ] = third; raw.exec("DELETE FROM import_cache");
  assert.equal((await syncSessionize(env, e(), opts)).updated, 1);
  s = s101(); assert.equal(s.abstract, "Vom Veranstalter geschrieben."); assert.equal(s.start, "2026-05-16T15:00");
  // Vom Veranstalter geloeschte Session kommt beim Abgleich nicht wieder; nach "Verbindung loesen" und neuem Verknuepfen schon
  const s102 = raw.prepare("SELECT id FROM event_sessions WHERE sessionize_id='102'").get();
  assert.equal((await ev(orga, `/api/event/hh-copilot/session/${s102.id}`, "DELETE"))[0], 200);
  raw.exec("DELETE FROM import_cache"); const after = await syncSessionize(env, e(), opts); assert.equal(after.created, 0); assert.equal(liveSessions(raw, e().id).length, 1);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM session_source WHERE session_id=?").get(s102.id).n, 0);
  await linkSessionize(env, e(), "", opts); const relink = await linkSessionize(env, e(), "abc123", opts); assert.equal(relink.sync.created, 1); assert.equal(liveSessions(raw, e().id).length, 2);
  void jane;
});
test("Unsichere Treffer: Warteschlange, Zusammenfuehren, Zurueck (merged_into, nichts geloescht); 'getrennt lassen' gilt dauerhaft (317-12)", async () => {
  const { raw, env } = await setup(), db = env.DB;
  const hcd = { title: "Hamburg Copilot Day", start: "", city: "", source: "sessionize", sources: [{ kind: "sessionize_event", ref: "hcd", url: "https://sessionize.com/hcd" }] };
  const a = await upsertEvent(db, { title: "Hamburg Copilot Day 2026", start: "2026-05-16", city: "Hamburg", url: "https://a.example/hh", source: "communitydays", sources: [] });
  assert.equal((await upsertEvent(db, { title: "Hamburg Copilot Day 2027", start: "2027-05-15", city: "Hamburg", sources: [] }, { dry: true })).action, "created");   // andere Ausgabe: kein Treffer
  assert.equal((await upsertEvent(db, { title: "Hamburg Copilot Day", start: "", sources: [] })).reason, "bad_data");   // weder Kennung noch Datum: liesse sich nie wiedererkennen
  const b = await upsertEvent(db, hcd);   // Name ohne Datum
  assert.equal(b.action, "queued"); assert.notEqual(a.id, b.id); assert.equal(visible(raw).length, 2);
  assert.equal(raw.prepare("SELECT public FROM events WHERE id=?").get(b.id).public, 0);   // ohne Datum nicht oeffentlich
  const q = await listDupes(db); assert.equal(q.length, 1); assert.equal(q[0].kind, "event");
  await upsertSession(db, a.id, { title: "Keynote", start: "2026-05-16T09:00", speakers: [{ n: "Anna A" }] }, null, { trusted: true });
  await upsertSession(db, b.id, { title: "Closing", speakers: [{ n: "Bob B" }] }, null, { trusted: true });
  await upsertSession(db, b.id, { title: "Keynote", speakers: [{ n: "Bob B" }] }, { kind: "sessionize_profile", ref: "bob:1" }, { trusted: true });   // gleiche Session in beiden Events
  const r = await decideDupe(db, q[0].id, "merge", 1); assert.equal(r.status, "merged");
  const live = visible(raw); assert.equal(live.length, 1); assert.equal(live[0].id, a.id);
  assert.deepEqual(liveSessions(raw, a.id).map((s) => [s.title, JSON.parse(s.speakers).map((x) => x.n)]), [["Keynote", ["Anna A", "Bob B"]], ["Closing", ["Bob B"]]]);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM events").get().n, 2);   // nichts geloescht
  const hidden = raw.prepare("SELECT * FROM events WHERE merged_into<>0").get(); assert.equal(hidden.public, 0);
  const rec = await listMerges(db); assert.ok(rec.some((x) => x.log === r.log && x.kind === "event" && !x.auto) && rec.some((x) => x.kind === "session" && x.auto));   // auch automatische Zusammenfuehrungen mit Protokoll-ID
  const un = await unmerge(db, r.log, 1); assert.equal(un.ok, true);
  assert.equal(visible(raw).length, 2);
  // Zuruecknehmen ist vollstaendig: die dabei vereinten Sessions sind wieder getrennt, das wiederhergestellte Event hat seine Sessions zurueck
  assert.deepEqual(liveSessions(raw, b.id).map((s) => [s.title, s.status, JSON.parse(s.speakers).map((x) => x.n)]), [["Closing", "live", ["Bob B"]], ["Keynote", "live", ["Bob B"]]]);
  assert.deepEqual(liveSessions(raw, a.id).map((s) => [s.title, JSON.parse(s.speakers).map((x) => x.n)]), [["Keynote", ["Anna A"]]]);
  assert.equal(raw.prepare("SELECT status FROM dedupe_queue WHERE id=?").get(q[0].id).status, "separate");   // nach Rueckgabe nicht wieder vorschlagen
  // spaeterer Import-Lauf beachtet die Entscheidung: nichts wird neu angelegt, zusammengefuehrt oder erneut vorgeschlagen
  const again = await upsertEvent(db, hcd); assert.equal(again.id, b.id); assert.equal(again.log, undefined);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM events").get().n, 2); assert.equal((await listDupes(db)).length, 0); assert.equal(raw.prepare("SELECT status FROM dedupe_queue WHERE id=?").get(q[0].id).status, "separate");
  // "Getrennt lassen" in der Warteschlange
  const fd = (ref) => ({ title: "Fabric Day", start: "", sources: [{ kind: "sessionize_event", ref }] });
  await upsertEvent(db, fd("fd-1")); const d = await upsertEvent(db, fd("fd-2"));
  const q2 = (await listDupes(db)).find((x) => x.a.title === "Fabric Day"); assert.equal((await decideDupe(db, q2.id, "separate", 1)).status, "separate"); assert.equal((await listDupes(db)).some((x) => x.id === q2.id), false);
  const d2 = await upsertEvent(db, fd("fd-2")); assert.equal(d2.id, d.id); assert.equal((await listDupes(db)).length, 0); assert.equal(raw.prepare("SELECT COUNT(*) n FROM events WHERE title='Fabric Day'").get().n, 2);
});
test("Sessions: zurueckgenommene automatische Zusammenfuehrung bleibt beim naechsten Abgleich getrennt (317-12)", async () => {
  const { raw, env, pages, opts } = await setup(), ev = via(handleEvents, env), imp = via(handleEventImport, env);
  const orga = user(raw, 9, "Orga", "orga-p"), admin = { ...user(raw, 3, "Admin", "admin-p"), admin: true };
  await ev(orga, "/api/event", "POST", { handle: "hh-copilot", title: "Hamburg Copilot Day 2026", start: "2026-05-16", mode: "onsite", location: "Hamburg" });
  await ev(orga, "/api/event/hh-copilot/session", "POST", { title: "Fabric 101!" });
  const e = () => raw.prepare("SELECT * FROM events WHERE handle='hh-copilot'").get();
  pages[SZ] = JSON.parse(fx("sessionize_all.json")); const link = await linkSessionize(env, e(), "abc123", opts); assert.equal(link.sync.merged, 1);
  assert.equal(liveSessions(raw, e().id).length, 2);
  const list = await imp(admin, "/api/admin/events/dupes"); assert.equal(list[0], 200);
  const auto = list[1].recent.find((x) => x.kind === "session" && x.auto); assert.ok(auto && auto.log > 0, JSON.stringify(list[1]));   // Protokoll-ID der automatischen Zusammenfuehrung ist erreichbar
  assert.deepEqual((await imp(admin, "/api/admin/events/unmerge", "POST", { log: auto.log }))[1], { ok: true, kind: "session" });
  assert.equal(liveSessions(raw, e().id).filter((s) => s.status === "live").length, 3);
  for (let i = 0; i < 2; i++) { raw.exec("DELETE FROM import_cache"); const r = await syncSessionize(env, e(), opts); assert.equal(r.dupes_merged, 0); assert.equal(r.merged, 0); assert.equal(r.created, 0); }
  assert.equal(liveSessions(raw, e().id).filter((s) => s.status === "live").length, 3); assert.equal(raw.prepare("SELECT COUNT(*) n FROM dedupe_queue WHERE kind='session' AND status='open'").get().n, 0);
  assert.equal((await imp(admin, "/api/admin/events/unmerge", "POST", { log: auto.log }))[0], 404);   // nur einmal
});
test("Speaker: gleicher Name ohne gemeinsames Event wird nicht automatisch vereint; ein Profil nie allein ueber den Namen (317-07)", async () => {
  const { raw, env } = await setup(), db = env.DB;
  user(raw, 5, "Chris Meyer", "chris-meyer");   // oeffentliches Profil mit genau diesem Namen
  const e1 = await upsertEvent(db, { title: "Alpha Con", start: "2026-01-10", city: "Berlin", sources: [] }), e2 = await upsertEvent(db, { title: "Beta Con", start: "2026-02-10", city: "Wien", sources: [] });
  await upsertSession(db, e1.id, { title: "Talk A", speakers: [{ n: "Chris Meyer" }] }, null, { trusted: true });
  await upsertSession(db, e2.id, { title: "Talk B", speakers: [{ n: "Chris Meyer" }] }, null, { trusted: true });
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM speaker_ref").get().n, 2);
  const q = (await listDupes(db)).filter((x) => x.kind === "speaker"); assert.equal(q.length, 1);
  assert.ok(raw.prepare("SELECT speakers FROM event_sessions").all().every((s) => JSON.parse(s.speakers).every((x) => !x.h && x.t)));   // kein Profil zugeordnet, Einladungslink statt dessen
  // gleiche Sessionize-Kennung -> sicher dieselbe Person, auch bei anderer Schreibweise und ueber Events hinweg
  await upsertSession(db, e2.id, { title: "Talk C", speakers: [{ n: "C. Meyer", sz: "guid-1" }] }, null, {});
  await upsertSession(db, e1.id, { title: "Talk D", speakers: [{ n: "Chris M.", sz: "guid-1" }] }, null, {});
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM speaker_ref WHERE sessionize_id='guid-1'").get().n, 1);
  // datensparsam: die Tabelle hat keine Spalten fuer Bio, Slogan, Links oder Fotos (317-10)
  assert.deepEqual(raw.prepare("PRAGMA table_info(speaker_ref)").all().map((c) => c.name).sort(), ["created", "handle", "id", "merged_into", "name", "name_key", "sessionize_id", "updated"]);
});
test("Berechtigung: nur Organisator/Admin verknuepft Sessionize; ID wird nie ausgegeben; Beanspruchen (317-14) nur an aktive Konten (317-09)", async () => {
  const { raw, env, pages } = await setup();
  const owner = user(raw, 1, "Orga", "orga-person"), other = user(raw, 2, "Fremd", "fremd-person"), admin = { ...user(raw, 3, "Admin", "admin-p"), admin: true }, gone = user(raw, 4, "Weg", "weg-person");
  raw.prepare("INSERT INTO events(handle,owner_id,title,start,mode,created,updated) VALUES('mein-event',1,'Mein Event','2026-09-01','online',1,1)").run();
  raw.prepare("INSERT INTO events(handle,owner_id,title,start,mode,created,updated,unclaimed) VALUES('herrenlos',0,'Herrenlos','2026-09-01','online',1,1,1)").run();
  raw.prepare("INSERT INTO events(handle,owner_id,title,start,mode,created,updated,unclaimed) VALUES('herrenlos-2',0,'Herrenlos 2','2026-09-02','online',1,1,1)").run();
  pages[SZ] = JSON.parse(fx("sessionize_all.json"));
  const call = via(handleEventImport, env);
  assert.equal((await call(null, "/api/event/mein-event/sessionize", "POST", { api_id: "abc123" }))[0], 401);
  assert.equal((await call(other, "/api/event/mein-event/sessionize", "POST", { api_id: "abc123" }))[0], 403);
  assert.equal((await call(owner, "/api/event/herrenlos/sessionize", "POST", { api_id: "abc123" }))[0], 403);   // herrenlos: nur Admin
  assert.equal((await call(owner, "/api/event/mein-event/sessionize", "POST", { api_id: "../../x" }))[0], 400);
  const ok = await call(owner, "/api/event/mein-event/sessionize", "POST", { api_id: "abc123" }); assert.equal(ok[0], 200);
  assert.ok(!JSON.stringify(ok[1]).includes("abc123"));
  const st = await call(owner, "/api/event/mein-event/sessionize", "GET"); assert.equal(st[1].linked, true); assert.ok(!JSON.stringify(st[1]).includes("abc123"));
  assert.equal((await call(other, "/api/event/mein-event/sessionize", "GET"))[0], 403);
  // oeffentlicher Export und Event-Ansicht enthalten die ID nicht
  const req = new Request("https://x/api/events/export"); const ex = await (await handleEvents(env, req, new URL(req.url), "/api/events/export", null, J)).text(); assert.ok(!ex.includes("abc123") && !ex.includes("sessionize_api"));
  const mine = await (await handleEvents(env, new Request("https://x/api/events/mine"), new URL("https://x/api/events/mine"), "/api/events/mine", owner, J)).text(); assert.ok(!mine.includes("abc123"));
  // Admin-Routen
  assert.equal((await call(owner, "/api/admin/events/dupes", "GET"))[0], 403);
  assert.equal((await call(admin, "/api/admin/events/dupes", "GET"))[0], 200);
  // Beanspruchen eines herrenlosen Events: Einstieg per Route und MCP-Werkzeug, ein Admin gibt frei
  assert.ok(TOOLS.some((t) => t.name === "claim_event" && t.write && t.de));
  assert.equal((await call(null, "/api/event/herrenlos/claim", "POST", {}))[0], 401);
  assert.equal((await call(owner, "/api/event/mein-event/claim", "POST", {}))[0], 404);   // hat schon einen Veranstalter
  assert.equal((await call(owner, "/api/event/herrenlos/claim", "POST", {}))[1].status, "pending");
  assert.equal((await call(admin, "/api/admin/events/claims", "GET"))[1].items.length, 1);
  assert.equal((await call(admin, "/api/admin/events/claim", "POST", { event_id: 2, user_id: 1, ok: true }))[0], 200);
  assert.deepEqual({ ...raw.prepare("SELECT owner_id,unclaimed FROM events WHERE handle='herrenlos'").get() }, { owner_id: 1, unclaimed: 0 });
  // Anfrage eines inzwischen stillgelegten (zusammengefuehrten) oder gesperrten Kontos wird nie freigegeben
  assert.equal((await call(gone, "/api/event/herrenlos-2/claim", "POST", {}))[1].status, "pending");
  raw.prepare("UPDATE users SET banned=2,merged_into=1 WHERE id=4").run();
  assert.equal((await call(admin, "/api/admin/events/claims", "GET"))[1].items.length, 0);
  const no = await call(admin, "/api/admin/events/claim", "POST", { event_id: 3, user_id: 4, ok: true }); assert.equal(no[0], 409); assert.equal(no[1].error, "user_gone");
  assert.deepEqual({ ...raw.prepare("SELECT owner_id,unclaimed FROM events WHERE handle='herrenlos-2'").get() }, { owner_id: 0, unclaimed: 1 });
});
test("Saeubern (317-02): nur https-Adressen werden gespeichert und ausgegeben, gelesene Texte ohne Tags und Steuerzeichen", async () => {
  const { raw, env, pages, opts } = await setup(), db = env.DB;
  cdPages(pages, ldList([
    { name: "Azure Community Day Köln", startDate: "2027-03-06", url: "javascript:alert(document.domain)", description: "Azure <script>alert(1)</script> day <img src=x onerror=alert(2)>", location: { "@type": "Place", address: { addressLocality: "Köln<b>" } }, organizer: { name: "<i>User Group</i>‮" } },
    { name: "Power Platform Day", startDate: "2027-03-07", url: "data:text/html,<script>alert(3)</script>", description: "Power Platform", location: { "@type": "Place", address: { addressLocality: "Bonn" } } },
    { name: "Fabric Day", startDate: "2027-03-08", url: "http://communitydays.org/events/fabric", description: "Microsoft Fabric", location: { "@type": "Place", address: { addressLocality: "Aachen" } } },
  ]));
  const r = await runCommunityDays(env, { ...opts, today: "2027-01-01" }); assert.equal(r.created, 3);
  const rows = raw.prepare("SELECT * FROM events ORDER BY start").all(), all = JSON.stringify([rows, raw.prepare("SELECT * FROM event_source").all()]);
  assert.ok(!/javascript:|data:text|<script|<img|onerror=|<b>|<i>|‮/i.test(all), all);
  assert.deepEqual(rows.map((e) => e.url), ["", "", ""]);   // http wird nicht als Event-Link gespeichert (das Formular nimmt nur https)
  assert.equal(rows[0].location, "Köln"); assert.equal(rows[0].organizer_name, "User Group"); assert.equal(rows[2].url_key, "communitydays.org/events/fabric");   // der Schluessel fuer den Abgleich bleibt
  const ex = await (await handleEvents(env, new Request("https://x/api/events/export"), new URL("https://x/api/events/export"), "/api/events/export", null, J)).text();
  assert.ok(!/javascript:|data:text|<script/i.test(ex));
  // ICS mit gefaehrlicher Adresse
  const ics = parseIcs("BEGIN:VCALENDAR\nBEGIN:VEVENT\nSUMMARY:Power Platform Day Wien\nDTSTART:20270610T090000\nURL:javascript:alert(2)\nLOCATION:Vienna\\, Austria\nEND:VEVENT\nEND:VCALENDAR", "https://communitydays.org/events.ics");
  const c = cleanCand(ics[0]); assert.equal(c.url, ""); assert.equal(c.source_url, "https://communitydays.org/events.ics"); assert.ok(c.sources.every((s) => !/javascript/.test(s.url + s.ref)) || c.sources[0].ref.startsWith("t:"));
  assert.equal(cleanCand({ title: "X Day", start: "2027-01-01", tickets_url: "javascript:x", source_url: "ftp://x.example/a", sources: [{ kind: "communitydays", ref: "r1", url: "javascript:alert(1)" }] }).sources[0].url, "");
  // Sessions: Aufzeichnungs-Link und Texte aus der Quelle
  const e = await upsertEvent(db, { title: "Safe Con", start: "2027-05-01", city: "Berlin", sources: [] });
  await upsertSession(db, e.id, { title: "Talk <script>x</script> one", abstract: "A <b>bold</b> text https://evil.example/x", recording_url: "javascript:alert(1)", room: "<u>R1</u>", speakers: [{ n: "<b>Eve</b> Example" }] }, { kind: "sessionize_profile", ref: "eve:1", url: "javascript:alert(1)" }, { trusted: true });
  const s = raw.prepare("SELECT * FROM event_sessions WHERE event_id=?").get(e.id), src = raw.prepare("SELECT * FROM session_source WHERE session_id=?").get(s.id);
  assert.equal(s.recording_url, ""); assert.equal(src.url, ""); assert.ok(!/[<>]|https?:|javascript/.test(s.title + s.abstract + s.room + s.speakers), s.title + s.abstract);
});
test("Dedupe (317-03): von Hand angelegte Events nehmen teil – Formular schreibt die Schluessel, Altbestand wird rueckgefuellt, Import fuehrt protokolliert zusammen", async () => {
  const { raw, env, pages, opts } = await setup(), ev = via(handleEvents, env), db = env.DB;
  const orga = user(raw, 9, "Orga", "orga-p");
  assert.equal((await ev(orga, "/api/event", "POST", { handle: "hamburg-copilot-day-2026", title: "Hamburg Copilot Day 2026", start: "2026-05-16", mode: "onsite", location: "Hamburg", url: "https://hh-copilot.example/2026", summary: "Vom Veranstalter." }))[0], 200);
  const mine = raw.prepare("SELECT * FROM events").get();
  assert.deepEqual([mine.name_key, mine.url_key, mine.city_key], ["hamburg copilot day", "hh-copilot.example/2026", "hamburg"]); assert.ok(mine.keys_v > 0 && mine.edited_at > 0);
  cdPages(pages, fx("communitydays_list.html"));
  const run = await runCommunityDays(env, { ...opts, today: "2026-05-01" }); assert.equal(run.merged, 1); assert.equal(run.created, 1); assert.equal(run.queued, 0);
  const pub = raw.prepare("SELECT id,owner_id,unclaimed FROM events WHERE public=1 AND title LIKE 'Hamburg%'").all(); assert.deepEqual(pub.map((e) => ({ ...e })), [{ id: mine.id, owner_id: 9, unclaimed: 0 }]);   // kein zweites oeffentliches Event
  const log = raw.prepare("SELECT * FROM merge_log").all(); assert.equal(log.length, 1); assert.equal(log[0].auto, 1); assert.equal(log[0].into_id, mine.id);
  const now2 = raw.prepare("SELECT * FROM events WHERE id=?").get(mine.id);
  for (const k of ["title", "summary", "about", "start", "end", "mode", "location", "url", "free", "tz"]) assert.equal(now2[k], mine[k], k);   // Eingetragenes bleibt unveraendert (317-08)
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM events WHERE merged_into=? AND public=0").get(mine.id).n, 1);   // der Import-Datensatz bleibt als ausgeblendete Zeile (umkehrbar)
  // naechster Lauf: keine weitere Zeile, kein weiteres Protokoll
  await runCommunityDays(env, { ...opts, today: "2026-05-02" });
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM events").get().n, 3); assert.equal(raw.prepare("SELECT COUNT(*) n FROM merge_log").get().n, 1);
  // Altbestand ohne Schluessel (vor der Migration, Programm-Importe, Livestreams): der Abgleich findet ihn trotzdem und schreibt die Schluessel nach
  const s2 = await setup(), d2 = s2.env.DB;
  s2.raw.prepare("INSERT INTO events(handle,owner_id,title,start,mode,location,created,updated) VALUES('alt',7,'Azure Day Berlin 2026','2026-09-10','onsite','Berlin, Germany',1,1)").run();
  assert.equal(s2.raw.prepare("SELECT keys_v FROM events").get().keys_v, 0);
  assert.equal((await upsertEvent(d2, { title: "Azure Day Berlin", start: "2026-09-10", city: "Berlin", sources: [{ kind: "communitydays", ref: "communitydays.org/events/azure-day-berlin" }] }, { dry: true })).action, "merged");
  assert.equal(s2.raw.prepare("SELECT keys_v FROM events").get().keys_v, 0);   // Probelauf schreibt nichts
  const m = await upsertEvent(d2, { title: "Azure Day Berlin", start: "2026-09-10", city: "Berlin", sources: [{ kind: "communitydays", ref: "communitydays.org/events/azure-day-berlin" }] });
  assert.equal(m.action, "merged"); assert.equal(m.id, 1); assert.ok(m.log > 0); assert.equal(visible(s2.raw).length, 1);
  assert.deepEqual({ ...s2.raw.prepare("SELECT name_key,city_key,keys_v FROM events WHERE id=1").get() }, { name_key: "azure day berlin", city_key: "berlin", keys_v: 1 });
  // Rueckfuellung im Cron-Lauf: idempotent, auch Sessions
  s2.raw.prepare("INSERT INTO events(handle,owner_id,title,start,mode,created,updated) VALUES('alt2',7,'Fabric Friday','2026-10-02','online',1,1)").run();
  s2.raw.prepare("INSERT INTO event_sessions(event_id,title,proposer_id,created) VALUES(1,'Opening Keynote!',7,1)").run();
  assert.deepEqual(await backfillKeys(d2), { events: 1, sessions: 1 }); assert.deepEqual(await backfillKeys(d2), { events: 0, sessions: 0 });
  assert.equal(s2.raw.prepare("SELECT name_key FROM events WHERE handle='alt2'").get().name_key, "fabric friday"); assert.equal(s2.raw.prepare("SELECT title_key FROM event_sessions").get().title_key, "opening keynote");
});
test("Automatische Zusammenfuehrung ist umkehrbar und bleibt danach getrennt (317-04, 317-12)", async () => {
  const { raw, env, pages, opts } = await setup(), ev = via(handleEvents, env), imp = via(handleEventImport, env);
  const orga = user(raw, 9, "Orga", "orga-p"), admin = { ...user(raw, 3, "Admin", "admin-p"), admin: true };
  await ev(orga, "/api/event", "POST", { handle: "hamburg-copilot-day-2026", title: "Hamburg Copilot Day 2026", start: "2026-05-16", mode: "onsite", location: "Hamburg" });
  cdPages(pages, fx("communitydays_list.html")); await runCommunityDays(env, { ...opts, today: "2026-05-01" });
  const rec = (await imp(admin, "/api/admin/events/dupes"))[1].recent.filter((x) => x.kind === "event"); assert.equal(rec.length, 1); assert.equal(rec[0].auto, true);
  assert.equal((await imp(admin, "/api/admin/events/unmerge", "POST", { log: rec[0].log }))[0], 200);
  const hh = raw.prepare("SELECT id,owner_id,unclaimed,public,merged_into FROM events WHERE title LIKE 'Hamburg%' ORDER BY id").all();
  assert.deepEqual(hh.map((e) => [e.owner_id, e.unclaimed, e.public, e.merged_into]), [[9, 0, 1, 0], [0, 1, 1, 0]]);   // beide Events stehen wieder fuer sich
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM event_source WHERE event_id=? AND kind='communitydays'").get(hh[0].id).n, 0);   // Quelle wieder nur am Import-Event
  for (const day of ["2026-05-02", "2026-05-03"]) { const r = await runCommunityDays(env, { ...opts, today: day }); assert.equal(r.created, 0); assert.equal(r.queued, 0); }
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM events WHERE title LIKE 'Hamburg%' AND merged_into=0").get().n, 2); assert.equal(raw.prepare("SELECT COUNT(*) n FROM events").get().n, 3);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM merge_log WHERE undone=0").get().n, 0); assert.equal(raw.prepare("SELECT COUNT(*) n FROM dedupe_queue WHERE status='open'").get().n, 0);
});
test("Verschiedene Events werden nie ueber eine geteilte Adresse vereint (317-04): Speaker-Profil, Feed ohne eigene Adressen, gemeinsame Gruppen-Seite", async () => {
  const { raw, env, pages, opts } = await setup(), db = env.DB;
  const jane = user(raw, 1, "Jane Doe", "jane-doe");
  pages["https://sessionize.com/robots.txt"] = "";
  pages["https://sessionize.com/jane-doe"] = profilePage("Jane Doe", [
    { slug: "spsc-2027", title: "SharePoint Saturday Cologne 2027", date: "2027-03-06", place: "Cologne, Germany", sessions: [{ id: 11, title: "Governance in practice" }] },
    { slug: "azure-meetup-hh", title: "Azure Meetup Hamburg", date: "2027-03-08", place: "Hamburg, Germany", sessions: [{ id: 12, title: "Bicep deep dive" }] },
    { slug: "nordic-summit", title: "Nordic Summit", date: "", place: "Stockholm, Sweden", sessions: [{ id: 13, title: "Talk N" }] },
    { slug: "experts-live-nl", title: "Experts Live Netherlands", date: "", place: "", sessions: [{ id: 14, title: "Talk E" }] },
    { slug: "late-conf", title: "Late Conf", date: "2027-09-01", place: "Oslo, Norway", sessions: [{ id: 15, title: "Talk L" }] },
  ]);
  const pv = await previewProfile(env, jane, "https://sessionize.com/jane-doe", similarName, opts), cf = await confirmProfile(env, jane, pv.token, pv.items.map((i) => i.id), opts);
  assert.equal(cf.events, 5); assert.equal(cf.sessions, 5);
  const evs = visible(raw); assert.deepEqual(evs.map((e) => [e.title, e.location]), [["SharePoint Saturday Cologne 2027", "Cologne"], ["Azure Meetup Hamburg", "Hamburg"], ["Nordic Summit", "Stockholm"], ["Experts Live Netherlands", ""], ["Late Conf", "Oslo"]]);
  for (const e of evs) assert.equal(liveSessions(raw, e.id).length, 1);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM dedupe_queue").get().n, 0); assert.equal(raw.prepare("SELECT COUNT(*) n FROM merge_log").get().n, 0);   // weder vereint noch Warteschlangen-Rauschen
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM event_source WHERE kind='sessionize_profile' OR url LIKE '%/jane-doe%' OR url_key LIKE '%jane-doe%'").get().n, 0);   // die Profil-Adresse ist nie Quelle eines Events
  // ICS-Feed, dessen Eintraege keine eigene Adresse haben: alle drei Events entstehen
  const s2 = await setup(); s2.pages["https://communitydays.org/robots.txt"] = "";
  const vev = (t, d, city) => `BEGIN:VEVENT\nSUMMARY:${t}\nDTSTART:${d}T090000\nLOCATION:${city}\\, Germany\nDESCRIPTION:Microsoft community\nEND:VEVENT\n`;
  s2.pages["https://communitydays.org/events.ics"] = "BEGIN:VCALENDAR\n" + vev("Azure Community Day Berlin", "20270610", "Berlin") + vev("Power Platform Day", "20270611", "Vienna") + vev("Microsoft Fabric Day Zurich", "20270612", "Zurich") + "END:VCALENDAR";
  const r = await runCommunityDays(s2.env, { ...s2.opts, today: "2027-01-01" }); assert.equal(r.found, 3); assert.equal(r.created, 3);
  assert.deepEqual(visible(s2.raw).map((e) => [e.title, e.location, e.start]).sort(), [["Azure Community Day Berlin", "Berlin", "2027-06-10T09:00"], ["Microsoft Fabric Day Zurich", "Zurich", "2027-06-12T09:00"], ["Power Platform Day", "Vienna", "2027-06-11T09:00"]]);
  // Zwei verschiedene Events nennen dieselbe Seite (User Group) als ihre Adresse, zwei Tage auseinander: beide bleiben, ein Admin entscheidet
  const g = "https://www.meetup.example/hamburg-azure/";
  const a = await upsertEvent(db, { title: "Kubernetes Night", start: "2027-04-06", city: "Hamburg", url: g, source: "communitydays", sources: [{ kind: "communitydays", ref: normUrl(g), url: g }] });
  const b = await upsertEvent(db, { title: "Fabric Lakehouse Workshop", start: "2027-04-08", city: "Hamburg", url: g, source: "communitydays", sources: [{ kind: "communitydays", ref: normUrl(g), url: g }] });
  assert.equal(a.action, "created"); assert.equal(b.action, "queued"); assert.equal(b.reason, "source_name_differs"); assert.notEqual(a.id, b.id);
  assert.equal((await upsertEvent(db, { title: "Fabric Lakehouse Workshop", start: "2027-04-08", city: "Hamburg", url: g, source: "communitydays", sources: [{ kind: "communitydays", ref: normUrl(g), url: g }] })).id, b.id);   // erneut gelesen: derselbe Datensatz
});
test("Last (317-06): ein Lauf bleibt gedeckelt und weit unter 1.000 D1-Aufrufen; der Rueckstand wird ueber mehrere Laeufe abgebaut; eigener Cron-Aufruf", async () => {
  const { raw, env, pages, n, opts } = await setup(), ev = via(handleEvents, env);
  const orga = user(raw, 9, "Orga", "orga-p");
  await ev(orga, "/api/event", "POST", { handle: "big-conf", title: "Big Conf 2026", start: "2026-05-16", mode: "onsite", location: "Hamburg" });
  const e = () => raw.prepare("SELECT * FROM events WHERE handle='big-conf'").get();
  pages[SZ] = feed(300, 200);
  n.calls = 0; const link = await linkSessionize(env, e(), "abc123", opts);
  assert.equal(link.ok, true); assert.equal(link.sync.created, SYNC_CAP); assert.equal(link.sync.partial, true); assert.equal(link.sync.remaining, 200); assert.equal(e().sessionize_state, "partial");
  assert.ok(n.calls < 60, `Verknuepfen + erstes Stueck: ${n.calls} D1-Aufrufe`);   // vorher rund 11 Aufrufe je Session
  // der Cron-Lauf macht dort weiter: je Lauf hoechstens SYNC_CAP Sessions
  const runs = [];
  for (let i = 0; i < 4 && e().sessionize_state === "partial"; i++) { n.calls = 0; const r = await runEventImport(env, { ...opts, today: "2026-05-01" }); runs.push(n.calls); assert.ok(r.sessionize.partial + r.sessionize.synced === 1, JSON.stringify(r)); }
  assert.equal(runs.length, 2); assert.ok(runs.every((c) => c < 100), `Cron-Laeufe: ${runs} D1-Aufrufe`);
  assert.equal(e().sessionize_state, "ok"); assert.equal(liveSessions(raw, e().id).length, 300); assert.equal(raw.prepare("SELECT COUNT(*) n FROM speaker_ref").get().n, 200);
  // taeglicher Abgleich ohne Aenderung: unveraenderte Sessions werden uebersprungen (Inhalts-Hash)
  raw.exec("DELETE FROM import_cache"); n.calls = 0; const re = await syncSessionize(env, e(), opts);
  assert.equal(re.unchanged, 300); assert.equal(re.created + re.updated + re.merged, 0); assert.ok(n.calls < 15, `Re-Sync: ${n.calls} D1-Aufrufe`);
  // Community Days: 60 Events, je Lauf hoechstens CAP.cdEvents; der Durchgang geht ueber mehrere Laeufe und endet
  const s2 = await setup(); cdPages(s2.pages, ldList(Array.from({ length: 60 }, (_, i) => ({ name: `Azure Community Day ${String.fromCharCode(65 + (i % 26))}${i}`, startDate: `2027-0${1 + (i % 9)}-1${i % 10}`, url: `https://communitydays.org/events/acd-${i}`, description: "Azure", location: { "@type": "Place", address: { addressLocality: `City${i}` } } }))));
  let total = 0, passes = 0, last;
  for (; passes < 10; passes++) { s2.n.calls = 0; last = await runEventImport(s2.env, { ...s2.opts, today: "2026-12-01" }); if (last.communitydays.skipped_run) break; assert.ok(last.communitydays.created <= CAP.cdEvents); assert.ok(s2.n.calls < 160, `Lauf ${passes}: ${s2.n.calls} D1-Aufrufe`); total += last.communitydays.created; }
  assert.equal(total, 60); assert.equal(passes, 5); assert.equal(visible(s2.raw).length, 60);
  assert.ok(s2.calls.length <= CAP.requests, `Abrufe: ${s2.calls.length}`);
  // Export fuer den Seitenbau: feste Zahl an Abfragen statt mehrerer je Event (300 Events haetten sonst ueber 1.000 D1-Aufrufe gebraucht)
  const s3 = await setup(); user(s3.raw, 7, "Orga", "orga-p");
  const insE = s3.raw.prepare("INSERT INTO events(handle,owner_id,title,start,mode,created,updated,unclaimed,source,organizer_name,public) VALUES(?,?,?,?,'online',1,1,?,?,?,1)"), insS = s3.raw.prepare("INSERT INTO event_sessions(event_id,title,start,speakers,status,proposer_id,created) VALUES(?,?,?,?,'live',0,1)");
  for (let i = 1; i <= 320; i++) { const mine = i % 40 === 0; insE.run(`ev-${i}`, mine ? 7 : 0, `Event ${i}`, `2027-01-${String(1 + (i % 28)).padStart(2, "0")}`, mine ? 0 : 1, mine ? "" : "communitydays", mine ? "" : `UG ${i}`); insS.run(i, `Talk of ${i}`, "", JSON.stringify([{ n: `Speaker ${i}`, s: "confirmed" }])); }
  const exp = async () => JSON.parse(await (await handleEvents(s3.env, new Request("https://x/api/events/export"), new URL("https://x/api/events/export"), "/api/events/export", null, J)).text()).events;
  await exp(); s3.n.calls = 0; const ex = await exp();   // erster Aufruf legt einmalig fehlende Spalten an (ensureDirectoryCols)
  assert.ok(s3.n.calls <= 30, `Export: ${s3.n.calls} D1-Aufrufe`); assert.equal(ex.length, 300);
  assert.equal(ex.filter((e) => !e.unclaimed).length, 8);   // von Mitgliedern gepflegte Events fallen nie aus dem Export, auch wenn importierte die Grenze fuellen
  assert.ok(ex.every((e) => e.sessions.length === 1 && e.sessions[0].title === `Talk of ${e.handle.slice(3)}` && e.sessions[0].speakers[0].n === `Speaker ${e.handle.slice(3)}`));
  assert.deepEqual(ex.find((e) => e.handle === "ev-40").organizer, { kind: "u", handle: "orga-p", name: "Orga" }); assert.deepEqual(ex.find((e) => e.handle === "ev-41").organizer, { kind: "u", handle: "", name: "UG 41" });
  // Der Import laeuft nicht im Aufruf der Digests (0 6 * * * und */30), sondern zur Minute 15/45 im */15-Aufruf
  const idx = readFileSync(new URL("../src/index.js", import.meta.url), "utf8"), six = idx.slice(idx.indexOf('if (event.cron === "0 6 * * *")'));
  assert.ok(/if \(event\.cron === "\*\/15 \* \* \* \*"\) \{[\s\S]*?getUTCMinutes\(\) % 30 === 15\) ctx\.waitUntil\(reminders\.catch\(\(\) => 0\)\.then\(\(\) => track\(env, "eventImport", \(\) => runEventImport\(env\)\)\)\);\s*return;/.test(idx)); assert.ok(!/EventImport/.test(six));
});
test("Speaker-Import (317-07): gleicher Name reicht nie fuer ein fremdes Event oder fuer die Speaker-Identitaet; nur der Nachweis auf der Sessionize-Seite wirkt ueber Events hinweg", async () => {
  const { raw, env, pages, opts } = await setup(), ev = via(handleEvents, env);
  const orga = user(raw, 1, "Orga", "orga-p"), mallory = user(raw, 2, "Mallory", "mallory"), orga2 = user(raw, 3, "Orga Zwei", "orga-zwei");
  await ev(orga, "/api/event", "POST", { handle: "hh-copilot", title: "Hamburg Copilot Day 2026", start: "2026-05-16", mode: "onsite", location: "Hamburg" });
  const e1 = () => raw.prepare("SELECT * FROM events WHERE handle='hh-copilot'").get();
  pages[SZ] = JSON.parse(fx("sessionize_all.json")); await linkSessionize(env, e1(), "abc123", opts);
  pages["https://sessionize.com/robots.txt"] = ""; pages["https://sessionize.com/jane-doe"] = fx("sessionize_profile.html");
  assert.equal((await previewProfile(env, mallory, "https://sessionize.com/jane-doe", similarName, opts)).error, "not_your_profile");
  raw.prepare("UPDATE users SET name='Jane Doe' WHERE id=2").run();   // der Anzeigename ist frei waehlbar
  raw.prepare("INSERT INTO channels(owner_type,owner_id,kind,url) VALUES('u',2,'web','https://sessionize.com/jane-doe')").run();   // die eigenen Kanaele ebenso
  const pv = await previewProfile(env, mallory, "https://sessionize.com/jane-doe", similarName, opts); assert.ok(pv.ok);
  const cf = await confirmProfile(env, mallory, pv.token, pv.items.map((i) => i.id), opts);
  assert.equal(cf.requested, 1); assert.equal(cf.proposed, 1);
  const rows = liveSessions(raw, e1().id);
  assert.deepEqual(rows.map((s) => [s.title, s.status]), [["Copilot Studio: Agents that actually ship", "live"], ["Fabric 101 😀", "live"], ["Governance for Copilot", "pending"]]);   // nichts Neues geht ohne den Veranstalter live
  const jd = JSON.parse(rows[0].speakers).find((x) => x.n === "Jane Doe"); assert.equal(jd.h, "mallory"); assert.equal(jd.s, "invited");   // nur eine Anfrage, nie "confirmed"
  const exp = JSON.parse(await (await handleEvents(env, new Request("https://x/api/events/export"), new URL("https://x/api/events/export"), "/api/events/export", null, J)).text());
  assert.ok(!JSON.stringify(exp.events.find((x) => x.handle === "hh-copilot")).includes("mallory"));   // oeffentlich erscheint sie nirgends
  assert.deepEqual(raw.prepare("SELECT name,handle FROM speaker_ref ORDER BY id").all().map((r) => [r.name, r.handle]), [["Jane Doe", ""], ["Max Muster", ""], ["Jane Doe", ""]]);   // dritte Zeile: ihr eigener Eintrag im neu angelegten herrenlosen Online-Event; nirgends ist ein Profil gemerkt
  // ein anderer Veranstalter gleicht ein anderes Event mit derselben Speakerin ab: kein Profil wird uebernommen
  await ev(orga2, "/api/event", "POST", { handle: "other-conf", title: "Other Conf 2026", start: "2026-08-01", mode: "onsite", location: "Wien" });
  pages["https://sessionize.com/api/v2/zzz999/view/All"] = JSON.parse(fx("sessionize_all.json"));
  await linkSessionize(env, raw.prepare("SELECT * FROM events WHERE handle='other-conf'").get(), "zzz999", opts);
  const other = liveSessions(raw, raw.prepare("SELECT id FROM events WHERE handle='other-conf'").get().id);
  assert.ok(other.every((s) => JSON.parse(s.speakers).every((x) => !x.h)), JSON.stringify(other.map((s) => s.speakers)));
  // Starker Nachweis: die Sessionize-Seite selbst verlinkt das M365.FM-Profil (das kann nur die Inhaberin)
  const s2 = await setup(), ev2 = via(handleEvents, s2.env), jane = user(s2.raw, 5, "J. D.", "jane-doe");
  user(s2.raw, 1, "Orga", "orga-p"); user(s2.raw, 3, "Orga Zwei", "orga-zwei");
  s2.pages["https://sessionize.com/robots.txt"] = "";
  s2.pages["https://sessionize.com/jane-doe"] = profilePage("Jane Doe", [{ slug: "solo-day", title: "Solo Day 2026", date: "2026-07-01", place: "Bonn, Germany", sessions: [{ id: 101, title: "Copilot Studio: Agents that actually ship" }] }], '<a class="s-link" href="https://site.test/community/u/jane-doe/">M365.FM</a>');
  const p2 = await previewProfile(s2.env, jane, "https://sessionize.com/jane-doe", similarName, s2.opts); assert.ok(p2.ok, JSON.stringify(p2));
  assert.equal((await confirmProfile(s2.env, jane, p2.token, ["0.0"], s2.opts)).sessions, 1);   // herrenloses Event: live, sie steht als bestaetigte Speakerin darin
  assert.equal(s2.raw.prepare("SELECT handle FROM speaker_ref WHERE name='Jane Doe'").get().handle, "jane-doe");
  // die Sessionize-Kennung lernt die Identitaet erst im selben Event (gleicher Name dort) ...
  await ev2({ id: 1, name: "Orga" }, "/api/event", "POST", { handle: "solo-day-2026", title: "Solo Day (Orga)", start: "2026-07-02", mode: "online" });
  const solo = s2.raw.prepare("SELECT * FROM events WHERE title='Solo Day 2026'").get();
  s2.raw.prepare("UPDATE events SET owner_id=1,unclaimed=0 WHERE id=?").run(solo.id);
  s2.pages[SZ] = JSON.parse(fx("sessionize_all.json")); await linkSessionize(s2.env, s2.raw.prepare("SELECT * FROM events WHERE id=?").get(solo.id), "abc123", s2.opts);
  assert.deepEqual({ ...s2.raw.prepare("SELECT sessionize_id,handle FROM speaker_ref WHERE name='Jane Doe'").get() }, { sessionize_id: "aaaa-1", handle: "jane-doe" });
  // ... und wirkt dann im Abgleich eines anderen Veranstalters: als Anfrage an sie, nie als bestaetigt
  await ev2({ id: 3, name: "Orga Zwei" }, "/api/event", "POST", { handle: "other-conf", title: "Other Conf 2026", start: "2026-08-01", mode: "onsite", location: "Wien" });
  s2.pages["https://sessionize.com/api/v2/zzz999/view/All"] = JSON.parse(fx("sessionize_all.json"));
  await linkSessionize(s2.env, s2.raw.prepare("SELECT * FROM events WHERE handle='other-conf'").get(), "zzz999", s2.opts);
  const o2 = JSON.parse(s2.raw.prepare("SELECT s.speakers FROM event_sessions s JOIN events e ON e.id=s.event_id WHERE e.handle='other-conf' AND s.sessionize_id='101'").get().speakers);
  assert.deepEqual(o2.map((x) => [x.n, x.h || "", x.s]), [["Jane Doe", "jane-doe", "invited"], ["Max Muster", "", "confirmed"]]);
});
test("Eigentum (317-08): was Veranstalter oder Admin bearbeitet haben, ueberschreibt kein Import; importiertes Ende bleibt im Formular speicherbar", async () => {
  const { raw, env, pages, opts } = await setup(), ev = via(handleEvents, env), imp = via(handleEventImport, env);
  const orga = user(raw, 1, "Orga", "orga-p"), admin = { ...user(raw, 3, "Admin", "admin-p"), admin: true };
  cdPages(pages, fx("communitydays_list.html")); await runCommunityDays(env, { ...opts, today: "2026-05-01" });
  const row = () => raw.prepare("SELECT * FROM events WHERE title LIKE 'Hamburg%' AND merged_into=0").get(), first = row();
  assert.equal(first.start, "2026-05-16T09:00"); assert.equal(first.end, "");   // "2026-05-16" als Ende eines Events mit Uhrzeit sagt nichts aus und wuerde im Formular als "Ende vor Beginn" scheitern
  assert.equal(normEnd("2026-05-16T09:00", "2026-05-17"), "2026-05-17"); assert.equal(normEnd("2026-05-16T09:00", "2026-05-16T17:00"), "2026-05-16T17:00"); assert.equal(normEnd("2026-05-16", "2026-05-15"), "");
  await imp(orga, `/api/event/${first.handle}/claim`, "POST", {}); await imp(admin, "/api/admin/events/claim", "POST", { event_id: first.id, user_id: 1, ok: true });
  const form = (o) => ({ handle: first.handle, title: first.title, start: first.start, end: first.end, mode: first.mode, location: first.location, country: first.country, url: first.url, summary: first.summary, about: first.about, ...o });
  assert.equal((await ev(orga, "/api/event", "POST", form({})))[0], 200);   // unveraendert speichern geht
  assert.equal((await ev(orga, "/api/event", "POST", form({ end: "2026-05-16" })))[0], 200);   // reines Datum am selben Tag ist kein "Ende vor Beginn"
  assert.equal((await ev(orga, "/api/event", "POST", form({ end: "2026-05-15" })))[0], 400);
  assert.equal((await ev(orga, "/api/event", "POST", form({ summary: "Findet nur online statt.", about: "Neuer Text vom Veranstalter.", mode: "online", location: "", end: "" })))[0], 200);
  for (const day of ["2026-05-02", "2026-05-03"]) await runCommunityDays(env, { ...opts, today: day });
  const kept = row(); assert.deepEqual([kept.summary, kept.about, kept.mode, kept.location, kept.end, kept.title, kept.owner_id], ["Findet nur online statt.", "Neuer Text vom Veranstalter.", "online", "", "", first.title, 1]);
  // Admin korrigiert ein herrenloses Import-Event: auch das bleibt (edited_at)
  const az = raw.prepare("SELECT * FROM events WHERE title LIKE 'Azure%'").get();
  assert.equal((await ev(admin, "/api/event", "POST", { handle: az.handle, title: "Azure Online Day", start: az.start, mode: "online", summary: "Kurz." }))[0], 200);
  await runCommunityDays(env, { ...opts, today: "2026-05-04" });
  const az2 = raw.prepare("SELECT * FROM events WHERE id=?").get(az.id); assert.deepEqual([az2.title, az2.summary, az2.about, az2.unclaimed], ["Azure Online Day", "Kurz.", "", 1]); assert.ok(az2.edited_at > 0);
  // unbearbeitete herrenlose Import-Events duerfen dagegen aufgefrischt werden (laengerer Text der Quelle)
  const s2 = await setup(); cdPages(s2.pages, ldList([{ name: "Fabric Day Bonn", startDate: "2027-03-08", url: "https://communitydays.org/events/fabric-bonn", description: "Microsoft Fabric", location: { "@type": "Place", address: { addressLocality: "Bonn" } } }]));
  await runCommunityDays(s2.env, { ...s2.opts, today: "2027-01-01" });
  cdPages(s2.pages, ldList([{ name: "Fabric Day Bonn", startDate: "2027-03-08", url: "https://communitydays.org/events/fabric-bonn", description: "Microsoft Fabric day with workshops", location: { "@type": "Place", address: { addressLocality: "Bonn" } } }])); s2.raw.exec("DELETE FROM import_cache");
  await runCommunityDays(s2.env, { ...s2.opts, today: "2027-01-02" });
  assert.equal(s2.raw.prepare("SELECT summary FROM events").get().summary, "Microsoft Fabric day with workshops");
});
test("Konten (317-09): Zusammenfuehren nimmt Beanspruchung und Speaker-Identitaet mit; Loeschen entfernt, was der Import ueber das Konto gespeichert hat", async () => {
  const { raw, env, pages, opts } = await setup(), db = env.DB, imp = via(handleEventImport, env);
  const s = user(raw, 2, "Jane Doe", "jane-s"), t = user(raw, 3, "Jane D.", "jane-t"), admin = { ...user(raw, 9, "Admin", "admin-p"), admin: true };
  raw.prepare("INSERT INTO events(id,handle,owner_id,title,start,mode,created,updated,unclaimed,source) VALUES(5,'herrenlos',0,'Herrenlos','2026-09-01','online',1,1,1,'communitydays')").run();
  assert.equal((await imp(s, "/api/event/herrenlos/claim", "POST", {}))[1].status, "pending");
  pages["https://sessionize.com/robots.txt"] = ""; pages["https://sessionize.com/jane-doe"] = profilePage("Jane Doe", [{ slug: "solo-day", title: "Solo Day 2026", date: "2026-07-01", place: "Bonn, Germany", sessions: [{ id: 7, title: "My only talk" }, { id: 8, title: "Shared talk" }] }], '<a class="s-link" href="https://site.test/community/u/jane-s/">M365.FM</a>');
  const p1 = await previewProfile(env, s, "https://sessionize.com/jane-doe", similarName, opts); await confirmProfile(env, s, p1.token, ["0.0", "0.1"], opts);
  await previewProfile(env, s, "https://sessionize.com/jane-doe", similarName, opts);   // offene Vorschau (Name, Events, Sessions)
  raw.prepare("INSERT INTO merge_log(kind,from_id,into_id,by_user,created) VALUES('speaker',98,99,2,1)").run();
  assert.equal(raw.prepare("SELECT handle FROM speaker_ref").get().handle, "jane-s"); assert.equal(raw.prepare("SELECT COUNT(*) n FROM import_preview WHERE user_id=2").get().n, 1);
  // S geht in T auf
  await db.batch(await mergeStatements(db, 2, 3)); raw.prepare("UPDATE users SET banned=2,merged_into=3 WHERE id=2").run();
  assert.deepEqual(raw.prepare("SELECT event_id,user_id,status FROM event_claims").all().map((r) => ({ ...r })), [{ event_id: 5, user_id: 3, status: "pending" }]);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM import_preview").get().n, 0);
  assert.equal(raw.prepare("SELECT handle FROM speaker_ref").get().handle, "jane-t");   // wie die Speaker-Eintraege der Sessions
  assert.ok(raw.prepare("SELECT speakers FROM event_sessions").all().every((r) => r.speakers.includes('"h":"jane-t"')));
  assert.equal(raw.prepare("SELECT by_user FROM merge_log WHERE kind='speaker'").get().by_user, 3);
  assert.equal((await imp(admin, "/api/admin/events/claim", "POST", { event_id: 5, user_id: 3, ok: true }))[0], 200);
  assert.equal(raw.prepare("SELECT owner_id FROM events WHERE id=5").get().owner_id, 3);   // das Event gehoert dem lebenden Konto
  // eine zweite Speakerin steht mit in "Shared talk"
  const shared = raw.prepare("SELECT * FROM event_sessions WHERE title='Shared talk'").get();
  raw.prepare("UPDATE event_sessions SET speakers=? WHERE id=?").run(JSON.stringify([...JSON.parse(shared.speakers), { n: "Co Speaker", s: "confirmed" }]), shared.id);
  await imp(t, "/api/event/herrenlos/claim", "POST", {}); await previewProfile(env, { id: 3, name: "Jane Doe" }, "https://sessionize.com/jane-doe", similarName, opts).catch(() => null);
  raw.prepare("INSERT INTO event_claims(event_id,user_id,status,created) VALUES(77,3,'pending',1)").run(); raw.prepare("INSERT OR REPLACE INTO import_preview(token,user_id,data,created) VALUES('tok',3,'{}',1)").run();
  // T loescht das Konto
  await deleteUserEvents(db, 3);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM event_claims WHERE user_id=3").get().n, 0); assert.equal(raw.prepare("SELECT COUNT(*) n FROM import_preview WHERE user_id=3").get().n, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM speaker_ref WHERE handle<>''").get().n, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM event_sessions WHERE title='My only talk'").get().n, 0);   // nur ihr Import trug die Session
  assert.deepEqual(JSON.parse(raw.prepare("SELECT speakers FROM event_sessions WHERE title='Shared talk'").get().speakers).map((x) => x.n), ["Co Speaker"]);   // ihr Eintrag ist weg, die Session der anderen bleibt
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM session_source WHERE kind='sessionize_profile'").get().n, 0);   // die Quellen-Kennung enthielt ihren Sessionize-Namen
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM events WHERE id=5").get().n, 0); assert.equal(raw.prepare("SELECT COUNT(*) n FROM merge_log WHERE by_user=3").get().n, 0);
  assert.ok(!/jane/i.test(JSON.stringify(raw.prepare("SELECT * FROM event_tombstone").all())));   // Loeschmarken ohne Personenbezug
});
test("Datensparsamkeit (317-10): der Abgleich speichert von Speakern nur Name und Kennung und kopiert keine Fotos", async () => {
  const { raw, env, pages, puts, opts } = await setup(), ev = via(handleEvents, env);
  const orga = user(raw, 9, "Orga", "orga-p");
  await ev(orga, "/api/event", "POST", { handle: "hh-copilot", title: "Hamburg Copilot Day 2026", start: "2026-05-16", mode: "onsite", location: "Hamburg" });
  pages[SZ] = JSON.parse(fx("sessionize_all.json")); await linkSessionize(env, raw.prepare("SELECT * FROM events").get(), "abc123", opts);
  await runEventImport(env, { ...opts, today: "2026-05-01" });
  const dump = JSON.stringify(["speaker_ref", "event_sessions", "session_source", "event_source", "events", "import_preview"].map((t) => raw.prepare(`SELECT * FROM ${t}`).all()));
  assert.ok(!/Principal Architect|Jane builds things|image\/abcd|linkedin|twitter|maxmuster\.example/i.test(dump), dump.slice(0, 400));
  assert.deepEqual(puts, []);   // nichts in den Bucket kopiert
  assert.deepEqual(raw.prepare("SELECT name,sessionize_id FROM speaker_ref ORDER BY id").all().map((r) => [r.name, r.sessionize_id]), [["Jane Doe", "aaaa-1"], ["Max Muster", "bbbb-2"]]);
  const src = ["sessionize.js", "eventimport.js", "eventmerge.js"].map((f) => readFileSync(new URL("../src/" + f, import.meta.url), "utf8")).join("\n");
  assert.ok(!/PAGES\.put|copySpeakerPhotos|photo_src/.test(src));
});
test("Grosse Sessionize-Antworten (317-11): nie gekuerzt zwischengespeichert; Verknuepfen spielt die gepruefte Antwort ein; Fehler des Abgleichs kommt als Fehler zurueck", async () => {
  const { raw, env, pages, calls, opts } = await setup(), ev = via(handleEvents, env), imp = via(handleEventImport, env);
  const orga = user(raw, 9, "Orga", "orga-p");
  await ev(orga, "/api/event", "POST", { handle: "big-conf", title: "Big Conf 2026", start: "2026-05-16", mode: "onsite", location: "Hamburg" });
  const big = feed(80, 60, (s) => ({ ...s, description: "Lorem ipsum dolor sit amet. ".repeat(250) })); assert.ok(JSON.stringify(big).length > CACHE_MAX);
  pages[SZ] = big;
  const r = await imp(orga, "/api/event/big-conf/sessionize", "POST", { api_id: "abc123" });
  assert.equal(r[0], 200, JSON.stringify(r[1])); assert.equal(r[1].sync.created, 80); assert.equal(raw.prepare("SELECT sessionize_state FROM events").get().sessionize_state, "ok");
  assert.equal(calls.filter((c) => c.url === SZ).length, 1);   // kein zweiter Abruf fuer den ersten Abgleich
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM import_cache WHERE url=?").get(SZ).n, 0); assert.equal(raw.prepare("SELECT COUNT(*) n FROM import_cache WHERE length(body)>?").get(CACHE_MAX).n, 0);
  const again = await imp(orga, "/api/event/big-conf/sessionize/sync", "POST", {}); assert.equal(again[0], 200); assert.equal(again[1].unchanged, 80);   // sofortiger Abgleich liest frisch statt einer kaputten Kopie
  // ein alter (kleiner) Cache-Stand wird nicht weiter ausgeliefert, wenn die neue Antwort zu gross fuer den Cache ist
  const s2 = await setup(); s2.pages["https://x.example/robots.txt"] = ""; s2.pages["https://x.example/a"] = "klein";
  assert.equal((await politeGet(s2.env, "https://x.example/a", { ...s2.opts, ttl: 0 })).body, "klein"); s2.pages["https://x.example/a"] = "g".repeat(CACHE_MAX + 5);
  assert.equal((await politeGet(s2.env, "https://x.example/a", { ...s2.opts, ttl: 0 })).body.length, CACHE_MAX + 5); assert.equal(s2.raw.prepare("SELECT COUNT(*) n FROM import_cache WHERE url='https://x.example/a'").get().n, 0);
  // Abgleich scheitert (kaputte Antwort): die Route meldet den Fehler, nicht "ok"
  const s3 = await setup(), ev3 = via(handleEvents, s3.env), imp3 = via(handleEventImport, s3.env), o3 = user(s3.raw, 9, "Orga", "orga-p");
  await ev3(o3, "/api/event", "POST", { handle: "big-conf", title: "Big Conf 2026", start: "2026-05-16", mode: "online" });
  s3.pages[SZ] = "{\"sessions\": [";
  const bad = await imp3(o3, "/api/event/big-conf/sessionize", "POST", { api_id: "abc123" }); assert.equal(bad[0], 400); assert.equal(bad[1].error, "bad_json");
});
test("Adressen (317-13): erzeugte Handles bestehen nur aus a-z, 0-9 und Bindestrich und sind ueber die Routen erreichbar", async () => {
  assert.equal(slugHandle("Community Day Gießen 2027"), "community-day-giessen-2027"); assert.equal(slugHandle("Azure Day Łódź"), "azure-day-lodz"); assert.equal(slugHandle("Azure Dag København"), "azure-dag-kobenhavn");
  assert.equal(slugHandle("São Paulo & Zürich C#"), "sao-paulo-and-zurich-c"); assert.equal(slugHandle("東京"), ""); assert.equal(slugHandle("Ærø Træf"), "aero-traef");
  const { raw, env } = await setup(), db = env.DB, imp = via(handleEventImport, env), u = user(raw, 1, "Orga", "orga-p");
  const titles = ["Community Day Gießen 2027", "Azure Day Łódź", "Global Azure 東京", "Power Platform Tag Москва", "東京 サミット", "Azure Dag København", "Ein sehr langer Titel für eine Veranstaltung der Microsoft Community in Süddeutschland 2027"];
  for (const [i, title] of titles.entries()) { const r = await upsertEvent(db, { title, start: `2027-04-${10 + i}`, city: "Ort", sources: [] }); assert.equal(r.action, "created"); assert.match(r.handle, HANDLE, title); }
  assert.equal(new Set(raw.prepare("SELECT handle FROM events").all().map((r) => r.handle)).size, titles.length);
  assert.match(raw.prepare("SELECT handle FROM events WHERE title='東京 サミット'").get().handle, /^event-[0-9a-f]{8}$/);
  const h = raw.prepare("SELECT handle FROM events WHERE title LIKE '%Gießen%'").get().handle;
  assert.equal((await imp(u, `/api/event/${h}/claim`, "POST", {}))[0], 200);   // die Route findet das Event
  // gleicher Titel in einer weiteren Ausgabe: eigene, ebenfalls gueltige Adresse
  const y = await upsertEvent(db, { title: "Community Day Gießen 2027", start: "2028-04-10", city: "Ort", sources: [] }); assert.equal(y.action, "created"); assert.match(y.handle, HANDLE); assert.notEqual(y.handle, h);
});
test("Loeschen (317-15): ein geloeschtes Import-Event kommt nicht zurueck; es bleiben keine verwaisten Zeilen; die naechste Ausgabe wird wieder importiert", async () => {
  const { raw, env, pages, opts } = await setup(), ev = via(handleEvents, env), imp = via(handleEventImport, env);
  const admin = { ...user(raw, 3, "Admin", "admin-p"), admin: true }, u = user(raw, 1, "Orga", "orga-p");
  cdPages(pages, fx("communitydays_list.html")); await runCommunityDays(env, { ...opts, today: "2026-05-01" });
  const hh = raw.prepare("SELECT * FROM events WHERE title LIKE 'Hamburg%'").get();
  await upsertSession(env.DB, hh.id, { title: "Keynote", speakers: [{ n: "Anna A" }] }, { kind: "sessionize_profile", ref: "anna:1" }, { trusted: true });
  await imp(u, `/api/event/${hh.handle}/claim`, "POST", {});
  assert.equal((await ev(u, `/api/event/${hh.handle}`, "DELETE"))[0], 403);
  assert.equal((await ev(admin, `/api/event/${hh.handle}`, "DELETE"))[0], 200);
  for (const t of ["event_source", "event_claims", "event_sessions", "speaker_invites"]) assert.equal(raw.prepare(`SELECT COUNT(*) n FROM ${t} WHERE event_id=?`).get(hh.id).n, 0, t);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM session_source").get().n, 0);
  for (const day of ["2026-05-02", "2026-05-03"]) { const r = await runCommunityDays(env, { ...opts, today: day }); assert.equal(r.created, 0); assert.equal(r.skipped, 1); }
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM events WHERE title LIKE 'Hamburg%'").get().n, 0);
  // auch ueber einen anderen Weg (Speaker-Profil derselben Veranstaltung am selben Tag) entsteht es nicht neu
  const viaName = await upsertEvent(env.DB, { title: "Hamburg Copilot Day 2026", start: "2026-05-16", city: "Hamburg", source: "sessionize", sources: [{ kind: "sessionize_event", ref: "hamburg-copilot-day", url: "https://sessionize.com/hamburg-copilot-day" }] });
  assert.deepEqual(viaName, { action: "skipped", reason: "deleted" });
  // die Ausgabe des naechsten Jahres unter derselben Adresse ist ein neues Event
  cdPages(pages, fx("communitydays_list.html").replace("Hamburg Copilot Day 2026", "Hamburg Copilot Day 2027").replaceAll("2026-05-16", "2027-05-15")); raw.exec("DELETE FROM import_cache");
  assert.equal((await runCommunityDays(env, { ...opts, today: "2026-05-04" })).created, 1);
  assert.equal(raw.prepare("SELECT start FROM events WHERE title LIKE 'Hamburg%'").get().start, "2027-05-15T09:00");
  // ein von Hand angelegtes Event hinterlaesst keine Loeschmarke
  await ev(u, "/api/event", "POST", { handle: "mein-treffen", title: "Mein Treffen", start: "2026-10-01", mode: "online" }); const n0 = raw.prepare("SELECT COUNT(*) n FROM event_tombstone").get().n;
  assert.equal((await ev(u, "/api/event/mein-treffen", "DELETE"))[0], 200); assert.equal(raw.prepare("SELECT COUNT(*) n FROM event_tombstone").get().n, n0);
});
test("Unbekanntes bleibt unbekannt (317-16): Import-Events sind weder 'kostenlos' noch in Berliner Zeit, bis ein Veranstalter es festlegt", async () => {
  const { raw, env, pages, opts } = await setup(), ev = via(handleEvents, env), admin = { ...user(raw, 3, "Admin", "admin-p"), admin: true };
  cdPages(pages, ldList([{ name: "Azure Summit Seattle", startDate: "2026-11-05T09:00", url: "https://communitydays.org/events/seattle", description: "Azure", location: { "@type": "Place", address: { addressLocality: "Seattle" } } },
    { name: "Power Platform Free Day", startDate: "2026-11-06", url: "https://communitydays.org/events/free", isAccessibleForFree: true, description: "Power Platform", location: { "@type": "Place", address: { addressLocality: "Bonn" } } }]));
  await runCommunityDays(env, { ...opts, today: "2026-10-01" });
  const sea = raw.prepare("SELECT * FROM events WHERE title LIKE '%Seattle'").get();
  assert.deepEqual([sea.free, sea.tz, sea.unclaimed, sea.public], [-1, "", 1, 1]); assert.equal(raw.prepare("SELECT free FROM events WHERE title LIKE '%Free Day'").get().free, 1);   // nur was die Quelle sagt
  const exp = JSON.parse(await (await handleEvents(env, new Request("https://x/api/events/export"), new URL("https://x/api/events/export"), "/api/events/export", null, J)).text()).events;
  const x = exp.find((e) => e.handle === sea.handle); assert.equal(x.free, null); assert.equal(x.tz, ""); assert.equal(x.unclaimed, true); assert.equal(exp.find((e) => /Free Day/.test(e.title)).free, true);
  // keine Session-Erinnerung zur falschen Zeit, solange die Zeitzone unbekannt ist
  raw.prepare("INSERT INTO event_sessions(id,event_id,title,start,status,proposer_id,created) VALUES(42,?,'Keynote','2026-11-05T13:00','live',0,1)").run(sea.id);
  raw.exec("INSERT INTO push_subs(endpoint,p256dh,auth,lang,created,digest) VALUES('https://push.example/r','p','a','en',1,0); INSERT INTO push_topics(endpoint,kind,topic_id,lang,timezone,created) VALUES('https://push.example/r','session','42','en','UTC',1);");
  const at = Math.floor(new Date("2026-11-05T11:45:00Z").getTime() / 1000);
  await queueSessionReminders({ DB: env.DB, SITE: "https://www.m365.fm" }, at); assert.equal(raw.prepare("SELECT COUNT(*) n FROM topic_queue").get().n, 0);
  // der Veranstalter (hier ein Admin) legt Zeitzone und Preis fest: ab dann gelten sie; ein Speichern ohne Preisangabe (MCP) macht aus "unbekannt" nicht "kostenlos"
  assert.equal((await ev(admin, "/api/event", "POST", { handle: sea.handle, title: sea.title, start: sea.start, mode: "onsite", location: "Seattle" }))[0], 200);
  assert.equal(raw.prepare("SELECT free FROM events WHERE id=?").get(sea.id).free, -1);
  assert.equal((await ev(admin, "/api/event", "POST", { handle: sea.handle, title: sea.title, start: sea.start, mode: "onsite", location: "Seattle", tz: "America/Los_Angeles", free: false }))[0], 200);
  assert.deepEqual({ ...raw.prepare("SELECT free,tz FROM events WHERE id=?").get(sea.id) }, { free: 0, tz: "America/Los_Angeles" });
  await queueSessionReminders({ DB: env.DB, SITE: "https://www.m365.fm" }, Math.floor(new Date("2026-11-05T20:45:00Z").getTime() / 1000)); assert.equal(raw.prepare("SELECT COUNT(*) n FROM topic_queue").get().n, 1);
});
test("Abhaengige Tabellen (317-17): jede Tabelle mit event_id steht in EVENT_TABLES und wandert beim Zusammenfuehren mit, zurueck und wird mit geloescht", async () => {
  const { raw, env } = await setup(), db = env.DB;
  const withEventId = raw.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map((t) => t.name).filter((t) => raw.prepare(`PRAGMA table_info(${t})`).all().some((c) => c.name === "event_id"));
  assert.deepEqual(withEventId.filter((t) => t !== "event_source").sort(), EVENT_TABLES.map((x) => x.table).sort());   // event_source wird gesondert gefuehrt (Quellen werden kopiert, nicht verschoben)
  const a = await upsertEvent(db, { title: "Alpha Con", start: "2026-01-10", city: "Berlin", sources: [{ kind: "sessionize_event", ref: "alpha" }] }), b = await upsertEvent(db, { title: "Alpha Conference", start: "2026-01-10", city: "Berlin", sources: [{ kind: "sessionize_event", ref: "alpha-conf" }] });
  raw.exec(`INSERT INTO event_attendees(event_id,user_id,status,created) VALUES(${b.id},7,'going',1),(${a.id},7,'going',1),(${b.id},8,'going',1);
    INSERT INTO event_roles(event_id,user_id,role,added_by,created) VALUES(${b.id},8,'helfer',1,1); INSERT INTO event_settings(event_id) VALUES(${b.id});`);
  const m = await mergeEvents(db, b.id, a.id, 1); assert.equal(m.ok, true);
  assert.deepEqual(raw.prepare("SELECT user_id FROM event_attendees WHERE event_id=? ORDER BY user_id").all(a.id).map((r) => r.user_id), [7, 8]);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM event_roles WHERE event_id=?").get(a.id).n, 1); assert.equal(raw.prepare("SELECT COUNT(*) n FROM event_settings WHERE event_id=?").get(a.id).n, 1);
  assert.deepEqual({ ...raw.prepare("SELECT merged_into,public FROM events WHERE id=?").get(b.id) }, { merged_into: a.id, public: 0 });   // so erkennt man zusammengefuehrte Events
  await unmerge(db, m.log, 1);
  assert.deepEqual(raw.prepare("SELECT user_id FROM event_attendees WHERE event_id=? ORDER BY user_id").all(b.id).map((r) => r.user_id), [7, 8]); assert.equal(raw.prepare("SELECT COUNT(*) n FROM event_roles WHERE event_id=?").get(b.id).n, 1); assert.equal(raw.prepare("SELECT COUNT(*) n FROM event_settings WHERE event_id=?").get(b.id).n, 1);
  assert.deepEqual({ ...raw.prepare("SELECT merged_into,public FROM events WHERE id=?").get(b.id) }, { merged_into: 0, public: 1 });
});

// ---------------------------------------------------------------- zweite Runde (Nachpruefung #317)
const cdEvent = (o = {}) => ({ name: "Azure Day Bonn", startDate: "2026-06-16T09:00", url: "https://communitydays.org/events/bonn", description: "Azure day in Bonn with a long text about everything that happens there.", location: { address: { addressLocality: "Bonn" } }, ...o });
const cdRun = async (s, list, today) => { cdPages(s.pages, ldList(list)); s.raw.exec("DELETE FROM import_cache"); return runCommunityDays(s.env, { ...s.opts, today, force: true }); };
const rpcFor = (env, raw, uid) => { raw.prepare("INSERT INTO api_tokens(hash,user_id,created) VALUES(?,?,1)").run(createHash("sha256").update("m365_t" + uid).digest("hex"), uid);
  return async (name, args) => JSON.parse((await (await handleMcp(env, new Request("https://x/mcp", { method: "POST", headers: { "content-type": "application/json", authorization: "Bearer m365_t" + uid }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }) }), async (id) => ({ id }), null)).json()).result.content[0].text); };

test("Derselbe Datensatz wird an seiner Geschichte wiedererkannt: vom Veranstalter umbenannt, vom Admin zusammengefuehrt, in der Quelle verlegt – nie eine neue Dublette", async () => {
  // (1) Veranstalter uebernimmt das Import-Event und benennt es so um, dass weniger als die Haelfte der Woerter bleibt
  const a = await setup(), ev = via(handleEvents, a.env), imp = via(handleEventImport, a.env), orga = user(a.raw, 1, "Olga Org", "olga"), admin = { ...user(a.raw, 9, "Admin", "admin-p"), admin: true };
  const hh = cdEvent({ name: "Hamburg Copilot Day 2026", startDate: "2026-05-16T09:00", url: "https://communitydays.org/events/hamburg-copilot-day", location: { address: { addressLocality: "Hamburg" } } });
  await cdRun(a, [hh], "2026-01-01");
  await imp(orga, "/api/event/hamburg-copilot-day-2026/claim", "POST", {}); await imp(admin, "/api/admin/events/claim", "POST", { event_id: 1, user_id: 1, ok: true });
  assert.equal((await ev(orga, "/api/event", "POST", { handle: "hamburg-copilot-day-2026", title: "Hamburger Copilot-Tag 2026", start: "2026-05-16T09:00", mode: "onsite", location: "Hamburg" }))[0], 200);
  for (const day of ["2026-01-02", "2026-01-03", "2026-01-04"]) { const r = await cdRun(a, [hh], day); assert.deepEqual([r.created, r.queued, r.merged], [0, 0, 1], day); }
  assert.deepEqual(a.raw.prepare("SELECT id,title,owner_id FROM events").all().map((r) => [r.id, r.title, r.owner_id]), [[1, "Hamburger Copilot-Tag 2026", 1]]);
  assert.equal(a.raw.prepare("SELECT COUNT(*) n FROM dedupe_queue").get().n, 0);
  // verlegt die Quelle das uebernommene Event, bleibt es beim Stand des Veranstalters – und bei EINEM Event
  const moved = await cdRun(a, [{ ...hh, startDate: "2026-05-30T09:00" }], "2026-01-05"); assert.deepEqual([moved.created, moved.queued, moved.merged, moved.updated], [0, 0, 1, 0]);
  assert.deepEqual(a.raw.prepare("SELECT title,start FROM events").all().map((r) => [r.title, r.start]), [["Hamburger Copilot-Tag 2026", "2026-05-16T09:00"]]);
  assert.equal(a.raw.prepare("SELECT day FROM event_source WHERE kind='communitydays'").get().day, "2026-05-30");   // gemerkt ist der Stand der Quelle

  // (2) Mitglieds-Event und Datensatz teilen die Adresse, heissen aber verschieden: Warteschlange -> Admin fuehrt zusammen -> die Entscheidung haelt
  const b = await setup(), evB = via(handleEvents, b.env), impB = via(handleEventImport, b.env), m = user(b.raw, 1, "Olga Org", "olga"), adminB = { ...user(b.raw, 9, "Admin", "admin-p"), admin: true };
  const url = "https://communitydays.org/events/azure-evening-cologne", rec = cdEvent({ name: "Azure Evening Cologne", startDate: "2026-05-16T18:00", url, location: { address: { addressLocality: "Cologne" } } });
  await evB(m, "/api/event", "POST", { handle: "koelner-azure-abend", title: "Kölner Azure-Abend", start: "2026-05-16T18:00", mode: "onsite", location: "Köln", url });
  assert.equal((await cdRun(b, [rec], "2026-01-01")).queued, 1);
  const q = (await impB(adminB, "/api/admin/events/dupes"))[1].items; assert.equal(q.length, 1); assert.equal(q[0].reason, "url_name_differs");
  assert.equal((await impB(adminB, "/api/admin/events/dupes", "POST", { id: q[0].id, action: "merge" }))[0], 200);
  for (const day of ["2026-01-02", "2026-01-03"]) { const r = await cdRun(b, [rec], day); assert.deepEqual([r.created, r.queued, r.merged], [0, 0, 1], day); }
  assert.equal(b.raw.prepare("SELECT COUNT(*) n FROM events").get().n, 2); assert.deepEqual(visible(b.raw).map((e) => [e.title, e.owner_id]), [["Kölner Azure-Abend", 1]]);
  assert.equal(b.raw.prepare("SELECT COUNT(*) n FROM dedupe_queue WHERE status='open'").get().n, 0);
  // der Stand des Datensatzes steht nur an seiner eigenen (ausgeblendeten) Zeile; der Verweis am Mitglieds-Event traegt keinen
  assert.deepEqual(b.raw.prepare("SELECT event_id,name_key,day,hash<>'' h FROM event_source WHERE kind='communitydays' ORDER BY event_id").all().map((r) => [r.event_id, r.name_key, r.day, r.h]), [[1, "", "", 0], [2, "azure evening cologne", "2026-05-16", 1]]);
  // nimmt der Admin die Zusammenfuehrung zurueck, steht der Datensatz wieder fuer sich und bleibt es
  assert.equal((await impB(adminB, "/api/admin/events/unmerge", "POST", { log: 1 }))[0], 200);
  const again = await cdRun(b, [rec], "2026-01-04"); assert.deepEqual([again.created, again.queued, again.merged], [0, 0, 1]);
  assert.deepEqual(visible(b.raw).map((e) => e.title), ["Kölner Azure-Abend", "Azure Evening Cologne"]);

  // (3) die Quelle verlegt ein Event um zwei Wochen: dasselbe Event bekommt den neuen Termin, es entsteht kein zweites
  const c = await setup(); await cdRun(c, [cdEvent()], "2026-01-01");
  for (const day of ["2026-01-02", "2026-01-03"]) { const r = await cdRun(c, [cdEvent({ startDate: "2026-06-30T09:00" })], day); assert.deepEqual([r.created, r.queued, r.merged], [0, 0, 1], day); }
  assert.deepEqual(c.raw.prepare("SELECT id,start FROM events").all().map((r) => [r.id, r.start]), [[1, "2026-06-30T09:00"]]); assert.equal(c.raw.prepare("SELECT COUNT(*) n FROM dedupe_queue").get().n, 0);
  // neuer Name am selben Tag unter derselben (nur einmal vergebenen) Adresse: ebenfalls derselbe Datensatz
  const ren = await cdRun(c, [cdEvent({ name: "Rheinland Cloud Summit", startDate: "2026-06-30T09:00" })], "2026-01-04"); assert.deepEqual([ren.created, ren.queued, ren.updated], [0, 0, 1]);
  assert.deepEqual(c.raw.prepare("SELECT title,handle,name_key FROM events").all().map((r) => [r.title, r.handle, r.name_key]), [["Rheinland Cloud Summit", "azure-day-bonn", "rheinland cloud summit"]]);   // die Adresse der Seite bleibt
  // die Ausgabe des naechsten Jahres (der alte Termin ist vorbei) ist dagegen ein neues Event
  const next = await cdRun(c, [cdEvent({ name: "Rheinland Cloud Summit", startDate: "2027-06-29T09:00" })], "2026-07-15"); assert.equal(next.created + next.queued, 1);
  assert.equal(visible(c.raw).length, 2);

  // (4) ohne Wissen ueber die ganze Quelle (direkter Aufruf): neuer Termin -> Warteschlange; nach der Entscheidung des Admins kommt der Datensatz nicht wieder
  const d = await setup(), impD = via(handleEventImport, d.env), adminD = { ...user(d.raw, 9, "Admin", "admin-p"), admin: true };
  const cand = (start) => ({ title: "Azure Day Bonn", start, city: "Bonn", url: "https://communitydays.org/events/bonn", source: "communitydays", sources: [{ kind: "communitydays", ref: "communitydays.org/events/bonn", url: "https://communitydays.org/events/bonn" }] });
  assert.equal((await upsertEvent(d.env.DB, cand("2026-06-16T09:00"))).action, "created");
  const late = await upsertEvent(d.env.DB, cand("2026-06-30T09:00")); assert.deepEqual([late.action, late.reason], ["queued", "source_date_differs"]);
  const qd = (await impD(adminD, "/api/admin/events/dupes"))[1].items; await impD(adminD, "/api/admin/events/dupes", "POST", { id: qd[0].id, action: "merge" });
  for (let i = 0; i < 3; i++) { const r = await upsertEvent(d.env.DB, cand("2026-06-30T09:00")); assert.deepEqual([r.action, r.id], ["merged", 1]); }
  assert.equal(d.raw.prepare("SELECT COUNT(*) n FROM events").get().n, 2); assert.equal(visible(d.raw).length, 1); assert.equal(d.raw.prepare("SELECT COUNT(*) n FROM dedupe_queue WHERE status='open'").get().n, 0);
  // "getrennt lassen" haelt genauso
  const e = await setup(), impE = via(handleEventImport, e.env), adminE = { ...user(e.raw, 9, "Admin", "admin-p"), admin: true };
  await upsertEvent(e.env.DB, cand("2026-06-16T09:00")); await upsertEvent(e.env.DB, cand("2026-06-30T09:00"));
  await impE(adminE, "/api/admin/events/dupes", "POST", { id: (await impE(adminE, "/api/admin/events/dupes"))[1].items[0].id, action: "separate" });
  for (const [start, id] of [["2026-06-30T09:00", 2], ["2026-06-16T09:00", 1], ["2026-06-30T09:00", 2]]) { const r = await upsertEvent(e.env.DB, cand(start)); assert.deepEqual([r.action, r.id], ["merged", id]); }
  assert.equal(e.raw.prepare("SELECT COUNT(*) n FROM events").get().n, 2); assert.equal(e.raw.prepare("SELECT COUNT(*) n FROM dedupe_queue WHERE status='open'").get().n, 0);
});
test("Reihe unter einer gemeinsamen Adresse: zwei gleichzeitig gelistete Termine bleiben zwei Events und ueberschreiben sich nicht gegenseitig", async () => {
  const s = await setup(), g = "https://communitydays.org/events/azure-meetup-bonn";
  const list = [cdEvent({ name: "Azure Meetup Bonn #12", startDate: "2026-06-16T18:00", url: g, description: "Azure: Topic A" }), cdEvent({ name: "Azure Meetup Bonn #13", startDate: "2026-06-18T18:00", url: g, description: "Azure: Topic B" })];
  const r1 = await cdRun(s, list, "2026-01-01"); assert.equal(r1.created + r1.queued, 2);
  const snap = () => JSON.stringify(s.raw.prepare("SELECT id,title,start,summary,updated,merged_into FROM events ORDER BY id").all());
  const before = snap(); assert.deepEqual(visible(s.raw).map((e) => [e.title, e.start]), [["Azure Meetup Bonn #12", "2026-06-16T18:00"], ["Azure Meetup Bonn #13", "2026-06-18T18:00"]]);
  for (const day of ["2026-01-02", "2026-01-03"]) { const r = await cdRun(s, list, day); assert.deepEqual([r.created, r.queued, r.merged, r.updated], [0, 0, 2, 0], day); }
  assert.equal(snap(), before);
  // aendert einer der beiden seinen Text, folgt ihm das Event nicht automatisch (welcher Eintrag welcher ist, weiss bei geteilter Adresse nur ein Mensch) – der andere bleibt unberuehrt
  await cdRun(s, [{ ...list[0], description: "Azure: Topic A, now with pizza and a much longer text" }, list[1]], "2026-01-04");
  assert.deepEqual(visible(s.raw).map((e) => e.summary), ["Azure: Topic A, now with pizza and a much longer text", "Azure: Topic B"]);   // laengerer Text wird wie bisher ergaenzt
});
test("Aenderungen der Quelle kommen im ungepflegten Import-Event an (Termin, Ort, Texte); gepflegte Events und andere Quellen bleiben, wie sie sind", async () => {
  const s = await setup(), ev = via(handleEvents, s.env), admin = { ...user(s.raw, 9, "Admin", "admin-p"), admin: true };
  await cdRun(s, [cdEvent(), cdEvent({ name: "Fabric Day Essen", url: "https://communitydays.org/events/essen", startDate: "2026-09-01T09:00", location: { address: { addressLocality: "Essen" } } })], "2026-01-01");
  s.raw.prepare("UPDATE events SET lat=50.7,lng=7.1,geo_at=5,geo_address='Bonn',geo_precision='city' WHERE id=1").run();
  const changed = cdEvent({ startDate: "2026-06-17T10:00", endDate: "2026-06-18", description: "Azure day. Moved by one day!", location: { address: { addressLocality: "Köln", addressCountry: "Germany" } } });
  const essen = cdEvent({ name: "Fabric Day Essen", url: "https://communitydays.org/events/essen", startDate: "2026-09-01T09:00", location: { address: { addressLocality: "Essen" } } });
  const r = await cdRun(s, [changed, essen], "2026-01-02"); assert.deepEqual([r.created, r.queued, r.merged, r.updated], [0, 0, 2, 1]);
  const row = () => s.raw.prepare("SELECT * FROM events WHERE id=1").get(), a = row();
  assert.deepEqual([a.title, a.start, a.end, a.location, a.city, a.country, a.summary, a.about, a.city_key], ["Azure Day Bonn", "2026-06-17T10:00", "2026-06-18", "Köln", "Köln", "Germany", "Azure day. Moved by one day!", "Azure day. Moved by one day!", "koln"]);
  assert.deepEqual([a.lat, a.lng, a.geo_at, a.geo_address], [null, null, 0, ""]);   // neuer Ort: Koordinaten verworfen, der Geocode-Lauf holt sie neu
  assert.equal(s.raw.prepare("SELECT COUNT(*) n FROM events").get().n, 2); assert.equal(s.raw.prepare("SELECT COUNT(*) n FROM dedupe_queue").get().n, 0);
  // unveraenderte Quelle: nichts wird erneut geschrieben
  const u0 = a.updated; assert.equal((await cdRun(s, [changed, essen], "2026-01-03")).updated, 0); assert.equal(row().updated, u0);
  // faellt in der Quelle nur die Ortsangabe weg, ohne dass sie "online" sagt, bleiben Modus und Ort (eine Luecke loescht nichts)
  const gap = await cdRun(s, [{ ...changed, location: undefined, description: "Azure day. Moved by one day! Now with workshops." }, essen], "2026-01-03"); assert.equal(gap.updated, 1);
  assert.deepEqual([row().mode, row().location, row().city, row().summary], ["onsite", "Köln", "Köln", "Azure day. Moved by one day! Now with workshops."]);
  await cdRun(s, [changed, essen], "2026-01-03");
  // ein Datensatz einer ANDEREN Quelle zum selben Event ergaenzt nur (laengerer Text, leere Felder) und wird nie massgeblich
  const other = await upsertEvent(s.env.DB, { title: "Azure Day Bonn", start: "2026-06-17", city: "Köln", url: "https://sessionize.com/azure-day-bonn", source: "sessionize", sources: [{ kind: "sessionize_event", ref: "azure-day-bonn", url: "https://sessionize.com/azure-day-bonn" }] });
  assert.equal(other.reason, "name+day+city"); assert.ok(other.log > 0);
  await upsertEvent(s.env.DB, { title: "Azure Day Bonn", start: "2026-06-17", city: "Köln", summary: "Kurz", url: "https://sessionize.com/azure-day-bonn", source: "sessionize", sources: [{ kind: "sessionize_event", ref: "azure-day-bonn", url: "https://sessionize.com/azure-day-bonn" }] });   // derselbe Sessionize-Datensatz, geaendert
  assert.deepEqual([row().start, row().summary, row().url], ["2026-06-17T10:00", "Azure day. Moved by one day!", "https://communitydays.org/events/bonn"]);
  assert.equal(s.raw.prepare("SELECT summary FROM events WHERE merged_into=1").get().summary, "Kurz");   // seine eigene (ausgeblendete) Zeile haelt den aktuellen Stand, falls die Zusammenfuehrung zurueckgenommen wird
  // wird das Event auf "online" umgestellt, entfaellt der Ort; eine Angabe, die die Quelle nicht mehr macht, loescht dagegen nichts
  await cdRun(s, [cdEvent({ startDate: "2026-06-17T10:00", description: "", eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode", location: { "@type": "VirtualLocation" } }), essen], "2026-01-04");
  assert.deepEqual([row().mode, row().location, row().city, row().summary, row().end], ["online", "", "", "Azure day. Moved by one day!", ""]);
  // als vergangen markiert und dann auf einen kuenftigen Termin verlegt: wieder aktuell
  s.raw.prepare("UPDATE events SET retired=1 WHERE id=2").run();
  await cdRun(s, [essen, cdEvent({ startDate: "2026-06-17T10:00", eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode", location: { "@type": "VirtualLocation" } })].map((x) => (x === essen ? { ...essen, startDate: "2026-09-02T09:00" } : x)), "2026-01-05");
  assert.deepEqual(s.raw.prepare("SELECT start,retired FROM events WHERE id=2").all().map((x) => [x.start, x.retired]), [["2026-09-02T09:00", 0]]);
  // ein Admin korrigiert das Event von Hand: ab jetzt aendert die Quelle nichts mehr
  assert.equal((await ev(admin, "/api/event", "POST", { handle: "fabric-day-essen", title: "Fabric Day Essen", start: "2026-09-03T09:00", mode: "onsite", location: "Essen, Zeche" }))[0], 200);
  await cdRun(s, [{ ...essen, startDate: "2026-09-10T09:00", description: "Completely new text from the source" }], "2026-01-06");
  assert.deepEqual(s.raw.prepare("SELECT start,location,summary FROM events WHERE id=2").all().map((x) => [x.start, x.location, x.summary]), [["2026-09-03T09:00", "Essen, Zeche", ""]]);
});
test("Massgebliche Quelle: ein aus einem Speaker-Profil entstandenes Event folgt der Veranstaltungsliste, sobald sie es fuehrt; Zuruecknehmen nimmt auch das zurueck", async () => {
  const s = await setup(), db = s.env.DB, imp = via(handleEventImport, s.env), admin = { ...user(s.raw, 9, "Admin", "admin-p"), admin: true };
  const prof = (o = {}) => ({ title: "Azure Day Bonn", start: "2026-06-16", city: "Bonn", url: "https://sessionize.com/azure-day-bonn", source: "sessionize", sources: [{ kind: "sessionize_event", ref: "azure-day-bonn", url: "https://sessionize.com/azure-day-bonn" }], ...o });
  assert.deepEqual([(await upsertEvent(db, prof())).action, (await cdRun(s, [cdEvent()], "2026-01-01")).merged], ["created", 1]);   // die Liste fuehrt dasselbe Event (Name, Tag, Stadt): protokolliert vereint
  const row = () => s.raw.prepare("SELECT * FROM events WHERE id=1").get(), log = s.raw.prepare("SELECT id FROM merge_log WHERE kind='event'").get().id;
  assert.deepEqual([row().start, row().source, row().url], ["2026-06-16T09:00", "sessionize", "https://sessionize.com/azure-day-bonn"]);
  // die Liste verlegt das Event und beschreibt es neu: das Event folgt, obwohl es nicht aus ihr entstand
  const r = await cdRun(s, [cdEvent({ startDate: "2026-06-18T10:00", description: "New text from the listing" })], "2026-01-02"); assert.deepEqual([r.created, r.queued, r.merged, r.updated], [0, 0, 1, 1]);
  assert.deepEqual([row().start, row().summary], ["2026-06-18T10:00", "New text from the listing"]);
  // das Speaker-Profil liefert seinen Datensatz geaendert (weiter mit dem alten Tag): es ergaenzt nur noch
  const p2 = await upsertEvent(db, prof({ country: "Germany" })); assert.deepEqual([p2.action, p2.id, p2.changed], ["merged", 1, false]);
  assert.deepEqual([row().start, row().summary, row().country], ["2026-06-18T10:00", "New text from the listing", "Germany"]);
  assert.equal(s.raw.prepare("SELECT COUNT(*) n FROM events").get().n, 2); assert.equal(s.raw.prepare("SELECT COUNT(*) n FROM dedupe_queue").get().n, 0);
  // ein reines Datum nimmt eine bekannte Uhrzeit desselben Tages nicht weg
  const s2 = await setup(); await upsertEvent(s2.env.DB, prof({ start: "2026-06-16T09:00" })); await upsertEvent(s2.env.DB, prof({ start: "2026-06-16", country: "Germany" }));
  assert.deepEqual(s2.raw.prepare("SELECT start,country FROM events").all().map((x) => [x.start, x.country]), [["2026-06-16T09:00", "Germany"]]);
  // Zuruecknehmen: was das Event von der Liste uebernommen hat, geht mit zurueck; beide stehen wieder fuer sich und bleiben getrennt
  assert.equal((await imp(admin, "/api/admin/events/unmerge", "POST", { log }))[0], 200);
  assert.deepEqual(visible(s.raw).map((e) => [e.id, e.start, e.summary, e.source]), [[1, "2026-06-16", "", "sessionize"], [2, "2026-06-18T10:00", "New text from the listing", "communitydays"]]);
  const again = await cdRun(s, [cdEvent({ startDate: "2026-06-19T10:00", description: "New text from the listing" })], "2026-01-03"); assert.deepEqual([again.created, again.queued, again.merged, again.updated], [0, 0, 1, 1]);
  assert.deepEqual(visible(s.raw).map((e) => [e.id, e.start]), [[1, "2026-06-16"], [2, "2026-06-19T10:00"]]);
});
test("Geloescht bleibt geloescht, auch wenn die Quelle das Event danach verlegt", async () => {
  const s = await setup(), ev = via(handleEvents, s.env), admin = { ...user(s.raw, 9, "Admin", "admin-p"), admin: true };
  await cdRun(s, [cdEvent()], "2026-01-01");
  assert.equal((await ev(admin, "/api/event/azure-day-bonn", "DELETE"))[0], 200);
  for (const [start, day] of [["2026-06-16T09:00", "2026-01-02"], ["2026-06-30T09:00", "2026-01-03"], ["2026-06-30T09:00", "2026-01-04"]]) { const r = await cdRun(s, [cdEvent({ startDate: start })], day); assert.deepEqual([r.created, r.queued, r.skipped], [0, 0, 1], day); }
  assert.equal(s.raw.prepare("SELECT COUNT(*) n FROM events").get().n, 0);
  assert.equal((await cdRun(s, [cdEvent({ startDate: "2027-06-15T09:00" })], "2026-07-01")).created, 1);   // die naechste Ausgabe kommt wieder
});
test("Import-Events ohne Veranstalter: keine Anmeldung und kein Session-Vorschlag ueber M365.FM (Route und MCP); nach dem Uebernehmen geht beides", async () => {
  const s = await setup(), ev = via(handleEvents, s.env), imp = via(handleEventImport, s.env);
  const orga = user(s.raw, 1, "Olga Org", "olga"), guest = user(s.raw, 2, "Gast Member", "gast"), admin = { ...user(s.raw, 9, "Admin", "admin-p"), admin: true };
  await cdRun(s, [cdEvent()], "2026-01-01");
  assert.deepEqual(await ev(guest, "/api/event/azure-day-bonn/register", "POST", { visible: false }), [409, { error: "unclaimed" }]);
  assert.deepEqual(await ev(guest, "/api/event/azure-day-bonn/session", "POST", { title: "Mein Vorschlag", abstract: "x", speakers: [] }), [409, { error: "unclaimed" }]);
  const mcp = rpcFor(s.env, s.raw, 2); assert.equal((await mcp("register_for_event", { event: "azure-day-bonn" })).error, "unclaimed");
  assert.equal(s.raw.prepare("SELECT COUNT(*) n FROM event_attendees").get().n, 0); assert.equal(s.raw.prepare("SELECT COUNT(*) n FROM event_sessions").get().n, 0);
  assert.equal((await ev(guest, "/api/event/azure-day-bonn/attendees"))[0], 200);   // lesen bleibt moeglich (leer)
  assert.equal((await ev(admin, "/api/event/azure-day-bonn/session", "POST", { title: "Vom Admin nachgetragen", speakers: [] }))[1].status, "live");   // Admins pflegen herrenlose Events weiter
  await imp(orga, "/api/event/azure-day-bonn/claim", "POST", {}); await imp(admin, "/api/admin/events/claim", "POST", { event_id: 1, user_id: 1, ok: true });
  assert.deepEqual(await ev(guest, "/api/event/azure-day-bonn/register", "POST", { visible: false }), [200, { ok: true, status: "going" }]);
  assert.deepEqual(await ev(guest, "/api/event/azure-day-bonn/session", "POST", { title: "Mein Vorschlag", abstract: "x", speakers: [] }), [200, { ok: true, status: "pending" }]);
  assert.equal((await mcp("register_for_event", { event: "azure-day-bonn", visible: true })).ok, true);
  const js = readFileSync(new URL("../../assets/events.js", import.meta.url), "utf8");
  assert.match(js, /\(j\.events \|\| \[\]\)\.filter\(function \(e\) \{ return !e\.unclaimed; \}\)/);   // die Auswahl "Session vorschlagen" bietet herrenlose Events nicht an
});
test("Session im Formular bearbeitet: die Kennungen der Speaker aus dem Import bleiben, ein spaeter zurueckgezogener Speaker verschwindet", async () => {
  const s = await setup(), ev = via(handleEvents, s.env), imp = via(handleEventImport, s.env), orga = user(s.raw, 1, "Olga Org", "olga");
  await ev(orga, "/api/event", "POST", { handle: "hh-copilot-day", title: "Hamburg Copilot Day 2026", start: "2026-05-16T09:00", mode: "onsite", location: "Hamburg" });
  s.pages[SZ] = { sessions: [{ id: "101", title: "Copilot Studio agents", description: "d", startsAt: "2026-05-16T09:00:00", endsAt: "2026-05-16T09:45:00", speakers: ["aaaa-1", "bbbb-2"], roomId: 1 }], speakers: [{ id: "aaaa-1", fullName: "Jane Doe" }, { id: "bbbb-2", fullName: "Max Muster" }], rooms: [{ id: 1, name: "Room A" }], categories: [] };
  assert.equal((await imp(orga, "/api/event/hh-copilot-day/sessionize", "POST", { api_id: "abc123" }))[0], 200);
  const mine = (await ev(orga, "/api/events/mine"))[1].events[0].sessions[0];
  // der Veranstalter aendert nur den Raum; das Formular schickt die Speaker ohne Kennungen zurueck (Name bzw. Profil)
  assert.equal((await ev(orga, "/api/event/hh-copilot-day/session", "POST", { id: mine.id, title: mine.title, abstract: mine.abstract, start: mine.start, end: mine.end, room: "Saal 1", speakers: mine.speakers.map((x) => ({ n: x.n })) }))[0], 200);
  const row = () => s.raw.prepare("SELECT * FROM event_sessions WHERE id=?").get(mine.id);
  assert.equal(row().edited_fields, "room"); assert.deepEqual(JSON.parse(row().speakers).map((x) => [x.n, x.sz, x.r, x.t]), mine.speakers.map((x) => [x.n, x.sz, x.r, x.t]));
  s.pages[SZ].sessions[0].speakers = ["aaaa-1"]; s.pages[SZ].sessions[0].startsAt = "2026-05-16T11:00:00"; s.pages[SZ].sessions[0].endsAt = "2026-05-16T11:45:00"; s.raw.exec("DELETE FROM import_cache");
  assert.equal((await imp(orga, "/api/event/hh-copilot-day/sessionize/sync", "POST"))[1].updated, 1);
  assert.deepEqual([row().start, row().room, JSON.parse(row().speakers).map((x) => x.n)], ["2026-05-16T11:00", "Saal 1", ["Jane Doe"]]);
  assert.deepEqual((await ev(null, "/api/events/export"))[1].events[0].sessions[0].speakers.map((x) => x.n), ["Jane Doe"]);
  // aendert der Veranstalter die Speaker selbst, gilt weiter sein Stand
  assert.equal((await ev(orga, "/api/event/hh-copilot-day/session", "POST", { id: mine.id, title: mine.title, abstract: mine.abstract, start: row().start, end: row().end, room: "Saal 1", speakers: [{ n: "Jane Doe" }, { n: "Gast Rednerin" }] }))[0], 200);
  s.pages[SZ].sessions[0].speakers = ["bbbb-2"]; s.raw.exec("DELETE FROM import_cache"); await imp(orga, "/api/event/hh-copilot-day/sessionize/sync", "POST");
  assert.deepEqual(JSON.parse(row().speakers).map((x) => x.n), ["Jane Doe", "Gast Rednerin"]);
});
test("Ausgeblendete (zusammengefuehrte) Zeilen belegen keine Adresse und sind ueber keine Adress-Route erreichbar", async () => {
  const s = await setup(), ev = via(handleEvents, s.env), imp = via(handleEventImport, s.env);
  const orga = user(s.raw, 1, "Olga Org", "olga"), other = user(s.raw, 2, "Other Member", "other"), admin = { ...user(s.raw, 9, "Admin", "admin-p"), admin: true };
  await ev(orga, "/api/event", "POST", { handle: "hh-copilot-day", title: "Hamburg Copilot Day 2026", start: "2026-05-16T09:00", mode: "onsite", location: "Hamburg" });
  const r = await upsertEvent(s.env.DB, { title: "Hamburg Copilot Day 2026", start: "2026-05-16", city: "Hamburg", source: "communitydays", sources: [{ kind: "communitydays", ref: "uid:1", url: "" }] });
  assert.equal(r.action, "merged"); const hid = s.raw.prepare("SELECT * FROM events WHERE merged_into=1").get();
  assert.match(hid.handle, /^~[0-9a-f]{30}$/); assert.ok(!/^\/api\/event\/[a-z0-9-]{3,40}$/.test("/api/event/" + hid.handle));   // technische Adresse: von keiner Route und keinem Formular erreichbar
  // die Adresse, die der Import sonst vergeben haette, ist frei
  assert.equal((await ev(other, "/api/event", "POST", { handle: "hamburg-copilot-day-2026", title: "Hamburg Copilot Day 2026 Afterparty", start: "2026-05-16T19:00", mode: "onsite", location: "Hamburg" }))[0], 200);
  // zurueckgenommen bekommt die Zeile eine echte, freie Adresse
  assert.equal((await imp(admin, "/api/admin/events/unmerge", "POST", { log: r.log }))[0], 200);
  const back = s.raw.prepare("SELECT handle,public,merged_into FROM events WHERE id=?").get(hid.id); assert.match(back.handle, HANDLE); assert.notEqual(back.handle, "hamburg-copilot-day-2026"); assert.deepEqual([back.public, back.merged_into], [1, 0]);
  assert.equal((await ev(null, `/api/event/${back.handle}/attendees`))[0], 200);
  // ein von einem Admin zusammengefuehrtes Event behaelt seine Adresse, ist aber nicht mehr erreichbar und laesst sich nicht ueber das Formular wiederbeleben
  await ev(other, "/api/event", "POST", { handle: "doppelt", title: "Doppelt eingetragen", start: "2026-05-16T09:00", mode: "onsite", location: "Hamburg" });
  const dup = s.raw.prepare("SELECT id FROM events WHERE handle='doppelt'").get().id; assert.ok((await mergeEvents(s.env.DB, dup, 1, 9)).ok);
  assert.deepEqual(await ev(other, "/api/event", "POST", { handle: "doppelt", title: "Doppelt eingetragen", start: "2026-05-16T09:00", mode: "onsite", location: "Hamburg" }), [409, { error: "handle_taken" }]);
  assert.deepEqual(await ev(admin, "/api/event", "POST", { handle: "doppelt", title: "Admin ueberschreibt", start: "2026-05-16T09:00", mode: "online" }), [409, { error: "handle_taken" }]);
  assert.equal((await ev(other, "/api/event/doppelt/session", "POST", { title: "Ghost session", speakers: [] }))[0], 404);
  assert.equal((await ev(admin, "/api/event/doppelt/attendees"))[0], 404); assert.equal((await ev(admin, "/api/event/doppelt/team"))[0], 404); assert.equal((await ev(other, "/api/event/doppelt", "DELETE"))[0], 403);
  assert.deepEqual(s.raw.prepare("SELECT title,public,merged_into FROM events WHERE id=?").all(dup).map((x) => [x.title, x.public, x.merged_into]), [["Doppelt eingetragen", 0, 1]]);
  assert.equal(s.raw.prepare("SELECT COUNT(*) n FROM event_sessions WHERE title='Ghost session'").get().n, 0);
});
test("Datensparsamkeit im Abruf-Cache: Sessionize-Antworten nur mit Kennung und Name der Speaker, Profilseiten gar nicht; Konto-Loeschung nimmt Speaker-Identitaet und Protokoll-Eintraege mit", async () => {
  const { raw, env, pages, opts } = await setup(), db = env.DB, ev = via(handleEvents, env);
  const orga = user(raw, 9, "Orga", "orga-p"), carla = user(raw, 2, "Carla Coder", "carla-c");
  await ev(orga, "/api/event", "POST", { handle: "hh-copilot", title: "Hamburg Copilot Day 2026", start: "2026-05-16", mode: "onsite", location: "Hamburg" });
  pages[SZ] = JSON.parse(fx("sessionize_all.json")); const link = await linkSessionize(env, raw.prepare("SELECT * FROM events").get(), "abc123", opts); assert.equal(link.ok, true);
  const cache = () => JSON.stringify(raw.prepare("SELECT * FROM import_cache").all());
  assert.ok(raw.prepare("SELECT COUNT(*) n FROM import_cache WHERE url=?").get(SZ).n === 1 && /Jane Doe/.test(cache()));   // der Cache traegt weiter (kein zweiter Abruf binnen 5 Minuten) ...
  assert.ok(!/Principal Architect|Jane builds things|image\/abcd|linkedin|twitter|maxmuster\.example|tagLine|bio|profilePicture|links/i.test(cache()), cache().slice(0, 300));   // ... aber ohne Slogan, Kurzvorstellung, Foto, Links
  const n0 = raw.prepare("SELECT COUNT(*) n FROM event_sessions").get().n; assert.equal((await syncSessionize(env, raw.prepare("SELECT * FROM events").get(), opts)).unchanged, n0);   // aus dem gekuerzten Cache gelesen: derselbe Stand
  // Profilseite: gelesen und ausgewertet, nie zwischengespeichert
  pages["https://sessionize.com/robots.txt"] = ""; pages["https://sessionize.com/carla-coder"] = profilePage("Carla Coder", [{ slug: "solo-day", title: "Solo Day 2026", date: "2026-07-01", place: "Bonn, Germany", sessions: [{ id: 7, title: "My only talk" }] }, { slug: "hh-day", title: "Hamburg Copilot Day 2026", date: "2026-05-16", place: "Hamburg, Germany", sessions: [{ id: 101, title: "Copilot Studio: Agents that actually ship" }] }], '<p class="tagline">Bio of Carla with secrets</p><a class="s-link" href="https://site.test/community/u/carla-c/">M365.FM</a>');
  const pv = await previewProfile(env, carla, "https://sessionize.com/carla-coder", similarName, opts); assert.equal(pv.ok, true);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM import_cache WHERE url LIKE '%carla-coder%'").get().n, 0); assert.ok(!/Bio of Carla/.test(cache()));
  await confirmProfile(env, carla, pv.token, ["0.0"], opts);
  const solo = raw.prepare("SELECT * FROM event_sessions WHERE title='My only talk'").get(), jr = JSON.parse(solo.speakers)[0].r;
  assert.deepEqual(raw.prepare("SELECT name,handle FROM speaker_ref WHERE id=?").all(jr).map((r) => [r.name, r.handle]), [["Carla Coder", "carla-c"]]);
  // Protokoll-Eintraege mit ihrem Namen und Profil (Vorher-/Nachher-Staende von Zusammenfuehrungen)
  const keynote = raw.prepare("SELECT id,speakers FROM event_sessions WHERE event_id=1 ORDER BY id").get(), withCarla = JSON.stringify([...JSON.parse(keynote.speakers), { n: "Carla Coder", h: "carla-c", s: "confirmed", r: jr }]);
  raw.prepare("INSERT INTO merge_log(kind,from_id,into_id,snapshot,created) VALUES('session',?,?,?,1)").run(solo.id, keynote.id, JSON.stringify({ into_before: { speakers: keynote.speakers }, into_after: { speakers: withCarla }, from_status: "live", added_sources: [], invites: [] }));
  raw.prepare("INSERT INTO speaker_ref(id,name,name_key,created,updated) VALUES(70,'Someone Else','someone else',1,1)").run();
  raw.prepare("INSERT INTO merge_log(kind,from_id,into_id,snapshot,created) VALUES('speaker',70,?,?,1)").run(jr, JSON.stringify({ into_before: { sessionize_id: "", handle: "carla-c", name: "Carla Coder" }, sessions: [{ id: solo.id, before: solo.speakers, after: solo.speakers }] }));
  raw.prepare("INSERT INTO dedupe_queue(kind,a_id,b_id,reason,created) VALUES('speaker',?,70,'name_without_shared_event',1)").run(jr);
  await deleteUserEvents(db, 2);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM speaker_ref WHERE id=?").get(jr).n, 0);   // niemand verweist mehr auf die Identitaet: auch der Name ist weg
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM dedupe_queue WHERE kind='speaker'").get().n, 0);
  const logs = JSON.stringify(raw.prepare("SELECT snapshot FROM merge_log").all()); assert.ok(!/carla-c|Carla Coder/.test(logs), logs.slice(0, 400));
  assert.ok(raw.prepare("SELECT undone FROM merge_log WHERE kind='speaker'").get().undone === 1);
  assert.ok(!/carla/i.test(JSON.stringify(["speaker_ref", "session_source", "import_preview", "import_cache", "dedupe_queue"].map((t) => raw.prepare(`SELECT * FROM ${t}`).all()))));
  assert.deepEqual(raw.prepare("SELECT name FROM speaker_ref ORDER BY id").all().map((r) => r.name), ["Jane Doe", "Max Muster", "Someone Else"]);   // die Speaker aus dem Programm des Veranstalters bleiben
  // steht die Person ausserdem im Programm eines Veranstalters (dessen Sessionize-Abgleich), bleibt dort nur der Name: ohne Profil
  const s2 = await setup(), max = user(s2.raw, 5, "Max Muster", "max-m"), ev2 = via(handleEvents, s2.env), orga2 = user(s2.raw, 9, "Orga", "orga-p");
  await ev2(orga2, "/api/event", "POST", { handle: "hh-copilot", title: "Hamburg Copilot Day 2026", start: "2026-05-16", mode: "onsite", location: "Hamburg" });
  s2.pages[SZ] = JSON.parse(fx("sessionize_all.json")); await linkSessionize(s2.env, s2.raw.prepare("SELECT * FROM events").get(), "abc123", s2.opts);
  s2.raw.prepare("UPDATE speaker_ref SET handle='max-m' WHERE name='Max Muster'").run();
  await deleteUserEvents(s2.env.DB, max.id);
  assert.deepEqual(s2.raw.prepare("SELECT name,handle FROM speaker_ref WHERE name='Max Muster'").all().map((r) => [r.name, r.handle]), [["Max Muster", ""]]);
});
