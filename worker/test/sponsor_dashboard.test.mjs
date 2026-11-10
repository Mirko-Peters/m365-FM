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

// ---------------------------------------------------------------- Teil 3: echte/gefilterte Klicks, Land, Entitaeten, Beitraege, Suche, KI

async function renderOrg(org, extraConfig = {}, copyOverride = {}) {
  const root = new Element("main");
  const document = { getElementById: () => root, createElement: (tag) => new Element(tag),
    createTextNode: (text) => ({ textContent: String(text), children: [], querySelectorAll: () => [] }) };
  const copy = new Proxy({ ...copyOverride }, { get: (t, k) => t[k] ?? String(k) });   // fehlender Text = Schluessel, so sieht man jeden Baustein
  const config = { api: "https://api.example", base: "https://www.m365.fm", lang: "en", today: "2026-11-30", view: "overview",
    urls: { dashboard: "/d/", placement: "/d/p/", report: "/d/r/", sources: "/d/s/" }, campaigns: [], copy, ...extraConfig };
  const context = { window: { M365SP: config }, document, URL, URLSearchParams, Blob, Intl, Date, console, location: { origin: "https://www.m365.fm", search: "" },
    fetch: async () => ({ status: 200, json: async () => ({ orgs: [org], period: { from: "2026-11-01", to: "2026-11-30" } }) }) };
  vm.runInNewContext(readFileSync(new URL("../../assets/sponsor-dashboard.js", import.meta.url), "utf8"), context);
  await new Promise((resolve) => setImmediate(resolve));
  return root.textContent;
}

test("sponsor dashboard: echte und gefilterte Klicks, Quote, Land, Entitaeten, Beitraege, Rankings und KI mit Quelle und Art", async () => {
  const metric = (m, dim, value, source = "gsc") => ({ day: "2026-11-06", metric: m, dim, value, source, kind: "measured", fetched_at: 1 });
  const org = { handle: "cognillo", name: "Cognillo", metrics: [], ads: [],
    click_quality: { real: 9, filtered: 7, as_of: "2026-11-06", source: "M365.FM-Linkzähler", kind: "measured", filter_kind: "estimated" },
    queries: [{ query: "sharepoint oversharing", page: "https://www.m365.fm/de/entity/oversharing/", clicks: 7, impressions: 200, position: 7.1, as_of: "2026-11-06", source: "Google Search Console", kind: "measured" }],
    placements: [{ id: "cog-web", title: "Cognillo Website", channel: "website", type: "website", start: "2026-11-01", end: "2026-12-31", manual: [],
      clicks: [{ surface: "entity", country: "DE", clicks: 6, clicks_filtered: 2, as_of: "2026-11-06" }, { surface: "newsletter", country: "XX", clicks: 0, clicks_filtered: 4, as_of: "2026-11-06" }],
      metrics: [metric("page_views", "/entity/cognillo/", 40, "cloudflare_rum"), metric("page_views", "/de/entity/cognillo/", 10, "cloudflare_rum"),
        metric("gsc_impressions", "https://www.m365.fm/entity/cognillo/", 500), metric("gsc_clicks", "https://www.m365.fm/entity/cognillo/", 12),
        metric("page_views", "/community/u/mirko-p/blog/post-a/", 25, "cloudflare_rum")] }] };
  const sp = { "cog-web": { entities: [{ id: "cognillo", name: "Cognillo", kind: "company" }, { id: "genta-automation", name: "Genta Automation", kind: "product" }, { id: "oversharing", name: "Oversharing", kind: "topic" }],
    posts: [{ path: "/community/u/mirko-p/blog/post-a/", title: "Post A", nr: 48, date: "2026-12-02", sponsored: true, status: "published" },
      { path: "/community/u/mirko-p/blog/post-b/", title: "Post B", nr: 49, date: "2026-12-03", sponsored: false, status: "planned" }] } };
  const siteAi = [{ label: "Bing AI Performance: Copilot", value: 1085805, unit: "citations", period: "2026-08-04 – 2026-11-02", kind: "manual", source: "Bing", retrieved: "2026-11-04" }];
  const t = await renderOrg(org, { sp, siteAi });
  // Klicks: echt, gefiltert, Quote (7 von 16 = 43,8 %), Schaetzung markiert
  assert.match(t, /clicks_real/); assert.match(t, /clicks_filtered/); assert.match(t, /43\.8 %/);
  assert.match(t, /filter_note/);
  assert.match(t, /Germany \(DE\)/); assert.match(t, /country_unknown/, "XX = unbekanntes Land");
  // Entitaeten: Name, Art, Summe ueber Sprachfassungen (40 + 10), Search-Console-Werte; nicht gemeldete Entitaeten mit Strich
  if (process.env.DUMP) console.log(t);
  assert.match(t, /Cognillokind_company50500\d*12/);
  assert.match(t, /Genta Automationkind_product–––––/, "ohne Zahlen steht ein Strich, keine erfundene Null");
  assert.match(t, /Oversharingkind_topic/);
  // Beitraege: veroeffentlicht mit Aufrufen, geplant ohne Zahlen
  assert.match(t, /48Post A.*post_published.*post_sponsored25/);
  assert.match(t, /49Post B.*post_planned–––/);
  // Rankings mit Position und Seite ohne Sprachpraefix
  assert.match(t, /sharepoint oversharing\/entity\/oversharing\/2007/);
  assert.match(t, /7\.1/);
  assert.match(t, /rankings_note/);
  // Bing-Suchbegriffe sind nicht angebunden; KI: Handeintrag der Website mit Art manual
  assert.match(t, /not_connected_yet/);
  assert.match(t, /1,085,805 citations/);
  assert.match(t, /Leads|leads_title/); assert.match(t, /leads_none/, "ohne gebuchtes Lead-Formular keine Lead-Zahl");
});

test("sponsor dashboard: ohne Daten steht 'noch nicht angebunden' statt Nullen oder erfundener Zahlen", async () => {
  const t = await renderOrg({ handle: "empty", name: "Empty", metrics: [], placements: [], ads: [] }, {}, { unavailable: "No data" });
  assert.match(t, /not_connected_yet/);
  assert.doesNotMatch(t, /posts_title/, "ohne Beitraege keine leere Beitragstabelle");
  assert.doesNotMatch(t, /\bNaN\b|undefined/);
  assert.doesNotMatch(t, /filtered_share[^a-z]*\d/, "ohne Klicks keine Quote");
  const withLead = await renderOrg({ handle: "l", name: "L", metrics: [], placements: [], click_quality: { real: 0, filtered: 0, as_of: null },
    ads: [{ code: "ad-x", product: "lead_form", impressions: 10, clicks: 1, ctr: 10, leads: 3, delivered: 3, quantity: 10, status: "active" }] });
  assert.match(withLead, /leads_note/);
});
