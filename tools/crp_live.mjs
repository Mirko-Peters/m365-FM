// Auswertung der Lighthouse-Laeufe (crp-check.yml): Kennzahlen (Score, FCP, LCP, TBT, CLS, Speed Index, TTFB, Gewicht, Anfragen, DOM),
// LCP-Element und seine Phasen, Layout-Verschiebungen, kritische Ladekette, renderblockierende Dateien, Schriften und die groessten Einsparungen.
// Liest Lighthouse 12 (klassische Audits) und Lighthouse 13 (Insight-Audits: lcp-breakdown-insight, network-dependency-tree-insight,
// render-blocking-insight, dom-size-insight, image-delivery-insight, cache-insight, ...).
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
// LCP-Phasen (Lighthouse 12: Audit largest-contentful-paint-element, Tabelle mit phase/timing;
// Lighthouse 13: lcp-breakdown-insight, Tabelle mit subpart/label/duration)
export function lcpPhases(audit) {
  const out = [];
  const walk = (d) => {
    if (!d || typeof d !== "object") return;
    if (Array.isArray(d)) { d.forEach(walk); return; }
    if (d.phase != null && d.timing != null) { out.push(`${d.phase} ${Math.round(d.timing)} ms`); return; }
    if (d.subpart != null && d.duration != null) { out.push(`${d.label || d.subpart} ${Math.round(d.duration)} ms`); return; }
    Object.values(d).forEach(walk);
  };
  walk(audit?.details);
  return out;
}
// Kritische Ladekette: Lighthouse 12 critical-request-chains (request.endTime in s, relativ zur ersten Anfrage),
// Lighthouse 13 network-dependency-tree-insight (url, transferSize, navStartToEndTime in ms ab Navigationsstart).
export function chainDetails(a) {
  const old = a["critical-request-chains"]?.details;
  if (old?.chains) return old;
  const it = (a["network-dependency-tree-insight"]?.details?.items || []).find((x) => x?.value?.type === "network-tree");
  return it ? it.value : null;
}
function walkChain(chains, depth, out, t0) {
  for (const k of Object.keys(chains || {})) {
    const c = chains[k], r = c.request || c;
    const end = c.request ? (r.endTime - t0) * 1000 : r.navStartToEndTime;
    out.push(`${"  ".repeat(depth)}- ${short(r.url)} ${kb(r.transferSize || 0)} KB, ende ${end == null ? "–" : Math.round(end)} ms`);
    walkChain(c.children, depth + 1, out, t0);
  }
}
// Nicht erfuellte Punkte einer Insight-Checkliste (z. B. lcp-discovery-insight: fetchpriority=high fehlt)
function failedChecks(d) {
  const out = [];
  const walk = (x) => {
    if (!x || typeof x !== "object") return;
    if (Array.isArray(x)) { x.forEach(walk); return; }
    if (x.type === "checklist" && x.items) { for (const c of Object.values(x.items)) if (c && c.value === false) out.push(c.label); return; }
    Object.values(x).forEach(walk);
  };
  walk(d);
  return out;
}
// Einsparungen: Lighthouse 12 (klassische Audits) und Lighthouse 13 (Insights mit numericValue/numericUnit)
const OPPS = ["uses-responsive-images", "modern-image-formats", "offscreen-images", "efficient-animated-content", "unused-javascript",
  "unused-css-rules", "unminified-javascript", "unminified-css", "uses-text-compression", "uses-long-cache-ttl", "render-blocking-resources", "server-response-time",
  "image-delivery-insight", "cache-insight", "render-blocking-insight", "document-latency-insight", "font-display-insight", "lcp-discovery-insight",
  "legacy-javascript-insight", "duplicated-javascript-insight"];
function savings(x) {
  const d = x.details || {}, parts = [];
  if (d.overallSavingsMs) parts.push(`~${Math.round(d.overallSavingsMs)} ms`);
  if (d.overallSavingsBytes) parts.push(`~${kb(d.overallSavingsBytes)} KB`);
  if (!parts.length && x.numericValue && /-insight$/.test(x.id || "")) {
    if (x.numericUnit === "millisecond") parts.push(`~${Math.round(x.numericValue)} ms`);
    else if (x.numericUnit === "byte") parts.push(`~${kb(x.numericValue)} KB`);
  }
  const failed = failedChecks(d);
  if (failed.length) parts.push(`offen: ${failed.join(" / ")}`);
  return [x.displayValue, ...parts].filter(Boolean).join(", ");
}

