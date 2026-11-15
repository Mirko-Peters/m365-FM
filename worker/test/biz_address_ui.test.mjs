// Oberflaeche Geschaeftsadresse und Adress-Nachweis (Migration 0046): assets/profile.js im Reiter "Firmen" (Uebernahme iFAKT-Fall: Firma ohne Inhaber,
// kein Firmen-Postfach) und assets/admin.js (Uebernahme-Anfragen). Beide Skripte laufen unveraendert in node:vm; profile.js spricht mit den echten Handlern auf SQLite.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import vm from "node:vm";
import { handleClaimVerify } from "../src/claimverify.js";
import { handleProfiles } from "../src/profiles.js";
import { handleEvents } from "../src/events.js";

const PROFILE_JS = readFileSync(new URL("../../assets/profile.js", import.meta.url), "utf8");
const ADMIN_JS = readFileSync(new URL("../../assets/admin.js", import.meta.url), "utf8");
const MATCH_JS = readFileSync(new URL("../../assets/entity-match.js", import.meta.url), "utf8");
const UI_EN = JSON.parse(readFileSync(new URL("../../data/ui_js_en.json", import.meta.url), "utf8"));
const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
const ADDR = { street: "Curiestr. 2", zip: "70563", city: "Stuttgart", country: "Germany" };
const entities = [{ id: "acme", type: "org", name: "Acme GmbH", web: "https://www.acme.de", ...ADDR }, { id: "other", type: "org", name: "Other AG" }];

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
function matcher(sel) {   // genau die Selektoren, die die beiden Skripte benutzen: .klasse, [attr=wert], Tag und "a b" (Nachfahre)
  let m;
  if (sel.includes(" ")) { const [a, b] = sel.split(/\s+/, 2).map(matcher); return (e) => { if (!b(e)) return false; for (let p = e.parentNode; p; p = p.parentNode) if (p.nodeType === 1 && a(p)) return true; return false; }; }
  if (/^[a-z]+$/.test(sel)) return (e) => e.tagName === sel.toUpperCase();
  if ((m = /^\.([\w-]+)$/.exec(sel))) return (e) => e.className.split(/\s+/).includes(m[1]);
  if ((m = /^\[([\w-]+)=([\w-]+)\]$/.exec(sel))) return (e) => e.getAttribute(m[1]) === m[2];
  throw new Error("Selektor nicht unterstuetzt: " + sel);
}
const flush = async (n = 30) => { for (let i = 0; i < n; i++) await new Promise((r) => setImmediate(r)); };
const byText = (root, tag, text) => root.all((e) => e.tagName === tag && e.textContent === text)[0];
const CL = UI_EN["profile.CL"], CS = UI_EN["profile.CS"];
const field = (root, text) => { const l = root.all((e) => e.tagName === "LABEL" && e.textContent === text)[0]; assert.ok(l, "Feld fehlt: " + text); return root.all((e) => e.id === l.getAttribute("for"))[0]; };
const fill = (root, o) => { for (const [k, v] of Object.entries(o)) field(root, k).value = v; };

async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf8"));
  const db = { prepare(sql) { let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: raw.prepare(sql).all(...a) }), first: async () => raw.prepare(sql).get(...a) ?? null, run: async () => { const r = raw.prepare(sql).run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; }, async batch(s) { for (const x of s) await x.run(); } };
  // iFAKT-Fall: zur Firmen-Entitaet gibt es schon eine gepaarte Firma ohne Inhaber (0034); Mitglied 1 hat kein Postfach bei acme.de
  raw.exec(`INSERT INTO users(id,provider,sub,name,created) VALUES(1,'github','s1','Mirko Muster',1),(4,'github','s4','Admin',1);
    INSERT INTO profiles(user_id,public,handle,updated) VALUES(1,1,'mirko-m',1);
    INSERT INTO orgs(id,handle,name,public,unclaimed,created) VALUES(5,'acme-org','Acme GmbH',0,1,1); INSERT INTO org_entity(org_id,eid,confirmed) VALUES(5,'acme',0);`);
  const old = globalThis.fetch;
  globalThis.fetch = async (i) => { const u = String(i); return u.endsWith("/entities-src.json") || u.endsWith("/entities.json") ? { ok: true, json: async () => ({ entities }) } : { ok: false, json: async () => ({}) }; };
  return { raw, env: { DB: db, SITE: "https://www.m365.fm", API: "https://api.test", SESSION_SECRET: "s" }, restore: () => { globalThis.fetch = old; raw.close(); } };
}

