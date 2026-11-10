// Redaktion/Moderation, Regeln aus der Gegenpruefung von #319 - alles ueber den echten Worker-Eingang (index.js fetch) mit Sitzungs-Cookie:
// can() als einziges Tor (alte und neue Routen, je Rolle), keine Rollen ausserhalb der Bewerbung, bereinigte Sprachfassungen (Vertrag i18n-overrides v1),
// kein stilles Kuerzen, kein Ueberschreiben fremder Arbeit, Kontoloeschung und Zusammenfuehren, Eskalationen, Paar-Firma bei der Freigabe.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import W from "../src/index.js";
import { makeSession, sha256hex } from "../src/util.js";
import { can, gate, ACTIONS } from "../src/perm.js";
import { mergeStatements } from "../src/identities.js";
import { cleanUnit } from "../src/i18n_edit.js";

const API = "https://api-dub.m365.fm", SITE = "https://www.m365.fm";
const ENTS = [{ id: "teams", type: "product", name: "Microsoft Teams" }, { id: "azure", type: "product", name: "Azure" }, { id: "contoso", type: "org", name: "Contoso", web: "https://www.contoso.com" }];
const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {   // der Worker liest nur die Entitaeten der Seite; alles andere gibt es im Test nicht
  const u = String(input?.url || input);
  if (u.endsWith("/entities.json")) return new Response(JSON.stringify({ entities: ENTS }), { headers: { "content-type": "application/json" } });
  if (/^https:\/\/(www|api-dub)\.m365\.fm\//.test(u)) return new Response("{}", { status: 404 });
  return realFetch(input, init);
};

// Nutzer: 1 Admin, 2 Editor, 3 Moderator, 4 Mitglied (Autor), 5 Editor, 6 Mitglied, 7 Fach-Editor (Bereich: teams)
async function mk() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = {
    prepare(sql) { const st = raw.prepare(sql); let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: st.all(...a) }), first: async () => st.get(...a) ?? null, run: async () => { const r = st.run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; },
    batch: async (l) => { raw.exec("BEGIN"); try { const out = []; for (const s of l) out.push(await s.run()); raw.exec("COMMIT"); return out; } catch (e) { raw.exec("ROLLBACK"); throw e; } },
  };
  const env = { DB: db, SESSION_SECRET: "test-secret-0123456789", API, SITE, CRON_KEY: "cron-test" };
  for (const [id, name, role] of [[1, "Admin", "admin"], [2, "Edi", "editor"], [3, "Mo", "moderator"], [4, "Autor", "user"], [5, "Edi2", "editor"], [6, "Mitglied", "user"], [7, "Fach", "editor"]]) {
    raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(?,?,?,?,?,1)").run(id, "t", "s" + id, name, role);
    raw.prepare("INSERT INTO profiles(user_id,handle,public,updated) VALUES(?,?,1,1)").run(id, "user-" + id);
  }
  ins(raw, "editor_scope", { user_id: 7, topics: '["teams"]', langs: "[]", updated: 1 });
  return { raw, db, env };
}
// Zeile einfuegen; Pflichtspalten ohne Standardwert, die der Test nicht nennt, werden mit ''/0 gefuellt
function ins(raw, table, row) {
  const cols = raw.prepare(`PRAGMA table_info(${table})`).all(), r = { ...row };
  for (const c of cols) if (c.notnull && c.dflt_value === null && !c.pk && !(c.name in r)) r[c.name] = /INT|REAL|NUM/i.test(c.type) ? 0 : "";
  const k = Object.keys(r);
  return Number(raw.prepare(`INSERT INTO ${table}(${k.map((x) => `"${x}"`).join(",")}) VALUES(${k.map(() => "?").join(",")})`).run(...k.map((x) => r[x])).lastInsertRowid);
}
async function call(env, uid, method, path, body, headers = {}) {
  const h = { "x-requested-with": "m365", origin: SITE, ...(uid ? { cookie: `m365s=${await makeSession(env, uid)}` } : {}), ...(body ? { "content-type": "application/json" } : {}), ...headers };
  const r = await W.fetch(new Request(API + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined }), env, { waitUntil() {} });
  return { s: r.status, j: await r.json().catch(() => null) };
}
const blog = (raw, id, uid, status, extra = {}) => ins(raw, "blog_posts", { id, user_id: uid, slug: "p" + id, title: "Beitrag " + id, summary: "Kurz", body: "Text " + id, lang: "de", topics: "[]", status, created: 100, updated: 100, ...extra });
const item = async (env, uid, id) => (await call(env, uid, "GET", "/api/editor/item?kind=blog&id=" + id)).j?.item;
const logs = (raw, where = "1=1") => raw.prepare(`SELECT user_id,role,action,kind,item_id FROM edit_log WHERE ${where} ORDER BY id`).all().map((r) => ({ ...r }));
const roleRow = (raw, id) => ({ ...raw.prepare("SELECT role,role_source FROM users WHERE id=?").get(id) });
const LONG = (n) => ("Ein ganzer Satz mit genug Inhalt fuer die Redaktion. ".repeat(Math.ceil(n / 52))).slice(0, n).trim();

// ---------- 319-1: keine Rolle, kein Bereich, kein Vertrauen ausserhalb von Bewerbung und Admin ----------
test("319-1: /api/admin/verify - Programme und Expertise von Personen bestaetigt nur der Admin; kein Editor macht sich oder andere zum Editor", async () => {
  const { raw, env } = await mk();
  ins(raw, "programs", { owner_type: "u", owner_id: 6, program: "mvp", verified: 0 });        // Selbstangabe eines Mitglieds
  ins(raw, "expertise", { owner_type: "u", owner_id: 7, eid: "azure", level: 3, verified: 0 });   // Selbstangabe des Fach-Editors
  blog(raw, 40, 4, "pending", { topics: '["azure"]' });
  for (const uid of [7, 2, 5, 3, 4]) {   // Fach-Editor, Editoren, Moderator, Mitglied
    const r = await call(env, uid, "POST", "/api/admin/verify", { owner: "u:user-6", kind: "program", key: "mvp", value: 1 });
    assert.equal(r.s, 403, "Konto " + uid); assert.deepEqual(roleRow(raw, 6), { role: "user", role_source: "" });
  }
  assert.equal(raw.prepare("SELECT verified FROM programs WHERE owner_id=6").get().verified, 0);
  assert.equal((await call(env, 2, "POST", "/api/admin/verify", { owner: "u:user-6", kind: "program", key: "mvp", value: 1 })).j.error, "admin_only");
  // Fach-Editor bestaetigt die EIGENE Expertise -> der Bereich darf sich nicht erweitern
  assert.equal((await call(env, 7, "POST", "/api/admin/verify", { owner: "u:user-7", kind: "exp", key: "azure", value: 1 })).s, 403);
  assert.equal((await call(env, 2, "POST", "/api/admin/verify", { owner: "u:user-7", kind: "exp", key: "azure", value: 1 })).j.error, "admin_only");   // auch kein Kollege
  assert.equal(raw.prepare("SELECT verified FROM expertise WHERE owner_id=7").get().verified, 0);
  assert.equal((await call(env, 7, "POST", "/api/editor/decide", { kind: "blog", id: "40", action: "approve" })).j.error, "out_of_scope");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM editor_applications").get().n + raw.prepare("SELECT COUNT(*) n FROM editor_votes").get().n, 0);
  assert.deepEqual(logs(raw), []);   // nichts geschehen, nichts protokolliert
  // der Admin bestaetigt: Editor per Automatik, mit Protokoll, wer bestaetigt hat
  assert.equal((await call(env, 1, "POST", "/api/admin/verify", { owner: "u:user-6", kind: "program", key: "mvp", value: 1 })).s, 200);
  assert.deepEqual(roleRow(raw, 6), { role: "editor", role_source: "auto_mvp" });
  assert.deepEqual(logs(raw, "action='verify.set'"), [{ user_id: 1, role: "admin", action: "verify.set", kind: "verify", item_id: "u:6:program:mvp" }]);
});

test("319-1: Angaben von Firmen und Zertifikate - Editoren ueber can(), nie die eigene Firma, nie das eigene Zertifikat", async () => {
  const { raw, env } = await mk();
  const own = ins(raw, "orgs", { handle: "meine-firma", name: "Meine Firma", created: 1 }), other = ins(raw, "orgs", { handle: "fremde-firma", name: "Fremde Firma", created: 1 });
  ins(raw, "org_members", { org_id: own, user_id: 2, role: "owner", status: "active", created: 1 });
  for (const o of [own, other]) ins(raw, "programs", { owner_type: "o", owner_id: o, program: "partner", verified: 0 });
  assert.equal((await call(env, 2, "POST", "/api/admin/verify", { owner: "o:meine-firma", kind: "program", key: "partner", value: 1 })).j.error, "own_company");
  assert.equal((await call(env, 3, "POST", "/api/admin/verify", { owner: "o:fremde-firma", kind: "program", key: "partner", value: 1 })).s, 403);   // Moderator
  assert.equal((await call(env, 7, "POST", "/api/admin/verify", { owner: "o:fremde-firma", kind: "program", key: "partner", value: 1 })).j.error, "out_of_scope");   // Fach-Editor: kein Thema
  assert.equal((await call(env, 2, "POST", "/api/admin/verify", { owner: "o:fremde-firma", kind: "program", key: "partner", value: 1 })).s, 200);
  assert.deepEqual(raw.prepare("SELECT owner_id,verified FROM programs WHERE owner_type='o' ORDER BY owner_id").all().map((r) => [r.owner_id, r.verified]), [[own, 0], [other, 1]]);
  // Zertifikate: wie in der Pruefliste (wartender Nachweis), nie das eigene
  for (const uid of [2, 4]) { ins(raw, "certs", { user_id: uid, eid: "teams", year: 2025 }); ins(raw, "cert_check", { user_id: uid, eid: "teams", status: "pending", created: 1 }); }
  assert.equal((await call(env, 2, "POST", "/api/admin/verify", { owner: "u:user-2", kind: "cert", key: "teams", value: 1 })).j.error, "own_content");
  assert.equal((await call(env, 2, "POST", "/api/admin/verify", { owner: "u:user-4", kind: "cert", key: "teams", value: 1 })).s, 200);
  assert.deepEqual(raw.prepare("SELECT user_id,status FROM cert_check ORDER BY user_id").all().map((r) => [r.user_id, r.status]), [[2, "pending"], [4, "verified"]]);
  assert.equal(logs(raw, "kind IN ('verify','cert')").length, 2);
});

test("319-1: Rollen und Fachbereiche setzt nur der Admin; die Bewerbung braucht die Stimmen, ein Override ist Admin-Sache", async () => {
  const { raw, env } = await mk();
  for (const uid of [2, 7, 3, 4]) {
    assert.equal((await call(env, uid, "POST", "/api/admin/role/6", { role: "editor" })).s, 403);
    assert.equal((await call(env, uid, "POST", "/api/admin/editor-scope/7", { subject: false })).s, 403);
    assert.equal((await call(env, uid, "GET", "/api/admin/editlog")).s, 403);
  }
  const app = ins(raw, "editor_applications", { user_id: 6, role: "editor", motivation: "Ich helfe gern mit.", created: 1 });
  assert.equal((await call(env, 2, "POST", `/api/editor/applications/${app}/override`, { approve: true })).s, 403);
  assert.equal((await call(env, 3, "POST", `/api/editor/applications/${app}/confirm`, {})).s, 403);   // Moderator stimmt nicht ab
  assert.equal((await call(env, 2, "POST", `/api/editor/applications/${app}/confirm`, {})).j.votes, 1);
  assert.equal((await call(env, 5, "POST", `/api/editor/applications/${app}/confirm`, {})).j.votes, 2);
  assert.equal(roleRow(raw, 6).role, "user");   // zwei Stimmen reichen nicht
  // Kollege derselben Firma: weder bestaetigen noch ablehnen
  ins(raw, "org_members", { org_id: 77, user_id: 6, role: "member", status: "active", created: 1 }); ins(raw, "org_members", { org_id: 77, user_id: 7, role: "member", status: "active", created: 1 });
  assert.equal((await call(env, 7, "POST", `/api/editor/applications/${app}/confirm`, {})).j.error, "colleague");
  assert.equal((await call(env, 7, "POST", `/api/editor/applications/${app}/reject`, { reason: "nein" })).j.error, "colleague");
  assert.equal(roleRow(raw, 6).role, "user");
  assert.equal(can({ id: 2, role: "editor" }, "role.assign").why, "admin_only"); assert.equal(can({ id: 3, role: "moderator" }, "role.vote").ok, false);
});

// ---------- 319-2 / 319-3: Handtexte bereinigt, Vertrag mit #315 ----------
const XSS = ["Hallo <svg/onload=alert(document.domain)>", '<img src="x"onerror="alert(1)">', "<a href=javascript:alert(1)>x</a>", '<a href="&#106;avascript:alert(1)">x</a>',
  '<form action="javascript:alert(1)"><button>ok</button></form>', "<script>alert(1)</script>Text", '<b onclick="alert(1)">fett</b>', '<a href="java\tscript:alert(1)">t</a>', '<iframe src="https://evil.example/"></iframe>ok', "<math><mtext><script>alert(1)</script></mtext></math>ok"];
const BAD = /<\s*(script|svg|iframe|form|button|object|embed|math)\b|\bon\w+\s*=|javascript:|&#106;/i;

