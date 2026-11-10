// Hoeflicher Abruf externer Quellen fuer die Importer: robots.txt, eigener User-Agent, Abstand je Host, Antwort-Cache.
// Keine E-Mail-Adresse im User-Agent; die Bot-Seite https://www.m365.fm/bot/ erklaert den Zweck.
export const UA = "M365.FM-EventBot (+https://www.m365.fm/bot/)";
const TOKEN = "m365.fm-eventbot";
const now = () => Math.floor(Date.now() / 1000);
const DAY = 86400;
export const CACHE_MAX = 400000;   // Zeichen; groessere Antworten werden nicht zwischengespeichert (nie gekuerzt)

// robots.txt-Auswertung: Gruppe des eigenen Tokens, sonst "*"; laengste passende Regel gewinnt, Allow vor Disallow bei Gleichstand
export function robotsAllowed(txt, path) {
  const groups = []; let cur = null, lastWasUa = false;
  for (const raw of String(txt || "").split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim(); const m = /^([a-z-]+)\s*:\s*(.*)$/i.exec(line); if (!m) { continue; }
    const k = m[1].toLowerCase(), v = m[2].trim();
    if (k === "user-agent") { if (!lastWasUa || !cur) { cur = { agents: [], rules: [] }; groups.push(cur); } cur.agents.push(v.toLowerCase()); lastWasUa = true; continue; }
    lastWasUa = false;
    if (cur && (k === "allow" || k === "disallow")) cur.rules.push([k, v]);
  }
  const own = groups.filter((g) => g.agents.some((a) => a && TOKEN.includes(a) && a !== "*"));
  const use = own.length ? own : groups.filter((g) => g.agents.includes("*"));
  let best = null;
  for (const g of use) for (const [k, v] of g.rules) {
    if (!v) continue;   // "Disallow:" leer = alles erlaubt
    const rx = new RegExp("^" + v.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$"));
    if (!rx.test(path)) continue;
    if (!best || v.length > best.len || (v.length === best.len && k === "allow")) best = { len: v.length, allow: k === "allow" };
  }
  return best ? best.allow : true;
}
// opts: { fetch, sleep, ttl (Sekunden Cache), minGapMs, maxRequests (Abrufe je Lauf), state }  state = { last: {host: ms}, count }
// Datensparsam: der Cache haelt nie mehr, als der Importer verwendet.
//   opts.noStore = Antwort gar nicht zwischenspeichern (Profilseiten von Personen: Kurzvorstellung, Foto, Links)
//   opts.reduce  = (body) => String | null: die Antwort vor dem Speichern UND vor der Rueckgabe auf das Verwendete kuerzen (Sessionize view/All: von Speakern nur
//                  Kennung und Name). null = unbrauchbar: die Antwort wird unveraendert zurueckgegeben und nicht gespeichert.
export async function politeGet(env, url, opts = {}) {
  const db = env.DB, f = opts.fetch || globalThis.fetch, sleep = opts.sleep || ((ms) => new Promise((r) => setTimeout(r, ms)));
  const u = new URL(url), ttl = opts.ttl ?? 6 * 3600, st = opts.state || (opts.state = { last: {}, count: 0 });
  if (u.protocol !== "https:") return { ok: false, error: "https_only" };
  const cached = opts.noStore ? null : await db.prepare("SELECT body,status,fetched FROM import_cache WHERE url=?").bind(url).first();
  if (cached && now() - cached.fetched < ttl && cached.status > 0) return { ok: cached.status < 400, status: cached.status, body: cached.body, cached: true };
  if (!opts.skipRobots) {
    const ru = `${u.origin}/robots.txt`;
    let rb = await db.prepare("SELECT body,status,fetched FROM import_cache WHERE url=?").bind(ru).first();
    if (!rb || now() - rb.fetched > DAY) {
      const r = await rawGet(f, ru, st, sleep, opts.minGapMs);
      rb = { body: r.ok ? r.body : "", status: r.status || 0, fetched: now() };
      if (r.status > 0) await db.prepare("INSERT INTO import_cache(url,body,status,fetched) VALUES(?,?,?,?) ON CONFLICT(url) DO UPDATE SET body=excluded.body,status=excluded.status,fetched=excluded.fetched").bind(ru, rb.body.slice(0, 100000), rb.status, rb.fetched).run();
    }
    // 4xx = keine robots.txt = erlaubt; 5xx/Netzfehler = vorsichtshalber nicht abrufen
    if ((rb.status >= 500 || rb.status === 0) && !(rb.body)) return { ok: false, error: "robots_unavailable" };
    if (rb.status < 400 && !robotsAllowed(rb.body, u.pathname + u.search)) return { ok: false, error: "robots_disallow" };
  }
  if (st.count >= (opts.maxRequests || 80)) return { ok: false, error: "request_budget" };
  const r = await rawGet(f, url, st, sleep, opts.minGapMs, opts.accept);
  if (opts.noStore) return r;
  let keep = true;
  if (opts.reduce) { const slim = r.ok ? opts.reduce(r.body) : ""; if (slim === null || slim === undefined) keep = false; else r.body = slim; }   // Fehlerseiten: nur der Status
  // Nur vollstaendige Antworten zwischenspeichern: eine abgeschnittene Kopie waere beim naechsten Lesen kaputt (z. B. JSON grosser Events)
  if (keep && r.status > 0 && (r.body || "").length <= CACHE_MAX) await db.prepare("INSERT INTO import_cache(url,body,status,fetched) VALUES(?,?,?,?) ON CONFLICT(url) DO UPDATE SET body=excluded.body,status=excluded.status,fetched=excluded.fetched").bind(url, r.body || "", r.status, now()).run();
  else if (r.status > 0 && cached) await db.prepare("DELETE FROM import_cache WHERE url=?").bind(url).run();   // zu gross fuer den Cache oder unbrauchbar: auch keinen alten Stand liefern
  return r;
}
async function rawGet(f, url, st, sleep, gap = 1500, accept = "text/html,application/json,text/calendar,application/xml;q=0.9,*/*;q=0.5") {
  const host = new URL(url).host, wait = (st.last[host] || 0) + gap - Date.now();
  if (st.last[host] && wait > 0) await sleep(wait);
  st.last[host] = Date.now(); st.count++;
  try {
    const r = await f(url, { headers: { "user-agent": UA, accept }, redirect: "follow", cf: { cacheTtl: 300 } });
    const body = await r.text();
    return { ok: r.status < 400, status: r.status, body };
  } catch (e) { return { ok: false, status: 0, body: "", error: "network" }; }
}
