// assets/events-entity.js in node:vm mit kleinem Schein-DOM: Veranstalter schlaegt eine Reihe vor, bestaetigte Zuordnung ist gesperrt, Admin bestaetigt/aendert/lehnt ab.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const JS = readFileSync(new URL("../../assets/events-entity.js", import.meta.url), "utf8");
class Text { constructor(t) { this.nodeType = 3; this.data = String(t); } get textContent() { return this.data; } }
class El {
  constructor(tag) { this.nodeType = 1; this.tagName = tag.toUpperCase(); this.attrs = {}; this.childNodes = []; this.listeners = {}; this.value = ""; this.disabled = false; this.id = ""; }
  setAttribute(k, v) { this.attrs[k] = String(v); if (k === "value") this.value = String(v); }
  appendChild(c) { this.childNodes.push(c); if (this.tagName === "SELECT" && c.tagName === "OPTION" && this.childNodes.length === 1) this.value = c.value; return c; }
  get textContent() { return this.childNodes.map((n) => n.textContent).join(""); }
  set textContent(t) { this.childNodes = t ? [new Text(t)] : []; }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  click() { for (const fn of this.listeners.click || []) fn({ type: "click", target: this }); }
  all(pred) { const out = []; const walk = (n) => { for (const c of n.childNodes) if (c.nodeType === 1) { if (pred(c)) out.push(c); walk(c); } }; walk(this); return out; }
}
const tick = () => new Promise((r) => setTimeout(r, 5));
const ENTS = [{ id: "comms-vnext", name: "Comms vNext" }, { id: "microsoft-ignite", name: "Microsoft Ignite" }];
async function boot(routes, me, lang = "de") {
  const root = new El("div"), posts = [];
  const fetch = async (url, o = {}) => {
    const path = new URL(url).pathname, body = o.body ? JSON.parse(o.body) : undefined;
    assert.equal(o.headers["x-requested-with"], "m365"); if (o.method === "POST") posts.push({ path, body });
    const r = path === "/api/me" ? { user: me } : typeof routes[path] === "function" ? routes[path](body) : routes[path] ?? {};
    const [status, data] = Array.isArray(r) ? r : [200, r];
    return new Response(JSON.stringify(data), { status });
  };
  vm.runInContext(JS, vm.createContext({ window: { M365X: { api: "https://api.test", lang }, location: { search: "" } }, document: { createElement: (t) => new El(t), getElementById: (id) => (id === "c-events-entity" ? root : null) }, fetch, Object, Math, Promise }));
  for (let i = 0; i < 40 && !root.childNodes.length; i++) await tick();
  await tick(); await tick();
  const btn = (text) => root.all((e) => e.tagName === "BUTTON" && e.textContent === text);
  return { root, posts, btn, sels: () => root.all((e) => e.tagName === "SELECT") };
}
const MINE = (link) => ({ "/api/events/mine": { events: [{ handle: "ignite-2026", title: "Microsoft Ignite 2026", entity_link: link }, { handle: "fremd", title: "Importiert", unclaimed: true }] }, "/api/events/entity": { entities: ENTS } });

