// Lernpfad-Abschlusstest + Zertifikat ueber Certopus (Spezifikation Teil B, Mirko 24.11.2026).
// Die Fragen (ohne Antworten) stehen oeffentlich in data/pillar_quiz.json (Seitenbau); die Antwortschluessel nur hier in D1 (learn_quiz_keys),
// eingespielt von tools/pillar_quiz.py push ueber POST /api/internal/learn-quiz (CRON_KEY). Antworten verlassen den Worker nur nach einer Abgabe.
//   POST /api/learn/quiz/start   {path, lang, src, have}  Login; 3 Fragen je Leitfaden (nur Fragen, die die Seite kennt: pageFilter), hoechstens 3 Versuche je 24 h (Nutzer und Pfad), ein Versuch gilt 24 h
//   POST /api/learn/quiz/submit  {attempt, answers}        Login; zaehlen, speichern, Ergebnis mit Erklaerungen (Sprache des Versuchs)
//   GET  /api/learn/cert?path=                            Login; Stand (bestanden, bester Versuch, Zertifikat) und Vorschlag fuer Name/E-Mail
//   POST /api/learn/cert         {path, attempt, name, email, consent, lang}   Zertifikat ueber Certopus (nur mit CERTOPUS_ON=1, Schluessel und IDs)
//                                Name 2-80 Zeichen ohne Link, Domain, @ oder /; E-Mail: mit bestaetigter Adresse (mail_addr) nur diese (400 email_unverified),
//                                sonst frei, hoechstens 2 verschiedene je Nutzer und Pfad (400 email_limit)
//   GET  /api/learn/stats?path=                           nur Admin: gestartet/abgegeben/bestanden/Zertifikate je Herkunft (src) und Woche
//   POST /api/internal/learn-quiz {path, keys:[...]}       CRON_KEY: je Pfad massgeblich - uebermittelte Schluessel upserten (active=1), alle anderen
//                                                         Fragen des Pfads stilllegen (active=0, keine Loeschung: offene Versuche bleiben wertbar, IDs bleiben vergeben)
// Certopus-Konfiguration je Pfad in der Var CERTOPUS_PATHS (JSON {pfad: {org, event, category, course:{en,de}}}), Secret CERTOPUS_API_KEY,
// Notschalter CERTOPUS_ON ("1" = an). Ohne all das: Test laeuft, das Zertifikat bleibt "pending" (503 cert_off) und wird spaeter ausgestellt
// (erneuter Klick oder Cron issuePendingCerts, sobald CERTOPUS_ON=1).
import { cleanText, rateLimit, randomToken } from "./util.js";
import { isStaging } from "./staging.js";

export const PER_PILLAR = 3, PASS_PCT = 80, MAX_ATTEMPTS = 3, ATTEMPT_TTL = 86400;
export const CERTOPUS_API = "https://api.certopus.com/v1";
export const DEFAULT_FIELDS = { name: "{Name}", course: "{Course}", score: "{Score}", date: "{Date}" };
// Kursname je Sprache, wenn CERTOPUS_PATHS ihn nicht nennt (Event-Titel bei Certopus)
export const COURSE = {
  "manufacturing-excellence": {
    en: "Manufacturing Excellence: From Lean Basics to Digital Production Planning",
    de: "Manufacturing Excellence: von den Lean-Grundlagen zur digitalen Produktionsplanung",
  },
};
const PATH_RX = /^[a-z0-9][a-z0-9-]{1,60}$/;
const QID_RX = /^[a-z0-9][a-z0-9-]{1,80}-[0-9]{1,3}$/;
const EMAIL_RX = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,190}\.[a-z]{2,}$/i;
// Name auf dem Zertifikat: keine Links, Domains oder Adressen (Certopus druckt ihn, das Zertifikat ist oeffentlich)
export const NAME_URL_RX = /https?:|www\.|[@/]|\.[a-z]{2,}(\/|$)/i;
export const MAX_FREE_EMAILS = 2;   // ohne bestaetigte Adresse: hoechstens so viele verschiedene Empfaenger je Nutzer und Pfad
const now = () => Math.floor(Date.now() / 1000);
export const quizLang = (l) => (String(l || "").toLowerCase() === "de" ? "de" : "en");   // Test gibt es auf en und de, alles andere faellt auf en zurueck
export const threshold = (total) => Math.ceil((total * PASS_PCT) / 100);
const rlKey = (uid, path) => `learnq:${uid}:${path}`;
const parse = (s, d) => { try { const v = JSON.parse(s); return v ?? d; } catch { return d; } };
const httpsUrl = (u) => { try { const x = new URL(String(u || "")); return x.protocol === "https:" ? x.href : ""; } catch { return ""; } };