test("319-2: Nutzlasten ueber die echte Speicher-Route - gespeichert und exportiert wird nur die Positivliste", async () => {
  const { raw, env } = await mk();
  blog(raw, 20, 4, "live", { slug: "live-post", lang: "en" });
  const save = (uid, text, more = {}) => call(env, uid, "POST", "/api/editor/i18n/save", { kind: "lblog", item: "live-post", lang: "de", unit: "1", text, prev: "Maschinell", sh: "0a1b2c3d", reason: "Test", ...more });
  for (const p of XSS) {
    const r = await save(2, "Vor " + p + " nach");
    assert.ok(r.s === 200 || (r.s >= 400 && ["foreign_image", "bad_html", "unchanged"].includes(r.j.error)), p + " -> " + JSON.stringify(r.j));   // gefaehrliche Behaelter und fremde Bilder: abgelehnt; der Rest: bereinigt gespeichert
    const row = raw.prepare("SELECT text FROM i18n_override WHERE unit='1'").get();
    if (row) assert.doesNotMatch(row.text, BAD, p);
    const exp = (await call(env, null, "GET", "/api/i18n/overrides?kind=lblog&lang=de")).j;   // oeffentlicher Export fuer den Seitenbau
    assert.doesNotMatch(JSON.stringify(exp), BAD, p);
  }
  assert.equal((await save(2, 'Bild <img src="https://tracker.example/p.gif" alt="x">')).j.error, "foreign_image");   // Bilder nur aus dem eigenen Bucket (Projektregel)
  assert.equal((await save(2, 'Mit <strong>Hand</strong>, <a href="https://example.com/a?b=1&c=2">Link</a> und <img src="https://img.m365.fm/a.webp" alt="Bild" width="10">')).s, 200);
  assert.equal(raw.prepare("SELECT text FROM i18n_override WHERE unit='1'").get().text, 'Mit <strong>Hand</strong>, <a href="https://example.com/a?b=1&amp;c=2">Link</a> und <img src="https://img.m365.fm/a.webp" alt="Bild" width="10">');
  assert.equal((await save(2, "x".repeat(20001))).j.error, "too_long");   // nichts wird still gekuerzt
  // aeltere, ungefilterte Zeile in der Datenbank: der Export bereinigt trotzdem
  raw.prepare("UPDATE i18n_override SET text=? WHERE unit='1'").run('Alt <script>alert(1)</script><b onmouseover="x()">ok</b> <a href="javascript:x()">l</a>');
  assert.deepEqual((await call(env, null, "GET", "/api/i18n/overrides?kind=lblog&lang=de")).j.items, { "live-post": { 1: { t: "Alt <b>ok</b> <a>l</a>", sh: "0a1b2c3d" } } });
  assert.equal((await save(2, "Vor <script>alert(1)</script> nach")).j.error, "bad_html");   // nichts verschwindet still: ablehnen statt Inhalt wegwerfen
  // Empfehlung eines Moderators: schon der gespeicherte Vorschlag ist bereinigt
  const p = await save(3, "Vorschlag <img src=x onerror=alert(1)><em>gut</em>");
  assert.equal(p.j.error, "foreign_image");
  const p2 = await save(3, 'Vorschlag <em onclick="alert(1)">gut</em> <a href="javascript:alert(1)">x</a>');
  assert.equal(p2.j.proposed, true);
  assert.doesNotMatch(raw.prepare("SELECT payload FROM edit_proposals WHERE id=?").get(p2.j.proposal).payload, BAD);
  // Arten: Folgen sind reiner Text, Show Notes HTML nach Positivliste
  assert.deepEqual(cleanUnit("episode", "Q&amp;A with <b>X</b><script>alert(1)</script>"), { text: "Q&A with X", err: "" });
  assert.equal((await save(2, 'Titel <b>fett</b> &amp; <a href="https://x.example/">Link</a>', { unit: "T" })).s, 200);   // Titel, Beschreibung, FAQ: reiner Text, keine Marken im <title>
  assert.equal(raw.prepare("SELECT text FROM i18n_override WHERE unit='T'").get().text, "Titel fett & Link");
  assert.deepEqual(cleanUnit("notes", '<p onclick="x()">Hi</p><ul><li>a</li></ul><style>p{}</style><h1>raus</h1>'), { text: "<p>Hi</p><ul><li>a</li></ul>raus", err: "bad_html" });
  assert.deepEqual(cleanUnit("notes", '<p onclick="x()">Hi</p><ul><li>a</li></ul><h1>raus</h1>'), { text: "<p>Hi</p><ul><li>a</li></ul>raus", err: "" });
});

test("319-3: Vertrag i18n-overrides v1 - Arten, Einheiten, Quell-Anker (src_hash), Export {t, sh}, Zuruecksetzen stellt den Anker wieder her", async () => {
  const { raw, env } = await mk();
  blog(raw, 20, 4, "live", { slug: "live-post", lang: "en" });
  ins(raw, "episode", { slug: "ep1", published: "2026-01-01" });
  const save = (b) => call(env, 2, "POST", "/api/editor/i18n/save", { lang: "de", prev: "alt", reason: "Test", ...b });
  assert.deepEqual(raw.prepare("SELECT name FROM pragma_table_info('i18n_override') WHERE name='src_hash'").all().length, 1);
  assert.equal((await save({ kind: "lblog", item: "live-post", unit: "1", text: "Neu" })).j.error, "anchor_required");   // lblog: ohne Anker wendet der Seitenbau nichts an
  assert.equal((await save({ kind: "lblog", item: "live-post", unit: "1", text: "Neu", sh: "XYZ" })).j.error, "anchor_required");
  assert.equal((await save({ kind: "lblog", item: "live-post", unit: "n0", text: "Neu", sh: "0a1b2c3d" })).j.error, "bad_request");   // Einheiten des Vertrags: T, D, Q1/A1, 1..n
  assert.equal((await save({ kind: "episode", item: "ep1", unit: "html", text: "x" })).j.error, "bad_request");
  assert.equal((await save({ kind: "notes", item: "ep1", unit: "title", text: "x" })).j.error, "bad_request");
  for (const u of ["T", "D", "Q1", "A1", "12"]) assert.equal((await save({ kind: "lblog", item: "live-post", unit: u, text: "Hand " + u, sh: "0a1b2c3d" })).s, 200, u);
  assert.equal((await save({ kind: "episode", item: "ep1", unit: "title", text: "Titel von Hand", sh: "11112222" })).s, 200);
  assert.equal((await save({ kind: "episode", item: "ep1", unit: "summary", text: "Teaser von Hand" })).s, 200);   // episode/notes: Anker empfohlen, nicht Pflicht
  assert.equal((await save({ kind: "notes", item: "ep1", unit: "html", text: "<p>Notes von Hand</p>", sh: "33334444" })).s, 200);
  const ex = async (k) => (await call(env, null, "GET", `/api/i18n/overrides?kind=${k}&lang=de`)).j;
  assert.deepEqual(await ex("episode"), { kind: "episode", lang: "de", items: { ep1: { summary: { t: "Teaser von Hand", sh: "" }, title: { t: "Titel von Hand", sh: "11112222" } } } });
  assert.deepEqual(await ex("notes"), { kind: "notes", lang: "de", items: { ep1: { html: { t: "<p>Notes von Hand</p>", sh: "33334444" } } } });
  assert.deepEqual((await ex("lblog")).items["live-post"].T, { t: "Hand T", sh: "0a1b2c3d" });
  // Original geaendert: derselbe Text mit neuem Anker ist eine Aenderung ("passt wieder"); Zuruecksetzen stellt Text UND Anker der alten Fassung wieder her
  assert.equal((await save({ kind: "lblog", item: "live-post", unit: "T", text: "Hand T", sh: "0a1b2c3d" })).j.error, "unchanged");
  assert.equal((await save({ kind: "lblog", item: "live-post", unit: "T", text: "Hand T", sh: "aaaabbbb" })).s, 200);
  const h = (await call(env, 2, "GET", "/api/editor/i18n/history?kind=lblog&item=live-post&lang=de&unit=T")).j;
  const first = h.versions.find((v) => v.sh === "0a1b2c3d");
  raw.prepare("UPDATE i18n_override SET text='Hand T2' WHERE unit='T'").run(); raw.prepare("UPDATE i18n_override_rev SET text='Hand T2' WHERE id=?").run(h.versions[0].id);
  const h2 = (await call(env, 2, "GET", "/api/editor/i18n/history?kind=lblog&item=live-post&lang=de&unit=T")).j;
  assert.equal((await call(env, 2, "POST", "/api/editor/i18n/revert", { kind: "lblog", item: "live-post", lang: "de", unit: "T", rev: first.id, cur: h2.current })).s, 200);
  assert.deepEqual({ ...raw.prepare("SELECT text,src_hash FROM i18n_override WHERE unit='T'").get() }, { text: "Hand T", src_hash: "0a1b2c3d" });
  const base = (await call(env, 2, "GET", "/api/editor/i18n/history?kind=lblog&item=live-post&lang=de&unit=T")).j;
  assert.equal((await call(env, 2, "POST", "/api/editor/i18n/revert", { kind: "lblog", item: "live-post", lang: "de", unit: "T", rev: base.versions.at(-1).id, cur: base.current })).s, 200);
  assert.equal((await ex("lblog")).items["live-post"].T, undefined);   // Ursprungsfassung = Zeile weg (Vertrag Punkt 6)
});

// ---------- 319-10: Wunschliste ----------
test("319-10: Neuuebersetzung vormerken - zweiter Wunsch fuer denselben Eintrag laesst sich wieder erledigen; Rueckmeldung nur mit Cron-Schluessel", async () => {
  const { raw, env } = await mk();
  blog(raw, 20, 4, "live", { slug: "live-post", lang: "en" });
  const wish = (units) => call(env, 2, "POST", "/api/editor/i18n/retranslate", { kind: "lblog", item: "live-post", lang: "de", units });
  const done = (h) => call(env, null, "POST", "/api/i18n/retranslate/done", { items: [{ kind: "lblog", item: "live-post", lang: "de" }, { kind: "lblog", item: "fehlt", lang: "de" }] }, h);
  const list = async () => (await call(env, null, "GET", "/api/i18n/retranslate")).j.items.map((x) => [x.kind, x.item, x.lang, x.units]);
  assert.equal((await wish(["1", "T", "kaputt!"])).s, 200);
  assert.deepEqual(await list(), [["lblog", "live-post", "de", ["1", "T"]]]);   // Form des Vertrags (Punkt 8), nur gueltige Einheiten
  assert.equal((await call(env, 2, "GET", "/api/editor/i18n/overrides?kind=lblog&item=live-post&lang=de")).j.wish, true);
  assert.deepEqual((await call(env, 1, "GET", "/api/admin/editlog")).j.wishes, { lblog: 1 });   // der Admin sieht, dass ein Lauf mit Wunschliste faellig ist
  assert.equal((await done({})).s, 403); assert.equal((await done({ "x-cron-key": "falsch" })).s, 403);
  assert.equal((await call(env, null, "POST", "/api/i18n/retranslate/done", { items: [] }, { "x-cron-key": "cron-test", "x-requested-with": "" })).s, 400);   // CSRF-Kopfzeile bleibt Pflicht
  assert.deepEqual((await done({ "x-cron-key": "cron-test" })).j, { ok: true, done: 1 });
  assert.deepEqual(await list(), []);
  assert.equal((await wish(["2"])).s, 200);                                    // zweiter Wunsch fuer denselben Eintrag
  assert.equal((await wish(["2", "3"])).s, 200);                               // ... ersetzt die Liste, bleibt ein Wunsch
  assert.deepEqual(await list(), [["lblog", "live-post", "de", ["2", "3"]]]);
  assert.deepEqual((await done({ "x-cron-key": "cron-test" })).j, { ok: true, done: 1 });   // frueher: UNIQUE-Fehler, Wunsch blieb fuer immer offen
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM i18n_retranslate_req").get().n, 0);
  assert.equal((await call(env, 2, "POST", "/api/editor/i18n/retranslate", { kind: "lblog", item: "draft", lang: "de", units: [] })).s, 404);   // nur veroeffentlichte Eintraege
});

// ---------- 319-5 / 319-9: Bearbeiten ----------
const authorSave = (env, uid, id, body, title = "Beitrag vom Autor") => call(env, uid, "POST", "/api/blog/save", { id, title, summary: "Kurz", body, lang: "de", topics: [] });

