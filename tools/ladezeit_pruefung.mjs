// Prueft den echten Seitenbau (docs/, r2out/) gegen den Site-Worker, ohne etwas zu veroeffentlichen (Ladezeit 27.11.2026):
//  1. Kaltstart: jede Seite/Datei, die nur in r2out/ liegt, muss R2_ONLY_PAGE bzw. r2OnlyFile treffen (sonst im kalten Zustand erst GitHub Pages 404)
//  3. Skripte/Stylesheets: Verweise in den Seiten gehasht? Datei in docs/ und r2out/? Hash = Inhalt? Cache-Control laut Worker-Regel
//  4. withPreload auf echte Seiten: Link-Header, jede genannte Adresse wird von der Seite wirklich genutzt
//  5. Blogbild: Verweise auf 5254f600109b589b2c2d
// Aufruf: node tools/ladezeit_pruefung.mjs docs r2out
import fs from "node:fs"; import path from "node:path"; import crypto from "node:crypto";
import { HASHED, R2_ONLY_PAGE, r2OnlyFile, withPreload, isHtmlPath } from "../sitewrk/index.js";
const [docs, r2out] = process.argv.slice(2);
function* walk(d, base = d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) yield* walk(f, base); else yield path.relative(base, f).split(path.sep).join("/"); } }
const pub = (rel) => "/" + (rel === "index.html" ? "" : rel.endsWith("/index.html") ? rel.slice(0, -"index.html".length) : rel);
const docsSet = new Set(walk(docs));
const r2List = [...walk(r2out)];
console.log(`docs/: ${docsSet.size} Dateien, r2out/: ${r2List.length} Dateien`);
// ---- 1
const groups = new Map(); let only = 0, miss = 0;
const shape = (p) => p.replace(/\/[a-z]{2}\//, "/<l>/").replace(/^\/[a-z]{2}\//, "/<l>/").split("/").slice(0, 4).map((s, i) => i >= 2 && s && !s.includes("<") ? (/\.[a-z0-9]+$/.test(s) ? "*" + s.slice(s.lastIndexOf(".")) : "*") : s).join("/");
for (const rel of r2List) {
  if (docsSet.has(rel)) continue;
  only++;
  const p = pub(rel), isPage = rel === "index.html" || rel.endsWith("/index.html");
  const ok = isPage ? R2_ONLY_PAGE.test(p) : r2OnlyFile(p) || HASHED.test(p);
  const g = (isPage ? "Seite " : "Datei ") + shape(p) + (ok ? "  ok" : "  LUECKE");
  const e = groups.get(g) || { n: 0, ex: p }; e.n++; groups.set(g, e);
  if (!ok) miss++;
}
console.log(`\n== 1 Kaltstart: ${only} Dateien nur in r2out/, davon ohne direkten R2-Weg im kalten Zustand: ${miss}`);
for (const [g, e] of [...groups].sort((a, b) => b[1].n - a[1].n)) console.log(`  ${String(e.n).padStart(6)}  ${g}   z. B. ${e.ex}`);
// ---- 3
const read = (rel) => fs.existsSync(path.join(r2out, rel)) ? fs.readFileSync(path.join(r2out, rel)) : fs.existsSync(path.join(docs, rel)) ? fs.readFileSync(path.join(docs, rel)) : null;
const refs = new Map(); let pages = 0;
const allHtml = [...[...docsSet].filter((r) => r.endsWith(".html")).map((r) => [docs, r]), ...r2List.filter((r) => r.endsWith(".html") && !docsSet.has(r)).map((r) => [r2out, r])];
for (const [d, rel] of allHtml) {
  const h = fs.readFileSync(path.join(d, rel), "utf8"); pages++;
  for (const m of h.matchAll(/<(?:script[^>]*\ssrc|link[^>]*\shref)="(?:https:\/\/www\.m365\.fm)?(\/assets\/[^"?#]+\.(?:js|css))(\?[^"]*)?"/g)) {
    const k = m[1] + (m[2] ? "?…" : ""); const e = refs.get(k) || { n: 0, ex: rel }; e.n++; refs.set(k, e);
  }
}
console.log(`\n== 3 Skripte und Stylesheets: ${pages} HTML-Seiten, ${refs.size} verschiedene /assets/-Verweise`);
let bad = 0;
for (const [k, e] of [...refs].sort((a, b) => b[1].n - a[1].n)) {
  const p = k.replace(/\?…$/, ""), rel = p.slice(1), hashed = HASHED.test(p);
  const inD = docsSet.has(rel), inR = fs.existsSync(path.join(r2out, rel));
  let hashOk = "";
  if (hashed) { const b = read(rel), m = /\.([0-9a-f]{8,})\.(?:css|js)$/.exec(p); hashOk = b ? (crypto.createHash("sha1").update(b).digest("hex").startsWith(m[1]) ? "hash=inhalt" : "HASH!=INHALT") : "FEHLT"; if (hashOk !== "hash=inhalt") bad++; }
  if (!inD && !inR) bad++;
  console.log(`  ${String(e.n).padStart(6)}  ${k}  ${hashed ? "immutable" : "1 h"}  docs:${inD ? "ja" : "nein"} r2out:${inR ? "ja" : "nein"} ${hashOk}  z. B. ${e.ex}`);
}
console.log(`  Probleme (fehlende Datei, Hash passt nicht): ${bad}`);
// ---- 4
const pick = (rx) => { for (const r of [...docsSet, ...r2List]) if (rx.test(r)) return r; return null; };
const samples = [["Start", "index.html"], ["Folge", pick(/^show\/episodes\/[a-z0-9-]{8,}\/index\.html$/)], ["Entitaet", "entity/windows-11/index.html"], ["Sprachseite", "de/index.html"],
  ["de-Folge", pick(/^de\/show\/episodes\/[a-z0-9-]{8,}\/index\.html$/)], ["Glossar", pick(/^glossary\/[^/]+\/index\.html$/)], ["Blog", pick(/^community\/u\/mirko-p\/blog\/stop-the-industrialization[^/]*\/index\.html$/)],
  ["Wiki", pick(/^wiki\/[^/]+\/index\.html$/)], ["Lernpfad", pick(/^learn\/[^/]+\/index\.html$/)]];
console.log("\n== 4 Preload-Header (withPreload auf echte Seiten, PRELOAD_LINK=1)");
for (const [label, rel] of samples) {
  if (!rel) { console.log(`  ${label}: keine Seite gefunden`); continue; }
  const b = read(rel); if (!b) { console.log(`  ${label}: ${rel} fehlt`); continue; }
  const html = b.toString("utf8"), url = "https://www.m365.fm" + pub(rel);
  const res = await withPreload(new Request(url), { PRELOAD_LINK: "1" }, new Response(b, { headers: { "content-type": "text/html; charset=utf-8" } }));
  const out = Buffer.from(await res.arrayBuffer()), link = res.headers.get("link") || "";
  const headEnd = html.search(/<\/head\s*>/i);
  console.log(`  ${label} ${pub(rel)}  Koerper gleich: ${out.equals(b)}  </head> bei ${headEnd} Bytes`);
  console.log(`     Link: ${link || "(keiner)"}`);
  for (const m of link.matchAll(/<([^>]+)>;\s*rel=preload;\s*as=(\w+)/g)) {
    const u = m[1], as = m[2], esc = u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const used = as === "style" ? new RegExp(`<link[^>]+rel="?stylesheet"?[^>]+href="(?:https://www\\.m365\\.fm)?${esc}"|<link[^>]+href="(?:https://www\\.m365\\.fm)?${esc}"[^>]+rel="?stylesheet`).test(html)
      : new RegExp(`(?:src|srcset|imagesrcset|href)="[^"]*${esc}`).test(html.slice(headEnd));
    const inHead = new RegExp(`<link[^>]+rel="?preload"?[^>]+as="?${as}"?[^>]*${esc}|<link[^>]+${esc}[^>]+rel="?preload`).test(html.slice(0, headEnd));
    console.log(`     ${as} ${u}: von der Seite genutzt: ${used ? "ja" : "NEIN"}, schon als <link rel=preload> im Kopf: ${inHead ? "ja" : "nein"}`);
  }
  const fonts = [...html.slice(0, headEnd).matchAll(/<link[^>]+as="font"[^>]*>/g)].length;
  console.log(`     Schrift-Preloads im HTML-Kopf (nicht im Header): ${fonts}`);
}
// ---- 5
console.log("\n== 5 Blogbild 5254f600109b589b2c2d");
const hits = new Map();
for (const [d, rel] of allHtml) { const h = fs.readFileSync(path.join(d, rel), "utf8"); for (const m of h.matchAll(/https:\/\/[a-z0-9.-]+\/i\/5254f600109b589b2c2d[^"'\s)&]*/g)) { const e = hits.get(m[0]) || { n: 0, ex: rel }; e.n++; hits.set(m[0], e); } }
for (const [u, e] of hits) console.log(`  ${String(e.n).padStart(5)}  ${u}   z. B. ${e.ex}`);
if (!hits.size) console.log("  keine Verweise gefunden");
