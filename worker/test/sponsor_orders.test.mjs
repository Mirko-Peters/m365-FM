// #281 Folge: Sponsoring-Paket von /sponsor/ per PayPal-Rechnung bestellen. Server-Preis = Seiten-Preis (assets/sponsor-calc.js),
// M365Con nur auf Anfrage, Rechnung (Invoicing v2) mit Schein-fetch, Webhook setzt die Bestellung auf bezahlt, Rechte.
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { sponsorQuote, handleSponsorOrders, SPONSOR_PRICING as P } from "../src/sponsor_orders.js";
import { handlePaypalWebhook, resetPaypalToken } from "../src/ads.js";
import { handleSponsor } from "../src/sponsor.js";

const require = createRequire(import.meta.url);
const SC = require("../../assets/sponsor-calc.js");
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

let raw, env, calls, realFetch;
beforeEach(async () => {
  const { DatabaseSync } = await import("node:sqlite");
  raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  raw.exec(`INSERT INTO users(id,provider,sub,name,role,banned,created) VALUES(1,'google','a','Admin','admin',0,1),(2,'google','b','Owner','user',0,1),(3,'google','c','Other','user',0,1);
    INSERT INTO orgs(id,handle,name,created) VALUES(1,'contoso','Contoso GmbH',1),(2,'fabrikam','Fabrikam',1);
    INSERT INTO org_members(org_id,user_id,role,status,created) VALUES(1,2,'owner','active',1),(2,3,'owner','active',1);
    INSERT INTO mail_addr(user_id,email,verified,created) VALUES(1,'admin@example.com',1,1);`);
  env = { DB: sqliteDb(raw), SESSION_SECRET: "s", SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", ADMIN_SUBS: "",
    PAYPAL_CLIENT_ID: "cid", PAYPAL_CLIENT_SECRET: "cs", PAYPAL_WEBHOOK_ID: "WH-1", ADS_BOOKING: "1" };
  resetPaypalToken();
  calls = []; realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init = {}) => {
    const u = String(url); calls.push({ url: u, init });
    if (u.endsWith("/v1/oauth2/token")) return J({ access_token: "tok", expires_in: 3600 });
    if (u.endsWith("/v1/notifications/verify-webhook-signature")) return J({ verification_status: "SUCCESS" });
    if (u.endsWith("/v2/invoicing/invoices")) return J({ id: "INV2-SPON" }, 201);
    if (u.endsWith("/invoices/INV2-SPON/send")) return J({ links: [{ rel: "payer-view", href: "https://www.sandbox.paypal.com/invoice/p/#SPON" }] });
    throw new Error("unerwarteter Abruf " + u);
  };
});
afterEach(() => { globalThis.fetch = realFetch; });