export function analyse(dir) {
  const groups = {}, detail = {}, versions = new Set();
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const [form, path] = f.replace(/\.json$/, "").split("__");
    let j; try { j = JSON.parse(readFileSync(`${dir}/${f}`, "utf8")); } catch { continue; }
    const a = j.audits || {}, key = form + " " + decodeURIComponent(path || "");
    if (j.lighthouseVersion) versions.add(`Lighthouse ${j.lighthouseVersion}` + ((j.environment?.hostUserAgent || "").match(/(HeadlessChrome|Chrome)\/[\d.]+/) ? `, ${j.environment.hostUserAgent.match(/(HeadlessChrome|Chrome)\/[\d.]+/)[0]}` : ""));
    const g = (groups[key] ||= { score: [], fcp: [], lcp: [], tbt: [], cls: [], si: [], ttfb: [], bytes: [], reqs: [], dom: [], crp: [] });
    g.score.push(j.categories?.performance?.score);
    g.fcp.push(a["first-contentful-paint"]?.numericValue); g.lcp.push(a["largest-contentful-paint"]?.numericValue);
    g.tbt.push(a["total-blocking-time"]?.numericValue); g.cls.push(a["cumulative-layout-shift"]?.numericValue);
    g.si.push(a["speed-index"]?.numericValue); g.ttfb.push(a["server-response-time"]?.numericValue);
    g.bytes.push(a["total-byte-weight"]?.numericValue); g.dom.push(a["dom-size"]?.numericValue ?? a["dom-size-insight"]?.numericValue);
    g.reqs.push((a["network-requests"]?.details?.items || []).length || null);
    const ch = chainDetails(a);
    g.crp.push(ch?.longestChain?.duration);
    if (!detail[key]) {
      const out = [];
      const t0 = ch?.chains ? Math.min(...Object.values(ch.chains).map((c) => c.request?.startTime ?? 0)) : 0;
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
      const rb = ((a["render-blocking-resources"] || a["render-blocking-insight"])?.details?.items || []).map((i) => `${short(i.url)} (${Math.round(i.wastedMs || 0)} ms)`);
      const fonts = (a["network-requests"]?.details?.items || []).filter((i) => /woff2|\.css|beacon|email-decode/.test(i.url))
        .map((i) => `${short(i.url)} prio=${i.priority} start=${Math.round(i.networkRequestTime)} ende=${Math.round(i.networkEndTime)}`);
      const biggest = (a["network-requests"]?.details?.items || []).slice().sort((x, y) => (y.transferSize || 0) - (x.transferSize || 0)).slice(0, 6)
        .map((i) => `${short(i.url)} ${kb(i.transferSize)} KB (${i.resourceType || "?"})`);
      const opps = OPPS.map((id) => a[id]).filter((x) => x && x.score != null && x.score < 0.9)
        .map((x) => `${x.id}: ${savings(x)}`);
      // uses-rel-preload gibt es ab Lighthouse 13 nicht mehr: dann "nicht geprueft" statt "keine"
      const pre = a["uses-rel-preload"] ? (a["uses-rel-preload"].details?.items || []).map((i) => short(i.url)) : null;
      const warn = (j.runWarnings || []).concat(a["uses-rel-preload"]?.warnings || []).join(" | ");
      const why = (ids) => ids.filter((id) => a[id]).map((id) => `${id}=${a[id].scoreDisplayMode || "?"}${a[id].errorMessage ? ` (${String(a[id].errorMessage).slice(0, 80)})` : ""}${a[id].explanation ? ` [${String(a[id].explanation).slice(0, 80)}]` : ""}`).join(", ") || "kein passendes Audit";
      const phases = lcpIds.map((id) => lcpPhases(a[id])).find((x) => x.length) || [];
      detail[key] = { out, rb, lcpEl, lcpWhy: lcpEl ? "" : why(lcpIds), phases, shifts, clsWhy: shifts.length ? "" : why(clsIds), fonts, biggest, opps, pre, warn, chains: ch?.longestChain };
    }
  }
  const md = ["## Ladezeiten (Lighthouse, Median aus allen Laeufen)", "", ...(versions.size ? [`Messung mit ${[...versions].sort().join("; ")}`, ""] : []),
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
      "Preload-Vorschlaege: " + (d.pre ? d.pre.join("; ") || "keine" : "– (Audit in dieser Lighthouse-Fassung nicht vorhanden)"), "Schriften/CSS/Skripte:", ...d.fonts.map((x) => "- " + x), d.warn ? "Warnungen: " + d.warn : "");
  }
  return md.join("\n");
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) console.log(analyse(process.argv[2]));
