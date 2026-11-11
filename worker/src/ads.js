// #281 Werbeplaetze direkt buchen und bezahlen: Banner oben/Mitte/unten (TKP), Firmenkarte (pro Klick), Lead-Formular (pro Lead).
// - Preise nur hier auf dem Server berechnet (quote), Werte aus D1 (ad_prices, ad_settings), im Admin aenderbar.
// - Zahlung per PayPal: sofort (Orders API v2) oder per Rechnung (Invoicing API v2). PAYPAL_ENV=sandbox|live (Standard sandbox).
// - Webhook /paypal/webhook: jede Nachricht per verify-webhook-signature mit PAYPAL_WEBHOOK_ID pruefen, idempotent ueber die Event-ID.
// - Kampagne startet erst nach bestaetigter Zahlung UND Freigabe des Werbemittels durch einen Admin.
// - Einblendungen cookiefrei beim Ausliefern des Platzes gezaehlt (je Kampagne, Platz, Seitentyp, Tag), Klicks ueber /go/<code>.
import { LEAD_STATUS } from "./mediakit.js";
import { cleanText, esc, rateLimit, sha256hex, audit, cors } from "./util.js";
import { notify } from "./mail.js";
import { sponsorOrderInvoiceEvent } from "./sponsor_orders.js";

const now = () => Math.floor(Date.now() / 1000);
const today = () => new Date().toISOString().slice(0, 10);
const NS = { "cache-control": "no-store" };
export const PAGE_TYPES = ["episode", "lang", "entity", "blog", "other"];
export const SLOTS = ["top", "mid", "bottom"];
const PLANS = ["free", "expert", "premium"];
const EMAIL = /^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,}$/i;
const TOPIC = /^[a-z0-9][a-z0-9-]{1,79}$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const CODE = /^ad-[a-z0-9]{8,20}$/;
const SETTING_KEYS = {
  min_impressions: [1000, 10_000_000], min_clicks: [1, 1_000_000], min_leads: [1, 10_000],
  topic_pct: [0, 500], exclusive_pct: [0, 500], runtime3_pct: [0, 90], runtime6_pct: [0, 90],
  lead_expert_cents: [0, 1_000_000], lead_premium_cents: [0, 1_000_000], premium_included_leads: [0, 1000],
  vat_pct: [0, 50], reverse_charge: [0, 1], invoice_due_days: [0, 90], intro_prices: [0, 1],
};
export const PRODUCT_LABEL = {
  banner_top: ["Banner oben (728×90 / mobil 320×100)", "Top banner (728×90 / mobile 320×100)"],
  banner_mid: ["Banner Mitte (300×250)", "Middle banner (300×250)"],
  banner_bottom: ["Banner unten (728×90 / mobil 320×100)", "Bottom banner (728×90 / mobile 320×100)"],
  company_card: ["Firmenkarte (pro Klick)", "Company card (per click)"],
  lead_form: ["Lead-Formular (pro Lead)", "Lead form (per lead)"],
};
const ERRMAP = { login: 401, forbidden: 403, not_found: 404 };

const eur = (cents) => (Math.round(cents) / 100).toFixed(2);
const int = (v) => (Number.isSafeInteger(Number(v)) ? Number(v) : NaN);
const list = (v, max = 20) => (Array.isArray(v) ? v : String(v || "").split(",")).map((x) => String(x).trim().toLowerCase()).filter(Boolean).slice(0, max);
const isDay = (v) => DAY.test(String(v || "")) && new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v;
export function addMonths(day, months) {
  const d = new Date(`${day}T00:00:00Z`); d.setUTCMonth(d.getUTCMonth() + months); d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}
function httpsUrl(value) {
  try { const u = new URL(String(value || "")); return u.protocol === "https:" && u.hostname.includes(".") && !u.username && !u.password ? u : null; } catch { return null; }
}
function randomCode() {
  const a = crypto.getRandomValues(new Uint8Array(12)), abc = "abcdefghijkmnpqrstuvwxyz23456789";
  return "ad-" + Array.from(a, (b) => abc[b % abc.length]).join("");
}

// Schalter (Mirko, 5.11.2026): bis der PayPal-Sandbox-Test gelaufen ist, nur eigene Werbung. ADS_BOOKING="1" schaltet bezahlte Kampagnen,
// Buchung, Zahlung, Leads und Sponsoring-Bestellungen ein; sonst antworten diese Routen mit 503 not_available_yet (kein PayPal-Aufruf).
export const bookingOn = (env) => env?.ADS_BOOKING === "1";
const OFF_ROUTES = new Set(["/api/ads/bookings", "/api/ads/banner", "/api/ads/pay", "/api/ads/paypal-return", "/api/ads/lead"]);

// ---------------------------------------------------------------- Preise

export async function loadPricing(db) {
  const products = (await db.prepare("SELECT * FROM ad_products ORDER BY sort,id").all()).results || [];
  const prices = (await db.prepare("SELECT product,page_type,price_cents,active FROM ad_prices ORDER BY product,page_type").all()).results || [];
  const settings = Object.fromEntries(((await db.prepare("SELECT k,v FROM ad_settings").all()).results || []).map((r) => [r.k, r.v]));
  return { products, prices, settings };
}

export const num = (settings, key, fallback) => { const n = Number(settings?.[key]); return Number.isFinite(n) ? n : fallback; };

// Reine Preisrechnung (auch fuer Tests): Positionen mit Laufzeitrabatt je Position und Steuer je Position, genau wie PayPal sie rechnet
// (sonst weichen Bestellung und Rechnung um Cent-Rundungen ab). input: {product, page_types, topics, exclusive, months, quantity, plan, included, billing}
export function quote(pricing, input) {
  const { products, prices, settings } = pricing;
  const product = products.find((p) => p.id === input.product && p.active);
  if (!product) return { error: "bad_product" };
  const pageTypes = [...new Set(list(input.page_types, 5))];
  const active = prices.filter((p) => p.product === product.id && p.active);
  if (!pageTypes.length || pageTypes.some((t) => !active.some((p) => p.page_type === t))) return { error: "bad_page_type" };
  const unit = Math.max(...pageTypes.map((t) => active.find((p) => p.page_type === t).price_cents));
  const months = int(input.months ?? 1), quantity = int(input.quantity);
  if (!(months >= 1 && months <= 12)) return { error: "bad_months" };
  const min = product.kind === "cpm" ? num(settings, "min_impressions", 10000) : product.kind === "cpc" ? num(settings, "min_clicks", 1) : num(settings, "min_leads", 1);
  if (!(quantity >= min && quantity <= 10_000_000)) return { error: "bad_quantity", min };
  const topics = list(input.topics, 10);
  if (topics.some((t) => !TOPIC.test(t))) return { error: "bad_topics" };
  const exclusive = !!input.exclusive;
  const items = [];   // {key, qty, unit_cents, amount_cents}
  let unitCents = unit;
  if (product.kind === "cpm") {
    const base = Math.round(unit * quantity / 1000);
    items.push({ key: "placement", qty: quantity, unit_cents: unit, amount_cents: base });
    if (topics.length) items.push({ key: "topic", pct: num(settings, "topic_pct", 25), amount_cents: Math.round(base * num(settings, "topic_pct", 25) / 100) });
    if (exclusive) items.push({ key: "exclusive", pct: num(settings, "exclusive_pct", 50), amount_cents: Math.round(base * num(settings, "exclusive_pct", 50) / 100) });
  } else if (product.kind === "cpc") {
    items.push({ key: "placement", qty: quantity, unit_cents: unit, amount_cents: unit * quantity });
  } else {
    const plan = PLANS.includes(input.plan) ? input.plan : "free";
    unitCents = plan === "expert" ? num(settings, "lead_expert_cents", 1000) : plan === "premium" ? num(settings, "lead_premium_cents", 500) : unit;
    const included = plan === "premium" ? Math.max(0, Math.min(quantity, int(input.included) || 0)) : 0;
    if (included) items.push({ key: "included_leads", qty: included, unit_cents: 0, amount_cents: 0 });
    if (quantity - included) items.push({ key: "placement", qty: quantity - included, unit_cents: unitCents, amount_cents: unitCents * (quantity - included), plan });
  }
  // Laufzeitrabatt nur fuer Banner (Klicks und Leads werden pro Ergebnis bezahlt)
  const dpct = product.kind !== "cpm" ? 0 : months >= 6 ? num(settings, "runtime6_pct", 20) : months >= 3 ? num(settings, "runtime3_pct", 10) : 0;
  const billing = input.billing || {};
  const reverse = num(settings, "reverse_charge", 0) === 1 && !!billing.vat_id && !!billing.country && billing.country !== "DE";
  const taxPct = reverse ? 0 : num(settings, "vat_pct", 19);
  let net = 0, tax = 0, discount = 0, gross = 0;
  for (const it of items) {
    it.discount_cents = Math.round(it.amount_cents * dpct / 100);
    it.net_cents = it.amount_cents - it.discount_cents;
    it.tax_cents = Math.round(it.net_cents * taxPct / 100);
    gross += it.amount_cents; discount += it.discount_cents; net += it.net_cents; tax += it.tax_cents;
  }
  return {
    product: product.id, kind: product.kind, slot: product.slot, page_types: pageTypes, topics, exclusive, months, quantity,
    unit_cents: unitCents, items, discount_pct: dpct, discount_cents: discount, subtotal_cents: gross,
    net_cents: net, tax_pct: taxPct, tax_cents: tax, total_cents: net + tax, reverse_charge: reverse, currency: "EUR",
    included_used: items.find((i) => i.key === "included_leads")?.qty || 0,
  };
}

// ---------------------------------------------------------------- Hilfen: Rechte, Benachrichtigung

async function orgRole(db, orgId, userId) {
  const r = await db.prepare("SELECT role FROM org_members WHERE org_id=? AND user_id=? AND status='active'").bind(orgId, userId).first();
  return r?.role || null;
}
const canManage = (role) => role === "owner" || role === "admin";

export async function notifyAdmins(env, subject, bodyHtml, key) {
  const users = (await env.DB.prepare("SELECT id,role,provider,sub FROM users WHERE banned=0").all()).results || [];
  const allow = new Set((env.ADMIN_SUBS || "").split(",").map((s) => s.trim()).filter(Boolean));
  for (const u of users.filter((x) => x.role === "admin" || allow.has(`${x.provider}:${x.sub}`))) await notify(env, u.id, "system", subject, bodyHtml, `${key}:${u.id}`);
}

function publicBooking(b) {
  let price = {}, billing = {};
  try { price = JSON.parse(b.price_json || "{}"); } catch {}
  try { billing = JSON.parse(b.billing_json || "{}"); } catch {}
  return {
    id: b.id, code: b.code, org_id: b.org_id, product: b.product, page_types: b.page_types ? b.page_types.split(",") : [], topics: b.topics ? b.topics.split(",") : [],
    exclusive: !!b.exclusive, months: b.months, quantity: b.quantity, delivered: b.delivered, start: b.start, end: b.end, target_url: b.target_url,
    alt: b.alt, tagline: b.tagline, banner_url: b.banner_url, banner_w: b.banner_w, banner_h: b.banner_h, mobile_url: b.mobile_url, mobile_w: b.mobile_w, mobile_h: b.mobile_h,
    price, net_cents: b.net_cents, tax_cents: b.tax_cents, total_cents: b.total_cents, currency: b.currency, billing, pay_method: b.pay_method,
    pay_status: b.pay_status, invoice_url: b.invoice_url, creative_status: b.creative_status, status: b.status, reject_reason: b.reject_reason,
    created: b.created, paid_at: b.paid_at, approved_at: b.approved_at,
  };
}

