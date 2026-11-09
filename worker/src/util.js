// Hilfsfunktionen: Base64url, HMAC-Sessions, CORS/JSON, Text-Bereinigung, Ratelimit
const enc = new TextEncoder();

export const b64u = {
  enc(buf) {
    const b = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    let s = ""; for (const x of b) s += String.fromCharCode(x);
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  },
  dec(str) {
    str = str.replace(/-/g, "+").replace(/_/g, "/"); while (str.length % 4) str += "=";
    const s = atob(str); const b = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
    return b;
  },
};

// Dateien des Seitenbaus abrufen: erst ueber die Website, sonst direkt aus dem R2-Bucket (Schluessel pages/<pfad>, tools/r2_pages_upload.py).
// Abrufe auf die eigene Zone (www.m365.fm) gehen ohne das Flag global_fetch_strictly_public am Site-Worker vorbei direkt zum Ursprung
// (GitHub Pages). Dateien, die nur im Bucket liegen (blog-import/, translations-blog.json, duenne Sprachfassungen), kaemen dort als 404 zurueck.
export async function siteFetch(env, path, init) {
  const r = await fetch(env.SITE + path, init).catch(() => null);
  if (r && r.ok) return r;
  if (env.PAGES && (!r || r.status === 404)) {
    const obj = await env.PAGES.get("pages" + path).catch(() => null);
    if (obj) return new Response(obj.body, { status: 200, headers: { "content-type": /\.json$/i.test(path) ? "application/json; charset=utf-8" : "application/octet-stream", "x-m365-src": "r2" } });
  }
  return r || new Response("", { status: 502 });
}

async function hmacKey(secret) {
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}
export async function sign(secret, data) {
  return b64u.enc(await crypto.subtle.sign("HMAC", await hmacKey(secret), enc.encode(data)));
}
export async function verify(secret, data, sig) {
  try { return await crypto.subtle.verify("HMAC", await hmacKey(secret), b64u.dec(sig), enc.encode(data)); } catch { return false; }
}

