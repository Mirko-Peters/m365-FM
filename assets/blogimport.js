/* Blog-Import (BLOG_OWN_DOMAIN.md): Beiträge aus dem RSS- oder Atom-Feed einer bestehenden Seite als ENTWÜRFE übernehmen.
   Erscheint nur, wenn der Schalter BYOD im Worker an ist (/api/byod/mine antwortet sonst mit enabled:false) und man angemeldet ist.
   Nie automatisch veröffentlichen, immer mit Quelle; Bilder werden nie kopiert; Volltext nur nach Bestätigung der Rechte. Texte nur per textContent, Oberflächentexte über M365L (en/de). */
(function () {
  var M365L = window.M365L || function (de, k, a, b) { return de ? a : b; };
  var X = window.M365X, root = document.getElementById("c-blogimport"); if (!X || !root) return;
  var de = X.lang === "de";
  function h(tag, a, kids) { var e = document.createElement(tag); for (var k in (a || {})) { if (k === "class") e.className = a[k]; else if (k === "text") e.textContent = a[k]; else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), a[k]); else e.setAttribute(k, a[k]); } (kids || []).forEach(function (c) { if (c) e.appendChild(c); }); return e; }
  function api(path, o) { o = o || {}; o.credentials = "include"; o.headers = Object.assign({ "x-requested-with": "m365" }, o.headers || {}); if (o.body && typeof o.body !== "string") { o.body = JSON.stringify(o.body); o.headers["content-type"] = "application/json"; } return fetch(X.api + path, o).then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j }; }); }); }
  var uid = 0;
  function field(label, el) { var id = "bim" + (++uid); el.id = id; return h("div", {}, [h("label", { for: id, text: label }), el]); }
  var Q = M365L(de, "blogimport.Q", {
    h: "Bestehenden Blog übernehmen", intro: "Du hast schon einen Blog? Gib die Adresse seines Feeds (RSS oder Atom) ein, wähle die Beiträge aus und übernimm sie als Entwürfe. Nichts wird automatisch veröffentlicht: Du liest jeden Entwurf durch und veröffentlichst ihn selbst.",
    feed: "Adresse des Feeds (https)", feedh: "https://deine-seite.de/feed.xml", load: "Beiträge laden", busy: "Einen Moment …",
    pick: "Beiträge zum Übernehmen", all: "Alle auswählen", imported: "schon übernommen", full_in_feed: "Volltext im Feed", no_full: "nur Kurzfassung im Feed", imgs: "{n} Bild(er) werden nicht kopiert",
    mode: "Was soll übernommen werden?", m_ex: "Nur Titel, Kurzfassung und Link zur Quelle (empfohlen)", m_full: "Den ganzen Text (nur für eigene Texte)",
    rights: "Ich bestätige: Die Texte sind von mir, oder ich habe das Recht, sie hier zu veröffentlichen.", rightsw: "Ohne diese Bestätigung übernehmen wir nur die Kurzfassung.",
    imgnote: "Bilder werden nie kopiert. Lade eigene Bilder später bei deinem Beitrag hoch. Zu jedem Entwurf gehört ein Hinweis auf den Originalbeitrag.",
    go: "Als Entwürfe übernehmen", sel0: "Bitte wähle mindestens einen Beitrag aus.",
    done: "✓ {n} Entwurf/Entwürfe angelegt. Du findest sie bei deinen Blog-Beiträgen und kannst sie dort prüfen und veröffentlichen.", skipped: "{n} übersprungen (schon übernommen, zu kurz oder nicht mehr im Feed).", imgsum: "Hinweis: {n} Bild(er) wurden nicht kopiert.",
    e_bad_feed_url: "Das ist keine gültige Feed-Adresse. Sie muss mit https:// beginnen und zu einer fremden Seite gehören.", e_feed_http: "Der Feed ließ sich nicht abrufen. Prüfe die Adresse.", e_feed_unreachable: "Die Seite antwortet gerade nicht. Bitte versuche es später noch einmal.",
    e_not_a_feed: "Unter dieser Adresse liegt kein RSS- oder Atom-Feed.", e_no_items: "Im Feed wurden keine Beiträge gefunden.", e_rights_required: "Für den ganzen Text brauchen wir deine Bestätigung der Rechte.", e_rate_limit: "Zu viele Versuche oder zu viele Beiträge heute. Bitte später noch einmal.",
    e_nothing_selected: "Bitte wähle mindestens einen Beitrag aus.", e_generic: "Das hat nicht geklappt. Bitte versuche es noch einmal."
  }, {
    h: "Bring over your existing blog", intro: "Already have a blog? Enter the address of its feed (RSS or Atom), pick the posts and import them as drafts. Nothing is published automatically: you read each draft and publish it yourself.",
    feed: "Feed address (https)", feedh: "https://your-site.com/feed.xml", load: "Load posts", busy: "One moment …",
    pick: "Posts to import", all: "Select all", imported: "already imported", full_in_feed: "full text in feed", no_full: "only a summary in the feed", imgs: "{n} image(s) will not be copied",
    mode: "What should be imported?", m_ex: "Title, summary and link to the source only (recommended)", m_full: "The full text (your own texts only)",
    rights: "I confirm: I wrote these texts, or I have the right to publish them here.", rightsw: "Without this confirmation we only import the summary.",
    imgnote: "Images are never copied. Upload your own images to the post later. Every draft carries a reference to the original post.",
    go: "Import as drafts", sel0: "Please select at least one post.",
    done: "✓ {n} draft(s) created. You find them with your blog posts, where you can review and publish them.", skipped: "{n} skipped (already imported, too short or no longer in the feed).", imgsum: "Note: {n} image(s) were not copied.",
    e_bad_feed_url: "That is not a valid feed address. It must start with https:// and belong to a third-party site.", e_feed_http: "The feed could not be fetched. Check the address.", e_feed_unreachable: "The site is not answering right now. Please try again later.",
    e_not_a_feed: "There is no RSS or Atom feed at this address.", e_no_items: "No posts were found in the feed.", e_rights_required: "For the full text we need your confirmation of the rights.", e_rate_limit: "Too many attempts or too many posts today. Please try again later.",
    e_nothing_selected: "Please select at least one post.", e_generic: "That did not work. Please try again."
  });
  var msg = h("p", { role: "status", "aria-live": "polite", class: "cmut" }), box = h("div", { class: "bl-box" }), list = h("div", {}), feedUrl = "", items = [];
  function say(t) { msg.textContent = t || ""; }
  function errText(r) { var e = r && r.j && r.j.error; return Q["e_" + e] || Q.e_generic; }
  function sub(s, n) { return s.replace("{n}", String(n)); }
  function drawList(feed) {
    list.textContent = ""; var checks = [];
    list.appendChild(h("h3", { text: Q.pick + (feed && feed.title ? " – " + feed.title : "") }));
    items.forEach(function (it) {
      var cb = h("input", { type: "checkbox" }); cb.checked = false; cb.disabled = !!it.imported; checks.push({ it: it, cb: cb });
      var meta = [it.date, it.imported ? Q.imported : (it.has_full ? Q.full_in_feed : Q.no_full)]; if (it.images) meta.push(sub(Q.imgs, it.images));
      list.appendChild(h("p", {}, [h("label", {}, [cb, h("b", { text: " " + it.title })]), h("br"), h("span", { class: "cmut", text: meta.filter(Boolean).join(" · ") }), it.summary ? h("br") : null, it.summary ? h("span", { class: "cmut", text: it.summary }) : null]));
    });
    list.appendChild(h("button", { type: "button", class: "btn", text: Q.all, onclick: function () { checks.forEach(function (c) { if (!c.cb.disabled) c.cb.checked = true; }); } }));
    var rEx = h("input", { type: "radio", name: "bim-mode", value: "excerpt" }), rFull = h("input", { type: "radio", name: "bim-mode", value: "full" }), rights = h("input", { type: "checkbox" });
    rEx.checked = true; rFull.checked = false; rights.checked = false;
    list.appendChild(h("fieldset", {}, [h("legend", { text: Q.mode }), h("p", {}, [h("label", {}, [rEx, h("span", { text: " " + Q.m_ex })])]), h("p", {}, [h("label", {}, [rFull, h("span", { text: " " + Q.m_full })])]),
      h("p", {}, [h("label", {}, [rights, h("span", { text: " " + Q.rights })])]), h("p", { class: "cmut", text: Q.rightsw })]));
    list.appendChild(h("p", { class: "cmut", text: Q.imgnote }));
    var go = h("button", { type: "button", class: "btn main", text: Q.go, onclick: function () {
      var keys = checks.filter(function (c) { return c.cb.checked && !c.cb.disabled; }).map(function (c) { return c.it.key; });
      if (!keys.length) { say(Q.sel0); return; }
      var full = !!rFull.checked, body = { feed_url: feedUrl, keys: keys, mode: full ? "full" : "excerpt", lang: X.lang };
      if (full) body.rights = !!rights.checked;   // true nur, wenn das Mitglied das Häkchen selbst gesetzt hat
      go.disabled = true; say(Q.busy);
      api("/api/byod/import/save", { method: "POST", body: body }).then(function (r) {
        go.disabled = false;
        if (r.s !== 200) { say(errText(r)); return; }
        var created = (r.j.created || []), sk = (r.j.skipped || []), imgs = created.reduce(function (n, c) { return n + (c.images_not_copied || 0); }, 0);
        var t = sub(Q.done, created.length); if (sk.length) t += " " + sub(Q.skipped, sk.length); if (imgs) t += " " + sub(Q.imgsum, imgs); say(t);
        items.forEach(function (it) { if (keys.indexOf(it.key) >= 0 && created.length) it.imported = it.imported || (sk.filter(function (s) { return s.key === it.key; }).length === 0); }); drawList(feed);
      }).catch(function () { go.disabled = false; say(Q.e_generic); });
    } });
    list.appendChild(h("p", {}, [go]));
  }
  function build() {
    var fi = h("input", { type: "url", maxlength: 300, inputmode: "url", autocomplete: "off", autocapitalize: "none", spellcheck: "false", placeholder: Q.feedh });
    var lb = h("button", { type: "button", class: "btn main", text: Q.load, onclick: function () {
      var u = fi.value.trim(); say(Q.busy); list.textContent = "";
      api("/api/byod/import/preview", { method: "POST", body: { feed_url: u } }).then(function (r) {
        if (r.s !== 200) { say(errText(r)); return; }
        say(""); feedUrl = u; items = (r.j.items || []); drawList(r.j.feed);
      }).catch(function () { say(Q.e_generic); });
    } });
    var f = h("form", { class: "ed-form" }, [field(Q.feed, fi), h("p", {}, [lb])]); f.addEventListener("submit", function (e) { e.preventDefault(); });
    box.appendChild(h("h2", { text: Q.h })); box.appendChild(h("p", { class: "cmut", text: Q.intro })); box.appendChild(f); box.appendChild(list); box.appendChild(msg); root.appendChild(box);
  }
  api("/api/me").then(function (r) {
    if (!(r.j && r.j.user)) return;
    return api("/api/byod/mine").then(function (m) { if (m.s === 200 && m.j && m.j.enabled) build(); });   // Funktion aus: nichts anzeigen
  }).catch(function () {});
})();
