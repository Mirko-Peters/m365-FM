// Oberflaeche "Eigene Quellen" (assets/mvp-sources.js) mit nachgebauten Bausteinen von mvp-tracker.js: was der Assistent wirklich sendet (Review #318).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const code = readFileSync(new URL("../../assets/mvp-sources.js", import.meta.url), "utf-8");
const EN = JSON.parse(readFileSync(new URL("../../data/ui_js_en.json", import.meta.url), "utf-8"))["mvpsrc.Q"];
const tick = () => new Promise((r) => setTimeout(r, 0));

// Seite nachbauen: el/btn/input/... liefern einfache Objekte, api zeichnet auf und antwortet aus answers (Pfad-Anfang -> { s, j })
function page(answers = {}, zipItems = []) {
  const win = { M365X: { lang: "en" }, M365LinkedInExport: { readZip: async () => ({}), parseExport: () => zipItems } };
  vm.runInNewContext(code, { window: win });
  const S = win.M365MVPSources, sent = [], said = [], ui = { root: null };
  const node = (tag, o = {}, kids = []) => ({ tag, ...o, kids: kids.filter((k) => k !== null && k !== undefined && k !== false), appendChild(k) { this.kids.push(k); return k; } });
  const c = {
    S: { data: { contributions: [] } },
    el: (tag, attrs = {}, kids = []) => node(tag, attrs, kids),
    btn: (text, fn, cls, extra) => node("button", { text, onclick: fn, ...(extra || {}) }),
    field: (label, control) => node("field", { label }, [control]),
    select: (opts, value) => node("select", { value }),
    check: (label, checked, onchange) => node("check", { label, checked, onchange }),
    input: (type, value) => { const i = node("input", { type, value: value || "", on: {} }); i.addEventListener = (ev, fn) => { i.on[ev] = fn; }; return i; },
    segmented: (label, opts, cur, pick) => node("seg", { label, opts, cur, pick }),
    heading: (text) => node("h2", { text }),
    // Kopie des Rumpfs: Objekte aus dem vm-Kontext haben eigene Prototypen (deepEqual)
    api: (path, body) => { sent.push({ path, body: body === undefined ? undefined : JSON.parse(JSON.stringify(body)) }); const k = Object.keys(answers).find((a) => path.startsWith(a)); return Promise.resolve(k ? answers[k] : { s: 200, j: {} }); },
    say: (text, ok) => said.push({ text, ok: !!ok }), load: (after) => { if (after) after(); }, render: () => { ui.root = S.addCard(c); },
    fmtDate: (t) => String(t), hostOf: (u) => new URL(u).hostname, invalid: (el, msg) => said.push({ text: msg, invalid: true }),
  };
  c.render();
  const all = (n = ui.root, out = []) => { out.push(n); (n.kids || []).forEach((k) => all(k, out)); return out; };
  const click = async (text) => { const b = all().find((n) => n.tag === "button" && n.text === text); assert.ok(b, `Knopf "${text}" fehlt`); b.onclick(); await tick(); };
  const field = (label) => { const f = all().find((n) => n.tag === "field" && n.label === label); assert.ok(f, `Feld "${label}" fehlt`); return f.kids[0]; };
  return { S, c, sent, said, ui, all, click, field, seg: () => all().find((n) => n.tag === "seg") };
}

test("Texte: die englische Fassung im Skript ist die Quelle in data/ui_js_en.json", () => {
  assert.deepEqual({ ...page().S.strings }, EN);
});

test("318-9a LinkedIn: nach dem Wechsel von ZIP zu Artikel-Link wird der geladene Artikel gesendet, nicht die alte ZIP-Auswahl", async () => {
  const zip = [{ title: "Old ZIP post A", url: "https://www.linkedin.com/pulse/a", date: "2026-01-01" }, { title: "Old ZIP post B", url: "https://www.linkedin.com/pulse/b", date: "2026-01-02" }];
  const p = page({ "/api/contributions/linkedin-og": { s: 200, j: { preview: { url: "https://www.linkedin.com/pulse/new", title: "NEW article by link", description: "Intro.", published: "2026-05-01" } } },
    "/api/contributions/import": { s: 201, j: { added: 1 } } }, zip);
  await p.click(EN.k_linkedin);
  p.seg().pick("zip");
  const file = p.all().find((n) => n.tag === "input" && n.type === "file");
  file.files = [{ arrayBuffer: async () => new ArrayBuffer(8) }]; file.on.change(); await tick(); await tick();
  for (const cb of p.all().filter((n) => n.tag === "check")) cb.onchange({ target: { checked: true } });
  await p.click(EN.next);
  await p.click(EN.back);
  p.seg().pick("url");
  p.field(EN.li_url).value = "https://www.linkedin.com/pulse/new";
  await p.click(EN.li_fetch);
  assert.equal(p.field(EN.ent_title).value, "NEW article by link", "das Formular zeigt den Artikel");
  await p.click(EN.next);
  await p.click(EN.save);
  const body = p.sent.find((x) => x.path === "/api/contributions/import").body;
  assert.deepEqual(body.items.map((i) => i.title), ["NEW article by link"]);
  assert.equal(body.kind, "linkedin");
  // und umgekehrt: nach dem Wechsel zurueck zu ZIP ohne neue Auswahl geht nichts Altes hinaus
  const q = page({ "/api/contributions/linkedin-og": { s: 200, j: { preview: { url: "https://www.linkedin.com/pulse/x", title: "Loaded by link", published: "2026-05-01" } } } }, zip);
  await q.click(EN.k_linkedin);
  q.field(EN.li_url).value = "https://www.linkedin.com/pulse/x";
  await q.click(EN.li_fetch);
  q.seg().pick("zip");
  await q.click(EN.next);
  assert.ok(!q.sent.some((x) => x.path === "/api/contributions/import"), "ohne Auswahl kein Import");
  assert.ok(!q.all().some((n) => n.tag === "button" && n.text === EN.save), "bleibt bei Schritt 2");
});

