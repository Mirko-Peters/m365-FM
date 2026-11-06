// Mediadaten-Formular (/api/mediakit) mit zweiter Marke M365Con (#260): PDF-Schluessel je Marke, Mailtexte, Herkunft in D1,
// Kennzahlen-Vorschau GET /api/mediakit/summary und CORS fuer m365con.net nur auf diesen Routen und ohne Cookies.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleMediakit, BRANDS, brandOf } from "../src/mediakit.js";
import { cors, json, CON_ORIGINS } from "../src/util.js";
import { handleAds } from "../src/ads.js";

async function mkDb() {
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
  return { db, raw };
}

function pages(files) {
  return { async get(k) { return k in files ? { arrayBuffer: async () => new TextEncoder().encode(files[k]).buffer, json: async () => JSON.parse(files[k]) } : null; } };
}

function setup(files) {
  const sent = [];
  return mkDb().then(({ db, raw }) => ({
    raw, sent,
    env: { DB: db, SITE: "https://www.m365.fm", PAGES: pages(files), EMAIL: { send: async (m) => { sent.push(m); return { messageId: "x" }; } }, MAIL_FROM: "M365.FM <system@m365.fm>" },
  }));
}

const call = (env, path, init = {}, origin = "https://www.m365.fm") => {
  const url = new URL("https://api-dub.m365.fm" + path);
  const request = new Request(url, { ...init, headers: { origin, "cf-connecting-ip": "1.2.3." + Math.floor(Math.random() * 250), "content-type": "application/json", ...(init.headers || {}) } });
  const J = (d, s = 200, x) => json(d, s, env, request, x);
  return handleMediakit(env, request, url, url.pathname, null, J);
};
const body = (o) => ({ method: "POST", body: JSON.stringify({ name: "Ada Lovelace", company: "Contoso", email: `ada${Math.random().toString(36).slice(2, 8)}@contoso.com`, consent: true, lang: "de", source: "/m365con/sponsor/", ...o }) });

test("Marken: unbekannte Marke faellt auf M365.FM zurueck, Schluessel je Marke", () => {
  assert.equal(brandOf("m365con"), "m365con");
  assert.equal(brandOf("toString"), "m365fm");
  assert.equal(brandOf(undefined), "m365fm");
  assert.equal(BRANDS.m365fm.key("de"), "mediakit/m365fm-media-kit-de.pdf");
  assert.equal(BRANDS.m365con.key("en"), "mediakit/m365con/m365con-sponsor-deck-en.pdf");
});

test("brand=m365con: Con-PDF als Anhang, Con-Texte ohne Preise, Herkunft mit Praefix", async () => {
  const { env, sent, raw } = await setup({ "mediakit/m365con/m365con-sponsor-deck-de.pdf": "%PDF-con", "mediakit/m365fm-media-kit-de.pdf": "%PDF-fm" });
  const r = await call(env, "/api/mediakit", body({ brand: "m365con" }), "https://m365con.net");
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { ok: true, attached: true });
  assert.equal(r.headers.get("access-control-allow-origin"), "https://m365con.net");
  assert.equal(r.headers.get("access-control-allow-credentials"), null);
  const m = sent[0];
  assert.equal(m.subject, "Deine M365Con-Sponsoring- und Mediadaten");
  assert.equal(m.attachments[0].filename, "M365Con-Sponsor-Deck-DE.pdf");
  assert.ok(m.attachments[0].content instanceof Uint8Array, "Cloudflare bekommt Binaerdaten, keinen Base64-Text");
  assert.equal(new TextDecoder().decode(m.attachments[0].content), "%PDF-con");
  assert.match(m.html, /M365<span[^>]*>Con<\/span>/);
  assert.match(m.html, /\/de\/m365con\/sponsor\//);
  assert.doesNotMatch(m.html, /\$\s?\d|USD/);
  assert.equal(raw.prepare("SELECT source FROM mediakit_requests ORDER BY id DESC").get().source, "m365con:/m365con/sponsor/");
});