// Kampagne starten, sobald bezahlt UND freigegeben. Idempotent (nur aus 'awaiting').
export async function maybeActivate(env, id) {
  const db = env.DB;
  const b = await db.prepare("SELECT * FROM ad_bookings WHERE id=?").bind(id).first();
  if (!b || b.status !== "awaiting" || b.pay_status !== "paid" || b.creative_status !== "approved") return false;
  const start = b.start && b.start > today() ? b.start : today();
  const end = addMonths(start, b.months || 1);
  const r = await db.prepare("UPDATE ad_bookings SET status='active',start=?,end=?,updated=? WHERE id=? AND status='awaiting'").bind(start, end, now(), id).run();
  if (!r.meta.changes) return false;
  let price = {};
  try { price = JSON.parse(b.price_json || "{}"); } catch {}
  if (price.included_used) await db.prepare("UPDATE ad_accounts SET included_leads=MAX(0,included_leads-?),updated=? WHERE org_id=?").bind(price.included_used, now(), b.org_id).run();
  await notify(env, b.user_id, "system", `M365.FM: Kampagne ${b.code} ist gestartet / campaign started`,
    `<p>Deine Kampagne <b>${esc(b.code)}</b> (${esc(PRODUCT_LABEL[b.product]?.[0] || b.product)}) läuft ab ${esc(start)} bis ${esc(end)}.</p><p>Your campaign is live from ${esc(start)} to ${esc(end)}.</p><p><a href="${env.SITE}/sponsor/dashboard/">Sponsor-Dashboard</a></p>`, `adstart:${b.id}`);
  return true;
}

// ---------------------------------------------------------------- PayPal

let TOKEN = null;
export function paypalConfig(env) {
  const live = env.PAYPAL_ENV === "live";
  return {
    live, base: live ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com",
    id: (live ? "" : env.PAYPAL_SANDBOX_CLIENT_ID) || env.PAYPAL_CLIENT_ID || "",
    secret: (live ? "" : env.PAYPAL_SANDBOX_CLIENT_SECRET) || env.PAYPAL_CLIENT_SECRET || "",
    webhook: (live ? "" : env.PAYPAL_SANDBOX_WEBHOOK_ID) || env.PAYPAL_WEBHOOK_ID || "",
  };
}
export function resetPaypalToken() { TOKEN = null; }
async function ppToken(env) {
  const c = paypalConfig(env);
  if (!c.id || !c.secret) throw new Error("paypal_unconfigured");
  if (TOKEN && TOKEN.base === c.base && TOKEN.id === c.id && TOKEN.exp > Date.now() + 60000) return TOKEN.token;
  const r = await fetch(`${c.base}/v1/oauth2/token`, { method: "POST",
    headers: { authorization: "Basic " + btoa(`${c.id}:${c.secret}`), "content-type": "application/x-www-form-urlencoded" }, body: "grant_type=client_credentials" });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) throw new Error("paypal_auth");
  TOKEN = { token: j.access_token, exp: Date.now() + (Number(j.expires_in) || 300) * 1000, base: c.base, id: c.id };
  return TOKEN.token;
}
async function pp(env, method, path, body, headers = {}) {
  const c = paypalConfig(env), token = await ppToken(env);
  const r = await fetch(c.base + path, { method, headers: { authorization: `Bearer ${token}`, "content-type": "application/json", ...headers },
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body) });
  return { status: r.status, json: await r.json().catch(() => ({})) };
}

function itemName(b, de) {
  const p = JSON.parse(b.price_json || "{}");
  const label = PRODUCT_LABEL[b.product]?.[de ? 0 : 1] || b.product;
  return { label, p };
}
// Positionen fuer Rechnung/Bestellung: Platz, Zeitraum, Einblendungen, Aufschlaege, Rabatt (Rabatt je Position wie in quote())
export function invoiceItems(b) {
  const de = b.lang === "de";
  const { label, p } = itemName(b, de);
  const period = b.start ? `${b.start} – ${addMonths(b.start, b.months)}` : (de ? `${b.months} Monat(e) ab Freigabe` : `${b.months} month(s) from approval`);
  const qtyText = p.kind === "cpm" ? (de ? "Einblendungen" : "impressions") : p.kind === "cpc" ? (de ? "Klicks" : "clicks") : "Leads";
  const names = {
    placement: `${label} · ${b.quantity.toLocaleString(de ? "de-DE" : "en-US")} ${qtyText}`,
    topic: de ? `Aufschlag Themen-Targeting (+${p.items?.find((i) => i.key === "topic")?.pct ?? ""} %)` : `Topic targeting surcharge (+${p.items?.find((i) => i.key === "topic")?.pct ?? ""} %)`,
    exclusive: de ? `Aufschlag exklusiv (+${p.items?.find((i) => i.key === "exclusive")?.pct ?? ""} %)` : `Exclusivity surcharge (+${p.items?.find((i) => i.key === "exclusive")?.pct ?? ""} %)`,
    included_leads: de ? "Im Premium-Profil enthaltene Leads" : "Leads included in the premium profile",
  };
  return (p.items || []).filter((i) => i.amount_cents > 0).map((i) => ({
    name: names[i.key] || i.key, description: `${period}${p.topics?.length ? ` · ${de ? "Themen" : "Topics"}: ${p.topics.join(", ")}` : ""} · ${b.code}`,
    amount_cents: i.amount_cents, discount_pct: p.discount_pct || 0, tax_pct: p.tax_pct ?? 0,
  }));
}

export async function createPaypalOrder(env, b) {
  const de = b.lang === "de";
  const ret = `${env.API}/api/ads/paypal-return?code=${encodeURIComponent(b.code)}`;
  const body = {
    intent: "CAPTURE",
    purchase_units: [{
      reference_id: b.code, custom_id: String(b.id), invoice_id: `M365FM-AD-${b.id}`,
      description: `M365.FM ${PRODUCT_LABEL[b.product]?.[de ? 0 : 1] || b.product} · ${b.code}`.slice(0, 127),
      amount: { currency_code: "EUR", value: eur(b.total_cents), breakdown: {
        item_total: { currency_code: "EUR", value: eur(b.net_cents) }, tax_total: { currency_code: "EUR", value: eur(b.tax_cents) } } },
      items: [{ name: `M365.FM ${b.code}`.slice(0, 127), quantity: "1", category: "DIGITAL_GOODS",
        unit_amount: { currency_code: "EUR", value: eur(b.net_cents) }, tax: { currency_code: "EUR", value: eur(b.tax_cents) } }],
    }],
    payment_source: { paypal: { experience_context: { brand_name: "M365.FM", user_action: "PAY_NOW", shipping_preference: "NO_SHIPPING",
      locale: de ? "de-DE" : "en-US", return_url: ret, cancel_url: `${ret}&cancel=1` } } },
  };
  const r = await pp(env, "POST", "/v2/checkout/orders", body, { "PayPal-Request-Id": `order-${b.code}-${b.total_cents}` });
  if (r.status >= 300 || !r.json.id) throw new Error("paypal_order");
  const link = (r.json.links || []).find((l) => l.rel === "payer-action" || l.rel === "approve");
  return { id: r.json.id, approve: link?.href || "" };
}

function captureOf(order) {
  const pu = (order?.purchase_units || [])[0] || {};
  const c = (pu.payments?.captures || [])[0];
  return c ? { id: c.id, status: c.status, value: c.amount?.value, currency: c.amount?.currency_code } : null;
}

// Bezahlt setzen nur bei passendem Betrag und Waehrung (Preis aus D1, nie vom Client)
export async function markPaid(env, b, { value, currency, captureId = "", source }) {
  const cents = Math.round(Number(value) * 100);
  if (currency !== "EUR" || !Number.isFinite(cents) || Math.abs(cents - b.total_cents) > (source === "invoice" ? 2 : 0)) {
    await notifyAdmins(env, `Werbebuchung ${b.code}: Betrag passt nicht`, `<p>PayPal meldet ${esc(String(value))} ${esc(String(currency))}, erwartet ${eur(b.total_cents)} EUR.</p>`, `admismatch:${b.id}:${captureId}`);
    return "amount_mismatch";
  }
  const r = await env.DB.prepare("UPDATE ad_bookings SET pay_status='paid',paid_at=?,paypal_capture_id=CASE WHEN ?<>'' THEN ? ELSE paypal_capture_id END,updated=? WHERE id=? AND pay_status IN ('pending','approved')")
    .bind(now(), captureId, captureId, now(), b.id).run();
  if (r.meta.changes) {
    await notifyAdmins(env, `Werbebuchung bezahlt: ${b.code}`, `<p>Buchung <b>${esc(b.code)}</b> ist bezahlt (${eur(b.total_cents)} EUR, ${esc(source)}). ${b.creative_status === "approved" ? "Kampagne startet." : "Werbemittel wartet auf Freigabe."}</p><p><a href="${env.SITE}/admin/#ads">Admin: Werbung</a></p>`, `adpaid:${b.id}`);
  }
  await maybeActivate(env, b.id);
  return r.meta.changes ? "paid" : "already_paid";
}

export async function captureOrder(env, b) {
  if (!b.paypal_order_id) return "no_order";
  let r = await pp(env, "POST", `/v2/checkout/orders/${encodeURIComponent(b.paypal_order_id)}/capture`, "{}", { "PayPal-Request-Id": `capture-${b.paypal_order_id}` });
  if (r.status === 422) r = await pp(env, "GET", `/v2/checkout/orders/${encodeURIComponent(b.paypal_order_id)}`);   // schon erfasst: Bestellung lesen
  const c = captureOf(r.json);
  if (!c) return "no_capture";
  if (c.status === "COMPLETED") return markPaid(env, b, { value: c.value, currency: c.currency, captureId: c.id, source: "paypal" });
  if (c.status === "DECLINED" || c.status === "FAILED") {
    await env.DB.prepare("UPDATE ad_bookings SET pay_status='denied',updated=? WHERE id=? AND pay_status<>'paid'").bind(now(), b.id).run();
    return "denied";
  }
  return "capture_" + String(c.status || "").toLowerCase();
}

export async function createPaypalInvoice(env, b) {
  const de = b.lang === "de";
  let billing = {};
  try { billing = JSON.parse(b.billing_json || "{}"); } catch {}
  const pr = JSON.parse(b.price_json || "{}");
  const note = [
    de ? `Buchung ${b.code} auf www.m365.fm. Die Kampagne startet nach Zahlungseingang und Freigabe des Werbemittels.` : `Booking ${b.code} on www.m365.fm. The campaign starts after payment and approval of the creative.`,
    billing.vat_id ? `${de ? "USt-IdNr. des Kunden" : "Customer VAT ID"}: ${billing.vat_id}` : "",
    pr.reverse_charge ? (de ? "Steuerschuldnerschaft des Leistungsempfängers (Reverse Charge)." : "Reverse charge: VAT to be accounted for by the recipient.") : "",
  ].filter(Boolean).join("\n");
  return sendPaypalInvoice(env, { number: `M365FM-AD-${b.id}`, reference: b.code, currency: "EUR", lang: b.lang, billing, items: invoiceItems(b),
    note, dueDays: Number(pr.invoice_due_days ?? 14), requestKey: `${b.code}-${b.total_cents}` });
}

