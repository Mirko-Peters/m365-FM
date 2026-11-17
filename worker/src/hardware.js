// Hardware-Sponsoring (/hardware/): Hersteller bewerben sich mit einem Geraet fuer einen unabhaengigen Test (Formular -> D1 hardware_requests).
// Die Bewerbung ist eine verbindliche Zusage zum kostenlosen Versand, falls M365.FM annimmt (Haken "ships"). Kein Einfluss auf Wertung oder Urteil.
// Bewerber bekommen eine Bestaetigung per E-Mail (Fehler beim Versand verhindern das Speichern nicht); Admins bekommen einen Push.
// Admin: GET /api/admin/hardware (Liste, neueste zuerst, hoechstens 200), POST {action:"status"|"delete", id}. Personenbezogen: nie cachen.
// Zusage: Wird der Status auf "committed" gesetzt, geht einmalig die Standard-Mail mit der Lieferadresse an den Hersteller (accept_sent verhindert Doppelversand).
import { sendMail, mailReady } from "./mailer.js";
import { esc, rateLimit } from "./util.js";
import { notifyAdmins } from "./mediakit.js";

const now = () => Math.floor(Date.now() / 1000);
const LANGS = ["en", "de"];
// Lieferadresse fuer Testgeraete (Mirko Peters, 16.11.2026); steht in der Zusage-Mail.
export const SHIP_TO = ["M365.fm", "Mirko Peters", "Kremmlerstrasse 58", "70597 Stuttgart", "Germany"];
const EMAIL_RX = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,190}\.[a-z]{2,24}$/i;
const clean = (s, n) => String(s || "").replace(/[\u0000-\u001f\u007f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, n);

export const HW_STATUS = ["open", "committed", "received", "published", "declined"];
export const HW_CATEGORIES = ["headset", "speaker", "mic", "camera", "rooms", "board", "pc", "thin", "tablet", "peripheral", "dock", "monitor", "printer", "network", "storage", "wearable", "xr", "key", "other"];
export const HW_OFFERS = ["giveaway", "video", "podcast"];

let ready = false;
async function ensure(db) {   // wie bei den Mediadaten: auf Datenbanken ohne Migration 0052 nachziehen
  if (ready) return;
  await db.prepare("CREATE TABLE IF NOT EXISTS hardware_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, company TEXT NOT NULL, email TEXT NOT NULL, product TEXT NOT NULL, product_url TEXT NOT NULL DEFAULT '', category TEXT NOT NULL DEFAULT 'other', quantity INTEGER NOT NULL DEFAULT 1, ship_by TEXT NOT NULL DEFAULT '', offers TEXT NOT NULL DEFAULT '', message TEXT NOT NULL DEFAULT '', lang TEXT NOT NULL DEFAULT 'en', source TEXT NOT NULL DEFAULT '', created INTEGER NOT NULL, sent INTEGER NOT NULL DEFAULT 0, err TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'open', status_updated INTEGER, accept_sent INTEGER NOT NULL DEFAULT 0, accept_err TEXT NOT NULL DEFAULT '')").run();
  ready = true;
}

const T = {
  en: {
    subject: "Your hardware application at M365.FM",
    hi: (n) => `Hi ${n},`,
    body: (p, c) => `thank you for offering ${p}${c ? ` from ${c}` : ""} for an independent test on M365.FM.`,
    next: "We will get back to you with a clear yes or no. If we accept, we confirm the delivery date. After the device arrives, the review goes live within 2 weeks. Before publication you can check the facts (specifications, price, features) for 3 business days. Scores and verdict are not shared in advance.",
    rules: "Reminder: the independent review is free and cannot be bought. The device stays with us and is labelled \"Test device provided by the manufacturer\". Sponsored formats (giveaway, video, podcast episode) are labelled \"Sponsored\".",
    links: "How we test", bye: "Best regards,<br>Mirko Peters<br>M365.FM",
    foot: "You receive this one-time e-mail because you submitted the hardware form on m365.fm. We do not add you to a newsletter.",
  },
  de: {
    subject: "Deine Hardware-Bewerbung bei M365.FM",
    hi: (n) => `Hallo ${n},`,
    body: (p, c) => `vielen Dank, dass du ${p}${c ? ` von ${c}` : ""} für einen unabhängigen Test auf M365.FM anbietest.`,
    next: "Wir melden uns mit einer klaren Zu- oder Absage. Bei einer Zusage bestätigen wir den Liefertermin. Nach Eingang des Geräts geht der Test innerhalb von 2 Wochen online. Vor der Veröffentlichung kannst du 3 Werktage lang die Fakten prüfen (Daten, Preis, Funktionen). Bewertung und Urteil bekommst du nicht vorab.",
    rules: "Zur Erinnerung: Der unabhängige Test ist kostenlos und nicht käuflich. Das Gerät bleibt bei uns und wird mit „Testgerät vom Hersteller bereitgestellt“ gekennzeichnet. Gesponserte Formate (Gewinnspiel, Video, Podcast-Folge) sind als „Anzeige“ gekennzeichnet.",
    links: "So testen wir", bye: "Viele Grüße<br>Mirko Peters<br>M365.FM",
    foot: "Du erhältst diese einmalige E-Mail, weil du das Hardware-Formular auf m365.fm abgeschickt hast. Wir tragen dich in keinen Newsletter ein.",
  },
};

function mailHtml(env, t, name, company, product, lang) {
  const site = env.SITE || "https://www.m365.fm", pre = lang === "en" ? "" : "/" + lang;
  const href = `${site}${pre}/hardware/how-we-test/`;
  return `<div style="font-family:Barlow,Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;color:#17191c;line-height:1.55;font-size:15px">
<p style="font-weight:700;font-size:20px;letter-spacing:.04em;margin:0 0 18px">M365<span style="color:#3b6391">.FM</span></p>
<p>${esc(t.hi(name))}</p>
<p>${esc(t.body(product, company))}</p>
<p>${esc(t.next)}</p>
<p>${esc(t.rules)}</p>
<p><a href="${href}" style="color:#3b6391">${esc(t.links)}</a></p>
<p>${t.bye}</p>
<hr style="border:0;border-top:1px solid #dde3ea;margin:24px 0">
<p style="font-size:12px;color:#5d6470">${esc(t.foot)}</p></div>`;
}

const A = {   // Zusage-Mail: Standardtext, wird beim Wechsel auf "committed" gesendet
  en: {
    subject: (p) => `Accepted: ${p} for an independent test on M365.FM`,
    hi: (n) => `Hi ${n},`,
    yes: (p, c) => `good news: we accept ${p}${c ? ` from ${c}` : ""} for an independent test on M365.FM.`,
    shipTitle: "Please ship the device to:",
    steps: [
      "Reply to this e-mail with the planned shipping date and, once available, the tracking number.",
      "Mark the parcel \"M365.FM test device\" and add a commercial invoice or proforma invoice showing the device value (needed for customs outside the EU).",
      "Please include everything needed for a full test: power supply, cables, accessories and a link to the quick-start guide.",
    ],
    rules: "As agreed: the test is free and independent. The device stays with M365.FM and is not returned. It is labelled \"Test device provided by the manufacturer\". We test it for at least 3 days, and the review goes live within 2 weeks after delivery. Before publication you can check the facts (specifications, price, features) for 3 business days. Scores and verdict are not shared in advance and cannot be changed by the manufacturer.",
    links: "How we test", bye: "Best regards,<br>Mirko Peters<br>M365.FM",
    foot: "You receive this e-mail because your hardware application on m365.fm was accepted. We do not add you to a newsletter.",
  },
  de: {
    subject: (p) => `Zusage: ${p} für einen unabhängigen Test auf M365.FM`,
    hi: (n) => `Hallo ${n},`,
    yes: (p, c) => `gute Nachricht: Wir nehmen ${p}${c ? ` von ${c}` : ""} für einen unabhängigen Test auf M365.FM an.`,
    shipTitle: "Bitte sende das Gerät an:",
    steps: [
      "Antworte auf diese E-Mail mit dem geplanten Versanddatum und, sobald vorhanden, der Sendungsnummer.",
      "Kennzeichne das Paket mit „M365.FM Testgerät“ und lege eine Handels- oder Proforma-Rechnung mit dem Gerätewert bei (für den Zoll außerhalb der EU).",
      "Bitte lege alles bei, was für einen vollständigen Test nötig ist: Netzteil, Kabel, Zubehör und einen Link zur Kurzanleitung.",
    ],
    rules: "Wie vereinbart: Der Test ist kostenlos und unabhängig. Das Gerät bleibt bei M365.FM und wird nicht zurückgeschickt. Es wird mit „Testgerät vom Hersteller bereitgestellt“ gekennzeichnet. Wir testen mindestens 3 Tage, und der Test geht innerhalb von 2 Wochen nach Lieferung online. Vor der Veröffentlichung kannst du 3 Werktage lang die Fakten prüfen (Daten, Preis, Funktionen). Bewertung und Urteil bekommst du nicht vorab, und der Hersteller kann sie nicht ändern.",
    links: "So testen wir", bye: "Viele Grüße<br>Mirko Peters<br>M365.FM",
    foot: "Du erhältst diese E-Mail, weil deine Hardware-Bewerbung auf m365.fm angenommen wurde. Wir tragen dich in keinen Newsletter ein.",
  },
};

export function acceptMail(env, row) {   // -> { subject, html, text }
  const lang = LANGS.includes(row.lang) ? row.lang : "en", t = A[lang];
  const site = env.SITE || "https://www.m365.fm", pre = lang === "en" ? "" : "/" + lang;
  const href = `${site}${pre}/hardware/how-we-test/`;
  const addr = SHIP_TO.map(esc).join("<br>");
  const html = `<div style="font-family:Barlow,Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;color:#17191c;line-height:1.55;font-size:15px">
<p style="font-weight:700;font-size:20px;letter-spacing:.04em;margin:0 0 18px">M365<span style="color:#3b6391">.FM</span></p>
<p>${esc(t.hi(row.name))}</p>
<p>${esc(t.yes(row.product, row.company))}</p>
<p style="margin-bottom:4px"><strong>${esc(t.shipTitle)}</strong></p>
<p style="margin-top:0;padding:10px 14px;background:#f3f6f9;border-left:3px solid #3b6391">${addr}</p>
<ol>${t.steps.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>
<p>${esc(t.rules)}</p>
<p><a href="${href}" style="color:#3b6391">${esc(t.links)}</a></p>
<p>${t.bye}</p>
<hr style="border:0;border-top:1px solid #dde3ea;margin:24px 0">
<p style="font-size:12px;color:#5d6470">${esc(t.foot)}</p></div>`;
  const text = [t.hi(row.name), "", t.yes(row.product, row.company), "", t.shipTitle, ...SHIP_TO, "", ...t.steps.map((x, i) => `${i + 1}. ${x}`), "", t.rules, href].join("\n");
  return { subject: t.subject(row.product), html, text };
}

const httpsUrl = (s) => { try { const u = new URL(String(s || "").trim()); return u.protocol === "https:" && u.hostname.includes(".") ? u.toString().slice(0, 300) : ""; } catch { return ""; } };

export async function handleHardware(env, request, url, path, user, J) {
  if (path !== "/api/hardware" && path !== "/api/admin/hardware") return null;
  const db = env.DB; await ensure(db);

  if (path === "/api/admin/hardware") {
    if (!user?.admin) return J({ error: "forbidden" }, 403);
    const NS = { "cache-control": "no-store" };
    if (request.method === "POST") {   // Status setzen oder Bewerbung endgueltig loeschen (DSGVO); der x-requested-with-Check fuer Schreibzugriffe sitzt in index.js
      const b = await request.json().catch(() => ({})) || {};
      const id = Number(b.id);
      if (!Number.isSafeInteger(id) || id < 1) return J({ error: "bad_request" }, 400, NS);
      if (b.action === "status") {
        if (!HW_STATUS.includes(b.status)) return J({ error: "bad_status" }, 400, NS);
        const r = await db.prepare("UPDATE hardware_requests SET status=?,status_updated=? WHERE id=?").bind(b.status, now(), id).run();
        if (!r.meta.changes) return J({ error: "not_found" }, 404, NS);
        let mail = "";   // nur beim Wechsel auf "committed" und nur einmal pro Bewerbung
        if (b.status === "committed") {
          const row = await db.prepare("SELECT id,name,company,email,product,lang,accept_sent FROM hardware_requests WHERE id=?").bind(id).first();
          if (row.accept_sent) mail = "already";
          else if (!mailReady(env)) { mail = "off"; await db.prepare("UPDATE hardware_requests SET accept_err=? WHERE id=?").bind("mail_off", id).run(); }
          else {
            const m = acceptMail(env, row);
            const sent = await sendMail(env, { to: row.email, subject: m.subject, html: m.html, text: m.text, replyTo: "mirko.peters@m365.fm", lang: row.lang, banner: false });
            mail = sent.ok ? "sent" : "failed";
            await db.prepare("UPDATE hardware_requests SET accept_sent=?,accept_err=? WHERE id=?").bind(sent.ok ? 1 : 0, sent.ok ? "" : "http_" + sent.status, id).run();
          }
        }
        return J({ ok: true, status: b.status, mail }, 200, NS);
      }
      if (b.action === "delete") {
        const r = await db.prepare("DELETE FROM hardware_requests WHERE id=?").bind(id).run();
        return r.meta.changes ? J({ ok: true }, 200, NS) : J({ error: "not_found" }, 404, NS);
      }
      return J({ error: "bad_request" }, 400, NS);
    }
    if (request.method !== "GET") return J({ error: "method" }, 405, NS);
    const rows = (await db.prepare("SELECT id,name,company,email,product,product_url,category,quantity,ship_by,offers,message,lang,source,created,sent,err,status,status_updated,accept_sent,accept_err FROM hardware_requests ORDER BY id DESC LIMIT 200").all()).results || [];
    return J({ items: rows }, 200, NS);
  }
  if (request.method !== "POST") return J({ error: "method" }, 405);

  const b = await request.json().catch(() => ({}));
  if (b.website) return J({ ok: true });   // Honigtopf
  const name = clean(b.name, 80), company = clean(b.company, 120), email = clean(b.email, 254).toLowerCase(), product = clean(b.product, 140);
  const lang = LANGS.includes(b.lang) ? b.lang : "en", source = clean(b.source, 60);
  const category = HW_CATEGORIES.includes(b.category) ? b.category : "other";
  const quantity = Math.min(50, Math.max(1, Math.round(Number(b.quantity) || 1)));
  const shipBy = clean(b.ship_by, 40), message = clean(b.message, 1000);
  const offers = (Array.isArray(b.offers) ? b.offers : []).filter((o, i, a) => HW_OFFERS.includes(o) && a.indexOf(o) === i).join(",");
  const productUrl = httpsUrl(b.product_url);
  if (name.length < 2) return J({ error: "name" }, 400);
  if (company.length < 2) return J({ error: "company" }, 400);
  if (!EMAIL_RX.test(email)) return J({ error: "email" }, 400);
  if (product.length < 2) return J({ error: "product" }, 400);
  if (!productUrl) return J({ error: "product_url" }, 400);
  if (b.ships !== true) return J({ error: "ships" }, 400);
  if (b.consent !== true) return J({ error: "consent" }, 400);

  const ip = request.headers.get("cf-connecting-ip") || "0";
  const ipKey = "hw_ip:" + Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip + (env.SESSION_SECRET || ""))))).slice(0, 8).map((x) => x.toString(16).padStart(2, "0")).join("");
  if (!(await rateLimit(db, ipKey, 5, 86400))) return J({ error: "rate_limit" }, 429);
  if (!(await rateLimit(db, "hw_mail:" + email, 3, 86400))) return J({ error: "rate_limit" }, 429);

  const ins = await db.prepare("INSERT INTO hardware_requests(name,company,email,product,product_url,category,quantity,ship_by,offers,message,lang,source,created) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)")
    .bind(name, company, email, product, productUrl, category, quantity, shipBy, offers, message, lang, source, now()).run();
  const id = ins.meta.last_row_id;
  let ok = false, err = "mail_off";
  if (mailReady(env)) {
    const t = T[lang] || T.en;
    const r = await sendMail(env, { to: email, subject: t.subject, html: mailHtml(env, t, name, company, product, lang), replyTo: "mirko.peters@m365.fm" });
    ok = !!r.ok; err = r.ok ? "" : "http_" + r.status;
  }
  await db.prepare("UPDATE hardware_requests SET sent=?,err=? WHERE id=?").bind(ok ? 1 : 0, err, id).run();
  await notifyAdmins(env, { name, company, title: "Hardware-Bewerbung: " + product });
  return J({ ok: true });   // gespeichert ist gespeichert: ein fehlgeschlagener Bestaetigungs-Mailversand ist kein Fehler fuer den Bewerber
}
