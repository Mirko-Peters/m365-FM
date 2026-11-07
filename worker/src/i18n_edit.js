// Sprachfassungen bearbeiten (Redaktion): Absatz fuer Absatz, versioniert, Export fuer den Seitenbau. Uebersetzt wird nur einmal maschinell;
// danach gehen Aenderungen als Overrides (i18n_override) in den Bau (site_i18n_overrides.py). Rechte ueber can() wie bei Inhalten.
import { can, roleOf, loadActor, logEdit } from "./perm.js";

const now = () => Math.floor(Date.now() / 1000);
export const I18N_KINDS = ["lblog", "episode", "notes"];
export const LANGS = ["de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko"];
const txt = (s, n) => String(s || "").trim().slice(0, n);
const res = (status, body) => ({ status, body });

// Absatztext: nur Inline-HTML der Uebersetzungen; Skripte, Rahmen, Ereignis-Attribute und javascript:-Adressen fliegen raus
export function cleanUnit(s) {
  return String(s ?? "").replace(/\u0000/g, "").slice(0, 20000)
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)\b[\s\S]*?(<\/\s*\1\s*>|$)/gi, "")
    .replace(/<\s*\/?\s*(script|style|iframe|object|embed|link|meta)\b[^>]*>/gi, "")
    .replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, "$1=$2#$2").trim();
}

// Eintrag veroeffentlicht? Blog: live in der Datenbank (Pakete als content/<slug>), Folgen: im Register mit Datum
export async function isPublished(db, kind, item) {
  if (kind === "lblog") return !!(await db.prepare("SELECT 1 x FROM blog_posts WHERE status='live' AND (slug=? OR 'content/'||slug=?)").bind(item, item).first());
  if (kind === "episode" || kind === "notes") return !!(await db.prepare("SELECT 1 x FROM episode WHERE slug=? AND published<>''").bind(item).first().catch(() => null));
  return false;
}
const valid = (kind, item, lang, unit) => I18N_KINDS.includes(kind) && LANGS.includes(lang) && /^[\w./-]{1,160}$/.test(item || "") && /^[\w-]{1,20}$/.test(unit || "");
const ip = (lang) => ({ ownerId: null, orgIds: [], topics: [], lang, i18n: true });

export async function currentOverrides(db, kind, item, lang) {
  const rows = (await db.prepare("SELECT unit,text FROM i18n_override WHERE kind=? AND item=? AND lang=?").bind(kind, item, lang).all()).results || [];
  return Object.fromEntries(rows.map((r) => [r.unit, r.text]));
}

// Speichern (Editor/Admin) bzw. Empfehlung (Moderator); prev = angezeigter Text davor (Ursprungsfassung fuer den Verlauf)
export async function saveUnit(env, user, { kind, item, lang, unit, text, prev = "", reason = "", viaProposal = 0 }) {
  const db = env.DB;
  if (!valid(kind, item, lang, unit)) return res(400, { error: "bad_request" });
  const actor = await loadActor(db, user), perm = can(actor, "content.edit_full", ip(lang));
  if (!perm.ok) return res(403, { error: perm.why });
  const clean = cleanUnit(text);
  if (!clean) return res(400, { error: "empty" });
  if (!txt(reason, 300) && roleOf(actor) !== "admin") return res(400, { error: "reason_required" });
  if (!(await isPublished(db, kind, item))) return res(404, { error: "not_published" });
  if (perm.propose) {
    const pid = (await db.prepare("INSERT INTO edit_proposals(ts,user_id,role,action,kind,item_id,reason,payload) VALUES(?,?,?,?,'i18n',?,?,?) RETURNING id").bind(now(), actor.id, roleOf(actor), "content.edit_full", `${kind}|${item}|${lang}`, txt(reason, 300), JSON.stringify({ op: "edit", kind, item, lang, unit, text: clean, prev })).first())?.id;
    return res(200, { ok: true, proposed: true, proposal: pid });
  }
  const t = now(), cur = await db.prepare("SELECT text FROM i18n_override WHERE kind=? AND item=? AND lang=? AND unit=?").bind(kind, item, lang, unit).first();
  if ((cur?.text ?? String(prev)) === clean) return res(409, { error: "unchanged" });
  const rev = db.prepare("INSERT INTO i18n_override_rev(kind,item,lang,unit,text,user_id,role,action,reason,ts) VALUES(?,?,?,?,?,?,?,?,?,?)");
  if (!(await db.prepare("SELECT 1 x FROM i18n_override_rev WHERE kind=? AND item=? AND lang=? AND unit=?").bind(kind, item, lang, unit).first()))
    await rev.bind(kind, item, lang, unit, cleanUnit(prev), 0, "machine", "baseline", "Maschinelle Übersetzung", t - 1).run();
  await db.prepare("INSERT INTO i18n_override(kind,item,lang,unit,text,by,ts) VALUES(?,?,?,?,?,?,?) ON CONFLICT(kind,item,lang,unit) DO UPDATE SET text=excluded.text,by=excluded.by,ts=excluded.ts").bind(kind, item, lang, unit, clean, actor.id, t).run();
  await rev.bind(kind, item, lang, unit, clean, actor.id, roleOf(actor), "edit", viaProposal ? `${txt(reason, 300)} (Empfehlung #${viaProposal})` : txt(reason, 300), t).run();
  const logId = await logEdit(db, actor, "content.edit_full", "i18n", `${kind}|${item}|${lang}|${unit}`, { reason, before: String(cur?.text ?? prev).slice(0, 300), after: clean.slice(0, 300) });
  return res(200, { ok: true, log: logId });
}

