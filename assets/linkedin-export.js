/* LinkedIn-Datenexport (Einstellungen > Datenschutz > Kopie Ihrer Daten > Artikel) im Browser lesen: Articles/*.html und Shares.csv.
   Alles passiert lokal; nur die ausgewaehlten Eintraege (Titel, Link, Datum) gehen spaeter an POST /api/contributions/import. Kein Login, kein Scraping. */
(function (root) {
  "use strict";
  var MAX_ENTRY = 20 * 1024 * 1024;

  function stripTags(s) { return String(s || "").replace(/<[^>]+>/g, " "); }
  function unent(s) {
    return String(s || "").replace(/&#(\d+);/g, function (_, n) { return String.fromCodePoint(Math.min(+n, 0x10ffff)); })
      .replace(/&#x([0-9a-f]+);/gi, function (_, n) { return String.fromCodePoint(Math.min(parseInt(n, 16), 0x10ffff)); })
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&amp;/g, "&");
  }
  function clean(s, n) { return unent(stripTags(s)).replace(/\s+/g, " ").trim().slice(0, n || 200); }
  function day(s) { var m = /(\d{4})-(\d{2})-(\d{2})/.exec(String(s || "")); return m ? m[0] : ""; }
  function linkedinUrl(u) {
    try { var x = new URL(String(u || "").trim()); return x.protocol === "https:" && /(^|\.)linkedin\.com$/i.test(x.hostname) ? x.origin + x.pathname : ""; } catch (e) { return ""; }
  }

  // RFC-4180-CSV (Anfuehrungszeichen, Kommas und Zeilenumbrueche in Feldern)
  function parseCsv(text) {
    var rows = [], row = [], f = "", q = false, i = 0, s = String(text || "").replace(/^﻿/, "");
    for (; i < s.length; i++) {
      var c = s[i];
      if (q) { if (c === '"') { if (s[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
      else if (c === '"') q = true;
      else if (c === ",") { row.push(f); f = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && s[i + 1] === "\n") i++; row.push(f); f = ""; if (row.length > 1 || row[0] !== "") rows.push(row); row = []; }
      else f += c;
    }
    if (f !== "" || row.length) { row.push(f); rows.push(row); }
    return rows;
  }

  function parseShares(text) {
    var rows = parseCsv(text), out = [];
    if (!rows.length) return out;
    var head = rows[0].map(function (h) { return h.trim().toLowerCase(); }), ci = head.indexOf("date"), li = head.indexOf("sharelink"), mi = head.indexOf("sharecommentary");
    if (ci < 0 || li < 0) return out;
    rows.slice(1).forEach(function (r) {
      var url = linkedinUrl(r[li]), date = day(r[ci]), title = clean(mi >= 0 ? r[mi] : "", 120);
      if (url && date && title.length >= 3) out.push({ title: title, url: url, date: date, source: "share" });
    });
    return out;
  }

  function parseArticle(name, html) {
    html = String(html || "");
    var h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html) || /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html), title = clean(h1 && h1[1], 200);
    var date = day((/Published on\s*([0-9-]{10})/i.exec(html) || [])[1]) || day((/Created on\s*([0-9-]{10})/i.exec(html) || [])[1]) || day(name.split("/").pop());
    var canon = /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i.exec(html), url = linkedinUrl(canon && canon[1]);
    if (!url) { var m = /href=["'](https:\/\/(?:[a-z]+\.)?linkedin\.com\/pulse\/[^"'#?]+)/i.exec(html); url = linkedinUrl(m && m[1]); }
    return title.length >= 3 && date ? { title: title, url: url, date: date, source: "article" } : null;
  }

  var isArticle = function (n) { return /(^|\/)Articles\/[^\/]+\.html?$/i.test(n); };
  var isShares = function (n) { return /(^|\/)Shares\.csv$/i.test(n); };
  function wanted(name) { return isArticle(name) || isShares(name); }

  // files: { "Articles/x.html": "<html>", "Shares.csv": "..." } -> Eintraege (neueste zuerst)
  function parseExport(files) {
    var out = [];
    Object.keys(files || {}).forEach(function (n) {
      if (isArticle(n)) { var a = parseArticle(n, files[n]); if (a) out.push(a); }
      else if (isShares(n)) out = out.concat(parseShares(files[n]));
    });
    return out.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
  }

  // ZIP im Browser lesen (nur die benoetigten Dateien; Methode 0 = gespeichert, 8 = deflate)
  function readZip(buf) {
    var dv = new DataView(buf), u8 = new Uint8Array(buf), eocd = -1, i;
    for (i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 65557); i--) if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    if (eocd < 0) return Promise.reject(new Error("not_zip"));
    var count = dv.getUint16(eocd + 10, true), pos = dv.getUint32(eocd + 16, true), jobs = [], dec = new TextDecoder("utf-8");
    for (i = 0; i < count; i++) {
      if (dv.getUint32(pos, true) !== 0x02014b50) break;
      var method = dv.getUint16(pos + 10, true), csize = dv.getUint32(pos + 20, true), usize = dv.getUint32(pos + 24, true), nl = dv.getUint16(pos + 28, true), el = dv.getUint16(pos + 30, true), cl = dv.getUint16(pos + 32, true), lo = dv.getUint32(pos + 42, true);
      var name = dec.decode(u8.subarray(pos + 46, pos + 46 + nl));
      pos += 46 + nl + el + cl;
      if (!wanted(name) || usize > MAX_ENTRY || csize > MAX_ENTRY) continue;
      jobs.push({ name: name, method: method, csize: csize, lo: lo });
    }
    var files = {};
    return jobs.reduce(function (p, j) {
      return p.then(function () {
        var nl2 = dv.getUint16(j.lo + 26, true), el2 = dv.getUint16(j.lo + 28, true), start = j.lo + 30 + nl2 + el2, data = u8.subarray(start, start + j.csize);
        if (j.method === 0) { files[j.name] = dec.decode(data); return; }
        if (j.method !== 8 || typeof DecompressionStream === "undefined") return;
        return new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).arrayBuffer().then(function (ab) { files[j.name] = dec.decode(ab); });
      });
    }, Promise.resolve()).then(function () { return files; });
  }

  var api = { parseCsv: parseCsv, parseShares: parseShares, parseArticle: parseArticle, parseExport: parseExport, readZip: readZip };
  root.M365LinkedInExport = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