test("319-5: volle Bearbeitung behaelt den ganzen Text; zu lang ist ein Fehler, nie ein stilles Kuerzen; der geladene Stand (base) schuetzt vor Ueberschreiben", async () => {
  const { raw, env } = await mk();
  const body = LONG(11000), len = () => raw.prepare("SELECT length(body) n FROM blog_posts WHERE id=30").get().n;
  blog(raw, 30, 4, "live", { body });
  const v = await item(env, 2, 30);
  assert.equal(v.body.length, 4000);               // Vorschau bleibt kurz
  assert.equal(v.edit.body, body);                 // das Formular bekommt den GANZEN Text
  assert.equal(v.edit.max, 12000);
  // alte Oberflaeche: schickt die gekuerzte Vorschau ohne Stand zurueck -> abgelehnt, der Beitrag bleibt ganz
  assert.equal((await call(env, 2, "POST", "/api/editor/edit", { kind: "blog", id: "30", level: "full", fields: { body: v.body }, reason: "Tippfehler" })).j.error, "base_required");
  assert.equal(len(), 11000);
  const neu = v.edit.body.replace("Ein ganzer", "Ein ganzes");   // Tippfehler-Korrektur, wie die Oberflaeche sie schickt
  assert.equal((await call(env, 2, "POST", "/api/editor/edit", { kind: "blog", id: "30", level: "full", fields: { body: neu }, base: v.edit.base, reason: "Tippfehler" })).s, 200);
  assert.equal(len(), 11000); assert.equal(raw.prepare("SELECT body FROM blog_posts WHERE id=30").get().body, neu);
  const v2 = await item(env, 2, 30);
  const big = await call(env, 2, "POST", "/api/editor/edit", { kind: "blog", id: "30", level: "full", fields: { body: LONG(12001) }, base: v2.edit.base, reason: "zu lang" });
  assert.deepEqual([big.s, big.j.error, big.j.field], [400, "too_long", "body"]); assert.equal(len(), 11000);
  assert.equal((await call(env, 2, "POST", "/api/editor/edit", { kind: "blog", id: "30", level: "minor", fields: { title: "T".repeat(141) }, base: v2.edit.base })).j.error, "too_long");   // Grenzen wie im Editor des Autors
  assert.equal((await call(env, 2, "POST", "/api/editor/edit", { kind: "blog", id: "30", level: "minor", fields: { title: "Kurz" }, base: v2.edit.base })).j.error, "title");
  assert.equal((await call(env, 2, "POST", "/api/editor/edit", { kind: "blog", id: "30", level: "full", fields: { body: "weg" }, base: v2.edit.base, reason: "leeren" })).j.error, "too_short");
  assert.equal((await call(env, 2, "POST", "/api/editor/edit", { kind: "blog", id: "30", level: "minor", fields: { title: v2.title }, base: v2.edit.base })).j.error, "unchanged");
  // der Autor speichert, waehrend das Formular der Redaktion offen ist -> conflict statt Ueberschreiben
  assert.equal((await authorSave(env, 4, 30, LONG(600) + " Autor.")).s, 200);
  const late = await call(env, 2, "POST", "/api/editor/edit", { kind: "blog", id: "30", level: "full", fields: { body: neu + " Redaktion." }, base: v2.edit.base, reason: "spaet" });
  assert.deepEqual([late.s, late.j.error], [409, "conflict"]);
  assert.match(raw.prepare("SELECT body FROM blog_posts WHERE id=30").get().body, / Autor\.$/);
  // Empfehlung eines Moderators zu einem inzwischen geaenderten Beitrag: beim Bestaetigen ebenfalls conflict, nichts wird ueberschrieben
  blog(raw, 31, 4, "pending", { body: LONG(700) });
  const m = await item(env, 3, 31);
  const prop = await call(env, 3, "POST", "/api/editor/edit", { kind: "blog", id: "31", level: "full", fields: { body: LONG(700) + " Mod." }, base: m.edit.base, reason: "Vorschlag" });
  assert.equal(prop.j.proposed, true);
  raw.prepare("UPDATE blog_posts SET body=? WHERE id=31").run(LONG(800));
  assert.equal((await call(env, 2, "POST", `/api/editor/proposals/${prop.j.proposal}/confirm`, {})).j.error, "conflict");
  assert.equal(raw.prepare("SELECT status FROM edit_proposals WHERE id=?").get(prop.j.proposal).status, "open");
});

test("319-9: Bearbeiten bereinigt wie der Editor des Autors (Quellen, Bilder, Rohtext) und laesst uebernommene HTML-Beitraege in Ruhe", async () => {
  const { raw, env } = await mk();
  blog(raw, 32, 4, "pending", { body: LONG(400) });
  const v = await item(env, 2, 32), edit = (body) => call(env, 2, "POST", "/api/editor/edit", { kind: "blog", id: "32", level: "full", fields: { body }, base: v.edit.base, reason: "Test" });
  assert.deepEqual([(await edit(LONG(400) + " {{ref|Quelle|javascript:alert(document.domain)}}")).s, (await edit(LONG(400) + " {{ref|Quelle|javascript:alert(document.domain)}}")).j.error], [400, "bad_ref"]);
  assert.equal((await edit(LONG(400) + " {{img|http://tracker.example/p.gif?u=1|Ein Bild}}")).j.error, "bad_image");
  assert.equal((await authorSave(env, 4, 32, LONG(400) + " {{img|http://tracker.example/p.gif?u=1|Ein Bild}}")).j.error, "bad_image");   // dieselbe Antwort wie im Editor des Autors
  assert.equal(raw.prepare("SELECT body FROM blog_posts WHERE id=32").get().body, LONG(400));
  assert.equal((await edit(LONG(400) + " <b>roh</b> https://spam.example/ {{ref|Doku|https://learn.microsoft.com/x}}")).s, 200);
  const saved = raw.prepare("SELECT body FROM blog_posts WHERE id=32").get().body;
  assert.ok(!/[<>]|spam\.example/.test(saved)); assert.match(saved, /\{\{ref\|Doku\|https:\/\/learn\.microsoft\.com\/x\|\|\}\}/);
  const v3 = await item(env, 2, 32);
  assert.equal((await call(env, 2, "POST", "/api/editor/edit", { kind: "blog", id: "32", level: "minor", fields: { topics: ["teams", "gibt-es-nicht"] }, base: v3.edit.base })).j.error, "bad_topic");
  assert.equal((await call(env, 2, "POST", "/api/editor/edit", { kind: "blog", id: "32", level: "minor", fields: { topics: ["teams"] }, base: v3.edit.base })).s, 200);
  // uebernommener Beitrag: Inhalt steht in html, body ist leer -> kein Bearbeiten-Formular, kein Ueberschreiben
  blog(raw, 33, 4, "live", { body: "", html: "<p>Alter HTML-Inhalt</p>" });
  const h = await item(env, 2, 33);
  assert.deepEqual([h.editable, h.edit.minor, h.edit.full, h.edit.body, h.body], [true, "do", "no", "", "Kurz"]);   // nur kleine Aenderungen; Vorschau ersatzweise die Zusammenfassung, das Formular nie
  assert.equal((await call(env, 2, "POST", "/api/editor/edit", { kind: "blog", id: "33", level: "full", fields: { body: LONG(400) }, base: h.edit.base, reason: "x" })).j.error, "imported_html");
  assert.equal((await call(env, 2, "POST", "/api/editor/edit", { kind: "blog", id: "33", level: "minor", fields: { title: "Besserer Titel" }, base: h.edit.base })).s, 200);
  assert.deepEqual({ ...raw.prepare("SELECT title,html,body FROM blog_posts WHERE id=33").get() }, { title: "Besserer Titel", html: "<p>Alter HTML-Inhalt</p>", body: "" });
});

test("319-9: Entwuerfe und Abgelehntes sieht die Redaktion nie; Moderatoren nur ihre Pruefliste; Fach-Editoren nur ihren Bereich", async () => {
  const { raw, env } = await mk();
  blog(raw, 11, 4, "draft", { body: "Noch nicht eingereicht: vertraulicher Text" }); blog(raw, 12, 4, "rejected"); blog(raw, 13, 4, "pending", { topics: '["azure"]' }); blog(raw, 14, 4, "live", { topics: '["teams"]' });
  for (const uid of [1, 2, 3, 7]) for (const id of [11, 12]) {
    assert.equal((await call(env, uid, "GET", "/api/editor/item?kind=blog&id=" + id)).s, 404, `item ${id} fuer ${uid}`);
    assert.equal((await call(env, uid, "GET", "/api/editor/history?kind=blog&id=" + id)).s, 404);
    assert.equal((await call(env, uid, "POST", "/api/editor/decide", { kind: "blog", id: String(id), action: "approve" })).s, 404);
    assert.equal((await call(env, uid, "POST", "/api/editor/edit", { kind: "blog", id: String(id), level: "full", fields: { body: "ueberschrieben" }, base: "0".repeat(16), reason: "x" })).s, 404);
  }
  assert.equal(raw.prepare("SELECT body FROM blog_posts WHERE id=11").get().body, "Noch nicht eingereicht: vertraulicher Text");
  const see = async (uid, id) => (await call(env, uid, "GET", "/api/editor/item?kind=blog&id=" + id)).s;
  assert.deepEqual([await see(1, 13), await see(2, 13), await see(3, 13), await see(7, 13)], [200, 200, 200, 404]);   // wartend: Admin, Editor, Moderator (Pruefliste); Fach-Editor ohne azure nicht
  assert.deepEqual([await see(1, 14), await see(2, 14), await see(3, 14), await see(7, 14)], [200, 200, 404, 200]);   // live: nicht in der Pruefliste der Moderation; Fach-Editor teams ja
  assert.equal((await see(4, 13)), 403); assert.equal((await see(null, 13)), 401);   // ohne Rolle bzw. ohne Sitzung keine Daten
  for (const p of ["/api/editor/queue", "/api/editor/proposals", "/api/editor/i18n/overrides?kind=lblog&item=x&lang=de", "/api/editor/applications"]) {
    assert.equal((await call(env, null, "GET", p)).s, 401, p); assert.equal((await call(env, 4, "GET", p)).s, 403, p);
  }
  assert.equal((await call(env, 7, "POST", "/api/editor/decide", { kind: "blog", id: "13", action: "approve" })).j.error, "out_of_scope");
  assert.equal((await call(env, 3, "POST", "/api/editor/decide", { kind: "blog", id: "13", action: "approve", reason: "gut" })).j.proposed, true);   // Moderator: nur Empfehlung
  assert.equal(raw.prepare("SELECT status FROM blog_posts WHERE id=13").get().status, "pending");
});

// ---------- 319-9: alte Routen (/api/admin/* und Verwandte) je Rolle ----------
test("319-9: alte Listen - nur Editoren und Admin, Fach-Editoren gefiltert, Moderatoren und Mitglieder nie", async () => {
  const { raw, env } = await mk();
  blog(raw, 50, 4, "pending", { topics: '["teams"]' }); blog(raw, 51, 4, "pending", { topics: '["azure"]' });
  ins(raw, "wiki_rev", { term: "teams", lang: "de", body: "Teams ist ...", user_id: 4, status: "pending", created: 1 }); ins(raw, "wiki_rev", { term: "azure", lang: "de", body: "Azure ist ...", user_id: 4, status: "pending", created: 1 });
  ins(raw, "entity_rev", { eid: "azure", data: "{}", user_id: 4, status: "pending", created: 1 });
  ins(raw, "pod_episodes", { user_id: 4, title: "Pitch", topics: '["azure"]', lang: "de", status: "submitted", created: 1 });
  const lists = { "/api/admin/blog": "items", "/api/admin/wiki/pending": "pending", "/api/admin/entity/pending": "pending", "/api/admin/podcast": "items", "/api/admin/video": "items", "/api/admin/cert-queue": "items", "/api/admin/entity/claims": "claims" };
  for (const [p, key] of Object.entries(lists)) {
    for (const uid of [3, 4, null]) assert.equal((await call(env, uid, "GET", p)).s, 403, `${p} fuer ${uid}`);
    assert.ok(Array.isArray((await call(env, 2, "GET", p)).j[key]), p);
  }
  const n = async (uid, p, key) => (await call(env, uid, "GET", p)).j[key].length;
  assert.deepEqual([await n(2, "/api/admin/blog", "items"), await n(7, "/api/admin/blog", "items")], [2, 1]);
  assert.deepEqual([await n(2, "/api/admin/wiki/pending", "pending"), await n(7, "/api/admin/wiki/pending", "pending")], [2, 1]);
  assert.deepEqual([await n(2, "/api/admin/entity/pending", "pending"), await n(7, "/api/admin/entity/pending", "pending")], [1, 0]);
  assert.deepEqual([await n(2, "/api/admin/podcast", "items"), await n(7, "/api/admin/podcast", "items")], [1, 0]);
  for (const p of ["/api/admin/points/requests", "/api/admin/show", "/api/admin/reports"]) {   // ohne Thema: allgemeine Editoren ja, Fach-Editoren nein
    assert.equal((await call(env, 2, "GET", p)).s, 200, p); assert.equal((await call(env, 7, "GET", p)).s, 403, p); assert.equal((await call(env, 4, "GET", p)).s, 403, p);
  }
  assert.equal((await call(env, 3, "GET", "/api/admin/reports")).s, 200);   // gemeldete Kommentare: Sache der Moderation
  for (const uid of [3, 4, 7]) assert.equal((await call(env, uid, "GET", "/api/admin/org-pair")).s, 403);
  for (const uid of [3, 4]) assert.equal((await call(env, uid, "GET", "/api/notes/list?lang=en")).s, 403);
  raw.prepare("UPDATE editor_scope SET langs='[\"fr\"]' WHERE user_id=7").run();   // Fach-Editor nur fuer Franzoesisch: keine englischen Show Notes
  assert.equal((await call(env, 7, "GET", "/api/notes/list?lang=en")).s, 403); assert.equal((await call(env, 7, "GET", "/api/notes/list?lang=fr")).s, 200);
  assert.equal((await call(env, 7, "POST", "/api/notes/save", { lang: "en", id: "e1", body: "x" })).s, 403);
});