function randInt(n) { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; }
function pick(list, k) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = randInt(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, k);
}

// Konfiguration je Pfad aus CERTOPUS_PATHS; null = Pfad hat keine Certopus-Zuordnung
export function certConfig(env, path) {
  const all = parse(env.CERTOPUS_PATHS || "{}", {});
  const c = all && typeof all === "object" ? all[path] : null;
  const course = { ...(COURSE[path] || {}), ...(c && typeof c.course === "object" ? c.course : {}) };
  if (!c || typeof c !== "object") return { org: "", event: "", category: "", course };
  return { org: String(c.org || ""), event: String(c.event || ""), category: String(c.category || ""), course };
}
export const certReady = (env, cfg) => env.CERTOPUS_ON === "1" && !!String(env.CERTOPUS_API_KEY || "").trim() && !!cfg && !!cfg.org && !!cfg.event && !!cfg.category && !isStaging(env);
export const courseName = (cfg, path, lang) => (cfg?.course?.[lang] || cfg?.course?.en || path);

export function linkedinUrl(course, certUrl, certId, ts) {
  const d = new Date((ts || now()) * 1000);
  const q = new URLSearchParams({ startTask: "CERTIFICATION_NAME", name: course, organizationName: "M365.FM", issueYear: String(d.getUTCFullYear()), issueMonth: String(d.getUTCMonth() + 1), certUrl, certId });
  return "https://www.linkedin.com/profile/add?" + q.toString();
}
export const scoreText = (score, total) => `${score}/${total} (${total ? Math.round((score * 100) / total) : 0} %)`;
export function dateText(ts, lang) {
  const d = new Date(ts * 1000), p = (n) => String(n).padStart(2, "0");
  return lang === "de" ? `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}` : `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`;
}

async function attemptsLeft(db, uid, path) {
  const r = await db.prepare("SELECT n, win FROM ratelimit WHERE k=?").bind(rlKey(uid, path)).first();
  if (!r || now() - r.win >= ATTEMPT_TTL) return MAX_ATTEMPTS;
  return Math.max(0, MAX_ATTEMPTS - r.n);
}

// Platzhalter der Certopus-Vorlage (GET /recipient_fields, Antwort {data:[{key,label,type}]}); 1 h im Speicher, 6 h in meta. null = unbekannt
const fieldMem = new Map();
async function templateKeys(env, cfg) {
  const ck = `certopus_fields:${cfg.org}|${cfg.event}|${cfg.category}`, t = now();
  const m = fieldMem.get(ck);
  if (m && t - m.at < 3600) return new Set(m.keys);
  const row = await env.DB.prepare("SELECT v FROM meta WHERE k=?").bind(ck).first().catch(() => null);
  const cached = row ? parse(row.v, null) : null;
  if (cached && Array.isArray(cached.keys) && t - Number(cached.at || 0) < 6 * 3600) { fieldMem.set(ck, cached); return new Set(cached.keys); }
  try {
    const q = new URLSearchParams({ organisationId: cfg.org, eventId: cfg.event, categoryId: cfg.category });
    const r = await fetch(`${CERTOPUS_API}/recipient_fields?${q}`, { headers: { "x-api-key": String(env.CERTOPUS_API_KEY).trim(), accept: "application/json" } });
    if (!r.ok) return null;
    const j = await r.json().catch(() => null);
    const list = Array.isArray(j?.data) ? j.data : Array.isArray(j) ? j : [];
    const keys = list.map((f) => (typeof f === "string" ? f : f?.key)).filter((k) => typeof k === "string" && k);
    const val = { at: t, keys };
    fieldMem.set(ck, val);
    await env.DB.prepare("INSERT OR REPLACE INTO meta(k,v) VALUES(?,?)").bind(ck, JSON.stringify(val)).run().catch(() => 0);
    return new Set(keys);
  } catch { return null; }
}