// profile.js angemeldet starten; Uebernahme-, Firmen- und Adress-Routen gehen an die echten Handler
async function bootProfile(env, user) {
  const main = new El("main"), calls = [];
  for (const [tag, id] of [["h1", "c-h1"], ["div", "c-page"], ["div", "c-expert"], ["div", "c-mvp"], ["div", "c-events"], ["div", "c-blog"], ["div", "c-library"]]) { const e = new El(tag); e.id = id; main.appendChild(e); }
  const fetch = async (url, o = {}) => {
    const u = new URL(url); calls.push({ path: u.pathname + u.search, method: o.method || "GET", body: o.body ? JSON.parse(o.body) : null });
    if (u.pathname === "/entities.json") return J({ entities });
    if (u.pathname === "/api/profile/me") return J({ profile: { public: true }, suggest: "mirko-m" });
    const req = () => new Request(u, { method: o.method || "GET", headers: o.headers, body: o.body });
    if (/^\/api\/entity\/claim\/(domains|domain|forward|confirm|evidence)$/.test(u.pathname)) return handleClaimVerify(env, req(), u, u.pathname, user, J);
    if (/^\/api\/entity\/claims?(\/mine)?$/.test(u.pathname)) return handleEvents(env, req(), u, u.pathname, user, J);
    if (/^\/api\/(org|orgs\/search|org\/mine|profile\/business)$/.test(u.pathname)) return handleProfiles(env, req(), u, u.pathname, user, J);
    return J({ error: "login" }, 401);
  };
  const document = { createElement: (t) => new El(t), createTextNode: (t) => new Text(t), getElementById: (id) => main.all((e) => e.id === id)[0] || null, querySelector: (s) => main.querySelector(s), documentElement: { lang: "en" } };
  const window = { M365X: { api: "https://api.test", base: "https://www.m365.fm", lang: "en" }, addEventListener() {} };
  const ctx = vm.createContext({ window, document, location: { search: "", hash: "#c-orgs", href: "https://www.m365.fm/community/#c-orgs", pathname: "/community/" }, fetch, URL, URLSearchParams, setTimeout, clearTimeout, history: { replaceState() {} }, localStorage: { getItem: () => null, setItem() {} }, navigator: {}, console });
  vm.runInContext(MATCH_JS, ctx, { filename: "assets/entity-match.js" });
  vm.runInContext(PROFILE_JS, ctx, { filename: "assets/profile.js" });
  await flush();
  return { calls, orgs: main.all((e) => e.id === "c-orgs")[0] };
}

