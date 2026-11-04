// Wochenmail je bestaetigter Adresse und taeglicher Web-Push fuer neue Folgen.
import { sendPush } from "./push.js";
import { esc } from "./util.js";
import { closeMonth } from "./badges.js";
import { mailReady, sendMail } from "./mailer.js";
import { wants, weeklyUnsubscribe } from "./mail.js";

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

async function topicItems(db, uid, since, until, site) {
  const topics = (await db.prepare("SELECT DISTINCT ct.kind,ct.item_id FROM content_topic ct JOIN mail_topic_follows f ON f.eid=ct.eid AND f.user_id=? AND f.active=1 WHERE ct.created>=? ORDER BY ct.kind,ct.item_id LIMIT 40").bind(uid, since).all().catch(() => ({ results: [] }))).results || [];
  const out = [];
  for (const x of topics) {
    let row = null, title = "", summary = "", url = `${site}/community/`;
    try {
      if (x.kind === "blog") {
        row = await db.prepare("SELECT slug,title,summary,lang,published FROM blog_posts WHERE id=? AND status='live'").bind(+x.item_id).first();
        if (row) url = `${site}/blog/${encodeURIComponent(row.slug)}/`;
      } else if (x.kind === "podcast") {
        row = await db.prepare("SELECT title,description,lang,published,ep_url FROM pod_episodes WHERE id=? AND status='published'").bind(+x.item_id).first();
        if (row) url = safeHref(row.ep_url || `${site}/community/`, site);
      } else if (x.kind === "video") {
        row = await db.prepare("SELECT title,description,lang,published,video_id FROM yt_videos WHERE id=? AND status='published'").bind(+x.item_id).first();
        if (row && row.video_id) url = `https://www.youtube.com/watch?v=${encodeURIComponent(row.video_id)}`;
      } else if (x.kind === "library") {
        row = await db.prepare("SELECT title,summary,lang,published,link FROM lib_items WHERE id=? AND status='live'").bind(+x.item_id).first();
        if (row) url = safeHref(row.link || `${site}/community/`, site);
      } else if (x.kind === "session") {
        row = await db.prepare("SELECT s.title,s.abstract,s.lang,s.start,e.handle FROM event_sessions s JOIN events e ON e.id=s.event_id WHERE s.id=? AND s.status='live'").bind(+x.item_id).first();
        if (row) url = `${site}/events/${encodeURIComponent(row.handle)}/`;
      }
    } catch { /* Nicht jede Inhaltsart ist in jeder Datenbank aktiv. */ }
    if (!row || itemTime(row) < since || itemTime(row) > until) continue;
    title = row.title || "";
    summary = row.summary || row.description || row.abstract || "";
    out.push({ title, summary, url, lang: row.lang || "en" });
    if (out.length >= 6) break;
  }
  return out;
}

async function personalUpdates(db, uid, since, until, site, lang) {
  const out = [], included = [];
  const de = lang === "de";
  const addKind = async (kind) => {
    if (!(await wants(db, uid, kind))) return;
    const rows = (await db.prepare("SELECT id,subject,html FROM mail_outbox WHERE user_id=? AND kind=? AND sent=0 AND tries<3 ORDER BY id LIMIT 20").bind(uid, kind).all().catch(() => ({ results: [] }))).results || [];
    const title = kind === "reply" ? (de ? "Neue Antwort auf deinen Kommentar" : "New reply to your comment")
      : kind === "wish" ? (de ? "Neuer Status zu deinem Wunsch" : "Your wish has a status update")
        : (de ? "Aktualisierung deiner Podcast-Show" : "Podcast show update");
    for (const row of rows) { out.push({ title, html: row.html }); included.push(row.id); }
  };
  await addKind("reply");
  await addKind("wish");
  await addKind("show");

  const guestRows = (await db.prepare("SELECT p.title,p.ep_url,p.created FROM item_guests g JOIN pod_episodes p ON p.id=g.item_id AND g.kind='podcast' AND p.status='published' WHERE g.user_id=? AND g.status='confirmed' AND g.created>=? AND g.created<=? UNION ALL SELECT v.title,'',v.created FROM item_guests g JOIN yt_videos v ON v.id=g.item_id AND g.kind='video' AND v.status='published' WHERE g.user_id=? AND g.status='confirmed' AND g.created>=? AND g.created<=? LIMIT 10").bind(uid, since, until, uid, since, until).all().catch(() => ({ results: [] }))).results || [];
  for (const r of guestRows) out.push({ title: de ? "Du wurdest als Gast hinzugefügt" : "You were added as a guest", html: `<a href="${esc(safeHref(r.ep_url || `${site}/community/`, site))}">${esc(r.title)}</a>` });

  const coauthors = (await db.prepare("SELECT b.title,b.slug FROM blog_coauthors c JOIN blog_posts b ON b.id=c.post_id AND b.status='live' WHERE c.user_id=? AND c.status='confirmed' AND c.created>=? AND c.created<=? LIMIT 10").bind(uid, since, until).all().catch(() => ({ results: [] }))).results || [];
  for (const r of coauthors) out.push({ title: de ? "Du wurdest als Autor hinzugefügt" : "You were added as an author", html: `<a href="${esc(`${site}/blog/${encodeURIComponent(r.slug)}/`)}">${esc(r.title)}</a>` });

  const profile = await db.prepare("SELECT handle FROM profiles WHERE user_id=? AND public=1").bind(uid).first().catch(() => null);
  if (profile?.handle) {
    const sessions = (await db.prepare("SELECT s.title,s.speakers,e.handle FROM event_sessions s JOIN events e ON e.id=s.event_id WHERE s.status='live' AND s.created>=? AND s.created<=? LIMIT 200").bind(since, until).all().catch(() => ({ results: [] }))).results || [];
    for (const session of sessions) {
      let speakers = [];
      try { speakers = JSON.parse(session.speakers || "[]"); } catch { /* Ungueltige Sprecherliste ueberspringen. */ }
      if (speakers.some((speaker) => speaker.h === profile.handle)) out.push({ title: de ? "Du wurdest als Speaker hinzugefügt" : "You were added as a speaker", html: `<a href="${esc(`${site}/events/${encodeURIComponent(session.handle)}/`)}">${esc(session.title)}</a>` });
    }
  }
  if (profile?.handle) {
    const count = (await db.prepare("SELECT COUNT(*) n FROM blog_follows WHERE handle=? AND created>=? AND created<=?").bind(profile.handle, since, until).first().catch(() => null))?.n || 0;
    if (count) out.push({ title: de ? `${count} neue Blog-Abonnenten` : `${count} new blog subscribers`, html: "" });
  }

  if (await wants(db, uid, "weekly")) {
    const topics = await topicItems(db, uid, since, until, site);
    if (topics.length) out.push({ title: de ? "Neu bei deinen Themen" : "New in your topics", html: topics.map((x) => `<p><a href="${esc(safeHref(x.url, site))}">${esc(x.title)}</a>${x.summary ? ` — ${esc(clean(x.summary).slice(0, 160))}` : ""}</p>`).join("") });
  }
  return { items: out, outboxIds: included };
}

