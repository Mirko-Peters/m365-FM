// Automatische Uebersetzung neuer Community-Inhalte (Blog, Podcast, Video) mit Claude Haiku: ohne Denkphase, Aufwand "low".
import { AI_BUDGET_ERROR, aiBudgetStatus, haikuJson } from "./util.js";
export { haikuJson } from "./util.js";
// Regel: 24 Stunden nach dem Erscheinen eines Inhalts wird nachgeschaut; fehlt eine Sprachfassung (hat sie niemand uebersetzt), uebersetzt Haiku sie.
// Sicherheitsnetz: nur mit Secret ANTHROPIC_API_KEY, Tageslimit, nur Inhalte der letzten 30 Tage, Notaus ueber meta atr_off=1.
// Ergebnis in item_tr; Blogfassungen erscheinen ueber /api/blog/export als Beitraege der Zielsprache (mit KI-Hinweis).
const WAIT = 24 * 3600, WINDOW = 30 * 24 * 3600, DAILY_CAP = 150, PER_RUN = 4;
const LANGS = { en: "English", de: "German", fr: "French", es: "Spanish", it: "Italian", nl: "Dutch", pt: "Portuguese (European)", pl: "Polish", id: "Indonesian", ru: "Russian", uk: "Ukrainian", ar: "Arabic", he: "Hebrew", ja: "Japanese", ko: "Korean" };
const KINDS = {
  blog: { table: "blog_posts", sel: "id,lang,title,summary,body", where: "status='live' AND html='' AND published>0", t: "published", f: ["title", "summary", "body"] },
  podcast: { table: "pod_episodes", sel: "id,lang,title,description AS summary", where: "published>0", t: "published", f: ["title", "summary"] },
  video: { table: "yt_videos", sel: "id,lang,title,description AS summary", where: "published>0", t: "published", f: ["title", "summary"] },
};
const now = () => Math.floor(Date.now() / 1000);
const SYS = "You translate community posts about Microsoft 365, Azure and IT. Translate the JSON values into the requested language and answer with the JSON object only, same keys. " +
  "Never translate names: product and feature names, event, person and company names, abbreviations and codes. Keep the markup exactly as it is: {{ref|...}} and [[...]] links, headings (== ... ==), lists, blank lines, URLs. " +
  "Keep tone and length. No commentary.";

async function meta(db, k) { return (await db.prepare("SELECT v FROM meta WHERE k=?").bind(k).first())?.v || ""; }
async function setMeta(db, k, v) { await db.prepare("INSERT INTO meta(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").bind(k, String(v)).run(); }
export async function ensureItemTr(db) {
  await db.prepare("CREATE TABLE IF NOT EXISTS item_tr (kind TEXT NOT NULL, item_id INTEGER NOT NULL, lang TEXT NOT NULL, title TEXT NOT NULL DEFAULT '', summary TEXT NOT NULL DEFAULT '', body TEXT NOT NULL DEFAULT '', src TEXT NOT NULL DEFAULT 'auto', created INTEGER NOT NULL, PRIMARY KEY (kind, item_id, lang))").run();
}
const count = (s, re) => (String(s).match(re) || []).length;

const call = (env, from, to, obj, job = "worker_autotr_items") => haikuJson(env, SYS + ` Target language: ${LANGS[to]}.`, obj, { job, lang: to });

