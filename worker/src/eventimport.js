// Event-Import: HTTP-Routen (Sessionize, Community Days, Dubletten, Beanspruchen) und der gedeckelte Cron-Lauf.
import { canManage, similarName } from "./events.js";
import { linkSessionize, syncSessionize, previewProfile, confirmProfile, SYNC_CAP } from "./sessionize.js";
import { runCommunityDays } from "./communitydays.js";
import { backfillKeys, decideDupe, listDupes, listMerges, unmerge } from "./eventmerge.js";
import { ensureDirectoryCols } from "./directory.js";
import { rateLimit } from "./util.js";

const now = () => Math.floor(Date.now() / 1000);
export const IMPORT_ROUTE = /^\/api\/(events\/import\/|event\/[a-z0-9-]{3,40}\/(sessionize|claim)|admin\/events\/(import|dupes|unmerge|claims?))/;

// Deckel je Lauf. Ein Lauf bleibt damit weit unter den Grenzen eines Worker-Aufrufs (1.000 Subrequests): wenige Abrufe, gebuendelte D1-Aufrufe.
// Was nicht in einen Lauf passt, folgt in den naechsten (Fortschritt: meta communitydays_state, session_source.hash, events.sessionize_state='partial').
export const CAP = { requests: 12, cdEvents: 12, szEvents: 3, szSessions: SYNC_CAP, rekey: 150 };
const DUE = 20 * 3600;   // ein verknuepfter Sessionize-Endpunkt wird etwa einmal am Tag abgeglichen
// Ein Stueck Event-Import: Aufraeumen, Schluessel-Rueckfuellung, Community Days, Sessionize-Abgleich.
// Laeuft in einem eigenen Cron-Aufruf (siehe index.js), nicht im Aufruf der Digests.
export async function runEventImport(env, opts = {}) {
  const db = env.DB, t = opts.now || now(), state = opts.state || { last: {}, count: 0 }, out = {};
  await ensureDirectoryCols(db);
  await db.batch([db.prepare("DELETE FROM import_preview WHERE created<?").bind(t - 3600), db.prepare("DELETE FROM import_cache WHERE fetched<?").bind(t - 7 * 86400)]);   // abgelaufene Vorschauen (Namen, Sessions) und alter Abruf-Cache
  out.keys = await backfillKeys(db, CAP.rekey);
  if (out.keys.events >= CAP.rekey) return { ...out, waiting: "keys" };   // Altbestand noch nicht vollstaendig mit Schluesseln versehen: erst danach importieren, sonst entstuenden Dubletten
  out.communitydays = await runCommunityDays(env, { ...opts, state, cap: CAP.cdEvents, maxRequests: CAP.requests }).catch((e) => ({ error: String(e.message || e).slice(0, 120) }));
  const evs = (await db.prepare("SELECT * FROM events WHERE sessionize_api<>'' AND merged_into=0 AND (sessionize_state='partial' OR sessionize_synced<?) ORDER BY (sessionize_state='partial') DESC,sessionize_synced LIMIT ?").bind(t - DUE, CAP.szEvents).all()).results || [];
  let left = CAP.szSessions; out.sessionize = { synced: 0, partial: 0, failed: 0 };
  for (const ev of evs) {
    if (left <= 0) break;
    const r = await syncSessionize(env, ev, { ...opts, state, maxRequests: CAP.requests + CAP.szEvents, cap: left, now: t }).catch(() => ({ error: "x" }));
    if (r.error) { out.sessionize.failed++; continue; }
    left -= r.created + r.updated + r.merged; r.partial ? out.sessionize.partial++ : out.sessionize.synced++;
  }
  return out;
}
export async function handleEventImport(env, request, url, path, user, J) {
  const db = env.DB, method = request.method, need = () => (user ? null : J({ error: "login" }, 401)), body = async () => await request.json().catch(() => ({})); let m;
  const opts = env.IMPORT_OPTS || {};   // Tests: { fetch, sleep }
  // ---- Organisator: Sessionize-Endpunkt (die ID wird nie ausgegeben)
  if ((m = path.match(/^\/api\/event\/([a-z0-9-]{3,40})\/sessionize(\/sync)?$/))) {
    if (need()) return need();
    const ev = await db.prepare("SELECT * FROM events WHERE handle=? AND merged_into=0").bind(m[1]).first(); if (!ev) return J({ error: "not_found" }, 404);
    if (!(await canManage(db, user, ev, "roles"))) return J({ error: "forbidden" }, 403);   // Organisator, Co-Organisator, Eigentuemer, Firmen-Admin, Admin
    if (method === "GET" && !m[2]) {
      const n = (await db.prepare("SELECT COUNT(*) n FROM event_sessions WHERE event_id=? AND merged_into=0").bind(ev.id).first()).n;
      return J({ linked: !!ev.sessionize_api, synced: ev.sessionize_synced, state: ev.sessionize_state, sessions: n }, 200, { "cache-control": "no-store" });
    }
    if (method !== "POST") return J({ error: "method_not_allowed" }, 405);
    if (!(await rateLimit(db, `szsync:${user.id}`, 20, 3600))) return J({ error: "rate_limit" }, 429);
    if (m[2]) { const r = await syncSessionize(env, ev, { ...opts, by: user.id }); return J(r, r.error ? 400 : 200); }
    const b = await body(), r = await linkSessionize(env, ev, b.api_id, { ...opts, by: user.id });
    return J(r, r.error ? 400 : 200);
  }
  // ---- Speaker: Profil-URL -> Vorschau -> Bestaetigung
  if (path === "/api/events/import/sessionize-profile/preview" && method === "POST") {
    if (need()) return need();
    if (!(await rateLimit(db, `szprof:${user.id}`, 6, 3600))) return J({ error: "rate_limit" }, 429);
    const r = await previewProfile(env, user, (await body()).url, similarName, opts);
    return J(r, r.error ? (r.error === "not_your_profile" ? 403 : r.error === "need_profile" ? 409 : 422) : 200, { "cache-control": "no-store" });
  }
  if (path === "/api/events/import/sessionize-profile/confirm" && method === "POST") {
    if (need()) return need();
    const b = await body(), r = await confirmProfile(env, user, b.token, b.items, opts);
    return J(r, r.error ? (r.error === "need_profile" ? 409 : 400) : 200);
  }
  // ---- Herrenlose (importierte) Events beanspruchen; ein Admin gibt frei
  if ((m = path.match(/^\/api\/event\/([a-z0-9-]{3,40})\/claim$/)) && method === "POST") {
    if (need()) return need();
    const ev = await db.prepare("SELECT * FROM events WHERE handle=? AND unclaimed=1 AND merged_into=0").bind(m[1]).first(); if (!ev) return J({ error: "not_found" }, 404);
    if (!(await db.prepare("SELECT 1 x FROM profiles WHERE user_id=? AND public=1").bind(user.id).first())) return J({ error: "need_profile" }, 409);
    if (!(await rateLimit(db, `evclaim:${user.id}`, 5, 86400))) return J({ error: "rate_limit" }, 429);
    await db.prepare("INSERT INTO event_claims(event_id,user_id,status,created) VALUES(?,?,'pending',?) ON CONFLICT(event_id,user_id) DO UPDATE SET status='pending',created=excluded.created WHERE event_claims.status='rejected'").bind(ev.id, user.id, now()).run();
    return J({ ok: true, status: "pending" });
  }
  // ---- Admin
  if (path.startsWith("/api/admin/events/")) {
    if (!user?.admin) return J({ error: "forbidden" }, 403);
    if (path === "/api/admin/events/import") {
      if (method === "GET") { const v = async (k) => JSON.parse((await db.prepare("SELECT v FROM meta WHERE k=?").bind(k).first())?.v || "null"); return J({ last: await v("communitydays_last"), state: await v("communitydays_state") }); }
      if (method !== "POST") return J({ error: "method_not_allowed" }, 405);
      const b = await body(), dry = b.dry_run !== false;   // ohne ausdrueckliches dry_run:false wird nichts geschrieben
      return J(await runCommunityDays(env, { ...opts, dry, force: !dry, cap: CAP.cdEvents, maxRequests: CAP.requests }));   // echter Lauf: neuen Durchgang beginnen, erstes Stueck sofort, der Rest folgt im Cron
    }
    if (path === "/api/admin/events/dupes" && method === "GET") return J({ items: await listDupes(db), recent: await listMerges(db) }, 200, { "cache-control": "no-store" });   // recent: letzte (auch automatische) Zusammenfuehrungen mit Protokoll-ID zum Zuruecknehmen
    if (path === "/api/admin/events/dupes" && method === "POST") { const b = await body(), r = await decideDupe(db, +b.id, String(b.action), user.id); return J(r, r.error ? 400 : 200); }
    if (path === "/api/admin/events/unmerge" && method === "POST") { const r = await unmerge(db, +(await body()).log, user.id); return J(r, r.error ? 404 : 200); }
    if (path === "/api/admin/events/claims" && method === "GET") {
      const rows = (await db.prepare("SELECT c.event_id,c.user_id,e.handle,e.title,u.name FROM event_claims c JOIN events e ON e.id=c.event_id AND e.unclaimed=1 AND e.merged_into=0 JOIN users u ON u.id=c.user_id AND u.banned=0 AND u.merged_into IS NULL WHERE c.status='pending' ORDER BY c.created LIMIT 100").all()).results || [];
      return J({ items: rows });
    }
    if (path === "/api/admin/events/claim" && method === "POST") {
      const b = await body(), c = await db.prepare("SELECT * FROM event_claims WHERE event_id=? AND user_id=? AND status='pending'").bind(+b.event_id, +b.user_id).first(); if (!c) return J({ error: "not_found" }, 404);
      const reject = () => db.prepare("UPDATE event_claims SET status='rejected' WHERE event_id=? AND user_id=?").bind(c.event_id, c.user_id).run();
      if (b.ok !== true) { await reject(); return J({ ok: true }); }
      // Freigabe nur an ein aktives Konto (nicht gesperrt, nicht in ein anderes Konto zusammengefuehrt) und nur solange das Event noch herrenlos ist
      const u = await db.prepare("SELECT id FROM users WHERE id=? AND banned=0 AND merged_into IS NULL").bind(c.user_id).first();
      const ev = await db.prepare("SELECT id FROM events WHERE id=? AND unclaimed=1 AND merged_into=0").bind(c.event_id).first();
      if (!u || !ev) { await reject(); return J({ error: u ? "not_claimable" : "user_gone" }, 409); }
      await db.batch([db.prepare("UPDATE event_claims SET status='approved' WHERE event_id=? AND user_id=?").bind(c.event_id, c.user_id), db.prepare("UPDATE event_claims SET status='rejected' WHERE event_id=? AND user_id<>? AND status='pending'").bind(c.event_id, c.user_id), db.prepare("UPDATE events SET owner_id=?,unclaimed=0 WHERE id=? AND unclaimed=1").bind(c.user_id, c.event_id)]);
      return J({ ok: true });
    }
  }
  return null;
}
