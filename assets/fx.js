/* Einziger Effekt neben dem weichen Scrollen (smooth.js): Lichtstreif auf der Hauptueberschrift. Der Text bleibt sofort sichtbar.
   Aus bei reduzierter Bewegung, auf dem Handy und im Barrierefreiheits-Menue "Bewegung reduzieren". */
(function () {
  try {
    var H = document.documentElement;
    // Handy (bis 700 px): kein Lichtstreif - die Ueberschrift ist dort meist das LCP-Element, die Animation malt sie 2,4 s lang neu
    if (H.classList.contains("a11y-nomo") || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce), (max-width: 700px)").matches)) return;
    var h1 = document.querySelector("main h1, h1"); if (h1) h1.classList.add("fx-h");
  } catch (e) {}
})();
