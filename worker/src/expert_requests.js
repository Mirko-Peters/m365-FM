import { cleanText, isLang, rateLimit } from "./util.js";
import { baseIds } from "./entities.js";
import { sendPush } from "./push.js";

const FORMATS = ["quote", "interview", "article", "podcast", "talk"];
const now = () => Math.floor(Date.now() / 1000);
const parse = (s) => { try { const x = JSON.parse(s || "[]"); return Array.isArray(x) ? x : []; } catch { return []; } };
const text = (s, n) => cleanText(s, n).replace(/[<>]/g, "").replace(/https?:\/\/\S+/gi, "").replace(/\s+/g, " ").trim();
const validLang = (lang) => lang === "en" || isLang(lang);
const blocked = async (db, a, b) => !!(await db.prepare("SELECT 1 x FROM msg_blocks WHERE (user_id=?1 AND blocked_id=?2) OR (user_id=?2 AND blocked_id=?1)").bind(a, b).first());
const blockedUsers = async (db, userId) => {
  const rows = (await db.prepare("SELECT user_id,blocked_id FROM msg_blocks WHERE user_id=? OR blocked_id=?").bind(userId, userId).all()).results || [];
  return new Set(rows.map((r) => r.user_id === userId ? r.blocked_id : r.user_id));
};
const publicRequest = ({ user_id, ...r }) => ({ ...r, topics: parse(r.topics) });

const EXPERT_SQL = `SELECT DISTINCT g.user_id,g.topics,g.langs,e.eid
    FROM guest_listings g
    JOIN users u ON u.id=g.user_id AND u.banned=0
    JOIN profiles pr ON pr.user_id=g.user_id AND pr.public=1 AND pr.handle IS NOT NULL
    JOIN expertise e ON e.owner_type='u' AND e.owner_id=g.user_id AND e.level>=3
    JOIN programs p ON p.owner_type='u' AND p.owner_id=g.user_id AND p.verified=1 AND p.program IN ('mvp','mct')
    WHERE g.kind='speaker' AND g.active=1`;
const profileRows = async (db, userId) => (await db.prepare(`${EXPERT_SQL} AND g.user_id=?`).bind(userId).all()).results || [];
const requestMatches = (rows, request) => {
  const topics = new Set(parse(request.topics));
  return rows.some((row) => {
    const listed = parse(row.topics), langs = parse(row.langs);
    return langs.includes(request.lang) && topics.has(row.eid) && listed.includes(row.eid);
  });
};

async function matchingExperts(db, request) {
  const rows = (await db.prepare(`${EXPERT_SQL} AND g.user_id<>?`).bind(request.user_id).all()).results || [];
  const topics = new Set(parse(request.topics)), candidates = new Map();
  for (const row of rows) {
    const listed = parse(row.topics), langs = parse(row.langs);
    if (!langs.includes(request.lang) || !topics.has(row.eid) || !listed.includes(row.eid)) continue;
    const current = candidates.get(row.user_id) || new Set();
    current.add(row.eid);
    candidates.set(row.user_id, current);
  }
  return [...candidates.entries()].map(([id, shared]) => ({ id, score: shared.size * 3, shared: [...shared] })).sort((a, b) => b.score - a.score);
}

async function visibleMatches(env, userId) {
  const db = env.DB, t = now(), rows = (await db.prepare(`SELECT r.*,u.name author,
    EXISTS(SELECT 1 FROM expert_request_replies x WHERE x.request_id=r.id AND x.user_id=?) responded
    FROM expert_requests r
    JOIN users u ON u.id=r.user_id AND u.banned=0
    WHERE r.status='open' AND r.deadline>=? AND r.user_id<>? ORDER BY r.created DESC LIMIT 500`).bind(userId, new Date(t * 1000).toISOString().slice(0, 10), userId).all()).results || [];
  const profile = await profileRows(db, userId);
  if (!profile.length) return [];
  const blocks = await blockedUsers(db, userId);
  const items = [];
  for (const r of rows) {
    if (requestMatches(profile, r) && !blocks.has(r.user_id)) items.push(publicRequest(r));
  }
  return items;
}

async function notify(env, userId, payload) {
  if (!env.VAPID_PRIVATE_JWK || !env.VAPID_PUBLIC || !env.VAPID_SUBJECT) return;
  const db = env.DB, subs = (await db.prepare("SELECT endpoint,p256dh,auth FROM push_subs WHERE user_id=? LIMIT 20").bind(userId).all()).results || [];
  for (const sub of subs) {
    try { const result = await sendPush(env, sub, payload); if (result.gone) await db.prepare("DELETE FROM push_subs WHERE endpoint=?").bind(sub.endpoint).run(); } catch { /* Push ist eine optionale Benachrichtigung. */ }
  }
}

