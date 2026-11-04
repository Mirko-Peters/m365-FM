import { sendPush } from "./push.js";
import { sendMail } from "./mailer.js";
import { esc, isLang, rateLimit, sign, verify } from "./util.js";

const now = () => Math.floor(Date.now() / 1000);
const ID = /^[a-z0-9][a-z0-9-]{1,79}$/;
const HANDLE = /^[a-z0-9][a-z0-9-]{2,29}$/;
const KINDS = new Set(["entity", "creator", "show", "event", "session"]);
const topicLang = (lang) => lang === "en" || isLang(lang);
const TIMEZONE = (value) => {
  try { return new Intl.DateTimeFormat("en", { timeZone: value }).resolvedOptions().timeZone; } catch { return "UTC"; }
};
const LANG_TEXT = {
  en: ["New topics on M365.FM", "New content for your followed topics"],
  de: ["Neue Themen auf M365.FM", "Neue Inhalte zu deinen Themen"],
  es: ["Novedades de M365.FM", "Nuevos contenidos sobre tus temas"],
  fr: ["Nouveautés M365.FM", "Nouveaux contenus sur vos thèmes"],
  it: ["Novità M365.FM", "Nuovi contenuti per i tuoi temi"],
  pt: ["Novidades M365.FM", "Novos conteúdos sobre os seus temas"],
  nl: ["Nieuw op M365.FM", "Nieuwe inhoud voor je gevolgde thema’s"],
  pl: ["Nowości M365.FM", "Nowe treści dla obserwowanych tematów"],
  id: ["Kabar M365.FM", "Konten baru untuk topik yang Anda ikuti"],
  ru: ["Новости M365.FM", "Новые материалы по вашим темам"],
  uk: ["Новини M365.FM", "Нові матеріали за вашими темами"],
  ar: ["جديد M365.FM", "محتوى جديد للموضوعات التي تتابعها"],
  he: ["עדכונים מ-M365.FM", "תוכן חדש לנושאים שבמעקב"],
  ja: ["M365.FM の新着情報", "フォロー中のトピックの新着コンテンツ"],
  ko: ["M365.FM 새 소식", "팔로우한 주제의 새 콘텐츠"],
};
const REMINDER_TEXT = {
  en: ["Tomorrow", "Starting soon"], de: ["Morgen", "Beginnt in Kürze"],
  es: ["Mañana", "Empieza pronto"], fr: ["Demain", "Commence bientôt"],
  it: ["Domani", "Inizia a breve"], pt: ["Amanhã", "Começa em breve"],
  nl: ["Morgen", "Begint binnenkort"], pl: ["Jutro", "Wkrótce się zaczyna"],
  id: ["Besok", "Segera dimulai"], ru: ["Завтра", "Скоро начинается"],
  uk: ["Завтра", "Незабаром початок"], ar: ["غدًا", "يبدأ قريبًا"],
  he: ["מחר", "מתחיל בקרוב"], ja: ["明日", "まもなく開始"],
  ko: ["내일", "곧 시작"],
};

function validTopic(kind, topicId) {
  if (!KINDS.has(kind)) return false;
  if (kind === "creator") return HANDLE.test(topicId);
  if (kind === "session") return /^\d{1,10}$/.test(topicId);
  return ID.test(topicId);
}

function localClock(timezone, date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE(timezone), year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, hour: +p.hour };
}

export function quietHours(timezone, date = new Date()) {
  const { hour } = localClock(timezone, date);
  return hour >= 22 || hour < 7;
}

