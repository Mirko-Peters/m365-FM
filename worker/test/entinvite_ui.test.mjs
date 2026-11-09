// Oberflaeche der Entitaets-Einladungen (#322): assets/profile.js (Link aus der Mail, ?invite=<token>) und assets/admin.js (Sammelversand, Testmail).
// Beide Skripte laufen unveraendert in node:vm mit einem kleinen Schein-DOM; profile.js spricht dabei mit dem echten Handler auf SQLite.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import vm from "node:vm";
import { handleEntityInvite } from "../src/entinvite.js";

const PROFILE_JS = readFileSync(new URL("../../assets/profile.js", import.meta.url), "utf8");
const ADMIN_JS = readFileSync(new URL("../../assets/admin.js", import.meta.url), "utf8");
const UI_EN = JSON.parse(readFileSync(new URL("../../data/ui_js_en.json", import.meta.url), "utf8"));
const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
const TOKEN = "sastIFq9oTdt27xfh5SpWx_Q9O0";   // 27 Zeichen base64url wie randomToken(20)

// ---------- Schein-DOM ----------
class Text { constructor(t) { this.nodeType = 3; this.data = String(t); this.parentNode = null; } get textContent() { return this.data; } }
class El {
  constructor(tag) { this.nodeType = 1; this.tagName = tag.toUpperCase(); this.attrs = {}; this.childNodes = []; this.parentNode = null; this.listeners = {}; this.className = ""; this.id = ""; this.disabled = false; this.dataset = {}; this.style = {}; this._value = ""; this.selected = false; }
  setAttribute(k, v) { if (k === "class") this.className = String(v); else if (k === "id") this.id = String(v); else if (k === "value") this._value = String(v); else this.attrs[k] = String(v); }
  getAttribute(k) { return k === "class" ? this.className : k === "id" ? this.id : Object.hasOwn(this.attrs, k) ? this.attrs[k] : null; }
  get hidden() { return Object.hasOwn(this.attrs, "hidden"); }
  set hidden(v) { if (v) this.attrs.hidden = ""; else delete this.attrs.hidden; }
  get href() { return this.attrs.href; }
  appendChild(c) { if (c.parentNode) c.parentNode.removeChild(c); c.parentNode = this; this.childNodes.push(c); return c; }
  append(...cs) { for (const c of cs) this.appendChild(typeof c === "string" ? new Text(c) : c); }
  insertBefore(c, ref) { if (c.parentNode) c.parentNode.removeChild(c); const i = ref ? this.childNodes.indexOf(ref) : -1; c.parentNode = this; if (i < 0) this.childNodes.push(c); else this.childNodes.splice(i, 0, c); return c; }
  removeChild(c) { const i = this.childNodes.indexOf(c); if (i >= 0) this.childNodes.splice(i, 1); c.parentNode = null; return c; }
  remove() { if (this.parentNode) this.parentNode.removeChild(this); }
  get firstChild() { return this.childNodes[0] || null; }
  get nextSibling() { const p = this.parentNode; return p ? p.childNodes[p.childNodes.indexOf(this) + 1] || null : null; }
  get children() { return this.childNodes.filter((n) => n.nodeType === 1); }
  get textContent() { return this.childNodes.map((n) => n.textContent).join(""); }
  set textContent(t) { for (const n of this.childNodes) n.parentNode = null; this.childNodes = []; if (t != null && t !== "") this.appendChild(new Text(t)); }
  get innerHTML() { throw new Error("innerHTML"); }
  set innerHTML(_) { throw new Error("innerHTML"); }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  click() { if (this.disabled) return; const ev = { type: "click", target: this, preventDefault() {} }; for (const fn of this.listeners.click || []) fn(ev); if (typeof this.onclick === "function") this.onclick(ev); }
  get value() { if (this.tagName === "SELECT") { const o = this.children; return (o.find((x) => x.selected) || o[0])?._value ?? ""; } return this._value; }
  set value(v) { if (this.tagName === "SELECT") for (const o of this.children) o.selected = o._value === String(v); else this._value = String(v); }
  all(pred) { const out = []; const walk = (n) => { for (const c of n.children) { if (pred(c)) out.push(c); walk(c); } }; walk(this); return out; }
  querySelector(sel) { return this.all(matcher(sel))[0] || null; }
  querySelectorAll(sel) { return this.all(matcher(sel)); }
}
function matcher(sel) {   // genau die Selektoren, die die beiden Skripte benutzen: .klasse und [attr=wert]
  let m;
  if ((m = /^\.([\w-]+)$/.exec(sel))) return (e) => e.className.split(/\s+/).includes(m[1]);
  if ((m = /^\[([\w-]+)=([\w-]+)\]$/.exec(sel))) return (e) => e.getAttribute(m[1]) === m[2];
  throw new Error("Selektor nicht unterstuetzt: " + sel);
}
const flush = async (n = 30) => { for (let i = 0; i < n; i++) await new Promise((r) => setImmediate(r)); };
const byText = (root, tag, text) => root.all((e) => e.tagName === tag && e.textContent === text)[0];