export async function autoTranslateItems(env) {
  const db = env.DB;
  if (!env.ANTHROPIC_API_KEY || (await meta(db, "atr_off")) === "1") return { skipped: true };
  await ensureItemTr(db);
  const day = new Date().toISOString().slice(0, 10), used = +(await meta(db, "atr_count:" + day)) || 0, room = Math.min(PER_RUN, DAILY_CAP - used);
  if (room <= 0) return { capped: true };
  const t = now(), todo = [];
  for (const [kind, K] of Object.entries(KINDS)) {
    let rows = [];
    try { rows = (await db.prepare(`SELECT ${K.sel},${K.t} ts FROM ${K.table} WHERE ${K.where} AND ${K.t}<=? AND ${K.t}>=? ORDER BY ${K.t} DESC LIMIT 60`).bind(t - WAIT, t - WINDOW).all()).results || []; } catch { continue; }
    if (!rows.length) continue;
    const have = new Set(((await db.prepare("SELECT item_id,lang FROM item_tr WHERE kind=?").bind(kind).all()).results || []).map((r) => r.item_id + "|" + r.lang));
    for (const r of rows) for (const to of Object.keys(LANGS)) if (to !== r.lang && !have.has(r.id + "|" + to)) todo.push({ kind, K, r, to });
    if (todo.length >= room) break;
  }
  let done = 0, failed = 0, blocked = 0;
  await Promise.all(todo.slice(0, room).map(async ({ kind, K, r, to }) => {
    const inp = {}; for (const f of K.f) inp[f] = String(r[f] || "").slice(0, f === "body" ? 12000 : 600);
    try {
      const out = await call(env, r.lang, to, inp);
      const bad = K.f.some((f) => inp[f] && typeof out[f] !== "string") || /<script/i.test(JSON.stringify(out));
      const lr = (out.body || "").length / Math.max(1, (inp.body || "").length);
      if (bad || (inp.body && (lr < 0.2 || lr > 3)) || (inp.body && count(out.body, /\{\{ref\|/g) !== count(inp.body, /\{\{ref\|/g))) { failed++; return; }
      await db.prepare("INSERT OR IGNORE INTO item_tr(kind,item_id,lang,title,summary,body,src,created) VALUES(?,?,?,?,?,?,?,?)").bind(kind, r.id, to, out.title.slice(0, 140), String(out.summary || "").slice(0, 400), String(out.body || ""), "auto", t).run();
      done++;
    } catch (e) { if (e?.code === AI_BUDGET_ERROR) blocked++; else failed++; }
  }));
  await setMeta(db, "atr_count:" + day, used + done + failed);
  if (failed) await setMeta(db, "atr_err", `${failed} ${t}`);
  return { done, failed, open: Math.max(0, todo.length - room) + blocked };
}

// Blog: uebersetzte Fassungen als zusaetzliche Beitraege der Zielsprache (fuer /api/blog/export)
export async function translatedBlogItems(db) {
  try {
    const rows = (await db.prepare(
      `SELECT x.item_id,x.lang,x.title,x.summary,x.body,b.slug,b.lang src_lang,b.topics,b.created,b.published,b.updated,p.handle,u.name,(SELECT COUNT(*) FROM blog_votes v WHERE v.post_id=b.id) votes
       FROM item_tr x JOIN blog_posts b ON b.id=x.item_id AND b.status='live' JOIN profiles p ON p.user_id=b.user_id AND p.public=1 AND p.handle IS NOT NULL JOIN users u ON u.id=b.user_id AND u.banned=0
       WHERE x.kind='blog' ORDER BY b.published DESC LIMIT 2000`).all()).results || [];
    return rows.map((r) => ({ id: 1000000000 + r.item_id * 100 + Object.keys(LANGS).indexOf(r.lang), slug: r.slug, title: r.title, summary: r.summary, body: r.body, lang: r.lang, src_lang: r.src_lang, ai_tr: true,
      topics: JSON.parse(r.topics || "[]"), keypoints: [], faq: [], created: r.created, published: r.published, updated: r.updated, has_html: 0, handle: r.handle, name: r.name, votes: r.votes, coauthors: [] }));
  } catch { return []; }
}

// ---------- Entitaeten: Kurzbeschreibung (desc) und lange Beschreibung (long, enthaelt die Ueberschriften) in alle Sprachen ----------
// Quelle: Englisch (sonst Deutsch). Erst wenn ein Text seit 24 Stunden bekannt ist; Ergebnis in ent_tr (Seitenbau holt es ueber /api/entity/tr).
const SKIP_TYPES = ["person", "event", "org"], ENT_PER_RUN = 8, ENT_CAP = 300;
const ESYS = "You translate encyclopedia texts about Microsoft products and IT concepts. Translate the JSON values into the requested language and answer with the JSON object only, same keys. " +
  "Never translate names: product and feature names, event, person and company names, abbreviations and codes (e.g. Copilot Studio, Power Fx, MS-900, M365Con). Keep the structure exactly: paragraphs (blank lines), headings (== ... ==, ### ... or lines starting with #), lists, links and URLs. Keep tone and length. No commentary.";

export async function ensureEntTr(db) {
  await db.prepare("CREATE TABLE IF NOT EXISTS ent_tr (eid TEXT NOT NULL, field TEXT NOT NULL, lang TEXT NOT NULL, text TEXT NOT NULL, created INTEGER NOT NULL, PRIMARY KEY (eid, field, lang))").run();
  await db.prepare("CREATE TABLE IF NOT EXISTS ent_tr_seen (eid TEXT NOT NULL, field TEXT NOT NULL, first INTEGER NOT NULL, h TEXT NOT NULL DEFAULT '', PRIMARY KEY (eid, field))").run();
}

export async function autoTranslateEntities(env, entityMap) {
  const db = env.DB;
  if (!env.ANTHROPIC_API_KEY || (await meta(db, "atr_off")) === "1") return { skipped: true };
  await ensureEntTr(db);
  const day = new Date().toISOString().slice(0, 10), used = +(await meta(db, "atr_ent:" + day)) || 0, room = Math.min(ENT_PER_RUN, (+(await meta(db, "atr_ent_cap")) || ENT_CAP) - used);
  if (room <= 0) return { capped: true };
  const t = now(), map = await entityMap(env);
  const claimed = new Set(((await db.prepare("SELECT eid FROM entity_claims WHERE status='verified'").all()).results || []).map((r) => r.eid));
  const seen = new Map(((await db.prepare("SELECT eid,field,first,h FROM ent_tr_seen").all()).results || []).map((r) => [r.eid + "|" + r.field, r]));
  const have = new Set(((await db.prepare("SELECT eid,field,lang FROM ent_tr").all()).results || []).map((r) => r.eid + "|" + r.field + "|" + r.lang));
  const hash = (x) => { let h = 5381; for (let i = 0; i < x.length; i++) h = ((h << 5) + h + x.charCodeAt(i)) | 0; return String(h); };
  const jobs = [];
  for (const e of map.values()) {
    if (SKIP_TYPES.includes(e.type) || claimed.has(e.id) || e.outdated || e.replaced_by) continue;
    const src = {}; let from = "";
    for (const f of ["desc", "long"]) { const v = e[f] || {}; const txt = (v.en || "").trim() || (v.de || "").trim(); if (txt) { src[f] = txt.slice(0, 8000); from ||= (v.en || "").trim() ? "en" : "de"; } }
    if (!Object.keys(src).length) continue;
    for (const f of Object.keys(src)) {   // Text neu oder geaendert: Wartezeit beginnt von vorn
      const k = e.id + "|" + f, h = hash(src[f]), s = seen.get(k);
      if (!s || s.h !== h) { await db.prepare("INSERT INTO ent_tr_seen(eid,field,first,h) VALUES(?,?,?,?) ON CONFLICT(eid,field) DO UPDATE SET first=excluded.first,h=excluded.h").bind(e.id, f, t, h).run(); seen.set(k, { first: t, h }); if (s) await db.prepare("DELETE FROM ent_tr WHERE eid=? AND field=?").bind(e.id, f).run(); }
    }
    const due = Object.keys(src).filter((f) => t - seen.get(e.id + "|" + f).first >= WAIT);
    if (!due.length) continue;
    for (const to of Object.keys(LANGS)) { if (to === from) continue; const need = due.filter((f) => !have.has(e.id + "|" + f + "|" + to)); if (need.length) jobs.push({ id: e.id, to, from, inp: Object.fromEntries(need.map((f) => [f, src[f]])) }); }
    if (jobs.length >= room * 3) break;
  }
  let done = 0, failed = 0, blocked = 0;
  await Promise.all(jobs.slice(0, room).map(async (j) => {
    try {
      const out = await haikuJson(env, ESYS + ` Target language: ${LANGS[j.to]}.`, j.inp, { job: "worker_autotr_entities", lang: j.to });
      for (const f of Object.keys(j.inp)) {
        const o = String(out[f] || "").replace(/<script/gi, "").trim(), ratio = o.length / Math.max(1, j.inp[f].length);
        if (!o || ratio < 0.2 || ratio > 3 || (f === "desc" && o.length > 400)) { failed++; continue; }
        await db.prepare("INSERT OR IGNORE INTO ent_tr(eid,field,lang,text,created) VALUES(?,?,?,?,?)").bind(j.id, f, j.to, o, t).run(); done++;
      }
    } catch (e) { if (e?.code === AI_BUDGET_ERROR) blocked++; else failed++; }
  }));
  await setMeta(db, "atr_ent:" + day, used + Math.min(room, jobs.length) - blocked);
  return { done, failed, open: Math.max(0, jobs.length - room) + blocked };
}

export async function entityTranslations(db) {   // fuer /api/entity/tr: {eid: {field: {lang: text}}}
  try {
    const out = {};
    for (const r of (await db.prepare("SELECT eid,field,lang,text FROM ent_tr").all()).results || []) ((out[r.eid] ||= {})[r.field] ||= {})[r.lang] = r.text;
    return out;
  } catch { return {}; }
}


// ---------- Vormerkliste (Verwaltung -> Uebersetzungen): markierte Inhalte und Entitaeten mit Haiku uebersetzen, sobald der Schalter tr_queue_on=1 steht ----------
// Arten: blog/podcast/video (Community-Inhalte aus D1 -> item_tr), entity (desc/long -> ent_tr). Fruehere Blogbeitraege (lblog) und Show Notes (notes)
// uebersetzen die Python-Pipelines (translate_blog.py --queue, translate_notes.py); sie lesen dieselbe Liste ueber GET /api/tr-queue.
const QUEUE_PER_RUN = 6;
// Einen Inhalt in eine Sprache uebersetzen (Vormerkliste und Nachfrage) -> { ok, info }. Ein erreichtes Haiku-Tagesbudget wirft AI_BUDGET_ERROR.
// replace=false (Nachfrage): eine vorhandene Fassung bleibt stehen - einmal uebersetzen, nie ueberschreiben.
// live=true (Nachfrage, automatisch angelegt): nur Inhalte, die gerade erscheinen (KINDS[*].where); zurueckgezogene, versteckte oder abgelehnte kosten keinen Aufruf.
async function translateOne(env, q, getMap, t, { replace = true, live = false, src = "queue", itemJob = "worker_autotr_items", entJob = "worker_translation_queue" } = {}) {
  const db = env.DB, verb = replace ? "INSERT OR REPLACE" : "INSERT OR IGNORE";
  if (!LANGS[q.lang] && q.lang !== "en") return { ok: false, info: "unbekannte Sprache" };
  if (q.kind === "entity") {
    const e = (await getMap()).get(q.item_id);
    if (!e) return { ok: false, info: "Entitaet unbekannt" };
    const inp = {}; let from = "en";
    for (const f of ["desc", "long"]) { const v = e[f] || {}; const txt = (v.en || "").trim() || (v.de || "").trim(); if (txt) { inp[f] = txt.slice(0, 8000); from = (v.en || "").trim() ? "en" : "de"; } }
    if (!Object.keys(inp).length || q.lang === from) return { ok: false, info: "kein Quelltext" };
    const out = await haikuJson(env, ESYS + ` Target language: ${LANGS[q.lang] || "English"}.`, inp, { job: entJob, lang: q.lang }); let n = 0;
    for (const f of Object.keys(inp)) { const o = String(out[f] || "").replace(/<script/gi, "").trim(), ratio = o.length / Math.max(1, inp[f].length); if (!o || ratio < 0.2 || ratio > 3 || (f === "desc" && o.length > 400)) continue;
      await db.prepare(`${verb} INTO ent_tr(eid,field,lang,text,created) VALUES(?,?,?,?,?)`).bind(q.item_id, f, q.lang, o, t).run(); n++; }
    return n ? { ok: true, info: n + " Felder", call: true } : { ok: false, info: "Antwort unbrauchbar", call: true };
  }
  const K = KINDS[q.kind];
  if (!K) return { ok: false, info: "Art unbekannt" };
  const r = await db.prepare(`SELECT ${K.sel},(${K.where}) AS live_ok FROM ${K.table} WHERE id=?`).bind(+q.item_id).first();
  if (!r) return { ok: false, info: "Inhalt unbekannt" };
  if (live && !r.live_ok) return { ok: false, info: "nicht veröffentlicht" };
  const inp = {}; for (const f of K.f) inp[f] = String(r[f] || "").slice(0, f === "body" ? 12000 : 600);
  const out = await call(env, r.lang, q.lang, inp, itemJob);
  const bad = K.f.some((f) => inp[f] && typeof out[f] !== "string") || /<script/i.test(JSON.stringify(out));
  const lr = (out.body || "").length / Math.max(1, (inp.body || "").length);
  if (bad || (inp.body && (lr < 0.2 || lr > 3)) || (inp.body && count(out.body, /\{\{ref\|/g) !== count(inp.body, /\{\{ref\|/g))) return { ok: false, info: "Antwort unbrauchbar", call: true };
  await db.prepare(`${verb} INTO item_tr(kind,item_id,lang,title,summary,body,src,created) VALUES(?,?,?,?,?,?,?,?)`).bind(q.kind, +q.item_id, q.lang, String(out.title || "").slice(0, 140), String(out.summary || "").slice(0, 400), String(out.body || ""), src, t).run();
  return { ok: true, info: "", call: true };
}
const memo = (fn) => { let p = null; return () => (p ||= fn()); };

export async function runTrQueue(env, entityMap) {
  const db = env.DB;
  if (!env.ANTHROPIC_API_KEY || (await meta(db, "tr_queue_on")) !== "1") return { skipped: true };
  const day = new Date().toISOString().slice(0, 10), used = +(await meta(db, "atr_count:" + day)) || 0, room = Math.min(QUEUE_PER_RUN, DAILY_CAP - used);
  if (room <= 0) return { capped: true };
  let rows = [];
  try { rows = (await db.prepare("SELECT kind,item_id,lang,title FROM tr_queue WHERE status='open' AND kind IN ('blog','podcast','video','entity') ORDER BY created LIMIT ?").bind(room).all()).results || []; } catch { return { skipped: true }; }
  if (!rows.length) return { done: 0 };
  await ensureItemTr(db); await ensureEntTr(db);
  const t = now(), getMap = memo(() => entityMap(env)); let done = 0, failed = 0, blocked = 0;
  const mark = (r, st, info) => db.prepare("UPDATE tr_queue SET status=?,info=? WHERE kind=? AND item_id=? AND lang=?").bind(st, String(info || "").slice(0, 200), r.kind, r.item_id, r.lang).run();
  await Promise.all(rows.map(async (q) => {
    try {
      const r = await translateOne(env, q, getMap, t);
      await mark(q, r.ok ? "done" : "failed", r.info); if (r.ok) done++; else failed++;
    } catch (e) { if (e?.code === AI_BUDGET_ERROR) blocked++; else { await mark(q, "failed", String(e && e.message || e)); failed++; } }
  }));
  await setMeta(db, "atr_count:" + day, used + done + failed);
  return { done, failed, ...(blocked ? { capped: true, open: blocked } : {}) };
}

// ---------- Uebersetzung auf Nachfrage (Issue #156): tr_demand aus der Suche (search_demand.js), meistgesucht zuerst, auch aeltere Inhalte ----------
// Nur Community-Inhalte der Datenbank (blog, podcast, video) und Entitaeten; Ergebnis in item_tr/ent_tr (Blog mit KI-Hinweis wie bisher), nie ueber eine
// vorhandene Fassung. Jeder Haiku-Aufruf zaehlt gegen das Tagesbudget (util.js aiBudgetStatus/anthropicFetch) und die Tagesgrenze DAILY_CAP; ist das Budget
// erreicht, wartet die Warteschlange (status waiting_budget) bis zum naechsten Tag - es geht nichts verloren. Notaus wie bei den uebrigen: meta atr_off=1.
// Fehler: unbrauchbare Antwort (JSON kaputt, Laenge/Markup falsch) und API-Fehler 4xx sind bleibend -> sofort failed, wie in runTrQueue. Nur Netzfehler,
// 429 und 5xx bleiben offen, hoechstens DEMAND_TRIES Versuche (Spalte tries): sonst fraesse ein meistgesuchter Problemfall alle 30 Minuten einen bezahlten
// Aufruf und die gemeinsame Tagesgrenze DAILY_CAP, und autoTranslateItems/runTrQueue kaemen nicht mehr dran.
const DEMAND_PER_RUN = 4, DEMAND_TRIES = 3, DEMAND_KINDS = ["blog", "podcast", "video", "entity"];
const transient = (e) => /^(?:Claude API request failed|api (?:408|409|429|5\d\d))$/.test(String(e?.message || ""));
export async function runTrDemand(env, entityMap) {
  const db = env.DB, IN = DEMAND_KINDS.map(() => "?").join(",");
  if (!env.ANTHROPIC_API_KEY || (await meta(db, "atr_off")) === "1") return { skipped: true };
  let rows = [];
  try { rows = (await db.prepare(`SELECT kind,item,lang,tries FROM tr_demand WHERE status IN ('open','waiting_budget') AND kind IN (${IN}) ORDER BY searches DESC,days DESC,last_seen DESC,item LIMIT ?`).bind(...DEMAND_KINDS, DEMAND_PER_RUN).all()).results || []; } catch { return { skipped: true }; }
  if (!rows.length) return { done: 0 };
  const wait = () => db.prepare(`UPDATE tr_demand SET status='waiting_budget' WHERE status='open' AND kind IN (${IN})`).bind(...DEMAND_KINDS).run();
  if (!(await aiBudgetStatus(env)).allowed) { await wait(); return { waiting_budget: true }; }
  const day = new Date().toISOString().slice(0, 10), used = +(await meta(db, "atr_count:" + day)) || 0, room = Math.min(DEMAND_PER_RUN, DAILY_CAP - used);
  if (room <= 0) return { capped: true };
  await ensureItemTr(db); await ensureEntTr(db);
  const t = now(), getMap = memo(() => entityMap(env)); let done = 0, failed = 0, blocked = 0, skipped = 0, calls = 0;
  const mark = (r, st, info = "", tries = 0) => db.prepare("UPDATE tr_demand SET status=?,info=?,tries=tries+? WHERE kind=? AND item=? AND lang=?").bind(st, String(info).slice(0, 200), tries, r.kind, r.item, r.lang).run();
  for (const r of rows.slice(0, room)) {   // nacheinander: ein erreichtes Budget haelt die folgenden an, statt sie parallel anzustossen
    const have = r.kind === "entity" ? await db.prepare("SELECT 1 x FROM ent_tr WHERE eid=? AND lang=? LIMIT 1").bind(r.item, r.lang).first()
      : await db.prepare("SELECT 1 x FROM item_tr WHERE kind=? AND item_id=? AND lang=?").bind(r.kind, +r.item, r.lang).first();
    if (have) { await mark(r, "translated"); skipped++; continue; }   // inzwischen anders uebersetzt (Handtext, Vormerkliste, 24-Stunden-Lauf): kein Aufruf
    if (blocked) { await mark(r, "waiting_budget"); continue; }
    try {
      const x = await translateOne(env, { kind: r.kind, item_id: r.item, lang: r.lang }, getMap, t, { replace: false, live: true, src: "demand", itemJob: "worker_translation_demand", entJob: "worker_translation_demand" });
      await mark(r, x.ok ? "translated" : "failed", x.info, x.call ? 1 : 0); if (x.ok) done++; else failed++; if (x.call) calls++;
    } catch (e) {
      if (e?.code === AI_BUDGET_ERROR) { blocked++; await mark(r, "waiting_budget"); }
      else { failed++; calls++; await mark(r, transient(e) && (r.tries || 0) + 1 < DEMAND_TRIES ? "open" : "failed", String(e && e.message || e), 1); }   // nur voruebergehende Fehler: naechster Lauf
    }
  }
  if (blocked) await wait();
  await setMeta(db, "atr_count:" + day, used + calls);   // nur echte Aufrufe (ohne Aufruf: nicht veroeffentlicht, unbekannt, schon uebersetzt)
  return { done, failed, ...(skipped ? { already: skipped } : {}), ...(blocked ? { waiting_budget: true } : {}) };
}