async function topicExists(env, kind, topicId) {
  const db = env.DB;
  if (kind === "entity") {
    const r = await db.prepare("SELECT 1 x FROM entity_rev WHERE eid=? AND status IN ('live','pending') LIMIT 1").bind(topicId).first().catch(() => null);
    if (r) return true;
    try {
      const j = await (await fetch(`${env.SITE}/entities.json`, { cf: { cacheTtl: 600 } })).json();
      return (j.entities || []).some((x) => x.id === topicId);
    } catch { return false; }
  }
  if (kind === "creator") return !!(await db.prepare("SELECT 1 x FROM profiles WHERE handle=? AND public=1 UNION SELECT 1 x FROM orgs WHERE handle=? AND public=1 LIMIT 1").bind(topicId, topicId).first());
  if (kind === "show") return !!(await db.prepare("SELECT 1 x FROM shows WHERE slug=? AND status='live'").bind(topicId).first().catch(() => null));
  if (kind === "event") return !!(await db.prepare("SELECT 1 x FROM events WHERE handle=? AND public=1").bind(topicId).first());
  if (kind === "session") return !!(await db.prepare("SELECT 1 x FROM event_sessions WHERE id=? AND status='live'").bind(+topicId).first());
  return false;
}

export async function queueTopicNotification(env, { kind, topicId, key, title, body = "", url }) {
  if (!validTopic(kind, String(topicId)) || !key || !title || !url) return 0;
  const db = env.DB, id = String(topicId), created = now(), recipients = [];
  const pushRows = (await db.prepare(
    "SELECT pt.endpoint,pt.lang,pt.timezone FROM push_topics pt JOIN push_subs ps ON ps.endpoint=pt.endpoint WHERE pt.kind=? AND pt.topic_id=?",
  ).bind(kind, id).all()).results || [];
  recipients.push(...pushRows.map((r) => ({ channel: "push", recipient: r.endpoint, lang: r.lang, timezone: r.timezone })));
  if (kind === "creator") {
    const legacy = (await db.prepare(
      "SELECT DISTINCT ps.endpoint,ps.lang FROM blog_follows f JOIN profiles p ON p.handle=f.handle JOIN push_subs ps ON ps.user_id=f.user_id WHERE f.handle=?",
    ).bind(id).all()).results || [];
    recipients.push(...legacy.map((r) => ({ channel: "push", recipient: r.endpoint, lang: r.lang, timezone: "UTC" })));
  }
  const emailRows = (await db.prepare(
    "SELECT et.user_id,et.lang,et.timezone FROM email_topics et JOIN mail_addr a ON a.user_id=et.user_id AND a.verified=1 WHERE et.kind=? AND et.topic_id=?",
  ).bind(kind, id).all()).results || [];
  recipients.push(...emailRows.map((r) => ({ channel: "email", recipient: String(r.user_id), lang: r.lang, timezone: r.timezone })));
  const unique = new Map(recipients.map((r) => [`${r.channel}|${r.recipient}|${r.lang}`, r]));
  const rows = [...unique.values()];
  for (let i = 0; i < rows.length; i += 100) {
    await db.batch(rows.slice(i, i + 100).map((r) => db.prepare(
      "INSERT INTO topic_queue(channel,recipient,lang,timezone,kind,topic_id,item_key,title,body,url,created) VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(channel,recipient,kind,topic_id,item_key) DO NOTHING",
    ).bind(r.channel, r.recipient, topicLang(r.lang) ? r.lang : "en", TIMEZONE(r.timezone), kind, id, String(key).slice(0, 300),
      String(typeof title === "object" ? title[r.lang] || title.en || title.de : title).slice(0, 200), String(body).slice(0, 300), String(url).slice(0, 500), created)));
  }
  return rows.length;
}