test("319-9: Uebernahme einer Entitaet - nie die eigene, nie die eines Kollegen, nur im eigenen Bereich, im Protokoll", async () => {
  const { raw, env } = await mk();
  const claim = (uid, eid, status = "pending") => ins(raw, "entity_claims", { eid, user_id: uid, via: "manual", status, created: 1 });
  claim(5, "contoso"); claim(4, "azure");
  const dec = (uid, eid, ok = true) => call(env, uid, "POST", "/api/admin/entity/claim", { eid, ok });
  assert.equal((await dec(5, "contoso")).j.error, "own_content");   // Editor bestaetigt die EIGENE Uebernahme
  assert.equal((await dec(3, "contoso")).s, 403); assert.equal((await dec(4, "azure")).s, 403);   // Moderator, Mitglied
  assert.equal((await dec(7, "azure")).j.error, "out_of_scope");    // Fach-Editor (teams)
  ins(raw, "org_members", { org_id: 9, user_id: 2, role: "member", status: "active", created: 1 }); ins(raw, "org_members", { org_id: 9, user_id: 4, role: "member", status: "active", created: 1 });
  assert.equal((await dec(2, "azure")).j.error, "own_company");
  assert.deepEqual(raw.prepare("SELECT eid,status FROM entity_claims ORDER BY eid").all().map((r) => [r.eid, r.status]), [["azure", "pending"], ["contoso", "pending"]]);
  assert.deepEqual(logs(raw), []);
  assert.equal((await dec(2, "contoso")).s, 200);
  assert.equal(raw.prepare("SELECT status,verified_via FROM entity_claims WHERE eid='contoso'").get().status, "verified");
  assert.deepEqual(logs(raw), [{ user_id: 2, role: "editor", action: "claim.decide", kind: "claim", item_id: "contoso" }]);
  // Widerruf einer per Firmen-E-Mail bestaetigten Uebernahme: dieselben Regeln
  raw.prepare("UPDATE entity_claims SET status='verified',verified_via='domain_email' WHERE eid='contoso'").run();
  assert.equal((await call(env, 5, "POST", "/api/admin/entity/claim", { eid: "contoso", revoke: true })).j.error, "own_content");
  assert.equal((await call(env, 2, "POST", "/api/admin/entity/claim", { eid: "contoso", revoke: true })).j.revoked, true);
});

test("319-9: Wiki wiederherstellen laeuft ueber das Zuruecksetzen - nie die eigene Fassung, nichts Abgelehntes, protokolliert", async () => {
  const { raw, env } = await mk();
  const w = (id, uid, status, term = "azure") => ins(raw, "wiki_rev", { id, term, lang: "de", body: "Fassung " + id + " mit genug Text.", summary: "s" + id, user_id: uid, status, created: id });
  w(1, 4, "old"); w(2, 7, "rejected"); w(3, 5, "old"); w(4, 5, "live");
  ins(raw, "edit_log", { ts: 1, user_id: 5, role: "editor", action: "entity.edit_live", kind: "wiki", item_id: "4", day: 0 });   // Fassung 4 als Editor geschrieben
  const restore = (uid, id) => call(env, uid, "POST", "/api/admin/wiki/restore/" + id, {});
  const state = () => raw.prepare("SELECT id,status FROM wiki_rev ORDER BY id").all().map((r) => `${r.id}:${r.status}`).join(" ");
  assert.equal((await restore(7, 2)).s, 403);                         // Fach-Editor (teams) holt die eigene abgelehnte azure-Fassung zurueck: nein
  assert.equal((await restore(2, 2)).j.error, "not_revertable");      // Abgelehntes geht nur ueber die Freigabe live
  assert.equal((await restore(5, 3)).j.error, "own_content");         // die eigene fruehere Fassung
  assert.equal((await restore(3, 1)).s, 403); assert.equal((await restore(4, 1)).s, 403);
  assert.equal(state(), "1:old 2:rejected 3:old 4:live"); assert.equal(logs(raw, "action='content.edit_full'").length, 0);
  assert.equal((await restore(2, 1)).s, 200);                         // anderer Editor nimmt die Redaktionsaenderung (Fassung 4) zurueck
  assert.equal(state(), "1:live 2:rejected 3:old 4:old");
  assert.deepEqual(logs(raw, "action='content.edit_full'"), [{ user_id: 2, role: "editor", action: "content.edit_full", kind: "wiki", item_id: "1" }]);
  // der Knopf "Wiederherstellen" der Wiki-Seite ruft die alte Freigabe-Route mit einer frueheren Fassung: dieselben Regeln, kein Weg daran vorbei
  const approve = (uid, id) => call(env, uid, "POST", "/api/admin/wiki/approve/" + id, {});
  assert.equal((await approve(5, 3)).j.error, "own_content");        // die eigene fruehere Fassung
  assert.equal((await approve(5, 2)).j.error, "not_pending");        // Abgelehntes erneut entscheiden: nur der Admin
  w(5, 6, "live"); raw.prepare("UPDATE wiki_rev SET status='old' WHERE id=1").run();   // jetzt steht die Fassung eines Mitglieds live
  assert.equal((await approve(7, 1)).j.error, "out_of_scope");       // Fach-Editor ausserhalb seines Bereichs
  assert.equal((await approve(2, 1)).s, 200);                        // wie auf main: ein Editor setzt die Fassung eines Mitglieds zurueck (sie bleibt im Verlauf)
  assert.equal(state(), "1:live 2:rejected 3:old 4:old 5:old");
  assert.deepEqual(logs(raw, "action='content.edit_full'").at(-1), { user_id: 2, role: "editor", action: "content.edit_full", kind: "wiki", item_id: "1" });
  assert.equal((await approve(1, 2)).s, 200);                        // und der Admin entscheidet auch Abgelehntes neu (wie bisher)
  assert.equal(state(), "1:old 2:live 3:old 4:old 5:old");
});

test("319-9: Pitches, Einloesungen, Shows, Feed, Bewertungen, Fragen - ueber can() mit Eigentuemer, Firma, Bereich und Protokoll", async () => {
  const { raw, env } = await mk();
  // Podcast-/Video-Pitch direkt ueber die alte Route ablehnen
  const own = ins(raw, "pod_episodes", { user_id: 2, title: "Eigener Pitch", topics: "[]", lang: "de", status: "submitted", created: 1 }), other = ins(raw, "pod_episodes", { user_id: 4, title: "Fremder Pitch", topics: "[]", lang: "de", status: "submitted", created: 1 });
  assert.equal((await call(env, 2, "POST", "/api/admin/podcast/reject", { id: own, note: "nein" })).j.error, "own_content");
  assert.equal((await call(env, 7, "POST", "/api/admin/podcast/reject", { id: other, note: "nein" })).j.error, "out_of_scope");
  assert.equal((await call(env, 3, "POST", "/api/admin/podcast/reject", { id: other, note: "nein" })).s, 403);
  assert.equal((await call(env, 2, "POST", "/api/admin/podcast/reject", { id: other, note: "passt nicht" })).s, 200);
  assert.deepEqual(raw.prepare("SELECT id,status FROM pod_episodes ORDER BY id").all().map((r) => [r.id, r.status]), [[own, "submitted"], [other, "rejected"]]);
  const vid = ins(raw, "yt_videos", { user_id: 5, title: "Eigenes Video", topics: "[]", lang: "de", status: "submitted", created: 1 });
  assert.equal((await call(env, 5, "POST", "/api/admin/video/reject", { id: vid, note: "nein" })).j.error, "own_content");
  // Punkte einloesen
  const mine = ins(raw, "points_spent", { user_id: 2, item: "shirt", cost: 10, status: "pending", created: 1 }), theirs = ins(raw, "points_spent", { user_id: 4, item: "shirt", cost: 10, status: "pending", created: 1 });
  assert.equal((await call(env, 2, "POST", "/api/admin/points/decide", { id: mine, ok: true })).j.error, "own_content");
  assert.equal((await call(env, 3, "POST", "/api/admin/points/decide", { id: theirs, ok: true })).s, 403);
  assert.equal((await call(env, 2, "POST", "/api/admin/points/decide", { id: theirs, ok: true })).s, 200);
  assert.deepEqual(raw.prepare("SELECT id,status FROM points_spent ORDER BY id").all().map((r) => [r.id, r.status]), [[mine, "pending"], [theirs, "done"]]);
  // Show freigeben
  const s1 = ins(raw, "shows", { user_id: 2, slug: "eigene", title: "Eigene Show", feed: "https://a.example/f", lang: "de", status: "pending", created: 1 }), s2 = ins(raw, "shows", { user_id: 4, slug: "fremde", title: "Fremde Show", feed: "https://b.example/f", lang: "de", status: "pending", created: 1 });
  assert.equal((await call(env, 2, "POST", "/api/admin/show/status", { id: s1, status: "live" })).j.error, "own_content");
  assert.equal((await call(env, 7, "POST", "/api/admin/show/status", { id: s2, status: "live" })).j.error, "out_of_scope");
  assert.equal((await call(env, 2, "POST", "/api/admin/show/status", { id: s2, status: "live" })).s, 200);
  assert.deepEqual(raw.prepare("SELECT id,status FROM shows ORDER BY id").all().map((r) => [r.id, r.status]), [[s1, "pending"], [s2, "live"]]);
  assert.equal(can({ id: 2, role: "editor" }, "review.approve", { ownerId: 2 }).ok, false);   // darum geht die eigene Show eines Editors nicht mehr sofort live (shows.js)
  // Feed-Eintrag ausblenden
  const ch = ins(raw, "channels", { owner_type: "u", owner_id: 2, kind: "blog", url: "https://x.example/" }), f1 = ins(raw, "feed_items", { channel_id: ch, owner_type: "u", owner_id: 2, url: "https://x.example/1", title: "Eigen", published: 1 }), f2 = ins(raw, "feed_items", { channel_id: ch, owner_type: "u", owner_id: 4, url: "https://x.example/2", title: "Fremd", published: 1 });
  assert.equal((await call(env, 2, "POST", "/api/admin/feed-hide", { id: f1, hidden: true })).j.error, "own_content");
  assert.equal((await call(env, 4, "POST", "/api/admin/feed-hide", { id: f2, hidden: true })).s, 403);
  assert.equal((await call(env, 3, "POST", "/api/admin/feed-hide", { id: f2, hidden: true })).s, 403);
  assert.equal((await call(env, 2, "POST", "/api/admin/feed-hide", { id: f2, hidden: true })).s, 200);
  assert.deepEqual(raw.prepare("SELECT id,hidden FROM feed_items ORDER BY id").all().map((r) => [r.id, r.hidden]), [[f1, 0], [f2, 1]]);
  // Bewertung: die eigene loescht jede und jeder selbst, fremde blendet die Redaktion aus
  const r1 = ins(raw, "show_reviews", { show: "s", user_id: 2, rating: 5, created: 1 }), r2 = ins(raw, "show_reviews", { show: "s", user_id: 4, rating: 1, created: 1 }), r3 = ins(raw, "show_reviews", { show: "t", user_id: 6, rating: 1, created: 1 });
  assert.equal((await call(env, 2, "POST", "/api/reviews/delete", { id: r1 })).s, 200); assert.equal(raw.prepare("SELECT COUNT(*) n FROM show_reviews WHERE id=?").get(r1).n, 0);
  assert.equal((await call(env, 6, "POST", "/api/reviews/delete", { id: r2 })).s, 403);
  assert.equal((await call(env, 3, "POST", "/api/reviews/delete", { id: r2 })).s, 403);   // Moderatoren: nur ueber die Pruefliste (Kommentare, Meldungen), nicht ueber die alten Routen
  assert.equal((await call(env, 7, "POST", "/api/reviews/delete", { id: r2 })).j.error, "out_of_scope");
  assert.equal((await call(env, 2, "POST", "/api/reviews/delete", { id: r2 })).s, 200); assert.equal(raw.prepare("SELECT status FROM show_reviews WHERE id=?").get(r2).status, "hidden");
  assert.equal((await call(env, 6, "POST", "/api/reviews/delete", { id: r3 })).s, 200);
  // Frage zu einer Entitaet ausblenden: Fach-Editor nur im eigenen Bereich
  const q1 = ins(raw, "entity_q", { eid: "azure", user_id: 4, created: 1 }), q2 = ins(raw, "entity_q", { eid: "teams", user_id: 4, created: 1 });
  assert.equal((await call(env, 7, "POST", "/api/qa/delete", { kind: "q", id: q1 })).j.error, "out_of_scope");
  assert.equal((await call(env, 7, "POST", "/api/qa/delete", { kind: "q", id: q2 })).s, 200);
  assert.equal((await call(env, 6, "POST", "/api/qa/delete", { kind: "q", id: q1 })).s, 403);
  assert.equal((await call(env, 3, "POST", "/api/qa/delete", { kind: "q", id: q1 })).s, 403);
  assert.deepEqual(raw.prepare("SELECT id,hidden FROM entity_q ORDER BY id").all().map((r) => [r.id, r.hidden]), [[q1, 0], [q2, 1]]);
  // jede ausgefuehrte Entscheidung steht im Protokoll, keine verweigerte
  assert.deepEqual(logs(raw).map((l) => `${l.user_id} ${l.action} ${l.kind}`), ["2 review.reject podcast", "2 review.approve points", "2 review.approve show", "2 review.hide feed", "2 review.hide show_review", "7 review.hide qa_q"]);
});