// ---------- Datenbank fuer die Annahme ----------
async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf8"));
  const db = {
    prepare(sql) { let args = []; const o = { bind(...a) { args = a; return o; }, all: async () => ({ results: raw.prepare(sql).all(...args) }), first: async () => raw.prepare(sql).get(...args) ?? null, run: async () => { const r = raw.prepare(sql).run(...args); return { meta: { changes: Number(r.changes) } }; } }; return o; },
    async batch(stmts) { for (const s of stmts) await s.run(); },
  };
  raw.exec(`INSERT INTO users(id,provider,sub,name,created) VALUES(1,'x','a','Admin',1),(7,'x','g','Pia Plain',1);
    INSERT INTO entity_invites(token,eid,name,email,by_user,created) VALUES('${TOKEN}','plain-person','Pia <b>Plain</b>','pia@example.com',1,1)`);
  return { raw, env: { DB: db, SITE: "https://www.m365.fm", API: "https://api.test" } };
}

// profile.js auf der Community-Seite starten; user = angemeldetes Konto oder null. API-Aufrufe der Einladung gehen an den echten Handler.
async function bootProfile(env, { search, hash = "#c-invite", user = null }) {
  const main = new El("main"), calls = [];
  for (const [tag, id] of [["h1", "c-h1"], ["div", "c-page"], ["div", "c-expert"], ["div", "c-mvp"], ["div", "c-events"], ["div", "c-blog"]]) { const e = new El(tag); e.id = id; main.appendChild(e); }
  const location = { search, hash, href: "https://www.m365.fm/community/" + search + hash, pathname: "/community/" }, replaced = [];
  const fetch = async (url, o = {}) => {
    const u = new URL(url); calls.push({ path: u.pathname + u.search, method: o.method || "GET", headers: o.headers || {}, body: o.body });
    if (u.pathname === "/api/me") return J({ user: user ? { id: user.id, name: user.name } : null });
    if (u.pathname === "/api/providers") return J({ providers: ["google", "linkedin", "github"] });
    if (u.pathname.startsWith("/api/entityinvite/")) { const req = new Request(u, { method: o.method || "GET", headers: o.headers, body: o.body }); return handleEntityInvite(env, req, u, u.pathname, user, J); }
    return J({ error: "login" }, 401);   // /api/profile/me, /api/org/mine, entities.json ...: nicht angemeldet bzw. hier ohne Belang
  };
  const document = { createElement: (t) => new El(t), createTextNode: (t) => new Text(t), getElementById: (id) => main.all((e) => e.id === id)[0] || null, querySelector: (s) => main.querySelector(s), documentElement: { lang: "en" } };
  const window = { M365X: { api: "https://api.test", base: "https://www.m365.fm", lang: "en" }, addEventListener() {} };
  const ctx = vm.createContext({ window, document, location, fetch, URL, URLSearchParams, setTimeout, clearTimeout, history: { replaceState: (_s, _t, u) => replaced.push(u) }, localStorage: { getItem: () => null, setItem() {} }, navigator: {}, console });
  vm.runInContext(PROFILE_JS, ctx, { filename: "assets/profile.js" });
  await flush();
  return { main, calls, replaced, card: () => main.all((e) => e.id === "c-invite")[0] };
}

