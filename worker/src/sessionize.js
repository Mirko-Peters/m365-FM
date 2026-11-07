// Sessionize: Organisator-Anbindung (API-ID -> view/All) und Speaker-Profil-Import (oeffentliche Profilseite).
import { politeGet } from "./botfetch.js";
import { upsertEvent, upsertSession, addSource, hash24, normUrl, normLink, normPerson, normText, normEventName, dedupeEventSessions, mergeEvents, queueDupe } from "./eventmerge.js";

const now = () => Math.floor(Date.now() / 1000);
const API_ID = /^[A-Za-z0-9]{4,24}$/;
const clean = (s, n) => String(s ?? "").replace(/<[^>]*>/g, " ").replace(/[<>]/g, "").replace(/https?:\/\/\S+/gi, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, n);
const oneLine = (s, n) => clean(s, n).replace(/\s+/g, " ");
const minute = (s) => { const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(String(s || "")); return m ? `${m[1]}T${m[2]}` : ""; };   // Sessionize liefert Ortszeit ohne Offset

// ---- view/All parsen. Ohne startsAt (Zeitplan nicht veroeffentlicht) bleibt die Zeit leer.
export function parseAllView(j) {
  if (!j || !Array.isArray(j.sessions)) return null;
  const cats = new Map(), rooms = new Map();
  for (const c of j.categories || []) for (const it of c.items || c.categoryItems || []) cats.set(String(it.id), { group: String(c.title || c.name || ""), name: String(it.name || "") });
  for (const r of j.rooms || []) rooms.set(String(r.id), String(r.name || ""));
  const speakers = new Map();
  for (const s of j.speakers || []) {
    const links = (s.links || []).map((l) => l && l.url).filter(Boolean);
    speakers.set(String(s.id), { sz: String(s.id), n: oneLine(s.fullName || [s.firstName, s.lastName].filter(Boolean).join(" "), 80), tagline: oneLine(s.tagLine, 160), bio: clean(s.bio, 1500), photo_src: /^https:\/\//.test(s.profilePicture || "") ? String(s.profilePicture) : "", links });
  }
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

// ---- Fotos: Original-URL merken (R2-Kopierjob), im Worker nach R2 kopieren, sobald moeglich (nie hotlinken)
const PHOTO_HOST = /^(sessionize\.com|[a-z0-9-]+\.sessionize\.com|[a-z0-9-]+\.cloudfront\.net)$/;
export async function copySpeakerPhotos(env, opts = {}) {
  if (!env.PAGES) return { copied: 0 };
  const rows = (await env.DB.prepare("SELECT id,photo_src FROM speaker_ref WHERE photo='' AND photo_src<>'' AND merged_into=0 LIMIT ?").bind(opts.limit || 20).all()).results || [];
  let copied = 0; const f = opts.fetch || globalThis.fetch;
  for (const r of rows) {
    try {
      const u = new URL(r.photo_src); if (u.protocol !== "https:" || !PHOTO_HOST.test(u.hostname)) continue;
      const res = await f(u.href, { headers: { "user-agent": "M365.FM-EventBot (+https://www.m365.fm/bot/)" } });
      const type = (res.headers.get("content-type") || "").split(";")[0];
      if (!res.ok || !/^image\/(jpeg|png|webp|gif)$/.test(type)) continue;
      const buf = new Uint8Array(await res.arrayBuffer()); if (!buf.length || buf.length > 600000) continue;
      const key = `events/speakers/${await hash24(r.photo_src)}.${type.split("/")[1].replace("jpeg", "jpg")}`;
      await env.PAGES.put(key, buf, { httpMetadata: { contentType: type, cacheControl: "public, max-age=31536000, immutable" } });
      await env.DB.prepare("UPDATE speaker_ref SET photo=? WHERE id=?").bind(`${env.IMG_BASE || "https://img.m365.fm"}/${key}`, r.id).run(); copied++;
    } catch { /* naechster Lauf */ }
  }
  return { copied };
}

// ---- Organisator: Endpunkt abrufen und idempotent einspielen
export async function fetchAllView(env, apiId, opts = {}) {
  if (!API_ID.test(String(apiId || ""))) return { error: "bad_id" };
  const r = await politeGet(env, `https://sessionize.com/api/v2/${apiId}/view/All`, { ...opts, ttl: 300, skipRobots: true, accept: "application/json" });   // oeffentliche, schreibgeschuetzte API; Sessionize cached 5 Min
  if (!r.ok) return { error: r.status === 404 ? "not_found" : "fetch_failed" };
  let j; try { j = JSON.parse(r.body); } catch { return { error: "bad_json" }; }
  const p = parseAllView(j); return p ? { data: p } : { error: "bad_json" };
}
export async function syncSessionize(env, ev, opts = {}) {
  const db = env.DB, t = opts.now || now();
  if (!ev.sessionize_api) return { error: "not_linked" };
  const res = await fetchAllView(env, ev.sessionize_api, opts);
  if (res.error) { await db.prepare("UPDATE events SET sessionize_state=? WHERE id=?").bind(res.error, ev.id).run(); return { error: res.error }; }
  const ref = await hash24("sessionize:" + ev.sessionize_api), seen = new Set(); let created = 0, merged = 0;
  for (const s of res.data.sessions.slice(0, 300)) {
    const r = await upsertSession(db, ev.id, s, { kind: "sessionize_api", ref: `${ref}:${s.sessionize_id}` }, { now: t, trusted: true, proposer_id: ev.owner_id || 0 });
    seen.add(r.id); r.action === "created" ? created++ : merged++;
    if (s.level && /^[1-4]00$/.test(s.level.slice(0, 3))) await db.prepare("UPDATE event_sessions SET level=? WHERE id=? AND level=''").bind(s.level.slice(0, 3), r.id).run();
  }
  // Sessions, die dieser Endpunkt frueher lieferte und nicht mehr liefert: ausblenden (retired), nie loeschen
  let retired = 0;
  const old = (await db.prepare("SELECT s.id FROM event_sessions s JOIN session_source x ON x.session_id=s.id AND x.kind='sessionize_api' AND x.ref LIKE ? WHERE s.event_id=? AND s.status='live' AND s.merged_into=0").bind(ref + ":%", ev.id).all()).results || [];
  for (const o of old) if (!seen.has(o.id) && !(await db.prepare("SELECT 1 x FROM session_source WHERE session_id=? AND NOT (kind='sessionize_api' AND ref LIKE ?)").bind(o.id, ref + ":%").first())) { await db.prepare("UPDATE event_sessions SET status='retired' WHERE id=?").bind(o.id).run(); retired++; }
  const dd = await dedupeEventSessions(db, ev.id);
  await db.prepare("UPDATE events SET sessionize_synced=?,sessionize_state='ok' WHERE id=?").bind(t, ev.id).run();
  await addSource(db, "event_source", ev.id, "sessionize_api", ref, "", t);
  return { ok: true, sessions: res.data.sessions.length, created, merged, retired, dupes_merged: dd.merged, queued: dd.queued };
}
// Endpunkt verknuepfen (Berechtigung prueft der Aufrufer). Gleicher Endpunkt an anderem Event = dasselbe Event.
export async function linkSessionize(env, ev, apiId, opts = {}) {
  const db = env.DB; apiId = String(apiId || "").trim();
  if (!apiId) { await db.prepare("UPDATE events SET sessionize_api='',sessionize_state='' WHERE id=?").bind(ev.id).run(); await db.prepare("DELETE FROM event_source WHERE event_id=? AND kind='sessionize_api' AND ref=?").bind(ev.id, await hash24("sessionize:" + ev.sessionize_api)).run(); return { ok: true, unlinked: true }; }
  const m = /sessionize\.com\/api\/v2\/([A-Za-z0-9]+)/.exec(apiId); if (m) apiId = m[1];   // ganze Endpoint-URL eingefuegt
  if (!API_ID.test(apiId)) return { error: "bad_id" };
  const chk = await fetchAllView(env, apiId, opts); if (chk.error) return { error: chk.error };
  const ref = await hash24("sessionize:" + apiId);
  await db.prepare("UPDATE events SET sessionize_api=? WHERE id=?").bind(apiId, ev.id).run();
  await addSource(db, "event_source", ev.id, "sessionize_api", ref, "");
  const other = (await db.prepare("SELECT e.* FROM event_source s JOIN events e ON e.id=s.event_id WHERE s.kind='sessionize_api' AND s.ref=? AND e.id<>? AND e.merged_into=0").bind(ref, ev.id).all()).results || [];
  let merged = 0, queued = 0;
  for (const o of other) {
    if (o.unclaimed || !o.owner_id) { const r = await mergeEvents(db, o.id, ev.id, opts.by || 0, true); if (r.ok) merged++; }
    else if (await queueDupe(db, "event", ev.id, o.id, "same_sessionize_endpoint")) queued++;
  }
  const sync = await syncSessionize(env, { ...ev, sessionize_api: apiId }, opts);
  return { ok: true, merged, queued, sync };
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
// Erwartetes Layout (siehe Fixture): Name in <h1>, Kurzzeile <h2>, Bio in .s-bio, je Event ein Block mit data-event (oder class "…event…"),
// darin Event-Link (sessionize.com/<event>), optional <time datetime> und Orts-Angabe, Sessions als <li> mit Link/Titel.
export function parseProfilePage(html) {
  html = String(html || "").replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "");
  const name = text((/<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html) || [])[1] || (/property="og:title" content="([^"]+)"/i.exec(html) || [])[1] || "").replace(/\s*[|–-]\s*Sessionize.*$/i, "");
  if (!name) return { error: "no_name" };
  const tagline = text((/<h2[^>]*>([\s\S]*?)<\/h2>/i.exec(html) || [])[1] || ""), bio = text((/<(?:div|p)[^>]*class="[^"]*(?:s-bio|bio)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|p)>/i.exec(html) || [])[1] || "");
  const links = [...html.matchAll(/<a[^>]+href="(https?:\/\/[^"]+)"[^>]*class="[^"]*(?:s-link|social)[^"]*"|<a[^>]+class="[^"]*(?:s-link|social)[^"]*"[^>]*href="(https?:\/\/[^"]+)"/gi)].map((m) => dec(m[1] || m[2]));
  const photo = dec((/<img[^>]+class="[^"]*(?:s-photo|profile)[^"]*"[^>]*src="(https:\/\/[^"]+)"/i.exec(html) || [])[1] || "");
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
  return { name, tagline, bio, links: [...new Set(links)], photo_src: photo, events };
}
const nameSimilar = (a, b) => { const x = normPerson(a).split(" "), y = normPerson(b).split(" "); return x.length >= 2 && y.length >= 2 && x[0] === y[0] && x[x.length - 1] === y[y.length - 1]; };
// Gehoert das Profil dem Nutzer? Gleicher Name wie Konto/Profil oder ein Link der Seite steht in den eigenen Kanaelen. Admin darf immer.
async function ownsProfile(db, user, parsed, similarName) {
  if (user.admin) return true;
  const me = await db.prepare("SELECT u.name,p.handle FROM users u LEFT JOIN profiles p ON p.user_id=u.id WHERE u.id=?").bind(user.id).first();
  if (me && (similarName(me.name, parsed.name) || nameSimilar(me.name, parsed.name))) return true;
  const mine = new Set(((await db.prepare("SELECT url FROM channels WHERE owner_type='u' AND owner_id=?").bind(user.id).all()).results || []).map((r) => normLink(r.url)).filter(Boolean));
  return parsed.links.some((l) => mine.has(normLink(l)));
}
export async function previewProfile(env, user, input, similarName, opts = {}) {
  const db = env.DB, slug = profileSlug(String(input || "").trim());
  if (!slug) return { error: "bad_url", hint: "Bitte die öffentliche Sessionize-Profil-URL einfügen (sessionize.com/dein-name) oder die Event-Seite bzw. einen Session-Link." };
  const r = await politeGet(env, `https://sessionize.com/${slug}`, { ...opts, ttl: 600 });
  const soft = { error: "parse_failed", hint: "Bitte Event-Seite oder Session-Link einfügen." };
  if (!r.ok) return r.error === "robots_disallow" ? { ...soft, error: "robots" } : soft;
  const p = parseProfilePage(r.body); if (p.error) return { ...soft, error: p.error };
  if (!(await ownsProfile(db, user, p, similarName))) return { error: "not_your_profile", hint: "Der Name auf dem Sessionize-Profil passt nicht zu deinem Konto. Trage den Profil-Link bei deinen Kanälen ein oder nutze den gleichen Namen." };
  const profile = await db.prepare("SELECT handle FROM profiles WHERE user_id=? AND public=1 AND handle IS NOT NULL").bind(user.id).first();
  if (!profile) return { error: "need_profile" };
  const token = [...crypto.getRandomValues(new Uint8Array(18))].map((b) => b.toString(16).padStart(2, "0")).join("");
  const items = [];
  p.events.slice(0, 30).forEach((e, ei) => { e.sessions.slice(0, 30).forEach((s, si) => items.push({ id: `${ei}.${si}`, event: e.title, date: e.start, place: e.place || (e.online ? "Online" : ""), session: s.title })); });
  if (!items.length) return { ...soft, error: "no_sessions" };
  await db.prepare("DELETE FROM import_preview WHERE created<?").bind(now() - 3600).run();
  await db.prepare("INSERT INTO import_preview(token,user_id,data,created) VALUES(?,?,?,?)").bind(token, user.id, JSON.stringify({ slug, p }), now()).run();
  return { ok: true, token, name: p.name, items };
}
// Bestaetigte Eintraege: Event + Session anlegen/zusammenfuehren, Nutzer als bestaetigten Speaker eintragen
export async function confirmProfile(env, user, token, picks, opts = {}) {
  const db = env.DB, row = await db.prepare("SELECT * FROM import_preview WHERE token=? AND user_id=?").bind(String(token || ""), user.id).first();
  if (!row || now() - row.created > 3600) return { error: "expired" };
  const { slug, p } = JSON.parse(row.data), want = new Set((Array.isArray(picks) ? picks : []).map(String));
  const profile = await db.prepare("SELECT p.handle,u.name FROM profiles p JOIN users u ON u.id=p.user_id WHERE p.user_id=? AND p.public=1").bind(user.id).first();
  if (!profile?.handle) return { error: "need_profile" };
  let events = 0, sessions = 0, linked = 0; const touched = new Set();
  for (let ei = 0; ei < p.events.length; ei++) {
    const e = p.events[ei], chosen = e.sessions.map((s, si) => [s, si]).filter(([, si]) => want.has(`${ei}.${si}`)); if (!chosen.length) continue;
    const ev = await upsertEvent(db, { title: e.title, start: e.start, end: e.end, mode: e.online ? "online" : "onsite", city: (e.place || "").split(",")[0].trim(), country: "", url: e.url, source: "sessionize", source_url: e.url,
      sources: [{ kind: "sessionize_event", ref: e.slug, url: e.url }, { kind: "sessionize_profile", ref: slug, url: `https://sessionize.com/${slug}` }] }, { now: opts.now, owner_id: 0 });
    if (!ev.id) continue;
    if (!touched.has(ev.id)) { touched.add(ev.id); events++; }
    for (const [s] of chosen) {
      const r = await upsertSession(db, ev.id, { title: s.title, start: "", end: "", sessionize_id: s.sessionize_id, speakers: [{ n: p.name || profile.name, sz: "", links: [...p.links, `https://sessionize.com/${slug}`], tagline: p.tagline, bio: p.bio, photo_src: p.photo_src, h: profile.handle, s: "confirmed" }] },
        { kind: "sessionize_profile", ref: `${slug}:${s.sessionize_id || normText(s.title)}`, url: s.url }, { now: opts.now, trusted: true, proposer_id: user.id });
      sessions++; linked++;
    }
  }
  await db.prepare("DELETE FROM import_preview WHERE token=?").bind(row.token).run();
  return { ok: true, events, sessions, linked };
}
