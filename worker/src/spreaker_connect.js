// Spreaker verbinden ohne Wettlauf gegen die Uhr: Spreaker-Autorisierungscodes laufen nach rund 30 s ab, der GitHub-Workflow braucht laenger.
// Ablauf: Admin klickt /auth/spreaker/start -> Spreaker "Erlauben" -> www.m365.fm/callback?code=..&state=spreaker -> die Seite schickt den Code sofort an
// POST /api/admin/spreaker-exchange. Der Worker tauscht ihn bei Spreaker und gibt nur einen Fernet-Text zurueck, verschluesselt wie spreaker_auth.py
// (Schluessel = sha256("m365dub|" + SPREAKER_CLIENT_SECRET)). Diesen Text fuegt Mirko im Workflow "Spreaker verbinden (einmalig)" ein; er laeuft nicht ab.
// Klartext-Token verlassen den Worker nie und werden nie protokolliert. In Staging gesperrt (staging.js).
// Login-CSRF-Schutz: /auth/spreaker/start setzt state=spreaker.<nonce> und das signierte HttpOnly-Cookie m365sp (600 s, an den Admin gebunden);
// der Tausch laeuft nur, wenn der mitgeschickte state zu diesem Cookie passt. So kann niemand einem angemeldeten Admin einen fremden Spreaker-Code
// unterschieben. SameSite=Lax genuegt: www.m365.fm und api-dub.m365.fm sind same-site (gleiche registrierbare Domain m365.fm), der fetch mit
// credentials:"include" schickt Lax-Cookies mit (wie die Sitzung m365s).
import { isStaging } from "./staging.js";
import { audit, rateLimit, cookie, sign, verify, randomToken } from "./util.js";

export const SPREAKER_TOKEN_URL = "https://api.spreaker.com/oauth2/token";
export const SPREAKER_AUTHORIZE_URL = "https://www.spreaker.com/oauth2/authorize";
export const SPREAKER_REDIRECT = "https://www.m365.fm/callback";
export const SPREAKER_STATE = "spreaker";   // Praefix von state; die Rueckleitungsseite erkennt daran, dass sie den Code sofort an den Worker schicken soll
export const SPREAKER_COOKIE = "m365sp";
export const SPREAKER_STATE_TTL = 600;
const STATE_RE = /^spreaker\.([A-Za-z0-9_-]{16,64})$/;

const enc = new TextEncoder();

function b64urlPad(bytes) {   // Fernet: base64url MIT Padding
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_");
}
function b64urlDecode(str) {
  const s = String(str).trim().replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(s + "=".repeat((4 - (s.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
const concat = (...parts) => { const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0)); let o = 0; for (const p of parts) { out.set(p, o); o += p.length; } return out; };

// 32-Byte-Fernet-Schluessel wie spreaker_auth.py: urlsafe_b64encode(sha256("m365dub|" + secret)) -> dekodiert sind das genau die 32 Hash-Bytes
export async function spreakerKey(clientSecret) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode("m365dub|" + String(clientSecret).trim())));
}

