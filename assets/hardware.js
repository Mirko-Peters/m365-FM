/* Hardware-Sponsoring (/hardware/): sendet die Bewerbung an POST /api/hardware (worker/src/hardware.js).
   Konfiguration window.M365HW = {api, lang, ok, err, sending, send}. Ohne Abhaengigkeiten. Fehlerschluessel kommen vom Worker (name, company, email, product, product_url, ships, consent, rate_limit). */
(function () {
  var C = window.M365HW, f = document.getElementById("hw-form");
  if (!C || !f) return;
  var msg = f.querySelector(".hw-msg"), btn = f.querySelector("button[type=submit]");
  var say = function (t, ok) { msg.textContent = t; msg.className = "hw-msg " + (ok ? "ok" : "err"); };
  f.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var v = function (n) { return (f.elements[n].value || "").trim(); };
    var offers = Array.prototype.map.call(f.querySelectorAll("input[name=offers]:checked"), function (i) { return i.value; });
    var body = { name: v("name"), company: v("company"), email: v("email"), product: v("product"), product_url: v("product_url"), category: v("category"), quantity: Number(v("quantity")) || 1,
      ship_by: v("ship_by"), offers: offers, message: v("message"), website: v("website"), ships: f.elements.ships.checked, consent: f.elements.consent.checked, lang: C.lang, source: location.pathname.slice(0, 60) };
    if (body.name.length < 2) return say(C.err.name);
    if (body.company.length < 2) return say(C.err.company);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(body.email)) return say(C.err.email);
    if (body.product.length < 2) return say(C.err.product);
    if (!/^https:\/\/[^\s/]+\.[^\s/]+/i.test(body.product_url)) return say(C.err.product_url);
    if (!body.ships) return say(C.err.ships);
    if (!body.consent) return say(C.err.consent);
    btn.disabled = true; btn.textContent = C.sending; msg.textContent = "";
    fetch(C.api + "/api/hardware", { method: "POST", credentials: "omit", headers: { "content-type": "application/json", "x-requested-with": "m365" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (x.ok && x.d.ok) { say(C.ok.replace("{email}", body.email), true); f.reset(); }
        else say(C.err[x.d.error] || C.err["default"]);
      })
      .catch(function () { say(C.err["default"]); })
      .then(function () { btn.disabled = false; btn.textContent = C.send; });
  });
})();
