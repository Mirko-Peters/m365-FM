// Auswertung der Lighthouse-Laeufe (crp-check.yml): Kennzahlen (Score, FCP, LCP, TBT, CLS, Speed Index, TTFB, Gewicht, Anfragen, DOM),
// LCP-Element und seine Phasen, Layout-Verschiebungen, kritische Ladekette, renderblockierende Dateien, Schriften und die groessten Einsparungen.
// Aufruf: node tools/crp_live.mjs <ordner mit *.json>   (Dateiname: <form>__<pfad>__<lauf>.json)
import { readdirSync, readFileSync } from "node:fs";

const med = (a) => { const s = a.filter((x) => x != null && !Number.isNaN(x)).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const short = (u) => String(u || "").replace("https://www.m365.fm", "").replace(/^https?:\/\//, "").slice(0, 90);
const ms = (v) => (v == null ? "–" : String(Math.round(v)));
const kb = (b) => (b == null ? "–" : String(Math.round(b / 102.4) / 10));
const cls = (v) => (v == null ? "–" : v.toFixed(3));

// Erstes Element (node.snippet/selector) in beliebig verschachtelten details-Tabellen: Lighthouse 12 legt das LCP-Element
// je nach Version unter details.items[0] (node) oder unter details.items[0].items[0] (Tabelle in Liste) ab.
export function firstNode(d) {
  if (!d || typeof d !== "object") return null;
  if (d.node && (d.node.snippet || d.node.selector)) return d.node;
  if (d.type === "node" && (d.snippet || d.selector)) return d;
  for (const v of Array.isArray(d) ? d : Object.values(d)) { const n = firstNode(v); if (n) return n; }
  return null;
}
// LCP-Phasen (Lighthouse 12: Audit largest-contentful-paint-element, zweite Tabelle mit phase/timing)
export function lcpPhases(audit) {
  const out = [];
  const walk = (d) => {
    if (!d || typeof d !== "object") return;
    if (Array.isArray(d)) { d.forEach(walk); return; }
    if (d.phase != null && d.timing != null) { out.push(`${d.phase} ${Math.round(d.timing)} ms`); return; }
    Object.values(d).forEach(walk);
  };
  walk(audit?.details);
  return out;
}
function walkChain(chains, depth, out, t0) {
  for (const k of Object.keys(chains || {})) {
    const c = chains[k], r = c.request;
    out.push(`${"  ".repeat(depth)}- ${short(r.url)} ${kb(r.transferSize || 0)} KB, ende ${Math.round((r.endTime - t0) * 1000)} ms`);
    walkChain(c.children, depth + 1, out, t0);
  }
}
const OPPS = ["uses-responsive-images", "modern-image-formats", "offscreen-images", "efficient-animated-content", "unused-javascript",
  "unused-css-rules", "unminified-javascript", "unminified-css", "uses-text-compression", "uses-long-cache-ttl", "render-blocking-resources", "server-response-time"];

export function analyse(dir) {
  const groups = {}, detail = {};
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const [form, path] = f.replace(/\.json$/, "").split("__");
    let j; try { j = JSON.parse(readFileSync(`${dir}/${f}`, "utf8")); } catch { continue; }
    const a = j.audits || {}, key = form + " " + decodeURIComponent(path || "");
    const g = (groups[key] ||= { score: [], fcp: [], lcp: [], tbt: [], cls: [], si: [], ttfb: [], bytes: [], reqs: [], dom: [], crp: [] });
    g.score.push(j.categories?.performance?.score);
    g.fcp.push(a["first-contentful-paint"]?.numericValue); g.lcp.push(a["largest-contentful-paint"]?.numericValue);
    g.tbt.push(a["total-blocking-time"]?.numericValue); g.cls.push(a["cumulative-layout-shift"]?.numericValue);
    g.si.push(a["speed-index"]?.numericValue); g.ttfb.push(a["server-response-time"]?.numericValue);
    g.bytes.push(a["total-byte-weight"]?.numericValue); g.dom.push(a["dom-size"]?.numericValue);
    g.reqs.push((a["network-requests"]?.details?.items || []).length || null);
    g.crp.push(a["critical-request-chains"]?.details?.longestChain?.duration);
    if (!detail[key]) {
      const out = [];
      const ch = a["critical-request-chains"]?.details;
      const t0 = ch ? Math.min(...Object.values(ch.chains || {}).map((c) => c.request.startTime)) : 0;
      walkChain(ch?.chains, 0, out, t0);
      // LCP-Element: klassisches Audit, sonst neuere Insight-Audits; findet sich nichts, den Grund (Status/Fehler) und vorhandene Audits nennen
      const lcpIds = ["largest-contentful-paint-element", ...Object.keys(a).filter((id) => /lcp|largest-contentful/i.test(id) && id !== "largest-contentful-paint" && id !== "largest-contentful-paint-element")];
      const lcpNode = lcpIds.map((id) => firstNode(a[id]?.details)).find(Boolean);
      const lcpEl = lcpNode ? `${lcpNode.selector || ""} ${lcpNode.snippet || ""}`.trim().slice(0, 200) : "";
      const shifts = [];
      const clsIds = ["layout-shifts", "layout-shift-elements", ...Object.keys(a).filter((id) => /cls|layout-shift/i.test(id) && !["cumulative-layout-shift", "layout-shifts", "layout-shift-elements"].includes(id))];
      const clsItems = clsIds.map((id) => a[id]?.details?.items || []).find((x) => x.length) || [];
      for (const it of clsItems.slice(0, 5)) {
        const n = firstNode(it);
        shifts.push(`${cls(it.score ?? it.weightedScore ?? null)} ${n ? `${n.selector || ""} ${(n.snippet || "").slice(0, 120)}`.trim() : ""}`);
      }
      const rb = (a["render-blocking-resources"]?.details?.items || []).map((i) => `${short(i.url)} (${Math.round(i.wastedMs || 0)} ms)`);
      const fonts = (a["network-requests"]?.details?.items || []).filter((i) => /woff2|\.css|beacon|email-decode/.test(i.url))
        .map((i) => `${short(i.url)} prio=${i.priority} start=${Math.round(i.networkRequestTime)} ende=${Math.round(i.networkEndTime)}`);
      const biggest = (a["network-requests"]?.details?.items || []).slice().sort((x, y) => (y.transferSize || 0) - (x.transferSize || 0)).slice(0, 6)
        .map((i) => `${short(i.url)} ${kb(i.transferSize)} KB (${i.resourceType || "?"})`);
      const opps = OPPS.map((id) => a[id]).filter((x) => x && x.score != null && x.score < 0.9)
        .map((x) => `${x.id}: ${x.displayValue || ""}${x.details?.overallSavingsMs ? `, ~${Math.round(x.details.overallSavingsMs)} ms` : ""}${x.details?.overallSavingsBytes ? `, ~${kb(x.details.overallSavingsBytes)} KB` : ""}`);
      const pre = (a["uses-rel-preload"]?.details?.items || []).map((i) => short(i.url));
      const warn = (j.runWarnings || []).concat(a["uses-rel-preload"]?.warnings || []).join(" | ");
      const why = (ids) => ids.filter((id) => a[id]).map((id) => `${id}=${a[id].scoreDisplayMode || "?"}${a[id].errorMessage ? ` (${String(a[id].errorMessage).slice(0, 80)})` : ""}${a[id].explanation ? ` [${String(a[id].explanation).slice(0, 80)}]` : ""}`).join(", ") || "kein passendes Audit";
      const phases = lcpIds.map((id) => lcpPhases(a[id])).find((x) => x.length) || [];
      detail[key] = { out, rb, lcpEl, lcpWhy: lcpEl ? "" : why(lcpIds), phases, shifts, clsWhy: shifts.length ? "" : why(clsIds), fonts, biggest, opps, pre, warn, chains: ch?.longestChain };
    }
  }
  const md = ["## Ladezeiten (Lighthouse, Median aus allen Laeufen)", "",
    "| Seite | Score | FCP ms | LCP ms | TBT ms | CLS | Speed Index ms | TTFB ms | Gewicht KB | Anfragen | DOM | laengste Kette ms |",
    "|---|---|---|---|---|---|---|---|---|---|---|---|"];
  for (const [k, g] of Object.entries(groups).sort()) {
    const sc = med(g.score);
    md.push(`| ${k} | ${sc == null ? "–" : Math.round(sc * 100)} | ${ms(med(g.fcp))} | ${ms(med(g.lcp))} | ${ms(med(g.tbt))} | ${cls(med(g.cls))} | ${ms(med(g.si))} | ${ms(med(g.ttfb))} | ${kb(med(g.bytes))} | ${ms(med(g.reqs))} | ${ms(med(g.dom))} | ${ms(med(g.crp))} |`);
  }
  for (const [k, d] of Object.entries(detail).sort()) {
    md.push("", `### ${k}`, `LCP-Element: \`${(d.lcpEl || "nicht ermittelt").replace(/`/g, "'")}\`` + (d.lcpWhy ? ` (Audits: ${d.lcpWhy})` : ""),
      "LCP-Phasen: " + (d.phases.join(", ") || "–"),
      "Layout-Verschiebungen (groesste): " + (d.shifts.join("; ") || "keine") + (d.clsWhy ? ` (Audits: ${d.clsWhy})` : ""),
      "Groesste Dateien: " + (d.biggest.join("; ") || "–"),
      "Einsparungen: " + (d.opps.join("; ") || "keine"),
      `Laengste Kette: ${JSON.stringify(d.chains)}`, "", "Kette:", ...d.out, "", "Renderblockierend: " + (d.rb.join("; ") || "keine"),
      "Preload-Vorschlaege: " + (d.pre.join("; ") || "keine"), "Schriften/CSS/Skripte:", ...d.fonts.map((x) => "- " + x), d.warn ? "Warnungen: " + d.warn : "");
  }
  return md.join("\n");
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) console.log(analyse(process.argv[2]));
