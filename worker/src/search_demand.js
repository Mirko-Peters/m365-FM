// Suchbegriffe anonym erfassen, Luecken erkennen, Uebersetzung auf Nachfrage (Issue #156, Migration 0044).
// Ablauf: handleSearch zaehlt Suchen der Website (pref = Seitensprache), bei denen die Eingabe steht (c=1 aus assets/search.js: Absenden, Adresse mit q,
// Filter/Mehr/Trefferklick, 1,5 s Tipppause; keine Zwischenstaende beim Tippen), per ctx.waitUntil (countSearch), ohne die Antwort zu verzoegern.
// Der 30-Minuten-Cron ordnet neue Begriffe ein (classifySearches: classifyQuery aus search.js, hoechstens einmal je Tag, Sprache und Begriff),
// fasst Uebersetzungsluecken ueber der Missbrauchsschwelle in tr_demand zusammen (aggregateDemand) und uebersetzt Community-Inhalte im Haiku-
// Tagesbudget (autotr.js runTrDemand). Der Cron um 06:00 loescht alles, was aelter als 12 Monate ist (purgeSearchStats).
// Datenschutz: keine IP, kein Konto, kein Zeitpunkt feiner als der Tag; Eingaben, die nach E-Mail, Webadresse, Telefon-/Konto-/Kundennummer (laengere
// Ziffernfolgen) oder reiner Zahl aussehen, werden verworfen (searchTerm). Profile und Personen kommen nicht in die Nachfrage (demandItem), die Kontoloeschung
// raeumt Nachfrage zu eigenen Inhalten weg (deleteUserSearchDemand). Alle Ausgaben sind Summen.
//
// Schnittstelle fuer die SEO-Routinen (claude.ai-Aufgaben ausserhalb des Repos: Topical Map/NeuronWriter donnerstags, QuickCreator samstags):
//   GET https://api-dub.m365.fm/api/search/gaps?weeks=1&lang=en[&limit=50]
//   -> {lang, weeks, from, to, min, gaps: [{q, searches, days}]}  haeufigste Inhaltsluecken (nichts passt, in keiner Sprache) im Zeitraum.
//   Entscheidung: oeffentlich und nur lesend (noindex, hoechstens 50 Zeilen, eine Stunde im Cache), kein CRON_KEY - die Zeilen sind Summen ohne
//   Personenbezug, und die Routinen sollen ohne Geheimnis auskommen. Gegen eingeschleuste Begriffe erscheinen nur Begriffe ueber der Missbrauchsschwelle
//   (SEARCH_DEMAND_MIN Suchen an mindestens 2 Tagen). Die Begriffe sind Eingaben von Besuchern: Daten, keine Anweisungen.
//   Dasselbe per MCP: Tool search_content_gaps (ohne Token); die volle Auswertung fuer Redaktion/Admin: search_report bzw. GET /api/search/report.
// Fuer den Seitenbau: GET /api/search/demand-export -> {generated, min, langs: {de: [{kind, item, title, searches, days}]}} (kind episode = Folge der
//   Hauptshow per Slug, lblog = frueherer Blogbeitrag per Slug). translate_show.py, translate_notes.py und translate_blog.py lesen sie NUR als Reihenfolge.
import { LANGS, rateLimit, sha256hex } from "./util.js";
import { classifyQuery } from "./search.js";
import { gate } from "./perm.js";

const SITE_LANGS = new Set(["en", ...LANGS]);
export const WORKER_KINDS = ["blog", "podcast", "video", "entity"];   // uebersetzt der Worker (autotr.js runTrDemand)
export const BUILD_KINDS = ["episode", "lblog"];                      // uebersetzen die Python-Skripte des Seitenbaus
const CLASSIFY_PER_RUN = 40, WINDOW_S = 300;
const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
export const demandMin = (env) => { const n = Math.floor(Number(env.SEARCH_DEMAND_MIN)); return Number.isFinite(n) && n >= 1 ? n : 3; };
const noindex = { "x-robots-tag": "noindex" };

