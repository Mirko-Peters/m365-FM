// assets/events-import.js in node:vm mit kleinem Schein-DOM: Fehler des Abgleichs, Ergebnis des Speaker-Imports, Zuruecknehmen automatischer Zusammenfuehrungen (#317).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const JS = readFileSync(new URL("../../assets/events-import.js", import.meta.url), "utf8");
class Text { constructor(t) { this.nodeType = 3; this.data = String(t); } get textContent() { return this.data; } }
class El {
  constructor(tag) { this.nodeType = 1; this.tagName = tag.toUpperCase(); this.attrs = {}; this.childNodes = []; this.listeners = {}; this.checked = false; this.value = ""; this.disabled = false; }
  setAttribute(k, v) { this.attrs[k] = String(v); if (k === "value") this.value = String(v); }   // wie im Browser: das Attribut ist der Startwert
  appendChild(c) { this.childNodes.push(c); return c; }
  get textContent() { return this.childNodes.map((n) => n.textContent).join(""); }
  set textContent(t) { this.childNodes = t ? [new Text(t)] : []; }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  click() { for (const fn of this.listeners.click || []) fn({ type: "click", target: this }); }
  all(pred) { const out = []; const walk = (n) => { for (const c of n.childNodes) if (c.nodeType === 1) { if (pred(c)) out.push(c); walk(c); } }; walk(this); return out; }
}
const tick = () => new Promise((r) => setTimeout(r, 5));
// routes: Pfad -> Antwort oder Funktion(body) -> [status, json]
async function boot(routes, me = { id: 1 }, search = "") {
  const root = new El("div"), posts = [];
  const fetch = async (url, o = {}) => {
    const path = new URL(url).pathname, body = o.body ? JSON.parse(o.body) : undefined;
    assert.equal(o.headers["x-requested-with"], "m365"); if (o.method === "POST") posts.push({ path, body });
    const r = path === "/api/me" ? { user: me } : typeof routes[path] === "function" ? routes[path](body, o.method || "GET") : routes[path] ?? {};
    const [status, data] = Array.isArray(r) ? r : [200, r];
    return new Response(JSON.stringify(data), { status });
  };
  const document = { createElement: (t) => new El(t), getElementById: (id) => (id === "c-events-import" ? root : null) };
  const window = { M365X: { api: "https://api.test", lang: "de" }, location: { search } };
  vm.runInContext(JS, vm.createContext({ window, document, fetch, Date, Object, JSON }), { filename: "assets/events-import.js" });
  for (let i = 0; i < 100 && !root.all((e) => e.tagName === "INPUT").length; i++) await tick();
  const btn = (text) => root.all((e) => e.tagName === "BUTTON" && e.textContent === text);
  return { root, posts, btn };
}
const MINE = { "/api/events/mine": { events: [{ handle: "mein-event", title: "Mein Event" }] }, "/api/event/mein-event/sessionize": { linked: true, synced: 0, state: "ok", sessions: 0 } };