// Felder fuer data{} des Empfaengers: Var CERTOPUS_FIELDS (JSON, ausdruecklich gesetzt) gilt wie angegeben; sonst nur die Standardfelder,
// die die Vorlage laut recipient_fields kennt; ist das unbekannt, nur der Name ({Name} hat die Vorlage sicher).
export async function recipientData(env, cfg, vals) {
  let map = DEFAULT_FIELDS, explicit = false;
  if (String(env.CERTOPUS_FIELDS || "").trim()) {
    const m = parse(env.CERTOPUS_FIELDS, null);
    if (m && typeof m === "object" && !Array.isArray(m)) { map = m; explicit = true; }
  }
  const allowed = explicit ? null : await templateKeys(env, cfg);
  const data = {};
  for (const [k, tpl] of Object.entries(map)) {
    if (!tpl || typeof tpl !== "string" || vals[k] === undefined) continue;
    if (!explicit && (allowed ? !allowed.has(tpl) : k !== "name")) continue;
    data[tpl] = String(vals[k]);
  }
  return data;
}

const scrub = (env, s) => {
  let t = String(s || "");
  const key = String(env.CERTOPUS_API_KEY || "").trim();
  if (key) t = t.split(key).join("***");
  return t.replace(/\s+/g, " ").slice(0, 300);
};

