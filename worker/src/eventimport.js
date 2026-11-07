// Event-Import: HTTP-Routen (Sessionize, Community Days, Dubletten, Beanspruchen) und die taeglichen Cron-Aufgaben.
import { canManage, similarName } from "./events.js";
import { linkSessionize, syncSessionize, previewProfile, confirmProfile, copySpeakerPhotos } from "./sessionize.js";
import { runCommunityDays } from "./communitydays.js";
import { decideDupe, listDupes, unmerge } from "./eventmerge.js";
import { rateLimit } from "./util.js";

const now = () => Math.floor(Date.now() / 1000);
export const IMPORT_ROUTE = /^\/api\/(events\/import\/|event\/[a-z0-9-]{3,40}\/(sessionize|claim)|admin\/events\/(import|dupes|unmerge|claims?))/;

export async function dailyEventImport(env, opts = {}) {
  const out = { communitydays: null, sessionize: { synced: 0, failed: 0 }, photos: 0 };
  out.communitydays = await runCommunityDays(env, opts).catch((e) => ({ error: String(e.message || e).slice(0, 120) }));
  const evs = (await env.DB.prepare("SELECT * FROM events WHERE sessionize_api<>'' AND merged_into=0 ORDER BY sessionize_synced LIMIT 40").all()).results || [];
  for (const ev of evs) { const r = await syncSessionize(env, ev, opts).catch(() => ({ error: "x" })); r.ok ? out.sessionize.synced++ : out.sessionize.failed++; }
  out.photos = (await copySpeakerPhotos(env, opts).catch(() => ({ copied: 0 }))).copied;
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
    if (m[2]) { const r = await syncSessionize(env, ev, opts); return J(r, r.error ? 400 : 200); }
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
  // ---- Herrenlose Events beanspruchen (Freigabe durch Admin)
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
      if (method === "GET") return J({ last: JSON.parse((await db.prepare("SELECT v FROM meta WHERE k='communitydays_last'").first())?.v || "null") });
      if (method !== "POST") return J({ error: "method_not_allowed" }, 405);
      const b = await body();
      return J(await runCommunityDays(env, { ...opts, dry: b.dry_run !== false }));   // ohne ausdrueckliches dry_run:false wird nichts geschrieben
    }
    if (path === "/api/admin/events/dupes" && method === "GET") return J({ items: await listDupes(db) }, 200, { "cache-control": "no-store" });
    if (path === "/api/admin/events/dupes" && method === "POST") { const b = await body(), r = await decideDupe(db, +b.id, String(b.action), user.id); return J(r, r.error ? 400 : 200); }
    if (path === "/api/admin/events/unmerge" && method === "POST") { const r = await unmerge(db, +(await body()).log, user.id); return J(r, r.error ? 404 : 200); }
    if (path === "/api/admin/events/claims" && method === "GET") {
      const rows = (await db.prepare("SELECT c.event_id,c.user_id,e.handle,e.title,u.name FROM event_claims c JOIN events e ON e.id=c.event_id JOIN users u ON u.id=c.user_id WHERE c.status='pending' ORDER BY c.created LIMIT 100").all()).results || [];
      return J({ items: rows });
    }
    if (path === "/api/admin/events/claim" && method === "POST") {
      const b = await body(), c = await db.prepare("SELECT * FROM event_claims WHERE event_id=? AND user_id=? AND status='pending'").bind(+b.event_id, +b.user_id).first(); if (!c) return J({ error: "not_found" }, 404);
      if (b.ok === true) { await db.batch([db.prepare("UPDATE event_claims SET status='approved' WHERE event_id=? AND user_id=?").bind(c.event_id, c.user_id), db.prepare("UPDATE event_claims SET status='rejected' WHERE event_id=? AND user_id<>? AND status='pending'").bind(c.event_id, c.user_id), db.prepare("UPDATE events SET owner_id=?,unclaimed=0 WHERE id=? AND unclaimed=1").bind(c.user_id, c.event_id)]); }
      else await db.prepare("UPDATE event_claims SET status='rejected' WHERE event_id=? AND user_id=?").bind(c.event_id, c.user_id).run();
      return J({ ok: true });
    }
  }
  return null;
}
