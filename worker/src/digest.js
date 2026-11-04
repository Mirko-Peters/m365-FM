// Wochenmail je bestaetigter Adresse und taeglicher Web-Push fuer neue Folgen.
import { sendPush } from "./push.js";
import { esc } from "./util.js";
import { closeMonth } from "./badges.js";
import { mailReady, sendMail } from "./mailer.js";
import { KINDS, weeklyUnsubscribeMany } from "./mail.js";

const LANG_NAME = { de: "Deutsch", en: "English", es: "Español", fr: "Français", it: "Italiano", pt: "Português", nl: "Nederlands", pl: "Polski", id: "Bahasa Indonesia", ru: "Русский", uk: "Українська", ar: "العربية", he: "עברית", ja: "日本語", ko: "한국어", ml: "മലയാളം", pa: "ਪੰਜਾਬੀ", ta: "தமிழ்", te: "తెలుగు" };
const clean = (t) => String(t || "").replace(/\s*\((KI|AI)[^)]*\)\s*$/i, "").replace(/\s*[（(][^()（）]*[)）]\s*$/, "").trim();

async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const it = items[i++]; try { await fn(it); } catch (e) { console.log("fehler", String(e).slice(0, 120)); } } }));
}

function itemTime(item) {
  const raw = item.date ?? item.published ?? item.created;
  if (typeof raw === "number") return raw > 1e12 ? Math.floor(raw / 1000) : raw;
  const parsed = Date.parse(raw || "");
  return Number.isFinite(parsed) ? Math.floor(parsed / 1000) : 0;
}

function recentEpisode(e, since, until) {
  const t = itemTime(e);
  return t >= since && t <= until;
}

