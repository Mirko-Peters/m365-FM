// Redaktion und Moderation (Stufe 1): gemeinsame Pruefliste ueber die bestehenden Warteschlangen, Entscheidungen ueber can() (perm.js), Protokoll, Empfehlungen, Undo.
// Routen: /api/editor/* (Redakteure, Moderatoren, Admin) und /api/admin/editlog* (nur Admin). Die alten /api/admin/*-Routen rufen decide() bzw. legacyRev() auf
// oder fragen can() ueber perm.js gate(); keine Route entscheidet an can() vorbei.
import { can, roleOf, inScope, loadActor, logEdit, emailFor, scopeOf, orgIdsOf } from "./perm.js";
import { evalBadges } from "./badges.js";
import { baseIds } from "./entities.js";
import { pairNewOrgEntity } from "./orgpair.js";
import { notify } from "./mail.js";
import { saveUnit, unitHistory, revertUnit, requestRetranslate, currentOverrides, overrideAnchors, openWishes, runProposal } from "./i18n_edit.js";
import { applyForRole, myApplications, listApplications, decideApplication, NEEDED } from "./roles.js";
import { sanitize, MAX_BODY } from "./wiki.js";
import { cleanText, sha256hex } from "./util.js";
import { limitTopics } from "./sponsor_extra.js";
import { rejectPitch } from "./podcast.js";
import { rejectVideo } from "./youtube.js";

