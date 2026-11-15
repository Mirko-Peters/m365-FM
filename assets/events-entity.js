/* Event-Reihe (Event-Entität) zuordnen: Veranstalter wählen für ihre Events die passende Entität (z. B. „Microsoft Ignite“), Admin bestätigt, ändert oder lehnt Vorschläge ab.
   Eigene Datei und eigener Platz (#c-events-entity), damit assets/events.js und assets/events-import.js unverändert bleiben. Nur Event-Entitäten stehen zur Auswahl.
   Öffentlich wird eine Zuordnung erst nach der Bestätigung durch einen Admin. Texte nur per textContent. */
(function () {
  var M365L = window.M365L || function (de, k, a, b) { return de ? a : b; };
  var X = window.M365X, root = document.getElementById("c-events-entity"); if (!X || !root) return;
  var de = X.lang === "de";
  var Q = M365L(de, "events-entity.Q", {
    h: "Event-Reihe zuordnen", intro: "Gehört dein Event zu einer Reihe, die es als Eintrag gibt (z. B. Microsoft Ignite)? Dann zeigt die Seite dieses Eintrags auch dein Event mit Datum, Ort, Sessions und Speakern. Beschreibung und Termine pflegst du nur einmal: die Beschreibung an der Reihe, die Termine an deinem Event.",
    none: "Keine Reihe zugeordnet.", suggested: "Automatischer Vorschlag: {n} – wartet auf die Bestätigung durch die Redaktion.", proposed: "Dein Vorschlag: {n} – wartet auf die Bestätigung durch die Redaktion.", confirmed: "Zugeordnet: {n}.", rejected: "Der Vorschlag „{n}“ wurde abgelehnt.", cleared: "Bewusst keine Reihe zugeordnet.",
    locked: "Eine bestätigte Zuordnung ändert die Redaktion. Schreib uns, wenn sie nicht stimmt.", pick: "Reihe", nopick: "– keine –", save: "Zuordnung speichern", saved: "✓ Gespeichert. Öffentlich wird sie, sobald die Redaktion sie bestätigt hat.", savedadm: "✓ Gespeichert.", err: "Das hat nicht geklappt. Bitte erneut versuchen.",
    adm: "Admin: Event-Reihen", open: "Offene Zuordnungen (Vorschläge und Wünsche der Veranstalter)", noopen: "Keine offenen Zuordnungen.", okb: "Bestätigen", other: "Anders zuordnen", rej: "Ablehnen", clr: "Entfernen", change: "Ändern", done: "Bestätigte Zuordnungen", nodone: "Noch keine bestätigte Zuordnung.",
    how_name: "Name passt", how_similar: "Name ähnlich", how_contains: "Name enthalten", from_orga: "Wunsch des Veranstalters", notpub: "nicht öffentlich", busy: "Einen Moment …"
  }, {
    h: "Assign an event series", intro: "Does your event belong to a series that has its own entry (e.g. Microsoft Ignite)? Then the entry's page also shows your event with date, place, sessions and speakers. You maintain description and dates only once: the description on the series, the dates on your event.",
    none: "No series assigned.", suggested: "Automatic suggestion: {n} – waiting for confirmation by the editors.", proposed: "Your suggestion: {n} – waiting for confirmation by the editors.", confirmed: "Assigned: {n}.", rejected: "The suggestion “{n}” was declined.", cleared: "Deliberately no series assigned.",
    locked: "A confirmed assignment is changed by the editors. Write to us if it is wrong.", pick: "Series", nopick: "– none –", save: "Save assignment", saved: "✓ Saved. It becomes public as soon as the editors have confirmed it.", savedadm: "✓ Saved.", err: "That did not work. Please try again.",
    adm: "Admin: event series", open: "Open assignments (suggestions and requests from organizers)", noopen: "No open assignments.", okb: "Confirm", other: "Assign differently", rej: "Decline", clr: "Remove", change: "Change", done: "Confirmed assignments", nodone: "No confirmed assignment yet.",
    how_name: "name matches", how_similar: "similar name", how_contains: "name contained", from_orga: "request from the organizer", notpub: "not public", busy: "One moment …"
  });
  var de = X.lang === "de", U = window.M365U;
  function h(tag, a, kids) { var e = document.createElement(tag); for (var k in (a || {})) { if (k === "class") e.className = a[k]; else if (k === "text") e.textContent = a[k]; else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), a[k]); else e.setAttribute(k, a[k]); } (kids || []).forEach(function (c) { if (c) e.appendChild(c); }); return e; }
  function api(path, o) { o = o || {}; o.credentials = "include"; o.headers = Object.assign({ "x-requested-with": "m365" }, o.headers || {}); if (o.body && typeof o.body !== "string") { o.body = JSON.stringify(o.body); o.headers["content-type"] = "application/json"; } return fetch(X.api + path, o).then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j }; }); }); }
  function sel(list, v) { var e = h("select"); e.appendChild(h("option", { value: "", text: Q.nopick })); list.forEach(function (o) { e.appendChild(h("option", { value: o.id, text: o.name })); }); e.value = v || ""; return e; }
  function nameOf(list, id) { var f = list.filter(function (x) { return x.id === id; })[0]; return f ? f.name : id; }
  function say(el, t) { el.textContent = t; }

  // Eigene Events: Reihe wählen. Ein Admin setzt direkt (bestätigt), alle anderen schlagen vor.
  function eventRow(ev, ents, me) {
    var l = ev.entity_link || { id: "", state: "" }, msg = h("p", { class: "cmut", role: "status", "aria-live": "polite" }), n = nameOf(ents, l.id);
    var st = l.state === "confirmed" ? Q.confirmed.replace("{n}", n) : l.state === "proposed" ? Q.proposed.replace("{n}", n) : l.state === "suggested" ? Q.suggested.replace("{n}", n) : l.state === "rejected" ? Q.rejected.replace("{n}", n) : l.state === "none" ? Q.cleared : Q.none;
    var box = h("div", { class: "ev-s" }, [h("b", { text: ev.title }), h("p", { class: "cmut", text: st })]);
    if (l.state === "confirmed" && !me.admin) { box.appendChild(h("p", { class: "cmut", text: Q.locked })); return box; }
    var pick = sel(ents, l.state === "rejected" || l.state === "none" ? "" : l.id), id = "ee" + Math.random().toString(36).slice(2, 8); pick.id = id;
    var go = h("button", { type: "button", class: "btn main", text: Q.save, onclick: function () {
      go.disabled = true; say(msg, Q.busy);
      api("/api/events/entity", { method: "POST", body: { handle: ev.handle, entity: pick.value } }).then(function (r) { go.disabled = false; say(msg, r.s === 200 ? (r.j.state === "confirmed" || r.j.state === "none" ? Q.savedadm : Q.saved) : Q.err); });
    } });
    box.appendChild(h("div", {}, [h("label", { for: id, text: Q.pick }), pick])); box.appendChild(h("div", { class: "btns" }, [go])); box.appendChild(msg); return box;
  }

  // Admin: offene Vorschläge/Wünsche bestätigen, anders zuordnen oder ablehnen; bestätigte ändern oder entfernen
  function adminBox() {
    var sec = h("div", {}, [h("h3", { text: Q.adm })]), open = h("div", {}), done = h("div", {}), msg = h("p", { class: "cmut", role: "status", "aria-live": "polite" });
    sec.appendChild(open); sec.appendChild(done); sec.appendChild(msg);
    function post(body, btn) { btn.disabled = true; say(msg, Q.busy); api("/api/admin/events/entity", { method: "POST", body: body }).then(function (r) { say(msg, r.s === 200 ? "" : Q.err); load(); }); }
    function line(it, ents, isOpen) {
      var info = it.title + " · " + String(it.start || "").slice(0, 10) + (it.public ? "" : " · " + Q.notpub), pick = sel(ents, it.entity);
      var row = h("div", { class: "ev-s" }, [h("b", { text: info })]);
      if (isOpen) row.appendChild(h("p", { text: it.entity_name + " · " + (it.state === "proposed" ? Q.from_orga : Q["how_" + it.how] || "") }));
      var b = [];
      if (isOpen) b.push(h("button", { type: "button", class: "btn main", text: Q.okb, onclick: function (e) { post({ id: it.id, action: "confirm", entity: pick.value || undefined }, e.target); } }));
      b.push(h("button", { type: "button", class: "btn", text: isOpen ? Q.other : Q.change, onclick: function (e) { if (pick.value) post({ id: it.id, action: "set", entity: pick.value }, e.target); } }));
      if (isOpen) b.push(h("button", { type: "button", class: "btn", text: Q.rej, onclick: function (e) { post({ id: it.id, action: "reject" }, e.target); } }));
      else b.push(h("button", { type: "button", class: "btn", text: Q.clr, onclick: function (e) { post({ id: it.id, action: "clear" }, e.target); } }));
      row.appendChild(pick); row.appendChild(h("div", { class: "btns" }, b)); return row;
    }
    function load() {
      api("/api/admin/events/entity").then(function (r) {
        var j = r.j || {}, ents = j.entities || [];
        open.textContent = ""; done.textContent = "";
        open.appendChild(h("h4", { text: Q.open })); if (!(j.items || []).length) open.appendChild(h("p", { class: "cmut", text: Q.noopen }));
        (j.items || []).forEach(function (it) { open.appendChild(line(it, ents, true)); });
        done.appendChild(h("h4", { text: Q.done })); if (!(j.confirmed || []).length) done.appendChild(h("p", { class: "cmut", text: Q.nodone }));
        (j.confirmed || []).forEach(function (it) { done.appendChild(line(it, ents, false)); });
      });
    }
    load(); return sec;
  }

  api("/api/me").then(function (r) {
    var me = r.j && r.j.user; if (!me) return;
    Promise.all([api("/api/events/mine"), api("/api/events/entity")]).then(function (a) {
      var evs = ((a[0].j && a[0].j.events) || []).filter(function (e) { return !e.unclaimed; }), ents = (a[1].j && a[1].j.entities) || [];
      if (!ents.length || (!evs.length && !me.admin)) return;   // ohne Event-Entitäten oder eigene Events gibt es nichts zu wählen
      var sec = h("section", { class: "ccard wk-form" }, [h("h2", { text: Q.h }), h("p", { class: "cmut", text: Q.intro })]);
      evs.forEach(function (e) { sec.appendChild(eventRow(e, ents, me)); });
      if (me.admin) sec.appendChild(adminBox());
      root.textContent = ""; root.appendChild(sec);
    });
  }).catch(function () {});
})();