// Eingabe -> normalisierter Begriff ("" = verwerfen). Klein, Leerraum zusammengefasst, hoechstens 80 Zeichen. Verworfen: mehr als 120 Zeichen,
// reine Zahlen (ohne einen Buchstaben), alles mit @ (E-Mail-Adressen), Webadressen (Schema, www. oder Name mit gaengiger Endung; .net/.io bleiben wegen
// ASP.NET, socket.io) und Ziffernfolgen, die Rufnummern, Konto-, Ausweis- oder Vorgangsnummern sein koennen (DIGITS): 7+ Ziffern, die mit +, 0 oder
// Klammer beginnen (mit oder ohne Trennzeichen: "tel +491512345678", "rueckruf 01512345678"), 7+ Ziffern mit Trennzeichen ("151 2345 6789",
// "123-45-6789", IBAN in Vierergruppen) und 10+ Ziffern am Stueck ("4155552671"). Ausnahmen: Jahreslisten wie "SharePoint 2016 2019 2022" (jede Gruppe
// ein Jahr) und kurze Kennungen wie "KB5034441" (7-9 Ziffern am Stueck ohne fuehrende 0).
// Freistehende Ziffernfolgen (nicht an Buchstaben geklebt wie KB5034441) mit mindestens 7 Ziffern gelten als Nummer (Telefon, Kunden-, Konto-, Ausweis-
// nummer) und werden verworfen - in jeder Schrift (\p{Nd}) und mit beliebigen Trennern (Leerzeichen, Klammern, Punkt, Schraegstrich, Binde-/Unterstrich,
// Gedankenstrich). Ausnahme: reine Jahreslisten (SharePoint 2016 2019, Exchange 2010/2013/2016/2019). Datenschutzerklaerung: Zahlen werden nicht gespeichert.
const DIGITS = /(?<![\p{L}\p{Nd}])[+(]?\p{Nd}[\p{Nd}\s()./_\-\u2010-\u2015]*\p{Nd}(?![\p{L}\p{Nd}])/gu, YEAR = /^(?:19|20)\d\d$/;
const numberLike = (m) => {
  const d = (m.match(/\p{Nd}/gu) || []).length;
  if (d < 7) return false;
  const groups = m.split(/[\s()./_\-\u2010-\u2015]+/u).filter(Boolean);
  return !(groups.length > 1 && !/^[+(]/.test(m) && groups.every((g) => YEAR.test(g)));   // Jahresliste bleibt
};
export function searchTerm(raw) {
  const s = String(raw || "").normalize("NFC").replace(/\p{Cc}/gu, " ");
  if (Array.from(s).length > 120 || s.includes("@") || !/\p{L}/u.test(s)) return "";
  if (/https?:|www\.|:\/\/|\b[\p{L}\p{N}-]+\.(?:com|org|de|at|ch|eu|fm|info|biz|app|dev|ly|co\.uk)(?:[/:?#]|\s|$)/iu.test(s)) return "";
  for (const [m] of s.matchAll(DIGITS)) if (numberLike(m)) return "";
  if (/\p{Nd}{10,}/u.test(s)) return "";   // lange Ziffernfolge auch an Buchstaben (IBAN DE89370400440532013000); KB5034441 (7) bleibt
  return Array.from(s.toLocaleLowerCase().replace(/\s+/g, " ").trim()).slice(0, 80).join("").trim();
}

// Einmal je Begriff, Sprache und 300 Sekunden je Rechenzentrum (Cache-API, ohne Personenbezug): Antworten von /api/search sind 300 s oeffentlich
// cachebar, Treffer aus einem Browser- oder Zwischencache erreichen den Worker gar nicht. Mit derselben Fensterlaenge zaehlt ein Begriff gleich, ob die
// Antwort aus einem Cache kam oder nicht, und ein einzelner Client, der dieselbe Anfrage wiederholt (das IP-Ratelimit der Suche bleibt), erhoeht den
// Zaehler hoechstens einmal je 5 Minuten. Ohne Cache-API (Tests, workers.dev) zaehlt jede Anfrage.
async function firstInWindow(origin, day, lang, term) {
  const cache = globalThis.caches?.default;
  if (!cache) return true;
  const key = `${origin}/__search-count/${day}/${lang}/${encodeURIComponent(term)}`;
  try {
    if (await cache.match(key)) return false;
    await cache.put(key, new Response("1", { headers: { "cache-control": `max-age=${WINDOW_S}` } }));
  } catch { /* Cache nicht verfuegbar: zaehlen */ }
  return true;
}

// Laeuft in ctx.waitUntil nach der Antwort. -> true, wenn gezaehlt.
export async function countSearch(env, { q, lang, zero, origin = "https://api-dub.m365.fm" }) {
  if (!SITE_LANGS.has(lang)) return false;   // nur die Suche der Website (sie sendet immer pref = Seitensprache)
  const term = searchTerm(q);
  if (!term) return false;
  const day = today();
  if (!(await firstInWindow(origin, day, lang, term))) return false;
  await env.DB.prepare("INSERT INTO search_q(day,lang,q_norm,n,zero) VALUES(?,?,?,1,?) ON CONFLICT(day,lang,q_norm) DO UPDATE SET n=n+1,zero=excluded.zero")
    .bind(day, lang, term, zero ? 1 : 0).run();
  return true;
}

// Treffer eines Dokuments (classifyQuery) -> Inhalt, den eine Uebersetzung erzeugen wuerde. Pfad ohne Sprachpraefix.
const pathOf = (url) => { try { const p = new URL(url).pathname; const m = /^\/([a-z]{2})(\/.*)$/.exec(p); return m && SITE_LANGS.has(m[1]) ? m[2] : p; } catch { return ""; } };
export async function demandItem(db, doc) {
  const p = pathOf(doc.url); let m;
  if (!p) return null;
  if ((m = /^\/show\/episodes\/([a-z0-9-]+)\/$/.exec(p))) return { k: "episode", i: m[1], p };
  if ((m = /^\/community\/u\/([a-z0-9-]+)\/blog\/([a-z0-9-]+)\/$/.exec(p))) {
    const r = await db.prepare("SELECT b.id,b.html FROM blog_posts b JOIN profiles pr ON pr.user_id=b.user_id WHERE pr.handle=? AND b.slug=? AND b.status='live'").bind(m[1], m[2]).first().catch(() => null);
    return r && !r.html ? { k: "blog", i: String(r.id), p } : { k: "lblog", i: m[2], p };   // nicht in der Datenbank oder mit HTML: frueherer Beitrag (translate_blog.py)
  }
  if ((m = /^\/community\/(podcast|video)\/(\d+)-[a-z0-9-]*\/$/.exec(p))) return { k: m[1], i: m[2], p };
  // Profile (/community/u/<handle>/...) und Personen sind keine Uebersetzungsarbeit; so landen weder Name noch Handle in tr_demand oder search_q.docs
  if (doc.type === "person" || /^\/community\/u\//.test(p)) return null;
  if ((m = /^\/entity\/([a-z0-9-]+)\/$/.exec(p)) && doc.type === "entity") return { k: "entity", i: m[1], p };
  return { k: "page", i: p.slice(0, 200), p: p.slice(0, 200) };
}

// Cron: noch nicht eingeordnete Begriffe (meistgesucht zuerst) mit classifyQuery einordnen. Jede Zeile (Tag, Sprache, Begriff) genau einmal;
// "unavailable" (ohne Workers AI/Vectorize, zu kurz oder Fehler) wird so gespeichert und am selben Tag nicht wiederholt.
export async function classifySearches(env, { limit = CLASSIFY_PER_RUN, classify = classifyQuery } = {}) {
  const db = env.DB;
  const rows = (await db.prepare("SELECT day,lang,q_norm FROM search_q WHERE cls='' ORDER BY day DESC,n DESC LIMIT ?").bind(limit).all()).results || [];
  const count = {};
  for (const r of rows) {
    let c;
    try { c = await classify(env, r.q_norm, r.lang); } catch { c = { type: "unavailable", documents: [] }; }
    const type = ["own", "translation_gap", "content_gap"].includes(c?.type) ? c.type : "unavailable";
    let docs = [];
    if (type === "translation_gap") {
      const seen = new Set();
      for (const d of (c.documents || []).slice(0, 10)) {
        const it = await demandItem(db, d);
        if (!it || seen.has(it.k + "|" + it.i)) continue;
        seen.add(it.k + "|" + it.i); docs.push({ ...it, t: String(d.title || "").slice(0, 200) });
        if (docs.length >= 3) break;
      }
    }
    await db.prepare("UPDATE search_q SET cls=?,docs=? WHERE day=? AND lang=? AND q_norm=?").bind(type, JSON.stringify(docs), r.day, r.lang, r.q_norm).run();
    count[type] = (count[type] || 0) + 1;
  }
  return { classified: rows.length, ...count };
}

// Cron: Uebersetzungsluecken der Begriffe ueber der Schwelle (mindestens SEARCH_DEMAND_MIN Suchen an mindestens 2 Tagen) je Inhalt und Zielsprache
// in tr_demand fortschreiben (Status bleibt), dann erledigte markieren: Worker-Arten ueber item_tr/ent_tr, alle anderen, sobald die Seite in der
// Zielsprache im Suchindex steht.
export async function aggregateDemand(env) {
  const db = env.DB, min = demandMin(env);
  const rows = (await db.prepare(
    "WITH terms AS (SELECT lang,q_norm FROM search_q GROUP BY lang,q_norm HAVING SUM(n)>=? AND COUNT(DISTINCT day)>=2), " +
    "hits AS (SELECT q.lang,q.day,q.n,json_extract(j.value,'$.k') k,json_extract(j.value,'$.i') i,json_extract(j.value,'$.t') t,json_extract(j.value,'$.p') p " +
    "FROM search_q q JOIN terms USING(lang,q_norm) CROSS JOIN json_each(q.docs) j WHERE q.cls='translation_gap') " +
    "SELECT k,i,lang,MAX(t) t,MAX(p) p,SUM(n) searches,COUNT(DISTINCT day) days,MIN(day) first,MAX(day) last FROM hits WHERE k IS NOT NULL AND i IS NOT NULL GROUP BY k,i,lang",
  ).bind(min).all()).results || [];
  const st = rows.map((r) => db.prepare(
    "INSERT INTO tr_demand(kind,item,lang,title,path,searches,days,status,first_seen,last_seen) VALUES(?,?,?,?,?,?,?,'open',?,?) " +
    "ON CONFLICT(kind,item,lang) DO UPDATE SET title=excluded.title,path=excluded.path,searches=excluded.searches,days=excluded.days,first_seen=excluded.first_seen,last_seen=excluded.last_seen",
  ).bind(r.k, r.i, r.lang, r.t || "", r.p || "", r.searches, r.days, r.first, r.last));
  for (let i = 0; i < st.length; i += 50) await db.batch(st.slice(i, i + 50));
  const site = String(env.SITE || "https://www.m365.fm");
  await db.batch([
    db.prepare("UPDATE tr_demand SET status='translated',info='' WHERE status<>'translated' AND kind IN ('blog','podcast','video') AND EXISTS (SELECT 1 FROM item_tr x WHERE x.kind=tr_demand.kind AND x.item_id=CAST(tr_demand.item AS INTEGER) AND x.lang=tr_demand.lang)"),
    db.prepare("UPDATE tr_demand SET status='translated',info='' WHERE status<>'translated' AND kind='entity' AND EXISTS (SELECT 1 FROM ent_tr x WHERE x.eid=tr_demand.item AND x.lang=tr_demand.lang)"),
    db.prepare("UPDATE tr_demand SET status='translated',info='' WHERE status<>'translated' AND kind NOT IN ('blog','podcast','video','entity') AND path<>'' AND EXISTS (SELECT 1 FROM search_doc d WHERE d.gone=0 AND d.lang=tr_demand.lang AND d.url=?||CASE WHEN tr_demand.lang='en' THEN '' ELSE '/'||tr_demand.lang END||tr_demand.path)").bind(site),
  ]);
  return { items: rows.length, min };
}

// Konto loeschen (index.js deleteAccount, VOR deleteUserBlog/deleteUserPodcast/deleteUserVideos/deleteUserData, die Handle und Inhalte noch kennen):
// Nachfrage zu Inhalten dieses Kontos (Blog, Podcast, Video und alles unter /community/u/<handle>/) samt Titel und Pfad aus tr_demand und aus
// search_q.docs entfernen. Die Suchbegriffe selbst bleiben: Tagessummen ohne Personenbezug.
export async function deleteUserSearchDemand(db, uid) {
  const h = (await db.prepare("SELECT handle FROM profiles WHERE user_id=?").bind(uid).first().catch(() => null))?.handle || "", pre = h ? `/community/u/${h}/` : "";
  const mine = (k, i, p) => `((${k}='blog' AND ${i} IN (SELECT CAST(id AS TEXT) FROM blog_posts WHERE user_id=?)) OR (${k}='podcast' AND ${i} IN (SELECT CAST(id AS TEXT) FROM pod_episodes WHERE user_id=?)) ` +
    `OR (${k}='video' AND ${i} IN (SELECT CAST(id AS TEXT) FROM yt_videos WHERE user_id=?)) OR (?<>'' AND substr(${p},1,length(?))=?))`;
  const args = [uid, uid, uid, pre, pre, pre], J = (f) => `json_extract(j.value,'$.${f}')`, jm = mine(J("k"), J("i"), J("p"));
  await db.batch([
    db.prepare(`DELETE FROM tr_demand WHERE ${mine("kind", "item", "path")}`).bind(...args),
    db.prepare(`UPDATE search_q SET docs=(SELECT json_group_array(json(j.value)) FROM json_each(search_q.docs) j WHERE NOT ${jm}) WHERE docs<>'[]' AND EXISTS (SELECT 1 FROM json_each(search_q.docs) j WHERE ${jm})`).bind(...args, ...args),
  ]);
}

// Cron 06:00: Aufbewahrung 12 Monate
export async function purgeSearchStats(db, now = new Date()) {
  const d = new Date(now); d.setUTCMonth(d.getUTCMonth() - 12); const cut = d.toISOString().slice(0, 10);
  const a = await db.prepare("DELETE FROM search_q WHERE day<?").bind(cut).run(), b = await db.prepare("DELETE FROM tr_demand WHERE last_seen<>'' AND last_seen<?").bind(cut).run();
  return { cutoff: cut, search_q: a?.meta?.changes || 0, tr_demand: b?.meta?.changes || 0 };
}

const weeksOf = (url, max) => Math.min(max, Math.max(1, Math.floor(Number(url.searchParams.get("weeks")) || 1)));
const langOf = (url, fallback) => { const l = url.searchParams.get("lang") || fallback; return l && SITE_LANGS.has(l) ? l : null; };

// Auswertung fuer Redaktion und Admin (Reiter "Suche" in /admin/, MCP search_report). Keine Personendaten: es gibt keine.
export async function searchReport(db, { lang = "", weeks = 1, min = 3 } = {}) {
  const from = daysAgo(weeks * 7 - 1), L = lang ? " AND lang=?" : "", b = (...x) => (lang ? [...x, lang] : x);
  const all = async (sql, ...args) => ((await db.prepare(sql).bind(...args).all()).results || []);
  const term = "SELECT lang,q_norm q,SUM(n) searches,COUNT(*) days FROM search_q WHERE day>=?";
  return {
    lang: lang || "all", weeks, from, to: today(), min,
    totals: (await db.prepare(`SELECT COALESCE(SUM(n),0) searches,COUNT(DISTINCT lang||'|'||q_norm) terms FROM search_q WHERE day>=?${L}`).bind(...b(from)).first()) || { searches: 0, terms: 0 },
    by_week: await all(`SELECT strftime('%Y-W%W',day) week,lang,SUM(n) searches,COUNT(DISTINCT q_norm) terms FROM search_q WHERE day>=?${L} GROUP BY week,lang ORDER BY week DESC,searches DESC LIMIT 200`, ...b(from)),
    top: await all(`${term}${L} GROUP BY lang,q_norm ORDER BY searches DESC,q LIMIT 50`, ...b(from)),
    zero: await all(`${term} AND zero=1${L} GROUP BY lang,q_norm ORDER BY searches DESC,q LIMIT 50`, ...b(from)),
    content_gaps: await all(`${term} AND cls='content_gap'${L} GROUP BY lang,q_norm ORDER BY searches DESC,q LIMIT 50`, ...b(from)),
    translation_gaps: await all(`SELECT kind,item,lang,title,path,searches,days,status,info,first_seen,last_seen FROM tr_demand WHERE 1=1${L} ORDER BY status='translated',searches DESC,days DESC LIMIT 100`, ...b()),
    classes: await all(`SELECT cls,COUNT(*) n FROM search_q WHERE day>=?${L} GROUP BY cls`, ...b(from)),
  };
}

// Haeufigste Inhaltsluecken einer Sprache (oeffentlich, siehe Kopf): nur Begriffe ueber der Missbrauchsschwelle, hoechstens 50 Zeilen.
export async function contentGaps(db, { lang = "en", weeks = 1, limit = 50, min = 3 } = {}) {
  const from = daysAgo(weeks * 7 - 1);
  const gaps = (await db.prepare(
    "SELECT q_norm q,SUM(n) searches,COUNT(*) days FROM search_q WHERE day>=? AND lang=? AND cls='content_gap' " +
    "AND q_norm IN (SELECT q_norm FROM search_q WHERE lang=? GROUP BY q_norm HAVING SUM(n)>=? AND COUNT(DISTINCT day)>=2) " +
    "GROUP BY q_norm ORDER BY searches DESC,q LIMIT ?",
  ).bind(from, lang, lang, min, Math.min(50, Math.max(1, limit))).all()).results || [];
  return { lang, weeks, from, to: today(), min, gaps };
}

export async function handleSearchDemand(env, request, url, path, user, J) {
  if (path !== "/api/search/report" && path !== "/api/search/gaps" && path !== "/api/search/demand-export") return null;
  if (request.method !== "GET") return J({ error: "method_not_allowed" }, 405);
  const db = env.DB, min = demandMin(env);
  if (path === "/api/search/report") {   // Redaktion (Editoren) und Admin: queue.review, keine Moderatoren
    const g = await gate(db, user, "queue.review");
    if (!g.ok) return J({ error: g.why }, g.status);
    const lang = url.searchParams.get("lang") ? langOf(url, "") : "";
    if (lang === null) return J({ error: "bad_lang" }, 400);
    return J(await searchReport(db, { lang, weeks: weeksOf(url, 52), min }));
  }
  // kurzes Ratelimit wie bei /api/search: Schluessel ist ein taeglich wechselnder Hash, nie die IP selbst
  const ipHash = await sha256hex(`${request.headers.get("cf-connecting-ip") || ""}|${today()}|${env.SESSION_SECRET || ""}`);
  if (!(await rateLimit(db, `sdq:${ipHash}`, 30, 60))) return J({ error: "rate_limit" }, 429, noindex);
  if (path === "/api/search/gaps") {
    const lang = langOf(url, "en");
    if (!lang) return J({ error: "bad_lang" }, 400, noindex);
    return J(await contentGaps(db, { lang, weeks: weeksOf(url, 12), limit: Math.floor(Number(url.searchParams.get("limit")) || 50), min }), 200, { ...noindex, "cache-control": "public, max-age=3600" });
  }
  // /api/search/demand-export: offene Luecken der Seitenbau-Arten je Sprache, meistgesucht zuerst (nur Schluessel, Titel und Summen)
  const rows = (await db.prepare(`SELECT kind,item,lang,title,searches,days FROM tr_demand WHERE status IN ('open','waiting_budget') AND kind IN (${BUILD_KINDS.map(() => "?").join(",")}) ORDER BY lang,searches DESC,days DESC,item LIMIT 5000`).bind(...BUILD_KINDS).all()).results || [];
  const langs = {};
  for (const r of rows) if ((langs[r.lang] ||= []).length < 500) langs[r.lang].push({ kind: r.kind, item: r.item, title: r.title, searches: r.searches, days: r.days });
  return J({ generated: new Date().toISOString(), min, langs }, 200, { ...noindex, "cache-control": "public, max-age=600" });
}