test("319-9: can() kennt jede Aktion der Redaktion; die alten Routen und die MCP-Werkzeuge fragen nur dort", async () => {
  for (const a of ["queue.view", "queue.review", "claim.decide", "verify.set", "role.vote", "role.assign", "admin.undo", "escalation.close"]) assert.ok(ACTIONS.includes(a), a);
  const U = { admin: { id: 1, role: "admin", admin: true }, editor: { id: 2, role: "editor" }, mod: { id: 3, role: "moderator" }, user: { id: 4, role: "user" }, fach: { id: 7, role: "editor", scope: { topics: new Set(["teams"]), langs: new Set() } } };
  const ok = (u, a, it) => { const p = can(U[u], a, it); return p.ok ? (p.propose ? "propose" : "do") : p.why; };
  assert.deepEqual(["admin", "editor", "fach", "mod", "user"].map((u) => ok(u, "queue.view")), ["do", "do", "do", "do", "forbidden"]);
  assert.deepEqual(["admin", "editor", "fach", "mod", "user"].map((u) => ok(u, "queue.review")), ["do", "do", "do", "forbidden", "forbidden"]);
  assert.deepEqual(["admin", "editor", "fach", "mod", "user"].map((u) => ok(u, "claim.decide", { ownerId: 9, topics: ["azure"] })), ["do", "do", "out_of_scope", "forbidden", "forbidden"]);
  assert.deepEqual(["admin", "editor", "fach", "mod", "user"].map((u) => ok(u, "verify.set", { ownerId: 9, topics: ["teams"], confers: true })), ["do", "admin_only", "admin_only", "admin_only", "forbidden"]);
  assert.deepEqual(["admin", "editor", "fach", "mod", "user"].map((u) => ok(u, "role.vote", { ownerId: 9 })), ["do", "do", "do", "forbidden", "forbidden"]);
  for (const a of ["role.assign", "admin.undo", "escalation.close"]) assert.deepEqual(["admin", "editor", "fach", "mod", "user"].map((u) => ok(u, a)), ["do", "admin_only", "admin_only", "admin_only", "forbidden"]);
  assert.equal(ok("editor", "claim.decide", { ownerId: 2 }), "own_content"); assert.equal(ok("editor", "role.vote", { ownerId: 2 }), "own_content");
  // keine Route entscheidet mehr an can() vorbei: die Rollen-Kurzformen stehen nur noch dort, wo ein Mitglied eigene Inhalte schreibt (Vertrauen) oder fuer die Anzeige
  const SRC = new URL("../src/", import.meta.url), allow = { "blog.js": 1, "entities.js": 3, "wiki.js": 3, "votes.js": 2, "qa.js": 1, "entinvite.js": 6, "index.js": 2, "reviews.js": 0 };
  for (const f of readdirSync(SRC).filter((x) => x.endsWith(".js") && !["perm.js"].includes(x))) {
    const n = (readFileSync(new URL(f, SRC), "utf-8").match(/user\??\.editor\b|u\.editor\b/g) || []).length;
    assert.ok(n <= (allow[f] ?? 0), `${f}: ${n} Rollen-Abfragen an can() vorbei (erlaubt ${allow[f] ?? 0})`);
  }
  const { raw, env } = await mk();
  const g = await gate(env.DB, { id: 3, role: "moderator", moderator: true }, "review.approve", { ownerId: 4 });
  assert.deepEqual([g.ok, g.why], [false, "forbidden"]);   // alte Routen kennen keine Empfehlungen
  // MCP: Aufgabenlisten nur fuer Editoren/Admin, gefiltert nach Bereich
  ins(raw, "pod_episodes", { user_id: 4, title: "Pitch", topics: '["azure"]', lang: "de", status: "submitted", created: 1 });
  const mcp = async (uid, name, args = {}) => {
    const tok = "m365_test" + uid; if (!raw.prepare("SELECT 1 x FROM api_tokens WHERE user_id=?").get(uid)) ins(raw, "api_tokens", { user_id: uid, hash: await sha256hex(tok), created: 1 });
    const r = await W.fetch(new Request(API + "/mcp", { method: "POST", headers: { "content-type": "application/json", authorization: "Bearer " + tok }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }) }), env, { waitUntil() {} });
    return JSON.parse((await r.json()).result.content[0].text);
  };
  assert.equal((await mcp(3, "list_podcast_todo")).error, "forbidden"); assert.equal((await mcp(4, "list_video_todo")).error, "forbidden");
  assert.equal((await mcp(2, "list_podcast_todo")).open_pitches.length, 1); assert.equal((await mcp(7, "list_podcast_todo")).open_pitches.length, 0);
  assert.equal((await mcp(4, "editor_queue")).error, "forbidden"); assert.equal((await mcp(4, "list_stale_translations")).error, "forbidden");
  blog(raw, 60, 4, "draft"); blog(raw, 61, 2, "pending");
  assert.equal((await mcp(3, "editor_view_item", { kind: "blog", id: "60" })).error, "not_found");                       // Entwurf: auch per MCP nicht lesbar
  assert.equal((await mcp(2, "editor_propose_decision", { kind: "blog", id: "61", action: "approve" })).error, "forbidden");   // eigener Beitrag
  blog(raw, 62, 4, "live", { slug: "live-post", lang: "en" });
  assert.equal((await mcp(2, "propose_translation_edit", { kind: "lblog", item: "live-post", lang: "de", unit: "1", text: "Neu", reason: "x" })).error, "anchor_required");   // ohne Quell-Anker kein Absatz-Handtext
  assert.equal((await mcp(2, "propose_translation_edit", { kind: "lblog", item: "live-post", lang: "de", unit: "1", text: "Neu <svg/onload=alert(1)>", reason: "x", sh: "0a1b2c3d" })).error, "bad_html");
  const pr = await mcp(2, "propose_translation_edit", { kind: "lblog", item: "live-post", lang: "de", unit: "1", text: 'Neu <b onclick="alert(1)">fett</b>', reason: "x", sh: "0a1b2c3d" });
  assert.equal(pr.stored_as, "proposal"); assert.equal(raw.prepare("SELECT COUNT(*) n FROM i18n_override").get().n, 0);   // nichts ausgefuehrt
  assert.doesNotMatch(raw.prepare("SELECT payload FROM edit_proposals WHERE id=?").get(pr.proposal).payload, BAD);
});

// ---------- 319-6: Zuruecksetzen und Rueckgaengig ueberschreiben keine fremde Arbeit ----------
const hist = async (env, uid, kind, id) => (await call(env, uid, "GET", `/api/editor/history?kind=${kind}&id=${id}`)).j;
const revert = (env, uid, kind, id, rev, cur) => call(env, uid, "POST", "/api/editor/revert", { kind, id: String(id), rev, cur });

