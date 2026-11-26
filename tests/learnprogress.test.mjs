// Lernfortschritt (assets/learnprogress.js, site_pillars.py lp_*): Opt-in, automatisch "gelesen", Lesestelle, Videoklick, Konto-Abgleich.
// Lauf: node --test tests/*.test.mjs   (ohne Browser: kleine DOM-Attrappe, falsche Uhr, fetch-Attrappe; das Skript laeuft unveraendert in einem vm-Kontext)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const JS = readFileSync(new URL("../assets/learnprogress.js", import.meta.url), "utf8");
const T = { lp_read: "✓ Read", lp_unread: "Mark as unread", lp_auto: "Counts as read", lp_resume: "Continue at “{s}”", lp_started: "Started", lp_local: "Saved in this browser",
  lp_synced: "Saved in this browser and in your account", lp_sync_err: "Sync unavailable", lp_signin: "Sign in with {p}", lp_reset: "Reset progress", lp_reset_q: "Delete?",
  lp_reset_q_acc: "Delete in account?", lp_off: "Stop saving", lp_off_q: "Stop (in this browser{a})?", lp_off_acc: "and in your account", lp_opened: "✓ opened",
  lp_prog: "{d} of {n} guides read", lp_prog_dd: "{d} of {n} deep dives read", lp_cont: "Continue: {t}", lp_cont_at: "Continue: {t} – {s}", lp_open_q: "Still to read: {l}",
  lp_more: "and {n} more", lp_ready: "All guides read" };

