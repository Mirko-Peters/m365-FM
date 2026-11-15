/* Expert Connect (Publisher-Tool): Experten finden oder Anfrage ausschreiben, Meine Anfragen, passende Anfragen, Offene Aufrufe, Moderation.
   Konfiguration: window.M365EC (site_expert_connect.py). API: worker/src/expert_requests.js. Keine nativen confirm()/prompt()-Dialoge. */
(function () {
  "use strict";
  var C = window.M365EC, root = document.getElementById("ec");
  if (!C || !root) return;
  var T = C.t, me = null, meLoaded = null, topicList = null, topicName = {};
  var TABS = ["search", "request", "requests", "expert", "calls", "mod"];

  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === "text") e.textContent = v;
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v);
      else if (k === "value") e.value = v;
      else if (k === "checked") e.checked = !!v;
      else e.setAttribute(k, v === true ? "" : v);
    });
    (kids || []).forEach(function (c) { if (c !== null && c !== undefined && c !== false) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  function t(k, vars) { var s = T[k] || k; Object.keys(vars || {}).forEach(function (v) { s = s.replace("{" + v + "}", vars[v]); }); return s; }
  function api(path, opt) {
    opt = opt || {};
    var o = { method: opt.method || "GET", credentials: "include", headers: { "x-requested-with": "m365" } };
    if (opt.body) { o.headers["content-type"] = "application/json"; o.body = JSON.stringify(opt.body); }
    return fetch(C.api + path, o).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { return { s: r.status, j: j || {} }; });
    }).catch(function () { return { s: 0, j: { error: "network" } }; });
  }
  function errText(j) {
    var e = (j && j.error) || "";
    if (e === "topic") return t("e_topic", { t: j.topic || "" });
    return T["e_" + e] || t("error");
  }
  function msg() { return el("p", { class: "ec-msg", role: "status" }); }
  function say(m, text, ok) { m.textContent = text; m.className = "ec-msg " + (ok ? "ok" : "err"); }
  function fmt(f) { return T["f_" + f] || f; }
  function langName(code) { for (var i = 0; i < C.langs.length; i++) if (C.langs[i][0] === code) return C.langs[i][1]; return code; }
  function date(s) { if (!s) return ""; var d = typeof s === "number" ? new Date(s * 1000) : new Date(s + "T00:00:00Z"); return d.toLocaleDateString(C.lang === "de" ? "de-DE" : "en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  function select(opts, val, any) {
    var s = el("select");
    if (any) s.appendChild(el("option", { value: "", text: T.any }));
    opts.forEach(function (o) { s.appendChild(el("option", { value: o[0], text: o[1], selected: o[0] === val ? "selected" : null })); });
    if (val) s.value = val;
    return s;
  }
  function fmtOpts() { return C.formats.map(function (f) { return [f, fmt(f)]; }); }
  function badge(text, cls) { return el("span", { class: "ec-badge" + (cls ? " " + cls : ""), text: text }); }
  function statusBadge(s) { return badge(T["st_" + s] || s, s === "open" ? "ac" : s === "accepted" ? "ok" : s === "held" ? "warn" : ""); }
  function clear() { root.textContent = ""; }
  function confirmBtn(label, run) {   // zweistufig statt confirm(): erst Klick, dann „Sicher?"
    var b = el("button", { type: "button", class: "btn", text: label });
    b.addEventListener("click", function () {
      if (b.dataset.armed) { b.disabled = true; run(); return; }
      b.dataset.armed = "1"; b.textContent = T.sure;
      setTimeout(function () { if (!b.disabled) { delete b.dataset.armed; b.textContent = label; } }, 4000);
    });
    return b;
  }
  function reportBox(body, onDone) {   // Grund inline statt prompt()
    var wrap = el("div", { class: "ec-btns" }), open = el("button", { type: "button", class: "btn", text: T.report });
    open.addEventListener("click", function () {
      var reason = el("input", { type: "text", maxlength: "300", placeholder: T.reason }), m = msg();
      wrap.replaceChildren(reason, el("button", { type: "button", class: "btn", text: T.send_report, onclick: function () {
        api("/api/expert-requests/report", { method: "POST", body: Object.assign({ reason: reason.value }, body) }).then(function (r) {
          if (r.j.ok) { say(m, T.reported, true); if (onDone) onDone(); } else say(m, errText(r.j));
        });
      } }), m);
    });
    wrap.appendChild(open);
    return wrap;
  }
  function loadMe() {
    if (!meLoaded) meLoaded = api("/api/me").then(function (r) { me = r.j.user || null; return me; });
    return meLoaded;
  }
  function loadTopics() {
    if (topicList) return Promise.resolve(topicList);
    return fetch(C.topics).then(function (r) { return r.json(); }).then(function (l) {
      topicList = l; l.forEach(function (x) { topicName[x[0]] = x[1]; }); return l;
    }).catch(function () { topicList = []; return topicList; });
  }
  function tname(id) { return topicName[id] || id; }
  function login() {
    clear();
    root.appendChild(el("p", { class: "mut", text: T.login }));
    var row = el("div", { class: "ec-btns" });
    root.appendChild(row);
    api("/api/providers").then(function (r) {
      (r.j.providers || []).forEach(function (p) {
        var u = new URL("/auth/login/" + p, C.api); u.searchParams.set("return", location.href);
        row.appendChild(el("a", { class: "btn", href: u.href, text: T.signin + " · " + p }));
      });
      if (!row.childNodes.length) row.appendChild(el("a", { class: "btn main", href: C.base + (C.lang === "en" ? "" : "/" + C.lang) + "/community/", text: T.signin }));
    });
  }
  function needLogin(r) { if (r.s === 401) { login(); return true; } return false; }
  function readRequestDraft() {
    // nur Entwuerfe NEUER Anfragen; ein Entwurf mit id (Bearbeitung) wuerde eine neue Anfrage zur Aenderung einer bestehenden machen
    try { var d = JSON.parse(sessionStorage.getItem("ec_draft") || "null"); return d && typeof d === "object" && !d.id ? d : null; } catch (e) { return null; }
  }
  function saveRequestDraft(data, editorial) {
    try { sessionStorage.setItem("ec_draft", JSON.stringify(Object.assign({}, data, { editorial: !!editorial }))); } catch (e) { /* optional */ }
  }
  function clearRequestDraft() {
    try { sessionStorage.removeItem("ec_draft"); } catch (e) { /* optional */ }
  }

  /* Themenauswahl mit Vorschlagsliste (Entitaeten) */
  function topicPicker(initial) {
    var chosen = (initial || []).slice(), id = "ec-tl-" + Math.random().toString(36).slice(2, 8);
    var input = el("input", { type: "text", list: id, placeholder: T.r_topic_ph, autocomplete: "off" }), dl = el("datalist", { id: id });
    var chips = el("div", { class: "ec-chips" });
    function draw() {
      chips.textContent = "";
      chosen.forEach(function (c, i) {
        chips.appendChild(el("span", { class: "ec-chip" }, [tname(c), el("button", { type: "button", "aria-label": "×", text: "×", onclick: function () { chosen.splice(i, 1); draw(); } })]));
      });
    }
    function add() {
      var v = input.value.trim().toLowerCase(); if (!v || chosen.length >= 10) return;
      var hit = (topicList || []).filter(function (x) { return x[1].toLowerCase() === v || x[0] === v; })[0]
        || (topicList || []).filter(function (x) { return x[1].toLowerCase().indexOf(v) === 0; })[0];
      if (hit && chosen.indexOf(hit[0]) < 0) chosen.push(hit[0]);
      input.value = ""; draw();
    }
    input.addEventListener("input", function () {
      var v = input.value.trim().toLowerCase(); dl.textContent = "";
      if (v.length < 2) return;
      (topicList || []).filter(function (x) { return x[1].toLowerCase().indexOf(v) >= 0; }).slice(0, 12).forEach(function (x) { dl.appendChild(el("option", { value: x[1] })); });
    });
    input.addEventListener("change", add);
    input.addEventListener("keydown", function (ev) { if (ev.key === "Enter") { ev.preventDefault(); add(); } });
    loadTopics().then(draw);
    return { node: el("div", { class: "ec-lbl" }, [T.r_topics, el("div", { class: "ec-btns" }, [input, dl, el("button", { type: "button", class: "btn", text: T.add, onclick: add })]), chips]), get: function () { return chosen.slice(); } };
  }

  /* 1 Experten finden (oeffentlich) */
  function viewSearch() {
    clear();
    var searchQuery = "";
    try { searchQuery = sessionStorage.getItem("ec_q") || ""; } catch (e) { /* optional */ }
    var q = el("input", { type: "text", placeholder: T.q, value: searchQuery }), f = select(fmtOpts(), "", true), l = select(C.langs, "", true);
    var p = select([["mvp", "MVP"], ["mct", "MCT"]], "", true), lv = select([["3", "3"], ["4", "4"], ["5", "5"]], "", true);
    var out = el("div", { class: "ec-grid" }), m = msg();
    function run(ev) {
      if (ev) ev.preventDefault();
      try { sessionStorage.setItem("ec_q", q.value); } catch (e) { /* optional */ }
      out.textContent = ""; m.textContent = T.loading; m.className = "ec-msg";
      var qs = new URLSearchParams({ q: q.value.trim(), format: f.value, lang: l.value, program: p.value, level: lv.value });
      Promise.all([loadTopics(), api("/api/experts/search?" + qs.toString())]).then(function (res) {
        var r = res[1], items = r.j.items || [];
        m.textContent = "";
        if (!items.length) { say(m, T.no_hits, true); return; }
        items.forEach(function (x) {
          out.appendChild(el("article", { class: "ec-card" }, [
            el("div", { class: "ec-btns" }, [el("span", { class: "ec-score", text: (x.match_score || 0) + " %" }), el("span", { class: "ec-meta", text: T.score })]),
            el("h3", {}, [x.handle ? el("a", { href: C.base + "/community/u/" + encodeURIComponent(x.handle) + "/", text: x.name }) : x.name]),
            x.role ? el("p", { class: "ec-meta", text: x.role }) : null,
            el("p", {}, (x.programs || []).map(function (pg) { return badge(pg.toUpperCase(), "ac"); }).concat(x.level ? [badge(T.level + " " + x.level)] : [])),
            (x.topics || []).length ? el("p", { class: "ec-meta", text: (x.topics || []).slice(0, 6).map(tname).join(" · ") }) : null,
            el("p", { class: "ec-meta", text: [(x.langs || []).map(langName).join(", "), (x.formats || []).map(fmt).join(", ")].filter(Boolean).join(" — ") })
          ]));
        });
        out.appendChild(el("div", { class: "ec-card" }, [el("p", { text: T.req_note }), el("a", { class: "btn main", href: "#request", text: T.ask_all })]));
      });
    }
    var form = el("form", { class: "ec-bar", onsubmit: run }, [
      el("label", { class: "ec-lbl" }, [T.q, q]), el("label", { class: "ec-lbl" }, [T.format, f]), el("label", { class: "ec-lbl" }, [T.lang, l]),
      el("label", { class: "ec-lbl" }, [T.program, p]), el("label", { class: "ec-lbl" }, [T.level_min, lv]), el("button", { class: "btn main", type: "submit", text: T.search })]);
    root.append(form, m, out);
    if (q.value) run();
  }

  /* 2 Anfrage stellen (auch Entwurf bearbeiten) */
  function viewRequest(edit) {
    clear();
    loadMe().then(function (u) {
      edit = edit || readRequestDraft() || {};
      var dl = new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10), max = new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10);
      var ti = el("input", { type: "text", maxlength: "120", required: true, value: edit.title || "" });
      var de = el("textarea", { rows: "6", maxlength: "1000", required: true }); de.value = edit.description || "";
      var tp = topicPicker(edit.topics || []);
      var fo = select(fmtOpts(), edit.format || "quote"), la = select(C.langs, edit.lang || C.lang), dd = el("input", { type: "date", min: new Date().toISOString().slice(0, 10), max: max, value: edit.deadline || dl });
      var mo = select([["match", T.mode_match], ["open", T.mode_open]], edit.mode || (location.hash === "#request-open" ? "open" : "match"));
      var au = select([["all", T.aud_all], ["mvp", T.aud_mvp], ["mct", T.aud_mct]], edit.audience || "all");
      var re = el("input", { type: "text", maxlength: "100", value: edit.reach || "" }), hi = el("input", { type: "checkbox", checked: !!edit.hide_outlet });
      var ed = el("input", { type: "checkbox", checked: !!edit.editorial }), m = msg(), pv = el("p", { class: "ec-meta" });
      function data(draft) {
        return { id: edit.id, title: ti.value, description: de.value, topics: tp.get(), format: fo.value, lang: la.value, deadline: dd.value,
                 mode: mo.value, audience: au.value, reach: re.value, hide_outlet: hi.checked, draft: !!draft };
      }
      function saveAndLogin(draft) {
        if (!edit.id) saveRequestDraft(data(draft), ed.checked);   // eine Bearbeitung liegt schon auf dem Server
        login();
      }
      function send(draft) {
        if (!u) { saveAndLogin(draft); return; }
        if (!draft && !ed.checked) { say(m, T.e_editorial); return; }
        api(edit.id ? "/api/expert-requests/update" : "/api/expert-requests/create", { method: "POST", body: data(draft) }).then(function (r) {
          if (r.s === 401) { saveAndLogin(draft); return; }
          if (!r.j.ok) { say(m, errText(r.j)); return; }
          if (!edit.id) clearRequestDraft();   // Speichern einer anderen (bearbeiteten) Anfrage loescht den offenen Entwurf nicht
          say(m, r.j.status === "draft" ? T.drafted : r.j.status === "held" ? T.held : T.published, true);
          setTimeout(function () { location.hash = "#requests"; }, 1200);
        });
      }
      if (!u) root.appendChild(el("p", { class: "ec-meta", text: T.request_guest }));
      root.appendChild(el("form", { class: "ec-form", onsubmit: function (ev) { ev.preventDefault(); send(false); } }, [
        el("label", {}, [T.r_title, ti]), el("label", {}, [T.r_desc, de]), tp.node,
        el("div", { class: "ec-row" }, [el("label", {}, [T.format, fo]), el("label", {}, [T.lang, la]), el("label", {}, [T.r_deadline, dd])]),
        el("div", { class: "ec-row" }, [el("label", {}, [T.r_mode, mo]), el("label", {}, [T.r_audience, au])]),
        el("label", {}, [T.r_reach, re]), el("label", { class: "ec-ck" }, [hi, el("span", { text: T.r_hide })]),
        el("label", { class: "ec-ck" }, [ed, el("span", { text: T.r_editorial })]),
        el("div", { class: "ec-btns" }, [
          el("button", { type: "button", class: "btn", text: T.preview, onclick: function () {
            if (!u) { saveAndLogin(false); return; }
            pv.textContent = T.loading;
            api("/api/expert-requests/preview", { method: "POST", body: data(false) }).then(function (r) {
              if (r.s === 401) { saveAndLogin(false); return; }
              if (r.j.error) { pv.textContent = errText(r.j); return; }
              pv.textContent = r.j.count ? t("preview_n", { n: r.j.count, mvp: (r.j.split || {}).mvp || 0, mct: (r.j.split || {}).mct || 0 }) : T.preview_0;
            });
          } }),
          el("button", { type: "button", class: "btn", text: T.draft, onclick: function () { send(true); } }),
          el("button", { type: "submit", class: "btn main", text: T.publish })]),
        pv, m, el("p", { class: "ec-meta", text: T.limits })]));
    });
  }

  /* 3 Meine Anfragen (Redaktion) */
  function contactsList(c, who) {   // c = {publisher:{method,value}, expert:{method,value}}; who = Gegenseite
    var x = c && c[who];
    if (!x) return null;
    var v = String(x.value || ""), label = T["c_" + x.method] || x.method;
    var val = x.method === "platform" || !v ? el("a", { href: C.base + (C.lang === "en" ? "" : "/" + C.lang) + "/community/#c-msg", text: T.c_platform })
      : x.method === "email" ? el("a", { href: "mailto:" + v, text: v }) : /^https:\/\//.test(v) ? el("a", { href: v, rel: "noopener nofollow", target: "_blank", text: v }) : v;
    return el("p", {}, [el("b", { text: T.accepted + " " }), label + ": ", val]);
  }
  function viewRequests() {
    clear(); root.appendChild(el("p", { class: "mut", text: T.loading }));
    Promise.all([loadTopics(), api("/api/expert-requests/matches")]).then(function (res) {
      var r = res[1]; if (needLogin(r)) return;
      clear();
      var list = r.j.requests || [];
      root.appendChild(el("p", {}, [el("a", { class: "btn main", href: "#request", text: T.tab_request })]));
      if (!list.length) { root.appendChild(el("p", { class: "mut", text: T.my_none })); return; }
      var grid = el("div", { class: "ec-grid" });
      list.forEach(function (it) {
        var m = msg(), card = el("article", { class: "ec-card" }, [
          el("p", {}, [statusBadge(it.status), badge(it.mode === "open" ? T.mode_open : fmt(it.format)), badge(langName(it.lang))]),
          el("h3", { text: it.title }), el("p", { text: it.description }),
          el("p", { class: "ec-meta", text: (it.topics || []).map(tname).join(" · ") + " — " + date(it.deadline) })]);
        var replies = it.replies || [];
        card.appendChild(el("b", { text: T.replies + " (" + replies.length + ")" }));
        if (!replies.length) card.appendChild(el("p", { class: "ec-meta", text: T.no_replies }));
        replies.forEach(function (x) {
          var rm = msg(), box = el("div", { class: "ec-reply" }, [
            el("p", {}, [badge(T["kind_" + x.kind] || x.kind), x.status !== "pending" ? statusBadge(x.status === "accepted" ? "accepted" : "closed") : null, el("b", { text: x.expert })]),
            el("p", { text: x.body }), contactsList(x.contacts, "expert")]);
          if (x.status === "pending" && it.status === "open") {
            box.appendChild(el("div", { class: "ec-btns" }, [
              el("button", { type: "button", class: "btn main", text: T.accept, onclick: function () {
                api("/api/expert-requests/accept", { method: "POST", body: { reply_id: x.id } }).then(function (y) { if (y.j.ok) viewRequests(); else say(rm, errText(y.j)); });
              } }),
              el("button", { type: "button", class: "btn", text: T.decline, onclick: function () {
                api("/api/expert-requests/accept", { method: "POST", body: { reply_id: x.id, accept: false } }).then(function (y) { if (y.j.ok) say(rm, T.declined, true); else say(rm, errText(y.j)); });
              } }),
              reportBox({ reply_id: x.id }),
              confirmBtn(T.block, function () { api("/api/expert-requests/block", { method: "POST", body: { reply_id: x.id } }).then(function (y) { say(rm, y.j.ok ? T.blocked : errText(y.j), !!y.j.ok); }); })]));
          }
          box.appendChild(rm); card.appendChild(box);
        });
        var actions = el("div", { class: "ec-btns" });
        if (it.status === "draft" || it.status === "held") actions.appendChild(el("button", { type: "button", class: "btn", text: T.edit, onclick: function () { viewRequest(it); } }));
        if (it.status === "draft") actions.appendChild(el("button", { type: "button", class: "btn main", text: T.publish_draft, onclick: function () { viewRequest(it); } }));
        if (it.status === "open") {
          var nd = el("input", { type: "date", min: new Date().toISOString().slice(0, 10), max: new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10), value: it.deadline });
          actions.append(nd, el("button", { type: "button", class: "btn", text: T.extend, onclick: function () {
            api("/api/expert-requests/extend", { method: "POST", body: { id: it.id, deadline: nd.value } }).then(function (y) { say(m, y.j.ok ? T.extended : errText(y.j), !!y.j.ok); });
          } }));
        }
        if (["open", "draft", "held"].indexOf(it.status) >= 0) actions.appendChild(confirmBtn(T.close, function () {
          api("/api/expert-requests/close", { method: "POST", body: { id: it.id } }).then(function (y) { if (y.j.ok) viewRequests(); else say(m, errText(y.j)); });
        }));
        card.append(actions, m);
        grid.appendChild(card);
      });
      root.appendChild(grid);
    });
  }

  /* 4 Fuer Experten: passende Anfragen, Angenommen, Einstellungen */
  function pitchForm(path, id, done) {
    var ta = el("textarea", { rows: "4", maxlength: "600", placeholder: T.pitch }), m = msg();
    return el("form", { class: "ec-reply", onsubmit: function (ev) {
      ev.preventDefault();
      if (ta.value.trim().length < 10) { say(m, T.e_pitch); return; }
      api(path, { method: "POST", body: { id: id, body: ta.value } }).then(function (r) { if (r.j.ok) { say(m, path.indexOf("apply") > 0 ? T.applied : T.sent, true); if (done) done(); } else say(m, errText(r.j)); });
    } }, [ta, el("div", { class: "ec-btns" }, [el("button", { type: "submit", class: "btn main", text: path.indexOf("apply") > 0 ? T.apply : T.send })]), m]);
  }
  function requestCard(it, extra) {
    return el("article", { class: "ec-card" }, [
      el("p", {}, [badge(fmt(it.format)), badge(langName(it.lang)), it.match_score ? badge(T.score + " " + it.match_score, "ac") : null]),
      el("h3", { text: it.title }), el("p", { text: it.description }),
      el("p", { class: "ec-meta", text: [it.author || "", it.reach || "", date(it.deadline)].filter(Boolean).join(" — ") }),
      (it.shared_topics || []).length ? el("p", { class: "ec-meta", text: T.shared + ": " + it.shared_topics.map(tname).join(" · ") }) : el("p", { class: "ec-meta", text: (it.topics || []).map(tname).join(" · ") })
    ].concat(extra || []));
  }
  function viewExpert() {
    clear(); root.appendChild(el("p", { class: "mut", text: T.loading }));
    Promise.all([loadTopics(), api("/api/expert-requests/matches"), api("/api/expert-settings")]).then(function (res) {
      var r = res[1], s = res[2]; if (needLogin(r)) return;
      clear();
      root.appendChild(el("h2", { class: "ec-sec", text: T.matches_h }));
      var grid = el("div", { class: "ec-grid" });
      (r.j.matches || []).forEach(function (it) {
        var card = requestCard(it, [it.responded ? el("p", { class: "ec-meta", text: T.e_already_replied }) : pitchForm("/api/expert-requests/respond", it.id, null),
          el("div", { class: "ec-btns" }, [reportBox({ id: it.id }), confirmBtn(T.block, function () { api("/api/expert-requests/block", { method: "POST", body: { id: it.id } }).then(viewExpert); })])]);
        grid.appendChild(card);
      });
      root.appendChild((r.j.matches || []).length ? grid : el("p", { class: "mut", text: T.matches_none }));
      root.appendChild(el("h2", { class: "ec-sec", text: T.accepted_h }));
      var acc = r.j.accepted || [];
      if (!acc.length) root.appendChild(el("p", { class: "mut", text: T.accepted_none }));
      else root.appendChild(el("div", { class: "ec-grid" }, acc.map(function (a) {
        return el("article", { class: "ec-card" }, [el("p", {}, [statusBadge("accepted"), badge(T["kind_" + a.kind] || a.kind)]), el("h3", { text: a.title }), el("p", { class: "ec-meta", text: [a.publisher || "", a.reach || ""].filter(Boolean).join(" — ") }), contactsList(a.contacts, "publisher")]);
      })));
      root.appendChild(el("h2", { class: "ec-sec", text: T.settings_h }));
      root.appendChild(settingsForm((s.j || {}).settings || {}));
    });
  }
  function checks(opts, chosen) {
    var box = el("div", { class: "ec-chips" }), inputs = [];
    opts.forEach(function (o) { var c = el("input", { type: "checkbox", value: o[0], checked: chosen.indexOf(o[0]) >= 0 }); inputs.push(c); box.appendChild(el("label", { class: "ec-ck ec-chip" }, [c, el("span", { text: o[1] })])); });
    return { node: box, get: function () { return inputs.filter(function (c) { return c.checked; }).map(function (c) { return c.value; }); } };
  }
  function settingsForm(st) {
    var oi = el("input", { type: "checkbox", checked: !!st.opt_in }), fo = checks(fmtOpts(), st.formats || []), la = checks(C.langs, (st.langs || []).length ? st.langs : [C.lang]);
    var no = select([["push", T.n_push], ["weekly", T.n_weekly], ["both", T.n_both], ["none", T.n_none]], st.notify || "push");
    var cp = select([["platform", T.c_platform], ["email", T.c_email], ["linkedin", T.c_linkedin], ["website", T.c_website]], st.contact_pref || "platform");
    var active = !!(st.paused_until && st.paused_until * 1000 > Date.now());   // laufende Pause: Haken gesetzt, Speichern beendet sie nicht
    var cv = el("input", { type: "text", maxlength: "300", value: st.contact_value || "" }), pa = el("input", { type: "checkbox", checked: active }), m = msg();
    var paused = active ? el("p", { class: "ec-meta", text: t("paused_until", { d: date(st.paused_until) }) }) : null;
    return el("form", { class: "ec-form", onsubmit: function (ev) {
      ev.preventDefault();
      var body = { opt_in: oi.checked, formats: fo.get(), langs: la.get(), notify: no.value, contact_pref: cp.value, contact_value: cv.value };
      if (pa.checked && !active) body.pause_weeks = 2; else if (!pa.checked && active) body.paused_until = 0;
      api("/api/expert-settings", { method: "POST", body: body }).then(function (r) { if (needLogin(r)) return; if (r.j.ok) active = pa.checked; say(m, r.j.ok ? T.saved : errText(r.j), !!r.j.ok); });
    } }, [el("label", { class: "ec-ck" }, [oi, el("span", { text: T.opt_in })]), el("div", { class: "ec-lbl" }, [T.s_formats, fo.node]), el("div", { class: "ec-lbl" }, [T.s_langs, la.node]),
      el("div", { class: "ec-row" }, [el("label", {}, [T.notify, no]), el("label", {}, [T.contact, cp]), el("label", {}, [T.contact_value, cv])]),
      el("label", { class: "ec-ck" }, [pa, el("span", { text: T.pause })]), paused, el("p", { class: "ec-meta", text: T.req_note }),
      el("div", { class: "ec-btns" }, [el("button", { type: "submit", class: "btn main", text: T.save })]), m]);
  }

  /* 5 Offene Aufrufe (Themenboerse) */
  function viewCalls() {
    clear();
    var so = select([["match", T.sort_match], ["new", T.sort_new]], "match"), f = select(fmtOpts(), "", true), l = select(C.langs, "", true);
    var out = el("div"), bar = el("div", { class: "ec-bar" }, [el("label", { class: "ec-lbl" }, [T.format, f]), el("label", { class: "ec-lbl" }, [T.lang, l]), el("label", { class: "ec-lbl" }, [T.sort_match.split(" ")[0], so]),
      el("a", { class: "btn", href: "#request-open", text: T.mode_open })]);
    function run() {
      out.textContent = T.loading;
      var qs = new URLSearchParams({ format: f.value, lang: l.value }); if (so.value === "match") qs.set("sort", "match");
      Promise.all([loadTopics(), api("/api/expert-calls?" + qs.toString())]).then(function (res) {
        var r = res[1]; if (needLogin(r)) return;
        out.textContent = "";
        var items = r.j.items || [];
        if (!items.length) { out.appendChild(el("p", { class: "mut", text: T.calls_none })); return; }
        out.appendChild(el("div", { class: "ec-grid" }, items.map(function (it) {
          return requestCard(it, [it.responded ? el("p", { class: "ec-meta", text: T.responded }) : pitchForm("/api/expert-requests/apply", it.id, null)]);
        })));
      });
    }
    [so, f, l].forEach(function (x) { x.addEventListener("change", run); });
    root.append(bar, out); run();
  }

  /* 6 Moderation (nur Admins) */
  function viewMod() {
    clear(); root.appendChild(el("p", { class: "mut", text: T.loading }));
    Promise.all([api("/api/admin/expert-requests/reports"), api("/api/admin/expert-requests/moderation-log")]).then(function (res) {
      var r = res[0], lg = res[1]; if (needLogin(r)) return;
      clear();
      if (r.s === 403) { root.appendChild(el("p", { class: "mut", text: T.e_not_found })); return; }
      root.appendChild(el("h2", { class: "ec-sec", text: T.mod_held }));
      var held = r.j.held || [];
      root.appendChild(held.length ? el("div", { class: "ec-grid" }, held.map(function (h) {
        var m = msg();
        return el("article", { class: "ec-card" }, [el("p", {}, [statusBadge("held"), badge(h.held_reason || "")]), el("h3", { text: h.title }), el("p", { text: h.description }),
          el("div", { class: "ec-btns" }, ["release", "reject"].map(function (a) {
            return el("button", { type: "button", class: a === "release" ? "btn main" : "btn", text: T[a], onclick: function () {
              api("/api/admin/expert-requests/resolve", { method: "POST", body: { id: h.id, action: a } }).then(function (y) { if (y.j.ok) viewMod(); else say(m, errText(y.j)); });
            } });
          })), m]);
      })) : el("p", { class: "mut", text: T.none }));
      root.appendChild(el("h2", { class: "ec-sec", text: T.mod_reports }));
      var reps = r.j.reports || [];
      root.appendChild(reps.length ? el("div", { class: "ec-grid" }, reps.map(function (x) {
        var m = msg();
        return el("article", { class: "ec-card" }, [el("p", {}, [statusBadge(x.status)]), el("h3", { text: x.title }), el("p", { class: "ec-meta", text: (x.publisher_name || "") + (x.expert_name ? " → " + x.expert_name : "") }),
          x.reply_body ? el("p", { text: "„" + x.reply_body + "“" }) : el("p", { text: x.description }), x.reason ? el("p", { class: "ec-meta", text: T.reason.split(" (")[0] + ": " + x.reason }) : null,
          el("div", { class: "ec-btns" }, [
            confirmBtn(T.close, function () { api("/api/admin/expert-requests/close", { method: "POST", body: { id: x.request_id } }).then(function (y) { if (y.j.ok) viewMod(); else say(m, errText(y.j)); }); }),
            x.reply_id ? confirmBtn(T.delete_reply, function () { api("/api/admin/expert-requests/reply-delete", { method: "POST", body: { reply_id: x.reply_id } }).then(function (y) { if (y.j.ok) viewMod(); else say(m, errText(y.j)); }); }) : null]), m]);
      })) : el("p", { class: "mut", text: T.none }));
      root.appendChild(el("h2", { class: "ec-sec", text: T.mod_log }));
      var logs = (lg.j || {}).items || [];
      root.appendChild(logs.length ? el("ul", {}, logs.slice(0, 50).map(function (x) { return el("li", { class: "ec-meta", text: date(x.created) + " · " + x.action + " · " + x.target_type + " #" + x.target_id + (x.reason ? " · " + x.reason : "") }); })) : el("p", { class: "mut", text: T.none }));
    });
  }

  function route() {
    var h = (location.hash || "#search").slice(1), tab = h === "request-open" ? "request" : h;
    if (TABS.indexOf(tab) < 0) tab = "search";
    document.querySelectorAll(".ec-tabs a").forEach(function (a) { if (a.dataset.tab === tab) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    ({ search: viewSearch, request: function () { viewRequest(null); }, requests: viewRequests, expert: viewExpert, calls: viewCalls, mod: viewMod })[tab]();
  }
  window.addEventListener("hashchange", route);
  // Klick auf einen Link zum aktuellen Anker (z. B. "Anfrage ausschreiben" nach dem Anmeldehinweis): kein hashchange, darum selbst neu zeichnen
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (a && a.getAttribute("href") === location.hash && !e.defaultPrevented) { e.preventDefault(); route(); }
  });
  loadMe().then(function (u) { if (u && u.admin) { var a = document.querySelector('.ec-tabs a[data-tab="mod"]'); if (a) a.hidden = false; } });
  route();
})();
