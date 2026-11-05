import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

class Element {
  constructor(tag) {
    this.tagName = tag;
    this.children = [];
    this.attributes = {};
    this.listeners = {};
    this.classList = { toggle() {} };
  }
  set textContent(value) { this._text = String(value); this.children = []; }
  get textContent() { return this._text || this.children.map((child) => child.textContent).join(""); }
  setAttribute(key, value) { this.attributes[key] = String(value); }
  removeAttribute(key) { delete this.attributes[key]; }
  appendChild(child) { this.children.push(child); return child; }
  insertBefore(child, before) {
    const index = this.children.indexOf(before);
    this.children.splice(index < 0 ? this.children.length : index, 0, child);
    return child;
  }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  click() { this.listeners.click?.({ preventDefault() {} }); }
  querySelectorAll(selector) {
    return this.children.flatMap((child) => [
      ...(selector === '[role="tab"]' && child.attributes.role === "tab" ? [child] : []),
      ...child.querySelectorAll(selector),
    ]);
  }
}

test("sponsor dashboard: CSV enthält Quelle, Messart, Datenstand und entschärft Formelzellen", async () => {
  const root = new Element("main"), blobs = [];
  const metrics = [
    ["people_reached", "estimated", "Cross-channel estimate"],
    ["podcast_plays", "measured", "Spreaker API"],
    ["video_views", "measured", "YouTube Analytics API"],
    ["page_views", "measured", "Cloudflare analytics"],
    ["link_clicks", "measured", "M365.FM link counter"],
    ["project_requests", "measured", "Sponsor profile requests"],
    ["ai_citations", "manual", "Bing AI Performance export"],
    ["search_impressions", "measured", "Google Search Console"],
  ].map(([key, kind, source]) => ({ key, kind, source, value: null, as_of: null }));
  metrics[1] = { key: "podcast_plays", kind: "measured", source: "Spreaker API", value: 42, as_of: "2026-11-04" };
  const document = {
    getElementById: () => root,
    createElement: (tag) => new Element(tag),
    createTextNode: (text) => ({ textContent: String(text), children: [], querySelectorAll: () => [] }),
  };
  const config = {
    api: "https://api.example", base: "https://www.m365.fm", lang: "en", today: "2026-11-04", view: "overview",
    urls: { dashboard: "https://www.m365.fm/sponsor/dashboard/", placement: "https://www.m365.fm/sponsor/dashboard/placement/", report: "https://www.m365.fm/sponsor/dashboard/report/", sources: "https://www.m365.fm/sponsor/dashboard/sources/" },
    campaigns: [], copy: Object.fromEntries([
      "dashboard", "placement_view", "report_view", "sources_view", "key_figures", "reach_week", "weekly_no_data",
      "placements", "placement", "channel", "period", "period_30", "period_campaign", "period_year", "company",
      "type", "as_of", "source", "measured", "estimated", "manual", "unavailable", "status", "event_partner",
      "attendees", "source_events", "source_reach", "source_spreaker", "source_youtube", "source_cloudflare",
      "source_counter", "source_directory", "source_bing", "source_gsc", "no_placements", "no_orgs", "csv",
      "report_title", "how_count", "confirmed", "pending", "ended", "signin", "login", "error", "impressions",
      "clicks", "downloads", "source_no_data", "as_of", "company"
    ].map((key) => [key, key])),
  };
  config.copy.csv = "Export CSV";
  config.copy.people_reached = "People reached";
  config.copy.podcast_plays = "Podcast plays";
  config.copy.video_views = "Video views";
  config.copy.page_views = "Page views";
  config.copy.link_clicks = "Clicks";
  config.copy.project_requests = "Requests";
  config.copy.ai_citations = "AI citations";
  config.copy.search_impressions = "Search impressions";
  config.copy.as_of = "As of";
  config.copy.no_date = "No data date";
  config.copy.source_events = "Event registration records";
  config.copy.source_reach = "Cross-channel estimate";
  config.copy.source_spreaker = "Spreaker";
  config.copy.source_youtube = "YouTube";
  config.copy.source_cloudflare = "Cloudflare";
  config.copy.source_counter = "Link counter";
  config.copy.source_directory = "Sponsor requests";
  config.copy.source_bing = "Bing AI";
  config.copy.source_gsc = "Google Search Console";
  const originalUrl = URL;
  originalUrl.createObjectURL = (blob) => { blobs.push(blob); return "blob:csv"; };
  originalUrl.revokeObjectURL = () => {};
  const context = {
    window: { M365SP: config }, document, URL: originalUrl, URLSearchParams, Blob, Intl, Date,
    console,
    location: { origin: "https://www.m365.fm", search: "" },
    fetch: async () => ({ status: 200, json: async () => ({ orgs: [{
      handle: "acme", name: "=1+1", website: "", metrics,
      placements: [
        { type: "event_partner", title: "Future partner event", status: "pending", start: "2027-01-01", end: "2027-01-02" },
        { type: "event_partner", title: "Undated placement", status: "pending", start: null, end: null, attendees: null }
      ]
    }] }) }),
  };
  vm.runInNewContext(readFileSync(new URL("../../assets/sponsor-dashboard.js", import.meta.url), "utf8"), context);
  await new Promise((resolve) => setImmediate(resolve));
  const findButton = (element) => {
    if (element.tagName === "button" && element.textContent === "Export CSV") return element;
    for (const child of element.children) { const result = findButton(child); if (result) return result; }
    return null;
  };
  const button = findButton(root);
  assert.ok(button, "Export-Schaltfläche wird gerendert: " + root.textContent);
  assert.doesNotMatch(root.textContent, /Future partner event/, "zukünftige Platzierungen erscheinen nicht in den letzten 30 Tagen");
  assert.match(root.textContent, /Undated placement/, "Platzierungen ohne Datum bleiben sichtbar und werden nicht als zukünftige gewertet");
  assert.doesNotMatch(root.textContent, /No data date/, "Kennzahlen ohne Wert zeigen keinen Datenstand");
  button.click();
  assert.equal(blobs.length, 1);
  const csv = await blobs[0].text();
  assert.match(csv, /source/);
  assert.match(csv, /type/);
  assert.match(csv, /As of/);
  assert.match(csv, /"'\=1\+1"/);
  assert.match(csv, /"42","Spreaker","measured","2026-11-04"/);
});

