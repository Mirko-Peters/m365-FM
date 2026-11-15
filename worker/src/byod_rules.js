// "Bring your own domain" (BLOG_OWN_DOMAIN.md): Host-Pruefung und Namensregeln. Reine Funktionen, ohne Datenbank und Netz.
export const BYOD_MAX_DOMAINS_PER_USER = 1;   // am Anfang eine Domain je Mitglied

const LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
// Zweiteilige oeffentliche Endungen (Naeherung ohne Public-Suffix-Liste): blog.kunde.co.uk ist eine Unterdomain, kunde.co.uk ein Apex.
const TWO_PART_SUFFIX = new Set(["co.uk", "org.uk", "ac.uk", "gov.uk", "me.uk", "ltd.uk", "plc.uk", "net.uk", "com.au", "net.au", "org.au", "edu.au", "co.nz", "org.nz", "net.nz", "co.za", "org.za",
  "com.br", "net.br", "org.br", "com.mx", "com.ar", "com.co", "com.pe", "co.jp", "ne.jp", "or.jp", "co.in", "net.in", "org.in", "com.tr", "org.tr", "com.cn", "net.cn", "org.cn", "com.tw", "com.hk",
  "com.sg", "co.il", "org.il", "co.kr", "or.kr", "com.ua", "com.pl", "net.pl", "org.pl", "com.pt", "com.es", "com.de", "co.at", "or.at", "co.id", "com.my", "com.ph", "com.vn", "com.eg", "com.sa", "co.th"]);
// Endungen, auf denen jede Unterdomain jedem gehoert (kein Besitznachweis moeglich) oder die technisch reserviert sind
const BLOCKED_SUFFIX = ["workers.dev", "pages.dev", "github.io", "githubusercontent.com", "herokuapp.com", "vercel.app", "netlify.app", "azurewebsites.net", "azurestaticapps.net", "cloudfront.net", "amazonaws.com",
  "web.app", "firebaseapp.com", "blogspot.com", "wordpress.com", "medium.com", "substack.com", "trycloudflare.com", "ngrok.io", "localhost", "local", "localdomain", "internal", "lan", "home", "corp", "test", "example", "invalid", "onion", "arpa"];
// Eigene Hosts der Plattform (und Partner-Seiten): nie als Fremd-Domain zulaessig
const OWN = ["m365.fm", "m365con.net"];
// Fremde Marken-Hosts: Microsoft, Google, LinkedIn, Plattformen der Folgen und Videos usw. Erweiterbar; Eintrag = Domain und alle Unterdomains.
const BRAND = ["microsoft.com", "microsoftonline.com", "microsoft365.com", "office.com", "office365.com", "azure.com", "windows.net", "windows.com", "live.com", "outlook.com", "sharepoint.com", "bing.com", "xbox.com", "skype.com", "teams.com",
  "github.com", "linkedin.com", "google.com", "youtube.com", "youtu.be", "spreaker.com", "spotify.com", "apple.com", "amazon.com", "facebook.com", "instagram.com", "x.com", "twitter.com", "tiktok.com", "reddit.com", "whatsapp.com",
  "anthropic.com", "claude.ai", "openai.com", "chatgpt.com", "cloudflare.com", "paypal.com", "stripe.com", "podpage.com", "sessionize.com"];
const OWN_LABEL = /^(m365fm|m365-fm|m365con)$/;   // m365fm.net, m365-fm.de ... sehen nach der Plattform aus

const under = (host, base) => host === base || host.endsWith("." + base);

// Host aus Anfrage-Adresse oder Eingabe: Kleinbuchstaben, ohne Punkt am Ende, ohne Port, Pfad, Zugangsdaten. "" = ungueltig.
// Streng: nur ASCII (Umlaut-Domains als Punycode "xn--"), jedes Label 1 bis 63 Zeichen, Endung nur Buchstaben (damit sind IP-Adressen ausgeschlossen), zusammen hoechstens 253 Zeichen.
export function normHost(raw) {
  if (typeof raw !== "string") return "";
  let h = raw.trim().toLowerCase();
  if (!h || h.length > 260 || /[^a-z0-9.-]/.test(h)) return "";   // verbietet Port, Pfad, Leerzeichen, Zugangsdaten, Unicode, Unterstrich
  if (h.endsWith(".")) h = h.slice(0, -1);
  if (!h || h.length > 253) return "";
  const labels = h.split(".");
  if (labels.length < 2 || !labels.every((l) => LABEL.test(l))) return "";
  if (!/^[a-z]{2,24}$|^xn--[a-z0-9-]{2,59}$/.test(labels[labels.length - 1])) return "";   // Endung: Buchstaben oder Punycode, nie eine Zahl (keine IP)
  return h;
}

export const isApex = (host) => { const n = host.split(".").length; return n === 2 || (n === 3 && TWO_PART_SUFFIX.has(host.split(".").slice(1).join("."))); };

// Eigene Hosts der Plattform (m365.fm und *.m365.fm): die Fremd-Weiche greift nie
export const isOwnHost = (host) => OWN.some((o) => under(host, o));

// Zone und CNAME-Ziel aus der Umgebung (BYOD_CNAME_TARGET, optional BYOD_ZONE): die Zone der Blog-Domains ist selbst nie eine Kunden-Domain
export function saasZone(env) {
  const z = normHost(String(env?.BYOD_ZONE || "")); if (z) return z;
  const t = normHost(String(env?.BYOD_CNAME_TARGET || "")); return t ? t.split(".").slice(1).join(".") || t : "";
}

// Namensregeln fuer die Eingabe eines Mitglieds. -> { ok: true, host } oder { ok: false, error }
// Fehler: bad_domain | apex_not_allowed | own_domain | saas_zone | blocked_suffix | brand_domain
export function validateDomain(raw, env = {}) {
  let s = String(raw ?? "").trim();
  s = s.replace(/^https?:\/\//i, "").replace(/\/+$/, "");   // Komfort: "https://blog.kunde.de/" einfuegen geht
  const host = normHost(s);
  if (!host) return { ok: false, error: "bad_domain" };
  if (isOwnHost(host) || host.split(".").some((l) => OWN_LABEL.test(l))) return { ok: false, error: "own_domain" };
  const zone = saasZone(env);
  if (zone && under(host, zone)) return { ok: false, error: "saas_zone" };
  if (BLOCKED_SUFFIX.some((b) => under(host, b))) return { ok: false, error: "blocked_suffix" };
  if (BRAND.some((b) => under(host, b))) return { ok: false, error: "brand_domain" };
  if (isApex(host)) return { ok: false, error: "apex_not_allowed" };
  return { ok: true, host };
}

// Schalter: nur "1" schaltet die Funktion ein
export const byodOn = (env) => env?.BYOD === "1";

// https-Link fuer Impressum/Datenschutz: nur https, keine Zugangsdaten, hoechstens 300 Zeichen, kein Kurzlink-Dienst. "" = ungueltig.
const SHORT = /(^|\.)(bit\.ly|t\.co|tinyurl\.com|goo\.gl|is\.gd|ow\.ly|buff\.ly|cutt\.ly|rebrand\.ly|shorturl\.at)$/i;
export function cleanLink(raw) {
  const s = String(raw ?? "").trim(); if (!s || s.length > 300) return "";
  let u; try { u = new URL(s); } catch { return ""; }
  if (u.protocol !== "https:" || u.username || u.password || SHORT.test(u.hostname) || !normHost(u.hostname)) return "";
  return u.href;
}
