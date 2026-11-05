// Verzeichnis-Frontend (assets/directory.js) unveraendert in node:vm mit kleinem Schein-DOM: Filterlisten aus facets,
// nur die juengste Anfrage zaehlt, Google Maps erst nach dem Callback (loading=async) und nur einmal einfuegen.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const DIRECTORY_JS = readFileSync(new URL("../../assets/directory.js", import.meta.url), "utf8");
const flush = async () => { for (let i = 0; i < 5; i++) await new Promise((resolve) => setImmediate(resolve)); };

class El {
  constructor(tag) { this.tagName = tag.toUpperCase(); this.children = []; this.className = ""; this._text = ""; this.hidden = false; this.disabled = false; this.dataset = {}; this.listeners = {}; }
  get textContent() { return this._text; }
  set textContent(value) { this._text = String(value); this.children = []; }
  appendChild(child) { this.children.push(child); return child; }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  setAttribute() {}
  fire(type) { if (type === "click" && this.disabled) return; for (const fn of this.listeners[type] || []) fn({ preventDefault() {} }); }
  querySelector(selector) {
    const cls = selector.replace(/^\./, "");
    for (const child of this.children) { if (child.className === cls) return child; const found = child.querySelector?.(selector); if (found) return found; }
    return null;
  }
}
class Select extends El {
  constructor(name) { super("select"); this.dataset.filter = name; this.options = [{ value: "" }]; this._value = ""; }
  appendChild(option) { this.options.push(option); return option; }
  remove(index) { this.options.splice(index, 1); if (!this.options.some((o) => o.value === this._value)) this._value = ""; }
  get value() { return this._value; }
  set value(value) { this._value = this.options.some((o) => o.value === String(value)) ? String(value) : ""; }   // wie im Browser
  values() { return this.options.slice(1).map((o) => o.value); }
}

function page(config) {
  const search = Object.assign(new El("input"), { value: "" }); search.dataset.filter = "q";
  const selects = Object.fromEntries(["type", "topic", "program", "lang", "country", "city", "mode"].map((key) => [key, new Select(key)]));
  const form = new El("form");
  form.querySelector = (selector) => selects[/data-filter="(\w+)"/.exec(selector)[1]];
  form.querySelectorAll = () => [search, ...Object.values(selects)];
  const nodes = {
    ".dir-layout": new El("div"), "[data-results]": new El("div"), ".dir-filters": form, "[data-count]": new El("p"), "[data-more]": new El("button"),
    "[data-map]": Object.assign(new El("div"), { hidden: true }), ".dir-map-placeholder": new El("div"), "[data-map-status]": new El("p"), "[data-map-load]": new El("button"),
  };
  const scripts = [], requests = [];
  const document = {
    querySelector: (selector) => nodes[selector] || null, querySelectorAll: () => [], createElement: (tag) => new El(tag),
    head: { appendChild: (script) => scripts.push(script) }, documentElement: { dataset: {} },
  };
  const fetch = (url) => new Promise((resolve) => requests.push({ url: new URL(url), respond: (data) => resolve({ ok: true, json: async () => data }) }));
  const sandbox = { document, fetch, URLSearchParams, setTimeout, clearTimeout, getComputedStyle: () => ({ getPropertyValue: () => "" }), matchMedia: () => ({ matches: false }) };
  sandbox.window = sandbox;   // window.google === google wie im Browser
  sandbox.M365D = { api: "https://api.test", labels: { loading: "loading", map_missing: "map missing", result: "entries", none: "none" }, ...config };
  vm.createContext(sandbox);
  vm.runInContext(DIRECTORY_JS, sandbox, { filename: "assets/directory.js" });
  return { sandbox, selects, nodes, scripts, requests, results: nodes["[data-results]"], more: nodes["[data-more]"] };
}
const item = (i, extra = {}) => ({ id: `u:${i}`, type: "expert", name: `Expert ${i}`, url: `https://www.m365.fm/community/u/e${i}/`, country: "Germany", city: "Berlin", topics: [], programs: [], ...extra });
const listed = (results) => results.querySelector("dir-items")?.children.length ?? 0;

