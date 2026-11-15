// Rauchtest der Testumgebung nach dem Staging-Deploy: ruft die wichtigsten Seiten und API-Routen von staging.m365.fm / api-staging.m365.fm ab.
// Aufruf:  node tools/staging_smoke.mjs [--site https://staging.m365.fm] [--api https://api-staging.m365.fm] [--wait 180]
// Ende 0 = alles in Ordnung, 1 = mindestens ein Fehler (Ergebnis fliesst in den Statuscheck staging-geprueft, staging-checks.yml).
// Cloudflare Access: sind die Umgebungsvariablen STAGING_ACCESS_ID und STAGING_ACCESS_SECRET gesetzt (Service-Token, nur als GitHub-Secrets), gehen sie als
// Header CF-Access-Client-Id / CF-Access-Client-Secret mit. Werte werden nie ausgegeben. Der Test spricht NUR mit den Staging-Adressen und lehnt andere Hosts ab.
import { fileURLToPath } from "node:url";

export const DEFAULT_SITE = "https://staging.m365.fm";
export const DEFAULT_API = "https://api-staging.m365.fm";
const ALLOWED_HOSTS = new Set(["staging.m365.fm", "api-staging.m365.fm"]);
const FORBIDDEN_HOSTS = new Set(["www.m365.fm", "m365.fm", "dub.m365.fm", "api-dub.m365.fm", "img.m365.fm"]);

export function checkHost(url, extraAllowed = []) {
  const h = new URL(url).hostname;
  if (FORBIDDEN_HOSTS.has(h)) throw new Error(`Rauchtest gegen Live-Adresse ${h} abgelehnt`);
  if (!ALLOWED_HOSTS.has(h) && !extraAllowed.includes(h)) throw new Error(`Rauchtest nur gegen staging.m365.fm / api-staging.m365.fm, nicht gegen ${h}`);
  return url.replace(/\/+$/, "");
}

export function accessHeaders(env = process.env) {
  const id = env.STAGING_ACCESS_ID || "", secret = env.STAGING_ACCESS_SECRET || "";
  return id && secret ? { "CF-Access-Client-Id": id, "CF-Access-Client-Secret": secret } : {};
}

// Seiten-Arten fuer die Stichprobe aus dem Sitemap (Pfad-Muster)
export const KINDS = [
  { name: "Folgenseite", rx: [/^\/(?:[a-z]{2}\/)?show\/episodes\/[a-z0-9-]+\/$/, /^\/(?:de|es|fr|it|pt|nl|pl|id|ru|uk|ar|he|ja|ko)\/(?!community|entity|glossary|learn|sponsor|updates|podcast|show|top|search|directory)[a-z0-9-]{12,}\/$/] },
  { name: "Entitaetsseite", rx: [/^\/(?:[a-z]{2}\/)?entity\/[a-z0-9-]+\/$/] },
  { name: "Eventseite", rx: [/^\/(?:[a-z]{2}\/)?community\/events\/[a-z0-9-]+\/$/] },
];

export function locsOf(xml) {
  return [...String(xml).matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));
}

