// #281 Werbeplaetze: Preisrechnung, PayPal-Webhook (Signaturpruefung, Idempotenz), Start nur nach Zahlung + Freigabe,
// Auslieferung/Zaehlung, Go-Link, Lead-Formular (Einwilligung, Turnstile, Gutschrift) und Admin-Rechte. SQLite mit allen Migrationen,
// PayPal und Turnstile nur als Schein-fetch (kein Netz).
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleAds, handlePaypalWebhook, handleAdGo, quote, loadPricing, resetPaypalToken, webpSize, pickCampaign, paypalConfig } from "../src/ads.js";
import { handleSponsorLink } from "../src/sponsor.js";

const J = (data, status = 200, extra = {}) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", ...extra } });
const ADMIN = { id: 1, admin: true }, OWNER = { id: 2, admin: false }, OTHER = { id: 3, admin: false };

function sqliteDb(raw) {
  return {
    prepare(sql) {
      let args = [];
      const o = {
        bind(...a) { args = a; return o; },
        all: async () => ({ results: raw.prepare(sql).all(...args) }),
        first: async () => raw.prepare(sql).get(...args) ?? null,
        run: async () => { const r = raw.prepare(sql).run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; },
      };
      return o;
    },
    async batch(s) { for (const x of s) await x.run(); },
  };
}

let raw, env, calls, realFetch, ppResponses;
const today = () => new Date().toISOString().slice(0, 10);

beforeEach(async () => {
  const { DatabaseSync } = await import("node:sqlite");
  raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  raw.exec(`INSERT INTO users(id,provider,sub,name,role,banned,created) VALUES(1,'google','a','Admin','admin',0,1),(2,'google','b','Owner','user',0,1),(3,'google','c','Other','user',0,1);
    INSERT INTO orgs(id,handle,name,tagline,created) VALUES(1,'contoso','Contoso GmbH','Teams Phone experts',1);
    INSERT INTO org_members(org_id,user_id,role,status,created) VALUES(1,2,'owner','active',1);
    INSERT INTO org_offers(org_id,eid,created) VALUES(1,'teams-phone',1);`);
  const objects = new Map();
  env = { DB: sqliteDb(raw), SESSION_SECRET: "test-secret", SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", ADMIN_SUBS: "",
    PAYPAL_CLIENT_ID: "cid", PAYPAL_CLIENT_SECRET: "csecret", PAYPAL_WEBHOOK_ID: "WH-1", ADS_BOOKING: "1",
    PAGES: { put: async (k, v, o) => objects.set(k, { v, o }), objects } };
  resetPaypalToken();
  calls = []; ppResponses = {};
  realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init = {}) => {
    const u = String(url); calls.push({ url: u, init });
    if (u.endsWith("/v1/oauth2/token")) return J({ access_token: "tok", expires_in: 3600 });
    if (u.endsWith("/v1/notifications/verify-webhook-signature")) return J({ verification_status: ppResponses.verify || "SUCCESS" });
    if (u.endsWith("/v2/checkout/orders")) return J({ id: "ORDER1", links: [{ rel: "payer-action", href: "https://www.sandbox.paypal.com/checkoutnow?token=ORDER1" }] }, 201);
    if (/\/v2\/checkout\/orders\/ORDER1\/capture$/.test(u)) return J(ppResponses.capture || { id: "ORDER1", status: "COMPLETED", purchase_units: [{ payments: { captures: [{ id: "CAP1", status: "COMPLETED", amount: { value: ppResponses.captureValue, currency_code: "EUR" } }] } }] }, 201);
    if (u.endsWith("/v2/invoicing/invoices")) return J({ id: "INV2-AAAA" }, 201);
    if (/\/invoices\/INV2-AAAA\/send$/.test(u)) return J({ links: [{ rel: "payer-view", href: "https://www.sandbox.paypal.com/invoice/p/#INV2AAAA" }] });
    if (u.includes("challenges.cloudflare.com/turnstile")) return J({ success: ppResponses.turnstile !== false });
    throw new Error("unerwarteter Abruf " + u);
  };
});
afterEach(() => { globalThis.fetch = realFetch; });

async function call(path, { method = "GET", body, user, query = "", headers = {} } = {}) {
  const url = new URL(`https://api-dub.m365.fm${path}${query}`);
  const isBin = body instanceof Uint8Array;
  const req = new Request(url, { method, headers: { "x-requested-with": "m365", "user-agent": "Mozilla/5.0 (Windows NT 10.0) Chrome/130", "cf-connecting-ip": "203.0.113.5", ...(body && !isBin ? { "content-type": "application/json" } : {}), ...headers },
    body: body === undefined ? undefined : isBin ? body : JSON.stringify(body) });
  const res = await handleAds(env, req, url, url.pathname, user, J);
  const text = await res.text();
  let json = null; try { json = JSON.parse(text); } catch {}
  return { status: res.status, json, text, res };
}

const BILLING = { company: "Contoso GmbH", address: "Hauptstr. 1", postal_code: "70597", city: "Stuttgart", country: "DE", vat_id: "DE123456789", email: "billing@contoso.example.com" };

