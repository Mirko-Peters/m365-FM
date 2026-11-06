// #281 Folge: Sponsoring-Paket von /sponsor/ direkt bestellen und per PayPal-Rechnung (Invoicing v2) bezahlen.
// - Preise und Regeln aus data/sponsor_pricing.json (dieselbe Datei wie die Seite und assets/sponsor-calc.js); der Client schickt nur die Auswahl.
// - M365Con-Sponsoring bleibt "auf Anfrage": eine Auswahl mit M365Con wird abgelehnt (nur das Anfrageformular).
// - Kein Themen-Sponsoring mehr (Mirko, 6.11.2026): "topic" in der Auswahl wird ignoriert; Banner-Werbung bucht der Konfigurator getrennt (ads.js).
// - Steuer wie bei den Werbeplaetzen (ad_settings: vat_pct, reverse_charge), Rabatt und Steuer je Position wie bei PayPal.
// - Nach Zahlungseingang (Webhook INVOICING.INVOICE.PAID) entsteht eine Platzierung im Sponsor-Dashboard (#177).
import PRICING from "../../data/sponsor_pricing.json" with { type: "json" };
import { cleanText, esc, rateLimit, audit } from "./util.js";
import { notify } from "./mail.js";
import { sendPaypalInvoice, notifyAdmins, addMonths, cleanBilling, num, paypalConfig, bookingOn } from "./ads.js";

const now = () => Math.floor(Date.now() / 1000);
const today = () => new Date().toISOString().slice(0, 10);
const NS = { "cache-control": "no-store" };
const GOALS = ["ai", "vis", "lead"];
const money = (cents) => (cents / 100).toFixed(2);

// Gleiche Regeln wie SponsorCalc.compute (assets/sponsor-calc.js), nur der Preisteil, in Cent und je Position
export function sponsorQuote(P, sel, settings = {}, billing = {}) {
  const s = sel && typeof sel === "object" ? sel : {};
  if (s.con) return { error: "m365con_on_request" };
  const rt = Number(s.rt);
  if (!P.runtimes.includes(rt)) return { error: "bad_runtime" };
  const goal = GOALS.includes(s.goal) ? s.goal : P.defaults.goal;
  const topics = Array.isArray(s.topics) ? s.topics.map((t) => cleanText(typeof t === "string" ? t : t?.name, 80).replace(/[<>]/g, "")).filter(Boolean) : [];
  if (topics.length > P.max_topics) return { error: "bad_topics" };
  const clamp = (v) => Math.min(P.stepper.max, Math.max(P.stepper.min, Math.round(+v || 0)));
  const cnt = s.cnt && typeof s.cnt === "object" ? s.cnt : {};
  const n = topics.length, packs = Math.max(1, n), pr = P.prices;
  const prRecBase = +P.pr_rec[rt] || 0, prRec = n > 1 ? Math.min(P.pr_rec_cap, prRecBase * n) : prRecBase;
  const prCount = s.prTouched ? clamp(cnt.pr) : prRec, ex = clamp(cnt.ex), li = clamp(cnt.li), lv = clamp(cnt.lv);
  const rate = +P.discount[rt] || 0, dpct = Math.round(rate * 100);
  const dash = !!(s.dash || goal === "lead");
  const items = [];
  const add = (key, qty, unitUsd, months, discount) => {
    if (!(qty > 0)) return;
    items.push({ key, qty, months, unit_cents: unitUsd * 100, amount_cents: unitUsd * 100 * qty * months, discount_pct: discount ? dpct : 0 });
  };
  add("base", packs, pr.base, rt, true);
  if (s.video) add("video", packs, pr.video, rt, true);
  if (s.auth) add("auth", 1, pr.auth, rt);
  if (s.li) add("li", li, pr.li, rt);
  if (s.l14) add("lang", 1, pr.lang, rt);
  if (s.pr) add("pr", prCount, pr.pr, 1);
  if (s.expert) add("expert", ex, pr.expert, 1);
  if (s.live) add("live", lv, pr.live, 1);
  if (dash) add("dash", 1, pr.dash, 1);
  const reverse = num(settings, "reverse_charge", 0) === 1 && !!billing.vat_id && !!billing.country && billing.country !== "DE";
  const taxPct = reverse ? 0 : num(settings, "vat_pct", 19);
  let gross = 0, discount = 0, net = 0, tax = 0;
  for (const it of items) {
    it.discount_cents = Math.round(it.amount_cents * it.discount_pct / 100);
    it.net_cents = it.amount_cents - it.discount_cents;
    it.tax_cents = Math.round(it.net_cents * taxPct / 100);
    it.tax_pct = taxPct;
    gross += it.amount_cents; discount += it.discount_cents; net += it.net_cents; tax += it.tax_cents;
  }
  const pkg = { goal, rt, topics, video: !!s.video, pr: !!s.pr, auth: !!s.auth, dash, l14: !!s.l14, expert: !!s.expert, li: !!s.li, live: !!s.live,
    cnt: { pr: prCount, ex, li, lv } };
  return { package: pkg, items, currency: P.currency, discount_pct: dpct, subtotal_cents: gross, discount_cents: discount, net_cents: net,
    tax_pct: taxPct, tax_cents: tax, total_cents: net + tax, reverse_charge: reverse };
}