export async function unitHistory(db, kind, item, lang, unit) {
  const rows = (await db.prepare("SELECT r.id,r.ts,r.role,r.action,r.reason,r.text,COALESCE(u.name,'') name FROM i18n_override_rev r LEFT JOIN users u ON u.id=r.user_id WHERE r.kind=? AND r.item=? AND r.lang=? AND r.unit=? ORDER BY r.id DESC LIMIT 30").bind(kind, item, lang, unit).all()).results || [];
  const cur = await db.prepare("SELECT text FROM i18n_override WHERE kind=? AND item=? AND lang=? AND unit=?").bind(kind, item, lang, unit).first();
  // aktuelle Version = neueste Version, deren Text dem Override entspricht (ohne Override: die Ursprungsfassung)
  const current = cur ? rows.find((r) => r.text === cur.text)?.id || 0 : rows.find((r) => r.action === "baseline")?.id || 0;
  return { versions: rows.map((r) => ({ id: r.id, ts: r.ts, user: r.name, role: r.role, action: r.action, reason: r.reason, title: "", summary: "", body: r.text })), current };
}

// Zuruecksetzen: Editor nur Redaktionsaenderungen (aktuelle Fassung von einem Editor), Admin alles; Ursprungsfassung = Override entfernen
export async function revertUnit(env, user, { kind, item, lang, unit, rev }) {
  const db = env.DB;
  if (!valid(kind, item, lang, unit)) return res(400, { error: "bad_request" });
  const actor = await loadActor(db, user), role = roleOf(actor), perm = can(actor, "content.edit_full", ip(lang));
  if (!perm.ok || perm.propose) return res(403, { error: perm.why || "forbidden" });
  const h = await unitHistory(db, kind, item, lang, unit), target = h.versions.find((v) => v.id === +rev), cur = h.versions.find((v) => v.id === h.current);
  if (!target) return res(404, { error: "not_found" });
  if (target.id === h.current) return res(409, { error: "already_current" });
  if (role !== "admin" && cur && cur.role !== "editor") return res(403, { error: "not_editor_edit" });
  const t = now();
  if (target.action === "baseline") await db.prepare("DELETE FROM i18n_override WHERE kind=? AND item=? AND lang=? AND unit=?").bind(kind, item, lang, unit).run();
  else await db.prepare("INSERT INTO i18n_override(kind,item,lang,unit,text,by,ts) VALUES(?,?,?,?,?,?,?) ON CONFLICT(kind,item,lang,unit) DO UPDATE SET text=excluded.text,by=excluded.by,ts=excluded.ts").bind(kind, item, lang, unit, target.body, actor.id, t).run();
  const reason = `Zurückgesetzt auf Version #${target.id}`;
  await db.prepare("INSERT INTO i18n_override_rev(kind,item,lang,unit,text,user_id,role,action,reason,ts) VALUES(?,?,?,?,?,?,?,'revert',?,?)").bind(kind, item, lang, unit, target.body, actor.id, role, reason, t).run();
  await logEdit(db, actor, "content.edit_full", "i18n", `${kind}|${item}|${lang}|${unit}`, { reason, before: { version: h.current }, after: { version: target.id } });
  return res(200, { ok: true });
}

