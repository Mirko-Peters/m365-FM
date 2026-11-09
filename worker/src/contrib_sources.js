// MVP-Tracker: eigene Quellen (#282). Quellenarten mit URL-Pruefung und Abruf, Dedupe ueber kanonische URL/GUID,
// die drei Modi pro Quelle (track | publish | ask) und die "Neu gefunden"-Aktionen. Erweitert contribution_sources/contributions
// (contributions.js) - kein zweiter Mechanismus. Es werden nur Titel, Link, Datum und eine Kurzbeschreibung gelesen, nie Volltexte.
import { cleanText, rateLimit, memberOf, BOT_UA } from "./util.js";
import { goodHost } from "./profiles.js";
import { trustedUser } from "./entities.js";
import { parseFeed, discoverFeed } from "./feeds.js";
import { sendPush } from "./push.js";
import { isPublicFeedKind, FEED_DAYS } from "./feedpolicy.js";

export { BOT_UA };
export const KURZPOST_DAY = 5;   // neue Kurzposts je Mitglied und Tag (wie MAX_POSTS_DAY im Blog)
export const MODES = ["track", "publish", "ask"];
export const MANUAL_KINDS = ["linkedin", "other"];   // kein Abruf: Eintraege kommen per Link-Vorschau oder Export-Upload (POST /api/contributions/import)
export const SOURCE_KINDS = ["podcast", "blog", "youtube", "github", "techcommunity", "sessionize", "stackoverflow", "package", "meetup", ...MANUAL_KINDS];
export const CTYPES = ["Blog/Article", "Podcast", "Video/Webcast", "Speaking", "Open Source/Code", "Q&A/Forum", "Book", "Other"];
const CTYPE_BY_KIND = { blog: "Blog/Article", article: "Blog/Article", podcast: "Podcast", video: "Video/Webcast", session: "Speaking", workshop: "Speaking",
  github: "Open Source/Code", package: "Open Source/Code", forum: "Q&A/Forum", book: "Book", mentoring: "Other", other: "Other" };
const ITEM_KIND = { podcast: "podcast", youtube: "video", blog: "blog", github: "github", techcommunity: "blog", sessionize: "session", stackoverflow: "forum",
  package: "package", meetup: "session", linkedin: "article", other: "other" };
const FEED_KINDS = new Set(["podcast", "blog", "youtube", "github", "techcommunity"]);
const SE_HOSTS = { "stackoverflow.com": "stackoverflow", "serverfault.com": "serverfault", "superuser.com": "superuser", "askubuntu.com": "askubuntu" };
const TOPIC_ID = /^[a-z0-9][a-z0-9-]{1,47}$/;
export function topicsOf(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.slice(0, 10).map((x) => String(x || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48)).filter((x) => TOPIC_ID.test(x)))];
}

const now = () => Math.floor(Date.now() / 1000);

export const ctypeOf = (row) => (CTYPES.includes(row.ctype) ? row.ctype : CTYPE_BY_KIND[row.kind] || "Other");
export const entryKindOf = (sourceKind) => ITEM_KIND[sourceKind] || "other";
// GitHub-Aktivitaet bleibt privat (feedpolicy.js); alles andere darf als Kurzpost erscheinen
export const canPublish = (sourceKind) => isPublicFeedKind(sourceKind);

const bare = (h) => String(h || "").toLowerCase().replace(/^www\./, "");
function httpsUrl(v) {
  try {
    const u = new URL(String(v || "").trim());
    if (u.protocol !== "https:" || u.username || u.password || !goodHost(u.hostname) || u.href.length > 400) return null;
    u.hash = "";
    return u;
  } catch { return null; }
}
const seg = (u) => u.pathname.split("/").filter(Boolean);
const NAME = /^[A-Za-z0-9._~-]{1,100}$/;

export function youtubeId(u) {
  const h = bare(u.hostname);
  if (h === "youtu.be") return /^[\w-]{11}$/.test(seg(u)[0] || "") ? seg(u)[0] : "";
  if (h === "youtube.com" || h === "m.youtube.com") {
    const v = u.searchParams.get("v"); if (/^[\w-]{11}$/.test(v || "")) return v;
    const m = /^\/(?:shorts|embed|live)\/([\w-]{11})/.exec(u.pathname); return m ? m[1] : "";
  }
  return "";
}