const now = () => Math.floor(Date.now() / 1000);
const txt = (s, n) => String(s || "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, n);
const ACT = { approve: "review.approve", reject: "review.reject", hide: "review.hide", escalate: "review.escalate", resolve: "report.resolve" };
// Welche Art welche Aktion kennt (Rest: "unsupported"). Moderatoren sehen ihre Arten als bearbeitbar, die uebrigen nur lesend (Empfehlung).
const KIND_ACTIONS = {
  blog: ["approve", "reject", "escalate"], wiki: ["approve", "reject", "escalate"], entity: ["approve", "reject", "escalate"], cert: ["approve", "reject", "escalate"],
  podcast: ["reject", "escalate"], video: ["reject", "escalate"],
  comment: ["hide", "resolve", "escalate"], expert_report: ["resolve", "escalate"],
};
export const MOD_KINDS = new Set(["comment", "expert_report"]);   // Berichte, Kommentare, Antworten
export const KINDS = Object.keys(KIND_ACTIONS);

const parseT = (s) => { try { const v = JSON.parse(s || "[]"); return Array.isArray(v) ? v.filter((x) => typeof x === "string") : []; } catch { return []; } };
// Themen-Entitaeten eines Eintrags (fuer Fach-Editoren): Blog/Podcast/Video aus topics, Wiki = Begriff, Entitaet/Zertifikat = eid; Meldungen haben keine
const topicsOf = (kind, it) => (kind === "blog" || kind === "podcast" || kind === "video" ? parseT(it.topics) : kind === "wiki" ? [it.term] : kind === "entity" || kind === "cert" ? [it.eid] : []).filter(Boolean);

// ---- Adapter je Art: load (Eigentuemer, Status, Vorschau), Aktionen mit before/after fuer das Protokoll, undo ----
const A = {
  blog: {
    async load(db, id) { const r = await db.prepare("SELECT b.id,b.user_id,b.title,b.summary,b.body,b.html,b.lang,b.status,b.slug,b.published,b.created,b.updated,b.topics,COALESCE(u.name,'') name,p.handle FROM blog_posts b LEFT JOIN users u ON u.id=b.user_id LEFT JOIN profiles p ON p.user_id=b.user_id WHERE b.id=?").bind(id).first(); return r && { ...r, ownerId: r.user_id, pending: r.status === "pending" }; },
    async approve(env, it) { await env.DB.prepare("UPDATE blog_posts SET status='live',published=COALESCE(NULLIF(published,0),?),note='',updated=? WHERE id=?").bind(now(), now(), it.id).run(); return { before: { status: it.status, published: it.published }, after: { status: "live" } }; },
    async reject(env, it, reason) { await env.DB.prepare("UPDATE blog_posts SET status='rejected',note=?,updated=? WHERE id=?").bind(txt(reason, 300), now(), it.id).run(); return { before: { status: it.status, published: it.published }, after: { status: "rejected" } }; },
    async undo(env, b, id, a) { return (await env.DB.prepare("UPDATE blog_posts SET status=?,published=?,updated=? WHERE id=? AND status=?").bind(b.status || "pending", b.published || 0, now(), id, a.status || "").run()).meta.changes > 0; },
  },
  wiki: {
    async load(db, id) { const r = await db.prepare("SELECT r.id,r.term,r.lang,r.body,r.summary,r.status,r.user_id,r.created,COALESCE(u.name,'') name FROM wiki_rev r LEFT JOIN users u ON u.id=r.user_id WHERE r.id=?").bind(id).first(); return r && { ...r, title: `${r.term} (${r.lang})`, ownerId: r.user_id || null, pending: r.status === "pending" }; },
    async approve(env, it) {
      const db = env.DB, prev = await db.prepare("SELECT id FROM wiki_rev WHERE term=? AND lang=? AND status='live'").bind(it.term, it.lang).first();
      await db.batch([db.prepare("UPDATE wiki_rev SET status='old' WHERE term=? AND lang=? AND status='live'").bind(it.term, it.lang), db.prepare("UPDATE wiki_rev SET status='live' WHERE id=?").bind(it.id)]);
      if (it.user_id) await evalBadges(env, it.user_id); return { before: { status: it.status, prevLive: prev?.id || 0 }, after: { status: "live" } };
    },
    async reject(env, it) { await env.DB.prepare("UPDATE wiki_rev SET status='rejected' WHERE id=?").bind(it.id).run(); return { before: { status: it.status }, after: { status: "rejected" } }; },
    async undo(env, b, id, a) { return undoRev(env.DB, "wiki_rev", b, id, a); },
  },
  entity: {
    async load(db, id) { const r = await db.prepare("SELECT r.id,r.eid,r.data,r.summary,r.status,r.user_id,r.created,COALESCE(u.name,'') name FROM entity_rev r LEFT JOIN users u ON u.id=r.user_id WHERE r.id=?").bind(id).first(); let d = {}; try { d = JSON.parse(r?.data || "{}"); } catch { /* leer */ } return r && { ...r, title: d.name || r.eid, body: ((d.desc || {}).en || (d.desc || {}).de || ""), ownerId: r.user_id || null, pending: r.status === "pending" }; },
    async approve(env, it) {
      const db = env.DB, prev = await db.prepare("SELECT id FROM entity_rev WHERE eid=? AND status='live'").bind(it.eid).first();
      const wasLive = !!prev || (await baseIds(env)).has(it.eid);
      await db.batch([db.prepare("UPDATE entity_rev SET status='old' WHERE eid=? AND status='live'").bind(it.eid), db.prepare("UPDATE entity_rev SET status='live' WHERE id=?").bind(it.id)]);
      if (it.user_id) await evalBadges(env, it.user_id);
      if (!wasLive) {   // #311: neue Firmen-Entitaet freigegeben -> jetzt die (unbeanspruchte) Paar-Firma anlegen; Inhaber wird, wer die Entitaet uebernimmt
        let d = null; try { d = JSON.parse(it.data || "null"); } catch { d = null; }
        if (d?.type === "org") await pairNewOrgEntity(env, null, it.eid, d).catch(() => null);
      }
      return { before: { status: it.status, prevLive: prev?.id || 0 }, after: { status: "live" } };
    },
    async reject(env, it) { await env.DB.prepare("UPDATE entity_rev SET status='rejected' WHERE id=?").bind(it.id).run(); return { before: { status: it.status }, after: { status: "rejected" } }; },
    async undo(env, b, id, a) { return undoRev(env.DB, "entity_rev", b, id, a); },
  },
  cert: {
    async load(db, id) { const [uid, eid] = String(id).split(":"); const r = await db.prepare("SELECT c.user_id,c.eid,c.year,c.url,k.status,k.created,u.name FROM cert_check k JOIN certs c ON c.user_id=k.user_id AND c.eid=k.eid JOIN users u ON u.id=c.user_id WHERE k.user_id=? AND k.eid=?").bind(+uid, eid || "").first(); return r && { ...r, id, title: `${r.eid}${r.year ? " · " + r.year : ""}`, body: r.url || "", ownerId: r.user_id, pending: r.status === "pending" }; },
    async approve(env, it) { await env.DB.prepare("UPDATE cert_check SET status='verified',via='editor',created=? WHERE user_id=? AND eid=?").bind(now(), it.user_id, it.eid).run(); return { before: { status: it.status }, after: { status: "verified" } }; },
    async reject(env, it) { await env.DB.prepare("UPDATE cert_check SET status='rejected',via='editor',created=? WHERE user_id=? AND eid=?").bind(now(), it.user_id, it.eid).run(); return { before: { status: it.status }, after: { status: "rejected" } }; },
    async undo(env, b, id, a) { const [uid, eid] = String(id).split(":"); return (await env.DB.prepare("UPDATE cert_check SET status=? WHERE user_id=? AND eid=? AND status=?").bind(b.status || "pending", +uid, eid, a.status || "").run()).meta.changes > 0; },
  },
  comment: {
    async load(db, id) { const r = await db.prepare("SELECT c.id,c.vid,c.lang,c.body,c.status,c.user_id,c.created,COALESCE(u.name,'') name,(SELECT COUNT(*) FROM reports x WHERE x.comment_id=c.id) reports FROM comments c LEFT JOIN users u ON u.id=c.user_id WHERE c.id=?").bind(id).first(); return r && { ...r, title: `${r.reports}× gemeldet`, ownerId: r.user_id, pending: true }; },
    async hide(env, it) { await env.DB.prepare("UPDATE comments SET status='hidden' WHERE id=?").bind(it.id).run(); return { before: { status: it.status }, after: { status: "hidden" } }; },
    async resolve(env, it) { const rows = (await env.DB.prepare("SELECT user_id,created FROM reports WHERE comment_id=?").bind(it.id).all()).results || []; await env.DB.prepare("DELETE FROM reports WHERE comment_id=?").bind(it.id).run(); return { before: { reports: rows.map((r) => [r.user_id, r.created]) }, after: { reports: 0 } }; },
    async undo(env, b, id, a) {
      const db = env.DB;
      if (b.status && !(await db.prepare("UPDATE comments SET status=? WHERE id=? AND status=?").bind(b.status, id, a.status || "").run()).meta.changes) return false;
      for (const [u, c] of b.reports || []) if (u) await db.prepare("INSERT OR IGNORE INTO reports(comment_id,user_id,created) VALUES(?,?,?)").bind(id, u, c).run();   // u=0: Melder inzwischen geloescht
      return true;
    },
  },
  expert_report: {   // Meldungen zu Publisher-Anfragen/Antworten: erledigen = Meldungen verwerfen; Entfernen/Schliessen bleibt beim Admin
    async load(db, id) { const [rid, rep] = String(id).split(":").map(Number); const r = await db.prepare("SELECT e.id,e.title,e.description,e.status,e.user_id,e.lang,(SELECT COUNT(*) FROM expert_request_reports x WHERE x.request_id=e.id AND x.reply_id=?) reports,(SELECT body FROM expert_request_replies WHERE id=?) reply FROM expert_requests e WHERE e.id=?").bind(rep || 0, rep || 0, rid).first().catch(() => null); return r && { ...r, id, body: r.reply || r.description || "", ownerId: r.user_id, name: "", pending: r.reports > 0, rid, rep: rep || 0 }; },
    async resolve(env, it) { const rows = (await env.DB.prepare("SELECT user_id,reason,created FROM expert_request_reports WHERE request_id=? AND reply_id=?").bind(it.rid, it.rep).all()).results || []; await env.DB.prepare("DELETE FROM expert_request_reports WHERE request_id=? AND reply_id=?").bind(it.rid, it.rep).run(); return { before: { reports: rows.map((r) => [r.user_id, r.reason, r.created]) }, after: { reports: 0 } }; },
    async undo(env, b, id) { const [rid, rep] = String(id).split(":").map(Number); for (const [u, rs, c] of b.reports || []) if (u) await env.DB.prepare("INSERT OR IGNORE INTO expert_request_reports(request_id,user_id,reply_id,reason,created) VALUES(?,?,?,?,?)").bind(rid, u, rep || 0, rs || "", c || 0).run(); return true; },
  },
};
for (const k of ["podcast", "video"]) A[k] = {   // Ablehnen entfernt auch den Entwurf bei Spreaker/YouTube (rejectPitch/rejectVideo); die alten Admin-Routen rufen decide()
  async load(db, id) { const t = k === "podcast" ? "pod_episodes" : "yt_videos"; const r = await db.prepare(`SELECT e.id,e.title,e.description,e.topics,e.lang,e.status,e.user_id,e.created,COALESCE(u.name,'') name FROM ${t} e LEFT JOIN users u ON u.id=e.user_id WHERE e.id=?`).bind(id).first(); return r && { ...r, body: r.description, ownerId: r.user_id, pending: ["review", "submitted"].includes(r.status) }; },
  async reject(env, it, reason) {
    if (!(await (k === "podcast" ? rejectPitch : rejectVideo)(env, it.id, reason))) throw Object.assign(new Error("reject_failed"), { code: "server" });
    return { before: { status: it.status }, after: { status: "rejected" } };
  },
};

// Rueckgaengig einer Wiki-/Entitaeten-Entscheidung: nur solange die Revision noch im protokollierten Zustand danach ist. Eine Freigabe zuruecknehmen heisst:
// die Revision ist noch live (keine spaetere Freigabe hat sie abgeloest) -> sie geht zurueck und die Fassung davor wird wieder live, in EINEM Stapel.
async function undoRev(db, t, b, id, a) {
  const cur = await db.prepare(`SELECT status FROM ${t} WHERE id=?`).bind(id).first();
  if (!cur || cur.status !== (a.status || "")) return false;
  const ops = [db.prepare(`UPDATE ${t} SET status=? WHERE id=? AND status=?`).bind(b.status || "pending", id, cur.status)];
  if (a.status === "live" && b.prevLive) ops.push(db.prepare(`UPDATE ${t} SET status='live' WHERE id=? AND status='old'`).bind(b.prevLive));
  await db.batch(ops); return true;
}

// Was die Redaktion ueberhaupt sieht (Vorschau, Bearbeiten, Verlauf, Entscheidung): Blog nur eingereicht oder live - Entwuerfe und Abgelehntes gehoeren dem
// Autor; Podcast/Video ohne Hochlade-Zwischenstaende. Moderatoren sehen ausserhalb ihrer Arten nur, was gerade in der Pruefliste steht. Alles andere ist
// fuer die Redaktion "nicht gefunden". Fach-Editoren lesen (Vorschau, Verlauf) nur ihren Bereich; beim Entscheiden nennt can() den Grund (out_of_scope).
const SEEN = { blog: ["pending", "live"], podcast: ["review", "submitted", "published"], video: ["review", "submitted", "published"] };
const visible = (actor, kind, it) => (!SEEN[kind] || SEEN[kind].includes(it.status)) && (roleOf(actor) !== "moderator" || MOD_KINDS.has(kind) || !!it.pending);
const load = async (db, kind, id) => (A[kind] ? await A[kind].load(db, kind === "cert" || kind === "expert_report" ? String(id) : +id) : null);
const itemPerm = async (db, it, kind) => ({ ownerId: it.ownerId, orgIds: it.ownerId ? await orgIdsOf(db, it.ownerId) : [], topics: topicsOf(kind, it), lang: it.lang || "" });
// -> { it, ip } oder null (gibt es nicht oder ist fuer diesen Akteur nicht sichtbar)
async function lookup(db, actor, kind, id) {
  const it = await load(db, kind, id); if (!it) return null;
  const ip = await itemPerm(db, it, kind);
  return visible(actor, kind, it) ? { it, ip } : null;
}
// Stand eines Beitrags als kurzer Hash: die Oberflaeche schickt ihn beim Bearbeiten zurueck (base), der Server lehnt ab, wenn inzwischen jemand gespeichert hat
const stateOf = (it) => [it.title || "", it.summary || "", it.body || "", it.topics || "[]"];
const baseOf = async (it) => (await sha256hex(JSON.stringify(stateOf(it)))).slice(0, 16);
const modeOf = (p) => (p.ok ? (p.propose ? "propose" : "do") : "no");

// ---- Entscheidung: ausfuehren oder als Empfehlung speichern ----
export async function decide(env, user, { kind, id, action, reason = "", viaProposal = 0, legacy = false }) {
  const db = env.DB;
  if (!A[kind] || !KIND_ACTIONS[kind].includes(action)) return { status: 400, body: { error: "unsupported" } };
  const actor = await loadActor(db, user), f = await lookup(db, actor, kind, id);
  if (!f) return { status: 404, body: { error: "not_found" } };
  const it = f.it, perm = can(actor, ACT[action], f.ip);
  if (!perm.ok) return { status: 403, body: { error: perm.why } };
  if (action === "reject" && !legacy && !txt(reason, 300) && roleOf(actor) !== "admin") return { status: 400, body: { error: "reason_required" } };
  if (action === "escalate" || perm.propose) {   // Eskalation und Moderator-Empfehlungen: nur gespeichert
    if (legacy) return { status: 403, body: { error: "forbidden" } };   // die alten Routen kennen keine Empfehlungen
    const pid = (await db.prepare("INSERT INTO edit_proposals(ts,user_id,role,action,kind,item_id,reason) VALUES(?,?,?,?,?,?,?) RETURNING id").bind(now(), actor.id, roleOf(actor), ACT[action], kind, String(id), txt(reason, 300)).first())?.id;
    if (action === "escalate") await logEdit(db, actor, ACT[action], kind, id, { reason });
    return { status: 200, body: { ok: true, proposed: true, proposal: pid } };
  }
  if (!A[kind][action]) return { status: 400, body: { error: "unsupported" } };
  if (!it.pending && action !== "hide" && !(legacy && roleOf(actor) === "admin" && (kind === "wiki" || kind === "entity"))) return { status: 409, body: { error: "not_pending" } };   // nur der Admin entscheidet ueber die alte Route erneut
  let r; try { r = await A[kind][action](env, it, txt(reason, 300), actor); } catch (e) { return { status: 500, body: { error: e.code || "server" } }; }
  const logId = await logEdit(db, actor, ACT[action], kind, id, { reason: viaProposal ? `${reason} (Empfehlung #${viaProposal})` : reason, before: r.before, after: r.after });
  return { status: 200, body: { ok: true, log: logId } };
}

// ---- Bearbeiten (blog): klein = Titel/Zusammenfassung/Themen, voll = auch Text; voll wird protokolliert und der Autor benachrichtigt ----
// Es gelten dieselben Regeln wie im Editor des Autors (/api/blog/save): Titel 140, Zusammenfassung 300, Text als Wiki-Markup ueber sanitize() mit
// denselben Fehlern (bad_ref, bad_image ...). Nichts wird still gekuerzt: ein zu langer Text ist ein Fehler. base = Stand, den der Aufrufer geladen hat
// (itemView.base): passt er nicht mehr, hat inzwischen der Autor oder jemand anderes gespeichert -> 409 conflict.
const MINOR = new Set(["title", "summary", "topics"]), FULL = new Set(["title", "summary", "topics", "body"]);
const line = (v, n) => cleanText(v, 100000).replace(/[<>]/g, "").replace(/https?:\/\/\S+/gi, "").replace(/\s+/g, " ").trim().slice(0, n + 1);
export async function editItem(env, user, { kind, id, level, fields = {}, base = "", reason = "", viaProposal = 0 }) {
  const db = env.DB;
  if (kind !== "blog") return { status: 400, body: { error: "unsupported", hint: "open_editor" } };
  const action = level === "full" ? "content.edit_full" : "content.edit_minor", allowed = level === "full" ? FULL : MINOR;
  const keys = Object.keys(fields).filter((k) => allowed.has(k));
  if (!keys.length || Object.keys(fields).some((k) => !allowed.has(k))) return { status: 400, body: { error: "bad_fields" } };
  const actor = await loadActor(db, user), f = await lookup(db, actor, "blog", id);
  if (!f) return { status: 404, body: { error: "not_found" } };
  const it = f.it, perm = can(actor, action, f.ip);
  if (!perm.ok) return { status: 403, body: { error: perm.why } };
  if (!/^[0-9a-f]{16}$/.test(String(base))) return { status: 400, body: { error: "base_required" } };
  if (base !== (await baseOf(it))) return { status: 409, body: { error: "conflict" } };
  const val = {};
  if (keys.includes("title")) { val.title = line(fields.title, 140); if (val.title.length < 5) return { status: 400, body: { error: "title" } }; if (val.title.length > 140) return { status: 400, body: { error: "too_long", field: "title" } }; }
  if (keys.includes("summary")) { val.summary = line(fields.summary, 300); if (val.summary.length > 300) return { status: 400, body: { error: "too_long", field: "summary" } }; }
  if (keys.includes("topics")) {
    const known = await baseIds(env), ts = [];
    if (!Array.isArray(fields.topics)) return { status: 400, body: { error: "bad_topic" } };
    for (const x of limitTopics(fields.topics)) { if (!known.has(x)) return { status: 400, body: { error: "bad_topic", topic: String(x).slice(0, 60) } }; if (!ts.includes(x)) ts.push(x); }
    val.topics = JSON.stringify(ts);
  }
  if (keys.includes("body")) {
    const raw = String(fields.body ?? "");
    if (it.html && !it.body) return { status: 400, body: { error: "imported_html" } };   // uebernommener HTML-Beitrag ohne Wiki-Text: hier nicht bearbeitbar (der Text wuerde den Inhalt ersetzen)
    if (cleanText(raw, 10000000).length > MAX_BODY) return { status: 400, body: { error: "too_long", field: "body", max: MAX_BODY } };
    const sb = sanitize(raw, { viz: true }); if (sb.err) return { status: 400, body: { error: sb.err } };
    if (sb.body.length < 300 && String(it.body || "").length >= 300) return { status: 400, body: { error: "too_short" } };   // Mindestlaenge eines eingereichten Beitrags (wie beim Autor): die Redaktion leert keinen Beitrag
    val.body = sb.body;
  }
  const changed = keys.filter((k) => String(val[k]) !== String(it[k] ?? (k === "topics" ? "[]" : "")));
  if (!changed.length) return { status: 409, body: { error: "unchanged" } };
  if (perm.propose) {
    const pid = (await db.prepare("INSERT INTO edit_proposals(ts,user_id,role,action,kind,item_id,reason,payload) VALUES(?,?,?,?,?,?,?,?) RETURNING id").bind(now(), actor.id, roleOf(actor), action, kind, String(id), txt(reason, 300), JSON.stringify({ level, fields, base })).first())?.id;
    return { status: 200, body: { ok: true, proposed: true, proposal: pid } };
  }
  const before = {}, after = {};
  for (const k of changed) { before[k] = String(it[k] ?? "").slice(0, 300); after[k] = String(val[k]).slice(0, 300); }
  await recordBase(db, it);   // Ursprungsfassung bzw. ein nicht erfasster Zwischenstand, bevor die Redaktion schreibt
  await db.prepare(`UPDATE blog_posts SET ${changed.map((k) => `${k}=?`).join(",")},updated=? WHERE id=?`).bind(...changed.map((k) => val[k]), now(), it.id).run();
  const logId = await logEdit(db, actor, action, kind, id, { reason: viaProposal ? `${reason} (Empfehlung #${viaProposal})` : reason, before, after });
  await recordRev(db, actor.id, roleOf(actor), it.id, { ...it, ...Object.fromEntries(changed.map((k) => [k, val[k]])) }, reason);
  if (level === "full" && roleOf(actor) === "editor" && it.ownerId) await notify(env, it.ownerId, "system", "Dein Beitrag wurde von der Redaktion bearbeitet", `<p>Die Redaktion von M365.FM hat deinen Beitrag „${esc(it.title)}“ überarbeitet. Grund: ${esc(txt(reason, 300) || "–")}</p>`, `edit:${logId}`);
  return { status: 200, body: { ok: true, log: logId } };
}
// ---- Versionsverlauf (wie ein Wiki): Blog ueber content_rev, Wiki/Entitaeten ueber ihre Revisionstabellen ----
const REV_INS = "INSERT INTO content_rev(kind,item_id,user_id,role,action,reason,title,summary,body,topics,ts) VALUES('blog',?,?,?,?,?,?,?,?,?,?)";
async function recordRev(db, uid, role, postId, st, reason, action = "edit") {
  const [title, summary, body, topics] = stateOf(st);
  return (await db.prepare(REV_INS + " RETURNING id").bind(String(postId), uid || 0, role, action, String(reason || "").slice(0, 300), title, summary, body, topics, now()).first())?.id || 0;
}
// Verlauf und Beitrag in Deckung bringen, bevor jemand darauf aufbaut: ohne Verlauf die Ursprungsfassung; mit Verlauf ein Stand, den der Verlauf nicht kennt
// (der Autor hat gespeichert, ohne dass es erfasst wurde) als Fassung des Autors. -> id der neu angelegten Zeile oder 0
async function recordBase(db, it) {
  const last = await db.prepare("SELECT title,summary,body,topics FROM content_rev WHERE kind='blog' AND item_id=? ORDER BY id DESC LIMIT 1").bind(String(it.id)).first();
  if (last && JSON.stringify(stateOf(last)) === JSON.stringify(stateOf(it))) return 0;
  const [title, summary, body, topics] = stateOf(it);
  return (await db.prepare(REV_INS + " RETURNING id").bind(String(it.id), it.ownerId || it.user_id || 0, "author", last ? "edit" : "baseline", last ? "Vom Autor geändert" : "Fassung vor der Redaktion", title, summary, body, topics, it.updated || it.created || now()).first())?.id || 0;
}
// Der Autor speichert seinen Beitrag (/api/blog/save): gibt es schon einen Verlauf, gehoert seine neue Fassung hinein - sonst saehe die Redaktion noch ihre
// eigene Aenderung als aktuell und ein Zuruecksetzen wuerde die Arbeit des Autors spurlos ueberschreiben.
export async function noteAuthorSave(db, uid, post) {
  if (!(await db.prepare("SELECT 1 x FROM content_rev WHERE kind='blog' AND item_id=? LIMIT 1").bind(String(post.id)).first())) return 0;
  return recordBase(db, { ...post, ownerId: uid });
}
const entText = (d) => [d.name, d.desc?.en && "EN: " + d.desc.en, d.desc?.de && "DE: " + d.desc.de, d.long?.en && "\n" + d.long.en].filter(Boolean).join("\n");
const hv = (r) => ({ id: r.id, ts: r.ts, user: r.name || "", role: r.role || "", action: r.action || "edit", reason: r.reason || "", title: r.title || "", summary: r.summary || "", body: String(r.body || "").slice(0, 20000), status: r.status || "" });
// Rolle, in der eine Wiki-/Entitaeten-Revision geschrieben bzw. wieder live gesetzt wurde: aus dem Protokoll (Stand zum Zeitpunkt der Aenderung), nicht aus
// der heutigen Rolle des Verfassers. Ohne Eintrag war es ein Mitglied.
const revRole = async (db, kind, revId) => (await db.prepare("SELECT role FROM edit_log WHERE kind=? AND item_id=? AND action IN ('entity.edit_live','content.edit_full') AND undone=0 ORDER BY id DESC LIMIT 1").bind(kind, String(revId)).first())?.role || "user";
// Liefert { versions (neueste zuerst), current, ownerId, it } oder null. it = der Eintrag ohne Sichtpruefung (die Aufrufer pruefen: Redaktion ueber visible,
// der Autor ueber die Eigentuemerschaft).
export async function versionsOf(db, kind, id) {
  if (kind === "blog") {
    const it = await A.blog.load(db, +id); if (!it) return null;
    const rows = (await db.prepare("SELECT r.id,r.ts,r.role,r.action,r.reason,r.title,r.summary,r.body,r.topics,COALESCE(u.name,'') name FROM content_rev r LEFT JOIN users u ON u.id=r.user_id WHERE r.kind='blog' AND r.item_id=? ORDER BY r.id DESC LIMIT 30").bind(String(id)).all()).results || [];
    return { versions: rows.map(hv), current: rows[0]?.id || 0, ownerId: it.ownerId, it, synced: !rows.length || JSON.stringify(stateOf(rows[0])) === JSON.stringify(stateOf(it)) };
  }
  if (kind === "wiki" || kind === "entity") {
    const it = await A[kind].load(db, +id); if (!it) return null;
    const rows = kind === "wiki"
      ? (await db.prepare("SELECT r.id,r.created ts,r.status,r.summary reason,r.body,r.user_id,COALESCE(u.name,'') name FROM wiki_rev r LEFT JOIN users u ON u.id=r.user_id WHERE r.term=? AND r.lang=? ORDER BY r.created DESC,r.id DESC LIMIT 30").bind(it.term, it.lang).all()).results || []
      : (await db.prepare("SELECT r.id,r.created ts,r.status,r.summary reason,r.data,r.user_id,COALESCE(u.name,'') name FROM entity_rev r LEFT JOIN users u ON u.id=r.user_id WHERE r.eid=? ORDER BY r.created DESC,r.id DESC LIMIT 30").bind(it.eid).all()).results || [];
    const vs = [];
    for (const r of rows) { let d = {}; if (r.data) { try { d = JSON.parse(r.data); } catch { /* leer */ } } vs.push({ ...hv({ ...r, role: await revRole(db, kind, r.id), title: kind === "wiki" ? it.term : d.name || it.eid, body: r.data ? entText(d) : r.body, action: "edit" }), authorId: r.user_id }); }
    return { versions: vs, current: vs.find((v) => v.status === "live")?.id || 0, ownerId: it.ownerId, it, synced: true };
  }
  return null;
}
// Verlauf fuer die Redaktion: nur was der Akteur sehen darf (scoped=false: ohne Bereichsfilter - beim Zuruecksetzen nennt can() den Grund)
async function staffVersions(db, actor, kind, id, scoped = true) {
  const v = ["blog", "wiki", "entity"].includes(kind) ? await versionsOf(db, kind, id) : null; if (!v) return null;
  const ip = await itemPerm(db, v.it, kind);
  return visible(actor, kind, v.it) && (!scoped || inScope(actor, ip)) ? { ...v, ip } : null;
}

// Zuruecksetzen: Editor nur eine Redaktionsaenderung (die aktuelle Fassung wurde in der Rolle Editor geschrieben - Rolle zum Zeitpunkt der Aenderung), Admin
// jederzeit. seen = Fassung, die der Aufrufer als aktuell gesehen hat. Stimmt sie nicht mehr (der Autor oder jemand anderes hat inzwischen gespeichert),
// wird nichts ueberschrieben: 409 conflict mit der jetzt aktuellen Fassung; ein noch nicht erfasster Stand des Autors wird dabei im Verlauf festgehalten.
export async function revertTo(env, user, kind, id, revId, seen) {
  const db = env.DB, actor = await loadActor(db, user), role = roleOf(actor);
  if (role !== "admin" && role !== "editor") return { status: 403, body: { error: "forbidden" } };
  let v = await staffVersions(db, actor, kind, id, false);
  if (!v) return { status: 404, body: { error: "not_found" } };
  const perm = can(actor, "content.edit_full", v.ip);
  if (!perm.ok || perm.propose) return { status: 403, body: { error: perm.why || "forbidden" } };
  if (kind === "blog" && !v.synced && (await recordBase(db, v.it))) v = await staffVersions(db, actor, kind, id, false);
  const target = v.versions.find((x) => x.id === +revId);
  if (!target) return { status: 404, body: { error: "not_found" } };
  if (+seen !== v.current) return { status: 409, body: { error: "conflict", current: v.current } };
  if (target.id === v.current) return { status: 409, body: { error: "already_current" } };
  const cur = v.versions.find((x) => x.id === v.current);
  if (role !== "admin" && cur?.role !== "editor") return { status: 403, body: { error: "not_editor_edit" } };   // Editor: nur Redaktionsaenderungen zuruecknehmen
  const reason = `Zurückgesetzt auf Version #${target.id}`;
  let logItem = id;
  if (kind === "blog") {
    const tr = await db.prepare("SELECT title,summary,body,topics FROM content_rev WHERE id=?").bind(target.id).first();
    await db.prepare("UPDATE blog_posts SET title=?,summary=?,body=?,topics=?,updated=? WHERE id=?").bind(tr.title, tr.summary, tr.body, tr.topics, now(), +id).run();
    await recordRev(db, actor.id, role, v.it.id, tr, reason, "revert");
  } else {
    const t = kind === "wiki" ? "wiki_rev" : "entity_rev", cond = kind === "wiki" ? "term=? AND lang=?" : "eid=?", args = kind === "wiki" ? [v.it.term, v.it.lang] : [v.it.eid];
    const row = await db.prepare(`SELECT status,user_id FROM ${t} WHERE id=?`).bind(target.id).first();
    if (!row || row.status !== "old") return { status: 409, body: { error: "not_revertable" } };   // abgelehnte oder wartende Fassungen gehen nur ueber die Freigabe live
    if (role !== "admin" && row.user_id && Number(row.user_id) === Number(actor.id)) return { status: 403, body: { error: "own_content" } };   // nicht die eigene Fassung wieder live setzen
    await db.batch([db.prepare(`UPDATE ${t} SET status='old' WHERE ${cond} AND status='live'`).bind(...args), db.prepare(`UPDATE ${t} SET status='live' WHERE id=?`).bind(target.id)]);
    logItem = target.id;   // am Eintrag der jetzt live stehenden Revision: daraus liest revRole "von der Redaktion gesetzt"
  }
  const logId = await logEdit(db, actor, "content.edit_full", kind, logItem, { reason, before: { version: v.current }, after: { version: target.id } });
  if (role === "editor" && v.ownerId && kind === "blog") await notify(env, v.ownerId, "system", "Dein Beitrag wurde von der Redaktion bearbeitet", `<p>Die Redaktion hat deinen Beitrag „${esc(v.it.title)}“ auf eine frühere Fassung zurückgesetzt.</p>`, `edit:${logId}`);
  return { status: 200, body: { ok: true, log: logId } };
}

// Alte Routen /api/admin/(wiki|entity)/(approve|reject|restore)/<id>: eine wartende Fassung entscheidet decide(). Eine FRUEHERE Fassung wieder live setzen
// (Knopf "Wiederherstellen" im Verlauf der Wiki-Seite ruft dafuer approve) ist ein Zuruecksetzen und laeuft ueber revertTo - mit denselben Regeln wie im
// Versionsverlauf der Redaktion (can(), Fachbereich, nie die eigene Fassung, Editoren nur auf Redaktionsaenderungen) und mit Protokoll.
export async function legacyRev(env, user, kind, id, action) {
  const db = env.DB, t = kind === "wiki" ? "wiki_rev" : "entity_rev", r = await db.prepare(`SELECT * FROM ${t} WHERE id=?`).bind(+id).first();
  if (!r) return { status: 404, body: { error: "not_found" } };
  if (action !== "restore" && !(action === "approve" && r.status === "old")) return decide(env, user, { kind, id: String(+id), action, legacy: true });
  const live = kind === "wiki" ? await db.prepare("SELECT id FROM wiki_rev WHERE term=? AND lang=? AND status='live' ORDER BY id DESC LIMIT 1").bind(r.term, r.lang).first() : await db.prepare("SELECT id FROM entity_rev WHERE eid=? AND status='live' ORDER BY id DESC LIMIT 1").bind(r.eid).first();
  const out = await revertTo(env, user, kind, String(r.id), r.id, live?.id || 0);
  if (out.status === 200 && r.user_id) await evalBadges(env, r.user_id);
  return out;
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---- Pruefliste ----
async function queue(db, user, kind, lang) {
  const q = async (sql) => (await db.prepare(sql).all().catch(() => ({ results: [] }))).results || [];
  const items = [], want = (k) => !kind || kind === k;
  if (want("blog")) for (const r of await q("SELECT b.id,b.title,b.summary,b.topics,b.lang,b.created,b.user_id,u.name FROM blog_posts b JOIN users u ON u.id=b.user_id WHERE b.status='pending' ORDER BY b.created LIMIT 200")) items.push({ kind: "blog", id: String(r.id), title: r.title, excerpt: r.summary, lang: r.lang, created: r.created, author: r.name, authorId: r.user_id, topics: parseT(r.topics) });
  if (want("wiki")) for (const r of await q("SELECT r.id,r.term,r.lang,r.summary,r.body,r.created,r.user_id,COALESCE(u.name,'') name FROM wiki_rev r LEFT JOIN users u ON u.id=r.user_id WHERE r.status='pending' ORDER BY r.created LIMIT 200")) items.push({ kind: "wiki", id: String(r.id), title: `${r.term} (${r.lang})`, excerpt: r.summary || r.body.slice(0, 200), lang: r.lang, created: r.created, author: r.name, authorId: r.user_id, topics: [r.term] });
  if (want("entity")) for (const r of await q("SELECT r.id,r.eid,r.summary,r.created,r.user_id,COALESCE(u.name,'') name FROM entity_rev r LEFT JOIN users u ON u.id=r.user_id WHERE r.status='pending' ORDER BY r.created LIMIT 200")) items.push({ kind: "entity", id: String(r.id), title: r.eid, excerpt: r.summary, lang: "", created: r.created, author: r.name, authorId: r.user_id, topics: [r.eid] });
  if (want("cert")) for (const r of await q("SELECT k.user_id,k.eid,k.created,c.year,u.name FROM cert_check k JOIN certs c ON c.user_id=k.user_id AND c.eid=k.eid JOIN users u ON u.id=k.user_id WHERE k.status='pending' ORDER BY k.created LIMIT 200")) items.push({ kind: "cert", id: `${r.user_id}:${r.eid}`, title: r.eid + (r.year ? ` · ${r.year}` : ""), excerpt: "", lang: "", created: r.created, author: r.name, authorId: r.user_id, topics: [r.eid] });
  if (want("podcast")) for (const r of await q("SELECT e.id,e.title,e.description,e.topics,e.lang,e.created,e.user_id,u.name FROM pod_episodes e JOIN users u ON u.id=e.user_id WHERE e.status IN ('review','submitted') ORDER BY e.created LIMIT 200")) items.push({ kind: "podcast", id: String(r.id), title: r.title, excerpt: (r.description || "").slice(0, 200), lang: r.lang, created: r.created, author: r.name, authorId: r.user_id, topics: parseT(r.topics) });
  if (want("video")) for (const r of await q("SELECT e.id,e.title,e.description,e.topics,e.lang,e.created,e.user_id,u.name FROM yt_videos e JOIN users u ON u.id=e.user_id WHERE e.status IN ('review','submitted') ORDER BY e.created LIMIT 200")) items.push({ kind: "video", id: String(r.id), title: r.title, excerpt: (r.description || "").slice(0, 200), lang: r.lang, created: r.created, author: r.name, authorId: r.user_id, topics: parseT(r.topics) });
  if (want("comment")) for (const r of await q("SELECT c.id,c.lang,c.body,c.status,c.user_id,COALESCE(u.name,'') name,(SELECT COUNT(*) FROM reports x WHERE x.comment_id=c.id) n,(SELECT MIN(created) FROM reports x WHERE x.comment_id=c.id) created FROM comments c LEFT JOIN users u ON u.id=c.user_id WHERE c.id IN (SELECT comment_id FROM reports) AND c.status='ok' ORDER BY n DESC LIMIT 200")) items.push({ kind: "comment", id: String(r.id), title: `${r.n}× gemeldet`, excerpt: r.body.slice(0, 300), lang: r.lang, created: r.created, author: r.name, authorId: r.user_id });
  if (want("expert_report")) for (const r of await q("SELECT x.request_id,x.reply_id,MIN(x.created) created,COUNT(*) n,e.title,e.lang,e.user_id,COALESCE(rp.body,e.description) body FROM expert_request_reports x JOIN expert_requests e ON e.id=x.request_id LEFT JOIN expert_request_replies rp ON rp.id=x.reply_id WHERE e.status IN ('open','held') GROUP BY x.request_id,x.reply_id ORDER BY created LIMIT 200")) items.push({ kind: "expert_report", id: `${r.request_id}:${r.reply_id || 0}`, title: `${r.reply_id ? "Antwort" : "Anfrage"}: ${r.title} (${r.n}× gemeldet)`, excerpt: (r.body || "").slice(0, 300), lang: r.lang || "", created: r.created, author: "", authorId: r.user_id });
  const out = items.filter((x) => !lang || x.lang === lang).sort((a, b) => (a.created || 0) - (b.created || 0));
  const actor = await loadActor(db, user);
  const vis = out.filter((x) => inScope(actor, { topics: x.topics || [], lang: x.lang }));   // Fach-Editor: nur eigener Themenbereich; Eintraege ohne Thema nur fuer allgemeine Editoren
  out.length = 0; out.push(...vis);
  const orgs = new Map(), ids = [...new Set(out.map((x) => x.authorId).filter(Boolean))];   // Firmen aller Autoren in wenigen Abfragen (eigene Firma)
  for (let i = 0; i < ids.length; i += 80) for (const r of (await db.prepare(`SELECT user_id,org_id FROM org_members WHERE status='active' AND user_id IN (${ids.slice(i, i + 80).map(() => "?").join(",")})`).bind(...ids.slice(i, i + 80)).all().catch(() => ({ results: [] }))).results || []) orgs.set(r.user_id, [...(orgs.get(r.user_id) || []), r.org_id]);
  for (const x of out) {   // je Aktion: do | propose | no (fuer die Schaltflaechen); Eigentuemer/Firma wirken ueber can()
    const ip = { ownerId: x.authorId, orgIds: orgs.get(x.authorId) || [], topics: x.topics || [], lang: x.lang }; x.actions = {};
    for (const a of KIND_ACTIONS[x.kind]) { const p = can(actor, ACT[a], ip); x.actions[a] = modeOf(p); }
    x.own = actor.id === x.authorId;
  }
  return out;
}

const history = async (db, kind, id) => (await db.prepare("SELECT l.id,l.ts,l.role,l.action,l.reason,l.undone,COALESCE(u.name,'') name FROM edit_log l LEFT JOIN users u ON u.id=l.user_id WHERE l.kind=? AND l.item_id=? ORDER BY l.ts DESC LIMIT 20").bind(kind, String(id)).all().catch(() => ({ results: [] }))).results || [];

export async function itemView(env, user, kind, id) {
  const db = env.DB, actor = await loadActor(db, user), f = await lookup(db, actor, kind, id); if (!f || !inScope(actor, f.ip)) return null;
  const it = f.it, actions = {};
  for (const a of KIND_ACTIONS[kind]) actions[a] = modeOf(can(actor, ACT[a], f.ip));
  const props = (await db.prepare("SELECT id,ts,role,action,reason,status FROM edit_proposals WHERE kind=? AND item_id=? ORDER BY ts DESC LIMIT 10").bind(kind, String(id)).all()).results || [];
  const edit = kind === "blog" && !(it.html && !it.body) ? { minor: modeOf(can(actor, "content.edit_minor", f.ip)), full: modeOf(can(actor, "content.edit_full", f.ip)) } : null;
  // body = Vorschau (gekuerzt, bei uebernommenen Beitraegen ersatzweise die Zusammenfassung); edit = alles, was das Bearbeiten-Formular braucht: der GANZE
  // Text (nie die Vorschau), die Themen und base = Stand beim Laden, den /api/editor/edit zurueckerwartet
  return { kind, id: String(id), title: it.title || "", body: String(it.body || it.summary || "").slice(0, 4000), summary: it.summary || "", lang: it.lang || "", status: it.status || "", author: it.name || "", handle: it.handle || "", authorId: it.ownerId || null,
    source: { created: it.created || 0, lang: it.lang || "", kind }, history: await history(db, kind, id), proposals: props, actions, editable: !!edit && (edit.minor !== "no" || edit.full !== "no"),
    ...(edit && (edit.minor !== "no" || edit.full !== "no") ? { edit: { ...edit, title: it.title || "", summary: it.summary || "", body: String(it.body || ""), topics: parseT(it.topics), base: await baseOf(it), max: MAX_BODY } } : {}) };
}

export async function listProposals(db, status = "open") {
  return (await db.prepare("SELECT p.id,p.ts,p.user_id,p.role,p.action,p.kind,p.item_id,p.reason,p.payload,p.status,COALESCE(u.name,'') name FROM edit_proposals p LEFT JOIN users u ON u.id=p.user_id WHERE p.status=? ORDER BY p.ts LIMIT 200").bind(status).all()).results || [];
}
// Rechte am Eintrag einer Empfehlung: Sprachfassungen ueber die Sprache, sonst ueber den Eintrag (null = Eintrag gibt es nicht mehr)
async function proposalPerm(db, actor, p) {
  if (p.kind === "i18n") return can(actor, "content.edit_full", { ownerId: null, orgIds: [], topics: [], lang: String(p.item_id).split("|")[2] || "", i18n: true });
  const it = A[p.kind] ? await load(db, p.kind, p.item_id) : null; if (!it) return null;
  const inv = Object.entries(ACT).find(([, v]) => v === p.action)?.[0];
  return can(actor, p.action.startsWith("content.edit") ? p.action : inv && inv !== "escalate" ? p.action : "review.reject", await itemPerm(db, it, p.kind));
}
// Offene Empfehlungen und Eskalationen, wie der Akteur sie sieht: can = darf bestaetigen/verwerfen. Eskalationen "an den Admin" schliesst nur der Admin.
async function proposalsFor(db, user, status = "open") {
  const actor = await loadActor(db, user), out = [];
  for (const p of await listProposals(db, status)) {
    const esc = p.action === "review.escalate", perm = esc ? can(actor, "escalation.close") : await proposalPerm(db, actor, p);
    if (perm && !perm.ok && perm.why === "out_of_scope") continue;   // Fach-Editor: ausserhalb des eigenen Bereichs
    const { user_id, ...pub } = p;
    out.push({ ...pub, can: status === "open" && roleOf(actor) !== "moderator" && (roleOf(actor) === "admin" || (user_id !== actor.id && (!perm || (perm.ok && !perm.propose)))) });
  }
  return out;
}

async function settleProposal(env, user, pid, confirm) {
  const db = env.DB, p = await db.prepare("SELECT * FROM edit_proposals WHERE id=? AND status='open'").bind(pid).first();
  if (!p) return { status: 404, body: { error: "not_found" } };
  const actor = await loadActor(db, user), role = roleOf(actor), esc = p.action === "review.escalate";
  if (role !== "editor" && role !== "admin") return { status: 403, body: { error: "forbidden" } };
  if (p.user_id === actor.id && role !== "admin") return { status: 403, body: { error: "own_content" } };
  if (esc) {   // Eskalation an den Admin: wird erledigt, nicht ausgefuehrt - und nur vom Admin (sonst koennte der Betroffene sie selbst schliessen)
    if (confirm) return { status: 400, body: { error: "unsupported" } };
    const pe = can(actor, "escalation.close"); if (!pe.ok) return { status: 403, body: { error: pe.why } };
  } else if (!confirm) {   // Verwerfen ist eine Entscheidung ueber den Eintrag: eigener Inhalt, eigene Firma und Fachbereich gelten wie beim Ablehnen
    const pe = await proposalPerm(db, actor, p);
    if (pe && (!pe.ok || pe.propose)) return { status: 403, body: { error: pe.why || "forbidden" } };
  }
  let res = { status: 200, body: { ok: true } };
  if (confirm) {
    const inv = Object.entries(ACT).find(([, v]) => v === p.action)?.[0];
    if (p.kind === "i18n") res = await runProposal(env, actor, p);
    else if (p.action.startsWith("content.edit")) { let pl = {}; try { pl = JSON.parse(p.payload || "{}"); } catch { pl = {}; } res = await editItem(env, actor, { kind: p.kind, id: p.item_id, level: pl.level, fields: pl.fields && typeof pl.fields === "object" ? pl.fields : {}, base: pl.base || "", reason: p.reason, viaProposal: p.id }); }
    else if (inv) res = await decide(env, actor, { kind: p.kind, id: p.item_id, action: inv, reason: p.reason || "Empfehlung bestaetigt", viaProposal: p.id });
    else res = { status: 400, body: { error: "unsupported" } };
    if (res.status !== 200 || res.body?.proposed) return res.status === 200 ? { status: 403, body: { error: "forbidden" } } : res;
  }
  await db.prepare("UPDATE edit_proposals SET status=?,decided_by=?,decided_ts=? WHERE id=? AND status='open'").bind(confirm ? "executed" : "dismissed", actor.id, now(), pid).run();
  if (!confirm) await logEdit(db, actor, esc ? "escalation.close" : "proposal.dismiss", p.kind, p.item_id, { reason: `${esc ? "Eskalation" : "Empfehlung"} #${p.id} verworfen (${p.action})` });   // jede Erledigung steht im Protokoll
  return res;
}

// Rueckgaengig (Admin): hide/approve/reject anhand des protokollierten Zustands davor - aber nur, solange der Eintrag noch im protokollierten Zustand danach
// ist. Hat inzwischen jemand weiterentschieden (z. B. eine spaetere Freigabe steht live), wird nichts angefasst: 409 state_changed.
const UNDOABLE = ["review.approve", "review.reject", "review.hide", "report.resolve"];
export async function undoLog(env, user, id) {
  const db = env.DB;
  const perm = can(await loadActor(db, user), "admin.undo"); if (!perm.ok) return { status: 403, body: { error: perm.why } };
  const row = await db.prepare("SELECT * FROM edit_log WHERE id=?").bind(id).first();
  if (!row) return { status: 404, body: { error: "not_found" } };
  if (row.undone) return { status: 409, body: { error: "already_undone" } };
  if (!UNDOABLE.includes(row.action) || !A[row.kind]?.undo) return { status: 400, body: { error: "not_undoable" } };
  let b = {}, a = {}; try { b = JSON.parse(row.before || "{}"); a = JSON.parse(row.after || "{}"); } catch { /* leer */ }
  if (!(await A[row.kind].undo(env, b || {}, row.kind === "cert" || row.kind === "expert_report" ? row.item_id : +row.item_id, a || {}))) return { status: 409, body: { error: "state_changed" } };
  await db.prepare("UPDATE edit_log SET undone=1 WHERE id=?").bind(id).run();
  await logEdit(db, user, "admin.undo", row.kind, row.item_id, { reason: `Rückgängig: #${id} ${row.action}`, before: row.after, after: row.before });
  return { status: 200, body: { ok: true } };
}

// Konto loeschen (index.js deleteAccount, VOR deleteUserBlog): alles Persoenliche aus den Tabellen der Redaktion entfernen, den Rest anonymisieren.
// Weg: Bewerbungen (mit Motivation) samt Stimmen, eigene Stimmen, Fachbereich, offene eigene Empfehlungen, Verlauf/Empfehlungen/Textauszuege zu den
// eigenen Beitraegen, Zertifikats-Eintraege (die Nutzer-ID steht in item_id). Anonymisiert (user_id 0): Protokoll, erledigte Empfehlungen, Fassungen an
// fremden Beitraegen, Handtexte der Sprachfassungen, Wuensche; Melder-IDs in protokollierten Meldungen.
export async function deleteUserEditorial(db, id) {
  const mine = "(SELECT CAST(id AS TEXT) FROM blog_posts WHERE user_id=?)", cert = `${id}:%`;
  for (const r of (await db.prepare("SELECT id,before FROM edit_log WHERE action='report.resolve' AND before LIKE '%\"reports\"%'").all().catch(() => ({ results: [] }))).results || []) {
    let b = null; try { b = JSON.parse(r.before); } catch { b = null; }
    if (!b || !Array.isArray(b.reports) || !b.reports.some((x) => Array.isArray(x) && Number(x[0]) === Number(id))) continue;
    await db.prepare("UPDATE edit_log SET before=? WHERE id=?").bind(JSON.stringify({ ...b, reports: b.reports.map((x) => (Array.isArray(x) && Number(x[0]) === Number(id) ? [0, ...x.slice(1)] : x)) }), r.id).run();
  }
  await db.batch([
    db.prepare("DELETE FROM editor_votes WHERE voter_id=? OR app_id IN (SELECT id FROM editor_applications WHERE user_id=?)").bind(id, id),
    db.prepare("DELETE FROM editor_applications WHERE user_id=?").bind(id), db.prepare("UPDATE editor_applications SET decided_by=NULL WHERE decided_by=?").bind(id),
    db.prepare("DELETE FROM editor_scope WHERE user_id=?").bind(id),
    db.prepare(`DELETE FROM content_rev WHERE kind='blog' AND item_id IN ${mine}`).bind(id), db.prepare("UPDATE content_rev SET user_id=0 WHERE user_id=?").bind(id),
    db.prepare(`DELETE FROM edit_proposals WHERE (user_id=? AND status='open') OR (kind='blog' AND item_id IN ${mine}) OR (kind='cert' AND item_id LIKE ?)`).bind(id, id, cert),
    db.prepare("UPDATE edit_proposals SET user_id=0 WHERE user_id=?").bind(id), db.prepare("UPDATE edit_proposals SET decided_by=NULL WHERE decided_by=?").bind(id),
    db.prepare(`UPDATE edit_log SET before='',after='' WHERE kind='blog' AND item_id IN ${mine}`).bind(id),
    db.prepare("UPDATE edit_log SET item_id='0:'||substr(item_id,instr(item_id,':')+1) WHERE kind='cert' AND item_id LIKE ?").bind(cert),
    db.prepare("UPDATE edit_log SET item_id='0' WHERE kind='user' AND item_id=?").bind(String(id)),
    db.prepare("UPDATE edit_log SET user_id=0 WHERE user_id=?").bind(id),
    db.prepare("UPDATE i18n_override SET \"by\"=0 WHERE \"by\"=?").bind(id), db.prepare("UPDATE i18n_override_rev SET user_id=0 WHERE user_id=?").bind(id), db.prepare("UPDATE i18n_retranslate_req SET \"by\"=0 WHERE \"by\"=?").bind(id),
  ]);
}
// Ein einzelner Beitrag wird geloescht (/api/blog/delete): sein Verlauf und die Empfehlungen dazu gehen mit, Textauszuege im Protokoll werden geleert
export const dropBlogHistory = (db, postId) => db.batch([
  db.prepare("DELETE FROM content_rev WHERE kind='blog' AND item_id=?").bind(String(postId)), db.prepare("DELETE FROM edit_proposals WHERE kind='blog' AND item_id=?").bind(String(postId)),
  db.prepare("UPDATE edit_log SET before='',after='' WHERE kind='blog' AND item_id=?").bind(String(postId)),
]);

export async function handleEditor(env, request, url, path, user, J) {
  const db = env.DB, method = request.method, NS = { "cache-control": "no-store" }, R = (r) => J(r.body, r.status, NS);
  const body = async () => await request.json().catch(() => ({}));
  if (path.startsWith("/api/admin/editlog") || path.startsWith("/api/admin/editor-scope")) {
    let m;
    if ((m = /^\/api\/admin\/editlog\/undo\/(\d+)$/.exec(path)) && method === "POST") return R(await undoLog(env, user, +m[1]));   // can(admin.undo)
    if (!can(user, "role.assign").ok) return J({ error: "forbidden" }, 403, NS);   // Protokoll und Fachbereiche: nur Admin
    if (path === "/api/admin/editlog" && method === "GET") {
      const lim = Math.min(+url.searchParams.get("limit") || 100, 300), kind = url.searchParams.get("kind") || "", who = +url.searchParams.get("user") || 0;
      const rows = (await db.prepare("SELECT l.id,l.ts,l.user_id,l.role,l.action,l.kind,l.item_id,l.reason,l.before,l.after,l.undone,COALESCE(u.name,'') name FROM edit_log l LEFT JOIN users u ON u.id=l.user_id WHERE (?='' OR l.kind=?) AND (?=0 OR l.user_id=?) ORDER BY l.id DESC LIMIT ?").bind(kind, kind, who, who, lim).all()).results || [];
      const wishes = (await db.prepare("SELECT kind,COUNT(*) n FROM i18n_retranslate_req WHERE status='open' GROUP BY kind").all().catch(() => ({ results: [] }))).results || [];   // offene Wuensche "neu uebersetzen": abgeholt werden sie nur von einem von Hand gestarteten Lauf (--stale --wishes)
      return J({ items: rows.map((r) => ({ ...r, undoable: !r.undone && UNDOABLE.includes(r.action) })), proposals: await listProposals(db, "open"), wishes: Object.fromEntries(wishes.map((w) => [w.kind, w.n])) }, 200, NS);
    }
    if ((m = /^\/api\/admin\/editor-scope\/(\d+)$/.exec(path)) && (method === "GET" || method === "POST")) {   // Fach-Editor setzen/aufheben; Themen kommen automatisch aus bestaetigter Expertise
      const uid = +m[1];
      if (method === "POST") {
        const b = await body();
        if (!b.subject) await db.prepare("DELETE FROM editor_scope WHERE user_id=?").bind(uid).run();
        else await db.prepare("INSERT INTO editor_scope(user_id,topics,langs,updated) VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET topics=excluded.topics,langs=excluded.langs,updated=excluded.updated")
          .bind(uid, JSON.stringify((Array.isArray(b.topics) ? b.topics : []).map((x) => txt(x, 60)).filter(Boolean).slice(0, 30)), JSON.stringify((Array.isArray(b.langs) ? b.langs : []).map((x) => txt(x, 5)).filter(Boolean).slice(0, 20)), now()).run();
        await logEdit(db, user, "admin.scope", "user", uid, { reason: b.subject ? "Fach-Editor" : "allgemeiner Editor" });
      }
      const sc = await scopeOf(db, uid);
      return J({ subject: !!sc, auto: sc?.auto || [], extra: sc?.extra || [], langs: sc ? [...sc.langs] : [] }, 200, NS);
    }
    return J({ error: "not_found" }, 404, NS);
  }
  // Bewerbung und eigener Verlauf: fuer jedes angemeldete Mitglied
  if (path === "/api/editor/apply" || path === "/api/editor/my-history") {
    if (!user) return J({ error: "login" }, 401, NS);
    if (path === "/api/editor/apply" && method === "GET") return J({ items: await myApplications(db, user.id), needed: NEEDED }, 200, NS);
    if (path === "/api/editor/apply" && method === "POST") return R(await applyForRole(env, user, await body()));
    if (method === "GET") {   // Autor sieht den Verlauf des eigenen Eintrags (Blog) bzw. der eigenen Wiki-/Entitaeten-Aenderungen
      const kind = url.searchParams.get("kind") || "", v = ["blog", "wiki", "entity"].includes(kind) ? await versionsOf(db, kind, url.searchParams.get("id") || "") : null;
      if (!v || (kind === "blog" ? v.ownerId !== user.id : !v.versions.some((x) => x.authorId === user.id))) return J({ error: "not_found" }, 404, NS);
      return J({ versions: v.versions.map(({ authorId, ...x }) => x), current: v.current }, 200, NS);
    }
  }
  if (!can(user, "queue.view").ok) return J({ error: user ? "forbidden" : "login" }, user ? 403 : 401, NS);   // ab hier nur Redaktion/Moderation; jede Route fragt can() fuer ihre Aktion
  const role = roleOf(user);
  if (path === "/api/editor/queue" && method === "GET") {
    const kind = url.searchParams.get("kind") || "", lang = url.searchParams.get("lang") || "";
    if (kind && !KINDS.includes(kind)) return J({ error: "bad_request" }, 400, NS);
    const sc = role === "editor" ? await scopeOf(db, user.id) : null;
    return J({ role, scope: sc ? { subject: true, topics: [...sc.topics], auto: sc.auto, extra: sc.extra, langs: [...sc.langs] } : { subject: false }, kinds: KINDS, modKinds: [...MOD_KINDS], items: await queue(db, user, kind, lang), proposals: role === "moderator" ? [] : await proposalsFor(db, user) }, 200, NS);
  }
  if (path === "/api/editor/item" && method === "GET") {
    const kind = url.searchParams.get("kind") || "", v = A[kind] ? await itemView(env, user, kind, url.searchParams.get("id") || "") : null;
    return v ? J({ item: v }, 200, NS) : J({ error: "not_found" }, 404, NS);
  }
  if (path === "/api/editor/decide" && method === "POST") { const b = await body(); return R(await decide(env, user, { kind: String(b.kind || ""), id: String(b.id || ""), action: String(b.action || ""), reason: txt(b.reason, 300) })); }
  if (path === "/api/editor/edit" && method === "POST") { const b = await body(); return R(await editItem(env, user, { kind: String(b.kind || ""), id: String(b.id || ""), level: b.level === "full" ? "full" : "minor", fields: b.fields && typeof b.fields === "object" && !Array.isArray(b.fields) ? b.fields : {}, base: String(b.base || ""), reason: txt(b.reason, 300) })); }
  if (path === "/api/editor/proposals" && method === "GET") return J({ proposals: role === "moderator" ? [] : await proposalsFor(db, user, url.searchParams.get("status") === "done" ? "executed" : "open") }, 200, NS);
  if (path.startsWith("/api/editor/i18n/")) {   // Sprachfassungen: Einheit speichern, Verlauf, Zuruecksetzen, neu uebersetzen vormerken
    const q = (k) => url.searchParams.get(k) || "";
    if (path === "/api/editor/i18n/overrides" && method === "GET") return J({ overrides: await currentOverrides(db, q("kind"), q("item"), q("lang")), anchors: await overrideAnchors(db, q("kind"), q("item"), q("lang")), wish: await openWishes(db, q("kind"), q("item"), q("lang")) }, 200, NS);
    if (path === "/api/editor/i18n/history" && method === "GET") {
      const h = await unitHistory(db, q("kind"), q("item"), q("lang"), q("unit")), actor = await loadActor(db, user), perm = can(actor, "content.edit_full", { ownerId: null, orgIds: [], topics: [], lang: q("lang"), i18n: true });
      return J({ ...h, canRevert: perm.ok && !perm.propose }, 200, NS);
    }
    const b = method === "POST" ? await body() : {};
    if (path === "/api/editor/i18n/save" && method === "POST") return R(await saveUnit(env, user, { kind: String(b.kind || ""), item: String(b.item || ""), lang: String(b.lang || ""), unit: String(b.unit || ""), text: b.text, prev: b.prev, sh: String(b.sh || ""), reason: txt(b.reason, 300) }));
    if (path === "/api/editor/i18n/revert" && method === "POST") return R(await revertUnit(env, user, { kind: String(b.kind || ""), item: String(b.item || ""), lang: String(b.lang || ""), unit: String(b.unit || ""), rev: b.rev, cur: b.cur }));
    if (path === "/api/editor/i18n/retranslate" && method === "POST") return R(await requestRetranslate(env, user, { kind: String(b.kind || ""), item: String(b.item || ""), lang: String(b.lang || ""), units: b.units }));
    return J({ error: "not_found" }, 404, NS);
  }
  if (path === "/api/editor/history" && method === "GET") {
    const actor = await loadActor(db, user), kind = url.searchParams.get("kind") || "", v = await staffVersions(db, actor, kind, url.searchParams.get("id") || "");
    if (!v) return J({ error: "not_found" }, 404, NS);
    const perm = can(actor, "content.edit_full", v.ip);
    return J({ versions: v.versions.map(({ authorId, ...x }) => x), current: v.current, canRevert: perm.ok && !perm.propose }, 200, NS);
  }
  if (path === "/api/editor/revert" && method === "POST") { const b = await body(); return R(await revertTo(env, user, String(b.kind || ""), String(b.id || ""), b.rev, b.cur)); }
  if (path === "/api/editor/applications" && method === "GET") return can(user, "role.vote").ok ? J({ items: await listApplications(db, user) }, 200, NS) : J({ error: "forbidden" }, 403, NS);
  let m;
  if ((m = /^\/api\/editor\/applications\/(\d+)\/(confirm|reject|override)$/.exec(path)) && method === "POST") return R(await decideApplication(env, user, +m[1], m[2], await body()));
  if ((m = /^\/api\/editor\/proposals\/(\d+)\/(confirm|dismiss)$/.exec(path)) && method === "POST") return R(await settleProposal(env, user, +m[1], m[2] === "confirm"));
  return J({ error: "not_found" }, 404, NS);
}
export { emailFor };