// Rechnung ueber PayPal Invoicing v2 anlegen und versenden (Werbeplaetze und Sponsoring-Pakete).
// items: [{name, description, amount_cents, discount_pct, tax_pct}] - Rabatt und Steuer je Position, wie in den Preisrechnungen.
export async function sendPaypalInvoice(env, { number, reference, currency, lang, billing, items, note, dueDays = 14, requestKey }) {
  const de = lang === "de";
  const due = new Date(Date.now() + dueDays * 86400000).toISOString().slice(0, 10);
  const body = {
    detail: { currency_code: currency, invoice_number: number, reference, invoice_date: today(), note: String(note || "").slice(0, 4000),
      payment_term: { term_type: "DUE_ON_DATE_SPECIFIED", due_date: due } },
    invoicer: { business_name: "M365.FM", website: env.SITE },
    primary_recipients: [{ billing_info: {
      business_name: String(billing.company || "").slice(0, 300), email_address: billing.email,
      ...(billing.contact ? { name: { full_name: String(billing.contact).slice(0, 140) } } : {}),
      ...(billing.vat_id ? { additional_info_value: `VAT ID: ${billing.vat_id}`.slice(0, 40) } : {}),
      address: { address_line_1: billing.address, postal_code: billing.postal_code, admin_area_2: billing.city, country_code: billing.country },
      language: de ? "de-DE" : "en-US",
    } }],
    items: items.filter((i) => i.amount_cents > 0).map((i) => ({
      name: String(i.name).slice(0, 200), description: String(i.description || "").slice(0, 1000), quantity: "1",
      unit_amount: { currency_code: currency, value: eur(i.amount_cents) },
      tax: { name: de ? "USt." : "VAT", percent: String(i.tax_pct ?? 0) },
      ...(i.discount_pct ? { discount: { percent: String(i.discount_pct) } } : {}),
    })),
    configuration: { tax_inclusive: false, allow_tip: false, tax_calculated_after_discount: true },
  };
  const r = await pp(env, "POST", "/v2/invoicing/invoices", body, { Prefer: "return=representation", "PayPal-Request-Id": `invoice-${requestKey}` });
  const id = r.json.id || /\/invoices\/([A-Z0-9-]+)$/.exec(r.json.href || "")?.[1];
  if (r.status >= 300 || !id) throw new Error("paypal_invoice");
  const s = await pp(env, "POST", `/v2/invoicing/invoices/${encodeURIComponent(id)}/send`, { send_to_invoicer: true, send_to_recipient: true }, { "PayPal-Request-Id": `send-${id}` });
  const view = (s.json.links || []).find((l) => l.rel === "payer-view")?.href || s.json.href || "";
  return { id, url: /^https:\/\/www\.(sandbox\.)?paypal\.com\//.test(view) ? view : "" };
}

// Webhook pruefen: Rohtext des Ereignisses unveraendert einbetten (kein erneutes Serialisieren)
export async function verifyWebhook(env, request, raw) {
  const c = paypalConfig(env);
  if (!c.webhook) return false;
  const h = (k) => request.headers.get(k) || "";
  const fields = { auth_algo: h("paypal-auth-algo"), cert_url: h("paypal-cert-url"), transmission_id: h("paypal-transmission-id"),
    transmission_sig: h("paypal-transmission-sig"), transmission_time: h("paypal-transmission-time") };
  if (Object.values(fields).some((v) => !v)) return false;
  const body = "{" + Object.entries(fields).map(([k, v]) => `${JSON.stringify(k)}:${JSON.stringify(v)}`).join(",") +
    `,"webhook_id":${JSON.stringify(c.webhook)},"webhook_event":${raw}}`;
  const r = await pp(env, "POST", "/v1/notifications/verify-webhook-signature", body).catch(() => ({ status: 0, json: {} }));
  return r.status === 200 && r.json.verification_status === "SUCCESS";
}

const HANDLED = new Set(["CHECKOUT.ORDER.APPROVED", "PAYMENT.CAPTURE.COMPLETED", "PAYMENT.CAPTURE.DENIED", "PAYMENT.CAPTURE.REFUNDED",
  "INVOICING.INVOICE.PAID", "INVOICING.INVOICE.CANCELLED", "INVOICING.INVOICE.REFUNDED"]);

async function bookingFor(db, ev) {
  const r = ev.resource || {};
  const inv = r.invoice || r;
  if (ev.event_type.startsWith("INVOICING.")) return inv.id ? db.prepare("SELECT * FROM ad_bookings WHERE paypal_invoice_id=?").bind(inv.id).first() : null;
  if (ev.event_type === "CHECKOUT.ORDER.APPROVED") return r.id ? db.prepare("SELECT * FROM ad_bookings WHERE paypal_order_id=?").bind(r.id).first() : null;
  const orderId = r.supplementary_data?.related_ids?.order_id;
  if (orderId) { const b = await db.prepare("SELECT * FROM ad_bookings WHERE paypal_order_id=?").bind(orderId).first(); if (b) return b; }
  const captureId = ev.event_type === "PAYMENT.CAPTURE.REFUNDED" ? /\/captures\/([A-Z0-9]+)/.exec((r.links || []).find((l) => l.rel === "up")?.href || "")?.[1] : r.id;
  if (captureId) { const b = await db.prepare("SELECT * FROM ad_bookings WHERE paypal_capture_id=?").bind(captureId).first(); if (b) return b; }
  if (/^\d+$/.test(String(r.custom_id || ""))) return db.prepare("SELECT * FROM ad_bookings WHERE id=?").bind(+r.custom_id).first();
  return null;
}

export async function handlePaypalWebhook(env, request) {
  const res = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "content-type": "application/json", ...NS } });
  if (request.method !== "POST") return res({ error: "method_not_allowed" }, 405);
  const raw = await request.text();
  if (raw.length > 200_000) return res({ error: "too_large" }, 413);
  let ev;
  try { ev = JSON.parse(raw); } catch { return res({ error: "bad_request" }, 400); }
  if (!ev || typeof ev.id !== "string" || typeof ev.event_type !== "string") return res({ error: "bad_request" }, 400);
  if (!(await verifyWebhook(env, request, raw))) return res({ error: "invalid_signature" }, 401);   // nichts tun ohne gueltige Signatur
  const db = env.DB;
  const known = await db.prepare("SELECT processed FROM paypal_events WHERE id=?").bind(ev.id).first();
  if (known?.processed) return res({ ok: true, duplicate: true });
  if (!known) await db.prepare("INSERT OR IGNORE INTO paypal_events(id,type,resource_id,received) VALUES(?,?,?,?)").bind(ev.id.slice(0, 100), ev.event_type.slice(0, 80), String(ev.resource?.id || ev.resource?.invoice?.id || "").slice(0, 100), now()).run();
  let result = "ignored", bookingId = 0;
  if (HANDLED.has(ev.event_type)) {
    const b = await bookingFor(db, ev);
    const so = !b && ev.event_type.startsWith("INVOICING.") ? await sponsorOrderInvoiceEvent(env, ev) : null;   // Sponsoring-Pakete (/sponsor/)
    if (so) result = so;
    else if (!b) result = "no_booking";
    else {
      bookingId = b.id;
      const r = ev.resource || {};
      switch (ev.event_type) {
        case "CHECKOUT.ORDER.APPROVED":
          await db.prepare("UPDATE ad_bookings SET pay_status='approved',updated=? WHERE id=? AND pay_status='pending'").bind(now(), b.id).run();
          result = await captureOrder(env, { ...b, pay_status: b.pay_status === "pending" ? "approved" : b.pay_status });
          break;
        case "PAYMENT.CAPTURE.COMPLETED":
          result = await markPaid(env, b, { value: r.amount?.value, currency: r.amount?.currency_code, captureId: r.id || "", source: "paypal" });
          break;
        case "PAYMENT.CAPTURE.DENIED":
          await db.prepare("UPDATE ad_bookings SET pay_status='denied',updated=? WHERE id=? AND pay_status<>'paid'").bind(now(), b.id).run();
          result = "denied"; break;
        case "INVOICING.INVOICE.PAID": {
          const inv = r.invoice || r;
          const paid = inv.payments?.paid_amount || inv.amount || {};
          result = await markPaid(env, b, { value: paid.value, currency: paid.currency_code, source: "invoice" });
          break;
        }
        case "INVOICING.INVOICE.CANCELLED":
          await db.prepare("UPDATE ad_bookings SET pay_status='cancelled',status=CASE WHEN status IN ('draft','awaiting') THEN 'cancelled' ELSE status END,updated=? WHERE id=? AND pay_status<>'paid'").bind(now(), b.id).run();
          result = "cancelled"; break;
        default:   // PAYMENT.CAPTURE.REFUNDED, INVOICING.INVOICE.REFUNDED: Auslieferung anhalten, Admin entscheidet
          await db.prepare("UPDATE ad_bookings SET pay_status='refunded',status=CASE WHEN status IN ('active','awaiting') THEN 'paused' ELSE status END,updated=? WHERE id=?").bind(now(), b.id).run();
          await notifyAdmins(env, `Werbebuchung erstattet: ${b.code}`, `<p>PayPal meldet eine Erstattung für <b>${esc(b.code)}</b>. Die Kampagne ist pausiert.</p>`, `adrefund:${b.id}:${ev.id}`);
          result = "refunded";
      }
    }
  }
  await db.prepare("UPDATE paypal_events SET processed=1,result=?,booking_id=? WHERE id=?").bind(String(result).slice(0, 60), bookingId, ev.id.slice(0, 100)).run();
  return res({ ok: true, result });
}

// ---------------------------------------------------------------- Auslieferung, Zaehlung, Go-Link

export function isBot(request) {
  const ua = request.headers.get("user-agent") || "";
  const purpose = ["sec-purpose", "purpose", "x-purpose"].map((k) => request.headers.get(k) || "").join(" ").toLowerCase();
  const bm = request.cf?.botManagement, score = Number(bm?.score);
  return !ua || /\b(prefetch|prerender)\b/.test(purpose) || request.headers.get("x-moz")?.toLowerCase() === "prefetch" ||
    !!bm?.verifiedBot || (Number.isFinite(score) && score < 30) ||
    /(bot|crawl|spider|slurp|preview|facebookexternalhit|linkedinbot|slackbot|discordbot|whatsapp|telegrambot|curl|wget|python|headless|lighthouse|pingdom|monitor|http-client|axios|node-fetch|go-http)/i.test(ua);
}

// Land nur als Laendercode aus Cloudflare (cf.country bzw. cf-ipcountry), keine IP, kein Cookie
export function countryOf(request) {
  const c = String(request.cf?.country || request.headers.get("cf-ipcountry") || "").toUpperCase();
  return /^[A-Z]{2}$/.test(c) && c !== "T1" ? c : "XX";
}
async function countStat(db, bookingId, slot, pageType, field, country = "XX") {
  await db.prepare(`INSERT INTO ad_stats_daily(day,booking_id,slot,page_type,country,${field}) VALUES(?,?,?,?,?,1)
    ON CONFLICT(day,booking_id,slot,page_type,country) DO UPDATE SET ${field}=${field}+1`).bind(today(), bookingId, slot, pageType, country).run();
}