const LABEL = {
  base: ["Basispaket", "Base package"], video: ["Videopaket", "Video package"], auth: ["Autoritätspaket", "Authority package"],
  topic: ["Themen-Sponsoring", "Topic sponsorship"],   // nur fuer Rechnungen alter Bestellungen (Produkt seit 6.11.2026 entfallen)
  li: ["LinkedIn-Newsletter", "LinkedIn newsletter"], lang: ["Sprach-Shows", "Language shows"],
  pr: ["PR-Artikel", "PR articles"], expert: ["Experten-Interview", "Expert interview"], live: ["Livesession", "Live session"], dash: ["Sponsor-Dashboard", "Sponsor dashboard"],
};
export function orderItems(o) {
  const de = o.lang === "de", price = JSON.parse(o.price_json || "{}"), pkg = JSON.parse(o.package_json || "{}");
  const topics = pkg.topics?.length ? `${de ? "Themen" : "Topics"}: ${pkg.topics.join(", ")}` : "";
  return (price.items || []).map((i) => ({
    name: `${LABEL[i.key]?.[de ? 0 : 1] || i.key} × ${i.qty}${i.months > 1 ? ` × ${i.months} ${de ? "Monate" : "months"}` : ""}`,
    description: [topics, i.discount_pct ? (de ? `Laufzeitrabatt ${i.discount_pct} %` : `Runtime discount ${i.discount_pct} %`) : "", o.code].filter(Boolean).join(" · "),
    amount_cents: i.amount_cents, discount_pct: i.discount_pct, tax_pct: i.tax_pct,
  }));
}

async function settings(db) {
  const rows = (await db.prepare("SELECT k,v FROM ad_settings").all().catch(() => ({ results: [] }))).results || [];
  return Object.fromEntries(rows.map((r) => [r.k, r.v]));
}
async function canManage(db, orgId, userId) {
  const r = await db.prepare("SELECT role FROM org_members WHERE org_id=? AND user_id=? AND status='active'").bind(orgId, userId).first();
  return r?.role === "owner" || r?.role === "admin";
}
function view(o) {
  let billing = {}, pkg = {}, price = {};
  try { billing = JSON.parse(o.billing_json); pkg = JSON.parse(o.package_json); price = JSON.parse(o.price_json); } catch {}
  return { id: o.id, code: o.code, org_id: o.org_id, org_name: o.org_name, package: pkg, items: price.items || [], net_cents: o.net_cents, tax_cents: o.tax_cents,
    total_cents: o.total_cents, currency: o.currency, billing, pay_status: o.pay_status, invoice_url: o.invoice_url, placement_id: o.placement_id,
    created: o.created, paid_at: o.paid_at };
}

function randomCode() {
  const a = crypto.getRandomValues(new Uint8Array(12)), abc = "abcdefghijkmnpqrstuvwxyz23456789";
  return "sp-" + Array.from(a, (b) => abc[b % abc.length]).join("");
}

