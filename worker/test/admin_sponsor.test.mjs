// T37 Sponsor: Reiter Sponsor-Anfragen in der Verwaltung (assets/admin.js) und die Benachrichtigung (worker/src/sponsor.js).
// admin.js laeuft unveraendert in node:vm mit einem kleinen Schein-DOM ohne HTML-Parser (innerHTML wirft). Seine API-Aufrufe gehen an die
// echten Handler (handleSponsor, handleAdminPanel) auf SQLite mit allen Migrationen. Geprueft werden Paket v1 der Sponsor-Seite und aeltere Zeilen.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import vm from "node:vm";
import { handleSponsor, sponsorPackageDetails } from "../src/sponsor.js";
import { handleAdminPanel } from "../src/adminpanel.js";

const ADMIN_JS = readFileSync(new URL("../../assets/admin.js", import.meta.url), "utf8");
const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

// Paket v1, wie es assets/sponsor-calc.js buildPackage() schickt (Mitschnitt der Sponsor-Seite, de), mit einem HTML-Versuch im eigenen Thema
const V1 = {
  v: "1", goal: "Brand visibility",
  topics: ["Your brand name (easy, example rating)", "Teams Phone (hard, example rating)", "<img src=x onerror=\"window.__xss=1\">Mein Produkt (own topic, to be rated)", "Microsoft Intune (not rated yet)"],
  duration: "12 months",
  components: ["Base package × 4 topics – $12,000/month", "Video package × 4 topics – $4,000/month", "Runtime discount −15 % – −$2,400/month", "PR articles × 12 (one-time) – $6,000"],
  extras: ["LinkedIn newsletter × 1 – $100/month", "14 language shows – $300/month", "Sponsor dashboard (one-time) – $500"],
  monthlyUsd: "$14,000", oneOffUsd: "$6,500", totalUsd: "$174,500", discount: "15%",
  effect: "AI citations in ~6–8 weeks, rankings in ~4.1–8.3 months", page: "/de/sponsor/",
};
// Aeltere Zeilen (vor v1): Form aus PR #126, Entwurf mit Zahlen, leer, kaputt, Liste aus Objekten (vom Server zu null gemacht)
const OLD = [
  { company: "Contoso Alt", lang: "de", message: "Bitte melden.", package: JSON.stringify({ ziel: "Azure", themen: ["Cloud"], laufzeit: "3 Monate", bausteine: ["Podcast"], preisMonat: 500, gesamtpreis: 1500 }) },
  { company: "Zahlen GmbH", lang: "en", message: "", package: JSON.stringify({ v: 1, currency: "USD", goal: "AI citations", topics: ["Microsoft Teams Phone"], months: 6, components: ["Base package × 1", "Video package × 1"], monthlyUsd: 3900, oneOffUsd: 1000, totalUsd: 24400, lines: { base: 3000, video: 1000, discount: -400 }, estimate: { geo: "7-9 weeks" }, video: true, dashboard: false }) },
  { company: "Leer AG", lang: "fr", message: "", package: "{}" },
  { company: "Kaputt KG", lang: "de", message: "", package: "kaputt{" },
  { company: "Null SE", lang: "xx", message: "", package: JSON.stringify({ goal: "Leads", components: [null, null], topics: [] }) },
];