function webp(w, h) {   // VP8X-Kopf genuegt fuer die Groessenpruefung
  const b = new Uint8Array(40);
  b.set([..."RIFF"].map((c) => c.charCodeAt(0)), 0); b.set([..."WEBP"].map((c) => c.charCodeAt(0)), 8); b.set([..."VP8X"].map((c) => c.charCodeAt(0)), 12);
  const W = w - 1, H = h - 1; b[24] = W & 255; b[25] = (W >> 8) & 255; b[26] = W >> 16; b[27] = H & 255; b[28] = (H >> 8) & 255; b[29] = H >> 16;
  return b;
}

async function book(extra = {}, user = OWNER) {
  const r = await call("/api/ads/bookings", { method: "POST", user, body: { org_id: 1, product: "banner_mid", page_types: ["episode"], quantity: 10000, months: 1,
    target_url: "https://contoso.example.com/teams", alt: "Contoso Teams Phone", billing: BILLING, total_cents: 1, ...extra } });
  return r;
}
async function hook(event, headers = {}) {
  const raw = JSON.stringify(event);
  const req = new Request("https://api-dub.m365.fm/paypal/webhook", { method: "POST", body: raw, headers: {
    "paypal-auth-algo": "SHA256withRSA", "paypal-cert-url": "https://api.sandbox.paypal.com/v1/notifications/certs/CERT", "paypal-transmission-id": "t1",
    "paypal-transmission-sig": "sig", "paypal-transmission-time": "2026-11-05T10:00:00Z", ...headers } });
  const res = await handlePaypalWebhook(env, req);
  return { status: res.status, json: await res.json() };
}
const row = (id) => raw.prepare("SELECT * FROM ad_bookings WHERE id=?").get(id);

// ---------------------------------------------------------------- Preise

test("quote: TKP, Mindestbuchung, Themen +25 %, exklusiv +50 %, Laufzeit −10/−20 %, Steuer je Position", async () => {
  const p = await loadPricing(env.DB);
  assert.equal(quote(p, { product: "banner_top", page_types: ["episode"], quantity: 9999 }).error, "bad_quantity");
  let q = quote(p, { product: "banner_top", page_types: ["episode"], quantity: 10000, months: 1 });
  assert.equal(q.net_cents, 40000);            // 10.000 x 40 € TKP = 400 €
  assert.equal(q.tax_cents, 7600);             // Standard 19 % (konfigurierbar)
  assert.equal(q.total_cents, 47600);
  q = quote(p, { product: "banner_mid", page_types: ["entity"], quantity: 20000, months: 3, topics: ["teams-phone"] });
  assert.equal(q.subtotal_cents, 50000 + 12500);   // 500 € + 25 %
  assert.equal(q.discount_pct, 10);
  assert.equal(q.net_cents, 62500 - 6250);
  q = quote(p, { product: "banner_bottom", page_types: ["lang"], quantity: 100000, months: 6, topics: ["copilot"], exclusive: true });
  assert.equal(q.subtotal_cents, 150000 + 37500 + 75000);   // 1.500 € + 25 % + 50 %
  assert.equal(q.discount_cents, Math.round(150000 * 0.2) + Math.round(37500 * 0.2) + Math.round(75000 * 0.2));
  assert.equal(q.net_cents, 210000);
  // teuerster gewaehlter Seitentyp; inaktive Seitentypen (Blog) nicht buchbar
  raw.exec("UPDATE ad_prices SET price_cents=5000 WHERE product='banner_top' AND page_type='entity'");
  assert.equal(quote(await loadPricing(env.DB), { product: "banner_top", page_types: ["episode", "entity"], quantity: 10000 }).net_cents, 50000);
  assert.equal(quote(p, { product: "banner_top", page_types: ["blog"], quantity: 10000 }).net_cents, 40000, "Blog ist buchbar (gleicher Preis)");
  assert.equal(quote(p, { product: "banner_top", page_types: ["other"], quantity: 10000 }).error, "bad_page_type");
});

test("quote: Firmenkarte pro Klick, Leads je Profilstufe (Premium nach enthaltenen Leads), Reverse Charge nur wenn eingeschaltet", async () => {
  const p = await loadPricing(env.DB);
  assert.equal(quote(p, { product: "company_card", page_types: ["episode"], quantity: 100, months: 6 }).net_cents, 8000);   // kein Laufzeitrabatt
  assert.equal(quote(p, { product: "lead_form", page_types: ["episode"], quantity: 3, plan: "free" }).net_cents, 6000);
  assert.equal(quote(p, { product: "lead_form", page_types: ["episode"], quantity: 3, plan: "expert" }).net_cents, 3000);
  const prem = quote(p, { product: "lead_form", page_types: ["episode"], quantity: 15, plan: "premium", included: 10 });
  assert.equal(prem.included_used, 10);
  assert.equal(prem.net_cents, 2500);
  const eu = { country: "AT", vat_id: "ATU12345678" };
  assert.equal(quote(p, { product: "banner_mid", page_types: ["episode"], quantity: 10000, billing: eu }).tax_cents, 4750);
  raw.exec("UPDATE ad_settings SET v='1' WHERE k='reverse_charge'");
  const rc = quote(await loadPricing(env.DB), { product: "banner_mid", page_types: ["episode"], quantity: 10000, billing: eu });
  assert.equal(rc.tax_cents, 0); assert.equal(rc.reverse_charge, true);
});

