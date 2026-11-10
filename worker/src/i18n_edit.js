// Sprachfassungen bearbeiten (Redaktion): Einheit fuer Einheit, versioniert, Export fuer den Seitenbau. Uebersetzt wird nur einmal maschinell;
// danach gehen Aenderungen als Handtexte (i18n_override) in den Export. Vertrag: i18n_overrides.py ("VERTRAG i18n-overrides v1") - Arten lblog | episode |
// notes, Einheiten wie dort, je Handtext der Quell-Anker sh (Spalte src_hash; die Oberflaeche schickt ihn mit, der Worker rechnet nicht). Angewendet
// wird ausschliesslich im Seitenbau ueber i18n_overrides.py. Rechte ueber can() wie bei Inhalten.
import { can, roleOf, loadActor, logEdit } from "./perm.js";
import { rateLimit } from "./util.js";

const now = () => Math.floor(Date.now() / 1000);
export const I18N_KINDS = ["lblog", "episode", "notes"];
export const LANGS = ["de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko"];
const UNIT = { lblog: /^(?:T|D|[QA][1-9]\d{0,2}|[1-9]\d{0,3})$/, episode: /^(?:title|summary)$/, notes: /^html$/ };   // Einheiten des Vertrags (Punkt 1)
const ANCHOR = /^[0-9a-f]{8}$/;
const txt = (s, n) => String(s || "").trim().slice(0, n);
const res = (status, body) => ({ status, body });

