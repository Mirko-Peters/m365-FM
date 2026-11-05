/* T37 Sponsor-Seite (/sponsor/): Bedienung des Paket-Konfigurators. Rechnen, Texte und HTML-Bausteine: assets/sponsor-calc.js.
   INP-Regeln (T29a): ein Listener je Ereignistyp am Wurzelelement, ein Rendern je Frame (requestAnimationFrame), nur Schreiben ins DOM
   (keine Layout-Abfragen), Fokus erst nach dem naechsten Frame und ohne Scrollen, live ist nur die Summenzeile.
   Das Standardpaket rendert der Seitenbau vorab (data-ssr="1"); beim Laden wird nur neu gerendert, wenn der Zustand abweicht. */
(function () {
  var root = document.getElementById("spn"), SC = window.SponsorCalc;
  if (!root || !SC) return;
  var C0;
  try { C0 = JSON.parse(root.getAttribute("data-cfg")); } catch (e) { return; }
  var P = C0.P, L = { lang: C0.lang, T: C0.T || {}, E: C0.E, dec: C0.dec }, CTX = { nLangs: C0.nLangs, con: C0.con, page: C0.page };
  function $(id) { return document.getElementById(id); }
  var el = { month: $("spn-month"), tline: $("spn-tline"), rows: $("spn-rows"), notopic: $("spn-notopic"), tl: $("spn-tl"), fgeo: $("spn-fgeo"), fseo: $("spn-fseo"),
             ttext: $("spn-ttext"), rec: $("spn-rec"), pk: $("spn-pk"), prrec: $("spn-prrec"), rtrec: $("spn-rtrec"), picked: $("spn-picked"), sum: $("spn-sum"),
             lock: $("spn-lock"), dash: $("spn-dash"), cpr: $("spn-cnt-pr"), cex: $("spn-cnt-ex"), cli: $("spn-cnt-li"), clv: $("spn-cnt-lv"), q: $("spn-q"), own: $("spn-own"), dl: $("spn-dl"),
             qmsg: $("spn-q-msg"), ownmsg: $("spn-own-msg"), form: $("spn-form"), status: $("spn-status"), done: $("spn-done"), submit: $("spn-submit"), terr: $("spn-topics-e") };
  var chips = root.querySelectorAll(".spn-chip");

  /* Themen: Schnellauswahl, kuratierte Suche, eigene Themen (Namen ohne Gross-/Kleinschreibung verglichen) */
  var QUICK = {}, BYNAME = {};
  function key(s) { return SC.clean(s).toLowerCase(); }
  C0.quick.forEach(function (q) {
    var o = { id: q[0], name: q[1], en: q[2], lvl: q[3], rated: q[4], example: q[5], url: q[6], custom: false };
    QUICK[o.id] = o;
    [q[1], q[2]].concat(q[8] || []).forEach(function (n) { BYNAME[key(n)] = BYNAME[key(n)] || o; });
  });
  C0.ents.forEach(function (x) {
    var o = { id: "e:" + x[0], name: x[1], en: x[1], lvl: x[2], rated: !!x[2], example: !!x[3], url: C0.entBase + x[0] + "/", custom: false };
    [x[1]].concat(x[4] || []).forEach(function (n) { BYNAME[key(n)] = BYNAME[key(n)] || o; });
  });
  var S = { topics: [], cnt: { pr: 1, ex: P.defaults.cnt.ex, li: P.defaults.cnt.li, lv: P.defaults.cnt.lv || 1 }, prTouched: false };
  C0.quick.forEach(function (q) { if (q[7]) S.topics.push(QUICK[q[0]]); });

  function radio(name) { var r = root.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : null; }
  function chk(id) { var x = $(id); return !!(x && x.checked); }
  function state() {
    return { goal: radio("spn-goal") || P.defaults.goal, rt: +(radio("spn-rt") || P.defaults.runtime), topics: S.topics, video: chk("spn-video"), pr: chk("spn-pr"),
             auth: chk("spn-auth"), dash: chk("spn-dash"), l14: chk("spn-l14"), topic: chk("spn-topic"), expert: chk("spn-expert"), li: chk("spn-li"), live: chk("spn-live"), con: chk("spn-con"),
             cnt: S.cnt, prTouched: S.prTouched };
  }

  /* Rendern: hoechstens einmal je Frame, nur geaenderte Knoten */
  var raf = 0, last = {}, lastV = null, focusNext = null;
  function schedule() { if (!raf) raf = requestAnimationFrame(render); }
  function put(node, k, val, isHtml) {
    if (!node || last[k] === val) return;
    last[k] = val;
    if (isHtml) node.innerHTML = val; else node.textContent = val;
  }
  function prop(node, k, name, val) { if (node && last[k] !== val) { last[k] = val; node.style.setProperty(name, val); } }
  function pc(x) { return (+x.toFixed(3)) + "%"; }
  function flag(node, attr, on) { if (node && node[attr] !== on) node[attr] = on; }
  function render() {
    raf = 0;
    var s = state(), lead = s.goal === "lead";
    if (lead) { flag(el.dash, "checked", true); s.dash = true; }   // Leads: Dashboard Pflicht und gesperrt; bleibt nach dem Wechsel gewaehlt
    flag(el.dash, "disabled", lead); flag(el.lock, "hidden", !lead);
    var v = SC.view(s, P, L, CTX); lastV = v;
    put(el.month, "m", v.monthly); put(el.tline, "t", v.totalLine); flag(el.notopic, "hidden", !v.noTopic);
    put(el.rows, "r", SC.rowsHtml(v.rows), true);
    prop(el.tl, "run", "--run", pc(v.bars.run));
    prop(el.fgeo, "ga", "--a", pc(v.bars.geo[0])); prop(el.fgeo, "gw", "--w", pc(v.bars.geo[1]));
    prop(el.fseo, "sa", "--a", pc(v.bars.seo[0])); prop(el.fseo, "sw", "--w", pc(v.bars.seo[1]));
    put(el.ttext, "x", v.tText); put(el.rec, "rec", SC.recHtml(v), true);
    put(el.pk, "pk", v.pkCount); put(el.prrec, "pr", v.prRec); flag(el.prrec, "hidden", !v.prRecShow); put(el.rtrec, "rt", v.rtRec);
    put(el.cpr, "cpr", String(v.counts.pr)); put(el.cex, "cex", String(v.counts.ex)); put(el.cli, "cli", String(v.counts.li)); put(el.clv, "clv", String(v.counts.lv));
    put(el.picked, "pk2", SC.pickedHtml(s, P, L), true); put(el.sum, "sum", v.summary);
    if (focusNext) { var f = focusNext; focusNext = null; focusLater(f()); }
  }
  function focusLater(node) {
    if (!node) return;
    requestAnimationFrame(function () { setTimeout(function () { try { node.focus({ preventScroll: true }); } catch (e) {} }); });
  }

  function idx(o) {
    var n = key(o.name), en = key(o.en || o.name);
    for (var i = 0; i < S.topics.length; i++) {
      var t = S.topics[i];
      if (t.id === o.id || key(t.name) === n || key(t.en || t.name) === en) return i;
    }
    return -1;
  }
  function msg(node, text) { if (!node) return; node.textContent = text; node.hidden = !text; }
  function addTopic(o, box) {
    if (idx(o) >= 0) return true;
    if (S.topics.length >= P.max_topics) { msg(box, SC.t(L, "max_topics", { n: P.max_topics })); return false; }
    S.topics.push(o); return true;
  }
  function topicsChanged() {
    S.prTouched = false;
    for (var i = 0; i < chips.length; i++) {
      var o = QUICK[chips[i].getAttribute("data-q")], on = o && idx(o) >= 0 ? "true" : "false";
      if (chips[i].getAttribute("aria-pressed") !== on) chips[i].setAttribute("aria-pressed", on);
    }
    msg(el.terr, "");
    schedule();
  }
  function toggleQuick(id) {
    var o = QUICK[id]; if (!o) return;
    var i = idx(o);
    if (i >= 0) { S.topics.splice(i, 1); msg(el.qmsg, ""); } else if (!addTopic(o, el.qmsg)) return;
    topicsChanged();
  }
  function removeAt(i) {
    if (!(i >= 0 && i < S.topics.length)) return;
    S.topics.splice(i, 1);
    focusNext = function () { var b = el.picked.querySelectorAll(".spn-rm"); return b.length ? b[Math.min(i, b.length - 1)] : el.own; };
    topicsChanged();
  }
  function addSearch() {
    var v = SC.clean(el.q.value); if (!v) return;
    var o = BYNAME[key(v)];
    if (!o) { msg(el.qmsg, SC.t(L, "search_none", { q: v })); el.q.setAttribute("aria-invalid", "true"); return; }
    if (!addTopic(o, el.qmsg)) return;
    el.q.value = ""; el.q.removeAttribute("aria-invalid"); msg(el.qmsg, ""); topicsChanged();
  }
  function addOwn() {
    var v = SC.clean(el.own.value).slice(0, 80); if (!v) return;
    var o = BYNAME[key(v)] || { id: "c:" + key(v), name: v, en: v, lvl: 0, rated: false, example: false, url: "", custom: true };
    if (!addTopic(o, el.ownmsg)) return;
    el.own.value = ""; msg(el.ownmsg, ""); topicsChanged();
  }
  function step(k, d) {
    var cur = k === "pr" ? (S.prTouched ? S.cnt.pr : (lastV ? lastV.calc.prCount : SC.compute(state(), P).prCount)) : S.cnt[k];
    S.cnt[k] = SC.clampStep(cur + d, P);
    if (k === "pr") S.prTouched = true;
    var cb = $({ pr: "spn-pr", ex: "spn-expert", li: "spn-li", lv: "spn-live" }[k]);
    if (cb && !cb.checked) cb.checked = true;
    schedule();
  }
  function fillList() {   // Vorschlagsliste erst beim ersten Fokus (kein Aufwand beim Laden)
    if (!el.dl || el.dl.firstChild) return;
    var f = document.createDocumentFragment();
    C0.ents.forEach(function (x) { var o = document.createElement("option"); o.value = x[1]; f.appendChild(o); });
    el.dl.appendChild(f);
  }

  root.addEventListener("change", function (e) {
    var x = e.target;
    if (x.type !== "radio" && x.type !== "checkbox") return;
    if (x.name === "spn-rt") S.prTouched = false;
    schedule();
  });
  root.addEventListener("click", function (e) {
    var x = e.target && e.target.closest ? e.target.closest("button,a") : null;
    if (!x || !root.contains(x)) return;
    if (x.classList.contains("spn-chip")) return toggleQuick(x.getAttribute("data-q"));
    if (x.hasAttribute("data-rm")) return removeAt(+x.getAttribute("data-rm"));
    if (x.hasAttribute("data-step")) return step(x.getAttribute("data-step"), +x.getAttribute("data-d"));
    var act = x.getAttribute("data-act");
    if (act === "search") return addSearch();
    if (act === "own") return addOwn();
    if (x.id === "spn-open") focusLater($("spn-company"));   // Sprung zum Formular macht der Link selbst
  });
  root.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    if (e.target === el.q) { e.preventDefault(); addSearch(); } else if (e.target === el.own) { e.preventDefault(); addOwn(); }
  });
  if (el.q) {
    el.q.addEventListener("focus", fillList, { once: true });
    el.q.addEventListener("input", function (e) {   // Auswahl aus der Vorschlagsliste: sofort uebernehmen
      if (e.inputType && e.inputType !== "insertReplacementText") return;
      if (BYNAME[key(el.q.value)]) addSearch();
    });
  }

  /* Anfrage: POST an die Community-API, Paket v1 */
  var sending = false;
  function mailto(f, pkg) {
    var lines = ["Company: " + f.company, "Name: " + f.name, "Email: " + f.email, "", "Goal: " + pkg.goal, "Topics: " + pkg.topics.join(", "), "Runtime: " + pkg.duration]
      .concat(pkg.components, pkg.extras, ["Per month: " + pkg.monthlyUsd, "One-time: " + pkg.oneOffUsd, "Total: " + pkg.totalUsd, "Effect: " + pkg.effect, "", f.message || ""]);
    return "mailto:" + C0.mail + "?subject=" + encodeURIComponent(SC.t(L, "mail_subject") + (f.company ? " – " + SC.clean(f.company) : "")) +
      "&body=" + encodeURIComponent(Array.from(lines.join("\n")).slice(0, 1800).join(""));
  }
  function showStatus(k, f, pkg) {
    var parts = SC.t(L, k).split("{mail}"), st = el.status;
    st.textContent = "";
    st.appendChild(document.createTextNode(parts[0]));
    if (parts.length > 1) {
      var a = document.createElement("a"); a.textContent = C0.mail;
      try { a.href = mailto(f, pkg); } catch (e) { a.href = "mailto:" + C0.mail; }
      st.appendChild(a); st.appendChild(document.createTextNode(parts.slice(1).join(C0.mail)));
    }
    st.hidden = false; focusLater(st);
  }
  function onSubmit(e) {
    e.preventDefault();
    if (sending) return;
    var f = { company: $("spn-company").value, name: $("spn-name").value, email: $("spn-email").value, message: $("spn-msg").value, website: $("spn-website").value };
    var errs = SC.validate(f, S.topics.length), first = null;
    [["company", "spn-company"], ["name", "spn-name"], ["email", "spn-email"]].forEach(function (p) {
      var inp = $(p[1]), m = $(p[1] + "-e"), k = errs[p[0]];
      inp.setAttribute("aria-invalid", k ? "true" : "false");
      msg(m, k ? SC.t(L, k) : "");
      if (k && !first) first = inp;
    });
    msg(el.terr, errs.topics ? SC.t(L, errs.topics) : "");
    el.status.hidden = true;
    if (first || errs.topics) { if (!first) el.terr.setAttribute("tabindex", "-1"); focusLater(first || el.terr); return; }
    var s = state(); if (s.goal === "lead") s.dash = true;
    var pkg = SC.buildPackage(s, P, L, CTX), body = SC.requestBody(f, pkg, C0.lang), label = el.submit.textContent;
    sending = true; el.submit.disabled = true; el.submit.textContent = SC.t(L, "sending");
    function done(res) {
      clearTimeout(to); sending = false; el.submit.disabled = false; el.submit.textContent = label;
      var k = SC.errorKey(res.s, res.j);
      if (!k) { el.form.hidden = true; el.done.hidden = false; focusLater(el.done); return; }
      showStatus(k, f, pkg);
    }
    var ac = window.AbortController ? new AbortController() : null, to = ac ? setTimeout(function () { ac.abort(); }, 20000) : 0;   // haengt die API: nach 20 s Mail-Rueckfall
    fetch(C0.api + "/api/sponsor/request", { method: "POST", credentials: "omit", headers: { "content-type": "application/json", "x-requested-with": "m365" }, body: JSON.stringify(body), signal: ac ? ac.signal : undefined })
      .then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j }; }, function () { return { s: r.status, j: null }; }); },
            function () { return { s: 0, j: null }; })
      .then(done);
  }
  if (el.form) { el.form.addEventListener("submit", onSubmit); if (el.submit) el.submit.disabled = false; }   // vorher gesperrt: ohne Skript kein natives Absenden

  /* Start: nur rendern, wenn der Browser einen anderen Zustand wiederhergestellt hat oder nichts vorab gerendert ist. Sonst in einer
     Leerlaufphase einmal vorrechnen (JIT, Intl.PluralRules) und die vorab gerenderten Texte merken: die erste Interaktion schreibt dann nur,
     was sich aendert (T29a: erste Klicks ohne lange Aufgabe). */
  function seed() {
    if (lastV || raf) return;
    var s = state(), v = SC.view(s, P, L, CTX); lastV = v;
    var k = { m: v.monthly, t: v.totalLine, r: SC.rowsHtml(v.rows), x: v.tText, rec: SC.recHtml(v), pk: v.pkCount, pr: v.prRec, rt: v.rtRec, cpr: String(v.counts.pr),
              cex: String(v.counts.ex), cli: String(v.counts.li), clv: String(v.counts.lv), pk2: SC.pickedHtml(s, P, L), sum: v.summary, run: pc(v.bars.run), ga: pc(v.bars.geo[0]),
              gw: pc(v.bars.geo[1]), sa: pc(v.bars.seo[0]), sw: pc(v.bars.seo[1]) };
    for (var n in k) if (!(n in last)) last[n] = k[n];
  }
  if (root.getAttribute("data-ssr") !== "1" || SC.stateKey(state()) !== C0.key) schedule();
  else (window.requestIdleCallback || function (f) { return setTimeout(f, 1200); })(seed, { timeout: 4000 });
})();
