// Mediadaten-Downloader: Formular (Name, Firma, E-Mail) -> E-Mail mit den aktuellen Mediadaten als PDF-Anhang.
// Das PDF baut der Workflow "Mediadaten erzeugen" (tools/mediakit.py) taeglich aus Live-Daten und legt es in R2 ab:
//   mediakit/m365fm-media-kit-<lang>.pdf  (+ mediakit/latest.json mit Kennzahlen und Stand)
// Anfragen landen in D1 (mediakit_requests) fuer Mirkos Nachverfolgung; Admins bekommen einen Push.
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

function mailHtml(env, t, name, company, hasPdf, lang) {
  const site = env.SITE || "https://www.m365.fm";
  const pre = lang === "en" ? "" : "/" + lang;
  const link = (href, label) => `<a href="${href}" style="color:#3b6391">${label}</a>`;
  return `<div style="font-family:Barlow,Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;color:#17191c;line-height:1.55;font-size:15px">
<p style="font-weight:700;font-size:20px;letter-spacing:.04em;margin:0 0 18px">M365<span style="color:#3b6391">.FM</span></p>
<p>${esc(t.hi(name))}</p>
<p>${esc(t.body(company))}</p>
${hasPdf ? "" : `<p>${esc(t.nofile)} ${link(`${site}${pre}/media-kit/`, `${site.replace("https://", "")}${pre}/media-kit/`)}</p>`}
<p>${esc(t.next)}</p>
<p style="margin-bottom:4px"><b>${esc(t.links)}</b></p>
<ul style="margin-top:0;padding-left:18px">
<li>${link(`${site}${pre}/sponsor/`, esc(t.sponsor))}</li>
<li>${link(`${site}${pre}/for/publishers/`, esc(t.publishers))}</li>
<li>${link(`${site}${pre}/show/episodes/`, esc(t.episodes))}</li>
</ul>
<p>${t.bye}</p>
<hr style="border:0;border-top:1px solid #dde3ea;margin:24px 0">
<p style="font-size:12px;color:#5d6470">${esc(t.foot)}</p></div>`;
}

async function pdfFor(env, lang) {
  if (!env.PAGES) return null;
  for (const l of [lang, "en"]) {
    const obj = await env.PAGES.get(`mediakit/m365fm-media-kit-${l}.pdf`).catch(() => null);
    if (obj) {
      const buf = new Uint8Array(await obj.arrayBuffer());
      if (buf.length > 0 && buf.length < 15 * 1024 * 1024) return { buf, lang: l };
    }
  }
  return null;
}

function b64(buf) {
  let s = "";
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
  return btoa(s);
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
        const r = await sendPush(env, s, { title: "Mediadaten angefordert", body: `${row.name} · ${row.company}`, url: `${env.SITE}/community/` });
        if (r.gone) await db.prepare("DELETE FROM push_subs WHERE endpoint=?").bind(s.endpoint).run();
      } catch { /* Push ist optional */ }
    }
  } catch { /* nie den Versand blockieren */ }
}

export async function handleMediakit(env, request, url, path, user, J) {
  if (path !== "/api/mediakit" && path !== "/api/admin/mediakit") return null;
  const db = env.DB; await ensure(db);

  if (path === "/api/admin/mediakit") {
    if (!user?.admin) return J({ error: "forbidden" }, 403);
    const rows = (await db.prepare("SELECT id,name,company,email,lang,source,created,sent,err FROM mediakit_requests ORDER BY id DESC LIMIT 200").all()).results || [];
    return J({ items: rows });
  }
  if (request.method !== "POST") return J({ error: "method" }, 405);

  const b = await request.json().catch(() => ({}));
  if (b.website) return J({ ok: true });   // Honigtopf: Bots fuellen das versteckte Feld, Menschen nicht
  const name = clean(b.name, 80), company = clean(b.company, 120), email = clean(b.email, 254).toLowerCase();
  const lang = LANGS.includes(b.lang) ? b.lang : "en", source = clean(b.source, 60);
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
  const t = T[lang] || T.en;
  const pdf = await pdfFor(env, lang);
  const r = await sendMail(env, {
    to: email,
    subject: t.subject,
    html: mailHtml(env, t, name, company, !!pdf, lang),
    replyTo: "mirko.peters@m365.fm",
    attachments: pdf ? [{ filename: `M365.FM-Media-Kit-${pdf.lang.toUpperCase()}.pdf`, content: b64(pdf.buf), type: "application/pdf", disposition: "attachment" }] : [],
  });
  await db.prepare("UPDATE mediakit_requests SET sent=?,err=? WHERE id=?").bind(r.ok ? 1 : 0, r.ok ? (pdf ? "" : "no_pdf") : "http_" + r.status, id).run();
  await notifyAdmins(env, { name, company });
  if (!r.ok) return J({ error: "send_failed" }, 502);
  return J({ ok: true, attached: !!pdf });
}
