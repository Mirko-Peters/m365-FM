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
  lp_more: "and {n} more", lp_ready: "All guides read", lp_del_pend: "Not yet deleted in your account" };

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
    c: [["kaizen", "Kaizen", "https://x/de/learn/lean/kaizen/"]] }, opts.cfg || {});
  const data = el(doc, "script", { id: "lpx-data", type: "application/json" }); data.appendChild(new Text(JSON.stringify(cfg)));
  const box = el(doc, "div", { class: "pl-lpx", id: "lpx", "data-k": kind, ...(opts.boxLang ? { lang: opts.boxLang } : {}) }, [el(doc, "div", { class: "lpx-a" }, [el(doc, "button", { id: "lpx-save", disabled: "" })]), el(doc, "div", { class: "lpx-b" })]);
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
    const dd = el(doc, "a", { href: (cfg.c[0] || [])[2] || "https://x/", "data-cid": "kaizen" }, ["Kaizen"]);
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
    if (r && typeof r.then === "function") return r.then((x) => (x === "net" ? Promise.reject(new TypeError("Failed to fetch")) : { status: x.status, json: () => Promise.resolve(x.json) }));   // spaete Antwort
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
    P, ctx, calls, ls, ss, se, timers, winL,
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

// ---------- Gegenpruefung 26.11.: Konten, Loeschen, Rennen, gemerkte Pruefung, Lesestelle ----------
const PATH = "manufacturing-excellence";
const st = (E) => E.state().p[PATH];
function later() { let res; const p = new Promise((r) => (res = r)); return { p, res }; }
const fresh = (o) => JSON.stringify({ t: 1_000_000, pt: 0, ...o });

test("Konto A -> B im selben Tab (gemerkte Pruefung uid 7): POST nennt u=7, Server lehnt mit 409 uid ab, lokal wird ersetzt statt uebernommen", async () => {
  const q = [{ s: ["g", "oee"] }, { v: "AAAAAAAAAAA" }];
  const E = env("g", { store: { "m365-learn": ON({ q, g: { oee: { r: 1 } } }, { u: 7 }), m365_auth: "1" }, sess: { "m365-learn-s": fresh({ s: 200, uid: 7 }) },
    replies: { POST: (c) => (c.body.u && c.body.u !== 8 ? { status: 409, json: { ...srv(8, { g: { kanban: { r: 1 } } }).json, error: "uid" } } : srv(8)) } });
  await E.tick();
  assert.equal(E.calls.length, 1); assert.equal(E.calls[0].method, "POST");
  assert.equal(E.calls[0].body.u, 7, "erwartetes Konto im Body");
  assert.equal(E.state().u, 8);
  assert.deepEqual(Object.keys(st(E).g), ["kanban"], "Stand von Konto 8, nichts von 7");
  assert.deepEqual(st(E).q, []); assert.deepEqual(st(E).v, {});
  await E.vis("hidden");
  assert.equal(E.calls.length, 1, "danach nichts von Konto 7 nachgesendet");
  // init (Gaststand) sendet kein u
  const G = env("g", { store: { "m365-learn": ON({ g: { oee: { r: 1 } } }) }, replies: { GET: srv(7), POST: srv(7) } });
  await G.tick();
  assert.equal(G.calls[1].body.init, 1); assert.equal(G.calls[1].body.u, undefined);
});

test("Zuruecksetzen abgemeldet (401): lokal geleert, Loeschen im Konto vorgemerkt und ehrlich angezeigt; naechste Tab-Sitzung sendet zuerst DELETE, holt nichts Altes zurueck", async () => {
  const old = { g: { "lean-basics": { r: 1 } } };
  const E = env("p", { store: { "m365-learn": ON(old, { u: 7 }) }, replies: { GET: { status: 401, json: { error: "login" } }, DELETE: { status: 401, json: { error: "login" } } } });
  await E.tick();
  let confirmText = ""; E.ctx.confirm = (t) => { confirmText = t; return true; };
  await E.click(E.P.box.querySelector(".lpx-b").querySelector("[data-lpx-a=reset]"));
  assert.equal(confirmText, "Delete in account?");
  assert.deepEqual(st(E).g, {}); assert.deepEqual(E.state().dl, { [PATH]: 7 });
  assert.equal(E.calls.filter((c) => c.method === "DELETE").length, 0, "abgemeldet: nichts gesendet, bleibt vorgemerkt");
  assert.match(E.P.box.querySelector(".lpx-b").textContent, /Not yet deleted in your account/);
  assert.ok(E.P.box.querySelector(".lpx-b").querySelector("[data-lpx-login]"), "Anmeldelinks");
  // nach dem Anmelden (neue Tab-Pruefung): DELETE vor allem anderen, kein GET mit altem Stand
  const F = env("p", { store: Object.fromEntries(E.ls.map), replies: (c) => c.method === "DELETE" ? srv(7, {}, { ep: 12 }) : srv(7, old) });
  await F.tick();
  assert.equal(F.calls[0].method, "DELETE"); assert.match(F.calls[0].url, /&u=7$/);
  assert.deepEqual(st(F).g, {}, "alter Stand kommt nicht zurueck"); assert.equal(F.state().ep, 12); assert.deepEqual(F.state().dl, {});
  assert.equal(F.calls.length, 1);
  assert.match(F.P.box.querySelector(".lpx-b").textContent, /in your account/);
});

