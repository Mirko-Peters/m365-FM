// CLS-Messung auf der Live-Seite (nur lesen): laedt Seiten wie ein Leser (Desktop und eine Mobil-Kontrolle), scrollt bis zum Ende und misst
// Layout-Shifts nach der offiziellen Regel (groesstes Sitzungsfenster: Luecke < 1 s, Fenster <= 5 s, ohne Shifts nach Nutzereingabe).
// AdSense wird NIE geladen (keine Test-Impressionen auf dem eigenen Konto); stattdessen simuliert der Lauf die beiden Faelle
// "Block bleibt leer" (data-ad-status=unfilled, der Block faellt per CSS weg) und "Anzeige hoeher als reserviert" auf den echten Seiten.
// Aufruf: node tools/cls_live.mjs [base] < urls.txt   (eine Pfadangabe je Zeile; base Standard https://www.m365.fm)
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";

const BASE = (process.argv[2] || process.env.CLS_BASE || "https://www.m365.fm").replace(/\/$/, "");
const PATHS = readFileSync(0, "utf8").split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith("#"));
const VIEWS = [
  { name: "desktop-1366", viewport: { width: 1366, height: 768 }, mobile: false },
  { name: "desktop-1920", viewport: { width: 1920, height: 1080 }, mobile: false },
  { name: "mobil-390", viewport: { width: 390, height: 844 }, mobile: true },
];
const ADS = (process.env.CLS_ADS || "none,unfilled,tall").split(",");
const BLOCK = /(pagead2\.googlesyndication|googleads|doubleclick|adservice\.google|fundingchoicesmessages|adtrafficquality|clarity\.ms)/i;

const OBSERVE = () => {
  window.__ls = [];
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      if (e.hadRecentInput) continue;
      const src = (e.sources || []).map((s) => {
        const n = s.node, el = n && (n.nodeType === 3 ? n.parentElement : n);
        let sel = "?";
        if (el && el.tagName) {
          sel = el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".") : "");
          const p = el.parentElement;
          if (p && p.tagName) sel = p.tagName.toLowerCase() + (p.id ? "#" + p.id : "") + (typeof p.className === "string" && p.className.trim() ? "." + p.className.trim().split(/\s+/)[0] : "") + " > " + sel;
        }
        const r = (x) => x ? [Math.round(x.x), Math.round(x.y), Math.round(x.width), Math.round(x.height)] : null;
        return { sel, txt: el ? (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 50) : "", prev: r(s.previousRect), cur: r(s.currentRect) };
      });
      window.__ls.push({ v: e.value, t: Math.round(e.startTime), y: Math.round(window.scrollY), src });
    }
  }).observe({ type: "layout-shift", buffered: true });
  window.__res = [];
  new PerformanceObserver((list) => { for (const e of list.getEntries()) window.__res.push({ n: e.name.slice(0, 120), t: Math.round(e.responseEnd), i: e.initiatorType }); })
    .observe({ type: "resource", buffered: true });
};

function sessionMax(shifts) {
  let best = 0, cur = 0, start = -1, last = -1, win = [], bestWin = [];
  for (const s of shifts) {
    if (start < 0 || s.t - last >= 1000 || s.t - start >= 5000) { cur = 0; start = s.t; win = []; }
    cur += s.v; last = s.t; win.push(s);
    if (cur > best) { best = cur; bestWin = win.slice(); }
  }
  return { cls: best, win: bestWin };
}

