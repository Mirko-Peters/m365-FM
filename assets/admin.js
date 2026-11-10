/* Verwaltung ohne Code (/admin/): Uebersicht, Entitaeten bearbeiten, Datenbank, Schalter. Nur fuer Admins; alles laeuft ueber die bestehende Community-API.
   window.M365ADM = {api, base} */
(function () {
  var C = window.M365ADM || {}, API = C.api, BASE = C.base || "", root = document.getElementById("adm"); if (!root || !API) return;
  // mailto-Link: Adresse kodieren, damit ?cc=/&body= aus einer eingeschleusten Adresse nicht als Mail-Parameter wirken
  function mailto(a) { return "mailto:" + encodeURIComponent(String(a || "")).replace(/%40/g, "@"); }
  // Lead-Status (Mediadaten-Anfragen und Werbung > Leads): stabile Schluessel, Badge, Auswahl, Zaehler, Loeschen mit Rueckfrage im Zeilen-Feld
  var LEAD_ST = [["open", "offen", "#fde68a", "#5b4300"], ["in_progress", "in Bearbeitung", "#bfdbfe", "#0b2e66"], ["closed_lost", "geschlossen – verloren", "#fecaca", "#6b1111"], ["closed_won", "geschlossen – gewonnen", "#bbf7d0", "#0b4a1f"]];
  function leadSt(k) { for (var i = 0; i < LEAD_ST.length; i++) if (LEAD_ST[i][0] === k) return LEAD_ST[i]; return LEAD_ST[0]; }
  function leadBadge(k) { var o = leadSt(k); return h("span", { class: "adm-badge", "data-status": o[0], style: "display:inline-block;padding:.1em .6em;border-radius:1em;font-size:.85em;white-space:nowrap;background:" + o[2] + ";color:" + o[3], text: o[1] }); }
  function leadFilterSel() { var s = h("select", { "aria-label": "Lead-Status filtern" }); [["", "Alle Status"]].concat(LEAD_ST).forEach(function (o) { s.appendChild(h("option", { value: o[0], text: o[1] })); }); return s; }
  function leadCounts(list, key) { var n = {}; list.forEach(function (x) { var k = leadSt(x[key]) [0]; n[k] = (n[k] || 0) + 1; }); return h("p", { class: "mut" }, LEAD_ST.map(function (o) { return h("span", { style: "margin-right:.8em" }, [leadBadge(o[0]), " " + (n[o[0]] || 0)]); })); }
  function leadStatusSel(x, key, url, msgEl, done) {   // POST {action:"status"}; bei Fehler zurueck auf den alten Wert
    var sel = h("select", { "aria-label": "Status für " + (x.name || x.id) }); LEAD_ST.forEach(function (o) { var op = h("option", { value: o[0], text: o[1] }); if (leadSt(x[key])[0] === o[0]) op.selected = true; sel.appendChild(op); });
    sel.addEventListener("change", function () { var old = x[key]; sel.disabled = true;
      api(url, { method: "POST", body: { action: "status", id: x.id, status: sel.value } }).then(function (r) { sel.disabled = false;
        if (r.s === 200) { x[key] = sel.value; done(); } else { sel.value = leadSt(old)[0]; msg(msgEl, "Status konnte nicht gespeichert werden (" + ((r.j || {}).error || r.s) + ")", true); } }); });
    return sel;
  }
  function leadDelete(x, url, msgEl, done) {   // Button -> "Wirklich löschen? Ja / Nein"; Ja loescht die Zeile endgueltig (personenbezogene Daten)
    var box = h("span");
    function idle() { box.textContent = ""; box.appendChild(h("button", { type: "button", class: "btn", text: "Löschen", "aria-label": "Lead löschen: " + (x.name || x.id), onclick: ask })); }
    function ask() { box.textContent = ""; box.append(h("span", { text: "Wirklich löschen? " }), h("button", { type: "button", class: "btn main", text: "Ja", onclick: function () {
        api(url, { method: "POST", body: { action: "delete", id: x.id } }).then(function (r) { if (r.s === 200) done(); else { idle(); msg(msgEl, "Löschen fehlgeschlagen (" + ((r.j || {}).error || r.s) + ")", true); } }); } }), " ", h("button", { type: "button", class: "btn", text: "Nein", onclick: idle })); }
    idle(); return box;
  }
  function h(t, a, kids) { var e = document.createElement(t); a = a || {}; for (var k in a) { if (k === "text") e.textContent = a[k]; else if (k === "class") e.className = a[k]; else if (k.slice(0, 2) === "on") e[k] = a[k]; else e.setAttribute(k, a[k]); } (kids || []).forEach(function (x) { if (x != null) e.appendChild(typeof x === "string" ? document.createTextNode(x) : x); }); return e; }
  function api(p, o) { o = o || {}; o.credentials = "include"; o.headers = Object.assign({ "x-requested-with": "m365" }, o.headers || {}); if (o.body && typeof o.body !== "string") { o.body = JSON.stringify(o.body); o.headers["content-type"] = "application/json"; } return fetch(API + p, o).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { s: r.status, j: j }; }); }); }
  var TYPES = { product: "Produkt", platform: "Plattform", concept: "Konzept", org: "Firma", person: "Person", cert: "Zertifikat", event: "Event", media: "Medium", category: "Kategorie" };
  var ERR = { bad_name: "Name zu kurz", bad_type: "Typ fehlt", too_short: "Kurzbeschreibung fehlt (mindestens 20 Zeichen in Englisch oder Deutsch)", too_long: "Kurzbeschreibung zu lang (höchstens 300 Zeichen)", bad_url: "Eine Adresse ist ungültig (nur https, Docs nur microsoft.com, azure.com oder github.com)", bad_qid: "Wikidata-ID muss wie Q12345 aussehen", bad_relation: "Eine Beziehung zeigt auf eine unbekannte Entität", unchanged: "Nichts geändert", rate_limit: "Zu viele Änderungen in kurzer Zeit, bitte später", login: "Bitte anmelden", forbidden: "Nur für Admins", email_required: "Kein verifizierter E-Mail-Empfang für diese Person hinterlegt.", mail_off: "E-Mail-Versand ist nicht verfügbar; die Anfrage bleibt offen." };
  var tabs = [["ov", "Übersicht"], ["fr", "Freigaben"], ["sponsor", "Sponsor-Anfragen"], ["slinks", "Sponsorlinks"], ["ads", "Werbung"], ["mk", "Mediadaten-Anfragen"], ["tr", "Übersetzungen"], ["ent", "Entitäten"], ["li", "LinkedIn-Events"], ["mem", "Mitglieder"], ["elog", "Redaktions-Protokoll"], ["db", "Datenbank"], ["sw", "Schalter"]], panes = {}, bar = h("div", { class: "adm-tabs", role: "tablist" });
  var LANGN = { de: "Deutsch", fr: "Französisch", es: "Spanisch", it: "Italienisch", nl: "Niederländisch", pt: "Portugiesisch", pl: "Polnisch", id: "Indonesisch", ru: "Russisch", uk: "Ukrainisch", ar: "Arabisch", he: "Hebräisch", ja: "Japanisch", ko: "Koreanisch", en: "Englisch" };
  var KINDN = { lblog: "Blog (früher)", blog: "Blog (Community)", podcast: "Podcast", video: "Video", notes: "Show Notes", entity: "Entität" };
  function ago(t) { if (!t) return "–"; var d = Math.round(Date.now() / 1000 - t); return d < 90 ? d + " s" : d < 5400 ? Math.round(d / 60) + " min" : d < 172800 ? Math.round(d / 3600) + " h" : Math.round(d / 86400) + " d"; }
  function show(k) { tabs.forEach(function (t) { panes[t[0]].hidden = t[0] !== k; bar.querySelector("[data-k=" + t[0] + "]").setAttribute("aria-selected", t[0] === k ? "true" : "false"); }); try { location.hash = k; } catch (e) {} if (LOAD[k]) LOAD[k](); }
  tabs.forEach(function (t) { bar.appendChild(h("button", { type: "button", role: "tab", "data-k": t[0], text: t[1], onclick: function () { show(t[0]); } })); panes[t[0]] = h("section", { class: "adm-pane", hidden: "" }); });
  function tile(label, v, hint) { return h("div", { class: "adm-tile" + (v ? " on" : "") }, [h("b", { text: v == null ? "–" : String(v) }), h("span", { text: label }), hint ? h("small", { text: hint }) : null]); }
  function msg(el, t, bad) { el.textContent = t; el.className = "adm-msg" + (bad ? " bad" : ""); }

  var OV = null;
  function overview(cb) { api("/api/admin/panel/overview").then(function (r) { if (r.s !== 200) { root.textContent = ""; root.appendChild(h("p", { class: "adm-msg bad", text: ERR[(r.j || {}).error] || "Kein Zugriff. Bitte als Admin anmelden." })); root.appendChild(h("p", {}, [h("a", { href: BASE + "/community/", text: "Zur Anmeldung in der Community" })])); return; } OV = r.j; cb && cb(OV); }); }
  var LOAD = {
    mem: function () { members(); }, elog: function () { editLog(); },
    ov: function () { overview(function (o) { var p = panes.ov, q = o.queues; p.textContent = "";
      p.appendChild(h("h2", { text: "Wartet auf dich" }));
      p.appendChild(h("div", { class: "adm-grid" }, [tile("Blog-Beiträge", q.blog), tile("Podcast-Folgen", q.podcast), tile("Videos", q.video), tile("Wiki-Änderungen", q.wiki), tile("Entitäten-Vorschläge", q.entity), tile("Übernahme-Anfragen", q.claims), tile("Zertifikate", q.certs), tile("Meldungen", q.reports), tile("Gemeldete Publisher-Anfragen", q.expert_request_reports), tile("Sponsor-Anfragen (neu)", q.sponsor)]));
      p.appendChild(h("p", { class: "mut" }, ["Freigeben und ablehnen: ", h("a", { href: "#fr", text: "Reiter Freigaben", onclick: function (ev) { ev.preventDefault(); show("fr"); } }), ". Sponsor-Anfragen bearbeiten: ", h("a", { href: "#sponsor", text: "Reiter Sponsor-Anfragen", onclick: function (ev) { ev.preventDefault(); show("sponsor"); } }), "."]));
      p.appendChild(h("h2", { text: "Auf einen Blick" }));
      p.appendChild(h("div", { class: "adm-grid" }, [tile("Mitglieder", o.db.users), tile("Öffentliche Profile", o.db.profiles), tile("Blog-Beiträge live", o.db.blog_live), tile("Entitäten in der Datenbank", o.db.entities_db, "von " + (o.db.entities_file == null ? "?" : o.db.entities_file) + " in der Datei"), tile("E-Mails " + o.mail.month, o.mail.sent, "Warnung ab 2.500 von 3.000")]));
      if (o.mail.warning) p.appendChild(h("p", { class: "adm-msg bad", text: "Warnung: Im aktuellen Monat wurden mindestens 2.500 E-Mails versendet." }));
      var ops = h("div", {}); p.appendChild(h("h2", { text: "Betrieb" })); p.appendChild(ops); ops.appendChild(h("p", { class: "mut", text: "Lädt …" }));
      var lvBtn = h("button", { type: "button", class: "btn", text: "Expertise-Stufen jetzt neu berechnen" }), lvMsg = h("span", { class: "mut", style: "margin-left:.6em" });
      lvBtn.onclick = function () { lvBtn.disabled = true; lvMsg.textContent = "…"; api("/api/admin/expertise-sync", { method: "POST" }).then(function (r) { lvBtn.disabled = false; lvMsg.textContent = r.s === 200 ? ("✓ " + (r.j.evidence || 0) + " Belege, " + (r.j.pairs || 0) + " Themen-Paare, " + (r.j.changed || 0) + " geändert") : "Fehler " + r.s; }); };
      p.appendChild(h("p", {}, [lvBtn, lvMsg]));
      api("/api/admin/panel/ops").then(function (r) { ops.textContent = ""; if (r.s !== 200) { ops.appendChild(h("p", { class: "adm-msg bad", text: "Betriebsdaten nicht abrufbar" })); return; }
        var fails = {}; (r.j.fails || []).forEach(function (f) { fails[f.name] = f.n; });
        var tb = h("table", { class: "adm-tbl adm-ops" }, [h("thead", {}, [h("tr", {}, [h("th", { text: "Aufgabe" }), h("th", { text: "Letzter Lauf" }), h("th", { text: "Status" }), h("th", { text: "Fehler 24 h" }), h("th", { text: "Info" })])])]);
        var tbody = h("tbody"); (r.j.runs || []).forEach(function (x) { tbody.appendChild(h("tr", {}, [h("td", { text: x.name }), h("td", { text: "vor " + ago(x.started) }), h("td", { text: !x.finished ? "läuft" : x.ok ? "ok" : "Fehler" }), h("td", { text: String(fails[x.name] || 0) }), h("td", { text: (x.info || "").slice(0, 90) })])); });
        if (!(r.j.runs || []).length) tbody.appendChild(h("tr", {}, [h("td", { colspan: "5", class: "mut", text: "Noch keine Läufe protokolliert (ab dem nächsten Cron-Lauf nach dem Deploy)." })]));
        tb.appendChild(tbody); ops.appendChild(tb);
        ops.appendChild(h("h3", { text: "Protokoll der Verwaltung" }));
        var al = h("ul", { class: "adm-list" }); (r.j.audit || []).slice(0, 30).forEach(function (a) { al.appendChild(h("li", {}, [h("span", { class: "mut", text: "vor " + ago(a.created) + " · " }), h("b", { text: a.name || ("#" + a.user_id) }), " " + a.action + " " + (a.target || "") + (a.detail ? " · " + a.detail.slice(0, 80) : "")])); });
        if (!(r.j.audit || []).length) al.appendChild(h("li", { class: "mut", text: "Noch keine Einträge." })); ops.appendChild(al); });
    }); },
    tr: function () { if (panes.tr.firstChild) return; translations(); },
    fr: function () { approvals(); },
    sponsor: function () { sponsorRequests(); },
    slinks: function () { sponsorLinks(); },
    ads: function () { adsAdmin(); },
    mk: function () { mediakitLeads(); },
    db: function () { overview(function (o) { var p = panes.db, d = o.db, m = h("p", { class: "adm-msg" }); p.textContent = "";
      p.appendChild(h("h2", { text: "Umzug in die Datenbank" }));
      var miss = d.entities_file == null ? null : Math.max(0, d.entities_file - (d.entities_db || 0));
      p.appendChild(h("div", { class: "adm-grid" }, [tile("Entitäten in der Datenbank", d.entities_db, miss == null ? "" : miss + " noch nur in der Datei"), tile("Frühere Blog-Beiträge übernommen", d.blog_legacy, "Import-Stand " + d.blog_import_offset + " von 2307"), tile("Profil-Export", d.profiles_export_age == null ? "–" : Math.round(d.profiles_export_age / 60) + " min", "Alter des Zwischenspeichers"), tile("Übersetzungen (Inhalte)", d.item_tr), tile("Übersetzungen (Entitäten)", d.ent_tr)]));
      p.appendChild(h("p", {}, ["Entitäten: Bisher liegt die Grundlage in der Datei ", h("code", { text: "data/entities.json" }), ". Mit dem Knopf wird jede Entität, die noch keine Fassung in der Datenbank hat, einmal dorthin übernommen. Danach werden Änderungen nur noch hier und in der Datenbank gemacht. Es wird nichts überschrieben, was schon in der Datenbank steht."]));
      p.appendChild(h("button", { type: "button", class: "btn main", text: "Entitäten in die Datenbank übernehmen", onclick: function (ev) { ev.target.disabled = true; msg(m, "Läuft …"); api("/api/admin/panel/import-entities", { method: "POST", body: {} }).then(function (r) { ev.target.disabled = false; if (r.s === 200) { msg(m, r.j.imported + " übernommen, " + r.j.already + " waren schon da (" + r.j.total + " in der Datei)."); setTimeout(LOAD.db, 1500); } else msg(m, ERR[r.j.error] || "Fehler " + r.s, true); }); } }));
      p.appendChild(h("h2", { text: "Firmen und Entitäten paaren" }));
      p.appendChild(h("p", {}, ["Firma und Entität gehören immer zusammen. Die Aktion legt für Firmen-Entitäten ohne Community-Firma eine unbeanspruchte Firma an (ohne öffentliche Seite) und für Community-Firmen ohne Entität eine wartende Firmen-Entität (Freigabe unter Entitäten); passende vorhandene Entitäten werden verknüpft statt doppelt angelegt. Mehrfach klicken ist unschädlich (idempotent), je Lauf höchstens 150 Einträge."]));
      var pm = h("p", { class: "adm-msg" });
      function pairRun(dry) { pm.textContent = "Läuft …"; api("/api/admin/org-pair", { method: "POST", body: { dry: dry } }).then(function (r) { var j = r.j || {}; pm.textContent = r.s !== 200 ? "Fehler (" + (j.error || r.s) + ")" : dry ? "Probelauf: " + j.orgs_without_entity + " Firmen ohne Entität (" + j.link_existing + " mit vorhandener Entität verknüpfen, " + j.entities_to_create + " neue wartende Entitäten), " + j.entities_without_org + " Firmen-Entitäten ohne Firma." : "Erledigt: " + j.linked + " verknüpft, " + j.entities_created + " Entitäten angelegt, " + j.orgs_created + " Firmen angelegt, noch offen: " + j.remaining + "."; }); }
      p.appendChild(h("p", {}, [h("button", { type: "button", class: "btn", text: "Probelauf (nur zählen)", onclick: function () { pairRun(true); } }), " ", h("button", { type: "button", class: "btn main", text: "Firmen und Entitäten paaren", onclick: function () { if (window.confirm("Bestand jetzt paaren?")) pairRun(false); } })]));
      p.appendChild(pm);
      p.appendChild(m);
    }); },
    sw: function () { overview(function (o) { var p = panes.sw, f = o.flags, m = h("p", { class: "adm-msg" }); p.textContent = "";
      p.appendChild(h("h2", { text: "Automatische Übersetzung (Haiku)" }));
      var ai = o.ai_spend || {};
      p.appendChild(h("h3", { text: "Haiku-Tagesbudget" }));
      p.appendChild(h("div", { class: "adm-grid" }, [tile("Heute", Number(ai.today_eur || 0).toFixed(2) + " €", "von " + Number(ai.budget_eur == null ? 5 : ai.budget_eur).toFixed(2) + " €"), tile("Letzte 30 Tage", Number(ai.spent_30d_eur || 0).toFixed(2) + " €"), tile("Heute noch verfügbar", Number(ai.remaining_eur || 0).toFixed(2) + " €")]));
      if ((ai.days || []).length) p.appendChild(h("table", { class: "adm-tbl" }, [h("thead", {}, [h("tr", {}, [h("th", { text: "UTC-Tag" }), h("th", { text: "Haiku-Ausgaben" })])]), h("tbody", {}, ai.days.map(function (d) { return h("tr", {}, [h("td", { text: d.day }), h("td", { text: Number(d.eur || 0).toFixed(2) + " €" })]); }))]));
      p.appendChild(h("p", { class: "mut", text: f.key ? "API-Schlüssel ist hinterlegt. Heute verbraucht: " + f.atr_today + " Übersetzungen für Inhalte, " + f.atr_ent_today + " für Entitäten." : "Kein API-Schlüssel hinterlegt: Die automatische Übersetzung läuft nicht." }));
      function sw(k, label, on) { var b = h("button", { type: "button", class: "btn" + (on ? " main" : ""), "aria-pressed": on ? "true" : "false", text: label + ": " + (on ? "an" : "aus"), onclick: function () { var nv = /_on$/.test(k) ? (on ? "0" : "1") : (on ? "1" : "0"); api("/api/admin/panel/flag", { method: "POST", body: { k: k, v: nv } }).then(function (r) { if (r.s === 200) LOAD.sw(); else msg(m, ERR[r.j.error] || "Fehler", true); }); } }); return b; }
      p.appendChild(h("p", {}, [sw("atr_off", "Neue Inhalte nach 24 Stunden übersetzen", f.atr_off !== "1"), " ", sw("tr_off", "Entitäten Englisch/Deutsch ergänzen", f.tr_off !== "1"), " ", sw("tr_queue_on", "Vormerkungen mit Haiku abarbeiten", f.tr_queue_on === "1")]));
      var src = f.entity_source === "db";
      p.appendChild(h("h2", { text: "Quelle der Entitäten" }));
      p.appendChild(h("p", {}, [h("button", { type: "button", class: "btn" + (src ? " main" : ""), "aria-pressed": src ? "true" : "false", text: "Entitäten nur aus der Datenbank: " + (src ? "an" : "aus"), onclick: function () { if (!src && !window.confirm("Ab jetzt liest die API Entitäten nur noch aus der Datenbank. Vorher prüfen: Datenbank-Reiter zeigt alle Entitäten der Datei als übernommen. Fortfahren?")) return; api("/api/admin/panel/flag", { method: "POST", body: { k: "entity_source", v: src ? "json" : "db" } }).then(function (r) { if (r.s === 200) LOAD.sw(); else msg(m, ERR[r.j.error] || "Fehler", true); }); } })]));
      p.appendChild(h("p", { class: "mut", text: src ? "Die Datenbank ist die einzige Quelle; entities.json wird vom Worker nicht mehr gelesen. Neue Einträge der Datei holt der Cron importEntitiesFromSite weiterhin in die Datenbank." : "Noch wie bisher: Datei plus Datenbank. Der Cron importEntitiesFromSite übernimmt neue Einträge der Datei automatisch; sobald alle übernommen sind, kann der Schalter auf Datenbank stehen (Rückweg jederzeit)." }));
      p.appendChild(h("p", { class: "mut", text: "Vormerkungen: Community-Inhalte und Entitäten übersetzt der Worker alle 30 Minuten (bis 6 je Lauf, Tageslimit 150), sobald der Schalter an ist. Frühere Blogbeiträge und Show Notes laufen über die GitHub-Workflows translate-blog (Eingabe queue=true) und translate-notes." }));
      var cap = h("input", { type: "number", min: "0", max: "2000", id: "adm-cap", value: f.atr_ent_cap || "300" });
      p.appendChild(h("p", {}, [h("label", { for: "adm-cap", text: "Tageslimit Entitäten-Übersetzungen " }), cap, " ", h("button", { type: "button", class: "btn", text: "Speichern", onclick: function () { api("/api/admin/panel/flag", { method: "POST", body: { k: "atr_ent_cap", v: String(Math.max(0, Math.min(2000, parseInt(cap.value, 10) || 0))) } }).then(function (r) { msg(m, r.s === 200 ? "Gespeichert." : (ERR[r.j.error] || "Fehler"), r.s !== 200); }); } })]));
      p.appendChild(m);
    }); },
    ent: function () { if (panes.ent.firstChild) return; entities(); }
  };

  // ---------- Freigaben: alles, was auf eine Entscheidung wartet, mit den bestehenden Admin-Routen ----------
  function approvals() {
    var p = panes.fr, m = h("p", { class: "adm-msg" }); p.textContent = ""; p.appendChild(h("h2", { text: "Wartet auf Freigabe" })); p.appendChild(m);
    var busy = 0; function done() { if (--busy <= 0 && !p.querySelector(".adm-list li")) p.appendChild(h("p", { class: "mut", text: "Nichts offen. Alles freigegeben." })); }
    function section(title, hint) { var s = h("section", {}, [h("h3", { text: title }), hint ? h("p", { class: "mut", text: hint }) : null, h("ul", { class: "adm-list" })]); p.appendChild(s); return s.querySelector("ul"); }
    function act(label, main, fn, after) { return h("button", { type: "button", class: "btn" + (main ? " main" : ""), text: label, onclick: function (ev) { ev.target.disabled = true; fn().then(function (r) { if (r.s === 200) { msg(m, r.j && r.j.mailSent === false ? "Status gespeichert, E-Mail konnte nicht zugestellt werden." : "Erledigt.", !!(r.j && r.j.mailSent === false)); after(); } else { ev.target.disabled = false; msg(m, ERR[(r.j || {}).error] || "Fehler " + r.s, true); } }); } }); }
    function row(ul, kids, attrs) { var li = h("li", attrs || {}, kids); ul.appendChild(li); return function () { li.remove(); if (!ul.children.length) ul.parentNode.remove(); }; }
    function note() { return window.prompt("Grund für die Ablehnung (optional):") || ""; }
    function when(t) { return t ? new Date(t * 1000).toLocaleDateString("de-DE") : ""; }
    busy = 9;
    api("/api/admin/blog").then(function (r) { var it = (r.j || {}).items || []; if (it.length) { var ul = section("Blog-Beiträge (" + it.length + ")"); it.forEach(function (x) { var rm = row(ul, [h("b", { text: x.title }), " ", h("span", { class: "mut", text: (x.name || "") + " · " + (x.lang || "") + " · " + when(x.created) }), h("p", { class: "mut", text: (x.summary || x.body || "").slice(0, 220) }), h("p", {}, [act("Freigeben", true, function () { return api("/api/admin/blog/decide", { method: "POST", body: { id: x.id, ok: true } }); }, function () { rm(); }), " ", act("Ablehnen", false, function () { return api("/api/admin/blog/decide", { method: "POST", body: { id: x.id, ok: false, note: note() } }); }, function () { rm(); })])]); }); } done(); });
    api("/api/admin/wiki/pending").then(function (r) { var it = (r.j || {}).pending || []; if (it.length) { var ul = section("Wiki-Änderungen (" + it.length + ")"); it.forEach(function (x) { var rm = row(ul, [h("b", { text: x.term + " (" + x.lang + ")" }), " ", h("span", { class: "mut", text: (x.name || "") + " · " + when(x.created) + (x.summary ? " · " + x.summary : "") }), h("p", { class: "mut", text: (x.body || "").slice(0, 260) }), h("p", {}, [act("Freigeben", true, function () { return api("/api/admin/wiki/approve/" + x.id, { method: "POST", body: {} }); }, function () { rm(); }), " ", act("Ablehnen", false, function () { return api("/api/admin/wiki/reject/" + x.id, { method: "POST", body: {} }); }, function () { rm(); })])]); }); } done(); });
    api("/api/admin/entity/pending").then(function (r) { var it = (r.j || {}).pending || []; if (it.length) { var ul = section("Entitäten-Vorschläge (" + it.length + ")"); it.forEach(function (x) { var d = x.data || {}; var rm = row(ul, [h("b", { text: (d.name || x.eid) }), " ", h("span", { class: "mut", text: x.eid + " · " + (x.name || "") + " · " + when(x.created) + (x.summary ? " · " + x.summary : "") }), h("p", { class: "mut", text: ((d.desc || {}).en || (d.desc || {}).de || "").slice(0, 220) }), h("p", {}, [act("Freigeben", true, function () { return api("/api/admin/entity/approve/" + x.id, { method: "POST", body: {} }); }, function () { rm(); }), " ", act("Ablehnen", false, function () { return api("/api/admin/entity/reject/" + x.id, { method: "POST", body: {} }); }, function () { rm(); }), " ", h("a", { href: BASE + "/entity/" + x.eid + "/", target: "_blank", rel: "noopener", text: "Seite" })])]); }); } done(); });
    api("/api/admin/entity/claims").then(function (r) { var it = (r.j || {}).claims || []; var dv = (r.j || {}).domain_verified || []; if (dv.length) { var u2 = section("Per Firmen-E-Mail bestätigt (" + dv.length + ")", "Automatisch verifiziert. Nur bei Missbrauch oder falscher Domain widerrufen."); dv.forEach(function (x) { var rm2 = row(u2, [h("b", { text: x.eid }), " ", h("span", { class: "mut", text: "verifiziert per Domain @" + x.domain + " · " + x.name }), " ", act("Widerrufen", false, function () { return api("/api/admin/entity/claim", { method: "POST", body: { eid: x.eid, revoke: true } }); }, function () { rm2(); })]); }); } if (it.length) { var ul = section("Übernahme-Anfragen (" + it.length + ")", "Ein Mitglied möchte eine Entität als Inhaber betreuen."); it.forEach(function (x) { var rm = row(ul, [h("b", { text: x.entity_name || x.eid }), " ", h("span", { class: "mut", text: x.eid + (x.handle ? " · " + x.handle : "") }), h("span", { class: "mut", text: " · " + ({ pending: "offen", email_sent: "E-Mail gesendet", forwarded: "weitergegeben an " + (x.fwd_mask || "") }[x.status] || x.status) }), x.via === "linkedin" ? h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.75em;margin:.6em 0" }, [
        h("div", {}, [x.picture ? h("img", { src: x.picture, alt: "LinkedIn-Profilbild", referrerpolicy: "no-referrer", style: "width:64px;height:64px;object-fit:cover;border-radius:50%" }) : null, h("p", { text: "LinkedIn: " + (x.name || "Unbekannt") })]),
        h("div", {}, [h("p", { text: "Entität: " + (x.entity_name || x.eid) }), x.linkedin_url ? h("a", { href: x.linkedin_url, target: "_blank", rel: "noopener noreferrer", text: "LinkedIn-Link der Entität" }) : null, h("p", { class: "mut", text: x.name_match === "equal" ? "Name gleich" : x.name_match === "similar" ? "Name ähnlich" : "Name weicht ab" })])
      ]) : h("span", { class: "mut", text: (x.name || "") + (x.handle ? " (" + x.handle + ")" : "") + (x.proof_domain ? " · Firmen-E-Mail bestätigt @" + x.proof_domain : "") }), h("p", {}, [act("Bestätigen", true, function () { return api("/api/admin/entity/claim", { method: "POST", body: { eid: x.eid, ok: true } }); }, function () { rm(); }), " ", act("Ablehnen", false, function () { return api("/api/admin/entity/claim", { method: "POST", body: { eid: x.eid, ok: false } }); }, function () { rm(); })])]); }); } done(); });
    api("/api/admin/cert-queue").then(function (r) { var it = (r.j || {}).items || []; if (it.length) { var ul = section("Zertifikate prüfen (" + it.length + ")"); it.forEach(function (x) { var rm = row(ul, [h("b", { text: x.e + (x.year ? " · " + x.year : "") }), " ", h("span", { class: "mut", text: (x.name || "") + (x.handle ? " (" + x.handle + ")" : "") }), x.url ? h("p", {}, [h("a", { href: x.url, target: "_blank", rel: "noopener nofollow", text: "Nachweis öffnen" })]) : null, h("p", {}, [act("Bestätigen", true, function () { return api("/api/admin/verify", { method: "POST", body: { owner: "u:" + x.handle, kind: "cert", key: x.e, value: 1 } }); }, function () { rm(); }), " ", act("Ablehnen", false, function () { return api("/api/admin/verify", { method: "POST", body: { owner: "u:" + x.handle, kind: "cert", key: x.e, value: 0 } }); }, function () { rm(); })])]); }); } done(); });
    api("/api/admin/reports").then(function (r) { var it = (r.j || {}).reports || []; if (it.length) { var ul = section("Gemeldete Kommentare (" + it.length + ")"); it.forEach(function (x) { var rm = row(ul, [h("b", { text: x.n + "× gemeldet" }), " ", h("span", { class: "mut", text: (x.lang || "") + " · " + (x.status || "") }), h("p", { class: "mut", text: (x.body || "").slice(0, 260) }), h("p", {}, [act("Ausblenden", true, function () { return api("/api/admin/hide/" + x.id, { method: "POST", body: {} }); }, function () { rm(); }), " ", act("Behalten", false, function () { return api("/api/admin/show/" + x.id, { method: "POST", body: {} }); }, function () { rm(); })])]); }); } done(); });
    api("/api/admin/expert-requests/reports").then(function (r) { var it = (r.j || {}).reports || []; if (it.length) { var ul = section("Gemeldete Publisher-Anfragen (" + it.length + ")"); it.forEach(function (x) { var rm = row(ul, [h("b", { text: x.title }), " ", h("span", { class: "mut", text: "Publisher: " + (x.publisher_name || "–") + " (#" + x.publisher_id + ") · gemeldet von #" + x.reporter_id }), h("p", { class: "mut", text: x.reason || "" }), x.reply_id ? h("p", { class: "mut", text: "Gemeldete Antwort (" + (x.expert_name || "–") + " #" + (x.expert_id || "?") + "): " + (x.reply_body || "bereits gelöscht") }) : null, h("p", {}, [x.reply_id ? act("Antwort entfernen", true, function () { return api("/api/admin/expert-requests/reply-delete", { method: "POST", body: { reply_id: x.reply_id } }); }, function () { rm(); }) : null, x.reply_id ? " " : null, act("Anfrage schließen", !x.reply_id, function () { return api("/api/admin/expert-requests/close", { method: "POST", body: { id: x.request_id } }); }, function () { ul.querySelectorAll('li[data-request-id="' + x.request_id + '"]').forEach(function (li) { li.remove(); }); })])], { "data-request-id": x.request_id }); }); } done(); });
    api("/api/admin/podcast").then(function (r) { var it = (r.j || {}).items || []; if (it.length) { var ul = section("Podcast-Folgen (" + it.length + ")", "Freigabe läuft über die Abstimmung der Community (" + ((r.j || {}).threshold || 25) + " Punkte) und die Veröffentlichung bei Spreaker; hier nur ablehnen."); it.forEach(function (x) { var rm = row(ul, [h("b", { text: x.title }), " ", h("span", { class: "mut", text: (x.name || "") + " · " + x.status + " · " + (x.votes || 0) + " Stimmen · " + when(x.created) }), x.spreaker ? h("p", {}, [h("a", { href: x.spreaker, target: "_blank", rel: "noopener", text: "Bei Spreaker öffnen" })]) : null, h("p", {}, [act("Ablehnen", false, function () { return api("/api/admin/podcast/reject", { method: "POST", body: { id: x.id, note: note() } }); }, function () { rm(); })])]); }); } done(); });
    api("/api/admin/video").then(function (r) { var it = (r.j || {}).items || []; if (it.length) { var ul = section("Videos (" + it.length + ")", "Freigabe über die Abstimmung (" + ((r.j || {}).threshold || 25) + " Punkte) und die Veröffentlichung bei YouTube; hier nur ablehnen."); it.forEach(function (x) { var rm = row(ul, [h("b", { text: x.title }), " ", h("span", { class: "mut", text: (x.name || "") + " · " + x.status + " · " + (x.votes || 0) + " Stimmen · " + when(x.created) }), x.youtube ? h("p", {}, [h("a", { href: x.youtube, target: "_blank", rel: "noopener", text: "Im YouTube Studio öffnen" })]) : null, h("p", {}, [act("Ablehnen", false, function () { return api("/api/admin/video/reject", { method: "POST", body: { id: x.id, note: note() } }); }, function () { rm(); })])]); }); } done(); });
  }

  // ---------- Mitglieder: Rollen vergeben (Mitglied, Moderator, Editor, Admin) ----------
  var ROLEN = [["user", "Mitglied"], ["moderator", "Moderator"], ["editor", "Editor"], ["admin", "Admin"]];
  function members() {
    var p = panes.mem, m = h("p", { class: "adm-msg", role: "status" }), q = h("input", { type: "search", id: "adm-mq", placeholder: "Name suchen", "aria-label": "Mitglied suchen" }), list = h("ul", { class: "adm-list" });
    p.textContent = ""; p.appendChild(h("h2", { text: "Mitglieder und Rollen" }));
    p.appendChild(h("p", { class: "mut", text: "Editoren prüfen und bearbeiten Inhalte, Moderatoren blenden Gemeldetes aus und geben Empfehlungen ab. Beide sehen ein Abzeichen am Profil." }));
    function load() { api("/api/admin/users?q=" + encodeURIComponent(q.value)).then(function (r) { list.textContent = ""; if (r.s !== 200) { msg(m, "Nicht abrufbar", true); return; }
      ((r.j || {}).users || []).forEach(function (u) { var sel = h("select", { "aria-label": "Rolle für " + u.name }); ROLEN.forEach(function (o) { var op = h("option", { value: o[0], text: o[1] }); if (o[0] === (u.role || "user")) op.selected = true; sel.appendChild(op); });
        sel.addEventListener("change", function () { sel.disabled = true; api("/api/admin/role/" + u.id, { method: "POST", body: { role: sel.value } }).then(function (x) { sel.disabled = false; msg(m, x.s === 200 ? u.name + ": Rolle ist jetzt " + sel.value + "." : "Fehler " + x.s, x.s !== 200); }); });
        var fe = h("span"); function feUI() { fe.textContent = ""; if (sel.value !== "editor") return; var cb = h("input", { type: "checkbox", id: "fe-" + u.id }), info = h("small", { class: "mut" });
          api("/api/admin/editor-scope/" + u.id).then(function (x) { cb.checked = !!(x.j || {}).subject; info.textContent = cb.checked ? "Themen: " + (((x.j || {}).auto || []).concat((x.j || {}).extra || []).join(", ") || "noch keine bestätigte Expertise") : "allgemeiner Editor (sieht alles)"; });
          cb.addEventListener("change", function () { api("/api/admin/editor-scope/" + u.id, { method: "POST", body: { subject: cb.checked } }).then(function (x) { msg(m, x.s === 200 ? u.name + (cb.checked ? ": Fach-Editor (Themen aus bestätigter Expertise)." : ": allgemeiner Editor.") : "Fehler " + x.s, x.s !== 200); feUI(); }); });
          fe.appendChild(h("label", { for: "fe-" + u.id }, [cb, " Fach-Editor "])); fe.appendChild(info); }
        sel.addEventListener("change", feUI); feUI();
        list.appendChild(h("li", {}, [h("b", { text: u.name }), " ", h("span", { class: "mut", text: "#" + u.id + (u.banned ? " · gesperrt" : "") }), " ", sel, " ", fe])); }); }); }
    p.appendChild(h("p", { class: "adm-row" }, [q, h("button", { type: "button", class: "btn main", text: "Suchen", onclick: load })])); p.appendChild(m); p.appendChild(list); load();
  }
  // ---------- Redaktions-Protokoll: wer hat wann was entschieden; Undo fuer Ausblenden, Freigeben, Ablehnen ----------
  function editLog() {
    var p = panes.elog, m = h("p", { class: "adm-msg", role: "status" }), tb = h("tbody"), pr = h("ul", { class: "adm-list" }), wi = h("p", { class: "mut" });
    p.textContent = ""; p.appendChild(h("h2", { text: "Redaktions-Protokoll" })); p.appendChild(m); p.appendChild(wi);
    p.appendChild(h("h3", { text: "Offene Empfehlungen und Eskalationen" })); p.appendChild(pr);
    p.appendChild(h("table", { class: "adm-tbl" }, [h("thead", {}, [h("tr", {}, ["Zeit", "Wer", "Rolle", "Aktion", "Eintrag", "Grund", "Vorher → Nachher", ""].map(function (t) { return h("th", { text: t }); }))]), tb]));
    function load() { api("/api/admin/editlog").then(function (r) { tb.textContent = ""; pr.textContent = ""; wi.textContent = ""; if (r.s !== 200) { msg(m, "Nicht abrufbar", true); return; }
      var w = (r.j || {}).wishes || {}, wn = (w.lblog || 0) + (w.episode || 0) + (w.notes || 0);   // Wunschliste der Redaktion: wird nur von einem von Hand gestarteten Lauf abgeholt (kostenpflichtig)
      if (wn) wi.textContent = "Offene Wünsche „neu übersetzen“: Blog " + (w.lblog || 0) + ", Folgen " + (w.episode || 0) + ", Show Notes " + (w.notes || 0) + ". Abholen: Workflow „Blog uebersetzen“ (Modus stale, wishes) bzw. translate-show / translate-notes mit wishes von Hand starten.";
      ((r.j || {}).proposals || []).forEach(function (x) { pr.appendChild(h("li", {}, [h("b", { text: x.action + " · " + x.kind + " #" + x.item_id }), " ", h("span", { class: "mut", text: x.name + " (" + x.role + ") · " + (x.reason || "ohne Grund") }), " ", h("button", { type: "button", class: "btn", text: "Erledigt", onclick: function (ev) { ev.target.disabled = true; api("/api/editor/proposals/" + x.id + "/dismiss", { method: "POST", body: {} }).then(load); } })])); });
      if (!pr.children.length) pr.appendChild(h("li", { class: "mut", text: "Nichts offen." }));
      ((r.j || {}).items || []).forEach(function (x) { var undo = x.undoable ? h("button", { type: "button", class: "btn", text: "Rückgängig", onclick: function (ev) { ev.target.disabled = true; api("/api/admin/editlog/undo/" + x.id, { method: "POST", body: {} }).then(function (u) { msg(m, u.s === 200 ? "Rückgängig gemacht." : "Nicht möglich (" + ((u.j || {}).error || u.s) + ")", u.s !== 200); load(); }); } }) : h("span", { class: "mut", text: x.undone ? "rückgängig" : "" });
        tb.appendChild(h("tr", {}, [new Date(x.ts * 1000).toLocaleString("de-DE"), x.name || "#" + x.user_id, x.role, x.action, x.kind + " #" + x.item_id, x.reason, (x.before || "").slice(0, 80) + " → " + (x.after || "").slice(0, 80), undo].map(function (c) { return h("td", {}, [typeof c === "string" ? document.createTextNode(c) : c]); }))); }); }); }
    load();
  }

  // ---------- Sponsor-Anfragen (T37): Liste mit Status und Paging, je Anfrage eine Detailzeile mit Nachricht und ganzem Paket ----------
  // Paket v1 der Sponsor-Seite (assets/sponsor-calc.js): nur Zeichenketten, englische Bezeichnungen - goal, topics, duration, components, extras,
  // monthlyUsd "$7,700", oneOffUsd, totalUsd, discount, effect, page. Aeltere Anfragen haben andere Schluessel (ziel, themen, laufzeit, months,
  // bausteine, preisMonat, gesamtpreis ...) und Zahlen; sie werden mit denselben Regeln angezeigt (wie packageDetails in worker/src/sponsor.js).
  // Die Anfragen kommen aus einem oeffentlichen Formular: alles nur als Text (h -> textContent), nie als HTML.
  var SP_STATES = [["new", "Neu"], ["contacted", "Kontaktiert"], ["won", "Gewonnen"], ["lost", "Verloren"], ["spam", "Spam"]];
  var SP_KEYS = { goal: ["goal", "target", "ziel", "destination", "audience"], topics: ["topics", "themen"], duration: ["duration", "term", "laufzeit", "months"], components: ["components", "blocks", "bausteine", "elements"], extras: ["extras"],
    monthly: ["monthlyUsd", "monthly_usd", "monthlyPrice", "priceMonthly", "monthly", "preisMonat"], oneOff: ["oneOffUsd", "one_off_usd", "oneOff", "oneTimeUsd", "oneTime", "einmalig"], total: ["totalUsd", "total_usd", "totalPrice", "priceTotal", "total", "gesamtpreis"] };
  var SP_LABEL = { v: "Version", goal: "Ziel", topics: "Themen", duration: "Laufzeit", components: "Bausteine", extras: "Extras", monthlyUsd: "Pro Monat", oneOffUsd: "Einmalig", totalUsd: "Gesamt", discount: "Rabatt", effect: "Wirkung (Schätzung)", page: "Seite" };
  function spPkg(raw) { var q = raw; if (typeof q === "string") { try { q = JSON.parse(q); } catch (e) { return null; } } return q && typeof q === "object" && !Array.isArray(q) ? q : null; }
  function spVal(q, k) { var ks = SP_KEYS[k]; for (var i = 0; i < ks.length; i++) { var v = q[ks[i]]; if (v != null && v !== "") return v; } return null; }
  function spList(v) { return (Array.isArray(v) ? v : v == null ? [] : [v]).map(function (x) { return x == null ? "" : typeof x === "object" ? JSON.stringify(x) : String(x); }).filter(Boolean); }
  function spMoney(v) {   // Zahl -> "$3,900" (en-US, wie auf der Sponsor-Seite), Zeichenkette ("$7,700") bleibt
    if (typeof v === "number" && isFinite(v)) return (v < 0 ? "-" : "") + "$" + Math.abs(v).toLocaleString("en-US", { maximumFractionDigits: 2 });
    if (typeof v === "string") { var s = v.trim().slice(0, 80); return /^\d+(?:\.\d+)?$/.test(s) ? spMoney(Number(s)) : s; }
    return "";
  }
  function spValue(v) {   // ganzes Paket: Listen als Aufzaehlung, Objekte (aeltere Anfragen, z. B. lines, estimate) als verschachtelte Liste
    if (Array.isArray(v)) return v.length ? h("ul", { style: "margin:0;padding-inline-start:1.2em" }, v.map(function (x) { return h("li", {}, [spValue(x)]); })) : h("span", { class: "mut", text: "(leer)" });
    if (v && typeof v === "object") return spDl(v, true);
    if (typeof v === "boolean") return v ? "ja" : "nein";
    return v == null || v === "" ? "–" : String(v);
  }
  function spDl(q, nested) {   // deutsche Bezeichnungen nur fuer die Schluessel oben im Paket, verschachtelte Schluessel bleiben wie gespeichert
    var keys = Object.keys(q), dl = h("dl", { style: "display:grid;grid-template-columns:minmax(7em,max-content) 1fr;gap:.2em 1em;margin:.4em 0" });
    if (!keys.length) return h("span", { class: "mut", text: "(keine Angaben)" });
    keys.forEach(function (k) { dl.append(h("dt", { class: "mut", text: (!nested && SP_LABEL[k]) || k }), h("dd", { style: "margin:0" }, [spValue(q[k])])); });
    return dl;
  }

  function mediakitLeads() {   // Mediadaten-Anfragen (Leads): personenbezogen, nur Admin; Werbe-Anfragen (ad_leads) stehen im Reiter Werbung
    var p = panes.mk, rows = [], COLS = ["Datum", "Name", "Firma", "E-Mail", "Sprache", "Herkunft", "Mail gesendet", "Status", "Ändern", ""], MKU = "/api/admin/mediakit";
    var filter = h("input", { type: "search", "aria-label": "Anfragen filtern", placeholder: "Filter (Name, Firma, E-Mail, Herkunft)" }), msgEl = h("p", { class: "adm-msg" }), count = h("span", { class: "mut" });
    var csvBtn = h("button", { type: "button", class: "btn", text: "CSV exportieren" }), body = h("tbody"), stFilter = leadFilterSel(), counts = h("div");
    function day(t) { return t ? new Date(t * 1000).toISOString().slice(0, 10) : ""; }
    function sent(x) { return x.sent ? "ja" : "nein" + (x.err ? " (" + x.err + ")" : ""); }
    function view() {
      var q = filter.value.trim().toLowerCase();
      var list = rows.filter(function (x) { return (!q || [x.name, x.company, x.email, x.source, x.lang, x.err].join(" ").toLowerCase().indexOf(q) >= 0) && (!stFilter.value || leadSt(x.status)[0] === stFilter.value); });
      body.textContent = ""; counts.textContent = ""; counts.appendChild(leadCounts(rows, "status"));
      list.forEach(function (x) { body.appendChild(h("tr", {}, [h("td", { text: day(x.created) }), h("td", { text: x.name }), h("td", { text: x.company }), h("td", {}, [h("a", { href: mailto(x.email), text: x.email })]), h("td", { text: x.lang }), h("td", { text: x.source }), h("td", { text: sent(x) }),
        h("td", {}, [leadBadge(x.status)]), h("td", {}, [leadStatusSel(x, "status", MKU, msgEl, view)]), h("td", {}, [leadDelete(x, MKU, msgEl, function () { rows = rows.filter(function (y) { return y.id !== x.id; }); view(); })])])); });
      count.textContent = list.length + " von " + rows.length; csvBtn._list = list;
    }
    function cell(v) { v = String(v == null ? "" : v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; }
    csvBtn.onclick = function () {
      var lines = [COLS.slice(0, 7).concat(["Status"]).join(",")].concat((csvBtn._list || []).map(function (x) { return [day(x.created), x.name, x.company, x.email, x.lang, x.source, sent(x), leadSt(x.status)[1]].map(cell).join(","); }));
      var a = h("a", { href: URL.createObjectURL(new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" })), download: "m365fm-mediadaten-anfragen.csv" }); document.body.appendChild(a); a.click(); a.remove();
    };
    filter.oninput = view; stFilter.onchange = view;
    p.textContent = "";
    p.append(h("h2", { text: "Mediadaten-Anfragen (Leads)" }), h("p", { class: "mut", text: "Personenbezogene Daten, nur für Admins. Neueste zuerst, höchstens 200. Werbe-Anfragen der Banner-Formulare stehen im Reiter Werbung unter Leads." }), filter, " ", stFilter, " ", csvBtn, " ", count, counts, msgEl,
      h("div", { style: "overflow-x:auto" }, [h("table", { class: "adm-tbl" }, [h("thead", {}, [h("tr", {}, COLS.map(function (c) { return h("th", { text: c }); }))]), body])]));
    api("/api/admin/mediakit").then(function (r) {
      if (r.s !== 200) { msg(msgEl, ERR[(r.j || {}).error] || "Fehler " + r.s, true); return; }
      rows = (r.j.items || []).slice().sort(function (a, b) { return (b.created || 0) - (a.created || 0) || (b.id || 0) - (a.id || 0); }); view();
    });
  }

  function sponsorRequests() {
    var p = panes.sponsor, filter = h("select", { "aria-label": "Status filtern" }), msgEl = h("p", { class: "adm-msg" });
    var table = h("table", { class: "adm-tbl" }), head = h("thead"), body = h("tbody"), prev = h("button", { type: "button", class: "btn", text: "Zurück" }), next = h("button", { type: "button", class: "btn", text: "Weiter" }), count = h("span", { class: "mut" });
    var limit = 50, offset = 0, total = 0, COLS = ["Datum", "Firma", "Name", "E-Mail", "Sprache", "Paket", "Themen", "Preis", "Status"], NB = "border-bottom:0";
    p.textContent = ""; p.append(h("h2", { text: "Sponsor-Anfragen" }), filter, h("p", {}, [prev, " ", next, " ", count]), msgEl, h("div", { style: "overflow-x:auto" }, [table]));   // schmale Fenster: Tabelle scrollt, nicht die Seite
    [["", "Alle Status"]].concat(SP_STATES).forEach(function (x) { filter.appendChild(h("option", { value: x[0], text: x[1] })); });
    table.append(head, body);
    function bullets(list) { return list.length ? h("ul", { style: "margin:0;padding-inline-start:1.1em" }, list.map(function (t) { return h("li", { text: t }); })) : "–"; }
    function rows(x) {   // Hauptzeile + Detailzeile (Nachricht, ganzes Paket zum Aufklappen)
      var q = spPkg(x.package), lang = String(x.lang || ""), page = q && typeof q.page === "string" ? q.page : "";
      var when = x.created ? new Date(x.created * 1000).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "–";
      var dur = q && spVal(q, "duration"), headline = q ? [spVal(q, "goal"), typeof dur === "number" ? dur + " Monate" : dur].map(function (v) { return spList(v).join(", "); }).filter(Boolean).join(" · ") : "";
      var items = q ? spList(spVal(q, "components")).concat(spList(spVal(q, "extras"))) : [], topics = q ? spList(spVal(q, "topics")) : [];
      var money = q ? [[spVal(q, "monthly"), "/Monat"], [spVal(q, "oneOff"), " einmalig"], [spVal(q, "total"), " gesamt"]].map(function (m) { var s = spMoney(m[0]); return s ? h("div", { text: s + m[1] }) : null; }).filter(Boolean) : [];
      var pkgCell = headline ? [h("b", { text: headline })] : items.length ? ["–"]   // Bausteine stehen in voller Breite in der Detailzeile
        : [(q ? (Object.keys(q).length ? JSON.stringify(q) : "") : String(x.package == null ? "" : x.package)).slice(0, 100) || "–"];
      var state = h("select", { "aria-label": "Status für " + x.company });
      SP_STATES.forEach(function (v) { var opt = h("option", { value: v[0], text: v[1] }); if (x.status === v[0]) opt.selected = true; state.appendChild(opt); });
      state.addEventListener("change", function () {
        state.disabled = true;
        api("/api/admin/panel/sponsor-requests/status", { method: "POST", body: { id: x.id, status: state.value } }).then(function (updated) {
          state.disabled = false;
          if (updated.s === 200) load(); else { msg(msgEl, "Status konnte nicht gespeichert werden", true); state.value = x.status; }
        });
      });
      var main = h("tr", {}, [h("td", { style: NB, text: when }), h("td", { style: NB, text: x.company }), h("td", { style: NB, text: x.name }),
        h("td", { style: NB }, [x.email ? h("a", { href: mailto(x.email), text: x.email }) : "–"]),
        h("td", { style: NB }, [LANGN[lang] ? LANGN[lang] + " (" + lang + ")" : lang || "–", page ? h("div", { class: "mut", text: page }) : null]),
        h("td", { style: NB }, pkgCell), h("td", { style: NB }, [bullets(topics)]), h("td", { style: NB + ";white-space:nowrap" }, money.length ? money : ["–"]), h("td", { style: NB }, [state])]);
      var detail = h("tr", {}, [h("td", { colspan: String(COLS.length), style: "padding-top:0" }, [
        x.message ? h("p", { style: "white-space:pre-wrap;margin:0 0 .4em" }, [h("b", { text: "Nachricht: " }), String(x.message)]) : h("p", { class: "mut", style: "margin:0 0 .4em", text: "Keine Nachricht." }),
        items.length ? h("p", { style: "margin:0 0 .4em" }, [h("b", { text: "Bausteine: " }), items.join(" · ")]) : null,
        h("details", {}, [h("summary", { text: q ? "Ganzes Paket (" + Object.keys(q).length + " Angaben)" : "Paket (nicht lesbar, Rohdaten)" }), q ? spDl(q) : null,
          h("details", {}, [h("summary", { class: "mut", text: "Rohdaten (JSON)" }), h("pre", { style: "white-space:pre-wrap;overflow-wrap:anywhere;font-size:.8rem;margin:.3em 0", text: q ? JSON.stringify(q, null, 2) : String(x.package == null ? "" : x.package) })])])])]);
      return [main, detail];
    }
    function load() {
      msgEl.textContent = "Lädt …";
      api("/api/admin/panel/sponsor-requests?limit=" + limit + "&offset=" + offset + (filter.value ? "&status=" + encodeURIComponent(filter.value) : "")).then(function (r) {
        head.textContent = ""; body.textContent = "";
        if (r.s !== 200) { msg(msgEl, "Sponsor-Anfragen nicht abrufbar", true); return; }
        total = r.j.total || 0; msgEl.textContent = "";
        head.appendChild(h("tr", {}, COLS.map(function (x) { return h("th", { text: x }); })));
        (r.j.items || []).forEach(function (x) { rows(x).forEach(function (tr) { body.appendChild(tr); }); });
        if (!total) body.appendChild(h("tr", {}, [h("td", { colspan: String(COLS.length), class: "mut", text: "Keine Sponsor-Anfragen." })]));
        count.textContent = total ? (offset + 1) + "–" + Math.min(offset + limit, total) + " von " + total : "0 Anfragen";
        prev.disabled = offset <= 0; next.disabled = offset + limit >= total;
      });
    }
    prev.onclick = function () { offset = Math.max(0, offset - limit); load(); };
    next.onclick = function () { offset += limit; load(); };
    filter.addEventListener("change", function () { offset = 0; load(); });
    load();
  }

  function sponsorLinks() {
    var p = panes.slinks, message = h("p", { class: "adm-msg" }), orgs = [], placements = [];
    p.textContent = "";
    p.append(h("h2", { text: "Sponsorlinks" }), h("p", { class: "mut", text: "Links werden nicht gelöscht; zum Beenden auf inaktiv setzen. Ziele sind nur HTTPS-Adressen ohne Zugangsdaten." }), message);
    api("/api/sponsor/sources").then(function (sources) {
      if (sources.s !== 200) { msg(message, "Firmen und Platzierungen nicht abrufbar", true); return; }
      orgs = sources.j.orgs || [];
      placements = sources.j.placements || [];
      var form = h("form", { class: "adm-form" });
      var org = h("select", { required: "" }), placement = h("select", { required: "" });
      orgs.forEach(function (item) { org.appendChild(h("option", { value: String(item.id), text: item.name })); });
      function updatePlacements() {
        placement.textContent = "";
        placements.filter(function (item) { return String(item.org_id) === org.value; }).forEach(function (item) {
          placement.appendChild(h("option", { value: item.id, text: item.title + " · " + item.id }));
        });
      }
      org.addEventListener("change", updatePlacements);
      updatePlacements();
      var code = h("input", { required: "", minlength: "3", maxlength: "40", pattern: "[a-z0-9-]{3,40}", placeholder: "beispiel-2026" });
      var target = h("input", { required: "", type: "url", pattern: "https://.*", placeholder: "https://firma.example/" });
      var utm = h("input", { maxlength: "500", placeholder: "utm_source=m365.fm&utm_medium=referral" });
      var status = h("p", { role: "status", class: "adm-msg" });
      form.append(h("label", {}, ["Firma", org]), h("label", {}, ["Platzierung", placement]),
        h("label", {}, ["Link-Code", code]), h("label", {}, ["Ziel (HTTPS)", target]),
        h("label", {}, ["UTM-Parameter", utm]), h("button", { class: "btn main", type: "submit", text: "Sponsorlink anlegen" }), status);
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var parsed;
        try {
          parsed = new URL(target.value);
          if (parsed.protocol !== "https:" || parsed.username || parsed.password || !placement.value) throw new Error("invalid");
        } catch (_) { msg(status, "Bitte HTTPS-Ziel ohne Zugangsdaten und eine Platzierung wählen.", true); return; }
        var submit = form.querySelector("button[type=submit]");
        submit.disabled = true;
        api("/api/admin/sponsor-links", { method: "POST", body: { code: code.value, org_id: Number(org.value),
          placement_id: placement.value, target_url: parsed.href, utm: utm.value } }).then(function (result) {
          msg(status, result.s === 200 ? "Sponsorlink gespeichert." : "Sponsorlink konnte nicht gespeichert werden.", result.s !== 200);
          if (result.s === 200) { form.reset(); updatePlacements(); load(); }
        }).catch(function () { msg(status, "Sponsorlink konnte nicht gespeichert werden.", true); })
          .finally(function () { submit.disabled = false; });
      });
      p.appendChild(form);
    });
    var table = h("table", { class: "adm-tbl" }), head = h("thead"), body = h("tbody");
    head.appendChild(h("tr", {}, ["Code", "Firma", "Platzierung", "Ziel", "UTM", "Status", "Aktion"].map(function (value) {
      return h("th", { text: value });
    })));
    table.append(head, body);
    p.appendChild(h("div", { style: "overflow-x:auto" }, [table]));
    function load() {
      api("/api/admin/sponsor-links").then(function (result) {
        body.textContent = "";
        if (result.s !== 200) { msg(message, "Sponsorlinks nicht abrufbar", true); return; }
        (result.j.links || []).forEach(function (link) {
          var org = orgs.find(function (item) { return item.id === link.org_id; });
          var item = placements.find(function (placementItem) { return placementItem.id === link.placement_id; });
          var button = h("button", { type: "button", class: "btn", text: link.active ? "Deaktivieren" : "Aktivieren" });
          button.addEventListener("click", function () {
            button.disabled = true;
            api("/api/admin/sponsor-links/" + encodeURIComponent(link.code), { method: "POST", body: { active: !link.active } })
              .then(function (updated) {
                if (updated.s === 200) load();
                else { button.disabled = false; msg(message, "Status konnte nicht geändert werden.", true); }
              }).catch(function () { button.disabled = false; msg(message, "Status konnte nicht geändert werden.", true); });
          });
          body.appendChild(h("tr", {}, [link.code, org ? org.name : String(link.org_id), item ? item.title : link.placement_id,
            h("a", { href: link.target_url, target: "_blank", rel: "noopener", text: link.target_url }),
            link.utm, link.active ? "Aktiv" : "Inaktiv", button].map(function (value) {
              return value && value.nodeType ? h("td", {}, [value]) : h("td", { text: value });
            })));
        });
        if (!(result.j.links || []).length) body.appendChild(h("tr", {}, [h("td", { colspan: "7", class: "mut", text: "Noch keine Sponsorlinks." })]));
      });
    }
    load();
  }

  // ---------- #281 Werbung: Buchungen, Freigabe mit Vorschau, Preise, Profilstufen, Hausanzeigen, Zahlen, Leads ----------
  function adsAdmin() {
    var p = panes.ads, m = h("p", { class: "adm-msg", role: "status" }); p.textContent = "";
    var PROD = { banner_top: "Banner oben", banner_mid: "Banner Mitte", banner_bottom: "Banner unten", company_card: "Firmenkarte", lead_form: "Lead-Formular" };
    var ST = { draft: "Entwurf", awaiting: "wartet", active: "läuft", paused: "pausiert", ended: "beendet", cancelled: "storniert" };
    var PAY = { pending: "offen", approved: "freigegeben (PayPal)", paid: "bezahlt", denied: "abgelehnt", refunded: "erstattet", cancelled: "storniert" };
    var CR = { pending: "Freigabe offen", approved: "freigegeben", rejected: "abgelehnt" };
    function eur(c) { return (Number(c || 0) / 100).toFixed(2).replace(".", ",") + " €"; }
    function cell(v) { return v && v.nodeType ? h("td", {}, [v]) : h("td", { text: v == null ? "–" : String(v) }); }
    function tbl(head, rows, empty) { var tb = h("tbody"); rows.forEach(function (r) { tb.appendChild(h("tr", {}, r.map(cell))); });
      if (!rows.length) tb.appendChild(h("tr", {}, [h("td", { colspan: String(head.length), class: "mut", text: empty })]));
      return h("div", { style: "overflow-x:auto" }, [h("table", { class: "adm-tbl" }, [h("thead", {}, [h("tr", {}, head.map(function (x) { return h("th", { text: x }); }))]), tb])]); }
    function post(path, body, ok) { return api(path, { method: "POST", body: body }).then(function (r) { msg(m, r.s === 200 ? (ok || "Gespeichert.") : (ERR[(r.j || {}).error] || "Fehler " + r.s + (r.j && r.j.error ? " (" + r.j.error + ")" : "")), r.s !== 200); return r; }); }
    p.append(h("h2", { text: "Werbung (Werbeplätze)" }), m);

    // Buchungen
    var bSec = h("section"), filter = h("select", { "aria-label": "Status filtern" }, [["", "Alle"], ["review", "Freigabe offen"], ["awaiting", "Wartet"], ["active", "Läuft"], ["paused", "Pausiert"], ["ended", "Beendet"], ["cancelled", "Storniert"]].map(function (o) { return h("option", { value: o[0], text: o[1] }); }));
    var preview = h("div", { class: "adm-ad-preview" });
    p.append(bSec);
    function preview_(b) {   // Vorschau im echten Platz: feste Groesse wie auf der Seite
      preview.textContent = "";
      var box = function (src, w, hh) { return h("div", { style: "width:" + w + "px;height:" + hh + "px;max-width:100%;border:1px dashed var(--bd);display:flex;align-items:center;justify-content:center;margin:.4em 0" }, [src ? h("img", { src: src, width: String(w), height: String(hh), alt: b.alt || "" }) : h("span", { class: "mut", text: "kein Bild" })]); };
      preview.append(h("h3", { text: "Vorschau " + b.code + " · " + (PROD[b.product] || b.product) }), h("small", { text: "Anzeige" }));
      if (b.banner_url || /^banner_/.test(b.product)) { preview.appendChild(box(b.banner_url, b.banner_w || (b.product === "banner_mid" ? 300 : 728), b.banner_h || (b.product === "banner_mid" ? 250 : 90))); if (b.product !== "banner_mid") preview.appendChild(box(b.mobile_url, 320, 100)); }
      else preview.appendChild(h("div", { style: "max-width:340px;border:1px dashed var(--bd);padding:1em;text-align:center" }, [h("b", { text: b.org_name || "" }), h("p", { text: b.tagline }), h("span", { class: "btn main", text: b.product === "lead_form" ? "Kontakt zu " + (b.org_name || "") : "Zum Firmenprofil" })]));
      preview.appendChild(h("p", {}, ["Ziel: ", b.target_url ? h("a", { href: b.target_url, target: "_blank", rel: "noopener", text: b.target_url }) : "Firmenprofil / Formular", " · Alt: " + (b.alt || "–")]));
      preview.scrollIntoView();
    }
    function loadBookings() {
      api("/api/admin/ads/bookings" + (filter.value ? "?status=" + encodeURIComponent(filter.value) : "")).then(function (r) {
        bSec.textContent = ""; bSec.append(h("h3", { text: "Buchungen" }), h("p", {}, ["Status: ", filter]));
        if (r.s !== 200) { msg(m, "Buchungen nicht abrufbar", true); return; }
        bSec.appendChild(h("p", { class: "mut", text: "PayPal-Umgebung: " + r.j.paypal_env + ". Kampagnen starten erst, wenn die Zahlung bestätigt und das Werbemittel freigegeben ist." }));
        bSec.appendChild(tbl(["Code", "Firma", "Platz", "Volumen", "Preis", "Zahlung", "Werbemittel", "Status", "Zahlen", "Aktionen"], (r.j.bookings || []).map(function (b) {
          var acts = h("span", {}, [h("button", { type: "button", class: "btn", text: "Vorschau", onclick: function () { preview_(b); } })]);
          function act(label, path, body, main) { acts.append(" ", h("button", { type: "button", class: "btn" + (main ? " main" : ""), text: label, onclick: function (ev) { ev.target.disabled = true; post(path, body).then(loadBookings); } })); }
          if (b.creative_status !== "approved" && ["cancelled", "ended"].indexOf(b.status) < 0) act("Freigeben", "/api/admin/ads/review", { id: b.id, decision: "approve" }, true);
          if (b.creative_status !== "rejected" && ["cancelled", "ended"].indexOf(b.status) < 0) acts.append(" ", h("button", { type: "button", class: "btn", text: "Ablehnen", onclick: function () { var reason = window.prompt("Grund (sieht die Firma):") || ""; if (reason.length < 3) return; post("/api/admin/ads/review", { id: b.id, decision: "reject", reason: reason }).then(loadBookings); } }));
          if (b.status === "active") act("Pausieren", "/api/admin/ads/status", { id: b.id, status: "paused" });
          if (b.status === "paused" && b.pay_status === "paid" && b.creative_status === "approved") act("Fortsetzen", "/api/admin/ads/status", { id: b.id, status: "active" });
          if (["pending", "approved"].indexOf(b.pay_status) >= 0 && ["draft", "awaiting"].indexOf(b.status) >= 0) acts.append(" ", h("button", { type: "button", class: "btn", text: "Zahlung manuell bestätigen", onclick: function () { if (window.confirm("Zahlung für " + b.code + " ohne PayPal als eingegangen markieren?")) post("/api/admin/ads/mark-paid", { id: b.id }).then(loadBookings); } }));
          if (["ended", "cancelled"].indexOf(b.status) < 0) acts.append(" ", h("button", { type: "button", class: "btn", text: "Stornieren", onclick: function () { if (window.confirm("Buchung " + b.code + " stornieren? Eine Erstattung läuft in PayPal.")) post("/api/admin/ads/status", { id: b.id, status: "cancelled" }).then(loadBookings); } }));
          var payInfo = h("span", {}, [(PAY[b.pay_status] || b.pay_status) + " · " + (b.pay_method === "invoice" ? "Rechnung" : "PayPal")]);
          if (b.invoice_url) payInfo.append(" · ", h("a", { href: b.invoice_url, target: "_blank", rel: "noopener", text: "Rechnung" }));
          return [b.code, b.org_name || b.org_id, PROD[b.product] || b.product, b.delivered + " / " + b.quantity, eur(b.total_cents), payInfo,
            (CR[b.creative_status] || b.creative_status) + (b.reject_reason ? ": " + b.reject_reason : ""), (ST[b.status] || b.status) + (b.start ? " (" + b.start + " – " + (b.end || "") + ")" : ""),
            b.impressions + " Einbl. · " + b.clicks + " Klicks · " + b.leads + " Leads", acts];
        }), "Keine Buchungen."));
        bSec.appendChild(preview);
      });
    }
    filter.onchange = loadBookings; loadBookings();

    // Sponsoring-Pakete von /sponsor/, bestellt per PayPal-Rechnung (M365Con bleibt auf Anfrage)
    var oSec = h("section"); p.append(oSec);
    api("/api/admin/sponsor-orders").then(function (r) {
      if (r.s !== 200) return;
      oSec.append(h("h3", { text: "Sponsoring-Bestellungen (PayPal-Rechnung)" }), h("p", { class: "mut", text: "Preis vom Server aus data/sponsor_pricing.json neu berechnet. Nach Zahlungseingang steht die Platzierung im Sponsor-Dashboard der Firma." }));
      oSec.appendChild(tbl(["Code", "Firma", "Laufzeit", "Netto", "Gesamt", "Zahlung", "Rechnung", "Platzierung"], (r.j.orders || []).map(function (o) {
        var cur = " " + (o.currency || "");
        return [o.code, o.org_name || o.org_id, (o.package && o.package.rt ? o.package.rt + " Monate" : "–"), (o.net_cents / 100).toFixed(2) + cur, (o.total_cents / 100).toFixed(2) + cur,
          PAY[o.pay_status] || o.pay_status, o.invoice_url ? h("a", { href: o.invoice_url, target: "_blank", rel: "noopener", text: "öffnen" }) : "–", o.placement_id || "–"];
      }), "Noch keine Bestellungen."));
    });

    // Preise, Regeln, Profilstufen
    var pSec = h("section"); p.append(pSec);
    api("/api/admin/ads/pricing").then(function (r) {
      if (r.s !== 200) return;
      var inputs = [], sets = {};
      pSec.append(h("h3", { text: "Preise je Seitentyp (netto, Einführungspreise)" }), h("p", { class: "mut", text: "Banner: Preis je 1.000 Einblendungen; Firmenkarte je Klick; Lead-Formular je Lead (freies Profil). Bei mehreren Seitentypen gilt der teuerste." }));
      pSec.appendChild(tbl(["Platz", "Seitentyp", "Preis in €", "aktiv"], (r.j.prices || []).map(function (x) {
        var price = h("input", { type: "number", min: "0", step: "0.01", value: (x.price_cents / 100).toFixed(2), "aria-label": "Preis " + x.product + " " + x.page_type, style: "width:7em" });
        var on = h("input", { type: "checkbox", "aria-label": "aktiv" }); on.checked = !!x.active;
        inputs.push({ product: x.product, page_type: x.page_type, price: price, on: on });
        return [PROD[x.product] || x.product, x.page_type, price, on];
      }), ""));
      var LBL = { min_impressions: "Mindestbuchung Einblendungen", min_clicks: "Mindestens Klicks", min_leads: "Mindestens Leads", topic_pct: "Themen-Targeting +%", exclusive_pct: "Exklusiv +%", runtime3_pct: "Rabatt ab 3 Monaten %", runtime6_pct: "Rabatt ab 6 Monaten %", lead_expert_cents: "Lead Expert-Profil (Cent)", lead_premium_cents: "Lead Premium (Cent)", premium_included_leads: "Premium: enthaltene Leads", vat_pct: "USt.-Satz % (mit Steuerberatung klären)", reverse_charge: "Reverse Charge für EU-Firmen mit USt-ID (0/1)", invoice_due_days: "Zahlungsziel Rechnung (Tage)", intro_prices: "Als Einführungspreis kennzeichnen (0/1)" };
      var grid = h("div", { class: "adm-form" });
      (r.j.setting_keys || []).forEach(function (k) { sets[k] = h("input", { type: "number", value: (r.j.settings || {})[k] || "0", style: "width:8em" }); grid.appendChild(h("label", {}, [LBL[k] || k, " ", sets[k]])); });
      pSec.append(h("h3", { text: "Regeln" }), grid, h("p", {}, [h("button", { type: "button", class: "btn main", text: "Preise und Regeln speichern", onclick: function () {
        var settings = {}; Object.keys(sets).forEach(function (k) { settings[k] = Number(sets[k].value); });
        post("/api/admin/ads/pricing", { prices: inputs.map(function (x) { return { product: x.product, page_type: x.page_type, price_cents: Math.round(Number(x.price.value) * 100), active: x.on.checked }; }), settings: settings });
      } })]));
      var orgId = h("input", { type: "number", min: "1", placeholder: "Firmen-ID", style: "width:8em" }), plan = h("select", {}, ["free", "expert", "premium"].map(function (x) { return h("option", { value: x, text: x }); })), inc = h("input", { type: "number", min: "0", value: "10", style: "width:6em" });
      pSec.append(h("h3", { text: "Lead-Preisstufe je Firma" }), tbl(["Firma", "Stufe", "enthaltene Leads"], (r.j.accounts || []).map(function (a) { return [a.name + " (#" + a.org_id + ")", a.plan, a.included_leads]; }), "Alle Firmen: freies Profil."),
        h("p", {}, [orgId, " ", plan, " ", inc, " ", h("button", { type: "button", class: "btn", text: "Stufe setzen", onclick: function () { post("/api/admin/ads/account", { org_id: Number(orgId.value), plan: plan.value, included_leads: Number(inc.value) }).then(function () { LOAD.ads(); }); } })]));
    });

    // Hausanzeigen (Rueckfall vor den eingebauten Hausanzeigen)
    var hSec = h("section"); p.append(hSec);
    function loadHouse() {
      api("/api/admin/ads/house").then(function (r) {
        hSec.textContent = ""; if (r.s !== 200) return;
        hSec.append(h("h3", { text: "Hausanzeigen" }), h("p", { class: "mut", text: "Erscheinen auf freien Plätzen statt der fest eingebauten Hausanzeigen (M365Con, Services, Werbeplätze). Sprachen leer = alle." }));
        hSec.appendChild(tbl(["Platz", "Titel", "Ziel", "Sprachen", "Zeitraum", "Aktiv", ""], (r.j.house || []).map(function (x) {
          return [x.slot, x.title, x.url, x.langs || "alle", (x.start || "…") + " – " + (x.end || "…"), x.active ? "ja" : "nein", h("button", { type: "button", class: "btn", text: "Löschen", onclick: function () { post("/api/admin/ads/house", { delete: x.id }).then(loadHouse); } })];
        }), "Keine eigenen Hausanzeigen."));
        var f = {}; ["title", "body", "cta", "url", "langs", "start", "end"].forEach(function (k) { f[k] = h("input", { type: k === "url" ? "url" : k === "start" || k === "end" ? "date" : "text" }); });
        var slot = h("select", {}, ["top", "mid", "bottom"].map(function (x) { return h("option", { value: x, text: x }); }));
        hSec.append(h("div", { class: "adm-form" }, [h("label", {}, ["Platz ", slot]), h("label", {}, ["Titel ", f.title]), h("label", {}, ["Text ", f.body]), h("label", {}, ["Knopf ", f.cta]), h("label", {}, ["Ziel (https) ", f.url]), h("label", {}, ["Sprachen (de,en …) ", f.langs]), h("label", {}, ["Von ", f.start]), h("label", {}, ["Bis ", f.end]),
          h("button", { type: "button", class: "btn main", text: "Hausanzeige anlegen", onclick: function () { post("/api/admin/ads/house", { slot: slot.value, title: f.title.value, body: f.body.value, cta: f.cta.value, url: f.url.value, langs: f.langs.value, start: f.start.value || null, end: f.end.value || null }).then(loadHouse); } })]));
      });
    }
    loadHouse();

    // Hausanzeigen (M365Con, Services, Werben/Sponsoring, eigene): Einblendungen, Klicks, CTR je Platz, Land, Sprache - laeuft auch bei ADS_BOOKING aus
    var hsSec = h("section"), hsDays = h("select", { "aria-label": "Zeitraum" }, [["7", "Letzte 7 Tage"], ["30", "Letzte 30 Tage"], ["90", "Letzte 90 Tage"]].map(function (o) { return h("option", { value: o[0], text: o[1] }); }));
    var POS = { top: "oben unter dem Header", mid: "früh im Text", mid2: "Mitte (lange Seiten)", bottom: "unten" };
    p.append(hsSec);
    function loadHouseStats() {
      api("/api/admin/ads/house-stats?days=" + hsDays.value).then(function (r) {
        hsSec.textContent = "";
        hsSec.append(h("h3", { text: "Hausanzeigen: Zahlen" }), h("p", {}, ["Zeitraum ", hsDays, " ", h("button", { type: "button", class: "btn", text: "CSV herunterladen", onclick: function () {
          fetch(API + "/api/admin/ads/house-stats?days=" + hsDays.value + "&format=csv", { credentials: "include", headers: { "x-requested-with": "m365" } }).then(function (x) { return x.blob(); }).then(function (blob) {
            var a = h("a", { href: URL.createObjectURL(blob), download: "m365fm-hausanzeigen.csv" }); document.body.appendChild(a); a.click(); a.remove(); });
        } })]), h("p", { class: "mut", text: "Cookiefrei gezählt (ohne Bots), Land aus Cloudflare (nur Ländercode). Klicks über den Go-Link; die Ziel-URL trägt utm_source=m365.fm, utm_medium=house_ad, utm_campaign, utm_term (Haupt-Entität der Seite) und utm_content (Slug der Seite)." }));
        if (r.s !== 200) return;
        var row = function (x) { return [x.key.replace(/ · (top|mid2|mid|bottom)$/, function (m0, k) { return " · " + (POS[k] || k); }), x.impressions, x.clicks, x.ctr == null ? "–" : x.ctr + " %"]; };
        hsSec.append(h("h4", { text: "Je Hausanzeige" }), tbl(["Hausanzeige", "Einblendungen", "Klicks", "CTR"], (r.j.by_house || []).map(row), "Noch keine Zahlen."),
          h("h4", { text: "Je Platz" }), tbl(["Hausanzeige · Platz", "Einblendungen", "Klicks", "CTR"], (r.j.by_slot || []).map(row), "–"),
          h("h4", { text: "Je Land" }), tbl(["Hausanzeige · Land", "Einblendungen", "Klicks", "CTR"], (r.j.by_country || []).slice(0, 60).map(row), "–"),
          h("h4", { text: "Je Sprache" }), tbl(["Hausanzeige · Sprache", "Einblendungen", "Klicks", "CTR"], (r.j.by_lang || []).map(row), "–"));
      });
    }
    hsDays.onchange = loadHouseStats; loadHouseStats();

    // Zahlen + CSV
    var sSec = h("section"), from = h("input", { type: "date" }), to = h("input", { type: "date" }); p.append(sSec);
    function loadStats() {
      var q = "?" + (from.value ? "from=" + from.value + "&" : "") + (to.value ? "to=" + to.value : "");
      api("/api/admin/ads/stats" + q).then(function (r) {
        sSec.textContent = ""; sSec.append(h("h3", { text: "Zahlen" }), h("p", {}, ["Von ", from, " bis ", to, " ", h("button", { type: "button", class: "btn", text: "Anzeigen", onclick: loadStats }), " ",
          h("button", { type: "button", class: "btn", text: "CSV herunterladen", onclick: function () {
            fetch(API + "/api/admin/ads/stats" + q + "&format=csv", { credentials: "include", headers: { "x-requested-with": "m365" } }).then(function (x) { return x.blob(); }).then(function (blob) {
              var a = h("a", { href: URL.createObjectURL(blob), download: "m365fm-werbung.csv" }); document.body.appendChild(a); a.click(); a.remove(); });
          } })]));
        if (r.s !== 200) return; var t = r.j.totals;
        sSec.appendChild(h("div", { class: "adm-grid" }, [tile("Einblendungen", t.impressions), tile("Klicks", t.clicks), tile("Klickrate", t.ctr == null ? "–" : t.ctr + " %"), tile("Leads", t.leads), tile("Umsatz netto (bezahlt)", eur(t.revenue_net_cents), t.paid_bookings + " Buchungen")]));
        sSec.appendChild(tbl(["Tag", "Kampagne", "Firma", "Platz", "Seitentyp", "Land", "Einbl.", "Klicks", "Leads"], (r.j.rows || []).slice(0, 200).map(function (x) { return [x.day, x.code, x.org, x.slot, x.page_type, x.country, x.impressions, x.clicks, x.leads]; }), "Noch keine Zahlen."));
      });
    }
    loadStats();

    // Leads (alle; beanstandete zuerst)
    var lSec = h("section"); p.append(lSec);
    var lSt = leadFilterSel(), lMsg = h("p", { class: "adm-msg" }), lAll = [], lCsv = h("button", { type: "button", class: "btn", text: "CSV exportieren" }), LU = "/api/admin/ads/lead-status";
    function lcell(v) { v = String(v == null ? "" : v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; }
    function lday(x) { return new Date(x.created * 1000).toISOString().slice(0, 10); }
    function leadsView() {
      var list = lAll.filter(function (x) { return !lSt.value || leadSt(x.lead_status)[0] === lSt.value; }); lCsv._list = list;
      lSec.textContent = "";
      lSec.append(h("h3", { text: "Leads" }), lSt, " ", lCsv, leadCounts(lAll, "lead_status"), lMsg, tbl(["Datum", "Kampagne", "Firma", "Name", "E-Mail", "Abrechnung", "Grund", "", "Lead-Status", "Ändern", ""], list.map(function (x) {
        var acts = x.status === "disputed" ? h("span", {}, [h("button", { type: "button", class: "btn main", text: "Gutschreiben", onclick: function () { post("/api/admin/ads/lead", { id: x.id, credit: true }).then(loadLeads).then(loadBookings); } }), " ",
          h("button", { type: "button", class: "btn", text: "Berechnen", onclick: function () { post("/api/admin/ads/lead", { id: x.id, credit: false }).then(loadLeads); } })]) : null;
        return [lday(x), x.code, x.org + (x.assigned ? " → " + x.assigned : ""), x.name, x.email, x.status + (x.charged ? "" : " (nicht berechnet)"), x.dispute_reason, acts, leadBadge(x.lead_status), leadStatusSel(x, "lead_status", LU, lMsg, leadsView),
          leadDelete(x, LU, lMsg, function () { lAll = lAll.filter(function (y) { return y.id !== x.id; }); leadsView(); })];
      }), "Noch keine Leads."));
    }
    lSt.onchange = leadsView;
    lCsv.onclick = function () {
      var lines = [["Datum", "Kampagne", "Firma", "Name", "E-Mail", "Abrechnung", "Grund", "Lead-Status"].join(",")].concat((lCsv._list || []).map(function (x) { return [lday(x), x.code, x.org + (x.assigned ? " → " + x.assigned : ""), x.name, x.email, x.status, x.dispute_reason, leadSt(x.lead_status)[1]].map(lcell).join(","); }));
      var a = h("a", { href: URL.createObjectURL(new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" })), download: "m365fm-werbe-leads.csv" }); document.body.appendChild(a); a.click(); a.remove();
    };
    function loadLeads() {
      return api("/api/admin/ads/leads").then(function (r) { if (r.s !== 200) { lSec.textContent = ""; return; } lAll = r.j.leads || []; leadsView(); });
    }
    loadLeads();
  }

  // ---------- Uebersetzungen: Uebersicht je Sprache, Filter, Vormerken ----------
  function translations() {
    var p = panes.tr, m = h("p", { class: "adm-msg" }), sum = h("div", { class: "adm-sum" }), kf = h("select", { "aria-label": "Art" }), lf = h("select", { "aria-label": "Sprache" }), sf = h("select", { "aria-label": "Status" }), q = h("input", { type: "search", placeholder: "Suchen im Titel", "aria-label": "Suchen" });
    var tbl = h("table", { class: "adm-tbl" }), tbody = h("tbody"), head = h("thead"), bulk = h("button", { type: "button", class: "btn", text: "Alle gefilterten vormerken" }), unbulk = h("button", { type: "button", class: "btn", text: "Vormerkung zurücknehmen" }), cnt = h("span", { class: "mut" });
    var D = null, Q = {};
    kf.appendChild(h("option", { value: "", text: "Alle Arten" })); Object.keys(KINDN).forEach(function (k) { kf.appendChild(h("option", { value: k, text: KINDN[k] })); });
    [["", "Alle Sprachen"]].concat(Object.keys(LANGN).filter(function (l) { return l !== "en"; }).map(function (l) { return [l, LANGN[l]]; })).forEach(function (x) { lf.appendChild(h("option", { value: x[0], text: x[1] })); });
    [["", "Alle"], ["missing", "fehlt"], ["done", "vorhanden"], ["queued", "vorgemerkt"], ["failed", "fehlgeschlagen"], ["none", "komplett ohne Übersetzung"]].forEach(function (x) { sf.appendChild(h("option", { value: x[0], text: x[1] })); });
    p.append(h("h2", { text: "Übersetzungen nach Sprache" }), h("p", { class: "mut", text: "Grün: vorhanden. Grau: fehlt, anklicken zum Vormerken. Blau: vorgemerkt (nochmal anklicken nimmt es zurück). Abgearbeitet wird, sobald unter Schalter „Vormerkungen mit Haiku abarbeiten“ an ist." }), sum, h("div", { class: "adm-row" }, [q, kf, lf, sf]), h("p", {}, [bulk, " ", unbulk, " ", cnt]), m, tbl);
    tbl.append(head, tbody); tbody.appendChild(h("tr", {}, [h("td", { class: "mut", text: "Lädt …" })]));
    function load() { api("/api/admin/panel/translations").then(function (r) { if (r.s !== 200) { msg(m, ERR[(r.j || {}).error] || "Übersicht nicht abrufbar", true); return; } D = r.j; Q = {}; (D.queue || []).forEach(function (x) { Q[x.kind + "|" + x.item_id + "|" + x.lang] = x; }); draw(); }); }
    function state(r, l) { if (r.lang === l) return "src"; if (r.langs.indexOf(l) > -1) return "done"; var x = Q[r.k + "|" + r.id + "|" + l]; return x ? (x.status === "failed" ? "failed" : x.status === "done" ? "done" : "queued") : "missing"; }
    function filtered() { var k = kf.value, l = lf.value, st = sf.value, s = q.value.trim().toLowerCase(), langs = D.langs; return (D.rows || []).filter(function (r) {
      if (k && r.k !== k) return false; if (s && r.t.toLowerCase().indexOf(s) < 0) return false;
      if (st === "none") return langs.every(function (x) { return state(r, x) === "missing" || state(r, x) === "src"; });
      if (!st) return true; var ls = l ? [l] : langs; return ls.some(function (x) { return state(r, x) === st; }); }); }
    function toggle(r, l, on) { api("/api/admin/panel/tr-queue", { method: "POST", body: { kind: r.k, id: r.id, lang: l, title: r.t, on: on } }).then(function (x) { if (x.s === 200) { if (on) Q[r.k + "|" + r.id + "|" + l] = { status: "open" }; else delete Q[r.k + "|" + r.id + "|" + l]; draw(); } else msg(m, ERR[(x.j || {}).error] || "Fehler", true); }); }
    function draw() {
      var langs = D.langs, rows = filtered(); sum.textContent = ""; head.textContent = ""; tbody.textContent = "";
      langs.forEach(function (l) { var d = 0, qd = 0, miss = 0; (D.rows || []).forEach(function (r) { var st = state(r, l); if (st === "done") d++; else if (st === "queued" || st === "failed") qd++; else if (st === "missing") miss++; }); sum.appendChild(h("div", {}, [h("b", { text: d + " / " + (d + miss + qd) }), LANGN[l] || l, h("br"), h("small", { text: miss + " fehlen" + (qd ? ", " + qd + " vorgemerkt" : "") })])); });
      head.appendChild(h("tr", {}, [h("th", { text: "Inhalt" }), h("th", { text: "Art" })].concat(langs.map(function (l) { return h("th", { text: l }); }))));
      rows.slice(0, 300).forEach(function (r) { tbody.appendChild(h("tr", {}, [h("td", { text: r.t }), h("td", { class: "mut", text: KINDN[r.k] || r.k })].concat(langs.map(function (l) { var st = state(r, l);
        if (st === "src") return h("td", { class: "mut", text: "Quelle" }); if (st === "done") return h("td", {}, [h("span", { class: "adm-chip ok", text: "✓" })]);
        var b = h("button", { type: "button", class: "adm-chip" + (st === "queued" ? " q" : st === "failed" ? " fail" : ""), text: st === "queued" ? "◷" : st === "failed" ? "!" : "+", title: st === "queued" ? "vorgemerkt – zurücknehmen" : st === "failed" ? "fehlgeschlagen – erneut vormerken" : "vormerken", onclick: function () { toggle(r, l, st !== "queued"); } }); return h("td", {}, [b]); })))); });
      cnt.textContent = rows.length + " Inhalte" + (rows.length > 300 ? " (300 angezeigt, bitte filtern)" : "");
      bulk.onclick = function () { var l = lf.value; if (!l) { msg(m, "Bitte zuerst eine Sprache wählen.", true); return; } var items = rows.filter(function (r) { return state(r, l) === "missing" || state(r, l) === "failed"; }).slice(0, 500).map(function (r) { return { kind: r.k, id: r.id, lang: l, title: r.t }; }); if (!items.length) { msg(m, "Nichts vorzumerken."); return; }
        api("/api/admin/panel/tr-queue", { method: "POST", body: { items: items, on: true } }).then(function (x) { if (x.s === 200) { msg(m, x.j.n + " vorgemerkt für " + LANGN[l] + "."); load(); } else msg(m, "Fehler", true); }); };
      unbulk.onclick = function () { var l = lf.value; if (!l) { msg(m, "Bitte zuerst eine Sprache wählen.", true); return; } var items = rows.filter(function (r) { return state(r, l) === "queued" || state(r, l) === "failed"; }).slice(0, 500).map(function (r) { return { kind: r.k, id: r.id, lang: l }; }); if (!items.length) { msg(m, "Nichts vorgemerkt."); return; }
        api("/api/admin/panel/tr-queue", { method: "POST", body: { items: items, on: false } }).then(function (x) { if (x.s === 200) { msg(m, x.j.n + " zurückgenommen."); load(); } else msg(m, "Fehler", true); }); };
    }
    [kf, lf, sf].forEach(function (e) { e.addEventListener("change", function () { if (D) draw(); }); }); q.addEventListener("input", function () { if (D) draw(); });
    load();
  }

  // ---------- Entitaeten ----------
  // ---------- Gäste einladen: Zähler, Probelauf und Sammelversand (max. 50) der Entitäten-Einladungen; Rückfrage inline, kein window.confirm ----------
  function guestInvite(p) {
    var box = h("section", { class: "adm-guest-invite" }), counts = h("p", { class: "mut", text: "Lädt …" }), m = h("p", { class: "adm-msg", role: "status" }), out = h("ul", { class: "adm-list" }), ask = h("span"), dry, send, running = false;
    var SRC = "guest", tg = h("span", { role: "group", "aria-label": "Quelle" });
    function tgDraw() { tg.textContent = ""; [["guest", "Gäste"], ["speaker", "Speaker"]].forEach(function (o) { tg.append(h("button", { type: "button", class: "btn" + (SRC === o[0] ? " main" : ""), "aria-pressed": SRC === o[0] ? "true" : "false", text: o[1], onclick: function () { SRC = o[0]; idle(); tgDraw(); } }), " "); }); }
    function load() { api("/api/entityinvite/send-batch").then(function (r) { var j = r.j || {}, g = (j.sources || {}).guest || {}, sp = (j.sources || {}).speaker || {}; counts.textContent = r.s === 200 ? ("Gäste: " + g.contacts + " Kontakte, " + g.eligible + " offen · Speaker: " + sp.contacts + " Kontakte, " + sp.eligible + " offen (ohne gesperrte, übernommene und doppelte Adressen).") : "Zähler nicht abrufbar (" + ((r.j || {}).error || r.s) + ")"; }); }
    function idle() { ask.textContent = ""; if (!running) send.disabled = false; }   // waehrend ein Versand laeuft, bleibt "50 senden" gesperrt (auch beim Wechsel Gäste/Speaker)
    function done() { running = false; send.disabled = false; dry.disabled = false; load(); }
    function list(items) { out.textContent = ""; (items || []).forEach(function (x) { out.appendChild(h("li", { text: x.eid + " · " + (x.email || "") + " · " + (x.variant || "") + (x.error ? " · " + x.error : x.ok === false ? " · Fehler" : "") })); }); }
    dry = h("button", { type: "button", class: "btn", text: "Probelauf (50)", onclick: function () { dry.disabled = true; msg(m, "Läuft …"); api("/api/entityinvite/send-batch", { method: "POST", body: { limit: 50, dry_run: true, source: SRC } }).then(function (r) { dry.disabled = false; var j = r.j || {}; if (r.s !== 200) { msg(m, "Fehler (" + (j.error || r.s) + ")", true); return; } list(j.items); msg(m, "Probelauf: " + (j.items || []).length + " Einladungen würden gesendet, nichts verschickt."); }); } });
    send = h("button", { type: "button", class: "btn main", text: "50 senden", onclick: function () {
      send.disabled = true; ask.textContent = "";
      ask.append(h("span", { text: "Wirklich 50 Einladungen (" + (SRC === "speaker" ? "Speaker" : "Gäste") + ") senden? " }), h("button", { type: "button", class: "btn main", text: "Ja", onclick: function () {
        // Erst wenn die Antwort da ist, wird wieder freigegeben: ein zweiter Klick wuerde sonst einen zweiten Lauf starten (der Server weist ihn zusaetzlich mit 409 busy ab)
        running = true; ask.textContent = ""; dry.disabled = true; msg(m, "Sendet … bitte warten, bis der Versand fertig ist.");
        api("/api/entityinvite/send-batch", { method: "POST", body: { limit: 50, dry_run: false, source: SRC } }).then(function (r) { var j = r.j || {}; list(j.results); if (r.s === 200 || j.sent) msg(m, j.sent + " Einladungen gesendet" + (j.rate_limited ? " (Tageslimit erreicht)" : "") + "."); else msg(m, j.error === "busy" ? "Es läuft bereits ein Versand – bitte warten und danach neu laden." : "Fehler (" + (j.error || r.s) + ")", true); done(); },
          function () { msg(m, "Keine Antwort vom Server – ob gesendet wurde, zeigt der Zähler oben.", true); done(); }); } }), " ", h("button", { type: "button", class: "btn", text: "Nein", onclick: idle }));
    } });
    var eidIn = h("input", { type: "text", placeholder: "Entitäts-ID, z. B. david-benaim", "aria-label": "Entitäts-ID für Testmail" }), vSel = h("select", { "aria-label": "Variante der Testmail" }), tb = h("button", { type: "button", class: "btn", text: "Testmail an mich", onclick: function () { var e = eidIn.value.trim().toLowerCase(); if (!e) return; tb.disabled = true; api("/api/entityinvite/test", { method: "POST", body: { eid: e, variant: vSel.value } }).then(function (r) { tb.disabled = false; var j = r.j || {}; msg(m, r.s === 200 ? "Testmail an dein Konto gesendet (Variante " + j.variant + ")." : "Fehler (" + (j.error || r.s) + ")", r.s !== 200); }); } });
    // Testmail: jede Fassung vorab ansehen; "automatisch" nimmt die Fassung, die diese Entitaet beim echten Versand bekaeme
    [["", "Variante: automatisch"], ["default", "Gast (Standard)"], ["mvp", "Gast (MVP/MCT)"], ["speaker", "Speaker (M365Con)"], ["neutral", "Neutral (Mitglied lädt ein)"]].forEach(function (o) { vSel.appendChild(h("option", { value: o[0], text: o[1] })); });
    tgDraw(); box.append(h("h2", { text: "Gäste einladen" }), counts, h("p", {}, [tg]), h("p", {}, [dry, " ", send, " ", ask]), h("p", {}, [eidIn, " ", vSel, " ", tb]), m, out); p.appendChild(box); load();
  }
  function entities() {
    var p = panes.ent, q = h("input", { type: "search", id: "adm-q", placeholder: "Suchen: Name, ID oder Alias", "aria-label": "Entitäten suchen" }), tf = h("select", { id: "adm-tf", "aria-label": "Typ" }), list = h("ul", { class: "adm-list" }), form = h("div", { class: "adm-form", hidden: "" }), all = [];
    tf.appendChild(h("option", { value: "", text: "Alle Typen" })); Object.keys(TYPES).forEach(function (k) { tf.appendChild(h("option", { value: k, text: TYPES[k] })); });
    guestInvite(p);
    p.append(h("div", { class: "adm-row" }, [q, tf]), list, form);
    list.appendChild(h("li", { class: "mut", text: "Lädt …" }));
    Promise.all([fetch(BASE + "/entities.json").then(function (r) { return r.json(); }).catch(function () { return { entities: [] }; }), api("/api/entity/export")]).then(function (res) {
      var by = {}; (res[0].entities || []).forEach(function (e) { by[e.id] = { e: e, db: false }; });
      ((res[1].j || {}).items || []).forEach(function (x) { by[x.id] = { e: Object.assign({ id: x.id }, x.data), db: true }; });
      all = Object.keys(by).map(function (k) { return by[k]; }).sort(function (a, b) { return String(a.e.name).localeCompare(String(b.e.name)); }); draw();
    });
    function draw() {
      var s = q.value.trim().toLowerCase(), t = tf.value, n = 0; list.textContent = "";
      all.forEach(function (x) { var e = x.e; if (t && e.type !== t) return; if (s && (e.name + " " + e.id + " " + (e.aliases || []).join(" ")).toLowerCase().indexOf(s) < 0) return; if (++n > 80) return;
        list.appendChild(h("li", {}, [h("button", { type: "button", class: "adm-item", onclick: function () { edit(e.id); } }, [h("b", { text: e.name }), " ", h("span", { class: "mut", text: (TYPES[e.type] || e.type) + " · " + e.id }), " ", h("span", { class: "adm-badge" + (x.db ? " on" : ""), text: x.db ? "Datenbank" : "nur Datei" })])])); });
      if (n > 80) list.appendChild(h("li", { class: "mut", text: (n - 80) + " weitere, bitte genauer suchen" }));
      if (!n) list.appendChild(h("li", { class: "mut", text: "Keine Treffer" }));
    }
    q.addEventListener("input", draw); tf.addEventListener("change", draw);
    function field(id, label, val, o) { o = o || {}; var inp = o.area ? h("textarea", { id: id, rows: o.rows || 3, maxlength: o.max || 600 }) : h("input", { type: "text", id: id, maxlength: o.max || 300 }); inp.value = val || ""; return h("p", { class: "adm-field" }, [h("label", { for: id, text: label }), inp, o.hint ? h("small", { class: "mut", text: o.hint }) : null]); }
    function edit(id) {
      form.hidden = false; form.textContent = "Lädt …"; form.scrollIntoView({ behavior: "smooth", block: "start" });
      api("/api/entity?id=" + encodeURIComponent(id)).then(function (r) {
        var base = (all.filter(function (x) { return x.e.id === id; })[0] || {}).e || {}, d = (r.j && r.j.live && r.j.live.data) || base, m = h("p", { class: "adm-msg" });
        form.textContent = ""; form.appendChild(h("h2", { text: d.name || id }));
        form.appendChild(h("p", { class: "mut" }, ["ID ", h("code", { text: id }), " · ", h("a", { href: BASE + "/entity/" + id + "/", target: "_blank", rel: "noopener", text: "Seite ansehen" })]));
        var typ = h("select", { id: "f-type" }); Object.keys(TYPES).forEach(function (k) { var o = h("option", { value: k, text: TYPES[k] }); if (k === d.type) o.selected = true; typ.appendChild(o); });
        var F = {
          name: field("f-name", "Name", d.name, { max: 80 }), aliases: field("f-al", "Andere Namen (mit Komma getrennt)", (d.aliases || []).join(", ")),
          den: field("f-den", "Kurzbeschreibung Englisch", (d.desc || {}).en, { area: 1, max: 300, hint: "20 bis 300 Zeichen, erscheint als Hover-Text" }), dde: field("f-dde", "Kurzbeschreibung Deutsch", (d.desc || {}).de, { area: 1, max: 300 }),
          len: field("f-len", "Lange Beschreibung Englisch", (d.long || {}).en, { area: 1, rows: 7, max: 3000, hint: "Bis 3000 Zeichen. Überschriften und Absätze wie im Editor." }), lde: field("f-lde", "Lange Beschreibung Deutsch", (d.long || {}).de, { area: 1, rows: 7, max: 3000 }),
          web: field("f-web", "Website (https)", d.web), docs: field("f-docs", "Dokumentation (microsoft.com, azure.com, github.com)", d.docs), wp: field("f-wp", "Wikipedia (https)", d.wikipedia), wd: field("f-wd", "Wikidata-ID (z. B. Q12345)", d.wikidata, { max: 12 }),
        };
        var old = h("input", { type: "checkbox", id: "f-old" }); old.checked = !!d.outdated;
        form.append(h("p", { class: "adm-field" }, [h("label", { for: "f-type", text: "Typ" }), typ]), F.name, F.aliases, F.den, F.dde, F.len, F.lde, F.web, F.docs, F.wp, F.wd, h("p", {}, [old, h("label", { for: "f-old", text: " Nicht mehr aktuell (Seite bleibt, wird ausgeblendet)" })]));
        form.appendChild(h("p", { class: "mut", text: "Beziehungen (" + (d.rel || []).length + ") bleiben erhalten; bearbeiten auf der Entitätsseite." }));
        var v = function (f) { return f.querySelector("input,textarea").value.trim(); };
        form.appendChild(h("p", {}, [h("button", { type: "button", class: "btn main", text: "Speichern", onclick: function (ev) {
          var data = Object.assign({}, d, { name: v(F.name), type: typ.value, aliases: v(F.aliases).split(",").map(function (s) { return s.trim(); }).filter(Boolean), desc: { en: v(F.den), de: v(F.dde) }, long: { en: v(F.len), de: v(F.lde) }, web: v(F.web), docs: v(F.docs), wikipedia: v(F.wp), wikidata: v(F.wd), outdated: old.checked, rel: d.rel || [] });
          ev.target.disabled = true; msg(m, "Speichert …");
          api("/api/entity", { method: "POST", body: { id: id, data: data, summary: "Verwaltung" } }).then(function (r) { ev.target.disabled = false;
            if (r.s === 200) { msg(m, r.j.status === "live" ? "Gespeichert. Auf der Seite sichtbar nach dem nächsten Seitenbau." : "Als Vorschlag gespeichert."); all.forEach(function (x) { if (x.e.id === id) { x.e = Object.assign({ id: id }, data); x.db = true; } }); draw(); }
            else msg(m, ERR[r.j.error] || "Fehler " + r.s, true); });
        } }), " ", h("button", { type: "button", class: "btn", text: "Schließen", onclick: function () { form.hidden = true; } })]));
        form.appendChild(m);
      });
    }
  }

  // LinkedIn-Events (Vorschlaege): nichts geht automatisch raus, jede Veroeffentlichung, Aktualisierung und Absage braucht einen Klick plus Rueckfrage.
  // Welche Knoepfe eine Zeile bekommt, sagt der Server (it.can); er prueft jede Aktion beim Ausfuehren noch einmal selbst.
  // LIOPEN: LinkedIn hat einen Event angelegt, der Eintrag hier fehlt aber (Antwort store_failed). Je Event { urn, ticket } zum sofortigen Nachtragen bzw.
  // unter "x<ID>" { lost, urn, url, title }, wenn es hier nichts nachzutragen gibt. Bleibt ueber das Neuladen des Reiters und der Seite stehen (sessionStorage).
  var LIOPEN = {};
  function liOpen(save) { try { if (save) window.sessionStorage.setItem("m365li", JSON.stringify(LIOPEN)); else { var v = JSON.parse(window.sessionStorage.getItem("m365li") || "{}"); LIOPEN = {}; Object.keys(v && typeof v === "object" ? v : {}).forEach(function (k) { if (v[k] && typeof v[k].urn === "string") LIOPEN[k] = v[k]; }); } } catch (e) { /* ohne Speicher gilt es bis zum Neuladen der Seite */ } }
  liOpen(false);
  LOAD.li = function (note, bad) {
    var p = panes.li, m = h("p", { class: "adm-msg" }), LIERR = { not_connected: "LinkedIn-Seite ist noch nicht verbunden.", no_org: "Bitte zuerst die Seite auswählen.", no_match: "Kein gleichzeitiges HeySummit-Event.", past: "Das Event hat schon begonnen oder ist vorbei.", no_time: "Das Event hat keine Uhrzeit.", not_public: "Das m365.fm-Event ist nicht öffentlich.", already_published: "Schon veröffentlicht.", cancelled: "Der LinkedIn-Event ist abgesagt.", not_published: "Zu diesem Event gibt es keinen LinkedIn-Event.", publish_pending: "Für dieses Event läuft schon eine Veröffentlichung oder ihr Ausgang ist offen: bitte in der Liste klären.", publish_running: "Die Veröffentlichung läuft noch, bitte zwei Minuten warten.", not_pending: "Hier ist nichts (mehr) zu klären.", store_failed: "LinkedIn hat den Event angelegt, er konnte hier aber nicht gespeichert werden.", bad_urn: "Das ist keine LinkedIn-Event-ID (die Zahl am Ende der Event-Adresse).", urn_taken: "Diese LinkedIn-Event-ID gehört schon zu einem anderen Event.", orphan: "Das m365.fm-Event gibt es nicht mehr.", db_error: "Datenbank nicht erreichbar, es wurde nichts an LinkedIn gesendet.", li_timeout: "LinkedIn hat nicht rechtzeitig geantwortet.", li_network: "LinkedIn ist nicht erreichbar.", li_no_urn: "LinkedIn hat keine Event-ID zurückgegeben.", li_gone: "LinkedIn kennt diesen Event nicht (mehr). Wurde er dort gelöscht, bitte hier über „Absagen“ austragen.", li_error: "Der LinkedIn-Aufruf ist fehlgeschlagen.", no_heysummit_key: "HEYSUMMIT_API_KEY fehlt im Worker.", expired: "LinkedIn-Zugang abgelaufen, bitte neu verbinden.", forbidden: "Nur für Admins." };
    function err(j) { var e = (j || {}).error || ""; return LIERR[e] || (/^li_\d/.test(e) ? "LinkedIn antwortet mit Fehler " + e.slice(3) + "." : /^hs_/.test(e) ? "HeySummit nicht lesbar (" + e.slice(3) + "); ohne HeySummit geht nichts an LinkedIn." : "Fehler: " + (e || "unbekannt")); }
    p.textContent = ""; p.append(h("h2", { text: "LinkedIn-Events (Vorschläge)" }), m);
    var q = /[?&]li=([a-z_]+)/.exec(location.search || ""); if (q) msg(m, q[1] === "ok" ? "LinkedIn verbunden." : "Verbindung fehlgeschlagen (" + q[1] + ").", q[1] !== "ok");
    if (note) msg(m, note, bad);
    api("/api/admin/linkedin/status").then(function (r) {
      if (r.s !== 200) { msg(m, err(r.j), true); return; }
      var st = r.j, box = h("div");
      p.appendChild(h("p", {}, [h("span", { text: st.connected ? "Verbunden mit: " + (st.org_name || "(Seite noch nicht gewählt)") : "Nicht verbunden. " }), " ",
        st.configured ? h("a", { class: "btn" + (st.connected ? "" : " main"), href: API + "/auth/linkedin-events/start", text: "LinkedIn-Seite verbinden" }) : h("span", { class: "adm-msg bad", text: "LinkedIn-Zugang (Client-ID/Secret) fehlt im Worker." }), " ",
        st.connected ? h("button", { type: "button", class: "btn", text: "Verbindung trennen", onclick: function () { if (!window.confirm("Den hier gespeicherten LinkedIn-Zugang löschen?\n\nVeröffentlichte LinkedIn-Events bleiben bestehen; zum Ändern oder Absagen muss die Seite danach neu verbunden werden.")) return; api("/api/admin/linkedin/disconnect", { method: "POST", body: {} }).then(function (x) { if (x.s === 200) LOAD.li("LinkedIn-Zugang gelöscht."); else msg(m, err(x.j), true); }); } }) : null]));
      if (st.connected) {
        var sel = h("select", { "aria-label": "LinkedIn-Seite" });
        p.appendChild(h("p", {}, [h("button", { type: "button", class: "btn", text: "Meine LinkedIn-Seiten laden", onclick: function () { api("/api/admin/linkedin/orgs").then(function (o) { if (o.s !== 200) { msg(m, err(o.j), true); return; } sel.textContent = ""; (o.j.orgs || []).forEach(function (x) { var op = h("option", { value: x.urn, text: x.name }); sel.appendChild(op); }); }); } }), " ", sel, " ",
          h("button", { type: "button", class: "btn", text: "Diese Seite verwenden", onclick: function () { var op = sel.options[sel.selectedIndex]; if (!op) return; api("/api/admin/linkedin/org", { method: "POST", body: { urn: op.value, name: op.text } }).then(function (x) { if (x.s === 200) LOAD.li(); else msg(m, err(x.j), true); }); } })]));
      }
      p.appendChild(box);
      api("/api/admin/linkedin/proposals").then(function (x) {
        if (x.s !== 200) { msg(m, err(x.j), true); return; }
        var hi = x.j.hs_info || {}, items = x.j.items || [];
        if (x.j.hs_error) msg(m, err({ error: x.j.hs_error }), true);
        else box.appendChild(h("p", { class: "mut", text: "HeySummit: " + (hi.events || 0) + " Events, davon " + (hi.dated || 0) + " mit Termin; " + (hi.talks || 0) + " Talks kommender Events geladen" + (hi.partial ? " (unvollständig)" : "") + ". Vorgeschlagen werden nur öffentliche, kommende m365.fm-Events, die sich zeitlich mit einem HeySummit-Event überschneiden." }));
        if (x.j.truncated) box.appendChild(h("p", { class: "adm-msg bad", text: "Im Zeitraum der HeySummit-Events liegen mehr als " + (x.j.limit || "") + " kommende m365.fm-Events: geprüft wurden nur die nächsten, spätere fehlen in dieser Liste." }));
        // Merkzettel aufraeumen: nachtragen laesst sich nur, solange die Zeile offen ist; Hinweise ohne Zeile (lost) bleiben, bis sie abgehakt sind
        Object.keys(LIOPEN).forEach(function (k) { if (!LIOPEN[k].lost && !items.some(function (it) { return String(it.id) === k && it.state === "pending"; })) delete LIOPEN[k]; }); liOpen(true);
        Object.keys(LIOPEN).forEach(function (k) { var o = LIOPEN[k]; if (!o.lost) return;
          box.appendChild(h("p", { class: "adm-msg bad" }, ["LinkedIn-Event " + String(o.urn).split(":").pop() + (o.title ? " („" + o.title + "“)" : "") + " wurde angelegt, hat hier aber keinen Eintrag (die Reservierung wurde inzwischen freigegeben oder neu belegt). Bitte direkt auf LinkedIn absagen oder löschen. ",
            /^https:\/\/www\.linkedin\.com\//.test(o.url || "") ? h("a", { href: o.url, target: "_blank", rel: "noopener", text: "Auf LinkedIn ansehen" }) : null, " ", h("button", { type: "button", class: "btn", text: "Erledigt", onclick: function () { delete LIOPEN[k]; liOpen(true); LOAD.li(); } })])); });
        if (!items.length) { box.appendChild(h("p", { class: "mut", text: "Keine Vorschläge: kein kommendes m365.fm-Event mit gleichzeitigem HeySummit-Event." })); return; }
        var body = h("tbody"), TXT = { publish: "Auf LinkedIn veröffentlichen", update: "Aktualisieren", cancel: "Absagen", resolve: "LinkedIn-ID eintragen", release: "Reservierung freigeben" };
        var ASK = { publish: "Jetzt öffentlich auf LinkedIn veröffentlichen?", update: "Änderungen an LinkedIn senden?", cancel: "Event auf LinkedIn absagen?", release: "Reservierung freigeben?\n\nNur, wenn auf LinkedIn KEIN Event dazu angelegt wurde – sonst entsteht beim nächsten Veröffentlichen ein zweiter." };
        var STATE = { proposal: "Vorschlag", pending: "Veröffentlichung offen", published: "Veröffentlicht", cancelled: "Abgesagt" };
        items.forEach(function (it) {
          var open = it.state === "pending" ? LIOPEN[it.id] : null, openId = open ? String(open.urn).split(":").pop() : "";
          function send(a, b, btn) {
            btn.disabled = true;
            api("/api/admin/linkedin/" + a, { method: "POST", body: b }).then(function (r) {
              btn.disabled = false; var j = r.j || {};
              if (r.s === 200) { if (LIOPEN[it.id]) { delete LIOPEN[it.id]; liOpen(true); } LOAD.li(j.gone ? "Auf LinkedIn gab es den Event nicht mehr: hier als abgesagt eingetragen." : ""); }
              else if (j.error === "store_failed" && j.urn) {   // LinkedIn hat angelegt, der Eintrag hier fehlt: ID merken (bleibt beim Neuladen stehen) und sofort nachtragbar machen
                if (j.lost) LIOPEN["x" + String(j.urn).split(":").pop()] = { lost: true, urn: j.urn, url: j.linkedin_url || "", title: it.title }; else LIOPEN[it.id] = { urn: j.urn, ticket: j.ticket || "" };
                liOpen(true); LOAD.li(err(j) + " LinkedIn-Event-ID: " + String(j.urn).split(":").pop() + (j.lost ? "." : " – in der Liste über „Jetzt eintragen“ nachtragen."), true);
              }
              else if (j.pending) LOAD.li(err(j) + " Ob LinkedIn den Event angelegt hat, ist offen: bitte auf LinkedIn nachsehen und in der Liste klären (ID eintragen oder Reservierung freigeben).", true);
              else if (a === "cancel" && j.error === "li_gone" && !b.gone) {   // auf LinkedIn selbst geloescht? Nur nach ausdruecklicher Bestaetigung hier austragen (der Server fragt LinkedIn dabei noch einmal)
                if (window.confirm("LinkedIn kennt diesen Event nicht (mehr).\n\nWurde er auf LinkedIn selbst gelöscht? Dann wird er hier als abgesagt eingetragen und der Link auf der Event-Seite verschwindet.\n\nNur bestätigen, wenn es den LinkedIn-Event wirklich nicht mehr gibt.\n\n" + it.title)) { b.gone = true; send(a, b, btn); } else msg(m, err(j), true);
              }
              else msg(m, err(j), true);
            });
          }
          function act(a) { return h("button", { type: "button", class: "btn" + (a === "publish" ? " main" : ""), text: TXT[a], onclick: function (e) {
            var b = { event_id: it.id, confirm: true };
            if (a === "resolve") { b.urn = (window.prompt("LinkedIn-Event-ID (die Zahl am Ende der Event-Adresse) oder urn:li:event:… für „" + it.title + "“:", openId) || "").trim(); if (!b.urn) return; }
            else if (!window.confirm(ASK[a] + "\n\n" + it.title + "\n" + it.when)) return;
            send(a, b, e.target); } }); }
          var pv = it.preview ? h("details", {}, [h("summary", { text: it.preview.name }), h("p", { class: "mut", text: it.preview.start + " – " + it.preview.end + " · " + it.preview.format + " · " + (it.preview.free ? "kostenlos" : "kostenpflichtig") }), h("pre", { style: "white-space:pre-wrap", text: it.preview.description })]) : h("span", { class: "mut", text: "–" });
          var flags = [STATE[it.state] || it.state, it.wait && !(open && open.ticket) ? "läuft noch oder Ausgang offen – klären in " + Math.ceil(it.wait / 60) + " Min. möglich (Reiter neu laden)" : null, it.orphan ? "m365.fm-Event gelöscht" : null, it.hidden ? "m365.fm-Event nicht mehr öffentlich" : null, it.rule ? "Aktualisieren gesperrt: " + err({ error: it.rule }) : null, open ? "LinkedIn hat den Event angelegt (ID " + openId + "), nur der Eintrag hier fehlt" : null].filter(Boolean);
          var cell = [h("span", { class: "mut", text: flags.join(" · ") })];
          if (/^https:\/\/www\.linkedin\.com\//.test(it.linkedin_url || "")) cell.push(" ", h("a", { href: it.linkedin_url, target: "_blank", rel: "noopener", text: "Auf LinkedIn ansehen" }));
          if (open && open.ticket) cell.push(" ", h("button", { type: "button", class: "btn main", text: "Jetzt eintragen", onclick: function (e) { send("resolve", { event_id: it.id, urn: open.urn, ticket: open.ticket, confirm: true }, e.target); } }));
          (it.can || []).forEach(function (a) { if (TXT[a] && (a !== "update" || it.changed)) cell.push(" ", act(a)); });
          body.appendChild(h("tr", {}, [h("td", { text: it.title }), h("td", { text: it.when }), h("td", { text: it.preview ? it.preview.format + (it.preview.free ? ", kostenlos" : ", kostenpflichtig") : "–" }), h("td", { text: it.hs ? it.hs.event + (it.hs.talk ? " · " + it.hs.talk : "") : "–" }), h("td", {}, [pv]), h("td", {}, cell)]));
        });
        box.appendChild(h("div", { style: "overflow-x:auto" }, [h("table", { class: "adm-tbl" }, [h("thead", {}, [h("tr", {}, ["Titel", "Zeit (Berlin)", "Format", "HeySummit", "LinkedIn-Text", "Stand und Aktionen"].map(function (c) { return h("th", { text: c }); }))]), body])]));
      });
    });
  };

  root.textContent = ""; root.append(bar); tabs.forEach(function (t) { root.appendChild(panes[t[0]]); });
  overview(function () { var k = (location.hash || "").slice(1); show(panes[k] ? k : "ov"); });
})();