// Kanonische URL fuer den Vergleich (ohne Schema, ohne www/m., Tracking-Parameter, #, abschliessenden /); YouTube auf watch?v=ID
export function canonUrl(raw) {
  let u; try { u = new URL(String(raw || "").trim()); } catch { return ""; }
  const id = youtubeId(u); if (id) return `youtube.com/watch?v=${id}`;
  const q = [...u.searchParams.entries()].filter(([k]) => !/^(utm_|mc_|fbclid|gclid|igshid|ref$|ref_|source$|trk|si$|feature$)/i.test(k)).sort(([a], [b]) => (a < b ? -1 : 1));
  const path = u.pathname.replace(/\/+$/, "");
  return `${bare(u.hostname).replace(/^m\./, "")}${path}${q.length ? "?" + q.map(([k, v]) => `${k}=${v}`).join("&") : ""}`.toLowerCase();
}

// Quelle pruefen: { url, feed } (feed leer = wird beim Abruf entdeckt) oder { error: "bad_source" }. Kein Netzwerk.
export function describeSource(kind, raw) {
  const bad = { error: "bad_source" };
  if (!SOURCE_KINDS.includes(kind)) return bad;
  if (MANUAL_KINDS.includes(kind)) return { url: kind === "linkedin" ? "https://www.linkedin.com/pulse/" : "https://www.m365.fm/community/contributor/", feed: "", manual: true };
  const u = httpsUrl(raw); if (!u) return bad;
  const h = bare(u.hostname), s = seg(u), url = u.href, looksFeed = /\.(?:rss|xml|atom)$|\/(?:feed|rss|atom)(?:\/|\.xml)?$|\/feeds?\//i.test(u.pathname) || /[?&](?:format|alt)=(?:rss|atom)/i.test(u.search);
  if (kind === "podcast" || kind === "blog") return { url, feed: looksFeed ? url : "" };
  if (kind === "youtube") {
    if (!["youtube.com", "m.youtube.com"].includes(h)) return bad;
    if (u.pathname === "/feeds/videos.xml" && /^UC[\w-]{22}$/.test(u.searchParams.get("channel_id") || "")) return { url, feed: url };
    const ch = /^\/channel\/(UC[\w-]{22})/.exec(u.pathname); if (ch) return { url, feed: `https://www.youtube.com/feeds/videos.xml?channel_id=${ch[1]}` };
    return s[0] ? { url, feed: "" } : bad;
  }
  if (kind === "github") {
    if (h !== "github.com") return bad;
    const a = (s[0] || "").replace(/\.atom$/, ""), b = (s[1] || "").replace(/\.atom$/, "");
    if (!NAME.test(a)) return bad;
    if (!s[1] || /\.atom$/.test(s[0])) return { url: `https://github.com/${a}`, feed: `https://github.com/${a}.atom` };
    if (!NAME.test(b)) return bad;
    return { url: `https://github.com/${a}/${b}`, feed: `https://github.com/${a}/${b}/releases.atom` };
  }
  if (kind === "techcommunity") return h === "techcommunity.microsoft.com" ? { url, feed: /\/rss\//i.test(u.pathname) || looksFeed ? url : "" } : bad;
  if (kind === "sessionize") return h === "sessionize.com" && s.length === 1 && NAME.test(s[0]) && !["s", "api", "event", "speakers"].includes(s[0].toLowerCase()) ? { url: `https://sessionize.com/${s[0]}/`, feed: `https://sessionize.com/${s[0]}/` } : bad;
  if (kind === "stackoverflow") {
    const site = SE_HOSTS[h] || (/^[a-z0-9-]+\.stackexchange\.com$/.test(h) ? h.split(".")[0] : "");
    if (!site || s[0] !== "users" || !/^\d{1,10}$/.test(s[1] || "")) return bad;
    return { url: `https://${h}/users/${s[1]}`, feed: `https://api.stackexchange.com/2.3/users/${s[1]}/posts?order=desc&sort=creation&site=${site}&pagesize=20` };
  }
  if (kind === "package") {
    if (h === "npmjs.com" && /^~[A-Za-z0-9._-]{1,60}$/.test(s[0] || "")) return { url: `https://www.npmjs.com/${s[0]}`, feed: `https://registry.npmjs.org/-/v1/search?text=maintainer:${s[0].slice(1)}&size=20` };
    if (h === "nuget.org" && s[0] === "profiles" && NAME.test(s[1] || "")) return { url: `https://www.nuget.org/profiles/${s[1]}`, feed: `https://azuresearch-usnc.nuget.org/query?q=owner:${s[1]}&take=20&prerelease=false` };
    if (h === "powershellgallery.com" && s[0] === "profiles" && NAME.test(s[1] || "")) return { url: `https://www.powershellgallery.com/profiles/${s[1]}`,
      feed: `https://www.powershellgallery.com/api/v2/Search()?searchTerm='owner:${s[1]}'&targetFramework=''&includePrerelease=false&$filter=IsLatestVersion&$orderby=Published%20desc&$top=20` };
    return bad;
  }
  if (kind === "meetup") return h === "meetup.com" && NAME.test(s[0] || "") && !["find", "topics", "apps", "about", "lp"].includes(s[0].toLowerCase()) ? { url: `https://www.meetup.com/${s[0]}/`, feed: `https://www.meetup.com/${s[0]}/events/ical/` } : bad;
  return bad;
}

// ---------- Parser (rein, ohne Netzwerk) ----------
const unent = (s) => String(s || "").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Math.min(+n, 0x10ffff))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(Math.min(parseInt(n, 16), 0x10ffff)))
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&amp;/g, "&");
const text = (s, n) => cleanText(unent(String(s || "").replace(/<[^>]+>/g, " ")).replace(/[<>]/g, ""), n).replace(/\s+/g, " ").trim();
const secs = (v) => { const t = Date.parse(v); return Number.isFinite(t) ? Math.floor(t / 1000) : 0; };