export const SESSION_DAYS = 60;
export async function makeSession(env, uid, days = SESSION_DAYS) {
  const exp = Math.floor(Date.now() / 1000) + days * 86400;
  const body = `${uid}.${exp}`;
  return `${body}.${await sign(env.SESSION_SECRET, body)}`;
}
// Sitzung samt Anmeldezeitpunkt: Sitzungen laufen immer SESSION_DAYS Tage, also ist iat = exp - SESSION_DAYS Tage.
// raw = Cookie-Wert (fuer die Bindung des Verknuepfungs-state an genau diese Sitzung, #279)
export async function readSessionInfo(env, request) {
  const m = /(?:^|;\s*)m365s=([^;]+)/.exec(request.headers.get("cookie") || "");
  if (!m) return null;
  const [uid, exp, sig] = m[1].split(".");
  if (!uid || !exp || !sig || +exp < Date.now() / 1000) return null;
  if (!(await verify(env.SESSION_SECRET, `${uid}.${exp}`, sig))) return null;
  return { uid: +uid, iat: +exp - SESSION_DAYS * 86400, raw: m[1] };
}
export async function readSession(env, request) {
  const s = await readSessionInfo(env, request);
  return s ? s.uid : null;
}
export function cookie(name, value, maxAge) {
  return `${name}=${value}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

// Fremde Urspruenge nur fuer einzelne oeffentliche Routen und ohne Cookies (credentials: omit):
// das Mediadaten-Formular der M365Con im HeySummit-Pagebuilder (m365con.net und Ausgaben-Subdomains, #260)
export const CON_ORIGINS = ["https://m365con.net", "https://www.m365con.net", "https://de.m365con.net", "https://2026.m365con.net"];
export const ROUTE_ORIGINS = { "/api/mediakit": CON_ORIGINS, "/api/mediakit/summary": CON_ORIGINS };
export function cors(env, request) {
  const origin = request.headers.get("origin");
  const h = { "vary": "Origin" };
  if (origin && (origin === env.SITE || /^http:\/\/localhost(:\d+)?$/.test(origin))) {
    h["access-control-allow-origin"] = origin;
    h["access-control-allow-credentials"] = "true";
    h["access-control-allow-headers"] = "content-type, x-requested-with";
    h["access-control-allow-methods"] = "GET, POST, DELETE, OPTIONS";
    h["access-control-max-age"] = "86400";
  } else if (origin) {
    let path = "";
    try { path = new URL(request.url).pathname; } catch { /* ohne URL keine Ausnahme */ }
    if ((ROUTE_ORIGINS[path] || []).includes(origin)) {
      h["access-control-allow-origin"] = origin;   // bewusst ohne allow-credentials
      h["access-control-allow-headers"] = "content-type, x-requested-with";
      h["access-control-allow-methods"] = "GET, POST, OPTIONS";
      h["access-control-max-age"] = "86400";
    }
  }
  return h;
}
export function json(data, status, env, request, extra = {}) {
  return new Response(JSON.stringify(data), {
    status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...cors(env, request), ...extra },
  });
}

export function cleanText(s, max) {
  s = String(s ?? "").normalize("NFC").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f​-‏‪-‮⁦-⁩]/g, "");
  s = s.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return s.length > max ? s.slice(0, max) : s;
}
export const cleanName = (s) => cleanText(s, 40).replace(/\s+/g, " ").replace(/[<>]/g, "");

export function randomToken(bytes = 24) { return b64u.enc(crypto.getRandomValues(new Uint8Array(bytes))); }

export async function sha256hex(s) {
  const d = await crypto.subtle.digest("SHA-256", enc.encode(s));
  return [...new Uint8Array(d)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

// Kennung fuer alle Abrufe fremder Seiten (Feeds der Profil-Kanaele, eigene Quellen im MVP-Tracker, Link-Vorschau). Die Seite /bot/ erklaert den Bot.
export const BOT_UA = "M365.FM-Bot (+https://www.m365.fm/bot/)";

// Mitglied mit Rollen laden: admin (Rolle oder ADMIN_SUBS), editor, pro (bestaetigtes Programm). null = unbekannt oder gesperrt.
// Eine Stelle fuer Sitzung, KI-Token und Cron-Laeufe, die nur die Nutzer-ID kennen (z. B. Kurzposts aus eigenen Quellen).
export const isAdmin = (env, u) => u.role === "admin" || (env.ADMIN_SUBS || "").split(",").map((s) => s.trim()).includes(`${u.provider}:${u.sub}`);
export async function memberOf(env, uid) {
  const u = await env.DB.prepare("SELECT id,provider,sub,name,bio,lang,banned,role,created FROM users WHERE id=?").bind(uid).first();
  if (!u || u.banned) return null;
  const pro = !!(await env.DB.prepare("SELECT 1 x FROM programs WHERE owner_type='u' AND owner_id=? AND verified=1 AND program IN ('mvp','mct','rd','msa','ms_employee') LIMIT 1").bind(uid).first());
  return { ...u, admin: isAdmin(env, u), editor: u.role === "editor", pro };
}

// Ratelimit: max Aktionen pro Fenster (Sekunden). true = erlaubt
export async function rateLimit(db, key, max, windowSec) {
  const now = Math.floor(Date.now() / 1000);
  const row = await db.prepare("SELECT n, win FROM ratelimit WHERE k=?").bind(key).first();
  if (!row || now - row.win >= windowSec) {
    await db.prepare("INSERT OR REPLACE INTO ratelimit(k,n,win) VALUES(?,?,?)").bind(key, 1, now).run();
    return true;
  }
  if (row.n >= max) return false;
  await db.prepare("UPDATE ratelimit SET n=n+1 WHERE k=?").bind(key).run();
  return true;
}

const numeric = (value, fallback) => Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : fallback;
const isHaiku = (model) => /^claude-haiku/i.test(String(model || ""));
export const AI_BUDGET_ERROR = "AI_DAILY_BUDGET";
let warnedMissingGatewayToken = false;

function gatewayEnabled(env) {
  const account = String(env.CLOUDFLARE_ACCOUNT_ID || "").trim(), gateway = env.AI_GATEWAY_ID === undefined ? "m365fm" : String(env.AI_GATEWAY_ID).trim();
  if (!account || !gateway) return false;
  if (!String(env.CF_AIG_TOKEN || "").trim()) {
    if (!warnedMissingGatewayToken) {
      console.warn("AI Gateway ist konfiguriert, aber CF_AIG_TOKEN fehlt; direkter Anthropic-Aufruf.");
      warnedMissingGatewayToken = true;
    }
    return false;
  }
  return true;
}

export function anthropicUrl(env, path = "/v1/messages") {
  const account = String(env.CLOUDFLARE_ACCOUNT_ID || "").trim(), gateway = env.AI_GATEWAY_ID === undefined ? "m365fm" : String(env.AI_GATEWAY_ID).trim();
  const base = gatewayEnabled(env) ? `https://gateway.ai.cloudflare.com/v1/${encodeURIComponent(account)}/${encodeURIComponent(gateway)}/anthropic` : "https://api.anthropic.com";
  return base + (path.startsWith("/") ? path : `/${path}`);
}

