/* Mediadaten-Formular (/media-kit/): sendet Name, Firma, E-Mail an den Worker, der das PDF per E-Mail schickt. */
(function () {
  var C = window.M365MK, f = document.getElementById("mk-form");
  if (!C || !f) return;
  var msg = f.querySelector(".mk-msg"), btn = f.querySelector("button[type=submit]");
  var say = function (t, ok) { msg.textContent = t; msg.className = "mk-msg " + (ok ? "ok" : "err"); };
  f.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var v = function (n) { return (f.elements[n].value || "").trim(); };
    var body = { name: v("name"), company: v("company"), email: v("email"), website: v("website"), consent: f.elements.consent.checked, lang: C.lang, source: location.pathname };
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
})();