// ---------------------------------------------------------------- Hausanzeigen: Zaehlung und Go-Link (laeuft auch bei ADS_BOOKING aus)
export const HOUSE_SLOTS = ["top", "mid", "mid2", "bottom"];
const HOUSE_KEYS = new Set(["m365con", "services", "advertise", "sponsor"]);
const SITE_LANGS = new Set(["en", "de", "es", "fr", "it", "pt", "nl", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko"]);
export const M365CON_URL = "https://m365con.net/?utm_source=m365.fm&utm_medium=house_ad&utm_campaign=m365con2027";   // wie site_ads.CON_URL
export const HOUSE_CAMPAIGN = { m365con: "m365con2027", services: "m365fm_services", advertise: "m365fm_advertise", sponsor: "m365fm_sponsor" };
const SLUG = /^[a-z0-9][a-z0-9-]{0,79}$/;

async function countHouse(db, house, slot, pageType, lang, country, field) {
  await db.prepare(`INSERT INTO ad_house_stats(day,house,slot,page_type,lang,country,${field}) VALUES(?,?,?,?,?,?,1)
    ON CONFLICT(day,house,slot,page_type,lang,country) DO UPDATE SET ${field}=${field}+1`).bind(today(), house, slot, pageType, lang, country).run();
}

// Ziel einer Hausanzeige; nur feste Ziele bzw. Hausanzeigen aus dem Admin (kein offener Redirect).
// UTM (Mirko, 5.11.2026): source m365.fm, medium house_ad, campaign je Hausanzeige, term = Haupt-Entitaet der Seite, content = Slug der Seite.
// Der Platz steht nicht in der UTM, sondern in den eigenen Zaehlern (ad_house_stats). Keine personenbezogenen Daten.
export async function houseTarget(env, key, lang, { term = "", content = "" } = {}) {
  const pre = lang === "en" ? "" : `/${lang}`;
  let u;
  if (key === "m365con") u = new URL(M365CON_URL);
  else if (key === "services") u = new URL(`${env.SITE}${pre}/services/`);
  else if (key === "advertise") u = new URL(`${env.SITE}${pre}/for/advertisers/`);
  else if (key === "sponsor") u = new URL(`${env.SITE}${pre}/sponsor/`);
  else {
    const m = /^x(\d{1,9})$/.exec(key);
    const h = m ? await env.DB.prepare("SELECT url FROM ad_house WHERE id=? AND active=1").bind(+m[1]).first() : null;
    u = h ? httpsUrl(h.url) : null;
    if (!u) return null;
  }
  const set = (k, v) => { if (v && !u.searchParams.has(k)) u.searchParams.set(k, v); };
  set("utm_source", "m365.fm"); set("utm_medium", "house_ad"); set("utm_campaign", HOUSE_CAMPAIGN[key] || `house_${key}`);
  u.searchParams.delete("utm_content"); u.searchParams.delete("utm_term");
  if (TOPIC.test(term)) u.searchParams.set("utm_term", term);
  if (SLUG.test(content)) u.searchParams.set("utm_content", content);
  return u;
}

export async function handleHouseGo(env, request, url, code, ctx) {
  const headers = { "x-robots-tag": "noindex, nofollow", ...NS };
  const key = code.slice(2);
  if (!["GET", "HEAD"].includes(request.method) || !(HOUSE_KEYS.has(key) || /^x\d{1,9}$/.test(key))) return new Response(null, { status: 404, headers });
  const slot = HOUSE_SLOTS.includes(url.searchParams.get("s")) ? url.searchParams.get("s") : "mid";
  const pageType = PAGE_TYPES.includes(url.searchParams.get("pt")) ? url.searchParams.get("pt") : "other";
  const lang = SITE_LANGS.has(url.searchParams.get("l")) ? url.searchParams.get("l") : "en";
  const target = await houseTarget(env, key, lang, { term: String(url.searchParams.get("e") || ""), content: String(url.searchParams.get("p") || "") });
  if (!target) return new Response(null, { status: 404, headers });
  if (request.method === "GET" && !isBot(request)) {
    const work = (async () => {
      if (await dedupe(env, request, `${code}:${slot}`)) return;
      await countHouse(env.DB, key, slot, pageType, lang, countryOf(request), "clicks");
    })().catch(() => {});
    if (ctx?.waitUntil) ctx.waitUntil(work); else await work;
  }
  headers.location = target.href;
  return new Response(null, { status: 302, headers });
}
// Verbrauch einer bezahlten Einheit; bei Erreichen des Volumens endet die Kampagne
async function consume(db, id) {
  const r = await db.prepare("UPDATE ad_bookings SET delivered=delivered+1,status=CASE WHEN delivered+1>=quantity THEN 'ended' ELSE status END,updated=? WHERE id=? AND status='active' AND delivered<quantity").bind(now(), id).run();
  return !!r.meta.changes;
}

async function orgTopics(db, orgIds) {
  if (!orgIds.length) return new Map();
  const q = orgIds.map(() => "?").join(",");
  const rows = [
    ...(((await db.prepare(`SELECT org_id,eid FROM org_offers WHERE org_id IN (${q})`).bind(...orgIds).all()).results) || []),
    ...(((await db.prepare(`SELECT org_id,eid FROM org_entity WHERE org_id IN (${q})`).bind(...orgIds).all()).results) || []),
  ];
  const m = new Map();
  for (const r of rows) { if (!m.has(r.org_id)) m.set(r.org_id, new Set()); m.get(r.org_id).add(String(r.eid).toLowerCase()); }
  return m;
}

// Kampagnen fuer einen Platz waehlen: Seitentyp, Zeitraum, Restvolumen, Themen; exklusive Buchungen gehen vor; gewichtet nach Restvolumen
export async function pickCampaign(db, { slot, pageType, topics, day = today(), rnd = Math.random }) {
  const rows = (await db.prepare(`SELECT b.*,p.kind,p.slot FROM ad_bookings b JOIN ad_products p ON p.id=b.product
    WHERE b.status='active' AND p.slot=? AND p.active=1 AND (b.start IS NULL OR b.start<=?) AND (b.end IS NULL OR b.end>=?)
      AND b.delivered<b.quantity AND (','||b.page_types||',') LIKE ?`).bind(slot, day, day, `%,${pageType},%`).all()).results || [];
  if (!rows.length) return null;
  const page = new Set(topics);
  const ot = await orgTopics(db, [...new Set(rows.filter((r) => r.kind !== "cpm").map((r) => r.org_id))]);
  const fits = rows.filter((r) => {
    const own = r.topics ? r.topics.split(",") : [];
    if (r.kind === "cpm") return !own.length || own.some((t) => page.has(t));
    // Firmenkarte und Lead-Formular nur auf thematisch passenden Seiten (gebuchte Themen + Themen/Entitaet der Firma)
    const all = own.length ? own : [...(ot.get(r.org_id) || [])];
    return all.some((t) => page.has(t));
  });
  const pool = fits.some((r) => r.exclusive) ? fits.filter((r) => r.exclusive) : fits;
  if (!pool.length) return null;
  const weights = pool.map((r) => Math.max(1, r.quantity - r.delivered)), total = weights.reduce((a, b) => a + b, 0);
  let x = rnd() * total;
  for (let i = 0; i < pool.length; i++) { x -= weights[i]; if (x < 0) return pool[i]; }
  return pool[pool.length - 1];
}

async function serve(env, request, url, J) {
  const db = env.DB;
  const slot = url.searchParams.get("slot"), pageType = url.searchParams.get("pt") || "other", lang = /^[a-z]{2}$/.test(url.searchParams.get("lang") || "") ? url.searchParams.get("lang") : "en";
  const topics = list(url.searchParams.get("topics"), 20).filter((t) => TOPIC.test(t));
  if (!HOUSE_SLOTS.includes(slot) || !PAGE_TYPES.includes(pageType)) return J({ error: "bad_request" }, 400, NS);
  const bot = isBot(request), country = countryOf(request);
  const houseKey = HOUSE_KEYS.has(url.searchParams.get("house")) ? url.searchParams.get("house") : "";
  const paid = bookingOn(env) && SLOTS.includes(slot) && url.searchParams.get("house_only") !== "1";   // Schalter aus oder reiner Hausplatz: nur Hausanzeigen
  const b = paid ? await pickCampaign(db, { slot, pageType, topics }) : null;
  if (b) {
    if (!bot) {   // cookiefrei: kein Bezeichner, nur Tageszaehler
      await countStat(db, b.id, slot, pageType, "impressions", country);
      if (b.kind === "cpm") await consume(db, b.id);
    }
    const org = await db.prepare("SELECT id,handle,name,tagline FROM orgs WHERE id=?").bind(b.org_id).first() || {};
    const go = `${env.API}/go/${b.code}?s=${slot}&pt=${pageType}`;
    const ad = b.kind === "cpm"
      ? { type: "banner", code: b.code, href: go, img: b.banner_url, w: b.banner_w, h: b.banner_h, mimg: b.mobile_url || b.banner_url, mw: b.mobile_w || b.banner_w, mh: b.mobile_h || b.banner_h, alt: b.alt }
      : { type: b.kind === "cpc" ? "card" : "lead", code: b.code, href: b.kind === "cpc" ? go : "", org: org.name || "", tagline: b.tagline || org.tagline || "",
        logo: org.handle ? `${env.API}/api/img/o/${org.handle}.jpg` : "", turnstile: b.kind === "cpl" ? (env.TURNSTILE_SITE_KEY || "") : undefined };
    return J({ ad }, 200, NS);
  }
  const d = today();
  const houses = (await db.prepare("SELECT id,title,body,cta,url,langs FROM ad_house WHERE active=1 AND slot=? AND (start IS NULL OR start<=?) AND (end IS NULL OR end>=?) ORDER BY id DESC LIMIT 20").bind(slot === "mid2" ? "mid" : slot, d, d).all()).results || [];
  const h = houses.find((x) => !x.langs || x.langs.split(",").includes(lang));
  const counted = h ? `x${h.id}` : houseKey;   // Einblendung der angezeigten Hausanzeige (Admin-Hausanzeige oder die eingebaute der Seite)
  if (counted && !bot) await countHouse(db, counted, slot, pageType, SITE_LANGS.has(lang) ? lang : "en", country, "impressions");
  const ctxq = new URLSearchParams({ s: slot, pt: pageType, l: SITE_LANGS.has(lang) ? lang : "en" });
  if (topics[0]) ctxq.set("e", topics[0]);
  if (SLUG.test(url.searchParams.get("p") || "")) ctxq.set("p", url.searchParams.get("p"));
  return J({ ad: null, house: h ? { title: h.title, body: h.body, cta: h.cta, url: `${env.API}/go/h-x${h.id}?${ctxq}` } : null }, 200, NS);
}

async function dedupe(env, request, code) {
  const cache = globalThis.caches?.default;
  if (!cache || !env.SESSION_SECRET) return false;
  const day = today();
  const key = await sha256hex(`${env.SESSION_SECRET}:adgo:${day}:${request.headers.get("cf-connecting-ip") || ""}|${request.headers.get("user-agent") || ""}|${code}`);
  const req = new Request(`https://dedupe.m365.fm/ad/${key}`);
  if (await cache.match(req)) return true;
  await cache.put(req, new Response("1", { headers: { "cache-control": "public, max-age=86400" } }));
  return false;
}

// /go/<code>: Klick zaehlen (ohne Bots, je Besucher und Tag einmal), 302 zum Ziel. Firmenkarte -> Firmenprofil auf m365.fm.
export async function handleAdGo(env, request, url, code, ctx) {
  const headers = { "x-robots-tag": "noindex, nofollow", ...NS };
  if (!CODE.test(code) || !["GET", "HEAD"].includes(request.method)) return new Response(null, { status: 404, headers });
  const db = env.DB;
  const b = await db.prepare("SELECT b.*,p.kind,p.slot,o.handle FROM ad_bookings b JOIN ad_products p ON p.id=b.product LEFT JOIN orgs o ON o.id=b.org_id WHERE b.code=?").bind(code).first();
  if (!b || b.creative_status !== "approved" || b.kind === "cpl") return new Response(null, { status: 404, headers });
  let target;
  if (b.kind === "cpc") target = new URL(`${env.SITE}/community/c/${b.handle}/`);
  else {
    target = httpsUrl(b.target_url);
    if (!target) return new Response(null, { status: 404, headers });
    for (const [k, v] of [["utm_source", "m365.fm"], ["utm_medium", "display"], ["utm_campaign", b.code]]) if (!target.searchParams.has(k)) target.searchParams.set(k, v);
  }
  // Mirko 11.11.2026: Klicks nach dem Ende (status 'ended', Kontingent oder Laufzeit) zaehlen weiter fuers Sponsor-Dashboard, werden aber nicht
  // mehr berechnet (consume nur bei 'active'). Pausiert (auch nach Erstattung) und storniert zaehlen nicht.
  if (request.method === "GET" && (b.status === "active" || b.status === "ended") && !isBot(request)) {
    const slot = SLOTS.includes(url.searchParams.get("s")) ? url.searchParams.get("s") : b.slot;
    const pageType = PAGE_TYPES.includes(url.searchParams.get("pt")) ? url.searchParams.get("pt") : "other";
    const work = (async () => {
      if (await dedupe(env, request, code)) return;
      await countStat(db, b.id, slot, pageType, "clicks", countryOf(request));
      if (b.kind === "cpc" && b.status === "active") await consume(db, b.id);
    })().catch(() => {});
    if (ctx?.waitUntil) ctx.waitUntil(work); else await work;
  }
  headers.location = target.href;
  return new Response(null, { status: 302, headers });
}

// ---------------------------------------------------------------- Leads

const CONSENT = {
  de: (o) => `Ich willige ein, dass M365.FM meinen Namen, meine E-Mail-Adresse und meine Nachricht an ${o} weitergibt, damit ${o} mich zu dieser Anfrage kontaktiert.`,
  en: (o) => `I agree that M365.FM passes my name, e-mail address and message to ${o} so that ${o} can contact me about this request.`,
};

export async function verifyTurnstile(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return { ok: false, error: "captcha_unavailable" };   // ohne Schluessel keine Leads (fail closed)
  if (!token || String(token).length > 2048) return { ok: false, error: "captcha" };
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: String(token) });
  if (ip) body.set("remoteip", ip);
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body }).catch(() => null);
  const j = r ? await r.json().catch(() => ({})) : {};
  return j.success === true ? { ok: true } : { ok: false, error: "captcha" };
}