test("Preise im Admin änderbar, ohne Code; nur Admins", async () => {
  assert.equal((await call("/api/admin/ads/pricing", { method: "POST", user: OWNER, body: { settings: { topic_pct: 30 } } })).status, 403);
  assert.equal((await call("/api/admin/ads/bookings", { user: OTHER })).status, 403);
  assert.equal((await call("/api/admin/ads/stats", { user: OWNER })).status, 403);
  assert.equal((await call("/api/admin/ads/bookings")).status, 401);
  const r = await call("/api/admin/ads/pricing", { method: "POST", user: ADMIN, body: { prices: [{ product: "banner_top", page_type: "episode", price_cents: 4500, active: true }], settings: { topic_pct: 30 } } });
  assert.equal(r.status, 200);
  assert.equal((await call("/api/admin/ads/pricing", { method: "POST", user: ADMIN, body: { settings: { unknown: 1 } } })).status, 400);
  const q = (await call("/api/ads/quote", { method: "POST", body: { product: "banner_top", page_types: ["episode"], quantity: 10000, topics: ["copilot"] } })).json.quote;
  assert.equal(q.subtotal_cents, 45000 + 13500);
});

// ---------------------------------------------------------------- Buchen, Banner, Zahlung

test("Buchung: nur Firmen-Inhaber/-Admins, Preis nur vom Server, Banner als WebP in passender Größe nach R2", async () => {
  assert.equal((await book({}, OTHER)).status, 403);
  const r = await book();
  assert.equal(r.status, 200, r.text);
  const b = r.json.booking;
  assert.equal(b.total_cents, 29750);   // 10.000 x 25 € + 19 %, Client-Angabe total_cents=1 ignoriert
  assert.match(b.code, /^ad-[a-z0-9]{12}$/);
  assert.equal(b.status, "draft");
  assert.equal((await call("/api/ads/pay", { method: "POST", user: OWNER, body: { id: b.id } })).json.error, "creative_missing");
  assert.equal((await call("/api/ads/banner", { method: "POST", user: OWNER, query: `?id=${b.id}`, body: webp(728, 90) })).json.error, "bad_dimensions");
  assert.equal((await call("/api/ads/banner", { method: "POST", user: OWNER, query: `?id=${b.id}`, body: new Uint8Array(40) })).json.error, "bad_format");
  assert.equal((await call("/api/ads/banner", { method: "POST", user: OTHER, query: `?id=${b.id}`, body: webp(300, 250) })).status, 404);
  const up = await call("/api/ads/banner", { method: "POST", user: OWNER, query: `?id=${b.id}`, body: webp(300, 250) });
  assert.equal(up.status, 200, up.text);
  assert.match(up.json.url, /^https:\/\/img\.m365\.fm\/sponsor\/ads\/1\/ad-[a-z0-9]+-desktop-[0-9a-f]{10}\.webp$/);
  assert.deepEqual(webpSize(webp(320, 100)), { w: 320, h: 100 });
  const [[key, obj]] = [...env.PAGES.objects];
  assert.ok(key.startsWith("sponsor/ads/1/"));
  assert.equal(obj.o.httpMetadata.contentType, "image/webp");
});

test("PayPal sofort: Bestellung mit Serverbetrag, Rückkehr erfasst die Zahlung; Start erst nach Freigabe", async () => {
  const b = (await book()).json.booking;
  await call("/api/ads/banner", { method: "POST", user: OWNER, query: `?id=${b.id}`, body: webp(300, 250) });
  const pay = await call("/api/ads/pay", { method: "POST", user: OWNER, body: { id: b.id } });
  assert.equal(pay.status, 200, pay.text);
  assert.match(pay.json.approve_url, /sandbox\.paypal\.com/);
  const order = JSON.parse(calls.find((c) => c.url.endsWith("/v2/checkout/orders")).init.body);
  assert.equal(order.purchase_units[0].amount.value, "297.50");
  assert.equal(order.purchase_units[0].custom_id, String(b.id));
  assert.ok(calls[0].url.startsWith("https://api-m.sandbox.paypal.com/"), "Standard: Sandbox");
  assert.equal(row(b.id).status, "awaiting");
  ppResponses.captureValue = "297.50";
  const back = await call("/api/ads/paypal-return", { query: `?code=${b.code}&token=ORDER1` });
  assert.equal(back.status, 302);
  assert.match(back.res.headers.get("location"), /pay=paid/);
  assert.equal(row(b.id).pay_status, "paid");
  assert.equal(row(b.id).status, "awaiting", "bezahlt, aber nicht freigegeben: kein Start");
  const rev = await call("/api/admin/ads/review", { method: "POST", user: ADMIN, body: { id: b.id, decision: "approve" } });
  assert.equal(rev.json.activated, true);
  assert.equal(row(b.id).status, "active");
  assert.equal(row(b.id).start, today());
});