export function anthropicHeaders(env, { job, lang = "", model, cacheTtl, skipCache = false } = {}) {
  const headers = {
    "content-type": "application/json",
    "x-api-key": env.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
  };
  if (gatewayEnabled(env)) {
    headers["cf-aig-metadata"] = JSON.stringify({ job, lang, model });
    headers["cf-aig-authorization"] = "Bearer " + String(env.CF_AIG_TOKEN).trim();   // Format laut Cloudflare-Doku und secrets-check.yml
    if (skipCache) headers["cf-aig-skip-cache"] = "true";
    else if (cacheTtl) headers["cf-aig-cache-ttl"] = String(cacheTtl);
  }
  return headers;
}

function aiPrices(env) {
  return {
    input: numeric(env.HAIKU_USD_PER_MTOK_IN, 0.10),
    output: numeric(env.HAIKU_USD_PER_MTOK_OUT, 0.50),
    eur: numeric(env.AI_DAILY_EUR_HAIKU, 5),
    rate: Math.max(0.000001, numeric(env.USD_PER_EUR, 1.08)),
  };
}

export async function aiBudgetStatus(env) {
  const day = new Date().toISOString().slice(0, 10), prices = aiPrices(env);
  const row = await env.DB.prepare("SELECT COALESCE(SUM(usd),0) usd,COALESCE(SUM(reserved_usd),0) reserved_usd FROM ai_spend WHERE day=? AND model LIKE 'claude-haiku%'").bind(day).first();
  const spentUsd = Number(row?.usd || 0), reservedUsd = Number(row?.reserved_usd || 0);
  const budgetUsd = prices.eur * prices.rate;
  return { day, spent_usd: spentUsd, spent_eur: spentUsd / prices.rate, reserved_eur: reservedUsd / prices.rate, budget_eur: prices.eur,
    remaining_eur: Math.max(0, prices.eur - (spentUsd + reservedUsd) / prices.rate), allowed: spentUsd + reservedUsd < budgetUsd };
}

// Kosten einer Claude-Antwort aus ihrer usage (Haiku 5.5, Preise laut Prompt-Caching-Doku): input_tokens = nicht gecachte Eingabe (1x),
// cache_read_input_tokens = aus dem Prompt-Cache gelesen (0,1x), cache_creation_input_tokens = in den Cache geschrieben (5 min: 1,25x, 1 h: 2x).
export function usageUsd(prices, usage = {}, batch = false) {
  const n = (v) => Math.max(0, Number(v) || 0);
  const read = n(usage.cache_read_input_tokens), write = n(usage.cache_creation_input_tokens);
  const write1h = Math.min(write, n(usage.cache_creation?.ephemeral_1h_input_tokens));
  const inputUnits = n(usage.input_tokens) + read * 0.1 + (write - write1h) * 1.25 + write1h * 2;
  return (inputUnits * prices.input / 1e6 + n(usage.output_tokens) * prices.output / 1e6) * (batch ? 0.5 : 1);   // Batch API: halber Preis
}

