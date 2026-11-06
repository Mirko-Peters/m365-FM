// assets/expert-connect.js in node:vm mit kleinem Schein-DOM: Einstellungen (laufende Pause) und angenommene Anfragen (Medium).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const EC_JS = readFileSync(new URL("../../assets/expert-connect.js", import.meta.url), "utf8");

class Text { constructor(t) { this.nodeType = 3; this.data = String(t); } get textContent() { return this.data; } }
class El {
  constructor(tag) { this.nodeType = 1; this.tagName = tag.toUpperCase(); this.attrs = {}; this.childNodes = []; this.listeners = {}; this.dataset = {}; this.checked = false; this.value = ""; }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return Object.hasOwn(this.attrs, k) ? this.attrs[k] : null; }
  removeAttribute(k) { delete this.attrs[k]; }
  appendChild(c) { this.childNodes.push(c); return c; }
  append(...cs) { for (const c of cs) this.appendChild(typeof c === "string" ? new Text(c) : c); }
  replaceChildren(...cs) { this.childNodes = []; this.append(...cs); }
  get textContent() { return this.childNodes.map((n) => n.textContent).join(""); }
  set textContent(t) { this.childNodes = t ? [new Text(t)] : []; }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  fire(type) { for (const fn of this.listeners[type] || []) fn({ type, target: this, preventDefault() {} }); }
  all(pred) { const out = []; const walk = (n) => { for (const c of n.childNodes) if (c.nodeType === 1) { if (pred(c)) out.push(c); walk(c); } }; walk(this); return out; }
}

async function boot(responses) {
  const root = new El("div"), posts = [];
  const fetch = async (url, o = {}) => {
    const u = new URL(url);
    if (o.method === "POST") posts.push({ path: u.pathname, body: JSON.parse(o.body) });
    const data = u.pathname.endsWith("topics.json") ? [] : o.method === "POST" ? { ok: true } : responses[u.pathname] || {};
    return new Response(JSON.stringify(data), { status: 200 });
  };
  const T = new Proxy({}, { get: (_, k) => (typeof k === "string" ? k : undefined) });   // Texte = Schluessel
  const document = { createElement: (t) => new El(t), createTextNode: (t) => new Text(t), getElementById: (id) => (id === "ec" ? root : null), querySelectorAll: () => [], querySelector: () => null, addEventListener() {} };   // #271: Klick-Handler fuer Anker auf document
  const window = { M365EC: { api: "https://api.test", base: "https://www.m365.fm", lang: "en", t: T, topics: "https://www.m365.fm/community/expert-connect/topics.json",
    langs: [["en", "English"], ["de", "Deutsch"]], formats: ["quote", "interview"] }, addEventListener() {} };
  const ctx = vm.createContext({ window, document, location: { hash: "#expert", href: "https://www.m365.fm/community/expert-connect/#expert" }, fetch, setTimeout, URL, URLSearchParams, sessionStorage: { getItem: () => null, setItem() {} } });
  vm.runInContext(EC_JS, ctx, { filename: "assets/expert-connect.js" });
  for (let i = 0; i < 200 && !root.all((e) => e.tagName === "FORM").length; i++) await new Promise((r) => setTimeout(r, 2));
  return { root, posts };
}
const settle = () => new Promise((r) => setTimeout(r, 10));

test("expert connect UI: laufende Pause ist angehakt und wird beim Speichern nicht beendet", async () => {
  const until = Math.floor(Date.now() / 1000) + 7 * 86400;
  const { root, posts } = await boot({
    "/api/expert-requests/matches": { requests: [], matches: [], accepted: [] },
    "/api/expert-settings": { settings: { opt_in: true, formats: ["interview"], langs: ["en"], notify: "push", contact_pref: "platform", contact_value: "", paused_until: until } },
  });
  const form = root.all((e) => e.tagName === "FORM" && e.getAttribute("class") === "ec-form").at(-1);
  const pause = form.all((e) => e.tagName === "LABEL" && e.textContent === "pause")[0].childNodes[0];
  assert.equal(pause.checked, true, "laufende Pause vorausgefuellt");
  form.fire("submit"); await settle();
  assert.equal(posts.length, 1);
  assert.equal("paused_until" in posts[0].body, false, "Speichern ohne Aenderung beendet die Pause nicht");
  assert.equal("pause_weeks" in posts[0].body, false, "und verlaengert sie nicht");
  pause.checked = false; form.fire("submit"); await settle();
  assert.equal(posts[1].body.paused_until, 0, "Haken entfernt: Pause endet");
  pause.checked = true; form.fire("submit"); await settle();
  assert.equal(posts[2].body.pause_weeks, 2, "erneut angehakt: neue Pause");
});

test("expert connect UI: angenommene Anfrage zeigt das Medium", async () => {
  const { root } = await boot({
    "/api/expert-requests/matches": { requests: [], matches: [], accepted: [{ request_id: 4, title: "Azure story", reach: "Contoso Magazine", publisher: "Publisher", kind: "match", contacts: { publisher: { method: "platform" } } }] },
    "/api/expert-settings": { settings: {} },
  });
  assert.ok(root.textContent.includes("Contoso Magazine"));
});