test("Freigabe zuerst: Kampagne startet erst mit der bestätigten Zahlung (Webhook)", async () => {
  const b = (await book()).json.booking;
  await call("/api/ads/banner", { method: "POST", user: OWNER, query: `?id=${b.id}`, body: webp(300, 250) });
  await call("/api/ads/pay", { method: "POST", user: OWNER, body: { id: b.id } });
  const rev = await call("/api/admin/ads/review", { method: "POST", user: ADMIN, body: { id: b.id, decision: "approve" } });
  assert.equal(rev.json.activated, false);
  assert.equal(row(b.id).status, "awaiting");
  const ev = { id: "WH-EV-1", event_type: "PAYMENT.CAPTURE.COMPLETED", resource: { id: "CAP9", status: "COMPLETED", custom_id: String(b.id), amount: { value: "297.50", currency_code: "EUR" }, supplementary_data: { related_ids: { order_id: "ORDER1" } } } };
  const r = await hook(ev);
  assert.equal(r.status, 200); assert.equal(r.json.result, "paid");
  assert.equal(row(b.id).status, "active");
  assert.equal(row(b.id).paypal_capture_id, "CAP9");
});

test("Webhook: ohne gültige Signatur keine Aktion; Prüfung mit PAYPAL_WEBHOOK_ID; idempotent je Event-ID; Betrag muss passen", async () => {
  const b = (await book()).json.booking;
  await call("/api/ads/banner", { method: "POST", user: OWNER, query: `?id=${b.id}`, body: webp(300, 250) });
  await call("/api/ads/pay", { method: "POST", user: OWNER, body: { id: b.id } });
  const ev = { id: "WH-EV-2", event_type: "PAYMENT.CAPTURE.COMPLETED", resource: { id: "CAP2", custom_id: String(b.id), amount: { value: "297.50", currency_code: "EUR" } } };
  ppResponses.verify = "FAILURE";
  assert.equal((await hook(ev)).status, 401);
  assert.equal(row(b.id).pay_status, "pending");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM paypal_events").get().n, 0);
  // fehlende PayPal-Kopfzeilen: gar nicht erst pruefen
  const bare = await handlePaypalWebhook(env, new Request("https://x/paypal/webhook", { method: "POST", body: JSON.stringify(ev) }));
  assert.equal(bare.status, 401);
  ppResponses.verify = "SUCCESS";
  const verifyCall = () => calls.filter((c) => c.url.endsWith("/verify-webhook-signature")).at(-1);
  const r1 = await hook(ev);
  assert.equal(r1.json.result, "paid");
  const sent = JSON.parse(verifyCall().init.body);
  assert.equal(sent.webhook_id, "WH-1");
  assert.equal(sent.webhook_event.id, "WH-EV-2");
  assert.equal(sent.transmission_id, "t1");
  const r2 = await hook(ev);
  assert.equal(r2.json.duplicate, true);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM paypal_events").get().n, 1);
  // anderer Betrag: nicht bezahlt
  const b2 = (await book()).json.booking;
  raw.prepare("UPDATE ad_bookings SET status='awaiting',paypal_order_id='ORDER2' WHERE id=?").run(b2.id);
  const bad = await hook({ id: "WH-EV-3", event_type: "PAYMENT.CAPTURE.COMPLETED", resource: { id: "CAP3", custom_id: String(b2.id), amount: { value: "1.00", currency_code: "EUR" } } });
  assert.equal(bad.json.result, "amount_mismatch");
  assert.equal(row(b2.id).pay_status, "pending");
  // nicht behandelte Ereignisse: 200 quittieren
  const other = await hook({ id: "WH-EV-4", event_type: "BILLING.SUBSCRIPTION.CREATED", resource: {} });
  assert.equal(other.status, 200); assert.equal(other.json.result, "ignored");
});

test("Webhook: Rechnung (Invoicing v2) mit Positionen, Firma, Adresse, USt-ID; bezahlt und erstattet", async () => {
  const b = (await book({ pay_method: "invoice" })).json.booking;
  await call("/api/ads/banner", { method: "POST", user: OWNER, query: `?id=${b.id}`, body: webp(300, 250) });
  const pay = await call("/api/ads/pay", { method: "POST", user: OWNER, body: { id: b.id } });
  assert.match(pay.json.invoice_url, /paypal\.com\/invoice/);
  const inv = JSON.parse(calls.find((c) => c.url.endsWith("/v2/invoicing/invoices")).init.body);
  assert.equal(inv.primary_recipients[0].billing_info.business_name, "Contoso GmbH");
  assert.equal(inv.primary_recipients[0].billing_info.address.country_code, "DE");
  assert.match(inv.detail.note, /DE123456789/);
  assert.equal(inv.items[0].unit_amount.value, "250.00");
  assert.equal(inv.items[0].tax.percent, "19");
  await call("/api/admin/ads/review", { method: "POST", user: ADMIN, body: { id: b.id, decision: "approve" } });
  const paid = await hook({ id: "WH-INV-1", event_type: "INVOICING.INVOICE.PAID", resource: { invoice: { id: "INV2-AAAA", status: "PAID", payments: { paid_amount: { value: "297.50", currency_code: "EUR" } } } } });
  assert.equal(paid.json.result, "paid");
  assert.equal(row(b.id).status, "active");
  const ref = await hook({ id: "WH-INV-2", event_type: "INVOICING.INVOICE.REFUNDED", resource: { invoice: { id: "INV2-AAAA" } } });
  assert.equal(ref.json.result, "refunded");
  assert.equal(row(b.id).status, "paused");
});