test("ohne Marke: unveraendert M365.FM-Mediadaten", async () => {
  const { env, sent, raw } = await setup({ "mediakit/m365fm-media-kit-en.pdf": "%PDF-fm" });
  const r = await call(env, "/api/mediakit", body({ lang: "en", source: "/media-kit/" }));
  assert.equal(r.status, 200);
  assert.equal(sent[0].subject, "Your M365.FM media kit");
  assert.equal(sent[0].attachments[0].filename, "M365.FM-Media-Kit-EN.pdf");
  assert.equal(raw.prepare("SELECT source FROM mediakit_requests ORDER BY id DESC").get().source, "/media-kit/");
});

test("Con-Deck fehlt in R2: Mail mit Link zur Con-Seite statt Anhang", async () => {
  const { env, sent } = await setup({});
  const r = await call(env, "/api/mediakit", body({ brand: "m365con", lang: "en" }));
  assert.deepEqual(await r.json(), { ok: true, attached: false });
  assert.match(sent[0].html, /www\.m365\.fm\/m365con\/sponsor\//);
});

test("Kennzahlen-Vorschau: nur Summen, gekuerzt, oeffentlich zwischengespeichert", async () => {
  const latest = { generated: "2026-11-05", brand: "m365con", partners: ["Secret Co"], events: [{ id: 1 }],
    kpis: [{ key: "reg_total", value: 4080, label: { en: "Registrations", de: "Anmeldungen" }, source: { en: "HeySummit", de: "HeySummit" }, period: { en: "3 editions", de: "3 Ausgaben" } },
           { key: "bad", value: -1 }, { key: "x<script>", value: 5, label: { en: "<b>x</b>" } }] };
  const { env } = await setup({ "mediakit/m365con/latest.json": JSON.stringify(latest) });
  const r = await call(env, "/api/mediakit/summary?brand=m365con", { method: "GET" }, "https://de.m365con.net");
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("cache-control"), "public, max-age=3600");
  assert.equal(r.headers.get("access-control-allow-origin"), "https://de.m365con.net");
  const d = await r.json();
  assert.deepEqual(Object.keys(d), ["generated", "brand", "kpis"]);
  assert.equal(d.kpis.length, 2);
  assert.deepEqual(d.kpis[0], { key: "reg_total", value: 4080, label: { en: "Registrations", de: "Anmeldungen" }, source: { en: "HeySummit", de: "HeySummit" }, period: { en: "3 editions", de: "3 Ausgaben" } });
  assert.ok(!JSON.stringify(d).includes("<"), "keine spitzen Klammern");
  assert.equal((await call(env, "/api/mediakit/summary", { method: "GET" })).status, 404, "M365.FM hat keine oeffentliche Vorschau");
  assert.equal((await call(env, "/api/mediakit/summary?brand=m365con", { method: "POST", body: "{}" })).status, 405);
});

test("CORS: m365con.net nur fuer die Mediadaten-Routen und ohne Cookies", () => {
  const req = (path, origin) => new Request("https://api-dub.m365.fm" + path, { headers: { origin } });
  const env = { SITE: "https://www.m365.fm" };
  for (const o of CON_ORIGINS) assert.equal(cors(env, req("/api/mediakit", o))["access-control-allow-origin"], o);
  for (const o of ["https://2026.m365con.net", "https://de.m365con.net", "https://m365con.net"]) assert.ok(CON_ORIGINS.includes(o), o);
  assert.equal(cors(env, req("/api/me", "https://m365con.net"))["access-control-allow-origin"], undefined);
  assert.equal(cors(env, req("/api/mediakit", "https://evil.m365con.net.example"))["access-control-allow-origin"], undefined);
  assert.equal(cors(env, req("/api/mediakit", "https://m365con.net"))["access-control-allow-credentials"], undefined);
  assert.equal(cors(env, req("/api/me", "https://www.m365.fm"))["access-control-allow-credentials"], "true", "eigene Seite unveraendert");
  assert.deepEqual(cors(env, { headers: new Headers({ origin: "https://m365con.net" }) }), { vary: "Origin" }, "ohne URL keine Ausnahme");
});