test("Zuruecksetzen angemeldet: Netzfehler und 503 -> Hinweis sichtbar, Vormerkung bleibt; naechste Tab-Sitzung holt nach", async () => {
  const E = env("p", { store: { "m365-learn": ON({ g: { oee: { r: 1 } } }, { u: 7 }), m365_auth: "1" }, sess: { "m365-learn-s": fresh({ s: 200, uid: 7 }) },
    replies: (c) => c.method === "DELETE" ? "net" : srv(7) });
  await E.tick();
  await E.click(E.P.box.querySelector(".lpx-b").querySelector("[data-lpx-a=reset]"));
  assert.equal(E.calls.at(-1).method, "DELETE");
  assert.deepEqual(E.state().dl, { [PATH]: 7 }); assert.match(E.P.box.querySelector(".lpx-b").textContent, /Not yet deleted/);
  const F = env("p", { store: Object.fromEntries(E.ls.map), sess: { "m365-learn-s": fresh({ s: 200, uid: 7 }) }, replies: (c) => c.method === "DELETE" ? { status: 503, json: {} } : srv(7) });
  await F.tick();
  assert.equal(F.calls[0].method, "DELETE"); assert.deepEqual(F.state().dl, { [PATH]: 7 });
  const G = env("p", { store: Object.fromEntries(F.ls.map), sess: { "m365-learn-s": fresh({ s: 200, uid: 7 }) }, replies: (c) => c.method === "DELETE" ? srv(7, {}, { ep: 20 }) : srv(7) });
  await G.tick();
  assert.deepEqual(G.state().dl, {}); assert.equal(G.state().ep, 20);
});

test("Nicht mehr speichern abgemeldet: nur Rest {on:0, dl} ohne Fortschritt; DELETE erst bei Anmeldehinweis oder nach dem Anmeldelink; 200 entfernt den Schluessel", async () => {
  const E = env("g", { store: { "m365-learn": ON({ g: { oee: { r: 1, a: "x-y", h: "Geheim" } } }, { u: 7 }) }, replies: { GET: { status: 401, json: {} }, DELETE: { status: 401, json: {} } } });
  await E.tick();
  await E.click(E.P.box.querySelector(".lpx-b").querySelector("[data-lpx-a=off]"));
  assert.deepEqual(E.state(), { v: 1, on: 0, dl: { [PATH]: 7 }, lg: 0 }, "keine Fortschrittsdaten im Rest");
  assert.equal(E.calls.at(-1).method, "DELETE");
  assert.ok(!E.P.html.classList.contains("lpx-on"));
  await E.tick();
  assert.match(E.P.box.querySelector(".lpx-a").textContent, /Not yet deleted/);
  const n = E.calls.length;
  await E.click(E.P.vids.children[1]); await E.vis("hidden");
  assert.equal(E.calls.length, n, "abgeschaltet: kein Abgleich");
  // neuer Aufruf ohne Hinweis: nichts gesendet
  let F = env("g", { store: Object.fromEntries(E.ls.map), replies: { DELETE: srv(7) } });
  await F.tick(); assert.equal(F.calls.length, 0); assert.deepEqual(F.ss.log.filter((x) => x[0] === "set"), [], "keine Tab-Pruefung");
  // Anmeldelink im Hinweis merkt sich den Versuch
  await F.click(F.P.box.querySelector(".lpx-a").querySelector("[data-lpx-login]"));
  assert.equal(F.state().lg, 1);
  const G = env("g", { store: Object.fromEntries(F.ls.map), replies: { DELETE: srv(7, {}, { ep: 30 }) } });
  await G.tick();
  assert.equal(G.calls.length, 1); assert.equal(G.calls[0].method, "DELETE"); assert.match(G.calls[0].url, /&u=7$/);
  assert.equal(G.ls.map.get("m365-learn"), undefined, "erledigt: Schluessel entfernt");
  // mit Anmeldehinweis von community.js; anderes Konto -> 409, Rest bleibt
  const H = env("g", { store: { ...Object.fromEntries(E.ls.map), m365_auth: "1" }, replies: { DELETE: { status: 409, json: { ...srv(9).json, error: "uid" } } } });
  await H.tick();
  assert.equal(H.calls.length, 1); assert.deepEqual(H.state().dl, { [PATH]: 7 });
  // erneutes Einschalten uebernimmt die Vormerkung
  await H.click(H.P.box.querySelector("#lpx-save"));
  assert.deepEqual(H.state().dl, { [PATH]: 7 }); assert.equal(H.state().on, 1);
});