function sqliteDb(raw) {   // wie D1: Fehler (z. B. fehlende Tabelle) erst beim Ausfuehren, als abgelehntes Promise
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

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  raw.exec("INSERT INTO users(id,provider,sub,name,role,banned,created) VALUES(1,'google','sub1','Admin 1','admin',0,1)");
  raw.exec("INSERT INTO mail_addr(user_id,email,verified,created) VALUES(1,'admin1@example.com',1,1)");
  const env = { DB: sqliteDb(raw), SESSION_SECRET: "test-secret", SITE: "https://www.m365.fm", ADMIN_SUBS: "" };
  return { raw, env };
}
function insertOld(raw, rows, created = 1700000000) {
  const st = raw.prepare("INSERT INTO sponsor_requests(created,company,name,email,message,package,status,ip_hash,lang) VALUES(?,?,?,?,?,?,?,?,?)");
  rows.forEach((r, i) => st.run(created - i * 60, r.company, r.name || "Alt Person", r.email || `alt${i}@example.com`, r.message || "", r.package, r.status || "new", "0".repeat(64), r.lang || "de"));
}
async function postV1(env, extra = {}) {
  const body = { company: "Acme Test GmbH", name: "Test Person", email: "test@example.com", message: "Hallo\nBitte ein Angebot.", package: V1, website: "", lang: "de", ...extra };
  const req = new Request("https://api.example/api/sponsor/request", { method: "POST", headers: { "cf-connecting-ip": "203.0.113.9", "content-type": "application/json", "x-requested-with": "m365" }, body: JSON.stringify(body) });
  return handleSponsor(env, req, new URL(req.url), "/api/sponsor/request", J);
}

// ---------- Schein-DOM: genau so viel, wie admin.js braucht ----------
function fakeDom() {
  class Text { constructor(t) { this.nodeType = 3; this.data = String(t); this.parentNode = null; } get textContent() { return this.data; } }
  const one = (el, s) => {
    const m = s.match(/^([a-z0-9]*)((?:\.[\w-]+)*)((?:\[[\w-]+(?:=["']?[^\]"']*["']?)?\])*)$/i); if (!m) throw new Error("Selektor nicht unterstuetzt: " + s);
    if (m[1] && el.tagName !== m[1].toUpperCase()) return false;
    for (const c of m[2].match(/\.[\w-]+/g) || []) if (!el.className.split(/\s+/).includes(c.slice(1))) return false;
    for (const a of m[3].match(/\[[^\]]+\]/g) || []) { const [, k, v] = a.match(/^\[([\w-]+)(?:=["']?([^"']*)["']?)?\]$/); const got = el.getAttribute(k); if (got == null || (v !== undefined && got !== v)) return false; }
    return true;
  };
  class El {
    constructor(tag) { this.nodeType = 1; this.tagName = tag.toUpperCase(); this.attrs = {}; this.childNodes = []; this.parentNode = null; this.listeners = {}; this.className = ""; this.selected = false; this.disabled = false; }
    setAttribute(k, v) { if (k === "class") this.className = String(v); else this.attrs[k] = String(v); }
    getAttribute(k) { return k === "class" ? this.className : Object.hasOwn(this.attrs, k) ? this.attrs[k] : null; }
    get hidden() { return Object.hasOwn(this.attrs, "hidden"); }
    set hidden(v) { if (v) this.attrs.hidden = ""; else delete this.attrs.hidden; }
    appendChild(c) { if (c.parentNode) c.parentNode.removeChild(c); c.parentNode = this; this.childNodes.push(c); return c; }
    append(...cs) { for (const c of cs) this.appendChild(typeof c === "string" ? new Text(c) : c); }
    removeChild(c) { const i = this.childNodes.indexOf(c); if (i >= 0) this.childNodes.splice(i, 1); c.parentNode = null; return c; }
    remove() { if (this.parentNode) this.parentNode.removeChild(this); }
    get firstChild() { return this.childNodes[0] || null; }
    get children() { return this.childNodes.filter((n) => n.nodeType === 1); }
    get textContent() { return this.childNodes.map((n) => n.textContent).join(""); }
    set textContent(t) { for (const n of this.childNodes) n.parentNode = null; this.childNodes = []; if (t != null && t !== "") this.appendChild(new Text(t)); }
    get innerHTML() { throw new Error("innerHTML in admin.js"); }
    set innerHTML(_) { throw new Error("innerHTML in admin.js"); }
    insertAdjacentHTML() { throw new Error("insertAdjacentHTML in admin.js"); }
    addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
    fire(type) { const ev = { type, target: this, currentTarget: this, preventDefault() {} }; for (const fn of this.listeners[type] || []) fn(ev); if (typeof this["on" + type] === "function") this["on" + type](ev); }
    get value() {
      if (this.tagName === "SELECT") { const o = this.all("option"); const s = o.find((x) => x.selected) || o[0]; return s ? s.value : ""; }
      if (this.tagName === "OPTION") return this.getAttribute("value") ?? this.textContent;
      return this._value ?? "";
    }
    set value(v) { if (this.tagName === "SELECT") for (const o of this.all("option")) o.selected = o.value === String(v); else this._value = String(v); }
    matches(sel) {
      const parts = sel.trim().split(/\s+/); if (!one(this, parts.at(-1))) return false;
      let i = parts.length - 2; for (let n = this.parentNode; i >= 0 && n; n = n.parentNode) if (n.nodeType === 1 && one(n, parts[i])) i--;
      return i < 0;
    }
    all(sel) { const out = []; const walk = (n) => { for (const c of n.children) { if (c.matches(sel)) out.push(c); walk(c); } }; walk(this); return out; }
    querySelectorAll(sel) { return this.all(sel); }
    querySelector(sel) { return this.all(sel)[0] || null; }
    scrollIntoView() {}
  }
  const root = new El("div"); root.attrs.id = "adm";
  return { root, document: { createElement: (t) => new El(t), createTextNode: (t) => new Text(t), getElementById: (id) => (id === "adm" ? root : null), head: new El("head") } };
}

