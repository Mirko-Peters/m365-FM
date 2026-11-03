// Auswertung der Lighthouse-Laeufe (crp-check.yml): kritische Ladekette, FCP/LCP, renderblockierende Dateien, Schriften.
// Aufruf: node tools/crp_live.mjs <ordner mit *.json>   (Dateiname: <form>__<pfad>__<lauf>.json)
import { readdirSync, readFileSync } from "node:fs";
const dir = process.argv[2];
const rows = [], detail = {};
const med = (a) => { const s = a.filter((x) => x != null).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const short = (u) => u.replace("https://www.m365.fm", "").replace(/^https?:\/\//, "").slice(0, 90);
function walk(chains, depth, out, t0) {
  for (const k of Object.keys(chains || {})) {
    const c = chains[k], r = c.request;
    out.push(`${"  ".repeat(depth)}- ${short(r.url)} ${Math.round((r.transferSize || 0) / 102.4) / 10} KB, ende ${Math.round((r.endTime - t0) * 1000)} ms`);
    walk(c.children, depth + 1, out, t0);
  }
}
const groups = {};
for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
  const [form, path] = f.replace(/\.json$/, "").split("__");
  let j; try { j = JSON.parse(readFileSync(`${dir}/${f}`, "utf8")); } catch { continue; }
  const a = j.audits || {}, key = form + " " + decodeURIComponent(path);
  const g = (groups[key] ||= { fcp: [], lcp: [], crp: [], tbt: [], score: [], f });
  g.fcp.push(a["first-contentful-paint"]?.numericValue); g.lcp.push(a["largest-contentful-paint"]?.numericValue);
  g.tbt.push(a["total-blocking-time"]?.numericValue); g.score.push(j.categories?.performance?.score);
  g.crp.push(a["critical-request-chains"]?.details?.longestChain?.duration);
  if (!detail[key]) {
    const out = [];
    const ch = a["critical-request-chains"]?.details;
    const t0 = ch ? Math.min(...Object.values(ch.chains || {}).map((c) => c.request.startTime)) : 0;
    walk(ch?.chains, 0, out, t0);
    const rb = (a["render-blocking-resources"]?.details?.items || []).map((i) => `${short(i.url)} (${Math.round(i.wastedMs || 0)} ms)`);
    const lcpEl = (a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.snippet || "").slice(0, 140);
    const fonts = (a["network-requests"]?.details?.items || []).filter((i) => /woff2|\.css|beacon|email-decode/.test(i.url))
      .map((i) => `${short(i.url)} prio=${i.priority} start=${Math.round(i.networkRequestTime)} ende=${Math.round(i.networkEndTime)}`);
    const pre = (a["uses-rel-preload"]?.details?.items || []).map((i) => short(i.url));
    const warn = (j.runWarnings || []).concat(a["uses-rel-preload"]?.warnings || []).join(" | ");
    detail[key] = { out, rb, lcpEl, fonts, pre, warn, chains: ch?.longestChain };
  }
}
const md = ["## Kritische Ladekette (Lighthouse, Median aus allen Laeufen)", "", "| Seite | Score | FCP ms | LCP ms | TBT ms | laengste Kette ms |", "|---|---|---|---|---|---|"];
for (const [k, g] of Object.entries(groups).sort()) md.push(`| ${k} | ${Math.round(med(g.score) * 100)} | ${Math.round(med(g.fcp))} | ${Math.round(med(g.lcp))} | ${Math.round(med(g.tbt))} | ${Math.round(med(g.crp))} |`);
for (const [k, d] of Object.entries(detail).sort()) {
  md.push("", `### ${k}`, `LCP-Element: \`${d.lcpEl.replace(/`/g, "'")}\``, `Laengste Kette: ${JSON.stringify(d.chains)}`, "", "Kette:", ...d.out, "", "Renderblockierend: " + (d.rb.join("; ") || "keine"),
    "Preload-Vorschlaege: " + (d.pre.join("; ") || "keine"), "Schriften/CSS/Skripte:", ...d.fonts.map((x) => "- " + x), d.warn ? "Warnungen: " + d.warn : "");
}
console.log(md.join("\n"));