test("318-9b Anderer Link: die gewaehlte MVP-Kategorie geht mit; 318-8 die Meldung nennt veroeffentlicht, wartend und nur getrackt", async () => {
  const p = page({ "/api/contributions/import": { s: 201, j: { added: 8, published: 5, pending: 3, unposted: 0, held: "post_limit" } } });
  await p.click(EN.k_other);
  p.field(EN.ent_title).value = "My book"; p.field(EN.url).value = "https://books.example.com/b"; p.field(EN.date).value = "2026-01-10"; p.field(EN.type).value = "Book";
  await p.click(EN.next);
  await p.click(EN.save);
  const body = p.sent.find((x) => x.path === "/api/contributions/import").body;
  assert.deepEqual(body.items, [{ title: "My book", url: "https://books.example.com/b", date: "2026-01-10", summary: "", ctype: "Book" }]);
  const msg = p.said.at(-1);
  assert.equal(msg.ok, true);
  assert.equal(msg.text, `8 items added. 5 published as short posts. 3 are waiting in “New finds”: ${EN.e_post_limit}`);
  const q = page({ "/api/contributions/import": { s: 201, j: { added: 3, published: 1, pending: 0, unposted: 2, held: "" } } });
  await q.click(EN.k_other);
  q.field(EN.ent_title).value = "Old one"; q.field(EN.date).value = "2025-01-10";
  await q.click(EN.next); await q.click(EN.save);
  assert.equal(q.said.at(-1).text, "3 items added. 1 published as short posts. 2 only tracked (no link, older than 120 days or already in the feed).");
  // Quelle im Modus publish ohne Vertrauens-Schwelle: der Hinweis des Servers erscheint
  const r = page({ "/api/contributions/source": { s: 201, j: { ok: true, id: 1, hint: "not_trusted" } } });
  await r.click(EN.k_blog);
  r.field(EN.url).value = "https://dev.example.com/feed.xml";
  await r.click(EN.next); await r.click(EN.save);
  assert.equal(r.said.at(-1).text, `${EN.saved} ${EN.e_not_trusted}`);
});

test("318-4 Kurzpost in der Detailansicht: zurueckziehen, wieder veroeffentlichen, Fehler lesbar", async () => {
  const p = page({ "/api/contributions/unpublish": { s: 200, j: { ok: true } }, "/api/contributions/review": { s: 403, j: { error: "not_trusted" } } });
  const texts = (n, out = []) => { if (n.text) out.push(n.text); (n.kids || []).forEach((k) => texts(k, out)); return out; };
  const press = async (box, text) => { const b = box.kids.flatMap((k) => k.kids || []).find((n) => n.tag === "button" && n.text === text); assert.ok(b, text); b.onclick(); await tick(); };
  const live = p.S.postBox(p.c, { id: 5, url: "https://a.example.com/a", review: "", kind: "blog", post: "live" });
  assert.ok(texts(live).join(" ").includes(EN.p_hint), "Hinweis: Loeschen entfernt auch den Kurzpost");
  await press(live, EN.unpost);
  assert.deepEqual(p.sent.at(-1), { path: "/api/contributions/unpublish", body: { id: 5 } });
  assert.deepEqual(p.said.at(-1), { text: EN.unposted, ok: true });
  const back = p.S.postBox(p.c, { id: 5, url: "https://a.example.com/a", review: "", kind: "blog", post: "withdrawn" });
  await press(back, EN.repost);
  assert.deepEqual(p.sent.at(-1), { path: "/api/contributions/review", body: { id: 5, action: "publish" } });
  assert.deepEqual(p.said.at(-1), { text: EN.e_not_trusted, ok: false });
  const mod = p.S.postBox(p.c, { id: 6, url: "https://a.example.com/b", review: "", kind: "blog", post: "moderated" });
  assert.ok(texts(mod).includes(EN.p_moderated) && !texts(mod).includes(EN.repost) && !texts(mod).includes(EN.post), "ausgeblendet: kein Knopf");
  const plain = p.S.postBox(p.c, { id: 7, url: "https://a.example.com/c", review: "", kind: "blog", post: "" });
  assert.ok(texts(plain).includes(EN.post), "getrackter Eintrag mit Link laesst sich veroeffentlichen");
  for (const x of [{ id: 8, url: "", review: "", kind: "blog", post: "" }, { id: 9, url: "https://a.example.com/d", review: "pending", kind: "blog", post: "" }, { id: 10, url: "https://github.com/a/b", review: "", kind: "github", post: "" }])
    assert.equal(p.S.postBox(p.c, x), null, JSON.stringify(x));
  const tracker = readFileSync(new URL("../../assets/mvp-tracker.js", import.meta.url), "utf-8");
  assert.match(tracker, /M365MVPSources\.postBox\(ctx\(\), c\)/, "die Detailansicht bindet den Kurzpost-Kasten ein");
  assert.match(tracker, /c\.posted && window\.M365MVPSources/, "das Protokoll kennzeichnet veroeffentlichte Eintraege");
});
