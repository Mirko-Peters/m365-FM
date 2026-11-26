// Lernfortschritt im Lernpfad (site_pillars.py: Kasten #lpx, Konfiguration #lpx-data, Marker data-lpx; Worker worker/src/learnprogress.js).
// Vor dem Klick auf "Lernfortschritt speichern" wird nichts gespeichert und nichts gesendet (§ 25 TDDDG); gelesen wird nur der eigene Schluessel m365-learn
// (ob der Opt-in schon besteht). Danach: localStorage m365-learn {v:1,on:1,u,ep,sy,dl,p:{<pfad>:{g,c,v,q}}}, sessionStorage m365-learn-s (Abgleich in diesem Tab),
// fuer Angemeldete Abgleich mit dem Konto (GET hoechstens 1 je Tab-Sitzung bzw. 15 min, auch nach einem Fehlschlag, POST nur bei Aenderung, Lesestelle gedrosselt, Videoklick sofort mit keepalive).
// Jeder POST/DELETE nennt das Konto (u), fuer das gesammelt wurde; der Server lehnt ein anderes angemeldetes Konto mit 409 uid ab (gemeinsames Geraet).
// Loeschen im Konto (Zuruecksetzen, Nicht mehr speichern) bleibt als dl {<pfad>: konto} vorgemerkt, bis der Server es bestaetigt; nach "Nicht mehr speichern"
// bleibt dafuer nur der Rest {v:1,on:0,dl} (keine Fortschrittsdaten), gesendet wird dann nur das DELETE und nur bei Anmeldehinweis.
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
  var MAXQ = 200, DEBOUNCE = 2000, POS_GAP = 300000, SESS_TTL = 900000, MAXB = 15000;   // Body-Grenze des Servers 16384 Bytes (Rest geht mit dem naechsten POST)
  var art = D.querySelector("article.pl-art[data-lpx]"), endEl = art && art.querySelector(".pl-end"), done = D.querySelector(".pl-done");
  var doneHTML = done ? done.innerHTML : "", saveBtn = D.getElementById("lpx-save"), slot = box.querySelector(".lpx-b"), qopen = D.querySelector(".pl-qopen");
  var S = null, RO = false, RES = null;   // Stand (nur nach dem Opt-in); RO: unbekannte Formatversion -> nur anzeigen, nie schreiben; RES: Rest nach "Nicht mehr speichern"
  var sess = null, off = false, busy = 0, rid = 0, cur = null, again = false, deb = 0, err = false, gen = 0, resBusy = false;   // gen: Antworten aus der Zeit vor Zuruecksetzen/Abschalten/anderem Tab gelten nicht
  // busy: Nummer der laufenden Anfrage (0: keine); nur deren Antwort gibt busy frei. cur: ihr Promise (Abschalten wartet darauf)
  // "gelesen": im Speicher, auch vor dem Opt-in (ohne Speicherzugriff)
  var minSec = Math.min(180, Math.max(20, Math.round((+C.min || 1) * 60 * 0.3)));
  var act = 0, since = D.visibilityState === "visible" ? now() : -1, endSeen = false, readyRead = false, noAuto = false, manual = false, timer = 0, lastPos = "";   // manual: in diesem Aufruf "Als ungelesen markieren" benutzt

  function now() { return W.performance && performance.now ? performance.now() : Date.now(); }
  function int(x) { x = Math.floor(+x); return isFinite(x) && x > 0 ? x : 0; }
  function cut(s, n) { return Array.from(String(s)).slice(0, n).join(""); }   // nach Codepunkten (kein halbes Emoji)
  function blen(s) { try { return encodeURIComponent(s).replace(/%[0-9A-F]{2}/g, "x").length; } catch (e) { return s.length * 3; } }   // UTF-8-Bytes
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
    if (typeof e.h === "string" && e.h) o.h = cut(e.h.replace(/[<>]/g, ""), 80);
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
  function cleanDl(x) {   // vorgemerktes Loeschen im Konto {<pfad>: konto}
    var r = {};
    if (x && typeof x === "object") Object.keys(x).filter(function (k) { return ID_RX.test(k) && int(x[k]); }).slice(0, 20).forEach(function (k) { r[k] = int(x[k]); });
    return r;
  }
  function load() {   // -> Stand, null (kein Opt-in, kaputt; Rest nach "Nicht mehr speichern" in RES), false (unbekannte Version) oder "x" (kein localStorage)
    var raw, o;
    RES = null;
    try { raw = W.localStorage.getItem(KEY); } catch (e) { return "x"; }
    if (!raw) return null;
    try { o = JSON.parse(raw); } catch (e) { return null; }
    if (o && typeof o === "object" && o.on === 0 && o.v === 1) { var d = cleanDl(o.dl); if (Object.keys(d).length) RES = { v: 1, on: 0, dl: d, lg: o.lg ? 1 : 0 }; return null; }
    if (!o || typeof o !== "object" || o.on !== 1) return null;
    if (o.v !== 1) return false;
    var s = { v: 1, on: 1, u: int(o.u), ep: int(o.ep), sy: int(o.sy), dl: cleanDl(o.dl), p: {} };
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
  function hint() { try { return W.localStorage.getItem(AUTH) === "1"; } catch (e) { return false; } }   // community.js setzt ihn beim An-, entfernt ihn beim Abmelden
  function saveRes() { try { if (RES && Object.keys(RES.dl).length) W.localStorage.setItem(KEY, JSON.stringify(RES)); else { RES = null; W.localStorage.removeItem(KEY); } } catch (e) { /* ignore */ } }

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
  function bodyOf(q, init) {   // -> [Body, gesendete Eintraege] mit den Grenzen des Servers (set/unset 120, vid 100, pos 60, MAXB Bytes); u: Konto, fuer das gesammelt wurde
    var b = { path: P, ep: S.ep, init: init ? 1 : 0, set: [], unset: [], vid: [], pos: [] }, sent = [], n = Date.now();
    if (S.u && !init) b.u = S.u;
    var used = blen(JSON.stringify(b));
    q.forEach(function (e) {
      var k = e.s ? "set" : e.x ? "unset" : e.v ? "vid" : "pos", it = e.s || e.x || e.v || posOf(e.p, n), z = blen(JSON.stringify(it)) + 1;
      if (b[k].length >= { set: 120, unset: 120, vid: 100, pos: 60 }[k] || used + z > MAXB) return;
      used += z; b[k].push(it); sent.push(e);
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
  function api(method, b, keep, u) {
    var o = { method: method, credentials: "include", headers: {} };
    if (method !== "GET") o.headers["x-requested-with"] = "m365";
    if (b) { o.headers["content-type"] = "application/json"; o.body = JSON.stringify(b); }
    if (keep) o.keepalive = true;
    var url = C.api + "/api/learn/progress" + (method === "POST" ? "" : "?path=" + encodeURIComponent(P) + (u ? "&u=" + u : ""));
    try {
      return W.fetch(url, o).then(function (r) {
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
  function noteSess(r) {   // Ergebnis der Anmeldepruefung fuer diesen Tab (pt: letzte gesendete Lesestelle, Drossel 5 min); nach "Nicht mehr speichern" nichts mehr
    if (!S) return;
    if (r.s !== 200 && r.s !== 409 && r.s !== 401 && r.s !== 404) {   // 429, 5xx, Netz: auch der Fehlschlag sperrt neue Pruefungen fuer 15 min (h: Anmeldehinweis dabei)
      if (!(sess && sess.s === 200)) { sess = { t: Date.now(), s: 0, e: 1, h: hint() ? 1 : 0, uid: 0, pt: (sess && sess.pt) || 0 }; writeSess(sess); }
      return;
    }
    if (r.s === 409 && !int(r.j.uid)) return;
    sess = { t: Date.now(), s: r.s === 409 ? 200 : r.s, uid: r.s === 200 || r.s === 409 ? int(r.j.uid) : 0, pt: (sess && sess.pt) || 0 };
    writeSess(sess);
  }
  function fresh(ss) {   // gemerkte Pruefung noch gueltig? Nicht nach 15 min und nicht, wenn der Anmeldehinweis (community.js) inzwischen etwas anderes sagt
    if (!ss || !(Date.now() - int(ss.t) < SESS_TTL)) return false;
    if (ss.e) return !ss.s && !ss.h === !hint();   // Fehlschlag: Ruhe, ausser der Anmeldehinweis hat sich seither geaendert
    if (ss.s !== 200 && ss.s !== 401 && ss.s !== 404) return false;
    if (ss.s === 401 && hint()) return false;   // inzwischen anderswo angemeldet
    if (ss.s === 200 && !hint()) return false;  // inzwischen abgemeldet
    return true;
  }
  function pend() { return S && S.dl && S.dl[P] ? S.dl[P] : 0; }   // vorgemerktes Loeschen im Konto fuer diesen Pfad (Konto-ID)
  function begin() { busy = ++rid; return busy; }
  function track(p) { cur = p; return p; }
  function idle(id) { if (id !== busy) return; busy = 0; if (again) { again = false; flush(); } }   // veraltete Antwort einer abgeloesten Anfrage gibt nichts frei
  function signed() { return !!(sess && sess.s === 200 && sess.uid && S && S.u === sess.uid); }
  function replace(j) { S.u = int(j.uid); S.p = {}; adopt(j, false); }   // anderes Konto auf diesem Geraet: ersetzen, nie zusammenfuehren
  function handle(r, sent, id) {
    if (!S) { idle(id); return; }
    noteSess(r);
    if (r.s === 404) { off = true; err = false; }
    else if (r.s === 401) { authHint(false); err = false; }
    else if ((r.s === 200 || r.s === 409) && okState(r.j)) {
      authHint(true); err = false;
      var uid = int(r.j.uid);
      if (S.u && S.u !== uid) replace(r.j);   // auch 409 uid: der Server hat nichts uebernommen
      else if (r.j.error === "uid") { /* DELETE fuer ein vorgemerktes anderes Konto: dieser Stand bleibt */ }
      else if (r.s === 409) { S.u = uid; adopt(r.j, false); }   // Zuruecksetzen auf einem anderen Geraet verpasst: Serverstand gilt
      else {
        var ks = sent.map(function (e) { return JSON.stringify(e); });
        pth().q = pth().q.filter(function (e) { return ks.indexOf(JSON.stringify(e)) < 0; });
        S.u = uid; adopt(r.j, true);
        if (pth().q.length && sent.length) again = true;   // Rest ueber der Byte- oder Listengrenze
      }
      save();
    } else if (r.s === 413) {   // sollte mit MAXB nicht vorkommen: gesendete Lesestellen verwerfen (Status bleibt), dann neu
      var kp = sent.filter(function (e) { return e.p; }).map(function (e) { return JSON.stringify(e); });
      if (kp.length) { pth().q = pth().q.filter(function (e) { return kp.indexOf(JSON.stringify(e)) < 0; }); save(); again = true; } else err = true;
    } else err = true;   // 429, 5xx, Netz: Warteschlange bleibt, naechster Anlass holt nach
    render(); idle(id);
  }
  function flush(keep) {
    clearTimeout(deb); deb = 0;
    if (!S || RO || off || !sess || sess.s !== 200 || !sess.uid) return;
    if (busy) { again = true; return; }
    if (pend() === sess.uid) { delAcc(keep); return; }   // vorgemerktes Loeschen vor allem anderen
    if (!signed() || !pth().q.length) return;
    var x = bodyOf(pth().q, false), g0 = gen, id = begin();
    track(api("POST", x[0], keep)).then(function (r) { if (g0 !== gen) { noteSess(r); idle(id); return; } handle(r, x[1], id); });
  }
  function delAcc(keep) {   // vorgemerktes Loeschen im Konto senden (zugleich Anmeldepruefung); erst die Bestaetigung des Servers loescht die Vormerkung
    var u = pend();
    if (!S || RO || !u) return;
    if (busy) { again = true; return; }
    var g0 = gen, id = begin();
    track(api("DELETE", null, keep, u)).then(function (r) {
      if (!S || g0 !== gen) { idle(id); return; }
      noteSess(r);
      if (r.s === 200 && okState(r.j) && int(r.j.uid) === u) {
        delete S.dl[P]; err = false; authHint(true);
        if (!S.u) { S.ep = int(r.j.ep); save(); busy = 0; get(); return; }   // Gaststand nach erneutem Opt-in: jetzt wie ueblich vereinigen
        if (S.u !== u) replace(r.j);   // lokal lag der Stand eines anderen Kontos: das angemeldete (geloeschte) gilt
        else adopt(r.j, true);   // leerer Stand mit neuer Epoche, danach das seit dem Zuruecksetzen Gesammelte
        save();
        if (pth().q.length) again = true;
      } else if (r.s === 409 && okState(r.j)) {   // anderes Konto angemeldet: Vormerkung bleibt fuer das alte Konto
        authHint(true); err = false;
        if (!S.u) { save(); busy = 0; get(); return; }
        handle(r, [], id); return;
      } else if (r.s === 404) off = true;
      else if (r.s === 401) authHint(false);
      else err = true;
      render(); idle(id);
    });
  }
  function delRes() {   // nach "Nicht mehr speichern": nur das vorgemerkte DELETE, kein Stand, keine Tab-Pruefung
    var u = RES && RES.dl[P];
    if (!u || resBusy || S) return;
    resBusy = true;
    api("DELETE", null, false, u).then(function (r) {
      resBusy = false;
      if (S || !RES) return;   // inzwischen wieder eingeschaltet: die Vormerkung steckt in S.dl
      if (r.s === 200 && int(r.j.uid) === u) { authHint(true); delete RES.dl[P]; }
      else if (r.s === 401) { authHint(false); RES.lg = 0; }
      else if (r.s === 409) authHint(true);
      saveRes(); render();
    });
  }
  function side(v) {   // Videoklick waehrend einer laufenden Anfrage: eigener keepalive-POST nur mit diesem Video (der Server vereinigt; der Eintrag bleibt in der
    // Warteschlange und geht mit dem naechsten Abgleich noch einmal mit). Nur fuer das angemeldete Konto, nicht vor einem vorgemerkten Loeschen
    if (!S || RO || off || !sess || sess.s !== 200 || !sess.uid || pend() || (S.u && S.u !== sess.uid)) return;
    api("POST", { path: P, ep: S.ep, init: 0, u: sess.uid, set: [], unset: [], vid: [v], pos: [] }, true);
  }
  function soon() { if (!S || off) return; clearTimeout(deb); deb = setTimeout(flush, DEBOUNCE); }
  function first() {   // erste Anfrage dieser Tab-Sitzung (zugleich Anmeldepruefung, fuer Gaeste 0 D1)
    if (!S || RO) return;
    var ss = readSess();
    if (fresh(ss)) {
      sess = ss; if (ss.s === 404) { off = true; return; }
      if (ss.e) { err = true; render(); return; }   // Fehlschlag vor weniger als 15 min: keine neue Pruefung
      if (ss.s === 200 && S.u === ss.uid) flush();
      else if (ss.s === 200) { if (pend() === ss.uid) delAcc(); else get(); }   // anderes Konto oder Gaststand: erst abgleichen
      return;
    }
    if (ss && int(ss.pt)) sess = { t: 0, s: 0, uid: 0, pt: int(ss.pt) };   // Drossel der Lesestelle bleibt
    if (pend()) delAcc(); else get();
  }
  function get() {
    if (!S || RO || busy) return;
    var g0 = gen, id = begin();
    track(api("GET")).then(function (r) {
      if (!S || g0 !== gen) { idle(id); return; }
      var uid = r.s === 200 && okState(r.j) ? int(r.j.uid) : 0;
      if (uid && pend() === uid) { noteSess(r); busy = 0; delAcc(); return; }   // erst loeschen, dann nichts Altes uebernehmen
      if (uid && !S.u) { init(r, id); return; }
      if (uid && S.u === uid && pth().q.length) { noteSess(r); busy = 0; authHint(true); flush(); return; }   // eigenes Konto mit Ausstehendem: senden (Server vereinigt)
      handle(r, [], id);
    });
  }
  function init(r, id) {   // Gaststand + Konto: vereinigen (init:1), danach gehoert der Stand diesem Konto
    noteSess(r); authHint(true);
    var uid = int(r.j.uid), q = fullQueue(), q0 = pth().q.map(function (e) { return JSON.stringify(e); }), g0 = gen;
    if (!q.length) { S.u = uid; adopt(r.j, false); save(); render(); idle(id); return; }
    S.ep = int(r.j.ep);
    var x = bodyOf(q, true);
    track(api("POST", x[0])).then(function (r2) {
      if (!S || g0 !== gen) { idle(id); return; }
      noteSess(r2);
      if ((r2.s === 200 || r2.s === 409) && okState(r2.j) && int(r2.j.uid) === uid) {
        // was vor dem Senden in der Warteschlange stand, deckt der volle Stand ab; was waehrenddessen dazukam, bleibt und wird nachgesendet,
        // ebenso Eintraege des vollen Stands ueber der Byte-Grenze
        pth().q = pth().q.filter(function (e) { return q0.indexOf(JSON.stringify(e)) < 0; });
        var ks = x[1].map(function (e) { return JSON.stringify(e); });
        q.forEach(function (e) { if (ks.indexOf(JSON.stringify(e)) < 0) enq(e); });
        S.u = uid; adopt(r2.j, true); authHint(true); err = false; save();
        if (pth().q.length) again = true;
      } else if (okState(r2.j)) { authHint(true); replace(r2.j); save(); }   // inzwischen ein anderes Konto: nichts uebernehmen
      else { err = r2.s !== 401 && r2.s !== 404; if (r2.s === 401) authHint(false); }
      if (r2.s === 404) off = true;
      render(); idle(id);
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
    noAuto = true; manual = true; readyRead = false; clearTimeout(timer);
    entry(K, ID).r = 0; enq({ x: [K, ID] }); save(); render(); soon();
  }

  // ---------- Lesestelle ----------
  function heading() {   // letzte Ueberschrift im oberen Sechstel (beim Verlassen einmal gemessen, kein Scroll-Listener). Nach "Weiterlesen" oder einer
    // Sprungmarke steht die Ueberschrift wegen scroll-margin-top (5em) knapp unter der Oberkante und zaehlt so noch als aktueller Abschnitt
    if (!art) return null;
    var hs = art.querySelectorAll("h2[id],h3[id]"), last = null, lim = Math.max(96, (W.innerHeight || 0) / 6);
    for (var i = 0; i < hs.length; i++) {
      if (SKIP[hs[i].id]) continue;
      if (hs[i].getBoundingClientRect().top < lim) last = hs[i]; else break;
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
    var a = A_RX.test(el.id) ? el.id : "", ti = cut((el.textContent || "").replace(/\s+/g, " ").replace(/[<>]/g, "").trim(), 80), sig = a + "|" + pc;
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
  function loginLine(force) {
    if ((!force && signed()) || off || !C.login || !C.login.length) return null;
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
  function waitDel() { var u = pend(); return !!u && !(sess && sess.s === 200 && sess.uid === u && !err); }   // Loeschen im Konto steht noch aus (nicht angemeldet/Fehler)
  function statusLine() {
    var p = h("p", { class: "lpx-s" }), sg = signed();
    p.appendChild(D.createTextNode(waitDel() ? t("lp_del_pend") : err ? t("lp_sync_err") : sg ? t("lp_synced") : t("lp_local")));
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
    slot.replaceChildren.apply(slot, [m, statusLine()].concat(waitDel() ? [loginLine(true)].filter(Boolean) : []));
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
      var same = cur.e.l === (cur.x[3] || LANG) && cur.e.a;   // x[3]: Sprache der Karte (englischer Ersatz-Leitfaden auf uebersetzten Pfadseiten)
      go = h("a", { class: "btn main", href: cur.x[2] + (same ? "#" + encodeURIComponent(cur.e.a) : ""), text: same && cur.e.h ? t("lp_cont_at", { t: fit(cur.x[1], 36), s: fit(cur.e.h, 30) }) : t("lp_cont", { t: fit(cur.x[1], 60) }) });
    } else {
      var nx = G.filter(function (x) { return !(p.g[x[0]] && p.g[x[0]].r); })[0];
      if (nx && dg) go = h("a", { class: "btn main", href: nx[2], text: t("lp_cont", { t: fit(nx[1], 60) }) });
    }
    slot.replaceChildren.apply(slot, [bar, m, statusLine()].concat(go ? [h("p", {}, [go])] : [], (sess && sess.s === 401) || !S.u || waitDel() ? [loginLine(waitDel())].filter(Boolean) : []));
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
      var n = c.querySelector(".pl-step-n") || c.querySelector("a"), on = !!(p.g[c.getAttribute("data-pid")] && p.g[c.getAttribute("data-pid")].r);   // ohne Nummer (englischer Ersatz): ✓ am Titel-Link
      if (n) { n.classList.toggle(n.tagName === "A" ? "lpx-ok" : "ok", on); if (on) n.setAttribute("title", t("lp_read")); else n.removeAttribute("title"); }
    });
    D.querySelectorAll("a[data-cid]").forEach(function (a) { a.classList.toggle("ok", !!(p.c[a.getAttribute("data-cid")] && p.c[a.getAttribute("data-cid")].r)); });
    D.querySelectorAll("a[data-vid]").forEach(function (a) {
      var on = !!p.v[a.getAttribute("data-vid")], th = a.querySelector(".pl-vth"), b = th && th.querySelector(".pl-vok");
      a.classList.toggle("ok", on);
      if (th && on && !b) th.appendChild(h("span", box.getAttribute("lang") === "en" ? { class: "pl-vok", lang: "en", text: t("lp_opened") } : { class: "pl-vok", text: t("lp_opened") }));   // englischer Ersatztext
      else if (b && !on) b.remove();
    });
  }
  var resEl = null;
  function draw() {
    var html = D.documentElement;
    if (slot && !slot.getAttribute("aria-live")) slot.setAttribute("aria-live", "polite");   // erst nach dem ersten Bild: keine Ansage beim Laden
    if (!S) {
      html.classList.remove("lpx-on");
      if (saveBtn) saveBtn.disabled = false;
      if (slot) slot.replaceChildren();
      var oa = box.querySelector(".lpx-a");   // nach "Nicht mehr speichern": Loeschen im Konto steht noch aus
      if (resEl) { resEl.remove(); resEl = null; }
      if (oa && RES && RES.dl[P]) { resEl = h("div", { class: "lpx-dl" }, [h("p", { class: "lpx-s", text: t("lp_del_pend") }), loginLine(true)]); oa.appendChild(resEl); }
      if (qopen) qopen.replaceChildren();
      if (done && done.innerHTML !== doneHTML) done.innerHTML = doneHTML;
      marks();
      return;
    }
    html.classList.add("lpx-on");
    if (!slot) return;
    if (RO) { slot.replaceChildren(h("p", { class: "lpx-s" }, [t("lp_auto") + " · ", link(t("lp_off"), "off")])); return; }   // neuere Formatversion: nur Abschalten
    if (K === "p") drawPath(); else drawGuide();
    marks();
  }

  // ---------- Bedienung ----------
  function started() {   // Stand ist neu da (Opt-in hier oder in einem anderen Tab): Automatik nur aus, wenn in diesem Aufruf ungelesen markiert oder schon gelesen
    noAuto = manual;
    if (K === "p" || !ID) return false;
    var e = pth()[K][ID];
    if (e && e.r) { noAuto = true; return false; }
    if (readyRead && !manual) { entry(K, ID).r = 1; enq({ s: [K, ID] }); return true; }   // schon erfuellt: sofort uebernehmen
    return false;
  }
  function optIn() {
    if (S) return;
    S = { v: 1, on: 1, u: 0, ep: 0, sy: 0, dl: RES ? RES.dl : {}, p: {} };   // noch ausstehendes Loeschen im Konto bleibt vorgemerkt
    pth(); started();
    if (!save()) { S = null; return; }
    RES = null;
    render(); first(); plan();
  }
  function stop(reset) {   // Zuruecksetzen (Pfad) oder Nicht mehr speichern (alles). Im Konto: als dl vorgemerkt, bis der Server das DELETE bestaetigt
    if (RO) {   // unbekannte Formatversion: nur lokal entfernen (kein Konto bekannt)
      if (W.confirm && !W.confirm(t("lp_off_q", { a: "" }))) return;
      try { W.localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
      S = null; RO = false; gen++; render(); return;
    }
    var u = S.u || (sess && sess.s === 200 && sess.uid) || 0, acc = !!(u || pend());   // u: auch waehrend des ersten Abgleichs (init), solange S.u noch 0 ist
    var q = reset ? t(acc ? "lp_reset_q_acc" : "lp_reset_q") : t("lp_off_q", { a: acc ? " " + t("lp_off_acc") : "" });
    if (W.confirm && !W.confirm(q)) return;
    noAuto = true; clearTimeout(timer); clearTimeout(deb); deb = 0; gen++; err = false;   // laufende Antworten gelten nicht mehr
    lastPos = "";
    if (reset) {
      S.p[P] = emptyPath();
      if (u) S.dl[P] = u;
      save(); render(); flush();   // angemeldet: DELETE sofort (nach einer laufenden Anfrage), sonst beim naechsten Abgleich
      return;
    }
    var dl = {};
    Object.keys(S.dl || {}).forEach(function (k) { dl[k] = S.dl[k]; });
    if (S.u) Object.keys(S.p).concat([P]).forEach(function (k) { dl[k] = S.u; });
    else if (u) dl[P] = u;   // Gaststand mitten im ersten Abgleich: nur dieser Pfad ging ans Konto
    var w = busy ? cur : null;   // laufende Anfrage (z. B. init-POST): das DELETE erst nach ihrer Antwort, sonst koennte der Server sie danach noch schreiben
    S = null; sess = null; busy = 0; again = false; dropSess();
    RES = { v: 1, on: 0, dl: dl, lg: 0 };   // nur die Vormerkung bleibt (keine Fortschrittsdaten); ohne Konto wird der Schluessel entfernt
    saveRes(); render();
    if (RES) { if (w) w.then(function () { delRes(); }); else delRes(); }
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
    if (el.closest("[data-lpx-login]")) { dropSess(); if (RES && !S) { RES.lg = 1; saveRes(); } return; }   // nach der Rueckkehr sofort neu abgleichen bzw. loeschen
    var v = el.closest("a[data-vid]");
    if (v && S && !RO && v.closest(".pl-vids,.pl-vline")) {
      var id = v.getAttribute("data-vid");
      if (!VID_RX.test(id) || pth().v[id]) return;
      pth().v[id] = 1; enq({ v: id }); save(); marks();
      if (busy) side(id);   // laufende Anfrage: flush merkt nur vor, und der Nachversand ginge mit dem Verlassen der Seite verloren
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
    var was = !!S && !RO;
    gen++;   // Antworten auf Anfragen zum alten Stand gelten nicht mehr (busy und again bleiben: die laufende Anfrage gibt busy mit ihrer Antwort frei)
    if (s === false) { RO = true; S = S || { v: 1, on: 1, u: 0, ep: 0, sy: 0, dl: {}, p: {} }; }
    else { RO = false; S = s; }
    render();
    if (!was && S && !RO) { if (started()) save(); first(); plan(); }   // Opt-in in einem anderen Tab: hier ebenso abgleichen (vorgemerktes Loeschen zuerst)
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
  if (s0 === false) { RO = true; S = { v: 1, on: 1, u: 0, ep: 0, sy: 0, dl: {}, p: {} }; }
  else S = s0;
  if (S && !RO && art && K !== "p") { var e0 = pth()[K][ID]; if (e0 && e0.r) noAuto = true; }   // schon gelesen: Automatik ruht
  render();
  if (S && !RO) first();
  else if (!S && RES && RES.dl[P] && (RES.lg || hint())) delRes();   // ausstehendes Loeschen nur bei Anmeldehinweis (kein Abgleich, keine Tab-Pruefung)
})();