test("Rennen: Videoklick waehrend des init-POST geht nicht verloren", async () => {
  const d = later();
  const E = env("g", { store: { "m365-learn": ON({ g: { oee: { r: 1 } } }) }, replies: (c) => c.method === "GET" ? srv(7) : c.body.init ? d.p : srv(7, { g: { oee: { r: 1 } }, v: { ZY12nBEY2qc: 3 } }) });
  await E.tick();
  assert.equal(E.calls.length, 2); assert.equal(E.calls[1].body.init, 1);
  await E.click(E.P.vids.children[1]);
  assert.equal(E.calls.length, 3, "waehrend des init-POST: eigener keepalive-POST nur mit dem Video (B6)");
  assert.equal(E.calls[2].opts.keepalive, true); assert.deepEqual(E.calls[2].body.vid, ["ZY12nBEY2qc"]); assert.equal(E.calls[2].body.init, 0); assert.equal(E.calls[2].body.u, 7);
  d.res(srv(7, { g: { oee: { r: 1 } } }));
  await E.tick(10);
  assert.equal(st(E).v.ZY12nBEY2qc, 1, "Video bleibt lokal");
  assert.equal(E.calls.length, 4, "und wird nachgesendet"); assert.deepEqual(E.calls[3].body.vid, ["ZY12nBEY2qc"]); assert.equal(E.calls[3].body.u, 7);
  assert.deepEqual(st(E).q, []);
});

test("Rennen: spaete POST-Antwort nach dem Zuruecksetzen stellt nichts wieder her; DELETE erst danach, frische Aktion bleibt", async () => {
  const d = later();
  let posts = 0;
  const E = env("g", { min: 1, store: { "m365-learn": ON({}, { u: 7, ep: 0 }), m365_auth: "1" }, sess: { "m365-learn-s": fresh({ s: 200, uid: 7 }) },
    replies: (c) => c.method === "DELETE" ? srv(7, {}, { ep: 99 }) : c.method === "POST" ? (posts++ === 0 ? d.p : (c.body.ep === 99 ? srv(7, { v: { ZY12nBEY2qc: 5 } }, { ep: 99 }) : { status: 409, json: { ...srv(7, {}, { ep: 99 }).json, error: "ep" } })) : srv(7) });
  await E.tick();
  E.P.box.setAttribute("data-k", "p");
  await E.click(E.P.vids.children[1]);   // POST 1 laeuft
  assert.equal(E.calls.at(-1).method, "POST");
  E.ctx.confirm = () => true;
  E.P.box.querySelector(".lpx-b").appendChild(new (E.P.box.constructor)("button", { "data-lpx-a": "reset" }, E.P.doc));
  await E.click(E.P.box.querySelector(".lpx-b").querySelector("[data-lpx-a=reset]"));
  assert.equal(E.calls.filter((c) => c.method === "DELETE").length, 0, "DELETE wartet auf die laufende Anfrage");
  await E.click(E.P.vids.children[1]);   // frische Aktion nach dem Zuruecksetzen, waehrend POST 1 noch laeuft
  d.res(srv(7, { g: { oee: { r: 1 } }, v: { ZY12nBEY2qc: 5 } }, { ep: 0 }));
  await E.tick(12);
  assert.deepEqual(st(E).g, {}, "alte Antwort gilt nicht");
  assert.deepEqual(E.calls.slice(1).map((c) => c.method), ["DELETE", "POST"], "erst DELETE, dann die frische Aktion");
  assert.equal(E.calls[2].body.ep, 99, "mit der neuen Epoche (kein 409)"); assert.deepEqual(E.calls[2].body.vid, ["ZY12nBEY2qc"]);
  assert.equal(E.state().ep, 99); assert.equal(st(E).v.ZY12nBEY2qc, 1); assert.deepEqual(st(E).q, []);
});

