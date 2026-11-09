// Sessionize: Organisator-Anbindung (API-ID -> view/All) und Speaker-Profil-Import (oeffentliche Profilseite).
// Datensparsam: von Speakern werden nur Name und Sessionize-Kennung uebernommen. Kurzvorstellung, Slogan, Link-Listen und Fotos werden
// weder gespeichert noch kopiert (sie werden nirgends angezeigt); Links der Profilseite dienen nur im Speicher dem Abgleich "ist das dein Profil?".
import { politeGet } from "./botfetch.js";
import { canManage } from "./events.js";
import { upsertEvent, upsertSessions, sessionCtx, sessionTomb, matchSession, addEventSource, hash24, normLink, normPerson, normText, dedupeEventSessions, mergeEvents, protectedEvent, queueDupe, safeUrl, scrubLine } from "./eventmerge.js";

const now = () => Math.floor(Date.now() / 1000);
const API_ID = /^[A-Za-z0-9]{4,24}$/;
const clean = (s, n) => String(s ?? "").replace(/<[^>]*>/g, " ").replace(/[<>]/g, "").replace(/https?:\/\/\S+/gi, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, n);
const oneLine = (s, n) => clean(s, n).replace(/\s+/g, " ");
const minute = (s) => { const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(String(s || "")); return m ? `${m[1]}T${m[2]}` : ""; };   // Sessionize liefert Ortszeit ohne Offset

