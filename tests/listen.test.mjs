// Geraeteerkennung und Ziel-Wahl der Anhoeren-Karten (assets/listen.js): Apple-Geraete -> Apple Podcasts, alle anderen -> Spotify; ohne Zuordnung bleibt das href.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const M = createRequire(import.meta.url)("../assets/listen.js");

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const IPAD_DESKTOP_MODE = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15";
const MAC = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const ANDROID = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36";
const WINDOWS = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

test("Apple-Geraete werden erkannt", () => {
  assert.equal(M.isApple(IPHONE, "iPhone", 5), true);
  assert.equal(M.isApple(IPAD_DESKTOP_MODE, "MacIntel", 5), true);
  assert.equal(M.isApple(MAC, "MacIntel", 0), true);
  assert.equal(M.isApple("", "iPad", 0), true);
});

test("alle anderen Geraete sind keine Apple-Geraete", () => {
  assert.equal(M.isApple(ANDROID, "Linux armv81", 5), false);
  assert.equal(M.isApple(WINDOWS, "Win32", 0), false);
  assert.equal(M.isApple("", "", 0), false);
  assert.equal(M.isApple(undefined, undefined, undefined), false);
});

test("Ziel: Apple-Geraet nimmt Apple, sonst Spotify, fehlt eins, das andere, fehlen beide, leer", () => {
  assert.equal(M.pick("A", "S", true), "A");
  assert.equal(M.pick("A", "S", false), "S");
  assert.equal(M.pick("", "S", true), "S");
  assert.equal(M.pick("A", "", false), "A");
  assert.equal(M.pick("", "", true), "");
  assert.equal(M.pick(undefined, undefined, false), "");
});

// kleine Dokument-Attrappe: genug fuer querySelector/querySelectorAll/getAttribute/setAttribute/classList
function el(attrs = {}, cls = []) {
  const a = { ...attrs };
  const classes = new Set(cls);
  return {
    parentNode: null,
    getAttribute: (k) => (k in a ? a[k] : null),
    setAttribute: (k, v) => { a[k] = v; },
    attrs: a,
    classList: { add: (c) => classes.add(c), remove: (c) => classes.delete(c), contains: (c) => classes.has(c) },
    classes,
  };
}

function doc({ card, bar }) {
  return {
    querySelectorAll: (sel) => (sel.startsWith(".ls-card") ? (card ? [card.el] : []) : sel === ".ls-follow" ? (bar ? [bar.el] : []) : []),
  };
}

test("Karte: href wird je Geraet gesetzt, Link oeffnet im neuen Tab mit noopener", () => {
  const main = el({ href: "https://www.m365.fm/show/episodes/x/" });
  const card = { el: { getAttribute: (k) => ({ "data-apple": "https://podcasts.apple.com/e", "data-spotify": "https://open.spotify.com/episode/e" })[k] || null, querySelector: () => main } };
  M.wire(doc({ card }), true);
  assert.equal(main.attrs.href, "https://podcasts.apple.com/e");
  assert.equal(main.attrs.target, "_blank");
  assert.equal(main.attrs.rel, "noopener");
  const main2 = el({ href: "https://www.m365.fm/show/episodes/x/" });
  card.el.querySelector = () => main2;
  M.wire(doc({ card }), false);
  assert.equal(main2.attrs.href, "https://open.spotify.com/episode/e");
});

test("Karte ohne Zuordnung: href bleibt die Folgenseite", () => {
  const main = el({ href: "https://www.m365.fm/show/episodes/x/" });
  const card = { el: { getAttribute: () => null, querySelector: () => main } };
  M.wire(doc({ card }), true);
  assert.equal(main.attrs.href, "https://www.m365.fm/show/episodes/x/");
  assert.equal(main.attrs.target, undefined);
});

test("Show folgen: Hauptknopf nach Geraet, der andere Link wird klein und rueckt nach hinten; zweimal ausgefuehrt aendert nichts", () => {
  const apple = el({ "data-lp": "apple" }, ["ls-fb"]);
  const spot = el({ "data-lp": "spotify" }, ["ls-fb"]);
  const kids = [apple, spot];
  const parent = { firstChild: apple, insertBefore: (n, ref) => { kids.splice(kids.indexOf(n), 1); kids.splice(kids.indexOf(ref), 0, n); parent.firstChild = kids[0]; } };
  apple.parentNode = parent; spot.parentNode = parent;
  const bar = { el: { querySelector: (s) => (s.includes("apple") ? apple : spot) } };
  M.wire(doc({ bar }), false);
  M.wire(doc({ bar }), false);
  assert.ok(spot.classes.has("ls-btn") && !spot.classes.has("ls-alt"));
  assert.ok(apple.classes.has("ls-alt") && !apple.classes.has("ls-btn"));
  assert.equal(kids[0], spot);
  M.wire(doc({ bar }), true);
  assert.ok(apple.classes.has("ls-btn") && spot.classes.has("ls-alt"));
  assert.equal(kids[0], apple);
});
