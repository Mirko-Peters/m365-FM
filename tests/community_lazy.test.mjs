// assets/community-lazy.js (Community-Seite): Bereichs-Skripte erst laden, wenn ihr Platz sichtbar und nah ist (Reiter), Plaetze ohne Reiter
// nach dem Laden der Seite, Stylesheet vor dem Skript, jedes Skript einmal und in Reihenfolge (async=false), ohne IntersectionObserver alles sofort.
// Lauf: node --test tests/*.test.mjs   (kleine DOM-Attrappe, das Skript laeuft unveraendert in einem vm-Kontext)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const JS = readFileSync(new URL("../assets/community-lazy.js", import.meta.url), "utf8");
const A = (n) => `https://www.m365.fm/assets/${n}?v=1`;
const LIB = ["events.js", "editor.js", "seo.js", "credits.js"].map(A);
const CFG = [
  { ids: ["c-mvp"], js: [A("mvp-tracker.js")], css: [A("mvp-tracker.css")], when: "view" },
  { ids: ["c-events", "c-events-import"], js: [A("events.js"), A("events-import.js")], css: [], when: "view" },
  { ids: ["c-events-entity"], js: [A("events-entity.js")], css: [], when: "idle" },
  { ids: ["c-blog"], js: [...LIB, A("blog.js")], css: [], when: "view" },
  { ids: ["c-podcast"], js: [...LIB, A("podcast.js")], css: [], when: "view" },
  { ids: ["c-gone"], js: [A("gone.js")], css: [], when: "view" },
];

function setup({ io = true, hidden = ["c-mvp", "c-events", "c-events-import", "c-blog", "c-podcast"], ready = "interactive" } = {}) {
  const added = [], listeners = {}, docListeners = {}, timers = [], idle = [];
  const els = {};
  for (const id of ["c-page", "c-mvp", "c-events", "c-events-import", "c-events-entity", "c-blog", "c-podcast"])
    els[id] = { id, hidden: hidden.includes(id), getClientRects() { return this.hidden ? [] : [{}]; }, getBoundingClientRect: () => ({ top: 300, bottom: 300 }) };
  const mk = (tag) => ({ tag, set onload(f) { this._onload = f; }, get onload() { return this._onload; } });
  const append = (where) => (n) => { n.where = where; added.push(n); return n; };
  const observers = [];
  class IO { constructor(cb, opt) { this.cb = cb; this.opt = opt; this.obs = new Set(); observers.push(this); } observe(e) { this.obs.add(e); } unobserve(e) { this.obs.delete(e); }
    fire() { this.cb([...this.obs].map((e) => ({ target: e, isIntersecting: !e.hidden }))); } }
  const window = { innerHeight: 800, addEventListener: (t, f) => (listeners[t] ||= []).push(f), requestIdleCallback: (f) => idle.push(f) };
  window.M365LZ = JSON.parse(JSON.stringify(CFG));
  if (io) window.IntersectionObserver = IO;
  const document = { readyState: ready, getElementById: (id) => els[id] || null, createElement: mk, head: { appendChild: append("head") }, body: { appendChild: append("body") },
    documentElement: { clientHeight: 800 }, addEventListener: (t, f) => (docListeners[t] ||= []).push(f) };
  vm.runInContext(JS, vm.createContext({ window, document, setTimeout: (f) => timers.push(f), Object, JSON }));
  const scripts = () => added.filter((n) => n.tag === "script").map((n) => n.src.split("/assets/")[1].split("?")[0]);
  return { els, added, scripts, listeners, docListeners, timers, idle, observers,
    flush() { while (timers.length) timers.shift()(); }, fireIO() { observers.forEach((o) => o.fire()); }, load() { (listeners.load || []).forEach((f) => f()); while (idle.length) idle.shift()(); } };
}

test("Reiter zu: nichts laden; nur sichtbare Plaetze laden ihre Skripte (async=false, in Reihenfolge)", () => {
  const t = setup();
  t.fireIO();
  assert.deepEqual(t.scripts(), []);
  t.els["c-blog"].hidden = false; t.fireIO();
  assert.deepEqual(t.scripts(), ["events.js", "editor.js", "seo.js", "credits.js", "blog.js"]);
  assert.ok(t.added.every((n) => n.async === false && n.where === "body"));
  assert.equal(t.observers[0].opt.rootMargin, "600px 0px");
});