test("directory.js: Filterlisten kommen aus facets und behalten die Auswahl", async () => {
  const facets = { country: ["France", "Germany", "Japan"], city: ["Berlin", "Paris", "Tokyo"], topic: ["purview"], program: ["mct"], lang: ["de", "ja"] };
  const ui = page({ items: [item(1), item(2)], facets });
  assert.deepEqual(ui.selects.country.values(), ["France", "Germany", "Japan"], "Werte ausserhalb der ersten 30 sind waehlbar");
  assert.deepEqual(ui.selects.city.values(), ["Berlin", "Paris", "Tokyo"]);
  const initial = ui.requests.shift();
  assert.equal(initial.url.searchParams.get("facets"), "1", "erste Anfrage holt aktuelle facets (die eingebetteten stammen vom Seitenbau)");
  initial.respond({ items: [item(1), item(2)], total: 2, facets });
  await flush();
  ui.selects.country.value = "Japan";
  ui.nodes[".dir-filters"].fire("change");
  const request = ui.requests.shift();
  assert.equal(request.url.searchParams.get("country"), "Japan");
  assert.equal(request.url.searchParams.has("facets"), false, "danach nicht bei jedem Filterwechsel erneut");
  request.respond({ items: [], total: 0, facets: { ...facets, country: ["France", "Germany"] } });   // Wert fehlt in der Antwort
  await flush();
  assert.equal(ui.selects.country.value, "Japan", "Auswahl wird nicht still geleert");
  assert.deepEqual(ui.selects.city.values(), ["Berlin", "Paris", "Tokyo"], "Antwort mit facets ersetzt die Listen weiterhin");
  ui.nodes[".dir-filters"].fire("change");
  assert.equal(ui.requests.shift().url.searchParams.get("country"), "Japan", "und bleibt in der naechsten Anfrage");
});

test("directory.js: Doppelklick und Filterwechsel waehrend 'Weitere laden' ergeben keine Dubletten oder alten Seiten", async () => {
  const ui = page({ items: [] });
  ui.requests.shift().respond({ items: Array.from({ length: 30 }, (_, i) => item(i)), total: 90 });
  await flush();
  assert.equal(listed(ui.results), 30);
  assert.equal(ui.more.hidden, false);
  ui.more.fire("click"); ui.more.fire("click");
  assert.equal(ui.requests.length, 1, "Doppelklick laedt Seite 2 nur einmal");
  assert.equal(ui.more.disabled, true, "waehrend des Ladens gesperrt");
  const page2 = ui.requests.shift();
  assert.equal(page2.url.searchParams.get("page"), "2");
  ui.selects.type.value = "company";
  ui.nodes[".dir-filters"].fire("change");
  const filtered = ui.requests.shift();
  filtered.respond({ items: [item(100, { type: "company" }), item(101, { type: "company" })], total: 2 });
  await flush();
  page2.respond({ items: Array.from({ length: 30 }, (_, i) => item(30 + i)), total: 90 });   // alte Antwort kommt spaeter
  await flush();
  assert.equal(listed(ui.results), 2, "alte Seite 2 wird nicht an das neue Ergebnis angehaengt");
  assert.equal(ui.nodes["[data-count]"].textContent, "2 entries");
  assert.equal(ui.more.disabled, false);
  assert.equal(ui.more.hidden, true);
});

test("directory.js: Karte wartet auf den Google-Callback und laedt das Skript nur einmal", async () => {
  const ui = page({ items: [item(1)], mapsKey: "test-key" });
  const button = ui.nodes["[data-map-load]"];
  button.fire("click");
  assert.equal(ui.scripts.length, 1);
  const google = new URL(ui.scripts[0].src);
  assert.equal(google.searchParams.get("loading"), "async");
  const callback = google.searchParams.get("callback");
  assert.ok(callback, "Callback-Parameter gesetzt");
  ui.sandbox.google = { maps: {} };   // bei onload fehlen Map/importLibrary noch (gemessen mit echten Google-Skripten)
  ui.scripts[0].onload();
  await flush();
  assert.notEqual(ui.nodes["[data-map-status]"].textContent, "map missing");
  assert.equal(ui.scripts.length, 1, "Clusterer erst nach dem Callback");
  const maps = [];
  ui.sandbox.google.maps = { Map: class { constructor(box) { maps.push(box); } }, InfoWindow: class {}, Marker: class {}, SymbolPath: {} };
  ui.sandbox[callback]();
  await flush();
  assert.equal(ui.scripts.length, 2);
  ui.sandbox.markerClusterer = { MarkerClusterer: class {} };
  ui.scripts[1].onload();
  await flush();
  assert.equal(maps.length, 1);
  assert.equal(maps[0], ui.nodes["[data-map]"]);
  assert.equal(ui.nodes["[data-map]"].hidden, false);
  assert.equal(ui.nodes["[data-map-status]"].textContent, "");
  assert.equal(button.hidden, true, "Knopf nach Erfolg ausgeblendet");
  button.disabled = false; button.fire("click");
  await flush();
  assert.equal(ui.scripts.length, 2, "kein zweites Google-Skript");
  assert.equal(maps.length, 1);
});

