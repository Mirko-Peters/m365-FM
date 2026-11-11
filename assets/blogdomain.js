/* Blog auf der eigenen Domain (BLOG_OWN_DOMAIN.md): Domain eintragen, DNS-Eintrag zum Kopieren, Status mit "Jetzt prüfen", Domain entfernen, Impressum-Link.
   Erscheint nur, wenn der Schalter BYOD im Worker an ist (/api/byod/mine antwortet sonst mit enabled:false) und man angemeldet ist.
   Eigene Datei, Stile aus forms.css/community.css; Texte nur per textContent, alle Oberflächentexte über M365L (en/de, weitere Sprachen über den Worker). */
(function () {
  var M365L = window.M365L || function (de, k, a, b) { return de ? a : b; };
  var X = window.M365X, root = document.getElementById("c-blogdomain"); if (!X || !root) return;
  var de = X.lang === "de";
  function h(tag, a, kids) { var e = document.createElement(tag); for (var k in (a || {})) { if (k === "class") e.className = a[k]; else if (k === "text") e.textContent = a[k]; else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), a[k]); else e.setAttribute(k, a[k]); } (kids || []).forEach(function (c) { if (c) e.appendChild(c); }); return e; }
  function api(path, o) { o = o || {}; o.credentials = "include"; o.headers = Object.assign({ "x-requested-with": "m365" }, o.headers || {}); if (o.body && typeof o.body !== "string") { o.body = JSON.stringify(o.body); o.headers["content-type"] = "application/json"; } return fetch(X.api + path, o).then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j }; }); }); }
  var uid = 0;
  function field(label, el) { var id = "bdm" + (++uid); el.id = id; return h("div", {}, [h("label", { for: id, text: label }), el]); }
  var Q = M365L(de, "blogdomain.Q", {
    h: "Blog auf deiner eigenen Domain", intro: "Dein Blog läuft dann auf einer Domain, die dir gehört (zum Beispiel blog.deine-domain.de), und bleibt Teil von m365.fm: gleiche Beiträge, gleiche Upvotes. Die eigene Domain ist kostenlos. Du trägst nur einen DNS-Eintrag ein.",
    rules: "Regeln: nur eine Unterdomain (blog.deine-domain.de, nicht deine-domain.de), eine Domain je Mitglied, keine Domains von m365.fm oder fremden Marken. Du brauchst ein öffentliches Profil.",
    dom: "Deine Domain", domh: "blog.deine-domain.de", imp: "Link zu deinem Impressum (https, Pflicht vor dem Start)", pri: "Link zu deiner Datenschutzerklärung (https, freiwillig)",
    legal: "Als Betreiber deines Blogs brauchst du nach deutschem Recht ein Impressum. Wir zeigen die Links im Fuß jeder Seite, dazu „Gehostet auf m365.fm“. Die Seiten setzen keine Cookies und laden nichts von Dritten.",
    add: "Domain eintragen", notconf: "Diese Funktion wird gerade eingerichtet. Du kannst die Domain schon eintragen; der DNS-Eintrag folgt, sobald alles bereit ist.",
    st: "Status", s_pending: "Wartet auf den DNS-Eintrag", s_verified: "DNS-Eintrag gefunden, Aktivierung läuft", s_active: "Aktiv", s_blocked: "Gesperrt",
    live: "Dein Blog läuft hier:", step: "So geht es: Lege bei deinem Domain-Anbieter (dort, wo die DNS-Einträge verwaltet werden) diesen Eintrag an.", rt: "Typ", rn: "Name", rv: "Wert",
    copy: "Kopieren", copied: "Kopiert", namehint: "Manche Anbieter wollen als Name nur den Teil vor deiner Hauptdomain (zum Beispiel „blog“).", prop: "Es kann einige Stunden dauern, bis der Eintrag überall sichtbar ist. Danach „Jetzt prüfen“ wählen; wir prüfen auch von selbst weiter.",
    txth: "Ohne Ausfall wechseln (freiwillig)", txtp: "Läuft unter dieser Domain schon eine Seite? Lege vorab zusätzlich diesen TXT-Eintrag an. Wir erkennen dann, dass die Domain dir gehört, bevor du den CNAME umstellst.",
    check: "Jetzt prüfen", busy: "Einen Moment …", remove: "Domain entfernen", rmask: "Domain wirklich entfernen? Dein Blog läuft dann nur noch auf m365.fm.", links: "Links speichern", saved: "✓ Gespeichert.", cfwait: "Das Zertifikat wird eingerichtet. Wir prüfen automatisch weiter.", last: "Zuletzt geprüft",
    d_dns_missing: "Wir finden den DNS-Eintrag noch nicht. Prüfe Typ, Name und Wert und warte ein paar Stunden.", d_dns_unavailable: "Die DNS-Abfrage hat gerade nicht geklappt. Bitte versuche es später noch einmal.", d_not_configured: "Die Funktion ist noch nicht fertig eingerichtet. Bitte später noch einmal.",
    d_need_imprint: "Es fehlt noch der Link zu deinem Impressum. Trage ihn unten ein.", d_cf: "Beim Zertifikat gab es einen Fehler ({c}). Wir versuchen es automatisch noch einmal.", d_blocked: "Diese Domain wurde gesperrt.",
    e_apex_not_allowed: "Bitte eine Unterdomain verwenden, zum Beispiel blog.deine-domain.de.", e_own_domain: "Domains von m365.fm sind nicht erlaubt.", e_saas_zone: "Diese Domain ist für die Plattform reserviert.", e_blocked_suffix: "Auf dieser Endung kann niemand Besitz nachweisen. Bitte eine eigene Domain verwenden.",
    e_brand_domain: "Fremde Marken-Domains sind nicht erlaubt.", e_bad_domain: "Das ist keine gültige Domain.", e_need_profile: "Dafür brauchst du ein öffentliches Profil.", e_limit: "Du hast schon eine Domain. Am Anfang ist eine je Mitglied erlaubt.", e_domain_taken: "Diese Domain ist schon vergeben.",
    e_bad_link: "Der Link muss mit https:// beginnen (kein Kurzlink).", e_rate_limit: "Zu viele Versuche. Bitte später noch einmal.", e_blocked: "Gesperrte Domains kann man nicht entfernen.", e_generic: "Das hat nicht geklappt.",
    adm: "Admin: Blog-Domains", block: "Sperren", unblock: "Freigeben", none: "Keine Domains."
  }, {
    h: "Your blog on your own domain", intro: "Your blog then runs on a domain you own (for example blog.your-domain.com) and stays part of m365.fm: same posts, same upvotes. Your own domain is free. You only add one DNS record.",
    rules: "Rules: a subdomain only (blog.your-domain.com, not your-domain.com), one domain per member, no m365.fm or third-party brand domains. You need a public profile.",
    dom: "Your domain", domh: "blog.your-domain.com", imp: "Link to your legal notice (https, required before go-live)", pri: "Link to your privacy policy (https, optional)",
    legal: "As the operator of your blog you need a legal notice under German law. We show the links in the footer of every page, plus “Hosted on m365.fm”. The pages set no cookies and load nothing from third parties.",
    add: "Add domain", notconf: "This feature is still being set up. You can already add the domain; the DNS record follows as soon as everything is ready.",
    st: "Status", s_pending: "Waiting for the DNS record", s_verified: "DNS record found, activation in progress", s_active: "Active", s_blocked: "Blocked",
    live: "Your blog runs here:", step: "How it works: at your domain provider (where your DNS records are managed) create this record.", rt: "Type", rn: "Name", rv: "Value",
    copy: "Copy", copied: "Copied", namehint: "Some providers want only the part before your main domain as the name (for example “blog”).", prop: "It can take a few hours until the record is visible everywhere. Then choose “Check now”; we also keep checking automatically.",
    txth: "Switch without downtime (optional)", txtp: "Is a site already running on this domain? Create this TXT record first as well. We then see that the domain is yours before you switch the CNAME.",
    check: "Check now", busy: "One moment …", remove: "Remove domain", rmask: "Really remove the domain? Your blog then runs on m365.fm only.", links: "Save links", saved: "✓ Saved.", cfwait: "The certificate is being set up. We keep checking automatically.", last: "Last checked",
    d_dns_missing: "We cannot find the DNS record yet. Check type, name and value and wait a few hours.", d_dns_unavailable: "The DNS lookup did not work just now. Please try again later.", d_not_configured: "The feature is not fully set up yet. Please try again later.",
    d_need_imprint: "The link to your legal notice is still missing. Enter it below.", d_cf: "There was an error with the certificate ({c}). We will try again automatically.", d_blocked: "This domain has been blocked.",
    e_apex_not_allowed: "Please use a subdomain, for example blog.your-domain.com.", e_own_domain: "m365.fm domains are not allowed.", e_saas_zone: "This domain is reserved for the platform.", e_blocked_suffix: "Nobody can prove ownership on this ending. Please use your own domain.",
    e_brand_domain: "Third-party brand domains are not allowed.", e_bad_domain: "That is not a valid domain.", e_need_profile: "You need a public profile for this.", e_limit: "You already have a domain. One per member is allowed at the start.", e_domain_taken: "This domain is already taken.",
    e_bad_link: "The link must start with https:// (no short links).", e_rate_limit: "Too many attempts. Please try again later.", e_blocked: "Blocked domains cannot be removed.", e_generic: "That did not work.",
    adm: "Admin: blog domains", block: "Block", unblock: "Unblock", none: "No domains."
  });
  var msg = h("p", { role: "status", "aria-live": "polite", class: "cmut" }), box = h("div", { class: "bl-box" });
  function say(t) { msg.textContent = t || ""; }
  function errText(r) { var e = r && r.j && r.j.error; return Q["e_" + e] || Q.e_generic; }
  function domErr(d) { var e = d.error || ""; if (!e) return d.status === "verified" && d.cf_status && d.cf_status !== "active" ? Q.cfwait : ""; if (/^cf_/.test(e)) return Q.d_cf.replace("{c}", e.slice(3)); return Q["d_" + e] || ""; }
  function copyBtn(text) {
    var b = h("button", { type: "button", class: "btn", text: Q.copy, onclick: function () {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { b.textContent = Q.copied; setTimeout(function () { b.textContent = Q.copy; }, 1500); }, function () {});
    } }); return b;
  }
  function recTable(rec) {
    var t = h("table", { class: "bdm-rec", style: "border-collapse:collapse;margin:.5em 0" });
    [[Q.rt, rec.type], [Q.rn, rec.name], [Q.rv, rec.value]].forEach(function (r) { t.appendChild(h("tr", {}, [h("th", { text: r[0], scope: "row" }), h("td", {}, [h("code", { text: r[1] })]), h("td", {}, [r[0] === Q.rt ? null : copyBtn(r[1])])])); });
    return t;
  }
  function drawDomain(d) {
    var c = h("div", { class: "bdm-card" }), links = { i: h("input", { type: "url", maxlength: 300, inputmode: "url", placeholder: "https://…", value: d.imprint_url || "" }), p: h("input", { type: "url", maxlength: 300, inputmode: "url", placeholder: "https://…", value: d.privacy_url || "" }) };
    c.appendChild(h("h3", { text: d.domain }));
    c.appendChild(h("p", {}, [h("b", { text: Q.st + ": " }), h("span", { text: Q["s_" + d.status] || d.status })]));
    var e = domErr(d); if (e) c.appendChild(h("p", { class: "cmut", text: e }));
    if (d.status === "active" && d.url) c.appendChild(h("p", {}, [h("span", { text: Q.live + " " }), h("a", { href: d.url, text: d.url })]));
    if (d.status !== "blocked" && d.status !== "active" && d.dns) { c.appendChild(h("p", { text: Q.step })); c.appendChild(recTable(d.dns)); c.appendChild(h("p", { class: "cmut", text: Q.namehint })); c.appendChild(h("p", { class: "cmut", text: Q.prop })); }
    if (d.status !== "blocked" && d.status !== "active" && d.txt) { var det = h("details", {}, [h("summary", { text: Q.txth }), h("p", { class: "cmut", text: Q.txtp }), recTable(d.txt)]); c.appendChild(det); }
    if (d.status !== "blocked") {
      c.appendChild(field(Q.imp, links.i)); c.appendChild(field(Q.pri, links.p)); c.appendChild(h("p", { class: "cmut", text: Q.legal }));
      var bl = h("button", { type: "button", class: "btn", text: Q.links, onclick: function () { say(""); api("/api/byod/links", { method: "POST", body: { id: d.id, imprint_url: links.i.value.trim(), privacy_url: links.p.value.trim() } }).then(function (r) { if (r.s === 200) { say(Q.saved); load(); } else say(errText(r)); }); } });
      var bc = h("button", { type: "button", class: "btn main", text: Q.check, onclick: function () { bc.disabled = true; say(Q.busy); api("/api/byod/check", { method: "POST", body: { id: d.id } }).then(function (r) { bc.disabled = false; say(""); if (r.s === 200) load(); else say(errText(r)); }); } });
      var br = h("button", { type: "button", class: "btn", text: Q.remove, onclick: function () { if (typeof confirm === "function" && !confirm(Q.rmask)) return; api("/api/byod/remove", { method: "POST", body: { id: d.id } }).then(function (r) { if (r.s === 200) { say(""); load(); } else say(errText(r)); }); } });
      c.appendChild(h("p", { class: "btns" }, [bl, " ", bc, " ", br]));
      if (d.checked) c.appendChild(h("p", { class: "cmut", text: Q.last + ": " + new Date(d.checked * 1000).toLocaleString() }));
    }
    return c;
  }
  function drawAdd(j) {
    var f = h("form", { class: "ed-form" }), di = h("input", { type: "text", maxlength: 120, autocomplete: "off", autocapitalize: "none", spellcheck: "false", placeholder: Q.domh }), im = h("input", { type: "url", maxlength: 300, inputmode: "url", placeholder: "https://…" }), pr = h("input", { type: "url", maxlength: 300, inputmode: "url", placeholder: "https://…" });
    f.appendChild(h("p", { class: "cmut", text: Q.rules })); if (!j.profile_public) f.appendChild(h("p", { text: Q.e_need_profile }));
    f.appendChild(field(Q.dom, di)); f.appendChild(field(Q.imp, im)); f.appendChild(field(Q.pri, pr)); f.appendChild(h("p", { class: "cmut", text: Q.legal }));
    if (!j.configured) f.appendChild(h("p", { class: "cmut", text: Q.notconf }));
    var b = h("button", { type: "button", class: "btn main", text: Q.add, onclick: function () { say(Q.busy); api("/api/byod/add", { method: "POST", body: { domain: di.value.trim(), imprint_url: im.value.trim(), privacy_url: pr.value.trim() } }).then(function (r) { if (r.s === 200) { say(""); load(); } else say(errText(r)); }); } });
    f.appendChild(h("p", {}, [b])); f.addEventListener("submit", function (e) { e.preventDefault(); }); return f;
  }
  function admin() {
    var ad = h("div", {}, [h("h3", { text: Q.adm })]);
    api("/api/admin/byod").then(function (r) {
      var it = (r.j && r.j.items) || []; if (!it.length) ad.appendChild(h("p", { class: "cmut", text: Q.none }));
      it.forEach(function (d) {
        var b = h("button", { type: "button", class: "btn", text: d.status === "blocked" ? Q.unblock : Q.block, onclick: function () { api("/api/admin/byod/block", { method: "POST", body: { id: d.id, blocked: d.status !== "blocked" } }).then(function () { load(); }); } });
        ad.appendChild(h("p", {}, [h("code", { text: d.domain }), h("span", { class: "cmut", text: " · " + (d.handle || "") + " · " + (Q["s_" + d.status] || d.status) + " " }), b]));
      });
    });
    return ad;
  }
  var me = null;
  function load() {
    api("/api/byod/mine").then(function (r) {
      var j = r.j || {}; box.textContent = "";
      if (r.s !== 200 || !j.enabled) { root.textContent = ""; return; }   // Funktion aus: nichts anzeigen
      box.appendChild(h("h2", { text: Q.h })); box.appendChild(h("p", { class: "cmut", text: Q.intro }));
      (j.domains || []).forEach(function (d) { box.appendChild(drawDomain(d)); });
      if (j.can_add) box.appendChild(drawAdd(j));
      box.appendChild(msg);
      if (me && me.admin) box.appendChild(admin());
      if (!root.firstChild) root.appendChild(box);
    }).catch(function () {});
  }
  api("/api/me").then(function (r) { me = r.j && r.j.user; if (me) load(); }).catch(function () {});
})();