async function reserveWeekly(db, email, period, time) {
  const hash = await addressHash(email);
  const result = await db.prepare("INSERT INTO mail_weekly_delivery(address_hash,week_start,status,reserved_at) VALUES(?,?,0,?) ON CONFLICT(address_hash) DO UPDATE SET week_start=excluded.week_start,status=0,reserved_at=excluded.reserved_at,sent_at=0 WHERE mail_weekly_delivery.reserved_at<=excluded.reserved_at-604800").bind(hash, period, time).run();
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
    if (await wants(db, user.id, "weekly")) recipient.langs.add(user.lang);
  }

  const result = { recipients: recipients.size, sent: 0, skipped: 0, empty: 0, episodes: 0, personal: 0, period };
  if (dry) return result;
  if (!mailReady(env)) return { ...result, mailOff: true };
  for (const recipient of recipients.values()) {
    const itemsByLang = await currentItems(db, episodes, recipient.langs, since, time, env.SITE);
    const personal = [], outboxIds = [];
    for (const user of recipient.users.values()) {
      if (!(await wants(db, user.id, "weekly"))) continue;
      const update = await personalUpdates(db, user.id, since, time, env.SITE, user.lang);
      personal.push(...update.items); outboxIds.push(...update.outboxIds);
    }
    if (!Object.values(itemsByLang).some((items) => items.length) && !personal.length) { result.empty++; continue; }
    const registeredLang = [...recipient.users.values()].find((u) => u.lang)?.lang;
    const lang = registeredLang === "de" || recipient.langs.has("de") ? "de" : "en";
    if (!(await reserveWeekly(db, recipient.email, period, time))) { result.skipped++; continue; }
    const unsubscribe = await weeklyUnsubscribe(env, recipient.email);
    const html = renderWeeklyMail({ lang, itemsByLang, personal, site: env.SITE, unsubscribe });
    const r = await sendMail(env, { to: recipient.email, subject: lang === "de" ? "M365.FM – Deine Wochenübersicht" : "M365.FM – Your weekly overview", html, lang, bannerAt: at, headers: { "List-Unsubscribe": `<${unsubscribe}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } });
    if (r.ok) {
      result.sent++;
      result.episodes += Object.values(itemsByLang).reduce((n, items) => n + items.length, 0);
      result.personal += personal.length;
      for (let i = 0; i < outboxIds.length; i += 100) await db.batch(outboxIds.slice(i, i + 100).map((id) => db.prepare("UPDATE mail_outbox SET sent=1,err='' WHERE id=?").bind(id)));
      await db.prepare("UPDATE mail_weekly_delivery SET status=1,sent_at=? WHERE address_hash=?").bind(time, await addressHash(recipient.email)).run();
    } else {
      await db.prepare("UPDATE mail_weekly_delivery SET status=2 WHERE address_hash=?").bind(await addressHash(recipient.email)).run();
    }
  }
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