// Laufende Sponsoren (data/sponsorships.json, inkl. 182 Tage Karenzzeit nach "end" - die Frist rechnet der Seitenbau): sponsors.json des Seitenbaus {orgs:[{id,name,manager}]}; der Worker nimmt Leads fuer diese Firmen ohne Buchung an
export async function activeSponsor(env, id) {
  if (!/^[a-z0-9][a-z0-9-]{1,63}$/.test(String(id || ""))) return null;
  let j; try { j = await (await fetch(`${env.SITE}/sponsors.json`, { cf: { cacheTtl: 600 } })).json(); } catch { return null; }
  return (j?.orgs || []).find((o) => o.id === id) || null;
}

async function sponsorLeadInfo(env, url, J) {
  const sp = await activeSponsor(env, url.searchParams.get("e"));
  if (!sp) return J({ error: "not_found" }, 404, NS);
  return J({ ad: { type: "lead", code: `sponsor-${sp.id}`, sponsor: sp.id, org: sp.name, tagline: "", turnstile: env.TURNSTILE_SITE_KEY || "" } }, 200, NS);
}

async function submitLead(env, request, J) {
  const db = env.DB;
  const b = await request.json().catch(() => ({})) || {};
  if (b.consent !== true) return J({ error: "consent_required" }, 400, NS);
  const name = cleanText(b.name, 80).replace(/[<>]/g, ""), email = cleanText(b.email, 254).toLowerCase(), message = cleanText(b.message, 2000);
  const lang = /^[a-z]{2}$/.test(String(b.lang || "")) ? b.lang : "en";
  if (name.length < 2 || !EMAIL.test(email) || /\.(invalid|test|example|localhost)$/.test(email)) return J({ error: "bad_request" }, 400, NS);
  let sponsor = null, booking = null;
  if (b.sponsor) {   // Sponsor-Lead: Firma muss laufend gesponsert sein (sponsors.json), keine Buchung, nicht berechnet
    sponsor = await activeSponsor(env, b.sponsor);
    if (!sponsor) return J({ error: "not_found" }, 404, NS);
    const link = await db.prepare("SELECT org_id FROM org_entity WHERE eid=?").bind(sponsor.id).first();
    booking = { id: 0, org_id: link?.org_id || 0, org_name: sponsor.name, status: "active", delivered: 0, quantity: 1 };
  } else booking = await db.prepare("SELECT b.*,o.name org_name FROM ad_bookings b JOIN orgs o ON o.id=b.org_id WHERE b.code=? AND b.product='lead_form'").bind(String(b.code || "")).first();
  if (!booking || booking.status !== "active" || booking.delivered >= booking.quantity) return J({ error: "not_found" }, 404, NS);
  const ip = request.headers.get("cf-connecting-ip") || "";
  const ipHash = await sha256hex(`${env.SESSION_SECRET}:adlead:${ip}`);
  if (!(await rateLimit(db, `adlead:${ipHash}`, 5, 3600))) return J({ error: "rate_limit" }, 429, NS);
  const ts = await verifyTurnstile(env, b.turnstile, ip);
  if (!ts.ok) return J({ error: ts.error }, ts.error === "captcha_unavailable" ? 503 : 400, NS);
  const emailHash = await sha256hex(`${env.SESSION_SECRET}:leadmail:${email}`);
  // Doppelt = gleiche Adresse an dieselbe Firma in 30 Tagen: wird zugestellt, aber nicht berechnet (Gutschrift)
  const dup = sponsor
    ? await db.prepare("SELECT 1 x FROM ad_leads WHERE sponsor=? AND email_hash=? AND created>?").bind(sponsor.id, emailHash, now() - 30 * 86400).first()
    : await db.prepare("SELECT 1 x FROM ad_leads WHERE org_id=? AND email_hash=? AND created>?").bind(booking.org_id, emailHash, now() - 30 * 86400).first();
  const shown = cleanText(b.consent_text, 600);
  const consentText = shown && shown.includes(booking.org_name) ? shown : (CONSENT[lang] || CONSENT.en)(booking.org_name);
  const page = (() => { try { const u = new URL(String(b.page || "")); return u.origin === env.SITE ? u.href.slice(0, 500) : ""; } catch { return ""; } })();
  let charged = 0;
  if (!dup && !sponsor) charged = (await consume(db, booking.id)) ? 1 : 0;
  if (!dup && !charged && !sponsor) return J({ error: "not_found" }, 404, NS);   // Volumen in der Zwischenzeit aufgebraucht
  const r = await db.prepare(`INSERT INTO ad_leads(booking_id,org_id,name,email,message,consent_text,page,lang,email_hash,status,charged,created,sponsor,assigned)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(booking.id, booking.org_id, name, email, message, consentText, page, lang, emailHash, dup ? "duplicate" : "new", charged, now(), sponsor ? sponsor.id : "", sponsor?.manager || "").run();
  const id = r.meta.last_row_id;
  const pt = PAGE_TYPES.includes(b.pt) ? b.pt : "other";
  if (charged) await countStat(db, booking.id, "mid", pt, "leads", countryOf(request));
  // Sponsor-Lead: an den Betreuer (Community-Handle aus sponsors.json; Adresse nur serverseitig aus D1), sonst an die Admins; Buchungs-Lead: Inhaber/Admins der Firma
  let members = [];
  if (sponsor) {
    const mgr = sponsor.manager ? await db.prepare("SELECT user_id FROM profiles WHERE handle=?").bind(sponsor.manager).first() : null;
    members = mgr ? [{ user_id: mgr.user_id }] : [];
  } else members = (await db.prepare("SELECT user_id FROM org_members WHERE org_id=? AND status='active' AND role IN ('owner','admin')").bind(booking.org_id).all()).results || [];
  let mailed = 0;
  const html = `<p>Neuer Kontakt über M365.FM für <b>${esc(booking.org_name)}</b> / New lead:</p><p>Name: ${esc(name)}<br>E-Mail: <a href="mailto:${esc(email)}">${esc(email)}</a></p>${message ? `<blockquote style="border-left:3px solid #3E8BC0;margin:0;padding:.2em 1em">${esc(message).replace(/\n/g, "<br>")}</blockquote>` : ""}<p style="font-size:12px">Einwilligung / consent: ${esc(consentText)}</p>${dup ? "<p>Hinweis: dieselbe Adresse hat in den letzten 30 Tagen schon angefragt – nicht berechnet.</p>" : ""}<p><a href="${env.SITE}/for/advertisers/#book">Alle Leads im Dashboard</a></p>`;
  for (const m of members) if (await notify(env, m.user_id, "system", `M365.FM Lead: ${name}`, html, `adlead:${id}:${m.user_id}`)) mailed = 1;
  if (sponsor && !mailed) {   // kein Betreuer oder keine Zustellung: Admins benachrichtigen
    await notifyAdmins(env, `M365.FM Lead (Sponsor ${sponsor.name}): ${name}`, html.replace(`${env.SITE}/for/advertisers/#book">Alle Leads im Dashboard`, `${env.SITE}/admin/#ads">Admin: Werbung, Leads`), `adlead:${id}`);
    mailed = 1;
  }
  await db.prepare("UPDATE ad_leads SET mailed=? WHERE id=?").bind(mailed, id).run();
  return J({ ok: true }, 200, NS);
}

// Gutschrift: Lead nicht berechnen, Volumen zurueckgeben (beendete Kampagne laeuft im Zeitraum weiter)
async function creditLead(db, id) {
  const l = await db.prepare("SELECT * FROM ad_leads WHERE id=?").bind(id).first();
  if (!l) return false;
  await db.prepare("UPDATE ad_leads SET status='credited',charged=0 WHERE id=?").bind(id).run();
  if (l.charged) {
    await db.prepare("UPDATE ad_bookings SET delivered=MAX(0,delivered-1),status=CASE WHEN status='ended' AND (end IS NULL OR end>=?) THEN 'active' ELSE status END,updated=? WHERE id=?").bind(today(), now(), l.booking_id).run();
    await db.prepare("UPDATE ad_stats_daily SET leads=MAX(0,leads-1) WHERE booking_id=? AND day=? AND leads>0").bind(l.booking_id, new Date(l.created * 1000).toISOString().slice(0, 10)).run();
  }
  return true;
}

// ---------------------------------------------------------------- Banner-Upload (R2, img.m365.fm)