// Webhook (aus ads.js, nach der Signaturpruefung): Rechnung eines Sponsoring-Pakets bezahlt/storniert/erstattet. null = keine Bestellung.
export async function sponsorOrderInvoiceEvent(env, ev) {
  const db = env.DB, inv = ev.resource?.invoice || ev.resource || {};
  if (!inv.id) return null;
  const o = await db.prepare("SELECT * FROM sponsor_orders WHERE paypal_invoice_id=?").bind(String(inv.id)).first().catch(() => null);
  if (!o) return null;
  if (ev.event_type === "INVOICING.INVOICE.PAID") {
    const paid = inv.payments?.paid_amount || inv.amount || {};
    const cents = Math.round(Number(paid.value) * 100);
    if (paid.currency_code !== o.currency || !Number.isFinite(cents) || Math.abs(cents - o.total_cents) > 2) {
      await notifyAdmins(env, `Sponsoring-Bestellung ${o.code}: Betrag passt nicht`, `<p>PayPal meldet ${esc(String(paid.value))} ${esc(String(paid.currency_code))}, erwartet ${money(o.total_cents)} ${esc(o.currency)}.</p>`, `spmismatch:${o.id}`);
      return "sponsor_amount_mismatch";
    }
    const pkg = JSON.parse(o.package_json || "{}");
    const placement = `sp-order-${o.id}`, start = today(), end = addMonths(start, pkg.rt || 1);
    const r = await db.prepare("UPDATE sponsor_orders SET pay_status='paid',paid_at=?,placement_id=?,updated=? WHERE id=? AND pay_status='pending'").bind(now(), placement, now(), o.id).run();
    if (!r.meta.changes) return "sponsor_already_paid";
    await db.prepare(`INSERT INTO sponsor_placements(id,org_id,title,channel,langs,start,end,refs,created) VALUES(?,?,?,?,?,?,?,?,?)
      ON CONFLICT(id) DO NOTHING`).bind(placement, o.org_id, `Sponsoring-Paket ${o.code}`, "podcast_video", "", start, end,
      JSON.stringify({ order: o.code, topics: pkg.topics || [] }), now()).run();
    await notifyAdmins(env, `Sponsoring-Paket bezahlt: ${o.code}`, `<p>Die Rechnung für <b>${esc(o.code)}</b> ist bezahlt (${money(o.total_cents)} ${esc(o.currency)}). Die Platzierung steht im Sponsor-Dashboard; bitte Umsetzung planen.</p><p><a href="${env.SITE}/admin/#ads">Admin: Werbung</a></p>`, `sppaid:${o.id}`);
    await notify(env, o.user_id, "system", `M365.FM: Zahlung erhalten / payment received (${o.code})`, `<p>Danke! Deine Zahlung für das Sponsoring-Paket ${esc(o.code)} ist eingegangen. Wir melden uns zur Umsetzung.</p><p>Thank you! We received your payment and will contact you about the next steps.</p><p><a href="${env.SITE}/sponsor/dashboard/">Sponsor-Dashboard</a></p>`, `sppaiduser:${o.id}`);
    return "sponsor_paid";
  }
  if (ev.event_type === "INVOICING.INVOICE.CANCELLED") {
    await db.prepare("UPDATE sponsor_orders SET pay_status='cancelled',updated=? WHERE id=? AND pay_status='pending'").bind(now(), o.id).run();
    return "sponsor_cancelled";
  }
  await db.prepare("UPDATE sponsor_orders SET pay_status='refunded',updated=? WHERE id=?").bind(now(), o.id).run();
  if (o.placement_id) await db.prepare("UPDATE sponsor_placements SET end=? WHERE id=? AND (end IS NULL OR end>?)").bind(today(), o.placement_id, today()).run();
  await notifyAdmins(env, `Sponsoring-Paket erstattet: ${o.code}`, `<p>PayPal meldet eine Erstattung für <b>${esc(o.code)}</b>.</p>`, `sprefund:${o.id}:${ev.id}`);
  return "sponsor_refunded";
}

