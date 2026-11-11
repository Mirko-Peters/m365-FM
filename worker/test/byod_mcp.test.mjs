// MCP: Werkzeuge fuer die Blog-Domain (Regel der Plattform: jede neue Funktion braucht MCP-Unterstuetzung).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { TOOLS, HOWTO } from "../src/mcp.js";

const NAMES = ["list_my_blog_domains", "add_blog_domain", "check_blog_domain", "set_blog_domain_links", "remove_blog_domain"];
const COV = JSON.parse(readFileSync(new URL("../mcp_coverage.json", import.meta.url), "utf8")).routes;

test("Werkzeuge sind da, mit deutscher Beschreibung, richtiger Route und Schreibmarke", () => {
  const by = Object.fromEntries(TOOLS.map((t) => [t.name, t]));
  const want = { list_my_blog_domains: ["GET", "/api/byod/mine", false], add_blog_domain: ["POST", "/api/byod/add", true], check_blog_domain: ["POST", "/api/byod/check", true], set_blog_domain_links: ["POST", "/api/byod/links", true], remove_blog_domain: ["POST", "/api/byod/remove", true] };
  for (const n of NAMES) {
    const t = by[n]; assert.ok(t, n); assert.ok(t.de && t.de.length > 10, n + " de"); assert.ok(t.description.length > 30, n);
    assert.deepEqual(t.route, want[n].slice(0, 2), n); assert.equal(!!t.write, want[n][2], n);
    assert.equal(t.inputSchema.type, "object");
  }
  assert.deepEqual(by.add_blog_domain.inputSchema.required, ["domain"]);
  assert.deepEqual(Object.keys(by.add_blog_domain.inputSchema.properties).sort(), ["domain", "imprint_url", "privacy_url"]);
  assert.deepEqual(by.check_blog_domain.inputSchema.required, ["id"]);
});

test("Anleitung (HOWTO) nennt alle Werkzeuge und warnt davor, DNS selbst zu aendern", () => {
  const h = HOWTO.find((x) => x.id === "blogdomain"); assert.ok(h);
  assert.deepEqual([...h.tools].sort(), [...NAMES, "preview_blog_import", "import_blog_feed"].sort()); assert.ok(h.en.length > 100 && h.de.length > 100);
  assert.match(h.en, /Never change DNS/i); assert.match(h.de, /Ändere nie selbst DNS/);
});

test("mcp_coverage.json: jede Route der Domain-Verwaltung ist einem Werkzeug zugeordnet oder begruendet ausgenommen", () => {
  assert.deepEqual(COV["/api/byod/mine"].tools, ["list_my_blog_domains"]); assert.deepEqual(COV["/api/byod/add"].tools, ["add_blog_domain"]);
  assert.deepEqual(COV["/api/byod/check"].tools, ["check_blog_domain"]); assert.deepEqual(COV["/api/byod/links"].tools, ["set_blog_domain_links"]); assert.deepEqual(COV["/api/byod/remove"].tools, ["remove_blog_domain"]);
  for (const r of ["/api/admin/byod", "/api/admin/byod/block", "/api/byod/serve"]) assert.ok(COV[r].skip && COV[r].skip.length > 20, r);
});

test("Import-Werkzeuge: Vorschau liest nur, Import schreibt Entwuerfe und verlangt Rechte-Bestaetigung; Anleitung warnt", () => {
  const by = Object.fromEntries(TOOLS.map((t) => [t.name, t]));
  const p = by.preview_blog_import, i = by.import_blog_feed;
  assert.deepEqual(p.route, ["POST", "/api/byod/import/preview"]); assert.ok(!p.write); assert.deepEqual(p.inputSchema.required, ["feed_url"]);
  assert.deepEqual(i.route, ["POST", "/api/byod/import/save"]); assert.equal(i.write, true); assert.deepEqual(i.inputSchema.required, ["feed_url", "keys"]);
  assert.deepEqual(i.inputSchema.properties.mode.enum, ["excerpt", "full"]); assert.equal(i.inputSchema.properties.rights.type, "boolean");
  assert.match(i.description, /DRAFTS/); assert.match(i.description, /never set rights:true on your own/); assert.match(i.description, /Images are never copied/);
  assert.ok(p.de.length > 10 && i.de.length > 10 && /ENTWÜRFE/.test(i.de));
  const h = HOWTO.find((x) => x.id === "blogdomain"); assert.match(h.en, /rights:true, never on your own/); assert.match(h.de, /nie von dir aus/);
  assert.deepEqual(COV["/api/byod/import/preview"].tools, ["preview_blog_import"]); assert.deepEqual(COV["/api/byod/import/save"].tools, ["import_blog_feed"]);
});