test("319-6: der Autor arbeitet nach einer Redaktionsaenderung weiter - seine Fassung steht im Verlauf, kein Editor setzt sie zurueck", async () => {
  const { raw, env } = await mk();
  const A = LONG(400) + " Fassung A des Autors.", B = LONG(400) + " Fassung B der Redaktion.", C = LONG(500) + " Fassung C: der Autor hat weitergeschrieben.";
  blog(raw, 70, 4, "live", { body: A, title: "Beitrag vom Autor" });
  const body = () => raw.prepare("SELECT body FROM blog_posts WHERE id=70").get().body;
  assert.equal((await call(env, 2, "POST", "/api/editor/edit", { kind: "blog", id: "70", level: "full", fields: { body: B }, base: (await item(env, 2, 70)).edit.base, reason: "Stil" })).s, 200);
  const h1 = await hist(env, 5, "blog", 70);   // der zweite Editor oeffnet den Verlauf: [Redaktion B (aktuell), Ursprungsfassung A]
  assert.deepEqual(h1.versions.map((v) => [v.role, v.action]), [["editor", "edit"], ["author", "baseline"]]);
  assert.equal((await authorSave(env, 4, 70, C)).s, 200);   // der Autor speichert (normaler Editor des Autors)
  assert.deepEqual(raw.prepare("SELECT role,action,body FROM content_rev WHERE item_id='70' ORDER BY id DESC LIMIT 1").all().map((r) => [r.role, r.action, r.body]), [["author", "edit", C]]);
  const stale = await revert(env, 5, "blog", 70, h1.versions[1].id, h1.current);   // mit dem alten Blick auf den Verlauf
  assert.deepEqual([stale.s, stale.j.error], [409, "conflict"]); assert.equal(body(), C);
  const h2 = await hist(env, 5, "blog", 70);
  assert.equal(h2.versions[0].role, "author"); assert.equal(h2.current, stale.j.current);
  assert.equal((await revert(env, 5, "blog", 70, h2.versions.at(-1).id, h2.current)).j.error, "not_editor_edit");   // aktuelle Fassung stammt vom Autor
  assert.equal(body(), C);
  assert.equal((await revert(env, 1, "blog", 70, h2.versions.at(-1).id, h2.current)).s, 200);   // der Admin darf, bewusst und mit aktuellem Blick
  assert.equal(body(), A);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM content_rev WHERE item_id='70' AND body=?").get(C).n, 1);   // Fassung C bleibt im Verlauf erhalten
  // ein Stand, den der Verlauf nicht kennt (Aenderung am Verlauf vorbei): wird erst festgehalten, dann conflict - nie ueberschrieben
  const D = LONG(450) + " Fassung D am Verlauf vorbei.";
  raw.prepare("UPDATE blog_posts SET body=? WHERE id=70").run(D);
  const h3 = await hist(env, 1, "blog", 70);
  const r3 = await revert(env, 1, "blog", 70, h3.versions.at(-1).id, h3.current);
  assert.deepEqual([r3.s, r3.j.error], [409, "conflict"]); assert.equal(body(), D);
  assert.equal(raw.prepare("SELECT role FROM content_rev WHERE item_id='70' AND body=?").get(D).role, "author");
  assert.equal((await revert(env, 2, "blog", 70, h3.versions.at(-1).id)).j.error, "conflict");   // ohne die gesehene Fassung geht nichts
  // loescht der Autor den Beitrag, geht der Verlauf mit
  assert.equal((await call(env, 4, "POST", "/api/blog/delete", { id: 70 })).s, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM content_rev WHERE item_id='70'").get().n, 0);
  assert.deepEqual(raw.prepare("SELECT DISTINCT before,after FROM edit_log WHERE kind='blog' AND item_id='70'").all().map((r) => [r.before, r.after]), [["", ""]]);
});

test("319-6: Wiki/Entitaeten - es zaehlt die Rolle zum Zeitpunkt der Aenderung, nicht die heutige Rolle des Verfassers", async () => {
  const { raw, env } = await mk();
  const w = (id, uid, status, term) => ins(raw, "wiki_rev", { id, term, lang: "de", body: "Fassung " + id + " mit genug Text fuer das Wiki.", summary: "s" + id, user_id: uid, status, created: id });
  // Begriff teams: Fassung 2 schrieb Konto 6 als MITGLIED; spaeter wird 6 Editor (z. B. als MVP)
  w(1, 4, "old", "teams"); w(2, 6, "live", "teams");
  raw.prepare("UPDATE users SET role='editor',role_source='auto_mvp' WHERE id=6").run();
  assert.equal((await hist(env, 2, "wiki", 2)).versions[0].role, "user");   // der Verlauf zeigt die Rolle beim Schreiben, nicht die heutige
  assert.equal((await revert(env, 6, "wiki", 2, 1, 2)).j.error, "own_content");
  // Entitaet mit bestaetigtem Inhaber: dessen live stehende Fassung nimmt kein Editor zurueck (wie beim Blog der Text des Autors), nur der Admin
  ins(raw, "entity_rev", { id: 20, eid: "azure", data: JSON.stringify({ name: "Azure", desc: { de: "Alte Beschreibung der Plattform." } }), summary: "s", user_id: 4, status: "old", created: 1 });
  ins(raw, "entity_rev", { id: 21, eid: "azure", data: JSON.stringify({ name: "Azure", desc: { de: "Beschreibung des Inhabers der Seite." } }), summary: "s", user_id: 6, status: "live", created: 2 });
  ins(raw, "entity_claims", { eid: "azure", user_id: 6, via: "email", status: "verified", created: 1 });
  assert.equal((await revert(env, 2, "entity", 21, 20, 21)).j.error, "not_editor_edit");
  assert.equal(raw.prepare("SELECT status FROM entity_rev WHERE id=21").get().status, "live");
  raw.prepare("UPDATE entity_claims SET user_id=4 WHERE eid='azure'").run();   // ohne Inhaber-Fassung live: wie im Wiki
  assert.equal((await revert(env, 2, "entity", 21, 20, 21)).s, 200);
  // Begriff azure: Fassung 11 schreibt ein Editor ueber die echte Route (live, mit Protokoll) - auch wenn er spaeter kein Editor mehr ist, bleibt es eine Redaktionsaenderung
  w(10, 4, "live", "azure");
  const sv = await call(env, 5, "POST", "/api/wiki", { term: "azure", lang: "de", body: "Azure ist die Cloud-Plattform von Microsoft, hier von der Redaktion ergaenzt.", summary: "ergaenzt" });
  assert.deepEqual([sv.s, sv.j.status], [200, "live"]);
  const rid = raw.prepare("SELECT id FROM wiki_rev WHERE term='azure' AND status='live'").get().id;
  assert.deepEqual(logs(raw, "action='entity.edit_live'"), [{ user_id: 5, role: "editor", action: "entity.edit_live", kind: "wiki", item_id: String(rid) }]);
  raw.prepare("UPDATE users SET role='user' WHERE id=5").run();
  assert.equal((await revert(env, 2, "wiki", rid, 10, rid)).s, 200);
  assert.deepEqual(raw.prepare("SELECT id,status FROM wiki_rev WHERE term='azure' ORDER BY id").all().map((r) => [r.id, r.status]), [[10, "live"], [rid, "old"]]);
  // das Zuruecksetzen selbst ist eine Redaktionsaenderung: ein anderer Editor darf es wieder zuruecknehmen (nicht der Verfasser der Fassung)
  raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(8,'t','s8','Edi3','editor',1)").run();
  assert.equal((await revert(env, 8, "wiki", 10, rid, 10)).s, 200);
});

test("319-6: Rueckgaengig einer aelteren Freigabe laesst nie zwei Fassungen live; ein inzwischen geaenderter Eintrag wird nicht angefasst", async () => {
  const { raw, env } = await mk();
  const w = (id, status) => ins(raw, "wiki_rev", { id, term: "teams", lang: "de", body: "Fassung " + id, summary: "", user_id: 4, status, created: id });
  w(1, "pending"); w(2, "pending"); w(3, "pending");
  const state = () => raw.prepare("SELECT id,status FROM wiki_rev ORDER BY id").all().map((r) => `${r.id}:${r.status}`).join(" ");
  const ok1 = await call(env, 2, "POST", "/api/editor/decide", { kind: "wiki", id: "1", action: "approve" }), ok3 = await call(env, 2, "POST", "/api/editor/decide", { kind: "wiki", id: "3", action: "approve" });
  assert.equal(state(), "1:old 2:pending 3:live");
  assert.equal((await call(env, 2, "POST", "/api/admin/editlog/undo/" + ok1.j.log, {})).s, 403);   // Undo nur Admin
  const u1 = await call(env, 1, "POST", "/api/admin/editlog/undo/" + ok1.j.log, {});   // die ERSTE Freigabe zuruecknehmen, obwohl inzwischen Fassung 3 live ist
  assert.deepEqual([u1.s, u1.j.error], [409, "state_changed"]);
  assert.equal(state(), "1:old 2:pending 3:live"); assert.equal(raw.prepare("SELECT undone FROM edit_log WHERE id=?").get(ok1.j.log).undone, 0);
  assert.equal((await call(env, 1, "POST", "/api/admin/editlog/undo/" + ok3.j.log, {})).s, 200);   // die letzte Freigabe: 3 zurueck, 1 wieder live - genau eine live
  assert.equal(state(), "1:live 2:pending 3:pending");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM wiki_rev WHERE status='live'").get().n, 1);
  // Blog: nach der Freigabe hat ein anderer abgelehnt (hier direkt gesetzt) -> das Rueckgaengig der Freigabe fasst den Beitrag nicht an
  blog(raw, 80, 4, "pending");
  const ap = await call(env, 2, "POST", "/api/editor/decide", { kind: "blog", id: "80", action: "approve" });
  raw.prepare("UPDATE blog_posts SET status='rejected' WHERE id=80").run();
  assert.equal((await call(env, 1, "POST", "/api/admin/editlog/undo/" + ap.j.log, {})).j.error, "state_changed");
  assert.equal(raw.prepare("SELECT status FROM blog_posts WHERE id=80").get().status, "rejected");
});

// ---------- 319-7: Kontoloeschung und Zusammenfuehren ----------
const T0037 = ["edit_log", "edit_proposals", "editor_scope", "content_rev", "editor_applications", "editor_votes", "i18n_override", "i18n_override_rev", "i18n_retranslate_req"];
const refs = (raw, id) => Object.fromEntries(T0037.map((t) => {
  const cols = raw.prepare(`PRAGMA table_info(${t})`).all().map((c) => c.name).filter((c) => ["user_id", "by", "decided_by", "voter_id"].includes(c));
  return [t, raw.prepare(`SELECT COUNT(*) n FROM ${t} WHERE ${cols.map((c) => `"${c}"=?`).join(" OR ")}`).get(...cols.map(() => id)).n];
}));

test("319-7: Konto loeschen entfernt oder anonymisiert alles aus den Tabellen der Redaktion (Migration 0037)", async () => {
  const { raw, env } = await mk();
  // Anna (4) ist Autorin und hat sich beworben; die Redaktion hat ihren Beitrag bearbeitet
  blog(raw, 90, 4, "live", { body: LONG(400) + " Annas persoenlicher Text mit Namen und Arbeitgeber.", title: "Annas Beitrag" });
  assert.equal((await call(env, 2, "POST", "/api/editor/edit", { kind: "blog", id: "90", level: "full", fields: { body: LONG(400) + " Annas Text, redigiert." }, base: (await item(env, 2, 90)).edit.base, reason: "Stil" })).s, 200);
  const app = ins(raw, "editor_applications", { user_id: 4, role: "editor", motivation: "Ich bin Anna, arbeite bei Contoso in Hamburg und moechte mitmachen.", created: 1 });
  ins(raw, "editor_votes", { app_id: app, voter_id: 2, ts: 1 });
  ins(raw, "edit_proposals", { ts: 1, user_id: 3, role: "moderator", action: "content.edit_full", kind: "blog", item_id: "90", payload: JSON.stringify({ level: "full", fields: { body: "Annas Text, Vorschlag" } }) });
  ins(raw, "certs", { user_id: 4, eid: "teams", year: 2025 }); ins(raw, "cert_check", { user_id: 4, eid: "teams", status: "pending", created: 1 });
  assert.equal((await call(env, 2, "POST", "/api/editor/decide", { kind: "cert", id: "4:teams", action: "approve" })).s, 200);
  ins(raw, "comments", { id: 5, vid: "v", lang: "de", user_id: 6, body: "Kommentar", status: "ok", created: 1 }); ins(raw, "reports", { comment_id: 5, user_id: 4, created: 7 });
  assert.equal((await call(env, 3, "POST", "/api/editor/decide", { kind: "comment", id: "5", action: "resolve" })).s, 200);   // Annas Meldung steht mit ihrer ID im Protokoll
  assert.equal((await call(env, 4, "DELETE", "/api/me")).s, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM users WHERE id=4").get().n, 0);
  assert.deepEqual(refs(raw, 4), Object.fromEntries(T0037.map((t) => [t, 0])));
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM content_rev WHERE item_id='90'").get().n, 0, "Verlauf mit dem vollen Text des geloeschten Beitrags");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM editor_applications").get().n + raw.prepare("SELECT COUNT(*) n FROM editor_votes").get().n, 0, "Bewerbung samt Stimmen");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM edit_proposals WHERE kind='blog' AND item_id='90'").get().n, 0, "Empfehlung mit Textvorschlag zum geloeschten Beitrag");
  const all = raw.prepare("SELECT kind,item_id,before,after FROM edit_log").all().map((r) => JSON.stringify(r)).join("\n");
  assert.doesNotMatch(all, /Anna|4:teams|\[4,/);   // keine Textauszuege, keine Nutzer-ID im Schluessel, keine Melder-ID
  assert.match(all, /"0:teams"/); assert.match(all, /\[0,7\]/);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM edit_log WHERE user_id=2").get().n, 2, "das Protokoll der Redaktion selbst bleibt");
});

test("319-7: Mitarbeitende loeschen ihr Konto - Protokoll und Handtexte bleiben anonym, offene Empfehlungen, Stimmen und Bereich verschwinden", async () => {
  const { raw, env } = await mk();
  blog(raw, 91, 4, "pending"); blog(raw, 92, 4, "live", { slug: "live-post", lang: "en", body: LONG(400) });
  assert.equal((await call(env, 7, "POST", "/api/editor/i18n/save", { kind: "lblog", item: "live-post", lang: "de", unit: "1", text: "Von Hand", prev: "Maschine", sh: "0a1b2c3d", reason: "Stil" })).s, 200);
  assert.equal((await call(env, 7, "POST", "/api/editor/i18n/retranslate", { kind: "lblog", item: "live-post", lang: "de", units: ["2"] })).s, 200);
  raw.prepare("UPDATE blog_posts SET topics='[\"teams\"]' WHERE id IN (91,92)").run();
  assert.equal((await call(env, 7, "POST", "/api/editor/edit", { kind: "blog", id: "92", level: "full", fields: { body: LONG(400) + " Redigiert." }, base: (await item(env, 7, 92)).edit.base, reason: "Stil" })).s, 200);
  assert.equal((await call(env, 7, "POST", "/api/editor/decide", { kind: "blog", id: "91", action: "escalate", reason: "unsicher" })).j.proposed, true);
  const app = ins(raw, "editor_applications", { user_id: 6, role: "editor", motivation: "Ich moechte gern mitmachen und helfen.", created: 1 });
  assert.equal((await call(env, 7, "POST", `/api/editor/applications/${app}/confirm`, {})).j.votes, 1);
  const done = ins(raw, "edit_proposals", { ts: 1, user_id: 3, role: "moderator", action: "review.approve", kind: "blog", item_id: "91", status: "executed", decided_by: 7, decided_ts: 2 });
  const rej = ins(raw, "editor_applications", { user_id: 4, role: "moderator", motivation: "Fruehere Bewerbung, von Konto 7 abgelehnt.", status: "rejected", decided_by: 7, created: 1 });
  assert.ok(Object.values(refs(raw, 7)).every((n) => n > 0), JSON.stringify(refs(raw, 7)));   // vorher: in jeder Tabelle steht Konto 7
  assert.equal((await call(env, 7, "DELETE", "/api/me")).s, 200);
  assert.deepEqual(refs(raw, 7), Object.fromEntries(T0037.map((t) => [t, 0])));
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM edit_log WHERE user_id=0 AND role='editor'").get().n, 4);   // Protokoll bleibt, ohne Person
  assert.deepEqual({ ...raw.prepare("SELECT text,\"by\" FROM i18n_override").get() }, { text: "Von Hand", by: 0 });   // der Handtext bleibt auf der Seite
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM content_rev WHERE item_id='92' AND user_id=0 AND role='editor'").get().n, 1);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM edit_proposals WHERE status='open'").get().n, 0);
  assert.equal(raw.prepare("SELECT decided_by FROM edit_proposals WHERE id=?").get(done).decided_by, null);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM editor_votes WHERE app_id=?").get(app).n, 0);
  assert.deepEqual({ ...raw.prepare("SELECT status,decided_by FROM editor_applications WHERE id=?").get(rej) }, { status: "rejected", decided_by: null });   // fremde Bewerbung bleibt, ohne den Entscheider
});

test("319-7: Zusammenfuehren - die Vier-Augen-Regel laesst sich nicht ueber ein zweites Konto umgehen", async () => {
  const { raw, db, env } = await mk();
  // S = Konto 3 (Moderator) empfiehlt, T = Konto 5 (Editor) ist dieselbe Person
  blog(raw, 95, 4, "pending");
  const p = await call(env, 3, "POST", "/api/editor/decide", { kind: "blog", id: "95", action: "approve", reason: "gut" });
  assert.equal(p.j.proposed, true);
  const app6 = ins(raw, "editor_applications", { user_id: 6, role: "editor", motivation: "Ich moechte gern mitmachen und helfen.", created: 1 });
  ins(raw, "editor_votes", { app_id: app6, voter_id: 3, ts: 1 }); ins(raw, "editor_votes", { app_id: app6, voter_id: 5, ts: 2 });   // dieselbe Person mit zwei Konten
  const appS = ins(raw, "editor_applications", { user_id: 3, role: "editor", motivation: "Bewerbung des Zweitkontos als Editor.", created: 1 });
  ins(raw, "editor_votes", { app_id: appS, voter_id: 5, ts: 3 });   // T hat fuer die Bewerbung von S gestimmt
  ins(raw, "editor_scope", { user_id: 3, topics: '["azure"]', langs: "[]", updated: 1 });
  ins(raw, "edit_log", { ts: 1, user_id: 3, role: "moderator", action: "review.hide", kind: "comment", item_id: "1", day: Math.floor(Date.now() / 86400000) });
  ins(raw, "content_rev", { kind: "blog", item_id: "95", user_id: 3, role: "moderator", action: "edit", ts: 1 });
  ins(raw, "i18n_override", { kind: "lblog", item: "x", lang: "de", unit: "1", text: "t", by: 3, ts: 1 }); ins(raw, "i18n_override_rev", { kind: "lblog", item: "x", lang: "de", unit: "1", text: "t", user_id: 3, role: "moderator", action: "edit", ts: 1 });
  ins(raw, "i18n_retranslate_req", { kind: "lblog", item: "x", lang: "de", by: 3, ts: 1 });
  await db.batch(await mergeStatements(db, 3, 5));
  assert.deepEqual(refs(raw, 3), Object.fromEntries(T0037.map((t) => [t, 0])));   // nichts haengt mehr am stillgelegten Konto
  assert.equal(raw.prepare("SELECT user_id FROM edit_proposals WHERE id=?").get(p.j.proposal).user_id, 5);
  const c = await call(env, 5, "POST", `/api/editor/proposals/${p.j.proposal}/confirm`, {});   // T bestaetigt die eigene, als S abgegebene Empfehlung
  assert.deepEqual([c.s, c.j.error], [403, "own_content"]); assert.equal(raw.prepare("SELECT status FROM blog_posts WHERE id=95").get().status, "pending");
  assert.equal((await call(env, 2, "POST", `/api/editor/proposals/${p.j.proposal}/confirm`, {})).s, 200);   // ein anderer Editor darf
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM editor_votes WHERE app_id=?").get(app6).n, 1, "zwei Stimmen derselben Person zaehlen einmal");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM editor_votes WHERE app_id=? AND voter_id=5").get(appS).n, 0, "keine Stimme fuer die eigene Bewerbung");
  assert.equal(raw.prepare("SELECT status FROM editor_applications WHERE id=?").get(appS).status, "obsolete");   // T ist schon Editor
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM editor_scope WHERE user_id IN (3,5)").get().n, 0, "Rolle und Fachbereich wandern nicht mit");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM edit_log WHERE user_id=5").get().n >= 1, true);   // Tageslimit zaehlt zusammen
});

