/* Community-Seite (/community/): Skripte eines Bereichs erst laden, wenn der Bereich gebraucht wird (Ladezeit auf dem Handy).
   window.M365LZ = [{ ids: [Plaetze], js: [Skripte], css: [Stylesheets], when: "view" | "idle" }] aus site_community_page.py.
   "view": sobald ein Platz sichtbar ist (Reiter gewaehlt, assets/profile.js setzt hidden) und in die Naehe des Bildschirms kommt.
   "idle": nach dem Laden der Seite (Plaetze ohne Reiter, die nur angemeldet etwas zeigen).
   Jedes Skript einmal, in Listenreihenfolge (async=false; Abhaengigkeiten wie events.js -> window.M365U stehen vorn); Stylesheets einer
   Gruppe vor ihren Skripten. Ohne IntersectionObserver wird alles sofort geladen (wie vorher mit defer). */
(function () {
  var G = window.M365LZ; if (!G || !G.length) return;
  var M = 600, state = {}, wait = {};   // state[url]: 1 = angefragt, 2 = Stylesheet fertig
  function js(src) {
    if (state[src]) return; state[src] = 1;
    var s = document.createElement("script"); s.src = src; s.async = false; document.body.appendChild(s);
  }
  function css(href, done) {
    if (state[href] === 2) return done();
    (wait[href] = wait[href] || []).push(done);
    if (state[href]) return; state[href] = 1;
    var l = document.createElement("link");
    function fin() { if (state[href] === 2) return; state[href] = 2; var w = wait[href]; wait[href] = []; w.forEach(function (f) { f(); }); }
    l.rel = "stylesheet"; l.href = href; l.onload = fin; l.onerror = fin; setTimeout(fin, 4000);   // ohne Stylesheet trotzdem weiter
    document.head.appendChild(l);
  }
  function load(g) {
    if (g.on) return; g.on = 1;
    var c = (g.css || []).slice();
    (function next() { if (c.length) css(c.shift(), next); else (g.js || []).forEach(js); })();
  }
  function els(g) { return (g.ids || []).map(function (id) { return document.getElementById(id); }).filter(Boolean); }
  var list = G.filter(function (g) { return els(g).length; });
  var view = list.filter(function (g) { return g.when !== "idle"; }), idle = list.filter(function (g) { return g.when === "idle"; });
  function afterLoad(fn) {
    function go() { if (window.requestIdleCallback) window.requestIdleCallback(fn, { timeout: 3000 }); else setTimeout(fn, 200); }
    if (document.readyState === "complete") go(); else window.addEventListener("load", go);
  }
  afterLoad(function () { idle.forEach(load); });
  if (!("IntersectionObserver" in window)) { view.forEach(load); return; }
  function near(e) {
    if (!e.getClientRects().length) return false;   // hidden (anderer Reiter)
    var r = e.getBoundingClientRect(), h = window.innerHeight || document.documentElement.clientHeight || 0;
    return r.top < h + M && r.bottom > -M;
  }
  var io = new window.IntersectionObserver(function (x) {
    x.forEach(function (y) { if (!y.isIntersecting) return; view.forEach(function (g) { if (!g.on && els(g).indexOf(y.target) > -1) { load(g); els(g).forEach(function (e) { io.unobserve(e); }); } }); });
  }, { rootMargin: M + "px 0px" });
  view.forEach(function (g) { els(g).forEach(function (e) { io.observe(e); }); });
  // Rueckfall beim Reiterwechsel (Klick oder #Anker): sichtbare Plaetze pruefen, falls der Observer leere Plaetze nicht meldet
  function check() { view.forEach(function (g) { if (!g.on && els(g).some(near)) load(g); }); }
  function soon() { setTimeout(check, 0); }
  window.addEventListener("hashchange", soon);
  document.addEventListener("click", function (e) { var t = e.target; if (t && t.closest && t.closest(".ctab")) soon(); });
})();
