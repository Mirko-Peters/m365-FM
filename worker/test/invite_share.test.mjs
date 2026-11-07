import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
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

test("Ref-Speicher: 30 Tage, nur gueltige Kuerzel", () => {
  const mem = {}, store = { setItem: (k, v) => { mem[k] = v; }, getItem: (k) => mem[k] ?? null, removeItem: (k) => { delete mem[k]; } };
  assert.equal(S.saveRef("<script>", store), false);
  assert.equal(S.saveRef("Max-M", store), true);
  const t = JSON.parse(mem.m365_ref).t;
  assert.equal(S.readRef(store, t + 29 * 86400).ref, "max-m");
  assert.equal(S.readRef(store, t + 31 * 86400), null);
  S.clearRef(store); assert.equal(S.readRef(store), null);
});

test("Keine Fremdskripte: Teilen-Modul laedt nichts nach", () => {
  const src = readFileSync(new URL("../../assets/invite-share.js", import.meta.url), "utf8");
  assert.ok(!/createElement\(["']script|<script|\bfetch\(|XMLHttpRequest|import\(/.test(src));
});
