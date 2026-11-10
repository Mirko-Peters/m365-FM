// Verwaltung -> Uebersetzungen: neue Arten (Blog-Artikel, Entitaeten in allen Sprachen, Video-Artikel), Kacheln nach Art, Vormerken nur wo es geht.
// assets/admin.js laeuft in node:vm mit dem Schein-DOM; die Antwort kommt vom echten Handler (handleAdminPanel) mit einer Schein-Datenbank und einer
// translation-status.json, wie site_trstatus.py sie schreibt (Felder k, id, t, lang, langs, optional fl).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { handleAdminPanel } from "../src/adminpanel.js";
import { fakeDom } from "./fixtures/fake_dom.mjs";

const ADMIN_JS = readFileSync(new URL("../../assets/admin.js", import.meta.url), "utf8");
const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
const LANGS = ["de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko"];

const ROWS = [
  { k: "lblog", id: "post-a", t: "Post A", lang: "en", langs: ["de", "fr"] },
  { k: "lblog", id: "content/post-b", t: "Post B", lang: "en", langs: ["de"] },
  { k: "lblog", id: "post-c", t: "Post C", lang: "en", langs: [] },
  { k: "notes", id: "ep-1", t: "Episode 1", lang: "en", langs: ["de"] },
  { k: "entity", id: "teams", t: "Teams", lang: "en", langs: ["de", "fr", "ja"] },
  { k: "entity", id: "intune", t: "Intune", lang: "en", langs: ["de"] },
  { k: "entity", id: "purview", t: "Purview", lang: "de", langs: [] },
  { k: "article", id: "VID1", t: "Video eins", lang: "en", langs: ["de", "fr", "ja"] },
  { k: "article", id: "VID2", t: "Video zwei", lang: "en", langs: ["de"], fl: ["ja"] },
];

function fakeDb(queue = []) {
  return { prepare(sql) {
    const o = { bind() { return o; }, all: async () => ({ results: /FROM tr_queue/.test(sql) ? queue : [] }), first: async () => null, run: async () => ({ meta: { changes: 0 } }) };
    return o;
  }, async batch() {} };
}

async function boot(queue = []) {
  const { root, document } = fakeDom(), calls = [];
  const env = { DB: fakeDb(queue), SITE: "https://site.test", SESSION_SECRET: "x" };
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async (url) => { assert.match(String(url), /translation-status\.json$/); return J({ generated: "2026-11-10", langs: LANGS, rows: ROWS }); };
  const fetch = async (url, o = {}) => {
    const u = new URL(url); calls.push({ path: u.pathname, method: o.method || "GET", body: o.body ? JSON.parse(o.body) : null });
    const req = new Request(u, { method: o.method || "GET", headers: o.headers, body: o.body });
    return (await handleAdminPanel(env, req, u, u.pathname, { id: 1, admin: true }, J)) || J({ error: "not_found" }, 404);
  };
  const ctx = vm.createContext({ window: { M365ADM: { api: "https://api.test", base: "" }, confirm: () => true, prompt: () => "" }, document, location: { hash: "#tr" }, fetch, setTimeout });
  vm.runInContext(ADMIN_JS, ctx, { filename: "assets/admin.js" });
  const pane = () => root.all("section").find((s) => s.querySelector("h2")?.textContent === "Übersetzungen nach Sprache");
  for (let i = 0; i < 400; i++) { if (pane()?.querySelectorAll("tbody tr").length > 1) break; await new Promise((r) => setTimeout(r, 2)); }
  return { root, calls, pane, done: () => { globalThis.fetch = oldFetch; } };
}
const tiles = (p) => p.querySelector(".adm-sum").children.map((d) => d.children[0].textContent + " " + d.textContent.replace(d.children[0].textContent, ""));
const tile = (p, name) => p.querySelector(".adm-sum").children.find((d) => d.textContent.includes(name)).textContent;
const select = (p, label) => p.all("select").find((s) => s.getAttribute("aria-label") === label);
const bodyRows = (p) => p.querySelector("tbody").children;
const tick = () => new Promise((r) => setTimeout(r, 5));

test("Uebersetzungen: Filter kennt die neuen Arten, Beschriftungen stehen auf Deutsch", async () => {
  const { pane, done } = await boot();
  try {
    const kinds = select(pane(), "Art").all("option").map((o) => [o.value, o.textContent]);
    assert.deepEqual(kinds.slice(0, 1), [["", "Alle Arten"]]);
    for (const k of ["lblog", "notes", "entity", "article"]) assert.ok(kinds.some(([v]) => v === k), "Art " + k);
    assert.equal(kinds.find(([v]) => v === "lblog")[1], "Blog-Artikel");
    assert.equal(kinds.find(([v]) => v === "article")[1], "Video-Artikel");
  } finally { done(); }
});

