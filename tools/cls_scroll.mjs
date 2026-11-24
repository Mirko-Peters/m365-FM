// CLS beim Laden UND beim Scrollen auf der Live-Seite messen (nur lesen, aendert nichts).
// Hintergrund: Cloudflare-RUM meldet auf /entity/windows-11/ (Desktop) CLS 0,324, Lighthouse (nur Laden) 0,002.
// Szenarien je Ansicht (1528x860 und 1366x768, DPR 1, Maus/kein Touch):
//   laden       - laden, 8 s warten
//   scroll_rad  - laden, dann langsam mit dem Mausrad bis ganz unten (Lenis aktiv wie bei echten Nutzern), warten
//   scroll_js   - laden, dann langsam mit window.scrollBy bis ganz unten (ohne Mausrad/Lenis), warten
//   hash_qa     - mit #en-qa laden (entity.js laedt sofort, Browser springt zum Anker), 8 s warten
//   neu_laden   - laden, halb nach unten scrollen, neu laden (Scroll-Wiederherstellung), 8 s warten
// Werbung (AdSense) bleibt standardmaessig AN, weil echte Nutzer sie auch sehen (CLS_BLOCK_ADS=1 blockiert sie).
// Aufgezeichnet: jede layout-shift (value, hadRecentInput, startTime, scrollY, innerWidth, clientWidth) mit allen Quellen
// (Knoten-Selektor, outerHTML 120 Zeichen, previousRect, currentRect), Aenderungen von class/style an html/body,
// Aenderungen von overflow/scrollbar-gutter/clientWidth (Bildlaufleiste) und style/class-Aenderungen im Dokument kurz vor einem Sprung.
import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";

const BASE = (process.env.CLS_BASE || "https://www.m365.fm").replace(/\/$/, "");
const PATHS = (process.env.CLS_PATHS || "/entity/windows-11/").split(/\s+/).filter(Boolean);
const BLOCK_ADS = process.env.CLS_BLOCK_ADS === "1";
const VIEWS = [{ n: "1528x860", vp: { width: 1528, height: 860 } }, { n: "1366x768", vp: { width: 1366, height: 768 } }];
const SCEN = (process.env.CLS_SCEN || "laden scroll_rad scroll_js hash_qa textfrag_faq neu_laden").split(/\s+/).filter(Boolean);
const ADS = /(googlesyndication|googleads|doubleclick|adservice|fundingchoices|adtrafficquality|googletagservices)/i;
const TRACK = /(clarity\.ms|google-analytics|googletagmanager)/i;   // Analyse blockiert (aendert kein Layout)