test("sponsor dashboard: gebuchte Werbeplätze mit Einblendungen, Klicks, Klickrate und Leads (#281)", async () => {
  const root = new Element("main");
  const document = { getElementById: () => root, createElement: (tag) => new Element(tag),
    createTextNode: (text) => ({ textContent: String(text), children: [], querySelectorAll: () => [] }) };
  const copy = new Proxy({ ads_title: "Booked ad placements", ads_ctr: "Click rate", ads_leads: "Leads" }, { get: (t, k) => t[k] ?? String(k) });
  const config = { api: "https://api.example", base: "https://www.m365.fm", lang: "en", today: "2026-11-05", view: "overview",
    urls: { dashboard: "/d/", placement: "/d/p/", report: "/d/r/", sources: "/d/s/" }, campaigns: [], copy };
  const context = { window: { M365SP: config }, document, URL, URLSearchParams, Blob, Intl, Date, console, location: { origin: "https://www.m365.fm", search: "" },
    fetch: async () => ({ status: 200, json: async () => ({ orgs: [{ handle: "contoso", name: "Contoso", metrics: [], placements: [],
      ads: [{ code: "ad-abc12345", product: "banner_mid", impressions: 1200, clicks: 18, ctr: 1.5, leads: 0, delivered: 1200, quantity: 10000, status: "active" }] }] }) }) };
  vm.runInNewContext(readFileSync(new URL("../../assets/sponsor-dashboard.js", import.meta.url), "utf8"), context);
  await new Promise((resolve) => setImmediate(resolve));
  assert.match(root.textContent, /Booked ad placements/);
  assert.match(root.textContent, /ad-abc12345 · banner_mid/);
  assert.match(root.textContent, /1,200/);
  assert.match(root.textContent, /1\.5 %/);
  assert.match(root.textContent, /1200 \/ 10000/);
});
