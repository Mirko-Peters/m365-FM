// KI-Entwurf fuer Entitaeten (Datenbank = Quelle der Wahrheit): fill_entities.py (Actions) schickt die erzeugten Texte hierher.
// Schutz: nie eine Menschen-Aenderung ueberschreiben (Revision eines Nutzers ausser dem Systemnutzer, oder Live-Fassung ohne Maschinen-Herkunft),
// nur schreiben, wenn desc/long/faq noch genau dem Stand entsprechen, fuer den der Text erzeugt wurde (Hash), und nur duenne/leere Felder fuellen.
// Nie bei selbst verwalteten Entitaeten (entity_claims verified, wie T30-Abgleich und Auto-Uebersetzung).
import { cleanText } from "./util.js";
import { ensureEntTr, entTrHash, entTrSource } from "./autotr.js";

export const AI_USER = { provider: "system", sub: "ki-entwurf", name: "M365.FM Redaktion (KI-Entwurf)" };
export const AI_PREFIX = "KI-Entwurf";
export const SHORT_DESC = 80;   // wie entity_fill_data.SHORT_DESC: kuerzere englische Beschreibungen gelten als duenn
const MACHINE = /^(Übernahme aus entities\.json|Abgleich mit entities\.json|Auto-Übersetzung)/;
const ID = /^[a-z0-9-]{2,48}$/;
const LANGS = new Set(["de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko"]);
const now = () => Math.floor(Date.now() / 1000);
const txt = (s, n) => cleanText(s, n).replace(/[<>]/g, "").replace(/https?:\/\/\S+/gi, "").replace(/\s+/g, " ").trim();
const longTxt = (s, n) => String(s || "").replace(/[<>]/g, "").replace(/https?:\/\/\S+/gi, "").replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, n);

export async function aiUserId(db, create = true) {
  if (create) await db.prepare("INSERT OR IGNORE INTO users(provider,sub,name,role,banned,created) VALUES(?,?,?,'user',0,?)").bind(AI_USER.provider, AI_USER.sub, AI_USER.name, now()).run();
  return (await db.prepare("SELECT id FROM users WHERE provider=? AND sub=?").bind(AI_USER.provider, AI_USER.sub).first())?.id || 0;
}

