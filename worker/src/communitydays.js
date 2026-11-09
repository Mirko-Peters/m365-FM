// Community Days (communitydays.org): Quellen-Adapter, Parser und Import als herrenlose Events (source=communitydays).
// Je Lauf nur ein Stueck (Abrufe und Events gedeckelt); der Stand steht in meta "communitydays_state", der Rest folgt im naechsten Lauf.
// Die Quelle konnte aus der Entwicklungsumgebung nicht abgerufen werden. Alles Umstellbare steht in SOURCE; Reihenfolge der Strategien in STRATEGIES.
// Strategien: "ics" (Kalender-Feed), "jsonld-list" (schema.org/Event im Listen-HTML), "sitemap" (Sitemap -> Event-Seiten mit JSON-LD).
import { politeGet } from "./botfetch.js";
import { upsertEvent, normUrl, normText } from "./eventmerge.js";

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
const abs = (u, base) => { try { const x = new URL(u, base); return /^https?:$/.test(x.protocol) ? x.href : ""; } catch { return ""; } };   // nur http/https (nie javascript:, data: ...)

// Roh-Event (schema.org/Event, ICS-VEVENT) -> Kandidat fuer upsertEvent (gesaeubert wird dort).
// own = pageUrl ist die eigene Seite genau dieses Events (Sitemap-Strategie). Bei Listen und Feeds gehoert pageUrl allen Eintraegen und ist nie die Kennung eines Events.
export function toCandidate(raw, pageUrl, own = false) {
  const loc = Array.isArray(raw.location) ? raw.location[0] : raw.location || {};
  const addr = (loc && loc.address) || {}, mode = String(raw.eventAttendanceMode || "");
  const virtual = /Online/i.test(mode) && !/Mixed/i.test(mode) || (loc && /VirtualLocation/i.test(loc["@type"] || ""));
  const hybrid = /Mixed/i.test(mode);
  const city = typeof addr === "string" ? addr.split(",")[0].trim() : strip(addr.addressLocality || raw.city || "");
  const country = typeof addr === "string" ? "" : strip(addr.addressCountry && addr.addressCountry.name || addr.addressCountry || raw.country || "");
  const given = raw.url ? abs(String(raw.url), pageUrl || SOURCE.base) : "", org = Array.isArray(raw.organizer) ? raw.organizer[0] : raw.organizer;
  const url = given && (own || normUrl(given) !== normUrl(pageUrl)) ? given : own ? pageUrl || "" : "";
  const title = strip(raw.name || raw.summary), start = ymd(raw.startDate || raw.dtstart);
  // Kennung des Datensatzes: die eigene Seite des Events; ohne sie die UID des Feeds bzw. Name+Beginn
  const ref = normUrl(url) || (raw.uid ? "uid:" + String(raw.uid).slice(0, 120) : "t:" + normText(title) + "|" + start);
  // Sessionize-Adresse des Events: nur aus den Feldern, die das Event selbst bezeichnen (sameAs, url), ist sie eine Kennung. Steht sie bloss im
  // Beschreibungstext (dort kann auch ein Speaker-Profil oder ein anderes Event verlinkt sein), ist sie ein Hinweis fuer die Warteschlange, nie eine Identitaet.
  const szOf = (x) => { const m = /https?:\/\/(?:www\.)?sessionize\.com\/([A-Za-z0-9._-]+)\/?/i.exec(String(x || "")); return m && !/^(api|s|i|image)$/i.test(m[1]) ? m[1].toLowerCase() : ""; };
  const declared = [raw.sameAs, raw.url].flat().map(szOf).find(Boolean), mentioned = szOf(raw.description);
  const sources = [{ kind: "communitydays", ref, url }];
  if (declared) sources.push({ kind: "sessionize_event", ref: declared, url: `https://sessionize.com/${declared}` });
  else if (mentioned) sources.push({ kind: "sessionize_mention", ref: mentioned });
  const free = raw.isAccessibleForFree === true || raw.isAccessibleForFree === "true" ? true : raw.isAccessibleForFree === false || raw.isAccessibleForFree === "false" ? false : undefined;   // sonst unbekannt
  return { title, summary: strip(raw.description).slice(0, 200), about: strip(raw.description).slice(0, 3000), start, end: ymd(raw.endDate || raw.dtend),
    mode: virtual ? "online" : hybrid ? "hybrid" : city ? "onsite" : "online", city: virtual ? "" : city, country, url, tickets_url: "", organizer_name: strip(org && org.name || raw.organizerName || ""), lang: strip(raw.inLanguage || ""), free,
    tags: [].concat(raw.keywords || []).join(",").split(",").map((x) => x.trim()).filter(Boolean), source: "communitydays", source_url: url || pageUrl, sources };
}
export function parseJsonLd(html, pageUrl = SOURCE.base, own = false) {
  const nodes = [];
  for (const m of String(html || "").matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    let j; try { j = JSON.parse(m[1].trim()); } catch { continue; }
    const walk = (n) => { if (!n || typeof n !== "object") return; if (Array.isArray(n)) return n.forEach(walk); if (n["@graph"]) walk(n["@graph"]); if (n.itemListElement) walk(n.itemListElement); if (n.item) walk(n.item);
      if (/Event$/.test([].concat(n["@type"] || []).join(" ")) && n.name && n.startDate) nodes.push(n); };
    walk(j);
  }
  return nodes.map((n) => toCandidate(n, pageUrl, own && nodes.length === 1));   // nur ein einzelnes Event darf die Seite als seine eigene ansehen
}
export function parseIcs(text, pageUrl = SOURCE.base) {
  const lines = String(text || "").replace(/\r?\n[ \t]/g, "").split(/\r?\n/), out = []; let cur = null;
  const val = (l) => dec(l.slice(l.indexOf(":") + 1).replace(/\\n/gi, " ").replace(/\\([,;\\])/g, "$1"));
  for (const l of lines) {
    if (l === "BEGIN:VEVENT") cur = {}; else if (l === "END:VEVENT" && cur) { if (cur.summary && cur.dtstart) { const loc = cur.location || ""; out.push(toCandidate({ ...cur, location: /^https?:|online|virtual|teams/i.test(loc) || !loc ? { "@type": "VirtualLocation" } : { address: loc.split(",").length > 1 ? { addressLocality: loc.split(",").slice(-2)[0].trim(), addressCountry: loc.split(",").pop().trim() } : { addressLocality: loc } } }, pageUrl)); } cur = null; }
    else if (cur) { const k = l.split(/[;:]/)[0].toUpperCase(); if (k === "SUMMARY") cur.summary = val(l); else if (k === "DTSTART") cur.dtstart = val(l); else if (k === "DTEND") cur.dtend = val(l); else if (k === "DESCRIPTION") cur.description = val(l); else if (k === "LOCATION") cur.location = val(l); else if (k === "URL") cur.url = val(l); else if (k === "UID") cur.uid = val(l); else if (k === "ORGANIZER") cur.organizerName = (/CN=([^;:]+)/i.exec(l) || [])[1] || ""; }
  }
  return out;
}
export function parseSitemap(xml, base = SOURCE.base) {
  return [...String(xml || "").matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => abs(dec(m[1]), base)).filter((u) => u && new URL(u).host === new URL(base).host && SOURCE.eventPathRx.test(new URL(u).pathname));
}