test("322-3: Link aus der Einladung (?invite=<token>#c-invite) - nicht angemeldet: Karte mit Anmeldeknoepfen, das Token bleibt in der Rueckkehr-Adresse", async () => {
  const { raw, env } = await setup();
  const search = "?invite=" + TOKEN, { main, calls, card } = await bootProfile(env, { search });
  const c = card(); assert.ok(c, "Karte c-invite fehlt");
  assert.equal(main.children.indexOf(c) < main.children.findIndex((e) => e.id === "c-page"), true, "Karte steht ueber den Reitern, unabhaengig vom Anker");
  assert.equal(main.all((e) => e.id === "c-expert")[0].hidden, true, "#c-invite ist kein Reiter: das Konto-Reiterblatt bleibt offen");
  assert.match(c.textContent, /Hi Pia <b>Plain<\/b>, with this invitation you claim the page about you/);   // nur als Text
  assert.equal(c.all((e) => e.tagName === "B").length, 0);
  assert.equal(c.all((e) => e.tagName === "A" && e.href === "https://www.m365.fm/entity/plain-person/").length, 1);
  assert.match(c.textContent, /Sign in \(or register for free\) to claim the page/);
  const links = c.all((e) => e.tagName === "A" && /\/auth\/login\//.test(e.href || ""));
  assert.deepEqual(links.map((a) => a.textContent), ["Sign in with LinkedIn", "Sign in with Google", "Sign in with GitHub"]);   // nur eingerichtete Anbieter
  for (const a of links) assert.equal(new URL(a.href).searchParams.get("return"), "https://www.m365.fm/community/?invite=" + TOKEN);
  assert.equal(c.all((e) => e.tagName === "BUTTON").length, 0);
  assert.ok(calls.some((x) => x.path === "/api/entityinvite/info?t=" + TOKEN));
  assert.equal(calls.some((x) => x.path === "/api/entityinvite/accept"), false, "ohne Anmeldung wird nichts uebernommen");
  assert.equal(raw.prepare("SELECT status FROM entity_invites").get().status, "sent");
});

test("322-3: angemeldet (auch nach der Anmeldung ohne Anker) - Knopf uebernimmt die Seite; ohne oeffentliches Profil der Hinweis, danach geht es weiter", async () => {
  const { raw, env } = await setup(), user = { id: 7, name: "Pia Plain" };
  const { calls, replaced, card } = await bootProfile(env, { search: "?invite=" + TOKEN, hash: "", user });
  const c = card(), go = byText(c, "BUTTON", "Claim my page"), msg = () => c.all((e) => e.className === "wk-msg")[0];
  assert.ok(go); assert.equal(c.all((e) => /\/auth\/login\//.test(e.href || "")).length, 0);
  assert.equal(calls.some((x) => x.path === "/api/entityinvite/accept"), false, "erst der Klick uebernimmt");
  go.click(); await flush();
  assert.match(msg().textContent, /You need a public profile for this/);
  assert.equal(msg().all((e) => e.tagName === "A" && e.href === "#c-expert").length, 1);
  assert.equal(go.disabled, false);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_claims").get().n, 0);
  raw.exec("INSERT INTO profiles(user_id,public,handle,updated) VALUES(7,1,'pia-plain',1)");
  go.click(); await flush();
  const post = calls.filter((x) => x.path === "/api/entityinvite/accept").at(-1);
  assert.equal(post.method, "POST"); assert.equal(post.headers["x-requested-with"], "m365"); assert.deepEqual(JSON.parse(post.body), { t: TOKEN });
  assert.match(msg().textContent, /The page now belongs to your account\. View the page/);
  assert.equal(go.hidden, true);
  assert.deepEqual({ ...raw.prepare("SELECT user_id,status,via FROM entity_claims WHERE eid='plain-person'").get() }, { user_id: 7, status: "verified", via: "invite" });
  assert.equal(raw.prepare("SELECT status FROM entity_invites").get().status, "claimed");
  assert.deepEqual(replaced.filter((u) => u[0] === "/"), ["/community/"], "Token nach der Uebernahme aus der Adresse entfernt");
  // erneut geoeffnet: schon eingeloest; Seite eines anderen Kontos: klare Meldung
  const again = await bootProfile(env, { search: "?invite=" + TOKEN, user });
  assert.match(again.card().textContent, /This invitation has already been used/); assert.equal(again.card().all((e) => e.tagName === "BUTTON").length, 0);
  raw.exec("UPDATE entity_invites SET status='sent'; UPDATE entity_claims SET user_id=1; INSERT INTO users(id,provider,sub,name,created) VALUES(8,'x','h','Other',1); INSERT INTO profiles(user_id,public,handle,updated) VALUES(8,1,'other',1)");
  const other = await bootProfile(env, { search: "?invite=" + TOKEN, user: { id: 8, name: "Other" } });
  byText(other.card(), "BUTTON", "Claim my page").click(); await flush();
  assert.match(other.card().textContent, /already linked to another account/);
});

test("322-3: ungueltiges oder abgelehntes Token zeigt eine Meldung; andere invite-Werte (Speaker-Einladung, Unsinn) loesen nichts aus", async () => {
  const { raw, env } = await setup();
  const bad = await bootProfile(env, { search: "?invite=" + "x".repeat(27) });
  assert.match(bad.card().textContent, /This invitation link is invalid or has been withdrawn/);
  raw.exec("UPDATE entity_invites SET status='declined'");
  const declined = await bootProfile(env, { search: "?invite=" + TOKEN, user: { id: 7, name: "Pia" } });
  assert.match(declined.card().textContent, /invalid or has been withdrawn/); assert.equal(declined.card().all((e) => e.tagName === "BUTTON").length, 0);
  for (const search of ["", "?invite=" + "a1".repeat(18), "?invite=%3Cscript%3E", "?claimverify=" + TOKEN]) {
    const none = await bootProfile(env, { search });
    assert.equal(none.card(), undefined, search); assert.equal(none.calls.some((x) => x.path.startsWith("/api/entityinvite/")), false, search);
  }
});

test("322-3: Texte der Einladungskarte stehen fuer die Uebersetzung in data/ui_js_en.json und der Link der Mail passt zum Skript", () => {
  const line = PROFILE_JS.split("\n").find((l) => l.includes('M365L(de, "profile.IV"'));
  const { de, en } = JSON.parse(JSON.stringify(vm.runInNewContext("var de = false, M365L = function (d, k, a, b) { return { de: a, en: b }; };" + line + ";IV")));   // JSON: Objekte aus dem vm-Kontext vergleichbar machen
  assert.deepEqual(UI_EN["profile.IV"], en);
  assert.deepEqual(Object.keys(de), Object.keys(en));
  const src = readFileSync(new URL("../src/entinvite.js", import.meta.url), "utf8");
  assert.match(src, /`\$\{env\.SITE\}\/community\/\?invite=\$\{encodeURIComponent\(t\)\}#c-invite`/);
});

// ---------- Verwaltung: Sammelversand und Testmail ----------
async function bootAdmin() {
  const root = new El("div"); root.id = "adm";
  const calls = [], pending = [];
  const fetch = (url, o = {}) => {
    const u = new URL(url, "https://api.test"), body = o.body ? JSON.parse(o.body) : null; calls.push({ path: u.pathname, method: o.method || "GET", body });
    if (u.pathname === "/api/admin/panel/overview") return Promise.resolve(J({ queues: {} }));
    if (u.pathname === "/api/entityinvite/send-batch" && o.method === "POST" && !body.dry_run) return new Promise((resolve, reject) => pending.push({ resolve: (d, s = 200) => resolve(J(d, s)), reject }));
    if (u.pathname === "/api/entityinvite/send-batch" && o.method === "POST") return Promise.resolve(J({ dry_run: true, items: [] }));
    if (u.pathname === "/api/entityinvite/send-batch") return Promise.resolve(J({ contacts: 2, eligible: 2, sources: { guest: { contacts: 2, eligible: 2 }, speaker: { contacts: 0, eligible: 0 } } }));
    if (u.pathname === "/api/entityinvite/test") return Promise.resolve(J({ ok: true, variant: body.variant || "default" }));
    return Promise.resolve(J({ entities: [], items: [] }));
  };
  const document = { createElement: (t) => new El(t), createTextNode: (t) => new Text(t), getElementById: (id) => (id === "adm" ? root : null), head: new El("head") };
  const ctx = vm.createContext({ window: { M365ADM: { api: "https://api.test", base: "" } }, document, location: { hash: "#ent", search: "" }, fetch, setTimeout });
  vm.runInContext(ADMIN_JS, ctx, { filename: "assets/admin.js" });
  await flush();
  const box = root.querySelector(".adm-guest-invite"); assert.ok(box, "Bereich Gäste einladen fehlt");
  return { box, calls, pending, btn: (t) => byText(box, "BUTTON", t), msg: () => box.all((e) => e.className.startsWith("adm-msg"))[0].textContent };
}
const sends = (calls) => calls.filter((c) => c.path === "/api/entityinvite/send-batch" && c.method === "POST" && !c.body.dry_run).length;

test("322-10: \"50 senden\" bleibt gesperrt, bis der Versand fertig ist - kein zweiter Lauf per Klick, auch nicht ueber Probelauf oder Quellenwechsel", async () => {
  const { box, calls, pending, btn, msg } = await bootAdmin();
  const send = btn("50 senden"), dry = btn("Probelauf (50)");
  send.click(); assert.equal(send.disabled, true);
  btn("Nein").click(); assert.equal(send.disabled, false, "Nein gibt wieder frei");
  send.click(); btn("Ja").click(); await flush();
  assert.equal(sends(calls), 1); assert.equal(pending.length, 1);
  assert.equal(send.disabled, true, "waehrend des Versands gesperrt"); assert.equal(dry.disabled, true);
  assert.equal(btn("Ja"), undefined, "Rueckfrage ist weg");
  send.click(); assert.equal(btn("Ja"), undefined);
  btn("Speaker").click(); assert.equal(send.disabled, true, "Quellenwechsel gibt den Knopf nicht frei"); send.click();
  await flush(); assert.equal(sends(calls), 1);
  pending[0].resolve({ dry_run: false, sent: 2, rate_limited: false, results: [{ eid: "a", ok: true, variant: "default" }, { eid: "b", ok: true, variant: "mvp" }] }); await flush();
  assert.equal(send.disabled, false); assert.equal(dry.disabled, false); assert.match(msg(), /^2 Einladungen gesendet\.$/);
  assert.equal(box.all((e) => e.tagName === "LI").length, 2);
  // der Server weist einen parallelen Lauf ab (anderes Fenster): verstaendliche Meldung, Knopf danach wieder frei
  send.click(); btn("Ja").click(); await flush(); assert.equal(send.disabled, true);
  pending[1].resolve({ error: "busy" }, 409); await flush();
  assert.match(msg(), /Es läuft bereits ein Versand/); assert.equal(send.disabled, false);
  // keine Antwort (Netz): nicht fuer immer gesperrt
  send.click(); btn("Ja").click(); await flush(); pending[2].reject(new Error("offline")); await flush();
  assert.match(msg(), /Keine Antwort vom Server/); assert.equal(send.disabled, false); assert.equal(dry.disabled, false);
  assert.equal(sends(calls), 3);
});

test("322-9: \"Testmail an mich\" schickt die gewaehlte Fassung mit (alle vier waehlbar, Standard automatisch)", async () => {
  const { box, calls, btn, msg } = await bootAdmin();
  const sel = box.all((e) => e.tagName === "SELECT")[0], eid = box.all((e) => e.tagName === "INPUT")[0];
  assert.deepEqual(sel.children.map((o) => o._value), ["", "default", "mvp", "speaker", "neutral"]);
  eid.value = "David-Benaim"; btn("Testmail an mich").click(); await flush();
  assert.deepEqual(calls.at(-1), { path: "/api/entityinvite/test", method: "POST", body: { eid: "david-benaim", variant: "" } });
  for (const v of ["default", "mvp", "speaker", "neutral"]) {
    sel.value = v; btn("Testmail an mich").click(); await flush();
    assert.deepEqual(calls.at(-1).body, { eid: "david-benaim", variant: v }); assert.match(msg(), new RegExp("Variante " + v));
  }
});