// ---- Bereinigung beim Speichern: Positivliste statt Verbotsliste. Der Seitenbau bereinigt beim Anwenden noch einmal (i18n_overrides.clean) ----
const INLINE = new Set(["a", "strong", "b", "em", "i", "u", "code", "br", "img"]);
const BLOCKS = new Set([...INLINE, "p", "ul", "ol", "li", "h2", "h3", "h4", "blockquote", "pre", "hr", "table", "thead", "tbody", "tr", "th", "td"]);   // wie site_podpage.OK_TAGS
const DROP = new Set(["script", "style", "iframe", "form", "object", "embed", "svg", "math", "noscript", "template", "textarea", "title", "select"]);   // samt Inhalt
const VOID = new Set(["br", "hr", "img"]);
const IMG_HOSTS = new Set(["img.m365.fm", "www.m365.fm"]);   // Bilder nur aus dem eigenen Bucket (Projektregel), fremde Hosts -> Fehler foreign_image
const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", colon: ":", tab: "\t", newline: "\n", nbsp: "\u00a0", sol: "/", num: "#" };
const decode = (s) => String(s).replace(/&(?:#(\d{1,7})|#x([0-9a-f]{1,6})|([a-z]{2,8}));?/gi, (m, d, x, n) => {
  if (n) return NAMED[n.toLowerCase()] ?? m;
  const c = d ? parseInt(d, 10) : parseInt(x, 16); return c > 0 && c <= 0x10ffff ? String.fromCodePoint(c) : "";
});
const escT = (s) => s.replace(/&(?!(?:#\d{1,7}|#x[0-9a-f]{1,6}|[a-z][a-z0-9]{1,30});)/gi, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escA = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const attrs = (raw) => { const o = {}; for (const m of String(raw).matchAll(/([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) { const k = m[1].toLowerCase(); if (!(k in o)) o[k] = decode(m[2] ?? m[3] ?? m[4] ?? ""); } return o; };
// Adressen: nur https/http, Seiten-Pfade, Anker und mailto; alles andere (javascript:, data:, //host, verschleierte Schemata) faellt weg
const safeHref = (v) => { const u = String(v).replace(/[\u0000-\u0020\u007f-\u009f]+/g, ""); return /^(?:https?:\/\/[^\/\\]|mailto:[^<>"']+$|#|\/(?![\/\\]))/i.test(u) && u.length <= 600 ? u : ""; };
// Marke ab s[i] === "<" lesen -> { end, close, name, raw } oder null (keine Marke: das Zeichen ist Text). Laenge begrenzt, damit die Laufzeit linear bleibt.
function tagAt(s, i) {
  const m = /^<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9:-]*)/.exec(s.slice(i, i + 80)); if (!m) return null;
  const from = i + m[0].length, max = Math.min(s.length, i + 4000);
  for (let j = from; j < max; j++) {
    const c = s[j];
    if (c === ">") return { end: j + 1, close: !!m[1], name: m[2].toLowerCase(), raw: s.slice(from, j) };
    if (c === '"' || c === "'") { const k = s.indexOf(c, j + 1); if (k < 0 || k >= max) return null; j = k; }
  }
  return null;
}
// Ausgabe besteht nur aus maskiertem Text und selbst geschriebenen Marken der Positivliste ok (plain: gar keine Marken, Text unmaskiert)
function sanHtml(input, ok, plain = false) {
  let out = "", skip = "", err = "", last = 0;
  const s = String(input).replace(/<!--[\s\S]*?(?:-->|$)/g, "").replace(/<!\[CDATA\[[\s\S]*?(?:\]\]>|$)/gi, "");
  const text = (t) => { if (!skip && t) out += plain ? decode(t) : escT(t); };
  for (let i = s.indexOf("<"); i >= 0; i = s.indexOf("<", i)) {
    const g = tagAt(s, i);
    if (!g) { i++; continue; }
    text(s.slice(last, i)); last = i = g.end;
    const t = g.name;
    if (skip) { if (g.close && t === skip) skip = ""; continue; }
    if (DROP.has(t)) { err = err || "bad_html"; if (!g.close && !/\/\s*$/.test(g.raw)) skip = t; continue; }   // Skript, Rahmen, Formular, SVG ...: samt Inhalt weg; beim Speichern ein Fehler, damit nichts still verschwindet
    if (plain) { out += " "; continue; }
    if (!ok.has(t)) continue;   // unbekanntes Element: nur die Marke faellt weg, der Text bleibt
    if (g.close) { if (!VOID.has(t)) out += `</${t}>`; continue; }
    const a = attrs(g.raw);
    if (t === "a") { const h = safeHref(a.href || ""); out += h ? `<a href="${escA(h)}">` : "<a>"; }
    else if (t === "img") {
      let u = null; try { u = new URL(String(a.src || "").trim()); } catch { u = null; }
      if (!u || u.protocol !== "https:" || !IMG_HOSTS.has(u.hostname) || u.username || u.password) { err = "foreign_image"; continue; }
      out += `<img src="${escA(u.href)}" alt="${escA(String(a.alt || "").slice(0, 300))}"${/^\d{1,5}$/.test(a.width || "") ? ` width="${a.width}"` : ""}${/^\d{1,5}$/.test(a.height || "") ? ` height="${a.height}"` : ""}>`;
    } else out += `<${t}>`;
  }
  text(s.slice(last));
  return { text: plain ? out.replace(/[<>]/g, " ").replace(/\s+/g, " ").trim() : out.trim(), err };
}
const MAXLEN = { lblog: 20000, notes: 60000, episode: 2000 };
const PLAIN_UNIT = /^(?:T|D|[QA]\d+)$/;   // lblog: Titel, Beschreibung und FAQ sind im Original reiner Text (translate_blog.source_of), nur die Absaetze tragen Inline-HTML
// -> { text, err }: lblog = Inline-HTML eines Absatzes (Titel, Beschreibung, FAQ: reiner Text), notes = HTML der Show Notes, episode = reiner Text. text ist immer sauber; err (too_long, bad_html,
// foreign_image) sagt dem Speichern, dass etwas weggefallen waere - dann wird abgelehnt statt still gekuerzt. Der Export nimmt bei alten Zeilen den sauberen Text.
export function cleanUnit(kind, s, unit = "") {
  const raw = String(s ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "");
  if (raw.length > (MAXLEN[kind] || 20000)) return { text: "", err: "too_long" };
  if (kind === "episode" || (kind === "lblog" && PLAIN_UNIT.test(unit))) return { text: sanHtml(raw, null, true).text, err: "" };   // reiner Text: Marken fallen ohne Fehler weg
  return sanHtml(raw, kind === "notes" ? BLOCKS : INLINE);
}

// Eintrag veroeffentlicht? Blog: live in der Datenbank (Pakete als content/<slug>), Folgen: im Register mit Datum
export async function isPublished(db, kind, item) {
  if (kind === "lblog") return !!(await db.prepare("SELECT 1 x FROM blog_posts WHERE status='live' AND (slug=? OR 'content/'||slug=?)").bind(item, item).first());
  if (kind === "episode" || kind === "notes") return !!(await db.prepare("SELECT 1 x FROM episode WHERE slug=? AND published<>''").bind(item).first().catch(() => null));
  return false;
}
// Schluessel des Seitenbaus: Sprachfassungen der Content-Pakete heissen content/<slug> (site_content_blog TR_PREFIX), in blog_posts steht der blanke Slug.
// Wer den Slug aus der Adresse eintippt, landet sonst unter einem Schluessel, den der Seitenbau nie liest (Anforderung, Handtext, Wunsch verfielen still).
// Nur fuer Pakete (content_import en/<slug>) und nur, wenn kein frueherer Beitrag denselben Slug traegt (dann ueberspringt der Seitenbau das Paket).
export async function buildKey(db, kind, item) {
  if (kind !== "lblog" || item.includes("/")) return item;
  const r = await db.prepare("SELECT EXISTS(SELECT 1 FROM blog_posts p JOIN content_import c ON c.post_id=p.id AND c.k='en/'||p.slug WHERE p.status='live' AND p.slug=?1) AND NOT EXISTS(SELECT 1 FROM blog_posts p WHERE p.status='live' AND p.slug=?1 AND p.id NOT IN (SELECT post_id FROM content_import)) x").bind(item).first().catch(() => null);
  return r?.x ? "content/" + item : item;
}
const validItem = (kind, item, lang) => I18N_KINDS.includes(kind) && LANGS.includes(lang) && /^[\w./-]{1,160}$/.test(item || "") && !String(item).includes("..");
const valid = (kind, item, lang, unit) => validItem(kind, item, lang) && UNIT[kind].test(unit || "");
const ip = (lang) => ({ ownerId: null, orgIds: [], topics: [], lang, i18n: true });

export async function currentOverrides(db, kind, item, lang) {
  const rows = (await db.prepare("SELECT unit,text FROM i18n_override WHERE kind=? AND item=? AND lang=?").bind(kind, item, lang).all()).results || [];
  return Object.fromEntries(rows.map((r) => [r.unit, r.text]));
}
export async function overrideAnchors(db, kind, item, lang) {   // { unit: Quell-Anker des gespeicherten Handtexts } - die Oberflaeche zeigt "Original geaendert", wenn er nicht mehr passt
  const rows = (await db.prepare("SELECT unit,src_hash FROM i18n_override WHERE kind=? AND item=? AND lang=?").bind(kind, item, lang).all()).results || [];
  return Object.fromEntries(rows.map((r) => [r.unit, r.src_hash || ""]));
}

// Speichern (Editor/Admin) bzw. Empfehlung (Moderator); prev = angezeigter Text davor (Ursprungsfassung fuer den Verlauf), sh = Quell-Anker der Einheit
// (aus docs/i18n-units, Vertrag Punkt 2): fuer lblog Pflicht - ohne Anker wendet der Seitenbau einen Absatz-Handtext nie an.
export async function saveUnit(env, user, { kind, item, lang, unit, text, prev = "", sh = "", reason = "", viaProposal = 0 }) {
  const db = env.DB;
  if (!valid(kind, item, lang, unit)) return res(400, { error: "bad_request" });
  const actor = await loadActor(db, user), perm = can(actor, "content.edit_full", ip(lang));
  if (!perm.ok) return res(403, { error: perm.why });
  item = await buildKey(db, kind, item);
  const c = cleanUnit(kind, text, unit), clean = c.text;
  if (c.err) return res(400, { error: c.err });
  if (!clean) return res(400, { error: "empty" });
  const anchor = String(sh || "").trim().toLowerCase();
  if (anchor ? !ANCHOR.test(anchor) : kind === "lblog") return res(400, { error: "anchor_required" });
  if (!txt(reason, 300) && roleOf(actor) !== "admin") return res(400, { error: "reason_required" });
  if (!(await isPublished(db, kind, item))) return res(404, { error: "not_published" });
  if (perm.propose) {
    const pid = (await db.prepare("INSERT INTO edit_proposals(ts,user_id,role,action,kind,item_id,reason,payload) VALUES(?,?,?,?,'i18n',?,?,?) RETURNING id").bind(now(), actor.id, roleOf(actor), "content.edit_full", `${kind}|${item}|${lang}`, txt(reason, 300), JSON.stringify({ op: "edit", kind, item, lang, unit, text: clean, prev: String(prev ?? "").slice(0, MAXLEN[kind]), sh: anchor })).first())?.id;
    return res(200, { ok: true, proposed: true, proposal: pid });
  }
  const t = now(), cur = await db.prepare("SELECT text,src_hash FROM i18n_override WHERE kind=? AND item=? AND lang=? AND unit=?").bind(kind, item, lang, unit).first();
  const base = cleanUnit(kind, prev, unit).text;
  if ((cur ? cur.text : base) === clean && (!cur || cur.src_hash === anchor)) return res(409, { error: "unchanged" });   // gleicher Text mit neuem Anker = "passt weiter zum geaenderten Original"
  const rev = db.prepare("INSERT INTO i18n_override_rev(kind,item,lang,unit,text,src_hash,user_id,role,action,reason,ts) VALUES(?,?,?,?,?,?,?,?,?,?,?)");
  if (!(await db.prepare("SELECT 1 x FROM i18n_override_rev WHERE kind=? AND item=? AND lang=? AND unit=?").bind(kind, item, lang, unit).first()))
    await rev.bind(kind, item, lang, unit, base, "", 0, "machine", "baseline", "Maschinelle Übersetzung", t - 1).run();
  await db.prepare("INSERT INTO i18n_override(kind,item,lang,unit,text,src_hash,by,ts) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(kind,item,lang,unit) DO UPDATE SET text=excluded.text,src_hash=excluded.src_hash,by=excluded.by,ts=excluded.ts").bind(kind, item, lang, unit, clean, anchor, actor.id, t).run();
  await rev.bind(kind, item, lang, unit, clean, anchor, actor.id, roleOf(actor), "edit", viaProposal ? `${txt(reason, 300)} (Empfehlung #${viaProposal})` : txt(reason, 300), t).run();
  const logId = await logEdit(db, actor, "content.edit_full", "i18n", `${kind}|${item}|${lang}|${unit}`, { reason, before: String(cur?.text ?? base).slice(0, 300), after: clean.slice(0, 300) });
  return res(200, { ok: true, log: logId });
}

export async function unitHistory(db, kind, item, lang, unit) {
  const rows = (await db.prepare("SELECT r.id,r.ts,r.role,r.action,r.reason,r.text,r.src_hash,COALESCE(u.name,'') name FROM i18n_override_rev r LEFT JOIN users u ON u.id=r.user_id WHERE r.kind=? AND r.item=? AND r.lang=? AND r.unit=? ORDER BY r.id DESC LIMIT 30").bind(kind, item, lang, unit).all()).results || [];
  const cur = await db.prepare("SELECT text FROM i18n_override WHERE kind=? AND item=? AND lang=? AND unit=?").bind(kind, item, lang, unit).first();
  // aktuelle Version = neueste Version, deren Text dem Handtext entspricht (ohne Handtext: die Ursprungsfassung)
  const current = cur ? rows.find((r) => r.text === cur.text)?.id || 0 : rows.find((r) => r.action === "baseline")?.id || 0;
  return { versions: rows.map((r) => ({ id: r.id, ts: r.ts, user: r.name, role: r.role, action: r.action, reason: r.reason, title: "", summary: "", body: r.text, sh: r.src_hash || "" })), current };
}

// Zuruecksetzen: Editor nur Redaktionsaenderungen (aktuelle Fassung von einem Editor), Admin alles; Ursprungsfassung = Handtext entfernen (Vertrag Punkt 6).
// cur = Version, die der Aufrufer als aktuell gesehen hat: weicht sie ab, hat inzwischen jemand anderes gespeichert -> 409 conflict, nichts wird ueberschrieben.
export async function revertUnit(env, user, { kind, item, lang, unit, rev, cur: seen }) {
  const db = env.DB;
  if (!valid(kind, item, lang, unit)) return res(400, { error: "bad_request" });
  const actor = await loadActor(db, user), role = roleOf(actor), perm = can(actor, "content.edit_full", ip(lang));
  if (!perm.ok || perm.propose) return res(403, { error: perm.why || "forbidden" });
  const h = await unitHistory(db, kind, item, lang, unit), target = h.versions.find((v) => v.id === +rev), cur = h.versions.find((v) => v.id === h.current);
  if (!target) return res(404, { error: "not_found" });
  if (+seen !== h.current) return res(409, { error: "conflict", current: h.current });
  if (target.id === h.current) return res(409, { error: "already_current" });
  if (role !== "admin" && cur && cur.role !== "editor") return res(403, { error: "not_editor_edit" });
  const t = now(), back = cleanUnit(kind, target.body, unit).text;   // auch alte Zeilen gehen nur bereinigt wieder in den Export
  if (target.action === "baseline" || !back) await db.prepare("DELETE FROM i18n_override WHERE kind=? AND item=? AND lang=? AND unit=?").bind(kind, item, lang, unit).run();
  else await db.prepare("INSERT INTO i18n_override(kind,item,lang,unit,text,src_hash,by,ts) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(kind,item,lang,unit) DO UPDATE SET text=excluded.text,src_hash=excluded.src_hash,by=excluded.by,ts=excluded.ts").bind(kind, item, lang, unit, back, target.sh, actor.id, t).run();
  const reason = `Zurückgesetzt auf Version #${target.id}`;
  await db.prepare("INSERT INTO i18n_override_rev(kind,item,lang,unit,text,src_hash,user_id,role,action,reason,ts) VALUES(?,?,?,?,?,?,?,?,'revert',?,?)").bind(kind, item, lang, unit, target.action === "baseline" ? target.body : back, target.sh, actor.id, role, reason, t).run();
  await logEdit(db, actor, "content.edit_full", "i18n", `${kind}|${item}|${lang}|${unit}`, { reason, before: { version: h.current }, after: { version: target.id } });
  return res(200, { ok: true });
}

// "Geaenderte Absaetze neu uebersetzen": nur vermerken. Ein Uebersetzungslauf mit --stale --wishes (translate-blog/-show/-notes, Vertrag Punkt 8) holt die
// Liste ab und meldet Erledigtes zurueck; je Eintrag/Sprache hoechstens ein offener Wunsch (ein zweiter ersetzt die Einheiten-Liste).
export async function requestRetranslate(env, user, { kind, item, lang, units = [] }) {
  const db = env.DB;
  if (!validItem(kind, item, lang)) return res(400, { error: "bad_request" });
  const actor = await loadActor(db, user), perm = can(actor, "content.edit_full", ip(lang));
  if (!perm.ok) return res(403, { error: perm.why });
  item = await buildKey(db, kind, item);
  const us = [...new Set((Array.isArray(units) ? units : []).map((u) => txt(u, 20)).filter((u) => UNIT[kind].test(u)))].slice(0, 400);
  if (!(await isPublished(db, kind, item))) return res(404, { error: "not_published" });
  if (perm.propose) {
    const pid = (await db.prepare("INSERT INTO edit_proposals(ts,user_id,role,action,kind,item_id,reason,payload) VALUES(?,?,?,?,'i18n',?,?,?) RETURNING id").bind(now(), actor.id, roleOf(actor), "content.edit_full", `${kind}|${item}|${lang}`, "neu übersetzen", JSON.stringify({ op: "retranslate", kind, item, lang, units: us })).first())?.id;
    return res(200, { ok: true, proposed: true, proposal: pid });
  }
  await db.prepare("INSERT INTO i18n_retranslate_req(kind,item,lang,units,by,ts,status) VALUES(?,?,?,?,?,?,'open') ON CONFLICT(kind,item,lang,status) DO UPDATE SET units=excluded.units,by=excluded.by,ts=excluded.ts").bind(kind, item, lang, JSON.stringify(us), actor.id, now()).run();
  await logEdit(db, actor, "content.edit_full", "i18n", `${kind}|${item}|${lang}`, { reason: "Neu übersetzen vorgemerkt", after: us.join(",") });
  return res(200, { ok: true });
}
export const openWishes = async (db, kind, item, lang) => !!(await db.prepare("SELECT 1 x FROM i18n_retranslate_req WHERE kind=? AND item=? AND lang=? AND status='open'").bind(kind, item, lang).first());

// Absatz-Ansicht anfordern (Migration 0042): docs/i18n-units enthaelt nur veraltete, bearbeitete und angeforderte Eintraege (alle waeren zu gross). Wer die
// Sprachfassung bearbeiten darf (can content.edit_minor in der Sprache, Moderatoren als Empfehlung eingeschlossen), merkt den Eintrag vor; der Export nennt ihn
// unter "open", und der naechste Seitenbau veroeffentlicht Einheiten und Quell-Anker. Kein Personenbezug, nichts am Inhalt geaendert -> kein Protokoll.
export const OPEN_DAYS = 30;
export async function requestOpen(env, user, { kind, item, lang }) {
  const db = env.DB;
  if (!validItem(kind, item, lang)) return res(400, { error: "bad_request" });
  const perm = can(await loadActor(db, user), "content.edit_minor", ip(lang));
  if (!perm.ok) return res(403, { error: perm.why });
  if (!(await isPublished(db, kind, item))) return res(404, { error: "not_published" });
  if (!(await rateLimit(db, `i18nopen:${user.id}`, 100, 86400))) return res(429, { error: "rate_limit" });
  item = await buildKey(db, kind, item);   // gespeichert wird der Schluessel, den der Seitenbau fragt (asked()); die Oberflaeche uebernimmt ihn aus der Antwort
  await db.batch([db.prepare("DELETE FROM i18n_open_req WHERE ts<?").bind(now() - OPEN_DAYS * 86400),
    db.prepare("INSERT INTO i18n_open_req(kind,item,lang,ts) VALUES(?,?,?,?) ON CONFLICT(kind,item,lang) DO UPDATE SET ts=excluded.ts").bind(kind, item, lang, now())]);
  return res(200, { ok: true, days: OPEN_DAYS, item });
}

// Empfehlung eines Moderators bestaetigt ein Editor im Browser: fuehrt dieselbe Funktion mit den Daten der Empfehlung aus
export async function runProposal(env, actor, p) {
  let pl = {}; try { pl = JSON.parse(p.payload || "{}"); } catch { pl = {}; }
  if (pl.op === "retranslate") return requestRetranslate(env, actor, pl);
  return saveUnit(env, actor, { ...pl, reason: p.reason, viaProposal: p.id });
}

// ---- oeffentlich: Export fuer den Seitenbau und Wunschliste fuer die Uebersetzungslaeufe ----
// Vertrag Punkt 3: { kind, lang, items: { item: { unit: { t, sh } } } }, nur veroeffentlichte Eintraege. Texte gehen noch einmal durch die Positivliste,
// damit auch aeltere Zeilen nie ungefiltert hinausgehen; ein Bild-Fehler dort laesst nur das Bild weg.
export async function overridesExport(db, kind, lang) {
  const rows = (await db.prepare("SELECT o.item,o.unit,o.text,o.src_hash FROM i18n_override o WHERE o.kind=? AND o.lang=? ORDER BY o.item,o.unit LIMIT 20000").bind(kind, lang).all()).results || [];
  const items = {}, ok = new Map();
  for (const r of rows) {
    if (!UNIT[kind].test(r.unit)) continue;
    if (!ok.has(r.item)) ok.set(r.item, await isPublished(db, kind, r.item));
    const t = ok.get(r.item) ? cleanUnit(kind, r.text, r.unit).text : "";
    if (t) (items[r.item] = items[r.item] || {})[r.unit] = { t, sh: ANCHOR.test(r.src_hash || "") ? r.src_hash : "" };
  }
  // angeforderte Absatz-Ansichten (requestOpen): nur veroeffentlichte Eintraege, nur wenn es welche gibt (sonst bleibt die Antwort genau Vertrag v1)
  const open = [];
  for (const r of (await db.prepare("SELECT item FROM i18n_open_req WHERE kind=? AND lang=? AND ts>=? ORDER BY item LIMIT 2000").bind(kind, lang, now() - OPEN_DAYS * 86400).all().catch(() => ({ results: [] }))).results || []) {
    if (!ok.has(r.item)) ok.set(r.item, await isPublished(db, kind, r.item));
    if (ok.get(r.item)) open.push(r.item);
  }
  return { kind, lang, items, ...(open.length ? { open } : {}) };
}
export async function handleI18nPublic(env, request, url, path, J) {
  const db = env.DB, C = { "cache-control": "public, max-age=300" };
  if (path === "/api/i18n/overrides" && request.method === "GET") {
    const kind = url.searchParams.get("kind") || "", lang = url.searchParams.get("lang") || "";
    if (!I18N_KINDS.includes(kind) || !LANGS.includes(lang)) return J({ error: "bad_request" }, 400);
    return J(await overridesExport(db, kind, lang), 200, C);
  }
  if (path === "/api/i18n/retranslate" && request.method === "GET") {   // Vertrag Punkt 8: nur Schluessel (kind, item, lang, Einheiten), kein Personenbezug; die Laeufe fragen ohne Schluessel
    const rows = (await db.prepare("SELECT kind,item,lang,units,ts FROM i18n_retranslate_req WHERE status='open' ORDER BY ts LIMIT 2000").all()).results || [];
    return J({ items: rows.map((r) => { let u = []; try { u = JSON.parse(r.units || "[]"); } catch { u = []; } return { ...r, units: Array.isArray(u) ? u : [] }; }) }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/i18n/retranslate/done" && request.method === "POST") {   // ein Lauf meldet erledigte Wuensche zurueck; nur mit Cron-Schluessel
    if (!env.CRON_KEY || request.headers.get("x-cron-key") !== env.CRON_KEY) return J({ error: "forbidden" }, 403);
    const b = await request.json().catch(() => ({}));
    let n = 0;   // erledigt = Zeile loeschen: ein zweiter Wunsch fuer denselben Eintrag kann danach wieder angelegt und erledigt werden
    for (const x of (Array.isArray(b.items) ? b.items : []).slice(0, 500)) if (x && typeof x === "object") n += (await db.prepare("DELETE FROM i18n_retranslate_req WHERE kind=? AND item=? AND lang=?").bind(String(x.kind), String(x.item), String(x.lang)).run()).meta.changes;
    return J({ ok: true, done: n });
  }
  return null;
}
