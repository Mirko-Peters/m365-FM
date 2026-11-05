import { cleanText, rateLimit } from "./util.js";
import { goodHost } from "./profiles.js";
import { discoverFeed, parseFeed } from "./feeds.js";
import { token as youtubeToken } from "./youtube.js";
import { mvpActivity, gdeActivity, MVP_AUDIENCES, MVP_ROLES, EVENT_FORMATS, MVP_PORTAL_URL } from "./mvp_mapping.js";

const now = () => Math.floor(Date.now() / 1000);
const SOURCE_KINDS = ["podcast", "youtube", "blog", "github"];
const ENTRY_KINDS = ["podcast", "video", "blog", "session", "github", "article", "book", "workshop", "mentoring", "other"];
const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com"]);
const GITHUB_HOSTS = new Set(["github.com", "www.github.com"]);
const MVP_CATEGORIES = ["Video/Webcast/Podcast", "Blog", "Speaker/Presenter", "Book/E-book"];
const IMPORT_LIMIT = 5000;
const DEFAULT_CATEGORIES = { video: "Video/Webcast/Podcast", podcast: "Video/Webcast/Podcast", blog: "Blog", session: "Speaker/Presenter", book: "Book/E-book" };
const TOPIC_ID = /^[a-z0-9][a-z0-9-]{1,47}$/;
const SPREAKER_EPISODE = /^https:\/\/(?:www\.)?spreaker\.com\/episode\/(?:[a-z0-9-]+--)?(\d+)(?:[\/?#]|$)/i;
const COLS = `c.id,c.title,c.url,c.published,c.kind,c.category,c.topics,c.views,c.downloads,c.public,c.manual,c.portal,c.portal_at,c.review,
  c.portal_desc,c.role,c.audience,c.area,c.attendees,c.live_views,c.sessions,c.event_format,c.country`;
const NEW_COLUMNS = [["topics_edited", "INTEGER NOT NULL DEFAULT 0"], ["portal", "INTEGER NOT NULL DEFAULT 0"], ["portal_at", "INTEGER NOT NULL DEFAULT 0"],
  ["review", "TEXT NOT NULL DEFAULT ''"], ["portal_desc", "TEXT NOT NULL DEFAULT ''"], ["role", "TEXT NOT NULL DEFAULT ''"], ["audience", "TEXT NOT NULL DEFAULT '[]'"],
  ["area", "TEXT NOT NULL DEFAULT ''"], ["attendees", "INTEGER NOT NULL DEFAULT 0"], ["live_views", "INTEGER NOT NULL DEFAULT 0"], ["sessions", "INTEGER NOT NULL DEFAULT 0"],
  ["event_format", "TEXT NOT NULL DEFAULT ''"], ["country", "TEXT NOT NULL DEFAULT ''"]];
// Lesbare Fehlertexte (MCP und API); die Oberflaeche uebersetzt anhand von error
const MESSAGES = {
  login: "Please sign in.", rate_limit: "Too many changes today. Please try again later.", bad_source: "The source needs a valid https URL that matches its type (YouTube or GitHub links for those types).",
  source_exists: "This source already exists.", source_limit: "You can add up to 20 sources.", not_found: "Not found or not yours.", bad_request: "Nothing to change.",
  bad_contribution: "A contribution needs a title (3-200 characters), a known type and an optional https link.", contribution_limit: "Too many manual contributions.",
  bad_date: "Use a valid date as YYYY-MM-DD.", bad_category: `Category must be one of: ${MVP_CATEGORIES.join(", ")}.`, contribution_exists: "A contribution with this link already exists.",
  bad_period: "Use from/to as YYYY-MM-DD with from <= to.", bad_format: "format must be csv, mvp or gde.", bad_field: "A field is invalid.", not_editable: "Title, link, date and type can only be changed for contributions added by hand.",
  bad_url: "Enter a public https link.", bad_month: "report_start must be a month number from 1 (January) to 12 (December).", preview_failed: "The link could not be read. Fill in the fields by hand.",
};
const fail = (J, error, status, extra = {}) => J({ error, message: MESSAGES[error] || "Request failed.", ...extra }, status);

async function ensureContributionColumns(db) {
  try { await db.prepare("SELECT topics_edited,portal,country,(SELECT report_start FROM user_prefs LIMIT 1) rs FROM contributions LIMIT 1").first(); }
  catch {
    for (const [name, type] of NEW_COLUMNS) { try { await db.prepare(`ALTER TABLE contributions ADD COLUMN ${name} ${type}`).run(); } catch {} }
    try { await db.prepare("ALTER TABLE user_prefs ADD COLUMN report_start INTEGER NOT NULL DEFAULT 4").run(); } catch {}
  }
  await db.prepare("CREATE TABLE IF NOT EXISTS contribution_ignored (user_id INTEGER NOT NULL, url TEXT NOT NULL, created INTEGER NOT NULL, PRIMARY KEY(user_id,url))").run();
}

// Oeffentliche Profile kommen aus einem Zwischenspeicher (Cron alle 30 Minuten). Wird etwas Oeffentliches privat, verborgen oder geloescht,
// verwerfen wir ihn, damit der naechste Seitenbau es nicht mehr zeigt.
async function invalidateProfileExport(db) {
  await db.prepare("DELETE FROM export_cache WHERE k='profiles'").run().catch(() => {});
}

function safeUrl(value) {
  try {
    const u = new URL(String(value || "").trim());
    if (u.protocol !== "https:" || u.username || u.password || !goodHost(u.hostname) || u.href.length > 400) return "";
    u.hash = "";
    return u.href;
  } catch { return ""; }
}

function sourceOk(kind, sourceUrl) {
  if (!SOURCE_KINDS.includes(kind) || !sourceUrl) return false;
  const host = new URL(sourceUrl).hostname.toLowerCase();
  return !(kind === "youtube" && !YOUTUBE_HOSTS.has(host)) && !(kind === "github" && !GITHUB_HOSTS.has(host));
}

function topicsOf(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.slice(0, 10).map((x) => String(x || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
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

const plain = (v, n) => cleanText(v, n).replace(/[<>]/g, "").trim();

// Felder fuers Portal (MVP/GDE) und den Tracker-Status; gemeinsam fuer manuell anlegen und aendern. {error} bei ungueltigen Werten.
function detailFields(b) {
  const out = {};
  if (b.description !== undefined) out.portal_desc = plain(b.description, 2000);
  if (b.role !== undefined) { const r = String(b.role || ""); if (r && !MVP_ROLES.includes(r)) return { error: "bad_field", field: "role" }; out.role = r; }
  if (b.audience !== undefined) {
    if (!Array.isArray(b.audience) || b.audience.some((a) => !MVP_AUDIENCES.includes(a))) return { error: "bad_field", field: "audience" };
    out.audience = JSON.stringify([...new Set(b.audience)]);
  }
  if (b.area !== undefined) out.area = plain(b.area, 100);
  for (const k of ["attendees", "live_views", "sessions", "views"]) if (b[k] !== undefined) {
    const n = Number(b[k]);
    if (!Number.isInteger(n) || n < 0 || n > 1e9) return { error: "bad_field", field: k };
    out[k] = n;
  }
  if (b.event_format !== undefined) { const f = String(b.event_format || ""); if (f && !EVENT_FORMATS.includes(f)) return { error: "bad_field", field: "event_format" }; out.event_format = f; }
  if (b.country !== undefined) out.country = plain(b.country, 60);
  return out;
}

function contributionOutput(row) {
  let topics = [], audience = [];
  try { topics = JSON.parse(row.topics || "[]"); } catch {}
  try { audience = JSON.parse(row.audience || "[]"); } catch {}
  const mvp = mvpActivity(row);
  return { id: row.id, title: row.title, url: row.url, published: row.published, kind: row.kind, category: row.category,
    topics, views: row.views, downloads: row.downloads, public: !!row.public, manual: !!row.manual, source: row.source || "",
    portal: !!row.portal, portal_at: row.portal_at || 0, review: row.review || "", description: row.portal_desc || "", role: row.role || "",
    audience, area: row.area || "", attendees: row.attendees || 0, live_views: row.live_views || 0, sessions: row.sessions || 0,
    event_format: row.event_format || "", country: row.country || "", mvp };
}

// Beginn des Berichtsjahrs (Monat 1-12); ohne Eintrag April (ab April zaehlen Beitraege fuer die MVP-Verlaengerung)
async function settingsOf(db, uid) {
  const r = await db.prepare("SELECT report_start FROM user_prefs WHERE user_id=?").bind(uid).first().catch(() => null);
  const m = Number(r?.report_start);
  return { report_start: Number.isInteger(m) && m >= 1 && m <= 12 ? m : 4 };
}

const dayOf = (t) => new Date(t * 1000).toISOString().slice(0, 10);

async function exportData(db, uid, p) {
  const date = (value, end = false) => {
    if (!value) return null;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
    const time = Date.parse(`${value}T00:00:00Z`);
    if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== value) return NaN;
    return Math.floor(Date.parse(`${value}T${end ? "23:59:59" : "00:00:00"}Z`) / 1000);
  };
  const from = p.from || "", to = p.to || "", format = p.format || "csv", category = p.category || "", portal = p.portal || "all";
  const start = date(from), end = date(to, true);
  if (Number.isNaN(start) || Number.isNaN(end) || (start !== null && end !== null && start > end)) return { error: "bad_period" };
  if (!["csv", "mvp", "gde"].includes(format)) return { error: "bad_format" };
  if (category && category !== "none" && !MVP_CATEGORIES.includes(category)) return { error: "bad_category" };
  if (!["all", "open", "entered"].includes(portal)) return { error: "bad_field", field: "portal" };
  // Verborgene und noch nicht bestaetigte Eintraege (review<>'') gehen in keinen Export
  const where = `c.user_id=? AND c.review='' AND NOT EXISTS (SELECT 1 FROM contribution_ignored i WHERE i.user_id=c.user_id AND i.url=c.url)
    ${start === null ? "" : "AND c.published>=?"} ${end === null ? "" : "AND c.published<=?"} ${category ? "AND c.category=?" : ""}
    ${portal === "open" ? "AND c.portal=0" : portal === "entered" ? "AND c.portal=1" : ""}`;
  const binds = [uid, ...(start === null ? [] : [start]), ...(end === null ? [] : [end]), ...(category ? [category === "none" ? "" : category] : [])];
  const total = (await db.prepare(`SELECT COUNT(*) n FROM contributions c WHERE ${where}`).bind(...binds).first()).n;
  const rows = (await db.prepare(`SELECT ${COLS}, COALESCE(s.title,'') source FROM contributions c LEFT JOIN contribution_sources s ON s.id=c.source_id
      WHERE ${where} ORDER BY c.published DESC,c.id DESC LIMIT 1000`).bind(...binds).all()).results || [];
  const period = { from, to }, more = total > rows.length ? { truncated: true } : {};
  if (format === "mvp" || format === "gde") {
    const map = format === "mvp" ? mvpActivity : gdeActivity, items = [], skipped = [];
    for (const r of rows) {
      const m = map(r);
      if (m) items.push({ id: r.id, in_portal: !!r.portal, ...m }); else skipped.push({ id: r.id, title: r.title, kind: r.kind, reason: format === "mvp" ? "no_mvp_type" : "no_gde_type" });
    }
    return { format, period, total, ready: items.filter((x) => x.ready).length, items, skipped, ...more,
      ...(format === "mvp" ? { portal: MVP_PORTAL_URL, note: "No automatic submission: copy each field into the MVP portal, then mark the entry as entered (update_contribution portal=true)." } : {}) };
  }
  const items = rows.map(contributionOutput).map(({ mvp, ...x }) => x);
  const columns = ["title", "url", "published", "kind", "category", "topics", "views", "downloads", "in_portal"];
  const csv = [columns.map(csvCell).join(","), ...items.map((x) => [
    x.title, x.url, dayOf(x.published), x.kind, x.category, x.topics.join("; "), x.views, x.downloads, x.portal ? "yes" : "no",
  ].map(csvCell).join(","))].join("\r\n");
  const de = p.lang === "de";
  const L = de ? ["Kategorie", "Noch zuordnen", "Beitrag", "Link", "Datum", "Typ", "Entitäten/Themen", "Kennzahlen", "YouTube-Aufrufe", "Spreaker-Downloads", "Beschreibung"]
    : ["Category", "Not assigned yet", "Contribution", "Link", "Date", "Type", "Entities/topics", "Metrics", "YouTube views", "Spreaker downloads", "Description"];
  const copy = items.map((x) => [
    `${L[0]}: ${x.category || L[1]}`,
    `${L[2]}: ${x.title}`,
    `${L[3]}: ${x.url || "—"}`,
    `${L[4]}: ${dayOf(x.published)}`,
    `${L[5]}: ${x.kind}`,
    `${L[6]}: ${x.topics.join(", ") || "—"}`,
    `${L[7]}: ${x.views ? `${x.views} ${L[8]}` : ""}${x.views && x.downloads ? ", " : ""}${x.downloads ? `${x.downloads} ${L[9]}` : ""}`.trim(),
    ...(x.description ? [`${L[10]}: ${x.description}`] : []),
  ].join("\n")).join("\n\n");
  return { period, total, items, ...more, csv, copy };
}

// "Per Link": Titel, Datum, Kurzbeschreibung und Art aus den Metadaten einer oeffentlichen Seite vorschlagen (nichts wird gespeichert).
const KIND_HOSTS = [[/(^|\.)(youtube\.com|youtu\.be|vimeo\.com)$/, "video"], [/(^|\.)(spreaker\.com|podcasts\.apple\.com|podbean\.com|buzzsprout\.com)$/, "podcast"],
  [/^open\.spotify\.com$/, "podcast"], [/(^|\.)(sessionize\.com|meetup\.com|eventbrite\.[a-z.]+|m365con\.net)$/, "session"], [/(^|\.)github\.com$/, "github"]];
const unent = (s) => String(s || "").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&amp;/g, "&");
function metaOf(html, names) {
  for (const n of names) {
    const re = new RegExp(`<meta\\b[^>]*(?:property|name|itemprop)=["']${n}["'][^>]*>`, "i"), tag = re.exec(html)?.[0];
    const c = tag && /content=["']([^"']*)["']/i.exec(tag)?.[1];
    if (c) return unent(c).trim();
  }
  return "";
}
export function previewFromHtml(html, pageUrl) {
  const host = new URL(pageUrl).hostname.toLowerCase();
  const title = metaOf(html, ["og:title", "twitter:title"]) || unent(/<title[^>]*>([^<]{1,300})<\/title>/i.exec(html)?.[1] || "").trim();
  const rawDate = metaOf(html, ["article:published_time", "datePublished", "uploadDate", "og:published_time", "date"])
    || /"(?:datePublished|uploadDate)"\s*:\s*"([^"]{8,40})"/.exec(html)?.[1] || /<time[^>]+datetime=["']([^"']{8,40})["']/i.exec(html)?.[1] || "";
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(rawDate);
  const description = metaOf(html, ["og:description", "description", "twitter:description"]);
  const kind = (KIND_HOSTS.find(([re]) => re.test(host)) || [, "blog"])[1];
  return { url: pageUrl, title: plain(title, 200), published: m && dateValue(m[1]) !== null ? m[1] : "", description: plain(description, 1000), kind };
}

