import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleEvents, similarName } from "../src/events.js";
import { handleEventImport } from "../src/eventimport.js";
import { parseAllView, parseProfilePage, profileSlug, syncSessionize, linkSessionize, previewProfile, confirmProfile } from "../src/sessionize.js";
import { parseJsonLd, parseIcs, parseSitemap, runCommunityDays, isMicrosoftRelated } from "../src/communitydays.js";
import { robotsAllowed, UA } from "../src/botfetch.js";
import { normEventName, normSessionTitle, normLink, normUrl, upsertEvent, upsertSession, listDupes, decideDupe, unmerge, mergeEvents } from "../src/eventmerge.js";

const fx = (n) => readFileSync(new URL("./fixtures/" + n, import.meta.url), "utf8");
const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf8"));
  const db = { prepare(sql) { let args = []; const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: raw.prepare(sql).all(...args) }), first: async () => raw.prepare(sql).get(...args) ?? null,
    run: async () => { const r = raw.prepare(sql).run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; }, async batch(s) { for (const x of s) await x.run(); } };
  const calls = [];
  const pages = {};
  const fetch = async (url, init) => { calls.push({ url: String(url), ua: init?.headers?.["user-agent"] }); const p = pages[String(url)]; return p === undefined ? new Response("nf", { status: 404 }) : new Response(typeof p === "string" ? p : JSON.stringify(p), { status: 200 }); };
  const env = { DB: db, SITE: "https://site.test", IMPORT_OPTS: { fetch, sleep: async () => {} } };
  return { raw, env, pages, calls, opts: env.IMPORT_OPTS };
}
const user = (raw, id, name, handle, role) => { raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(?,'github',?,?,1)").run(id, "s" + id, name); if (handle) raw.prepare("INSERT INTO profiles(user_id,public,handle,updated) VALUES(?,1,?,1)").run(id, handle); return { id, name }; };
const SZ = "https://sessionize.com/api/v2/abc123/view/All";

test("Normalisierung: Namen, Titel, Links, URLs", () => {
  assert.equal(normEventName("The 3rd Annual Hamburg Copilot Day 2026 GmbH").key, "hamburg copilot day");
  assert.equal(normEventName("Hamburg Copilot Day 2026 – Edition").year, "2026");
  assert.equal(normSessionTitle("“Fabric 101” 😀!"), normSessionTitle("fabric 101"));
  assert.equal(normLink("https://www.linkedin.com/in/Jane-Doe/?x=1"), normLink("http://linkedin.com/in/jane-doe"));
  assert.equal(normLink("https://x.com/janedoe"), normLink("https://twitter.com/JaneDoe/"));
  assert.equal(normUrl("https://www.Example.com/a/?utm_source=x#f"), normUrl("http://example.com/a"));
});
test("Sessionize All: Mapping, Zeitplan nur wenn angekuendigt, Servicesessions weg", () => {
  const p = parseAllView(JSON.parse(fx("sessionize_all.json")));
  assert.equal(p.sessions.length, 2);
  const a = p.sessions[0], b = p.sessions[1];
  assert.equal(a.start, "2026-05-16T09:00"); assert.equal(a.room, "Room A"); assert.equal(a.track, "AI"); assert.equal(a.level, "200"); assert.equal(a.speakers.length, 2);
  assert.ok(!/https?:|<b>/.test(a.abstract));
  assert.equal(b.start, ""); assert.equal(b.end, ""); assert.equal(b.room, "");
  assert.equal(a.speakers[0].photo_src, "https://sessionize.com/image/abcd-400o400o2-xyz.jpg"); assert.equal(a.speakers[0].links.length, 2);
  assert.equal(parseAllView({}), null);
});
test("Sessionize-Profil: Parser und freundlicher Rueckfall", () => {
  const p = parseProfilePage(fx("sessionize_profile.html"));
  assert.equal(p.name, "Jane Doe"); assert.equal(p.events.length, 2); assert.equal(p.events[0].slug, "hamburg-copilot-day"); assert.equal(p.events[0].sessions.length, 2); assert.equal(p.events[0].place, "Hamburg, Germany"); assert.equal(p.events[1].online, true);
  assert.ok(parseProfilePage("<html><body>nothing</body></html>").error);
  assert.equal(profileSlug("https://sessionize.com/jane-doe"), "jane-doe"); assert.equal(profileSlug("https://evil.example/jane"), ""); assert.equal(profileSlug("https://sessionize.com/api/v2/x"), "");
});
test("robots.txt: eigener Token vor *, laengste Regel", () => {
  const r = fx("communitydays_robots.txt");
  assert.equal(robotsAllowed(r, "/events/hamburg"), true); assert.equal(robotsAllowed(r, "/events/secret-one"), false); assert.equal(robotsAllowed(r, "/private/x"), true);   // Gruppe des Bots gilt, "*" nicht mehr
  assert.equal(robotsAllowed("User-agent: *\nDisallow: /", "/x"), false); assert.equal(robotsAllowed("", "/x"), true);
  assert.ok(!/@/.test(UA) && UA.includes("https://www.m365.fm/bot/"));
});
test("Community Days: Parser JSON-LD, ICS, Sitemap, Microsoft-Filter", () => {
  const l = parseJsonLd(fx("communitydays_list.html"));
  assert.equal(l.length, 3); assert.equal(l[0].city, "Hamburg"); assert.equal(l[0].mode, "onsite"); assert.equal(l[0].organizer_name, "Hamburg M365 User Group e.V.");
  assert.ok(l[0].sources.some((s) => s.kind === "sessionize_event" && s.ref === "hamburg-copilot-day")); assert.equal(l[2].mode, "online");
  assert.equal(isMicrosoftRelated(l[0]), true); assert.equal(isMicrosoftRelated(l[1]), false);
  const i = parseIcs(fx("communitydays.ics")); assert.equal(i.length, 1); assert.equal(i[0].start, "2026-06-10T09:00"); assert.equal(i[0].city, "Vienna");
  assert.deepEqual(parseSitemap("<urlset><url><loc>https://communitydays.org/events/a</loc></url><url><loc>https://communitydays.org/about</loc></url><url><loc>https://evil.example/events/x</loc></url></urlset>"), ["https://communitydays.org/events/a"]);
});
test("Community Days: Probelauf schreibt nichts, Lauf legt herrenlose Events an, vergangene retired, Bot-UA, robots, Cache", async () => {
  const { raw, env, pages, calls, opts } = await setup();
  pages["https://communitydays.org/robots.txt"] = "User-agent: *\nDisallow: /private/\n";
  pages["https://communitydays.org/events.ics"] = "nope"; pages["https://communitydays.org/calendar.ics"] = "nope"; pages["https://communitydays.org/feed.ics"] = "nope";
  pages["https://communitydays.org/events"] = fx("communitydays_list.html");
  const dry = await runCommunityDays(env, { ...opts, dry: true, today: "2026-05-01" });
  assert.equal(dry.created, 2); assert.equal(dry.skipped_non_ms, 1); assert.equal(raw.prepare("SELECT COUNT(*) n FROM events").get().n, 0);
  const real = await runCommunityDays(env, { ...opts, today: "2026-05-01" });
  assert.equal(real.created, 2);
  const evs = raw.prepare("SELECT * FROM events ORDER BY start").all();
  assert.equal(evs.length, 2); assert.ok(evs.every((e) => e.source === "communitydays" && e.unclaimed === 1 && e.owner_id === 0 && e.source_url.startsWith("https://communitydays.org/")));
  assert.equal(evs.find((e) => /Azure/.test(e.title)).retired, 1); assert.equal(evs.find((e) => /Hamburg/.test(e.title)).retired, 0);   // vergangen: markiert, nicht geloescht
  assert.ok(raw.prepare("SELECT 1 FROM event_source WHERE kind='sessionize_event' AND ref='hamburg-copilot-day'").get());
  assert.ok(calls.every((c) => c.ua === UA)); assert.equal(calls.filter((c) => c.url.endsWith("/events")).length, 1);   // zweiter Lauf aus dem Cache
  const again = await runCommunityDays(env, { ...opts, today: "2026-05-01" });
  assert.equal(again.created, 0); assert.equal(again.merged, 2); assert.equal(raw.prepare("SELECT COUNT(*) n FROM events").get().n, 2);
  // robots verbietet die Seite -> nichts abgerufen
  const s2 = await setup(); s2.pages["https://communitydays.org/robots.txt"] = "User-agent: *\nDisallow: /"; s2.pages["https://communitydays.org/events"] = fx("communitydays_list.html");
  const r2 = await runCommunityDays(s2.env, { ...s2.opts, today: "2026-05-01" }); assert.equal(r2.found, 0); assert.ok(!s2.calls.some((c) => c.url.endsWith("/events")));
});
test("Dedupe: dasselbe Event aus Community Days und Sessionize wird EIN Event", async () => {
  const { raw, env, pages, opts } = await setup();
  pages["https://communitydays.org/robots.txt"] = ""; pages["https://communitydays.org/events"] = fx("communitydays_list.html");
  await runCommunityDays(env, { ...opts, today: "2026-05-01" });
  const u = user(raw, 1, "Jane Doe", "jane-doe");
  pages["https://sessionize.com/robots.txt"] = ""; pages["https://sessionize.com/jane-doe"] = fx("sessionize_profile.html");
  const pv = await previewProfile(env, u, "https://sessionize.com/jane-doe", similarName, opts); assert.ok(pv.ok, JSON.stringify(pv));
  const cf = await confirmProfile(env, u, pv.token, pv.items.filter((i) => i.event.startsWith("Hamburg")).map((i) => i.id), opts);
  assert.equal(cf.ok, true);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM events WHERE name_key LIKE 'hamburg copilot day%'").get().n, 1);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM event_source s JOIN events e ON e.id=s.event_id WHERE e.name_key LIKE 'hamburg%' AND s.kind IN ('communitydays','sessionize_profile')").get().n, 2);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM event_sessions").get().n, 2);
});
test("Dedupe: zwei Speaker importieren dieselbe Session -> eine Session mit zwei Speakern", async () => {
  const { raw, env, pages, opts } = await setup();
  const jane = user(raw, 1, "Jane Doe", "jane-doe"), max = user(raw, 2, "Max Muster", "max-muster");
  pages["https://sessionize.com/robots.txt"] = ""; pages["https://sessionize.com/jane-doe"] = fx("sessionize_profile.html"); pages["https://sessionize.com/max-muster"] = fx("sessionize_profile_max.html");
  const p1 = await previewProfile(env, jane, "https://sessionize.com/jane-doe", similarName, opts);
  await confirmProfile(env, jane, p1.token, ["0.0"], opts);
  const p2 = await previewProfile(env, max, "sessionize.com/max-muster", similarName, opts);
  await confirmProfile(env, max, p2.token, ["0.0"], opts);   // Titel weicht in Satzzeichen ab, andere Sessionize-ID fehlt
  const ev = raw.prepare("SELECT * FROM events").all(); assert.equal(ev.length, 1);
  const ss = raw.prepare("SELECT * FROM event_sessions").all(); assert.equal(ss.length, 1);
  const sp = JSON.parse(ss[0].speakers); assert.deepEqual(sp.map((x) => x.h).sort(), ["jane-doe", "max-muster"]); assert.ok(sp.every((x) => x.s === "confirmed"));
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM session_source WHERE session_id=?").get(ss[0].id).n, 2);
  // Fremdes Profil kann nicht uebernommen werden
  const eve = user(raw, 3, "Eve Other", "eve-other");
  assert.equal((await previewProfile(env, eve, "https://sessionize.com/jane-doe", similarName, opts)).error, "not_your_profile");
  assert.equal((await previewProfile(env, jane, "https://example.com/x", similarName, opts)).error, "bad_url");
  pages["https://sessionize.com/broken"] = "<html>kaputt</html>"; raw.prepare("INSERT INTO channels(owner_type,owner_id,kind,url) VALUES('u',1,'x','https://sessionize.com/broken')").run();
});
test("Dedupe: Organisator-Sync und Speaker-Import fuehren dieselbe Session mit allen Speakern zusammen; Re-Sync idempotent", async () => {
  const { raw, env, pages, opts } = await setup();
  raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(9,'github','o','Orga',1)").run();
  const t = 1;
  raw.prepare("INSERT INTO events(handle,owner_id,title,start,end,mode,created,updated,name_key,city_key) VALUES('hh-copilot',9,'Hamburg Copilot Day 2026','2026-05-16','2026-05-16','onsite',?,?,'hamburg copilot day','hamburg')").run(t, t);
  const ev = raw.prepare("SELECT * FROM events").get();
  pages[SZ] = JSON.parse(fx("sessionize_all.json"));
  const link = await linkSessionize(env, ev, "abc123", opts); assert.equal(link.ok, true); assert.equal(link.sync.created, 2);
  const snap = () => JSON.stringify([raw.prepare("SELECT id,title,speakers,start FROM event_sessions ORDER BY id").all(), raw.prepare("SELECT COUNT(*) n FROM speaker_ref").get(), raw.prepare("SELECT COUNT(*) n FROM speaker_invites").get()]);
  const before = snap();
  const re = await syncSessionize(env, raw.prepare("SELECT * FROM events").get(), opts); assert.equal(re.created, 0); assert.equal(snap(), before);   // idempotent
  const s = raw.prepare("SELECT * FROM event_sessions WHERE sessionize_id='101'").get(); assert.equal(JSON.parse(s.speakers).length, 2);
  // Speaker Jane bestaetigt selbst per Profil-Import (Titel gleich) -> weiterhin eine Session, Jane mit Profil verknuepft, kein Doppel-Eintrag
  const jane = user(raw, 1, "Jane Doe", "jane-doe");
  pages["https://sessionize.com/robots.txt"] = ""; pages["https://sessionize.com/jane-doe"] = fx("sessionize_profile.html");
  const pv = await previewProfile(env, jane, "https://sessionize.com/jane-doe", similarName, opts); await confirmProfile(env, jane, pv.token, ["0.0"], opts);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM event_sessions WHERE title_key=?").get(normSessionTitle("Copilot Studio: Agents that actually ship")).n, 1);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM events").get().n, 1);   // gleiches Event ueber Name+Datum+Ort
  const sp = JSON.parse(raw.prepare("SELECT speakers FROM event_sessions WHERE sessionize_id='101'").get().speakers);
  assert.equal(sp.length, 2); assert.equal(sp.find((x) => x.h === "jane-doe").s, "confirmed"); assert.ok(sp.find((x) => x.n === "Max Muster").t);
  // Zeitplan nicht veroeffentlicht -> keine Zeiten; Foto-URL zum Kopieren vorgemerkt, nicht angezeigt
  assert.equal(raw.prepare("SELECT start FROM event_sessions WHERE sessionize_id='102'").get().start, "");
  assert.ok(raw.prepare("SELECT photo_src FROM speaker_ref WHERE name='Jane Doe'").get().photo_src.startsWith("https://sessionize.com/"));
  // Session verschwindet bei Sessionize -> retired, nicht geloescht
  pages[SZ] = { ...JSON.parse(fx("sessionize_all.json")), sessions: JSON.parse(fx("sessionize_all.json")).sessions.slice(0, 1) };
  raw.exec("DELETE FROM import_cache");   // Sessionize cached 5 Minuten, wir ebenfalls
  await syncSessionize(env, raw.prepare("SELECT * FROM events").get(), { ...opts, now: 5 });
  assert.equal(raw.prepare("SELECT status FROM event_sessions WHERE sessionize_id='102'").get().status, "retired");
});
test("Unsichere Treffer: Warteschlange, Zusammenfuehren, Zurueck (merged_into, nichts geloescht)", async () => {
  const { raw, env } = await setup(), db = env.DB;
  const a = await upsertEvent(db, { title: "Hamburg Copilot Day 2026", start: "2026-05-16", city: "Hamburg", url: "https://a.example/hh", source: "communitydays", sources: [] });
  assert.equal((await upsertEvent(db, { title: "Hamburg Copilot Day 2027", start: "2027-05-15", city: "Hamburg", sources: [] }, { dry: true })).action, "created");   // andere Ausgabe
  const b = await upsertEvent(db, { title: "Hamburg Copilot Day", start: "", city: "", source: "sessionize", sources: [] });   // Name ohne Datum
  assert.equal(b.action, "queued"); assert.notEqual(a.id, b.id); assert.equal(raw.prepare("SELECT COUNT(*) n FROM events WHERE merged_into=0").get().n, 2);
  // anderes Jahr, gleicher Name: kein Treffer
  const q = await listDupes(db); assert.equal(q.length, 1); assert.equal(q[0].kind, "event");
  await upsertSession(db, a.id, { title: "Keynote", start: "2026-05-16T09:00", speakers: [{ n: "Anna A" }] }, null, { trusted: true });
  await upsertSession(db, b.id, { title: "Closing", speakers: [{ n: "Bob B" }] }, null, { trusted: true });
  const r = await decideDupe(db, q[0].id, "merge", 1); assert.equal(r.status, "merged");
  const live = raw.prepare("SELECT * FROM events WHERE merged_into=0").all(); assert.equal(live.length, 1);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM event_sessions WHERE event_id=?").get(live[0].id).n, 2);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM events").get().n, 2);   // nichts geloescht
  const hidden = raw.prepare("SELECT * FROM events WHERE merged_into<>0").get(); assert.equal(hidden.public, 0);
  const un = await unmerge(db, r.log, 1); assert.equal(un.ok, true);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM events WHERE merged_into=0").get().n, 2);
  assert.equal(raw.prepare("SELECT event_id FROM event_sessions WHERE title='Closing'").get().event_id, b.id);
  assert.equal(raw.prepare("SELECT status FROM dedupe_queue WHERE id=?").get(q[0].id).status, "separate");   // nach Rueckgabe nicht sofort wieder vorschlagen
  // "Getrennt lassen"
  const c = await upsertEvent(db, { title: "Fabric Day", start: "", sources: [] }), d = await upsertEvent(db, { title: "Fabric Day", start: "", sources: [] });
  const q2 = (await listDupes(db)).find((x) => x.a.title === "Fabric Day"); assert.equal((await decideDupe(db, q2.id, "separate", 1)).status, "separate"); assert.equal((await listDupes(db)).some((x) => x.id === q2.id), false);
});
test("Speaker: gleicher Name ohne gemeinsames Event wird nicht automatisch vereint", async () => {
  const { raw, env } = await setup(), db = env.DB;
  const e1 = await upsertEvent(db, { title: "Alpha Con", start: "2026-01-10", city: "Berlin", sources: [] }), e2 = await upsertEvent(db, { title: "Beta Con", start: "2026-02-10", city: "Wien", sources: [] });
  await upsertSession(db, e1.id, { title: "Talk A", speakers: [{ n: "Chris Meyer" }] }, null, {});
  await upsertSession(db, e2.id, { title: "Talk B", speakers: [{ n: "Chris Meyer" }] }, null, {});
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM speaker_ref").get().n, 2);
  const q = (await listDupes(db)).filter((x) => x.kind === "speaker"); assert.equal(q.length, 1);
  // gleicher Sessionize-/Link-Schluessel -> sicher dieselbe Person
  await upsertSession(db, e2.id, { title: "Talk C", speakers: [{ n: "C. Meyer", links: ["https://www.linkedin.com/in/chris-m"] }] }, null, {});
  await upsertSession(db, e1.id, { title: "Talk D", speakers: [{ n: "Chris M.", links: ["https://linkedin.com/in/chris-m/"] }] }, null, {});
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM speaker_ref WHERE links LIKE '%linkedin:chris-m%'").get().n, 1);
});
test("Berechtigung: nur Organisator/Admin verknuepft Sessionize; ID wird nie ausgegeben", async () => {
  const { raw, env, pages } = await setup();
  const owner = user(raw, 1, "Orga", "orga-person"), other = user(raw, 2, "Fremd", "fremd-person"), admin = { ...user(raw, 3, "Admin", "admin-p"), admin: true };
  raw.prepare("INSERT INTO events(handle,owner_id,title,start,mode,created,updated) VALUES('mein-event',1,'Mein Event','2026-09-01','online',1,1)").run();
  raw.prepare("INSERT INTO events(handle,owner_id,title,start,mode,created,updated,unclaimed) VALUES('herrenlos',0,'Herrenlos','2026-09-01','online',1,1,1)").run();
  pages[SZ] = JSON.parse(fx("sessionize_all.json"));
  const call = (u, path, method, b) => { const req = new Request("https://x" + path, { method, body: b ? JSON.stringify(b) : undefined }); return handleEventImport(env, req, new URL(req.url), path, u, J).then((r) => r.json().then((j) => [r.status, j])); };
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
  // Beanspruchen eines herrenlosen Events
  assert.equal((await call(owner, "/api/event/herrenlos/claim", "POST", {}))[1].status, "pending");
  assert.equal((await call(admin, "/api/admin/events/claim", "POST", { event_id: 2, user_id: 1, ok: true }))[0], 200);
  assert.equal(raw.prepare("SELECT owner_id,unclaimed FROM events WHERE handle='herrenlos'").get().owner_id, 1);
});