test("Gemerkte Pruefung veraltet: 401 + Anmeldehinweis, 200 ohne Hinweis und nach 15 min -> neu pruefen; frisch -> keine Anfrage", async () => {
  let E = env("g", { store: { "m365-learn": ON(), m365_auth: "1" }, sess: { "m365-learn-s": fresh({ s: 401 }) }, replies: { GET: srv(7), POST: srv(7) } });
  await E.tick(); assert.equal(E.calls[0]?.method, "GET", "anderswo angemeldet");
  E = env("g", { store: { "m365-learn": ON({}, { u: 7 }) }, sess: { "m365-learn-s": fresh({ s: 200, uid: 7 }) }, replies: { GET: { status: 401, json: {} } } });
  await E.tick(); assert.equal(E.calls[0]?.method, "GET", "abgemeldet (Hinweis fehlt)");
  assert.doesNotMatch(E.P.box.querySelector(".lpx-b").textContent, /in your account/);
  E = env("g", { store: { "m365-learn": ON({}, { u: 7 }), m365_auth: "1" }, sess: { "m365-learn-s": fresh({ s: 200, uid: 7, t: 1_000_000 - 16 * 60_000 }) }, replies: { GET: srv(7) } });
  await E.tick(); assert.equal(E.calls[0]?.method, "GET", "nach 15 min");
  E = env("g", { store: { "m365-learn": ON() }, sess: { "m365-learn-s": fresh({ s: 401 }) } });
  await E.tick(); assert.equal(E.calls.length, 0, "frisch und ohne Hinweis: keine Anfrage");
});

test("Lesestelle hinter scroll-margin (Weiterlesen, Sprungmarke): aktuelle Ueberschrift knapp unter der Oberkante zaehlt", async () => {
  const E = env("g", { store: { "m365-learn": ON() } });
  const [toc, ein, wsa] = E.P.hs;
  toc._top = -3000; ein._top = -900; wsa._top = 80; E.ctx.scrollY = 3000;
  await E.vis("hidden");
  assert.equal(st(E).g["lean-basics"].a, "wertströmanalyse-ü");
});

test("Byte-Grenze: viele lange Lesestellen (Japanisch) -> jeder Body unter 16 KB, Rest im naechsten POST", async () => {
  const ja = "目".repeat(132), q = Array.from({ length: 40 }, (_, i) => ({ p: { k: "g", id: `guide-${i}`, a: ja, h: "見".repeat(80), l: "ja", pc: 30, t: 999_000 } }));
  const E = env("g", { store: { "m365-learn": ON({ q }, { u: 7 }), m365_auth: "1" }, sess: { "m365-learn-s": fresh({ s: 200, uid: 7 }) }, replies: { POST: srv(7) } });
  await E.tick(10);
  assert.ok(E.calls.length >= 2, "aufgeteilt");
  for (const c of E.calls) assert.ok(new TextEncoder().encode(c.opts.body).length <= 16384, "Body " + new TextEncoder().encode(c.opts.body).length);
  assert.equal(E.calls.reduce((n, c) => n + c.body.pos.length, 0), 40);
  assert.deepEqual(st(E).q, []);
});

test("Uebersetzte Pfadseite: englischer Ersatz-Leitfaden bekommt ✓ am Titel und Anker bei englischer Lesestelle; unbekannte Version laesst sich abschalten", async () => {
  const E = env("p", { lang: "fr", cfg: { g: [["lean-basics", "Lean", "https://x/fr/learn/lean/", "fr"], ["oee", "OEE", "https://x/learn/oee/", "en"]], c: [] },
    store: { "m365-learn": ON({ g: { oee: { r: 0, a: "intro", h: "Intro", l: "en", pc: 10, t: 999_000 } }, "lean-basics": { r: 1 } }) }, replies: { GET: { status: 401, json: {} } } });
  E.P.cards[1].children[0].children = []; E.P.cards[1].children[0].appendChild(new (E.P.box.constructor)("a", { href: "https://x/learn/oee/" }, E.P.doc));
  await E.tick();
  assert.equal(E.P.box.querySelector(".lpx-b").querySelector("a.btn").getAttribute("href"), "https://x/learn/oee/#intro");
  E.P.cards[1].attrs["data-pid"] = "oee";
  const s2 = E.state(); s2.p[PATH].g.oee.r = 1; E.ls.map.set("m365-learn", JSON.stringify(s2));
  const F = env("p", { lang: "fr", store: Object.fromEntries(E.ls.map), cfg: { g: [["lean-basics", "Lean", "https://x/fr/learn/lean/", "fr"], ["oee", "OEE", "https://x/learn/oee/", "en"]], c: [] } });
  F.P.cards[1].children[0].children = []; const a = F.P.cards[1].children[0].appendChild(new (F.P.box.constructor)("a", { href: "https://x/learn/oee/" }, F.P.doc));
  await F.tick();
  assert.ok(a.classList.contains("lpx-ok"));
  assert.equal(F.P.box.querySelector(".lpx-b").getAttribute("aria-live"), "polite", "aria-live erst nach dem ersten Bild");
  const R = env("g", { store: { "m365-learn": JSON.stringify({ v: 2, on: 1 }) } });
  await R.tick();
  await R.click(R.P.box.querySelector(".lpx-b").querySelector("[data-lpx-a=off]"));
  assert.equal(R.ls.map.get("m365-learn"), undefined); assert.equal(R.calls.length, 0);
});