test("Uebersetzungen: Kacheln zaehlen alle Arten, nach Filter nur die gewaehlte Art", async () => {
  const { pane, done } = await boot();
  try {
    const p = pane();
    assert.equal(p.querySelector(".adm-sum").children.length, 14);
    // Alle Arten: Deutsch = Zeilen, deren Quelle nicht Deutsch ist (purview ist deutsch = Quelle, zaehlt nicht): 8 Zeilen, fertig post-a, post-b, ep-1, teams, intune, VID1, VID2 = 7
    assert.match(tile(p, "Deutsch"), /^7 \/ 8Deutsch/);
    assert.match(tile(p, "Französisch"), /^3 \/ 9Französisch/);   // post-a, teams, VID1 fertig, kein Quellsprachen-Abzug
    const kf = select(p, "Art"); kf.value = "lblog"; kf.fire("change"); await tick();
    assert.match(tile(p, "Deutsch"), /^2 \/ 3Deutsch.*1 fehlen/);
    assert.match(tile(p, "Französisch"), /^1 \/ 3Französisch.*2 fehlen/);
    kf.value = "article"; kf.fire("change"); await tick();
    assert.match(tile(p, "Deutsch"), /^2 \/ 2Deutsch/);
    assert.match(tile(p, "Japanisch"), /^1 \/ 2Japanisch.*1 fehlgeschlagen/, "gesperrte Sprache wird gezaehlt, aber getrennt gezeigt");
    kf.value = "entity"; kf.fire("change"); await tick();
    assert.match(tile(p, "Französisch"), /^1 \/ 3Französisch/);
    assert.match(tile(p, "Japanisch"), /^1 \/ 3Japanisch/);
    assert.equal(bodyRows(p).length, 3);
  } finally { done(); }
});

test("Uebersetzungen: Hinweis je Art, Video-Artikel nicht klickbar, Blog-Artikel vormerkbar", async () => {
  const { pane, calls, done } = await boot();
  try {
    const p = pane(), kf = select(p, "Art");
    kf.value = "article"; kf.fire("change"); await tick();
    assert.match(p.all("p").map((x) => x.textContent).join("\n"), /Video-Artikel: Englisch zuerst .* Nicht vormerkbar/);
    const row2 = bodyRows(p).find((tr) => tr.children[0].textContent === "Video zwei");
    assert.equal(row2.children[1].textContent, "Video-Artikel");
    assert.equal(row2.all("button").length, 0, "keine Schaltflaechen in Video-Artikel-Zeilen");
    const chips = row2.all("span.adm-chip");
    assert.ok(chips.length >= 12);
    assert.match(chips.find((c) => c.textContent === "!").getAttribute("title"), /gesperrt.*Nicht vormerkbar/, "Grund steht am Chip");
    assert.match(chips.find((c) => c.textContent === "–").getAttribute("title"), /Nicht vormerkbar/);
    // Sammel-Vormerken: nichts wird gesendet, Hinweis mit Grund
    const lf = select(p, "Sprache"); lf.value = "fr"; lf.fire("change"); await tick();
    const bulk = p.all("button").find((b) => b.textContent === "Alle gefilterten vormerken"); bulk.fire("click"); await tick();
    assert.match(p.querySelector(".adm-msg").textContent, /Nicht vormerkbar/);
    assert.equal(calls.filter((c) => c.path === "/api/admin/panel/tr-queue").length, 0);
    // Blog-Artikel: Chips sind Schaltflaechen und senden die Art lblog mit dem Slug (auch content/...)
    kf.value = "lblog"; kf.fire("change"); await tick();
    const rowB = bodyRows(p).find((tr) => tr.children[0].textContent === "Post B");
    assert.ok(rowB.all("button").length > 0);
    bulk.fire("click"); await tick(); await tick();
    const post = calls.find((c) => c.path === "/api/admin/panel/tr-queue");
    assert.ok(post, "Blog-Artikel lassen sich vormerken");
    assert.deepEqual(post.body.items.map((i) => i.id).sort(), ["content/post-b", "post-c"]);
    assert.ok(post.body.items.every((i) => i.kind === "lblog" && i.lang === "fr"));
  } finally { done(); }
});

test("Uebersetzungen: Worker reicht fl durch und nimmt article nicht ins Vormerken", async () => {
  const env = { DB: fakeDb(), SITE: "https://site.test" }, old = globalThis.fetch;
  globalThis.fetch = async () => J({ langs: LANGS, rows: ROWS });
  try {
    const u = new URL("https://api.test/api/admin/panel/translations");
    const r = await (await handleAdminPanel(env, new Request(u), u, u.pathname, { id: 1, admin: true }, J)).json();
    assert.deepEqual(r.rows.find((x) => x.id === "VID2").fl, ["ja"]);
    assert.equal(r.rows.find((x) => x.id === "VID1").fl, undefined);
    const u2 = new URL("https://api.test/api/admin/panel/tr-queue");
    const body = JSON.stringify({ items: [{ kind: "article", id: "VID1", lang: "ko" }, { kind: "lblog", id: "post-c", lang: "ko" }], on: true });
    const q = await (await handleAdminPanel(env, new Request(u2, { method: "POST", body }), u2, u2.pathname, { id: 1, admin: true }, J)).json();
    assert.equal(q.n, 1, "article wird vom Server verworfen, lblog angenommen");
  } finally { globalThis.fetch = old; }
});