// Fernet (https://github.com/fernet/spec): 0x80 | Zeit (8 Byte, big-endian, Sekunden) | IV (16) | AES-128-CBC/PKCS7 | HMAC-SHA256 ueber alles davor
// Signierschluessel = erste 16 Byte, Verschluesselungsschluessel = zweite 16 Byte.
export async function fernetEncrypt(key, plaintext, { now = Math.floor(Date.now() / 1000), iv = crypto.getRandomValues(new Uint8Array(16)) } = {}) {
  if (!(key instanceof Uint8Array) || key.length !== 32) throw new Error("fernet key must be 32 bytes");
  const ts = new Uint8Array(8);
  new DataView(ts.buffer).setBigUint64(0, BigInt(now));
  const aes = await crypto.subtle.importKey("raw", key.slice(16), { name: "AES-CBC" }, false, ["encrypt"]);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-CBC", iv }, aes, typeof plaintext === "string" ? enc.encode(plaintext) : plaintext));   // WebCrypto: PKCS7
  const body = concat(new Uint8Array([0x80]), ts, iv, ct);
  const mac = await crypto.subtle.importKey("raw", key.slice(0, 16), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64urlPad(concat(body, new Uint8Array(await crypto.subtle.sign("HMAC", mac, body))));
}

export async function fernetDecrypt(key, token) {
  const raw = b64urlDecode(token);
  if (raw.length < 1 + 8 + 16 + 16 + 32 || raw[0] !== 0x80 || (raw.length - 57) % 16) throw new Error("invalid fernet token");
  const body = raw.slice(0, raw.length - 32), sig = raw.slice(raw.length - 32);
  const mac = await crypto.subtle.importKey("raw", key.slice(0, 16), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  if (!(await crypto.subtle.verify("HMAC", mac, sig, body))) throw new Error("invalid fernet signature");
  const aes = await crypto.subtle.importKey("raw", key.slice(16), { name: "AES-CBC" }, false, ["decrypt"]);
  return new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-CBC", iv: body.slice(9, 25) }, aes, body.slice(25)));
}

export function spreakerAuthorizeUrl(env, state = SPREAKER_STATE) {
  const q = new URLSearchParams({ client_id: env.SPREAKER_CLIENT_ID, response_type: "code", scope: "basic", state, redirect_uri: SPREAKER_REDIRECT });
  return `${SPREAKER_AUTHORIZE_URL}?${q}`;
}

// Start: zufaelliges Nonce, state=spreaker.<nonce>, Cookie m365sp = nonce|uid|ablauf.signatur (Muster wie m365o in oauthStart, index.js)
export async function spreakerStart(env, uid, now = Math.floor(Date.now() / 1000)) {
  const nonce = randomToken(16), val = `${nonce}|${uid}|${now + SPREAKER_STATE_TTL}`;
  return { location: spreakerAuthorizeUrl(env, `${SPREAKER_STATE}.${nonce}`), setCookie: cookie(SPREAKER_COOKIE, `${val}.${await sign(env.SESSION_SECRET, "spreaker|" + val)}`, SPREAKER_STATE_TTL) };
}

// passt state (aus dem Body) zum signierten Cookie dieses Admins und ist es noch gueltig?
export async function spreakerStateOk(env, request, uid, state, now = Math.floor(Date.now() / 1000)) {
  const m = STATE_RE.exec(String(state || ""));
  const c = /(?:^|;\s*)m365sp=([^;]+)/.exec(request.headers.get("cookie") || "");
  if (!m || !c || !env.SESSION_SECRET) return false;
  const dot = c[1].lastIndexOf("."), val = c[1].slice(0, dot);
  if (dot < 1 || !(await verify(env.SESSION_SECRET, "spreaker|" + val, c[1].slice(dot + 1)))) return false;
  const [nonce, cu, exp] = val.split("|");
  return nonce === m[1] && +cu === +uid && +exp >= now;
}

// Fehlertext von Spreaker fuer die Anzeige: kurz, eine Zeile, ohne Geheimnisse (Client-Secret/-ID, Code, Token-artige Zeichenketten)
export function cleanDetail(text, secrets = []) {
  let s = String(text || "").replace(/\s+/g, " ").trim();
  for (const x of secrets) if (x && String(x).length >= 4) s = s.split(String(x)).join("***");
  s = s.replace(/("?(?:access_token|refresh_token|client_secret|code)"?\s*[:=]\s*"?)[^"&,\s}]+/gi, "$1***");
  return s.slice(0, 200);
}

// POST /api/admin/spreaker-exchange {code, state} -> {enc}. Nur angemeldete Admins ueber die Website (nicht per MCP), nie in Staging.
export async function handleSpreakerExchange(env, request, user, J, viaMcp = false) {
  if (request.method !== "POST") return J({ error: "method_not_allowed" }, 405);
  if (isStaging(env)) return J({ error: "staging" }, 403);
  if (viaMcp) return J({ error: "forbidden" }, 403);
  if (!user) return J({ error: "login" }, 401);
  if (!user.admin) return J({ error: "forbidden" }, 403);
  const cid = String(env.SPREAKER_CLIENT_ID || "").trim(), sec = String(env.SPREAKER_CLIENT_SECRET || "").trim();
  if (!cid || !sec) return J({ error: "not_configured" }, 503);
  const b = await request.json().catch(() => ({}));
  let code = String(b?.code || "").trim();
  if (code.includes("code=")) code = code.split("code=")[1].split("&")[0];
  try { code = decodeURIComponent(code); } catch { /* bleibt wie eingegeben */ }
  if (!/^[A-Za-z0-9._~+\/=-]{4,512}$/.test(code)) return J({ error: "bad_code" }, 400);
  if (!(await spreakerStateOk(env, request, user.id, b?.state))) return J({ error: "state_mismatch" }, 400);   // Cookie bleibt: ein untergeschobener Aufruf soll den echten Ablauf nicht stoeren
  const clear = { "set-cookie": cookie(SPREAKER_COOKIE, "", 0) };   // ab hier ist der Code an Spreaker gegangen (oder wird es gleich): state nur einmal
  if (env.DB && !(await rateLimit(env.DB, `spx:${user.id}`, 10, 3600))) return J({ error: "rate" }, 429);
  let res;
  try {
    res = await fetch(SPREAKER_TOKEN_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
      body: new URLSearchParams({ grant_type: "authorization_code", redirect_uri: SPREAKER_REDIRECT, client_id: cid, client_secret: sec, code }).toString(),
    });
  } catch {
    return J({ error: "spreaker_unreachable" }, 502, clear);
  }
  const text = await res.text().catch(() => "");
  let j = null;
  try { j = JSON.parse(text); } catch { /* kein JSON */ }
  if (!res.ok) {
    const err = typeof j?.error === "string" && /^[a-z0-9_]{1,60}$/i.test(j.error) ? j.error : `spreaker_${res.status}`;
    const detail = cleanDetail(j?.error_description || j?.message || text, [sec, cid, code]);
    await audit(env.DB, user.id, "spreaker-connect", "", `fehler ${res.status} ${err}`);
    return J({ error: err, detail }, res.status >= 400 && res.status < 500 ? 400 : 502, clear);
  }
  const at = j?.access_token, rt = j?.refresh_token;
  if (typeof at !== "string" || !at) return J({ error: "no_access_token" }, 502, clear);
  if (typeof rt !== "string" || !rt) return J({ error: "no_refresh_token" }, 502, clear);
  const out = await fernetEncrypt(await spreakerKey(sec), JSON.stringify({ access_token: at, refresh_token: rt, at: Math.floor(Date.now() / 1000) }));
  await audit(env.DB, user.id, "spreaker-connect", "", "ok");
  return J({ enc: out }, 200, { "cache-control": "no-store", ...clear });
}
