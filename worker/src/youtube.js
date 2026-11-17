// Creator-Videos fuer den YouTube-Kanal "m365 Show": Der Worker legt eine resumable Upload-Session an (privat), der Browser
// laedt direkt zu YouTube hoch. Abstimmung -> ab Schwelle Aufgabe fuer Mirko -> Freigabe (oeffentlich schalten) in YouTube Studio.
import { dropTranslationOps } from "./privacy.js";
import { gate, inScope } from "./perm.js";
import { decide } from "./editor.js";
import { guestsOf, dropGuests } from "./credits.js";
import { cleanText, rateLimit, isLang } from "./util.js";
import { baseIds } from "./entities.js";
import { sendPush } from "./push.js";
import { award } from "./badges.js";

const THRESHOLD = 25, MIN_AGE = 86400, EXPIRE_DAYS = 30, MAX_BYTES = 2 * 1024 * 1024 * 1024;
const now = () => Math.floor(Date.now() / 1000);
const txt = (s, n) => cleanText(s, n).replace(/[<>]/g, "").replace(/https?:\/\/\S+/gi, "").replace(/\s+/g, " ").trim();
const long = (s, n) => cleanText(s, n).replace(/[<>]/g, "").replace(/https?:\/\/\S+/gi, "").trim();
const parse = (s, d) => { try { return JSON.parse(s); } catch { return d; } };
const slugify = (t) => t.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50);
export const vidSlug = (r) => `${r.id}-${slugify(r.title) || "video"}`;
const api = (env) => env.YT_API || "https://www.googleapis.com";
const YTID = /^[A-Za-z0-9_-]{11}$/;
const PUB = "id,title,description,lang,topics,status,created,published,video_id,note,ai";
const MARK = (n) => `m365fm-${n}`;   // Tag am Video: stammt aus der Upload-Sitzung der Zeile mit diesem nonce (K35)
const STALE = 2 * 86400, GIVEUP = 9 * 86400;   // abgebrochene Uploads ab 2 Tagen bereinigen; YouTube-Sitzungen laufen nach etwa einer Woche ab
const hex = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => b.toString(16).padStart(2, "0")).join("");

