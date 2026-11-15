/* Anhoeren-Karten und "Show folgen" (site_listen.py): das Ziel richtet sich nach dem Geraet.
   Apple-Geraete (iPhone, iPad, Mac) -> Apple Podcasts, alle anderen -> Spotify; fehlt ein Ziel, nimmt die Karte das andere, fehlen beide, bleibt das href (m365.fm-Folgenseite).
   Ohne dieses Skript funktioniert alles weiter: die Karte fuehrt auf die Folgenseite, beim "Show folgen" stehen beide Links gleichwertig da.
   Datenschutz: nur User-Agent und Plattform des Browsers werden gelesen, nichts gespeichert (kein Cookie, kein Browser-Speicher), nichts gesendet, keine Parameter an den Zielen.
   Zaehlen laesst sich spaeter ueber data-card am Link (1, 2, 3, entity, episode) im Worker, ohne dass dieses Skript etwas meldet. */
(function (root) {
  "use strict";

  // Gleiche Regel wie das Kopfskript der Seiten (generate_site.py, A11Y_EARLY) und assets/page.js.
  function isApple(ua, platform, touchPoints) {
    ua = ua || ""; platform = platform || "";
    return /iPhone|iPad|iPod|Macintosh|Mac OS X/.test(ua) || /Mac|iPhone|iPad/.test(platform) || ((touchPoints || 0) > 1 && /Mac/.test(platform));
  }

  // Ziel nach Geraet; leer, wenn die Karte kein App-Ziel kennt (dann bleibt das href der Folgenseite).
  function pick(apple, spotify, onApple) {
    apple = apple || ""; spotify = spotify || "";
    return onApple ? (apple || spotify) : (spotify || apple);
  }

  function wire(doc, onApple) {
    var cards = doc.querySelectorAll(".ls-card[data-apple],.ls-card[data-spotify]");
    Array.prototype.forEach.call(cards, function (card) {
      var a = card.querySelector("a.ls-main");
      var u = pick(card.getAttribute("data-apple"), card.getAttribute("data-spotify"), onApple);
      if (!a || !u) return;
      a.setAttribute("href", u);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    });
    var bars = doc.querySelectorAll(".ls-follow");
    Array.prototype.forEach.call(bars, function (bar) {
      var apple = bar.querySelector("a[data-lp=apple]"), spot = bar.querySelector("a[data-lp=spotify]");
      var main = onApple ? (apple || spot) : (spot || apple);
      var alt = main === apple ? spot : apple;
      if (!main) return;
      main.classList.remove("ls-alt"); main.classList.add("ls-btn");
      if (alt) {
        alt.classList.remove("ls-btn"); alt.classList.add("ls-alt");
        if (main.parentNode && main.parentNode === alt.parentNode) main.parentNode.insertBefore(main, main.parentNode.firstChild);
      }
    });
  }

  var api = { isApple: isApple, pick: pick, wire: wire };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document !== "undefined" && typeof navigator !== "undefined") {
    try { wire(document, isApple(navigator.userAgent, navigator.platform, navigator.maxTouchPoints)); } catch (e) { /* Karte bleibt ein normaler Link */ }
  }
})(this);