export async function queueTopicArticles(env) {
  let articles;
  try {
    const r = await fetch(`${env.SITE}/articles.json`, { cf: { cacheTtl: 0 } });
    if (!r.ok) return { seen: 0, queued: 0 };
    articles = (await r.json()).articles || [];
  } catch { return { seen: 0, queued: 0 }; }
  const db = env.DB, init = await db.prepare("SELECT v FROM meta WHERE k='topic_articles_init'").first();
  if (!init) {
    for (let i = 0; i < articles.length; i += 100) await db.batch(articles.slice(i, i + 100).map((a) => db.prepare(
      "INSERT OR IGNORE INTO topic_seen(source_key,created) VALUES(?,?)",
    ).bind(`article:${a.url}`, now())));
    await db.prepare("INSERT OR REPLACE INTO meta(k,v) VALUES('topic_articles_init','1')").run();
    return { seen: articles.length, queued: 0, init: true };
  }
  let queued = 0;
  for (const article of articles) {
    if (!article?.url || typeof article.url !== "string") continue;
    const inserted = await db.prepare("INSERT OR IGNORE INTO topic_seen(source_key,created) VALUES(?,?)").bind(`article:${article.url}`, now()).run();
    if (!inserted.meta?.changes) continue;
    const ids = Array.isArray(article.topics) ? [...new Set(article.topics.filter((x) => ID.test(x)))].slice(0, 12) : [];
    for (const eid of ids) queued += await queueTopicNotification(env, { kind: "entity", topicId: eid, key: `article:${article.url}`, title: article.title || "New article", body: article.summary || "", url: article.url });
    const match = /\/community\/u\/([a-z0-9-]{3,30})\//.exec(article.url);
    if (match) queued += await queueTopicNotification(env, { kind: "creator", topicId: match[1], key: `article:${article.url}`, title: article.title || "New article", body: article.summary || "", url: article.url });
  }
  return { seen: articles.length, queued };
}

export async function queueSessionReminders(env, at = now()) {
  const db = env.DB;
  const range = (delta) => {
    const start = new Date((at + delta - 600) * 1000).toISOString().slice(0, 16);
    const end = new Date((at + delta + 600) * 1000).toISOString().slice(0, 16);
    return [start, end];
  };
  const [dayLo, dayHi] = range(86400), [soonLo, soonHi] = range(900);
  const rows = (await db.prepare(
    "SELECT s.id,s.title,s.start,e.handle,e.title event_title FROM event_sessions s JOIN events e ON e.id=s.event_id WHERE s.status='live' AND e.public=1 AND ((s.start BETWEEN ? AND ?) OR (s.start BETWEEN ? AND ?))",
  ).bind(dayLo, dayHi, soonLo, soonHi).all()).results || [];
  let queued = 0;
  for (const s of rows) {
    const start = Date.parse(/Z|[+-]\d\d:\d\d$/.test(s.start) ? s.start : `${s.start}Z`) / 1000;
    if (!Number.isFinite(start)) continue;
    const when = Math.abs(start - at - 86400) <= 600 ? "24h" : Math.abs(start - at - 900) <= 600 ? "15m" : "";
    if (!when) continue;
    const key = `session-reminder:${s.id}:${when}`;
    const title = Object.fromEntries(Object.entries(REMINDER_TEXT).map(([lang, labels]) => [lang, `${labels[when === "24h" ? 0 : 1]}: ${s.title}`]));
    const body = s.event_title;
    const url = `${env.SITE}/community/events/${s.handle}/`;
    queued += await queueTopicNotification(env, { kind: "session", topicId: String(s.id), key, title, body, url });
    queued += await queueTopicNotification(env, { kind: "event", topicId: s.handle, key, title, body, url });
  }
  return queued;
}

function queueText(lang, rows) {
  const [title, body] = LANG_TEXT[lang] || LANG_TEXT.en;
  const contents = rows.slice(0, 3).map((r) => r.title).join(" · ");
  return { title, body: contents || body };
}

async function emailUnsubscribeUrl(env, uid) {
  const sig = await sign(env.SESSION_SECRET, `topic-email:${uid}`);
  return `${env.API}/api/topics/email-unsub?t=${uid}.${sig}`;
}