// ---------- Befunde der Endpruefung ----------
const storageEv = (E) => (E.winL.storage || []).forEach((f) => f({ key: "m365-learn" }));
const act = (E, a, where = ".lpx-b") => E.P.box.querySelector(where).querySelector(`[data-lpx-a=${a}]`);

test("A1: Nicht mehr speichern waehrend des init-POST: Rueckfrage nennt das Konto, DELETE fuer dieses Konto erst nach der Antwort", async () => {
  const d = later();
  const E = env("g", { store: { "m365-learn": ON({ g: { oee: { r: 1 } } }) }, replies: (c) => c.method === "GET" ? srv(7) : c.method === "POST" ? d.p : srv(7, {}, { ep: 40 }) });
  await E.tick();
  assert.equal(E.calls[1].body.init, 1);
  let q = null; E.ctx.confirm = (x) => { q = x; return true; };
  await E.click(act(E, "off"));
  assert.match(q, /and in your account/, "Gaststand wird gerade ins Konto uebernommen");
  assert.deepEqual(E.state(), { v: 1, on: 0, dl: { [PATH]: 7 }, lg: 0 });
  assert.equal(E.calls.length, 2, "DELETE wartet auf den init-POST");
  d.res(srv(7, { g: { oee: { r: 1 } } }));
  await E.tick(10);
  assert.deepEqual(E.calls.map((c) => c.method), ["GET", "POST", "DELETE"]); assert.match(E.calls[2].url, /&u=7$/);
  assert.equal(E.ls.map.get("m365-learn"), undefined, "bestaetigt: Rest entfernt");
});

test("A1: Zuruecksetzen waehrend des init-POST: Rueckfrage nennt das Konto, DELETE nach der Antwort, danach nichts Altes", async () => {
  const d = later();
  const E = env("p", { store: { "m365-learn": ON({ g: { oee: { r: 1 } } }) }, replies: (c) => c.method === "GET" ? srv(7) : c.method === "POST" ? d.p : srv(7, {}, { ep: 40 }) });
  await E.tick();
  assert.equal(E.calls[1].body.init, 1);
  let q = null; E.ctx.confirm = (x) => { q = x; return true; };
  await E.click(act(E, "reset"));
  assert.equal(q, "Delete in account?");
  assert.deepEqual(E.state().dl, { [PATH]: 7 });
  d.res(srv(7, { g: { oee: { r: 1 } } }));
  await E.tick(12);
  assert.deepEqual(E.calls.map((c) => c.method), ["GET", "POST", "DELETE", "GET"]); assert.match(E.calls[2].url, /&u=7$/);
  assert.deepEqual(E.state().dl, {}); assert.deepEqual(st(E).g, {}); assert.equal(E.state().u, 7); assert.equal(E.state().ep, 0);
});

test("A2: spaete POST-Antwort nach Nicht mehr speichern schreibt keine Tab-Pruefung (m365-learn-s) mehr", async () => {
  const d = later();
  const E = env("g", { store: { "m365-learn": ON({}, { u: 7 }), m365_auth: "1" }, sess: { "m365-learn-s": fresh({ s: 200, uid: 7 }) },
    replies: (c) => c.method === "POST" ? d.p : c.method === "DELETE" ? { status: 401, json: {} } : srv(7) });
  await E.tick();
  await E.click(E.P.vids.children[1]);
  assert.equal(E.calls.at(-1).method, "POST");
  await E.click(act(E, "off"));
  assert.equal(E.ss.map.get("m365-learn-s"), undefined);
  d.res(srv(7)); await E.tick(10);
  assert.equal(E.ss.map.get("m365-learn-s"), undefined, "nach der spaeten Antwort");
});