async function bootAdmin(env, hash, overrideFetch) {
  const { root, document } = fakeDom(), calls = [], location = { hash };
  const fetch = async (url, o = {}) => {   // admin.js -> echte Handler
    const u = new URL(url); calls.push({ path: u.pathname + u.search, method: o.method || "GET", body: o.body, headers: o.headers || {}, credentials: o.credentials });
    if (overrideFetch) {
      const overridden = await overrideFetch(u, o);
      if (overridden) return overridden;
    }
    const res = await handleAdminPanel(env, new Request(u, { method: o.method || "GET", headers: o.headers, body: o.body }), u, u.pathname, { id: 1, admin: true }, J);
    return res || J({ error: "not_found" }, 404);
  };
  const ctx = vm.createContext({ window: { M365ADM: { api: "https://api.test", base: "" }, confirm: () => true, prompt: () => "" }, document, location, fetch, setTimeout });
  vm.runInContext(ADMIN_JS, ctx, { filename: "assets/admin.js" });
  return { root, calls, location };
}
async function until(cond, what) { for (let i = 0; i < 400; i++) { if (cond()) return; await new Promise((r) => setTimeout(r, 2)); } assert.fail("Zeitueberschreitung: " + what); }
const pane = (root) => root.all("section").find((s) => s.querySelector("h2")?.textContent === "Sponsor-Anfragen");
const texts = (el, sel) => el.all(sel).map((x) => x.textContent);
const bausteine = (detail) => texts(detail, "p").find((t) => t.startsWith("Bausteine: "));
function table(root) {   // je Anfrage zwei Zeilen: Hauptzeile und Detailzeile
  const p = pane(root), tb = p.querySelector("tbody"), trs = tb.children;
  const items = [];
  for (let i = 0; i + 1 < trs.length; i += 2) items.push({ main: trs[i], cells: trs[i].children, detail: trs[i + 1] });
  return { p, head: texts(p.querySelector("thead"), "th"), items, byCompany: (c) => items.find((x) => x.cells[1].textContent === c), count: p.querySelector("p span.mut")?.textContent, buttons: p.all("p button"), filter: p.querySelector("select") };
}

async function withoutNet(fn) {   // overview laedt entities.json von der Seite: im Test nie ins Netz
  const old = globalThis.fetch; globalThis.fetch = async () => { throw new Error("kein Netz im Test"); };
  try { await fn(); } finally { globalThis.fetch = old; }
}