function weekStart(at) {
  const d = new Date(at);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

async function addressHash(email) {
  const bytes = new TextEncoder().encode(String(email).trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function safeHref(value, base) {
  try {
    const url = new URL(value, base);
    return url.protocol === "https:" ? url.href : `${base}/`;
  } catch { return `${base}/`; }
}

function itemHtml(item) {
  const title = esc(clean(item.title));
  const summary = esc(clean(item.summary || "").slice(0, 160));
  const url = esc(item.url);
  return `<li style="margin:0 0 12px"><a href="${url}" style="color:#3b6391;font-weight:600;text-decoration:none">${title}</a>${summary ? `<br><span style="color:#5d6470;font-size:14px">${summary}</span>` : ""}</li>`;
}

export function renderWeeklyMail({ lang = "en", itemsByLang = {}, personal = [], site = "https://www.m365.fm", unsubscribe = "" }) {
  const de = lang === "de";
  const sections = Object.entries(itemsByLang).filter(([, items]) => items.length).map(([l, items]) =>
    `<h3>${de ? "Neu in deiner Sprache" : "New in your language"} · ${esc(LANG_NAME[l] || l)}</h3><ul style="padding-left:18px">${items.slice(0, 6).map(itemHtml).join("")}</ul>`,
  ).join("");
  const notes = personal.length
    ? `<h3>${de ? "Persönliche Hinweise" : "Personal updates"}</h3><ul style="padding-left:18px">${personal.map((p) => `<li style="margin:0 0 12px"><b>${esc(p.title)}</b>${p.html ? `<div>${p.html}</div>` : ""}</li>`).join("")}</ul>`
    : "";
  const manage = `${site}/community/`;
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#17191c"><h2 style="margin:0 0 4px">M365.FM</h2><p style="color:#5d6470;margin:0 0 18px">${de ? "Deine Wochenübersicht" : "Your weekly overview"}</p>${sections}${notes}<p><a href="${esc(manage)}" style="color:#3b6391">${de ? "Einstellungen" : "Settings"}</a></p><hr style="border:0;border-top:1px solid #ddd"><p style="font-size:12px;color:#777">Mirko Peters · M365.FM · <a href="${esc(unsubscribe)}" style="color:#777">${de ? "Abmelden" : "Unsubscribe"}</a></p></div>`;
}

async function currentItems(db, episodes, languages, since, until, site) {
  const byLang = Object.fromEntries([...languages].map((lang) => [lang, []]));
  const seen = new Set();
  for (const e of episodes) {
    if (!languages.has(e.language) || !recentEpisode(e, since, until)) continue;
    const key = `${e.id}|${e.language}`;
    if (seen.has(key)) continue;
    seen.add(key);
    byLang[e.language].push({ title: e.title, summary: e.summary, url: safeHref(e.url, site), time: itemTime(e) });
  }
  const blogs = (await db.prepare("SELECT id,slug,title,summary,lang,published FROM blog_posts WHERE status='live' AND published>=? AND published<=? ORDER BY published DESC LIMIT 300").bind(since, until).all().catch(() => ({ results: [] }))).results || [];
  for (const b of blogs) {
    if (!languages.has(b.lang)) continue;
    const key = `blog${b.id}|${b.lang}`;
    if (seen.has(key)) continue;
    seen.add(key);
    byLang[b.lang].push({ title: b.title, summary: b.summary, url: `${site}/blog/${encodeURIComponent(b.slug)}/`, time: b.published });
  }
  for (const list of Object.values(byLang)) list.sort((a, b) => b.time - a.time);
  return byLang;
}

const enabled = (prefs, uid, kind) => {
  const value = prefs.get(uid)?.get(kind);
  return value === undefined ? !!KINDS[kind] : !!value;
};
const uidParams = (ids) => ids.map(() => "?").join(",");

async function topicItems(db, ids, since, until, site) {
  if (!ids.length) return new Map();
  const sql = `WITH recipients(user_id) AS (VALUES ${ids.map(() => "(?)").join(",")}), matches AS (
    SELECT DISTINCT r.user_id,'blog' kind,b.title,b.summary,b.lang,b.published published,b.slug ref,'' link
    FROM recipients r JOIN mail_topic_follows f ON f.user_id=r.user_id AND f.active=1
    JOIN content_topic ct ON ct.eid=f.eid AND ct.kind='blog'
    JOIN blog_posts b ON CAST(b.id AS TEXT)=ct.item_id AND b.status='live'
    WHERE b.published>=? AND b.published<=?
    UNION ALL
    SELECT DISTINCT r.user_id,'podcast',p.title,p.description,p.lang,p.published,p.ep_url,''
    FROM recipients r JOIN mail_topic_follows f ON f.user_id=r.user_id AND f.active=1
    JOIN content_topic ct ON ct.eid=f.eid AND ct.kind='podcast'
    JOIN pod_episodes p ON CAST(p.id AS TEXT)=ct.item_id AND p.status='published'
    WHERE p.published>=? AND p.published<=?
    UNION ALL
    SELECT DISTINCT r.user_id,'video',v.title,v.description,v.lang,v.published,v.video_id,''
    FROM recipients r JOIN mail_topic_follows f ON f.user_id=r.user_id AND f.active=1
    JOIN content_topic ct ON ct.eid=f.eid AND ct.kind='video'
    JOIN yt_videos v ON CAST(v.id AS TEXT)=ct.item_id AND v.status='published'
    WHERE v.published>=? AND v.published<=?
    UNION ALL
    SELECT DISTINCT r.user_id,'library',l.title,l.summary,l.lang,l.published,l.link,''
    FROM recipients r JOIN mail_topic_follows f ON f.user_id=r.user_id AND f.active=1
    JOIN content_topic ct ON ct.eid=f.eid AND ct.kind='library'
    JOIN lib_items l ON CAST(l.id AS TEXT)=ct.item_id AND l.status='live'
    WHERE l.published>=? AND l.published<=?
    UNION ALL
    SELECT DISTINCT r.user_id,'session',s.title,s.abstract,s.lang,s.created,e.handle,''
    FROM recipients r JOIN mail_topic_follows f ON f.user_id=r.user_id AND f.active=1
    JOIN content_topic ct ON ct.eid=f.eid AND ct.kind='session'
    JOIN event_sessions s ON CAST(s.id AS TEXT)=ct.item_id AND s.status='live'
    JOIN events e ON e.id=s.event_id
    WHERE s.created>=? AND s.created<=?
  ), ranked AS (
    SELECT *,ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY published DESC,title) rn FROM matches
  )
  SELECT user_id,kind,title,summary,lang,published,ref,link FROM ranked WHERE rn<=6`;
  const rows = (await db.prepare(sql).bind(...ids, since, until, since, until, since, until, since, until, since, until).all().catch(() => ({ results: [] }))).results || [];
  const out = new Map();
  for (const row of rows) {
    let url = `${site}/community/`;
    if (row.kind === "blog") url = `${site}/blog/${encodeURIComponent(row.ref)}/`;
    else if (row.kind === "podcast") url = safeHref(row.ref || url, site);
    else if (row.kind === "video" && row.ref) url = `https://www.youtube.com/watch?v=${encodeURIComponent(row.ref)}`;
    else if (row.kind === "library") url = safeHref(row.ref || url, site);
    else if (row.kind === "session") url = `${site}/events/${encodeURIComponent(row.ref)}/`;
    const items = out.get(row.user_id) || [];
    items.push({ title: row.title, summary: row.summary, url });
    out.set(row.user_id, items);
  }
  return out;
}

async function loadPersonal(db, users, since, until, site) {
  const result = new Map(), ids = users.map((u) => u.id);
  for (const uid of ids) result.set(uid, { items: [], outboxIds: [] });
  if (!ids.length) return result;
  if (ids.length > 30) {
    for (let i = 0; i < users.length; i += 30) {
      const batch = await loadPersonal(db, users.slice(i, i + 30), since, until, site);
      for (const [uid, value] of batch) result.set(uid, value);
    }
    return result;
  }
  const slots = uidParams(ids), prefRows = (await db.prepare(`SELECT user_id,kind,on_ FROM mail_prefs WHERE user_id IN (${slots})`).bind(...ids).all()).results || [];
  const prefs = new Map();
  for (const row of prefRows) { const map = prefs.get(row.user_id) || new Map(); map.set(row.kind, !!row.on_); prefs.set(row.user_id, map); }
  const eligible = ids.filter((uid) => enabled(prefs, uid, "weekly"));
  if (!eligible.length) return result;
  const eligibleSql = uidParams(eligible), eligibleRows = (await db.prepare(`SELECT user_id,id,kind,html FROM mail_outbox WHERE user_id IN (${eligibleSql}) AND kind IN ('reply','wish','show') AND sent=0 AND tries<3 AND created>=? AND created<=? ORDER BY id`).bind(...eligible, since, until).all()).results || [];
  for (const row of eligibleRows) {
    if (!enabled(prefs, row.user_id, row.kind)) continue;
    const de = users.find((u) => u.id === row.user_id)?.lang === "de";
    const title = row.kind === "reply" ? (de ? "Neue Antwort auf deinen Kommentar" : "New reply to your comment")
      : row.kind === "wish" ? (de ? "Neuer Status zu deinem Wunsch" : "Your wish has a status update")
        : (de ? "Aktualisierung deiner Podcast-Show" : "Podcast show update");
    const item = result.get(row.user_id); item.items.push({ title, html: row.html }); item.outboxIds.push(row.id);
  }

  const eventIds = eligible.filter((uid) => enabled(prefs, uid, "event"));
  if (eventIds.length) {
    const eventSql = uidParams(eventIds);
    const guests = (await db.prepare(`SELECT g.user_id,p.title,p.ep_url FROM item_guests g JOIN pod_episodes p ON p.id=g.item_id AND g.kind='podcast' AND p.status='published' WHERE g.user_id IN (${eventSql}) AND g.status='confirmed' AND g.created>=? AND g.created<=? UNION ALL SELECT g.user_id,v.title,' ' FROM item_guests g JOIN yt_videos v ON v.id=g.item_id AND g.kind='video' AND v.status='published' WHERE g.user_id IN (${eventSql}) AND g.status='confirmed' AND g.created>=? AND g.created<=?`).bind(...eventIds, since, until, ...eventIds, since, until).all().catch(() => ({ results: [] }))).results || [];
    for (const row of guests) {
      const de = users.find((u) => u.id === row.user_id)?.lang === "de";
      result.get(row.user_id).items.push({ title: de ? "Du wurdest als Gast hinzugefügt" : "You were added as a guest", html: `<a href="${esc(safeHref(row.ep_url || `${site}/community/`, site))}">${esc(row.title)}</a>` });
    }
    const profiles = (await db.prepare(`SELECT user_id,handle FROM profiles WHERE user_id IN (${eventSql}) AND public=1 AND handle IS NOT NULL`).bind(...eventIds).all()).results || [];
    const handleByUser = new Map(profiles.map((x) => [x.user_id, x.handle]));
    const sessions = (await db.prepare("SELECT s.title,s.speakers,e.handle FROM event_sessions s JOIN events e ON e.id=s.event_id WHERE s.status='live' AND s.created>=? AND s.created<=? LIMIT 500").bind(since, until).all()).results || [];
    for (const session of sessions) {
      let speakers = [];
      try { speakers = JSON.parse(session.speakers || "[]"); } catch { /* Ungueltige Sprecherliste ueberspringen. */ }
      for (const [uid, handle] of handleByUser) if (speakers.some((speaker) => speaker.h === handle)) {
        const de = users.find((u) => u.id === uid)?.lang === "de";
        result.get(uid).items.push({ title: de ? "Du wurdest als Speaker hinzugefügt" : "You were added as a speaker", html: `<a href="${esc(`${site}/events/${encodeURIComponent(session.handle)}/`)}">${esc(session.title)}</a>` });
      }
    }
  }

  const showIds = eligible.filter((uid) => enabled(prefs, uid, "show"));
  if (showIds.length) {
    const showSql = uidParams(showIds);
    const coauthors = (await db.prepare(`SELECT c.user_id,b.title,b.slug FROM blog_coauthors c JOIN blog_posts b ON b.id=c.post_id AND b.status='live' WHERE c.user_id IN (${showSql}) AND c.status='confirmed' AND c.created>=? AND c.created<=?`).bind(...showIds, since, until).all().catch(() => ({ results: [] }))).results || [];
    for (const row of coauthors) {
      const de = users.find((u) => u.id === row.user_id)?.lang === "de";
      result.get(row.user_id).items.push({ title: de ? "Du wurdest als Autor hinzugefügt" : "You were added as an author", html: `<a href="${esc(`${site}/blog/${encodeURIComponent(row.slug)}/`)}">${esc(row.title)}</a>` });
    }
  }

  const weeklyIds = eligible.filter((uid) => enabled(prefs, uid, "weekly"));
  if (weeklyIds.length) {
    const follows = await topicItems(db, weeklyIds, since, until, site);
    for (const uid of weeklyIds) {
      const topics = follows.get(uid) || [], de = users.find((u) => u.id === uid)?.lang === "de";
      if (topics.length) result.get(uid).items.push({ title: de ? "Neu bei deinen Themen" : "New in your topics", html: topics.map((x) => `<p><a href="${esc(safeHref(x.url, site))}">${esc(x.title)}</a>${x.summary ? ` — ${esc(clean(x.summary).slice(0, 160))}` : ""}</p>`).join("") });
    }
    const profiles = (await db.prepare(`SELECT user_id,handle FROM profiles WHERE user_id IN (${uidParams(weeklyIds)}) AND public=1 AND handle IS NOT NULL`).bind(...weeklyIds).all()).results || [];
    const handles = profiles.map((x) => x.handle);
    if (handles.length) {
      const followerRows = (await db.prepare(`SELECT handle,COUNT(*) n FROM blog_follows WHERE handle IN (${uidParams(handles)}) AND created>=? AND created<=? GROUP BY handle`).bind(...handles, since, until).all()).results || [];
      const followsByHandle = new Map(followerRows.map((x) => [x.handle, x.n]));
      for (const profile of profiles) {
        const count = followsByHandle.get(profile.handle) || 0;
        if (count) {
          const de = users.find((u) => u.id === profile.user_id)?.lang === "de";
          result.get(profile.user_id).items.push({ title: de ? `${count} neue Blog-Abonnenten` : `${count} new blog subscribers`, html: "" });
        }
      }
    }
  }
  return result;
}

async function reserveWeekly(db, recipient, period, time) {
  const result = await db.prepare("INSERT INTO mail_weekly_delivery(address_hash,week_start,status,reserved_at) VALUES(?,?,0,?) ON CONFLICT(address_hash) DO UPDATE SET week_start=excluded.week_start,status=0,reserved_at=excluded.reserved_at,sent_at=0 WHERE mail_weekly_delivery.week_start<excluded.week_start OR mail_weekly_delivery.status=2").bind(recipient.hash, period, time).run();
  return !!result.meta.changes;
}

export async function runDigest(env, { dry = false, at = Date.now() } = {}) {
  const db = env.DB, time = Math.floor(new Date(at).getTime() / 1000), since = time - 7 * 86400, period = weekStart(at);
  const j = await (await fetch(`${env.SITE}/episodes.json`, { cf: { cacheTtl: 0 } })).json();
  const episodes = (j.episodes || []).filter((e) => e.id && e.language && e.url);
  const subscribers = (await db.prepare("SELECT email,lang FROM email_subs WHERE confirmed=1").all()).results || [];
  const accounts = (await db.prepare("SELECT a.user_id,a.email,u.lang FROM mail_addr a JOIN users u ON u.id=a.user_id WHERE a.verified=1").all()).results || [];
  const recipients = new Map();
  const getRecipient = (email) => {
    const key = String(email).trim().toLowerCase();
    if (!recipients.has(key)) recipients.set(key, { email: key, langs: new Set(), users: new Map() });
    return recipients.get(key);
  };
  for (const row of subscribers) if (row.email && row.lang) getRecipient(row.email).langs.add(row.lang);
  for (const row of accounts) {
    if (!row.email) continue;
    const recipient = getRecipient(row.email);
    const user = { id: row.user_id, lang: row.lang || "en" };
    recipient.users.set(user.id, user);
  }

  const result = { recipients: recipients.size, sent: 0, skipped: 0, empty: 0, episodes: 0, personal: 0, period };
  if (dry) return result;
  if (!mailReady(env)) return { ...result, mailOff: true };
  const hashes = await Promise.all([...recipients.values()].map(async (recipient) => ({ recipient, hash: await addressHash(recipient.email) })));
  const sentRows = (await db.prepare("SELECT address_hash,week_start,status FROM mail_weekly_delivery").all()).results || [];
  const sentByHash = new Map(sentRows.map((row) => [row.address_hash, row]));
  const candidates = hashes.filter(({ hash }) => {
    const row = sentByHash.get(hash);
    return !row || row.week_start < period || row.status === 2;
  }).sort((a, b) => a.hash.localeCompare(b.hash));
  const cursorRow = await db.prepare("SELECT v FROM meta WHERE k='weekly_cursor'").first();
  const cursor = cursorRow?.v || "";
  const pivot = candidates.findIndex((x) => x.hash > cursor);
  const ordered = pivot > 0 ? [...candidates.slice(pivot), ...candidates.slice(0, pivot)] : candidates;
  const batch = ordered.slice(0, 20);
  if (!batch.length) return result;
  const newsletterLangs = new Set(batch.flatMap(({ recipient }) => [...recipient.langs]));
  const byLang = await currentItems(db, episodes, newsletterLangs, since, time, env.SITE);
  const users = [...new Map(batch.flatMap(({ recipient }) => [...recipient.users.values()]).map((user) => [user.id, user])).values()];
  const personalByUser = await loadPersonal(db, users, since, time, env.SITE);
  const ready = [];
  for (const { recipient, hash } of batch) {
    const itemsByLang = Object.fromEntries([...recipient.langs].map((lang) => [lang, byLang[lang] || []]));
    const personal = [], outboxIds = [];
    for (const user of recipient.users.values()) {
      const update = personalByUser.get(user.id);
      if (!update) continue;
      personal.push(...update.items); outboxIds.push(...update.outboxIds);
    }
    if (!Object.values(itemsByLang).some((items) => items.length) && !personal.length) { result.empty++; continue; }
    const lang = recipient.langs.has("de") || [...recipient.users.values()].some((user) => user.lang === "de") ? "de" : "en";
    ready.push({ recipient, hash, itemsByLang, personal, outboxIds, lang });
  }
  if (!ready.length) {
    await db.prepare("INSERT INTO meta(k,v) VALUES('weekly_cursor',?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").bind(batch.at(-1).hash).run();
    return result;
  }
  const reservations = await db.batch(ready.map(({ hash }) => db.prepare("INSERT INTO mail_weekly_delivery(address_hash,week_start,status,reserved_at) VALUES(?,?,0,?) ON CONFLICT(address_hash) DO UPDATE SET week_start=excluded.week_start,status=0,reserved_at=excluded.reserved_at,sent_at=0 WHERE mail_weekly_delivery.week_start<excluded.week_start OR mail_weekly_delivery.status=2").bind(hash, period, time)));
  const deliver = ready.filter((_, i) => reservations[i]?.meta?.changes);
  result.skipped += ready.length - deliver.length;
  if (!deliver.length) return result;
  const unsubs = await weeklyUnsubscribeMany(env, deliver.map(({ recipient }) => recipient.email));
  const deliveryOps = [], outboxSent = new Set();
  for (const entry of deliver) {
    const { recipient, hash, itemsByLang, personal, outboxIds, lang } = entry;
    const html = renderWeeklyMail({ lang, itemsByLang, personal, site: env.SITE, unsubscribe: unsubs.get(recipient.email) });
    const r = await sendMail(env, { to: recipient.email, subject: lang === "de" ? "M365.FM – Deine Wochenübersicht" : "M365.FM – Your weekly overview", html, lang, bannerAt: at, headers: { "List-Unsubscribe": `<${unsubs.get(recipient.email)}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } });
    if (r.ok) {
      result.sent++;
      result.episodes += Object.values(itemsByLang).reduce((n, items) => n + items.length, 0);
      result.personal += personal.length;
      for (const id of outboxIds) outboxSent.add(id);
      deliveryOps.push(db.prepare("UPDATE mail_weekly_delivery SET status=1,sent_at=? WHERE address_hash=?").bind(time, hash));
    } else {
      deliveryOps.push(db.prepare("UPDATE mail_weekly_delivery SET status=2 WHERE address_hash=?").bind(hash));
    }
  }
  if (outboxSent.size) for (const id of outboxSent) deliveryOps.push(db.prepare("UPDATE mail_outbox SET sent=1,err='' WHERE id=?").bind(id));
  if (deliveryOps.length) await db.batch(deliveryOps);
  await db.prepare("INSERT INTO meta(k,v) VALUES('weekly_cursor',?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").bind(batch.at(-1).hash).run();
  return result;
}

export async function runPushDigest(env, { dry = false } = {}) {
  const db = env.DB;
  const j = await (await fetch(`${env.SITE}/episodes.json`, { cf: { cacheTtl: 0 } })).json();
  const eps = (j.episodes || []).filter((e) => e.id && e.language && e.url);
  const row = await db.prepare("SELECT v FROM meta WHERE k='sent'").first();
  const init = await db.prepare("SELECT v FROM meta WHERE k='digest_init'").first();
  const sent = new Set(row ? JSON.parse(row.v) : []);
  const key = (e) => `${e.id}|${e.language}`;
  if (!init) {
    for (const e of eps) sent.add(key(e));
    if (!dry) {
      await db.prepare("INSERT OR REPLACE INTO meta(k,v) VALUES('sent',?)").bind(JSON.stringify([...sent])).run();
      await db.prepare("INSERT OR REPLACE INTO meta(k,v) VALUES('digest_init','1')").run();
    }
    return { init: true, known: sent.size };
  }
  const fresh = eps.filter((e) => !sent.has(key(e)));
  const byLang = {};
  for (const e of fresh) (byLang[e.language] ||= []).push(e);
  const res = { new: fresh.length, push: 0, gone: 0, langs: Object.keys(byLang) };
  if (dry) return res;
  for (const [lang, list] of Object.entries(byLang)) {
    list.sort((a, b) => (a.date < b.date ? 1 : -1));
    const first = list[0];
    const payload = { title: `M365.FM · ${LANG_NAME[lang] || lang}`, body: clean(first.title) + (list.length > 1 ? ` (+${list.length - 1})` : ""),
      url: list.length > 1 ? `${env.SITE}/${lang}/` : first.url, tag: `digest-${lang}` };
    const subs = (await db.prepare("SELECT endpoint,p256dh,auth FROM push_subs WHERE lang=?").bind(lang).all()).results || [];
    await pool(subs, 8, async (s) => {
      const r = await sendPush(env, s, payload);
      if (r.ok) res.push++;
      else if (r.gone) { await db.prepare("DELETE FROM push_subs WHERE endpoint=?").bind(s.endpoint).run(); res.gone++; }
    });
  }
  for (const e of fresh) sent.add(key(e));
  await db.prepare("INSERT OR REPLACE INTO meta(k,v) VALUES('sent',?)").bind(JSON.stringify([...sent])).run();
  res.curators = await closeMonth(env);
  return res;
}