test("B3: anderer Tab aendert waehrend einer Anfrage: keine zweite parallele Anfrage, vorgemerkter Nachversand bleibt", async () => {
  const d = later(); let n = 0, inflight = 0, maxIn = 0;
  const E = env("g", { min: 1, store: { "m365-learn": ON({}, { u: 7 }), m365_auth: "1" }, sess: { "m365-learn-s": fresh({ s: 200, uid: 7 }) },
    replies: (c) => { if (c.method !== "POST") return srv(7); n++; inflight++; maxIn = Math.max(maxIn, inflight);
      return (n === 1 ? d.p : Promise.resolve(srv(7))).then((x) => { inflight--; return x; }); } });
  await E.tick();
  await E.click(E.P.vids.children[1]);   // POST 1 haengt
  E.seeEnd(); await E.advance(21_000); await E.advance(2100);   // gelesen -> entprellt -> vorgemerkt (busy)
  assert.equal(n, 1);
  const o = E.state(); o.sy = 1; E.ls.map.set("m365-learn", JSON.stringify(o)); storageEv(E);
  await E.click(E.P.done.querySelector("[data-lpx-a]")); await E.advance(2100);   // ungelesen -> entprellt
  assert.equal(n, 1, "keine zweite Anfrage, solange POST 1 laeuft");
  d.res(srv(7)); await E.tick(12);
  assert.equal(maxIn, 1);
  assert.equal(n, 2, "Nachversand nach der Antwort");
  assert.deepEqual(E.calls.at(-1).body.unset, [["g", "lean-basics"]]); assert.deepEqual(st(E).q, []);
});

test("B4: Opt-in nur in einem anderen Tab: dieser Tab gleicht ab und uebernimmt, was er schon als gelesen erkannt hat; vorgemerktes Loeschen zuerst", async () => {
  const E = env("g", { min: 1, store: { m365_auth: "1" }, replies: { GET: srv(7), POST: srv(7, { g: { "lean-basics": { r: 1 } } }) } });
  E.seeEnd(); await E.advance(21_000);
  assert.equal(E.calls.length, 0);
  E.ls.map.set("m365-learn", ON({}, { u: 7 })); storageEv(E);
  await E.tick(8);
  assert.equal(E.calls[0]?.method, "GET");
  assert.deepEqual(E.calls[1]?.body.set, [["g", "lean-basics"]], "schon erfuelltes Lesen geht mit");
  assert.equal(st(E).g["lean-basics"].r, 1);
  const F = env("g", { store: { m365_auth: "1" }, replies: { DELETE: srv(7, {}, { ep: 50 }), GET: srv(7) } });
  F.ls.map.set("m365-learn", ON({}, { u: 7, dl: { [PATH]: 7 } })); storageEv(F);
  await F.tick(8);
  assert.equal(F.calls[0]?.method, "DELETE"); assert.match(F.calls[0].url, /&u=7$/);
  assert.deepEqual(F.state().dl, {});
});

test("B5: Abschalten und erneutes Opt-in im selben Aufruf: Automatik laeuft wieder, ausser nach Als ungelesen markieren", async () => {
  const E = env("g", { min: 1, store: { "m365-learn": ON() }, replies: { GET: { status: 401, json: {} } } });
  await E.tick();
  await E.click(act(E, "off"));
  await E.click(E.P.box.querySelector("#lpx-save")); await E.tick();
  E.seeEnd(); await E.advance(25_000);
  assert.equal(st(E).g["lean-basics"]?.r, 1, "automatisch gelesen");
  const F = env("g", { min: 1, store: { "m365-learn": ON() }, replies: { GET: { status: 401, json: {} } } });
  F.seeEnd(); await F.advance(25_000);
  await F.click(F.P.done.querySelector("[data-lpx-a]"));   // als ungelesen markiert
  await F.click(act(F, "off"));
  await F.click(F.P.box.querySelector("#lpx-save")); await F.tick();
  await F.advance(60_000); await F.vis("hidden");
  assert.ok(!st(F).g["lean-basics"]?.r, "nach Als ungelesen markieren ruht die Automatik weiter");
});

