// Blog auf der eigenen Domain: Host-Pruefung, Namensregeln, Link-Pruefung, Erloes-Beteiligung (nur Banner-Werbung).
import { test } from "node:test";
import assert from "node:assert/strict";
import { normHost, validateDomain, isApex, isOwnHost, cleanLink, byodOn, saasZone, BYOD_MAX_DOMAINS_PER_USER } from "../src/byod_rules.js";
import { splitRevenue, REVENUE_SPLIT, REVENUE_KINDS } from "../src/byod_revenue.js";

const ENV = { BYOD_CNAME_TARGET: "blogs.m365blogs.net" };

test("normHost: streng und ohne Tricks", () => {
  assert.equal(normHost("Blog.Example.COM"), "blog.example.com");
  assert.equal(normHost("blog.example.com."), "blog.example.com");
  assert.equal(normHost("xn--blg-ira.example.de"), "xn--blg-ira.example.de");
  for (const bad of ["", " ", "localhost", "blog", "1.2.3.4", "[::1]", "blog.example.com:8080", "blog.example.com/pfad", "user@blog.example.com", "blog_x.example.com", "bl og.example.com",
    "blög.example.com", "-a.example.com", "a-.example.com", "a..example.com", ".example.com", "example.123", "a.b.c.d.1", "x".repeat(64) + ".example.com", ("a.".repeat(130)) + "com", "blog.example.com\nevil.com", "blog.example.com%00", "blog.example.com\\evil.com"]) {
    assert.equal(normHost(bad), "", JSON.stringify(bad));
  }
  assert.equal(normHost(null), ""); assert.equal(normHost(42), ""); assert.equal(normHost(undefined), "");
});

test("isApex: Apex mit und ohne zweiteilige Endung", () => {
  assert.ok(isApex("kunde.de")); assert.ok(isApex("kunde.co.uk")); assert.ok(isApex("kunde.com.au"));
  assert.ok(!isApex("blog.kunde.de")); assert.ok(!isApex("www.kunde.co.uk")); assert.ok(!isApex("a.b.kunde.de"));
});

test("validateDomain: gueltige Unterdomains", () => {
  for (const d of ["blog.kunde.de", "https://Blog.Kunde.de/", "www.kunde.co.uk", "m365.kunde.com", "xn--blg-ira.kunde.de"]) {
    const r = validateDomain(d, ENV); assert.ok(r.ok, d); assert.equal(r.host, r.host.toLowerCase());
  }
  assert.equal(validateDomain("https://Blog.Kunde.de/", ENV).host, "blog.kunde.de");
});

test("validateDomain: Apex, eigene Domains, Zone, Wegwerf-Hosts, Marken und Muell werden abgelehnt", () => {
  const cases = { "kunde.de": "apex_not_allowed", "kunde.co.uk": "apex_not_allowed", "m365.fm": "own_domain", "www.m365.fm": "own_domain", "blog.m365.fm": "own_domain", "dub.m365.fm": "own_domain",
    "m365con.net": "own_domain", "blog.m365con.net": "own_domain", "m365fm.net": "own_domain", "blog.m365-fm.de": "own_domain", "blogs.m365blogs.net": "saas_zone", "x.blogs.m365blogs.net": "saas_zone", "foo.m365blogs.net": "saas_zone",
    "meins.workers.dev": "blocked_suffix", "a.b.workers.dev": "blocked_suffix", "x.github.io": "blocked_suffix", "x.pages.dev": "blocked_suffix", "mein.blogspot.com": "blocked_suffix", "pc.local": "blocked_suffix", "foo.test": "blocked_suffix",
    "blog.microsoft.com": "brand_domain", "my.office.com": "brand_domain", "x.sharepoint.com": "brand_domain", "a.linkedin.com": "brand_domain", "podcast.spreaker.com": "brand_domain", "www.youtube.com": "brand_domain",
    "": "bad_domain", "1.2.3.4": "bad_domain", "blog.kunde.de:443": "bad_domain", "javascript:alert(1)": "bad_domain", "blog.kunde.de/x": "bad_domain" };
  for (const [d, err] of Object.entries(cases)) { const r = validateDomain(d, ENV); assert.equal(r.ok, false, d); assert.equal(r.error, err, d); }
  assert.equal(validateDomain(undefined, ENV).error, "bad_domain");
});

test("Fremde Domains, die nur so aehnlich enden, sind keine Treffer (microsoft.com.evil.de bleibt erlaubt, notmicrosoft.com ebenfalls)", () => {
  assert.ok(validateDomain("blog.notmicrosoft.com", ENV).ok);
  assert.ok(validateDomain("microsoft.com.kunde.de", ENV).ok);
});

test("Eigene Hosts und Zone", () => {
  assert.ok(isOwnHost("www.m365.fm") && isOwnHost("m365.fm") && isOwnHost("x.y.m365.fm") && isOwnHost("m365con.net"));
  assert.ok(!isOwnHost("m365.fm.evil.com") && !isOwnHost("evilm365.fm") && !isOwnHost("blog.kunde.de"));
  assert.equal(saasZone(ENV), "m365blogs.net"); assert.equal(saasZone({ BYOD_ZONE: "zone.example.org" }), "zone.example.org"); assert.equal(saasZone({}), "");
});

test("Schalter und Grenze", () => {
  assert.ok(!byodOn({}) && !byodOn({ BYOD: "0" }) && !byodOn({ BYOD: "true" }) && byodOn({ BYOD: "1" }));
  assert.equal(BYOD_MAX_DOMAINS_PER_USER, 1);
});

test("cleanLink: nur https, keine Zugangsdaten, keine Kurzlinks", () => {
  assert.equal(cleanLink("https://kunde.de/impressum"), "https://kunde.de/impressum");
  for (const bad of ["", "http://kunde.de/i", "javascript:alert(1)", "https://u:p@kunde.de/", "https://bit.ly/abc", "https://localhost/x", "//kunde.de/x", "kunde.de", "https://" + "a".repeat(300) + ".de/"]) assert.equal(cleanLink(bad), "", bad);
});

test("Erloese: Banner-Werbung 70/30, Sponsoring bleibt bei M365.FM", () => {
  assert.deepEqual(REVENUE_KINDS, ["banner_ad", "sponsoring"]);
  assert.deepEqual(splitRevenue("banner_ad", 10000), { kind: "banner_ad", gross_cents: 10000, author_bp: 7000, platform_bp: 3000, author_cents: 7000, platform_cents: 3000 });
  assert.deepEqual(splitRevenue("sponsoring", 10000), { kind: "sponsoring", gross_cents: 10000, author_bp: 0, platform_bp: 10000, author_cents: 0, platform_cents: 10000 });
  const r = splitRevenue("banner_ad", 1); assert.equal(r.author_cents, 0); assert.equal(r.platform_cents, 1);   // Rundungsrest bei der Plattform
  const r3 = splitRevenue("banner_ad", 333); assert.equal(r3.author_cents + r3.platform_cents, 333); assert.equal(r3.author_cents, 233);
  for (const bad of [["x", 100], ["banner_ad", -1], ["banner_ad", 1.5], ["banner_ad", "100"], [undefined, 1]]) assert.equal(splitRevenue(...bad), null);
  assert.equal(REVENUE_SPLIT.sponsoring.author_bp, 0);
  for (const k of REVENUE_KINDS) for (const c of [0, 1, 7, 99, 1234, 99999]) { const s = splitRevenue(k, c); assert.equal(s.author_cents + s.platform_cents, c); }
});
