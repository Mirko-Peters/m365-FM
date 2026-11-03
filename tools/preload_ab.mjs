// A/B der Schrift-Preloads auf der Live-Seite (nur lesen): dieselbe HTML-Seite wird in Varianten ausgeliefert (nur die Preload-Zeilen
// unterscheiden sich), alle anderen Dateien kommen live. Mobil mit gedrosseltem Netz (150 ms RTT, 1,6 Mbit/s) und 4x CPU, Desktop ungedrosselt.
// Werbung/Analyse blockiert (gleiche Bedingungen fuer alle Varianten). Varianten wechseln sich je Durchgang ab.
import { chromium } from "playwright-core";
const BASE = "https://www.m365.fm";
const PATHS = (process.env.AB_PATHS || "/ /de/ /entity/copilot/ /show/episodes/internal-developer-platforms/").split(/\s+/).filter(Boolean);
const REPS = +(process.env.AB_REPS || 7);
const F = (n, extra = "") => `<link rel="preload" href="${BASE}/assets/fonts/${n}-normal.woff2" as="font" type="font/woff2" crossorigin${extra}>`;
const VARIANTS = {
  A_zwei: F("barlow-latin-400") + F("barlow-condensed-latin-600"),
  B_vier: F("barlow-latin-400") + F("barlow-condensed-latin-500") + F("barlow-condensed-latin-600") + F("barlow-condensed-latin-700"),
  C_zwei_plus_zwei_low: F("barlow-latin-400") + F("barlow-condensed-latin-600") + F("barlow-condensed-latin-500", ' fetchpriority="low"') + F("barlow-condensed-latin-700", ' fetchpriority="low"'),
  D_zwei_plus_zwei_ab701: F("barlow-latin-400") + F("barlow-condensed-latin-600") + F("barlow-condensed-latin-500", ' media="(min-width: 701px)"') + F("barlow-condensed-latin-700", ' media="(min-width: 701px)"'),
};
const BLOCK = /(googlesyndication|googleads|doubleclick|adservice|fundingchoices|adtrafficquality|clarity\.ms|media\.net|googletagservices)/i;
const RX = /(<link rel="preload" href="https:\/\/www\.m365\.fm\/assets\/fonts\/[^"]+" as="font" type="font\/woff2" crossorigin[^>]*>)+/;
const VIEWS = [{ n: "mobil", m: true, vp: { width: 390, height: 844 }, net: { latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 0.75e6 / 8 }, cpu: 4 },
               { n: "desktop", m: false, vp: { width: 1366, height: 768 }, net: null, cpu: 1 }];
const med = (a) => { const s = a.filter((x) => x != null).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const html = {};
for (const p of PATHS) { const r = await fetch(BASE + p, { headers: { "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36", accept: "text/html" } }); html[p] = await r.text(); if (!RX.test(html[p])) console.error("WARNUNG: keine Preload-Zeilen gefunden in", p); }
const browser = await chromium.launch({ channel: "chrome", headless: true });
const res = [];
async function once(view, path, vname) {
  const ctx = await browser.newContext({ viewport: view.vp, isMobile: view.m, hasTouch: view.m, deviceScaleFactor: view.m ? 2 : 1,
    userAgent: view.m ? "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36" : undefined });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable"); await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  if (view.net) await cdp.send("Network.emulateNetworkConditions", { offline: false, ...view.net });
  if (view.cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: view.cpu });
  const body = html[path].replace(RX, VARIANTS[vname]);
  await page.route("**/*", (r) => { const u = r.request().url(); if (BLOCK.test(u)) return r.abort(); if (u === BASE + path && r.request().resourceType() === "document") return r.fulfill({ status: 200, contentType: "text/html; charset=utf-8", body }); return r.continue(); });
  await page.addInitScript(() => { window.__lcp = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true }); });
  let out = null;
  try {
    await page.goto(BASE + path, { waitUntil: "load", timeout: 90000 });
    await page.waitForTimeout(2500);
    out = await page.evaluate(() => {
      const r = performance.getEntriesByType("resource"), fcp = (performance.getEntriesByName("first-contentful-paint")[0] || {}).startTime;
      const end = (re) => Math.max(0, ...r.filter((x) => re.test(x.name)).map((x) => x.responseEnd));
      return { fcp, lcp: window.__lcp, cls: window.__cls, css: end(/site\.[0-9a-f]+\.css/), fonts4: end(/barlow-(latin-400|condensed-latin-(500|600|700))-normal/), fontsAll: end(/\.woff2/) };
    });
  } catch (e) { console.error("Fehler", view.n, path, vname, String(e).slice(0, 120)); }
  await ctx.close();
  return out;
}
for (const view of VIEWS) for (const path of PATHS) for (let i = 0; i < REPS; i++) {
  const order = Object.keys(VARIANTS); for (let k = 0; k < i % order.length; k++) order.push(order.shift());   // Reihenfolge rotiert
  for (const v of order) { const o = await once(view, path, v); if (o) res.push({ view: view.n, path, v, ...o }); }
}
await browser.close();
const md = [`## Preload-A/B (Median aus ${REPS} Durchgaengen je Variante; mobil 150 ms RTT, 1,6 Mbit/s, CPU 4x; Werbung blockiert)`, "",
  "| Ansicht | Seite | Variante | FCP ms | LCP ms | CSS fertig ms | 4 Schriften fertig ms | alle Schriften ms | CLS |", "|---|---|---|---|---|---|---|---|---|"];
for (const view of VIEWS) for (const path of PATHS) for (const v of Object.keys(VARIANTS)) {
  const g = res.filter((r) => r.view === view.n && r.path === path && r.v === v);
  const m = (k) => Math.round(med(g.map((x) => x[k])));
  md.push(`| ${view.n} | ${path} | ${v} | ${m("fcp")} | ${m("lcp")} | ${m("css")} | ${m("fonts4")} | ${m("fontsAll")} | ${(med(g.map((x) => x.cls)) || 0).toFixed(3)} |`);
}
console.log(md.join("\n"));
console.log("\n<!-- JSON " + JSON.stringify(res) + " -->");
