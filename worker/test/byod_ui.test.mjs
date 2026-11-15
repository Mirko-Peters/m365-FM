// assets/blogdomain.js in node:vm mit kleinem Schein-DOM: Schalter aus = unsichtbar, Eintragen, DNS-Eintrag zum Kopieren, Status, Pruefen, Entfernen, Admin; Texte en/de.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const JS = readFileSync(new URL("../../assets/blogdomain.js", import.meta.url), "utf8");
class Text { constructor(t) { this.nodeType = 3; this.data = String(t); } get textContent() { return this.data; } }
class El {
  constructor(tag) { this.nodeType = 1; this.tagName = tag.toUpperCase(); this.attrs = {}; this.childNodes = []; this.listeners = {}; this.value = ""; this.disabled = false; }
  setAttribute(k, v) { this.attrs[k] = String(v); if (k === "value") this.value = String(v); }
  get firstChild() { return this.childNodes[0] || null; }
  appendChild(c) { this.childNodes.push(c); return c; }
  get textContent() { return this.childNodes.map((n) => n.textContent).join(""); }
  set textContent(t) { this.childNodes = t ? [new Text(t)] : []; }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  click() { for (const fn of this.listeners.click || []) fn({ type: "click", target: this }); }
  all(pred) { const out = []; const walk = (n) => { for (const c of n.childNodes) if (c.nodeType === 1) { if (pred(c)) out.push(c); walk(c); } }; walk(this); return out; }
}
const tick = () => new Promise((r) => setTimeout(r, 5));
async function boot(routes, { me = { id: 1 }, lang = "de", clip } = {}) {
  const root = new El("div"), posts = [];
  const fetch = async (url, o = {}) => {
    const path = new URL(url).pathname, body = o.body ? JSON.parse(o.body) : undefined;
    assert.equal(o.headers["x-requested-with"], "m365"); if (o.method === "POST") posts.push({ path, body });
    const r = path === "/api/me" ? { user: me } : typeof routes[path] === "function" ? routes[path](body, o.method || "GET") : routes[path] ?? {};
    const [status, data] = Array.isArray(r) ? r : [200, r];
    return new Response(JSON.stringify(data), { status });
  };
  const document = { createElement: (t) => new El(t), getElementById: (id) => (id === "c-blogdomain" ? root : null) };
  const ctx = vm.createContext({ window: { M365X: { api: "https://api.test", lang } }, document, fetch, Date, Object, JSON, setTimeout, navigator: clip ? { clipboard: { writeText: async (t) => clip.push(t) } } : undefined });
  vm.runInContext(JS, ctx, { filename: "assets/blogdomain.js" });
  for (let i = 0; i < 20; i++) await tick();
  const btn = (text) => root.all((e) => e.tagName === "BUTTON" && e.textContent === text);
  return { root, posts, btn, inputs: () => root.all((e) => e.tagName === "INPUT") };
}
const DOM = (o = {}) => ({ id: 7, domain: "blog.anna.de", status: "pending", error: "", imprint_url: "", privacy_url: "", cf_status: "", cf_ssl: "", checked: 0, created: 1, activated_at: 0, dns: { type: "CNAME", name: "blog.anna.de", value: "blogs.m365blogs.net" }, txt: { type: "TXT", name: "_m365fm-verify.blog.anna.de", value: "m365fm-verify=abc" }, url: "", ...o });
const MINE = (domains = [], o = {}) => ({ enabled: true, configured: true, cloudflare: true, max: 1, can_add: domains.length < 1, profile_public: true, target: "blogs.m365blogs.net", canonical: "platform", domains, ...o });

test("Funktion aus oder nicht angemeldet: nichts sichtbar", async () => {
  const off = await boot({ "/api/byod/mine": { enabled: false } }); assert.equal(off.root.textContent, "");
  const anon = await boot({ "/api/byod/mine": MINE() }, { me: null }); assert.equal(anon.root.textContent, "");
});