// ---------------------------------------------------------------- Auslieferung, Zaehlung, Go-Link

function activeBooking(fields) {
  const d = today();
  const base = { code: "ad-testcode01", org_id: 1, user_id: 2, product: "banner_mid", page_types: "episode,entity", topics: "", quantity: 10000, delivered: 0,
    start: d, end: "2099-01-01", target_url: "https://contoso.example.com/x", alt: "Contoso", banner_url: "https://img.m365.fm/sponsor/ads/1/a.webp", banner_w: 300, banner_h: 250,
    pay_status: "paid", creative_status: "approved", status: "active", tagline: "Teams Phone für den Mittelstand", created: 1, updated: 1, exclusive: 0, ...fields };
  const k = Object.keys(base);
  return Number(raw.prepare(`INSERT INTO ad_bookings(${k.join(",")}) VALUES(${k.map(() => "?").join(",")})`).run(...Object.values(base)).lastInsertRowid);
}

test("Auslieferung: zählt Einblendungen cookiefrei je Kampagne/Platz/Seitentyp/Tag, ohne Bots; Hausanzeige als Rückfall", async () => {
  const id = activeBooking({});
  let r = await call("/api/ads/serve", { query: "?slot=mid&pt=episode&lang=de" });
  assert.equal(r.json.ad.type, "banner");
  assert.equal(r.json.ad.href, "https://api-dub.m365.fm/go/ad-testcode01?s=mid&pt=episode");
  assert.equal(r.res.headers.get("set-cookie"), null);
  await call("/api/ads/serve", { query: "?slot=mid&pt=episode", headers: { "user-agent": "Googlebot/2.1" } });
  const s = raw.prepare("SELECT * FROM ad_stats_daily WHERE booking_id=?").all(id);
  assert.equal(s.length, 1); assert.equal(s[0].impressions, 1); assert.equal(s[0].page_type, "episode");
  assert.equal(row(id).delivered, 1);
  // anderer Seitentyp / Platz: keine Kampagne, Hausanzeige aus dem Admin
  r = await call("/api/ads/serve", { query: "?slot=mid&pt=lang&lang=de" });
  assert.equal(r.json.ad, null); assert.equal(r.json.house, null);
  await call("/api/admin/ads/house", { method: "POST", user: ADMIN, body: { slot: "top", title: "M365Con 2027", url: "https://m365con.net/", langs: "de" } });
  r = await call("/api/ads/serve", { query: "?slot=top&pt=lang&lang=de" });
  assert.equal(r.json.house.title, "M365Con 2027");
  assert.equal((await call("/api/ads/serve", { query: "?slot=top&pt=lang&lang=fr" })).json.house, null);
  assert.equal((await call("/api/ads/serve", { query: "?slot=side&pt=lang" })).status, 400);
  // Volumen erreicht: Kampagne endet
  raw.prepare("UPDATE ad_bookings SET delivered=quantity-1 WHERE id=?").run(id);
  await call("/api/ads/serve", { query: "?slot=mid&pt=episode" });
  assert.equal(row(id).status, "ended");
});

test("Auswahl: Firmenkarte nur auf passenden Themen, exklusive Buchung geht vor", async () => {
  const card = activeBooking({ code: "ad-cardcode01", product: "company_card", quantity: 100 });
  assert.equal(await pickCampaign(env.DB, { slot: "mid", pageType: "episode", topics: ["copilot"] }), null);
  assert.equal((await pickCampaign(env.DB, { slot: "mid", pageType: "episode", topics: ["teams-phone"] })).id, card);   // Thema der Firma (org_offers)
  const banner = activeBooking({ code: "ad-bannerex01", exclusive: 1 });
  for (let i = 0; i < 5; i++) assert.equal((await pickCampaign(env.DB, { slot: "mid", pageType: "episode", topics: ["teams-phone"], rnd: () => i / 5 })).id, banner);
});

test("Go-Link: zählt Klick, 302 zum Ziel mit UTM; Bots nicht; Firmenkarte zählt Klick als Verbrauch; unbekannt 404", async () => {
  const id = activeBooking({});
  const go = async (code, ua = "Mozilla/5.0 Chrome/130", q = "?s=mid&pt=entity") => {
    const url = new URL(`https://api-dub.m365.fm/go/${code}${q}`);
    return handleSponsorLink(env, new Request(url, { headers: { "user-agent": ua } }), url, `/go/${code}`, undefined);
  };
  let r = await go("ad-testcode01");
  assert.equal(r.status, 302);
  const loc = new URL(r.headers.get("location"));
  assert.equal(loc.origin + loc.pathname, "https://contoso.example.com/x");
  assert.equal(loc.searchParams.get("utm_campaign"), "ad-testcode01");
  assert.equal(r.headers.get("x-robots-tag"), "noindex, nofollow");
  await go("ad-testcode01", "curl/8.0");
  const s = raw.prepare("SELECT SUM(clicks) c FROM ad_stats_daily WHERE booking_id=? AND page_type='entity'").get(id);
  assert.equal(s.c, 1);
  assert.equal(row(id).delivered, 0, "Banner: Klicks verbrauchen kein TKP-Volumen");
  const card = activeBooking({ code: "ad-cardcode02", product: "company_card", quantity: 2 });
  r = await go("ad-cardcode02");
  assert.equal(r.headers.get("location"), "https://www.m365.fm/community/c/contoso/");
  assert.equal(row(card).delivered, 1);
  assert.equal((await go("ad-unknown0001")).status, 404);
  activeBooking({ code: "ad-notapproved", creative_status: "pending", status: "awaiting" });
  assert.equal((await go("ad-notapproved")).status, 404);
});