// ---- view/All parsen. Ohne startsAt (Zeitplan nicht veroeffentlicht) bleibt die Zeit leer. Von Speakern nur Kennung und Name.
export function parseAllView(j) {
  if (!j || !Array.isArray(j.sessions)) return null;
  const cats = new Map(), rooms = new Map();
  for (const c of j.categories || []) for (const it of c.items || c.categoryItems || []) cats.set(String(it.id), { group: String(c.title || c.name || ""), name: String(it.name || "") });
  for (const r of j.rooms || []) rooms.set(String(r.id), String(r.name || ""));
  const speakers = new Map();
  for (const s of j.speakers || []) speakers.set(String(s.id), { sz: String(s.id), n: oneLine(s.fullName || [s.firstName, s.lastName].filter(Boolean).join(" "), 80) });
  const sessions = [];
  for (const s of j.sessions) {
    if (s.isServiceSession || !s.title) continue;   // Pausen, Mittagessen
    const items = (s.categoryItems || []).map((id) => cats.get(String(id))).filter(Boolean);
    const track = (items.find((x) => /track|thema|topic/i.test(x.group)) || items[0] || {}).name || "";
    const level = (items.find((x) => /level/i.test(x.group)) || {}).name || "";
    sessions.push({ sessionize_id: String(s.id), title: oneLine(s.title, 140), abstract: clean(s.description, 1500), start: minute(s.startsAt), end: minute(s.endsAt), room: s.roomId != null ? oneLine(rooms.get(String(s.roomId)) || "", 60) : "", track: oneLine(track, 60), level,
      recording_url: /^https:\/\//.test(s.recordingUrl || "") ? String(s.recordingUrl) : "", speakers: (s.speakers || []).map((id) => speakers.get(String(id))).filter(Boolean) });
  }
  return { sessions, speakers: [...speakers.values()] };
}

// ---- Organisator: Endpunkt abrufen und idempotent einspielen
export async function fetchAllView(env, apiId, opts = {}) {
  if (!API_ID.test(String(apiId || ""))) return { error: "bad_id" };
  const r = await politeGet(env, `https://sessionize.com/api/v2/${apiId}/view/All`, { ...opts, ttl: 300, skipRobots: true, accept: "application/json" });   // oeffentliche, schreibgeschuetzte API; Sessionize cached 5 Min
  if (!r.ok) return { error: r.status === 404 ? "not_found" : "fetch_failed" };
  let j; try { j = JSON.parse(r.body); } catch { return { error: "bad_json" }; }
  const p = parseAllView(j); return p ? { data: p } : { error: "bad_json" };
}
export const SYNC_CAP = 100;   // hoechstens so viele neue/geaenderte Sessions je Lauf; der Rest folgt im naechsten (sessionize_state='partial')
const sessionHash = (s) => hash24(JSON.stringify(["v1", s.title, s.abstract, s.start, s.end, s.room, s.track, s.level, s.recording_url, s.speakers.map((x) => [x.sz, x.n])]));
// Abgleich eines verknuepften Events. Sessionize ist massgeblich fuer die Sessions, die es selbst geliefert hat (Titel, Zeit, Raum, Speaker);
// von Hand geaenderte Felder bleiben stehen. Unveraenderte Sessions werden ueber ihren Inhalts-Hash uebersprungen, geschrieben wird gebuendelt.
// opts.data = bereits abgerufene Daten (kein zweiter Abruf), opts.cap = Deckel fuer diesen Lauf.
export async function syncSessionize(env, ev, opts = {}) {
  const db = env.DB, t = opts.now || now(), cap = opts.cap ?? SYNC_CAP;
  if (!ev.sessionize_api) return { error: "not_linked" };
  const res = opts.data ? { data: opts.data } : await fetchAllView(env, ev.sessionize_api, opts);
  if (res.error) { await db.prepare("UPDATE events SET sessionize_state=?,sessionize_synced=? WHERE id=?").bind(res.error, t, ev.id).run(); return { error: res.error }; }   // naechster Versuch mit dem naechsten Tageslauf
  const ref = await hash24("sessionize:" + ev.sessionize_api), feed = res.data.sessions.slice(0, 300), ctx = await sessionCtx(db, ev.id), mine = "sessionize_api|" + ref + ":";
  const todo = [], inFeed = new Set(), fresh = [];
  for (const s of feed) {
    const key = `${ref}:${s.sessionize_id}`, hash = await sessionHash(s), known = ctx.byRef.get("sessionize_api|" + key);
    inFeed.add("sessionize_api|" + key);
    if (known?.row && known.hash === hash && known.row.status !== "retired") continue;   // unveraendert
    const it = { cand: s, source: { kind: "sessionize_api", ref: key, hash } };
    if (!known?.row) fresh.push([await sessionTomb("sessionize_api", key), it]);
    todo.push(it);
  }
  if (fresh.length) {   // vom Veranstalter hier geloeschte Sessions belegen keinen Platz im Lauf
    const dead = new Set(((await db.prepare("SELECT ref FROM event_tombstone WHERE kind='session' AND ref IN (SELECT value FROM json_each(?))").bind(JSON.stringify(fresh.map((x) => x[0]))).all()).results || []).map((x) => x.ref));
    for (const [h, it] of fresh) if (dead.has(h)) todo.splice(todo.indexOf(it), 1);
  }
  const work = todo.slice(0, Math.max(0, cap)), n = { created: 0, updated: 0, merged: 0 };
  if (work.length) for (const r of (await upsertSessions(db, ev.id, work, { now: t, trusted: true, authoritative: true, proposer_id: ev.owner_id || 0, by: opts.by || 0 }, ctx)).results) if (n[r.action] !== undefined) n[r.action]++;
  // Sessions, die dieser Endpunkt frueher lieferte und nicht mehr liefert: ausblenden (retired), nie loeschen. Wer noch eine andere Quelle hat, bleibt.
  const gone = new Map(), keep = new Set();
  for (const [k, v] of ctx.byRef) { if (!v.row) continue; if (k.startsWith(mine) && !inFeed.has(k)) gone.set(v.row.id, v.row); else keep.add(v.row.id); }
  let retire = [...gone.values()].filter((r) => r.status === "live" && !keep.has(r.id));
  if (retire.length) {   // eine Session, die es schon vor dem Abgleich gab (von Hand angelegt) und die nur mit einem Eintrag dieses Endpunkts vereint wurde, bleibt
    const older = new Set(((await db.prepare("SELECT DISTINCT s.merged_into id FROM session_source x JOIN event_sessions s ON s.id=x.session_id WHERE s.event_id=?1 AND s.merged_into<>0 AND x.kind='sessionize_api' AND substr(x.ref,1,?2)=?3").bind(ev.id, ref.length + 1, ref + ":").all()).results || []).map((r) => r.id));
    retire = retire.filter((r) => !older.has(r.id));
  }
  if (retire.length) { await db.prepare("UPDATE event_sessions SET status='retired' WHERE status='live' AND id IN (SELECT value FROM json_each(?))").bind(JSON.stringify(retire.map((r) => r.id))).run(); for (const r of retire) r.status = "retired"; }
  const remaining = todo.length - work.length, dd = await dedupeEventSessions(db, ev.id, opts.by || 0, { ctx, max: 6 }), partial = remaining > 0;
  await db.prepare("UPDATE events SET sessionize_synced=CASE WHEN ?1=1 THEN sessionize_synced ELSE ?2 END,sessionize_state=?3 WHERE id=?4").bind(partial ? 1 : 0, t, partial ? "partial" : "ok", ev.id).run();
  await addEventSource(db, ev.id, "sessionize_api", ref, "", t);
  return { ok: true, sessions: feed.length, ...n, unchanged: feed.length - todo.length, retired: retire.length, remaining, partial, dupes_merged: dd.merged, queued: dd.queued };
}
// Endpunkt verknuepfen (Berechtigung prueft der Aufrufer). Derselbe Endpunkt an einem anderen, nicht von Hand gepflegten Event = dasselbe Event
// (protokollierte, umkehrbare Zusammenfuehrung); "getrennt lassen" wird beachtet, gepflegte Events gehen an die Admins.
export async function linkSessionize(env, ev, apiId, opts = {}) {
  const db = env.DB; apiId = String(apiId || "").trim();
  if (!apiId) { await db.prepare("UPDATE events SET sessionize_api='',sessionize_state='' WHERE id=?").bind(ev.id).run(); await db.prepare("DELETE FROM event_source WHERE event_id=? AND kind='sessionize_api' AND ref=?").bind(ev.id, await hash24("sessionize:" + ev.sessionize_api)).run(); return { ok: true, unlinked: true }; }
  const m = /sessionize\.com\/api\/v2\/([A-Za-z0-9]+)/.exec(apiId); if (m) apiId = m[1];   // ganze Endpoint-URL eingefuegt
  if (!API_ID.test(apiId)) return { error: "bad_id" };
  const chk = await fetchAllView(env, apiId, opts); if (chk.error) return { error: chk.error };
  const ref = await hash24("sessionize:" + apiId);
  // Neu verknuepft (nach "Verbindung loesen" oder zum ersten Mal): Sessions dieses Endpunkts, die der Veranstalter frueher geloescht hat, duerfen wiederkommen
  // (ihre Loeschmarken entfallen). Solange die Verbindung besteht, bleibt Geloeschtes geloescht.
  const tombs = []; if (ev.sessionize_api !== apiId) for (const x of chk.data.sessions.slice(0, 300)) tombs.push(await sessionTomb("sessionize_api", `${ref}:${x.sessionize_id}`));
  await db.batch([db.prepare("UPDATE events SET sessionize_api=? WHERE id=?").bind(apiId, ev.id), db.prepare("DELETE FROM event_tombstone WHERE kind='session' AND ref IN (SELECT value FROM json_each(?))").bind(JSON.stringify(tombs))]);
  await addEventSource(db, ev.id, "sessionize_api", ref, "");
  const other = (await db.prepare("SELECT e.* FROM event_source s JOIN events e ON e.id=s.event_id WHERE s.kind='sessionize_api' AND s.ref=? AND e.id<>? AND e.merged_into=0").bind(ref, ev.id).all()).results || [];
  const sep = other.length ? (await db.prepare("SELECT a_id,b_id FROM dedupe_queue WHERE kind='event' AND status='separate' AND (a_id=?1 OR b_id=?1)").bind(ev.id).all()).results || [] : [];
  let merged = 0, queued = 0;
  for (const o of other) {
    if (sep.some((p) => p.a_id === o.id || p.b_id === o.id)) continue;
    if (!protectedEvent(o)) { const r = await mergeEvents(db, o.id, ev.id, opts.by || 0, true); if (r.ok) merged++; }
    else if (await queueDupe(db, "event", ev.id, o.id, "same_sessionize_endpoint")) queued++;
  }
  const sync = await syncSessionize(env, { ...ev, sessionize_api: apiId }, { ...opts, data: chk.data });   // die eben gepruefte Antwort verwenden, kein zweiter Abruf
  return sync.error ? { error: sync.error } : { ok: true, merged, queued, sync };
}

// ---- Speaker-Profil: https://sessionize.com/<name>. Parser ist tolerant; scheitert er, kommt eine freundliche Meldung.
export function profileSlug(input) {
  try {
    const u = new URL(/^https?:\/\//i.test(input) ? input : "https://" + input);
    if (u.protocol !== "https:" || u.username || u.password || !/^(www\.)?sessionize\.com$/i.test(u.hostname)) return "";
    const seg = u.pathname.split("/").filter(Boolean);
    if (seg.length !== 1 || !/^[A-Za-z0-9][A-Za-z0-9._-]{1,60}$/.test(seg[0]) || ["api", "s", "i", "image", "login", "events", "speakers", "organizers", "pricing", "about"].includes(seg[0].toLowerCase())) return "";
    return seg[0].toLowerCase();
  } catch { return ""; }
}
const dec = (s) => String(s).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&nbsp;/g, " ");
const text = (h) => dec(String(h).replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
// Erwartetes Layout (siehe Fixture): Name in <h1>, je Event ein Block mit data-event (oder class "…event…"),
// darin Event-Link (sessionize.com/<event>), optional <time datetime> und Orts-Angabe, Sessions als <li> mit Link/Titel.
// Kurzzeile, Bio und Foto der Seite werden bewusst nicht gelesen; links (Profil-Links) nur fuer den Abgleich im Speicher.
export function parseProfilePage(html) {
  html = String(html || "").replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "");
  const name = text((/<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html) || [])[1] || (/property="og:title" content="([^"]+)"/i.exec(html) || [])[1] || "").replace(/\s*[|–-]\s*Sessionize.*$/i, "");
  if (!name) return { error: "no_name" };
  const links = [...html.matchAll(/<a[^>]+href="(https?:\/\/[^"]+)"[^>]*class="[^"]*(?:s-link|social)[^"]*"|<a[^>]+class="[^"]*(?:s-link|social)[^"]*"[^>]*href="(https?:\/\/[^"]+)"/gi)].map((m) => dec(m[1] || m[2]));
  const events = [];
  const blocks = html.split(/(?=<(?:section|div|article|li)[^>]*(?:data-event|class="[^"]*\bs-event\b))/i).slice(1);
  for (const b of blocks) {
    const a = /<a[^>]+href="(https?:\/\/(?:www\.)?sessionize\.com\/([A-Za-z0-9._-]+)\/?)"[^>]*>([\s\S]*?)<\/a>/i.exec(b); if (!a) continue;
    const title = text(a[3]); if (title.length < 3) continue;
    const dt = (/<time[^>]+datetime="(\d{4}-\d{2}-\d{2})(?:T[^"]*)?"/i.exec(b) || [])[1] || "", dtEnd = ([...b.matchAll(/<time[^>]+datetime="(\d{4}-\d{2}-\d{2})/gi)][1] || [])[1] || "";
    const place = text((/<(?:span|div|p)[^>]*class="[^"]*(?:s-place|location)[^"]*"[^>]*>([\s\S]*?)<\/(?:span|div|p)>/i.exec(b) || [])[1] || ""), online = /\bonline\b/i.test(place) || !place;
    const sessions = [...b.matchAll(/<li[^>]*class="[^"]*s-session[^"]*"[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => { const l = /<a[^>]+href="(https?:\/\/[^"]+)"/i.exec(m[1]); const sid = (/data-session="(\d+)"/i.exec(m[0]) || /\/s\/(\d+)/.exec(l?.[1] || "") || [])[1] || ""; return { title: text(m[1]), url: l ? dec(l[1]) : "", sessionize_id: sid }; }).filter((s) => s.title.length >= 3);
    events.push({ title, slug: a[2].toLowerCase(), url: dec(a[1]), start: dt, end: dtEnd, place: online ? "" : place, online, sessions });
  }
  if (!events.length) return { error: "no_events", name };
  return { name, links: [...new Set(links)], events };
}
const nameSimilar = (a, b) => { const x = normPerson(a).split(" "), y = normPerson(b).split(" "); return x.length >= 2 && y.length >= 2 && x[0] === y[0] && x[x.length - 1] === y[y.length - 1]; };
// Gehoert das Profil dem Nutzer?
//  ok     = gleicher Name wie das Konto, oder das Sessionize-Profil bzw. ein Link der Seite steht in den eigenen Kanaelen, oder strong.
//           Admins duerfen immer lesen (self=false: sie tragen sich dann nicht selbst als Speaker ein).
//  strong = Nachweis, den nur der Inhaber des Sessionize-Profils erbringen kann: die Sessionize-Seite verlinkt das eigene M365.FM-Profil.
//           Name und eigene Kanaele kann jedes Mitglied frei eintragen; sie reichen deshalb nie, um das Profil an der Speaker-Identitaet
//           zu merken (das wirkt ueber Events hinweg).
async function ownsProfile(env, user, slug, parsed, similarName) {
  const db = env.DB, me = await db.prepare("SELECT u.name,p.handle FROM users u LEFT JOIN profiles p ON p.user_id=u.id AND p.public=1 WHERE u.id=?").bind(user.id).first();
  const mine = new Set(((await db.prepare("SELECT url FROM channels WHERE owner_type='u' AND owner_id=?").bind(user.id).all()).results || []).map((r) => normLink(r.url)).filter(Boolean));
  const site = (() => { try { return new URL(env.SITE || "https://www.m365.fm").hostname.replace(/^www\./, ""); } catch { return "m365.fm"; } })();
  const back = !!me?.handle && parsed.links.some((l) => { try { const u = new URL(l); return u.hostname.replace(/^www\./, "") === site && u.pathname.replace(/\/+$/, "").endsWith(`/community/u/${me.handle}`); } catch { return false; } });
  const claimed = mine.has("sessionize:" + slug) || parsed.links.some((l) => { const k = normLink(l); return !!k && mine.has(k); });
  const self = back || claimed || (!!me && (similarName(me.name, parsed.name) || nameSimilar(me.name, parsed.name)));
  return { ok: self || !!user.admin, self, strong: back };
}
export async function previewProfile(env, user, input, similarName, opts = {}) {
  const db = env.DB, slug = profileSlug(String(input || "").trim());
  if (!slug) return { error: "bad_url", hint: "Bitte die öffentliche Sessionize-Profil-URL einfügen (sessionize.com/dein-name) oder die Event-Seite bzw. einen Session-Link." };
  const r = await politeGet(env, `https://sessionize.com/${slug}`, { ...opts, ttl: 600 });
  const soft = { error: "parse_failed", hint: "Bitte Event-Seite oder Session-Link einfügen." };
  if (!r.ok) return r.error === "robots_disallow" ? { ...soft, error: "robots" } : soft;
  const p = parseProfilePage(r.body); if (p.error) return { ...soft, error: p.error };
  const own = await ownsProfile(env, user, slug, p, similarName);
  if (!own.ok) return { error: "not_your_profile", hint: "Der Name auf dem Sessionize-Profil passt nicht zu deinem Konto. Trage den Profil-Link bei deinen Kanälen ein oder nutze den gleichen Namen." };
  const profile = await db.prepare("SELECT handle FROM profiles WHERE user_id=? AND public=1 AND handle IS NOT NULL").bind(user.id).first();
  if (!profile) return { error: "need_profile" };
  const token = [...crypto.getRandomValues(new Uint8Array(18))].map((b) => b.toString(16).padStart(2, "0")).join("");
  // Gemerkt wird nur, was zum Bestaetigen noetig ist: Name, Events und Sessions (keine Bio, keine Links, kein Foto)
  const events = p.events.slice(0, 30).map((e) => ({ title: scrubLine(e.title, 120), slug: e.slug, url: safeUrl(e.url), start: e.start, end: e.end, place: scrubLine(e.place, 80), online: !!e.online,
    sessions: e.sessions.slice(0, 30).map((s) => ({ title: scrubLine(s.title, 140), url: safeUrl(s.url), sessionize_id: s.sessionize_id })).filter((s) => s.title.length >= 3) }));
  const items = [];
  events.forEach((e, ei) => { e.sessions.forEach((s, si) => items.push({ id: `${ei}.${si}`, event: e.title, date: e.start, place: e.place || (e.online ? "Online" : ""), session: s.title })); });
  if (!items.length) return { ...soft, error: "no_sessions" };
  const name = scrubLine(p.name, 80);
  await db.batch([db.prepare("DELETE FROM import_preview WHERE created<? OR user_id=?").bind(now() - 3600, user.id),   // je Konto nur die juengste Vorschau
    db.prepare("INSERT INTO import_preview(token,user_id,data,created) VALUES(?,?,?,?)").bind(token, user.id, JSON.stringify({ slug, name, self: own.self, strong: own.strong, events }), now())]);
  return { ok: true, token, name, items };
}
// Bestaetigte Eintraege einspielen.
//  - Event ohne Veranstalter (herrenlos) oder eigenes Event: Sessions kommen live, der Nutzer steht als bestaetigter Speaker darin.
//  - Event eines anderen Veranstalters: nichts wird ohne dessen Freigabe veroeffentlicht. Fuehrt eine Session den Namen schon als Speaker, wird daraus
//    eine Speaker-Anfrage (wie "Bist du das?"); sonst entsteht ein Vorschlag (pending), den der Veranstalter freigibt oder ablehnt.
export async function confirmProfile(env, user, token, picks, opts = {}) {
  const db = env.DB, row = await db.prepare("SELECT * FROM import_preview WHERE token=? AND user_id=?").bind(String(token || ""), user.id).first();
  if (!row || now() - row.created > 3600) return { error: "expired" };
  const d = JSON.parse(row.data), slug = d.slug, want = new Set((Array.isArray(picks) ? picks : []).map(String));
  const profile = await db.prepare("SELECT p.handle,u.name FROM profiles p JOIN users u ON u.id=p.user_id WHERE p.user_id=? AND p.public=1").bind(user.id).first();
  if (!profile?.handle) return { error: "need_profile" };
  const me = d.self ? { n: d.name || profile.name, h: profile.handle, s: "confirmed" } : { n: d.name }, link = !!(d.self && d.strong);
  let sessions = 0, proposed = 0, requested = 0, skipped = 0; const touched = new Set();
  for (let ei = 0; ei < d.events.length; ei++) {
    const e = d.events[ei], chosen = e.sessions.filter((_, si) => want.has(`${ei}.${si}`)); if (!chosen.length) continue;
    const r = await upsertEvent(db, { title: e.title, start: e.start, end: e.end, mode: e.online ? "online" : "onsite", city: (e.place || "").split(",")[0].trim(), country: "", url: e.url, source: "sessionize", source_url: e.url,
      sources: [{ kind: "sessionize_event", ref: e.slug, url: e.url }] }, { now: opts.now, by: user.id });   // Kennung = die Sessionize-Seite des Events, nie das Profil des Speakers
    if (!r.id) { skipped += chosen.length; continue; }
    touched.add(r.id);
    const ev = await db.prepare("SELECT * FROM events WHERE id=?").bind(r.id).first(), foreign = !!(ev.owner_id || ev.org_id) && !(await canManage(db, user, ev, "sessions"));
    const items = chosen.map((s) => ({ cand: { title: s.title, sessionize_id: s.sessionize_id, speakers: [me] }, source: { kind: "sessionize_profile", ref: `${slug}:${s.sessionize_id || normText(s.title)}`, url: s.url } }));
    const o = { now: opts.now, by: user.id, proposer_id: user.id, linkHandle: link };
    if (!foreign) { for (const x of (await upsertSessions(db, ev.id, items, { ...o, trusted: true })).results) x.id ? sessions++ : skipped++; continue; }
    const ctx = await sessionCtx(db, ev.id), ops = [], rest = [];
    for (const it of items) {
      const hit = matchSession(ctx, it.cand), sp = hit ? JSON.parse(hit.speakers || "[]") : [], mineAlready = sp.some((x) => d.self && x.h === profile.handle);
      const named = d.self && !mineAlready ? sp.find((x) => !x.h && normPerson(x.n) === normPerson(me.n)) : null;
      if (mineAlready) { skipped++; continue; }
      if (!named) { rest.push(it); continue; }
      if (named.t) ops.push(db.prepare("DELETE FROM speaker_invites WHERE token=?").bind(named.t));
      delete named.t; delete named.o; named.h = profile.handle; named.s = "invited"; hit.speakers = JSON.stringify(sp);
      ops.push(db.prepare("UPDATE event_sessions SET speakers=? WHERE id=?").bind(hit.speakers, hit.id)); requested++;
    }
    if (ops.length) await db.batch(ops);
    if (rest.length) for (const x of (await upsertSessions(db, ev.id, rest, { ...o, propose: true, status: "pending" }, ctx)).results) x.id ? proposed++ : skipped++;
  }
  await db.prepare("DELETE FROM import_preview WHERE token=?").bind(row.token).run();
  return { ok: true, events: touched.size, sessions, proposed, requested, skipped, linked: sessions };
}