// "Geaenderte Absaetze neu uebersetzen": nur vermerken (ein Workflow-Lauf mit --stale holt es ab); je Eintrag/Sprache hoechstens ein offener Wunsch
export async function requestRetranslate(env, user, { kind, item, lang, units = [] }) {
  const db = env.DB;
  if (!valid(kind, item, lang, "x")) return res(400, { error: "bad_request" });
  const actor = await loadActor(db, user), perm = can(actor, "content.edit_full", ip(lang));
  if (!perm.ok) return res(403, { error: perm.why });
  const us = (Array.isArray(units) ? units : []).map((u) => txt(u, 20)).filter((u) => /^[\w-]+$/.test(u)).slice(0, 400);
  if (perm.propose) {
    const pid = (await db.prepare("INSERT INTO edit_proposals(ts,user_id,role,action,kind,item_id,reason,payload) VALUES(?,?,?,?,'i18n',?,?,?) RETURNING id").bind(now(), actor.id, roleOf(actor), "content.edit_full", `${kind}|${item}|${lang}`, "neu übersetzen", JSON.stringify({ op: "retranslate", kind, item, lang, units: us })).first())?.id;
    return res(200, { ok: true, proposed: true, proposal: pid });
  }
  await db.prepare("INSERT INTO i18n_retranslate_req(kind,item,lang,units,by,ts,status) VALUES(?,?,?,?,?,?,'open') ON CONFLICT(kind,item,lang,status) DO UPDATE SET units=excluded.units,by=excluded.by,ts=excluded.ts").bind(kind, item, lang, JSON.stringify(us), actor.id, now()).run();
  await logEdit(db, actor, "content.edit_full", "i18n", `${kind}|${item}|${lang}`, { reason: "Neu übersetzen vorgemerkt", after: us.join(",") });
  return res(200, { ok: true });
}

// Empfehlung eines Moderators bestaetigt ein Editor im Browser: fuehrt dieselbe Funktion mit den Daten der Empfehlung aus
export async function runProposal(env, actor, p) {
  const pl = JSON.parse(p.payload || "{}");
  if (pl.op === "retranslate") return requestRetranslate(env, actor, pl);
  return saveUnit(env, actor, { ...pl, reason: p.reason, viaProposal: p.id });
}

// ---- oeffentlich: Export fuer den Seitenbau und Wunschliste fuer den Workflow ----
export async function overridesExport(db, kind, lang) {
  const rows = (await db.prepare("SELECT o.item,o.unit,o.text FROM i18n_override o WHERE o.kind=? AND o.lang=? ORDER BY o.item,o.unit LIMIT 20000").bind(kind, lang).all()).results || [];
  const items = {}, ok = new Map();
  for (const r of rows) {
    if (!ok.has(r.item)) ok.set(r.item, await isPublished(db, kind, r.item));   // nur veroeffentlichte Eintraege
    if (ok.get(r.item)) (items[r.item] = items[r.item] || {})[r.unit] = r.text;
  }
  return { kind, lang, items };
}
export async function handleI18nPublic(env, request, url, path, J) {
  const db = env.DB, C = { "cache-control": "public, max-age=300" };
  if (path === "/api/i18n/overrides" && request.method === "GET") {
    const kind = url.searchParams.get("kind") || "", lang = url.searchParams.get("lang") || "";
    if (!I18N_KINDS.includes(kind) || !LANGS.includes(lang)) return J({ error: "bad_request" }, 400);
    return J(await overridesExport(db, kind, lang), 200, C);
  }
  if (path === "/api/i18n/retranslate" && request.method === "GET") {   // nur Schluessel (kind, item, lang, Absatz-IDs), kein Personenbezug
    const rows = (await db.prepare("SELECT kind,item,lang,units,ts FROM i18n_retranslate_req WHERE status='open' ORDER BY ts LIMIT 2000").all()).results || [];
    return J({ items: rows.map((r) => ({ ...r, units: JSON.parse(r.units || "[]") })) }, 200, { "cache-control": "public, max-age=60" });
  }
  if (path === "/api/i18n/retranslate/done" && request.method === "POST") {   // Workflow (--stale) meldet erledigte Wuensche zurueck; nur mit Cron-Schluessel
    if (!env.CRON_KEY || request.headers.get("x-cron-key") !== env.CRON_KEY) return J({ error: "forbidden" }, 403);
    const b = await request.json().catch(() => ({}));
    let n = 0;
    for (const x of (Array.isArray(b.items) ? b.items : []).slice(0, 500)) n += (await db.prepare("UPDATE i18n_retranslate_req SET status='done' WHERE kind=? AND item=? AND lang=? AND status='open'").bind(String(x.kind), String(x.item), String(x.lang)).run()).meta.changes;
    return J({ ok: true, done: n });
  }
  return null;
}