// ---------- 319-8: Paar-Firma bei der Freigabe einer neuen Firmen-Entitaet ----------
test("319-8: neue Firmen-Entitaet freigeben legt die Paar-Firma an - ueber die Pruefliste, ueber eine bestaetigte Empfehlung und ueber die alte Route", async () => {
  const { raw, env } = await mk();
  const rev = (eid, name) => ins(raw, "entity_rev", { eid, data: JSON.stringify({ name, type: "org", aliases: [], desc: { en: `${name} builds Microsoft 365 solutions.`, de: "" }, web: `https://www.${eid}-example.com`, rel: [] }), summary: "", user_id: 4, status: "pending", created: 1 });
  const pairs = () => raw.prepare("SELECT o.name,o.unclaimed,o.public,e.eid FROM orgs o JOIN org_entity e ON e.org_id=o.id ORDER BY o.id").all().map((r) => `${r.eid}:${r.name}:${r.unclaimed}:${r.public}`);
  const r1 = rev("fabrikam", "Fabrikam"), r2 = rev("northwind", "Northwind"), r3 = rev("tailspin", "Tailspin");
  assert.equal((await call(env, 2, "POST", "/api/editor/decide", { kind: "entity", id: String(r1), action: "approve" })).s, 200);   // neue Route
  assert.deepEqual(pairs(), ["fabrikam:Fabrikam:1:0"]);
  const p = await call(env, 3, "POST", "/api/editor/decide", { kind: "entity", id: String(r2), action: "approve", reason: "passt" });   // Moderator empfiehlt
  assert.equal(p.j.proposed, true); assert.equal(pairs().length, 1);
  assert.equal((await call(env, 5, "POST", `/api/editor/proposals/${p.j.proposal}/confirm`, {})).s, 200);                            // Editor bestaetigt
  assert.deepEqual(pairs(), ["fabrikam:Fabrikam:1:0", "northwind:Northwind:1:0"]);
  assert.equal((await call(env, 2, "POST", "/api/admin/entity/approve/" + r3, {})).s, 200);                                           // alte Route (decide)
  assert.deepEqual(pairs(), ["fabrikam:Fabrikam:1:0", "northwind:Northwind:1:0", "tailspin:Tailspin:1:0"]);
  assert.equal(logs(raw, "action='review.approve' AND kind='entity'").length, 3);
  // schon bekannte Entitaet (Basisdaten): eine Aenderung freigeben legt keine zweite Firma an
  const r4 = ins(raw, "entity_rev", { eid: "contoso", data: JSON.stringify({ name: "Contoso", type: "org", desc: { en: "Contoso, updated description of the company.", de: "" }, web: "https://www.contoso.com", rel: [] }), user_id: 4, status: "pending", created: 2 });
  assert.equal((await call(env, 2, "POST", "/api/editor/decide", { kind: "entity", id: String(r4), action: "approve" })).s, 200);
  assert.equal(pairs().length, 3);
  // die alte Route ist kein Weg an can() vorbei: eigener Vorschlag, Moderator, schon entschieden
  const own = ins(raw, "entity_rev", { eid: "wingtip", data: JSON.stringify({ name: "Wingtip", type: "org", desc: { en: "x", de: "" }, rel: [] }), user_id: 2, status: "pending", created: 3 });
  assert.equal((await call(env, 2, "POST", "/api/admin/entity/approve/" + own, {})).j.error, "own_content");
  assert.equal((await call(env, 3, "POST", "/api/admin/entity/approve/" + own, {})).s, 403);
  assert.equal((await call(env, 5, "POST", "/api/admin/entity/approve/" + r1, {})).j.error, "not_pending");   // Editoren entscheiden nicht erneut; der Admin darf (wie bisher)
});

// ---------- 319-11: Eskalationen und Bewerbungen ----------
test("319-11: eine Eskalation an den Admin schliesst nur der Admin; jedes Verwerfen steht im Protokoll", async () => {
  const { raw, env } = await mk();
  blog(raw, 100, 2, "pending"); blog(raw, 101, 4, "pending");   // 100 gehoert Editor 2
  const esc = await call(env, 3, "POST", "/api/editor/decide", { kind: "blog", id: "100", action: "escalate", reason: "Werbung?" });
  assert.equal(esc.j.proposed, true);
  const dismiss = (uid, id) => call(env, uid, "POST", `/api/editor/proposals/${id}/dismiss`, {});
  assert.equal((await dismiss(2, esc.j.proposal)).s, 403);   // der betroffene Autor (Editor)
  assert.equal((await dismiss(5, esc.j.proposal)).j.error, "admin_only");   // auch kein anderer Editor
  assert.equal((await dismiss(3, esc.j.proposal)).s, 403);
  assert.equal(raw.prepare("SELECT status FROM edit_proposals WHERE id=?").get(esc.j.proposal).status, "open");
  const q = (await call(env, 5, "GET", "/api/editor/queue")).j.proposals.find((x) => x.id === esc.j.proposal);
  assert.equal(q.can, false); assert.equal(q.user_id, undefined);
  assert.equal((await call(env, 1, "GET", "/api/editor/queue")).j.proposals.find((x) => x.id === esc.j.proposal).can, true);
  assert.equal((await dismiss(1, esc.j.proposal)).s, 200);
  assert.deepEqual({ ...raw.prepare("SELECT status,decided_by FROM edit_proposals WHERE id=?").get(esc.j.proposal) }, { status: "dismissed", decided_by: 1 });
  assert.deepEqual(logs(raw, "action='escalation.close'"), [{ user_id: 1, role: "admin", action: "escalation.close", kind: "blog", item_id: "100" }]);
  // Empfehlung zu einem eigenen Beitrag: der Autor (Editor) kann sie nicht selbst verwerfen; ein anderer Editor schon, mit Protokoll
  const rec = await call(env, 3, "POST", "/api/editor/decide", { kind: "blog", id: "100", action: "reject", reason: "Werbung" });
  assert.equal((await dismiss(2, rec.j.proposal)).j.error, "own_content");
  assert.equal((await dismiss(5, rec.j.proposal)).s, 200);
  assert.deepEqual(logs(raw, "action='proposal.dismiss'"), [{ user_id: 5, role: "editor", action: "proposal.dismiss", kind: "blog", item_id: "100" }]);
  // Fach-Editor: Empfehlungen ausserhalb seines Bereichs sieht und entscheidet er nicht
  const rec2 = await call(env, 3, "POST", "/api/editor/decide", { kind: "blog", id: "101", action: "approve", reason: "gut" });
  assert.equal((await call(env, 7, "GET", "/api/editor/queue")).j.proposals.some((x) => x.id === rec2.j.proposal), false);
  assert.equal((await dismiss(7, rec2.j.proposal)).j.error, "out_of_scope");
});

test("319-11: eine offene Moderator-Bewerbung stuft nie zurueck, wer inzwischen Editor ist", async () => {
  const { raw, env } = await mk();
  const app = ins(raw, "editor_applications", { user_id: 6, role: "moderator", motivation: "Ich kuemmere mich gern um Kommentare.", created: 1 });
  assert.equal((await call(env, 2, "POST", `/api/editor/applications/${app}/confirm`, {})).j.status, "open");
  // inzwischen wird Konto 6 Editor (Admin) - die offene Bewerbung hat sich damit erledigt
  assert.equal((await call(env, 1, "POST", "/api/admin/role/6", { role: "editor" })).s, 200);
  assert.equal(raw.prepare("SELECT status FROM editor_applications WHERE id=?").get(app).status, "obsolete");
  assert.equal((await call(env, 5, "POST", `/api/editor/applications/${app}/confirm`, {})).s, 404);
  assert.deepEqual(roleRow(raw, 6), { role: "editor", role_source: "manual" });
  // selbst wenn eine Bewerbung noch offen waere (Altbestand): die zweite Bestaetigung vergibt nur aufwaerts
  raw.prepare("UPDATE editor_applications SET status='open' WHERE id=?").run(app);
  const r = await call(env, 5, "POST", `/api/editor/applications/${app}/confirm`, {});
  assert.deepEqual([r.s, r.j.status], [200, "obsolete"]);
  assert.deepEqual(roleRow(raw, 6), { role: "editor", role_source: "manual" });
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM edit_log WHERE action='role.grant'").get().n, 0);
  // Automatik (MVP vom Admin bestaetigt): offene Bewerbung wird ebenfalls geschlossen; aufwaerts geht weiter (Moderator -> Editor)
  const app4 = ins(raw, "editor_applications", { user_id: 4, role: "moderator", motivation: "Ich kuemmere mich gern um Kommentare.", created: 1 });
  ins(raw, "programs", { owner_type: "u", owner_id: 4, program: "mvp", verified: 0 });
  assert.equal((await call(env, 1, "POST", "/api/admin/verify", { owner: "u:user-4", kind: "program", key: "mvp", value: 1 })).s, 200);
  assert.deepEqual([roleRow(raw, 4).role, raw.prepare("SELECT status FROM editor_applications WHERE id=?").get(app4).status], ["editor", "obsolete"]);
  const up = ins(raw, "editor_applications", { user_id: 3, role: "editor", motivation: "Als Moderator moechte ich Editor werden.", created: 1 });
  for (const uid of [2, 5, 7]) await call(env, uid, "POST", `/api/editor/applications/${up}/confirm`, {});
  assert.deepEqual(roleRow(raw, 3), { role: "editor", role_source: "vote" });
});

// ---------- 319-12: ein maskEmail im Worker ----------
test("319-12: maskEmail kommt aus claimverify.js; Redakteure sehen Einladungs-Adressen nur maskiert", async () => {
  const src = (f) => readFileSync(new URL("../src/" + f, import.meta.url), "utf-8");
  assert.match(src("entinvite.js"), /import \{ maskEmail(?: as maskAddr)? \} from "\.\/claimverify\.js";/);
  assert.equal((src("entinvite.js").match(/maskEmail\s*=|function maskEmail/g) || []).length, 0);   // keine eigene Definition (PR #322 bringt maskAddr aus derselben Quelle)
  assert.equal((src("perm.js").match(/maskEmail\s*=|function maskEmail/g) || []).length, 0);
  const { raw, env } = await mk();
  ins(raw, "entity_invites", { token: "tok1", eid: "teams", name: "Max", email: "max.mustermann@example.com", by_user: 4, status: "sent", created: 1 });
  const mail = async (uid) => (await call(env, uid, "GET", "/api/entityinvite/mine")).j.items[0]?.email;
  assert.equal(await mail(2), "m***@example.com"); assert.equal(await mail(1), "max.mustermann@example.com"); assert.equal(await mail(4), "");
});

// ---------- Zweite Gegenpruefung: Einladung, Verlauf, Loeschreste ----------
test("Einladung zur Uebernahme: kein Editor bestaetigt sich selbst; Redaktionsrechte nur ueber can(claim.decide) im Bereich, mit Protokoll", async () => {
  const { raw, env } = await mk(); const sent = []; env.EMAIL = { send: async (m) => { sent.push(m); return {}; } };
  const send = (uid, eid, email) => call(env, uid, "POST", "/api/entityinvite/send", { eid, email, name: "Name" });
  const tok = (eid, email) => raw.prepare("SELECT token FROM entity_invites WHERE eid=? AND email=?").get(eid, email)?.token;
  const claims = () => raw.prepare("SELECT eid,user_id,status,via FROM entity_claims ORDER BY eid").all().map((r) => ({ ...r }));
  // Fach-Editor (teams) laedt sich fuer contoso ein: ausserhalb des Bereichs keine Redaktionsrechte, es gilt die Mitglieder-Regel
  assert.deepEqual((await send(7, "contoso", "fach@privat.example")).j.results, [{ eid: "contoso", error: "not_yours" }]);
  // Editor laedt die eigene Adresse ein und nimmt selbst an: nein, und es entsteht keine Uebernahme
  assert.deepEqual((await send(2, "contoso", "edi@privat.example")).j.results, [{ eid: "contoso", ok: true }]);
  assert.deepEqual(logs(raw, "action='claim.decide'"), [{ user_id: 2, role: "editor", action: "claim.decide", kind: "claim", item_id: "contoso" }]);
  assert.doesNotMatch(raw.prepare("SELECT after FROM edit_log").get().after, /edi@privat/);   // Adresse nur maskiert im Protokoll
  const t1 = tok("contoso", "edi@privat.example");
  assert.deepEqual([(await call(env, 2, "POST", "/api/entityinvite/accept", { t: t1 })).j.error, claims()], ["own_content", []]);
  // ein anderes Konto nimmt die Einladung des Editors an: wartet auf die Pruefung, nicht sofort bestaetigt
  const a = await call(env, 6, "POST", "/api/entityinvite/accept", { t: t1 });
  assert.deepEqual([a.s, a.j.pending], [200, true]); assert.deepEqual(claims(), [{ eid: "contoso", user_id: 6, status: "pending", via: "invite" }]);
  // der Einladende entscheidet nicht ueber "seine" Uebernahme, ein anderer Editor schon
  assert.equal((await call(env, 2, "POST", "/api/admin/entity/claim", { eid: "contoso", ok: true })).j.error, "own_content");
  assert.equal(claims()[0].status, "pending");
  assert.equal((await call(env, 5, "POST", "/api/admin/entity/claim", { eid: "contoso", ok: true })).s, 200);
  assert.equal(claims()[0].status, "verified");
  // Fach-Editor im eigenen Bereich laedt mit Redaktionsrechten ein (auch ohne eigene Entitaet), die Annahme wartet ebenfalls
  assert.deepEqual((await send(7, "teams", "t@privat.example")).j.results, [{ eid: "teams", ok: true }]);
  assert.equal((await call(env, 4, "POST", "/api/entityinvite/accept", { t: tok("teams", "t@privat.example") })).j.pending, true);
  // Admin-Einladung und Mitglieder-Regel (selbst angelegte Entitaet) bestaetigen wie bisher sofort
  assert.deepEqual((await send(1, "azure", "a@privat.example")).j.results, [{ eid: "azure", ok: true }]);
  assert.equal((await call(env, 4, "POST", "/api/entityinvite/accept", { t: tok("azure", "a@privat.example") })).j.pending, false);
  assert.deepEqual(claims().find((c) => c.eid === "azure"), { eid: "azure", user_id: 4, status: "verified", via: "invite" });
  // Moderatoren und Mitglieder: weder Kontaktliste noch Redaktionsrechte
  for (const uid of [3, 6, 7]) assert.notEqual((await call(env, uid, "GET", "/api/entityinvite/contacts")).s, 200, "Konto " + uid);
  assert.equal((await call(env, 2, "GET", "/api/entityinvite/contacts")).s, 200);
});

