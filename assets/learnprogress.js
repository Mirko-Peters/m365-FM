// Lernfortschritt im Lernpfad (site_pillars.py: Kasten #lpx, Konfiguration #lpx-data, Marker data-lpx; Worker worker/src/learnprogress.js).
// Vor dem Klick auf "Lernfortschritt speichern" wird nichts gespeichert und nichts gesendet (§ 25 TDDDG); gelesen wird nur der eigene Schluessel m365-learn
// (ob der Opt-in schon besteht). Danach: localStorage m365-learn {v:1,on:1,u,ep,sy,p:{<pfad>:{g,c,v,q}}}, sessionStorage m365-learn-s (Abgleich in diesem Tab),
// fuer Angemeldete Abgleich mit dem Konto (GET hoechstens 1 je Tab-Sitzung, POST nur bei Aenderung, Lesestelle gedrosselt, Videoklick sofort mit keepalive).
// "Gelesen" automatisch: Artikelende gesehen UND aktive Lesezeit >= clamp(30 % der Lesezeit, 20 s, 180 s). Zeiten an den Server nur als Alter (age), nie als Zeitstempel.
(function () {
  "use strict";
  var W = window, D = document, KEY = "m365-learn", SKEY = "m365-learn-s", AUTH = "m365_auth";
  var cfgEl = D.getElementById("lpx-data"), box = D.getElementById("lpx");
  if (!cfgEl || !box) return;
  var C;
  try { C = JSON.parse(cfgEl.textContent); } catch (e) { return; }
  if (!C || !C.path || !C.api) return;
  var T = C.t || {}, P = C.path, LANG = C.lang || "en", K = C.k, ID = C.id || "";
  var ID_RX = /^[a-z0-9][a-z0-9-]{1,60}$/, VID_RX = /^[A-Za-z0-9_-]{5,24}$/, L_RX = /^(en|de|fr|es|it|nl|pt|pl|id|ru|uk|ar|he|ja|ko)$/, A_RX;
  try { A_RX = new RegExp("^[\\p{L}\\p{N}\\p{M}_-]{1,160}$", "u"); } catch (e) { A_RX = /^[A-Za-z0-9À-￿_-]{1,160}$/; }
  var SKIP = { videos: 1, sources: 1, "pl-deep-h": 1, "pl-relg-h": 1 };
  (C.toc || []).forEach(function (x) { SKIP[x] = 1; });
  var MAXQ = 200, DEBOUNCE = 2000, POS_GAP = 300000;
  var art = D.querySelector("article.pl-art[data-lpx]"), endEl = art && art.querySelector(".pl-end"), done = D.querySelector(".pl-done");
  var doneHTML = done ? done.innerHTML : "", saveBtn = D.getElementById("lpx-save"), slot = box.querySelector(".lpx-b"), qopen = D.querySelector(".pl-qopen");
  var S = null, RO = false;   // Stand (nur nach dem Opt-in); RO: unbekannte Formatversion -> nur anzeigen, nie schreiben
  var sess = null, off = false, busy = false, again = false, deb = 0, err = false;
  // "gelesen": im Speicher, auch vor dem Opt-in (ohne Speicherzugriff)
  var minSec = Math.min(180, Math.max(20, Math.round((+C.min || 1) * 60 * 0.3)));
  var act = 0, since = D.visibilityState === "visible" ? now() : -1, endSeen = false, readyRead = false, noAuto = false, timer = 0, lastPos = "";

  function now() { return W.performance && performance.now ? performance.now() : Date.now(); }
  function int(x) { x = Math.floor(+x); return isFinite(x) && x > 0 ? x : 0; }
  function t(k, v) {
    var s = T[k] || k;
    if (v) Object.keys(v).forEach(function (n) { s = s.split("{" + n + "}").join(String(v[n])); });
    return s;
  }
  function h(tag, a, kids) {
    var el = D.createElement(tag);
    Object.keys(a || {}).forEach(function (k) { if (k === "text") el.textContent = a[k]; else el.setAttribute(k, a[k]); });
    (kids || []).forEach(function (c) { if (c) el.appendChild(typeof c === "string" ? D.createTextNode(c) : c); });
    return el;
  }

  // ---------- Speicher ----------
  function emptyPath() { return { g: {}, c: {}, v: {}, q: [] }; }
  function normEntry(e) {
    if (!e || typeof e !== "object") return null;
    var o = { r: e.r ? 1 : 0 };
    if (typeof e.t === "number" && isFinite(e.t)) o.t = e.t;
    if (typeof e.a === "string" && A_RX.test(e.a)) o.a = e.a;
    if (typeof e.h === "string" && e.h) o.h = e.h.replace(/[<>]/g, "").slice(0, 80);
    if (typeof e.l === "string" && L_RX.test(e.l)) o.l = e.l;
    if (typeof e.pc === "number" && isFinite(e.pc)) o.pc = Math.max(0, Math.min(100, Math.round(e.pc)));
    return o;
  }
  function validQ(e) {
    if (!e || typeof e !== "object") return false;
    var kv = function (x) { return Array.isArray(x) && (x[0] === "g" || x[0] === "c") && ID_RX.test(x[1]); };
    if (e.s) return kv(e.s);
    if (e.x) return kv(e.x);
    if (e.v) return VID_RX.test(e.v);
    if (e.p) return (e.p.k === "g" || e.p.k === "c") && ID_RX.test(e.p.id);
    return false;
  }
  function normPath(x) {
    var r = emptyPath();
    if (!x || typeof x !== "object") return r;
    ["g", "c"].forEach(function (k) {
      var m = x[k];
      if (!m || typeof m !== "object") return;
      Object.keys(m).filter(function (id) { return ID_RX.test(id); }).slice(0, 60).forEach(function (id) { var e = normEntry(m[id]); if (e) r[k][id] = e; });
    });
    if (x.v && typeof x.v === "object") Object.keys(x.v).filter(function (id) { return VID_RX.test(id); }).slice(0, 100).forEach(function (id) { r.v[id] = 1; });
    if (Array.isArray(x.q)) r.q = x.q.filter(validQ).slice(-MAXQ);
    return r;
  }
  function load() {   // -> Stand, null (kein Opt-in, kaputt), false (unbekannte Version) oder "x" (kein localStorage)
    var raw, o;
    try { raw = W.localStorage.getItem(KEY); } catch (e) { return "x"; }
    if (!raw) return null;
    try { o = JSON.parse(raw); } catch (e) { return null; }
    if (!o || typeof o !== "object" || o.on !== 1) return null;
    if (o.v !== 1) return false;
    var s = { v: 1, on: 1, u: int(o.u), ep: int(o.ep), sy: int(o.sy), p: {} };
    if (o.p && typeof o.p === "object") Object.keys(o.p).filter(function (k) { return ID_RX.test(k); }).forEach(function (k) { s.p[k] = normPath(o.p[k]); });
    return s;
  }
  function save() {
    if (!S || RO) return false;
    try { W.localStorage.setItem(KEY, JSON.stringify(S)); return true; }
    catch (e) {   // voll: Lesestellen-Texte weglassen, dann aufgeben (Anzeige bleibt)
      try {
        var cp = JSON.parse(JSON.stringify(S));
        Object.keys(cp.p).forEach(function (k) { ["g", "c"].forEach(function (x) { Object.keys(cp.p[k][x]).forEach(function (id) { delete cp.p[k][x][id].h; }); }); cp.p[k].q = cp.p[k].q.slice(-50); });
        W.localStorage.setItem(KEY, JSON.stringify(cp)); return true;
      } catch (e2) { return false; }
    }
  }
  function pth() { if (!S.p[P]) S.p[P] = emptyPath(); return S.p[P]; }
  function entry(k, id) { var m = pth()[k]; if (!m[id]) m[id] = { r: 0 }; return m[id]; }
  function readSess() {
    try { var o = JSON.parse(W.sessionStorage.getItem(SKEY) || "null"); return o && typeof o === "object" ? o : null; } catch (e) { return null; }
  }
  function writeSess(o) { try { W.sessionStorage.setItem(SKEY, JSON.stringify(o)); } catch (e) { /* ignore */ } }
  function dropSess() { try { W.sessionStorage.removeItem(SKEY); } catch (e) { /* ignore */ } }
  function authHint(on) { try { if (on) W.localStorage.setItem(AUTH, "1"); else W.localStorage.removeItem(AUTH); } catch (e) { /* ignore */ } }

  // ---------- Warteschlange ----------
  function qkey(e) { return e.s ? "r" + e.s.join(":") : e.x ? "r" + e.x.join(":") : e.v ? "v" + e.v : "p" + e.p.k + ":" + e.p.id; }
  function enq(e) {
    var q = pth().q, k = qkey(e);
    pth().q = q.filter(function (x) { return qkey(x) !== k; }).concat([e]).slice(-MAXQ);
  }
  function applyLocal(e) {
    var p = pth();
    if (e.s) entry(e.s[0], e.s[1]).r = 1;
    else if (e.x) entry(e.x[0], e.x[1]).r = 0;
    else if (e.v) p.v[e.v] = 1;
    else if (e.p) { var x = entry(e.p.k, e.p.id); ["a", "h", "l", "pc", "t"].forEach(function (f) { if (e.p[f] != null) x[f] = e.p[f]; else delete x[f]; }); }
  }
  function posOf(p, nowMs) {   // Lesestelle fuer den Server: nur relatives Alter, kein Zeitstempel
    var o = { k: p.k, id: p.id, age: Math.max(0, Math.round((nowMs - (typeof p.t === "number" ? p.t : nowMs)) / 1000)) };
    if (p.a) o.a = p.a;
    if (p.h) o.h = p.h;
    if (p.l) o.l = p.l;
    if (p.pc != null) o.pc = p.pc;
    return o;
  }
  function bodyOf(q, init) {   // -> [Body, gesendete Eintraege] mit den Grenzen des Servers (set/unset 120, vid 100, pos 60)
    var b = { path: P, ep: S.ep, init: init ? 1 : 0, set: [], unset: [], vid: [], pos: [] }, sent = [], n = Date.now();
    q.forEach(function (e) {
      if (e.s && b.set.length < 120) b.set.push(e.s);
      else if (e.x && b.unset.length < 120) b.unset.push(e.x);
      else if (e.v && b.vid.length < 100) b.vid.push(e.v);
      else if (e.p && b.pos.length < 60) b.pos.push(posOf(e.p, n));
      else return;
      sent.push(e);
    });
    return [b, sent];
  }
  function fullQueue() {   // erster Abgleich eines Gaststands: alles Lokale (gelesen, geoeffnet, Lesestellen; juengste zuerst)
    var p = pth(), q = [], pos = [];
    ["g", "c"].forEach(function (k) {
      Object.keys(p[k]).forEach(function (id) {
        var e = p[k][id];
        if (e.r) q.push({ s: [k, id] });
        if (e.a || e.pc != null) pos.push({ p: { k: k, id: id, a: e.a, h: e.h, l: e.l, pc: e.pc, t: e.t } });
      });
    });
    Object.keys(p.v).forEach(function (id) { q.push({ v: id }); });
    pos.sort(function (a, b) { return (b.p.t || 0) - (a.p.t || 0); });
    return q.concat(pos);
  }

  // ---------- Konto ----------
  function api(method, b, keep) {
    var o = { method: method, credentials: "include", headers: {} };
    if (method !== "GET") o.headers["x-requested-with"] = "m365";
    if (b) { o.headers["content-type"] = "application/json"; o.body = JSON.stringify(b); }
    if (keep) o.keepalive = true;
    var u = C.api + "/api/learn/progress" + (method === "POST" ? "" : "?path=" + encodeURIComponent(P));
    try {
      return W.fetch(u, o).then(function (r) {
        return r.json().then(function (j) { return { s: r.status, j: j || {} }; }, function () { return { s: r.status, j: {} }; });
      }, function () { return { s: 0, j: {} }; });
    } catch (e) { return Promise.resolve({ s: 0, j: {} }); }
  }
  function okState(j) { return j && typeof j === "object" && int(j.uid) > 0 && j.state && typeof j.state === "object"; }
  function adopt(j, keepQ) {   // Serverstand uebernehmen; nicht gesendete Eintraege der Warteschlange darueber anwenden
    var st = j.state || {}, srv = int(j.now), n = Date.now(), q = keepQ ? pth().q : [], np = emptyPath();
    ["g", "c"].forEach(function (k) {
      var m = st[k] && typeof st[k] === "object" ? st[k] : {};
      Object.keys(m).filter(function (id) { return ID_RX.test(id); }).slice(0, 60).forEach(function (id) {
        var e = normEntry(m[id] && typeof m[id] === "object" ? { r: m[id].r, a: m[id].a, h: m[id].h, l: m[id].l, pc: m[id].pc } : null);
        if (!e) return;
        if (srv && int(m[id].at)) e.t = n - Math.max(0, srv - int(m[id].at)) * 1000;   // Serverzeit -> lokale Uhr
        np[k][id] = e;
      });
    });
    Object.keys(st.v && typeof st.v === "object" ? st.v : {}).filter(function (id) { return VID_RX.test(id); }).slice(0, 100).forEach(function (id) { np.v[id] = 1; });
    S.p[P] = np;
    S.ep = int(j.ep); S.sy = int(j.updated);
    q.forEach(function (e) { applyLocal(e); np.q.push(e); });
  }
  function noteSess(r) {   // Ergebnis der Anmeldepruefung fuer diesen Tab (pt: letzte gesendete Lesestelle, Drossel 5 min)
    if (r.s !== 200 && r.s !== 409 && r.s !== 401 && r.s !== 404) return;
    sess = { t: Date.now(), s: r.s === 409 ? 200 : r.s, uid: r.s === 200 || r.s === 409 ? int(r.j.uid) : 0, pt: (sess && sess.pt) || 0 };
    writeSess(sess);
  }
  function idle() { busy = false; if (again) { again = false; flush(); } }
  function signed() { return !!(sess && sess.s === 200 && sess.uid && S && S.u === sess.uid); }
  function handle(r, sent) {
    if (!S) { busy = false; return; }
    noteSess(r);
    if (r.s === 404) { off = true; err = false; }
    else if (r.s === 401) { authHint(false); err = false; }
    else if ((r.s === 200 || r.s === 409) && okState(r.j)) {
      authHint(true); err = false;
      var uid = int(r.j.uid);
      if (S.u && S.u !== uid) { S.u = uid; S.p = {}; adopt(r.j, false); }   // anderes Konto auf diesem Geraet: ersetzen, nie zusammenfuehren
      else if (r.s === 409) { S.u = uid; adopt(r.j, false); }   // Zuruecksetzen auf einem anderen Geraet verpasst: Serverstand gilt
      else {
        var ks = sent.map(function (e) { return JSON.stringify(e); });
        pth().q = pth().q.filter(function (e) { return ks.indexOf(JSON.stringify(e)) < 0; });
        S.u = uid; adopt(r.j, true);
      }
      save();
    } else err = true;   // 429, 5xx, Netz: Warteschlange bleibt, naechster Anlass holt nach
    render(); idle();
  }
  function flush(keep) {
    clearTimeout(deb); deb = 0;
    if (!S || RO || off || !signed() || !pth().q.length) return;
    if (busy) { again = true; return; }
    var x = bodyOf(pth().q, false);
    busy = true;
    api("POST", x[0], keep).then(function (r) { handle(r, x[1]); });
  }
  function soon() { if (!S || off) return; clearTimeout(deb); deb = setTimeout(flush, DEBOUNCE); }
  function first() {   // erste Anfrage dieser Tab-Sitzung (zugleich Anmeldepruefung, fuer Gaeste 0 D1)
    if (!S || RO) return;
    var ss = readSess();
    if (ss && (ss.s === 200 || ss.s === 401 || ss.s === 404)) {
      sess = ss; if (ss.s === 404) off = true;
      if (ss.s === 200 && S.u === ss.uid) flush();
      else if (ss.s === 200 && S.u !== ss.uid) get();   // anderes Konto oder Gaststand: erst abgleichen
      return;
    }
    get();
  }
  function get() {
    if (busy) { return; }
    busy = true;
    api("GET").then(function (r) {
      if (!S) { idle(); return; }
      if (r.s === 200 && okState(r.j) && !S.u) {   // Gaststand + Konto: vereinigen (init:1), danach gehoert der Stand diesem Konto
        noteSess(r); authHint(true);
        var q = fullQueue();
        if (!q.length) { S.u = int(r.j.uid); adopt(r.j, false); save(); render(); idle(); return; }
        S.ep = int(r.j.ep);
        var x = bodyOf(q, true);
        api("POST", x[0]).then(function (r2) {
          if (!S) { idle(); return; }
          noteSess(r2);
          if ((r2.s === 200 || r2.s === 409) && okState(r2.j)) { S.u = int(r2.j.uid); adopt(r2.j, false); authHint(true); err = false; save(); }
          else err = r2.s !== 401 && r2.s !== 404;
          if (r2.s === 404) off = true;
          render(); idle();
        });
        return;
      }
      if (r.s === 200 && okState(r.j) && S.u === int(r.j.uid) && pth().q.length) {   // eigenes Konto mit Ausstehendem: senden (Server vereinigt)
        noteSess(r); busy = false; authHint(true); flush(); return;
      }
      handle(r, []);
    });
  }

  // ---------- Gelesen ----------
  function active() { return act + (since >= 0 ? now() - since : 0); }
  function plan() {
    clearTimeout(timer); timer = 0;
    if (!art || !endSeen || noAuto || readyRead || since < 0) return;
    var rest = minSec * 1000 - active();
    if (rest <= 0) markRead(); else timer = setTimeout(plan, rest + 50);
  }
  function markRead() {
    readyRead = true;
    if (!S || RO || K === "p") return;
    var e = entry(K, ID);
    if (e.r) return;
    e.r = 1; enq({ s: [K, ID] }); save(); render(); soon();
  }
  function markUnread() {
    if (!S || RO) return;
    noAuto = true; readyRead = false; clearTimeout(timer);
    entry(K, ID).r = 0; enq({ x: [K, ID] }); save(); render(); soon();
  }

  // ---------- Lesestelle ----------
  function heading() {   // letzte Ueberschrift ueber der Oberkante (beim Verlassen einmal gemessen, kein Scroll-Listener)
    if (!art) return null;
    var hs = art.querySelectorAll("h2[id],h3[id]"), last = null;
    for (var i = 0; i < hs.length; i++) {
      if (SKIP[hs[i].id]) continue;
      if (hs[i].getBoundingClientRect().top < 1) last = hs[i]; else break;
    }
    return last;
  }
  function keepPos() {
    if (!S || RO || !art || K === "p") return;
    var e = pth()[K][ID];
    if (e && e.r) return;
    var el = heading(), se = D.scrollingElement || D.documentElement, max = Math.max(1, se.scrollHeight - (W.innerHeight || 0));
    var pc = Math.max(0, Math.min(100, Math.round(100 * (W.scrollY || se.scrollTop || 0) / max)));
    if (!el || pc < 5) return;
    var a = A_RX.test(el.id) ? el.id : "", ti = (el.textContent || "").replace(/\s+/g, " ").replace(/[<>]/g, "").trim().slice(0, 80), sig = a + "|" + pc;
    if (sig === lastPos) return;
    lastPos = sig;
    var p = { k: K, id: ID, l: LANG, pc: pc, t: Date.now() };
    if (a) p.a = a;
    if (ti) p.h = ti;
    enq({ p: p }); applyLocal({ p: p }); save();
    if (signed() && Date.now() - (sess.pt || 0) >= POS_GAP) { sess.pt = Date.now(); writeSess(sess); flush(true); }   // sonst geht sie mit dem naechsten POST mit
  }
  function endCheck() {   // ohne IntersectionObserver: beim Verlassen pruefen, ob das Ende im Bild war
    if (!endSeen && endEl && endEl.getBoundingClientRect().top < (W.innerHeight || 0)) { endSeen = true; }
  }

  // ---------- Anzeige ----------
  var raf = 0;
  function render() { if (raf) return; raf = (W.requestAnimationFrame || setTimeout)(function () { raf = 0; draw(); }); }
  function link(text, a) { return h("button", { type: "button", class: "lpx-l", "data-lpx-a": a, text: text }); }
  // Reihenfolge im Kasten: was erst nach der Antwort des Servers dazukommt (Weiterlesen, Anmeldelinks), steht zuletzt -> nichts darueber verschiebt sich
  function loginLine() {
    if (signed() || off || !C.login || !C.login.length) return null;
    var p = h("p", { class: "lpx-s" }), ret = encodeURIComponent(location.href.split("#")[0]), parts = t("lp_signin").split("{p}"), names = { linkedin: "LinkedIn", microsoft: "Microsoft", google: "Google", github: "GitHub" };
    p.appendChild(D.createTextNode(parts[0]));
    C.login.forEach(function (pv, i) {
      if (!names[pv]) return;
      if (i) p.appendChild(D.createTextNode(" · "));
      p.appendChild(h("a", { href: C.api + "/auth/login/" + pv + "?return=" + ret, rel: "nofollow", "data-lpx-login": "1", text: names[pv] }));
    });
    if (parts[1]) p.appendChild(D.createTextNode(parts[1]));
    return p;
  }
  function statusLine() {
    var p = h("p", { class: "lpx-s" }), sg = signed();
    p.appendChild(D.createTextNode(err ? t("lp_sync_err") : sg ? t("lp_synced") : t("lp_local")));
    p.appendChild(D.createTextNode(" · "));
    if (K === "p") { p.appendChild(link(t("lp_reset"), "reset")); p.appendChild(D.createTextNode(" · ")); }
    p.appendChild(link(t("lp_off"), "off"));
    return p;
  }
  function fit(s, n) { s = String(s || ""); return s.length > n ? s.slice(0, n - 1) + "…" : s; }
  function latest(list, k) {   // juengste begonnene, ungelesene Lesestelle unter den Eintraegen der Liste
    var best = null, m = pth()[k];
    list.forEach(function (x) { var e = m[x[0]]; if (e && !e.r && (e.a || e.pc != null) && (!best || (e.t || 0) > (best.e.t || 0))) best = { x: x, e: e }; });
    return best;
  }
  function drawGuide() {
    var e = pth()[K][ID] || { r: 0 }, m = h("p", { class: "lpx-m" });
    if (e.r) { m.appendChild(h("b", { text: t("lp_read") })); m.appendChild(D.createTextNode(" · ")); m.appendChild(link(t("lp_unread"), "unread")); }
    else if ((e.a || e.pc != null) && e.l === LANG && !location.hash && !persisted) m.appendChild(h("button", { type: "button", class: "btn", "data-lpx-a": "resume", text: t("lp_resume", { s: fit(e.h || e.pc + " %", 60) }) }));
    else if (e.a || e.pc != null) { m.appendChild(h("b", { text: t("lp_started") })); m.appendChild(D.createTextNode(" · " + t("lp_auto"))); }
    else m.appendChild(D.createTextNode(t("lp_auto")));
    slot.replaceChildren(m, statusLine());
    if (done) {
      if (e.r) { done.replaceChildren(h("b", { text: t("lp_read") }), D.createTextNode(" · "), link(t("lp_unread"), "unread")); }
      else if (done.innerHTML !== doneHTML) done.innerHTML = doneHTML;
    }
  }
  function drawPath() {
    var p = pth(), G = C.g || [], CC = C.c || [], dg = G.filter(function (x) { return p.g[x[0]] && p.g[x[0]].r; }).length, dc = CC.filter(function (x) { return p.c[x[0]] && p.c[x[0]].r; }).length;
    var bar = h("progress", { class: "lpx-bar", max: String(Math.max(1, G.length)), value: String(dg) });
    var m = h("p", { class: "lpx-m" }, [h("b", { text: t("lp_prog", { d: dg, n: G.length }) }), CC.length ? " · " + t("lp_prog_dd", { d: dc, n: CC.length }) : ""]);
    var lg = latest(G, "g"), lc = latest(CC, "c"), cur = lg && lc ? ((lc.e.t || 0) > (lg.e.t || 0) ? lc : lg) : (lg || lc), go = null;
    if (cur) {
      var same = cur.e.l === LANG && cur.e.a;
      go = h("a", { class: "btn main", href: cur.x[2] + (same ? "#" + encodeURIComponent(cur.e.a) : ""), text: same && cur.e.h ? t("lp_cont_at", { t: fit(cur.x[1], 50), s: fit(cur.e.h, 40) }) : t("lp_cont", { t: fit(cur.x[1], 70) }) });
    } else {
      var nx = G.filter(function (x) { return !(p.g[x[0]] && p.g[x[0]].r); })[0];
      if (nx && dg) go = h("a", { class: "btn main", href: nx[2], text: t("lp_cont", { t: fit(nx[1], 70) }) });
    }
    slot.replaceChildren.apply(slot, [bar, m, statusLine()].concat(go ? [h("p", {}, [go])] : [], (sess && sess.s === 401) || !S.u ? [loginLine()].filter(Boolean) : []));
    if (qopen) {
      var open = G.filter(function (x) { return !(p.g[x[0]] && p.g[x[0]].r); });
      if (!open.length && G.length) qopen.replaceChildren(h("b", { text: t("lp_ready") }));
      else {
        var parts = t("lp_open_q").split("{l}"), kids = [D.createTextNode(parts[0])];
        open.slice(0, 3).forEach(function (x, i) { if (i) kids.push(D.createTextNode(", ")); kids.push(h("a", { href: x[2], text: x[1] })); });
        if (open.length > 3) kids.push(D.createTextNode(" " + t("lp_more", { n: open.length - 3 })));
        if (parts[1]) kids.push(D.createTextNode(parts[1]));
        qopen.replaceChildren.apply(qopen, kids);
      }
    }
  }
  function marks() {   // ✓ an Karten, Vertiefungen und Videos (Pfad- und Leitfadenseite)
    var p = S ? pth() : emptyPath();
    D.querySelectorAll(".pl-card[data-pid]").forEach(function (c) {
      var n = c.querySelector(".pl-step-n"), on = !!(p.g[c.getAttribute("data-pid")] && p.g[c.getAttribute("data-pid")].r);
      if (n) { n.classList.toggle("ok", on); if (on) n.setAttribute("title", t("lp_read")); else n.removeAttribute("title"); }
    });
    D.querySelectorAll("a[data-cid]").forEach(function (a) { a.classList.toggle("ok", !!(p.c[a.getAttribute("data-cid")] && p.c[a.getAttribute("data-cid")].r)); });
    D.querySelectorAll("a[data-vid]").forEach(function (a) {
      var on = !!p.v[a.getAttribute("data-vid")], th = a.querySelector(".pl-vth"), b = th && th.querySelector(".pl-vok");
      a.classList.toggle("ok", on);
      if (th && on && !b) th.appendChild(h("span", { class: "pl-vok", text: t("lp_opened") }));
      else if (b && !on) b.remove();
    });
  }
  function draw() {
    var html = D.documentElement;
    if (!S) {
      html.classList.remove("lpx-on");
      if (saveBtn) saveBtn.disabled = false;
      if (slot) slot.replaceChildren();
      if (qopen) qopen.replaceChildren();
      if (done && done.innerHTML !== doneHTML) done.innerHTML = doneHTML;
      marks();
      return;
    }
    html.classList.add("lpx-on");
    if (!slot) return;
    if (RO) { slot.replaceChildren(h("p", { class: "lpx-s", text: t("lp_auto") })); return; }
    if (K === "p") drawPath(); else drawGuide();
    marks();
  }

  // ---------- Bedienung ----------
  function optIn() {
    if (S) return;
    S = { v: 1, on: 1, u: 0, ep: 0, sy: 0, p: {} };
    pth();
    if (readyRead && K !== "p" && ID) { entry(K, ID).r = 1; enq({ s: [K, ID] }); }   // schon erfuellt: sofort uebernehmen
    if (!save()) { S = null; return; }
    render(); first(); plan();
  }
  function stop(reset) {
    var acc = !!(S && S.u && !off);
    var q = reset ? t(acc ? "lp_reset_q_acc" : "lp_reset_q") : t("lp_off_q", { a: acc ? " " + t("lp_off_acc") : "" });
    if (W.confirm && !W.confirm(q)) return;
    if (acc) api("DELETE").then(function (r) { if (S && r.s === 200 && r.j) { S.ep = int(r.j.ep); S.sy = int(r.j.updated); save(); } });
    noAuto = true; clearTimeout(timer);
    if (reset) { S.p[P] = emptyPath(); save(); }
    else { S = null; try { W.localStorage.removeItem(KEY); } catch (e) { /* ignore */ } dropSess(); sess = null; }
    lastPos = ""; render();
  }
  function onClick(ev) {
    var el = ev.target && ev.target.closest ? ev.target : null;
    if (!el) return;
    if (ev.type === "auxclick" && ev.button !== 1) return;
    if (ev.type === "click" && el.closest("#lpx-save")) { optIn(); return; }
    var a = el.closest("[data-lpx-a]");
    if (a && ev.type === "click") {
      var k = a.getAttribute("data-lpx-a");
      if (k === "unread") markUnread();
      else if (k === "off") stop(false);
      else if (k === "reset") stop(true);
      else if (k === "resume") resume();
      return;
    }
    if (el.closest("[data-lpx-login]")) { dropSess(); return; }   // nach der Rueckkehr sofort neu abgleichen
    var v = el.closest("a[data-vid]");
    if (v && S && !RO && v.closest(".pl-vids,.pl-vline")) {
      var id = v.getAttribute("data-vid");
      if (!VID_RX.test(id) || pth().v[id]) return;
      pth().v[id] = 1; enq({ v: id }); save(); marks();
      flush(true);   // Seite wird verlassen; die Zielseite laedt dieses Skript nicht
    }
  }
  function resume() {
    var e = pth()[K][ID];
    if (!e) return;
    var el = e.a ? D.getElementById(e.a) : null;
    if (el && el.scrollIntoView) el.scrollIntoView({ block: "start" });
    else if (e.pc != null) { var se = D.scrollingElement || D.documentElement; W.scrollTo(0, Math.round(e.pc / 100 * Math.max(0, se.scrollHeight - (W.innerHeight || 0)))); }
  }
  function onVis() {
    if (D.visibilityState === "hidden") {
      if (since >= 0) { act += now() - since; since = -1; }
      clearTimeout(timer); timer = 0;
      endCheck();
      if (endSeen && active() >= minSec * 1000 && !noAuto) markRead();
      keepPos();
      if (deb) flush(true);   // entprellte Statusaenderung noch nicht gesendet
    } else if (since < 0) { since = now(); plan(); }
  }
  var persisted = false;
  W.addEventListener("pageshow", function (ev) { if (ev.persisted) { persisted = true; render(); } });
  W.addEventListener("pagehide", function () { if (since >= 0) { act += now() - since; since = -1; } endCheck(); keepPos(); if (deb) flush(true); });
  D.addEventListener("visibilitychange", onVis);
  D.addEventListener("click", onClick);
  D.addEventListener("auxclick", onClick);
  W.addEventListener("storage", function (ev) {   // anderer Tab hat geaendert
    if (ev.key !== KEY) return;
    var s = load();
    if (s === "x") return;
    if (s === false) { RO = true; S = S || { v: 1, on: 1, u: 0, ep: 0, sy: 0, p: {} }; }
    else { RO = false; S = s; }
    render();
  });

  // ---------- Start ----------
  if (endEl && W.IntersectionObserver) {   // nur das Artikelende (1 Element) wird beobachtet
    try {
      var io = new W.IntersectionObserver(function (es) {
        es.forEach(function (x) { if (x.isIntersecting) { endSeen = true; io.disconnect(); plan(); } });
      }, { threshold: 0 });
      io.observe(endEl);
    } catch (e) { /* ignore */ }
  }
  var s0 = load();
  if (s0 === "x") return;   // kein localStorage: statische Anzeige bleibt (Knopf deaktiviert), nichts wird gesendet
  if (s0 === false) { RO = true; S = { v: 1, on: 1, u: 0, ep: 0, sy: 0, p: {} }; }
  else S = s0;
  if (S && !RO && art && K !== "p") { var e0 = pth()[K][ID]; if (e0 && e0.r) noAuto = true; }   // schon gelesen: Automatik ruht
  render();
  if (S && !RO) first();
})();
