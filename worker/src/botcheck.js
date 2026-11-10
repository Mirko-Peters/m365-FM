// Mensch oder Bot? Eine SCHAETZUNG aus Anfrage-Kopfzeilen, keine Gewissheit.
//
// Was wir NICHT tun: keine Cookies, kein Fingerprinting, keine Speicherung von IP oder Browserkennung. Das Ergebnis ist nur ein Ja/Nein,
// das in einen Tageszaehler fliesst (clicks = echte Klicks, clicks_filtered = gefilterte Klicks). Die Gruende werden nicht gespeichert.
//
// Stufen (die ersten Treffer zaehlen sofort, schwache Hinweise erst ab zwei):
//  1. Eindeutig: keine Browserkennung, Vorabruf (Purpose/Sec-Purpose/X-Moz prefetch|prerender), von Cloudflare als verifizierter Bot oder mit
//     Bot-Wert unter 30 markiert (cf.botManagement gibt es nur mit dem Tarif "Bot Management" - ohne ihn fehlt das Feld, der Code kommt damit klar),
//     bekannter Crawler, Vorschau-, Link-Scanner-, Skript- oder Headless-Agent in der Browserkennung.
//  2. Passt nicht zu einem echten Klick auf einen Link: Sec-Fetch-Mode ist nicht "navigate" oder Sec-Fetch-Dest ist nicht "document"
//     (z. B. Bild, Skript, fetch()). Das senden moderne Browser immer mit; ein Link-Klick ist immer Mode navigate und Dest document.
//  3. Schwache Hinweise (je 1 Punkt, ab 2 Punkten gefiltert): Browser-Kennung ohne Accept-Language (echte Browser senden die Sprache fast immer);
//     Chrome/Edge/Firefox in einer Version, die Sec-Fetch kennt, aber ganz ohne Sec-Fetch-Kopfzeilen (typisch fuer Skripte mit gefaelschter
//     Browserkennung); Accept nur "*/*" statt text/html; Rechenzentrums-Netz (cf.asOrganization, z. B. Cloud-Anbieter - NIE allein, denn auch
//     Menschen in Firmen- oder VPN-Netzen kommen von dort).
// Bewusst NICHT ausgewertet: Sec-Fetch-User (fehlt bei manchen echten Klicks, z. B. in App-Browsern) und die IP-Adresse.
//
// Grenzen: Scanner, die sich wie ein vollstaendiger Browser verhalten (Headless-Browser mit allen Kopfzeilen, z. B. manche Mail-Sicherheitsdienste),
// bleiben unerkannt und zaehlen als Mensch; umgekehrt kann ein ungewoehnlicher echter Browser (Datenschutz-Erweiterung, die Kopfzeilen entfernt)
// zu Unrecht gefiltert werden. Die Quote "gefiltert" ist daher eine Naeherung, kein Beleg.

export const BOT_UA = /(bot(?![a-z])|crawl|spider|slurp|archiver|preview|facebookexternalhit|facebot|linkedinbot|slackbot|slack-img|discordbot|whatsapp|telegrambot|twitterbot|pinterest|redditbot|embedly|vkshare|skypeuripreview|teams\/.*linkpreview|googleimageproxy|google-read-aloud|google-site-verification|mediapartners|adsbot|apis-google|feedfetcher|bingpreview|applebot|yandex|baidu|petalbot|bytespider|amazonbot|ccbot|gptbot|chatgpt|oai-searchbot|claude|anthropic|perplexity|cohere|semrush|ahrefs|mj12|dotbot|seznam|qwant|duckduck|ia_archiver|proofpoint|mimecast|barracuda|safelinks|forcepoint|symantec|trendmicro|sophos|fireeye|urlscan|virustotal|netcraft|qualys|nessus|nmap|zgrab|masscan|curl\/|wget|python|aiohttp|httpx|urllib|requests\/|libwww|java\/|jakarta|apache-httpclient|okhttp|go-http|resty|node-fetch|undici|axios|got\/|superagent|guzzle|ruby|php\/|perl|scrapy|selenium|puppeteer|playwright|headless|phantomjs|lighthouse|pagespeed|pingdom|uptime|statuscake|monitor|http-client|httpclient|postman|insomnia|restsharp|\bscan)/i;

// Rechenzentrums-Netze, aus denen Skripte kommen (schwacher Hinweis, Cloudflare/WARP bewusst nicht dabei: dort sitzen echte Menschen)
const HOSTING_ORG = /(amazon|aws|microsoft corporation|digitalocean|hetzner|ovh|linode|akamai connected|vultr|oracle|alibaba|tencent|choopa|leaseweb|contabo|scaleway|google cloud|google-cloud|packet|colocrossing|m247)/i;

function header(request, name) { return request.headers.get(name) || ""; }

// Hauptversion aus "Chrome/124.0.0.0", "Edg/124", "Firefox/126.0"; 0 = keine solche Kennung
function engineVersion(ua) {
  const m = /\b(?:Chrome|Edg|Edge|Firefox|CriOS|FxiOS)\/(\d+)/.exec(ua);
  return m ? Number(m[1]) : 0;
}

/**
 * Schaetzt, ob ein Aufruf ein Mensch (echter Klick) oder ein automatischer Abruf ist.
 * @returns {{bot: boolean, reason: string, score: number}} reason: kurzer Code fuer Tests/Fehlersuche (wird nicht gespeichert)
 */
export function classify(request) {
  const ua = header(request, "user-agent");
  if (!ua) return { bot: true, reason: "no-ua", score: 0 };
  const purpose = ["sec-purpose", "purpose", "x-purpose"].map((k) => header(request, k)).join(" ").toLowerCase();
  if (/\b(prefetch|prerender)\b/.test(purpose) || header(request, "x-moz").toLowerCase() === "prefetch") return { bot: true, reason: "prefetch", score: 0 };
  const bm = request.cf?.botManagement, bmScore = Number(bm?.score);
  if (bm?.verifiedBot || (Number.isFinite(bmScore) && bmScore < 30)) return { bot: true, reason: "bot-management", score: 0 };
  if (BOT_UA.test(ua)) return { bot: true, reason: "user-agent", score: 0 };

  const mode = header(request, "sec-fetch-mode").toLowerCase(), dest = header(request, "sec-fetch-dest").toLowerCase();
  if ((mode && mode !== "navigate") || (dest && !["document", "iframe", "frame"].includes(dest))) return { bot: true, reason: "sec-fetch", score: 0 };

  let score = 0;
  const browserLike = /^Mozilla\//.test(ua);
  if (browserLike && !header(request, "accept-language")) score++;
  const v = engineVersion(ua), hasSec = !!(mode || dest || header(request, "sec-fetch-site"));
  if (browserLike && v && !hasSec && !/CriOS|FxiOS/.test(ua) && (/Firefox\//.test(ua) ? v >= 90 : v >= 80)) score++;
  const accept = header(request, "accept").trim();
  if (browserLike && accept && !/text\/html|application\/xhtml/i.test(accept)) score++;
  if (HOSTING_ORG.test(String(request.cf?.asOrganization || ""))) score++;
  return score >= 2 ? { bot: true, reason: "signals", score } : { bot: false, reason: "", score };
}

export const isBot = (request) => classify(request).bot;