test("Eintragen: Formular, Domain wird gesendet, Fehler werden verstaendlich gezeigt", async () => {
  const { root, btn, inputs, posts } = await boot({ "/api/byod/mine": MINE(), "/api/byod/add": () => [400, { error: "apex_not_allowed" }] });
  assert.ok(root.textContent.includes("Blog auf deiner eigenen Domain") && root.textContent.includes("nur eine Unterdomain") && root.textContent.includes("Impressum"));
  const [dom, imp, pri] = inputs(); dom.value = " blog.anna.de "; imp.value = "https://anna.de/impressum";
  btn("Domain eintragen")[0].click(); await tick(); await tick();
  assert.deepEqual(posts.at(-1), { path: "/api/byod/add", body: { domain: "blog.anna.de", imprint_url: "https://anna.de/impressum", privacy_url: "" } });
  assert.ok(root.textContent.includes("Bitte eine Unterdomain verwenden"), root.textContent.slice(-300));
});

test("Domain wartet auf DNS: genau der CNAME-Eintrag zum Kopieren, TXT optional, Jetzt pruefen, Entfernen", async () => {
  const clip = [];
  const { root, btn, posts } = await boot({ "/api/byod/mine": MINE([DOM({ error: "dns_missing", checked: 1700000000 })]), "/api/byod/check": { ok: true }, "/api/byod/remove": { ok: true } }, { clip });
  const t = root.textContent;
  for (const s of ["blog.anna.de", "CNAME", "blogs.m365blogs.net", "Wartet auf den DNS-Eintrag", "Wir finden den DNS-Eintrag noch nicht", "_m365fm-verify.blog.anna.de", "m365fm-verify=abc", "Ohne Ausfall wechseln", "Zuletzt geprüft"]) assert.ok(t.includes(s), s);
  assert.equal(root.all((e) => e.tagName === "INPUT").length, 2, "Felder fuer Impressum und Datenschutz");
  const copies = btn("Kopieren"); assert.equal(copies.length, 4);   // CNAME: Name, Wert; TXT: Name, Wert (die Zeile "Typ" hat keinen Knopf)
  copies[0].click(); await tick(); copies[1].click(); await tick(); assert.deepEqual(clip, ["blog.anna.de", "blogs.m365blogs.net"]);
  btn("Jetzt prüfen")[0].click(); await tick(); await tick(); assert.deepEqual(posts.at(-1), { path: "/api/byod/check", body: { id: 7 } });
  btn("Domain entfernen")[0].click(); await tick(); await tick(); assert.deepEqual(posts.at(-1), { path: "/api/byod/remove", body: { id: 7 } });
});

test("Aktiv: Link zum Blog, kein DNS-Eintrag mehr; Impressum-Pflicht und Zertifikat-Hinweis; Links speichern", async () => {
  const act = await boot({ "/api/byod/mine": MINE([DOM({ status: "active", url: "https://blog.anna.de/", imprint_url: "https://anna.de/i" })]) });
  assert.ok(act.root.textContent.includes("Aktiv") && act.root.textContent.includes("Dein Blog läuft hier:") && act.root.textContent.includes("https://blog.anna.de/") && !act.root.textContent.includes("blogs.m365blogs.net"));
  const imp = await boot({ "/api/byod/mine": MINE([DOM({ status: "verified", error: "need_imprint" })]), "/api/byod/links": { ok: true } });
  assert.ok(imp.root.textContent.includes("Es fehlt noch der Link zu deinem Impressum"));
  imp.inputs()[0].value = "https://anna.de/impressum"; imp.btn("Links speichern")[0].click(); await tick(); await tick();
  assert.deepEqual(imp.posts.at(-1), { path: "/api/byod/links", body: { id: 7, imprint_url: "https://anna.de/impressum", privacy_url: "" } });
  const cf = await boot({ "/api/byod/mine": MINE([DOM({ status: "verified", cf_status: "pending" })]) }); assert.ok(cf.root.textContent.includes("Das Zertifikat wird eingerichtet"));
  const ce = await boot({ "/api/byod/mine": MINE([DOM({ status: "verified", error: "cf_9109" })]) }); assert.ok(ce.root.textContent.includes("Fehler (9109)"));
});