export async function handleContributions(env, request, url, path, user, J) {
  const db = env.DB, method = request.method;
  if (!path.startsWith("/api/contributions/")) return null;
  if (!user) return fail(J, "login", 401);
  await ensureContributionColumns(db);

  if (path === "/api/contributions/sources" && method === "GET") {
    const rows = (await db.prepare("SELECT id,kind,url,feed,title,public,active,created,fetched,fails FROM contribution_sources WHERE user_id=? ORDER BY created DESC").bind(user.id).all()).results || [];
    return J({ sources: rows.map((s) => ({ ...s, public: !!s.public, active: !!s.active })) }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/contributions/source" && method === "POST") {
    if (!(await rateLimit(db, `contrib-source:${user.id}`, 10, 86400))) return fail(J, "rate_limit", 429);
    const b = await request.json().catch(() => ({})), kind = String(b.kind || ""), sourceUrl = safeUrl(b.url);
    if (!sourceOk(kind, sourceUrl)) return fail(J, "bad_source", 400);
    if ((await db.prepare("SELECT COUNT(*) n FROM contribution_sources WHERE user_id=?").bind(user.id).first()).n >= 20) return fail(J, "source_limit", 400);
    const title = plain(b.title || "", 100);
    const feed = /\.(?:rss|xml|atom)(?:$|[?#])/i.test(sourceUrl) ? sourceUrl : "";
    try {
      await db.prepare("INSERT INTO contribution_sources(user_id,kind,url,feed,title,public,created) VALUES(?,?,?,?,?,?,?)")
        .bind(user.id, kind, sourceUrl, feed, title, b.public ? 1 : 0, now()).run();
    } catch (e) {
      if (/UNIQUE/i.test(String(e))) return fail(J, "source_exists", 409);
      throw e;
    }
    return J({ ok: true, source: { kind, url: sourceUrl, title, public: !!b.public, feed_status: feed ? "ready" : "discovery_pending" } }, 201);
  }
  if (path === "/api/contributions/source/update" && method === "POST") {
    const b = await request.json().catch(() => ({})), id = Math.floor(+b.id);
    if (!(await rateLimit(db, `contrib-source-update:${user.id}`, 30, 86400))) return fail(J, "rate_limit", 429);
    const source = await db.prepare("SELECT id,kind,url,public FROM contribution_sources WHERE id=? AND user_id=?").bind(id, user.id).first();
    if (!source) return fail(J, "not_found", 404);
    const updates = [], values = [];
    if (b.kind !== undefined || b.url !== undefined) {
      const kind = b.kind === undefined ? source.kind : String(b.kind), sourceUrl = b.url === undefined ? source.url : safeUrl(b.url);
      if (!sourceOk(kind, sourceUrl)) return fail(J, "bad_source", 400);
      if (kind !== source.kind || sourceUrl !== source.url) {
        updates.push("kind=?", "url=?", "feed=?", "fetched=0", "fails=0");
        values.push(kind, sourceUrl, /\.(?:rss|xml|atom)(?:$|[?#])/i.test(sourceUrl) ? sourceUrl : "");
      }
    }
    if (b.title !== undefined) { updates.push("title=?"); values.push(plain(b.title, 100)); }
    if (b.public !== undefined) { updates.push("public=?"); values.push(b.public ? 1 : 0); }
    if (b.active !== undefined) {
      updates.push("active=?"); values.push(b.active ? 1 : 0);
      if (b.active) { updates.push("fails=0", "fetched=MIN(fetched,?)"); values.push(now() - 1801); }
    }
    if (!updates.length) return fail(J, "bad_request", 400);
    try {
      await db.prepare(`UPDATE contribution_sources SET ${updates.join(",")} WHERE id=? AND user_id=?`).bind(...values, id, user.id).run();
    } catch (e) {
      if (/UNIQUE/i.test(String(e))) return fail(J, "source_exists", 409);
      throw e;
    }
    if (b.public !== undefined) {
      await db.prepare("UPDATE contributions SET public=? WHERE source_id=? AND user_id=? AND manual=0").bind(b.public ? 1 : 0, id, user.id).run();
      if (!b.public) await invalidateProfileExport(db);
    }
    return J({ ok: true });
  }
  if (path === "/api/contributions/source/delete" && method === "POST") {
    const b = await request.json().catch(() => ({})), id = Math.floor(+b.id);
    const source = await db.prepare("SELECT id FROM contribution_sources WHERE id=? AND user_id=?").bind(id, user.id).first();
    if (!source) return fail(J, "not_found", 404);
    if (b.delete_contributions) {
      await db.prepare("DELETE FROM contributions WHERE source_id=? AND user_id=?").bind(id, user.id).run();
      await invalidateProfileExport(db);
    } else await db.prepare("UPDATE contributions SET source_id=NULL WHERE source_id=? AND user_id=?").bind(id, user.id).run();
    await db.prepare("DELETE FROM contribution_sources WHERE id=? AND user_id=?").bind(id, user.id).run();
    return J({ ok: true, deleted_contributions: !!b.delete_contributions });
  }
  if (path === "/api/contributions/manual" && method === "POST") {
    if (!(await rateLimit(db, `contrib-manual:${user.id}`, 30, 86400))) return fail(J, "rate_limit", 429);
    const b = await request.json().catch(() => ({})), title = plain(b.title, 200);
    const kind = String(b.kind || ""), link = b.url ? safeUrl(b.url) : "";
    if (title.length < 3 || !ENTRY_KINDS.includes(kind) || (b.url && !link)) return fail(J, "bad_contribution", 400);
    if ((await db.prepare("SELECT COUNT(*) n FROM contributions WHERE user_id=? AND manual=1").bind(user.id).first()).n >= 2000) return fail(J, "contribution_limit", 400);
    const published = dateValue(b.published);
    if (published === null) return fail(J, "bad_date", 400);
    const category = b.category === undefined || b.category === "" ? (DEFAULT_CATEGORIES[kind] || "") : plain(b.category, 100);
    if (category && !MVP_CATEGORIES.includes(category)) return fail(J, "bad_category", 400);
    const extra = detailFields(b);
    if (extra.error) return fail(J, extra.error, 400, { field: extra.field });
    const topics = topicsOf(b.topics), cols = Object.keys(extra);
    let r;
    try {
      r = await db.prepare(`INSERT INTO contributions(user_id,title,url,published,kind,category,topics,public,manual,created${cols.map((c) => "," + c).join("")})
          VALUES(?,?,?,?,?,?,?,?,1,?${cols.map(() => ",?").join("")})`)
        .bind(user.id, title, link, published, kind, category, JSON.stringify(topics), b.public ? 1 : 0, now(), ...cols.map((c) => extra[c])).run();
    } catch (e) {
      if (/UNIQUE/i.test(String(e))) return fail(J, "contribution_exists", 409);
      throw e;
    }
    return J({ ok: true, id: r.meta.last_row_id }, 201);
  }
  if (path === "/api/contributions/preview" && method === "GET") {
    if (!(await rateLimit(db, `contrib-preview:${user.id}`, 60, 86400))) return fail(J, "rate_limit", 429);
    const link = safeUrl(url.searchParams.get("url"));
    if (!link) return fail(J, "bad_url", 400);
    const ctl = new AbortController(), timeout = setTimeout(() => ctl.abort(), 6000);
    try {
      const r = await fetch(link, { signal: ctl.signal, redirect: "follow", headers: { "user-agent": "M365FM-contributions/1.0 (+https://www.m365.fm)", accept: "text/html,*/*;q=0.5" } });
      const finalUrl = safeUrl(r.url || link);
      if (!r.ok || !finalUrl || !/html/i.test(r.headers.get("content-type") || "text/html")) return J({ ok: true, preview: { url: link, title: "", published: "", description: "", kind: previewFromHtml("", link).kind }, partial: true });
      return J({ ok: true, preview: previewFromHtml((await r.text()).slice(0, 400000), link) }, 200, { "cache-control": "no-store" });
    } catch { return J({ ok: true, preview: { url: link, title: "", published: "", description: "", kind: previewFromHtml("", link).kind }, partial: true }); }
    finally { clearTimeout(timeout); }
  }
  if (path === "/api/contributions/mine" && method === "GET") {
    const sources = (await db.prepare("SELECT id,kind,url,title,public,active,fails,fetched FROM contribution_sources WHERE user_id=? ORDER BY created DESC").bind(user.id).all()).results || [];
    const rows = (await db.prepare(`SELECT ${COLS}, COALESCE(s.title,'') source FROM contributions c LEFT JOIN contribution_sources s ON s.id=c.source_id
        WHERE c.user_id=? AND NOT EXISTS (SELECT 1 FROM contribution_ignored i WHERE i.user_id=c.user_id AND i.url=c.url)
        ORDER BY c.published DESC,c.id DESC LIMIT 500`).bind(user.id).all()).results || [];
    return J({ sources: sources.map((s) => ({ ...s, public: !!s.public, active: !!s.active,
      status: s.fails >= 5 ? "paused_after_errors" : s.active ? "active" : "paused" })), contributions: rows.map(contributionOutput),
      settings: await settingsOf(db, user.id),
      options: { categories: MVP_CATEGORIES, kinds: ENTRY_KINDS, roles: MVP_ROLES, audiences: MVP_AUDIENCES, event_formats: EVENT_FORMATS, portal: MVP_PORTAL_URL } }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/contributions/settings" && method === "GET") return J({ settings: await settingsOf(db, user.id) }, 200, { "cache-control": "no-store" });
  if (path === "/api/contributions/settings" && method === "POST") {
    if (!(await rateLimit(db, `contrib-settings:${user.id}`, 60, 86400))) return fail(J, "rate_limit", 429);
    const b = await request.json().catch(() => ({})), m = Number(b.report_start);
    if (!Number.isInteger(m) || m < 1 || m > 12) return fail(J, "bad_month", 400, { field: "report_start" });
    // vorhandene Nutzer-Einstellungen (user_prefs) erweitern, andere Spalten bleiben unangetastet
    await db.prepare("INSERT INTO user_prefs(user_id,report_start) VALUES(?,?) ON CONFLICT(user_id) DO UPDATE SET report_start=excluded.report_start").bind(user.id, m).run();
    return J({ ok: true, settings: await settingsOf(db, user.id) });
  }
  if (path === "/api/contributions/update" && method === "POST") {
    if (!(await rateLimit(db, `contrib-update:${user.id}`, 600, 86400))) return fail(J, "rate_limit", 429);
    const b = await request.json().catch(() => ({})), id = Math.floor(+b.id);
    const entry = await db.prepare("SELECT id,public,manual,review FROM contributions WHERE id=? AND user_id=?").bind(id, user.id).first();
    if (!entry) return fail(J, "not_found", 404);
    const updates = [], values = [], set = (col, v) => { updates.push(`${col}=?`); values.push(v); };
    if (b.category !== undefined) {
      const category = plain(b.category, 100);
      if (category && !MVP_CATEGORIES.includes(category)) return fail(J, "bad_category", 400);
      set("category", category);
    }
    if (b.topics !== undefined) { updates.push("topics=?", "topics_edited=1"); values.push(JSON.stringify(topicsOf(b.topics))); }
    if (b.public !== undefined) set("public", b.public ? 1 : 0);
    if (b.portal !== undefined) { set("portal", b.portal ? 1 : 0); set("portal_at", b.portal ? now() : 0); }
    if (b.review !== undefined) {   // "" = bestaetigt/sichtbar, "hidden" = verborgen; "pending" setzt nur der Import (z. B. Event-Scraper)
      if (!["", "hidden"].includes(b.review)) return fail(J, "bad_field", 400, { field: "review" });
      set("review", b.review);
    }
    if (["title", "url", "published", "kind"].some((k) => b[k] !== undefined)) {
      if (!entry.manual) return fail(J, "not_editable", 400);
      if (b.title !== undefined) { const t = plain(b.title, 200); if (t.length < 3) return fail(J, "bad_contribution", 400); set("title", t); }
      if (b.url !== undefined) { const l = b.url ? safeUrl(b.url) : ""; if (b.url && !l) return fail(J, "bad_url", 400); set("url", l); }
      if (b.published !== undefined) { const d = dateValue(b.published); if (d === null) return fail(J, "bad_date", 400); set("published", d); }
      if (b.kind !== undefined) { if (!ENTRY_KINDS.includes(b.kind)) return fail(J, "bad_contribution", 400); set("kind", b.kind); }
    }
    const extra = detailFields(b);
    if (extra.error) return fail(J, extra.error, 400, { field: extra.field });
    for (const [k, v] of Object.entries(extra)) set(k, v);
    if (!updates.length) return fail(J, "bad_request", 400);
    try {
      await db.prepare(`UPDATE contributions SET ${updates.join(",")} WHERE id=? AND user_id=?`).bind(...values, id, user.id).run();
    } catch (e) {
      if (/UNIQUE/i.test(String(e))) return fail(J, "contribution_exists", 409);
      throw e;
    }
    if (entry.public && !entry.review && (b.public === false || b.review === "hidden" || b.title !== undefined || b.url !== undefined)) await invalidateProfileExport(db);
    return J({ ok: true });
  }
  if (path === "/api/contributions/delete" && method === "POST") {
    const b = await request.json().catch(() => ({})), id = Math.floor(+b.id);
    const entry = await db.prepare("SELECT id,url,manual,public FROM contributions WHERE id=? AND user_id=?").bind(id, user.id).first();
    if (!entry) return fail(J, "not_found", 404);
    const remove = db.prepare("DELETE FROM contributions WHERE id=? AND user_id=?").bind(id, user.id);
    if (!entry.manual && entry.url) {
      await db.batch([
        db.prepare("INSERT OR IGNORE INTO contribution_ignored(user_id,url,created) VALUES(?,?,?)").bind(user.id, entry.url, now()),
        remove,
      ]);
      if (entry.public) await invalidateProfileExport(db);
      return J({ ok: true });
    }
    const result = await remove.run();
    if (result.meta.changes && entry.public) await invalidateProfileExport(db);
    return result.meta.changes ? J({ ok: true }) : fail(J, "not_found", 404);
  }
  if (path === "/api/contributions/export" && method === "GET") {
    const q = (k) => url.searchParams.get(k) || "";
    const data = await exportData(db, user.id, { from: q("from"), to: q("to"), format: q("format"), category: q("category"), portal: q("portal"), lang: q("lang") });
    return data.error ? fail(J, data.error, 400, data.field ? { field: data.field } : {}) : J(data, 200, { "cache-control": "no-store" });
  }
  return null;
}

export async function recordExpertContribution(db, userId, request, created = now()) {
  const title = cleanText(`Expert Connect: ${request.title}`, 200).replace(/[<>]/g, "").trim();
  await db.prepare(`INSERT OR IGNORE INTO contributions(user_id,title,published,kind,category,topics,public,manual,created,expert_request_id)
    VALUES(?,?,?,'article','Speaker/Presenter',?,0,1,?,?)`)
    .bind(userId, title, created, JSON.stringify(topicsOf(JSON.parse(request.topics || "[]"))), created, request.id).run();
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
