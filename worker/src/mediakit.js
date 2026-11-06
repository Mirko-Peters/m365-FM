// Mediadaten-Downloader: Formular (Name, Firma, E-Mail) -> E-Mail mit den aktuellen Mediadaten als PDF-Anhang.
// Das PDF baut der Workflow "Mediadaten erzeugen" (tools/mediakit.py) monatlich aus Live-Daten und legt es in R2 ab:
//   mediakit/m365fm-media-kit-<lang>.pdf  (+ mediakit/latest.json mit Kennzahlen und Stand)
// Zweite Marke (#260): brand=m365con -> Sponsor-/Mediadaten der M365Con (tools/mediakit_con.py):
//   mediakit/m365con/m365con-sponsor-deck-<lang>.pdf  (+ mediakit/m365con/latest.json, oeffentlich ueber GET /api/mediakit/summary?brand=m365con)
// Das Formular darf auch von m365con.net (HeySummit-Pagebuilder, CORS in util.js) senden.
// Anfragen landen in D1 (mediakit_requests) fuer Mirkos Nachverfolgung (Marke als Praefix in source); Admins bekommen einen Push.
import { sendMail, mailReady } from "./mailer.js";
import { esc, rateLimit } from "./util.js";
import { sendPush } from "./push.js";

const now = () => Math.floor(Date.now() / 1000);
const LANGS = ["en", "de"];
const EMAIL_RX = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,190}\.[a-z]{2,24}$/i;
const clean = (s, n) => String(s || "").replace(/[\u0000-\u001f\u007f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, n);

let ready = false;
async function ensure(db) {
  if (ready) return;
  await db.prepare("CREATE TABLE IF NOT EXISTS mediakit_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, company TEXT NOT NULL, email TEXT NOT NULL, lang TEXT NOT NULL, source TEXT NOT NULL DEFAULT '', created INTEGER NOT NULL, sent INTEGER NOT NULL DEFAULT 0, err TEXT NOT NULL DEFAULT '')").run();
  ready = true;
}

const T = {
  en: {
    subject: "Your M365.FM media kit",
    hi: (n) => `Hi ${n},`,
    body: (c) => `thank you for your interest in M365.FM${c ? ` on behalf of ${c}` : ""}. Attached you will find our current media kit with up-to-date figures for the podcast, YouTube, the website in 19 languages and our community.`,
    next: "If you would like to talk about a sponsorship, an interview or a joint project, simply reply to this e-mail – it goes directly to Mirko Peters.",
    links: "Useful links",
    sponsor: "Sponsorship packages", publishers: "For journalists, editors and PR", episodes: "All episodes",
    bye: "Best regards,<br>Mirko Peters<br>M365.FM",
    nofile: "The PDF is being prepared – you can always download the latest version here:",
    foot: "You receive this one-time e-mail because you requested the M365.FM media kit. We do not add you to a newsletter.",
  },
  de: {
    subject: "Deine M365.FM-Mediadaten",
    hi: (n) => `Hallo ${n},`,
    body: (c) => `vielen Dank für dein Interesse an M365.FM${c ? ` für ${c}` : ""}. Im Anhang findest du unsere aktuellen Mediadaten mit den neuesten Zahlen zu Podcast, YouTube, der Website in 19 Sprachen und unserer Community.`,
    next: "Wenn du über ein Sponsoring, ein Interview oder ein gemeinsames Projekt sprechen möchtest, antworte einfach auf diese E-Mail – sie geht direkt an Mirko Peters.",
    links: "Hilfreiche Links",
    sponsor: "Sponsoring-Pakete", publishers: "Für Journalisten, Redaktionen und PR", episodes: "Alle Folgen",
    bye: "Viele Grüße<br>Mirko Peters<br>M365.FM",
    nofile: "Das PDF wird gerade erstellt – die aktuelle Fassung findest du jederzeit hier:",
    foot: "Du erhältst diese einmalige E-Mail, weil du die M365.FM-Mediadaten angefordert hast. Wir tragen dich in keinen Newsletter ein.",
  },
};

// M365Con: eigene Texte, keine Preise ("Sponsoring auf Anfrage"), Kontakt Mirko
const TC = {
  en: {
    subject: "Your M365Con sponsor & media data",
    hi: (n) => `Hi ${n},`,
    body: (c) => `thank you for your interest in M365Con${c ? ` on behalf of ${c}` : ""}. Attached you will find our current sponsor and media data with up-to-date figures for the editions, live streams, recaps and search visibility of the Microsoft 365 Community Convention.`,
    next: "Sponsoring is on request: simply reply to this e-mail – it goes directly to Mirko Peters, who will get back to you with options and dates.",
    links: "Useful links",
    sponsor: "M365Con sponsor page", publishers: "M365Con – the convention", episodes: "M365.FM sponsorship packages",
    bye: "Best regards,<br>Mirko Peters<br>M365Con · M365.FM",
    nofile: "The PDF is being prepared – you can always request the latest version here:",
    foot: "You receive this one-time e-mail because you requested the M365Con sponsor and media data. We do not add you to a newsletter.",
  },
  de: {
    subject: "Deine M365Con-Sponsoring- und Mediadaten",
    hi: (n) => `Hallo ${n},`,
    body: (c) => `vielen Dank für dein Interesse an der M365Con${c ? ` für ${c}` : ""}. Im Anhang findest du unsere aktuellen Sponsoring- und Mediadaten mit den neuesten Zahlen zu den Ausgaben, Livestreams, Recaps und der Sichtbarkeit in der Suche.`,
    next: "Sponsoring gibt es auf Anfrage: Antworte einfach auf diese E-Mail – sie geht direkt an Mirko Peters, der sich mit Möglichkeiten und Terminen meldet.",
    links: "Hilfreiche Links",
    sponsor: "M365Con-Sponsorseite", publishers: "M365Con – die Convention", episodes: "M365.FM-Sponsoring-Pakete",
    bye: "Viele Grüße<br>Mirko Peters<br>M365Con · M365.FM",
    nofile: "Das PDF wird gerade erstellt – die aktuelle Fassung kannst du jederzeit hier anfordern:",
    foot: "Du erhältst diese einmalige E-Mail, weil du die M365Con-Sponsoring- und Mediadaten angefordert hast. Wir tragen dich in keinen Newsletter ein.",
  },
};

// Marken: R2-Schluessel, Dateiname, Texte, Kopf und Links der Mail
export const BRANDS = {
  m365fm: { key: (l) => `mediakit/m365fm-media-kit-${l}.pdf`, file: (l) => `M365.FM-Media-Kit-${l.toUpperCase()}.pdf`, T, push: "Mediadaten angefordert", src: "" },
  m365con: { key: (l) => `mediakit/m365con/m365con-sponsor-deck-${l}.pdf`, file: (l) => `M365Con-Sponsor-Deck-${l.toUpperCase()}.pdf`, T: TC,
             push: "M365Con-Mediadaten angefordert", src: "m365con:", summary: "mediakit/m365con/latest.json" },
};
export const brandOf = (b) => (Object.prototype.hasOwnProperty.call(BRANDS, b) ? b : "m365fm");

function mailHtml(env, t, name, company, hasPdf, lang, brand = "m365fm") {
  const site = env.SITE || "https://www.m365.fm";
  const pre = lang === "en" ? "" : "/" + lang;
  const con = brand === "m365con", ac = con ? "#0d93b3" : "#3b6391";
  const link = (href, label) => `<a href="${href}" style="color:${ac}">${label}</a>`;
  const head = con ? `M365<span style="color:${ac}">Con</span>` : `M365<span style="color:${ac}">.FM</span>`;
  const kit = con ? `${site}${pre}/m365con/sponsor/` : `${site}${pre}/media-kit/`;
  const links = con
    ? [[`${site}${pre}/m365con/sponsor/`, t.sponsor], ["https://m365con.net", t.publishers], [`${site}${pre}/sponsor/`, t.episodes]]
    : [[`${site}${pre}/sponsor/`, t.sponsor], [`${site}${pre}/for/publishers/`, t.publishers], [`${site}${pre}/show/episodes/`, t.episodes]];
  return `<div style="font-family:Barlow,Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;color:#17191c;line-height:1.55;font-size:15px">
<p style="font-weight:700;font-size:20px;letter-spacing:.04em;margin:0 0 18px">${head}</p>
<p>${esc(t.hi(name))}</p>
<p>${esc(t.body(company))}</p>
${hasPdf ? "" : `<p>${esc(t.nofile)} ${link(kit, kit.replace("https://", ""))}</p>`}
<p>${esc(t.next)}</p>
<p style="margin-bottom:4px"><b>${esc(t.links)}</b></p>
<ul style="margin-top:0;padding-left:18px">
${links.map(([h, l]) => `<li>${link(h, esc(l))}</li>`).join("\n")}
</ul>
<p>${t.bye}</p>
<hr style="border:0;border-top:1px solid #dde3ea;margin:24px 0">
<p style="font-size:12px;color:#5d6470">${esc(t.foot)}</p></div>`;
}

async function pdfFor(env, lang, brand = "m365fm") {
  if (!env.PAGES) return null;
  for (const l of [lang, "en"]) {
    const obj = await env.PAGES.get(BRANDS[brand].key(l)).catch(() => null);
    if (obj) {
      const buf = new Uint8Array(await obj.arrayBuffer());
      if (buf.length > 0 && buf.length < 15 * 1024 * 1024) return { buf, lang: l };
    }
  }
  return null;
}


async function notifyAdmins(env, row) {
  try {
    const db = env.DB, adm = (env.ADMIN_SUBS || "").split(",").map((s) => s.trim()).filter(Boolean);
    if (!adm.length || !env.VAPID_PRIVATE_JWK) return;
    const users = (await db.prepare("SELECT id,provider,sub FROM users").all()).results || [];
    const ids = users.filter((u) => adm.includes(`${u.provider}:${u.sub}`)).map((u) => u.id);
    if (!ids.length) return;
    const subs = (await db.prepare(`SELECT endpoint,p256dh,auth FROM push_subs WHERE user_id IN (${ids.map(() => "?").join(",")})`).bind(...ids).all()).results || [];
    for (const s of subs) {
      try {
        const r = await sendPush(env, s, { title: row.title || "Mediadaten angefordert", body: `${row.name} · ${row.company}`, url: `${env.SITE}/community/` });
        if (r.gone) await db.prepare("DELETE FROM push_subs WHERE endpoint=?").bind(s.endpoint).run();
      } catch { /* Push ist optional */ }
    }
  } catch { /* nie den Versand blockieren */ }
}

// Kennzahlen-Vorschau (nur Summen aus latest.json, Felder einzeln uebernommen und gekuerzt) fuer /m365con/sponsor/ und die HeySummit-Einbettung
function summaryOf(raw) {
  const s = (v, n = 160) => String(v ?? "").replace(/[\u0000-\u001f\u007f<>]/g, " ").slice(0, n);
  const lbl = (o) => ({ en: s(o?.en), de: s(o?.de || o?.en) });
  const kpis = (Array.isArray(raw?.kpis) ? raw.kpis : []).filter((k) => Number.isFinite(k?.value) && k.value >= 0).slice(0, 24)
    .map((k) => ({ key: s(k.key, 40), value: Math.round(k.value), label: lbl(k.label), source: lbl(k.source), period: lbl(k.period) }));
  return { generated: s(raw?.generated, 10), brand: "m365con", kpis };
}

export async function handleMediakit(env, request, url, path, user, J) {
  if (path !== "/api/mediakit" && path !== "/api/admin/mediakit" && path !== "/api/mediakit/summary") return null;
  if (path === "/api/mediakit/summary") {
    if (request.method !== "GET") return J({ error: "method" }, 405);
    const b = BRANDS[brandOf(url.searchParams.get("brand"))];
    if (!b.summary || !env.PAGES) return J({ error: "not_found" }, 404);
    const obj = await env.PAGES.get(b.summary).catch(() => null);
    if (!obj) return J({ error: "not_found" }, 404);
    const raw = await obj.json().catch(() => null);
    return J(summaryOf(raw), 200, { "cache-control": "public, max-age=3600" });
  }
  const db = env.DB; await ensure(db);

  if (path === "/api/admin/mediakit") {
    if (!user?.admin) return J({ error: "forbidden" }, 403);
    const rows = (await db.prepare("SELECT id,name,company,email,lang,source,created,sent,err FROM mediakit_requests ORDER BY id DESC LIMIT 200").all()).results || [];
    return J({ items: rows }, 200, { "cache-control": "no-store" });   // personenbezogen: nie cachen
  }
  if (request.method !== "POST") return J({ error: "method" }, 405);

  const b = await request.json().catch(() => ({}));
  if (b.website) return J({ ok: true });   // Honigtopf: Bots fuellen das versteckte Feld, Menschen nicht
  const name = clean(b.name, 80), company = clean(b.company, 120), email = clean(b.email, 254).toLowerCase();
  const brand = brandOf(b.brand || url.searchParams.get("brand")), B = BRANDS[brand];
  const lang = LANGS.includes(b.lang) ? b.lang : "en", source = (B.src + clean(b.source, 60)).slice(0, 72);
  if (name.length < 2) return J({ error: "name" }, 400);
  if (company.length < 2) return J({ error: "company" }, 400);
  if (!EMAIL_RX.test(email)) return J({ error: "email" }, 400);
  if (b.consent !== true) return J({ error: "consent" }, 400);

  const ip = request.headers.get("cf-connecting-ip") || "0";
  const ipKey = "mk_ip:" + Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip + (env.SESSION_SECRET || ""))))).slice(0, 8).map((x) => x.toString(16).padStart(2, "0")).join("");
  if (!(await rateLimit(db, ipKey, 5, 86400))) return J({ error: "rate_limit" }, 429);
  if (!(await rateLimit(db, "mk_mail:" + email, 2, 86400))) return J({ error: "rate_limit" }, 429);
  if (!mailReady(env)) return J({ error: "mail_unavailable" }, 503);

  const ins = await db.prepare("INSERT INTO mediakit_requests(name,company,email,lang,source,created) VALUES(?,?,?,?,?,?)").bind(name, company, email, lang, source, now()).run();
  const id = ins.meta.last_row_id;
  const t = B.T[lang] || B.T.en;
  const pdf = await pdfFor(env, lang, brand);
  const r = await sendMail(env, {
    to: email,
    subject: t.subject,
    html: mailHtml(env, t, name, company, !!pdf, lang, brand),
    replyTo: "mirko.peters@m365.fm",
    attachments: pdf ? [{ filename: B.file(pdf.lang), content: pdf.buf, type: "application/pdf", disposition: "attachment" }] : [],   // Binaerdaten; Base64 nur fuer Resend (mailer.js)
  });
  await db.prepare("UPDATE mediakit_requests SET sent=?,err=? WHERE id=?").bind(r.ok ? 1 : 0, r.ok ? (pdf ? "" : "no_pdf") : "http_" + r.status, id).run();
  await notifyAdmins(env, { name, company, title: B.push });
  if (!r.ok) return J({ error: "send_failed" }, 502);
  return J({ ok: true, attached: !!pdf });
}