async function warnAiBudget(env, status, job) {
  if (status.spent_eur + status.reserved_eur < status.budget_eur * 0.8) return;
  const result = await env.DB.prepare("INSERT OR IGNORE INTO meta(k,v) VALUES(?,?)").bind(`ai_budget_warn:${status.day}`, "1").run();
  if (result?.meta?.changes) console.warn("ai_budget_warning", { day: status.day, job, used_eur: status.spent_eur + status.reserved_eur, budget_eur: status.budget_eur });
}

async function reserveHaiku(env, body, job, lang, model) {
  const prices = aiPrices(env), day = new Date().toISOString().slice(0, 10);
  const text = JSON.stringify(body), inputTokens = new TextEncoder().encode(text).length + 32;
  const outputTokens = Math.max(0, Number(body.max_tokens) || 0);
  const reserveUsd = inputTokens * prices.input / 1e6 + outputTokens * prices.output / 1e6;
  const id = crypto.randomUUID();
  const result = await env.DB.prepare(
    "INSERT INTO ai_spend(id,day,model,job,lang,in_tok,out_tok,usd,reserved_usd,created) " +
    "SELECT ?,?,?,?,?,0,0,0,?,? WHERE COALESCE((SELECT SUM(usd+reserved_usd) FROM ai_spend WHERE day=? AND model LIKE 'claude-haiku%'),0)+?<=?",
  ).bind(id, day, model, job, lang, reserveUsd, Math.floor(Date.now() / 1000), day, reserveUsd, prices.eur * prices.rate).run();
  return result?.meta?.changes ? { id, day, reserveUsd } : null;
}

async function finishHaiku(env, reservation, usage, job, lang, model) {
  const prices = aiPrices(env);
  const input = Number(usage.input_tokens || 0) + Number(usage.cache_creation_input_tokens || 0) + Number(usage.cache_read_input_tokens || 0);
  const output = Number(usage.output_tokens || 0);
  const usd = usageUsd(prices, usage);
  if (reservation) {
    await env.DB.prepare("UPDATE ai_spend SET in_tok=?,out_tok=?,usd=?,reserved_usd=0 WHERE id=?")
      .bind(input, output, usd, reservation.id).run();
  } else {
    await env.DB.prepare("INSERT INTO ai_spend(id,day,model,job,lang,in_tok,out_tok,usd,reserved_usd,created) VALUES(?,?,?,?,?,?,?,?,0,?)")
      .bind(crypto.randomUUID(), new Date().toISOString().slice(0, 10), model, job, lang, input, output, usd, Math.floor(Date.now() / 1000)).run();
  }
  const status = await aiBudgetStatus(env);
  await warnAiBudget(env, status, job);
  return status;
}

// input_tokens = Eingabe gesamt (wie die Workflows sie zaehlen); cache_read/cache_creation_input_tokens = Anteile daraus aus bzw. fuer den Prompt-Cache
export async function reportExternalAiUsage(env, { id, job, lang = "", model, input_tokens, output_tokens, batch = false, cache_read_input_tokens = 0, cache_creation_input_tokens = 0 }) {
  if (!isHaiku(model)) throw new Error("unsupported model");
  const prices = aiPrices(env), input = Number(input_tokens || 0), output = Number(output_tokens || 0);
  const read = Math.min(input, Number(cache_read_input_tokens || 0)), write = Math.min(input - read, Number(cache_creation_input_tokens || 0));
  const usd = usageUsd(prices, { input_tokens: input - read - write, cache_read_input_tokens: read, cache_creation_input_tokens: write, output_tokens: output }, batch);
  await env.DB.prepare("INSERT OR IGNORE INTO ai_spend(id,day,model,job,lang,in_tok,out_tok,usd,reserved_usd,created) VALUES(?,?,?,?,?,?,?,?,0,?)")
    .bind(id, new Date().toISOString().slice(0, 10), model, job, lang, input, output, usd, Math.floor(Date.now() / 1000)).run();
  const status = await aiBudgetStatus(env);
  await warnAiBudget(env, status, job);
  return status;
}