export async function dispatchTopicNotifications(env, { at = new Date(), limit = 5000 } = {}) {
  const db = env.DB, nowTs = Math.floor(at.getTime() / 1000);
  await db.prepare("DELETE FROM topic_deliveries WHERE created<?").bind(nowTs - 14 * 86400).run();
  const rows = (await db.prepare("SELECT * FROM topic_queue WHERE sent=0 ORDER BY created,id LIMIT ?").bind(limit).all()).results || [];
  const groups = new Map();
  for (const r of rows) {
    const key = `${r.channel}|${r.recipient}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }
  const result = { sent: 0, quiet: 0, limited: 0, gone: 0 };
  for (const pending of groups.values()) {
    const first = pending[0], clock = localClock(first.timezone, at);
    if (clock.hour >= 22 || clock.hour < 7) { result.quiet++; continue; }
    const delivered = (await db.prepare(
      "SELECT kind,topic_id FROM topic_deliveries WHERE channel=? AND recipient=? AND local_day=?",
    ).bind(first.channel, first.recipient, clock.day).all()).results || [];
    const sentTopics = new Set(delivered.map((r) => `${r.kind}|${r.topic_id}`));
    const byTopic = new Map();
    for (const r of pending) {
      const k = `${r.kind}|${r.topic_id}`;
      if (!sentTopics.has(k)) { if (!byTopic.has(k)) byTopic.set(k, []); byTopic.get(k).push(r); }
    }
    const candidates = [...byTopic.values()].slice(0, Math.max(0, 3 - delivered.length));
    if (!candidates.length) { result.limited++; continue; }
    if (byTopic.size > candidates.length) result.limited++;
    const claims = await db.batch(candidates.map((pick) => {
      const sample = pick[0];
      return db.prepare("INSERT OR IGNORE INTO topic_deliveries(channel,recipient,local_day,kind,topic_id,created) VALUES(?,?,?,?,?,?)")
        .bind(first.channel, first.recipient, clock.day, sample.kind, sample.topic_id, nowTs);
    }));
    const picks = candidates.filter((_, i) => claims[i]?.meta?.changes);
    if (!picks.length) continue;
    const visiblePicks = picks.map((pick) => first.channel === "push" ? pick.slice(0, 1) : pick.slice(0, 3));
    const visibleItems = visiblePicks.flat(), text = queueText(first.lang, visibleItems), url = visibleItems[0].url;
    let ok = false;
    if (first.channel === "push") {
      const sub = await db.prepare("SELECT endpoint,p256dh,auth FROM push_subs WHERE endpoint=?").bind(first.recipient).first();
      if (!sub) {
        await db.batch([
          db.prepare("DELETE FROM push_topics WHERE endpoint=?").bind(first.recipient),
          db.prepare("DELETE FROM topic_queue WHERE channel='push' AND recipient=?").bind(first.recipient),
          db.prepare("DELETE FROM topic_deliveries WHERE channel='push' AND recipient=?").bind(first.recipient),
        ]);
        continue;
      }
      const sent = await sendPush(env, sub, { ...text, url, tag: `topics-${clock.day}` }).catch(() => ({ ok: false, gone: false }));
      if (sent.gone) {
        await db.batch([
          db.prepare("DELETE FROM push_topics WHERE endpoint=?").bind(first.recipient),
          db.prepare("DELETE FROM push_subs WHERE endpoint=?").bind(first.recipient),
          db.prepare("DELETE FROM topic_queue WHERE channel='push' AND recipient=?").bind(first.recipient),
        ]);
        result.gone++; continue;
      }
      ok = sent.ok;
    } else {
      const address = await db.prepare("SELECT email FROM mail_addr WHERE user_id=? AND verified=1").bind(+first.recipient).first();
      if (!address) {
        await db.prepare("DELETE FROM email_topics WHERE user_id=?").bind(+first.recipient).run();
        await db.prepare("DELETE FROM topic_queue WHERE channel='email' AND recipient=?").bind(first.recipient).run();
        await db.prepare("DELETE FROM topic_deliveries WHERE channel='email' AND recipient=? AND local_day=?").bind(first.recipient, clock.day).run();
        continue;
      }
      const unsubscribe = await emailUnsubscribeUrl(env, first.recipient);
      const list = visibleItems.map((r) => `<li><a href="${esc(r.url)}">${esc(r.title)}</a>${r.body ? `<br>${esc(r.body)}` : ""}</li>`).join("");
      const sent = await sendMail(env, {
        to: address.email, subject: text.title,
        html: `<div style="font-family:system-ui,Arial,sans-serif;max-width:560px;margin:auto"><h2>${esc(text.title)}</h2><ul>${list}</ul><p><a href="${unsubscribe}">Unsubscribe from topic e-mails / Themen-E-Mails abbestellen</a></p></div>`,
        headers: { "List-Unsubscribe": `<${unsubscribe}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
      });
      ok = sent.ok;
    }
    if (!ok) {
      await db.batch(picks.map((pick) => {
        const sample = pick[0];
        return db.prepare("DELETE FROM topic_deliveries WHERE channel=? AND recipient=? AND local_day=? AND kind=? AND topic_id=?")
          .bind(first.channel, first.recipient, clock.day, sample.kind, sample.topic_id);
      }));
      continue;
    }
    const ops = [];
    for (const pick of visiblePicks) {
      for (let i = 0; i < pick.length; i += 100) {
        ops.push(...pick.slice(i, i + 100).map((r) => db.prepare("UPDATE topic_queue SET sent=1 WHERE id=?").bind(r.id)));
      }
    }
    await db.batch(ops);
    result.sent++;
  }
  return result;
}

