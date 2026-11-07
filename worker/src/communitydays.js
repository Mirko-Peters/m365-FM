// Community Days (communitydays.org): Quellen-Adapter, Parser und Import als herrenlose Events (source=communitydays).
// Die Quelle konnte aus der Entwicklungsumgebung nicht abgerufen werden. Alles Umstellbare steht in SOURCE; Reihenfolge der Strategien in STRATEGIES.
// Strategien: "ics" (Kalender-Feed), "jsonld-list" (schema.org/Event im Listen-HTML), "sitemap" (Sitemap -> Event-Seiten mit JSON-LD).
import { politeGet } from "./botfetch.js";
import { upsertEvent, normUrl, normText, hash24 } from "./eventmerge.js";

export const SOURCE = {
  base: "https://communitydays.org",
  ics: ["/events.ics", "/calendar.ics", "/feed.ics"],         // unbestaetigte Kandidaten
  list: ["/events", "/", "/past-events"],                     // Listenseiten mit JSON-LD
  sitemap: "/sitemap.xml",
  eventPathRx: /\/(events?|event|community-day|cd)\/[^/]+\/?$/i,   // welche Sitemap-URLs Event-Seiten sind
  maxEventPages: 40,
};
export const STRATEGIES = ["ics", "jsonld-list", "sitemap"];
const MS_RX = /(microsoft|m365|office ?365|microsoft ?365|azure|power ?(platform|bi|apps|automate|pages|fx)|copilot|dynamics|d365|sharepoint|teams|fabric|dataverse|entra|intune|purview|defender|sentinel|viva|windows|sql ?server|\.net|dotnet|xbox|visual studio|github|security|mvp|community days?)/i;
export const isMicrosoftRelated = (e) => MS_RX.test([e.title, e.summary, e.about, e.organizer_name, ...(e.tags || [])].join(" "));