// ---------------------------------------------------------------- Leads

test("Lead: Einwilligung Pflicht, Turnstile (ohne Secret geschlossen), E-Mail-Prüfung, Doppelte und beanstandete Leads werden gutgeschrieben", async () => {
  const id = activeBooking({ code: "ad-leadcode01", product: "lead_form", quantity: 5 });
  const send = (extra) => call("/api/ads/lead", { method: "POST", body: { code: "ad-leadcode01", name: "Erika Muster", email: "erika@fabrikam.de", message: "Bitte um Rückruf", consent: true, turnstile: "tok", lang: "de", ...extra } });
  assert.equal((await send({ consent: false })).json.error, "consent_required");
  assert.equal((await send({ consent: "true" })).json.error, "consent_required");
  assert.equal((await send({})).status, 503, "ohne TURNSTILE_SECRET keine Leads");
  env.TURNSTILE_SECRET = "1x0000000000000000000000000000000AA";
  ppResponses.turnstile = false;
  assert.equal((await send({})).json.error, "captcha");
  ppResponses.turnstile = true;
  assert.equal((await send({ email: "kein-mail" })).status, 400);
  const ok = await send({});
  assert.equal(ok.status, 200, ok.text);
  const ts = calls.find((c) => c.url.includes("turnstile"));
  assert.equal(new URLSearchParams(ts.init.body).get("secret"), env.TURNSTILE_SECRET);
  let lead = raw.prepare("SELECT * FROM ad_leads ORDER BY id DESC").get();
  assert.equal(lead.status, "new"); assert.equal(lead.charged, 1);
  assert.match(lead.consent_text, /Contoso GmbH/);
  assert.equal(row(id).delivered, 1);
  // gleiche Adresse erneut: zugestellt, nicht berechnet
  await send({});
  lead = raw.prepare("SELECT * FROM ad_leads ORDER BY id DESC").get();
  assert.equal(lead.status, "duplicate"); assert.equal(lead.charged, 0);
  assert.equal(row(id).delivered, 1);
  // Firma beanstandet, Admin schreibt gut
  const first = raw.prepare("SELECT id FROM ad_leads ORDER BY id").get().id;
  assert.equal((await call("/api/ads/leads/dispute", { method: "POST", user: OTHER, body: { id: first, reason: "Spam-Adresse" } })).status, 404);
  assert.equal((await call("/api/ads/leads/dispute", { method: "POST", user: OWNER, body: { id: first, reason: "Spam-Adresse" } })).status, 200);
  assert.equal((await call("/api/admin/ads/lead", { method: "POST", user: OWNER, body: { id: first, credit: true } })).status, 403);
  assert.equal((await call("/api/admin/ads/lead", { method: "POST", user: ADMIN, body: { id: first, credit: true } })).status, 200);
  assert.equal(row(id).delivered, 0);
  assert.equal(raw.prepare("SELECT status FROM ad_leads WHERE id=?").get(first).status, "credited");
  // Firmen-Dashboard: nur eigene Leads
  assert.equal((await call("/api/ads/leads", { user: OWNER, query: "?org=contoso" })).json.leads.length, 2);
  assert.equal((await call("/api/ads/leads", { user: OTHER, query: "?org=contoso" })).status, 404);
  assert.equal((await call("/api/admin/ads/leads", { user: ADMIN })).json.leads.length, 2);
});

test("Admin-Statistik mit CSV (Formelzellen entschärft) und Sponsor-Dashboard-Zahlen", async () => {
  const id = activeBooking({});
  raw.prepare("INSERT INTO ad_stats_daily(day,booking_id,slot,page_type,impressions,clicks) VALUES(?,?,?,?,?,?)").run(today(), id, "mid", "episode", 200, 3);
  raw.exec("UPDATE orgs SET name='=HYPERLINK(1)' WHERE id=1");
  const s = await call("/api/admin/ads/stats", { user: ADMIN });
  assert.equal(s.json.totals.impressions, 200); assert.equal(s.json.totals.ctr, 1.5);
  const csv = await call("/api/admin/ads/stats", { user: ADMIN, query: "?format=csv" });
  assert.match(csv.text, /"'=HYPERLINK\(1\)"/);
  assert.match(csv.text, /"200","3","1.50"/);
  const mine = await call("/api/ads/mine", { user: OWNER });
  assert.equal(mine.json.bookings[0].stats.impressions, 200);
  assert.equal(mine.json.bookings[0].stats.ctr, 1.5);
});