test("sponsor admin: admin.js setzt Inhalte nur als Text (kein innerHTML)", () => {
  assert.doesNotMatch(ADMIN_JS, /\binnerHTML\b|insertAdjacentHTML|outerHTML|document\.write/);
});

test("Event-Importe: Kandidat bietet Freigabe und Ablehnung ohne ReferenceError", () => withoutNet(async () => {
  const { env } = await setup(), called = [];
  const fetch = async (url, options) => {
    if (url.pathname === "/api/admin/panel/event-imports" && !options.method) return J({ items: [{
      fp: "a".repeat(32), data: { title: "Community Day", start: "2027-05-01", sessions: [], sources: [{ source: "community_days" }] }, duplicates: [],
    }] });
    if (url.pathname === "/api/admin/panel/event-imports/decide") { called.push(JSON.parse(options.body).action); return J({ ok: true }); }
    return null;
  };
  const { root } = await bootAdmin(env, "#events", fetch);
  await until(() => root.all("button").some((button) => button.textContent === "Freigeben"), "Event-Aktionen");
  const actions = root.all("button");
  actions.find((button) => button.textContent === "Freigeben").fire("click");
  await until(() => called.length === 1, "Freigabeaufruf");
  assert.deepEqual(called, ["approve"]);
  assert.ok(actions.some((button) => button.textContent === "Ablehnen"));
}));

test("sponsor admin: Paket v1 der Sponsor-Seite - Nachricht, Sprache, Themen, Preise, ganzes Paket aufklappbar (SQLite + Schein-DOM)", () => withoutNet(async () => {
  const { raw, env } = await setup();
  assert.equal((await postV1(env)).status, 200);
  const stored = raw.prepare("SELECT id,package,lang,message FROM sponsor_requests").get();
  assert.deepEqual(JSON.parse(stored.package), V1, "Paket v1 passt unveraendert durch cleanPackage (Tiefe, Schluessel, Laengen)");
  assert.equal(stored.lang, "de"); assert.equal(stored.message, "Hallo\nBitte ein Angebot.");

  const { root, calls, location } = await bootAdmin(env, "#sponsor");
  await until(() => pane(root)?.querySelector("tbody tr"), "Tabelle");
  assert.equal(location.hash, "sponsor");
  const get = calls.find((c) => c.path.startsWith("/api/admin/panel/sponsor-requests"));
  assert.equal(get.path, "/api/admin/panel/sponsor-requests?limit=50&offset=0");
  assert.equal(get.credentials, "include"); assert.equal(get.headers["x-requested-with"], "m365");

  const t = table(root);
  assert.deepEqual(t.head, ["Datum", "Firma", "Name", "E-Mail", "Sprache", "Paket", "Themen", "Preis", "Status"]);
  assert.equal(t.items.length, 1);
  const { cells, detail } = t.items[0];
  assert.equal(cells.length, 9);
  assert.match(cells[0].textContent, /^\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}$/, "Datum mit Uhrzeit");
  assert.equal(cells[1].textContent, "Acme Test GmbH"); assert.equal(cells[2].textContent, "Test Person");
  assert.equal(cells[3].querySelector("a").getAttribute("href"), "mailto:test@example.com");
  assert.equal(cells[4].textContent, "Deutsch (de)/de/sponsor/", "Sprache plus Seite, von der die Anfrage kam");
  assert.equal(cells[5].textContent, "Brand visibility · 12 months");
  assert.equal(bausteine(detail), "Bausteine: " + [...V1.components, ...V1.extras].join(" · "), "Bausteine und Extras in voller Breite");
  assert.deepEqual(texts(cells[6], "li"), V1.topics, "alle Themen, das HTML im eigenen Thema nur als Text");
  assert.deepEqual(texts(cells[7], "div"), ["$14,000/Monat", "$6,500 einmalig", "$174,500 gesamt"], "monatlich, einmalig, gesamt");
  assert.equal(cells[8].querySelector("select").value, "new");

  assert.equal(detail.children.length, 1); assert.equal(detail.children[0].getAttribute("colspan"), "9");
  const note = detail.querySelector("p");
  assert.equal(note.textContent, "Nachricht: Hallo\nBitte ein Angebot.");
  assert.match(note.getAttribute("style"), /white-space:pre-wrap/, "Zeilenumbrueche der Nachricht bleiben sichtbar");
  const det = detail.querySelector("details");
  assert.equal(det.children[0].tagName, "SUMMARY"); assert.equal(det.children[0].textContent, "Ganzes Paket (12 Angaben)");
  assert.equal(det.getAttribute("open"), null, "Paket ist zugeklappt");
  const dts = texts(det.querySelector("dl"), "dt"), dds = det.querySelector("dl").children.filter((x) => x.tagName === "DD");
  assert.deepEqual(dts, ["Version", "Ziel", "Themen", "Laufzeit", "Bausteine", "Extras", "Pro Monat", "Einmalig", "Gesamt", "Rabatt", "Wirkung (Schätzung)", "Seite"]);
  assert.equal(dds[10].textContent, V1.effect); assert.equal(dds[9].textContent, "15%"); assert.deepEqual(texts(dds[2], "li"), V1.topics);
  assert.deepEqual(JSON.parse(det.querySelector("details pre").textContent), V1, "Rohdaten zeigen das gespeicherte Paket vollstaendig");
  assert.equal(root.all("img").length, 0, "kein Element aus dem Anfragetext");
  raw.close();
}));

