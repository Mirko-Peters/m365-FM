// Testumgebung (Staging): ENVIRONMENT = "staging" (worker/wrangler.toml, [env.staging]). Eine saubere Stelle fuer alles, was in der Testumgebung
// NICHT nach aussen wirken darf: Mailversand, KI, LinkedIn/Spreaker/YouTube/Google-Maps/HeySummit, Push, echte Zahlungen, Live-API.
// Vier Schichten, jede fuer sich ausreichend:
//  1. Die Staging-Konfiguration hat diese Bindungen und Secrets gar nicht (Test: tools/check_staging_isolation.py).
//  2. stagingEnv(): selbst wenn jemand ein Secret oder eine Bindung doch setzt, sieht der Code sie in Staging nicht.
//  3. mailer.js (sendMail/mailReady) und util.js (anthropicFetch) pruefen isStaging() noch einmal ausdruecklich.
//  4. guardFetch(): jeder Abruf zu einem gesperrten Host wirft einen Fehler, noch bevor er das Netz erreicht.
// Auf dem Live-Worker ist ENVIRONMENT nicht gesetzt: isStaging() ist false, nichts davon wird aktiv.

export const isStaging = (env) => String(env?.ENVIRONMENT || "").toLowerCase() === "staging";

// Secrets und Bindungen mit Wirkung nach aussen. In Staging gelten sie als nicht vorhanden (auch wenn sie gesetzt sind).
// Anmelde-Anbieter (Google, Microsoft, GitHub) bleiben: sie lesen nur eine Identitaet und schreiben nichts.
export const STAGING_STRIPPED = [
  "EMAIL", "RESEND_API_KEY",                                   // Mailversand
  "AI", "VEC", "ANTHROPIC_API_KEY", "CF_AIG_TOKEN", "AI_GATEWAY_ID",   // KI (Workers AI, Vectorize, Claude ueber das Gateway)
  "SPREAKER_TOKEN", "SPREAKER_API",                            // Spreaker
  "YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN", "YT_API", "YT_TOKEN_URL",   // YouTube
  "LINKEDIN_CLIENT_ID", "LINKEDIN_CLIENT_SECRET", "LINKEDIN_EVENTS_CLIENT_ID", "LINKEDIN_EVENTS_CLIENT_SECRET", "LINKEDIN_TOKEN_KEY",   // LinkedIn
  "HEYSUMMIT_API_KEY",                                         // HeySummit
  "GOOGLE_MAPS_API_KEY", "GOOGLE_GEOCODING_KEY",               // Maps / Geocoding (kostet)
  "VAPID_PRIVATE_JWK", "VAPID_PUBLIC",                         // Web-Push
  "PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET", "PAYPAL_WEBHOOK_ID",   // echte PayPal-Zugaenge (nur die Sandbox-Variante bleibt)
  "ADMIN_SUBS",                                                // kein Live-Admin in Staging
];

// Staging-Sicht auf env: Prototyp bleibt die echte env (Bindungen wie DB funktionieren), gesperrte Namen sind undefined, Zahlung/Werbung erzwungen.
export function stagingEnv(env) {
  const e = Object.create(env);
  for (const k of STAGING_STRIPPED) Object.defineProperty(e, k, { value: undefined, enumerable: true });
  Object.defineProperty(e, "PAYPAL_ENV", { value: "sandbox", enumerable: true });
  Object.defineProperty(e, "ADS_BOOKING", { value: "0", enumerable: true });
  return e;
}

// Gesperrte Hosts: Dienste, die senden, schreiben, Geld oder Kontingent kosten. Eintrag "*.x.y" = x.y und alle Subdomains.
export const BLOCKED_HOSTS = [
  "api.resend.com",                                                       // Mail
  "api.anthropic.com", "gateway.ai.cloudflare.com",                       // KI
  "api.spreaker.com",                                                     // Spreaker
  "api.linkedin.com", "www.linkedin.com", "linkedin.com",                 // LinkedIn
  "www.googleapis.com", "maps.googleapis.com", "fcm.googleapis.com",      // YouTube, Geocoding, Push (Chrome)
  "api.heysummit.com",                                                    // HeySummit
  "api-m.paypal.com",                                                     // echtes PayPal (api-m.sandbox.paypal.com bleibt erlaubt)
  "updates.push.services.mozilla.com", "web.push.apple.com", "*.notify.windows.com",   // Web-Push der Browser-Anbieter
  "api-dub.m365.fm",                                                      // Live-API: Staging redet nie mit Live
];

export function blockedHost(hostname) {
  const h = String(hostname || "").toLowerCase().replace(/\.$/, "");
  return BLOCKED_HOSTS.some((p) => (p.startsWith("*.") ? h === p.slice(2) || h.endsWith(p.slice(1)) : h === p));
}

export class StagingBlocked extends Error {
  constructor(host) { super(`Staging: Abruf zu ${host} ist gesperrt`); this.name = "StagingBlocked"; this.code = "staging_blocked"; this.host = host; }
}

// Ersetzt fetch durch eine Fassung, die gesperrte Hosts abweist. Gibt true zurueck, wenn der Schutz aktiv ist (sonst muss der Aufrufer ablehnen).
export function installFetchGuard(scope = globalThis) {
  try {
    if (scope.__stagingFetchGuard) return true;
    const real = scope.fetch;
    if (typeof real !== "function") return false;
    const guarded = async function fetch(input, init) {   // async: auch ein fetch(...).catch(...) im Aufrufer faengt den Fehler
      let host = "";
      try { host = new URL(typeof input === "string" || input instanceof URL ? String(input) : input.url).hostname; } catch { /* relative oder ungueltig: kein Host */ }
      if (host && blockedHost(host)) throw new StagingBlocked(host);
      return real.call(this, input, init);
    };
    scope.fetch = guarded;
    scope.__stagingFetchGuard = true;
    return scope.fetch === guarded;
  } catch {
    return false;
  }
}

export const ROBOTS_DISALLOW = "User-agent: *\nDisallow: /\n";

// Jede Antwort der Testumgebung: nicht indexieren, nicht folgen, nicht zwischenspeichern.
export function stagingResponse(res) {
  const out = new Response(res.body, res);
  out.headers.set("x-robots-tag", "noindex, nofollow");
  out.headers.set("x-m365-environment", "staging");
  if (!out.headers.has("cache-control")) out.headers.set("cache-control", "no-store");
  return out;
}

export function robotsResponse() {
  return new Response(ROBOTS_DISALLOW, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" } });
}