export async function token(env) {
  if (!env.YT_CLIENT_ID || !env.YT_CLIENT_SECRET || !env.YT_REFRESH_TOKEN) return null;
  const r = await fetch(env.YT_TOKEN_URL || "https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: env.YT_CLIENT_ID, client_secret: env.YT_CLIENT_SECRET, refresh_token: env.YT_REFRESH_TOKEN, grant_type: "refresh_token" }) });
  if (!r.ok) return null;
  return (await r.json().catch(() => ({}))).access_token || null;
}

async function notifyAdmins(env, v) {
  const db = env.DB, adm = (env.ADMIN_SUBS || "").split(",").map((s) => s.trim());
  const users = (await db.prepare("SELECT id,provider,sub,role FROM users").all()).results || [];
  const ids = users.filter((u) => adm.includes(`${u.provider}:${u.sub}`) || u.role === "editor").map((u) => u.id);
  if (!ids.length || !env.VAPID_PRIVATE_JWK) return;
  const subs = (await db.prepare(`SELECT endpoint,p256dh,auth FROM push_subs WHERE user_id IN (${ids.map(() => "?").join(",")})`).bind(...ids).all()).results || [];
  for (const s of subs) { try { const r = await sendPush(env, s, { title: "Creator-Video: 25 Stimmen erreicht", body: "Video prüfen und in YouTube Studio freigeben: " + v.title, url: `${env.SITE}/community/` }); if (r.gone) await db.batch([db.prepare("DELETE FROM push_topics WHERE endpoint=?").bind(s.endpoint), db.prepare("DELETE FROM topic_queue WHERE channel='push' AND recipient=?").bind(s.endpoint), db.prepare("DELETE FROM topic_deliveries WHERE channel='push' AND recipient=?").bind(s.endpoint), db.prepare("DELETE FROM push_subs WHERE endpoint=?").bind(s.endpoint)]); } catch {} }
}

// Bindung pruefen (K35): Gehoert das YouTube-Video `it` (videos.list part=snippet,status) zur Upload-Sitzung der Zeile v? "" = ja, sonst Grund.
// Neue Zeilen: Tag m365fm-<nonce> der eigenen Sitzung (die Metadaten setzt nur der Worker in init). Altbestand ohne nonce: Credit-Zeile des
// Workers in der Beschreibung (Links aus Mitgliedertext entfernt txt/long) und hochgeladen erst nach Anlage der Zeile (fruehere Kanalvideos nie).
export function bindingProblem(env, v, it) {
  if (!it) return "missing";
  const sn = it.snippet || {};
  if (v.nonce) return (sn.tags || []).includes(MARK(v.nonce)) ? "" : "no_marker";
  const d = String(sn.description || ""), at = Date.parse(sn.publishedAt || "") / 1000;
  if (!d.includes("Community video by ") || !d.includes(`${env.SITE}/community/u/`)) return "no_credit";
  if (!(at >= (v.created || 0) - 600)) return "older_than_row";
  return "";
}
async function ytItems(env, at, ids) {
  const r = await fetch(`${api(env)}/youtube/v3/videos?part=snippet,status&id=${ids.map(encodeURIComponent).join(",")}`, { headers: { authorization: `Bearer ${at}` } }).catch(() => null);
  if (!r || !r.ok) return null;
  return new Map(((await r.json().catch(() => ({}))).items || []).map((i) => [i.id, i]));
}

// Video mit dem Kanal-Token loeschen - nur ein privates/nicht gelistetes Mitglieds-Upload mit gueltiger Bindung, nie ein anderes Kanalvideo.
// -> { deleted } | { skip: Grund } (missing = gibt es nicht mehr, api/no_token = spaeter erneut)
async function dropVideo(env, v) {
  if (!v.video_id) return { skip: "no_id" };
  const t = await token(env); if (!t) return { skip: "no_token" };
  const m = await ytItems(env, t, [v.video_id]); if (!m) return { skip: "api" };
  const it = m.get(v.video_id), why = bindingProblem(env, v, it);
  if (why) { if (why !== "missing") console.warn(`yt: Video der Zeile ${v.id} nicht geloescht (${why})`); return { skip: why }; }
  if (!["private", "unlisted"].includes(it.status?.privacyStatus)) return { skip: "public" };
  const r = await fetch(`${api(env)}/youtube/v3/videos?id=${encodeURIComponent(v.video_id)}`, { method: "DELETE", headers: { authorization: `Bearer ${t}` } }).catch(() => null);
  return r && (r.ok || r.status === 404) ? { deleted: true } : { skip: "api" };
}

// Stand der resumable Sitzung (nur serverseitig, K36): { done, id } fertig hochgeladen | { open } noch offen (308) | { gone } abgelaufen | null Fehler
function sessionInit(env, v, at, init) {
  let same = false; try { same = new URL(v.upload_url).origin === new URL(api(env)).origin; } catch {}
  return { ...init, headers: { ...(init.headers || {}), ...(same ? { authorization: `Bearer ${at}` } : {}) } };   // Kanal-Token nur an den eigenen API-Host
}
async function sessionState(env, v, at) {
  if (!v.upload_url) return null;
  const r = await fetch(v.upload_url, sessionInit(env, v, at, { method: "PUT", headers: { "content-range": `bytes */${v.size || 0}` }, body: "" })).catch(() => null);
  if (!r) return null;
  if (r.status === 200 || r.status === 201) { const id = String((await r.json().catch(() => ({}))).id || ""); return { done: true, id: YTID.test(id) ? id : "" }; }
  if (r.status === 308) return { open: true };
  if (r.status === 404 || r.status === 410) return { gone: true };
  return null;
}
// Abgebrochene Sitzung bereinigen: fertig -> eigenes Video loeschen (Bindung geprueft), offen -> Sitzung abbrechen. true = bei YouTube bleibt nichts.
async function dropSession(env, v, at) {
  if (!v.upload_url) return true;   // Altbestand vor 0053: kein Verweis auf die Sitzung (Rest nur in YouTube Studio erkennbar)
  const s = await sessionState(env, v, at);
  if (!s) return false;
  if (s.gone) return true;
  if (s.done) { if (!s.id) return false; const d = await dropVideo(env, { ...v, video_id: s.id }); return !!d.deleted || d.skip === "missing"; }
  const r = await fetch(v.upload_url, sessionInit(env, v, at, { method: "DELETE" })).catch(() => null);
  return !!r && (r.ok || [404, 410, 499].includes(r.status));
}

// Cron: veroeffentlichte Videos erkennen, Abgelaufene/Haengende aufraeumen
export async function pollVideos(env) {
  const db = env.DB, t = now(), at = await token(env);
  if (!at) return { skip: true };
  const rows = (await db.prepare("SELECT * FROM yt_videos WHERE status IN ('submitted','review') AND video_id<>'' ORDER BY updated LIMIT 50").all()).results || [];
  let pub = 0; const suspect = [];
  if (rows.length) {
    const items = await ytItems(env, at, rows.map((x) => x.video_id));
    if (items) {
      for (const v of rows) {
        if (!items.has(v.video_id)) { await db.prepare("UPDATE yt_videos SET status='rejected',note=?,updated=? WHERE id=?").bind("Video auf YouTube nicht mehr vorhanden", t, v.id).run(); continue; }
        // K35: Bindung unplausibel (fremdes Kanalvideo?) -> nur melden, nichts loeschen, keine Zuschreibung (Badge, Feed, Seite) bei Veroeffentlichung
        if (bindingProblem(env, v, items.get(v.video_id))) { suspect.push(v.id); continue; }
        if (items.get(v.video_id).status?.privacyStatus === "public") {
          await db.prepare("UPDATE yt_videos SET status='published',published=?,updated=? WHERE id=?").bind(t, t, v.id).run(); pub++;
          await award(db, v.user_id, "videomaker").catch(() => 0);
          const pr = await db.prepare("SELECT handle FROM profiles WHERE user_id=? AND public=1").bind(v.user_id).first();
          if (pr?.handle) {   // Creator-Feed
            const curl = `${env.SITE}/community/u/${pr.handle}/videos/`;
            await db.prepare("INSERT OR IGNORE INTO channels(owner_type,owner_id,kind,url,feed) VALUES('u',?,'youtube',?,'')").bind(v.user_id, curl).run();
            const ch = await db.prepare("SELECT id FROM channels WHERE owner_type='u' AND owner_id=? AND url=?").bind(v.user_id, curl).first();
            if (ch) await db.prepare("INSERT OR IGNORE INTO feed_items(channel_id,owner_type,owner_id,url,title,published) VALUES(?,?,?,?,?,?)").bind(ch.id, "u", v.user_id, `${env.SITE}${v.lang === "en" ? "" : "/" + v.lang}/community/video/${vidSlug(v)}/`, v.title, t).run();
          }
        }
      }
    }
  }
  const old = (await db.prepare("SELECT * FROM yt_videos WHERE status='submitted' AND created<?").bind(t - EXPIRE_DAYS * 86400).all()).results || [];
  for (const v of old) { await dropVideo(env, v); await db.prepare("UPDATE yt_videos SET status='expired',updated=? WHERE id=?").bind(t, v.id).run(); }
  // abgebrochene Uploads (K36): erst bei YouTube bereinigen (fertiges Video loeschen bzw. Sitzung abbrechen), dann die Zeile entfernen.
  // Gelingt das bis GIVEUP nicht, bleibt die Zeile als 'abandoned' stehen (Hinweis fuer YouTube Studio), statt den letzten Verweis zu verlieren.
  const stale = (await db.prepare("SELECT * FROM yt_videos WHERE status='uploading' AND created<? ORDER BY created LIMIT 20").bind(t - STALE).all()).results || [];
  let cleaned = 0, unresolved = 0;
  for (const v of stale) {
    if (await dropSession(env, v, at)) { await db.prepare("DELETE FROM yt_videos WHERE id=? AND status='uploading'").bind(v.id).run(); cleaned++; }
    else if (v.created < t - GIVEUP) { await db.prepare("UPDATE yt_videos SET status='abandoned',note=?,updated=? WHERE id=?").bind("Upload abgebrochen, bei YouTube nicht bereinigt: in YouTube Studio pruefen", t, v.id).run(); unresolved++; }
  }
  if (suspect.length) console.warn(`yt: Bindung unplausibel, nur gemeldet: Zeilen ${suspect.join(",")}`);
  return { published: pub, expired: old.length, cleaned, unresolved, suspect };
}

// Pitch ablehnen (nur ueber editor.js decide()): privates Video bei YouTube entfernen, Status setzen. -> false, wenn es das Video nicht gibt
export async function rejectVideo(env, id, note) {
  const db = env.DB, v = await db.prepare("SELECT * FROM yt_videos WHERE id=?").bind(+id).first(); if (!v) return false;
  await dropVideo(env, v);
  await db.prepare("UPDATE yt_videos SET status='rejected',note=?,updated=? WHERE id=?").bind(txt(note || "", 300), now(), v.id).run();
  return true;
}

// Kontoloeschung (index.js deleteAccount, VOR deleteUserVideos): noch nicht veroeffentlichte Uploads des Kontos bei YouTube entfernen
// (privat, Credit-Zeile mit dem Namen), damit nach dem Loeschen der Zeilen kein verwaistes Video ohne Verweis bleibt. Nur gebundene Uploads (dropVideo).
export async function dropUserUploads(env, uid) {
  const rows = (await env.DB.prepare("SELECT * FROM yt_videos WHERE user_id=? AND status IN ('uploading','submitted','review')").bind(uid).all()).results || [];
  if (!rows.length) return;
  const at = await token(env); if (!at) return;
  for (const v of rows) { try { if (v.status === "uploading") await dropSession(env, v, at); else await dropVideo(env, v); } catch {} }
}

export async function deleteUserVideos(db, uid) {
  await db.batch([...dropTranslationOps(db, "video", "yt_videos", "user_id=?", uid), db.prepare("DELETE FROM yt_votes WHERE user_id=? OR vid_id IN (SELECT id FROM yt_videos WHERE user_id=?)").bind(uid, uid), db.prepare("DELETE FROM yt_videos WHERE user_id=?").bind(uid)]);   // K21: Uebersetzungen mit
}

export async function handleVideo(env, request, url, path, user, J) {
  const db = env.DB, method = request.method;

  if (path === "/api/video/list" && method === "GET") {
    const rows = (await db.prepare(
      `SELECT v.id,v.title,v.description,v.lang,v.topics,v.status,v.created,v.published,v.video_id,p.handle,u.name,(SELECT COUNT(*) FROM yt_votes x WHERE x.vid_id=v.id) votes
       FROM yt_videos v JOIN profiles p ON p.user_id=v.user_id AND p.public=1 AND p.handle IS NOT NULL JOIN users u ON u.id=v.user_id AND u.banned=0
       WHERE v.status IN ('submitted','review','published') ORDER BY (v.status='published') DESC, v.created DESC LIMIT 300`).all()).results || [];
    const mine = user ? ((await db.prepare("SELECT vid_id FROM yt_votes WHERE user_id=?").bind(user.id).all()).results || []).map((x) => x.vid_id) : [];
    return J({ threshold: THRESHOLD, items: rows.map((r) => ({ ...r, video_id: r.status === "published" ? r.video_id : "", topics: parse(r.topics, []), slug: vidSlug(r), voted: mine.includes(r.id) })) }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/video/export" && method === "GET") {
    const rows = (await db.prepare(
      `SELECT v.id,v.title,v.description,v.lang,v.topics,v.created,v.published,v.video_id,v.ai,p.handle,u.name
       FROM yt_videos v JOIN profiles p ON p.user_id=v.user_id AND p.public=1 AND p.handle IS NOT NULL JOIN users u ON u.id=v.user_id AND u.banned=0
       WHERE v.status='published' ORDER BY v.published DESC LIMIT 1000`).all()).results || [];
    const gs = await guestsOf(db, "video", rows.map((r) => r.id));
    return J({ items: rows.map((r) => ({ ...r, topics: parse(r.topics, []), slug: vidSlug(r), guests: gs[r.id] || [] })) }, 200, { "cache-control": "public, max-age=300" });
  }

  if (path.startsWith("/api/admin/video")) {
    const g = await gate(db, user, "queue.review"); if (!g.ok) return J({ error: "forbidden" }, 403);   // Editoren und Admin (perm.js can())
    if (path === "/api/admin/video" && method === "GET") {
      const rows = (await db.prepare("SELECT v.id,v.title,v.description,v.lang,v.topics,v.status,v.video_id,v.ai,v.created,u.name,(SELECT COUNT(*) FROM yt_votes x WHERE x.vid_id=v.id) votes FROM yt_videos v JOIN users u ON u.id=v.user_id WHERE v.status IN ('review','submitted') ORDER BY (v.status='review') DESC, v.created").all()).results || [];
      return J({ items: rows.filter((r) => inScope(g.actor, { topics: parse(r.topics, []), lang: r.lang })).map(({ topics, ...r }) => ({ ...r, youtube: r.video_id ? `https://studio.youtube.com/video/${r.video_id}/edit` : "" })), threshold: THRESHOLD });
    }
    if (path === "/api/admin/video/reject" && method === "POST") {   // Entscheidung: can() (eigener Inhalt, eigene Firma, Fachbereich, Tageslimit) und Protokoll in editor.js decide()
      const b = await request.json().catch(() => ({})), r = await decide(env, user, { kind: "video", id: String(+b.id), action: "reject", reason: b.note || "", legacy: true });
      return J(r.body, r.status);
    }
    if (path === "/api/admin/video/poll" && method === "POST") return J(await pollVideos(env));
    return null;
  }

  if (!user) return J({ error: "login" }, 401);

  if (path === "/api/video/mine" && method === "GET") {
    const rows = (await db.prepare(`SELECT ${PUB},(SELECT COUNT(*) FROM yt_votes x WHERE x.vid_id=yt_videos.id) votes FROM yt_videos WHERE user_id=? AND status NOT IN ('uploading','abandoned') ORDER BY created DESC LIMIT 50`).bind(user.id).all()).results || [];
    const gs = await guestsOf(db, "video", rows.map((r) => r.id), true);
    return J({ items: rows.map((r) => ({ ...r, video_id: r.status === "published" ? r.video_id : "", topics: parse(r.topics, []), slug: vidSlug(r), guests: gs[r.id] || [] })), threshold: THRESHOLD, configured: !!(env.YT_CLIENT_ID && env.YT_CLIENT_SECRET && env.YT_REFRESH_TOKEN) });
  }

  if (path === "/api/video/init" && method === "POST") {   // legt die resumable Upload-Session an; der Browser PUT die Datei direkt zu YouTube
    const at = await token(env); if (!at) return J({ error: "not_configured" }, 503);
    const pr = await db.prepare("SELECT handle,public FROM profiles WHERE user_id=?").bind(user.id).first();
    if (!(pr?.public && pr.handle)) return J({ error: "need_profile" }, 400);
    if (!user.admin && !(await rateLimit(db, `yt:${user.id}`, 1, 7 * 86400))) return J({ error: "rate_limit" }, 429);
    const b = await request.json().catch(() => ({}));
    const title = txt(b.title || "", 100), desc = long(b.description || "", 4000), lang = String(b.lang || "en"), size = +b.size || 0, ctype = String(b.type || "video/mp4");
    if (title.length < 5) return J({ error: "title" }, 400);
    if (desc.length < 30) return J({ error: "desc" }, 400);
    if (lang !== "en" && !isLang(lang)) return J({ error: "bad_lang" }, 400);
    if (b.rights !== true && b.rights !== 1 && b.rights !== "1") return J({ error: "rights" }, 400);
    if (!/^video\/[a-z0-9.+-]+$/i.test(ctype) || size < 1) return J({ error: "file" }, 400);
    if (size > MAX_BYTES) return J({ error: "too_big" }, 413);
    const known = await baseIds(env), tp = [];
    for (const x of (Array.isArray(b.topics) ? b.topics : []).slice(0, 10)) { if (!known.has(x)) return J({ error: "bad_topic", topic: x }, 400); if (!tp.includes(x)) tp.push(x); }
    const ai = b.ai ? 1 : 0;
    const credit = `\n\nCommunity video by ${user.name} – ${env.SITE}/community/u/${pr.handle}/${ai ? "\nAI use disclosed by the author." : ""}`;
    const nonce = hex(16);   // K35: Marker der Sitzung am Video (Tag), nur so laesst sich ein Video spaeter dieser Zeile zuordnen
    const meta = { snippet: { title, description: desc + credit, categoryId: "28", defaultLanguage: lang, tags: [MARK(nonce)] }, status: { privacyStatus: "private", selfDeclaredMadeForKids: false } };
    // K36: jede Sitzung kostet Kontingent des Kanal-Projekts (videos.insert) - Tageslimit fuer alle Mitglieder zusammen (nach dem Limit je Konto)
    if (!user.admin && !(await rateLimit(db, "yt:init:all", +env.YT_INIT_PER_DAY || 5, 86400))) return J({ error: "youtube", status: 429 }, 429);
    const r = await fetch(`${api(env)}/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status`, { method: "POST",
      headers: { authorization: `Bearer ${at}`, "content-type": "application/json; charset=UTF-8", "x-upload-content-type": ctype, "x-upload-content-length": String(size), origin: new URL(env.SITE).origin }, body: JSON.stringify(meta) });
    const loc = r.headers.get("location"); if (!r.ok || !loc) return J({ error: "youtube", status: r.status }, 502);
    const t = now(), ins = await db.prepare("INSERT INTO yt_videos(user_id,title,description,lang,topics,status,ai,created,updated,upload_url,size,nonce) VALUES(?,?,?,?,?,'uploading',?,?,?,?,?,?)").bind(user.id, title, desc, lang, JSON.stringify(tp), ai, t, t, loc, size, nonce).run();
    return J({ ok: true, id: ins.meta.last_row_id, upload_url: loc });
  }

  if (path === "/api/video/confirm" && method === "POST") {   // Browser meldet den Abschluss; gebunden wird nur das Video aus der eigenen Upload-Sitzung (K35)
    if (!(await rateLimit(db, `ytc:${user.id}`, 10, 3600))) return J({ error: "rate_limit" }, 429);
    const b = await request.json().catch(() => ({}));
    const v = await db.prepare("SELECT * FROM yt_videos WHERE id=? AND user_id=? AND status='uploading'").bind(+b.id, user.id).first(); if (!v) return J({ error: "not_found" }, 404);
    if (!v.nonce) return J({ error: "verify" }, 400);   // Sitzung von vor 0053 ohne Marker: neu einreichen
    const at = await token(env); if (!at) return J({ error: "not_configured" }, 503);
    // Die Sitzung selbst nennt die Video-ID (serverseitig gespeicherte upload_url); die Angabe des Browsers zaehlt nur, wenn sie dazu passt
    const s = await sessionState(env, v, at), sent = String(b.video_id || "");
    if (s?.open) return J({ error: "verify" }, 400);
    if (s?.done && s.id && sent && sent !== s.id) return J({ error: "verify" }, 400);
    const vid = s?.done && s.id ? s.id : sent;
    if (!YTID.test(vid)) return J({ error: "bad_video" }, 400);
    const m = await ytItems(env, at, [vid]), it = m?.get(vid);
    if (!it || bindingProblem(env, v, it) || it.status?.privacyStatus !== "private") return J({ error: "verify" }, 400);
    const r = await db.prepare("UPDATE yt_videos SET status='submitted',video_id=?,upload_url='',updated=? WHERE id=? AND status='uploading' AND NOT EXISTS (SELECT 1 FROM yt_videos x WHERE x.video_id=?)").bind(vid, now(), v.id, vid).run();
    if (!r.meta?.changes) return J({ error: "duplicate" }, 400);
    return J({ ok: true, id: v.id });
  }

  if (path === "/api/video/delete" && method === "POST") {
    const b = await request.json().catch(() => ({})), v = await db.prepare("SELECT * FROM yt_videos WHERE id=? AND (user_id=? OR ?=1)").bind(+b.id, user.id, user.admin ? 1 : 0).first(); if (!v) return J({ error: "not_found" }, 404);
    if (v.status === "published" && !user.admin) return J({ error: "published" }, 400);
    if (v.status === "uploading") {   // K36: Sitzung bei YouTube bereinigen; klappt das gerade nicht, raeumt der Cron spaeter auf
      const at = await token(env);
      if (!at || !(await dropSession(env, v, at))) return J({ ok: true, pending: true });
    } else if (v.status !== "published") {
      const d = await dropVideo(env, v);
      if (d.skip === "api" || d.skip === "no_token") return J({ error: "youtube" }, 503);   // sonst ginge der letzte Verweis auf ein eigenes Video verloren
      if (d.skip === "public" && !user.admin) return J({ error: "published" }, 400);   // schon oeffentlich geschaltet: bleibt, bis der Abgleich es als veroeffentlicht fuehrt
    }
    await db.batch([db.prepare("DELETE FROM yt_votes WHERE vid_id=?").bind(v.id), db.prepare("DELETE FROM yt_videos WHERE id=?").bind(v.id), db.prepare("DELETE FROM comments WHERE vid=?").bind("video" + v.id), db.prepare("DELETE FROM item_guests WHERE kind='video' AND item_id=?").bind(v.id)]);
    return J({ ok: true });
  }

  if (path === "/api/video/vote" && method === "POST") {
    if (!(await rateLimit(db, `ytv:${user.id}`, 60, 3600))) return J({ error: "rate_limit" }, 429);
    if ((user.created || 0) > now() - MIN_AGE && !user.admin) return J({ error: "too_new" }, 400);
    const b = await request.json().catch(() => ({})), v = await db.prepare("SELECT * FROM yt_videos WHERE id=? AND status IN ('submitted','review')").bind(+b.id).first(); if (!v) return J({ error: "not_found" }, 404);
    if (v.user_id === user.id) return J({ error: "own" }, 400);
    const has = await db.prepare("SELECT 1 x FROM yt_votes WHERE vid_id=? AND user_id=?").bind(v.id, user.id).first();
    if (has) await db.prepare("DELETE FROM yt_votes WHERE vid_id=? AND user_id=?").bind(v.id, user.id).run();
    else await db.prepare("INSERT INTO yt_votes(vid_id,user_id,created) VALUES(?,?,?)").bind(v.id, user.id, now()).run();
    const n = (await db.prepare("SELECT COUNT(*) n FROM yt_votes WHERE vid_id=?").bind(v.id).first()).n;
    if (n >= THRESHOLD && v.status === "submitted") { await db.prepare("UPDATE yt_videos SET status='review',updated=? WHERE id=?").bind(now(), v.id).run(); await notifyAdmins(env, v).catch(() => 0); }
    return J({ ok: true, votes: n, voted: !has });
  }
  return null;
}