export function webpSize(bytes) {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const s = (o, n) => String.fromCharCode(...b.subarray(o, o + n));
  if (b.length < 30 || s(0, 4) !== "RIFF" || s(8, 4) !== "WEBP") return null;
  const chunk = s(12, 4);
  if (chunk === "VP8 ") return { w: (b[26] | (b[27] << 8)) & 0x3fff, h: (b[28] | (b[29] << 8)) & 0x3fff };
  if (chunk === "VP8L") return { w: 1 + (((b[22] & 0x3f) << 8) | b[21]), h: 1 + (((b[24] & 0x0f) << 10) | (b[23] << 2) | ((b[22] & 0xc0) >> 6)) };
  if (chunk === "VP8X") return { w: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)), h: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)) };
  return null;
}

async function uploadBanner(env, request, url, user, J) {
  const db = env.DB;
  const id = int(url.searchParams.get("id")), variant = url.searchParams.get("variant") === "mobile" ? "mobile" : "desktop";
  const b = await db.prepare("SELECT b.*,p.width,p.height,p.mobile_width,p.mobile_height,p.kind FROM ad_bookings b JOIN ad_products p ON p.id=b.product WHERE b.id=?").bind(id).first();
  if (!b) return J({ error: "not_found" }, 404, NS);
  if (!user.admin && !canManage(await orgRole(db, b.org_id, user.id))) return J({ error: "not_found" }, 404, NS);
  if (b.kind !== "cpm" || ["active", "ended", "cancelled"].includes(b.status)) return J({ error: "bad_state" }, 409, NS);
  if (!env.PAGES) return J({ error: "storage_unavailable" }, 503, NS);
  const bytes = new Uint8Array(await request.arrayBuffer());
  if (!bytes.length || bytes.length > 300_000) return J({ error: "bad_size" }, 400, NS);
  const dim = webpSize(bytes);
  const want = variant === "mobile" ? [b.mobile_width, b.mobile_height] : [b.width, b.height];
  if (!dim) return J({ error: "bad_format" }, 400, NS);
  if (dim.w !== want[0] || dim.h !== want[1]) return J({ error: "bad_dimensions", want }, 400, NS);
  const hash = (await sha256hex(String.fromCharCode(...bytes.subarray(0, 4096)) + bytes.length + now())).slice(0, 10);
  const key = `sponsor/ads/${b.org_id}/${b.code}-${variant}-${hash}.webp`;
  await env.PAGES.put(key, bytes, { httpMetadata: { contentType: "image/webp", cacheControl: "public, max-age=31536000, immutable" } });
  const src = `${env.IMG_BASE || "https://img.m365.fm"}/${key}`;
  const cols = variant === "mobile" ? "mobile_url=?,mobile_w=?,mobile_h=?" : "banner_url=?,banner_w=?,banner_h=?";
  // Neues Werbemittel = neue Freigabe noetig
  await db.prepare(`UPDATE ad_bookings SET ${cols},creative_status='pending',reject_reason='',updated=? WHERE id=?`).bind(src, dim.w, dim.h, now(), b.id).run();
  if (b.status === "awaiting") await notifyAdmins(env, `Werbemittel wartet auf Freigabe: ${b.code}`, `<p>Neues Banner für <b>${esc(b.code)}</b>.</p><p><a href="${env.SITE}/admin/#ads">Admin: Werbung</a></p>`, `adcreative:${b.id}:${hash}`);
  return J({ ok: true, url: src, w: dim.w, h: dim.h }, 200, NS);
}

// ---------------------------------------------------------------- Buchen und bezahlen

export function cleanBilling(v) {
  const b = v && typeof v === "object" ? v : {};
  const out = {
    company: cleanText(b.company, 200), address: cleanText(b.address, 200), postal_code: cleanText(b.postal_code, 20), city: cleanText(b.city, 100),
    country: String(b.country || "").trim().toUpperCase(), vat_id: String(b.vat_id || "").replace(/\s+/g, "").toUpperCase().slice(0, 20), email: cleanText(b.email, 254).toLowerCase(),
    contact: cleanText(b.contact, 120).replace(/[<>]/g, ""),
  };
  if (out.company.length < 2 || out.address.length < 3 || out.postal_code.length < 2 || out.city.length < 2 || !/^[A-Z]{2}$/.test(out.country) ||
      (out.vat_id && !/^[A-Z0-9.-]{4,20}$/.test(out.vat_id)) || !EMAIL.test(out.email)) return null;
  return out;
}

async function createBooking(env, request, user, J) {
  const db = env.DB;
  const body = await request.json().catch(() => ({})) || {};
  const orgId = int(body.org_id);
  if (!Number.isSafeInteger(orgId) || !(user.admin || canManage(await orgRole(db, orgId, user.id)))) return J({ error: "forbidden" }, 403, NS);
  const org = await db.prepare("SELECT id,handle,name FROM orgs WHERE id=?").bind(orgId).first();
  if (!org) return J({ error: "not_found" }, 404, NS);
  if (!(await rateLimit(db, `adbook:${user.id}`, 20, 86400))) return J({ error: "rate_limit" }, 429, NS);
  const billing = cleanBilling(body.billing);
  if (!billing) return J({ error: "bad_billing" }, 400, NS);
  const pricing = await loadPricing(db);
  const acct = await db.prepare("SELECT plan,included_leads FROM ad_accounts WHERE org_id=?").bind(orgId).first();
  const q = quote(pricing, { ...body, plan: acct?.plan || "free", included: acct?.included_leads || 0, billing });
  if (q.error) return J({ error: q.error, min: q.min }, 400, NS);
  const target = q.kind === "cpm" ? httpsUrl(body.target_url) : null;
  const alt = cleanText(body.alt, 140), tagline = cleanText(body.tagline, 160).replace(/https?:\/\/\S+/g, "");
  if (q.kind === "cpm" && (!target || alt.length < 3)) return J({ error: "bad_creative" }, 400, NS);
  if (q.kind !== "cpm" && tagline.length < 10) return J({ error: "bad_creative" }, 400, NS);
  const start = body.start ? String(body.start) : null;
  if (start && (!isDay(start) || start < today())) return J({ error: "bad_start" }, 400, NS);
  const payMethod = body.pay_method === "invoice" ? "invoice" : "paypal";
  const lang = /^[a-z]{2}$/.test(String(body.lang || "")) ? body.lang : "en";
  if (q.exclusive) {   // exklusiv: keine zweite exklusive Buchung desselben Platzes auf einem gleichen Seitentyp im Zeitraum
    const others = (await db.prepare("SELECT page_types,start,end,months FROM ad_bookings WHERE product=? AND exclusive=1 AND status IN ('awaiting','active','paused')").bind(q.product).all()).results || [];
    const s = start || today(), e = addMonths(s, q.months);
    const clash = others.some((o) => o.page_types.split(",").some((t) => q.page_types.includes(t)) && (o.start || today()) <= e && (o.end || addMonths(o.start || today(), o.months)) >= s);
    if (clash) return J({ error: "exclusive_taken" }, 409, NS);
  }
  const price = { ...q, invoice_due_days: num(pricing.settings, "invoice_due_days", 14), intro: num(pricing.settings, "intro_prices", 1) === 1 };
  let code = randomCode();
  for (let i = 0; i < 3 && await db.prepare("SELECT 1 x FROM ad_bookings WHERE code=?").bind(code).first(); i++) code = randomCode();
  const t = now();
  const r = await db.prepare(`INSERT INTO ad_bookings(code,org_id,user_id,product,page_types,topics,exclusive,months,quantity,start,target_url,alt,tagline,
      price_json,net_cents,tax_cents,total_cents,billing_json,pay_method,lang,status,created,updated) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'draft',?,?)`)
    .bind(code, orgId, user.id, q.product, q.page_types.join(","), q.topics.join(","), q.exclusive ? 1 : 0, q.months, q.quantity, start,
      target ? target.href : "", alt, tagline, JSON.stringify(price), q.net_cents, q.tax_cents, q.total_cents, JSON.stringify(billing), payMethod, lang, t, t).run();
  const b = await db.prepare("SELECT * FROM ad_bookings WHERE id=?").bind(r.meta.last_row_id).first();
  await audit(db, user.id, "ad-booking", code, `${q.product} ${q.quantity} ${eur(q.total_cents)} EUR`).catch(() => 0);
  return J({ ok: true, booking: publicBooking(b) }, 200, NS);
}

async function payBooking(env, request, user, J) {
  const db = env.DB;
  const body = await request.json().catch(() => ({})) || {};
  const b = await db.prepare("SELECT b.*,p.kind FROM ad_bookings b JOIN ad_products p ON p.id=b.product WHERE b.id=?").bind(int(body.id)).first();
  if (!b || !(user.admin || canManage(await orgRole(db, b.org_id, user.id)))) return J({ error: "not_found" }, 404, NS);
  if (!["draft", "awaiting"].includes(b.status) || !["pending", "approved"].includes(b.pay_status)) return J({ error: "bad_state" }, 409, NS);
  if (b.kind === "cpm" && (!b.banner_url || (b.product !== "banner_mid" && !b.mobile_url))) return J({ error: "creative_missing" }, 400, NS);
  const firstSubmit = b.status === "draft";
  let out;
  try {
    if (b.pay_method === "invoice") {
      if (!b.paypal_invoice_id) {
        const inv = await createPaypalInvoice(env, b);
        await db.prepare("UPDATE ad_bookings SET paypal_invoice_id=?,invoice_url=?,status='awaiting',updated=? WHERE id=?").bind(inv.id, inv.url, now(), b.id).run();
        out = { invoice_url: inv.url };
      } else out = { invoice_url: b.invoice_url };
    } else {
      const order = await createPaypalOrder(env, b);
      await db.prepare("UPDATE ad_bookings SET paypal_order_id=?,status='awaiting',updated=? WHERE id=?").bind(order.id, now(), b.id).run();
      out = { approve_url: order.approve };
    }
  } catch (e) {
    console.error("paypal", String(e?.message || e).slice(0, 80));
    return J({ error: "payment_unavailable" }, 502, NS);
  }
  if (firstSubmit) {
    const org = await db.prepare("SELECT name FROM orgs WHERE id=?").bind(b.org_id).first();
    await notifyAdmins(env, `Neue Werbebuchung: ${org?.name || b.org_id} (${b.code})`,
      `<p>Neue Buchung <b>${esc(b.code)}</b> von <b>${esc(org?.name || "")}</b>: ${esc(PRODUCT_LABEL[b.product]?.[0] || b.product)}, ${b.quantity} Einheiten, ${eur(b.total_cents)} EUR (${esc(b.pay_method)}).</p><p>Das Werbemittel wartet auf deine Freigabe.</p><p><a href="${env.SITE}/admin/#ads">Admin: Werbung</a></p>`, `adnew:${b.id}`);
  }
  return J({ ok: true, ...out }, 200, NS);
}

async function paypalReturn(env, url) {
  const db = env.DB, code = url.searchParams.get("code") || "";
  const b = CODE.test(code) ? await db.prepare("SELECT * FROM ad_bookings WHERE code=?").bind(code).first() : null;
  const back = (state) => new Response(null, { status: 302, headers: { location: `${env.SITE}/${b && b.lang !== "en" ? b.lang + "/" : ""}for/advertisers/?booking=${encodeURIComponent(code)}&pay=${state}#book`, ...NS } });
  if (!b) return back("error");
  if (url.searchParams.get("cancel")) return back("cancelled");
  const token = url.searchParams.get("token") || "";
  if (!b.paypal_order_id || (token && token !== b.paypal_order_id)) return back("error");
  if (b.pay_status === "paid") return back("paid");
  const r = await captureOrder(env, b).catch(() => "error");
  return back(r === "paid" || r === "already_paid" ? "paid" : r === "denied" ? "denied" : "pending");
}

