/* Moderation (/moderation/): dieselbe Liste wie die Redaktion, begrenzt auf Meldungen, Kommentare und Antworten; die uebrigen Warteschlangen sind nur lesbar
   (Empfehlung abgeben). Die Oberflaeche steckt in redaktion.js und wird hier im Moderator-Modus nachgeladen (nur auf dieser Seite). */
(function () {
  var C = window.M365ED = window.M365ED || {}; C.mode = "moderator";
  var s = document.createElement("script"); s.src = (C.base || "") + "/assets/redaktion.js"; s.defer = true; document.head.appendChild(s);
})();