test("PAYPAL_ENV schaltet die API-Basis; Sandbox-Zugang hat Vorrang in der Sandbox", () => {
  assert.equal(paypalConfig({}).base, "https://api-m.sandbox.paypal.com");
  assert.equal(paypalConfig({ PAYPAL_ENV: "live" }).base, "https://api-m.paypal.com");
  assert.equal(paypalConfig({ PAYPAL_CLIENT_ID: "live", PAYPAL_SANDBOX_CLIENT_ID: "sb" }).id, "sb");
  assert.equal(paypalConfig({ PAYPAL_ENV: "live", PAYPAL_CLIENT_ID: "live", PAYPAL_SANDBOX_CLIENT_ID: "sb" }).id, "live");
});

test("Sponsor-Dashboard-API: Firmen mit Werbebuchung erscheinen mit ihren Zahlen, fremde Firmen nicht", async () => {
  const { handleSponsor } = await import("../src/sponsor.js");
  const id = activeBooking({});
  raw.prepare("INSERT INTO ad_stats_daily(day,booking_id,slot,page_type,impressions,clicks) VALUES(?,?,?,?,?,?)").run(today(), id, "mid", "episode", 50, 2);
  const get = async (user) => {
    const url = new URL("https://api-dub.m365.fm/api/sponsor/dashboard");
    const res = await handleSponsor(env, new Request(url), url, url.pathname, J, user);
    return res.json();
  };
  const own = await get(OWNER);
  assert.equal(own.orgs.length, 1);
  assert.equal(own.orgs[0].ads[0].impressions, 50);
  assert.equal(own.orgs[0].ads[0].ctr, 4);
  assert.equal((await get(OTHER)).orgs.length, 0);
});

test("Schalter ADS_BOOKING aus (Standard): nur Hausanzeigen, Buchung/Zahlung/Leads 503 ohne PayPal-Aufruf; Admin bleibt nutzbar", async () => {
  delete env.ADS_BOOKING;
  activeBooking({});
  await call("/api/admin/ads/house", { method: "POST", user: ADMIN, body: { slot: "mid", title: "M365Con 2027", url: "https://m365con.net/" } });
  const s = await call("/api/ads/serve", { query: "?slot=mid&pt=episode&lang=de" });
  assert.equal(s.json.ad, null);
  assert.equal(s.json.house.title, "M365Con 2027");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM ad_stats_daily").get().n, 0);
  for (const [path, body] of [["/api/ads/bookings", {}], ["/api/ads/pay", { id: 1 }], ["/api/ads/lead", { code: "ad-testcode01", consent: true }]]) {
    const r = await call(path, { method: "POST", user: OWNER, body });
    assert.equal(r.status, 503, path); assert.equal(r.json.error, "not_available_yet");
  }
  assert.equal((await call("/api/ads/paypal-return", { query: "?code=ad-testcode01" })).status, 503);
  assert.equal(calls.length, 0, "kein PayPal- oder Turnstile-Aufruf");
  assert.equal((await call("/api/ads/pricing")).status, 200, "Preise bleiben sichtbar");
  assert.equal((await call("/api/admin/ads/bookings", { user: ADMIN })).status, 200);
  const wr = readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8");
  assert.match(wr, /^ADS_BOOKING = "0"$/m, "Standard im Deploy: aus");
});

