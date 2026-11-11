// Cloudflare-Anbindung fuer "Blog auf der eigenen Domain" (BLOG_OWN_DOMAIN.md): DNS-Pruefung (DNS-ueber-HTTPS) und Custom Hostnames (Cloudflare for SaaS).
// Zugang NUR ueber die Worker-Secrets CF_API_TOKEN und CF_ZONE_ID. Fehlen sie, wird Cloudflare nie aufgerufen (cfOn false). Der Token wird nie geloggt oder ausgegeben.
// In Tests wird fetch ersetzt: kein echter Aufruf.
import { normHost } from "./byod_rules.js";

const CF = "https://api.cloudflare.com/client/v4";
export const TXT_PREFIX = "_m365fm-verify.";
export const txtValue = (token) => `m365fm-verify=${token}`;
export const cfOn = (env) => !!(env?.CF_API_TOKEN && env?.CF_ZONE_ID && /^[a-f0-9]{32}$/i.test(String(env.CF_ZONE_ID)));
export const cnameTarget = (env) => normHost(String(env?.BYOD_CNAME_TARGET || ""));

const clean = (s) => String(s || "").trim().toLowerCase().replace(/\.$/, "");

// DNS-ueber-HTTPS (Cloudflare 1.1.1.1, JSON): CNAME der Domain auf unser Ziel, optional TXT mit dem Pruef-Token.
// -> { ok:true, cname:boolean, txt:boolean } (ok = die Antwort war eindeutig: Status 0 oder NXDOMAIN) oder { ok:false }
async function doh(name, type) {
  const r = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`, { headers: { accept: "application/dns-json" }, signal: AbortSignal.timeout(4000) }).catch(() => null);
  if (!r || !r.ok) return null;
  const j = await r.json().catch(() => null);
  return j && (j.Status === 0 || j.Status === 3) ? j : null;
}
export async function checkDns(host, target, token) {
  host = normHost(host); if (!host || !target) return { ok: false };
  const [c, t] = await Promise.all([doh(host, "CNAME"), token ? doh(TXT_PREFIX + host, "TXT") : Promise.resolve({ Answer: [], Status: 3 })]);
  if (!c || !t) return { ok: false };
  const cname = (c.Answer || []).some((a) => a.type === 5 && clean(a.data) === target);
  const want = txtValue(token || "");
  const txt = !!token && (t.Answer || []).some((a) => a.type === 16 && String(a.data || "").replace(/"\s*"/g, "").replace(/^"|"$/g, "") === want);
  return { ok: true, cname, txt };
}

async function cf(env, method, path, body) {
  const r = await fetch(CF + path, { method, headers: { authorization: `Bearer ${env.CF_API_TOKEN}`, "content-type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(8000) }).catch(() => null);
  if (!r) return { ok: false, error: "cf_unreachable" };
  const j = await r.json().catch(() => null);
  if (!j || !j.success) return { ok: false, status: r.status, error: "cf_" + (j?.errors?.[0]?.code ?? r.status), message: String(j?.errors?.[0]?.message || "").slice(0, 200) };
  return { ok: true, result: j.result };
}
const view = (x) => ({ id: String(x?.id || ""), status: String(x?.status || ""), ssl: String(x?.ssl?.status || "") });

// Custom Hostname anlegen (Zertifikat per HTTP-Pruefung, sobald der CNAME zeigt). -> { ok, id, status, ssl } oder { ok:false, error }
export async function cfCreate(env, host) {
  if (!cfOn(env)) return { ok: false, error: "cf_off" };
  const r = await cf(env, "POST", `/zones/${env.CF_ZONE_ID}/custom_hostnames`, { hostname: host, ssl: { method: "http", type: "dv", settings: { min_tls_version: "1.2" } } });
  return r.ok ? { ok: true, ...view(r.result) } : r;
}
export async function cfGet(env, id) {
  if (!cfOn(env) || !/^[a-f0-9-]{8,64}$/i.test(String(id))) return { ok: false, error: "cf_off" };
  const r = await cf(env, "GET", `/zones/${env.CF_ZONE_ID}/custom_hostnames/${id}`);
  return r.ok ? { ok: true, ...view(r.result) } : r;
}
// 404 gilt als geloescht (schon weg)
export async function cfDelete(env, id) {
  if (!cfOn(env) || !/^[a-f0-9-]{8,64}$/i.test(String(id))) return { ok: false, error: "cf_off" };
  const r = await cf(env, "DELETE", `/zones/${env.CF_ZONE_ID}/custom_hostnames/${id}`);
  return r.ok || r.status === 404 ? { ok: true } : r;
}