// Hash des Standes, auf den sich ein KI-Text bezieht: Kurzbeschreibung, Langtext (en/de) und FAQ der live-Fassung
export async function stateHash(data) {
  const d = data || {}, s = [d.desc?.en, d.desc?.de, d.long?.en, d.long?.de, JSON.stringify(d.faq || {})].map((x) => String(x || "")).join("\u0001");
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

// Herkunft der live-Fassung: seed (Uebernahme/Abgleich/Auto-Uebersetzung), ai (KI-Entwurf), human (alles andere, auch Konten, die inzwischen geloescht sind)
// owned (selbst verwaltet, entity_claims verified) geht vor: solche Entitaeten bekommen nie einen KI-Text
export function revSource(row, sysId, humanIds, ownedIds) {
  if (ownedIds?.has(row.eid)) return "owned";
  if (humanIds?.has(row.eid)) return "human";
  if (sysId && row.user_id === sysId) return "ai";
  if (!row.user_id && MACHINE.test(row.summary || "")) return "seed";
  return "human";
}
// Entitaeten mit mindestens einer Revision (live/old) eines anderen Nutzers als dem Systemnutzer: von Menschen veraendert
export async function humanEdited(db, sysId) {
  const rows = (await db.prepare("SELECT DISTINCT eid FROM entity_rev WHERE status IN ('live','old') AND user_id>0 AND user_id<>?").bind(sysId || -1).all().catch(() => ({ results: [] }))).results || [];
  return new Set(rows.map((r) => r.eid));
}
export async function ownedEntities(db) {
  const rows = (await db.prepare("SELECT DISTINCT eid FROM entity_claims WHERE status='verified'").all().catch(() => ({ results: [] }))).results || [];
  return new Set(rows.map((r) => r.eid));
}
const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

const faqList = (v) => (Array.isArray(v) ? v : []).slice(0, 5).map((x) => ({ q: txt(x?.q, 200), a: txt(x?.a, 600) })).filter((x) => x.q && x.a);

// items: [{id, base, desc, long, faq, de:{desc,long,faq}, tr:{lang:{desc,long,faq}}}] (desc/long/faq = Englisch)
export async function fillEntities(env, items) {
  const db = env.DB, sys = await aiUserId(db), human = await humanEdited(db, sys), owned = await ownedEntities(db), out = [], t = now();
  await ensureEntTr(db);
  for (const it of Array.isArray(items) ? items.slice(0, 50) : []) {
    const id = String(it?.id || ""), res = (status, extra = {}) => out.push({ id, status, ...extra });
    if (!ID.test(id)) { res("bad_id"); continue; }
    const live = await db.prepare("SELECT id,data,user_id,summary FROM entity_rev WHERE eid=? AND status='live' ORDER BY created DESC,id DESC LIMIT 1").bind(id).first();
    if (!live) { res("no_db_version"); continue; }
    if (owned.has(id)) { res("owned"); continue; }
    if (human.has(id) || revSource({ eid: id, user_id: live.user_id, summary: live.summary }, sys, human) === "human") { res("human_edited"); continue; }
    let d; try { d = JSON.parse(live.data); } catch { res("bad_data"); continue; }
    if (String(it.base || "") !== (await stateHash(d))) { res("changed_meanwhile"); continue; }
    const next = JSON.parse(live.data), fields = [];
    const de = it.de || {}, setFaq = (v) => { next.faq = { ...(next.faq || {}), ...v }; };
    // nur en/de setzen, weitere Sprachen der live-Fassung (desc.nl ...) bleiben erhalten
    next.desc = { ...(isObj(d.desc) ? d.desc : {}), en: d.desc?.en || "", de: d.desc?.de || "" }; next.long = { ...(isObj(d.long) ? d.long : {}), en: d.long?.en || "", de: d.long?.de || "" };
    const dEn = txt(it.desc, 300), lEn = longTxt(it.long, 3000), dDe = txt(de.desc, 300), lDe = longTxt(de.long, 3000);
    if (dEn.length >= 20 && next.desc.en.length < SHORT_DESC && dEn !== next.desc.en) { next.desc.en = dEn; fields.push("desc.en"); }
    if (lEn && !next.long.en) { next.long.en = lEn; fields.push("long.en"); }
    if (dDe.length >= 20 && (!next.desc.de || next.desc.de === next.desc.en)) { next.desc.de = dDe; fields.push("desc.de"); }
    if (lDe && !next.long.de) { next.long.de = lDe; fields.push("long.de"); }
    const fe = faqList(it.faq), fd = faqList(de.faq);
    if (fe.length && !next.faq?.en?.length) { setFaq({ en: fe }); fields.push("faq.en"); }
    if (fd.length && !next.faq?.de?.length) { setFaq({ de: fd }); fields.push("faq.de"); }
    if (!next.long.en && !next.long.de) { delete next.long.en; delete next.long.de; if (!Object.keys(next.long).length) delete next.long; }
    // Weitere Sprachen: ent_tr (Quelle fuer /api/entity/tr); INSERT OR IGNORE, vorhandene Uebersetzungen bleiben
    const trStmts = [];
    for (const [lang, v] of Object.entries(it.tr && typeof it.tr === "object" ? it.tr : {})) {
      if (!LANGS.has(lang) || lang === "de") continue;
      for (const [f, val] of [["desc", txt(v?.desc, 300)], ["long", longTxt(v?.long, 3000)], ["faq", faqList(v?.faq).length ? JSON.stringify(faqList(v.faq)) : ""]])
        if (val) trStmts.push(db.prepare("INSERT OR IGNORE INTO ent_tr(eid,field,lang,text,created) VALUES(?,?,?,?,?)").bind(id, f, lang, val, t));
    }
    const stmts = [];
    // Auto-Uebersetzung (autotr.js) abstimmen: fuer jedes geaenderte Feld gilt der neue Text als gesehen (gleicher Hash wie dort), die Uebersetzungen des alten
    // Texts sind veraltet und gehen; die mitgelieferten Sprachfassungen (unten) gelten fuer den neuen Text - sonst loescht autotr sie und kauft sie neu
    for (const f of ["desc", "long"]) {
      if (!fields.some((x) => x.startsWith(f + "."))) continue;
      const src = entTrSource(next[f]); if (!src || src === entTrSource(d[f])) continue;
      const mine = "EXISTS (SELECT 1 FROM entity_rev WHERE eid=? AND status='live' AND user_id=? AND created=?)";   // nur, wenn der Entwurf wirklich live wurde
      stmts.push(db.prepare(`INSERT INTO ent_tr_seen(eid,field,first,h) SELECT ?,?,?,? WHERE ${mine} ON CONFLICT(eid,field) DO UPDATE SET first=excluded.first,h=excluded.h`).bind(id, f, t, entTrHash(src), id, sys, t),
        db.prepare(`DELETE FROM ent_tr WHERE eid=? AND field=? AND ${mine}`).bind(id, f, id, sys, t));
    }
    if (fields.length) {
      stmts.unshift(db.prepare("UPDATE entity_rev SET status='old' WHERE id=? AND status='live' AND user_id IS ?").bind(live.id, live.user_id),
        db.prepare("INSERT INTO entity_rev(eid,data,summary,user_id,status,created) SELECT ?,?,?,?,'live',? WHERE NOT EXISTS (SELECT 1 FROM entity_rev WHERE eid=? AND status='live')")
          .bind(id, JSON.stringify(next), `${AI_PREFIX}: ${fields.join(", ")}`.slice(0, 140), sys, t, id));
    }
    if (fields.length) await db.batch(stmts);
    let added = 0; for (const st of trStmts) added += (await st.run()).meta?.changes || 0;   // INSERT OR IGNORE: nur neue Sprachfassungen zaehlen
    if (!fields.length && !added) { res("unchanged"); continue; }
    res("ok", { fields, tr: added });
  }
  return out;
}

export async function handleEntFill(env, request, path, J) {
  if (path !== "/api/internal/entity-fill") return null;
  if (request.method !== "POST") return J({ error: "method_not_allowed" }, 405);
  if (!env.CRON_KEY || request.headers.get("x-cron-key") !== env.CRON_KEY) return J({ error: "forbidden" }, 403);
  const b = await request.json().catch(() => null);
  if (!b || !Array.isArray(b.items)) return J({ error: "bad_request" }, 400);
  const results = await fillEntities(env, b.items), n = {};
  for (const r of results) n[r.status] = (n[r.status] || 0) + 1;
  return J({ ok: true, counts: n, results });
}