test("Veranstalter: Reihe waehlen sendet nur Handle und Entitaet; Hinweis, dass die Redaktion bestaetigen muss", async () => {
  const { root, btn, posts, sels } = await boot(MINE({ id: "", state: "" }), { id: 2 });
  assert.ok(root.textContent.includes("Event-Reihe zuordnen") && root.textContent.includes("Microsoft Ignite 2026") && root.textContent.includes("Keine Reihe zugeordnet."));
  assert.ok(!root.textContent.includes("Importiert"), "importierte Events ohne Veranstalter erscheinen nicht");
  const s = sels()[0]; assert.deepEqual(s.childNodes.map((o) => o.value), ["", "comms-vnext", "microsoft-ignite"], "nur die Event-Entitaeten der API");
  s.value = "microsoft-ignite"; btn("Zuordnung speichern")[0].click(); await tick(); await tick();
  assert.deepEqual(posts, [{ path: "/api/events/entity", body: { handle: "ignite-2026", entity: "microsoft-ignite" } }]);
  assert.ok(root.textContent.includes("Öffentlich wird sie, sobald die Redaktion sie bestätigt hat"));
});
test("Bestaetigte Zuordnung ist fuer Veranstalter gesperrt (kein Speichern-Knopf), Vorschlaege zeigen ihren Zustand", async () => {
  const a = await boot(MINE({ id: "microsoft-ignite", state: "confirmed" }), { id: 2 });
  assert.ok(a.root.textContent.includes("Zugeordnet: Microsoft Ignite.") && a.root.textContent.includes("ändert die Redaktion")); assert.equal(a.btn("Zuordnung speichern").length, 0);
  const b = await boot(MINE({ id: "microsoft-ignite", state: "suggested" }), { id: 2 }); assert.ok(b.root.textContent.includes("Automatischer Vorschlag: Microsoft Ignite – wartet auf die Bestätigung")); assert.equal(b.sels()[0].value, "microsoft-ignite");
  const c = await boot(MINE({ id: "microsoft-ignite", state: "rejected" }), { id: 2 }); assert.ok(c.root.textContent.includes("„Microsoft Ignite“ wurde abgelehnt")); assert.equal(c.sels()[0].value, "");
});
test("Ohne eigene Events (und kein Admin) oder ohne Event-Entitaeten bleibt der Bereich leer; ohne Anmeldung ebenfalls", async () => {
  assert.equal((await boot({ "/api/events/mine": { events: [] }, "/api/events/entity": { entities: ENTS } }, { id: 2 })).root.childNodes.length, 0);
  assert.equal((await boot({ ...MINE({ id: "", state: "" }), "/api/events/entity": { entities: [] } }, { id: 2 })).root.childNodes.length, 0);
  assert.equal((await boot(MINE({ id: "", state: "" }), null)).root.childNodes.length, 0);
});
test("Admin: offene Zuordnung bestaetigen, anders zuordnen, ablehnen; bestaetigte aendern oder entfernen", async () => {
  const admin = { "/api/events/mine": { events: [] }, "/api/events/entity": { entities: ENTS },
    "/api/admin/events/entity": { entities: ENTS, open: 2, items: [{ id: 7, handle: "ignite-2026", title: "Microsoft Ignite 2026", start: "2026-11-17", public: true, entity: "microsoft-ignite", entity_name: "Microsoft Ignite", state: "suggested", how: "name" },
      { id: 8, handle: "x", title: "Comms Berlin", start: "2026-12-01", public: false, entity: "comms-vnext", entity_name: "Comms vNext", state: "proposed", how: "" }],
      confirmed: [{ id: 5, handle: "ignite-2025", title: "Microsoft Ignite 2025", start: "2025-11-18", public: true, entity: "microsoft-ignite", entity_name: "Microsoft Ignite", state: "confirmed" }] } };
  const { root, btn, posts, sels } = await boot(admin, { id: 1, admin: true });
  assert.ok(root.textContent.includes("Admin: Event-Reihen") && root.textContent.includes("Name passt") && root.textContent.includes("Wunsch des Veranstalters") && root.textContent.includes("nicht öffentlich"));
  btn("Bestätigen")[0].click(); await tick(); assert.deepEqual(posts.at(-1), { path: "/api/admin/events/entity", body: { id: 7, action: "confirm", entity: "microsoft-ignite" } });   // der Auswahlwert (hier der Vorschlag) wird mitgesendet: wer die Auswahl aendert und "Bestaetigen" klickt, bestaetigt die neue
  await tick(); await tick();
  btn("Ablehnen")[1].click(); await tick(); assert.deepEqual(posts.at(-1).body, { id: 8, action: "reject" });
  await tick(); await tick();
  const s = sels().find((x) => x.value === "comms-vnext"); s.value = "microsoft-ignite"; btn("Anders zuordnen")[1].click(); await tick(); assert.deepEqual(posts.at(-1).body, { id: 8, action: "set", entity: "microsoft-ignite" });
  await tick(); await tick();
  btn("Entfernen")[0].click(); await tick(); assert.deepEqual(posts.at(-1).body, { id: 5, action: "clear" });
});
test("events-entity.js: deutsche und englische Texte haben dieselben Schluessel; die englischen stehen in data/ui_js_en.json", () => {
  let seen; const M365L = (de, key, a, b) => { seen = { key, a, b }; return a; };
  const root = new El("div"); vm.runInContext(JS, vm.createContext({ window: { M365L, M365X: { api: "https://api.test", lang: "de" } }, document: { createElement: (t) => new El(t), getElementById: () => root }, fetch: async () => new Response("{}"), Date, Object, JSON, Math, Promise }));
  assert.equal(seen.key, "events-entity.Q"); assert.deepEqual(Object.keys(seen.a).sort(), Object.keys(seen.b).sort());
  assert.deepEqual({ ...seen.b }, JSON.parse(readFileSync(new URL("../../data/ui_js_en.json", import.meta.url), "utf8"))["events-entity.Q"]);
});