export async function runSmoke({ site = DEFAULT_SITE, api = DEFAULT_API, headers = {}, fetchImpl = fetch, retries = 3, delayMs = 5000, wait = 0, log = console.log, extraAllowed = [] } = {}) {
  site = checkHost(site, extraAllowed); api = checkHost(api, extraAllowed);
  const results = [];
  const record = (name, ok, detail = "") => { results.push({ name, ok, detail }); log(`${ok ? "OK    " : "FEHLER"} ${name}${detail ? " - " + detail : ""}`); return ok; };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function get(url, { json = false, tries = retries } = {}) {
    let last = "";
    for (let i = 0; i < tries; i++) {
      try {
        const res = await fetchImpl(url, { headers: { "user-agent": "m365-staging-smoke", accept: json ? "application/json" : "text/html,*/*", ...headers }, redirect: "manual", signal: AbortSignal.timeout(20000) });
        const body = await res.text();
        if (res.status < 500 && res.status !== 429) return { res, body };
        last = `HTTP ${res.status}`;
      } catch (e) { last = String(e?.cause?.code || e?.message || e).slice(0, 120); }
      if (i + 1 < tries) await sleep(delayMs);
    }
    return { res: null, body: "", error: last };
  }
  const noindex = (res) => /noindex/i.test(res.headers.get("x-robots-tag") || "") && /nofollow/i.test(res.headers.get("x-robots-tag") || "");
  const accessHint = (r) => (r.res && (r.res.status === 401 || r.res.status === 403 || (r.res.status >= 300 && r.res.status < 400 && /cloudflareaccess/i.test(r.res.headers.get("location") || ""))) ? " (Cloudflare Access? STAGING_ACCESS_ID / STAGING_ACCESS_SECRET pruefen)" : "");

  // 0) Warten, bis der Deploy greift (neuer Worker, Custom Domain, Zertifikat)
  const t0 = Date.now();
  for (;;) {
    const h = await get(api + "/api/health", { json: true, tries: 1 });
    if (h.res && h.res.status === 200) break;
    if (Date.now() - t0 >= wait * 1000) break;
    await sleep(Math.min(10000, delayMs));
  }

  // 1) API
  const health = await get(api + "/api/health", { json: true });
  if (!health.res) record("API /api/health", false, health.error);
  else {
    let j = null; try { j = JSON.parse(health.body); } catch { /* unten */ }
    record("API /api/health", health.res.status === 200 && j?.ok === true, `HTTP ${health.res.status}${accessHint(health)}`);
    record("API Antwort ist noindex, nofollow", noindex(health.res), health.res.headers.get("x-robots-tag") || "Header fehlt");
  }
  const events = await get(api + "/api/events/export", { json: true });
  if (!events.res) record("API /api/events/export", false, events.error);
  else {
    let j = null; try { j = JSON.parse(events.body); } catch { /* unten */ }
    record("API /api/events/export", events.res.status === 200 && j !== null && typeof j === "object", `HTTP ${events.res.status}${accessHint(events)}`);
  }
  const arobots = await get(api + "/robots.txt");
  record("API robots.txt sperrt alles", !!arobots.res && arobots.res.status === 200 && /Disallow:\s*\/\s*$/m.test(arobots.body), arobots.res ? `HTTP ${arobots.res.status}` : arobots.error);

  // 2) Seite
  const robots = await get(site + "/robots.txt");
  record("Seite robots.txt sperrt alles", !!robots.res && robots.res.status === 200 && /Disallow:\s*\/\s*$/m.test(robots.body), robots.res ? `HTTP ${robots.res.status}${accessHint(robots)}` : robots.error);
  for (const [name, path] of [["Startseite (en)", "/"], ["Startseite (de)", "/de/"]]) {
    const r = await get(site + path);
    const ok = !!r.res && r.res.status === 200 && /<html/i.test(r.body) && /text\/html/i.test(r.res.headers.get("content-type") || "");
    record(`Seite ${name}`, ok, r.res ? `HTTP ${r.res.status}${accessHint(r)}` : r.error);
    if (r.res) record(`Seite ${name} ist noindex, nofollow`, noindex(r.res), r.res.headers.get("x-robots-tag") || "Header fehlt");
  }

  // 3) Stichprobe aus dem Sitemap: je eine Folgen-, Entitaets- und Eventseite
  const sm = await get(site + "/sitemap.xml");
  let locs = [];
  if (sm.res && sm.res.status === 200) {
    locs = locsOf(sm.body);
    const children = locs.filter((u) => /\.xml(\?|$)/.test(u)).slice(0, 8);
    if (children.length) {
      locs = locs.filter((u) => !/\.xml(\?|$)/.test(u));
      for (const c of children) { const cr = await get(site + new URL(c).pathname); if (cr.res && cr.res.status === 200) locs.push(...locsOf(cr.body)); }
    }
  }
  record("Seite /sitemap.xml mit Adressen", locs.length > 0, sm.res ? `HTTP ${sm.res.status}, ${locs.length} Adressen${accessHint(sm)}` : sm.error);
  const paths = [...new Set(locs.map((u) => { try { return new URL(u).pathname; } catch { return ""; } }).filter(Boolean))];
  for (const k of KINDS) {
    let pick; for (const rx of k.rx) { pick = paths.find((p) => rx.test(p)); if (pick) break; }
    if (!pick) { record(`Seite ${k.name} (Stichprobe)`, false, "im Sitemap keine Adresse dieser Art"); continue; }
    const r = await get(site + pick);
    record(`Seite ${k.name} ${pick}`, !!r.res && r.res.status === 200 && /<html/i.test(r.body), r.res ? `HTTP ${r.res.status}` : r.error);
  }

  const bad = results.filter((r) => !r.ok);
  log(`\nRauchtest Staging: ${results.length - bad.length} von ${results.length} Pruefungen bestanden${bad.length ? ", " + bad.length + " FEHLER" : ""}.`);
  return { ok: bad.length === 0, results };
}

function arg(name, def) { const i = process.argv.indexOf("--" + name); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : def; }

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    const out = await runSmoke({ site: arg("site", process.env.STAGING_SITE || DEFAULT_SITE), api: arg("api", process.env.STAGING_API || DEFAULT_API), headers: accessHeaders(), wait: Number(arg("wait", "0")) });
    if (process.env.GITHUB_STEP_SUMMARY) {
      const { appendFileSync } = await import("node:fs");
      appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Rauchtest Staging\n\n${out.results.map((r) => `- ${r.ok ? "OK" : "**FEHLER**"} ${r.name}${r.detail ? " - " + r.detail : ""}`).join("\n")}\n`);
    }
    process.exit(out.ok ? 0 : 1);
  } catch (e) {
    console.error("::error::" + e.message);
    process.exit(1);
  }
}
