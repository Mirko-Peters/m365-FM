import { cleanText, rateLimit } from "./util.js";
import { goodHost } from "./profiles.js";
import { discoverFeed, parseFeed } from "./feeds.js";
import { token as youtubeToken } from "./youtube.js";

const now = () => Math.floor(Date.now() / 1000);
const SOURCE_KINDS = ["podcast", "youtube", "blog", "github"];
const ENTRY_KINDS = ["podcast", "video", "blog", "session", "github", "article", "other"];
const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com"]);
const GITHUB_HOSTS = new Set(["github.com", "www.github.com"]);
const MVP_CATEGORIES = ["Video/Webcast/Podcast", "Blog", "Speaker/Presenter"];
const IMPORT_LIMIT = 5000;
const DEFAULT_CATEGORIES = { video: "Video/Webcast/Podcast", podcast: "Video/Webcast/Podcast", blog: "Blog", session: "Speaker/Presenter" };
const TOPIC_ID = /^[a-z0-9][a-z0-9-]{1,47}$/;
const SPREAKER_EPISODE = /^https:\/\/(?:www\.)?spreaker\.com\/episode\/(?:[a-z0-9-]+--)?(\d+)(?:[\/?#]|$)/i;

async function invalidateProfileExport(db) {
  await db.prepare("DELETE FROM export_cache WHERE k='profiles'").run().catch(() => {});
}

async function ensureContributionColumns(db) {
  try { await db.prepare("SELECT topics_edited FROM contributions LIMIT 1").first(); }
  catch { try { await db.prepare("ALTER TABLE contributions ADD COLUMN topics_edited INTEGER NOT NULL DEFAULT 0").run(); } catch {} }
  await db.prepare("CREATE TABLE IF NOT EXISTS contribution_ignored (user_id INTEGER NOT NULL, url TEXT NOT NULL, created INTEGER NOT NULL, PRIMARY KEY(user_id,url))").run();
}

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
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number" || (typeof value === "string" && /^\d+$/.test(value))) {
    const seconds = Number(value), date = new Date(seconds * 1000);
    return Number.isSafeInteger(seconds) && Number.isFinite(date.getTime()) ? seconds : null;
  }
  const day = String(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  const time = Date.parse(`${day}T00:00:00Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === day ? Math.floor(time / 1000) : null;
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
  const where = `c.user_id=? AND NOT EXISTS (SELECT 1 FROM contribution_ignored i WHERE i.user_id=c.user_id AND i.url=c.url)
    ${start === null ? "" : "AND c.published>=?"} ${end === null ? "" : "AND c.published<=?"}`;
  const binds = [uid, ...(start === null ? [] : [start]), ...(end === null ? [] : [end])];
  const total = (await db.prepare(`SELECT COUNT(*) n FROM contributions c WHERE ${where}`).bind(...binds).first()).n;
  const rows = (await db.prepare(`SELECT c.id,c.title,c.url,c.published,c.kind,c.category,c.topics,c.views,c.downloads,c.public,c.manual,
      COALESCE(s.title,'') source FROM contributions c LEFT JOIN contribution_sources s ON s.id=c.source_id
      WHERE ${where} ORDER BY c.published DESC,c.id DESC LIMIT 1000`).bind(...binds).all()).results || [];
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
  return { period: { from: from || "", to: to || "" }, total, items, ...(total > items.length ? { truncated: true } : {}), csv, copy };
}

export async function handleContributions(env, request, url, path, user, J) {
  const db = env.DB, method = request.method;
  if (!path.startsWith("/api/contributions/")) return null;
  if (!user) return J({ error: "login" }, 401);
  await ensureContributionColumns(db);

  if (path === "/api/contributions/sources" && method === "GET") {
    const rows = (await db.prepare("SELECT id,kind,url,feed,title,public,active,created,fetched,fails FROM contribution_sources WHERE user_id=? ORDER BY created DESC").bind(user.id).all()).results || [];
    return J({ sources: rows.map((s) => ({ ...s, public: !!s.public, active: !!s.active })) }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/contributions/source" && method === "POST") {
    if (!(await rateLimit(db, `contrib-source:${user.id}`, 10, 86400))) return J({ error: "rate_limit" }, 429);
    const b = await request.json().catch(() => ({})), kind = String(b.kind || ""), sourceUrl = safeUrl(b.url);
    if (!SOURCE_KINDS.includes(kind) || !sourceUrl ||
      (kind === "youtube" && !YOUTUBE_HOSTS.has(new URL(sourceUrl).hostname.toLowerCase())) ||
      (kind === "github" && !GITHUB_HOSTS.has(new URL(sourceUrl).hostname.toLowerCase()))) return J({ error: "bad_source" }, 400);
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
  if (path === "/api/contributions/source/update" && method === "POST") {
    const b = await request.json().catch(() => ({})), id = Math.floor(+b.id);
    if (!(await rateLimit(db, `contrib-source-update:${user.id}`, 30, 86400))) return J({ error: "rate_limit" }, 429);
    const source = await db.prepare("SELECT id,kind,url FROM contribution_sources WHERE id=? AND user_id=?").bind(id, user.id).first();
    if (!source) return J({ error: "not_found" }, 404);
    const updates = [], values = [];
    const kind = b.kind === undefined ? source.kind : String(b.kind);
    const sourceUrl = b.url === undefined ? source.url : safeUrl(b.url);
    if (!SOURCE_KINDS.includes(kind) || !sourceUrl ||
      (kind === "youtube" && !YOUTUBE_HOSTS.has(new URL(sourceUrl).hostname.toLowerCase())) ||
      (kind === "github" && !GITHUB_HOSTS.has(new URL(sourceUrl).hostname.toLowerCase()))) return J({ error: "bad_source" }, 400);
    if (b.kind !== undefined) { updates.push("kind=?"); values.push(kind); }
    if (b.url !== undefined) { updates.push("url=?"); values.push(sourceUrl); }
    if (b.url !== undefined || b.kind !== undefined) {
      updates.push("feed=?", "fetched=0", "fails=0");
      values.push(/\.(?:rss|xml|atom)(?:$|[?#])/i.test(sourceUrl) ? sourceUrl : "");
    }
    if (b.title !== undefined) { updates.push("title=?"); values.push(cleanText(b.title, 100).replace(/[<>]/g, "").trim()); }
    if (b.public !== undefined) { updates.push("public=?"); values.push(b.public ? 1 : 0); }
    if (b.active !== undefined) {
      updates.push("active=?"); values.push(b.active ? 1 : 0);
      if (b.active) { updates.push("fails=0", "fetched=MIN(fetched,?)"); values.push(now() - 1801); }
    }
    if (!updates.length) return J({ error: "bad_request" }, 400);
    try {
      await db.prepare(`UPDATE contribution_sources SET ${updates.join(",")} WHERE id=? AND user_id=?`).bind(...values, id, user.id).run();
    } catch (e) {
      if (/UNIQUE/i.test(String(e))) return J({ error: "source_exists" }, 409);
      throw e;
    }
    if (b.public !== undefined) {
      await db.prepare("UPDATE contributions SET public=? WHERE source_id=? AND user_id=? AND manual=0").bind(b.public ? 1 : 0, id, user.id).run();
      await invalidateProfileExport(db);
    }
    return J({ ok: true });
  }
  if (path === "/api/contributions/source/delete" && method === "POST") {
    const b = await request.json().catch(() => ({})), id = Math.floor(+b.id);
    const source = await db.prepare("SELECT id FROM contribution_sources WHERE id=? AND user_id=?").bind(id, user.id).first();
    if (!source) return J({ error: "not_found" }, 404);
    if (b.delete_contributions) await db.prepare("DELETE FROM contributions WHERE source_id=? AND user_id=?").bind(id, user.id).run();
    else await db.prepare("UPDATE contributions SET source_id=NULL WHERE source_id=? AND user_id=?").bind(id, user.id).run();
    await db.prepare("DELETE FROM contribution_sources WHERE id=? AND user_id=?").bind(id, user.id).run();
    await invalidateProfileExport(db);
    return J({ ok: true, deleted_contributions: !!b.delete_contributions });
  }
  if (path === "/api/contributions/manual" && method === "POST") {
    if (!(await rateLimit(db, `contrib-manual:${user.id}`, 30, 86400))) return J({ error: "rate_limit" }, 429);
    const b = await request.json().catch(() => ({})), title = cleanText(b.title, 200).replace(/[<>]/g, "").trim();
    const kind = String(b.kind || ""), link = b.url ? safeUrl(b.url) : "";
    if (title.length < 3 || !ENTRY_KINDS.includes(kind) || (b.url && !link)) return J({ error: "bad_contribution" }, 400);
    if ((await db.prepare("SELECT COUNT(*) n FROM contributions WHERE user_id=? AND manual=1").bind(user.id).first()).n >= 2000) return J({ error: "contribution_limit" }, 400);
    const published = dateValue(b.published);
    if (published === null) return J({ error: "bad_date" }, 400);
    const category = b.category === undefined || b.category === "" ? (DEFAULT_CATEGORIES[kind] || "") : cleanText(b.category, 100).replace(/[<>]/g, "").trim();
    if (category && !MVP_CATEGORIES.includes(category)) return J({ error: "bad_category" }, 400);
    const topics = topicsOf(b.topics);
    let r;
    try {
      r = await db.prepare("INSERT INTO contributions(user_id,title,url,published,kind,category,topics,public,manual,created) VALUES(?,?,?,?,?,?,?,?,1,?)")
        .bind(user.id, title, link, published, kind, category, JSON.stringify(topics), b.public ? 1 : 0, now()).run();
    } catch (e) {
      if (/UNIQUE/i.test(String(e))) return J({ error: "contribution_exists" }, 409);
      throw e;
    }
    if (b.public) await invalidateProfileExport(db);
    return J({ ok: true, id: r.meta.last_row_id }, 201);
  }
  if (path === "/api/contributions/mine" && method === "GET") {
    const sources = (await db.prepare("SELECT id,kind,url,title,public,active,fails,fetched FROM contribution_sources WHERE user_id=? ORDER BY created DESC").bind(user.id).all()).results || [];
    const rows = (await db.prepare(`SELECT c.id,c.title,c.url,c.published,c.kind,c.category,c.topics,c.views,c.downloads,c.public,c.manual,
        COALESCE(s.title,'') source FROM contributions c LEFT JOIN contribution_sources s ON s.id=c.source_id
        WHERE c.user_id=? AND NOT EXISTS (SELECT 1 FROM contribution_ignored i WHERE i.user_id=c.user_id AND i.url=c.url)
        ORDER BY c.published DESC,c.id DESC LIMIT 500`).bind(user.id).all()).results || [];
    return J({ sources: sources.map((s) => ({ ...s, public: !!s.public, active: !!s.active,
      status: s.fails >= 5 ? "paused_after_errors" : s.active ? "active" : "paused" })), contributions: rows.map(contributionOutput) }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/contributions/update" && method === "POST") {
    const b = await request.json().catch(() => ({})), id = Math.floor(+b.id);
    const entry = await db.prepare("SELECT id,public FROM contributions WHERE id=? AND user_id=?").bind(id, user.id).first();
    if (!entry) return J({ error: "not_found" }, 404);
    const updates = [], values = [];
    if (b.category !== undefined) {
      const category = cleanText(b.category, 100).replace(/[<>]/g, "").trim();
      if (category && !MVP_CATEGORIES.includes(category)) return J({ error: "bad_category" }, 400);
      updates.push("category=?"); values.push(category);
    }
    if (b.topics !== undefined) { updates.push("topics=?", "topics_edited=1"); values.push(JSON.stringify(topicsOf(b.topics))); }
    if (b.public !== undefined) { updates.push("public=?"); values.push(b.public ? 1 : 0); }
    if (!updates.length) return J({ error: "bad_request" }, 400);
    await db.prepare(`UPDATE contributions SET ${updates.join(",")} WHERE id=? AND user_id=?`).bind(...values, id, user.id).run();
    if (b.public !== undefined || entry.public) await invalidateProfileExport(db);
    return J({ ok: true });
  }
  if (path === "/api/contributions/delete" && method === "POST") {
    const b = await request.json().catch(() => ({})), id = Math.floor(+b.id);
    const entry = await db.prepare("SELECT id,url,manual FROM contributions WHERE id=? AND user_id=?").bind(id, user.id).first();
    if (!entry) return J({ error: "not_found" }, 404);
    await invalidateProfileExport(db);
    const remove = db.prepare("DELETE FROM contributions WHERE id=? AND user_id=?").bind(id, user.id);
    if (!entry.manual && entry.url) {
      await db.batch([
        db.prepare("INSERT OR IGNORE INTO contribution_ignored(user_id,url,created) VALUES(?,?,?)").bind(user.id, entry.url, now()),
        remove,
      ]);
      return J({ ok: true });
    }
    const result = await remove.run();
    return result.meta.changes ? J({ ok: true }) : J({ error: "not_found" }, 404);
  }
  if (path === "/api/contributions/export" && method === "GET") {
    const data = await exportData(db, user.id, url.searchParams.get("from") || "", url.searchParams.get("to") || "");
    return data.error ? J(data, 400) : J(data, 200, { "cache-control": "no-store" });
  }
  return null;
}

export async function refreshContributions(env, max = 5) {
  const db = env.DB, t = now();
  await ensureContributionColumns(db);
  const sources = (await db.prepare("SELECT * FROM contribution_sources WHERE active=1 AND fails<5 AND fetched<? ORDER BY fetched ASC LIMIT ?").bind(t - 1800, max).all()).results || [];
  let collected = 0;
  for (const source of sources) {
    try {
      const readFeed = async (feedUrl) => {
        const ctl = new AbortController(), timeout = setTimeout(() => ctl.abort(), 6000);
        try {
          const response = await fetch(feedUrl, { signal: ctl.signal, redirect: "follow", headers: { "user-agent": "M365FM-contributions/1.0 (+https://www.m365.fm)", accept: "application/rss+xml, application/atom+xml, text/xml, */*" } });
          if (!response.ok || !safeUrl(response.url || feedUrl)) return [];
          return parseFeed((await response.text()).slice(0, 600000), 20);
        } finally { clearTimeout(timeout); }
      };
      let feed = source.feed, items = feed ? await readFeed(feed) : await readFeed(source.url);
      if (!items.length && !feed) { feed = await discoverFeed(source.kind, source.url); if (feed) items = await readFeed(feed); }
      if (!feed && items.length) feed = source.url;
      if (!feed || !items.length) throw new Error("feed_unavailable");
      const existing = new Set(((await db.prepare("SELECT url FROM contributions WHERE user_id=?").bind(source.user_id).all()).results || []).map((r) => r.url));
      const ignored = new Set(((await db.prepare("SELECT url FROM contribution_ignored WHERE user_id=?").bind(source.user_id).all()).results || []).map((r) => r.url));
      let imports = (await db.prepare(`SELECT COUNT(*) n FROM contributions c WHERE c.user_id=? AND c.manual=0
        AND NOT EXISTS (SELECT 1 FROM contribution_ignored i WHERE i.user_id=c.user_id AND i.url=c.url)`).bind(source.user_id).first()).n;
      const categories = { podcast: DEFAULT_CATEGORIES.podcast, youtube: DEFAULT_CATEGORIES.video, blog: DEFAULT_CATEGORIES.blog };
      const values = [];
      for (const item of items) {
        if (ignored.has(item.url)) continue;
        if (!existing.has(item.url) && imports >= IMPORT_LIMIT) continue;
        if (!existing.has(item.url)) { existing.add(item.url); imports++; }
        const category = categories[source.kind] || "";
        values.push(db.prepare(`INSERT INTO contributions(user_id,source_id,title,url,published,kind,category,topics,public,created)
          SELECT ?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM contribution_ignored WHERE user_id=? AND url=?)
          ON CONFLICT(user_id,url) WHERE url<>'' DO UPDATE SET
          title=CASE WHEN contributions.manual=0 THEN excluded.title ELSE contributions.title END,
          topics=CASE WHEN contributions.manual=0 AND contributions.topics_edited=0 AND contributions.topics='[]' THEN excluded.topics ELSE contributions.topics END`)
          .bind(source.user_id, source.id, item.title, item.url, item.t, source.kind === "youtube" ? "video" : source.kind,
            category, JSON.stringify(topicsOf(item.topics)), source.public, t, source.user_id, item.url));
      }
      if (values.length) await db.batch(values);
      if (source.public && values.length) await invalidateProfileExport(db);
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
  const youtubeRows = (await db.prepare(`SELECT c.id,c.user_id,c.url,c.kind FROM contributions c WHERE c.metrics_updated<? AND (
      c.url LIKE 'https://youtu.be/%' OR c.url LIKE 'https://youtube.com/%' OR c.url LIKE 'https://www.youtube.com/%' OR c.url LIKE 'https://m.youtube.com/%'
    ) ORDER BY c.metrics_updated LIMIT 50`).bind(t - 86400).all()).results || [];
  const spreakerCandidates = (await db.prepare(`SELECT c.id,c.user_id,c.url,c.kind FROM contributions c WHERE c.metrics_updated<? AND
      (c.url LIKE 'https://spreaker.com/episode/%' OR c.url LIKE 'https://www.spreaker.com/episode/%')
      ORDER BY c.metrics_updated LIMIT 50`).bind(t - 86400).all()).results || [];
  for (const row of youtubeRows) await db.prepare("UPDATE contributions SET metrics_updated=? WHERE id=? AND user_id=?").bind(t, row.id, row.user_id).run();
  const spreakerRows = [];
  for (const row of spreakerCandidates) {
    const episodeId = SPREAKER_EPISODE.exec(row.url)?.[1];
    if (!episodeId) {
      await db.prepare("UPDATE contributions SET metrics_updated=? WHERE id=? AND user_id=?").bind(t, row.id, row.user_id).run();
      continue;
    }
    const owned = await db.prepare(`SELECT
      EXISTS(SELECT 1 FROM pod_episodes e WHERE e.user_id=? AND e.status='published' AND e.spreaker_id=?)
      OR EXISTS(SELECT 1 FROM item_guests g JOIN pod_episodes e ON e.id=g.item_id AND e.status='published'
        WHERE g.kind='podcast' AND g.status='confirmed' AND g.user_id=? AND e.spreaker_id=?) allowed`).bind(row.user_id, episodeId, row.user_id, episodeId).first();
    if (!owned?.allowed) {
      await db.prepare("UPDATE contributions SET metrics_updated=? WHERE id=? AND user_id=?").bind(t, row.id, row.user_id).run();
      continue;
    }
    if (spreakerRows.length >= 10) break;
    spreakerRows.push({ ...row, episodeId });
    await db.prepare("UPDATE contributions SET metrics_updated=? WHERE id=? AND user_id=?").bind(t, row.id, row.user_id).run();
  }
  const rows = [...youtubeRows, ...spreakerRows];
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
          for (const [id, video] of batch) if (counts.has(video)) await db.prepare("UPDATE contributions SET views=? WHERE id=?").bind(counts.get(video), id).run();
        } catch {}
      }
    }
  }
  const spreakerToken = env.SPREAKER_TOKEN;
  if (spreakerToken) for (const row of spreakerRows) {
    try {
      const r = await fetch(`https://api.spreaker.com/v2/episodes/${row.episodeId}`, { headers: { authorization: "Bearer " + spreakerToken } });
      if (!r.ok) continue;
      const episode = (await r.json()).response?.episode;
      const allowedShows = String(env.SPREAKER_SHOW_IDS || "").split(",").map((x) => x.trim()).filter(Boolean);
      const downloads = Math.max(0, parseInt(episode?.downloads_count, 10) || 0);
      if (allowedShows.includes(String(episode?.show_id)) && downloads) await db.prepare("UPDATE contributions SET downloads=? WHERE id=?").bind(downloads, row.id).run();
    } catch {}
  }
  return videos.length;
}