test("gemeinsame Bausteine nur einmal; die Gruppe eines Reiters laedt nur einmal", () => {
  const t = setup();
  t.els["c-blog"].hidden = false; t.fireIO();
  t.els["c-blog"].hidden = true; t.els["c-podcast"].hidden = false; t.fireIO();
  t.els["c-events"].hidden = false; t.els["c-events-import"].hidden = false; t.fireIO(); t.fireIO();
  assert.deepEqual(t.scripts(), ["events.js", "editor.js", "seo.js", "credits.js", "blog.js", "podcast.js", "events-import.js"]);
});

test("MVP-Tracker: Stylesheet zuerst, Skript erst nach dessen load (oder Fehler)", () => {
  const t = setup();
  t.els["c-mvp"].hidden = false; t.fireIO();
  const link = t.added.find((n) => n.tag === "link");
  assert.equal(link.rel, "stylesheet"); assert.equal(link.where, "head"); assert.match(link.href, /mvp-tracker\.css\?v=1$/);
  assert.deepEqual(t.scripts(), []);
  link.onload();
  assert.deepEqual(t.scripts(), ["mvp-tracker.js"]);
  link.onerror(); t.flush();   // spaeteres Fehler-/Zeitlimit-Ereignis laedt nichts doppelt
  assert.deepEqual(t.scripts(), ["mvp-tracker.js"]);
});

test("MVP-Stylesheet laedt nicht: nach dem Zeitlimit trotzdem das Skript", () => {
  const t = setup();
  t.els["c-mvp"].hidden = false; t.fireIO();
  assert.deepEqual(t.scripts(), []);
  t.flush();
  assert.deepEqual(t.scripts(), ["mvp-tracker.js"]);
});

test("Plaetze ohne Reiter erst nach dem Laden der Seite (requestIdleCallback); fehlende Plaetze nie", () => {
  const t = setup();
  t.fireIO();
  assert.deepEqual(t.scripts(), []);
  t.load();
  assert.deepEqual(t.scripts(), ["events-entity.js"]);
  const u = setup({ ready: "complete" });
  while (u.idle.length) u.idle.shift()();
  assert.deepEqual(u.scripts(), ["events-entity.js"]);
  assert.ok(!u.scripts().includes("gone.js"));
});

test("Rueckfall beim Reiterwechsel: Klick auf .ctab oder hashchange prueft sichtbare Plaetze", () => {
  const t = setup();
  t.els["c-podcast"].hidden = false;
  t.docListeners.click[0]({ target: { closest: (s) => (s === ".ctab" ? {} : null) } }); t.flush();
  assert.deepEqual(t.scripts(), ["events.js", "editor.js", "seo.js", "credits.js", "podcast.js"]);
  t.els["c-events"].hidden = false; t.docListeners.click[0]({ target: { closest: () => null } }); t.flush();
  assert.ok(!t.scripts().includes("events-import.js"));   // Klick ausserhalb der Reiter: nichts
  t.listeners.hashchange[0](); t.flush();
  assert.ok(t.scripts().includes("events-import.js"));
});

test("ohne IntersectionObserver alles sofort in Reihenfolge (wie vorher mit defer), Plaetze ohne Reiter nach dem Laden", () => {
  const t = setup({ io: false });
  const link = t.added.find((n) => n.tag === "link"); link.onload();
  assert.deepEqual(t.scripts(), ["events.js", "events-import.js", "editor.js", "seo.js", "credits.js", "blog.js", "podcast.js", "mvp-tracker.js"]);
  t.load();
  assert.equal(t.scripts().at(-1), "events-entity.js");
});

test("ohne Konfiguration passiert nichts", () => {
  const added = [];
  const document = { createElement: () => ({}), body: { appendChild: (n) => added.push(n) }, head: { appendChild: (n) => added.push(n) } };
  vm.runInContext(JS, vm.createContext({ window: {}, document }));
  assert.equal(added.length, 0);
});
