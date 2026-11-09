import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const S = createRequire(import.meta.url)("../../assets/invite-share.js");
const link = "https://www.m365.fm/einladung/max-m/";

test("Teilen-URLs: richtig kodiert, de/en Texte", () => {
  const de = S.shareUrls(link, "de"), en = S.shareUrls(link, "en");
  assert.equal(de.linkedin, "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(link));
  assert.equal(de.facebook, "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(link));
  assert.match(de.x, /^https:\/\/twitter\.com\/intent\/tweet\?text=Ich%20bin%20bei%20M365\.FM.*&url=https%3A%2F%2Fwww\.m365\.fm%2Feinladung%2Fmax-m%2F$/);
  assert.ok(de.whatsapp.startsWith("https://wa.me/?text=") && de.whatsapp.endsWith(encodeURIComponent(" " + link)));
  assert.ok(de.mail.startsWith("mailto:?subject=Einladung%20zu%20M365.FM&body=") && de.mail.includes("%0A%0A" + encodeURIComponent(link)));
  assert.ok(en.mail.includes("Invitation%20to%20M365.FM"));
  const evil = S.shareUrls("https://x.test/?a=1&b=<2>", "en");
  for (const u of Object.values(evil)) assert.ok(!/[<> ]/.test(u.split("://")[1] || u), u);
});

const memStore = (init = {}) => { const mem = { ...init }; return { mem, setItem: (k, v) => { mem[k] = String(v); }, getItem: (k) => mem[k] ?? null, removeItem: (k) => { delete mem[k]; } }; };

test("Ref-Speicher: 30 Tage, nur gueltige Kuerzel; abgelaufene und kaputte Eintraege werden geloescht (320-8)", () => {
  const store = memStore(), mem = store.mem;
  assert.equal(S.saveRef("<script>", store), false);
  assert.equal(S.saveRef("Max-M", store), true);
  const t = JSON.parse(mem.m365_ref).t;
  assert.equal(S.readRef(store, t + 29 * 86400).ref, "max-m");
  assert.ok("m365_ref" in mem);
  assert.equal(S.readRef(store, t + 31 * 86400), null);
  assert.ok(!("m365_ref" in mem), "nach 30 Tagen steht nichts mehr im Browser (Datenschutzerklaerung)");
  for (const bad of ["{kaputt", "null", JSON.stringify({ r: "Max M", t }), JSON.stringify({ r: "max-m" }), JSON.stringify({ r: "max-m", t: t + 3 * 86400 })]) {
    mem.m365_ref = bad; assert.equal(S.readRef(store, t), null, bad); assert.ok(!("m365_ref" in mem), bad);
  }
  S.saveRef("max-m", store); S.clearRef(store); assert.equal(S.readRef(store), null);
});

test("Ref-Speicher: derselbe Einlader behaelt ersten Zeitpunkt und Klick-Beleg, ein anderer ersetzt ihn (320-2)", () => {
  const store = memStore(), mem = store.mem, now = Date.now;
  try {
    let T = 1794000000; Date.now = () => T * 1000;
    assert.equal(S.saveRef("max-m", store), true);
    assert.equal(S.setToken("max-m", "max-m.1794000000.c2lnbmF0dXI", store), true);
    assert.equal(S.setToken("anna-b", "anna-b.1794000000.c2lnbmF0dXI", store), false, "Beleg eines anderen Einladers");
    assert.equal(S.setToken("max-m", "<kein beleg>", store), false);
    T += 62;   // Konto ist inzwischen angelegt, die Anmeldung kehrt auf /community/?ref=max-m zurueck
    assert.equal(S.saveRef("max-m", store), true);
    assert.deepEqual(S.readRef(store), { ref: "max-m", t: 1794000000, token: "max-m.1794000000.c2lnbmF0dXI" }, "Zeitpunkt und Beleg des ersten Klicks bleiben");
    assert.equal(S.saveRef("anna-b", store), true);
    assert.deepEqual(S.readRef(store), { ref: "anna-b", t: T, token: "" }, "anderer Einlader: neuer Eintrag ohne den alten Beleg");
  } finally { Date.now = now; }
});

test("Adresse: ?ref= wird gemerkt und entfernt, damit die Anmeldung ohne ref zurueckkehrt (320-2)", () => {
  const store = memStore();
  assert.equal(S.takeRef({ pathname: "/community/", search: "?ref=Max-M", hash: "" }, store), "/community/");
  assert.equal(S.readRef(store).ref, "max-m");
  assert.equal(S.takeRef({ pathname: "/de/community/", search: "?a=1&ref=max-m&b=2", hash: "#c-sub" }, store), "/de/community/?a=1&b=2#c-sub");
  assert.equal(S.takeRef({ pathname: "/community/", search: "?a=1", hash: "" }, store), "", "ohne ref bleibt die Adresse, wie sie ist");
  const empty = memStore();
  assert.equal(S.takeRef({ pathname: "/community/", search: "?ref=%3Cscript%3E", hash: "" }, empty), "/community/");
  assert.equal(empty.getItem("m365_ref"), null, "ungueltiges Kuerzel wird nicht gemerkt, der Parameter trotzdem entfernt");
  const src = readFileSync(new URL("../../assets/community.js", import.meta.url), "utf8");
  assert.ok(src.indexOf("SH.takeRef(location)") > 0 && src.indexOf("SH.takeRef(location)") < src.indexOf("function loginBox"), "ref wird entfernt, bevor die Anmelde-Links entstehen");
  assert.match(src, /history\.replaceState\(null, "", clean\)/);
  assert.match(src, /"\/api\/invite\/ref", \{ method: "POST", body: \{ token: r\.token \} \}/, "eingeloest wird nur der Klick-Beleg des Servers, kein Zeitpunkt des Browsers");
});

test("page.js (auf jeder Seite): abgelaufener Einladungs-Ref wird geloescht, ein gueltiger bleibt (320-8)", () => {
  const src = readFileSync(new URL("../../assets/page.js", import.meta.url), "utf8"), now = Math.floor(Date.now() / 1000);
  const run = (stored) => {
    const store = memStore(stored == null ? {} : { m365_ref: stored, other: "x" });
    const ctx = { localStorage: store, navigator: { userAgent: "x", platform: "x", maxTouchPoints: 0 }, location: { href: "https://www.m365.fm/", pathname: "/", search: "", hash: "" }, Date, JSON, Math, setTimeout, console,
      document: { querySelectorAll: () => [], querySelector: () => null, getElementById: () => null, addEventListener() {}, cookie: "", documentElement: { lang: "en", classList: { contains: () => false, add() {}, remove() {} } } } };
    ctx.window = ctx; ctx.addEventListener = () => {};
    vm.runInNewContext(src, ctx);
    return store.mem;
  };
  const fresh = JSON.stringify({ r: "max-m", t: now - 29 * 86400, k: "max-m.1.x" });
  assert.equal(run(fresh).m365_ref, fresh);
  assert.ok(!("m365_ref" in run(JSON.stringify({ r: "max-m", t: now - 31 * 86400 }))));
  assert.ok(!("m365_ref" in run("{kaputt")));
  assert.equal(run(JSON.stringify({ r: "max-m", t: now - 31 * 86400 })).other, "x", "andere Eintraege bleiben");
  assert.deepEqual(run(null), {});
});

test("Einladungskarte (320-3): geteilt wird nur der Link des Servers; ist das Profil nicht oeffentlich, steht ein Hinweis dabei - in jeder Sprache", () => {
  const src = readFileSync(new URL("../../assets/community.js", import.meta.url), "utf8"), card = src.slice(src.indexOf("function inviteCard"), src.indexOf("function badgeEls"));
  assert.ok(!/einladung\//.test(card), "die Karte baut keinen Link selbst zusammen (der Server gibt nur einen Link aus, hinter dem es eine Seite gibt)");
  assert.match(card, /if \(!j\.link\) \{[^}]*tt\("inv_need_profile"\)/);
  assert.match(card, /if \(j\.preview === false\) box\.appendChild\(h\("p", \{ class: "cmut", text: tt\("inv_private"\) \}\)\)/);
  const i18n = JSON.parse(readFileSync(new URL("../../data/community_i18n.json", import.meta.url), "utf8"));
  for (const [lang, t] of Object.entries(i18n)) for (const k of card.match(/tt\("inv_[a-z_0-9]+"\)/g).map((x) => x.slice(4, -2))) assert.ok(t[k] && t[k] !== k, `${lang}: ${k}`);
  assert.match(i18n.de.inv_private, /nicht öffentlich/); assert.match(i18n.en.inv_private, /not public/);
});

test("Keine Fremdskripte: Teilen-Modul laedt nichts nach", () => {
  const src = readFileSync(new URL("../../assets/invite-share.js", import.meta.url), "utf8");
  assert.ok(!/createElement\(["']script|<script|\bfetch\(|XMLHttpRequest|import\(/.test(src));
});