async function notifyExperts(env, request) {
  if (!env.VAPID_PRIVATE_JWK || !env.VAPID_PUBLIC || !env.VAPID_SUBJECT) return;
  const db = env.DB, users = await matchingExperts(db, request);
  const blocks = await blockedUsers(db, request.user_id);
  for (const expert of users.slice(0, 100)) {
    if (!blocks.has(expert.id)) await notify(env, expert.id, { title: "M365.FM · Publisher-Anfrage", body: request.title, url: `${env.SITE}/community/#c-guests`, tag: `expert-request-${request.id}` });
  }
}

export async function deleteUserExpertRequests(db, userId) {
  await db.batch([
    db.prepare("DELETE FROM expert_request_reports WHERE user_id=? OR request_id IN (SELECT id FROM expert_requests WHERE user_id=?)").bind(userId, userId),
    db.prepare("DELETE FROM expert_request_replies WHERE user_id=? OR request_id IN (SELECT id FROM expert_requests WHERE user_id=?)").bind(userId, userId),
    db.prepare("DELETE FROM expert_requests WHERE user_id=?").bind(userId),
  ]);
}

export async function handleExpertRequests(env, request, path, user, J) {
  const db = env.DB, method = request.method, body = async () => request.json().catch(() => ({}));
  if (path === "/api/admin/expert-requests/reports" && method === "GET") {
    if (!user?.admin) return J({ error: user ? "forbidden" : "login" }, user ? 403 : 401);
    const reports = (await db.prepare(`SELECT r.request_id,r.user_id,r.reason,r.created,e.title,e.description,e.status
      FROM expert_request_reports r JOIN expert_requests e ON e.id=r.request_id ORDER BY r.created DESC LIMIT 100`).all()).results || [];
    return J({ reports });
  }
  if (!user) return J({ error: "login" }, 401);
  if (path === "/api/expert-requests/list" && method === "GET") {
    return J({ items: await visibleMatches(env, user.id) });
  }
  if (path === "/api/expert-requests/matches" && method === "GET") {
    const owned = (await db.prepare(`SELECT r.*, (SELECT COUNT(*) FROM expert_request_replies x WHERE x.request_id=r.id) replies
      FROM expert_requests r WHERE r.user_id=? ORDER BY r.created DESC LIMIT 50`).bind(user.id).all()).results || [];
    const items = [];
    for (const r of owned) {
      const replies = (await db.prepare(`SELECT x.id,x.body,x.created,u.name expert FROM expert_request_replies x
        JOIN users u ON u.id=x.user_id AND u.banned=0 WHERE x.request_id=? ORDER BY x.created DESC LIMIT 20`).bind(r.id).all()).results || [];
      items.push({ ...publicRequest(r), replies });
    }
    return J({ requests: items, matches: await visibleMatches(env, user.id) });
  }
  if (path === "/api/expert-requests/create" && method === "POST") {
    const b = await body(), t = now(), account = await db.prepare("SELECT created FROM users WHERE id=? AND banned=0").bind(user.id).first();
    if (!account || t - account.created < 86400) return J({ error: "account_too_new" }, 403);
    const title = text(b.title, 120), description = text(b.description, 1000), format = FORMATS.includes(b.format) ? b.format : "";
    const lang = String(b.lang || ""), deadline = String(b.deadline || "");
    if (title.length < 3 || description.length < 20) return J({ error: "text" }, 400);
    if (!format) return J({ error: "format" }, 400);
    if (!validLang(lang)) return J({ error: "lang" }, 400);
    const date = new Date(`${deadline}T00:00:00Z`), today = new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== deadline || deadline < today) return J({ error: "deadline" }, 400);
    const known = await baseIds(env), topics = [];
    if (!Array.isArray(b.topics) || b.topics.length > 10) return J({ error: "topics" }, 400);
    for (const eid of b.topics) {
      if (typeof eid !== "string" || !known.has(eid)) return J({ error: "topic", topic: eid }, 400);
      if (!topics.includes(eid)) topics.push(eid);
    }
    if (!topics.length) return J({ error: "topics" }, 400);
    const result = await db.prepare(`INSERT INTO expert_requests(user_id,title,description,topics,format,lang,deadline,created)
      SELECT ?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM expert_requests WHERE user_id=? AND created>?)<5`)
      .bind(user.id, title, description, JSON.stringify(topics), format, lang, deadline, t, user.id, t - 7 * 86400).run();
    if (!result.meta.changes) return J({ error: "weekly_limit" }, 429);
    const saved = { id: result.meta.last_row_id, user_id: user.id, title, description, topics: JSON.stringify(topics), format, lang, deadline };
    await notifyExperts(env, saved).catch(() => {});
    return J({ ok: true, id: saved.id });
  }
  if (path === "/api/expert-requests/respond" && method === "POST") {
    const b = await body(), id = Number(b.id);
    if (!Number.isSafeInteger(id) || id < 1) return J({ error: "not_found" }, 404);
    const item = await db.prepare("SELECT * FROM expert_requests WHERE id=? AND status='open' AND deadline>=?")
      .bind(id, new Date().toISOString().slice(0, 10)).first();
    if (!item || !requestMatches(await profileRows(db, user.id), item)) return J({ error: "not_found" }, 404);
    if (await blocked(db, user.id, item.user_id)) return J({ error: "blocked" }, 403);
    const answer = text(b.body, 1000);
    if (answer.length < 5) return J({ error: "text" }, 400);
    if (await db.prepare("SELECT 1 x FROM expert_request_replies WHERE request_id=? AND user_id=?").bind(id, user.id).first()) return J({ error: "already_replied" }, 409);
    if (!(await rateLimit(db, `expert_reply:${user.id}`, 10, 86400))) return J({ error: "daily_limit" }, 429);
    const t = now();
    let result;
    try {
      result = await db.prepare(`INSERT INTO expert_request_replies(request_id,user_id,body,created)
        SELECT ?,?,?,? WHERE (SELECT COUNT(*) FROM expert_request_replies WHERE user_id=? AND created>?)<10`)
        .bind(id, user.id, answer, t, user.id, t - 86400).run();
    } catch { return J({ error: "already_replied" }, 409); }
    if (!result.meta.changes) {
      if (await db.prepare("SELECT 1 x FROM expert_request_replies WHERE request_id=? AND user_id=?").bind(id, user.id).first()) return J({ error: "already_replied" }, 409);
      return J({ error: "daily_limit" }, 429);
    }
    await notify(env, item.user_id, { title: "M365.FM · Antwort auf deine Anfrage", body: item.title, url: `${env.SITE}/community/#c-guests`, tag: `expert-reply-${id}` });
    return J({ ok: true });
  }
  if (path === "/api/expert-requests/report" && method === "POST") {
    const b = await body(), id = Number(b.id), item = Number.isSafeInteger(id) && id > 0 ? await db.prepare("SELECT * FROM expert_requests WHERE id=? AND status='open'").bind(id).first() : null;
    if (!item || !requestMatches(await profileRows(db, user.id), item) || await blocked(db, user.id, item.user_id)) return J({ error: "not_found" }, 404);
    if (!(await rateLimit(db, `expert_report:${user.id}`, 5, 86400))) return J({ error: "rate_limit" }, 429);
    await db.prepare("INSERT OR IGNORE INTO expert_request_reports(request_id,user_id,reason,created) VALUES(?,?,?,?)").bind(id, user.id, text(b.reason, 300), now()).run();
    return J({ ok: true });
  }
  if (path === "/api/expert-requests/block" && (method === "POST" || method === "DELETE")) {
    const b = await body(), id = Number(b.id), replyId = Number(b.reply_id); let target = 0;
    if (Number.isSafeInteger(replyId) && replyId > 0) {
      target = (await db.prepare("SELECT x.user_id FROM expert_request_replies x JOIN expert_requests r ON r.id=x.request_id WHERE x.id=? AND r.user_id=?").bind(replyId, user.id).first())?.user_id || 0;
    } else {
      const item = Number.isSafeInteger(id) && id > 0 ? await db.prepare("SELECT * FROM expert_requests WHERE id=? AND status='open'").bind(id).first() : null;
      if (item && item.user_id !== user.id && requestMatches(await profileRows(db, user.id), item)) target = item.user_id;
    }
    if (!target || target === user.id) return J({ error: "not_found" }, 404);
    if (method === "POST") await db.prepare("INSERT OR IGNORE INTO msg_blocks(user_id,blocked_id) VALUES(?,?)").bind(user.id, target).run();
    else await db.prepare("DELETE FROM msg_blocks WHERE user_id=? AND blocked_id=?").bind(user.id, target).run();
    return J({ ok: true });
  }
  if (path === "/api/expert-requests/close" && method === "POST") {
    const b = await body(), id = Number(b.id);
    if (!Number.isSafeInteger(id) || id < 1) return J({ error: "not_found" }, 404);
    const result = await db.prepare("UPDATE expert_requests SET status='closed' WHERE id=? AND user_id=? AND status='open'").bind(id, user.id).run();
    return result.meta.changes ? J({ ok: true }) : J({ error: "not_found" }, 404);
  }
  return null;
}
