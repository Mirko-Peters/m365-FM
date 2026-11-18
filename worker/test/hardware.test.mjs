// Hardware-Sponsoring (/api/hardware): Bewerbung speichern, Pflichtfelder (Versandzusage, https-Link, Einwilligung), Honigtopf,
// Bestaetigungsmail, Admin-Liste/Status/Loeschen nur fuer Admins. Laeuft gegen eine In-Memory-SQLite mit allen Migrationen.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleHardware, HW_STATUS } from "../src/hardware.js";
import { json } from "../src/util.js";

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = {
    prepare(sql) {
      const st = raw.prepare(sql); let args = [];
      const o = {
        bind(...a) { args = a; return o; },
        all: async () => ({ results: st.all(...args) }),
        first: async () => st.get(...args) ?? null,
        run: async () => { const r = st.run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; },
      };
      return o;
    },
  };
  const sent = [];
  return { raw, sent, env: { DB: db, SITE: "https://www.m365.fm", EMAIL: { send: async (m) => { sent.push(m); return { messageId: "x" }; } }, MAIL_FROM: "M365.FM <system@m365.fm>" } };
}

const call = (env, path, init = {}, user = null) => {
  const url = new URL("https://api-dub.m365.fm" + path);
  const request = new Request(url, { ...init, headers: { origin: "https://www.m365.fm", "cf-connecting-ip": "9.8.7." + Math.floor(Math.random() * 250), "content-type": "application/json", ...(init.headers || {}) } });
  return handleHardware(env, request, url, url.pathname, user, (d, s = 200, x) => json(d, s, env, request, x));
};
const form = (o = {}) => ({ method: "POST", body: JSON.stringify({ name: "Ada Lovelace", company: "Contoso Audio", email: `ada${Math.random().toString(36).slice(2, 8)}@contoso.com`, product: "Contoso Headset X1", product_url: "https://contoso.com/x1", category: "headset", quantity: 2, ship_by: "2026-12-15", offers: ["giveaway", "video", "bogus"], message: "Hello", ships: true, consent: true, lang: "de", source: "/de/hardware/", ...o }) });

test("Bewerbung wird gespeichert, Angebote gefiltert, Bestaetigung geht raus", async () => {
  const { env, raw, sent } = await setup();
  const r = await call(env, "/api/hardware", form());
  assert.equal(r.status, 200);
  const row = raw.prepare("SELECT * FROM hardware_requests").get();
  assert.equal(row.product, "Contoso Headset X1");
  assert.equal(row.quantity, 2);
  assert.equal(row.offers, "giveaway,video");
  assert.equal(row.status, "open");
  assert.equal(row.sent, 1);
  assert.equal(sent.length, 1);
  assert.match(JSON.stringify(sent[0]), /hardware\/how-we-test/);
});

test("Ohne Versandzusage, ohne https-Link, ohne Einwilligung: keine Bewerbung", async () => {
  const { env, raw } = await setup();
  for (const [bad, err] of [[{ ships: false }, "ships"], [{ product_url: "http://contoso.com/x1" }, "product_url"], [{ product_url: "javascript:alert(1)" }, "product_url"], [{ consent: false }, "consent"], [{ product: "" }, "product"], [{ email: "kein-mail" }, "email"]]) {
    const r = await call(env, "/api/hardware", form(bad));
    assert.equal(r.status, 400);
    assert.equal((await r.json()).error, err);
  }
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM hardware_requests").get().n, 0);
});