test("sponsor admin: aeltere Zeilen ohne v1-Schluessel werden weiter angezeigt (SQLite + Schein-DOM)", () => withoutNet(async () => {
  const { raw, env } = await setup();
  insertOld(raw, OLD);
  const { root } = await bootAdmin(env, "#sponsor");
  await until(() => pane(root)?.querySelector("tbody tr"), "Tabelle");
  const t = table(root);
  assert.equal(t.items.length, OLD.length); assert.equal(t.count, `1–${OLD.length} von ${OLD.length}`);
  const row = (c) => { const x = t.byCompany(c); assert.ok(x, c); return x; };
  const cell = (c, i) => row(c).cells[i].textContent;

  let r = row("Contoso Alt");   // Form aus PR #126 (deutsche Schluessel, Zahlen)
  assert.equal(r.cells[5].textContent, "Azure · 3 Monate"); assert.equal(bausteine(r.detail), "Bausteine: Podcast");
  assert.deepEqual(texts(r.cells[6], "li"), ["Cloud"]);
  assert.deepEqual(texts(r.cells[7], "div"), ["$500/Monat", "$1,500 gesamt"]);
  assert.equal(r.detail.querySelector("p").textContent, "Nachricht: Bitte melden.");

  r = row("Zahlen GmbH");   // Entwurf mit Zahlen, months statt duration, verschachtelte Objekte, Wahrheitswerte
  assert.equal(r.cells[5].querySelector("b").textContent, "AI citations · 6 Monate");
  assert.equal(cell("Zahlen GmbH", 4), "Englisch (en)");
  assert.deepEqual(texts(r.cells[7], "div"), ["$3,900/Monat", "$1,000 einmalig", "$24,400 gesamt"]);
  assert.equal(r.detail.querySelector("p").textContent, "Keine Nachricht.");
  const dl = r.detail.querySelector("details dl"), pairs = {};
  dl.children.forEach((x, i, all) => { if (x.tagName === "DT") pairs[x.textContent] = all[i + 1]; });
  assert.equal(pairs.lines.querySelector("dl").textContent, "base3000video1000discount-400", "verschachteltes Objekt als eigene Liste");
  assert.equal(pairs.video.textContent, "ja"); assert.equal(pairs.dashboard.textContent, "nein"); assert.equal(pairs.Version.textContent, "1");

  r = row("Leer AG");   // leeres Paket
  assert.deepEqual([cell("Leer AG", 4), cell("Leer AG", 5), cell("Leer AG", 6), cell("Leer AG", 7)], ["Französisch (fr)", "–", "–", "–"]);
  assert.equal(r.detail.querySelector("summary").textContent, "Ganzes Paket (0 Angaben)"); assert.match(r.detail.querySelector("details").textContent, /\(keine Angaben\)/);

  r = row("Kaputt KG");   // kein JSON
  assert.equal(cell("Kaputt KG", 5), "kaputt{"); assert.equal(cell("Kaputt KG", 7), "–");
  assert.equal(r.detail.querySelector("summary").textContent, "Paket (nicht lesbar, Rohdaten)"); assert.equal(r.detail.querySelector("pre").textContent, "kaputt{");

  r = row("Null SE");   // Liste aus Objekten (vom Server zu null), unbekannte Sprache
  assert.equal(cell("Null SE", 5), "Leads"); assert.equal(cell("Null SE", 6), "–"); assert.equal(cell("Null SE", 4), "xx"); assert.equal(bausteine(r.detail), undefined);
  raw.close();
}));

