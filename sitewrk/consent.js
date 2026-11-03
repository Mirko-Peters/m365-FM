// T32: Einwilligungs-Region je Anfrage, ohne den Kanten-Cache zu teilen. Das HTML bleibt fuer alle Laender ein Cache-Eintrag;
// erst nach dem Cache setzt der Worker <html data-cr="1|0"> (1 = Banner noetig: EU/EWR, UK, CH; 0 = nicht).
// Browser-Validatoren tragen die Region, damit ein Laenderwechsel (VPN, Reise) nie ein 304 auf die Fassung ohne Banner bekommt:
// - ETag mit Endung .r1/.r0 (falls er die Kante uebersteht - Cloudflare entfernt ETags an HTML, solange E-Mail-Verschleierung o. ae. aktiv ist)
// - Last-Modified mit der Region in der Sekunde: auf die Minute abgerundet + 1 (Region 1) bzw. + 0 (Region 0). Dieser Validator kommt
//   immer durch. Region 1 hat damit stets den spaeteren Zeitpunkt: Ein Browser mit der Fassung ohne Banner bekommt in Region 1 nie ein 304,
//   auch nicht, falls die Kante selbst If-Modified-Since auswertet. Umgekehrt (Fassung mit Banner in Region 0) waere es harmlos.
export const ALL = "*";
const UNSET = Symbol("unset");
let _s = UNSET, _v;
export function countries(s) {   // Laenderliste aus wrangler.toml (CONSENT_COUNTRIES); leer, "*" oder fehlerhaft = ueberall Banner
  if (s === _s) return _v;
  _s = s;
  const t = String(s ?? "").trim();
  if (!t || t === ALL) return (_v = ALL);
  const tok = t.toUpperCase().split(/[\s,;]+/).filter(Boolean), ok = tok.filter((x) => /^[A-Z]{2}$/.test(x));
  if (!ok.length || ok.length !== tok.length) {   // z. B. "DEU,AUT" oder '["DE"]': lieber ueberall Banner als nirgends
    console.warn(`CONSENT_COUNTRIES unlesbar (${tok.length - ok.length} ungueltige Eintraege) - Banner ueberall`);
    return (_v = ALL);
  }
  return (_v = new Set(ok));
}
export function regionOf(request, env) {   // "1" = Einwilligung noetig, "0" = nicht
  const list = countries(env && env.CONSENT_COUNTRIES);
  const cc = String((request.cf && request.cf.country) || request.headers.get("cf-ipcountry") || "").toUpperCase();
  if (list === ALL || !/^[A-Z][A-Z0-9]$/.test(cc) || cc === "XX" || cc === "T1") return "1";   // fehlt, unbekannt oder Tor: sicherheitshalber Banner
  return list.has(cc) ? "1" : "0";
}
// HTML-Adressen: Verzeichnisse, .html und Pfade ohne Dateiendung. Dateien (.json, .xml, .txt, Bilder, Assets) bleiben unberuehrt.
export const isHtmlPath = (p) => p.endsWith("/") || /\.html?$/i.test(p) || !/\.[a-z0-9]{1,8}$/i.test(p);
// ETag mit Regions-Endung (schwach, damit Cloudflares Kompression ihn nicht entfernt)
export function tagFor(et, cr) {
  if (!et) return null;
  const m = /^(?:W\/)?"(.*)"$/.exec(et);
  return `W/"${m ? m[1] : et}.r${cr}"`;
}
// Last-Modified mit Region: Minute + Sekunde 0 (Region 0) bzw. 1 (Region 1); null bei ungueltigem Datum
export function lmFor(lm, cr) {
  const t = lm ? Date.parse(lm) : NaN;
  return Number.isFinite(t) ? new Date((Math.floor(t / 60000) * 60 + Number(cr)) * 1000).toUTCString() : null;
}
// Bedingte Anfrage fuer Ursprung/R2: nur Validatoren der eigenen Region gelten. ETag: Endung entfernen; If-Modified-Since: Sekunde der Region
// -> Ende der Minute (der Ursprung vergleicht mit seinem echten Zeitpunkt). Fremde Region und Validatoren ohne Region (Browser-Cache von vor T32)
// werden verworfen, das erzwingt eine frische, markierte 200. Range/If-Range fallen weg: HTML wird immer ganz ausgeliefert (sonst passt der
// umgeschriebene Inhalt nicht zu Content-Range).
export function conditional(request, cr) {
  const inm = request.headers.get("if-none-match"), ims = request.headers.get("if-modified-since");
  const rng = request.headers.has("range") || request.headers.has("if-range");
  if (!inm && !ims && !rng) return { req: request, own: false };
  const h = new Headers(request.headers); let own = false;
  h.delete("range"); h.delete("if-range");
  if (inm) {
    const keep = [];
    for (const t of inm.split(",").map((x) => x.trim()).filter(Boolean)) {
      const m = /^(?:W\/)?"(.*)\.r([01])"$/.exec(t);
      if (m && m[2] === cr) keep.push(`W/"${m[1]}"`);
    }
    if (keep.length) { h.set("if-none-match", keep.join(", ")); own = true; } else h.delete("if-none-match");
  }
  h.delete("if-modified-since");
  const t = ims ? Date.parse(ims) : NaN;
  if (Number.isFinite(t) && (t / 1000) % 60 === Number(cr)) {
    h.set("if-modified-since", new Date((Math.floor(t / 60000) * 60 + 59) * 1000).toUTCString()); own = true;
  }
  return { req: new Request(request, { headers: h, redirect: "manual" }), own };
}
// Antwort fuer den Browser: Region in Header und <html>, Validatoren mit Region, privat (Kanten-Cache bleibt beim Abruf davor)
export function markHtml(res, request, cr) {
  const html = (res.headers.get("content-type") || "").toLowerCase().startsWith("text/html");
  if (res.status === 206 || (res.status !== 304 && !html)) return res;   // 304 kommt hier nur auf Validatoren der eigenen Region (conditional)
  const h = new Headers(res.headers);
  const et = tagFor(h.get("etag"), cr), lm = lmFor(h.get("last-modified"), cr);
  if (et) h.set("etag", et); else h.delete("etag");
  if (lm) h.set("last-modified", lm); else h.delete("last-modified");
  h.set("cache-control", "private, no-cache"); h.set("x-m365-cr", cr);
  const body = res.status === 304 || request.method === "HEAD" ? null : res.body;
  const out = new Response(body, { status: res.status, statusText: res.statusText, headers: h });
  if (!body || typeof HTMLRewriter === "undefined") return out;   // HTMLRewriter gibt es im Worker (in Node-Tests nicht)
  return new HTMLRewriter().on("html", { element(e) { e.setAttribute("data-cr", cr); } }).transform(out);
}
