// Community Days (communitydays.org): Quellen-Adapter, Parser und Import als herrenlose Events (source=communitydays).
// Je Lauf nur ein Stueck (Abrufe und Events gedeckelt); der Stand steht in meta "communitydays_state", der Rest folgt im naechsten Lauf.
// Alles Umstellbare steht in SOURCE; Reihenfolge der Strategien in STRATEGIES.
// communitydays.org ist eine Next.js-Seite (Stand 10.11.2026, per tools/url_peek.py struct: gelesen): die Event-Datensaetze stehen im eingebetteten JSON
// (__NEXT_DATA__): /events -> pageProps.initialEvents (alle kommenden), / -> pageProps.upcomingEvents (mit Anmelde-Link), /event/<Datum>/<slug> -> pageProps.event
// (mit Beschreibung). Kein JSON-LD, kein Kalender-Feed, Sitemap nur mit Adressen.
// Strategien: "jsonld-list" (Listenseiten: __NEXT_DATA__ oder schema.org/Event; danach die Seiten der kommenden Events fuer die Beschreibung),
// "ics" (Kalender-Feed), "sitemap" (Sitemap -> Event-Seiten).
import { politeGet } from "./botfetch.js";
import { upsertEvent, normUrl, normText } from "./eventmerge.js";

export const SOURCE = {
  base: "https://communitydays.org",
  ics: ["/events.ics", "/calendar.ics", "/feed.ics"],         // unbestaetigte Kandidaten
  list: ["/events", "/"],                                     // Listenseiten (__NEXT_DATA__ oder JSON-LD)
  sitemap: "/sitemap.xml",
  eventPathRx: /\/(events?|event|community-day|cd)\/(\d{4}-\d{2}-\d{2}\/)?[^/]+\/?$/i,   // welche Sitemap-URLs Event-Seiten sind (/event/2026-11-23/collabdays-oslo-2026)
  maxEventPages: 40,
};
export const STRATEGIES = ["jsonld-list", "ics", "sitemap"];
const MS_RX = /(microsoft|m365|office ?365|microsoft ?365|azure|power ?(platform|bi|apps|automate|pages|fx)|copilot|dynamics|d365|sharepoint|teams|fabric|dataverse|entra|intune|purview|defender|sentinel|viva|windows|sql ?server|\.net|dotnet|xbox|visual studio|github|security|mvp|community days?)/i;
// Datensaetze aus der Liste von communitydays.org (ms: true) sind Microsoft-Community-Events (die Seite ist die der Microsoft Global Community Initiative).
export const isMicrosoftRelated = (e) => e.ms === true || MS_RX.test([e.title, e.summary, e.about, e.organizer_name, ...(e.tags || [])].join(" "));

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
    online_stated: !!virtual,   // ausdruecklich online (Teilnahme-Modus oder virtueller Ort), nicht bloss "kein Ort angegeben"
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
// --- Next.js-Daten von communitydays.org ---
// Nur diese Felder werden gelesen und zwischengespeichert (nie Kontakt-Adressen, Postanschriften oder Team-Angaben der Event-Seite).
const CD_KEEP = ["RowKey", "title", "slug", "start_date", "end_date", "city", "state_province", "country", "event_type", "cost_tiers", "status", "website", "registration_url", "tagline", "hashtag", "home_content"];
const slimRec = (n) => Object.fromEntries(CD_KEEP.filter((k) => n[k] !== undefined && n[k] !== null && n[k] !== "").map((k) => [k, k === "home_content" ? String(n[k]).slice(0, 8000) : n[k]]));
// Event-Datensaetze einer Seite: aus __NEXT_DATA__ (jedes Objekt mit title, slug und start_date) oder aus der verkleinerten Cache-Fassung ({"cdv":1,...}).
export function nextRecords(body) {
  const s = String(body || "");
  if (s.startsWith('{"cdv"')) { try { return JSON.parse(s).events || []; } catch { return []; } }
  const m = /<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i.exec(s); if (!m) return [];
  let j; try { j = JSON.parse(m[1]); } catch { return []; }
  const out = [], seen = new Set();
  const walk = (n, d) => { if (!n || typeof n !== "object" || d > 8) return; if (Array.isArray(n)) return n.forEach((x) => walk(x, d + 1));
    if (typeof n.title === "string" && typeof n.slug === "string" && n.start_date) { if (!seen.has(n.slug)) { seen.add(n.slug); out.push(slimRec(n)); } return; }
    for (const v of Object.values(n)) walk(v, d + 1); };
  walk(j.props || j, 0);
  return out;
}
// Fuer politeGet reduce: Seiten mit Next-Daten werden nur als die gelesenen Felder zwischengespeichert, alle anderen unveraendert.
export const slimNext = (body) => { const l = nextRecords(body); return l.length ? JSON.stringify({ cdv: 1, events: l }) : body; };
const COUNTRY = (cc) => { const x = String(cc || "").trim(); if (!/^[a-z]{2}$/i.test(x)) return x; try { return new Intl.DisplayNames(["en"], { type: "region" }).of(x.toUpperCase()) || x.toUpperCase(); } catch { return x.toUpperCase(); } };
// Website und Anmelde-Link sind Freitext der Veranstalter: immer absolute Adressen (ohne Schema: https://), nie relativ zur Event-Seite aufgeloest.
const extUrl = (v) => { let x = String(v || "").trim(); if (!x) return ""; if (!/^[a-z][a-z0-9+.-]*:/i.test(x)) { if (!/^(\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+(?:[:/?#]|$)/i.test(x)) return ""; x = "https://" + x.replace(/^\/\//, ""); } return abs(x, "https://invalid.invalid/"); };
const noUtm = (u) => { try { const x = new URL(u); for (const k of [...x.searchParams.keys()]) if (/^utm_/i.test(k)) x.searchParams.delete(k); return x.href; } catch { return ""; } };
export const cdPage = (slug, base = SOURCE.base) => abs("/event/" + String(slug || "").replace(/^\/+/, ""), base);
// Datensatz von communitydays.org -> Kandidat. Kennung bleibt die Seite des Events auf communitydays.org; url ist die eigene Website des Events, sonst diese Seite.
export function cdCandidate(r, base = SOURCE.base) {
  const page = cdPage(r.slug, base), type = String(r.event_type || ""), tiers = [].concat(r.cost_tiers || []).map((t) => String(t).trim().toLowerCase());
  const virtual = /virtual|online/i.test(type), hybrid = /hybrid/i.test(type), country = COUNTRY(r.country), desc = r.home_content || (r.tagline && strip(r.tagline) !== strip(r.title) ? r.tagline : "");
  const c = toCandidate({ name: r.title, startDate: r.start_date, endDate: r.end_date, url: page, uid: r.RowKey, description: desc,
    eventAttendanceMode: virtual ? "OnlineEventAttendanceMode" : hybrid ? "MixedEventAttendanceMode" : "OfflineEventAttendanceMode",
    location: virtual ? { "@type": "VirtualLocation", address: { addressCountry: country } } : { address: { addressLocality: r.city || "", addressCountry: country } },
    isAccessibleForFree: tiers.length && tiers.every((t) => t === "free") ? true : tiers.length && !tiers.includes("free") ? false : undefined,
    sameAs: [r.website, r.registration_url].filter(Boolean), keywords: r.hashtag ? [r.hashtag] : [] }, page, true);
  const site = extUrl(r.website), reg = extUrl(r.registration_url) && noUtm(extUrl(r.registration_url));
  // Modus aus event_type (nicht aus "Stadt fehlt = online": ein Praesenz-Event ohne eingetragenen Ort bleibt vor Ort)
  const mode = virtual ? "online" : hybrid ? "hybrid" : /person|onsite|in-person/i.test(type) ? "onsite" : c.mode;
  return { ...c, mode, online_stated: virtual, url: site || page, tickets_url: reg, ms: true };
}

export function parseIcs(text, pageUrl = SOURCE.base) {
  const lines = String(text || "").replace(/\r?\n[ \t]/g, "").split(/\r?\n/), out = []; let cur = null;
  const val = (l) => dec(l.slice(l.indexOf(":") + 1).replace(/\\n/gi, " ").replace(/\\([,;\\])/g, "$1"));
  for (const l of lines) {
    if (l === "BEGIN:VEVENT") cur = {}; else if (l === "END:VEVENT" && cur) { if (cur.summary && cur.dtstart) { const loc = cur.location || ""; out.push(toCandidate({ ...cur, location: /^https?:|online|virtual|teams/i.test(loc) ? { "@type": "VirtualLocation" } : !loc ? {} : { address: loc.split(",").length > 1 ? { addressLocality: loc.split(",").slice(-2)[0].trim(), addressCountry: loc.split(",").pop().trim() } : { addressLocality: loc } } }, pageUrl)); } cur = null; }
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
  let detailStop = "";   // erste Kennung, deren Event-Seite das Kontingent nicht mehr erlaubte ("" = alle versucht)
  if (!opts.state) opts.state = { last: {}, count: 0 };   // ein Abruf-Kontingent fuer alle Abrufe dieses Laufs
  const today = String(opts.today || new Date().toISOString()).slice(0, 10), recs = new Map();
  const add = (list) => { for (const c of list) if (c.title && c.start) by.set(candKey(c), c); };   // je Datensatz ein Kandidat (nie je Listen-Adresse)
  const get = async (u) => { const r = await politeGet(env, u, { ...opts, reduce: slimNext }); if (r.error === "request_budget") complete = false; return r; };
  // Next-Datensaetze sammeln (je slug zusammengefuehrt: die Startseite hat den Anmelde-Link, /events alle kommenden); nur veroeffentlichte, nicht vorbei
  const keep = (r) => (!r.status || r.status === "published") && String(r.end_date || r.start_date).slice(0, 10) >= today;
  const addRecs = (l) => { let n = 0; for (const r of l) { if (!keep(r)) continue; recs.set(r.slug, { ...recs.get(r.slug), ...r }); n++; } return n; };
  for (const strat of opts.strategies || STRATEGIES) {
    if (by.size || !complete) break;
    if (strat === "ics") for (const p of SOURCE.ics) { const r = await get(f(p)); if (r.ok && /BEGIN:VCALENDAR/.test(r.body)) { add(parseIcs(r.body, f(p))); notes.push(`ics:${p}`); break; } else notes.push(`ics:${p}:${r.error || r.status}`); }
    if (strat === "jsonld-list") {
      for (const p of SOURCE.list) { const r = await get(f(p)); if (r.ok) { const n = addRecs(nextRecords(r.body)), l = parseJsonLd(r.body, f(p)); add(l); notes.push(`list:${p}:${n + l.length}`); } else notes.push(`list:${p}:${r.error || r.status}`); }
      if (recs.size && complete) detailStop = await details(env, recs, { ...opts, keep }, notes);
      for (const r of recs.values()) add([cdCandidate(r)]);
    }
    if (strat === "sitemap") {
      const sm = await get(f(SOURCE.sitemap)); if (!sm.ok) { notes.push(`sitemap:${sm.error || sm.status}`); continue; }
      const urls = parseSitemap(sm.body).slice(0, SOURCE.maxEventPages); notes.push(`sitemap:${urls.length}`);
      for (const u of urls) { const r = await get(u); if (r.ok) { const n = nextRecords(r.body); n.length ? addRecs(n) : add(parseJsonLd(r.body, u, true)); } else notes.push(`page:${r.error || r.status}`); }
      for (const r of recs.values()) add([cdCandidate(r)]);
    }
  }
  return { candidates: [...by.values()], notes, complete, detailStop };
}
// Beschreibung aus den Seiten der kommenden Events (in der Reihenfolge des Einspielens, ab opts.after). Ist das Abruf-Kontingent aufgebraucht, gibt die
// Funktion die erste nicht gelesene Kennung zurueck: runCommunityDays spielt in diesem Lauf nur Events davor ein, der Rest folgt im naechsten Lauf
// (Listen aus dem Cache, das Kontingent reicht dann fuer die naechsten Seiten). Sagt die Event-Seite, das Event ist nicht (mehr) veroeffentlicht oder vorbei, faellt es weg.
async function details(env, recs, opts, notes) {
  const key = (r) => candKey(cdCandidate(r)), list = [...recs.values()].map((r) => [key(r), r]).filter(([k]) => k > (opts.after || "")).sort((a, b) => (a[0] < b[0] ? -1 : 1)).slice(0, SOURCE.maxEventPages);
  let got = 0, miss = 0;
  let stop = "";
  for (const [k, r] of list) {
    const res = await politeGet(env, cdPage(r.slug), { ...opts, reduce: slimNext });
    if (res.error === "request_budget") { stop = k; break; }
    const d = res.ok ? nextRecords(res.body).find((x) => x.slug === r.slug) : null;
    if (d) { const m = { ...r, ...d }; if (opts.keep(m)) recs.set(r.slug, m); else recs.delete(r.slug); got++; } else miss++;
  }
  notes.push(`detail:${got}/${list.length}` + (miss ? `:miss${miss}` : "") + (stop ? ":budget" : ""));
  return stop;
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
  const { candidates, notes, complete, detailStop } = await collect(env, { ttl: 20 * 3600, maxRequests: 12, ...opts, today, after: opts.dry ? "" : st.after });
  const ref = candKey, list = candidates.filter(isMicrosoftRelated).sort((a, b) => (ref(a) < ref(b) ? -1 : ref(a) > ref(b) ? 1 : 0));
  const rep = { dry: !!opts.dry, found: candidates.length, microsoft: list.length, skipped_non_ms: candidates.length - list.length, ...zero, updated: 0, retired: 0, remaining: 0, notes };   // updated = Aenderungen der Quelle uebernommen (Teil von merged)
  if (!complete) { if (!opts.dry) await save(); return { ...rep, fetching: true, remaining: list.length }; }   // noch nicht alles gelesen: der naechste Lauf macht weiter
  const todo = opts.dry ? list : list.filter((c) => ref(c) > st.after);
  // Nur Events, deren Event-Seite in diesem Lauf gelesen oder versucht wurde (sonst blieben dieselben Events Tag fuer Tag ohne Beschreibung).
  // Kam der Lauf an gar keiner Seite vorbei (Kontingent schon verbraucht), gelten die Listendaten, damit der Durchgang nie stehen bleibt.
  const ready = !opts.dry && detailStop ? todo.filter((c) => ref(c) < detailStop) : todo;
  const work = (ready.length ? ready : todo).slice(0, opts.dry ? Math.min(60, opts.cap || 60) : cap);
  // Die Quelle ist vollstaendig gelesen: je Kennung ist bekannt, ob sie genau einen Datensatz bezeichnet (sole). Nur dann gilt ein Eintrag mit neuem Termin oder
  // neuem Namen als derselbe, geaenderte Datensatz und nur dann folgt ein ungepflegtes Import-Event seinen Aenderungen (siehe eventmerge.js sameRecord).
  const per = new Map(); for (const c of candidates) per.set(c.sources[0].ref, (per.get(c.sources[0].ref) || 0) + 1);
  for (const c of work) {
    const r = await upsertEvent(db, { ...c, sole: per.get(c.sources[0].ref) === 1 }, { dry: opts.dry, now: t, today });
    if (r.changed) rep.updated++;
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