test("sponsor admin: Status-Auswahl speichert, Filter und Blaettern bleiben (SQLite + Schein-DOM)", () => withoutNet(async () => {
  const { raw, env } = await setup();
  assert.equal((await postV1(env)).status, 200);
  insertOld(raw, Array.from({ length: 52 }, (_, i) => ({ company: `Firma ${i}`, package: JSON.stringify({ goal: "AI visibility", monthlyUsd: "$1,000" }) })));
  const { root, calls } = await bootAdmin(env, "#sponsor");
  await until(() => pane(root)?.querySelector("tbody tr"), "Tabelle");
  let t = table(root);
  const [prev, next] = t.buttons;
  assert.equal(t.count, "1–50 von 53"); assert.equal(t.items.length, 50); assert.equal(prev.disabled, true); assert.equal(next.disabled, false);

  const id = raw.prepare("SELECT id FROM sponsor_requests WHERE company='Acme Test GmbH'").get().id;
  const sel = t.byCompany("Acme Test GmbH").cells[8].querySelector("select");
  sel.value = "contacted"; sel.fire("change");
  await until(() => raw.prepare("SELECT status FROM sponsor_requests WHERE id=?").get(id).status === "contacted", "Status gespeichert");
  const post = calls.find((c) => c.method === "POST");
  assert.equal(post.path, "/api/admin/panel/sponsor-requests/status"); assert.deepEqual(JSON.parse(post.body), { id, status: "contacted" });
  await until(() => table(root).byCompany("Acme Test GmbH")?.cells[8].querySelector("select").value === "contacted", "Liste neu geladen");

  next.onclick(); await until(() => table(root).count === "51–53 von 53", "Seite 2");
  t = table(root); assert.equal(t.items.length, 3); assert.equal(prev.disabled, false); assert.equal(next.disabled, true);
  assert.equal(calls.at(-1).path, "/api/admin/panel/sponsor-requests?limit=50&offset=50");
  assert.deepEqual(texts(t.items[0].cells[7], "div"), ["$1,000/Monat"]);
  prev.onclick(); await until(() => table(root).count === "1–50 von 53", "zurueck auf Seite 1");

  t.filter.value = "contacted"; t.filter.fire("change");
  await until(() => table(root).count === "1–1 von 1", "Filter");
  assert.equal(calls.at(-1).path, "/api/admin/panel/sponsor-requests?limit=50&offset=0&status=contacted");
  assert.equal(table(root).items[0].cells[1].textContent, "Acme Test GmbH");
  t.filter.value = "won"; t.filter.fire("change");
  await until(() => table(root).count === "0 Anfragen", "leerer Filter");
  assert.equal(pane(root).querySelector("tbody td").getAttribute("colspan"), "9");
  raw.close();
}));