export async function anthropicFetch(env, body, { job, lang = "", cacheTtl, skipCache = false } = {}) {
  const model = String(body?.model || "");
  let reservation = null;
  if (isHaiku(model)) {
    reservation = await reserveHaiku(env, body, job, lang, model);
    if (!reservation) {
      const error = new Error(AI_BUDGET_ERROR);
      error.code = AI_BUDGET_ERROR;
      throw error;
    }
  }
  const release = () => env.DB.prepare("UPDATE ai_spend SET reserved_usd=0 WHERE id=?").bind(reservation.id).run();
  let response;
  try {
    response = await fetch(anthropicUrl(env), { method: "POST", headers: anthropicHeaders(env, { job, lang, model, cacheTtl, skipCache }), body: JSON.stringify(body) });
  } catch {
    if (reservation) await release();
    throw new Error("Claude API request failed");
  }
  if (reservation) {
    const cached = String(response.headers?.get?.("cf-aig-cache-status") || "").toUpperCase() === "HIT";   // Gateway-Cache: Anthropic berechnet nichts
    const data = response.ok && !cached ? await response.clone().json().catch(() => null) : null;
    if (data?.usage) await finishHaiku(env, reservation, data.usage, job, lang, model);
    else await release();
  }
  return response;
}

export const LANGS = ["de", "es", "fr", "it", "pt", "nl", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko"];
export const isLang = (l) => LANGS.includes(l);
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export async function audit(db, userId, action, target = "", detail = "") {   // Audit-Protokoll der Verwaltung (wer, wann, was) - Diff/Kurzfassung, keine Volltexte
  try { await db.prepare("INSERT INTO audit(user_id,action,target,detail,created) VALUES(?,?,?,?,?)").bind(userId || 0, action, String(target).slice(0, 200), String(detail).slice(0, 2000), Math.floor(Date.now() / 1000)).run(); } catch { /* Tabelle fehlt bis zur Migration */ }
}

// Antworttext von Claude: nur Bloecke vom Typ "text" (Claude Haiku 5.5 denkt standardmaessig mit, eine Antwort kann mit thinking-Bloecken beginnen -
// content[0].text waere dann leer). Gleiches Muster wie translate_blog.py.
export const claudeText = (j) => (Array.isArray(j?.content) ? j.content : []).filter((b) => b && b.type === "text").map((b) => b.text || "").join("").trim();

export async function haikuJson(env, system, obj, { job, lang = "", maxTokens = 8000, model = "claude-haiku-5-5", cacheTtl = 604800 } = {}) {
  const body = { model, max_tokens: maxTokens, system, messages: [{ role: "user", content: JSON.stringify(obj) }] };
  const options = { job, lang, cacheTtl };
  let used = { ...body, thinking: { type: "disabled" }, output_config: { effort: "low" } };
  let response = await anthropicFetch(env, used, options);
  if (response.status === 400) response = await anthropicFetch(env, (used = body), options);
  if (!response.ok) throw new Error("api " + response.status);
  const parse = async (r) => {
    let text = claudeText(await r.json());
    if (text.startsWith("```")) text = text.replace(/^```[a-z]*\n?/, "").replace(/```$/, "");
    return JSON.parse(text);
  };
  try {
    return await parse(response.clone());
  } catch (e) {
    // Unbrauchbare Antwort aus dem Gateway-Cache (7 Tage): einmal am Cache vorbei neu fragen, sonst haengt derselbe Auftrag eine Woche fest
    if (String(response.headers?.get?.("cf-aig-cache-status") || "").toUpperCase() !== "HIT") throw e;
    const fresh = await anthropicFetch(env, used, { ...options, skipCache: true });
    if (!fresh.ok) throw new Error("api " + fresh.status);
    return parse(fresh);
  }
}
