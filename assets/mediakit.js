/* Mediadaten-Formular (/media-kit/, /m365con/sponsor/ und die HeySummit-Einbettung): sendet Name, Firma, E-Mail an den Worker, der das PDF per E-Mail schickt.
   Konfiguration window.M365MK = {api, lang, brand?, kpis?, ok, err, sending, send}. brand "m365con" waehlt das M365Con-Deck (#260);
   kpis: true laedt die Kennzahlen-Vorschau (nur Summen) von GET /api/mediakit/summary?brand=... in #mk-kpis.
   Ohne Abhaengigkeiten, damit tools (site_mediakit.py) das Skript unveraendert in die HeySummit-Einbettung kopieren kann. */
(function () {
  var C = window.M365MK, f = document.getElementById("mk-form");
  if (!C || !f) return;
  var msg = f.querySelector(".mk-msg"), btn = f.querySelector("button[type=submit]");
  var say = function (t, ok) { msg.textContent = t; msg.className = "mk-msg " + (ok ? "ok" : "err"); };
  f.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var v = function (n) { return (f.elements[n].value || "").trim(); };
    var body = { name: v("name"), company: v("company"), email: v("email"), website: v("website"), consent: f.elements.consent.checked, lang: C.lang, source: (C.source || location.pathname).slice(0, 60) };
    if (C.brand) body.brand = C.brand;
    if (body.name.length < 2) return say(C.err.name);
    if (body.company.length < 2) return say(C.err.company);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(body.email)) return say(C.err.email);
    if (!body.consent) return say(C.err.consent);
    btn.disabled = true; btn.textContent = C.sending; msg.textContent = "";
    fetch(C.api + "/api/mediakit", { method: "POST", credentials: "omit", headers: { "content-type": "application/json", "x-requested-with": "m365" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (x.ok && x.d.ok) { say(C.ok.replace("{email}", body.email), true); f.reset(); }
        else say(C.err[x.d.error] || C.err["default"]);
      })
      .catch(function () { say(C.err["default"]); })
      .then(function () { btn.disabled = false; btn.textContent = C.send; });
  });

  /* Kennzahlen-Vorschau: Zahl, Bezeichnung, Quelle und Zeitraum je Kachel (nur Text, nie HTML aus der Antwort) */
  var box = document.getElementById("mk-kpis");
  if (!C.kpis || !box || !window.fetch) return;
  fetch(C.api + "/api/mediakit/summary?brand=" + encodeURIComponent(C.brand || "m365fm"), { credentials: "omit" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || !d.kpis || !d.kpis.length) return;
      var nf; try { nf = new Intl.NumberFormat(C.lang + "-u-nu-latn"); } catch (e) { nf = { format: String }; }
      var pick = function (o) { return (o && (o[C.lang] || o.en)) || ""; };
      var el = function (tag, cls, text) { var n = document.createElement(tag); n.className = cls; n.textContent = text; return n; };
      var list = box.querySelector(".mk-kgrid") || box;
      d.kpis.slice(0, 12).forEach(function (k) {
        var li = document.createElement("li"); li.className = "mk-kpi";
        li.appendChild(el("b", "mk-kv", nf.format(k.value)));
        li.appendChild(el("span", "mk-kl", pick(k.label)));
        var src = pick(k.source), per = pick(k.period);
        li.appendChild(el("small", "mk-ks", src + (per ? " · " + per : "")));
        list.appendChild(li);
      });
      var asof = box.querySelector(".mk-asof");
      if (asof && d.generated) asof.textContent = asof.textContent.replace("{date}", d.generated);
      box.hidden = false;
    })
    .catch(function () { /* Vorschau ist optional: das PDF enthaelt alle Zahlen */ });
})();
