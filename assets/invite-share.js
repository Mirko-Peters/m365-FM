/* Teilen-Links fuer den persoenlichen Einladungslink: reine Links (kein SDK, keine Fremdskripte) + Referenz-Speicher (30 Tage). */
(function (root) {
  var DAYS = 30, KEY = "m365_ref";
  var TXT = {
    de: { subject: "Einladung zu M365.FM", text: "Ich bin bei M365.FM, der Community rund um Microsoft 365 – komm dazu:" },
    en: { subject: "Invitation to M365.FM", text: "I am on M365.FM, the community around Microsoft 365 – join me:" }
  };
  function texts(lang) { return TXT[String(lang || "en").slice(0, 2) === "de" ? "de" : "en"]; }
  function shareUrls(link, lang) {
    var t = texts(lang), e = encodeURIComponent;
    return {
      linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=" + e(link),
      facebook: "https://www.facebook.com/sharer/sharer.php?u=" + e(link),
      x: "https://twitter.com/intent/tweet?text=" + e(t.text) + "&url=" + e(link),
      whatsapp: "https://wa.me/?text=" + e(t.text + " " + link),
      mail: "mailto:?subject=" + e(t.subject) + "&body=" + e(t.text + "\n\n" + link)
    };
  }
  var ICONS = {
    linkedin: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM10 9.5h3.8v1.6h.1c.5-1 1.8-1.9 3.7-1.9 4 0 4.4 2.6 4.4 6V21h-4v-5c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6V21h-4z",
    facebook: "M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.6V13h2.8v8z",
    x: "M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.2 4.7H5.4z",
    whatsapp: "M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.800-1.1-4.600-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.800s.7-2 1-2.300c.2-.3.500-.3.700-.3h.5c.2 0 .4 0 .6.500l.8 2c.1.2.1.400 0 .5l-.4.600c-.2.200-.3.300-.1.600.2.300.8 1.300 1.700 2 1.1 1 2 1.300 2.300 1.400.3.100.4.100.6-.1l.8-1c.2-.3.400-.2.600-.1l1.900.9c.3.100.5.200.5.300.1.2.1.800-.1 1.400z",
    mail: "M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1 2.600V17h16V7.600l-8 5.400z",
    copy: "M8 8V4h12v12h-4v4H4V8zm2 0h6v6h2V6h-8zm-4 2v8h8v-8z"
  };
  function icon(name) {
    var s = "http://www.w3.org/2000/svg", svg = document.createElementNS(s, "svg"), p = document.createElementNS(s, "path");
    svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("width", "20"); svg.setAttribute("height", "20"); svg.setAttribute("aria-hidden", "true"); svg.setAttribute("fill", "currentColor");
    p.setAttribute("d", ICONS[name]); svg.appendChild(p); return svg;
  }
  // Referenz: nur das Profilkuerzel (Kleinbuchstaben, Ziffern, Bindestrich) + Zeitpunkt, 30 Tage, ausschliesslich im Browser dieser Website
  function cleanRef(r) { r = String(r || "").toLowerCase(); return /^[a-z0-9][a-z0-9-]{1,38}$/.test(r) ? r : ""; }
  function saveRef(ref, store) {
    ref = cleanRef(ref); if (!ref) return false;
    try { (store || root.localStorage).setItem(KEY, JSON.stringify({ r: ref, t: Math.floor(Date.now() / 1000) })); return true; } catch (e) { return false; }
  }
  function readRef(store, nowSec) {
    try {
      var v = JSON.parse((store || root.localStorage).getItem(KEY) || "null"), n = nowSec || Math.floor(Date.now() / 1000);
      if (!v || !cleanRef(v.r) || !(v.t > 0) || n - v.t > DAYS * 86400) return null;
      return { ref: v.r, t: v.t };
    } catch (e) { return null; }
  }
  function clearRef(store) { try { (store || root.localStorage).removeItem(KEY); } catch (e) { /* ignore */ } }
  var api = { shareUrls: shareUrls, texts: texts, icon: icon, cleanRef: cleanRef, saveRef: saveRef, readRef: readRef, clearRef: clearRef, ICONS: ICONS, DAYS: DAYS };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.M365Share = api;
})(typeof window !== "undefined" ? window : globalThis);