test("Honigtopf: Bot-Eintrag wird verworfen, ohne Fehlermeldung", async () => {
  const { env, raw } = await setup();
  const r = await call(env, "/api/hardware", form({ website: "http://spam" }));
  assert.equal(r.status, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM hardware_requests").get().n, 0);
});

test("Mail aus: Bewerbung bleibt gespeichert, Fehler steht in der Zeile", async () => {
  const { env, raw } = await setup();
  delete env.EMAIL; delete env.MAIL_FROM;
  const r = await call(env, "/api/hardware", form());
  assert.equal(r.status, 200);
  const row = raw.prepare("SELECT sent, err FROM hardware_requests").get();
  assert.equal(row.sent, 0);
  assert.equal(row.err, "mail_off");
});

test("Admin: nur Admins sehen die Liste, Status setzen und endgueltig loeschen", async () => {
  const { env, raw } = await setup();
  await call(env, "/api/hardware", form());
  assert.equal((await call(env, "/api/admin/hardware", { method: "GET" }, null)).status, 403);
  assert.equal((await call(env, "/api/admin/hardware", { method: "GET" }, { admin: false })).status, 403);
  const admin = { admin: true };
  const list = await (await call(env, "/api/admin/hardware", { method: "GET" }, admin)).json();
  assert.equal(list.items.length, 1);
  const id = list.items[0].id;
  for (const st of HW_STATUS) {
    const r = await call(env, "/api/admin/hardware", { method: "POST", body: JSON.stringify({ action: "status", id, status: st }) }, admin);
    assert.equal(r.status, 200);
    assert.equal(raw.prepare("SELECT status FROM hardware_requests WHERE id=?").get(id).status, st);
  }
  assert.equal((await call(env, "/api/admin/hardware", { method: "POST", body: JSON.stringify({ action: "status", id, status: "closed_won" }) }, admin)).status, 400);
  assert.equal((await call(env, "/api/admin/hardware", { method: "POST", body: JSON.stringify({ action: "delete", id }) }, admin)).status, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM hardware_requests").get().n, 0);
});

test("Zusage: Status committed sendet einmal die Standard-Mail mit Lieferadresse", async () => {
  const { env, raw, sent } = await setup();
  await call(env, "/api/hardware", form());                 // Deutsch
  await call(env, "/api/hardware", form({ lang: "en", product: "Contoso Cam", name: "Bob" }));
  sent.length = 0;
  const admin = { admin: true };
  const post = (id, status) => call(env, "/api/admin/hardware", { method: "POST", body: JSON.stringify({ action: "status", id, status }) }, admin);
  const [a, b] = raw.prepare("SELECT id FROM hardware_requests ORDER BY id").all().map((x) => x.id);

  assert.equal((await (await post(a, "received")).json()).mail, "");   // andere Status: keine Mail
  assert.equal(sent.length, 0);

  assert.equal((await (await post(a, "committed")).json()).mail, "sent");
  assert.equal(sent.length, 1);
  const m = JSON.stringify(sent[0]);
  for (const s of ["M365.fm", "Mirko Peters", "Kremmlerstrasse 58", "70597 Stuttgart", "Germany", "Zusage:", "nicht zurückgeschickt", "3 Werktage"]) assert.ok(m.includes(s), s);
  assert.equal(raw.prepare("SELECT accept_sent FROM hardware_requests WHERE id=?").get(a).accept_sent, 1);

  assert.equal((await (await post(a, "committed")).json()).mail, "already");   // kein Doppelversand
  assert.equal(sent.length, 1);

  assert.equal((await (await post(b, "committed")).json()).mail, "sent");     // Englisch
  const e = JSON.stringify(sent[1]);
  assert.ok(e.includes("Accepted:") && e.includes("Kremmlerstrasse 58") && e.includes("not returned"));
});

test("Zusage ohne Mailversand: Status wird gesetzt, Antwort meldet mail=off", async () => {
  const { env, raw } = await setup();
  await call(env, "/api/hardware", form());
  delete env.EMAIL; delete env.MAIL_FROM;
  const id = raw.prepare("SELECT id FROM hardware_requests").get().id;
  const r = await call(env, "/api/admin/hardware", { method: "POST", body: JSON.stringify({ action: "status", id, status: "committed" }) }, { admin: true });
  assert.equal(r.status, 200);
  assert.equal((await r.json()).mail, "off");
  const row = raw.prepare("SELECT status,accept_sent,accept_err FROM hardware_requests WHERE id=?").get(id);
  assert.deepEqual({ ...row }, { status: "committed", accept_sent: 0, accept_err: "mail_off" });
});