test("B6: Videoklick waehrend einer laufenden Anfrage: eigener keepalive-POST nur mit dem Video, fuer das Konto und die Epoche", async () => {
  const d = later(); let n = 0;
  const E = env("g", { min: 1, store: { "m365-learn": ON({}, { u: 7, ep: 33 }), m365_auth: "1" }, sess: { "m365-learn-s": fresh({ s: 200, uid: 7 }) },
    replies: (c) => c.method === "POST" ? (n++ === 0 ? d.p : srv(7, {}, { ep: 33 })) : srv(7) });
  await E.tick();
  E.seeEnd(); await E.advance(21_000); await E.advance(2100);
  assert.equal(E.calls.length, 1, "POST 1 laeuft");
  await E.click(E.P.vids.children[1]);
  assert.equal(E.calls.length, 2);
  const c = E.calls[1];
  assert.equal(c.opts.keepalive, true);
  assert.deepEqual({ ...c.body }, { path: PATH, ep: 33, init: 0, u: 7, set: [], unset: [], vid: ["ZY12nBEY2qc"], pos: [] });
  d.res(srv(7, {}, { ep: 33 })); await E.tick(10);
  assert.deepEqual(E.calls.at(-1).body.vid, ["ZY12nBEY2qc"], "Warteschlange sendet ihn noch einmal (Server vereinigt)"); assert.deepEqual(st(E).q, []);
  // vorgemerktes Loeschen: kein Nebenweg (das DELETE geht vor)
  const F = env("g", { store: { "m365-learn": ON({}, { u: 7, dl: { [PATH]: 7 } }), m365_auth: "1" }, sess: { "m365-learn-s": fresh({ s: 200, uid: 7 }) }, replies: () => later().p });
  await F.tick();
  assert.equal(F.calls.length, 1); await F.click(F.P.vids.children[1]);
  assert.equal(F.calls.length, 1);
});

test("B7: Fehlschlag der Anmeldepruefung (503, 429, Netz) sperrt weitere Pruefungen im Tab fuer 15 min; Anmeldehinweis geaendert -> neu", async () => {
  for (const bad of [{ status: 503, json: {} }, { status: 429, json: {} }, "net"]) {
    const E = env("g", { store: { "m365-learn": ON() }, replies: { GET: bad } });
    await E.tick();
    assert.equal(E.calls.length, 1);
    const F = env("g", { store: Object.fromEntries(E.ls.map), ss: E.ss, replies: { GET: srv(7) } });
    await F.tick();
    assert.equal(F.calls.length, 0, "Seitenwechsel im selben Tab: keine zweite Pruefung " + JSON.stringify(bad));
    assert.match(F.P.box.querySelector(".lpx-b").textContent, /Sync unavailable/);
  }
  const E = env("g", { store: { "m365-learn": ON() }, replies: { GET: { status: 503, json: {} } } });
  await E.tick();
  const o = JSON.parse(E.ss.map.get("m365-learn-s")); o.t -= 16 * 60_000;
  const old = storage({ "m365-learn-s": JSON.stringify(o) });
  const F = env("g", { store: Object.fromEntries(E.ls.map), ss: old, replies: { GET: srv(7) } });
  await F.tick(); assert.equal(F.calls[0]?.method, "GET", "nach 15 min");
  const G = env("g", { store: { ...Object.fromEntries(E.ls.map), m365_auth: "1" }, ss: E.ss, replies: { GET: srv(7) } });
  await G.tick(); assert.equal(G.calls[0]?.method, "GET", "inzwischen angemeldet");
});

test("B10: Plakette am Video traegt lang=en, wenn der Kasten auf Englisch zurueckfaellt", async () => {
  const E = env("g", { lang: "fr", boxLang: "en", store: { "m365-learn": ON({ v: { ZY12nBEY2qc: 1 } }) }, replies: { GET: { status: 401, json: {} } } });
  await E.tick();
  assert.equal(E.P.vth.querySelector(".pl-vok").getAttribute("lang"), "en");
  const F = env("g", { store: { "m365-learn": ON({ v: { ZY12nBEY2qc: 1 } }) }, replies: { GET: { status: 401, json: {} } } });
  await F.tick();
  assert.equal(F.P.vth.querySelector(".pl-vok").getAttribute("lang"), null);
});

// ---------- Restpunkte der Gegenpruefung ----------
const calls = (E) => E.calls.map((c) => c.method + (c.body && c.body.init ? "(init)" : ""));

test("N1: init-POST scheitert (503) nach GET 200: auch das sperrt den Tab 15 min (kein GET + init bei jedem Aufruf); Anmeldehinweis weg -> neu", async () => {
  const rep = (c) => c.method === "GET" ? srv(7) : { status: 503, json: {} };
  const E = env("g", { store: { "m365-learn": ON({ g: { oee: { r: 1 } } }), m365_auth: "1" }, replies: rep });
  await E.tick(10);
  assert.deepEqual(calls(E), ["GET", "POST(init)"]);
  assert.match(E.P.box.querySelector(".lpx-b").textContent, /Sync unavailable/);
  for (let i = 0; i < 2; i++) {
    const F = env("g", { ls: E.ls, ss: E.ss, replies: rep });
    await F.tick(10);
    assert.deepEqual(F.calls, [], "Seitenwechsel im selben Tab: keine neue Pruefung, kein neuer init-POST");
    assert.match(F.P.box.querySelector(".lpx-b").textContent, /Sync unavailable/);
  }
  assert.equal(st(E).g.oee.r, 1, "Gaststand bleibt lokal");
  E.ls.map.delete("m365_auth");   // inzwischen abgemeldet
  const G = env("g", { ls: E.ls, ss: E.ss, replies: { GET: { status: 401, json: {} } } });
  await G.tick(10); assert.deepEqual(calls(G), ["GET"]);
});