test("mailer: Resend bekommt Base64, Cloudflare Binaerdaten", async () => {
  const { sendMail, b64 } = await import("../src/mailer.js");
  const pdf = new TextEncoder().encode("%PDF-1.4 binary ÿ");
  assert.equal(atob(b64(pdf)), String.fromCharCode(...pdf));
  assert.equal(b64("JVBERi0="), "JVBERi0=");
  let body;
  const orig = globalThis.fetch;
  globalThis.fetch = async (_u, o) => { body = JSON.parse(o.body); return new Response(JSON.stringify({ id: "r1" }), { status: 200 }); };
  try {
    const r = await sendMail({ RESEND_API_KEY: "k", MAIL_FROM: "x@m365.fm", DB: { prepare: () => ({ bind: () => ({ run: async () => {} }), run: async () => {} }) } },
      { to: "a@b.test", subject: "s", html: "<p>x</p>", attachments: [{ filename: "a.pdf", content: pdf, type: "application/pdf" }] });
    assert.equal(r.ok, true);
    assert.equal(body.attachments[0].content, b64(pdf));
  } finally { globalThis.fetch = orig; }
});

// ---------------------------------------------------------------- Admin-Liste der Leads (personenbezogen)

const asUser = (env, path, user) => {
  const url = new URL("https://api-dub.m365.fm" + path), request = new Request(url, { headers: { origin: "https://www.m365.fm" } });
  const J = (d, s = 200, x) => json(d, s, env, request, x);
  return path.startsWith("/api/admin/ads/") ? handleAds(env, request, url, url.pathname, user, J) : handleMediakit(env, request, url, url.pathname, user, J);
};

test("Admin-Leads: Nicht-Admins und Anonyme bekommen 401/403, keine Daten", async () => {
  const { env, raw } = await setup({});
  await call(env, "/api/mediakit", body({ email: "geheim@contoso.com" })).catch(() => null);
  raw.prepare("INSERT INTO mediakit_requests(name,company,email,lang,source,created) VALUES('Ada','Contoso','geheim@contoso.com','de','/x/',1)").run();
  for (const path of ["/api/admin/mediakit", "/api/admin/ads/leads"]) {
    for (const user of [null, { id: 5, admin: false }]) {
      const r = await asUser(env, path, user);
      assert.ok([401, 403].includes(r.status), `${path} ${JSON.stringify(user)} -> ${r.status}`);
      assert.doesNotMatch(await r.text(), /geheim@contoso/);
    }
  }
});

test("Admin-Leads: Admin sieht die Mediadaten-Anfragen, neueste zuerst, Cache-Control no-store", async () => {
  const { env, raw } = await setup({});
  const ins = raw.prepare("INSERT INTO mediakit_requests(name,company,email,lang,source,created) VALUES(?,?,?,?,?,?)");
  ins.run("Alt", "A GmbH", "alt@a.de", "de", "/media-kit/", 100); ins.run("Neu", "B Inc", "neu@b.com", "en", "/sponsor/", 200);
  const r = await asUser(env, "/api/admin/mediakit", { id: 1, admin: true });
  assert.equal(r.status, 200); assert.equal(r.headers.get("cache-control"), "no-store");
  assert.deepEqual((await r.json()).items.map((x) => x.name), ["Neu", "Alt"]);
});

test("Admin-Leads: Reiter in assets/admin.js (nur Text, mailto, CSV, Filter) und keine oeffentliche Seite kennt den Endpunkt", () => {
  const js = readFileSync(new URL("../../assets/admin.js", import.meta.url), "utf8");
  assert.match(js, /\["mk", "Mediadaten-Anfragen"\]/); assert.match(js, /api\("\/api\/admin\/mediakit"\)/);
  assert.match(js, /"mailto:" \+ x\.email/); assert.match(js, /text\/csv/); assert.match(js, /Mediadaten-Anfragen \(Leads\)/);
  assert.doesNotMatch(js, /\binnerHTML\b|insertAdjacentHTML/);
  for (const f of readdirSync(new URL("../../assets/", import.meta.url)).filter((f) => f.endsWith(".js") && f !== "admin.js"))
    assert.doesNotMatch(readFileSync(new URL("../../assets/" + f, import.meta.url), "utf8"), /\/api\/admin\/mediakit/, f);
});
