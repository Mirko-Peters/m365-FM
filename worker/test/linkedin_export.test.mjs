// LinkedIn-Datenexport im Browser lesen (assets/linkedin-export.js): Articles/*.html und Shares.csv, ZIP lesen; nur Titel, Link, Datum.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import { deflateRawSync } from "node:zlib";

const L = createRequire(import.meta.url)("../../assets/linkedin-export.js");
const dir = new URL("./fixtures/linkedin_export/", import.meta.url);
const files = {};   // Beispielstruktur als einfache Dateien
for (const f of readdirSync(new URL("Articles/", dir))) files[`Articles/${f}`] = readFileSync(new URL(`Articles/${f}`, dir), "utf-8");
files["Shares.csv"] = readFileSync(new URL("Shares.csv", dir), "utf-8");
files["Connections.csv"] = "First Name,Last Name\nA,B";   // wird ignoriert

test("Export-Parser: Artikel und Beitraege, nur Titel/Link/Datum", () => {
  const items = L.parseExport(files);
  assert.deepEqual(items.map((i) => [i.source, i.date, i.title]), [
    ["article", "2026-04-02", "Why governance matters & how"], ["share", "2026-03-01", "Great talk, with a comma and a second line"],
    ["share", "2026-02-01", '"Quoted" post'], ["article", "2025-11-20", "Older piece"]]);
  assert.equal(items[0].url, "https://www.linkedin.com/pulse/why-governance-matters-anna-example/", "kanonischer Link ohne Tracking");
  assert.equal(items[3].url, "", "Artikel ohne Link bleibt ohne Link (Nutzer entscheidet)");
  assert.deepEqual(Object.keys(items[0]).sort(), ["date", "source", "title", "url"], "kein Textinhalt");
  assert.ok(!JSON.stringify(items).includes("Long body"));
  assert.ok(!items.some((i) => i.url.includes("evil.example.com")), "nur linkedin.com");
});

test("CSV: Anfuehrungszeichen, Kommas, Zeilenumbrueche, BOM", () => {
  assert.deepEqual(L.parseCsv('﻿a,b\r\n"x,1","y ""z"""\r\n'), [["a", "b"], ["x,1", 'y "z"']]);
  assert.deepEqual(L.parseShares("Date,ShareLink,ShareCommentary\n"), []);
});

function zip(entries) {   // minimales ZIP: Methode 0 (gespeichert) oder 8 (deflate), ohne CRC-Pruefung noetig
  const parts = [], cd = [], enc = new TextEncoder(); let off = 0;
  for (const [name, text, method] of entries) {
    const raw = enc.encode(text), data = method === 8 ? deflateRawSync(raw) : raw, nm = enc.encode(name);
    const lh = Buffer.alloc(30); lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(method, 8); lh.writeUInt32LE(data.length, 18); lh.writeUInt32LE(raw.length, 22); lh.writeUInt16LE(nm.length, 26);
    parts.push(lh, nm, data);
    const ch = Buffer.alloc(46); ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(method, 10); ch.writeUInt32LE(data.length, 20); ch.writeUInt32LE(raw.length, 24); ch.writeUInt16LE(nm.length, 28); ch.writeUInt32LE(off, 42);
    cd.push(ch, nm); off += 30 + nm.length + data.length;
  }
  const cdBuf = Buffer.concat(cd), end = Buffer.alloc(22); end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10); end.writeUInt32LE(cdBuf.length, 12); end.writeUInt32LE(off, 16);
  const all = Buffer.concat([...parts, cdBuf, end]); return all.buffer.slice(all.byteOffset, all.byteOffset + all.length);
}

test("ZIP im Browser lesen: nur Articles/*.html und Shares.csv, gespeichert und deflate", async () => {
  const buf = zip([["Basic_LinkedInDataExport/Articles/2026-04-02-x.html", files["Articles/2026-04-02-Why-governance-matters.html"], 8], ["Basic_LinkedInDataExport/Shares.csv", files["Shares.csv"], 0], ["Basic_LinkedInDataExport/Connections.csv", "secret,data", 0]]);
  const got = await L.readZip(buf);
  assert.deepEqual(Object.keys(got).sort(), ["Basic_LinkedInDataExport/Articles/2026-04-02-x.html", "Basic_LinkedInDataExport/Shares.csv"], "Verbindungen u. a. werden gar nicht erst gelesen");
  assert.equal(L.parseExport(got).length, 3);
  await assert.rejects(L.readZip(new TextEncoder().encode("kein zip, nur Text, lang genug fuer den Suchlauf").buffer), /not_zip/);
});

test("Oberflaeche: kein innerHTML, kein window.confirm, Texte ueber M365L mit englischer Quelle", () => {
  for (const f of ["mvp-sources.js", "linkedin-export.js"]) {
    const js = readFileSync(new URL(`../../assets/${f}`, import.meta.url), "utf-8");
    assert.ok(!/innerHTML|outerHTML|insertAdjacentHTML|document\.write|\bconfirm\(/.test(js), f);
  }
  const ui = readFileSync(new URL("../../assets/mvp-sources.js", import.meta.url), "utf-8"), en = JSON.parse(readFileSync(new URL("../../data/ui_js_en.json", import.meta.url), "utf-8"));
  assert.match(ui, /M365L\(de, "mvpsrc\.Q"/);
  const keys = [...new Set([...ui.matchAll(/\bQ\.([a-z_0-9]+)/g)].map((m) => m[1]))];
  for (const k of keys) assert.ok(en["mvpsrc.Q"][k] !== undefined, `Q.${k} fehlt in data/ui_js_en.json`);
  for (const k of ["track", "post", "ignore", "m_ask", "m_track", "m_publish"]) assert.ok(en["mvpsrc.Q"][k]);
});