// ---------- DOM-Attrappe ----------
function matches(el, sel) {
  return sel.split(",").some((one) => {
    const s = one.trim(); if (!s) return false;
    const m = s.match(/^([a-z0-9]*)((?:[#.][\w-]+|\[[^\]]+\])*)$/i); if (!m) throw new Error("Selektor " + s);
    if (m[1] && el.tagName !== m[1].toUpperCase()) return false;
    for (const p of m[2].match(/[#.][\w-]+|\[[^\]]+\]/g) || []) {
      if (p[0] === "#") { if (el.attrs.id !== p.slice(1)) return false; }
      else if (p[0] === ".") { if (!el.classList.contains(p.slice(1))) return false; }
      else { const [, a, v] = p.match(/^\[([\w-]+)(?:="?([^"\]]*)"?)?\]$/); if (!(a in el.attrs)) return false; if (v !== undefined && el.attrs[a] !== v) return false; }
    }
    return true;
  });
}
class Text { constructor(s) { this.data = String(s); this.parentNode = null; this.nodeType = 3; } get textContent() { return this.data; } }
class El {
  constructor(tag, attrs = {}, doc = null) {
    this.tagName = tag.toUpperCase(); this.attrs = {}; this.children = []; this.parentNode = null; this.listeners = {}; this._top = 9999; this.nodeType = 1; this.doc = doc;
    const cls = new Set();
    this.classList = { add: (c) => cls.add(c), remove: (c) => cls.delete(c), contains: (c) => cls.has(c), toggle: (c, on) => { if (on === undefined) on = !cls.has(c); if (on) cls.add(c); else cls.delete(c); return on; } };
    this._cls = cls;
    for (const [k, v] of Object.entries(attrs)) this.setAttribute(k, v);
  }
  get id() { return this.attrs.id || ""; }
  getAttribute(n) { return n === "class" ? [...this._cls].join(" ") : (n in this.attrs ? this.attrs[n] : null); }
  setAttribute(n, v) { if (n === "class") { this._cls.clear(); String(v).split(" ").filter(Boolean).forEach((c) => this._cls.add(c)); this.attrs.class = String(v); } else this.attrs[n] = String(v); }
  removeAttribute(n) { delete this.attrs[n]; }
  set disabled(v) { if (v) this.attrs.disabled = ""; else delete this.attrs.disabled; }
  get disabled() { return "disabled" in this.attrs; }
  appendChild(c) { if (c.parentNode) c.parentNode.children.splice(c.parentNode.children.indexOf(c), 1); c.parentNode = this; this.children.push(c); return c; }
  replaceChildren(...kids) { this.children.forEach((c) => (c.parentNode = null)); this.children = []; kids.forEach((k) => k && this.appendChild(k)); }
  remove() { if (this.parentNode) { this.parentNode.children.splice(this.parentNode.children.indexOf(this), 1); this.parentNode = null; } }
  get textContent() { return this.children.map((c) => c.textContent).join(""); }
  set textContent(v) { this.replaceChildren(new Text(v)); }
  get innerHTML() { return this.children.map((c) => (c.nodeType === 3 ? c.data : `<${c.tagName.toLowerCase()}>${c.innerHTML}</${c.tagName.toLowerCase()}>`)).join(""); }
  set innerHTML(v) { this.replaceChildren(); if (this._html && this._html.has(v)) this._html.get(v).forEach((c) => this.appendChild(c)); else if (v) this.appendChild(new Text(v)); }
  *walk() { for (const c of this.children) if (c.nodeType === 1) { yield c; yield* c.walk(); } }
  querySelectorAll(sel) { return [...this.walk()].filter((e) => matches(e, sel)); }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
  closest(sel) { let e = this; while (e && e.nodeType === 1) { if (matches(e, sel)) return e; e = e.parentNode; } return null; }
  addEventListener(t, f) { (this.listeners[t] ||= []).push(f); }
  getBoundingClientRect() { return { top: this._top }; }
  scrollIntoView() { this.doc.scrolled = this; }
}
function el(doc, tag, attrs, kids = []) { const e = new El(tag, attrs, doc); kids.forEach((k) => e.appendChild(typeof k === "string" ? new Text(k) : k)); return e; }

function page(kind = "g", opts = {}) {
  const doc = { scrolled: null };
  const html = el(doc, "html"), body = el(doc, "body");
  html.appendChild(body);
  const cfg = { api: "https://api.test", path: "manufacturing-excellence", lang: opts.lang || "de", k: kind, login: ["linkedin", "microsoft"], t: T, ...(opts.cfg || {}) };
  if (kind !== "p") Object.assign(cfg, { id: "lean-basics", min: opts.min ?? 5, toc: ["inhaltsverzeichnis"] });
  else Object.assign(cfg, { g: [["lean-basics", "Lean", "https://x/de/learn/lean/"], ["oee", "OEE", "https://x/de/learn/oee/"], ["kanban", "Kanban", "https://x/de/learn/kanban/"]],
    c: [["kaizen", "Kaizen", "https://x/de/learn/lean/kaizen/"]] });
  const data = el(doc, "script", { id: "lpx-data", type: "application/json" }); data.appendChild(new Text(JSON.stringify(cfg)));
  const box = el(doc, "div", { class: "pl-lpx", id: "lpx", "data-k": kind }, [el(doc, "div", { class: "lpx-a" }, [el(doc, "button", { id: "lpx-save", disabled: "" })]), el(doc, "div", { class: "lpx-b" })]);
  const r = { doc, html, body, box, cfg };
  if (kind !== "p") {
    const hs = ["inhaltsverzeichnis", "einleitung", "wertströmanalyse-ü", "fazit"].map((id) => el(doc, "h2", { id }, [id === "einleitung" ? "Einleitung" : id === "fazit" ? "Fazit" : id]));
    const end = el(doc, "span", { class: "pl-end" });
    const art = el(doc, "article", { class: "pl-art", "data-lpx": "manufacturing-excellence", "data-k": kind, "data-id": "lean-basics" }, [box, ...hs, end]);
    const done = el(doc, "p", { class: "pl-done" }, ["Zur Übersicht"]);
    const vth = el(doc, "span", { class: "pl-vth" });
    const vids = el(doc, "section", { class: "pl-vids", id: "videos" }, [el(doc, "h2", { id: "videos" }, ["Videos"]), el(doc, "a", { href: "https://x/v/", "data-vid": "ZY12nBEY2qc" }, [vth])]);
    const src = el(doc, "section", { id: "sources" }, [el(doc, "h2", { id: "sources" }, ["Quellen"])]);
    body.appendChild(art); body.appendChild(done); body.appendChild(vids); body.appendChild(src);
    Object.assign(r, { art, hs, end, done, vth, vids });
  } else {
    const cards = cfg.g.map(([id], i) => el(doc, "div", { class: "pl-card", "data-pid": id }, [el(doc, "h3", {}, [el(doc, "span", { class: "pl-step-n" }, [String(i + 1)])])]));
    const dd = el(doc, "a", { href: cfg.c[0][2], "data-cid": "kaizen" }, ["Kaizen"]);
    const vline = el(doc, "p", { class: "mut pl-vline" }, [el(doc, "a", { href: "https://x/v/", "data-vid": "AXT4Qac8mQ8" }, ["Video"])]);
    const qopen = el(doc, "p", { class: "pl-qopen" });
    [box, ...cards, dd, vline, qopen].forEach((x) => body.appendChild(x));
    Object.assign(r, { cards, dd, vline, qopen });
  }
  body.appendChild(data);
  return r;
}

function storage(init = {}, opts = {}) {
  const m = new Map(Object.entries(init)), log = [];
  return { log, map: m,
    getItem: (k) => { if (opts.throws) throw new Error("SecurityError"); log.push(["get", k]); return m.has(k) ? m.get(k) : null; },
    setItem: (k, v) => { if (opts.throws) throw new Error("SecurityError"); if (opts.quota && String(v).length > opts.quota) { const e = new Error("QuotaExceededError"); e.name = "QuotaExceededError"; throw e; } log.push(["set", k, v]); m.set(k, String(v)); },
    removeItem: (k) => { log.push(["rm", k]); m.delete(k); } };
}

// Uhr, Timer, fetch
function env(kind = "g", o = {}) {
  const P = page(kind, o);
  let clock = 1_000_000, perf = 0;
  const timers = [];
  let tid = 0;
  const setTimeout_ = (f, ms) => { const id = ++tid; timers.push({ id, at: perf + (ms || 0), f }); return id; };
  const clearTimeout_ = (id) => { const i = timers.findIndex((t) => t.id === id); if (i >= 0) timers.splice(i, 1); };
  const calls = [];
  const replies = o.replies || {};
  const fetch = (url, opts) => {
    const c = { url, method: opts.method, opts, body: opts.body ? JSON.parse(opts.body) : null }; calls.push(c);
    let r = typeof replies === "function" ? replies(c) : (replies[c.method] || { status: 401, json: { error: "login" } });
    if (typeof r === "function") r = r(c);
    if (r === "net") return Promise.reject(new TypeError("Failed to fetch"));
    return Promise.resolve({ status: r.status, json: () => Promise.resolve(r.json) });
  };
  const winL = {}, docL = {};
  const ls = o.noLS ? undefined : (o.ls || storage(o.store || {}, o.lsOpts || {}));
  const ss = o.ss || storage(o.sess || {});
  const se = { scrollHeight: 10000, scrollTop: 0 };
  const document = {
    getElementById: (id) => [...P.html.walk()].find((e) => e.attrs.id === id) || null, querySelector: (s) => P.html.querySelector(s), querySelectorAll: (s) => P.html.querySelectorAll(s),
    createElement: (t) => new El(t, {}, P.doc), createTextNode: (s) => new Text(s), documentElement: P.html, scrollingElement: se,
    visibilityState: o.vis || "visible", addEventListener: (t, f) => (docL[t] ||= []).push(f),
  };
  const ctx = { document, location: { href: "https://www.m365.fm/de/learn/lean/" + (o.hash || ""), hash: o.hash || "" }, localStorage: ls, sessionStorage: ss, fetch,
    performance: { now: () => perf }, Date: class extends Date { static now() { return clock; } }, setTimeout: setTimeout_, clearTimeout: clearTimeout_,
    requestAnimationFrame: (f) => { Promise.resolve().then(f); return 1; }, innerHeight: 800, scrollY: 0, confirm: () => true,
    addEventListener: (t, f) => (winL[t] ||= []).push(f), scrollTo: (x, y) => { ctx.scrolledTo = y; }, JSON, Math, Promise, RegExp, Object, Array, String, Number, isFinite, encodeURIComponent };
  if (!o.noIO) ctx.IntersectionObserver = class { constructor(cb) { this.cb = cb; ctx._io = this; } observe(e) { this.e = e; } disconnect() { this.off = true; } };
  ctx.window = ctx;
  vm.runInNewContext(JS, ctx);
  const api = {
    P, ctx, calls, ls, ss, se, timers,
    async tick(n = 6) { for (let i = 0; i < n; i++) await new Promise((r) => setImmediate(r)); },
    async advance(ms) { perf += ms; clock += ms; for (;;) { timers.sort((a, b) => a.at - b.at); const t = timers[0]; if (!t || t.at > perf) break; timers.shift(); t.f(); } await api.tick(); },
    async clockJump(ms) { clock += ms; },
    seeEnd() { if (ctx._io && !ctx._io.off) ctx._io.cb([{ isIntersecting: true, target: P.end }]); },
    async vis(state) { document.visibilityState = state; (docL.visibilitychange || []).forEach((f) => f()); await api.tick(); },
    async click(target, type = "click", button = 0) { (docL[type] || []).forEach((f) => f({ type, target, button })); await api.tick(); },
    async pagehide() { (winL.pagehide || []).forEach((f) => f({})); await api.tick(); },
    state() { const v = ls && ls.map.get("m365-learn"); return v ? JSON.parse(v) : null; },
    sets() { return ls ? ls.log.filter((x) => x[0] === "set") : []; },
  };
  return api;
}
const ON = (p = {}, extra = {}) => JSON.stringify({ v: 1, on: 1, u: 0, ep: 0, sy: 0, p: { "manufacturing-excellence": { g: {}, c: {}, v: {}, q: [], ...p } }, ...extra });
const srv = (uid, state = {}, extra = {}) => ({ status: 200, json: { uid, ep: 0, updated: 5, now: 1_795_700_000, state: { g: {}, c: {}, v: {}, ...state }, ...extra } });

// ---------- Opt-in ----------
test("vor dem Opt-in: kein setItem und kein fetch, auch bei Videoklick, Lesen bis zum Ende und pagehide", async () => {
  const E = env("g", { min: 1 });
  E.seeEnd(); await E.advance(60_000);
  await E.click(E.P.vids.children[1]);
  await E.vis("hidden"); await E.pagehide();
  assert.equal(E.calls.length, 0);
  assert.deepEqual(E.sets(), []);
  assert.deepEqual([...new Set(E.ls.log.map((x) => x[0] + ":" + x[1]))], ["get:m365-learn"], "nur der eigene Schluessel wird gelesen");
  assert.deepEqual(E.ss.log, [], "sessionStorage erst nach dem Opt-in");
  assert.equal(E.P.box.querySelector("#lpx-save").disabled, false, "JS schaltet den Knopf frei");
});

test("Opt-in -> GET; Gast (401): kein zweites GET im selben Tab, Hinweis m365_auth entfernt", async () => {
  const E = env("g", { replies: { GET: { status: 401, json: { error: "login" } } } });
  await E.click(E.P.box.querySelector("#lpx-save"));
  assert.equal(E.calls.length, 1); assert.equal(E.calls[0].method, "GET");
  assert.equal(E.calls[0].opts.credentials, "include"); assert.equal(E.calls[0].opts.headers["x-requested-with"], undefined, "GET ohne Zusatzheader (kein Preflight)");
  assert.match(E.calls[0].url, /\/api\/learn\/progress\?path=manufacturing-excellence$/);
  assert.equal(E.state().on, 1);
  assert.ok(E.ls.log.some((x) => x[0] === "rm" && x[1] === "m365_auth"));
  assert.ok(E.P.html.classList.contains("lpx-on"));
  const E2 = env("g", { store: Object.fromEntries(E.ls.map), ss: E.ss, replies: { GET: { status: 401, json: {} } } });
  await E2.tick();
  assert.equal(E2.calls.length, 0, "Tab-Sitzung hat schon geprueft");
});

// ---------- Gelesen ----------
test("gelesen: nur Ende ohne Zeit / Zeit ohne Ende -> nicht gelesen; Ende und Zeit -> gelesen", async () => {
  const r = (E) => (E.state().p["manufacturing-excellence"].g["lean-basics"] || {}).r;
  let E = env("g", { min: 5, store: { "m365-learn": ON() }, replies: { GET: { status: 401, json: {} } } });   // 5 min -> 90 s
  E.seeEnd(); await E.advance(80_000);
  assert.ok(!r(E), "Ende, aber erst 80 s");
  await E.advance(11_000);
  assert.equal(r(E), 1, "Ende und 91 s");
  E = env("g", { min: 5, store: { "m365-learn": ON() } });
  await E.advance(600_000);
  assert.ok(!E.state().p["manufacturing-excellence"].g["lean-basics"], "Zeit ohne Ende");
  E = env("g", { min: 12, store: { "m365-learn": ON() } });   // Deckel 180 s
  E.seeEnd(); await E.advance(179_000); assert.ok(!r(E)); await E.advance(2_000); assert.equal(r(E), 1);
  E = env("g", { min: 1, store: { "m365-learn": ON() } });   // Boden 20 s
  E.seeEnd(); await E.advance(21_000); assert.equal(r(E), 1);
});

test("verborgene Zeit zaehlt nicht; ungelesen -> im selben Aufruf kein erneutes Setzen", async () => {
  const E = env("g", { min: 5, store: { "m365-learn": ON() } });
  E.seeEnd(); await E.advance(30_000);
  await E.vis("hidden"); await E.advance(600_000);
  assert.ok(!E.state().p["manufacturing-excellence"].g["lean-basics"]?.r, "Zeit im Hintergrund zaehlt nicht");
  await E.vis("visible"); await E.advance(61_000);
  const st = E.state().p["manufacturing-excellence"];
  assert.equal(st.g["lean-basics"].r, 1);
  const btn = E.P.done.querySelector("[data-lpx-a]");
  assert.ok(btn, "Zeile am Ende zeigt 'Als ungelesen markieren'");
  await E.click(btn);
  assert.equal(E.state().p["manufacturing-excellence"].g["lean-basics"].r, 0);
  await E.advance(600_000); await E.vis("hidden");
  assert.equal(E.state().p["manufacturing-excellence"].g["lean-basics"].r, 0, "Automatik ruht fuer diesen Aufruf");
  assert.deepEqual(E.state().p["manufacturing-excellence"].q.at(-1), { x: ["g", "lean-basics"] }, "nur die letzte Aktion je id");
});

test("Lesen vor dem Opt-in wird beim Klick sofort uebernommen", async () => {
  const E = env("g", { min: 1, replies: { GET: { status: 401, json: {} } } });
  E.seeEnd(); await E.advance(25_000);
  assert.deepEqual(E.sets(), []);
  await E.click(E.P.box.querySelector("#lpx-save"));
  assert.equal(E.state().p["manufacturing-excellence"].g["lean-basics"].r, 1);
});

// ---------- Lesestelle ----------
test("Lesestelle: nur beim Verlassen, nur bei Aenderung; Inhaltsverzeichnis, Videos und Quellen nie", async () => {
  const E = env("g", { store: { "m365-learn": ON() } });
  const [toc, ein, wsa] = E.P.hs;
  toc._top = -2000; ein._top = -500; wsa._top = 300;
  E.ctx.scrollY = 2000;
  await E.advance(1000);
  assert.equal(E.sets().length, 0, "kein Speichern beim Scrollen");
  await E.vis("hidden");
  let e = E.state().p["manufacturing-excellence"].g["lean-basics"];
  assert.equal(e.a, "einleitung"); assert.equal(e.h, "Einleitung"); assert.equal(e.l, "de"); assert.equal(e.pc, Math.round(100 * 2000 / (10000 - 800)));
  const n = E.sets().length;
  await E.pagehide();
  assert.equal(E.sets().length, n, "unveraendert -> nicht erneut");
  ein._top = 400; E.ctx.scrollY = 300;   // nur das Inhaltsverzeichnis ueber der Kante
  const F = env("g", { store: { "m365-learn": ON() } });
  F.P.hs[0]._top = -100; F.ctx.scrollY = 900; await F.vis("hidden");
  assert.equal(F.state().p["manufacturing-excellence"].g["lean-basics"], undefined, "Inhaltsverzeichnis wird nie Lesestelle");
});

test("Unicode-Anker wird wiederhergestellt, fehlende ID -> Rueckfall auf den Anteil", async () => {
  const pos = { g: { "lean-basics": { r: 0, a: "wertströmanalyse-ü", h: "Wertstromanalyse", l: "de", pc: 40, t: 999_000 } } };
  let E = env("g", { store: { "m365-learn": ON(pos) } });
  await E.tick();
  const b = E.P.box.querySelector(".lpx-b").querySelector("[data-lpx-a]");
  assert.equal(b.getAttribute("data-lpx-a"), "resume");
  assert.match(b.textContent, /Wertstromanalyse/);
  await E.click(b);
  assert.equal(E.P.doc.scrolled.id, "wertströmanalyse-ü");
  const pos2 = { g: { "lean-basics": { r: 0, a: "gibt-es-nicht", h: "Alt", l: "de", pc: 50, t: 999_000 } } };
  E = env("g", { store: { "m365-learn": ON(pos2) } });
  await E.tick();
  await E.click(E.P.box.querySelector(".lpx-b").querySelector("[data-lpx-a]"));
  assert.equal(E.ctx.scrolledTo, Math.round(0.5 * (10000 - 800)));
  E = env("g", { store: { "m365-learn": ON(pos) }, hash: "#fazit" });
  await E.tick();
  assert.equal(E.P.box.querySelector(".lpx-b").querySelector("[data-lpx-a=resume]"), null, "mit Sprungmarke in der Adresse kein Hinweis");
  E = env("g", { store: { "m365-learn": ON(pos) }, lang: "en" });
  await E.tick();
  assert.match(E.P.box.querySelector(".lpx-b").textContent, /Started/, "andere Sprache: nur begonnen");
});

test("Lesestelle an den Server: hoechstens 1 je 5 min je Tab, nur Alter statt Zeitstempel", async () => {
  const E = env("g", { store: { "m365-learn": ON({}, { u: 7 }) }, replies: { GET: srv(7), POST: srv(7) } });
  await E.tick();
  assert.equal(E.calls.length, 1);
  const [, ein] = E.P.hs; ein._top = -10; E.ctx.scrollY = 1500;
  await E.vis("hidden");
  assert.equal(E.calls.length, 2); const c = E.calls[1];
  assert.equal(c.method, "POST"); assert.equal(c.opts.keepalive, true); assert.equal(c.opts.headers["x-requested-with"], "m365");
  assert.deepEqual(Object.keys(c.body.pos[0]).sort(), ["a", "age", "h", "id", "k", "l", "pc"]);
  assert.ok(!/"(t|at|rt)":/.test(c.opts.body), "kein Client-Zeitstempel im Body");
  await E.vis("visible"); E.ctx.scrollY = 2500; await E.advance(60_000); await E.vis("hidden");
  assert.equal(E.calls.length, 2, "Drossel: zweite Lesestelle bleibt in der Warteschlange");
  assert.ok(E.state().p["manufacturing-excellence"].q.some((x) => x.p));
  await E.vis("visible"); E.ctx.scrollY = 3500; await E.advance(300_000); await E.vis("hidden");
  assert.equal(E.calls.length, 3, "nach 5 min wieder");
});

// ---------- Warteschlange ----------
test("Statuswechsel: 2 s entprellt und gebuendelt; Videoklick sofort mit keepalive", async () => {
  const E = env("g", { min: 1, store: { "m365-learn": ON({}, { u: 7 }) }, replies: { GET: srv(7), POST: (c) => srv(7, c.body.vid.length ? { v: { ZY12nBEY2qc: 9 } } : {}) } });
  await E.tick();
  E.seeEnd(); await E.advance(21_000);
  assert.equal(E.calls.length, 1, "noch entprellt");
  await E.click(E.P.done.querySelector("[data-lpx-a]")); await E.advance(1000);
  assert.equal(E.calls.length, 1);
  await E.advance(2100);
  assert.equal(E.calls.length, 2);
  assert.deepEqual(E.calls[1].body.set, []); assert.deepEqual(E.calls[1].body.unset, [["g", "lean-basics"]], "je (k, id) nur die letzte Aktion");
  await E.click(E.P.vids.children[1]);
  assert.equal(E.calls.length, 3); assert.equal(E.calls[2].opts.keepalive, true); assert.deepEqual(E.calls[2].body.vid, ["ZY12nBEY2qc"]);
  assert.equal(E.P.vth.querySelector(".pl-vok").textContent, "✓ opened");
});

test("Antworten: 401 behaelt die Warteschlange, 404 nur lokal, 409 uebernimmt den Server und leert sie", async () => {
  const q = [{ s: ["g", "oee"] }];
  let E = env("g", { store: { "m365-learn": ON({ q }, { u: 7 }), m365_auth: "1" }, replies: { GET: { status: 401, json: { error: "login" } } } });
  await E.tick();
  assert.equal(E.ls.map.get("m365_auth"), undefined);
  assert.deepEqual(E.state().p["manufacturing-excellence"].q, q);
  E = env("g", { store: { "m365-learn": ON({ q }, { u: 7 }) }, replies: { GET: { status: 404, json: { error: "off" } } } });
  await E.tick();
  await E.click(E.P.vids.children[1]);
  assert.equal(E.calls.length, 1, "nach 404 keine weiteren Anfragen");
  assert.equal(E.state().p["manufacturing-excellence"].v.ZY12nBEY2qc, 1);
  E = env("g", { store: { "m365-learn": ON({ q, g: { kanban: { r: 1 } } }, { u: 7, ep: 3 }) },
    replies: { GET: srv(7, { g: { "lean-basics": { r: 1, rt: 1 } } }, { ep: 9 }), POST: { status: 409, json: { ...srv(7, { g: {} }, { ep: 9 }).json, error: "ep" } } } });
  await E.tick();
  assert.equal(E.calls[1].method, "POST"); assert.equal(E.calls[1].body.ep, 3);
  const st = E.state();
  assert.equal(st.ep, 9); assert.deepEqual(st.p["manufacturing-excellence"].q, []); assert.deepEqual(st.p["manufacturing-excellence"].g, {});
});

test("erster Abgleich: Gaststand (u=0) -> init:1 mit allem Lokalen; anderes Konto -> ersetzt, nichts gesendet", async () => {
  const loc = { g: { "lean-basics": { r: 1 }, oee: { r: 0, a: "einleitung", h: "Einleitung", l: "de", pc: 30, t: 1_000_000 - 120_000 } }, c: { kaizen: { r: 1 } }, v: { ZY12nBEY2qc: 1 } };
  let E = env("g", { store: { "m365-learn": ON(loc) }, replies: { GET: srv(7, {}, { ep: 4 }), POST: srv(7, { g: { "lean-basics": { r: 1 } } }) } });
  await E.tick();
  assert.equal(E.calls.length, 2);
  const b = E.calls[1].body;
  assert.equal(b.init, 1); assert.equal(b.ep, 4);
  assert.deepEqual(b.set.sort(), [["c", "kaizen"], ["g", "lean-basics"]]); assert.deepEqual(b.vid, ["ZY12nBEY2qc"]);
  assert.equal(b.pos[0].age, 120); assert.equal(b.pos[0].a, "einleitung");
  assert.equal(E.state().u, 7);
  assert.ok(E.P.box.querySelector(".lpx-b").textContent.includes("in your account"));
  E = env("g", { store: { "m365-learn": ON({ ...loc, q: [{ s: ["g", "oee"] }] }, { u: 5 }) }, replies: { GET: srv(8, { g: { kanban: { r: 1 } } }) } });
  await E.tick();
  assert.equal(E.calls.length, 1, "kein POST mit dem Stand von Konto 5");
  const st = E.state();
  assert.equal(st.u, 8); assert.deepEqual(Object.keys(st.p["manufacturing-excellence"].g), ["kanban"]); assert.deepEqual(st.p["manufacturing-excellence"].q, []);
});

test("Serverzeit -> lokale Uhr; Zuruecksetzen und Abschalten senden DELETE und loeschen lokal", async () => {
  const E = env("p", { store: { "m365-learn": ON({}, { u: 7 }) }, replies: (c) => c.method === "DELETE" ? srv(7, {}, { ep: 11 }) :
    srv(7, { g: { oee: { r: 0, a: "x-y", h: "Teil", l: "de", pc: 20, at: 1_795_700_000 - 60 }, "lean-basics": { r: 1 } }, c: { kaizen: { r: 1 } }, v: { AXT4Qac8mQ8: 5 } }) });
  await E.tick();
  const st = E.state().p["manufacturing-excellence"];
  assert.equal(st.g.oee.t, 1_000_000 - 60_000);
  const txt = E.P.box.querySelector(".lpx-b").textContent;
  assert.match(txt, /1 of 3 guides read/); assert.match(txt, /1 of 1 deep dives read/);
  const go = E.P.box.querySelector(".lpx-b").querySelector("a.btn");
  assert.equal(go.getAttribute("href"), "https://x/de/learn/oee/#x-y"); assert.match(go.textContent, /OEE – Teil/);
  assert.ok(E.P.cards[0].querySelector(".pl-step-n").classList.contains("ok")); assert.ok(!E.P.cards[1].querySelector(".pl-step-n").classList.contains("ok"));
  assert.ok(E.P.dd.classList.contains("ok")); assert.ok(E.P.vline.children[0].classList.contains("ok"));
  assert.match(E.P.qopen.textContent, /Still to read: OEE, Kanban/);
  await E.click(E.P.box.querySelector(".lpx-b").querySelector("[data-lpx-a=reset]"));
  assert.equal(E.calls.at(-1).method, "DELETE"); assert.equal(E.calls.at(-1).opts.headers["x-requested-with"], "m365");
  assert.deepEqual(E.state().p["manufacturing-excellence"].g, {}); assert.equal(E.state().ep, 11);
  await E.click(E.P.box.querySelector(".lpx-b").querySelector("[data-lpx-a=off]"));
  assert.equal(E.calls.at(-1).method, "DELETE");
  assert.equal(E.ls.map.get("m365-learn"), undefined); assert.equal(E.ss.map.get("m365-learn-s"), undefined);
  await E.tick();
  assert.ok(!E.P.html.classList.contains("lpx-on")); assert.ok(!E.P.cards[0].querySelector(".pl-step-n").classList.contains("ok"));
});

test("Anmeldelink im Kasten setzt die Tab-Pruefung zurueck", async () => {
  const E = env("p", { store: { "m365-learn": ON() }, replies: { GET: { status: 401, json: {} } } });
  await E.tick();
  const a = E.P.box.querySelector("[data-lpx-login]");
  assert.match(a.getAttribute("href"), /^https:\/\/api\.test\/auth\/login\/linkedin\?return=/);
  assert.ok(E.ss.map.has("m365-learn-s"));
  await E.click(a);
  assert.ok(!E.ss.map.has("m365-learn-s"));
});

// ---------- Robustheit ----------
test("Robustheit: localStorage fehlt, wirft, ist voll, kaputtes JSON, kein IntersectionObserver, unbekannte Version", async () => {
  let E = env("g", { noLS: true });
  await E.click(E.P.box.querySelector("#lpx-save")); assert.equal(E.calls.length, 0);
  E = env("g", { lsOpts: { throws: true } });
  await E.click(E.P.box.querySelector("#lpx-save")); assert.equal(E.calls.length, 0); assert.equal(E.P.box.querySelector("#lpx-save").disabled, true, "statische Anzeige bleibt");
  E = env("g", { lsOpts: { quota: 10 } });
  await E.click(E.P.box.querySelector("#lpx-save")); assert.equal(E.calls.length, 0, "Speichern scheitert: kein Opt-in, nichts gesendet");
  E = env("g", { store: { "m365-learn": "{kaputt" } });
  await E.tick(); assert.equal(E.calls.length, 0); assert.ok(!E.P.html.classList.contains("lpx-on"));
  E = env("g", { min: 1, noIO: true, store: { "m365-learn": ON() } });
  await E.advance(30_000); E.P.end._top = 500; await E.vis("hidden");
  assert.equal(E.state().p["manufacturing-excellence"].g["lean-basics"].r, 1, "ohne IntersectionObserver: Pruefung beim Verlassen");
  E = env("g", { min: 1, store: { "m365-learn": JSON.stringify({ v: 2, on: 1, neu: true }) } });
  E.seeEnd(); await E.advance(60_000); await E.click(E.P.vids.children[1]); await E.vis("hidden");
  assert.deepEqual(E.sets(), [], "unbekannte Version wird nie ueberschrieben"); assert.equal(E.calls.length, 0);
});

test("Skript: kein sendBeacon, jedes fetch hinter dem Opt-in, nur erlaubte Methoden", () => {
  assert.ok(!JS.includes("sendBeacon"));
  assert.equal((JS.match(/\bfetch\(/g) || []).length, 1, "ein einziger fetch-Aufruf (api)");
  assert.ok(!/method:\s*"PUT"|api\("PUT"/.test(JS));
  for (const k of ["m365-learn", "m365-learn-s", "m365_auth"]) assert.ok(JS.includes(`"${k}"`), k);
});