const topic = (name, lvl = 2) => ({ id: name, name, en: name, lvl, rated: true, example: false, custom: false });
function state(extra = {}) {
  return { goal: "ai", rt: 6, topics: [topic("Teams Phone")], video: false, pr: true, auth: false, dash: false, l14: false, topic: false, expert: false, li: false, live: false, con: false,
    cnt: { pr: 1, ex: 1, li: 1, lv: 1 }, prTouched: false, ...extra };
}
async function call(path, { method = "GET", body, user } = {}) {
  const url = new URL(`https://api-dub.m365.fm${path}`);
  const req = new Request(url, { method, headers: { "x-requested-with": "m365", "content-type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
  const res = await handleSponsorOrders(env, req, url, url.pathname, user, J);
  return { status: res.status, json: await res.json() };
}
const BILLING = { company: "Contoso GmbH", contact: "Erika Muster", address: "Hauptstr. 1", postal_code: "70597", city: "Stuttgart", country: "DE", vat_id: "DE123456789", email: "billing@contoso.example.com" };

test("Server-Preis = Seiten-Preis (SponsorCalc.compute) für viele Kombinationen, in der Währung der Seite", () => {
  assert.equal(P.currency, "USD");
  const combos = [
    state(),
    state({ rt: 1, pr: false }),
    state({ rt: 3, video: true, topics: [topic("A"), topic("B", 4)] }),
    state({ rt: 12, video: true, auth: true, topic: true, l14: true, li: true, cnt: { pr: 3, ex: 2, li: 4, lv: 2 }, prTouched: true, expert: true, live: true }),
    state({ goal: "lead", rt: 6, topics: [] }),   // Leads: Dashboard Pflicht
    state({ goal: "vis", rt: 12, topics: [topic("A"), topic("B"), topic("C"), topic("D")], video: true, dash: true }),
  ];
  for (const s of combos) {
    const page = SC.compute(s, P);
    const server = sponsorQuote(P, SC.orderPackage(s), { vat_pct: "0" });
    assert.ifError(server.error);
    assert.equal(server.net_cents, page.total * 100, JSON.stringify(SC.orderPackage(s)));
    assert.equal(server.currency, "USD");
  }
  const q = sponsorQuote(P, SC.orderPackage(state({ rt: 12, video: true })), { vat_pct: "19" });
  assert.equal(q.discount_pct, 15);
  assert.equal(q.tax_cents, q.items.reduce((a, i) => a + Math.round(i.net_cents * 0.19), 0));
  // Client-Summen werden ignoriert, unbekannte Laufzeit abgelehnt
  assert.equal(sponsorQuote(P, { ...SC.orderPackage(state()), total: 1, monthly: 1 }, {}).net_cents, SC.compute(state(), P).total * 100);
  assert.equal(sponsorQuote(P, { ...SC.orderPackage(state()), rt: 2 }, {}).error, "bad_runtime");
});

test("M365Con in der Auswahl: keine Rechnung (Seite blendet um, Server lehnt ab)", async () => {
  assert.equal(SC.invoiceAllowed(state({ con: true })), false);
  assert.equal(SC.invoiceAllowed(state()), true);
  assert.equal(sponsorQuote(P, SC.orderPackage(state({ con: true })), {}).error, "m365con_on_request");
  const r = await call("/api/sponsor/order", { method: "POST", user: OWNER, body: { org_id: 1, package: SC.orderPackage(state({ con: true })), billing: BILLING } });
  assert.equal(r.status, 400); assert.equal(r.json.error, "m365con_on_request");
  assert.equal(calls.length, 0, "kein PayPal-Aufruf");
  const js = readFileSync(new URL("../../assets/sponsor.js", import.meta.url), "utf8");
  assert.match(js, /function invSync\(s\) \{ var ok = SC\.invoiceAllowed\(s\); flag\(el\.inv, "hidden", !ok\); flag\(el\.invCon, "hidden", ok\); \}/);
  assert.match(js, /invSync\(s\);/, "bei jedem Rendern umgeschaltet");
  const py = readFileSync(new URL("../../site_sponsor.py", import.meta.url), "utf8");
  assert.match(py, /<details class="spn-inv" id="spn-inv" hidden>/);
  assert.match(py, /<p class="spn-fine" id="spn-inv-con" hidden>/);
  assert.match(py, /id="spn-form"/, "Anfrageformular bleibt für jede Auswahl");
});

test("Bestellung: Rechnung über Invoicing v2 mit Positionen, Firma, Kontakt, Adresse, USt-ID; Admin wird benachrichtigt", async () => {
  assert.equal((await call("/api/sponsor/order", { method: "POST", body: {} })).status, 401);
  assert.equal((await call("/api/sponsor/order", { method: "POST", user: OTHER, body: { org_id: 1, package: SC.orderPackage(state()), billing: BILLING } })).status, 403);
  const s = state({ rt: 6, video: true });
  const r = await call("/api/sponsor/order", { method: "POST", user: OWNER, body: { org_id: 1, lang: "de", package: SC.orderPackage(s), billing: BILLING } });
  assert.equal(r.status, 200, JSON.stringify(r.json));
  assert.equal(r.json.net_cents, SC.compute(s, P).total * 100);
  assert.equal(r.json.currency, "USD");
  assert.match(r.json.invoice_url, /paypal\.com\/invoice/);
  const inv = JSON.parse(calls.find((c) => c.url.endsWith("/v2/invoicing/invoices")).init.body);
  assert.equal(inv.detail.currency_code, "USD");
  assert.match(inv.detail.invoice_number, /^M365FM-SP-\d+$/);
  assert.equal(inv.primary_recipients[0].billing_info.business_name, "Contoso GmbH");
  assert.equal(inv.primary_recipients[0].billing_info.name.full_name, "Erika Muster");
  assert.equal(inv.primary_recipients[0].billing_info.address.postal_code, "70597");
  assert.match(inv.detail.note, /DE123456789/);
  const base = inv.items.find((i) => i.name.startsWith("Basispaket"));
  assert.equal(base.unit_amount.value, (P.prices.base * 6).toFixed(2));
  assert.equal(base.discount.percent, "10");
  assert.equal(base.tax.percent, "19");
  const row = raw.prepare("SELECT * FROM sponsor_orders").get();
  assert.equal(row.paypal_invoice_id, "INV2-SPON");
  assert.equal(row.pay_status, "pending");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM mail_outbox WHERE user_id=1 AND subject LIKE 'Neue Sponsoring-Bestellung%'").get().n, 1);
});

test("Webhook INVOICING.INVOICE.PAID: Bestellung bezahlt, Platzierung im Sponsor-Dashboard; fremde Bestellungen unsichtbar", async () => {
  const s = state();
  const r = await call("/api/sponsor/order", { method: "POST", user: OWNER, body: { org_id: 1, package: SC.orderPackage(s), billing: BILLING } });
  const total = (r.json.total_cents / 100).toFixed(2);
  const hook = async (ev) => {
    const req = new Request("https://api-dub.m365.fm/paypal/webhook", { method: "POST", body: JSON.stringify(ev), headers: {
      "paypal-auth-algo": "a", "paypal-cert-url": "https://api.sandbox.paypal.com/c", "paypal-transmission-id": "t", "paypal-transmission-sig": "s", "paypal-transmission-time": "now" } });
    return (await handlePaypalWebhook(env, req)).json();
  };
  const bad = await hook({ id: "EV-0", event_type: "INVOICING.INVOICE.PAID", resource: { invoice: { id: "INV2-SPON", payments: { paid_amount: { value: total, currency_code: "EUR" } } } } });
  assert.equal(bad.result, "sponsor_amount_mismatch");
  const ok = await hook({ id: "EV-1", event_type: "INVOICING.INVOICE.PAID", resource: { invoice: { id: "INV2-SPON", payments: { paid_amount: { value: total, currency_code: "USD" } } } } });
  assert.equal(ok.result, "sponsor_paid");
  const order = raw.prepare("SELECT * FROM sponsor_orders").get();
  assert.equal(order.pay_status, "paid");
  const placement = raw.prepare("SELECT * FROM sponsor_placements WHERE id=?").get(order.placement_id);
  assert.equal(placement.org_id, 1);
  assert.equal((await hook({ id: "EV-1", event_type: "INVOICING.INVOICE.PAID", resource: { invoice: { id: "INV2-SPON" } } })).duplicate, true);
  // Sponsor-Dashboard (#177): Firma mit der bezahlten Bestellung sichtbar
  const url = new URL("https://api-dub.m365.fm/api/sponsor/dashboard");
  const dash = await (await handleSponsor(env, new Request(url), url, url.pathname, J, OWNER)).json();
  assert.equal(dash.orgs.length, 1);
  assert.ok(dash.orgs[0].placements.some((p) => p.id === order.placement_id));
  // Rechte: eigene Bestellungen ja, fremde nein, Admin-Liste nur fuer Admins
  assert.equal((await call("/api/sponsor/orders", { user: OWNER })).json.orders.length, 1);
  assert.equal((await call("/api/sponsor/orders", { user: OTHER })).json.orders.length, 0);
  assert.equal((await call("/api/admin/sponsor-orders", { user: OTHER })).status, 403);
  assert.equal((await call("/api/admin/sponsor-orders", { user: ADMIN })).json.orders[0].pay_status, "paid");
  // Erstattung: Platzierung endet
  const ref = await hook({ id: "EV-2", event_type: "INVOICING.INVOICE.REFUNDED", resource: { invoice: { id: "INV2-SPON" } } });
  assert.equal(ref.result, "sponsor_refunded");
  assert.equal(raw.prepare("SELECT pay_status FROM sponsor_orders").get().pay_status, "refunded");
});

test("Stornierte Rechnung: Bestellung storniert", async () => {
  await call("/api/sponsor/order", { method: "POST", user: OWNER, body: { org_id: 1, package: SC.orderPackage(state()), billing: BILLING } });
  const req = new Request("https://x/paypal/webhook", { method: "POST", body: JSON.stringify({ id: "EV-9", event_type: "INVOICING.INVOICE.CANCELLED", resource: { id: "INV2-SPON" } }), headers: {
    "paypal-auth-algo": "a", "paypal-cert-url": "c", "paypal-transmission-id": "t", "paypal-transmission-sig": "s", "paypal-transmission-time": "n" } });
  assert.equal((await (await handlePaypalWebhook(env, req)).json()).result, "sponsor_cancelled");
  assert.equal(raw.prepare("SELECT pay_status FROM sponsor_orders").get().pay_status, "cancelled");
});

test("Schalter ADS_BOOKING aus: Bestellung per Rechnung nicht verfügbar (503), kein PayPal-Aufruf", async () => {
  delete env.ADS_BOOKING;
  const r = await call("/api/sponsor/order", { method: "POST", user: OWNER, body: { org_id: 1, package: SC.orderPackage(state()), billing: BILLING } });
  assert.equal(r.status, 503); assert.equal(r.json.error, "not_available_yet");
  assert.equal(calls.length, 0);
});