export async function handleTopicSubscriptions(env, request, url, path, user, J) {
  if (!["/api/topics/email-unsub", "/api/topics/status", "/api/topics/mine", "/api/topics/follow", "/api/topics/unfollow", "/api/topics/clear"].includes(path)) return null;
  const db = env.DB, method = request.method;
  if (path === "/api/topics/email-unsub" && (method === "GET" || method === "POST")) {
    const [uid, sig] = (url.searchParams.get("t") || "").split(".");
    if (!/^\d+$/.test(uid || "") || !(await verify(env.SESSION_SECRET, `topic-email:${uid}`, sig || ""))) return J({ error: "bad_request" }, 400);
    await db.batch([
      db.prepare("DELETE FROM email_topics WHERE user_id=?").bind(+uid),
      db.prepare("DELETE FROM topic_queue WHERE channel='email' AND recipient=?").bind(uid),
    ]);
    return method === "POST" ? new Response("ok") : new Response("<!doctype html><meta charset=utf-8><p>Topic e-mails unsubscribed / Themen-E-Mails abbestellt.</p>", { headers: { "content-type": "text/html; charset=utf-8" } });
  }
  if (path === "/api/topics/status" && method === "GET") {
    const kind = url.searchParams.get("kind") || "", topicId = url.searchParams.get("id") || "", endpoint = url.searchParams.get("endpoint") || "";
    if (!validTopic(kind, topicId)) return J({ error: "bad_request" }, 400);
    const push = (endpoint && !!(await db.prepare("SELECT 1 x FROM push_topics pt JOIN push_subs ps ON ps.endpoint=pt.endpoint WHERE pt.endpoint=? AND pt.kind=? AND pt.topic_id=? AND (ps.user_id IS NULL OR ps.user_id=?)").bind(endpoint, kind, topicId, user?.id ?? -1).first()))
      || (user && !!(await db.prepare("SELECT 1 x FROM push_topics WHERE user_id=? AND kind=? AND topic_id=?").bind(user.id, kind, topicId).first()));
    const email = user && !!(await db.prepare("SELECT 1 x FROM email_topics WHERE user_id=? AND kind=? AND topic_id=?").bind(user.id, kind, topicId).first());
    const blog = user && kind === "creator" && !!(await db.prepare("SELECT 1 x FROM blog_follows WHERE user_id=? AND handle=?").bind(user.id, topicId).first());
    return J({ following: !!(push || email || blog), email: !!email }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/topics/mine" && method === "GET") {
    const endpoint = String(url.searchParams.get("endpoint") || "").slice(0, 600);
    if (!user && !endpoint) return J({ error: "login" }, 401);
    const rows = [];
    if (user) {
      rows.push(...((await db.prepare("SELECT kind,topic_id,'push' channel FROM push_topics WHERE user_id=?").bind(user.id).all()).results || []));
      rows.push(...((await db.prepare("SELECT kind,topic_id,'email' channel FROM email_topics WHERE user_id=?").bind(user.id).all()).results || []));
      rows.push(...((await db.prepare("SELECT handle topic_id,'creator' kind,'blog' channel FROM blog_follows WHERE user_id=?").bind(user.id).all()).results || []));
    }
    if (endpoint) {
      const owned = await db.prepare("SELECT user_id FROM push_subs WHERE endpoint=?").bind(endpoint).first();
      if (owned && (!user || !owned.user_id || owned.user_id === user.id)) rows.push(...((await db.prepare("SELECT kind,topic_id,'push' channel FROM push_topics WHERE endpoint=?").bind(endpoint).all()).results || []));
    }
    const unique = [...new Map(rows.map((r) => [`${r.kind}|${r.topic_id}|${r.channel}`, r])).values()];
    return J({ subscriptions: unique }, 200, { "cache-control": "no-store" });
  }
  if (method !== "POST") return J({ error: "not_found" }, 404);
  const b = await request.json().catch(() => ({}));
  const endpoint = String(b.endpoint || "").slice(0, 600), kind = String(b.kind || ""), topicId = String(b.id || "");
  const ip = request.headers.get("cf-connecting-ip") || "0";
  if (!(await rateLimit(db, `topic:${user?.id || ip}`, 60, 3600))) return J({ error: "rate_limit" }, 429);
  if (path === "/api/topics/follow") {
    if (!validTopic(kind, topicId) || !topicLang(b.lang) || !(await topicExists(env, kind, topicId))) return J({ error: "bad_request" }, 400);
    if (!endpoint && !(user && b.email === true)) return J({ error: "consent_required" }, 400);
    if (b.email === true && !user) return J({ error: "login" }, 401);
    if (b.email === true && !(await db.prepare("SELECT 1 x FROM mail_addr WHERE user_id=? AND verified=1").bind(user.id).first())) return J({ error: "email_unverified" }, 409);
    if (kind === "creator" && user) {
      const target = await db.prepare("SELECT user_id FROM profiles WHERE handle=? AND public=1").bind(topicId).first();
      if (target && target.user_id === user.id) return J({ error: "own" }, 400);
    }
    const timezone = TIMEZONE(String(b.timezone || "UTC").slice(0, 80)), created = now();
    if (endpoint) {
      const sub = await db.prepare("SELECT user_id FROM push_subs WHERE endpoint=?").bind(endpoint).first();
      if (!sub || (sub.user_id && sub.user_id !== user?.id)) return J({ error: "bad_subscription" }, 400);
      if (user && !sub.user_id) await db.prepare("UPDATE push_subs SET user_id=? WHERE endpoint=? AND user_id IS NULL").bind(user.id, endpoint).run();
      await db.prepare("UPDATE push_topics SET lang=?,timezone=? WHERE endpoint=?").bind(b.lang, timezone, endpoint).run();
      await db.prepare("UPDATE topic_queue SET lang=?,timezone=? WHERE channel='push' AND recipient=? AND sent=0").bind(b.lang, timezone, endpoint).run();
      await db.prepare("INSERT INTO push_topics(endpoint,kind,topic_id,lang,timezone,user_id,created) VALUES(?,?,?,?,?,?,?) ON CONFLICT(endpoint,kind,topic_id) DO UPDATE SET lang=excluded.lang,timezone=excluded.timezone,user_id=excluded.user_id")
        .bind(endpoint, kind, topicId, b.lang, timezone, user?.id ?? null, created).run();
    }
    if (b.email === true) {
      await db.prepare("UPDATE email_topics SET lang=?,timezone=? WHERE user_id=?").bind(b.lang, timezone, user.id).run();
      await db.prepare("UPDATE topic_queue SET lang=?,timezone=? WHERE channel='email' AND recipient=? AND sent=0").bind(b.lang, timezone, String(user.id)).run();
      await db.prepare("INSERT INTO email_topics(user_id,kind,topic_id,lang,timezone,created) VALUES(?,?,?,?,?,?) ON CONFLICT(user_id,kind,topic_id) DO UPDATE SET lang=excluded.lang,timezone=excluded.timezone")
        .bind(user.id, kind, topicId, b.lang, timezone, created).run();
    }
    if (kind === "creator" && user) {
      const target = await db.prepare("SELECT user_id FROM profiles WHERE handle=? AND public=1").bind(topicId).first();
      if (target) await db.prepare("INSERT OR IGNORE INTO blog_follows(user_id,handle,created) VALUES(?,?,?)").bind(user.id, topicId, created).run();
    }
    return J({ ok: true, following: true });
  }
  if (path === "/api/topics/unfollow") {
    if (!validTopic(kind, topicId)) return J({ error: "bad_request" }, 400);
    if (!user && !endpoint) return J({ error: "login" }, 401);
    if (endpoint) {
      const sub = await db.prepare("SELECT user_id FROM push_subs WHERE endpoint=?").bind(endpoint).first();
      if (!sub || (sub.user_id && sub.user_id !== user?.id)) return J({ error: "bad_subscription" }, 400);
    }
    const ops = [];
    if (endpoint) ops.push(db.prepare("DELETE FROM push_topics WHERE endpoint=? AND kind=? AND topic_id=?").bind(endpoint, kind, topicId));
    if (user) {
      ops.push(db.prepare("DELETE FROM push_topics WHERE user_id=? AND kind=? AND topic_id=?").bind(user.id, kind, topicId));
      ops.push(db.prepare("DELETE FROM topic_queue WHERE channel='push' AND recipient IN (SELECT endpoint FROM push_subs WHERE user_id=?) AND kind=? AND topic_id=?").bind(user.id, kind, topicId));
      ops.push(db.prepare("DELETE FROM email_topics WHERE user_id=? AND kind=? AND topic_id=?").bind(user.id, kind, topicId));
      if (kind === "creator") ops.push(db.prepare("DELETE FROM blog_follows WHERE user_id=? AND handle=?").bind(user.id, topicId));
      ops.push(db.prepare("DELETE FROM topic_queue WHERE channel='email' AND recipient=? AND kind=? AND topic_id=?").bind(String(user.id), kind, topicId));
    }
    if (endpoint) ops.push(db.prepare("DELETE FROM topic_queue WHERE channel='push' AND recipient=? AND kind=? AND topic_id=?").bind(endpoint, kind, topicId));
    await db.batch(ops);
    return J({ ok: true, following: false });
  }
  if (path === "/api/topics/clear") {
    if (!user && !endpoint) return J({ error: "login" }, 401);
    const ops = [];
    if (user) {
      ops.push(db.prepare("DELETE FROM email_topics WHERE user_id=?").bind(user.id), db.prepare("DELETE FROM push_topics WHERE user_id=?").bind(user.id), db.prepare("DELETE FROM blog_follows WHERE user_id=?").bind(user.id), db.prepare("DELETE FROM topic_queue WHERE channel='email' AND recipient=?").bind(String(user.id)), db.prepare("DELETE FROM topic_queue WHERE channel='push' AND recipient IN (SELECT endpoint FROM push_subs WHERE user_id=?)").bind(user.id));
    }
    if (endpoint) {
      const sub = await db.prepare("SELECT user_id FROM push_subs WHERE endpoint=?").bind(endpoint).first();
      if (!sub || (sub.user_id && sub.user_id !== user?.id)) return J({ error: "bad_subscription" }, 400);
      ops.push(db.prepare("DELETE FROM push_topics WHERE endpoint=?").bind(endpoint), db.prepare("DELETE FROM topic_queue WHERE channel='push' AND recipient=?").bind(endpoint));
    }
    await db.batch(ops);
    return J({ ok: true });
  }
  return J({ error: "not_found" }, 404);
}
