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

// Lighthouse 13 (ab 13.0): largest-contentful-paint-element, critical-request-chains, dom-size, render-blocking-resources,
// uses-responsive-images usw. sind entfernt; die Werte stehen in Insight-Audits (Aufbau wie in einem echten 13.6.0-Lauf).
const lh13 = () => ({
  lighthouseVersion: "13.6.0",
  environment: { hostUserAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/146.0.0.0 Safari/537.36" },
  categories: { performance: { score: 0.9 } },
  audits: {
    "first-contentful-paint": { numericValue: 1200 }, "largest-contentful-paint": { numericValue: 2500 },
    "total-blocking-time": { numericValue: 10 }, "cumulative-layout-shift": { numericValue: 0.05 }, "speed-index": { numericValue: 1800 },
    "server-response-time": { numericValue: 30 }, "total-byte-weight": { numericValue: 102400 },
    "network-requests": { details: { items: [{ url: "https://www.m365.fm/", transferSize: 10240, resourceType: "Document" }] } },
    "lcp-breakdown-insight": { id: "lcp-breakdown-insight", score: 1, scoreDisplayMode: "informative", details: { type: "list", items: [
      { type: "table", items: [{ subpart: "timeToFirstByte", label: "Time to first byte", duration: 30.4 }, { subpart: "elementRenderDelay", label: "Element render delay", duration: 210.6 }] },
      { type: "node", selector: "body > main > h1", snippet: "<h1 class=\"t\">" }] } },
    "lcp-discovery-insight": { id: "lcp-discovery-insight", score: 0, scoreDisplayMode: "numeric", numericValue: 0, numericUnit: "millisecond", details: { type: "list", items: [
      { type: "checklist", items: { priorityHinted: { label: "fetchpriority=high should be applied", value: false }, eagerlyLoaded: { label: "LCP resources shouldn’t use loading=lazy", value: true } } },
      { type: "node", selector: "body > main > h1", snippet: "<h1 class=\"t\">" }] } },
    "layout-shifts": { details: { type: "table", items: [{ node: { type: "node", selector: "body > main", snippet: "<main>" }, score: 0.05 }] } },
    "dom-size-insight": { id: "dom-size-insight", score: 1, numericValue: 812, numericUnit: "element" },
    "network-dependency-tree-insight": { id: "network-dependency-tree-insight", score: 1, details: { type: "list", items: [
      { type: "list-section", value: { type: "network-tree", longestChain: { duration: 640 }, chains: {
        A: { url: "https://www.m365.fm/", navStartToEndTime: 120, transferSize: 10240, children: {
          B: { url: "https://www.m365.fm/s.css", navStartToEndTime: 640, transferSize: 20480, children: {} } } } } } },
      { type: "list-section", title: "Preconnected origins", value: { type: "text", value: "No origins were preconnected" } }] } },
    "render-blocking-insight": { id: "render-blocking-insight", score: 0, scoreDisplayMode: "metricSavings", numericValue: 300, numericUnit: "millisecond",
      displayValue: "Est savings of 300 ms", details: { type: "table", items: [{ url: "https://www.m365.fm/s.css", totalBytes: 20480, wastedMs: 300 }] } },
    "image-delivery-insight": { id: "image-delivery-insight", score: 0.5, scoreDisplayMode: "metricSavings", numericValue: 51200, numericUnit: "byte", displayValue: "Est savings of 50 KiB", details: { type: "table", items: [] } },
  },
});

test("analyse: Lighthouse 13 (Insight-Audits) liefert LCP-Element, Phasen, DOM, Kette, Renderblockierend, Einsparungen", () => {
  const dir = mkdtempSync(join(tmpdir(), "crp-"));
  writeFileSync(join(dir, "mobile__%2F__1.json"), JSON.stringify(lh13()));
  const md = analyse(dir);
  assert.match(md, /Messung mit Lighthouse 13\.6\.0, HeadlessChrome\/146\.0\.0\.0/);
  assert.match(md, /\| mobile \/ \| 90 \| 1200 \| 2500 \| 10 \| 0\.050 \| 1800 \| 30 \| 100 \| 1 \| 812 \| 640 \|/);
  assert.match(md, /LCP-Element: `body > main > h1 <h1 class="t">`/);
  assert.match(md, /LCP-Phasen: Time to first byte 30 ms, Element render delay 211 ms/);
  assert.match(md, /Layout-Verschiebungen \(groesste\): 0\.050 body > main <main>/);
  assert.match(md, /- \/ 10 KB, ende 120 ms\n  - \/s\.css 20 KB, ende 640 ms/);
  assert.match(md, /Renderblockierend: \/s\.css \(300 ms\)/);
  assert.match(md, /render-blocking-insight: Est savings of 300 ms, ~300 ms/);
  assert.match(md, /image-delivery-insight: Est savings of 50 KiB, ~50 KB/);
  assert.match(md, /lcp-discovery-insight: offen: fetchpriority=high should be applied/);
  assert.match(md, /Preload-Vorschlaege: – \(Audit in dieser Lighthouse-Fassung nicht vorhanden\)/);
});

test("lcpPhases liest auch die Lighthouse-13-Tabelle (subpart/duration)", () => {
  assert.deepEqual(lcpPhases(lh13().audits["lcp-breakdown-insight"]), ["Time to first byte 30 ms", "Element render delay 211 ms"]);
});
