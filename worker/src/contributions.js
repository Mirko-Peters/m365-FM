import { cleanText, rateLimit } from "./util.js";
import { goodHost } from "./profiles.js";
import { discoverFeed, parseFeed } from "./feeds.js";
import { token as youtubeToken } from "./youtube.js";

const now = () => Math.floor(Date.now() / 1000);
const SOURCE_KINDS = ["podcast", "youtube", "blog"];
const ENTRY_KINDS = ["podcast", "video", "blog", "session", "github", "article", "other"];
const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com"]);
const TOPIC_ID = /^[a-z0-9][a-z0-9-]{1,47}$/;

function safeUrl(value) {
  try {
    const u = new URL(String(value || "").trim());
    if (u.protocol !== "https:" || u.username || u.password || !goodHost(u.hostname) || u.href.length > 400) return "";
    u.hash = "";
    return u.href;
  } catch { return ""; }
}

function topicsOf(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.slice(0, 10).map((x) => String(x || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48)).filter((x) => TOPIC_ID.test(x)))];
}

function dateValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.min(now(), Math.floor(value)));
  const parsed = Date.parse(String(value || ""));
  return Number.isFinite(parsed) ? Math.min(now(), Math.floor(parsed / 1000)) : now();
}

function csvCell(value) {
  let s = String(value ?? "");
  if (/^\s*[=+\-@]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}

function contributionOutput(row) {
  let topics = [];
  try { topics = JSON.parse(row.topics || "[]"); } catch {}
  return { id: row.id, title: row.title, url: row.url, published: row.published, kind: row.kind, category: row.category,
    topics, views: row.views, downloads: row.downloads, public: !!row.public, manual: !!row.manual, source: row.source || "" };
}

async function exportData(db, uid, from, to) {
  const date = (value, end = false) => {
    if (!value) return null;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
    const time = Date.parse(`${value}T00:00:00Z`);
    if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== value) return NaN;
    return Math.floor(Date.parse(`${value}T${end ? "23:59:59" : "00:00:00"}Z`) / 1000);
  };
  const start = date(from), end = date(to, true);
  if (Number.isNaN(start) || Number.isNaN(end) || (start !== null && end !== null && start > end)) return { error: "bad_period" };
  const rows = (await db.prepare(`SELECT c.id,c.title,c.url,c.published,c.kind,c.category,c.topics,c.views,c.downloads,c.public,c.manual,
      COALESCE(s.title,'') source FROM contributions c LEFT JOIN contribution_sources s ON s.id=c.source_id
      WHERE c.user_id=? ${start === null ? "" : "AND c.published>=?"} ${end === null ? "" : "AND c.published<=?"}
      ORDER BY c.published DESC,c.id DESC LIMIT 1000`).bind(...[uid, ...(start === null ? [] : [start]), ...(end === null ? [] : [end])]).all()).results || [];
  const items = rows.map(contributionOutput);
  const columns = ["title", "url", "published", "kind", "category", "topics", "views", "downloads"];
  const csv = [columns.map(csvCell).join(","), ...items.map((x) => [
    x.title, x.url, new Date(x.published * 1000).toISOString().slice(0, 10), x.kind, x.category, x.topics.join("; "), x.views, x.downloads,
  ].map(csvCell).join(","))].join("\r\n");
  const copy = items.map((x) => [
    `Kategorie: ${x.category || "Noch zuordnen"}`,
    `Beitrag: ${x.title}`,
    `Link: ${x.url || "—"}`,
    `Datum: ${new Date(x.published * 1000).toISOString().slice(0, 10)}`,
    `Typ: ${x.kind}`,
    `Entitäten/Themen: ${x.topics.join(", ") || "—"}`,
    `Kennzahlen: ${x.views ? `${x.views} YouTube-Aufrufe` : ""}${x.views && x.downloads ? ", " : ""}${x.downloads ? `${x.downloads} Spreaker-Downloads` : ""}`.trim(),
  ].join("\n")).join("\n\n");
  return { period: { from: from || "", to: to || "" }, total: items.length, items, csv, copy };
}