// Laeuft vor jedem Seitenskript (auch nach reload): sammelt alles in window.__cls
function probe() {
  const W = (window.__cls = { ls: [], html: [], st: [], mut: [], add: [] });
  const sel = (n) => {
    if (!n || n.nodeType !== 1) return n ? (n.nodeName || "?") : "null";
    const parts = [];
    for (let e = n, k = 0; e && e.nodeType === 1 && k < 4; e = e.parentElement, k++) {
      let s = e.tagName.toLowerCase();
      if (e.id) { s += "#" + e.id; parts.unshift(s); break; }
      const c = (typeof e.className === "string" ? e.className : "").trim().split(/\s+/).filter(Boolean).slice(0, 3);
      if (c.length) s += "." + c.join(".");
      parts.unshift(s);
    }
    return parts.join(" > ");
  };
  const rect = (r) => r ? { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } : null;
  const now = () => Math.round(performance.now());
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        W.ls.push({ t: Math.round(e.startTime), v: +e.value.toFixed(5), input: e.hadRecentInput, sy: Math.round(scrollY), iw: innerWidth,
          cw: document.documentElement.clientWidth,
          src: (e.sources || []).map((s) => ({ sel: sel(s.node), html: s.node && s.node.outerHTML ? s.node.outerHTML.slice(0, 120) : String(s.node && s.node.nodeName),
            prev: rect(s.previousRect), cur: rect(s.currentRect) })) });
      }
    }).observe({ type: "layout-shift", buffered: true });
  } catch (e) { W.err = String(e); }
  // class/style an html und body
  const watchAttr = (el, who) => new MutationObserver((ms) => { for (const m of ms) W.html.push({ t: now(), who, attr: m.attributeName, old: String(m.oldValue || "").slice(0, 160), neu: String(el.getAttribute(m.attributeName) || "").slice(0, 160), sy: Math.round(scrollY) }); })
    .observe(el, { attributes: true, attributeOldValue: true, attributeFilter: ["class", "style"] });
  // Beim Start des Init-Skripts gibt es documentElement oft noch nicht: erst danach beobachten
  let htmlOn = false, bodyOn = false;
  const onHtml = () => {
    if (htmlOn || !document.documentElement) return; htmlOn = true;
    watchAttr(document.documentElement, "html");
    new MutationObserver(onBody).observe(document.documentElement, { childList: true });
    onBody();
  };
  const onBody = () => {
    if (bodyOn || !document.body) return; bodyOn = true;
    watchAttr(document.body, "body");
    // style/class-Aenderungen und eingefuegte Elemente im ganzen Dokument (fuer "was geschah kurz vor dem Sprung")
    new MutationObserver((ms) => {
      for (const m of ms) {
        if (m.type === "attributes") { if (W.mut.length < 4000 && m.target !== document.body) W.mut.push({ t: now(), sel: sel(m.target), attr: m.attributeName, neu: String(m.target.getAttribute(m.attributeName) || "").slice(0, 140) }); }
        else for (const a of m.addedNodes) if (a.nodeType === 1 && W.add.length < 4000) W.add.push({ t: now(), sel: sel(a), into: sel(m.target), h: Math.round(a.getBoundingClientRect ? a.getBoundingClientRect().height : 0) });
      }
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["style", "class", "hidden", "open", "data-ad-status"] });
  };
  if (document.documentElement) onHtml(); else new MutationObserver((ms, o) => { if (document.documentElement) { o.disconnect(); onHtml(); } }).observe(document, { childList: true });
  document.addEventListener("DOMContentLoaded", () => { onHtml(); onBody(); });
  // berechnete Werte (overflow, scrollbar-gutter, Bildlaufleiste) bei jedem Frame vergleichen
  let last = "";
  const tick = () => {
    try {
      const h = document.documentElement; if (!h) return;
      const b = document.body, ch = getComputedStyle(h), cb = b ? getComputedStyle(b) : null;
      const mr = document.getElementById("main"), r = mr && mr.getBoundingClientRect();
      const s = { hOx: ch.overflowX, hOy: ch.overflowY, hGut: ch.scrollbarGutter, bOx: cb && cb.overflowX, bOy: cb && cb.overflowY, bPos: cb && cb.position, bPr: cb && cb.paddingRight, bMr: cb && cb.marginRight,
        iw: innerWidth, cw: h.clientWidth, main: r ? Math.round(r.x) + "/" + Math.round(r.width) : "-", sh: h.scrollHeight };
      const k = JSON.stringify({ ...s, sh: undefined });
      if (k !== last) { W.st.push({ t: now(), sy: Math.round(scrollY), ...s }); last = k; }
    } catch (e) {} finally { requestAnimationFrame(tick); }
  };
  requestAnimationFrame(tick);
}

const SCROLLBARS = process.env.CLS_SCROLLBARS !== "0";   // Standard: sichtbare klassische Bildlaufleiste wie Chrome unter Windows
const browser = await chromium.launch({ channel: "chrome", headless: true, ignoreDefaultArgs: SCROLLBARS ? ["--hide-scrollbars"] : [] });
const out = [];