test("events-import.js: ein gescheiterter Abgleich wird als Fehler gezeigt, nicht als 'Fertig' (317-11); Teilergebnis nennt den Rest", async () => {
  for (const answer of [[200, { ok: true, merged: 0, queued: 0, sync: { error: "bad_json" } }], [400, { error: "bad_json" }]]) {
    const { root, btn } = await boot({ ...MINE, "/api/event/mein-event/sessionize": (b, m) => (m === "POST" ? answer : MINE["/api/event/mein-event/sessionize"]) });
    btn("Verknüpfen und importieren")[0].click(); await tick(); await tick();
    assert.ok(root.textContent.includes("Das hat nicht geklappt"), JSON.stringify(answer)); assert.ok(!root.textContent.includes("✓ Fertig"));
  }
  const ok = await boot({ ...MINE, "/api/event/mein-event/sessionize": (b, m) => (m === "POST" ? { ok: true, sync: { ok: true, created: 100, updated: 0, merged: 2, remaining: 200, partial: true } } : { linked: true, synced: 0, state: "partial", sessions: 100 }) });
  ok.btn("Verknüpfen und importieren")[0].click(); await tick(); await tick();
  assert.ok(ok.root.textContent.includes("✓ Fertig. 100 neu, 0 geändert, 2 zusammengeführt. Weitere 200 Sessions folgen automatisch"), ok.root.textContent.slice(0, 600));
  assert.ok(ok.root.textContent.includes("Abgleich läuft noch"));
});
test("events-import.js: Speaker-Import nennt Vorschlaege und Anfragen statt 'bestaetigter Speaker' (317-07); Hinweis zum Uebernehmen eines Events (317-14)", async () => {
  const { root, btn, posts } = await boot({ "/api/events/mine": { events: [] },
    "/api/events/import/sessionize-profile/preview": { ok: true, token: "t1", items: [{ id: "0.0", event: "Hamburg Copilot Day", date: "2026-05-16", place: "Hamburg", session: "Talk A" }, { id: "0.1", event: "Hamburg Copilot Day", session: "Talk B" }] },
    "/api/events/import/sessionize-profile/confirm": { ok: true, events: 1, sessions: 0, proposed: 1, requested: 1, skipped: 0 } });
  assert.ok(root.textContent.includes("Das ist mein Event")); assert.ok(root.textContent.includes("keine Kurzvorstellung, kein Foto, keine Links"));
  btn("Sessions suchen")[0].click(); await tick(); await tick();
  btn("Ausgewählte übernehmen")[0].click(); await tick(); await tick();
  assert.deepEqual(posts.at(-1), { path: "/api/events/import/sessionize-profile/confirm", body: { token: "t1", items: ["0.0", "0.1"] } });
  const t = root.textContent; assert.ok(t.includes("0 Session(s) veröffentlicht") && t.includes("1 als Vorschlag an den Veranstalter") && t.includes("1 Speaker-Anfrage(n)"), t.slice(-400)); assert.ok(!t.includes("bestätigter Speaker"));
});
test("events-import.js: Einstieg zum Uebernehmen eines importierten Events (?claim=<handle> von der Event-Seite) sendet die Anfrage erst auf Klick (317-14)", async () => {
  const { root, btn, posts } = await boot({ "/api/events/mine": { events: [] }, "/api/event/hamburg-copilot-day-2026/claim": { ok: true, status: "pending" } }, { id: 1 }, "?claim=hamburg-copilot-day-2026");
  assert.ok(root.textContent.includes("Event übernehmen") && root.textContent.includes("„hamburg-copilot-day-2026“")); assert.equal(posts.length, 0);
  btn("Anfrage senden")[0].click(); await tick(); await tick();
  assert.deepEqual(posts, [{ path: "/api/event/hamburg-copilot-day-2026/claim", body: {} }]); assert.ok(root.textContent.includes("✓ Anfrage gesendet"));
  const bad = await boot({ "/api/events/mine": { events: [] } }, { id: 1 }, "?claim=<script>alert(1)</script>"); assert.ok(!bad.root.textContent.includes("Event übernehmen"));   // nur gueltige Adressen
  const gone = await boot({ "/api/events/mine": { events: [] }, "/api/event/weg/claim": [404, { error: "not_found" }] }, { id: 1 }, "?x=1&claim=weg");
  gone.btn("Anfrage senden")[0].click(); await tick(); await tick(); assert.ok(gone.root.textContent.includes("hat bereits einen Veranstalter"));
});
test("events-import.js: Admin sieht die letzten (auch automatischen) Zusammenfuehrungen und kann sie zuruecknehmen (317-12)", async () => {
  const { root, btn, posts } = await boot({ "/api/events/mine": { events: [] }, "/api/admin/events/claims": { items: [] },
    "/api/admin/events/dupes": { items: [], recent: [{ log: 7, kind: "event", auto: true, created: 1, from: "Hamburg Copilot Day 2026", into: "Hamburg Copilot Day" }, { log: 5, kind: "session", auto: false, created: 1, from: "Talk A!", into: "Talk A" }] },
    "/api/admin/events/unmerge": { ok: true, kind: "event" } }, { id: 1, admin: true });
  for (let i = 0; i < 50 && !btn("Rückgängig").length; i++) await tick();
  assert.ok(root.textContent.includes("Letzte Zusammenführungen") && root.textContent.includes("Hamburg Copilot Day 2026  →  Hamburg Copilot Day") && root.textContent.includes("automatisch"));
  assert.equal(btn("Rückgängig").length, 2); btn("Rückgängig")[0].click(); await tick();
  assert.deepEqual(posts.at(-1), { path: "/api/admin/events/unmerge", body: { log: 7 } });
});
test("events-import.js: deutsche und englische Texte haben dieselben Schluessel; die englischen stehen fuer die Uebersetzung in data/ui_js_en.json", () => {
  let seen; const M365L = (de, key, a, b) => { seen = { key, a, b }; return a; };
  const root = new El("div"), ctx = vm.createContext({ window: { M365L, M365X: { api: "https://api.test", lang: "de" } }, document: { createElement: (t) => new El(t), getElementById: () => root }, fetch: async () => new Response("{}"), Date, Object, JSON });
  vm.runInContext(JS, ctx);
  assert.equal(seen.key, "events-import.Q"); assert.deepEqual(Object.keys(seen.a).sort(), Object.keys(seen.b).sort());
  assert.deepEqual({ ...seen.b }, JSON.parse(readFileSync(new URL("../../data/ui_js_en.json", import.meta.url), "utf8"))["events-import.Q"]);
});
