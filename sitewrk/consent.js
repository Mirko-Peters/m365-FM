// T32: Einwilligungs-Region je Anfrage, ohne den Kanten-Cache zu teilen. Das HTML bleibt fuer alle Laender ein Cache-Eintrag;
// erst nach dem Cache setzt der Worker <html data-cr="1|0"> (1 = Banner noetig: EU/EWR, UK, CH; 0 = nicht).
// Browser-Validatoren tragen die Region (ETag-Endung .r1/.r0), damit ein Laenderwechsel (VPN, Reise) nie ein 304 auf die falsche Fassung bekommt.
export const ALL = "*";
let _s, _v;
export function countries(s) {   // Laenderliste aus wrangler.toml (CONSENT_COUNTRIES); leer oder "*" = ueberall
  if (s === _s) return _v;
  const t = String(s || "").trim(); _s = s;
  return (_v = !t || t === ALL ? ALL : new Set(t.toUpperCase().split(/[\s,;]+/).filter((x) => /^[A-Z]{2}$/.test(x))));
}
export function regionOf(request, env) {   // "1" = Einwilligung noetig, "0" = nicht
  const list = countries(env && env.CONSENT_COUNTRIES);
  const cc = String((request.cf && request.cf.country) || request.headers.get("cf-ipcountry") || "").toUpperCase();
  if (list === ALL || !/^[A-Z][A-Z0-9]$/.test(cc) || cc === "XX" || cc === "T1") return "1";   // fehlt, unbekannt oder Tor: sicherheitshalber Banner
  return list.has(cc) ? "1" : "0";
}
// ETag mit Regions-Endung (schwach, damit Cloudflares Kompression ihn nicht entfernt). Ohne ETag: aus Last-Modified gebildet (W/"lm<sek>.rX")
export function tagFor(et, lm, cr) {
  if (et) { const m = /^(?:W\/)?"(.*)"$/.exec(et); return `W/"${m ? m[1] : et}.r${cr}"`; }
  const t = lm ? Date.parse(lm) : NaN;
  return Number.isFinite(t) ? `W/"lm${Math.floor(t / 1000)}.r${cr}"` : null;
}
// Validatoren der eigenen Region: Endung entfernen (Ursprung/R2 kennen sie nicht), aus "lm<sek>" wird If-Modified-Since;
// fremde Region: verwerfen (erzwingt 200); Validatoren ohne Endung (Assets, alte Seiten): unveraendert
export function conditional(request, cr) {
  const inm = request.headers.get("if-none-match");
  if (!inm) return { req: request, stripped: false };
  let stripped = false, dropped = false, ims = null; const keep = [];
  for (const t of inm.split(",").map((x) => x.trim()).filter(Boolean)) {
    const m = /^(?:W\/)?"(.*)\.r([01])"$/.exec(t);
    if (!m) keep.push(t);
    else if (m[2] !== cr) dropped = true;
    else { stripped = true; const lm = /^lm(\d+)$/.exec(m[1]); if (lm) ims = new Date(+lm[1] * 1000).toUTCString(); else keep.push(`W/"${m[1]}"`); }
  }
  if (!stripped && !dropped) return { req: request, stripped: false };
  const h = new Headers(request.headers);
  if (keep.length) h.set("if-none-match", keep.join(", ")); else h.delete("if-none-match");
  if (ims) h.set("if-modified-since", ims); else h.delete("if-modified-since");
  return { req: new Request(request.url, { method: request.method, headers: h, redirect: "manual" }), stripped };
}
export function markHtml(res, request, cr, stripped) {
  const html = (res.headers.get("content-type") || "").startsWith("text/html");
  if (res.status === 304 ? !stripped : !html) return res;   // unveraendert: kein HTML, und 304 auf alte Validatoren ohne Endung
  const h = new Headers(res.headers);
  const et = tagFor(h.get("etag"), h.get("last-modified"), cr);
  if (et) h.set("etag", et); else h.delete("etag");
  h.delete("last-modified");   // Revalidierung nur noch ueber den ETag mit Region
  h.set("cache-control", "private, no-cache"); h.set("x-m365-cr", cr);
  const body = res.status === 304 || request.method === "HEAD" ? null : res.body;
  const out = new Response(body, { status: res.status, statusText: res.statusText, headers: h });
  if (!body || typeof HTMLRewriter === "undefined") return out;   // HTMLRewriter gibt es im Worker (in Node-Tests nicht)
  return new HTMLRewriter().on("html", { element(e) { e.setAttribute("data-cr", cr); } }).transform(out);
}