test("iFAKT-Fall: Firma ohne Inhaber uebernehmen meldet 'beantragt' statt 'angelegt', Adress-Nachweis geht an die Redaktion, nach dem Neuladen sichtbar", async () => {
  const { raw, env, restore } = await setup(), user = { id: 1, name: "Mirko Muster" };
  try {
    let { orgs, calls } = await bootProfile(env, user);
    const q = orgs.all((e) => e.tagName === "INPUT" && e.getAttribute("placeholder") === "Company name or website")[0];
    q.value = "Acme"; for (const fn of q.listeners.input) fn({}); await new Promise((r) => setTimeout(r, 350)); await flush();
    byText(orgs, "BUTTON", CS.take).click(); await flush(60);
    const org = calls.find((c) => c.path === "/api/org" && c.method === "POST"); assert.ok(org, "Firma wird angefragt");
    assert.ok(orgs.textContent.includes(CS.pend), "claim_required: Uebernahme beantragt");
    assert.ok(!orgs.textContent.includes(CS.made), "nicht 'Firma angelegt'");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM org_members WHERE user_id=1").get().n, 0, "keine Mitgliedschaft vor der Bestaetigung");
    assert.deepEqual(Object.values(raw.prepare("SELECT status,user_id FROM entity_claims WHERE eid='acme'").get()), ["pending", 1]);
    // claimBox: Firmen-E-Mail (Domain vorhanden) und zusaetzlich der Adress-Nachweis mit Hinweis auf die Redaktion
    const box = orgs.all((e) => e.className === "wk-form" && e.textContent.includes(CL.step3))[0]; assert.ok(box, "Adress-Nachweis fehlt");
    assert.ok(box.textContent.includes(CL.step1 + " (@acme.de)")); assert.ok(box.textContent.includes(CL.rv_hint));
    fill(box, { [CL.street]: "Curiestraße 2", [CL.zip]: "70563", [CL.city]: "Stuttgart", [CL.country]: "Deutschland", [CL.note]: "Ich arbeite dort im Vertrieb", [CL.link]: "http://acme.de" });
    byText(box, "BUTTON", CL.send3).click(); await flush();
    assert.ok(box.textContent.includes(CL.bad_link), "nur https");
    field(box, CL.link).value = "https://www.acme.de/impressum";
    byText(box, "BUTTON", CL.send3).click(); await flush();
    assert.ok(box.textContent.includes(CL.ev_sent));
    const evd = raw.prepare("SELECT user_id,street,addr_match,note,link FROM entity_claim_evidence WHERE eid='acme'").get();
    assert.deepEqual(Object.values(evd), [1, "Curiestraße 2", "yes", "Ich arbeite dort im Vertrieb", "https://www.acme.de/impressum"]);
    assert.equal(raw.prepare("SELECT status FROM entity_claims WHERE eid='acme'").get().status, "pending", "nie automatisch bestaetigt");
    assert.equal(raw.prepare("SELECT street FROM profile_business WHERE user_id=1 AND eid='acme'").get().street, "Curiestraße 2", "Haken 'auch im Profil speichern' war gesetzt");
    // Neuladen: ohne eigene Firma steht die offene Uebernahme im Reiter "Firmen", Nachweis vorbefuellt
    ({ orgs } = await bootProfile(env, user));
    assert.ok(orgs.textContent.includes(CL.open_h));
    const sum = orgs.all((e) => e.tagName === "SUMMARY" && e.textContent === "Acme GmbH · " + CL.st_evidence)[0]; assert.ok(sum, "offene Uebernahme mit Status");
    const d = sum.parentNode; assert.ok(d.textContent.includes(CL.ev_have.split("{d}")[0]));
    assert.equal(field(d, CL.street).value, "Curiestraße 2");
    assert.equal(d.all((e) => e.tagName === "LABEL" && e.textContent.includes(CL.savebiz)).length, 0, "schon im Profil: kein Haken mehr");
  } finally { restore(); }
});

test("Neue Firma anlegen, die es ohne Inhaber schon gibt: kein 'Gespeichert', sondern Uebernahme anbieten", async () => {
  const { raw, env, restore } = await setup(), user = { id: 1, name: "Mirko Muster" };
  try {
    const { orgs } = await bootProfile(env, user), Q = UI_EN["profile.Q"];
    const q = orgs.all((e) => e.tagName === "INPUT" && e.getAttribute("placeholder") === "Company name or website")[0];
    q.value = "Acme GmbH"; for (const fn of q.listeners.input) fn({}); await new Promise((r) => setTimeout(r, 350)); await flush();
    byText(orgs, "BUTTON", CS.no).click(); await flush();
    byText(orgs, "BUTTON", CL.no).click();   // Vorschlag "Passt diese Entitaet?" abgelehnt: der Server findet die Firma trotzdem ueber den Namen
    fill(orgs, { [Q.handle]: "acme-neu" });
    const save = orgs.all((e) => e.tagName === "BUTTON" && e.textContent === Q.save).at(-1); save.click(); await flush(60);
    assert.ok(orgs.textContent.includes(CS.exists)); assert.ok(!orgs.textContent.includes("✓ " + Q.saved));
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM orgs").get().n, 1, "keine zweite Firma");
    const take = orgs.all((e) => e.tagName === "BUTTON" && e.textContent === CS.take).at(-1); take.click(); await flush(60);
    assert.equal(raw.prepare("SELECT status FROM entity_claims WHERE eid='acme' AND user_id=1").get().status, "pending");
    assert.ok(orgs.textContent.includes(CS.pend)); assert.ok(orgs.all((e) => e.tagName === "H4" && e.textContent === CL.step3).length >= 1, "claimBox mit Adress-Nachweis");
  } finally { restore(); }
});

