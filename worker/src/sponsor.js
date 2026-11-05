import { cleanText, esc, rateLimit, sha256hex } from "./util.js";
import { notify } from "./mail.js";
import { handleAdGo, adStatsForOrg } from "./ads.js";

const now = () => Math.floor(Date.now() / 1000);
const STATUSES = new Set(["new", "contacted", "won", "lost", "spam"]);
const EMAIL = /^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,}$/i;
function cleanPackage(value) {
  if (typeof value === "string") {
    if (value.length > 5000) return null;
    try { value = JSON.parse(value); } catch { return null; }
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const clean = (v, depth = 0) => {
    if (typeof v === "string") return cleanText(v, 300);
    if (typeof v === "number") return Number.isFinite(v) ? v : null;
    if (typeof v === "boolean" || v === null) return v;
    if (Array.isArray(v)) return depth < 2 ? v.slice(0, 20).map((x) => clean(x, depth + 1)) : [];
    if (typeof v === "object" && depth < 2) {
      return Object.fromEntries(Object.entries(v).slice(0, 30).map(([k, x]) => [cleanText(k, 40), clean(x, depth + 1)]));
    }
    return null;
  };
  const result = clean(value);
  return JSON.stringify(result).length <= 5000 ? result : null;
}

// Preise: Paket v1 (T37 Sponsor-Seite) schickt fertige Zeichenketten wie "$7,700", aeltere Anfragen Zahlen.
// Gleiche Regel in assets/admin.js (Reiter Sponsor-Anfragen): Zahl -> "$" + en-US-Gruppierung, Zeichenkette bleibt.
function money(x) {
  if (typeof x === "number" && Number.isFinite(x)) return `${x < 0 ? "-" : ""}$${Math.abs(x).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  if (typeof x === "string") { const s = x.trim().slice(0, 80); return /^\d+(?:\.\d+)?$/.test(s) ? money(Number(s)) : s; }
  return "";
}

// Kurzfassung fuer die Benachrichtigung. Liest Paket v1 (goal, topics, duration, components, extras, monthlyUsd, oneOffUsd, totalUsd)
// und die Schluessel aelterer Anfragen (ziel, themen, laufzeit, months, bausteine, preisMonat, gesamtpreis ...).
function packageDetails(pkg) {
  const value = (...keys) => keys.map((k) => pkg[k]).find((x) => x !== undefined && x !== null && x !== "");
  const items = (v) => (Array.isArray(v) ? v : [v]).map((x) => x == null ? "" : typeof x === "object" ? JSON.stringify(x) : String(x)).filter(Boolean);
  const list = (v, sep = ", ") => v === undefined ? undefined : items(v).join(sep);
  const duration = value("duration", "term", "laufzeit", "months");
  const summary = [
    value("goal", "target", "ziel", "destination", "audience"),
    list(value("topics", "themen")),
    typeof duration === "number" ? `${duration} Monate` : duration,
    list(value("components", "blocks", "bausteine", "elements"), "; "),   // v1-Zeilen enthalten Betraege mit Komma ("$12,000/month")
    list(value("extras"), "; "),
  ].filter(Boolean).join(" · ") || JSON.stringify(pkg).slice(0, 300);
  const monthly = money(value("monthlyUsd", "monthly_usd", "monthlyPrice", "priceMonthly", "monthly", "preisMonat"));
  const oneOff = money(value("oneOffUsd", "one_off_usd", "oneOff", "oneTimeUsd", "oneTime", "einmalig"));
  const total = money(value("totalUsd", "total_usd", "totalPrice", "priceTotal", "total", "gesamtpreis"));
  return { summary, price: [monthly && `${monthly}/Monat`, oneOff && `${oneOff} einmalig`, total && `${total} gesamt`].filter(Boolean).join(" · ") || "–" };
}

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const SURFACES = new Set(["topic", "entity", "episode", "video-desc", "post", "sponsor-page", "newsletter", "press"]);
const METRIC_SOURCES = {
  spreaker: new Set(["podcast_plays"]),
  youtube: new Set(["video_views", "video_watch_minutes", "video_retention"]),
  cloudflare: new Set(["page_views"]),
  gsc: new Set(["gsc_impressions", "gsc_clicks"]),
  bing_webmaster: new Set(["bing_impressions", "bing_clicks"]),
  press_ranger: new Set(["press_views", "ai_visibility"]),
};
const SOURCE_BY_METRIC = {
  people_reached: ["Cross-channel estimate", "estimated"],
  podcast_plays: ["Spreaker API", "measured"],
  video_views: ["YouTube Analytics API", "measured"],
  page_views: ["Cloudflare Analytics", "measured"],
  link_clicks: ["M365.FM-Linkzähler", "measured"],
  project_requests: ["D1-Projektanfragen (#232)", "measured"],
  ai_citations: ["Bing AI Performance", "manual"],
  search_impressions: ["Google Search Console", "measured"],
};

function isDay(value) {
  if (!DAY.test(String(value || ""))) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function selectedPeriod(url) {
  const today = new Date().toISOString().slice(0, 10);
  const fallback = new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10);
  const from = url.searchParams.get("from") || fallback;
  const to = url.searchParams.get("to") || today;
  return isDay(from) && isDay(to) && from <= to ? { from, to } : null;
}

function safeTarget(value) {
  try {
    const url = new URL(String(value || ""));
    return url.protocol === "https:" && url.hostname && !url.username && !url.password ? url : null;
  } catch { return null; }
}

function cleanUtm(value) {
  let input = value;
  if (typeof input === "string") {
    try { input = input.startsWith("{") ? JSON.parse(input) : Object.fromEntries(new URLSearchParams(input)); }
    catch { return {}; }
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const out = {};
  for (const [key, val] of Object.entries(input)) {
    const text = String(val);
    if (/^utm_[a-z0-9_]{1,32}$/.test(key) && /^[A-Za-z0-9._-]{1,80}$/.test(text)) out[key] = text;
  }
  return out;
}

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const value = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(value), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function noIndexHeaders(extra = {}) {
  return { "x-robots-tag": "noindex, nofollow", "cache-control": "no-store", ...extra };
}

export async function handleSponsorLink(env, request, url, path, ctx) {
  const code = path.slice("/go/".length);
  const headers = noIndexHeaders();
  const miss = () => new Response(null, { status: 404, headers });
  if (!/^[a-z0-9-]{3,40}$/.test(code) || !["GET", "HEAD"].includes(request.method)) {
    return new Response(null, { status: code ? 404 : 404, headers });
  }
  const link = await env.DB.prepare("SELECT code,target_url,utm FROM sponsor_links WHERE code=? AND active=1").bind(code).first();
  if (!link && code.startsWith("ad-")) return handleAdGo(env, request, url, code, ctx);   // #281: gebuchte Werbeplaetze
  const target = safeTarget(link?.target_url);
  if (!link || !target) return miss();
  for (const [key, value] of Object.entries(cleanUtm(link.utm))) target.searchParams.set(key, value);

  const purpose = ["sec-purpose", "purpose", "x-purpose"].map((key) => request.headers.get(key) || "").join(" ").toLowerCase();
  const bot = request.headers.get("user-agent") || "";
  const botManagement = request.cf?.botManagement;
  const score = Number(botManagement?.score);
  const shouldCount = request.method === "GET" && !/\b(prefetch|prerender)\b/.test(purpose) &&
    request.headers.get("x-moz")?.toLowerCase() !== "prefetch" &&
    !botManagement?.verifiedBot && !(Number.isFinite(score) && score < 30) &&
    !/(bot|crawl|spider|slurp|preview|facebookexternalhit|linkedinbot|slackbot|discordbot|whatsapp|telegrambot|curl|wget|python-requests|headless)/i.test(bot);
  if (shouldCount && env.SESSION_SECRET && ctx?.waitUntil) {
    ctx.waitUntil((async () => {
      const day = new Date().toISOString().slice(0, 10);
      const salt = await hmac(env.SESSION_SECRET, `go:${day}`);
      const keyHash = await hmac(salt, `${request.headers.get("cf-connecting-ip") || ""}|${bot}|${code}`);
      const cache = globalThis.caches?.default;
      let duplicate = false;
      if (cache) {
        const cacheKey = new Request(`https://dedupe.m365.fm/${keyHash}`);
        duplicate = !!(await cache.match(cacheKey));
        if (!duplicate) {
          const ttl = Math.max(1, Math.ceil((Date.parse(`${day}T23:59:59.999Z`) - Date.now()) / 1000));
          await cache.put(cacheKey, new Response("1", { headers: { "cache-control": `public, max-age=${ttl}` } }));
        }
      }
      if (duplicate) return;
      const rawSurface = url.searchParams.get("s") || "";
      const surface = SURFACES.has(rawSurface) ? rawSurface : "other";
      const country = /^[A-Z]{2}$/.test(request.cf?.country || "") ? request.cf.country : "XX";
      await env.DB.prepare(`INSERT INTO sponsor_clicks_daily(day,code,surface,country,clicks)
        VALUES(?,?,?,?,1) ON CONFLICT(day,code,surface,country) DO UPDATE SET clicks=clicks+1`)
        .bind(day, code, surface, country).run();
    })().catch(() => {}));
  }
  headers.location = target.href;
  return new Response(null, { status: 302, headers });
}