// ---------------------------------------------------------------- Statistik

export async function adStatsForOrg(db, orgId, from, to) {
  const rows = (await db.prepare(`SELECT b.id,b.code,b.product,b.status,b.pay_status,b.creative_status,b.start,b.end,b.quantity,b.delivered,
      COALESCE(SUM(s.impressions),0) impressions,COALESCE(SUM(s.clicks),0) clicks,COALESCE(SUM(s.leads),0) leads
    FROM ad_bookings b LEFT JOIN ad_stats_daily s ON s.booking_id=b.id AND s.day>=? AND s.day<=?
    WHERE b.org_id=? AND b.status<>'draft' GROUP BY b.id ORDER BY b.created DESC`).bind(from, to, orgId).all()).results || [];
  return rows.map((r) => ({ ...r, ctr: r.impressions ? Math.round(r.clicks / r.impressions * 10000) / 100 : null }));
}

async function adminStats(db, from, to) {
  const rows = (await db.prepare(`SELECT s.day,b.code,o.name org,b.product,s.slot,s.page_type,s.country,s.impressions,s.clicks,s.leads
    FROM ad_stats_daily s JOIN ad_bookings b ON b.id=s.booking_id LEFT JOIN orgs o ON o.id=b.org_id
    WHERE s.day>=? AND s.day<=? ORDER BY s.day,b.code,s.slot,s.page_type,s.country`).bind(from, to).all()).results || [];
  const revenue = await db.prepare(`SELECT COALESCE(SUM(net_cents),0) net,COALESCE(SUM(total_cents),0) total,COUNT(*) n FROM ad_bookings
    WHERE pay_status='paid' AND paid_at>=? AND paid_at<?`).bind(Date.parse(`${from}T00:00:00Z`) / 1000, Date.parse(`${to}T00:00:00Z`) / 1000 + 86400).first();
  const tot = rows.reduce((a, r) => ({ impressions: a.impressions + r.impressions, clicks: a.clicks + r.clicks, leads: a.leads + r.leads }), { impressions: 0, clicks: 0, leads: 0 });
  return { rows, totals: { ...tot, ctr: tot.impressions ? Math.round(tot.clicks / tot.impressions * 10000) / 100 : null, revenue_net_cents: revenue.net, revenue_total_cents: revenue.total, paid_bookings: revenue.n } };
}

const csvCell = (v) => { const s = String(v ?? ""); return `"${(/^[=+\-@\t\r]/.test(s) ? "'" + s : s).replace(/"/g, '""')}"`; };

function period(url) {
  const to = url.searchParams.get("to") || today(), from = url.searchParams.get("from") || new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10);
  return isDay(from) && isDay(to) && from <= to ? { from, to } : null;
}

// ---------------------------------------------------------------- Router

