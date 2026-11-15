// assets/search.js (#156): nur Suchen, bei denen die Eingabe steht, tragen c=1 (die API zaehlt nur diese). Zwischenstaende beim Tippen zaehlen nicht.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const SRC = readFileSync(new URL("../assets/search.js", import.meta.url), "utf8");

function page(search = "") {
  const sent = [], timers = new Map(); let now = 0, nextId = 1;
  const el = () => { const h = {}; return { innerHTML: "", dataset: {}, addEventListener: (t, f) => { h[t] = f; }, fire: (t, e) => h[t](e), h }; };
  const box = el(), fa = el(), out = el(), form = el(), input = el();
  box.dataset.cfg = JSON.stringify({ api: "https://api-dub.m365.fm", lang: "de" });
  box.querySelector = (s) => (s === ".srch-fa" ? fa : out);
  input.value = "";
  const ctx = {
    document: { getElementById: (id) => (id === "srch" ? box : input), querySelector: () => form },
    location: { search, pathname: "/de/search/" }, history: { replaceState() {} }, URLSearchParams,
    fetch: (url, init) => { sent.push({ url: new URL(url), init }); return Promise.resolve({ ok: true, json: async () => ({ total: 0, results: [], facets: {} }) }); },
    setTimeout: (f, ms) => { const id = nextId++; timers.set(id, { f, at: now + ms }); return id; },
    clearTimeout: (id) => timers.delete(id),
  };
  vm.runInNewContext(SRC, ctx);
  const tick = (ms) => { now += ms; for (const [id, t] of [...timers].sort((a, b) => a[1].at - b[1].at)) if (t.at <= now) { timers.delete(id); t.f(); } };
  const type = (v, pause) => { input.value = v; input.fire("input", {}); tick(pause); };
  const counted = () => sent.filter((x) => x.url.searchParams.get("c") === "1").map((x) => x.url.searchParams.get("q"));
  return { sent, type, tick, counted, form, out, input };
}

test("Tippen: Zwischenstaende werden gesucht, aber nicht gezaehlt; nach 1,5 s Pause einmal gezaehlt", () => {
  const p = page();
  p.type("sharepoint onl", 400);
  p.type("sharepoint online", 400);
  assert.deepEqual(p.sent.map((x) => x.url.searchParams.get("q")), ["sharepoint onl", "sharepoint online"], "Suche beim Tippen");
  assert.deepEqual(p.counted(), [], "Zwischenstaende zaehlen nicht");
  p.tick(1200);
  assert.deepEqual(p.counted(), ["sharepoint online"], "Tipppause: der fertige Begriff zaehlt");
  assert.equal(p.sent.at(-1).init.keepalive, true);
  p.tick(5000); p.out.fire("click", { target: { closest: (s) => (s === "a" ? {} : null) } });
  assert.deepEqual(p.counted(), ["sharepoint online"], "Trefferklick nach der Pause: nicht doppelt");
  p.type("max.mustermann", 400);
  p.type("max.mustermann@contoso.com", 5000);
  assert.deepEqual(p.counted().filter((q) => q.startsWith("max")), ["max.mustermann@contoso.com"], "der Teil vor dem @ zaehlt nicht; die ganze Adresse verwirft die API (searchTerm)");
});

test("Absenden, Adresse mit q, Trefferklick und Mehr zaehlen", () => {
  const p = page("?q=copilot%20studio");
  assert.deepEqual(p.counted(), ["copilot studio"], "Adresse mit q");
  p.input.value = "purview"; p.form.fire("submit", { preventDefault() {} });
  assert.deepEqual(p.counted(), ["copilot studio", "purview"], "Absenden");
  p.type("teams rooms", 400);
  p.out.fire("click", { target: { closest: (s) => (s === "a" ? {} : null) } });
  assert.deepEqual(p.counted(), ["copilot studio", "purview", "teams rooms"], "Trefferklick vor der Pause");
  p.tick(5000);
  assert.equal(p.counted().length, 3, "danach nicht noch einmal");
  p.type("entra", 400);
  p.out.fire("click", { target: { closest: (s) => (s === "[data-more]" ? {} : null) } });
  assert.deepEqual(p.counted().at(-1), "entra", "Mehr");
  assert.equal(p.sent.at(-1).url.searchParams.get("page"), "2");
});