test("Hausanzeigen: Einblendungen und Klicks cookiefrei je Platz/Seitentyp/Sprache/Land, auch bei ADS_BOOKING aus; UTM mit Entität und Slug", async () => {
  delete env.ADS_BOOKING;
  const de = { "cf-ipcountry": "DE" };
  let r = await call("/api/ads/serve", { query: "?slot=mid&pt=blog&lang=de&topics=teams-phone&house=m365con&p=mein-beitrag", headers: de });
  assert.equal(r.json.ad, null);
  await call("/api/ads/serve", { query: "?slot=mid&pt=blog&lang=de&house=m365con", headers: { "cf-ipcountry": "AT" } });
  await call("/api/ads/serve", { query: "?slot=mid&pt=blog&lang=de&house=m365con", headers: { "user-agent": "Googlebot/2.1", ...de } });
  await call("/api/ads/serve", { query: "?slot=mid2&pt=entity&lang=fr&house=services&house_only=1", headers: de });
  await call("/api/ads/serve", { query: "?slot=mid&pt=blog&lang=de&house=evil" });
  const rows = raw.prepare("SELECT house,slot,page_type,lang,country,impressions FROM ad_house_stats ORDER BY house,country").all().map((x) => ({ ...x }));
  assert.deepEqual(rows, [
    { house: "m365con", slot: "mid", page_type: "blog", lang: "de", country: "AT", impressions: 1 },
    { house: "m365con", slot: "mid", page_type: "blog", lang: "de", country: "DE", impressions: 1 },
    { house: "services", slot: "mid2", page_type: "entity", lang: "fr", country: "DE", impressions: 1 },
  ]);
  const go = async (code, q, ua = "Mozilla/5.0 Chrome/130", extra = {}) => {
    const url = new URL(`https://api-dub.m365.fm/go/${code}${q}`);
    return handleSponsorLink(env, new Request(url, { headers: { "user-agent": ua, ...extra } }), url, `/go/${code}`, undefined);
  };
  r = await go("h-m365con", "?s=mid&pt=blog&l=de&e=teams-phone&p=mein-beitrag", undefined, de);
  assert.equal(r.status, 302);
  const u = new URL(r.headers.get("location"));
  assert.equal(u.origin, "https://m365con.net");
  assert.deepEqual(Object.fromEntries(u.searchParams), { utm_source: "m365.fm", utm_medium: "house_ad", utm_campaign: "m365con2027", utm_term: "teams-phone", utm_content: "mein-beitrag" });
  assert.equal(raw.prepare("SELECT clicks FROM ad_house_stats WHERE house='m365con' AND country='DE'").get().clicks, 1);
  await go("h-m365con", "?s=mid&pt=blog&l=de", "curl/8");   // Bot: kein Klick
  // keine personenbezogenen oder ungueltigen Werte in der UTM; Ziel nur aus der festen Liste
  const bad = new URL((await go("h-m365con", "?s=mid&pt=blog&l=de&e=Max%20Mustermann&p=max@example.com")).headers.get("location"));
  assert.equal(bad.searchParams.get("utm_term"), null); assert.equal(bad.searchParams.get("utm_content"), null);
  const svc = new URL((await go("h-services", "?s=bottom&pt=entity&l=fr&e=copilot&p=copilot")).headers.get("location"));
  assert.equal(svc.origin + svc.pathname, "https://www.m365.fm/fr/services/");
  assert.equal(svc.searchParams.get("utm_campaign"), "m365fm_services");
  assert.equal((await go("h-evil", "?s=mid")).status, 404);
  assert.equal((await go("h-x999", "?s=mid")).status, 404);
  // Admin-Zahlen: CTR, je Land und Sprache, CSV mit Land; nur fuer Admins
  assert.equal((await call("/api/admin/ads/house-stats", { user: OWNER })).status, 403);
  const st = await call("/api/admin/ads/house-stats", { user: ADMIN, query: "?days=7&house=m365con" });
  assert.deepEqual(st.json.by_house.map((x) => [x.key, x.impressions, x.clicks, x.ctr]), [["m365con", 2, 2, 100]]);   // 2. Klick ohne Land (XX)
  assert.deepEqual(st.json.by_country.map((x) => x.key).sort(), ["m365con · AT", "m365con · DE", "m365con · XX"]);
  assert.deepEqual(st.json.by_lang.map((x) => x.key), ["m365con · de"]);
  assert.equal((await call("/api/admin/ads/house-stats", { user: ADMIN, query: "?days=30" })).json.by_house.length, 2);
  const csv = await call("/api/admin/ads/house-stats", { user: ADMIN, query: "?days=30&format=csv" });
  assert.match(csv.text, /"house","slot","page_type","lang","country","impressions","clicks","ctr_pct"/);
  assert.match(csv.text, /"m365con","mid","blog","de","DE","1","1","100.00"/);
  // dieselbe M365Con-Adresse wie auf der Seite (site_ads.CON_URL)
  const py = readFileSync(new URL("../../site_ads.py", import.meta.url), "utf8");
  assert.ok(py.includes(`CON_URL = "${"https://m365con.net/?utm_source=m365.fm&utm_medium=house_ad&utm_campaign=m365con2027"}"`));
});

test("Hausanzeige aus dem Admin: Go-Link mit Seitenkontext, Kampagnen-Zahlen mit Land in der CSV", async () => {
  env.ADS_BOOKING = "1";
  await call("/api/admin/ads/house", { method: "POST", user: ADMIN, body: { slot: "top", title: "Webinar", url: "https://example.com/webinar" } });
  const r = await call("/api/ads/serve", { query: "?slot=top&pt=episode&lang=en&topics=copilot&house=sponsor&p=folge-7", headers: { "cf-ipcountry": "US" } });
  const id = raw.prepare("SELECT id FROM ad_house").get().id;
  assert.equal(r.json.house.url, `https://api-dub.m365.fm/go/h-x${id}?s=top&pt=episode&l=en&e=copilot&p=folge-7`);
  assert.equal(raw.prepare("SELECT house,country FROM ad_house_stats").get().house, `x${id}`);
  const url = new URL(r.json.house.url);
  const go = await handleSponsorLink(env, new Request(url, { headers: { "user-agent": "Mozilla/5.0" } }), url, url.pathname, undefined);
  const t = new URL(go.headers.get("location"));
  assert.equal(t.origin + t.pathname, "https://example.com/webinar");
  assert.equal(t.searchParams.get("utm_campaign"), `house_x${id}`);
  assert.equal(t.searchParams.get("utm_content"), "folge-7");
  // bezahlte Kampagne: Land in Zaehler und CSV
  const bid = activeBooking({});
  await call("/api/ads/serve", { query: "?slot=mid&pt=episode", headers: { "cf-ipcountry": "CH" } });
  assert.equal(raw.prepare("SELECT country FROM ad_stats_daily WHERE booking_id=?").get(bid).country, "CH");
  const csv = await call("/api/admin/ads/stats", { user: ADMIN, query: "?format=csv" });
  assert.match(csv.text, /"slot","page_type","country","impressions"/);
  assert.match(csv.text, /"mid","episode","CH","1","0"/);
});