test("Gesperrt: Hinweis, keine Aktionen; Texte aus der Datenbank stehen nur als Text (kein Markup)", async () => {
  const bl = await boot({ "/api/byod/mine": MINE([DOM({ status: "blocked", error: "blocked" })]) });
  assert.ok(bl.root.textContent.includes("Gesperrt") && bl.root.textContent.includes("Diese Domain wurde gesperrt")); assert.equal(bl.btn("Domain entfernen").length, 0); assert.equal(bl.btn("Jetzt prüfen").length, 0);
  const x = await boot({ "/api/byod/mine": MINE([DOM({ domain: "<img src=x onerror=alert(1)>.de" })]) });
  assert.equal(x.root.all((e) => e.tagName === "IMG").length, 0); assert.ok(x.root.textContent.includes("<img src=x onerror=alert(1)>.de"));
});

test("Admin sieht die Liste und kann sperren und freigeben", async () => {
  const { root, btn, posts } = await boot({ "/api/byod/mine": MINE(), "/api/admin/byod": { items: [{ id: 3, domain: "blog.ben.de", status: "active", handle: "ben" }, { id: 4, domain: "x.cora.de", status: "blocked", handle: "cora" }] }, "/api/admin/byod/block": { ok: true } }, { me: { id: 9, admin: true } });
  assert.ok(root.textContent.includes("Admin: Blog-Domains") && root.textContent.includes("blog.ben.de") && root.textContent.includes("x.cora.de"));
  btn("Sperren")[0].click(); await tick(); assert.deepEqual(posts.at(-1), { path: "/api/admin/byod/block", body: { id: 3, blocked: true } });
  btn("Freigeben")[0].click(); await tick(); assert.deepEqual(posts.at(-1), { path: "/api/admin/byod/block", body: { id: 4, blocked: false } });
  const plain = await boot({ "/api/byod/mine": MINE(), "/api/admin/byod": { items: [] } }); assert.ok(!plain.root.textContent.includes("Admin: Blog-Domains"));
});

test("Englisch: englische Texte", async () => {
  const { root } = await boot({ "/api/byod/mine": MINE([DOM({ error: "dns_missing" })]) }, { lang: "en" });
  assert.ok(root.textContent.includes("Your blog on your own domain") && root.textContent.includes("Waiting for the DNS record") && root.textContent.includes("We cannot find the DNS record yet"));
});

test("blogdomain.js: deutsche und englische Texte haben dieselben Schluessel; die englischen stehen fuer die Uebersetzung in data/ui_js_en.json", () => {
  let seen; const M365L = (de, key, a, b) => { seen = { key, a, b }; return a; };
  const root = new El("div"), ctx = vm.createContext({ window: { M365L, M365X: { api: "https://api.test", lang: "de" } }, document: { createElement: (t) => new El(t), getElementById: () => root }, fetch: async () => new Response("{}"), Date, Object, JSON });
  vm.runInContext(JS, ctx);
  assert.equal(seen.key, "blogdomain.Q"); assert.deepEqual(Object.keys(seen.a).sort(), Object.keys(seen.b).sort());
  assert.deepEqual({ ...seen.b }, JSON.parse(readFileSync(new URL("../../data/ui_js_en.json", import.meta.url), "utf8"))["blogdomain.Q"]);
  for (const k of Object.keys(seen.a)) assert.ok(String(seen.a[k]).length > 0 && String(seen.b[k]).length > 0, k);
});

test("Seite: Platz und Skript im Community-Bereich (generate_site.py)", () => {
  const g = readFileSync(new URL("../../generate_site.py", import.meta.url), "utf8");
  assert.ok(g.includes('<div id="c-blogdomain"></div>') && g.includes("/assets/blogdomain.js"));
  assert.ok(g.indexOf("/assets/events.js") < g.indexOf("/assets/blogdomain.js"));
});