export async function handleSponsor(env, request, url, path, J, user) {
  const db = env.DB;
  if (path === "/api/sponsor/dashboard" && request.method === "GET") {
    if (!user) return J({ error: "login" }, 401);
    const period = selectedPeriod(url);
    if (!period) return J({ error: "bad_period" }, 400, { "cache-control": "no-store" });
    const orgFilter = url.searchParams.get("org") || "";
    const orgs = (await db.prepare(`SELECT DISTINCT o.id,o.handle,o.name
      FROM orgs o
      WHERE ((?=1 AND (?<>'' OR EXISTS (SELECT 1 FROM sponsor_placements sp WHERE sp.org_id=o.id)
          OR EXISTS (SELECT 1 FROM event_partners ep WHERE ep.org_id=o.id)
          OR EXISTS (SELECT 1 FROM ad_bookings ab WHERE ab.org_id=o.id AND ab.status<>'draft')))
        OR (?=0 AND (EXISTS (SELECT 1 FROM sponsor_placements sp WHERE sp.org_id=o.id)
          OR EXISTS (SELECT 1 FROM event_partners ep WHERE ep.org_id=o.id)
          OR EXISTS (SELECT 1 FROM ad_bookings ab WHERE ab.org_id=o.id AND ab.status<>'draft'))
          AND EXISTS (SELECT 1 FROM org_members m WHERE m.org_id=o.id AND m.user_id=?
            AND m.status='active' AND m.role IN ('owner','admin','events'))))
        AND (?='' OR o.handle=?)
      ORDER BY o.name,o.id`).bind(user.admin ? 1 : 0, orgFilter, user.admin ? 1 : 0, user.id,
        user.admin ? orgFilter : "", user.admin ? orgFilter : "").all()).results || [];
    const companies = user.admin ? ((await db.prepare("SELECT id,handle,name FROM orgs ORDER BY name,id").all()).results || []) : [];
    const items = [];
    const nextMonthStart = new Date(`${period.to.slice(0, 7)}-01T00:00:00Z`);
    nextMonthStart.setUTCMonth(nextMonthStart.getUTCMonth() + 1);
    const nextMonth = nextMonthStart.toISOString().slice(0, 7);
    const nextMonthEnd = new Date(Date.UTC(Number(nextMonth.slice(0, 4)), Number(nextMonth.slice(5, 7)), 0)).toISOString().slice(0, 10);
    const weekEnd = new Date(`${period.to}T00:00:00Z`);
    weekEnd.setUTCDate(weekEnd.getUTCDate() - ((weekEnd.getUTCDay() + 6) % 7));
    const weekStart = new Date(weekEnd);
    weekStart.setUTCDate(weekStart.getUTCDate() - 49);
    for (const org of orgs) {
      const placements = (await db.prepare(`SELECT id,title,channel,langs,start,end,refs,created,
        CASE WHEN start>? THEN 'upcoming' WHEN end IS NOT NULL AND end<? THEN 'ended' ELSE 'active' END status
        FROM sponsor_placements WHERE org_id=? AND (start IS NULL OR start<=?) AND (end IS NULL OR end>=?)
        ORDER BY start DESC,id`).bind(period.to, period.from, org.id, period.to, period.from).all()).results || [];
      const eventPartners = (await db.prepare(`SELECT e.handle id,e.title,e.start,e.end,p.kind,p.level,p.status
        FROM event_partners p JOIN events e ON e.id=p.event_id WHERE p.org_id=?
        AND (e.start IS NULL OR substr(e.start,1,10)<=?) AND (e.end IS NULL OR substr(e.end,1,10)>=?)
        ORDER BY e.start DESC,e.id DESC`).bind(org.id, period.to, period.from).all()).results || [];
      const aggregate = (await db.prepare(`SELECT metric,SUM(value) value,MAX(fetched_at) fetched_at
        FROM sponsor_metrics_daily WHERE placement_id IN (SELECT id FROM sponsor_placements WHERE org_id=?)
        AND day>=? AND day<=? GROUP BY metric`).bind(org.id, period.from, period.to).all()).results || [];
      const weekly = (await db.prepare(`SELECT date(day,'-'||((CAST(strftime('%w',day) AS INTEGER)+6)%7)||' days') week,
        SUM(CASE WHEN metric='podcast_plays' THEN value ELSE 0 END) podcast,
        SUM(CASE WHEN metric='video_views' THEN value ELSE 0 END) video,
        SUM(CASE WHEN metric='page_views' THEN value ELSE 0 END) website
        FROM sponsor_metrics_daily WHERE placement_id IN (SELECT id FROM sponsor_placements WHERE org_id=?)
        AND day>=? AND day<=? GROUP BY week ORDER BY week`)
        .bind(org.id, weekStart.toISOString().slice(0, 10), period.to).all()).results || [];
        const nextPlacements = (await db.prepare(`SELECT id,title,channel,langs,start,end,refs
        FROM sponsor_placements WHERE org_id=? AND start>=? AND start<=? ORDER BY start,id`)
        .bind(org.id, `${nextMonth}-01`, nextMonthEnd).all()).results || [];
      const sums = Object.fromEntries(aggregate.map((row) => [row.metric, row]));
      const linkClicks = (await db.prepare(`SELECT COALESCE(SUM(c.clicks),0) value,MAX(c.day) last_day
        FROM sponsor_clicks_daily c JOIN sponsor_links l ON l.code=c.code
        JOIN sponsor_placements p ON p.id=l.placement_id
        WHERE p.org_id=? AND c.day>=? AND c.day<=?`).bind(org.id, period.from, period.to).first());
      const manual = (await db.prepare(`SELECT m.placement_id,m.source,m.metric,m.period,m.value,m.link,m.updated
        FROM sponsor_manual_metrics m JOIN sponsor_placements p ON p.id=m.placement_id
        WHERE p.org_id=? AND m.period>=substr(?,1,7) AND m.period<=substr(?,1,7)
        ORDER BY m.period DESC,m.placement_id,m.metric`).bind(org.id, period.from, period.to).all()).results || [];
      const metrics = Object.entries(SOURCE_BY_METRIC).map(([key, [source, kind]]) => {
        const row = key === "link_clicks" ? linkClicks :
          key === "ai_citations" ? manual.filter((metric) => metric.metric === key).reduce((sum, metric) => ({
            value: sum.value + metric.value, fetched_at: Math.max(sum.fetched_at || 0, metric.updated || 0),
          }), { value: 0, fetched_at: 0 }) : sums[key === "search_impressions" ? "gsc_impressions" : key];
        const hasValue = row && (row.fetched_at || row.last_day);
        const fetchedAt = row?.fetched_at || (row?.last_day ? Date.parse(`${row.last_day}T00:00:00Z`) / 1000 : 0);
        return { key, value: hasValue ? Number(row.value) : null, source, kind,
          as_of: fetchedAt ? new Date(fetchedAt * 1000).toISOString().slice(0, 10) : null };
      });
      const placementRows = [];
      for (const placement of placements) {
        let refs = {};
        try { refs = JSON.parse(placement.refs || "{}"); } catch {}
        const records = (await db.prepare(`SELECT day,metric,dim,value,source,kind,fetched_at
          FROM sponsor_metrics_daily WHERE placement_id=? AND day>=? AND day<=? ORDER BY day,metric,dim`)
          .bind(placement.id, period.from, period.to).all()).results || [];
        const clickBreakdown = (await db.prepare(`SELECT c.surface,c.country,SUM(c.clicks) clicks,MAX(c.day) as_of
          FROM sponsor_clicks_daily c JOIN sponsor_links l ON l.code=c.code
          WHERE l.placement_id=? AND c.day>=? AND c.day<=? GROUP BY c.surface,c.country`)
          .bind(placement.id, period.from, period.to).all()).results || [];
        placementRows.push({ ...placement, refs, metrics: records, clicks: clickBreakdown });
      }
      const ads = await adStatsForOrg(db, org.id, period.from, period.to).catch(() => []);   // #281: gebuchte Werbeplaetze
      items.push({ id: org.id, handle: org.handle, name: org.name, metrics, weekly, next_placements: nextPlacements, ads,
        manual: manual.map((metric) => ({ ...metric, kind: "manual", as_of: new Date(metric.updated * 1000).toISOString().slice(0, 10) })),
        placements: placementRows.map((placement) => ({ ...placement, type: placement.channel })),
        event_partners: eventPartners.map((event) => ({ ...event, type: "event_partner", metric: null })),
      });
    }
    return J({ orgs: items, companies, admin: !!user.admin, period }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/sponsor/placement" && request.method === "GET") {
    if (!user) return J({ error: "login" }, 401, { "cache-control": "no-store" });
    const id = String(url.searchParams.get("id") || "");
    const placement = await db.prepare(`SELECT p.*,o.id org_id,o.handle org_handle,o.name org_name
      FROM sponsor_placements p JOIN orgs o ON o.id=p.org_id WHERE p.id=?`).bind(id).first();
    if (!placement) return J({ error: "not_found" }, 404, { "cache-control": "no-store" });
    if (!user.admin && !(await db.prepare(`SELECT 1 FROM org_members WHERE org_id=? AND user_id=?
      AND status='active' AND role IN ('owner','admin','events')`).bind(placement.org_id, user.id).first())) {
      return J({ error: "not_found" }, 404, { "cache-control": "no-store" });
    }
    const period = selectedPeriod(url);
    if (!period) return J({ error: "bad_period" }, 400, { "cache-control": "no-store" });
    const metrics = (await db.prepare(`SELECT day,metric,dim,value,source,kind,fetched_at FROM sponsor_metrics_daily
      WHERE placement_id=? AND day>=? AND day<=? ORDER BY day,metric,dim`).bind(id, period.from, period.to).all()).results || [];
    const manual = (await db.prepare(`SELECT source,metric,period,value,link,updated FROM sponsor_manual_metrics
      WHERE placement_id=? AND period BETWEEN substr(?,1,7) AND substr(?,1,7) ORDER BY period,metric`)
      .bind(id, period.from, period.to).all()).results || [];
    const clicks = (await db.prepare(`SELECT c.surface,c.country,SUM(c.clicks) clicks,MAX(c.day) as_of
      FROM sponsor_clicks_daily c JOIN sponsor_links l ON l.code=c.code
      WHERE l.placement_id=? AND c.day>=? AND c.day<=? GROUP BY c.surface,c.country`)
      .bind(id, period.from, period.to).all()).results || [];
    return J({ placement, metrics, manual, clicks, period }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/sponsor/sources" && request.method === "GET") {
    if (!user) return J({ error: "login" }, 401);
    if (!user.admin) return J({ error: "forbidden" }, 403);
    const orgs = (await db.prepare("SELECT id,handle,name FROM orgs ORDER BY name,id").all()).results || [];
    const placements = (await db.prepare("SELECT id,org_id,title,channel,langs,start,end,refs FROM sponsor_placements ORDER BY title").all()).results || [];
    const sources = (await db.prepare(`SELECT source,MAX(fetched_at) fetched_at FROM sponsor_metrics_daily GROUP BY source
      UNION ALL SELECT source,MAX(updated) fetched_at FROM sponsor_manual_metrics GROUP BY source
      UNION ALL SELECT 'sponsor_links' source,MAX(strftime('%s',day)) fetched_at FROM sponsor_clicks_daily`).all()).results || [];
    return J({ orgs, placements, sources }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/sponsor/manual-metric" && request.method === "POST") {
    if (!user) return J({ error: "login" }, 401);
    if (!user.admin) return J({ error: "forbidden" }, 403);
    const body = (await request.json().catch(() => ({}))) || {};
    const source = String(body.source || ""), allowed = source === "bing_ai" ? new Set(["ai_citations"]) :
      source === "press_portal" ? new Set(["views", "clicks"]) : new Set();
    const placementId = String(body.placement_id || "");
    const period = String(body.period || ""), link = String(body.link || "").trim(), proof = String(body.proof_key || "").trim();
    const proofValid = /^[A-Za-z0-9][A-Za-z0-9/_\-.]{0,199}$/.test(proof) && !proof.split("/").includes("..");
    const linkValid = !link || !!safeTarget(link);
    const values = Array.isArray(body.values) ? body.values : [{ metric: body.metric, value: body.value }];
    const dedup = new Set();
    const entries = values.map((entry) => ({ metric: String(entry?.metric || ""), value: Number(entry?.value) }));
    for (const entry of entries) {
      if (!allowed.has(entry.metric) || !Number.isFinite(entry.value) || entry.value < 0 || entry.value > 1_000_000_000 || dedup.has(entry.metric)) {
        return J({ error: "bad_request" }, 400, { "cache-control": "no-store" });
      }
      dedup.add(entry.metric);
    }
    if (!entries.length || entries.length > 3 || !placementId || !/^\d{4}-(0[1-9]|1[0-2])$/.test(period) ||
        !proofValid || !linkValid) return J({ error: "bad_request" }, 400, { "cache-control": "no-store" });
    const placement = await db.prepare("SELECT id FROM sponsor_placements WHERE id=?").bind(placementId).first();
    if (!placement) return J({ error: "not_found" }, 404, { "cache-control": "no-store" });
    const updated = now();
    await db.batch(entries.map((entry) => db.prepare(`INSERT INTO sponsor_manual_metrics
      (placement_id,source,metric,period,value,link,proof_key,entered_by,updated) VALUES(?,?,?,?,?,?,?,?,?)
      ON CONFLICT(placement_id,source,metric,period) DO UPDATE SET value=excluded.value,link=excluded.link,
      proof_key=excluded.proof_key,entered_by=excluded.entered_by,updated=excluded.updated`)
      .bind(placementId, source, entry.metric, period, entry.value, link, proof, user.id, updated)));
    return J({ ok: true, as_of: new Date(updated * 1000).toISOString().slice(0, 10) }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/sponsor/placement" && request.method === "POST") {
    if (!user) return J({ error: "login" }, 401, { "cache-control": "no-store" });
    if (!user.admin) return J({ error: "forbidden" }, 403, { "cache-control": "no-store" });
    const body = (await request.json().catch(() => ({}))) || {};
    const id = String(body.id || ""), orgId = Number(body.org_id), title = cleanText(body.title, 160).trim();
    const channel = String(body.channel || ""), langs = String(body.langs || "").slice(0, 120);
    const start = body.start ? String(body.start) : null, end = body.end ? String(body.end) : null;
    const refs = body.refs && typeof body.refs === "object" && !Array.isArray(body.refs) ? body.refs : {};
    if (!/^[a-z0-9][a-z0-9-]{1,63}$/.test(id) || !Number.isSafeInteger(orgId) || !title ||
        !["podcast_video", "website", "press", "event", "app"].includes(channel) ||
        (start && !isDay(start)) || (end && !isDay(end)) || (start && end && start > end)) {
      return J({ error: "bad_request" }, 400, { "cache-control": "no-store" });
    }
    const org = await db.prepare("SELECT 1 FROM orgs WHERE id=?").bind(orgId).first();
    if (!org) return J({ error: "not_found" }, 404, { "cache-control": "no-store" });
    await db.prepare(`INSERT INTO sponsor_placements(id,org_id,title,channel,langs,start,end,refs,created)
      VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET org_id=excluded.org_id,title=excluded.title,
      channel=excluded.channel,langs=excluded.langs,start=excluded.start,end=excluded.end,refs=excluded.refs`)
      .bind(id, orgId, title, channel, langs, start, end, JSON.stringify(refs), now()).run();
    return J({ ok: true, id }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/sponsor/link-stats" && request.method !== "GET") {
    return J({ error: "method_not_allowed" }, 405, { "cache-control": "no-store" });
  }
  if (path === "/api/sponsor/link-stats" && request.method === "GET") {
    if (!user) return J({ error: "login" }, 401, { "cache-control": "no-store" });
    const orgHandle = url.searchParams.get("org") || "";
    const month = url.searchParams.get("month") || new Date().toISOString().slice(0, 7);
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return J({ error: "bad_period" }, 400, { "cache-control": "no-store" });
    const org = await db.prepare("SELECT id,handle FROM orgs WHERE handle=?").bind(orgHandle).first();
    if (!org || (!user.admin && !(await db.prepare(`SELECT 1 FROM org_members WHERE org_id=? AND user_id=?
      AND status='active' AND role IN ('owner','admin','events')`).bind(org.id, user.id).first()))) {
      return J({ error: "not_found" }, 404, { "cache-control": "no-store" });
    }
    const stats = (await db.prepare(`SELECT l.code,l.placement_id,c.surface,c.country,SUM(c.clicks) clicks
      FROM sponsor_links l JOIN sponsor_placements p ON p.id=l.placement_id AND p.org_id=?
      LEFT JOIN sponsor_clicks_daily c ON c.code=l.code AND c.day>=? AND c.day<=?
      GROUP BY l.code,l.placement_id,c.surface,c.country ORDER BY l.code,c.surface,c.country`)
      .bind(org.id, `${month}-01`, `${month}-31`).all()).results || [];
    return J({ month, org: org.handle, stats }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/sponsor/go-codes" && request.method === "GET") {
    const codes = (await db.prepare("SELECT code FROM sponsor_links WHERE active=1 ORDER BY code").all()).results || [];
    return J({ codes: codes.map((item) => item.code) }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/internal/sponsor-placements" && request.method === "GET") {
    if (!env.CRON_KEY || request.headers.get("x-cron-key") !== env.CRON_KEY) return J({ error: "forbidden" }, 403, { "cache-control": "no-store" });
    const placements = (await db.prepare(`SELECT p.id,p.org_id,o.name org_name,p.title,p.channel,p.langs,p.start,p.end,p.refs
      FROM sponsor_placements p JOIN orgs o ON o.id=p.org_id ORDER BY p.id`).all()).results || [];
    return J({ placements }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/internal/sponsor-metrics" && request.method === "POST") {
    if (!env.CRON_KEY || request.headers.get("x-cron-key") !== env.CRON_KEY) return J({ error: "forbidden" }, 403, { "cache-control": "no-store" });
    const body = (await request.json().catch(() => ({}))) || {};
    const entries = Array.isArray(body.metrics) ? body.metrics : [];
    if (!entries.length || entries.length > 500) return J({ error: "bad_request" }, 400, { "cache-control": "no-store" });
    const fetchedAt = now(), writes = [], placementIds = new Set();
    const placements = (await db.prepare("SELECT id FROM sponsor_placements").all()).results || [];
    const validPlacements = new Set(placements.map((placement) => placement.id));
    const validated = [];
    for (const entry of entries) {
      const source = String(entry?.source || ""), metric = String(entry?.metric || ""), day = String(entry?.day || "");
      const placementId = String(entry?.placement_id || ""), dim = String(entry?.dim || "").slice(0, 200);
      const value = Number(entry?.value), kind = entry?.kind || "measured";
      if (!METRIC_SOURCES[source]?.has(metric) || !isDay(day) || !placementId ||
          !Number.isFinite(value) || value < 0 || value > 1_000_000_000_000 ||
          !["measured", "estimated", "manual"].includes(kind)) {
        return J({ error: "bad_metric" }, 400, { "cache-control": "no-store" });
      }
      placementIds.add(placementId);
      validated.push({ placementId, day, metric, dim, value, source, kind });
    }
    if ([...placementIds].some((id) => !validPlacements.has(id))) {
      return J({ error: "bad_placement" }, 400, { "cache-control": "no-store" });
    }
    for (const { placementId, day, metric, dim, value, source, kind } of validated) {
      writes.push(db.prepare(`INSERT INTO sponsor_metrics_daily(placement_id,day,metric,dim,value,source,kind,fetched_at)
        SELECT ?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM sponsor_placements WHERE id=?)
        ON CONFLICT(placement_id,day,metric,dim,source) DO UPDATE SET value=excluded.value,
        kind=excluded.kind,fetched_at=excluded.fetched_at`)
        .bind(placementId, day, metric, dim, value, source, kind, fetchedAt, placementId));
    }
    await db.batch(writes);
    return J({ ok: true, count: writes.length }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/admin/sponsor-links" && ["GET", "POST"].includes(request.method)) {
    if (!user) return J({ error: "login" }, 401, { "cache-control": "no-store" });
    if (!user.admin) return J({ error: "forbidden" }, 403, { "cache-control": "no-store" });
    if (request.method === "GET") {
      const links = (await db.prepare(`SELECT code,org_id,placement_id,target_url,utm,active,created_at
        FROM sponsor_links ORDER BY created_at DESC`).all()).results || [];
      return J({ links }, 200, { "cache-control": "no-store" });
    }
    const body = (await request.json().catch(() => ({}))) || {};
    const code = String(body.code || ""), orgId = Number(body.org_id), placementId = String(body.placement_id || "");
    const target = safeTarget(body.target_url), utm = cleanUtm(body.utm);
    if (!/^[a-z0-9-]{3,40}$/.test(code) || !Number.isSafeInteger(orgId) || !target ||
        !await db.prepare("SELECT 1 FROM sponsor_placements WHERE id=? AND org_id=?").bind(placementId, orgId).first()) {
      return J({ error: "bad_request" }, 400, { "cache-control": "no-store" });
    }
    const inserted = await db.prepare(`INSERT INTO sponsor_links(code,org_id,placement_id,target_url,utm,active,created_at)
      VALUES(?,?,?,?,?,1,?) ON CONFLICT(code) DO NOTHING`)
      .bind(code, orgId, placementId, target.href, JSON.stringify(utm), now()).run();
    if (!inserted.meta.changes) return J({ error: "code_taken" }, 409, { "cache-control": "no-store" });
    return J({ ok: true }, 200, { "cache-control": "no-store" });
  }
  const linkUpdate = /^\/api\/admin\/sponsor-links\/([a-z0-9-]{3,40})$/.exec(path);
  if (linkUpdate && request.method === "POST") {
    if (!user) return J({ error: "login" }, 401, { "cache-control": "no-store" });
    if (!user.admin) return J({ error: "forbidden" }, 403, { "cache-control": "no-store" });
    const body = (await request.json().catch(() => ({}))) || {};
    if (typeof body.active !== "boolean") return J({ error: "bad_request" }, 400, { "cache-control": "no-store" });
    const result = await db.prepare("UPDATE sponsor_links SET active=? WHERE code=?").bind(body.active ? 1 : 0, linkUpdate[1]).run();
    return result.meta.changes ? J({ ok: true }, 200, { "cache-control": "no-store" }) :
      J({ error: "not_found" }, 404, { "cache-control": "no-store" });
  }
  if (!(path === "/api/sponsor/request" && request.method === "POST")) return null;
  const body = (await request.json().catch(() => ({}))) || {};
  const company = cleanText(body.company, 160), name = cleanText(body.name, 120);
  const email = cleanText(body.email, 254).toLowerCase();
  const message = cleanText(body.message, 2000);
  const lang = /^[a-z]{2}(?:-[A-Z]{2})?$/.test(String(body.lang || "")) ? String(body.lang) : "de";
  const pkg = cleanPackage(body.package);
  if (company.length < 2 || name.length < 2 || !EMAIL.test(email) || !pkg) return J({ error: "bad_request" }, 400);

  const clientIp = request.headers.get("cf-connecting-ip") || "0";
  const ipHash = await sha256hex(`${env.SESSION_SECRET}:sponsor:${clientIp}`);
  if (!(await rateLimit(db, `sponsor:${ipHash}:h`, 5, 3600)) || !(await rateLimit(db, `sponsor:${ipHash}:d`, 20, 86400))) return J({ error: "rate_limit" }, 429);

  const spam = !!cleanText(body.website, 500);
  const created = now(), details = packageDetails(pkg);
  const result = await db.prepare("INSERT INTO sponsor_requests(created,company,name,email,message,package,status,ip_hash,lang) VALUES(?,?,?,?,?,?,?,?,?)")
    .bind(created, company, name, email, message, JSON.stringify(pkg), spam ? "spam" : "new", ipHash, lang).run();
  const id = result.meta.last_row_id;
  if (!spam) {
    const admins = (await db.prepare("SELECT id,role,provider,sub FROM users WHERE banned=0").all()).results || [];
    const allow = new Set((env.ADMIN_SUBS || "").split(",").map((s) => s.trim()).filter(Boolean));
    const recipients = admins.filter((u) => u.role === "admin" || allow.has(`${u.provider}:${u.sub}`)).sort((a, b) => a.id - b.id);
    const panel = `${env.SITE}/admin/#sponsor`;   // der Hash oeffnet direkt den Reiter Sponsor-Anfragen (assets/admin.js)
    const bodyHtml = `<p>Neue Sponsor-Anfrage von <b>${esc(company)}</b>.</p><p>Name: ${esc(name)}<br>E-Mail: ${esc(email)}<br>Sprache: ${esc(lang)}<br>Paket: ${esc(details.summary)}<br>Preis: ${esc(details.price)}</p>${message ? `<p>${esc(message).replace(/\n/g, "<br>")}</p>` : ""}<p><a href="${esc(panel)}">Im Admin-Panel ansehen</a></p>`;
    let key = `sponsor:${id}`;
    for (const u of recipients) {
      if (await notify(env, u.id, "system", `Neue Sponsor-Anfrage: ${company}`, bodyHtml, key)) key = `${key}:${u.id}`;
    }
  }
  return J({ ok: true });
}

export { STATUSES as SPONSOR_STATUSES, packageDetails as sponsorPackageDetails };
