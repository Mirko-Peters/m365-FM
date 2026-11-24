// Abschlusstest eines Lernpfads (site_pillars.quiz_page): Anmeldung, 30 Fragen, Ergebnis mit Erklaerungen, Zertifikat ueber Certopus.
// Fragen ohne Loesung stehen als JSON in #lq-data; Antworten und Erklaerungen kommen erst nach der Abgabe vom Worker (worker/src/learnquiz.js).
// Konfiguration: window.M365LQ = {api, lang, qlang, path, privacy, pathUrl, max, t:{Texte}}. Kein Framework.
(function () {
  "use strict";
  var C = window.M365LQ, root = document.getElementById("lq-app"), dataEl = document.getElementById("lq-data"), status = document.getElementById("lq-status");
  if (!C || !C.api || !root || !dataEl) return;
  var D;
  try { D = JSON.parse(dataEl.textContent); } catch (e) { return; }
  var T = C.t || {}, Q = {}, G = {}, ST = null, first = true;
  (D.groups || []).forEach(function (g) { G[g.id] = g; (g.qs || []).forEach(function (q) { Q[q.id] = { q: q.q, opts: q.opts, g: g }; }); });

  function t(k, v) {
    var s = T[k] || k;
    if (v) Object.keys(v).forEach(function (n) { s = s.split("{" + n + "}").join(String(v[n])); });
    return s;
  }
  function h(tag, a, kids) {
    var el = document.createElement(tag);
    Object.keys(a || {}).forEach(function (k) {
      var v = a[k];
      if (v === undefined || v === null || v === false) return;
      if (k === "text") el.textContent = v;
      else if (k === "class") el.className = v;
      else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    });
    (kids || []).forEach(function (c) { if (c) el.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return el;
  }
  function api(path, o) {
    o = o || {}; o.credentials = "include";
    o.headers = Object.assign(/^(GET)?$/i.test(o.method || "") ? {} : { "x-requested-with": "m365" }, o.headers || {});   // nur schreibend: GET ohne CORS-Preflight
    if (o.body && typeof o.body !== "string") { o.body = JSON.stringify(o.body); o.headers["content-type"] = "application/json"; }
    return fetch(C.api + path, o).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { return { s: r.status, j: j || {} }; });
    }, function () { return { s: 0, j: {} }; });
  }
  function say(msg) { if (status) status.textContent = msg || ""; }
  function show(nodes) {
    root.textContent = "";
    nodes.forEach(function (n) { if (n) root.appendChild(n); });
    var f = root.querySelector("h2");   // nach einem Schritt des Nutzers: Fokus auf die neue Ueberschrift (nicht beim ersten Laden)
    if (f && !first) { f.setAttribute("tabindex", "-1"); f.focus(); }
    first = false;
  }
  function safe(u) { return /^https:\/\//.test(String(u || "")) ? u : ""; }
  function pct(s, n) { return n ? Math.round((s * 100) / n) : 0; }
  function store(k, v) { try { if (v === undefined) sessionStorage.removeItem(k); else sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  function load(k) { try { return JSON.parse(sessionStorage.getItem(k) || "null"); } catch (e) { return null; } }
  function src() {   // Herkunft fuer die Trichter-Zahlen (Worker: hoechstens 40 Zeichen)
    var p = new URLSearchParams(location.search), s = p.get("utm_source") || p.get("ref") || "";
    if (!s && document.referrer) {
      try { var r = new URL(document.referrer); s = r.host === location.host ? r.pathname : r.host; } catch (e) { }
    }
    return String(s || "direct").toLowerCase().slice(0, 40);
  }
  function fail(r) {
    say(r && r.s === 429 ? t("q_err_rate") : t("q_err"));
  }

  // ---------- Anmeldung ----------
  function login() {
    var ret = encodeURIComponent(location.href.split("#")[0]), btns = h("div", { class: "lq-btns" });
    var names = { linkedin: "LinkedIn", microsoft: "Microsoft", google: "Google", github: "GitHub" };
    show([h("h2", { text: t("q_login_h") }), h("p", { text: t("q_login") }), btns]);
    api("/api/providers").then(function (r) {
      var pv = (r.j && r.j.providers) || ["linkedin", "microsoft", "google"];
      if (!Array.isArray(pv)) pv = Object.keys(pv);
      ["linkedin", "microsoft", "google", "github"].forEach(function (p) {
        if (pv.indexOf(p) < 0) return;
        btns.appendChild(h("a", { class: "btn" + (btns.children.length ? "" : " main"), rel: "nofollow", href: C.api + "/auth/login/" + p + "?return=" + ret, text: t("q_signin") + " " + names[p] }));
      });
    });
  }

  // ---------- Stand ----------
  function home() {
    say("");
    api("/api/learn/cert?path=" + encodeURIComponent(C.path)).then(function (r) {
      if (r.s === 401) return login();
      if (r.s !== 200) return fail(r);
      ST = r.j;
      if (ST.cert && ST.cert.status === "ok") return certDone(ST.cert, ST.best);
      if (ST.passed && ST.best) return passedView();
      if (!ST.quiz_ready) return show([h("h2", { text: t("q_soon") })]);
      intro();
    });
  }
  function leftLine(n) {
    return n > 0 ? h("p", { class: "mut", text: t("q_left", { n: n, m: C.max || 3 }) }) : h("p", { class: "lq-no", text: t("q_none_left") });
  }
  function intro() {
    var left = ST.attempts_left, open = ST.open, best = ST.best;
    var btn = (open || left > 0) ? h("button", { type: "button", class: "btn main", text: open ? t("q_resume") : t("q_start"), onclick: function () { btn.disabled = true; start(); } }) : null;
    show([h("h2", { text: open ? t("q_resume") : t("q_start") }),
      best ? h("p", { text: t("q_best", { s: best.score, n: best.total }) }) : null,
      open ? null : leftLine(left), btn ? h("p", {}, [btn]) : null]);
  }
  function start() {
    say("");
    api("/api/learn/quiz/start", { method: "POST", body: { path: C.path, lang: C.qlang, src: src() } }).then(function (r) {
      if (r.s === 401) return login();
      if (r.s === 429) { if (ST) ST.attempts_left = 0; return show([h("h2", { text: t("q_start") }), leftLine(0)]); }
      if (r.s === 404 && r.j.error === "no_quiz") return show([h("h2", { text: t("q_soon") })]);
      if (r.s !== 200 || !Array.isArray(r.j.qids)) { home(); return fail(r); }
      quiz(r.j);
    });
  }

  // ---------- Test ----------
  function quiz(a) {
    var key = "lq:" + a.attempt, saved = load(key) || {}, n = a.qids.length, confirmMissing = false, last = null, kids = [];
    var prog = h("progress", { max: n, value: 0, "aria-hidden": "true" }), ptext = h("span", { "aria-live": "off" });
    var sub = h("button", { type: "submit", class: "btn main", text: t("q_submit") });
    a.qids.forEach(function (qid, i) {
      var q = Q[qid];
      if (q && q.g !== last) {
        last = q.g;
        kids.push(h("h3", { class: "lq-g" }, [q.g.t, h("a", { href: q.g.u, target: "_blank", rel: "noopener", text: t("q_reread") })]));
      }
      var legend = h("legend", {}, [h("small", { text: t("q_of", { i: i + 1, n: n }) }), h("span", { text: q ? q.q : t("q_noq") })]);
      var fs = h("fieldset", { class: "qq", "data-qid": qid }, [legend]);
      if (q) q.opts.forEach(function (o, j) {
        var inp = h("input", { type: "radio", name: "lq-" + qid, value: String(j) });
        if (saved[qid] === j) inp.checked = true;
        fs.appendChild(h("label", { class: "qo" }, [inp, h("span", { text: o })]));
      });
      kids.push(fs);
    });
    function answers() {
      var out = {};
      a.qids.forEach(function (qid) {
        var c = form.querySelector('input[name="lq-' + qid + '"]:checked');
        if (c) out[qid] = parseInt(c.value, 10);
      });
      return out;
    }
    function upd() {
      var ans = answers(), k = Object.keys(ans).length;
      prog.value = k; ptext.textContent = t("q_progress", { a: k, n: n });
      store(key, ans);
    }
    var form = h("form", { class: "lq-form", novalidate: true }, kids.concat([h("div", { class: "lq-bar" }, [prog, ptext, sub])]));
    form.addEventListener("change", function () { confirmMissing = false; upd(); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ans = answers(), miss = a.qids.filter(function (q) { return !(q in ans) && Q[q]; });
      if (miss.length && !confirmMissing) {
        confirmMissing = true;
        say(t("q_missing", { n: miss.length }));
        var first = form.querySelector('fieldset[data-qid="' + miss[0] + '"] input');
        if (first) first.focus();
        return;
      }
      sub.disabled = true; say("");
      api("/api/learn/quiz/submit", { method: "POST", body: { attempt: a.attempt, answers: ans } }).then(function (r) {
        sub.disabled = false;
        if (r.s === 401) return login();
        if (r.s === 410) { store(key); return show([h("h2", { text: t("q_expired") }), h("p", {}, [h("button", { type: "button", class: "btn main", text: t("q_start"), onclick: start })])]); }
        if (r.s === 409) { store(key); return home(); }
        if (r.s !== 200) return fail(r);
        store(key);
        result(r.j, ans);
      });
    });
    var head = [h("h2", { text: a.resumed ? t("q_resume") : t("q_start") })];
    if (a.expires) head.push(h("p", { class: "mut", text: t("q_valid", { t: new Date(a.expires * 1000).toLocaleString(C.lang) }) }));
    show(head.concat([form]));
    upd();
  }

  // ---------- Ergebnis ----------
  function result(res, ans) {
    var out = [h("h2", { text: res.passed ? t("q_passed") : t("q_result_h") })];
    out.push(h("p", { class: "lq-big " + (res.passed ? "lq-ok" : "lq-no"), text: t("q_result", { s: res.score, n: res.total, pct: pct(res.score, res.total) }) }));
    if (!res.passed) out.push(h("p", { text: t("q_failed", { need: res.threshold, n: res.total }) }));
    var pp = res.per_pillar || {}, ul = h("ul", { class: "lq-pp" });
    (D.groups || []).forEach(function (g) {
      var x = pp[g.id];
      if (!x) return;
      ul.appendChild(h("li", {}, [h("b", { text: g.t + ": " }), h("span", { class: x.ok === x.n ? "lq-ok" : "lq-no", text: x.ok + "/" + x.n }), " · ",
        h("a", { href: g.u, text: t("q_reread") })]));
    });
    out.push(h("h3", { text: t("q_by_guide") }), ul);
    if (res.passed) out.push(certForm(res.attempt));
    else {
      out.push(leftLine(res.attempts_left));
      if (res.attempts_left > 0) out.push(h("p", {}, [h("button", { type: "button", class: "btn main", text: t("q_retry"), onclick: function (e) { e.target.disabled = true; start(); } })]));
    }
    var ol = h("ol");
    (res.results || []).forEach(function (x) {
      var q = Q[x.qid], opt = function (i) { return q && i !== null && i !== undefined && q.opts[i] !== undefined ? q.opts[i] : t("q_noans"); };
      ol.appendChild(h("li", {}, [
        h("p", {}, [h("b", { text: q ? q.q : x.qid })]),
        h("p", {}, [h("span", { class: x.ok ? "lq-ok" : "lq-no", text: (x.ok ? t("q_right") : t("q_wrong")) + " · " }), t("q_yours") + ": " + opt(x.chosen !== undefined ? x.chosen : ans[x.qid])]),
        x.ok ? null : h("p", { text: t("q_correct") + ": " + opt(x.correct) }),
        x.why ? h("p", { class: "mut", text: x.why }) : null]));
    });
    out.push(h("details", { class: "lq-rev", open: !res.passed }, [h("summary", { text: t("q_review") }), ol]));
    show(out);
  }

  // ---------- Zertifikat ----------
  function passedView() {
    var b = ST.best, out = [h("h2", { text: t("q_passed_before", { s: b.score, n: b.total }) })];
    if (ST.cert && ST.cert.status === "pending" && !ST.cert_on) out.push(h("p", { class: "lq-big", text: t("q_cert_off") }));
    else out.push(certForm(b.attempt));
    show(out);
  }
  function certForm(attempt) {
    var name = h("input", { id: "lq-name", name: "name", autocomplete: "name", required: true, minlength: "2", maxlength: "80", value: (ST && ST.name) || "" });
    var mail = h("input", { id: "lq-mail", name: "email", type: "email", autocomplete: "email", required: true, maxlength: "254", value: (ST && ST.email) || "" });
    var ok = h("input", { id: "lq-ok", type: "checkbox", required: true });
    var parts = t("q_consent").split("{link}"), err = h("p", { class: "lq-err", role: "alert" });
    var label = h("label", { class: "lq-chk", for: "lq-ok" }, [ok, h("span", {}, [parts[0], h("a", { href: C.privacy, target: "_blank", rel: "noopener", text: t("q_privacy") }), parts[1] || ""])]);
    var btn = h("button", { type: "submit", class: "btn main", text: t("q_cert_btn") });
    var box = h("form", { class: "lq-cert", novalidate: true }, [h("h3", { text: t("q_cert_h") }), h("p", { class: "mut", text: t("q_cert_lead") }),
      h("label", { for: "lq-name", text: t("q_name") }), name, h("label", { for: "lq-mail", text: t("q_email") }), mail, label, err, h("p", {}, [btn])]);
    function bad(el, msg) {
      [name, mail, ok].forEach(function (x) { x.removeAttribute("aria-invalid"); });
      if (el) { el.setAttribute("aria-invalid", "true"); el.focus(); }
      err.textContent = msg || "";
    }
    box.addEventListener("submit", function (e) {
      e.preventDefault();
      var nv = name.value.replace(/\s+/g, " ").trim(), mv = mail.value.trim();
      if (nv.length < 2 || nv.length > 80) return bad(name, t("q_err_name"));
      if (!/^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i.test(mv)) return bad(mail, t("q_err_email"));
      if (!ok.checked) return bad(ok, t("q_err_consent"));
      bad(null, ""); btn.disabled = true;
      api("/api/learn/cert", { method: "POST", body: { path: C.path, attempt: attempt, name: nv, email: mv, consent: true, lang: C.qlang } }).then(function (r) {
        btn.disabled = false;
        if (r.s === 401) return login();
        if (r.s === 200 && (r.j.status === "ok" || r.j.url)) return box.replaceWith(certLinks(r.j));   // Worker: 200 heisst immer status "ok" (url kann leer sein, wenn Certopus keine https-Adresse liefert)
        if (r.s === 503 || (r.s === 409 && r.j.error === "busy")) return box.replaceWith(h("p", { class: "lq-big", role: "status", text: t("q_cert_off") }));
        if (r.j.error === "name") return bad(name, t("q_err_name"));
        if (r.j.error === "email") return bad(mail, t("q_err_email"));
        if (r.j.error === "consent") return bad(ok, t("q_err_consent"));
        bad(null, r.s === 429 ? t("q_err_rate") : r.s === 502 ? t("q_cert_err") : t("q_err"));
      });
    });
    return box;
  }
  function certLinks(c) {
    var links = h("p", { class: "lq-btns" });
    if (safe(c.url)) links.appendChild(h("a", { class: "btn main", href: c.url, target: "_blank", rel: "noopener", text: t("q_cert_view") }));
    if (safe(c.pdf)) links.appendChild(h("a", { class: "btn", href: c.pdf, target: "_blank", rel: "noopener", text: t("q_cert_pdf") }));
    if (safe(c.linkedin)) links.appendChild(h("a", { class: "btn", href: c.linkedin, target: "_blank", rel: "noopener", text: t("q_linkedin") }));
    return h("div", { class: "lq-cert", role: "status" }, [h("h3", { text: t("q_cert_h") }), h("p", { text: t("q_cert_ok") }), links]);
  }
  function certDone(c, best) {
    show([h("h2", { text: best ? t("q_passed_before", { s: best.score, n: best.total }) : t("q_passed") }), certLinks(c)]);
  }

  api("/api/me").then(function (r) { if (r.j && r.j.user) home(); else login(); });
})();