test("sponsor admin: Uebersicht zaehlt neue Sponsor-Anfragen und fuehrt zum Reiter (SQLite + Schein-DOM)", () => withoutNet(async () => {
  const { raw, env } = await setup();
  insertOld(raw, [{ company: "A", package: "{}" }, { company: "B", package: "{}" }, { company: "C", package: "{}", status: "contacted" }, { company: "D", package: "{}", status: "spam" }]);
  const ov = await handleAdminPanel(env, new Request("https://api.test/api/admin/panel/overview"), new URL("https://api.test/api/admin/panel/overview"), "/api/admin/panel/overview", { id: 1, admin: true }, J);
  assert.equal((await ov.json()).queues.sponsor, 2, "nur Status neu");
  const { root, location } = await bootAdmin(env, "");
  await until(() => root.all("div.adm-tile").length, "Kacheln");
  const tile = root.all("div.adm-tile").find((x) => x.querySelector("span").textContent === "Sponsor-Anfragen (neu)");
  assert.equal(tile.querySelector("b").textContent, "2");
  root.all("a").find((a) => a.getAttribute("href") === "#sponsor").fire("click");
  await until(() => pane(root)?.querySelector("tbody tr"), "Reiter Sponsor-Anfragen");
  assert.equal(location.hash, "sponsor"); assert.equal(pane(root).hidden, false);
  raw.close();
}));

test("sponsor mail: Link auf den Reiter, Sprache, alle drei Preise, Zeilenumbrueche, alles escaped (SQLite)", async () => {
  const { raw, env } = await setup();
  assert.equal((await postV1(env)).status, 200);
  const { html, subject } = raw.prepare("SELECT html,subject FROM mail_outbox").get();
  assert.equal(subject, "Neue Sponsor-Anfrage: Acme Test GmbH");
  assert.match(html, /<a href="https:\/\/www\.m365\.fm\/admin\/#sponsor">Im Admin-Panel ansehen<\/a>/);
  assert.match(html, /Sprache: de<br>/);
  assert.match(html, /Preis: \$14,000\/Monat · \$6,500 einmalig · \$174,500 gesamt</);
  assert.match(html, /Paket: Brand visibility · Your brand name \(easy, example rating\), Teams Phone .* · 12 months · Base package × 4 topics – \$12,000\/month; Video package/);
  assert.match(html, /<p>Hallo<br>Bitte ein Angebot\.<\/p>/);
  assert.match(html, /&lt;img src=x onerror=&quot;window\.__xss=1&quot;&gt;Mein Produkt/);
  assert.doesNotMatch(html, /<img/);
  raw.close();
});

test("sponsor mail: Kurzfassung fuer aeltere Pakete (packageDetails)", () => {
  const d = sponsorPackageDetails;
  assert.deepEqual(d({ ziel: "Azure", themen: ["Cloud"], laufzeit: "3 Monate", bausteine: ["Podcast"], preisMonat: 500, gesamtpreis: 1500 }), { summary: "Azure · Cloud · 3 Monate · Podcast", price: "$500/Monat · $1,500 gesamt" });
  assert.deepEqual(d({ goal: "AI citations", months: 6, monthlyUsd: 3900, oneOffUsd: 1000, totalUsd: 24400 }), { summary: "AI citations · 6 Monate", price: "$3,900/Monat · $1,000 einmalig · $24,400 gesamt" });
  assert.deepEqual(d({}), { summary: "{}", price: "–" });
  assert.deepEqual(d({ goal: "Leads", components: [null, null] }), { summary: "Leads", price: "–" });
  assert.equal(d({ monthlyUsd: "3900" }).price, "$3,900/Monat", "Zahl als Zeichenkette");
  assert.equal(d({ monthlyUsd: "USD 500" }).price, "USD 500/Monat", "andere Zeichenkette bleibt");
  assert.equal(d({ monthlyUsd: -400, totalUsd: 1234.5 }).price, "-$400/Monat · $1,234.5 gesamt");
  assert.equal(d({ monthlyUsd: true }).price, "–", "kein Betrag -> kein leeres /Monat");
});