export async function handleAds(env, request, url, path, user, J, ctx) {
  if (!path.startsWith("/api/ads/") && !path.startsWith("/api/admin/ads/")) return null;
  const db = env.DB, method = request.method;
  const E = (e, extra = {}) => J({ error: e, ...extra }, ERRMAP[e] || 400, NS);

  // öffentlich
  if (path === "/api/ads/pricing" && method === "GET") {
    const p = await loadPricing(db);
    return J({ products: p.products.filter((x) => x.active), prices: p.prices.filter((x) => x.active), settings: p.settings, labels: PRODUCT_LABEL }, 200, { "cache-control": "public, max-age=300" });
  }
  if (path === "/api/ads/quote" && method === "POST") {
    const body = await request.json().catch(() => ({})) || {};
    const q = quote(await loadPricing(db), { ...body, plan: "free", billing: {} });
    return q.error ? E(q.error, { min: q.min }) : J({ quote: q }, 200, NS);
  }
  if (path === "/api/ads/serve" && method === "GET") return serve(env, request, url, J);
  if (path === "/api/ads/sponsor-lead" && method === "GET") return sponsorLeadInfo(env, url, J);
  if (path === "/api/ads/lead" && method === "POST" && (await request.clone().json().catch(() => ({})))?.sponsor) return submitLead(env, request, J);   // Sponsor-Lead: kostenlos, ohne Buchung, unabhaengig vom Buchungsschalter
  if (OFF_ROUTES.has(path) && !bookingOn(env)) return J({ error: "not_available_yet", message: "Ad booking is not available yet. Please use the request form on https://www.m365.fm/sponsor/." }, 503, NS);
  if (path === "/api/ads/lead" && method === "POST") return submitLead(env, request, J);
  if (path === "/api/ads/paypal-return" && method === "GET") return paypalReturn(env, url);

  if (!user) return E("login");

  // Firmen (Inhaber/Admins der Firma)
  if (path === "/api/ads/mine" && method === "GET") {
    const orgs = (await db.prepare(`SELECT o.id,o.handle,o.name,m.role,COALESCE(a.plan,'free') plan,COALESCE(a.included_leads,0) included_leads
      FROM org_members m JOIN orgs o ON o.id=m.org_id LEFT JOIN ad_accounts a ON a.org_id=o.id
      WHERE m.user_id=? AND m.status='active' AND m.role IN ('owner','admin') ORDER BY o.name`).bind(user.id).all()).results || [];
    const bookings = orgs.length ? ((await db.prepare(`SELECT * FROM ad_bookings WHERE org_id IN (${orgs.map(() => "?").join(",")}) ORDER BY created DESC LIMIT 100`).bind(...orgs.map((o) => o.id)).all()).results || []) : [];
    const p = period(url) || { from: "2000-01-01", to: today() };
    const stats = new Map();
    for (const o of orgs) for (const s of await adStatsForOrg(db, o.id, p.from, p.to)) stats.set(s.id, s);
    return J({ orgs, bookings: bookings.map((b) => ({ ...publicBooking(b), stats: stats.get(b.id) || null })) }, 200, NS);
  }
  if (path === "/api/ads/bookings" && method === "POST") return createBooking(env, request, user, J);
  if (path === "/api/ads/banner" && method === "POST") return uploadBanner(env, request, url, user, J);
  if (path === "/api/ads/pay" && method === "POST") return payBooking(env, request, user, J);
  if (path === "/api/ads/leads" && method === "GET") {
    const org = await db.prepare("SELECT id FROM orgs WHERE handle=?").bind(url.searchParams.get("org") || "").first();
    if (!org || !(user.admin || canManage(await orgRole(db, org.id, user.id)))) return E("not_found");
    const leads = (await db.prepare(`SELECT l.id,b.code,l.name,l.email,l.message,l.page,l.lang,l.status,l.charged,l.dispute_reason,l.created
      FROM ad_leads l JOIN ad_bookings b ON b.id=l.booking_id WHERE l.org_id=? ORDER BY l.created DESC LIMIT 500`).bind(org.id).all()).results || [];
    return J({ leads }, 200, NS);
  }
  if (path === "/api/ads/leads/dispute" && method === "POST") {
    const body = await request.json().catch(() => ({})) || {};
    const l = await db.prepare("SELECT id,org_id,status FROM ad_leads WHERE id=?").bind(int(body.id)).first();
    if (!l || !(user.admin || canManage(await orgRole(db, l.org_id, user.id)))) return E("not_found");
    const reason = cleanText(body.reason, 300);
    if (l.status !== "new" || reason.length < 5) return E("bad_request");
    await db.prepare("UPDATE ad_leads SET status='disputed',dispute_reason=? WHERE id=?").bind(reason, l.id).run();
    await notifyAdmins(env, `Lead beanstandet (#${l.id})`, `<p>Grund: ${esc(reason)}</p><p><a href="${env.SITE}/admin/#ads">Admin: Werbung</a></p>`, `addispute:${l.id}`);
    return J({ ok: true }, 200, NS);
  }

  // Admin (nur Rolle admin)
  if (!path.startsWith("/api/admin/ads/")) return E("not_found");
  if (!user.admin) return E("forbidden");
  if (path === "/api/admin/ads/bookings" && method === "GET") {
    const st = url.searchParams.get("status") || "";
    const rows = (await db.prepare(`SELECT b.*,o.name org_name,o.handle org_handle,
        (SELECT COALESCE(SUM(impressions),0) FROM ad_stats_daily s WHERE s.booking_id=b.id) impressions,
        (SELECT COALESCE(SUM(clicks),0) FROM ad_stats_daily s WHERE s.booking_id=b.id) clicks,
        (SELECT COUNT(*) FROM ad_leads l WHERE l.booking_id=b.id) leads
      FROM ad_bookings b LEFT JOIN orgs o ON o.id=b.org_id WHERE (?='' OR b.status=? OR (?='review' AND b.creative_status='pending' AND b.status='awaiting'))
      ORDER BY b.created DESC LIMIT 300`).bind(st, st, st).all()).results || [];
    return J({ bookings: rows.map((b) => ({ ...publicBooking(b), org_name: b.org_name, org_handle: b.org_handle, impressions: b.impressions, clicks: b.clicks, leads: b.leads,
      paypal_order_id: b.paypal_order_id, paypal_invoice_id: b.paypal_invoice_id, paypal_capture_id: b.paypal_capture_id })), paypal_env: paypalConfig(env).live ? "live" : "sandbox" }, 200, NS);
  }
  if (path === "/api/admin/ads/review" && method === "POST") {
    const body = await request.json().catch(() => ({})) || {};
    const b = await db.prepare("SELECT * FROM ad_bookings WHERE id=?").bind(int(body.id)).first();
    if (!b) return E("not_found");
    if (!["approve", "reject"].includes(body.decision) || ["cancelled", "ended"].includes(b.status)) return E("bad_request");
    const reason = cleanText(body.reason, 300);
    if (body.decision === "reject" && reason.length < 3) return E("reason_required");
    await db.prepare("UPDATE ad_bookings SET creative_status=?,reject_reason=?,approved_at=?,updated=? WHERE id=?")
      .bind(body.decision === "approve" ? "approved" : "rejected", body.decision === "approve" ? "" : reason, body.decision === "approve" ? now() : 0, now(), b.id).run();
    await audit(db, user.id, "ad-review", b.code, body.decision + (reason ? `: ${reason}` : "")).catch(() => 0);
    if (body.decision === "reject") await notify(env, b.user_id, "system", `M365.FM: Werbemittel ${b.code} bitte anpassen / please update your creative`, `<p>${esc(reason)}</p><p><a href="${env.SITE}/for/advertisers/#book">Buchung öffnen / open booking</a></p>`, `adreject:${b.id}:${now()}`);
    const activated = await maybeActivate(env, b.id);
    return J({ ok: true, activated }, 200, NS);
  }
  if (path === "/api/admin/ads/status" && method === "POST") {
    const body = await request.json().catch(() => ({})) || {};
    const b = await db.prepare("SELECT * FROM ad_bookings WHERE id=?").bind(int(body.id)).first();
    if (!b) return E("not_found");
    const to = body.status;
    const ok = (to === "paused" && b.status === "active") || (to === "cancelled" && b.status !== "ended") ||
      (to === "active" && b.status === "paused" && b.pay_status === "paid" && b.creative_status === "approved");
    if (!ok) return E("bad_state");
    await db.prepare("UPDATE ad_bookings SET status=?,updated=? WHERE id=?").bind(to, now(), b.id).run();
    await audit(db, user.id, "ad-status", b.code, to).catch(() => 0);
    return J({ ok: true }, 200, NS);
  }
  if (path === "/api/admin/ads/mark-paid" && method === "POST") {   // z. B. Ueberweisung ausserhalb von PayPal
    const body = await request.json().catch(() => ({})) || {};
    const b = await db.prepare("SELECT * FROM ad_bookings WHERE id=?").bind(int(body.id)).first();
    if (!b || !["pending", "approved"].includes(b.pay_status) || !["awaiting", "draft"].includes(b.status)) return E("bad_state");
    if (b.status === "draft") await db.prepare("UPDATE ad_bookings SET status='awaiting' WHERE id=?").bind(b.id).run();
    const r = await markPaid(env, { ...b, status: "awaiting" }, { value: eur(b.total_cents), currency: "EUR", source: "manual" });
    await audit(db, user.id, "ad-mark-paid", b.code, r).catch(() => 0);
    return J({ ok: true, result: r }, 200, NS);
  }
  if (path === "/api/admin/ads/pricing" && method === "GET") {
    const p = await loadPricing(db);
    const accounts = (await db.prepare("SELECT a.org_id,o.name,o.handle,a.plan,a.included_leads FROM ad_accounts a JOIN orgs o ON o.id=a.org_id ORDER BY o.name").all()).results || [];
    return J({ ...p, accounts, page_types: PAGE_TYPES, setting_keys: Object.keys(SETTING_KEYS) }, 200, NS);
  }
  if (path === "/api/admin/ads/pricing" && method === "POST") {
    const body = await request.json().catch(() => ({})) || {};
    const writes = [];
    for (const p of Array.isArray(body.prices) ? body.prices.slice(0, 50) : []) {
      const cents = int(p.price_cents);
      if (!(await db.prepare("SELECT 1 x FROM ad_products WHERE id=?").bind(String(p.product)).first()) || !PAGE_TYPES.includes(p.page_type) || !(cents >= 0 && cents <= 10_000_000)) return E("bad_price");
      writes.push(db.prepare(`INSERT INTO ad_prices(product,page_type,price_cents,active,updated) VALUES(?,?,?,?,?)
        ON CONFLICT(product,page_type) DO UPDATE SET price_cents=excluded.price_cents,active=excluded.active,updated=excluded.updated`).bind(p.product, p.page_type, cents, p.active ? 1 : 0, now()));
    }
    for (const [k, v] of Object.entries(body.settings && typeof body.settings === "object" ? body.settings : {})) {
      const range = SETTING_KEYS[k], n = Number(v);
      if (!range || !Number.isFinite(n) || n < range[0] || n > range[1]) return E("bad_setting", { key: k });
      writes.push(db.prepare("INSERT INTO ad_settings(k,v,updated) VALUES(?,?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v,updated=excluded.updated").bind(k, String(n), now()));
    }
    for (const p of Array.isArray(body.products) ? body.products.slice(0, 10) : []) {
      writes.push(db.prepare("UPDATE ad_products SET active=?,updated=? WHERE id=?").bind(p.active ? 1 : 0, now(), String(p.id)));
    }
    if (writes.length) await db.batch(writes);
    await audit(db, user.id, "ad-pricing", "", `${writes.length} Änderungen`).catch(() => 0);
    return J({ ok: true, changed: writes.length }, 200, NS);
  }
  if (path === "/api/admin/ads/account" && method === "POST") {
    const body = await request.json().catch(() => ({})) || {};
    const orgId = int(body.org_id), inc = int(body.included_leads ?? 0);
    if (!(await db.prepare("SELECT 1 x FROM orgs WHERE id=?").bind(orgId).first()) || !PLANS.includes(body.plan) || !(inc >= 0 && inc <= 1000)) return E("bad_request");
    await db.prepare("INSERT INTO ad_accounts(org_id,plan,included_leads,updated) VALUES(?,?,?,?) ON CONFLICT(org_id) DO UPDATE SET plan=excluded.plan,included_leads=excluded.included_leads,updated=excluded.updated").bind(orgId, body.plan, inc, now()).run();
    return J({ ok: true }, 200, NS);
  }
  if (path === "/api/admin/ads/house" && method === "GET") {
    return J({ house: (await db.prepare("SELECT * FROM ad_house ORDER BY id DESC").all()).results || [] }, 200, NS);
  }
  if (path === "/api/admin/ads/house" && method === "POST") {
    const body = await request.json().catch(() => ({})) || {};
    if (body.delete) { await db.prepare("DELETE FROM ad_house WHERE id=?").bind(int(body.delete)).run(); return J({ ok: true }, 200, NS); }
    const target = httpsUrl(body.url), title = cleanText(body.title, 120), langs = list(body.langs, 15).filter((l) => /^[a-z]{2}$/.test(l)).join(",");
    if (!SLOTS.includes(body.slot) || !target || title.length < 3 || (body.start && !isDay(body.start)) || (body.end && !isDay(body.end))) return E("bad_request");
    const vals = [body.slot, title, cleanText(body.body, 200), cleanText(body.cta, 40), target.href, langs, body.start || null, body.end || null, body.active === false ? 0 : 1];
    if (body.id) await db.prepare("UPDATE ad_house SET slot=?,title=?,body=?,cta=?,url=?,langs=?,start=?,end=?,active=? WHERE id=?").bind(...vals, int(body.id)).run();
    else await db.prepare("INSERT INTO ad_house(slot,title,body,cta,url,langs,start,end,active,created) VALUES(?,?,?,?,?,?,?,?,?,?)").bind(...vals, now()).run();
    return J({ ok: true }, 200, NS);
  }
  if (path === "/api/admin/ads/stats" && method === "GET") {
    const p = period(url);
    if (!p) return E("bad_period");
    const s = await adminStats(db, p.from, p.to);
    if (url.searchParams.get("format") === "csv") {
      const head = ["day", "campaign", "company", "product", "slot", "page_type", "country", "impressions", "clicks", "ctr_pct", "leads"];
      const lines = [head, ...s.rows.map((r) => [r.day, r.code, r.org, r.product, r.slot, r.page_type, r.country, r.impressions, r.clicks, r.impressions ? (r.clicks / r.impressions * 100).toFixed(2) : "", r.leads])];
      return new Response("﻿" + lines.map((l) => l.map(csvCell).join(",")).join("\r\n"), { status: 200, headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="m365fm-ads-${p.from}-${p.to}.csv"`, ...NS, ...cors(env, request) } });
    }
    return J({ ...s, period: p }, 200, NS);
  }
  if (path === "/api/admin/ads/house-stats" && method === "GET") {   // Hausanzeigen: Einblendungen, Klicks, CTR je Platz, Seitentyp, Sprache, Land
    const days = Number(url.searchParams.get("days"));
    const p = [7, 30, 90].includes(days) ? { from: new Date(Date.now() - (days - 1) * 86400000).toISOString().slice(0, 10), to: today() } : period(url);
    if (!p) return E("bad_period");
    const house = String(url.searchParams.get("house") || "");
    const rows = (await db.prepare(`SELECT house,slot,page_type,lang,country,SUM(impressions) impressions,SUM(clicks) clicks FROM ad_house_stats
      WHERE day>=? AND day<=? AND (?='' OR house=?) GROUP BY house,slot,page_type,lang,country ORDER BY house,impressions DESC`).bind(p.from, p.to, house, house).all()).results || [];
    const ctr = (c, i) => (i ? Math.round(c / i * 10000) / 100 : null);
    const agg = (keyFn) => {
      const m = new Map();
      for (const r of rows) { const k = keyFn(r); const x = m.get(k) || { impressions: 0, clicks: 0 }; x.impressions += r.impressions; x.clicks += r.clicks; m.set(k, x); }
      return [...m].map(([k, x]) => ({ key: k, ...x, ctr: ctr(x.clicks, x.impressions) })).sort((a, b) => b.impressions - a.impressions);
    };
    if (url.searchParams.get("format") === "csv") {
      const head = ["house", "slot", "page_type", "lang", "country", "impressions", "clicks", "ctr_pct"];
      const lines = [head, ...rows.map((r) => [r.house, r.slot, r.page_type, r.lang, r.country, r.impressions, r.clicks, r.impressions ? (r.clicks / r.impressions * 100).toFixed(2) : ""])];
      return new Response("\ufeff" + lines.map((l) => l.map(csvCell).join(",")).join("\r\n"), { status: 200, headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="m365fm-hausanzeigen-${p.from}-${p.to}.csv"`, ...NS, ...cors(env, request) } });
    }
    return J({ period: p, rows: rows.map((r) => ({ ...r, ctr: ctr(r.clicks, r.impressions) })), by_house: agg((r) => r.house),
      by_slot: agg((r) => `${r.house} · ${r.slot}`), by_country: agg((r) => `${r.house} · ${r.country}`), by_lang: agg((r) => `${r.house} · ${r.lang}`) }, 200, NS);
  }
  if (path === "/api/admin/ads/leads" && method === "GET") {
    const leads = (await db.prepare(`SELECT l.id,COALESCE(b.code,'sponsor:'||l.sponsor) code,COALESCE(o.name,l.sponsor) org,l.sponsor,l.assigned,l.name,l.email,l.message,l.page,l.lang,l.status,l.lead_status,l.lead_status_updated,l.charged,l.dispute_reason,l.mailed,l.created
      FROM ad_leads l LEFT JOIN ad_bookings b ON b.id=l.booking_id LEFT JOIN orgs o ON o.id=l.org_id ORDER BY (l.status='disputed') DESC,l.created DESC LIMIT 500`).all()).results || [];
    return J({ leads }, 200, NS);
  }
  if (path === "/api/admin/ads/lead-status" && method === "POST") {   // Nachverfolgung (open/in_progress/closed_*) oder endgueltig loeschen (DSGVO); x-requested-with-Check in index.js
    const body = await request.json().catch(() => ({})) || {};
    const id = Number(body.id);
    if (!Number.isSafeInteger(id) || id < 1) return E("bad_request");
    if (body.action === "status") {
      if (!LEAD_STATUS.includes(body.status)) return E("bad_status");
      const r = await db.prepare("UPDATE ad_leads SET lead_status=?,lead_status_updated=? WHERE id=?").bind(body.status, now(), id).run();
      return r.meta.changes ? J({ ok: true, status: body.status }, 200, NS) : E("not_found");
    }
    if (body.action === "delete") {
      // Zuerst die Benachrichtigungs-Mails zum Lead (Name, E-Mail, Nachricht) loeschen, sonst bleiben die Daten im Postausgang;
      // scheitert danach das Loeschen des Leads, kann der Admin es einfach wiederholen
      await db.prepare("DELETE FROM mail_outbox WHERE key LIKE ?").bind(`adlead:${id}:%`).run();
      const r = await db.prepare("DELETE FROM ad_leads WHERE id=?").bind(id).run();
      if (!r.meta.changes) return E("not_found");
      await audit(db, user.id, "ad-lead", String(id), "deleted").catch(() => 0);
      return J({ ok: true }, 200, NS);
    }
    return E("bad_request");
  }
  if (path === "/api/admin/ads/lead" && method === "POST") {
    const body = await request.json().catch(() => ({})) || {};
    const id = int(body.id);
    if (body.credit === true) { if (!(await creditLead(db, id))) return E("not_found"); }
    else if (body.credit === false) await db.prepare("UPDATE ad_leads SET status='new' WHERE id=? AND status='disputed'").bind(id).run();
    else return E("bad_request");
    await audit(db, user.id, "ad-lead", String(id), body.credit ? "credited" : "kept").catch(() => 0);
    return J({ ok: true }, 200, NS);
  }
  return E("not_found");
}
