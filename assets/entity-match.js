/* Firmen-Entitaeten finden: Normalisierung, Domain-Abgleich, eindeutige/mehrdeutige Treffer. Browser: window.M365EntityMatch, Node: module.exports. */
(function (root) {
  var LEGAL = { gmbh: 1, mbh: 1, ag: 1, se: 1, inc: 1, ltd: 1, llc: 1, kg: 1, ug: 1, ohg: 1, gbr: 1, ev: 1, ek: 1, co: 1, corp: 1, corporation: 1, limited: 1, plc: 1, sa: 1, bv: 1, nv: 1, sarl: 1, srl: 1, oy: 1, ab: 1, pte: 1, kgaa: 1, haftungsbeschrankt: 1, company: 1, the: 1 };
  var MULTI = { "co.uk": 1, "org.uk": 1, "com.au": 1, "co.nz": 1, "co.jp": 1, "com.br": 1, "co.za": 1, "co.in": 1 };
  var SHARED = { "linkedin.com": 1, "github.com": 1, "x.com": 1, "twitter.com": 1, "facebook.com": 1, "youtube.com": 1, "wikipedia.org": 1, "xing.com": 1, "instagram.com": 1 };
  function norm(s) {
    s = String(s || "").toLowerCase();
    try { s = s.normalize("NFD").replace(/[̀-ͯ]/g, ""); } catch (e) {}
    s = s.replace(/e\.\s*k\./g, " ek ").replace(/e\.\s*v\./g, " ev ").replace(/&/g, " ").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, " ");
    return s.split(" ").filter(function (t) { return t && !LEGAL[t]; }).join(" ");
  }
  function registrable(host) {
    var p = String(host || "").toLowerCase().replace(/\.$/, "").split(".").filter(Boolean);
    if (p.length < 2) return "";
    var t2 = p.slice(-2).join(".");
    return p.length >= 3 && MULTI[t2] ? p.slice(-3).join(".") : t2;
  }
  // "https://www.ifakt.de/x", "ifakt.de", "www.ifakt.de" -> "ifakt.de"; sonst ""
  function domainOf(s) {
    s = String(s || "").trim().toLowerCase(); if (!s || /\s/.test(s)) return "";
    var h = s.replace(/^[a-z]+:\/\//, "").replace(/^[^@/]*@/, "").split(/[\/?#:]/)[0];
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(h)) return "";
    return registrable(h);
  }
  function domainsOf(e) {
    var out = [], urls = [e && e.web].concat(Array.isArray(e && e.same_as) ? e.same_as : []);
    urls.forEach(function (u) { var d = domainOf(u); if (d && !SHARED[d] && out.indexOf(d) < 0) out.push(d); });
    return out;
  }
  function keysOf(e) {
    var k = [norm(e.name), norm(e.id)];
    (e.aliases || []).forEach(function (a) { k.push(norm(a)); });
    domainsOf(e).forEach(function (d) { k.push(norm(d.split(".")[0])); });
    return k.filter(function (x, i) { return x && k.indexOf(x) === i; });
  }
  // -> { entity, candidates }  entity: eindeutiger Treffer; candidates: mehrere Vorschlaege (leer wenn entity gesetzt oder nichts passt)
  function match(query, entities, type) {
    var q = norm(query), qd = domainOf(query), list = (entities || []).filter(function (e) { return e && (!type || e.type === type); });
    if (!q && !qd) return { entity: null, candidates: [] };
    var exact = [], fuzzy = [];
    list.forEach(function (e) {
      var ks = keysOf(e), ds = domainsOf(e);
      if ((qd && ds.indexOf(qd) > -1) || (q && ks.indexOf(q) > -1)) { exact.push(e); return; }
      if (q.length >= 3 && ks.some(function (k) { return k.length >= 3 && (k.indexOf(q) === 0 || q.indexOf(k) === 0 || (" " + k + " ").indexOf(" " + q + " ") > -1); })) fuzzy.push(e);
    });
    if (exact.length === 1) return { entity: exact[0], candidates: [] };
    var c = exact.concat(fuzzy);
    if (c.length === 1) return { entity: c[0], candidates: [] };
    return { entity: null, candidates: c.slice(0, 6) };
  }
  // Vorschlag fuer eine Community-Firma: Website-Domain (stark) oder normalisierter Name; nur eindeutige Treffer
  function suggest(name, website, entities) {
    var orgs = (entities || []).filter(function (e) { return e && e.type === "org"; }), d = domainOf(website);
    if (d) { var byD = orgs.filter(function (e) { return domainsOf(e).indexOf(d) > -1; }); if (byD.length === 1) return { entity: byD[0], by: "domain", domain: d }; }
    var n = norm(name); if (n) { var byN = orgs.filter(function (e) { return keysOf(e).indexOf(n) > -1; }); if (byN.length === 1) return { entity: byN[0], by: "name", domain: domainsOf(byN[0])[0] || "" }; }
    return null;
  }
  function slug(name) { return norm(name).replace(/ /g, "-").slice(0, 48).replace(/^-+|-+$/g, ""); }
  var api = { norm: norm, domainOf: domainOf, domainsOf: domainsOf, match: match, suggest: suggest, slug: slug };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.M365EntityMatch = api;
})(typeof window !== "undefined" ? window : this);