async function measure(browser, view, path, ad) {
  const ctx = await browser.newContext({ viewport: view.viewport, isMobile: view.mobile, hasTouch: view.mobile, deviceScaleFactor: view.mobile ? 2 : 1,
    userAgent: view.mobile ? "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36" : undefined, locale: "en-US" });
  await ctx.route(ad === "real" ? /clarity\.ms/i : BLOCK, (r) => r.abort());   // real: echte Anzeigen (nur wenige Aufrufe, nie Klicks)
  const page = await ctx.newPage();
  await page.addInitScript(OBSERVE);
  if (ad !== "none" && ad !== "real") {
    await page.addInitScript((mode) => {
      const lazy = mode.startsWith("lazy"), m = mode.replace("lazy", "");
      const apply = (ins) => { if (m === "unfilled") ins.setAttribute("data-ad-status", "unfilled"); else { ins.setAttribute("data-ad-status", "filled"); ins.style.height = "600px"; } };
      if (!lazy) { setTimeout(() => document.querySelectorAll("ins.adsbygoogle").forEach(apply), 1800); return; }
      // wie AdSense: Anfrage, wenn der Block sich dem Sichtbereich naehert; Antwort nach ~600 ms (dann ist der Block oft schon sichtbar)
      addEventListener("DOMContentLoaded", () => {
        const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); setTimeout(() => apply(e.target), 600); } }), { rootMargin: "0px 0px 100% 0px" });
        document.querySelectorAll("ins.adsbygoogle").forEach((ins) => io.observe(ins));
      });
    }, ad);
  }
  const out = { view: view.name, path, ad, status: 0, cls: 0, n: 0, top: [], ads: 0, imgNoDim: 0, err: "" };
  try {
    const res = await page.goto(BASE + path, { waitUntil: "load", timeout: 45000 });
    out.status = res ? res.status() : 0;
    await page.waitForTimeout(3000);
    for (let i = 0; i < 60; i++) {
      const done = await page.evaluate(() => { window.scrollBy(0, Math.round(innerHeight * 0.7)); return innerHeight + scrollY >= document.documentElement.scrollHeight - 2; });
      await page.waitForTimeout(1200);
      if (done) break;
    }
    await page.waitForTimeout(3000);
    const data = await page.evaluate(() => ({
      ls: window.__ls,
      ads: document.querySelectorAll("ins.adsbygoogle").length,
      adst: [...document.querySelectorAll("ins.adsbygoogle")].map((i) => (i.getAttribute("data-ad-status") || "-") + ":" + Math.round(i.getBoundingClientRect().height) + (i.closest(".ad") ? "" : ":auto")).join(" "),
      auto: document.querySelectorAll(".google-auto-placed, ins[data-anchor-status], ins[data-side-rail-status], ins[data-vignette-loaded]").length,
      img: [...document.querySelectorAll("main img, article img")].filter((i) => !(i.getAttribute("width") && i.getAttribute("height")) && !getComputedStyle(i).aspectRatio.includes("/")).length,
    }));
    const { cls, win } = sessionMax(data.ls);
    out.cls = +cls.toFixed(4); out.n = data.ls.length; out.ads = data.ads; out.imgNoDim = data.img; out.adst = data.adst; out.auto = data.auto;
    out.top = win.slice().sort((a, b) => b.v - a.v).slice(0, 4).map((s) => ({ v: +s.v.toFixed(4), t: s.t, y: s.y, src: s.src.slice(0, 3) }));
  } catch (e) { out.err = String(e.message || e).slice(0, 200); }
  await ctx.close();
  return out;
}

const browser = await chromium.launch(process.env.CLS_EXEC ? { executablePath: process.env.CLS_EXEC, headless: true } : { channel: "chrome", headless: true });
const results = [];
const jobs = [];
const REAL = new Set((process.env.CLS_REAL_PATHS || "").split(/\s+/).filter(Boolean));
const VSET = new Set((process.env.CLS_VIEWS || VIEWS.map((v) => v.name).join(",")).split(","));
for (const path of PATHS) for (const view of VIEWS) {
  if (!VSET.has(view.name)) continue;
  for (const ad of (view.mobile ? ["none"] : ADS.filter((a) => a !== "real"))) jobs.push({ path, view, ad });
  if (view.name === "desktop-1366" && REAL.has(path)) jobs.push({ path, view, ad: "real" });
}
const PAR = +(process.env.CLS_PAR || 4);
let next = 0;
await Promise.all(Array.from({ length: PAR }, async () => {
  while (next < jobs.length) {
    const j = jobs[next++];
    const r = await measure(browser, j.view, j.path, j.ad);
    results.push(r);
    console.error(`${r.view.padEnd(13)} ${r.ad.padEnd(8)} ${String(r.cls).padEnd(7)} ${r.status} ${r.path}${r.err ? "  ERR " + r.err : ""}`);
  }
}));
await browser.close();
results.sort((a, b) => a.path.localeCompare(b.path) || a.view.localeCompare(b.view) || a.ad.localeCompare(b.ad));
const md = ["## CLS live (groesstes Sitzungsfenster, mit Scrollen bis zum Ende; AdSense nie geladen, nur simuliert)", "",
  "| Seite | Ansicht | Anzeige | CLS | Shifts | Bloecke | Bilder ohne Masse | groesster Verursacher |", "|---|---|---|---|---|---|---|---|"];
for (const r of results) {
  const t = r.top[0];
  const who = t ? `${t.v} @${t.t}ms y=${t.y}: ${t.src.map((s) => "`" + s.sel + "` " + JSON.stringify(s.prev) + "→" + JSON.stringify(s.cur)).join("; ")}` : (r.err || "");
  md.push(`| ${r.path} | ${r.view} | ${r.ad} | ${r.cls >= 0.25 ? "**" + r.cls + "**" : r.cls} | ${r.n} | ${r.ads} ${r.adst || ""}${r.auto ? " auto=" + r.auto : ""} | ${r.imgNoDim} | ${who.replace(/\|/g, "/")} |`);
}
console.log(md.join("\n"));
console.log("\n<!-- JSON\n" + JSON.stringify(results) + "\n-->");
