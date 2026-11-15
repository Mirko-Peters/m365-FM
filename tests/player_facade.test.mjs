// Player erst nach Klick: assets/page.js macht aus dem Platzhalter-Link (site_player.py) einen <button> und setzt beim Klick das iframe ein.
// Lauf: node --test tests/*.mjs   (ohne Browser: kleine DOM-Attrappe, page.js laeuft unveraendert in einem vm-Kontext)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const JS = readFileSync(new URL("../assets/page.js", import.meta.url), "utf8");

class El {
  constructor(tag, attrs = {}) {
    this.tagName = tag.toUpperCase(); this.attrs = { ...attrs }; this.children = []; this.parentNode = null; this.hidden = false; this.listeners = {}; this.focused = false;
    const cls = new Set((attrs.class || "").split(" ").filter(Boolean)); this.classList = { add: (c) => cls.add(c), remove: (c) => cls.delete(c), contains: (c) => cls.has(c), toggle: () => {} };
    Object.defineProperty(this, "className", { get: () => [...cls].join(" "), set: (v) => { cls.clear(); String(v).split(" ").filter(Boolean).forEach((c) => cls.add(c)); } });
  }
  getAttribute(n) { return n in this.attrs ? this.attrs[n] : null; }
  setAttribute(n, v) { this.attrs[n] = String(v); }
  get firstChild() { return this.children[0] || null; }
  appendChild(c) { if (c.parentNode) c.parentNode.children.splice(c.parentNode.children.indexOf(c), 1); c.parentNode = this; this.children.push(c); return c; }
  replaceWith(n) { const p = this.parentNode, i = p.children.indexOf(this); p.children[i] = n; n.parentNode = p; this.parentNode = null; }
  set textContent(v) { this.children.forEach((c) => (c.parentNode = null)); this.children = []; }
  querySelector(sel) { const [tag, cls] = sel.split("."); const walk = (e) => { for (const c of e.children) { if (c.tagName === tag.toUpperCase() && (!cls || c.classList.contains(cls))) return c; const r = walk(c); if (r) return r; } return null; }; return walk(this); }
  addEventListener(t, f, o) { (this.listeners[t] ||= []).push({ f, once: o && o.once }); }
  click() { const l = this.listeners.click || []; this.listeners.click = l.filter((x) => !x.once); l.forEach((x) => x.f({ preventDefault() {} })); }
  focus() { this.focused = true; }
}

function facade(provider, src, title) {
  const box = new El("div", { class: "mp", "data-mp": provider, "data-src": src, "data-title": title });
  const a = box.appendChild(new El("a", { class: "mp-l", href: "https://example.org/", "aria-label": "Play: " + title }));
  a.appendChild(new El("i")); a.appendChild(new El("span"));
  return box;
}

function run(boxes) {
  const noop = () => {};
  const document = {
    querySelectorAll: (s) => (s === ".mp[data-src]" ? boxes : []), querySelector: () => null, getElementById: () => null, addEventListener: noop,
    createElement: (t) => new El(t), documentElement: new El("html"), head: new El("head"), body: new El("body"),
  };
  const ctx = { document, navigator: { userAgent: "", platform: "" }, matchMedia: () => ({ matches: false }), localStorage: { getItem: () => null, setItem: noop },
    IntersectionObserver: class { observe() {} disconnect() {} }, URL, performance, requestAnimationFrame: noop, setTimeout, clearTimeout, setInterval, clearInterval };
  ctx.window = ctx;
  vm.runInNewContext(JS, ctx);
}

test("Platzhalter wird zum Button, Klick setzt iframe mit Autoplay ein", () => {
  const yt = facade("youtube", "https://www.youtube-nocookie.com/embed/abc?rel=0", "Folge A");
  const sp = facade("spreaker", "https://widget.spreaker.com/player?episode_id=42&theme=light&playlist=false", "Folge B");
  run([yt, sp]);
  for (const box of [yt, sp]) {
    const b = box.children[0];
    assert.equal(b.tagName, "BUTTON");
    assert.equal(b.type, "button");
    assert.ok(b.classList.contains("mp-l"));
    assert.match(b.attrs["aria-label"], /^Play: Folge/);
    assert.equal(b.children.length, 2, "Inhalt des Links wandert in den Button");
    b.click();
    assert.equal(box.children.length, 1);
    const f = box.children[0];
    assert.equal(f.tagName, "IFRAME");
    assert.match(f.allow, /autoplay/);
    assert.equal(f.title, box.attrs["data-title"]);
    assert.ok(f.focused, "Fokus geht ins iframe");
  }
  assert.match(yt.children[0].src, /^https:\/\/www\.youtube-nocookie\.com\/embed\/abc\?rel=0&autoplay=1$/);
  assert.match(sp.children[0].src, /episode_id=42.*autoplay=true/);
});

test("fremde Ziele werden nicht eingebettet", () => {
  const bad = facade("youtube", "https://evil.example/embed/x", "X");
  const http = facade("youtube", "http://www.youtube-nocookie.com/embed/x", "Y");
  run([bad, http]);
  for (const box of [bad, http]) {
    box.children[0].click();
    assert.notEqual(box.children[0].tagName, "IFRAME");
  }
});
