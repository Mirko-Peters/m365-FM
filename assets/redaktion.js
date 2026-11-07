/* Redaktion (/redaktion/) und Moderation (/moderation/): eine Liste "Zu pruefen" ueber alle Warteschlangen. Nutzt window.M365ED = {api, base, lang, mode}
   und die Endpunkte /api/editor/*. Alles per textContent/DOM (kein innerHTML), Rueckfragen inline (kein window.confirm). Texte: en und de, sonst en. */
(function () {
  /* Wortweiser Vergleich (LCS): liefert [{t:"eq"|"del"|"ins", s}]; wird unten per textContent in <del>/<ins> gerendert (nie innerHTML) */
  function wordDiff(a, b) {
    var x = String(a || "").split(/(\s+)/).filter(Boolean), y = String(b || "").split(/(\s+)/).filter(Boolean), out = [];
    if (x.length * y.length > 4000000) return [{ t: "del", s: String(a || "") }, { t: "ins", s: String(b || "") }];
    var n = x.length, m = y.length, L = [], i, j;
    for (i = 0; i <= n; i++) { L.push(new Array(m + 1).fill(0)); }
    for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--) L[i][j] = x[i] === y[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    i = 0; j = 0;
    function push(t, v) { if (out.length && out[out.length - 1].t === t) out[out.length - 1].s += v; else out.push({ t: t, s: v }); }
    while (i < n && j < m) { if (x[i] === y[j]) { push("eq", x[i]); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) { push("del", x[i]); i++; } else { push("ins", y[j]); j++; } }
    while (i < n) push("del", x[i++]); while (j < m) push("ins", y[j++]);
    return out;
  }
  window.M365Diff = wordDiff;
  var C = window.M365ED || {}, API = C.api, root = document.getElementById("red"); if (!root || !API) return;
  var MOD = C.mode === "moderator", LANG = C.lang === "de" ? "de" : "en";
  var TX = {
    en: { kinds: { blog: "Blog post", wiki: "Wiki change", entity: "Entity change", cert: "Certificate", podcast: "Podcast pitch", video: "Video pitch", comment: "Reported comment", expert_report: "Reported request/answer" },
      all: "All", kind: "Kind", lang: "Language", sort: "Oldest first", empty: "Nothing to review.", loading: "Loading …", login: "Please sign in on the community page first.", denied: "You do not have access to this page.", err: "Something went wrong",
      approve: "Approve", reject: "Reject", hide: "Hide", resolve: "Keep (resolve report)", escalate: "Escalate to admin", edit: "Edit", details: "Preview", close: "Close", reason: "Reason", reasonReq: "Please give a reason.", send: "Send", cancel: "Cancel",
      propose: "Recommend", done: "Done.", proposed: "Saved as a recommendation for the editors.", own: "Your own content: you cannot decide on it.", ro: "Read-only: other queues", ro2: "These queues are decided by editors. You can leave a recommendation.",
      recommend: "Give recommendation", props: "Open recommendations and escalations", confirm: "Confirm", dismiss: "Dismiss", source: "Source", history: "History", none: "none", by: "by", age: "ago", minor: "Small edit (typos, links, SEO title/description, topics)", full: "Full edit (also the text; logged, the author is notified)",
      hist: "Version history", diffb: "Show change", revert: "Reset to this version", cur: "current", base: "Original", apps: "Applications", appsEmpty: "No open applications.", conf: "Confirm", votes: "confirmations", self: "Your own application.", colleague: "Same company as the applicant: you cannot vote.", override: "Admin: approve", overrideNo: "Admin: reject", motiv: "Motivation", not_editor_edit: "Editors can only reset editor edits.", already_current: "Already the current version.", mine: "Your topics", general: "General editor: all topics", topic: "Topic", out_of_scope: "Outside your topics.", title: "Title", summary: "Summary / SEO description", body: "Text", save: "Save", editor: "Editor", moderator: "Moderator", open: "Open the existing editor", daily_cap: "Daily limit reached.", own_company: "Content of your own company: you cannot decide on it.", forbidden: "Not allowed.", reason_required: "Please give a reason.", not_pending: "Already decided." },
    de: { kinds: { blog: "Blog-Beitrag", wiki: "Wiki-Änderung", entity: "Entitäten-Änderung", cert: "Zertifikat", podcast: "Podcast-Pitch", video: "Video-Pitch", comment: "Gemeldeter Kommentar", expert_report: "Gemeldete Anfrage/Antwort" },
      all: "Alle", kind: "Art", lang: "Sprache", sort: "Älteste zuerst", empty: "Nichts zu prüfen.", loading: "Lädt …", login: "Bitte zuerst auf der Community-Seite anmelden.", denied: "Du hast keinen Zugriff auf diese Seite.", err: "Etwas ist schiefgegangen",
      approve: "Freigeben", reject: "Ablehnen", hide: "Ausblenden", resolve: "Behalten (Meldung erledigt)", escalate: "An Admin eskalieren", edit: "Bearbeiten", details: "Vorschau", close: "Schließen", reason: "Grund", reasonReq: "Bitte einen Grund angeben.", send: "Senden", cancel: "Abbrechen",
      propose: "Empfehlen", done: "Erledigt.", proposed: "Als Empfehlung für die Editoren gespeichert.", own: "Eigener Inhalt: darüber kannst du nicht entscheiden.", ro: "Nur lesen: weitere Warteschlangen", ro2: "Diese Warteschlangen entscheiden Editoren. Du kannst eine Empfehlung abgeben.",
      recommend: "Empfehlung abgeben", props: "Offene Empfehlungen und Eskalationen", confirm: "Bestätigen", dismiss: "Verwerfen", source: "Quelle", history: "Verlauf", none: "keiner", by: "von", age: "alt",
      minor: "Kleine Änderung (Tippfehler, Links, SEO-Titel/-Beschreibung, Themen)", full: "Volle Änderung (auch der Text; wird protokolliert, der Autor wird benachrichtigt)",
      hist: "Versionsverlauf", diffb: "Änderung zeigen", revert: "Auf diese Version zurücksetzen", cur: "aktuell", base: "Ursprungsfassung", apps: "Bewerbungen", appsEmpty: "Keine offenen Bewerbungen.", conf: "Bestätigen", votes: "Bestätigungen", self: "Deine eigene Bewerbung.", colleague: "Gleiche Firma wie die Bewerbung: du kannst nicht abstimmen.", override: "Admin: freigeben", overrideNo: "Admin: ablehnen", motiv: "Motivation", not_editor_edit: "Editoren können nur Redaktionsänderungen zurücksetzen.", already_current: "Schon die aktuelle Fassung.", mine: "Deine Themen", general: "Allgemeiner Editor: alle Themen", topic: "Thema", out_of_scope: "Außerhalb deiner Themen.", title: "Titel", summary: "Zusammenfassung / SEO-Beschreibung", body: "Text", save: "Speichern", editor: "Editor", moderator: "Moderator", open: "Bestehenden Editor öffnen", daily_cap: "Tageslimit erreicht.", own_company: "Inhalt der eigenen Firma: darüber kannst du nicht entscheiden.", forbidden: "Nicht erlaubt.", reason_required: "Bitte einen Grund angeben.", not_pending: "Schon entschieden." },
  };
  function t(k) { return (TX[LANG][k] != null ? TX[LANG][k] : TX.en[k]) || k; }
  function kn(k) { return (TX[LANG].kinds[k] || TX.en.kinds[k] || k); }
  function h(tag, a, kids) { var e = document.createElement(tag); a = a || {}; for (var k in a) { if (k === "text") e.textContent = a[k]; else if (k === "class") e.className = a[k]; else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), a[k]); else e.setAttribute(k, a[k]); } (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); }); return e; }
  function api(p, o) { o = o || {}; o.credentials = "include"; o.headers = Object.assign({ "x-requested-with": "m365" }, o.headers || {}); if (o.body && typeof o.body !== "string") { o.body = JSON.stringify(o.body); o.headers["content-type"] = "application/json"; }
    return fetch(API + p, o).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { s: r.status, j: j }; }); }).catch(function () { return { s: 0, j: {} }; }); }
  function ago(ts) { if (!ts) return ""; var d = Math.max(0, Math.round(Date.now() / 1000 - ts)); return (d < 5400 ? Math.max(1, Math.round(d / 60)) + " min" : d < 172800 ? Math.round(d / 3600) + " h" : Math.round(d / 86400) + " d") + (LANG === "de" ? " alt" : " old"); }
  function errText(j) { return t((j || {}).error) !== (j || {}).error ? t((j || {}).error) : t("err"); }

  var state = { role: "", apps: [], items: [], kind: "", lang: "", topic: "", scope: null, props: [], modKinds: [] }, status = h("p", { role: "status", class: "mut" }), list = h("div"), filters = h("div", { class: "adm-row", style: "margin:1em 0" }), propBox = h("div");
  root.textContent = ""; var scopeBox = h("p", { class: "mut" }); root.appendChild(status); root.appendChild(scopeBox); root.appendChild(filters); root.appendChild(propBox); root.appendChild(list);
  function say(m, bad) { status.textContent = m || ""; status.style.color = bad ? "var(--ac)" : ""; }

  function field(label, el) { return h("label", { style: "display:flex;flex-direction:column;gap:4px;margin:.5em 0" }, [h("span", { text: label }), el]); }

  // Aktion mit Rueckfrage im Zeilenfeld: Ablehnen/Eskalieren/Empfehlen fragen nach einem Grund
  function actionBtn(it, host, action, label, needReason, main) {
    var mode = it.actions[action]; if (!mode || mode === "no") return null;
    var propose = mode === "propose", lab = propose ? t("propose") + ": " + label : label;
    return h("button", { type: "button", class: "btn" + (main ? " main" : ""), text: lab, onclick: function (ev) {
      var b = ev.target; if (!needReason && !propose) return run(b);
      host.textContent = ""; var ta = h("textarea", { rows: "2", maxlength: "300", "aria-label": t("reason") }), msg = h("p", { class: "mut", role: "alert" });
      host.appendChild(field(t("reason"), ta)); host.appendChild(msg);
      host.appendChild(h("button", { type: "button", class: "btn main", text: t("send"), onclick: function (e2) { if (needReason && !ta.value.trim() && !propose) { msg.textContent = t("reasonReq"); return; } run(e2.target, ta.value); } }));
      host.appendChild(document.createTextNode(" ")); host.appendChild(h("button", { type: "button", class: "btn", text: t("cancel"), onclick: function () { host.textContent = ""; } })); ta.focus();
    } });
    function run(btn, reason) {
      btn.disabled = true; api("/api/editor/decide", { method: "POST", body: { kind: it.kind, id: it.id, action: action, reason: reason || "" } }).then(function (r) {
        if (r.s === 200) { say(r.j.proposed ? t("proposed") : t("done")); load(); } else { btn.disabled = false; say(errText(r.j), true); } });
    }
  }

  function editForm(it, view, host) {
    host.textContent = "";
    var level = h("select", { "aria-label": t("edit") }, [h("option", { value: "minor", text: t("minor") }), h("option", { value: "full", text: t("full") })]),
      ti = h("input", { type: "text", maxlength: "160", value: view.title || "" }), su = h("textarea", { rows: "3", maxlength: "400" }), bo = h("textarea", { rows: "10" }), rs = h("input", { type: "text", maxlength: "300", "aria-label": t("reason") }), msg = h("p", { role: "alert", class: "mut" });
    su.value = view.summary || ""; bo.value = view.body || ""; var bf = field(t("body"), bo); bf.hidden = true;
    level.addEventListener("change", function () { bf.hidden = level.value !== "full"; });
    host.appendChild(field(t("edit"), level)); host.appendChild(field(t("title"), ti)); host.appendChild(field(t("summary"), su)); host.appendChild(bf); host.appendChild(field(t("reason"), rs)); host.appendChild(msg);
    host.appendChild(h("button", { type: "button", class: "btn main", text: t("save"), onclick: function (ev) {
      var f = { title: ti.value, summary: su.value }; if (level.value === "full") f.body = bo.value;
      ev.target.disabled = true; api("/api/editor/edit", { method: "POST", body: { kind: it.kind, id: it.id, level: level.value, fields: f, reason: rs.value } }).then(function (r) {
        ev.target.disabled = false; if (r.s === 200) { say(r.j.proposed ? t("proposed") : t("done")); host.textContent = ""; load(); } else msg.textContent = errText(r.j); }); } }));
    host.appendChild(document.createTextNode(" ")); host.appendChild(h("button", { type: "button", class: "btn", text: t("cancel"), onclick: function () { host.textContent = ""; } }));
  }

  function detail(it, box) {
    box.textContent = t("loading");
    api("/api/editor/item?kind=" + encodeURIComponent(it.kind) + "&id=" + encodeURIComponent(it.id)).then(function (r) {
      box.textContent = ""; if (r.s !== 200) { box.textContent = errText(r.j); return; }
      var v = r.j.item, hist = (v.history || []).map(function (x) { return h("li", { text: new Date(x.ts * 1000).toLocaleString(LANG) + " · " + x.name + " (" + x.role + ") · " + x.action + (x.reason ? " · " + x.reason : "") + (x.undone ? " · ↩" : "") }); });
      box.appendChild(h("pre", { style: "white-space:pre-wrap;word-break:break-word;font:inherit;border-inline-start:3px solid var(--bd);padding-inline-start:.8em", text: v.body || v.summary || "" }));
      box.appendChild(h("p", { class: "mut", text: t("source") + ": " + kn(v.kind) + (v.author ? " · " + t("by") + " " + v.author : "") + (v.lang ? " · " + v.lang : "") + (v.source && v.source.created ? " · " + new Date(v.source.created * 1000).toLocaleDateString(LANG) : "") }));
      box.appendChild(h("p", { class: "mut", text: t("history") + (hist.length ? "" : ": " + t("none")) })); if (hist.length) box.appendChild(h("ul", {}, hist));
      var ed = h("div"); if (v.editable && v.actions && ["approve", "reject"].some(function (a) { return v.actions[a] && v.actions[a] !== "no"; })) box.appendChild(h("button", { type: "button", class: "btn", text: t("edit"), onclick: function () { editForm(it, v, ed); } }));
      box.appendChild(ed);
      if (["blog", "wiki", "entity"].indexOf(it.kind) > -1) { var hb = h("div"), hbtn = h("button", { type: "button", class: "btn", "aria-expanded": "false", text: t("hist"), onclick: function (ev) { var o = ev.target.getAttribute("aria-expanded") === "true"; ev.target.setAttribute("aria-expanded", o ? "false" : "true"); if (o) hb.textContent = ""; else history(it, hb); } }); box.appendChild(hbtn); box.appendChild(hb); }
    });
  }

  function diffView(oldT, newT) {
    var pre = h("pre", { style: "white-space:pre-wrap;word-break:break-word;font:inherit;border:1px solid var(--bd);border-radius:.4em;padding:.6em" });
    wordDiff(oldT, newT).forEach(function (p) { if (p.t === "eq") pre.appendChild(document.createTextNode(p.s)); else { var e = h(p.t === "del" ? "del" : "ins", { style: p.t === "del" ? "background:#fecaca;color:#6b1111" : "background:#bbf7d0;color:#064e1f;text-decoration:none", text: p.s }); pre.appendChild(e); } });
    return pre;
  }
  function history(it, host) {
    host.textContent = t("loading");
    api("/api/editor/history?kind=" + encodeURIComponent(it.kind) + "&id=" + encodeURIComponent(it.id)).then(function (r) {
      host.textContent = ""; if (r.s !== 200) { host.textContent = errText(r.j); return; }
      var vs = r.j.versions || [], out = h("div"), ul = h("ul", { style: "padding:0" });
      function full(v) { return (v.title ? v.title + "\n\n" : "") + (v.summary ? v.summary + "\n\n" : "") + (v.body || ""); }
      vs.forEach(function (v, k) {
        var li = h("li", { style: "list-style:none;margin:.5em 0" }), box = h("div"), older = vs[k + 1];
        li.appendChild(h("span", { text: "#" + v.id + " · " + new Date(v.ts * 1000).toLocaleString(LANG) + " · " + (v.user || "–") + (v.role ? " (" + v.role + ")" : "") + (v.action === "baseline" ? " · " + t("base") : v.action === "revert" ? " · ↩" : "") + (v.status ? " · " + v.status : "") + (v.reason ? " · " + v.reason : "") + (v.id === r.j.current ? " · " + t("cur") : "") }));
        if (older) li.appendChild(h("button", { type: "button", class: "btn", style: "margin-inline-start:.5em", text: t("diffb"), onclick: function () { if (box.firstChild) box.textContent = ""; else box.appendChild(diffView(full(older), full(v))); } }));
        if (r.j.canRevert && v.id !== r.j.current && v.status !== "rejected" && v.status !== "pending") li.appendChild(h("button", { type: "button", class: "btn", style: "margin-inline-start:.4em", text: t("revert"), onclick: function (ev) { ev.target.disabled = true; api("/api/editor/revert", { method: "POST", body: { kind: it.kind, id: it.id, rev: v.id } }).then(function (x) { if (x.s === 200) { say(t("done")); history(it, host); } else { ev.target.disabled = false; say(errText(x.j), true); } }); } }));
        li.appendChild(box); ul.appendChild(li);
      });
      out.appendChild(ul); host.appendChild(out);
    });
  }

  function card(it, readonly) {
    var li = h("li", { class: "mb-card", style: "list-style:none;border:1px solid var(--bd);border-radius:.6em;padding:.8em 1em;margin:.6em 0;background:var(--card)" }), host = h("div"), box = h("div"), btns = h("p", { class: "adm-row" });
    li.appendChild(h("p", {}, [h("b", { text: it.title }), " ", h("span", { class: "mut", text: kn(it.kind) + (it.lang ? " · " + it.lang : "") + (it.author ? " · " + t("by") + " " + it.author : "") + " · " + ago(it.created) })]));
    if (it.excerpt) li.appendChild(h("p", { class: "mut", text: it.excerpt }));
    btns.appendChild(h("button", { type: "button", class: "btn", "aria-expanded": "false", text: t("details"), onclick: function (ev) { var o = ev.target.getAttribute("aria-expanded") === "true"; ev.target.setAttribute("aria-expanded", o ? "false" : "true"); if (o) box.textContent = ""; else detail(it, box); } }));
    if (it.own) li.appendChild(h("p", { class: "mut", text: t("own") }));
    else if (readonly) { var rb = actionBtn(Object.assign({}, it, { actions: { approve: "propose", reject: "propose" } }), host, "approve", t("approve"), false, false), rr = actionBtn(Object.assign({}, it, { actions: { approve: "propose", reject: "propose" } }), host, "reject", t("reject"), true, false); [rb, rr].forEach(function (b) { if (b) btns.appendChild(b); }); }
    else { [["approve", "approve", false, true], ["reject", "reject", true, false], ["hide", "hide", false, true], ["resolve", "resolve", false, false], ["escalate", "escalate", false, false]].forEach(function (d) { var b = actionBtn(it, host, d[0], t(d[1]), d[2], d[3]); if (b) btns.appendChild(b); }); }
    li.appendChild(btns); li.appendChild(host); li.appendChild(box); return li;
  }

  function filtersUI() {
    filters.textContent = "";
    var k = h("select", { "aria-label": t("kind") }, [h("option", { value: "", text: t("kind") + ": " + t("all") })].concat(Object.keys(TX.en.kinds).map(function (x) { return h("option", { value: x, text: kn(x) }); })));
    var langs = {}; state.items.forEach(function (x) { if (x.lang) langs[x.lang] = 1; });
    var tops = {}; state.items.forEach(function (x) { (x.topics || []).forEach(function (y) { tops[y] = 1; }); });
    var tp = h("select", { "aria-label": t("topic") }, [h("option", { value: "", text: t("topic") + ": " + t("all") })].concat(Object.keys(tops).sort().map(function (x) { return h("option", { value: x, text: x }); }))); tp.value = state.topic;
    tp.addEventListener("change", function () { state.topic = tp.value; draw(); });
    var l = h("select", { "aria-label": t("lang") }, [h("option", { value: "", text: t("lang") + ": " + t("all") })].concat(Object.keys(langs).sort().map(function (x) { return h("option", { value: x, text: x }); })));
    k.value = state.kind; l.value = state.lang;
    k.addEventListener("change", function () { state.kind = k.value; draw(); }); l.addEventListener("change", function () { state.lang = l.value; draw(); });
    filters.appendChild(k); filters.appendChild(tp); filters.appendChild(l); filters.appendChild(h("span", { class: "mut", text: t("sort") }));
  }

  function draw() {
    list.textContent = "";
    var vis = state.items.filter(function (x) { return (!state.kind || x.kind === state.kind) && (!state.lang || x.lang === state.lang) && (!state.topic || (x.topics || []).indexOf(state.topic) > -1); });
    var act = MOD ? vis.filter(function (x) { return state.modKinds.indexOf(x.kind) > -1; }) : vis, ro = MOD ? vis.filter(function (x) { return state.modKinds.indexOf(x.kind) < 0; }) : [];
    var ul = h("ul", { style: "padding:0;margin:0" }); act.forEach(function (x) { ul.appendChild(card(x, false)); }); if (!act.length) ul.appendChild(h("li", { class: "mut", style: "list-style:none", text: t("empty") })); list.appendChild(ul);
    if (ro.length) { list.appendChild(h("h2", { text: t("ro") })); list.appendChild(h("p", { class: "mut", text: t("ro2") })); var u2 = h("ul", { style: "padding:0;margin:0" }); ro.forEach(function (x) { u2.appendChild(card(x, true)); }); list.appendChild(u2); }
  }

  function drawProps() {
    propBox.textContent = ""; if (MOD || !state.props.length) return;
    propBox.appendChild(h("h2", { text: t("props") })); var ul = h("ul", { style: "padding:0" });
    state.props.forEach(function (p) {
      var esc = p.action === "review.escalate", li = h("li", { style: "list-style:none;margin:.4em 0" }, [h("b", { text: p.action + " · " + kn(p.kind) + " #" + p.item_id }), " ", h("span", { class: "mut", text: p.name + " (" + p.role + ")" + (p.reason ? " · " + p.reason : "") + " · " + ago(p.ts) })]);
      if (!esc) li.appendChild(h("button", { type: "button", class: "btn main", style: "margin-inline-start:.6em", text: t("confirm"), onclick: function (ev) { ev.target.disabled = true; api("/api/editor/proposals/" + p.id + "/confirm", { method: "POST", body: {} }).then(function (r) { if (r.s === 200) { say(t("done")); load(); } else { ev.target.disabled = false; say(errText(r.j), true); } }); } }));
      if (!esc || C.admin !== false) li.appendChild(h("button", { type: "button", class: "btn", style: "margin-inline-start:.4em", text: t("dismiss"), onclick: function (ev) { ev.target.disabled = true; api("/api/editor/proposals/" + p.id + "/dismiss", { method: "POST", body: {} }).then(function (r) { if (r.s === 200) { say(t("done")); load(); } else { ev.target.disabled = false; say(errText(r.j), true); } }); } }));
      ul.appendChild(li);
    }); propBox.appendChild(ul);
  }

  var appBox = h("div"); root.insertBefore(appBox, list);
  function drawApps() {
    appBox.textContent = ""; if (MOD) return;
    appBox.appendChild(h("h2", { text: t("apps") })); if (!state.apps.length) { appBox.appendChild(h("p", { class: "mut", text: t("appsEmpty") })); return; }
    state.apps.forEach(function (a) {
      var host = h("div"), li = h("div", { style: "border:1px solid var(--bd);border-radius:.6em;padding:.8em 1em;margin:.6em 0;background:var(--card)" });
      li.appendChild(h("p", {}, [h("b", { text: a.name }), " ", h("span", { class: "mut", text: (a.role === "editor" ? t("editor") : t("moderator")) + " · " + a.votes.length + "/" + a.needed + " " + t("votes") + (a.votes.length ? " (" + a.votes.join(", ") + ")" : "") })]));
      li.appendChild(h("p", { class: "mut", text: t("motiv") + ": " + a.motivation })); if (a.topics.length) li.appendChild(h("p", { class: "mut", text: t("topic") + ": " + a.topics.join(", ") }));
      var btns = h("p", { class: "adm-row" });
      function done(r) { if (r.s === 200) { say(t("done")); load(); } else say(errText(r.j), true); }
      if (a.canVote && !a.voted) btns.appendChild(h("button", { type: "button", class: "btn main", text: t("conf"), onclick: function (ev) { ev.target.disabled = true; api("/api/editor/applications/" + a.id + "/confirm", { method: "POST", body: {} }).then(done); } }));
      else if (!a.canVote) li.appendChild(h("p", { class: "mut", text: t(a.why) }));
      if (a.canVote) btns.appendChild(h("button", { type: "button", class: "btn", text: t("reject"), onclick: function () {
        host.textContent = ""; var ta = h("textarea", { rows: "2", maxlength: "300", "aria-label": t("reason") }), msg = h("p", { class: "mut", role: "alert" });
        host.appendChild(field(t("reason"), ta)); host.appendChild(msg);
        host.appendChild(h("button", { type: "button", class: "btn main", text: t("send"), onclick: function () { if (!ta.value.trim()) { msg.textContent = t("reasonReq"); return; } api("/api/editor/applications/" + a.id + "/reject", { method: "POST", body: { reason: ta.value } }).then(done); } })); ta.focus(); } }));
      if (state.role === "admin") { btns.appendChild(h("button", { type: "button", class: "btn", text: t("override"), onclick: function () { api("/api/editor/applications/" + a.id + "/override", { method: "POST", body: { approve: true } }).then(done); } })); btns.appendChild(h("button", { type: "button", class: "btn", text: t("overrideNo"), onclick: function () { api("/api/editor/applications/" + a.id + "/override", { method: "POST", body: { approve: false, reason: "" } }).then(done); } })); }
      li.appendChild(btns); li.appendChild(host); appBox.appendChild(li);
    });
  }
  function load() {
    if (!MOD) api("/api/editor/applications").then(function (r) { state.apps = r.s === 200 ? r.j.items || [] : []; drawApps(); });
    api("/api/editor/queue").then(function (r) {
      if (r.s === 401) { say(t("login"), true); return; } if (r.s === 403) { say(t("denied"), true); return; } if (r.s !== 200) { say(t("err"), true); return; }
      state.role = r.j.role || ""; state.items = r.j.items || []; state.props = r.j.proposals || []; state.modKinds = r.j.modKinds || []; state.scope = r.j.scope || null; scopeBox.textContent = MOD || !state.scope ? "" : state.scope.subject ? t("mine") + ": " + (state.scope.topics.join(", ") || "–") : t("general"); say(""); filtersUI(); drawProps(); draw();
    });
  }
  load();
})();