export async function handleContributions(env, request, url, path, user, J) {
  const db = env.DB, method = request.method;
  if (/^\/api\/contributions\/public\/[a-z0-9-]{3,30}$/.test(path) && method === "GET") {
    const handle = path.split("/").pop();
    const profile = await db.prepare("SELECT p.user_id FROM profiles p JOIN users u ON u.id=p.user_id AND u.banned=0 WHERE p.handle=? AND p.public=1").bind(handle).first();
    if (!profile) return J({ error: "not_found" }, 404);
    const rows = (await db.prepare("SELECT c.id,c.title,c.url,c.published,c.kind,c.category,c.topics,c.views,c.downloads,c.public,c.manual,'' source FROM contributions c WHERE c.user_id=? AND c.public=1 ORDER BY c.published DESC LIMIT 100").bind(profile.user_id).all()).results || [];
    return J({ contributions: rows.map(contributionOutput) }, 200, { "cache-control": "public, max-age=300" });
  }
  if (!path.startsWith("/api/contributions/")) return null;
  if (!user) return J({ error: "login" }, 401);

  if (path === "/api/contributions/sources" && method === "GET") {
    const rows = (await db.prepare("SELECT id,kind,url,feed,title,public,active,created,fetched,fails FROM contribution_sources WHERE user_id=? ORDER BY created DESC").bind(user.id).all()).results || [];
    return J({ sources: rows.map((s) => ({ ...s, public: !!s.public, active: !!s.active })) }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/contributions/source" && method === "POST") {
    if (!(await rateLimit(db, `contrib-source:${user.id}`, 10, 86400))) return J({ error: "rate_limit" }, 429);
    const b = await request.json().catch(() => ({})), kind = String(b.kind || ""), sourceUrl = safeUrl(b.url);
    if (!SOURCE_KINDS.includes(kind) || !sourceUrl || (kind === "youtube" && !YOUTUBE_HOSTS.has(new URL(sourceUrl).hostname.toLowerCase()))) return J({ error: "bad_source" }, 400);
    if ((await db.prepare("SELECT COUNT(*) n FROM contribution_sources WHERE user_id=?").bind(user.id).first()).n >= 20) return J({ error: "source_limit" }, 400);
    const title = cleanText(b.title || "", 100).replace(/[<>]/g, "").trim();
    const feed = /\.(?:rss|xml|atom)(?:$|[?#])/i.test(sourceUrl) ? sourceUrl : "";
    try {
      await db.prepare("INSERT INTO contribution_sources(user_id,kind,url,feed,title,public,created) VALUES(?,?,?,?,?,?,?)")
        .bind(user.id, kind, sourceUrl, feed, title, b.public ? 1 : 0, now()).run();
    } catch (e) {
      if (/UNIQUE/i.test(String(e))) return J({ error: "source_exists" }, 409);
      throw e;
    }
    return J({ ok: true, source: { kind, url: sourceUrl, title, public: !!b.public, feed_status: feed ? "ready" : "discovery_pending" } }, 201);
  }
  if (path === "/api/contributions/manual" && method === "POST") {
    if (!(await rateLimit(db, `contrib-manual:${user.id}`, 30, 86400))) return J({ error: "rate_limit" }, 429);
    const b = await request.json().catch(() => ({})), title = cleanText(b.title, 200).replace(/[<>]/g, "").trim();
    const kind = String(b.kind || ""), link = b.url ? safeUrl(b.url) : "";
    if (title.length < 3 || !ENTRY_KINDS.includes(kind) || (b.url && !link)) return J({ error: "bad_contribution" }, 400);
    if ((await db.prepare("SELECT COUNT(*) n FROM contributions WHERE user_id=?").bind(user.id).first()).n >= 2000) return J({ error: "contribution_limit" }, 400);
    const category = cleanText(b.category || "", 100).replace(/[<>]/g, "").trim();
    const topics = topicsOf(b.topics);
    let r;
    try {
      r = await db.prepare("INSERT INTO contributions(user_id,title,url,published,kind,category,topics,public,manual,created) VALUES(?,?,?,?,?,?,?,?,1,?)")
        .bind(user.id, title, link, dateValue(b.published), kind, category, JSON.stringify(topics), b.public ? 1 : 0, now()).run();
    } catch (e) {
      if (/UNIQUE/i.test(String(e))) return J({ error: "contribution_exists" }, 409);
      throw e;
    }
    return J({ ok: true, id: r.meta.last_row_id }, 201);
  }
  if (path === "/api/contributions/mine" && method === "GET") {
    const sources = (await db.prepare("SELECT id,kind,url,title,public,active FROM contribution_sources WHERE user_id=? ORDER BY created DESC").bind(user.id).all()).results || [];
    const rows = (await db.prepare(`SELECT c.id,c.title,c.url,c.published,c.kind,c.category,c.topics,c.views,c.downloads,c.public,c.manual,
        COALESCE(s.title,'') source FROM contributions c LEFT JOIN contribution_sources s ON s.id=c.source_id
        WHERE c.user_id=? ORDER BY c.published DESC,c.id DESC LIMIT 500`).bind(user.id).all()).results || [];
    return J({ sources: sources.map((s) => ({ ...s, public: !!s.public, active: !!s.active })), contributions: rows.map(contributionOutput) }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/contributions/update" && method === "POST") {
    const b = await request.json().catch(() => ({})), id = Math.floor(+b.id);
    const entry = await db.prepare("SELECT id FROM contributions WHERE id=? AND user_id=?").bind(id, user.id).first();
    if (!entry) return J({ error: "not_found" }, 404);
    const updates = [], values = [];
    if (b.category !== undefined) { updates.push("category=?"); values.push(cleanText(b.category, 100).replace(/[<>]/g, "").trim()); }
    if (b.topics !== undefined) { updates.push("topics=?"); values.push(JSON.stringify(topicsOf(b.topics))); }
    if (b.public !== undefined) { updates.push("public=?"); values.push(b.public ? 1 : 0); }
    if (!updates.length) return J({ error: "bad_request" }, 400);
    await db.prepare(`UPDATE contributions SET ${updates.join(",")} WHERE id=? AND user_id=?`).bind(...values, id, user.id).run();
    return J({ ok: true });
  }
  if (path === "/api/contributions/export" && method === "GET") {
    const data = await exportData(db, user.id, url.searchParams.get("from") || "", url.searchParams.get("to") || "");
    return data.error ? J(data, 400) : J(data, 200, { "cache-control": "no-store" });
  }
  return null;
}

export async function refreshContributions(env, max = 5) {
  const db = env.DB, t = now();
  const sources = (await db.prepare("SELECT * FROM contribution_sources WHERE active=1 AND fails<5 AND fetched<? ORDER BY fetched ASC LIMIT ?").bind(t - 1800, max).all()).results || [];
  let collected = 0;
  for (const source of sources) {
    try {
      const feed = source.feed || await discoverFeed(source.kind, source.url);
      if (!feed || !safeUrl(feed)) throw new Error("feed_not_found");
      const ctl = new AbortController(), timeout = setTimeout(() => ctl.abort(), 6000);
      let response;
      try { response = await fetch(feed, { signal: ctl.signal, redirect: "follow", headers: { "user-agent": "M365FM-contributions/1.0 (+https://www.m365.fm)", accept: "application/rss+xml, application/atom+xml, text/xml, */*" } }); }
      finally { clearTimeout(timeout); }
      if (!response.ok || !safeUrl(response.url || feed)) throw new Error("feed_unavailable");
      const items = parseFeed((await response.text()).slice(0, 600000), 20);
      const values = items.map((item) => db.prepare(`INSERT INTO contributions(user_id,source_id,title,url,published,kind,topics,public,created)
          VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(user_id,url) WHERE url<>'' DO UPDATE SET source_id=excluded.source_id,title=excluded.title,published=excluded.published,kind=excluded.kind,public=excluded.public`)
        .bind(source.user_id, source.id, item.title, item.url, item.t, source.kind === "youtube" ? "video" : source.kind, JSON.stringify(topicsOf(item.topics)), source.public, t));
      if (values.length) await db.batch(values);
      await db.prepare("UPDATE contribution_sources SET feed=?,fetched=?,fails=0 WHERE id=?").bind(feed, t, source.id).run();
      collected += items.length;
    } catch {
      await db.prepare("UPDATE contribution_sources SET fetched=?,fails=fails+1 WHERE id=?").bind(t, source.id).run();
    }
  }
  const metrics = await refreshContributionMetrics(env);
  return { sources: sources.length, collected, metrics };
}

async function refreshContributionMetrics(env) {
  const db = env.DB, t = now();
  const rows = (await db.prepare("SELECT id,url,kind FROM contributions WHERE metrics_updated<? AND (kind='video' OR url LIKE '%spreaker.com/episode/%') ORDER BY metrics_updated LIMIT 50").bind(t - 86400).all()).results || [];
  const videos = rows.map((r) => {
    try {
      const u = new URL(r.url);
      if (u.hostname === "youtu.be") return [r.id, u.pathname.slice(1)];
      if (YOUTUBE_HOSTS.has(u.hostname)) return [r.id, u.searchParams.get("v") || (/\/(?:shorts|embed)\/([^/?]+)/.exec(u.pathname) || [])[1]];
    } catch {}
    return null;
  }).filter((x) => x?.[1] && /^[A-Za-z0-9_-]{11}$/.test(x[1]));
  if (videos.length) {
    const access = await youtubeToken(env).catch(() => null);
    if (access) {
      for (let i = 0; i < videos.length; i += 50) {
        const batch = videos.slice(i, i + 50), ids = batch.map((x) => x[1]).join(",");
        try {
          const r = await fetch(`${env.YT_API || "https://www.googleapis.com"}/youtube/v3/videos?part=statistics&id=${ids}`, { headers: { authorization: "Bearer " + access } });
          if (!r.ok) continue;
          const counts = new Map(((await r.json()).items || []).map((x) => [x.id, Math.max(0, parseInt(x.statistics?.viewCount, 10) || 0)]));
          for (const [id, video] of batch) if (counts.has(video)) await db.prepare("UPDATE contributions SET views=?,metrics_updated=? WHERE id=?").bind(counts.get(video), t, id).run();
        } catch {}
      }
    }
  }
  const spreakerToken = env.SPREAKER_TOKEN;
  if (spreakerToken) for (const row of rows.filter((x) => /spreaker\.com\/episode\//i.test(x.url)).slice(0, 10)) {
    const id = /\/episode\/(\d+)/i.exec(row.url)?.[1];
    if (!id) continue;
    try {
      const r = await fetch(`https://api.spreaker.com/v2/episodes/${id}`, { headers: { authorization: "Bearer " + spreakerToken } });
      if (!r.ok) continue;
      const episode = (await r.json()).response?.episode;
      const allowedShows = String(env.SPREAKER_SHOW_IDS || "").split(",").map((x) => x.trim()).filter(Boolean);
      const downloads = Math.max(0, parseInt(episode?.downloads_count, 10) || 0);
      if (allowedShows.includes(String(episode?.show_id)) && downloads) await db.prepare("UPDATE contributions SET downloads=?,metrics_updated=? WHERE id=?").bind(downloads, t, row.id).run();
    } catch {}
  }
  return videos.length;
}