test("N2: Nicht mehr speichern und sofort wieder Opt-in waehrend des init-POST: DELETE erst nach der init-Antwort, danach nichts Altes", async () => {
  const d = later();
  const E = env("g", { store: { "m365-learn": ON({ g: { oee: { r: 1 } } }), m365_auth: "1" },
    replies: (c) => c.method === "GET" ? srv(7) : c.method === "POST" ? d.p : srv(7, {}, { ep: 40 }) });
  await E.tick();
  assert.deepEqual(calls(E), ["GET", "POST(init)"]);
  await E.click(act(E, "off"));
  await E.click(E.P.box.querySelector("#lpx-save")); await E.tick();
  assert.deepEqual(calls(E), ["GET", "POST(init)"], "nichts, solange der init-POST laeuft");
  d.res(srv(7, { g: { oee: { r: 1 } } })); await E.tick(20);
  assert.deepEqual(calls(E), ["GET", "POST(init)", "DELETE", "GET"]); assert.match(E.calls[2].url, /&u=7$/);
  assert.deepEqual(E.state().dl, {}); assert.deepEqual(st(E).g, {}); assert.equal(E.state().u, 7);
  // ebenso, wenn das erneute Opt-in aus einem anderen Tab kommt (storage), waehrend hier der init-POST nach dem Abschalten noch laeuft
  const d2 = later();
  const F = env("g", { store: { "m365-learn": ON({ g: { oee: { r: 1 } } }), m365_auth: "1" },
    replies: (c) => c.method === "GET" ? srv(7) : c.method === "POST" ? d2.p : srv(7, {}, { ep: 40 }) });
  await F.tick();
  await F.click(act(F, "off"));
  F.ls.map.set("m365-learn", ON({}, { dl: { [PATH]: 7 } })); storageEv(F); await F.tick();
  assert.deepEqual(calls(F), ["GET", "POST(init)"]);
  d2.res(srv(7, { g: { oee: { r: 1 } } })); await F.tick(20);
  assert.deepEqual(calls(F), ["GET", "POST(init)", "DELETE", "GET"]);
});

test("N3: anderer Tab schaltet ab und wieder ein, waehrend hier eine Anfrage laeuft: dieser Tab gleicht nach der Antwort ab (einmal)", async () => {
  const d = later(); let n = 0;
  const E = env("g", { store: { "m365-learn": ON({}, { u: 7 }), m365_auth: "1" }, replies: (c) => (n++ === 0 ? d.p : srv(7, {}, { ep: 60 })) });
  await E.tick();
  assert.deepEqual(calls(E), ["GET"]);
  E.ls.map.set("m365-learn", JSON.stringify({ v: 1, on: 0, dl: { [PATH]: 7 }, lg: 0 })); storageEv(E);
  E.ls.map.set("m365-learn", ON({}, { u: 7, dl: { [PATH]: 7 } })); storageEv(E);
  await E.tick();
  assert.deepEqual(calls(E), ["GET"], "keine zweite parallele Anfrage");
  d.res(srv(7)); await E.tick(20);
  assert.deepEqual(calls(E), ["GET", "DELETE"], "vorgemerktes Loeschen nach der Antwort nachgeholt, nicht doppelt"); assert.match(E.calls[1].url, /&u=7$/);
  assert.deepEqual(E.state().dl, {}); assert.equal(E.state().ep, 60);
  await E.advance(10_000); assert.equal(E.calls.length, 2, "keine Schleife");
  // Gaststand ohne Vormerkung: get() waehrend busy holt den Abgleich (GET) nach
  const d2 = later(); let m = 0;
  const F = env("g", { store: { "m365-learn": ON({}, { u: 7 }), m365_auth: "1" }, replies: (c) => (m++ === 0 ? d2.p : srv(7)) });
  await F.tick();
  F.ls.map.set("m365-learn", JSON.stringify({ v: 1, on: 0, dl: {}, lg: 0 })); storageEv(F);
  F.ls.map.set("m365-learn", ON()); storageEv(F); await F.tick();
  d2.res(srv(7)); await F.tick(20);
  assert.deepEqual(calls(F), ["GET", "GET"]); assert.equal(F.state().u, 7);
});
