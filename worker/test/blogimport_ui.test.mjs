// assets/blogimport.js in node:vm mit kleinem Schein-DOM: Schalter aus = unsichtbar, Feed laden, Auswahl, Standard = Kurzfassung, Volltext nur mit Haken, Fehler; en/de.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const JS = readFileSync(new URL("../../assets/blogimport.js", import.meta.url), "utf8");
class Text { constructor(t) { this.nodeType = 3; this.data = String(t); } get textContent() { return this.data; } }
class El {
  constructor(tag) { this.nodeType = 1; this.tagName = tag.toUpperCase(); this.attrs = {}; this.childNodes = []; this.listeners = {}; this.value = ""; this.disabled = false; this.checked = false; }
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
async function boot(routes, { me = { id: 1 }, lang = "de" } = {}) {
  const root = new El("div"), posts = [];
  const fetch = async (url, o = {}) => {
    const path = new URL(url).pathname, body = o.body ? JSON.parse(o.body) : undefined;
    assert.equal(o.headers["x-requested-with"], "m365"); if (o.method === "POST") posts.push({ path, body });
    const r = path === "/api/me" ? { user: me } : typeof routes[path] === "function" ? routes[path](body) : routes[path] ?? {};
    const [status, data] = Array.isArray(r) ? r : [200, r];
    return new Response(JSON.stringify(data), { status });
  };
  const document = { createElement: (t) => new El(t), getElementById: (id) => (id === "c-blogimport" ? root : null) };
  const ctx = vm.createContext({ window: { M365X: { api: "https://api.test", lang } }, document, fetch, Date, Object, JSON, setTimeout });
  vm.runInContext(JS, ctx, { filename: "assets/blogimport.js" });
  for (let i = 0; i < 20; i++) await tick();
  const btn = (text) => root.all((e) => e.tagName === "BUTTON" && e.textContent === text);
  const boxes = () => root.all((e) => e.tagName === "INPUT" && e.attrs.type === "checkbox");
  return { root, posts, btn, boxes, input: () => root.all((e) => e.tagName === "INPUT" && e.attrs.type === "url")[0], radios: () => root.all((e) => e.tagName === "INPUT" && e.attrs.type === "radio") };
}
const MINE = { enabled: true };
const IT = (k, o = {}) => ({ key: k, title: "Beitrag " + k, url: "https://a.example.org/" + k, date: "2026-01-05", summary: "Kurzfassung " + k, has_full: true, images: 0, imported: false, ...o });
const PREV = (items) => ({ ok: true, feed: { url: "https://a.example.org/f.xml", title: "Annas Seite" }, items });
async function loaded(extra = {}, opt) {
  const b = await boot({ "/api/byod/mine": MINE, "/api/byod/import/preview": PREV([IT("p1", { images: 2 }), IT("p2", { has_full: false }), IT("p3", { imported: true })]), ...extra }, opt);
  b.input().value = " https://a.example.org/f.xml "; b.btn(opt?.lang === "en" ? "Load posts" : "Beiträge laden")[0].click(); await tick(); await tick(); return b;
}

test("Funktion aus oder nicht angemeldet: nichts sichtbar", async () => {
  assert.equal((await boot({ "/api/byod/mine": { enabled: false } })).root.textContent, "");
  assert.equal((await boot({ "/api/byod/mine": MINE }, { me: null })).root.textContent, "");
});

test("Feed laden: Adresse wird gesendet, Liste mit Hinweisen, schon uebernommene gesperrt, Fehler verstaendlich", async () => {
  const b = await loaded(); const t = b.root.textContent;
  assert.deepEqual(b.posts[0], { path: "/api/byod/import/preview", body: { feed_url: "https://a.example.org/f.xml" } });
  for (const s of ["Bestehenden Blog übernehmen", "Annas Seite", "Beitrag p1", "2 Bild(er) werden nicht kopiert", "nur Kurzfassung im Feed", "schon übernommen", "Bilder werden nie kopiert"]) assert.ok(t.includes(s), s);
  const cbs = b.boxes(); assert.equal(cbs.length, 4); assert.deepEqual(cbs.slice(0, 3).map((c) => c.disabled), [false, false, true]);
  const bad = await boot({ "/api/byod/mine": MINE, "/api/byod/import/preview": [400, { error: "not_a_feed" }] }); bad.input().value = "https://a.example.org/x"; bad.btn("Beiträge laden")[0].click(); await tick(); await tick();
  assert.ok(bad.root.textContent.includes("Unter dieser Adresse liegt kein RSS- oder Atom-Feed")); assert.equal(bad.boxes().length, 0);
});

test("Standard: Kurzfassung, nichts gewaehlt = Hinweis ohne Aufruf; gewaehlt = nur Entwuerfe, ohne rights", async () => {
  const b = await loaded({ "/api/byod/import/save": { ok: true, status: "draft", created: [{ slug: "beitrag-p1", mode: "excerpt", images_not_copied: 0 }], skipped: [] } });
  const n = b.posts.length; b.btn("Als Entwürfe übernehmen")[0].click(); await tick(); assert.equal(b.posts.length, n); assert.ok(b.root.textContent.includes("Bitte wähle mindestens einen Beitrag aus."));
  b.boxes()[0].checked = true; b.btn("Als Entwürfe übernehmen")[0].click(); await tick(); await tick();
  assert.deepEqual(b.posts.at(-1), { path: "/api/byod/import/save", body: { feed_url: "https://a.example.org/f.xml", keys: ["p1"], mode: "excerpt", lang: "de" } });
  assert.ok(b.root.textContent.includes("1 Entwurf/Entwürfe angelegt") && b.root.textContent.includes("prüfen und veröffentlichen"));
  assert.equal(b.boxes()[0].disabled, true, "nach dem Import als uebernommen markiert");
});

test("Alle auswaehlen lässt gesperrte aus; Volltext sendet rights nur, wenn das Haekchen gesetzt ist; Hinweis zu nicht kopierten Bildern", async () => {
  const b = await loaded({ "/api/byod/import/save": (body) => body.rights !== true ? [400, { error: "rights_required" }] : { ok: true, status: "draft", created: [{ slug: "a", mode: "full", images_not_copied: 2 }, { slug: "b", mode: "excerpt", images_not_copied: 0 }], skipped: [{ key: "p3", reason: "already_imported" }] } });
  b.btn("Alle auswählen")[0].click(); assert.deepEqual(b.boxes().slice(0, 3).map((c) => c.checked), [true, true, false]);
  const [ex, full] = b.radios(); assert.equal(ex.checked, true); full.checked = true; ex.checked = false;
  b.btn("Als Entwürfe übernehmen")[0].click(); await tick(); await tick();
  assert.deepEqual(b.posts.at(-1).body, { feed_url: "https://a.example.org/f.xml", keys: ["p1", "p2"], mode: "full", lang: "de", rights: false });
  assert.ok(b.root.textContent.includes("Für den ganzen Text brauchen wir deine Bestätigung der Rechte"));
  b.boxes().at(-1).checked = true; b.btn("Als Entwürfe übernehmen")[0].click(); await tick(); await tick();
  assert.equal(b.posts.at(-1).body.rights, true); assert.ok(b.root.textContent.includes("2 Entwurf/Entwürfe angelegt") && b.root.textContent.includes("1 übersprungen") && b.root.textContent.includes("2 Bild(er) wurden nicht kopiert"));
});

test("Texte aus dem Feed stehen nur als Text; Englisch", async () => {
  const x = await boot({ "/api/byod/mine": MINE, "/api/byod/import/preview": PREV([IT("p1", { title: "<img src=x onerror=alert(1)>", summary: "<script>alert(2)</script>" })]) }); x.input().value = "https://a.example.org/f.xml"; x.btn("Beiträge laden")[0].click(); await tick(); await tick();
  assert.equal(x.root.all((e) => e.tagName === "IMG" || e.tagName === "SCRIPT").length, 0); assert.ok(x.root.textContent.includes("<img src=x onerror=alert(1)>"));
  const en = await loaded({}, { lang: "en" }); assert.ok(en.root.textContent.includes("Bring over your existing blog") && en.root.textContent.includes("only a summary in the feed") && en.root.textContent.includes("Images are never copied"));
  assert.ok(en.btn("Import as drafts").length === 1 && en.btn("Select all").length === 1);
});

test("blogimport.js: deutsche und englische Texte haben dieselben Schluessel; die englischen stehen in data/ui_js_en.json", () => {
  let seen; const M365L = (de, key, a, b) => { seen = { key, a, b }; return a; };
  const root = new El("div"), ctx = vm.createContext({ window: { M365L, M365X: { api: "https://api.test", lang: "de" } }, document: { createElement: (t) => new El(t), getElementById: () => root }, fetch: async () => new Response("{}"), Date, Object, JSON });
  vm.runInContext(JS, ctx);
  assert.equal(seen.key, "blogimport.Q"); assert.deepEqual(Object.keys(seen.a).sort(), Object.keys(seen.b).sort());
  assert.deepEqual({ ...seen.b }, JSON.parse(readFileSync(new URL("../../data/ui_js_en.json", import.meta.url), "utf8"))["blogimport.Q"]);
  for (const k of Object.keys(seen.a)) assert.ok(String(seen.a[k]).length > 0 && String(seen.b[k]).length > 0, k);
});

test("Seite: Platz und Skript im Community-Bereich (generate_site.py)", () => {
  const g = readFileSync(new URL("../../generate_site.py", import.meta.url), "utf8");
  assert.ok(g.includes('<div id="c-blogimport"></div>') && g.includes("/assets/blogimport.js") && g.indexOf("/assets/blogdomain.js") < g.indexOf("/assets/blogimport.js"));
});