test("Geschaeftsadresse im Reiter Firmen: Firma waehlen, speichern, Fehler zeigen, loeschen", async () => {
  const { raw, env, restore } = await setup(), user = { id: 1, name: "Mirko Muster" };
  try {
    const { orgs } = await bootProfile(env, user), d = orgs.all((e) => e.id === "c-biz")[0];
    assert.ok(d, "Bereich Geschaeftsadresse fehlt"); assert.ok(d.textContent.includes(CL.biz_hint)); assert.ok(d.textContent.includes(CL.biz_none));
    fill(d, { [CL.biz_pick]: "Unbekannt GmbH", [CL.street]: ADDR.street, [CL.zip]: ADDR.zip, [CL.city]: ADDR.city, [CL.country]: ADDR.country });
    byText(d, "BUTTON", CL.biz_save).click(); await flush();
    assert.ok(d.textContent.includes(CL.biz_bad_entity));
    fill(d, { [CL.biz_pick]: "Acme GmbH", [CL.zip]: "x" }); byText(d, "BUTTON", CL.biz_save).click(); await flush();
    assert.ok(d.textContent.includes(CL.bad_zip));
    field(d, CL.zip).value = ADDR.zip; byText(d, "BUTTON", CL.biz_save).click(); await flush();
    assert.ok(d.textContent.includes("Acme GmbH · Curiestr. 2, 70563 Stuttgart, Germany"));
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM profile_business WHERE user_id=1").get().n, 1);
    byText(d, "BUTTON", CL.biz_del).click(); await flush();
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM profile_business").get().n, 0);
    assert.ok(d.textContent.includes(CL.biz_none));
  } finally { restore(); }
});

test("Verwaltung: Uebernahme-Anfrage zeigt Adress-Nachweis, Abgleich, Notiz und Link (nur https)", async () => {
  const { raw, env, restore } = await setup();
  try {
    raw.exec(`UPDATE users SET role='admin' WHERE id=4; INSERT INTO entity_claims(eid,user_id,status,via,created) VALUES('acme',1,'pending','manual',1),('other',1,'pending','manual',1);
      INSERT INTO entity_claim_evidence(eid,user_id,street,zip,city,country,note,link,addr_match,created) VALUES('acme',1,'Curiestr. 2','70563','Stuttgart','Germany','Vertrieb','https://www.acme.de/impressum','yes',1),('other',1,'Weg 1','12345','Berlin','DE','','','unknown',1)`);
    const root = new El("div"); root.id = "adm";
    const fetch = async (url, o = {}) => { const u = new URL(url, "https://api.test"); if (u.pathname === "/api/admin/entity/claims") return handleEvents(env, new Request(u), u, u.pathname, { id: 4, admin: true }, J); return J({ queues: {}, items: [], pending: [], claims: [] }); };
    const document = { createElement: (t) => new El(t), createTextNode: (t) => new Text(t), getElementById: (id) => (id === "adm" ? root : null), head: new El("head") };
    const ctx = vm.createContext({ window: { M365ADM: { api: "https://api.test", base: "" } }, document, location: { hash: "#fr", search: "" }, fetch, setTimeout, console, prompt: () => "" });
    vm.runInContext(ADMIN_JS, ctx, { filename: "assets/admin.js" }); await flush(60);
    const t = root.textContent;
    assert.ok(t.includes("Adress-Nachweis: Curiestr. 2, 70563 Stuttgart, Germany"), "Adresse fehlt");
    assert.ok(t.includes("✔ Adresse stimmt mit der Firmenadresse überein")); assert.ok(t.includes("keine Firmenadresse hinterlegt")); assert.ok(t.includes("Notiz: Vertrieb"));
    const a = root.all((e) => e.tagName === "A" && e.href === "https://www.acme.de/impressum")[0]; assert.ok(a); assert.equal(a.getAttribute("rel"), "noopener noreferrer nofollow");
  } finally { restore(); }
});

test("Texte des Nachweises stehen deutsch und englisch mit gleichen Schluesseln, die englischen in data/ui_js_en.json", () => {
  for (const k of ["CL", "CS"]) {
    const line = PROFILE_JS.split("\n").find((l) => l.includes(`M365L(de, "profile.${k}"`));
    const { de, en } = JSON.parse(JSON.stringify(vm.runInNewContext("var de = false, M365L = function (d, k, a, b) { return { de: a, en: b }; };" + line + ";" + k)));
    assert.deepEqual(UI_EN["profile." + k], en); assert.deepEqual(Object.keys(de), Object.keys(en));
  }
});
