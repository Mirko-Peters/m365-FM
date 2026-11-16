// tools/crp_live.mjs: Kennzahlen, LCP-Element (beide Ablagen von Lighthouse 12), Phasen, Layout-Verschiebungen, Einsparungen.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { analyse, firstNode, lcpPhases } from "../tools/crp_live.mjs";

const lh = (over = {}) => ({
  categories: { performance: { score: 0.83 } },
  audits: {
    "first-contentful-paint": { numericValue: 1500 }, "largest-contentful-paint": { numericValue: 4000 },
    "total-blocking-time": { numericValue: 0 }, "cumulative-layout-shift": { numericValue: 0.123 }, "speed-index": { numericValue: 2100 },
    "server-response-time": { numericValue: 45 }, "total-byte-weight": { numericValue: 512000 }, "dom-size": { numericValue: 900 },
    "network-requests": { details: { items: [{ url: "https://www.m365.fm/a.woff2", transferSize: 20000, resourceType: "Font", priority: "High", networkRequestTime: 10, networkEndTime: 90 },
      { url: "https://cdn.example/cover.jpg", transferSize: 300000, resourceType: "Image" }] } },
    "largest-contentful-paint-element": { details: { type: "list", items: [
      { type: "table", items: [{ node: { type: "node", selector: "img.cover", snippet: "<img class=\"cover\">" } }] },
      { type: "table", items: [{ phase: "TTFB", timing: 45 }, { phase: "Load Delay", timing: 300 }] }] } },
    "layout-shifts": { details: { items: [{ score: 0.1, node: { type: "node", selector: "div#box", snippet: "<div id=\"box\">" } }] } },
    "uses-responsive-images": { id: "uses-responsive-images", score: 0.4, displayValue: "Est savings of 250 KiB", details: { overallSavingsBytes: 256000, overallSavingsMs: 600 } },
    ...over,
  },
});

test("firstNode findet das Element in Liste-mit-Tabelle und direkt", () => {
  assert.equal(firstNode(lh().audits["largest-contentful-paint-element"].details).selector, "img.cover");
  assert.equal(firstNode({ items: [{ node: { snippet: "<p>", selector: "p" } }] }).selector, "p");
  assert.equal(firstNode({ items: [] }), null);
});

test("lcpPhases liest die Phasen-Tabelle", () => {
  assert.deepEqual(lcpPhases(lh().audits["largest-contentful-paint-element"]), ["TTFB 45 ms", "Load Delay 300 ms"]);
});

test("analyse: Tabelle mit allen Kennzahlen, Median, LCP-Element, Verschiebungen, Einsparungen", () => {
  const dir = mkdtempSync(join(tmpdir(), "crp-"));
  writeFileSync(join(dir, "mobile__%2Fshow%2F__1.json"), JSON.stringify(lh()));
  writeFileSync(join(dir, "mobile__%2Fshow%2F__2.json"), JSON.stringify(lh({ "cumulative-layout-shift": { numericValue: 0.2 } })));
  writeFileSync(join(dir, "mobile__%2Fshow%2F__3.json"), "kaputt");
  const md = analyse(dir);
  assert.match(md, /\| mobile \/show\/ \| 83 \| 1500 \| 4000 \| 0 \| 0\.200 \| 2100 \| 45 \| 500 \| 2 \| 900 \|/);
  assert.match(md, /LCP-Element: `img\.cover <img class="cover">`/);
  assert.match(md, /LCP-Phasen: TTFB 45 ms, Load Delay 300 ms/);
  assert.match(md, /Layout-Verschiebungen \(groesste\): 0\.100 div#box/);
  assert.match(md, /uses-responsive-images: Est savings of 250 KiB, ~600 ms, ~250 KB/);
  assert.match(md, /Groesste Dateien: cdn\.example\/cover\.jpg 293 KB \(Image\)/);
});

test("analyse: fehlende Werte als Strich, kein Absturz", () => {
  const dir = mkdtempSync(join(tmpdir(), "crp-"));
  writeFileSync(join(dir, "desktop__%2F__1.json"), JSON.stringify({ audits: {} }));
  const md = analyse(dir);
  assert.match(md, /\| desktop \/ \| – \| – \| – \| – \| – \|/);
  assert.match(md, /LCP-Element: `nicht ermittelt`/);
});

test("analyse: ohne LCP-Element und Verschiebungen steht der Grund dabei, Insight-Audits werden gelesen", () => {
  const dir = mkdtempSync(join(tmpdir(), "crp-"));
  const j = lh();
  j.audits["largest-contentful-paint-element"] = { scoreDisplayMode: "error", errorMessage: "NO_LCP" };
  j.audits["layout-shifts"] = { scoreDisplayMode: "notApplicable" };
  j.audits["cls-culprits-insight"] = { details: { items: [{ score: 0.3, node: { selector: "ul.tabs", snippet: "<ul>" } }] } };
  writeFileSync(join(dir, "desktop__%2Fcommunity%2F__1.json"), JSON.stringify(j));
  const md = analyse(dir);
  assert.match(md, /LCP-Element: `nicht ermittelt` \(Audits: largest-contentful-paint-element=error \(NO_LCP\)/);
  assert.match(md, /Layout-Verschiebungen \(groesste\): 0\.300 ul\.tabs/);
});