const dec = (s) => String(s ?? "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ");
const strip = (s) => dec(String(s ?? "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const ymd = (s) => { const m = /(\d{4})-?(\d{2})-?(\d{2})(?:[T ](\d{2}):?(\d{2}))?/.exec(String(s || "")); return m ? `${m[1]}-${m[2]}-${m[3]}` + (m[4] ? `T${m[4]}:${m[5]}` : "") : ""; };
const abs = (u, base) => { try { return new URL(u, base).href; } catch { return ""; } };

// Roh-Event (schema.org/Event, ICS-VEVENT) -> Kandidat fuer upsertEvent
export function toCandidate(raw, pageUrl) {
  const loc = Array.isArray(raw.location) ? raw.location[0] : raw.location || {};
  const addr = (loc && loc.address) || {}, mode = String(raw.eventAttendanceMode || "");
  const virtual = /Online/i.test(mode) && !/Mixed/i.test(mode) || (loc && /VirtualLocation/i.test(loc["@type"] || ""));
  const hybrid = /Mixed/i.test(mode);
  const city = typeof addr === "string" ? addr.split(",")[0].trim() : strip(addr.addressLocality || raw.city || "");
  const country = typeof addr === "string" ? "" : strip(addr.addressCountry && addr.addressCountry.name || addr.addressCountry || raw.country || "");
  const url = abs(raw.url || pageUrl || "", pageUrl || SOURCE.base), org = Array.isArray(raw.organizer) ? raw.organizer[0] : raw.organizer;
  const sessionize = [raw.description, raw.sameAs, ...(Array.isArray(raw.sameAs) ? raw.sameAs : []), raw.url].flat().map((x) => /https?:\/\/(?:www\.)?sessionize\.com\/([A-Za-z0-9._-]+)\/?/i.exec(String(x || ""))).find((m) => m && !/^(api|s|i|image)$/i.test(m[1]));
  const sources = [{ kind: "communitydays", ref: normUrl(url) || normUrl(pageUrl), url }];
  if (sessionize) sources.push({ kind: "sessionize_event", ref: sessionize[1].toLowerCase(), url: `https://sessionize.com/${sessionize[1]}` });
  return { title: strip(raw.name || raw.summary), summary: strip(raw.description).slice(0, 200), about: strip(raw.description).slice(0, 3000), start: ymd(raw.startDate || raw.dtstart), end: ymd(raw.endDate || raw.dtend),
    mode: virtual ? "online" : hybrid ? "hybrid" : city ? "onsite" : "online", city: virtual ? "" : city, country, url, tickets_url: "", organizer_name: strip(org && org.name || raw.organizerName || ""), lang: strip(raw.inLanguage || ""),
    tags: [].concat(raw.keywords || []).join(",").split(",").map((x) => x.trim()).filter(Boolean), source: "communitydays", source_url: url || pageUrl, sources };
}
export function parseJsonLd(html, pageUrl = SOURCE.base) {
  const out = [];
  for (const m of String(html || "").matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    let j; try { j = JSON.parse(m[1].trim()); } catch { continue; }
    const walk = (n) => { if (!n || typeof n !== "object") return; if (Array.isArray(n)) return n.forEach(walk); if (n["@graph"]) walk(n["@graph"]); if (n.itemListElement) walk(n.itemListElement); if (n.item) walk(n.item);
      if (/Event$/.test([].concat(n["@type"] || []).join(" ")) && n.name && n.startDate) out.push(toCandidate(n, pageUrl)); };
    walk(j);
  }
  return out;
}
export function parseIcs(text, pageUrl = SOURCE.base) {
  const lines = String(text || "").replace(/\r?\n[ \t]/g, "").split(/\r?\n/), out = []; let cur = null;
  const val = (l) => dec(l.slice(l.indexOf(":") + 1).replace(/\\n/gi, " ").replace(/\\([,;\\])/g, "$1"));
  for (const l of lines) {
    if (l === "BEGIN:VEVENT") cur = {}; else if (l === "END:VEVENT" && cur) { if (cur.summary && cur.dtstart) { const loc = cur.location || ""; out.push(toCandidate({ ...cur, location: /^https?:|online|virtual|teams/i.test(loc) || !loc ? { "@type": "VirtualLocation" } : { address: loc.split(",").length > 1 ? { addressLocality: loc.split(",").slice(-2)[0].trim(), addressCountry: loc.split(",").pop().trim() } : { addressLocality: loc } } }, cur.url || pageUrl)); } cur = null; }
    else if (cur) { const k = l.split(/[;:]/)[0].toUpperCase(); if (k === "SUMMARY") cur.summary = val(l); else if (k === "DTSTART") cur.dtstart = val(l); else if (k === "DTEND") cur.dtend = val(l); else if (k === "DESCRIPTION") cur.description = val(l); else if (k === "LOCATION") cur.location = val(l); else if (k === "URL") cur.url = val(l); else if (k === "ORGANIZER") cur.organizerName = (/CN=([^;:]+)/i.exec(l) || [])[1] || ""; }
  }
  return out;
}
export function parseSitemap(xml, base = SOURCE.base) {
  return [...String(xml || "").matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => abs(dec(m[1]), base)).filter((u) => u && new URL(u).host === new URL(base).host && SOURCE.eventPathRx.test(new URL(u).pathname));
}

// Einlesen: gibt { candidates, notes } zurueck; jede Strategie hoeflich (robots, Cache, Abstand), erste mit Treffern gewinnt
export async function collect(env, opts = {}) {
  const notes = [], f = (p) => (p.startsWith("http") ? p : SOURCE.base + p), by = new Map();
  const add = (list) => { for (const c of list) if (c.title && c.start) by.set(c.source_url || c.title + c.start, c); };
  for (const strat of opts.strategies || STRATEGIES) {
    if (by.size) break;
    if (strat === "ics") for (const p of SOURCE.ics) { const r = await politeGet(env, f(p), opts); if (r.ok && /BEGIN:VCALENDAR/.test(r.body)) { add(parseIcs(r.body, f(p))); notes.push(`ics:${p}`); break; } else notes.push(`ics:${p}:${r.error || r.status}`); }
    if (strat === "jsonld-list") for (const p of SOURCE.list) { const r = await politeGet(env, f(p), opts); if (r.ok) { const l = parseJsonLd(r.body, f(p)); add(l); notes.push(`list:${p}:${l.length}`); } else notes.push(`list:${p}:${r.error || r.status}`); }
    if (strat === "sitemap") {
      const sm = await politeGet(env, f(SOURCE.sitemap), opts); if (!sm.ok) { notes.push(`sitemap:${sm.error || sm.status}`); continue; }
      const urls = parseSitemap(sm.body).slice(0, SOURCE.maxEventPages); notes.push(`sitemap:${urls.length}`);
      for (const u of urls) { const r = await politeGet(env, u, opts); if (r.ok) add(parseJsonLd(r.body, u)); else notes.push(`page:${r.error || r.status}`); }
    }
  }
  return { candidates: [...by.values()], notes };
}
// Import. opts.dry = nur zaehlen. Vergangene Events: retired=1 (nie loeschen). Mitglieds-Events bleiben unberuehrt (nur ueber Treffer ergaenzt).
export async function runCommunityDays(env, opts = {}) {
  const db = env.DB, today = (opts.today || new Date().toISOString()).slice(0, 10), t = opts.now;
  const { candidates, notes } = await collect(env, opts);
  const rep = { dry: !!opts.dry, found: candidates.length, microsoft: 0, skipped_non_ms: 0, created: 0, merged: 0, queued: 0, skipped: 0, retired: 0, notes };
  const seen = [];
  for (const c of candidates) {
    if (!isMicrosoftRelated(c)) { rep.skipped_non_ms++; continue; }
    rep.microsoft++;
    const r = await upsertEvent(db, c, { dry: opts.dry, now: t, owner_id: 0 });
    if (r.action === "created") rep.created++; else if (r.action === "merged") rep.merged++; else if (r.action === "queued") rep.queued++; else rep.skipped++;
    if (r.id) seen.push(r.id);
  }
  if (!opts.dry && rep.found) {   // nur nach erfolgreichem Lauf: herrenlose Import-Events, deren Ende vorbei ist, als vergangen markieren
    rep.retired = Number((await db.prepare("UPDATE events SET retired=1 WHERE source='communitydays' AND unclaimed=1 AND retired=0 AND substr(CASE WHEN end<>'' THEN end ELSE start END,1,10)<?").bind(today).run()).meta?.changes || 0);
    await db.prepare("INSERT INTO meta(k,v) VALUES('communitydays_last',?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").bind(JSON.stringify({ at: Date.now(), ...rep, notes: undefined })).run();
  }
  return rep;
}