// Ein Zertifikat bei Certopus anlegen. -> {ok, id, url, pdf} oder {ok:false, error} (Fehlertext ohne Schluessel)
export async function certopusIssue(env, cfg, email, data) {
  const body = { organisationId: cfg.org, eventId: cfg.event, categoryId: cfg.category, generate: true, publish: true, recipients: [{ email, data }] };
  let r;
  try {
    r = await fetch(`${CERTOPUS_API}/certificates`, { method: "POST", headers: { "x-api-key": String(env.CERTOPUS_API_KEY).trim(), "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(body) });
  } catch (e) { return { ok: false, error: scrub(env, "network: " + (e?.message || e)) }; }
  const text = await r.text().catch(() => "");
  const j = parse(text, null);
  const res = (Array.isArray(j?.responses) ? j.responses : Array.isArray(j?.data?.responses) ? j.data.responses : [])[0] || {};
  if (!r.ok || !res.certificateId) {
    const msg = res.message || res.error || j?.message || j?.error || text;
    return { ok: false, error: scrub(env, `HTTP ${r.status}: ${typeof msg === "string" ? msg : JSON.stringify(msg)}`) };
  }
  return { ok: true, id: String(res.certificateId).slice(0, 120), url: httpsUrl(res.certificateUrl), pdf: httpsUrl(res.pdfUrl) };
}

// Zertifikat fuer eine Zeile aus learn_certs ausstellen (Anfrage oder Cron). Belegt die Zeile vorher (status issuing), damit nie zwei Anfragen
// gleichzeitig ein Zertifikat anlegen. -> {status: ok|error|busy, ...}
async function issueRow(env, cert, cfg) {
  const db = env.DB, t = now();
  const claim = await db.prepare("UPDATE learn_certs SET status='issuing',updated=? WHERE user_id=? AND path=? AND (status IN ('pending','error') OR (status='issuing' AND updated<?))")
    .bind(t, cert.user_id, cert.path, t - 120).run();
  if (!claim?.meta?.changes) return { status: "busy" };
  const a = await db.prepare("SELECT score,total,finished FROM learn_attempts WHERE id=?").bind(cert.attempt_id).first();
  const lang = quizLang(cert.lang), course = courseName(cfg, cert.path, lang);
  const data = await recipientData(env, cfg, { name: cert.name, course, score: scoreText(a?.score || 0, a?.total || 0), date: dateText(a?.finished || t, lang) });
  const res = await certopusIssue(env, cfg, cert.email, data);
  if (!res.ok) {
    await db.prepare("UPDATE learn_certs SET status='error',error=?,updated=? WHERE user_id=? AND path=?").bind(res.error, now(), cert.user_id, cert.path).run();
    console.error("certopus", cert.path, res.error);
    return { status: "error", error: res.error };
  }
  const done = now();
  await db.prepare("UPDATE learn_certs SET status='ok',certopus_id=?,cert_url=?,pdf_url=?,error='',updated=? WHERE user_id=? AND path=?")
    .bind(res.id, res.url, res.pdf, done, cert.user_id, cert.path).run();
  return { status: "ok", id: res.id, url: res.url, pdf: res.pdf, linkedin: linkedinUrl(course, res.url, res.id, done) };
}

const certOut = (c, cfg) => (c.status === "ok"
  ? { status: "ok", url: c.cert_url, pdf: c.pdf_url, id: c.certopus_id, linkedin: linkedinUrl(courseName(cfg, c.path, quizLang(c.lang)), c.cert_url, c.certopus_id, c.updated || c.created) }
  : { status: c.status === "issuing" ? "pending" : c.status });

// Cron (*/30, nur mit CERTOPUS_ON=1): wartende Zertifikate nachtraeglich ausstellen. Fehler bleiben bis zum naechsten Klick des Nutzers stehen.
// Nur Pfade mit vollstaendiger Certopus-Konfiguration: wartende Zeilen eines noch nicht eingerichteten Pfads belegen sonst dauerhaft die ersten Plaetze.
// Haengengebliebene Zeilen (status issuing seit ueber 2 Minuten, Worker waehrend des Certopus-Aufrufs beendet) nimmt der Cron wieder auf.
export async function issuePendingCerts(env, limit = 5) {
  if (env.CERTOPUS_ON !== "1" || !String(env.CERTOPUS_API_KEY || "").trim()) return { skipped: "aus" };
  const all = parse(env.CERTOPUS_PATHS || "{}", {});
  const ready = (all && typeof all === "object" && !Array.isArray(all) ? Object.keys(all) : []).filter((p) => PATH_RX.test(p) && certReady(env, certConfig(env, p))).slice(0, 50);
  if (!ready.length) return { skipped: "keine_pfade" };
  const rows = (await env.DB.prepare(`SELECT * FROM learn_certs WHERE path IN (${ready.map(() => "?").join(",")}) AND (status='pending' OR (status='issuing' AND updated<?)) ORDER BY created LIMIT ?`)
    .bind(...ready, now() - 120, limit).all()).results || [];
  const out = { ok: 0, error: 0, skipped: 0 };
  for (const c of rows) {
    const cfg = certConfig(env, c.path);
    const r = await issueRow(env, c, cfg);
    if (r.status === "ok") out.ok++; else if (r.status === "error") out.error++; else out.skipped++;
  }
  return out;
}

export async function deleteUserLearn(db, uid) {   // Konto loeschen: Versuche und Zertifikat-Zeilen (Name, E-Mail). Bei Certopus ausgestellte Zertifikate bleiben dort.
  await db.prepare("DELETE FROM learn_attempts WHERE user_id=?").bind(uid).run().catch(() => 0);
  await db.prepare("DELETE FROM learn_certs WHERE user_id=?").bind(uid).run().catch(() => 0);
}

async function internalUpsert(env, request, J) {
  if (request.method !== "POST") return J({ error: "method_not_allowed" }, 405);
  if (!env.CRON_KEY || request.headers.get("x-cron-key") !== env.CRON_KEY) return J({ error: "forbidden" }, 403);
  const b = await request.json().catch(() => null);
  const path = String(b?.path || "");
  if (!PATH_RX.test(path) || !Array.isArray(b?.keys) || !b.keys.length || b.keys.length > 1000) return J({ error: "bad_request" }, 400);
  const t = now(), stmts = [], bad = [];
  for (const k of b.keys) {
    const qid = String(k?.qid || ""), pillar = String(k?.pillar || ""), answer = k?.answer;
    if (!QID_RX.test(qid) || !PATH_RX.test(pillar) || !qid.startsWith(pillar + "-") || !Number.isInteger(answer) || answer < 0 || answer > 3) { bad.push(qid.slice(0, 90)); continue; }
    stmts.push(env.DB.prepare("INSERT INTO learn_quiz_keys(qid,path,pillar,answer,why_en,why_de,updated,active) VALUES(?,?,?,?,?,?,?,1) ON CONFLICT(qid) DO UPDATE SET path=excluded.path,pillar=excluded.pillar,answer=excluded.answer,why_en=excluded.why_en,why_de=excluded.why_de,updated=excluded.updated,active=1")
      .bind(qid, path, pillar, answer, cleanText(k.why_en, 1200), cleanText(k.why_de, 1200), t));
  }
  if (bad.length) return J({ error: "bad_keys", bad: bad.slice(0, 20), count: bad.length }, 400);   // alles oder nichts: ein halber Schluessel waere schlimmer
  const qids = JSON.stringify(b.keys.map((k) => String(k.qid)));   // ein Parameter statt einer IN-Liste (D1: hoechstens 100 Parameter je Anweisung)
  const off = await env.DB.prepare("SELECT COUNT(*) n FROM learn_quiz_keys WHERE path=? AND active=1 AND qid NOT IN (SELECT value FROM json_each(?))").bind(path, qids).first();
  stmts.push(env.DB.prepare("UPDATE learn_quiz_keys SET active=0, updated=? WHERE path=? AND active=1 AND qid NOT IN (SELECT value FROM json_each(?))").bind(t, path, qids));
  for (let i = 0; i < stmts.length; i += 50) await env.DB.batch(stmts.slice(i, i + 50));   // Stilllegen zuletzt: bricht vorher etwas ab, bleibt der alte Satz aktiv
  const n = await env.DB.prepare("SELECT COUNT(*) n, COUNT(DISTINCT pillar) p FROM learn_quiz_keys WHERE path=? AND active=1").bind(path).first();
  return J({ ok: true, upserted: stmts.length - 1, deactivated: off?.n || 0, total: n?.n || 0, pillars: n?.p || 0 });
}

// Nur Fragen ziehen, die die Seite zeigen kann: have = IDs aus dem eingebetteten data/pillar_quiz.json der Testseite. Schluessel kommen teils vor dem
// naechsten Seitenbau in D1 (neuer Leitfaden, gewachsener Pool); solche Fragen waeren auf der Seite nicht beantwortbar und zaehlten als falsch.
// Die Liste kommt vom Browser, darf den Test also nicht beliebig verkleinern: Ein Leitfaden faellt nur weg, wenn die Seite keine seiner Fragen kennt,
// und hoechstens ein Fuenftel der Leitfaeden darf so fehlen. Innerhalb eines Leitfadens gilt die Auswahl der Seite nur, wenn sie mindestens
// HAVE_MIN (bzw. alle) seiner Fragen kennt - sonst der ganze Pool. Fehlt have (aeltere Seite im Cache), gilt der ganze Pool wie bisher.
export const HAVE_MAX = 500, HAVE_MIN = PER_PILLAR + 1, HAVE_PILLAR_PCT = 80;
export function pageFilter(groups, have) {
  if (!Array.isArray(have)) return groups;
  const hv = new Set(have.slice(0, HAVE_MAX).map((q) => String(q)).filter((q) => q.length <= 90 && QID_RX.test(q)));
  const out = new Map();
  for (const [p, l] of groups) {
    const x = l.filter((q) => hv.has(q));
    if (!x.length) continue;   // Leitfaden kennt die Seite (noch) nicht
    out.set(p, x.length >= Math.min(l.length, HAVE_MIN) ? x : l);
  }
  return out.size && out.size >= Math.ceil((groups.size * HAVE_PILLAR_PCT) / 100) ? out : groups;   // zu viel fehlt: veraltete oder manipulierte Liste -> ganzer Pool
}

async function start(env, request, user, J) {
  const db = env.DB, b = await request.json().catch(() => ({}));
  const path = String(b.path || ""), lang = quizLang(b.lang);
  if (!PATH_RX.test(path)) return J({ error: "bad_path" }, 400);
  const t = now();
  // Offener, noch gueltiger Versuch: denselben zurueckgeben (Neuladen der Seite kostet keinen Versuch)
  const open = await db.prepare("SELECT id,qids,started FROM learn_attempts WHERE user_id=? AND path=? AND finished=0 AND started>? ORDER BY started DESC LIMIT 1").bind(user.id, path, t - ATTEMPT_TTL).first();
  if (open) {
    if (b.lang) await db.prepare("UPDATE learn_attempts SET lang=? WHERE id=?").bind(lang, open.id).run();
    const qids = parse(open.qids, []);
    return J({ attempt: open.id, qids, expires: open.started + ATTEMPT_TTL, total: qids.length, threshold: threshold(qids.length), resumed: true, attempts_left: await attemptsLeft(db, user.id, path) });
  }
  const keys = (await db.prepare("SELECT qid,pillar FROM learn_quiz_keys WHERE path=? AND active=1 ORDER BY pillar,qid").bind(path).all()).results || [];
  const by = new Map();
  for (const k of keys) by.set(k.pillar, [...(by.get(k.pillar) || []), k.qid]);
  const groups = pageFilter(by, b.have);
  if (!groups.size) return J({ error: "no_quiz" }, 404);
  if (!(await rateLimit(db, rlKey(user.id, path), MAX_ATTEMPTS, ATTEMPT_TTL))) return J({ error: "rate_limit", attempts_left: 0 }, 429);
  const qids = [...groups.values()].flatMap((l) => pick(l, PER_PILLAR));
  const id = randomToken(16);
  const src = String(b.src || "").toLowerCase().replace(/[^a-z0-9._:/-]/g, "").slice(0, 40);
  await db.prepare("INSERT INTO learn_attempts(id,user_id,path,lang,qids,started,src) VALUES(?,?,?,?,?,?,?)").bind(id, user.id, path, lang, JSON.stringify(qids), t, src).run();
  return J({ attempt: id, qids, expires: t + ATTEMPT_TTL, total: qids.length, threshold: threshold(qids.length), attempts_left: await attemptsLeft(db, user.id, path) });
}

async function submit(env, request, user, J) {
  const db = env.DB, b = await request.json().catch(() => ({}));
  const id = String(b.attempt || "");
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(id)) return J({ error: "bad_attempt" }, 400);
  const a = await db.prepare("SELECT * FROM learn_attempts WHERE id=?").bind(id).first();
  if (!a) return J({ error: "not_found" }, 404);
  if (a.user_id !== user.id) return J({ error: "forbidden" }, 403);
  if (a.finished) return J({ error: "already_submitted" }, 409);
  if (now() - a.started > ATTEMPT_TTL) return J({ error: "expired" }, 410);
  const answers = b.answers && typeof b.answers === "object" && !Array.isArray(b.answers) ? b.answers : {};
  const qids = parse(a.qids, []);
  const ph = qids.map(() => "?").join(",");
  const keyRows = qids.length ? (await db.prepare(`SELECT qid,pillar,answer,why_en,why_de FROM learn_quiz_keys WHERE qid IN (${ph})`).bind(...qids).all()).results || [] : [];
  const keys = new Map(keyRows.map((k) => [k.qid, k]));
  const lang = quizLang(a.lang), perPillar = {}, results = [], chosen = {};
  let score = 0, total = 0;
  for (const qid of qids) {
    const k = keys.get(qid);
    if (!k) continue;   // Schluessel fehlt (nie eingespielt): zaehlt nicht. Stillgelegte Fragen (active=0) haben ihren Schluessel noch und werden gewertet.
    const v = answers[qid], pickd = Number.isInteger(v) && v >= 0 && v <= 3 ? v : null, ok = pickd === k.answer;
    total++; if (ok) score++;
    chosen[qid] = pickd;
    const pp = perPillar[k.pillar] || (perPillar[k.pillar] = { ok: 0, n: 0 });
    pp.n++; if (ok) pp.ok++;
    results.push({ qid, pillar: k.pillar, ok, chosen: pickd, correct: k.answer, why: (lang === "de" ? k.why_de : k.why_en) || k.why_en || "" });
  }
  const need = threshold(total), passed = total > 0 && score >= need ? 1 : 0, t = now();
  const r = await db.prepare("UPDATE learn_attempts SET finished=?,score=?,total=?,passed=?,detail=? WHERE id=? AND user_id=? AND finished=0")
    .bind(t, score, total, passed, JSON.stringify({ answers: chosen, per_pillar: perPillar }), id, user.id).run();
  if (!r?.meta?.changes) return J({ error: "already_submitted" }, 409);   // gleichzeitige zweite Abgabe
  return J({ attempt: id, score, total, passed: !!passed, threshold: need, threshold_pct: PASS_PCT, per_pillar: perPillar, results, attempts_left: await attemptsLeft(db, user.id, a.path) });
}

async function certStatus(env, url, user, J) {
  const db = env.DB, path = String(url.searchParams.get("path") || "");
  if (!PATH_RX.test(path)) return J({ error: "bad_path" }, 400);
  const cfg = certConfig(env, path), t = now();
  const best = await db.prepare("SELECT id,score,total,passed,finished FROM learn_attempts WHERE user_id=? AND path=? AND finished>0 ORDER BY passed DESC,score DESC,finished DESC LIMIT 1").bind(user.id, path).first();
  const open = await db.prepare("SELECT id,qids,started FROM learn_attempts WHERE user_id=? AND path=? AND finished=0 AND started>? ORDER BY started DESC LIMIT 1").bind(user.id, path, t - ATTEMPT_TTL).first();
  const cert = await db.prepare("SELECT * FROM learn_certs WHERE user_id=? AND path=?").bind(user.id, path).first();
  const pref = await db.prepare("SELECT real_name FROM user_prefs WHERE user_id=?").bind(user.id).first().catch(() => null);
  const verified = await verifiedEmails(db, user.id);
  const keys = await db.prepare("SELECT COUNT(*) n FROM learn_quiz_keys WHERE path=? AND active=1").bind(path).first();
  return J({
    path, quiz_ready: (keys?.n || 0) > 0, passed: !!best?.passed,
    best: best ? { attempt: best.id, score: best.score, total: best.total, passed: !!best.passed, finished: best.finished } : null,
    open: open ? { attempt: open.id, qids: parse(open.qids, []), expires: open.started + ATTEMPT_TTL } : null,
    cert: cert ? certOut(cert, cfg) : null,
    name: cert?.name || String(pref?.real_name || "").trim() || user.name || "",
    email: (verified.length ? (verified.includes(cert?.email) ? cert.email : verified[0]) : cert?.email) || "", email_verified: verified.length > 0,
    cert_on: certReady(env, cfg), attempts_left: await attemptsLeft(db, user.id, path), threshold_pct: PASS_PCT, max_attempts: MAX_ATTEMPTS,
  });
}

// Bestaetigte Adressen des Kontos (mail_addr, verified=1; heute hoechstens eine je Konto), klein geschrieben
async function verifiedEmails(db, uid) {
  const rows = (await db.prepare("SELECT email FROM mail_addr WHERE user_id=? AND verified=1").bind(uid).all().catch(() => null))?.results || [];
  return [...new Set(rows.map((r) => String(r.email || "").trim().toLowerCase()).filter(Boolean))];
}

async function certRequest(env, request, user, J) {
  const db = env.DB, b = await request.json().catch(() => ({}));
  const path = String(b.path || "");
  if (!PATH_RX.test(path)) return J({ error: "bad_path" }, 400);
  const cfg = certConfig(env, path);
  const have = await db.prepare("SELECT * FROM learn_certs WHERE user_id=? AND path=?").bind(user.id, path).first();
  if (have?.status === "ok") return J({ ...certOut(have, cfg), existing: true });   // ein Zertifikat je Nutzer und Pfad
  const a = await db.prepare("SELECT id,user_id,path,passed FROM learn_attempts WHERE id=?").bind(String(b.attempt || "")).first();
  if (!a) return J({ error: "not_found" }, 404);
  if (a.user_id !== user.id) return J({ error: "forbidden" }, 403);
  if (a.path !== path || !a.passed) return J({ error: "not_passed" }, 409);
  if (b.consent !== true) return J({ error: "consent" }, 400);
  const name = cleanText(b.name, 200).replace(/\s+/g, " ").replace(/[<>]/g, "").trim();
  if (name.length < 2 || name.length > 80) return J({ error: "name" }, 400);
  if (NAME_URL_RX.test(name)) return J({ error: "name_url" }, 400);
  const email = String(b.email || "").trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RX.test(email)) return J({ error: "email" }, 400);
  // Empfaenger: Mit bestaetigter Adresse nur diese (sonst liesse sich das Zertifikat an Fremde schicken); ohne frei, aber hoechstens
  // MAX_FREE_EMAILS verschiedene je Nutzer und Pfad (learn_certs.emails merkt sich die bisher genutzten)
  const verified = await verifiedEmails(db, user.id);
  if (verified.length && !verified.includes(email)) return J({ error: "email_unverified" }, 400);
  const used = parse(have?.emails || "[]", []).filter((x) => typeof x === "string");
  if (!verified.length && !used.includes(email) && used.length >= MAX_FREE_EMAILS) return J({ error: "email_limit", max: MAX_FREE_EMAILS }, 400);
  const emails = JSON.stringify(used.includes(email) ? used : [...used, email]);
  if (!(await rateLimit(db, `learncert:${user.id}`, 5, 3600))) return J({ error: "rate_limit" }, 429);
  const lang = quizLang(b.lang), t = now();
  await db.prepare("INSERT INTO learn_certs(user_id,path,attempt_id,name,email,emails,lang,status,created,updated) VALUES(?,?,?,?,?,?,?,'pending',?,?) " +
    "ON CONFLICT(user_id,path) DO UPDATE SET attempt_id=excluded.attempt_id,name=excluded.name,email=excluded.email,emails=excluded.emails,lang=excluded.lang,status='pending',error='',updated=excluded.updated WHERE learn_certs.status IN ('pending','error')")
    .bind(user.id, path, a.id, name, email, emails, lang, t, t).run();
  if (!certReady(env, cfg)) return J({ error: "cert_off", status: "pending" }, 503);
  const row = await db.prepare("SELECT * FROM learn_certs WHERE user_id=? AND path=?").bind(user.id, path).first();
  if (row?.status === "ok") return J({ ...certOut(row, cfg), existing: true });
  const res = await issueRow(env, row, cfg);
  if (res.status === "ok") return J({ status: "ok", url: res.url, pdf: res.pdf, id: res.id, linkedin: res.linkedin });
  if (res.status === "busy") return J({ error: "busy", status: "pending" }, 409);
  return J({ error: "cert_failed", status: "error", detail: res.error }, 502);
}

async function stats(env, url, user, J) {
  if (!user.admin) return J({ error: "forbidden" }, 403);
  const path = String(url.searchParams.get("path") || "");
  if (path && !PATH_RX.test(path)) return J({ error: "bad_path" }, 400);
  const where = path ? "WHERE a.path=?" : "", args = path ? [path] : [];
  const rows = (await env.DB.prepare(
    "SELECT strftime('%Y-W%W', a.started, 'unixepoch') week, a.src, COUNT(*) started, SUM(CASE WHEN a.finished>0 THEN 1 ELSE 0 END) submitted, " +
    "SUM(a.passed) passed, SUM(CASE WHEN c.status='ok' THEN 1 ELSE 0 END) certs, COUNT(DISTINCT a.user_id) users " +
    `FROM learn_attempts a LEFT JOIN learn_certs c ON c.attempt_id=a.id ${where} GROUP BY week, a.src ORDER BY week DESC, started DESC LIMIT 500`).bind(...args).all()).results || [];
  const totals = rows.reduce((s, r) => ({ started: s.started + r.started, submitted: s.submitted + (r.submitted || 0), passed: s.passed + (r.passed || 0), certs: s.certs + (r.certs || 0) }), { started: 0, submitted: 0, passed: 0, certs: 0 });
  const pending = await env.DB.prepare(`SELECT status, COUNT(*) n FROM learn_certs ${path ? "WHERE path=?" : ""} GROUP BY status`).bind(...args).all();
  return J({ path: path || null, rows: rows.map((r) => ({ ...r, submitted: r.submitted || 0, passed: r.passed || 0, certs: r.certs || 0 })), totals, cert_status: Object.fromEntries((pending.results || []).map((r) => [r.status, r.n])) });
}

export async function handleLearnQuiz(env, request, url, path, user, J) {
  if (path === "/api/internal/learn-quiz") return internalUpsert(env, request, J);
  const method = request.method;
  let allowed;   // Routen ausdruecklich als path === "..." (tools/mcp_routes.mjs liest sie so aus dem Quelltext)
  if (path === "/api/learn/quiz/start" || path === "/api/learn/quiz/submit") allowed = ["POST"];
  else if (path === "/api/learn/cert") allowed = ["GET", "POST"];
  else if (path === "/api/learn/stats") allowed = ["GET"];
  else return null;
  if (!allowed.includes(method)) return J({ error: "method_not_allowed" }, 405);
  if (!user) return J({ error: "login" }, 401);
  if (path === "/api/learn/quiz/start") return start(env, request, user, J);
  if (path === "/api/learn/quiz/submit") return submit(env, request, user, J);
  if (path === "/api/learn/stats") return stats(env, url, user, J);
  return method === "GET" ? certStatus(env, url, user, J) : certRequest(env, request, user, J);
}