// Kurzbeschreibung: hoechstens 2 Saetze und 280 Zeichen
export function summarize(desc, max = 280) {
  const s = text(desc, 1200); if (!s) return "";
  const sentences = s.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) || [s];
  let out = sentences.slice(0, 2).join("").trim();
  if (out.length > max) out = out.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
  return out;
}

export function parseSessionize(html, base = "https://sessionize.com") {
  const out = [], seen = new Set(), src = String(html), hits = [...src.matchAll(/<a\b[^>]*href=["']((?:https:\/\/sessionize\.com)?\/s\/[^"'#?]+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  hits.forEach((m, i) => {
    const u = httpsUrl(new URL(m[1], base).href); if (!u || seen.has(u.href)) return;
    const title = text(m[2], 200); if (title.length < 3) return;
    const rest = src.slice(m.index + m[0].length, hits[i + 1] ? hits[i + 1].index : m.index + m[0].length + 1500);
    const d = /<time\b[^>]*datetime=["']([^"']+)["']/i.exec(rest)?.[1] || /\b(20\d{2}-\d{2}-\d{2})\b/.exec(rest)?.[1] || "";
    const desc = /<p\b[^>]*class=["'][^"']*(?:description|abstract)[^"']*["'][^>]*>([\s\S]*?)<\/p>/i.exec(rest)?.[1] || "";
    seen.add(u.href);
    out.push({ title, url: u.href, guid: u.pathname.split("/").pop(), t: secs(d) || now(), desc, topics: [] });
  });
  return out.slice(0, 20);
}

export function parseStackExchange(body) {
  let j; try { j = JSON.parse(body); } catch { return []; }
  return (j.items || []).slice(0, 20).map((p) => {
    const u = httpsUrl(p.link); if (!u) return null;
    const title = text(p.title, 200); if (title.length < 3) return null;
    return { title: p.post_type === "answer" ? `Answer: ${title}` : title, url: u.href, guid: `se:${u.hostname}:${p.post_id}`, t: Math.min(+p.creation_date || now(), now()), desc: "", topics: [] };
  }).filter(Boolean);
}

export function parsePackages(feedUrl, body) {
  const host = bare(new URL(feedUrl).hostname), out = [];
  if (host === "registry.npmjs.org") {
    let j; try { j = JSON.parse(body); } catch { return []; }
    for (const o of (j.objects || []).slice(0, 20)) {
      const p = o.package || {}, u = httpsUrl(p.links?.npm || `https://www.npmjs.com/package/${p.name}`); if (!u || !p.name) continue;
      out.push({ title: text(p.name, 200), url: u.href, guid: `npm:${p.name}`, t: secs(p.date) || now(), desc: p.description, topics: [] });
    }
  } else if (host === "azuresearch-usnc.nuget.org") {
    let j; try { j = JSON.parse(body); } catch { return []; }
    for (const p of (j.data || []).slice(0, 20)) {
      if (!p.id) continue;   // die Suche liefert kein Datum: erste Sichtung
      out.push({ title: text(p.title || p.id, 200), url: `https://www.nuget.org/packages/${encodeURIComponent(p.id)}`, guid: `nuget:${p.id}`, t: now(), desc: p.description, topics: [] });
    }
  } else if (host === "powershellgallery.com") {
    for (const e of (String(body).match(/<entry[\s>][\s\S]*?<\/entry>/gi) || []).slice(0, 20)) {
      const id = /<title[^>]*>([^<]+)<\/title>/i.exec(e)?.[1], ver = /<d:Version[^>]*>([^<]+)<\/d:Version>/i.exec(e)?.[1], pub = /<d:Published[^>]*>([^<]+)<\/d:Published>/i.exec(e)?.[1];
      if (!id) continue;
      const desc = /<d:Description[^>]*>([\s\S]*?)<\/d:Description>/i.exec(e)?.[1] || /<summary[^>]*>([\s\S]*?)<\/summary>/i.exec(e)?.[1] || "";
      out.push({ title: text(id, 200), url: `https://www.powershellgallery.com/packages/${encodeURIComponent(unent(id).trim())}${ver ? "/" + encodeURIComponent(ver) : ""}`, guid: `psg:${id}`, t: secs(pub) || now(), desc, topics: [] });
    }
  }
  return out;
}

export function parseIcal(body) {
  const lines = String(body).replace(/\r?\n[ \t]/g, "").split(/\r?\n/), out = [];
  let ev = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") { ev = {}; continue; }
    if (line === "END:VEVENT") {
      if (ev) {
        const u = httpsUrl(ev.URL), title = text(ev.SUMMARY, 200), m = /(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?/.exec(ev.DTSTART || "");
        if (u && title.length >= 3 && m) out.push({ title, url: u.href, guid: ev.UID || u.href, t: Math.floor(Date.UTC(+m[1], m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)) / 1000),
          desc: String(ev.DESCRIPTION || "").replace(/\\n/g, " ").replace(/\\,/g, ","), topics: [] });
      }
      ev = null; continue;
    }
    if (!ev) continue;
    const i = line.indexOf(":"); if (i < 1) continue;
    const key = line.slice(0, i).split(";")[0].toUpperCase();
    if (["UID", "SUMMARY", "URL", "DTSTART", "DESCRIPTION"].includes(key) && ev[key] === undefined) ev[key] = line.slice(i + 1);
  }
  return out.slice(0, 20);
}

export function parseBody(kind, feedUrl, body) {
  let items;
  if (FEED_KINDS.has(kind)) items = parseFeed(body, 20);
  else if (kind === "sessionize") items = parseSessionize(body);
  else if (kind === "stackoverflow") items = parseStackExchange(body);
  else if (kind === "package") items = parsePackages(feedUrl, body);
  else if (kind === "meetup") items = parseIcal(body);
  else items = [];
  return items.map((i) => ({ ...i, guid: String(i.guid || ""), desc: summarize(i.desc), t: i.t || now() }));
}

// ---------- Abruf ----------
// Hoeflich: eigener User-Agent, bedingte Anfragen (ETag/If-Modified-Since), 6 s Zeitlimit, begrenzte Groesse, nur https.
export async function fetchSourceItems(source, { fetchImpl = fetch } = {}) {
  if (MANUAL_KINDS.includes(source.kind)) return { status: "manual", items: [] };
  const get = async (target, cond) => {
    const ctl = new AbortController(), timeout = setTimeout(() => ctl.abort(), 6000), headers = { "user-agent": BOT_UA, accept: "application/rss+xml, application/atom+xml, application/json, text/calendar, text/html;q=0.8, */*;q=0.5" };
    if (cond && source.etag) headers["if-none-match"] = source.etag;
    if (cond && source.modified) headers["if-modified-since"] = source.modified;
    try {
      const r = await fetchImpl(target, { signal: ctl.signal, redirect: "follow", headers });
      if (r.status === 304) return { notModified: true };
      if (!httpsUrl(r.url || target)) return { error: "redirect" };
      if (!r.ok) return { error: `http_${r.status}` };
      return { body: (await r.text()).slice(0, 600000), etag: r.headers.get("etag") || "", modified: r.headers.get("last-modified") || "" };
    } catch { return { error: "network" }; } finally { clearTimeout(timeout); }
  };
  let feed = source.feed || "", res = await get(feed || source.url, !!feed);
  if (res.notModified) return { status: "notmodified", items: [], feed };
  let items = res.body ? parseBody(source.kind, feed || source.url, res.body) : [];
  if (!items.length && !feed && FEED_KINDS.has(source.kind)) {
    feed = await discoverFeed(source.kind, source.url).catch(() => "");
    if (feed) { res = await get(feed, false); items = res.body ? parseBody(source.kind, feed, res.body) : []; }
  }
  if (!items.length) return { status: "error", error: res.error || "no_items", items: [], feed };
  return { status: "ok", items, feed: feed || (FEED_KINDS.has(source.kind) ? source.url : source.feed), etag: res.etag, modified: res.modified };
}

// ---------- Aufnahme (Dedupe + Modus) ----------
const topicList = (v) => { try { const x = JSON.parse(v || "[]"); return Array.isArray(x) ? x : []; } catch { return []; } };
const categoryOf = (kind) => ({ video: "Video/Webcast/Podcast", podcast: "Video/Webcast/Podcast", blog: "Blog", session: "Speaker/Presenter", book: "Book/E-book" })[kind] || "";
export async function knownKeys(db, uid) {
  const rows = (await db.prepare("SELECT url,guid,canon FROM contributions WHERE user_id=?").bind(uid).all()).results || [];
  const ign = (await db.prepare("SELECT url FROM contribution_ignored WHERE user_id=?").bind(uid).all()).results || [];
  const canon = new Set(), guid = new Set(), urls = new Set();
  for (const r of rows) { urls.add(r.url); if (r.url) canon.add(r.canon || canonUrl(r.url)); if (r.guid) guid.add(r.guid); }
  return { canon, guid, urls, ignored: new Set(ign.map((r) => canonUrl(r.url))) };
}

// Gruende, an denen Warten nichts aendert: der Eintrag wird nur getrackt. Alles andere (Tagesgrenze, fehlendes Vertrauen oder Profil)
// wartet in "Neu gefunden", bis das Mitglied dort entscheidet.
const FINAL = new Set(["no_url", "not_publishable", "already_in_feed", "too_old", "url_taken", "hidden_by_moderation"]);

// Neue Eintraege einer Quelle speichern. mode: track (privat, zaehlt) | publish (zaehlt + Kurzpost) | ask (review='pending' = "Neu gefunden").
// Doppelte (gleiche kanonische URL oder GUID, auch aus einer anderen Quelle) werden zusammengefuehrt = nicht erneut angelegt.
// first:  erster erfolgreicher Abruf einer Quelle - alles Vorhandene wird still getrackt und nie veroeffentlicht (NuGet, Sessionize und
//         Feeds ohne Datum melden "jetzt", die Datumsregel allein schuetzt dort nicht vor einer Flut am ersten Tag).
// chosen: vom Mitglied ausgewaehlte Eintraege (Import): ohne die Altersregel der Quelle, eine fruehere Loeschmarke gilt nicht mehr.
// manual: von Hand erfasst (manual=1: Titel, Link und Datum spaeter aenderbar, Loeschen ohne Loeschmarke); limit zaehlt dann die Hand-Eintraege.
// Ergebnis: held = Grund, aus dem gewuenschte Kurzposts in "Neu gefunden" warten; unposted = nur getrackt, weil kein Kurzpost moeglich ist.
export async function ingestItems(env, source, items, { limit = 5000, first = false, chosen = false, manual = false } = {}) {
  const db = env.DB, t = now(), keys = await knownKeys(db, source.user_id), mode = MODES.includes(source.mode) ? source.mode : "track";
  const kind = entryKindOf(source.kind), srcTopics = topicList(source.topics), gate = {};
  const result = { added: 0, pending: 0, published: 0, duplicates: 0, tracked: 0, unposted: 0, limited: 0, held: "", firstTitle: "" };
  let count = (await db.prepare("SELECT COUNT(*) n FROM contributions WHERE user_id=? AND manual=?").bind(source.user_id, manual ? 1 : 0).first()).n;
  for (const item of items) {
    const canon = item.url ? canonUrl(item.url) : "";
    if (item.url) {   // ohne Link ist kein Dedupe moeglich
      if (!canon || (!chosen && keys.ignored.has(canon))) continue;
      if (keys.urls.has(item.url)) {   // gleiche URL: Titel auffrischen wie bisher, nichts doppelt anlegen
        await db.prepare("UPDATE contributions SET title=? WHERE user_id=? AND url=? AND manual=0").bind(item.title, source.user_id, item.url).run();
        continue;
      }
      if (keys.canon.has(canon) || (item.guid && keys.guid.has(item.guid))) { result.duplicates++; continue; }
    }
    if (count >= limit) { result.limited++; continue; }
    count++; if (item.url) { keys.canon.add(canon); keys.urls.add(item.url); } if (item.guid) keys.guid.add(item.guid);
    const ask = mode === "ask", topics = JSON.stringify([...new Set([...srcTopics, ...topicsOf(item.topics)])].slice(0, 10));
    if (chosen && item.url && keys.ignored.has(canon)) await db.prepare("DELETE FROM contribution_ignored WHERE user_id=? AND url=?").bind(source.user_id, item.url).run();   // sonst bliebe der Eintrag in /mine unsichtbar
    const r = await db.prepare(`INSERT OR IGNORE INTO contributions(user_id,source_id,title,url,published,kind,category,topics,public,created,review,guid,canon,teaser,ctype,manual)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(source.user_id, source.id, item.title, item.url, item.t, kind, categoryOf(kind), topics, ask ? 0 : source.public ? 1 : 0, t,
      ask ? "pending" : "", item.guid || "", canon, item.desc || "", CTYPES.includes(item.ctype) ? item.ctype : "", manual ? 1 : 0).run();
    if (!r.meta.changes) continue;
    result.added++; result.firstTitle = result.firstTitle || item.title;
    if (ask) { result.pending++; continue; }
    // Kurzpost nur fuer Neues: nie beim ersten Abruf, und bei Quellen mit Datum nur, was nach dem Hinzufuegen der Quelle erschienen ist
    if (mode === "publish" && canPublish(source.kind) && !first && (chosen || item.t >= source.created - 86400)) {
      // Ohne Link oder zu alt steht ohne Abfrage fest. Ist die Tagesgrenze erreicht oder fehlen Vertrauen bzw. Profil (held), gilt das auch fuer die
      // uebrigen Eintraege dieses Laufs - nicht jeden einzeln pruefen (ein Import hat bis zu 200).
      let error = !item.url ? "no_url" : Math.min(item.t, t) < t - FEED_DAYS * 86400 ? "too_old" : result.held;
      if (!error) error = (await publishAsPost(env, db, source.user_id, { id: r.meta.last_row_id, title: item.title, url: item.url, published: item.t, teaser: item.desc || "", topics }, gate)).error || "";
      if (!error) result.published++;
      else if (FINAL.has(error)) result.unposted++;
      else {
        result.held = error; result.pending++;
        await db.prepare("UPDATE contributions SET review='pending', public=0 WHERE id=? AND user_id=?").bind(r.meta.last_row_id, source.user_id).run();
        continue;
      }
    }
    result.tracked++;
  }
  return result;
}

// ---------- Kurzpost ----------
// Landet im Community-Feed (feed_items) im Blog-Kanal des Profils: Titel, Kurzfassung, Link zum Original, gewaehlte Themen; origin='kurzpost'.
// Es gelten die Regeln fuer gezogene Inhalte: ohne eigenen Text (>= 300 Zeichen) noindex; Abstimmen und Ausblenden wie bei allen Feed-Eintraegen.
// Schutz des oeffentlichen Feeds - eine Stelle fuer alle Wege (Quelle im Modus publish, Import, "Neu gefunden", MCP):
//  - Vertrauens-Schwelle wie bei Wiki, Entitaeten und Firmenangeboten (entities.js trustedUser: Redaktion, bestaetigtes Programm oder 25 Punkte)
//  - hoechstens KURZPOST_DAY neue Kurzposts je Mitglied und Tag
//  - Datum nie in der Zukunft und nicht aelter als das Feed-Fenster (FEED_DAYS; Aelteres bekaeme nie eine Seite)
//  - ein Link, den schon jemand im Feed hat, bleibt dort (auch dasselbe YouTube-Video unter anderer Adresse); kommt er spaeter ueber einen
//    echten Profil-Kanal, uebernimmt der Kanal den Eintrag (feeds.js refreshFeeds)
//  - hidden: 0 sichtbar, 1 von der Moderation ausgeblendet, 2 vom Mitglied zurueckgezogen. Hier wird nur 2 wieder sichtbar.
//  - Links auf die eigene Website kommen ueber Blog, Podcast und Video in den Feed, nicht als Kurzpost
// gate merkt sich Profil und Vertrauen ueber mehrere Aufrufe (ein Lauf mit vielen Eintraegen fragt nur einmal).
export const trustedMember = async (env, uid) => trustedUser(env.DB, await memberOf(env, uid));
function sameLinks(raw) {
  let u; try { u = new URL(raw); } catch { return [raw]; }
  const id = youtubeId(u);
  return id ? [...new Set([raw, `https://www.youtube.com/watch?v=${id}`, `https://youtu.be/${id}`, `https://www.youtube.com/shorts/${id}`, `https://m.youtube.com/watch?v=${id}`])] : [raw];
}
export async function publishAsPost(env, db, uid, row, gate = {}) {
  if (!row?.url) return { error: "no_url" };
  if (gate.error === undefined) {
    gate.handle = (await db.prepare("SELECT handle FROM profiles WHERE user_id=? AND public=1 AND handle IS NOT NULL").bind(uid).first())?.handle || "";
    gate.error = !gate.handle ? "profile_required" : (await trustedMember(env, uid)) ? "" : "not_trusted";
  }
  if (gate.error) return { error: gate.error };
  const links = sameLinks(row.url), mine = (x) => x.owner_type === "u" && x.owner_id === uid;
  const found = (await db.prepare(`SELECT id,owner_type,owner_id,hidden,origin,url FROM feed_items WHERE url IN (${links.map(() => "?").join(",")})`).bind(...links).all()).results || [];
  if (found.some((x) => !mine(x))) return { error: "url_taken" };
  const ex = found.find((x) => x.url === row.url) || found[0];
  let id = ex?.id;
  if (ex) {
    if (ex.hidden === 1) return { error: "hidden_by_moderation" };
    if (ex.origin !== "kurzpost") return { error: "already_in_feed" };   // kommt schon ueber einen eigenen Profil-Kanal; der gezogene Eintrag bleibt unberuehrt
    await db.prepare("UPDATE feed_items SET hidden=0 WHERE id=? AND hidden=2").bind(ex.id).run();
  } else {
    if (String(row.url).startsWith(`${env.SITE}/`)) return { error: "not_publishable" };
    const t = now(), published = Math.min(+row.published || t, t);
    if (published < t - FEED_DAYS * 86400) return { error: "too_old" };
    if (!(await rateLimit(db, `kurzpost:${uid}`, KURZPOST_DAY, 86400))) return { error: "post_limit" };
    const curl = `${env.SITE}/community/u/${gate.handle}/blog/`;
    await db.prepare("INSERT OR IGNORE INTO channels(owner_type,owner_id,kind,url,feed) VALUES('u',?,'blog',?,'')").bind(uid, curl).run();
    const ch = await db.prepare("SELECT id FROM channels WHERE owner_type='u' AND owner_id=? AND url=?").bind(uid, curl).first();
    const r = await db.prepare("INSERT OR IGNORE INTO feed_items(channel_id,owner_type,owner_id,url,title,published,summary,topics,origin) VALUES(?,'u',?,?,?,?,?,?,'kurzpost')")
      .bind(ch.id, uid, row.url, row.title, published, summarize(row.teaser, 280), JSON.stringify(topicList(row.topics).slice(0, 10))).run();
    if (!r.meta.changes) return { error: "url_taken" };   // zeitgleich von jemand anderem angelegt
    id = r.meta.last_row_id;
  }
  await db.prepare("UPDATE contributions SET feed_item_id=?, review='' WHERE id=? AND user_id=?").bind(id, row.id, uid).run();
  return { id };
}

// Kurzposts zu Beitraegen entfernen, die gleich geloescht werden (where = Bedingung auf contributions). Gezogene Eintraege der Profil-Kanaele
// bleiben unberuehrt. Was die Moderation ausgeblendet hat (hidden=1), bleibt als Sperre stehen - sonst waere Loeschen und neu Anlegen ein Weg,
// einen ausgeblendeten Kurzpost zurueckzuholen; oeffentlich ist er ohnehin nicht.
export function dropPosts(db, uid, where, binds = []) {
  const ids = `SELECT id FROM feed_items WHERE owner_type='u' AND owner_id=? AND origin='kurzpost' AND hidden<>1 AND id IN (SELECT feed_item_id FROM contributions WHERE user_id=? AND feed_item_id>0 AND ${where})`;
  return [db.prepare(`DELETE FROM item_votes WHERE item_id IN (${ids})`).bind(uid, uid, ...binds), db.prepare(`DELETE FROM feed_items WHERE id IN (${ids})`).bind(uid, uid, ...binds)];
}

// "Neu gefunden"-Aktion: track | publish | ignore | unpublish (nur eigene Eintraege). publish geht auch fuer schon getrackte Eintraege,
// unpublish zieht den Kurzpost zurueck (hidden=2); die Verknuepfung bleibt, damit erneutes Veroeffentlichen und Loeschen ihn wiederfinden.
const ERROR_STATUS = { post_limit: 429, not_trusted: 403 };
export async function reviewAction(env, uid, id, action, opts = {}) {
  const db = env.DB, row = await db.prepare("SELECT id,user_id,source_id,title,url,published,teaser,topics,review,kind,feed_item_id FROM contributions WHERE id=? AND user_id=?").bind(id, uid).first();
  if (!row) return { error: "not_found", status: 404 };
  if (!["track", "publish", "ignore", "unpublish"].includes(action)) return { error: "bad_field", field: "action", status: 400 };
  if (opts.ctype !== undefined) {
    if (opts.ctype !== "" && !CTYPES.includes(opts.ctype)) return { error: "bad_field", field: "ctype", status: 400 };
    await db.prepare("UPDATE contributions SET ctype=? WHERE id=? AND user_id=?").bind(opts.ctype, id, uid).run();
  }
  if (action === "track") {
    const src = row.source_id ? await db.prepare("SELECT public FROM contribution_sources WHERE id=? AND user_id=?").bind(row.source_id, uid).first() : null;
    await db.prepare("UPDATE contributions SET review='', public=? WHERE id=? AND user_id=? AND review='pending'").bind(src?.public ? 1 : 0, id, uid).run();
    return { ok: true, action };
  }
  if (action === "publish") {
    const src = row.source_id ? await db.prepare("SELECT kind FROM contribution_sources WHERE id=? AND user_id=?").bind(row.source_id, uid).first() : null;
    if (src && !canPublish(src.kind)) return { error: "not_publishable", status: 400 };
    if (opts.topics) await db.prepare("UPDATE contributions SET topics=?, topics_edited=1 WHERE id=? AND user_id=?").bind(JSON.stringify(opts.topics), id, uid).run();
    const fresh = await db.prepare("SELECT id,user_id,title,url,published,teaser,topics FROM contributions WHERE id=? AND user_id=?").bind(id, uid).first();
    const p = await publishAsPost(env, db, uid, fresh);
    return p.error ? { error: p.error, status: ERROR_STATUS[p.error] || 400 } : { ok: true, action, feed_item_id: p.id };
  }
  if (action === "ignore") {   // weg samt Kurzpost, und der Link wird nicht wieder vorgeschlagen
    const stmts = [...dropPosts(db, uid, "id=?", [id]), db.prepare("DELETE FROM contributions WHERE id=? AND user_id=?").bind(id, uid)];
    if (row.url) stmts.unshift(db.prepare("INSERT OR IGNORE INTO contribution_ignored(user_id,url,created) VALUES(?,?,?)").bind(uid, row.url, now()));
    await db.batch(stmts);
    return { ok: true, action };
  }
  const r = row.feed_item_id ? await db.prepare("UPDATE feed_items SET hidden=2 WHERE id=? AND owner_type='u' AND owner_id=? AND origin='kurzpost' AND hidden=0").bind(row.feed_item_id, uid).run() : null;
  return { ok: true, action, withdrawn: !!r?.meta.changes };
}

// Hinweis ueber den vorhandenen Push-Weg (wie bei gezogenen Inhalten); ohne Abo oder VAPID passiert nichts
export async function notifyFound(env, uid, n, title) {
  if (!n || !env.VAPID_PRIVATE_JWK) return 0;
  const subs = (await env.DB.prepare("SELECT endpoint,p256dh,auth FROM push_subs WHERE user_id=? AND digest=1").bind(uid).all()).results || [];
  let sent = 0;
  for (const sb of subs) {
    try { await sendPush(env, sb, { title: n > 1 ? `${n} neue Beiträge gefunden` : "Neuer Beitrag gefunden", body: `${String(title || "").slice(0, 80)} – tracken, als Kurzpost veröffentlichen oder ignorieren.`, url: `${env.SITE}/community/contributor/#inbox` }); sent++; } catch {}
  }
  return sent;
}

// LinkedIn-Artikel per Link: ausschliesslich Open-Graph-Tags (og:title, og:description) und das Veroeffentlichungsdatum; sonst wird nichts gelesen.
export function ogOnly(html) {
  const out = { title: "", description: "", published: "" };
  for (const m of String(html).slice(0, 200000).matchAll(/<meta\b[^>]*>/gi)) {
    const tag = m[0], prop = /\b(?:property|name)=["']([^"']+)["']/i.exec(tag)?.[1]?.toLowerCase(), c = /\bcontent=["']([^"']*)["']/i.exec(tag)?.[1];
    if (!prop || c === undefined) continue;
    if (prop === "og:title" && !out.title) out.title = text(c, 200);
    else if (prop === "og:description" && !out.description) out.description = summarize(c, 400);
    else if ((prop === "article:published_time" || prop === "og:article:published_time") && !out.published) out.published = /^\d{4}-\d{2}-\d{2}/.exec(c)?.[0] || "";
  }
  return out;
}
export const linkedInUrl = (raw) => { const u = httpsUrl(raw); return u && /(^|\.)linkedin\.com$/.test(u.hostname.toLowerCase()) ? u.href : ""; };