// Reihenfolge und Fortschritt eines Durchgangs: Kennung + Tag + Name. Teilen sich zwei Eintraege eine Adresse (Reihe, Seite einer User Group), bleiben beide erhalten.
export const candKey = (c) => `${c.sources[0].ref}|${String(c.start).slice(0, 10)}|${normText(c.title)}`;
// Einlesen: gibt { candidates, notes, complete } zurueck; jede Strategie hoeflich (robots, Cache, Abstand), erste mit Treffern gewinnt.
// complete = false: das Abruf-Kontingent dieses Laufs war aufgebraucht (der naechste Lauf liest aus dem Cache weiter).
export async function collect(env, opts = {}) {
  const notes = [], f = (p) => (p.startsWith("http") ? p : SOURCE.base + p), by = new Map(); let complete = true;
  const add = (list) => { for (const c of list) if (c.title && c.start) by.set(candKey(c), c); };   // je Datensatz ein Kandidat (nie je Listen-Adresse)
  const get = async (u) => { const r = await politeGet(env, u, opts); if (r.error === "request_budget") complete = false; return r; };
  for (const strat of opts.strategies || STRATEGIES) {
    if (by.size || !complete) break;
    if (strat === "ics") for (const p of SOURCE.ics) { const r = await get(f(p)); if (r.ok && /BEGIN:VCALENDAR/.test(r.body)) { add(parseIcs(r.body, f(p))); notes.push(`ics:${p}`); break; } else notes.push(`ics:${p}:${r.error || r.status}`); }
    if (strat === "jsonld-list") for (const p of SOURCE.list) { const r = await get(f(p)); if (r.ok) { const l = parseJsonLd(r.body, f(p)); add(l); notes.push(`list:${p}:${l.length}`); } else notes.push(`list:${p}:${r.error || r.status}`); }
    if (strat === "sitemap") {
      const sm = await get(f(SOURCE.sitemap)); if (!sm.ok) { notes.push(`sitemap:${sm.error || sm.status}`); continue; }
      const urls = parseSitemap(sm.body).slice(0, SOURCE.maxEventPages); notes.push(`sitemap:${urls.length}`);
      for (const u of urls) { const r = await get(u); if (r.ok) add(parseJsonLd(r.body, u, true)); else notes.push(`page:${r.error || r.status}`); }
    }
  }
  return { candidates: [...by.values()], notes, complete };
}
const STATE = "communitydays_state", parse = (s) => { try { return JSON.parse(s); } catch { return null; } };
// Ein Stueck Import. opts.dry = nur zaehlen (nichts schreiben, hoechstens 60 Kandidaten); opts.force = neuen Durchgang beginnen (Admin).
// Ablauf eines Durchgangs (einer je Tag): erst alles lesen (ueber mehrere Laeufe, Cache), dann je Lauf hoechstens opts.cap Events in fester Reihenfolge
// einspielen (meta communitydays_state.after = zuletzt verarbeitete Kennung), zum Schluss vergangene herrenlose Import-Events als vergangen markieren.
export async function runCommunityDays(env, opts = {}) {
  const db = env.DB, today = (opts.today || new Date().toISOString()).slice(0, 10), t = opts.now, cap = opts.cap || 12, zero = { created: 0, merged: 0, queued: 0, skipped: 0 };
  let st = parse((await db.prepare("SELECT v FROM meta WHERE k=?").bind(STATE).first())?.v) || {};
  if (!opts.dry) {
    if (opts.force || !st.day || (st.done && st.day !== today)) st = { day: today, after: "", done: false, ...zero };
    else if (st.done) return { dry: false, skipped_run: "done", day: st.day };
  }
  const save = () => db.prepare("INSERT INTO meta(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").bind(STATE, JSON.stringify(st)).run();
  const { candidates, notes, complete } = await collect(env, { ttl: 20 * 3600, maxRequests: 12, ...opts });
  const ref = candKey, list = candidates.filter(isMicrosoftRelated).sort((a, b) => (ref(a) < ref(b) ? -1 : ref(a) > ref(b) ? 1 : 0));
  const rep = { dry: !!opts.dry, found: candidates.length, microsoft: list.length, skipped_non_ms: candidates.length - list.length, ...zero, retired: 0, remaining: 0, notes };
  if (!complete) { if (!opts.dry) await save(); return { ...rep, fetching: true, remaining: list.length }; }   // noch nicht alles gelesen: der naechste Lauf macht weiter
  const todo = opts.dry ? list : list.filter((c) => ref(c) > st.after), work = todo.slice(0, opts.dry ? Math.min(60, opts.cap || 60) : cap);
  for (const c of work) {
    const r = await upsertEvent(db, c, { dry: opts.dry, now: t });
    rep[r.action === "created" || r.action === "merged" || r.action === "queued" ? r.action : "skipped"]++;
    if (!opts.dry) st.after = ref(c);
  }
  rep.remaining = todo.length - work.length;
  if (opts.dry) return rep;
  for (const k of Object.keys(zero)) st[k] = (st[k] || 0) + rep[k];
  if (!rep.remaining) {   // Durchgang fertig: herrenlose Import-Events, deren Ende vorbei ist, als vergangen markieren (nie loeschen)
    if (rep.found) rep.retired = Number((await db.prepare("UPDATE events SET retired=1 WHERE source='communitydays' AND unclaimed=1 AND retired=0 AND substr(CASE WHEN end<>'' THEN end ELSE start END,1,10)<?").bind(today).run()).meta?.changes || 0);
    st.done = true;
    await db.prepare("INSERT INTO meta(k,v) VALUES('communitydays_last',?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").bind(JSON.stringify({ at: Date.now(), day: st.day, found: rep.found, microsoft: rep.microsoft, skipped_non_ms: rep.skipped_non_ms, created: st.created, merged: st.merged, queued: st.queued, skipped: st.skipped, retired: rep.retired })).run();
  }
  await save();
  return rep;
}
