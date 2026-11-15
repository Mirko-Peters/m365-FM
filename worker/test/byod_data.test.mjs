// Blog auf der eigenen Domain: Datenmodell (blog_domains, blog_revenue). Erloese nach Art getrennt, keine Auszahlung.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { recordRevenue } from "../src/byod_revenue.js";

async function makeDb() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = { prepare(sql) { const st = raw.prepare(sql); let args = []; const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: st.all(...args) }), first: async () => st.get(...args) ?? null,
    run: async () => { const r = st.run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; } };
  raw.exec("INSERT INTO users(id,provider,sub,name,created) VALUES(1,'g','1','Anna',1),(2,'g','2','Ben',1)");
  raw.exec("INSERT INTO blog_domains(user_id,domain,status,token,created,updated) VALUES(1,'blog.anna.de','active','t1',1,1)");
  return { db, raw };
}

test("Erloese: Tabelle trennt Banner-Werbung und Sponsoring; Sponsoring ohne Autorenanteil; keine Auszahlungstabelle", async () => {
  const { db, raw } = await makeDb();
  const a = await recordRevenue(db, { userId: 1, domainId: 1, kind: "banner_ad", period: "2026-11", cents: 1000 });
  assert.equal(a.ok, true); assert.equal(a.author_cents, 700); assert.equal(a.platform_cents, 300);
  const s = await recordRevenue(db, { userId: 1, domainId: 1, kind: "sponsoring", period: "2026-11", cents: 5000 });
  assert.equal(s.author_cents, 0); assert.equal(s.platform_cents, 5000);
  assert.deepEqual(raw.prepare("SELECT kind,SUM(author_cents) a,SUM(platform_cents) p FROM blog_revenue GROUP BY kind ORDER BY kind").all().map((x) => ({ ...x })), [{ kind: "banner_ad", a: 700, p: 300 }, { kind: "sponsoring", a: 0, p: 5000 }]);
  assert.deepEqual(await recordRevenue(db, { userId: 1, kind: "spende", period: "2026-11", cents: 1 }), { error: "bad_revenue" });
  assert.deepEqual(await recordRevenue(db, { userId: 1, kind: "banner_ad", period: "2026-13", cents: 1 }), { error: "bad_revenue" });
  assert.deepEqual(await recordRevenue(db, { userId: 1, kind: "banner_ad", period: "2026-11", cents: 1, currency: "eur" }), { error: "bad_currency" });
  // die Datenbank selbst verhindert einen Autorenanteil bei Sponsoring und falsche Summen
  assert.throws(() => raw.exec("INSERT INTO blog_revenue(user_id,kind,period,gross_cents,author_bp,platform_bp,author_cents,platform_cents,created) VALUES(1,'sponsoring','2026-11',100,7000,3000,70,30,1)"));
  assert.throws(() => raw.exec("INSERT INTO blog_revenue(user_id,kind,period,gross_cents,author_bp,platform_bp,author_cents,platform_cents,created) VALUES(1,'banner_ad','2026-11',100,7000,3000,60,30,1)"));
  assert.throws(() => raw.exec("INSERT INTO blog_revenue(user_id,kind,period,gross_cents,author_bp,platform_bp,author_cents,platform_cents,created) VALUES(1,'sonstiges','2026-11',100,0,10000,0,100,1)"));
  const tables = raw.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map((x) => x.name);
  assert.ok(!tables.some((t) => /payout|auszahl/i.test(t)), "keine Auszahlung gebaut");
});

test("Datenmodell: Domain eindeutig, Status begrenzt", async () => {
  const { raw } = await makeDb();
  assert.throws(() => raw.exec("INSERT INTO blog_domains(user_id,domain,token,created,updated) VALUES(2,'blog.anna.de','x',1,1)"));
  assert.throws(() => raw.exec("INSERT INTO blog_domains(user_id,domain,status,token,created,updated) VALUES(2,'neu.ben.de','frei','x',1,1)"));
  raw.exec("INSERT INTO blog_domains(user_id,domain,token,created,updated) VALUES(2,'neu.ben.de','x',1,1)");
  assert.equal(raw.prepare("SELECT status FROM blog_domains WHERE domain='neu.ben.de'").get().status, "pending");
});
