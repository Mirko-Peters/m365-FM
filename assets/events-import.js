/* Event-Import: Sessionize anbinden (Organisator), Sessionize-Profil übernehmen (Speaker), Admin: Dubletten und Community-Days-Import.
   Eigene Datei, damit assets/events.js unverändert bleibt. Stile aus forms.css; Texte nur per textContent. */
(function () {
  var M365L = window.M365L || function (de, k, a, b) { return de ? a : b; };
  var X = window.M365X, root = document.getElementById("c-events-import"); if (!X || !root) return;
  var de = X.lang === "de", U = window.M365U;
  function h(tag, a, kids) { var e = document.createElement(tag); for (var k in (a || {})) { if (k === "class") e.className = a[k]; else if (k === "text") e.textContent = a[k]; else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), a[k]); else e.setAttribute(k, a[k]); } (kids || []).forEach(function (c) { if (c) e.appendChild(c); }); return e; }
  function api(path, o) { o = o || {}; o.credentials = "include"; o.headers = Object.assign({ "x-requested-with": "m365" }, o.headers || {}); if (o.body && typeof o.body !== "string") { o.body = JSON.stringify(o.body); o.headers["content-type"] = "application/json"; } return fetch(X.api + path, o).then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j }; }); }); }
  var uid = 0;
  function field(label, el) { var id = "evi" + (++uid); el.id = id; return h("div", {}, [h("label", { for: id, text: label }), el]); }
  var Q = M365L(de, "events-import.Q", {
    h: "Sessionize und Import", intro: "Events und Sessions aus Sessionize übernehmen. Gleiche Events, Sessions und Speaker aus mehreren Quellen werden automatisch zu einem Eintrag zusammengeführt.",
    org: "Sessionize für dein Event", pick: "Event wählen", apiid: "Sessionize-API-ID", apihint: "Die ID steht in Sessionize unter API / Embed (der Teil der Adresse zwischen /api/v2/ und /view/…). Bitte vertraulich behandeln: Sie wird nirgends angezeigt und nicht veröffentlicht.",
    link: "Verknüpfen und importieren", sync: "Jetzt synchronisieren", unlink: "Verbindung lösen", linked: "Verbunden", notlinked: "Nicht verbunden", lastsync: "Letzter Abgleich", never: "noch nie", sessions: "Sessions",
    ok: "✓ Fertig.", merged: "zusammengeführt", created: "neu", err: "Das hat nicht geklappt – bitte ID prüfen (Endpunkt in Sessionize veröffentlicht?).", busy: "Einen Moment …", forb: "Dafür fehlt die Berechtigung.", ratelimit: "Zu viele Versuche – bitte später erneut.",
    spk: "Ich bin Speaker: Sessionize-Profil übernehmen", spkhint: "Füge die öffentliche Adresse deines Sessionize-Profils ein (sessionize.com/dein-name). Wir lesen nur diese eine Seite, nur auf deinen Wunsch.", url: "Sessionize-Profil-URL", find: "Sessions suchen",
    check: "Diese Sessions übernehmen?", take: "Ausgewählte übernehmen", none: "Nichts ausgewählt.", done: "✓ Übernommen: {n} Session(s). Dein Profil ist als bestätigter Speaker eingetragen.", fallback: "Bitte Event-Seite oder Session-Link einfügen.", notyours: "Der Name auf diesem Profil passt nicht zu deinem Konto.", needprof: "Lege zuerst ein öffentliches Profil an.", expired: "Die Vorschau ist abgelaufen – bitte erneut suchen.",
    adm: "Admin: Import und Dubletten", imp: "Community Days jetzt importieren", dry: "Nur Probelauf (nichts speichern)", res: "Ergebnis", dupes: "Mögliche Dubletten", nodupes: "Keine offenen Dubletten.", mergeb: "Zusammenführen", keep: "Getrennt lassen", undo: "Rückgängig", reason: "Grund", kind_event: "Event", kind_session: "Session", kind_speaker: "Speaker", claims: "Beanspruchte Events", approve: "Freigeben", reject: "Ablehnen", noclaims: "Keine offenen Anfragen."
  }, {
    h: "Sessionize and import", intro: "Import events and sessions from Sessionize. The same event, session or speaker arriving from several sources is combined into one entry automatically.",
    org: "Sessionize for your event", pick: "Choose event", apiid: "Sessionize API ID", apihint: "You find the ID in Sessionize under API / Embed (the part of the address between /api/v2/ and /view/…). Please keep it confidential: it is never shown or published.",
    link: "Connect and import", sync: "Synchronize now", unlink: "Disconnect", linked: "Connected", notlinked: "Not connected", lastsync: "Last sync", never: "never", sessions: "sessions",
    ok: "✓ Done.", merged: "combined", created: "new", err: "That did not work – please check the ID (is the endpoint published in Sessionize?).", busy: "One moment …", forb: "You do not have permission for this.", ratelimit: "Too many attempts – please try again later.",
    spk: "I am a speaker: import my Sessionize profile", spkhint: "Paste the public address of your Sessionize profile (sessionize.com/your-name). We read only this one page, only because you asked.", url: "Sessionize profile URL", find: "Find sessions",
    check: "Import these sessions?", take: "Import selected", none: "Nothing selected.", done: "✓ Imported: {n} session(s). Your profile is listed as a confirmed speaker.", fallback: "Please paste the event page or a session link.", notyours: "The name on this profile does not match your account.", needprof: "Create a public profile first.", expired: "The preview expired – please search again.",
    adm: "Admin: import and duplicates", imp: "Import Community Days now", dry: "Dry run only (save nothing)", res: "Result", dupes: "Possible duplicates", nodupes: "No open duplicates.", mergeb: "Combine", keep: "Keep separate", undo: "Undo", reason: "Reason", kind_event: "Event", kind_session: "Session", kind_speaker: "Speaker", claims: "Claimed events", approve: "Approve", reject: "Reject", noclaims: "No open requests."
  });
  function say(el, t) { el.textContent = t; }
  function errText(r) { var e = r.j && r.j.error; return e === "forbidden" ? Q.forb : e === "rate_limit" ? Q.ratelimit : e === "parse_failed" || e === "no_events" || e === "no_sessions" || e === "no_name" || e === "robots" ? Q.fallback : e === "not_your_profile" ? Q.notyours : e === "need_profile" ? Q.needprof : e === "expired" ? Q.expired : e === "bad_url" ? Q.fallback : Q.err; }

  function eventBox(ev) {
    var msg = h("p", { class: "cmut", role: "status", "aria-live": "polite" }), state = h("p", { class: "cmut" }), box = h("div", { class: "ev-s" }, [h("b", { text: ev.title }), state]);
    var idIn = h("input", { type: "password", autocomplete: "off", maxlength: 60, spellcheck: "false" }); box.appendChild(field(Q.apiid, idIn)); box.appendChild(h("p", { class: "cmut", text: Q.apihint }));
    function refresh() { api("/api/event/" + ev.handle + "/sessionize").then(function (r) { if (r.s !== 200) { say(state, Q.forb); return; } var j = r.j; say(state, (j.linked ? Q.linked : Q.notlinked) + " · " + Q.lastsync + ": " + (j.synced ? new Date(j.synced * 1000).toLocaleString(de ? "de-DE" : "en-GB") : Q.never) + " · " + j.sessions + " " + Q.sessions); }); }
    function run(path, body, btn) { btn.disabled = true; say(msg, Q.busy); api(path, { method: "POST", body: body }).then(function (r) { btn.disabled = false; if (r.s === 200) { var s = r.j.sync || r.j; say(msg, Q.ok + (s.created != null ? " " + s.created + " " + Q.created + ", " + (s.merged || 0) + " " + Q.merged : "")); idIn.value = ""; refresh(); } else say(msg, errText(r)); }); }
    var bLink = h("button", { type: "button", class: "btn main", text: Q.link, onclick: function () { run("/api/event/" + ev.handle + "/sessionize", { api_id: idIn.value.trim() }, bLink); } });
    var bSync = h("button", { type: "button", class: "btn", text: Q.sync, onclick: function () { run("/api/event/" + ev.handle + "/sessionize/sync", {}, bSync); } });
    var bOff = h("button", { type: "button", class: "btn", text: Q.unlink, onclick: function () { run("/api/event/" + ev.handle + "/sessionize", { api_id: "" }, bOff); } });
    box.appendChild(h("div", { class: "btns" }, [bLink, bSync, bOff])); box.appendChild(msg); refresh(); return box;
  }
  function speakerBox() {
    var sec = h("div", {}, [h("h3", { text: Q.spk }), h("p", { class: "cmut", text: Q.spkhint })]), msg = h("p", { class: "cmut", role: "status", "aria-live": "polite" }), list = h("div", {});
    var urlIn = h("input", { type: "url", maxlength: 200, inputmode: "url", placeholder: "https://sessionize.com/…" }), token = "";
    sec.appendChild(field(Q.url, urlIn));
    var find = h("button", { type: "button", class: "btn main", text: Q.find, onclick: function () {
      find.disabled = true; say(msg, Q.busy); list.textContent = "";
      api("/api/events/import/sessionize-profile/preview", { method: "POST", body: { url: urlIn.value.trim() } }).then(function (r) {
        find.disabled = false; if (r.s !== 200) { say(msg, errText(r)); return; } say(msg, ""); token = r.j.token;
        list.appendChild(h("h4", { text: Q.check })); var boxes = [], last = "";
        r.j.items.forEach(function (it) {
          if (it.event !== last) { last = it.event; list.appendChild(h("p", { class: "cmut", text: it.event + (it.date ? " · " + it.date : "") + (it.place ? " · " + it.place : "") })); }
          var cb = h("input", { type: "checkbox", value: it.id }); cb.checked = true; boxes.push(cb); list.appendChild(h("label", {}, [cb, h("span", { text: " " + it.session })]));
        });
        var go = h("button", { type: "button", class: "btn main", text: Q.take, onclick: function () {
          var picked = boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; }); if (!picked.length) { say(msg, Q.none); return; }
          go.disabled = true; api("/api/events/import/sessionize-profile/confirm", { method: "POST", body: { token: token, items: picked } }).then(function (c) { go.disabled = false; if (c.s === 200) { list.textContent = ""; say(msg, Q.done.replace("{n}", c.j.sessions)); } else say(msg, errText(c)); }); } });
        list.appendChild(h("div", { class: "btns" }, [go]));
      });
    } });
    sec.appendChild(h("div", { class: "btns" }, [find])); sec.appendChild(msg); sec.appendChild(list); return sec;
  }
  function adminBox() {
    var sec = h("div", {}, [h("h3", { text: Q.adm })]), msg = h("p", { class: "cmut", role: "status", "aria-live": "polite" }), out = h("pre", { class: "cmut" }), dupes = h("div", {}), claims = h("div", {});
    var dry = h("input", { type: "checkbox" }); dry.checked = true;
    sec.appendChild(h("label", {}, [dry, h("span", { text: " " + Q.dry })]));
    var go = h("button", { type: "button", class: "btn main", text: Q.imp, onclick: function () { go.disabled = true; say(msg, Q.busy); api("/api/admin/events/import", { method: "POST", body: { dry_run: dry.checked } }).then(function (r) { go.disabled = false; say(msg, r.s === 200 ? Q.res : Q.err); out.textContent = r.s === 200 ? JSON.stringify(r.j, null, 1) : ""; loadDupes(); }); } });
    sec.appendChild(h("div", { class: "btns" }, [go])); sec.appendChild(msg); sec.appendChild(out); sec.appendChild(dupes); sec.appendChild(claims);
    function side(x) { return x ? (x.title || x.name || "") + (x.start ? " · " + x.start : "") + (x.city ? " · " + x.city : "") + (x.event ? " · " + x.event : "") : "?"; }
    function loadDupes() {
      api("/api/admin/events/dupes").then(function (r) {
        dupes.textContent = ""; dupes.appendChild(h("h4", { text: Q.dupes })); var l = (r.j && r.j.items) || []; if (!l.length) dupes.appendChild(h("p", { class: "cmut", text: Q.nodupes }));
        l.forEach(function (d) {
          var m = h("span", { class: "cmut", role: "status" }), row = h("div", { class: "ev-s" }, [h("b", { text: Q["kind_" + d.kind] || d.kind }), h("p", { text: side(d.a) + "  ↔  " + side(d.b) }), h("p", { class: "cmut", text: Q.reason + ": " + d.reason })]);
          function decide(action, btn) { btn.disabled = true; api("/api/admin/events/dupes", { method: "POST", body: { id: d.id, action: action } }).then(function (x) { if (x.s !== 200) { btn.disabled = false; say(m, Q.err); return; } row.textContent = ""; if (x.j.log) { var u = h("button", { type: "button", class: "btn", text: Q.undo, onclick: function () { u.disabled = true; api("/api/admin/events/unmerge", { method: "POST", body: { log: x.j.log } }).then(function () { loadDupes(); }); } }); row.appendChild(h("div", { class: "btns" }, [h("span", { text: Q.ok }), u])); } else row.appendChild(h("span", { text: Q.ok })); }); }
          var b1 = h("button", { type: "button", class: "btn main", text: Q.mergeb, onclick: function () { decide("merge", b1); } }), b2 = h("button", { type: "button", class: "btn", text: Q.keep, onclick: function () { decide("separate", b2); } });
          row.appendChild(h("div", { class: "btns" }, [b1, b2])); row.appendChild(m); dupes.appendChild(row);
        });
      });
      api("/api/admin/events/claims").then(function (r) {
        claims.textContent = ""; var l = (r.j && r.j.items) || []; claims.appendChild(h("h4", { text: Q.claims })); if (!l.length) claims.appendChild(h("p", { class: "cmut", text: Q.noclaims }));
        l.forEach(function (c) { function dec(ok) { api("/api/admin/events/claim", { method: "POST", body: { event_id: c.event_id, user_id: c.user_id, ok: ok } }).then(loadDupes); }
          claims.appendChild(h("div", { class: "ev-s" }, [h("b", { text: c.title }), h("span", { class: "cmut", text: " · " + c.name }), h("div", { class: "btns" }, [h("button", { type: "button", class: "btn main", text: Q.approve, onclick: function () { dec(true); } }), h("button", { type: "button", class: "btn", text: Q.reject, onclick: function () { dec(false); } })])])); });
      });
    }
    loadDupes(); return sec;
  }
  api("/api/me").then(function (r) {
    var me = r.j && r.j.user; if (!me) return;
    var sec = h("section", { class: "ccard wk-form" }, [h("h2", { text: Q.h }), h("p", { class: "cmut", text: Q.intro })]); root.textContent = ""; root.appendChild(sec);
    api("/api/events/mine").then(function (m) {
      var evs = ((m.j && m.j.events) || []).filter(function (e) { return !e.unclaimed; });
      if (evs.length) { sec.appendChild(h("h3", { text: Q.org })); evs.forEach(function (e) { sec.appendChild(eventBox(e)); }); }
      sec.appendChild(speakerBox()); if (me.admin) sec.appendChild(adminBox());
    });
  }).catch(function () {});
})();