test("Wiki-Verlauf fuer Mitglieder: fremde wartende und abgelehnte Fassungen bleiben verborgen; die Wiki-Seite zeigt Fehler beim Wiederherstellen", async () => {
  const { raw, env } = await mk();
  const w = (id, uid, status, body) => ins(raw, "wiki_rev", { id, term: "teams", lang: "de", body, summary: "", user_id: uid, status, created: id });
  w(1, 6, "old", "alte Fassung von 6"); w(2, 2, "live", "live"); w(3, 4, "pending", "WARTEND von 4"); w(4, 4, "rejected", "ABGELEHNT von 4"); w(5, 6, "rejected", "eigene abgelehnte");
  const r = await call(env, 6, "GET", "/api/editor/my-history?kind=wiki&id=1");
  assert.deepEqual(r.j.versions.map((v) => [v.id, v.status]), [[5, "rejected"], [2, "live"], [1, "old"]]);
  assert.deepEqual((await call(env, 4, "GET", "/api/editor/my-history?kind=wiki&id=1")).j.versions.map((v) => v.id), [4, 3, 2, 1]);   // die eigenen sieht der Verfasser
  const js = readFileSync(new URL("../../assets/wiki.js", import.meta.url), "utf-8");
  assert.doesNotMatch(js, /\.then\(load\)/);   // kein Redaktionsknopf laedt mehr still neu
  assert.match(js, /act\("\/api\/admin\/wiki\/approve\/" \+ x\.id, e\.target\)/); assert.match(js, /btn\.textContent = label \+ " – " \+ T\.error \+ \(r\.j && r\.j\.error/);
});

test("Konto loeschen: Profil-ID in Bestaetigungen und die Begruendung des Melders verschwinden aus dem Protokoll", async () => {
  const { raw, env } = await mk();
  ins(raw, "programs", { owner_type: "u", owner_id: 6, program: "rd", verified: 0 });
  assert.equal((await call(env, 1, "POST", "/api/admin/verify", { owner: "u:user-6", kind: "program", key: "rd", value: 1 })).s, 200);
  const er = ins(raw, "expert_requests", { user_id: 4, title: "Anfrage", description: "Beschreibung", status: "open", lang: "de", created: 1 });
  ins(raw, "expert_request_reports", { request_id: er, user_id: 6, reply_id: 0, reason: "MELDERTEXT von Konto 6 mit Namen", created: 2 });
  ins(raw, "expert_request_reports", { request_id: er, user_id: 5, reply_id: 0, reason: "Text von Konto 5", created: 3 });
  assert.equal((await call(env, 3, "POST", "/api/editor/decide", { kind: "expert_report", id: `${er}:0`, action: "resolve" })).s, 200);
  ins(raw, "edit_log", { ts: 1, user_id: 1, role: "admin", action: "verify.set", kind: "verify", item_id: "u:61:program:mvp", day: 0 });   // anderes Konto mit aehnlicher ID bleibt
  assert.equal((await call(env, 6, "DELETE", "/api/me")).s, 200);
  const all = raw.prepare("SELECT item_id,before FROM edit_log").all().map((r) => JSON.stringify(r)).join("\n");
  assert.doesNotMatch(all, /MELDERTEXT|u:6:/); assert.match(all, /u:0:program:rd/); assert.match(all, /u:61:program:mvp/);
  assert.match(all, /Text von Konto 5/);   // fremde Meldungen bleiben
});

// ---------- Oberflaeche (assets/redaktion.js) mit kleinem DOM-Nachbau: keine Daten ohne Sitzung, ganzer Text im Formular, Anker beim Speichern ----------
import vm from "node:vm";
function fakeDom() {
  const mk = (tag) => {
    const e = { tag, children: [], attrs: {}, style: {}, dataset: {}, listeners: {}, hidden: false, disabled: false, className: "",
      appendChild(c) { this.children.push(c); c.parent = this; return c; },
      insertBefore(c, ref) { const i = this.children.indexOf(ref); this.children.splice(i < 0 ? this.children.length : i, 0, c); c.parent = this; return c; },
      setAttribute(k, v) { this.attrs[k] = String(v); if (k === "value") this._v = String(v); }, getAttribute(k) { return this.attrs[k] ?? null; },
      addEventListener(t, f) { (this.listeners[t] ||= []).push(f); }, focus() {}, remove() { if (this.parent) this.parent.children = this.parent.children.filter((x) => x !== this); },
      click() { for (const f of this.listeners.click || []) f({ target: this }); }, fire(t) { for (const f of this.listeners[t] || []) f({ target: this }); } };
    Object.defineProperty(e, "textContent", { get() { return this.children.length ? this.children.map((c) => c.textContent).join("") : this._t || ""; }, set(v) { this.children = []; this._t = String(v); } });
    Object.defineProperty(e, "firstChild", { get() { return this.children[0] || null; } });
    Object.defineProperty(e, "value", { get() { return this._v !== undefined ? this._v : tag === "select" ? this.children[0]?._v ?? "" : ""; }, set(v) { this._v = String(v); } });
    Object.defineProperty(e, "onchange", { set(f) { this.listeners.change = [f]; } });
    return e;
  };
  const root = mk("div");
  const document = { createElement: mk, createTextNode: (t) => ({ textContent: String(t), children: [] }), getElementById: (id) => (id === "red" ? root : null), head: mk("head") };
  const all = (n, out = []) => { out.push(n); for (const c of n.children || []) all(c, out); return out; };
  return { root, document, find: (pred) => all(root).filter((n) => n.tag && pred(n)), btn: (text) => all(root).filter((n) => n.tag === "button" && n.textContent === text) };
}
const tick = async (n = 6) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
function ui(routes) {
  const dom = fakeDom(), calls = [];
  const fetchStub = async (url, o = {}) => { const u = String(url).replace("https://api.test", "API:").replace("https://site.test", "SITE:"); calls.push({ u, method: o.method || "GET", body: o.body ? JSON.parse(o.body) : null });
    const hit = Object.entries(routes).find(([k]) => u.startsWith(k)), r = hit ? (typeof hit[1] === "function" ? hit[1](calls.at(-1)) : hit[1]) : [404, {}];
    return { status: r[0], ok: r[0] === 200, json: async () => r[1] }; };
  const ctx = { window: { M365ED: { api: "https://api.test", base: "https://site.test", lang: "de", mode: "editor" } }, document: dom.document, fetch: fetchStub, setTimeout };
  vm.createContext(ctx); vm.runInContext(readFileSync(new URL("../../assets/redaktion.js", import.meta.url), "utf-8"), ctx);
  return { ...dom, calls };
}

test("Oberflaeche: ohne Sitzung (oder ohne Rolle) keine Reiter, keine Listen, keine veroeffentlichten Dateien", async () => {
  for (const status of [401, 403]) {
    const u = ui({ "API:/api/editor/queue": [status, { error: status === 401 ? "login" : "forbidden" }], "API:/api/editor/applications": [status, {}], "SITE:/i18n-stale.json": [200, { items: [{ kind: "lblog", item: "p", lang: "de", units: ["1"] }] }] });
    await tick();
    const tabs = u.find((n) => n.attrs.role === "tablist")[0];
    assert.equal(tabs.hidden, true, "Reiter bleiben verborgen");
    for (const b of tabs.children) b.click();   // auch ein Klick per Skript laedt nichts
    await tick();
    assert.deepEqual(u.calls.filter((c) => !c.u.startsWith("API:/api/editor/")), [], "nur die Sitzungs-API wird gefragt");
    assert.equal(u.find((n) => n.tag === "li").length, 0);
    assert.match(u.root.textContent, status === 401 ? /zuerst auf der Community-Seite anmelden/ : /keinen Zugriff/);
  }
});

test("Oberflaeche: Bearbeiten zeigt den ganzen Text und schickt nur Geaendertes mit dem geladenen Stand; Sprachfassungen speichern mit Quell-Anker", async () => {
  const body = "Absatz. ".repeat(900).trim();   // 7199 Zeichen: laenger als die Vorschau
  const view = { kind: "blog", id: "7", title: "Ein Beitrag", body: body.slice(0, 4000), summary: "Kurz", lang: "de", status: "live", actions: { approve: "no", reject: "no", escalate: "do" }, history: [], proposals: [], editable: true,
    edit: { minor: "do", full: "do", title: "Ein Beitrag", summary: "Kurz", body, topics: [], base: "0123456789abcdef", max: 12000 } };
  const u = ui({
    "API:/api/editor/queue": [200, { role: "editor", scope: { subject: false }, kinds: ["blog"], modKinds: ["comment"], items: [{ kind: "blog", id: "7", title: "Ein Beitrag", excerpt: "Kurz", lang: "de", created: 1, author: "Autor", topics: [], actions: { approve: "no", reject: "no", escalate: "do" }, own: false }],
      proposals: [{ id: 1, action: "review.escalate", kind: "blog", item_id: "7", name: "Mo", role: "moderator", reason: "", ts: 1, can: false }, { id: 2, action: "review.approve", kind: "blog", item_id: "8", name: "Mo", role: "moderator", reason: "", ts: 1, can: true }] }],
    "API:/api/editor/applications": [200, { items: [] }], "API:/api/editor/item": [200, { item: view }], "API:/api/editor/edit": [200, { ok: true, log: 1 }],
    "SITE:/i18n-stale.json": [200, { items: [{ kind: "lblog", item: "p", lang: "de", units: ["1"] }] }],
    "SITE:/i18n-units/lblog/de.json": [200, { p: { units: [["T", "Title", "DE Title", "aaaa1111"], ["1", "First.", "Erster.", "bbbb2222"]], stale: ["1"], edited: [] } }],
    "API:/api/editor/i18n/overrides": [200, { overrides: {}, anchors: {}, wish: false }], "API:/api/editor/i18n/save": [200, { ok: true, log: 2 }],
  });
  await tick();
  const tabs = u.find((n) => n.attrs.role === "tablist")[0];
  assert.equal(tabs.hidden, false);
  // Empfehlungen: Schaltflaechen nur, wo der Server can=true meldet (Eskalationen schliesst nur der Admin)
  assert.equal(u.btn("Bestätigen").length, 1); assert.equal(u.btn("Verwerfen").length, 1);
  u.btn("Vorschau")[0].click(); await tick();
  u.btn("Bearbeiten")[0].click(); await tick();
  const areas = u.find((n) => n.tag === "textarea"), bo = areas.find((a) => a.value === body);
  assert.ok(bo, "das Formular traegt den ganzen Text, nicht die gekuerzte Vorschau");
  const level = u.find((n) => n.tag === "select" && n.children.some((o) => o._v === "full"))[0];
  u.btn("Speichern")[0].click(); await tick();
  assert.equal(u.calls.filter((c) => c.u.startsWith("API:/api/editor/edit")).length, 0, "ohne Aenderung wird nichts gesendet");
  level.value = "full"; level.fire("change"); bo.value = body + " Ergaenzt."; bo.fire("input");
  u.btn("Speichern")[0].click(); await tick();
  const sent = u.calls.find((c) => c.u.startsWith("API:/api/editor/edit")).body;
  assert.deepEqual({ ...sent, fields: Object.keys(sent.fields) }, { kind: "blog", id: "7", level: "full", fields: ["body"], base: "0123456789abcdef", reason: "" });
  assert.equal(sent.fields.body.length, body.length + 10);
  // Sprachfassungen: Veraltet-Liste -> Eintrag oeffnen -> Einheit speichern
  tabs.children[2].click(); await tick();
  u.btn("Öffnen").at(-1).click(); await tick();
  const ta = u.find((n) => n.tag === "textarea" && n.value === "Erster.")[0];
  assert.ok(ta); ta.value = "Erster, von Hand.";
  u.find((n) => n.tag === "input" && n.attrs.maxlength === "300").at(-1).value = "Stil";
  ta.parent.children.find((n) => n.tag === "button" && n.textContent === "Speichern").click(); await tick();
  assert.deepEqual(u.calls.find((c) => c.u.startsWith("API:/api/editor/i18n/save")).body, { kind: "lblog", item: "p", lang: "de", unit: "1", text: "Erster, von Hand.", prev: "Erster.", sh: "bbbb2222", reason: "Stil" });
});