async function run(view, path, scen) {
  const res0 = { view: view.n, path, scen, runs: [] };
  const ctx = await browser.newContext({ viewport: view.vp, deviceScaleFactor: 1, isMobile: false, hasTouch: false, locale: "en-US",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" });
  const page = await ctx.newPage();
  await page.route("**/*", (r) => { const u = r.request().url(); if (TRACK.test(u) || (BLOCK_ADS && ADS.test(u))) return r.abort(); return r.continue(); });
  await page.addInitScript(probe);
  let url = BASE + path + (scen === "hash_qa" ? "#en-qa" : "");
  if (scen === "textfrag_faq") {   // erste FAQ-Frage als Textfragment, wie aus einem Google-Treffer
    const q = FAQ[path]; if (!q) { res0.err = "keine FAQ-Frage gefunden"; await ctx.close(); return res0; }
    url = BASE + path + "#:~:text=" + encodeURIComponent(q);
  }
  const res = res0;
  const grab = async (label) => {
    const d = await page.evaluate(() => ({ ...window.__cls, end: { sy: Math.round(scrollY), sh: document.documentElement.scrollHeight, cw: document.documentElement.clientWidth, iw: innerWidth,
      htmlClass: document.documentElement.className,
      flat: [...document.querySelectorAll("body *")].filter((e) => { const r = e.getBoundingClientRect(); return r.width >= 1000 && r.height < 2; }).slice(0, 15).map((e) => { const r = e.getBoundingClientRect(), c = getComputedStyle(e);
        return { tag: e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") + (typeof e.className === "string" && e.className ? "." + e.className.trim().split(/\s+/).join(".") : ""), x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height), pos: c.position, disp: c.display, html: e.outerHTML.slice(0, 120) }; }),
      mainRect: (() => { const m = document.getElementById("main"); if (!m) return null; const r = m.getBoundingClientRect(); return { x: Math.round(r.x), w: Math.round(r.width) }; })(), bodyStyle: document.body.getAttribute("style") || "", ads: [...document.querySelectorAll("ins.adsbygoogle")].map((i) => ({ st: i.getAttribute("data-ad-status"), style: (i.getAttribute("style") || "").slice(0, 200), r: (({ x, y, width, height }) => ({ x: Math.round(x), y: Math.round(y + scrollY), w: Math.round(width), h: Math.round(height) }))(i.getBoundingClientRect()) })) } }));
    res.runs.push({ label, ...d });
  };
  const wheelToBottom = async () => {
    await page.mouse.move(view.vp.width / 2, view.vp.height / 2);
    for (let i = 0; i < 400; i++) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(110);
      const done = await page.evaluate(() => scrollY + innerHeight >= document.documentElement.scrollHeight - 4);
      if (done) break;
    }
  };
  const jsToBottom = async (stopAt) => {
    for (let i = 0; i < 400; i++) {
      const done = await page.evaluate((lim) => { scrollBy(0, 160); return scrollY + innerHeight >= document.documentElement.scrollHeight - 4 || (lim && scrollY >= lim); }, stopAt || 0);
      await page.waitForTimeout(120);
      if (done) break;
    }
  };
  try {
    await page.goto(url, { waitUntil: "load", timeout: 90000 });
    if (scen === "laden" || scen === "hash_qa") { await page.waitForTimeout(8000); await grab("laden"); }
    else if (scen === "scroll_rad") { await page.waitForTimeout(3000); await wheelToBottom(); await page.waitForTimeout(4000); await grab("scroll"); }
    else if (scen === "scroll_js") { await page.waitForTimeout(3000); await jsToBottom(); await page.waitForTimeout(4000); await grab("scroll"); }
    else if (scen === "neu_laden") {
      await page.waitForTimeout(3000);
      const half = await page.evaluate(() => Math.round(document.documentElement.scrollHeight / 2));
      await jsToBottom(half); await page.waitForTimeout(1500); await grab("vor_reload");
      await page.reload({ waitUntil: "load", timeout: 90000 }); await page.waitForTimeout(8000); await grab("nach_reload");
    }
  } catch (e) { res.err = String(e).slice(0, 200); }
  await ctx.close();
  return res;
}

const FAQ = {};
for (const path of PATHS) {
  try {
    const r = await fetch(BASE + path, { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" } });
    const m = (await r.text()).match(/<section class="en-faq">[\s\S]*?<details><summary>([^<]{8,140})/);
    if (m) FAQ[path] = m[1].replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').trim().split(/\s+/).slice(0, 6).join(" ");
  } catch (e) {}
}
for (const path of PATHS) for (const view of VIEWS) for (const scen of SCEN) out.push(await run(view, path, scen));
await browser.close();

// ---- Bericht (deutsch) ----
const f3 = (x) => (x || 0).toFixed(3);
const R = (r) => r ? `${r.x},${r.y} ${r.w}x${r.h}` : "-";
// CLS wie Chrome: groesstes Sitzungsfenster (Luecke < 1 s, max 5 s), nur ohne kuerzliche Eingabe
function clsOf(ls) {
  let best = 0, cur = 0, first = -1e9, prev = -1e9;
  for (const e of ls.filter((x) => !x.input).sort((a, b) => a.t - b.t)) {
    if (e.t - prev > 1000 || e.t - first > 5000) { cur = 0; first = e.t; }
    cur += e.v; prev = e.t; best = Math.max(best, cur);
  }
  return best;
}
const L = [`## CLS beim Laden und Scrollen (${BASE}, Werbung ${BLOCK_ADS ? "blockiert" : "an"}, Bildlaufleiste ${SCROLLBARS ? "sichtbar" : "ausgeblendet"})`, "", `FAQ-Textfragment: ${JSON.stringify(FAQ)}`, "",
  "| Seite | Ansicht | Szenario | Lauf | CLS (Fenster) | Summe ohne Eingabe | Spruenge | groesster Sprung | Bildlaufleiste px (iw-cw) | AdSense-Bloecke |", "|---|---|---|---|---|---|---|---|---|---|"];
for (const r of out) {
  if (r.err) L.push(`| ${r.path} | ${r.view} | ${r.scen} | FEHLER | ${r.err.replace(/\|/g, "/")} | | | | | |`);
  for (const x of r.runs) {
    const ls = x.ls || [], sum = ls.filter((e) => !e.input).reduce((a, e) => a + e.v, 0), big = ls.slice().sort((a, b) => b.v - a.v)[0];
    const sb = [...new Set((x.st || []).map((s) => s.iw - s.cw))].join("/");
    L.push(`| ${r.path} | ${r.view} | ${r.scen} | ${x.label} | **${f3(clsOf(ls))}** | ${f3(sum)} | ${ls.length} | ${big ? f3(big.v) + " @" + big.t + " ms, scrollY " + big.sy : "-"} | ${sb} | ${(x.end.ads || []).map((a) => (a.st || "?") + " " + a.r.w + "x" + a.r.h).join(", ") || "-"} |`);
  }
}
L.push("", "### Einzelne Spruenge (Wert >= 0,001) mit Quellen und Ereignissen 0-600 ms davor", "");
for (const r of out) for (const x of r.runs) {
  const ls = (x.ls || []).filter((e) => e.v >= 0.001);
  if (!ls.length) continue;
  L.push(`#### ${r.path} · ${r.view} · ${r.scen} · ${x.label}`, "");
  for (const e of ls) {
    L.push(`- **${f3(e.v)}** @${e.t} ms, Eingabe=${e.input}, scrollY=${e.sy}, innerWidth=${e.iw}, clientWidth=${e.cw}`);
    for (const s of e.src) L.push(`  - \`${s.sel}\` ${R(s.prev)} -> ${R(s.cur)} · \`${s.html.replace(/`/g, "'").replace(/\s+/g, " ")}\``);
    const near = (arr) => (arr || []).filter((m) => m.t <= e.t + 20 && m.t >= e.t - 600);
    for (const m of near(x.html)) L.push(`  - ${m.who}.${m.attr} @${m.t}: "${m.old}" -> "${m.neu}"`);
    for (const m of near(x.st)) L.push(`  - berechnet @${m.t}: html overflow ${m.hOx}/${m.hOy} gutter ${m.hGut}, body overflow ${m.bOx}/${m.bOy} position ${m.bPos} padding-right ${m.bPr}, iw ${m.iw} cw ${m.cw}, #main x/Breite ${m.main}`);
    const mu = near(x.mut).filter((m) => !/^html|lenis/.test(m.neu)).slice(-8);
    for (const m of mu) L.push(`  - style/class @${m.t}: \`${m.sel}\` ${m.attr}="${m.neu.replace(/`/g, "'")}"`);
    for (const m of near(x.add).slice(-6)) L.push(`  - eingefuegt @${m.t}: \`${m.sel}\` in \`${m.into}\` (h ${m.h})`);
  }
  L.push("");
}
L.push("### Aenderungen an html/body (class/style) und berechnete Werte", "");
for (const r of out) for (const x of r.runs) {
  const hs = (x.html || []).filter((m) => !(m.who === "html" && m.attr === "class" && /lenis/.test(m.old + m.neu) && m.old.replace(/\s*lenis(-\w+)?/g, "") === m.neu.replace(/\s*lenis(-\w+)?/g, "")));
  const lenisN = (x.html || []).length - hs.length;
  L.push(`- ${r.path} · ${r.view} · ${r.scen} · ${x.label}: ${hs.length} Aenderungen (+${lenisN} reine Lenis-Klassenwechsel); Ende html.class="${x.end.htmlClass}" body.style="${x.end.bodyStyle}" scrollY=${x.end.sy} Hoehe=${x.end.sh}`);
  for (const m of hs.slice(0, 12)) L.push(`  - ${m.who}.${m.attr} @${m.t} (scrollY ${m.sy}): "${m.old}" -> "${m.neu}"`);
  for (const s of (x.st || []).slice(0, 12)) L.push(`  - berechnet @${s.t} (scrollY ${s.sy}): html ${s.hOx}/${s.hOy} gutter=${s.hGut} · body ${s.bOx}/${s.bOy} ${s.bPos} pr=${s.bPr} mr=${s.bMr} · iw ${s.iw} cw ${s.cw} · #main ${s.main}`);
  for (const a of x.end.ads || []) L.push(`  - AdSense: status=${a.st} ${R(a.r)} style="${a.style}"`);
  if (x.end.mainRect) L.push(`  - #main am Ende: x=${x.end.mainRect.x} Breite=${x.end.mainRect.w}`);
  for (const e of x.end.flat || []) L.push(`  - flach (>=1000 px breit, <2 px hoch): \`${e.tag}\` x=${e.x} ${e.w}x${e.h} position=${e.pos} display=${e.disp} · \`${e.html.replace(/`/g, "'").replace(/\s+/g, " ")}\``);
}
console.log(L.join("\n"));
writeFileSync(process.env.CLS_JSON || "/tmp/cls_scroll.json", JSON.stringify(out));