test("directory.js: kommt nach onload kein Google-Callback, meldet die Karte nach einer Wartezeit einen Fehler und ein neuer Versuch ist moeglich", async () => {
  const ui = page({ items: [item(1)], mapsKey: "test-key" });
  const timers = [];
  ui.sandbox.setTimeout = (fn, ms) => { timers.push({ fn, ms, cleared: false }); return timers.length; };
  ui.sandbox.clearTimeout = (id) => { if (timers[id - 1]) timers[id - 1].cleared = true; };
  const button = ui.nodes["[data-map-load]"];
  button.fire("click");
  assert.equal(ui.scripts.length, 1);
  assert.equal(timers.length, 0, "Wartezeit beginnt erst, wenn das Google-Skript geladen ist");
  ui.sandbox.google = { maps: {} };
  ui.scripts[0].onload();   // Folgemodule (maps-api-v3) kommen nicht an: kein Callback
  await flush();
  assert.equal(ui.nodes["[data-map-status]"].textContent, "loading");
  const wait = timers.find((timer) => !timer.cleared);
  assert.ok(wait && wait.ms >= 10000 && wait.ms <= 30000, "begrenzte Wartezeit auf den Callback");
  wait.fn();
  await flush();
  assert.equal(ui.nodes["[data-map-status]"].textContent, "map missing");
  assert.equal(button.disabled, false, "Knopf wieder frei");
  button.fire("click");
  assert.equal(ui.scripts.length, 2, "neuer Versuch fuegt das Skript erneut ein");
  const google = new URL(ui.scripts[1].src);
  const maps = [];
  ui.sandbox.google.maps = { Map: class { constructor(box) { maps.push(box); } }, InfoWindow: class {}, Marker: class {}, SymbolPath: {} };
  ui.scripts[1].onload();
  ui.sandbox[google.searchParams.get("callback")]();
  await flush();
  assert.ok(timers.filter((timer) => !timer.cleared && timer !== wait).length === 0, "Callback beendet die Wartezeit");
  ui.sandbox.markerClusterer = { MarkerClusterer: class {} };
  ui.scripts[2].onload();
  await flush();
  assert.equal(maps.length, 1);
  assert.equal(ui.nodes["[data-map-status]"].textContent, "");
});

test("directory.js: kommt der Google-Callback erst nach der Wartezeit, fuegt ein neuer Klick das Skript nicht erneut ein", async () => {
  const ui = page({ items: [item(1)], mapsKey: "test-key" });
  const timers = [];
  ui.sandbox.setTimeout = (fn, ms) => { timers.push(fn); return timers.length; };
  ui.sandbox.clearTimeout = () => {};
  const button = ui.nodes["[data-map-load]"];
  button.fire("click");
  const callback = new URL(ui.scripts[0].src).searchParams.get("callback");
  ui.sandbox.google = { maps: {} };
  ui.scripts[0].onload();
  await flush();
  timers.at(-1)();
  await flush();
  assert.equal(ui.nodes["[data-map-status]"].textContent, "map missing");
  const maps = [];
  ui.sandbox.google.maps = { Map: class { constructor(box) { maps.push(box); } }, InfoWindow: class {}, Marker: class {}, SymbolPath: {} };
  ui.sandbox[callback]();   // verspaetet
  button.fire("click");
  await flush();
  assert.equal(ui.scripts.length, 2, "nur der Clusterer kommt dazu, kein zweites Google-Skript");
  assert.match(ui.scripts[1].src, /markerclusterer/);
  ui.sandbox.markerClusterer = { MarkerClusterer: class {} };
  ui.scripts[1].onload();
  await flush();
  assert.equal(maps.length, 1);
});