export async function handleSponsorOrders(env, request, url, path, user, J) {
  const db = env.DB, method = request.method;
  if (path === "/api/sponsor/order" && method === "POST") {
    if (!bookingOn(env)) return J({ error: "not_available_yet", message: "Ordering is not available yet. Please use the request form." }, 503, NS);   // Schalter ADS_BOOKING
    if (!user) return J({ error: "login" }, 401, NS);
    const body = await request.json().catch(() => ({})) || {};
    const orgId = Number(body.org_id);
    if (!Number.isSafeInteger(orgId) || !(user.admin || await canManage(db, orgId, user.id))) return J({ error: "forbidden" }, 403, NS);
    if (!(await db.prepare("SELECT 1 x FROM orgs WHERE id=?").bind(orgId).first())) return J({ error: "not_found" }, 404, NS);
    if (body.package?.con) return J({ error: "m365con_on_request" }, 400, NS);   // M365Con nur ueber das Anfrageformular
    const billing = cleanBilling(body.billing);
    if (!billing || billing.contact.length < 2) return J({ error: "bad_billing" }, 400, NS);
    if (!(await rateLimit(db, `sporder:${user.id}`, 10, 86400))) return J({ error: "rate_limit" }, 429, NS);
    const st = await settings(db);
    const q = sponsorQuote(PRICING, body.package, st, billing);
    if (q.error) return J({ error: q.error }, 400, NS);
    const lang = /^[a-z]{2}$/.test(String(body.lang || "")) ? body.lang : "en";
    let code = randomCode();
    if (await db.prepare("SELECT 1 x FROM sponsor_orders WHERE code=?").bind(code).first()) code = randomCode();
    const t = now();
    const r = await db.prepare(`INSERT INTO sponsor_orders(code,org_id,user_id,package_json,price_json,net_cents,tax_cents,total_cents,currency,billing_json,lang,created,updated)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(code, orgId, user.id, JSON.stringify(q.package), JSON.stringify({ ...q, package: undefined }), q.net_cents, q.tax_cents,
      q.total_cents, q.currency, JSON.stringify(billing), lang, t, t).run();
    const o = await db.prepare("SELECT * FROM sponsor_orders WHERE id=?").bind(r.meta.last_row_id).first();
    const de = lang === "de";
    const note = [
      de ? `Sponsoring-Paket ${code} auf www.m365.fm (${q.package.rt} Monate). Nach Zahlungseingang melden wir uns zur Umsetzung.` : `Sponsorship package ${code} on www.m365.fm (${q.package.rt} months). We will contact you about the next steps after payment.`,
      billing.vat_id ? `${de ? "USt-IdNr. des Kunden" : "Customer VAT ID"}: ${billing.vat_id}` : "",
      q.reverse_charge ? (de ? "Steuerschuldnerschaft des Leistungsempfängers (Reverse Charge)." : "Reverse charge: VAT to be accounted for by the recipient.") : "",
    ].filter(Boolean).join("\n");
    let inv;
    try {
      inv = await sendPaypalInvoice(env, { number: `M365FM-SP-${o.id}`, reference: code, currency: q.currency, lang, billing, items: orderItems(o), note,
        dueDays: num(st, "invoice_due_days", 14), requestKey: `${code}-${q.total_cents}` });
    } catch (e) {
      console.error("paypal", String(e?.message || e).slice(0, 80));
      return J({ error: "payment_unavailable", code }, 502, NS);
    }
    await db.prepare("UPDATE sponsor_orders SET paypal_invoice_id=?,invoice_url=?,updated=? WHERE id=?").bind(inv.id, inv.url, now(), o.id).run();
    const org = await db.prepare("SELECT name FROM orgs WHERE id=?").bind(orgId).first();
    await notifyAdmins(env, `Neue Sponsoring-Bestellung: ${org?.name || orgId} (${code})`,
      `<p><b>${esc(org?.name || "")}</b> hat das Sponsoring-Paket <b>${esc(code)}</b> bestellt: ${money(q.net_cents)} ${esc(q.currency)} netto, ${money(q.total_cents)} ${esc(q.currency)} gesamt, ${q.package.rt} Monate. Die PayPal-Rechnung ist verschickt.</p><p><a href="${env.SITE}/admin/#ads">Admin: Werbung</a></p>`, `spnew:${o.id}`);
    await audit(db, user.id, "sponsor-order", code, `${money(q.total_cents)} ${q.currency}`).catch(() => 0);
    return J({ ok: true, code, invoice_url: inv.url, net_cents: q.net_cents, tax_cents: q.tax_cents, total_cents: q.total_cents, currency: q.currency }, 200, NS);
  }
  if (path === "/api/sponsor/orders" && method === "GET") {
    if (!user) return J({ error: "login" }, 401, NS);
    const rows = (await db.prepare(`SELECT s.*,o.name org_name FROM sponsor_orders s JOIN orgs o ON o.id=s.org_id
      WHERE s.org_id IN (SELECT org_id FROM org_members WHERE user_id=? AND status='active' AND role IN ('owner','admin')) ORDER BY s.created DESC LIMIT 100`).bind(user.id).all()).results || [];
    return J({ orders: rows.map(view) }, 200, NS);
  }
  if (path === "/api/admin/sponsor-orders" && method === "GET") {
    if (!user) return J({ error: "login" }, 401, NS);
    if (!user.admin) return J({ error: "forbidden" }, 403, NS);
    const rows = (await db.prepare("SELECT s.*,o.name org_name FROM sponsor_orders s LEFT JOIN orgs o ON o.id=s.org_id ORDER BY s.created DESC LIMIT 300").all()).results || [];
    return J({ orders: rows.map(view), paypal_env: paypalConfig(env).live ? "live" : "sandbox" }, 200, NS);
  }
  return null;
}

export { PRICING as SPONSOR_PRICING };
