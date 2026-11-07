// Redaktion und Moderation (Stufe 1): gemeinsame Pruefliste ueber die bestehenden Warteschlangen, Entscheidungen ueber can() (perm.js), Protokoll, Empfehlungen, Undo.
// Routen: /api/editor/* (Redakteure, Moderatoren, Admin) und /api/admin/editlog* (nur Admin). Die alten /api/admin/*-Routen rufen decide() auf.
import { can, roleOf, isStaff, loadActor, logEdit, emailFor, scopeOf } from "./perm.js";
import { evalBadges } from "./badges.js";
import { notify } from "./mail.js";
import { saveUnit, unitHistory, revertUnit, requestRetranslate, currentOverrides, runProposal, I18N_KINDS, LANGS as I18N_LANGS } from "./i18n_edit.js";
import { applyForRole, myApplications, listApplications, decideApplication, NEEDED } from "./roles.js";
import { handlePodcast } from "./podcast.js";
import { handleVideo } from "./youtube.js";

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
const orgIdsOf = async (db, uid) => uid ? ((await db.prepare("SELECT org_id FROM org_members WHERE user_id=? AND status='active'").bind(uid).all().catch(() => ({ results: [] }))).results || []).map((r) => r.org_id) : [];

// ---- Adapter je Art: load (Eigentuemer, Status, Vorschau), Aktionen mit before/after fuer das Protokoll, undo ----
const A = {
  blog: {
    async load(db, id) { const r = await db.prepare("SELECT b.id,b.user_id,b.title,b.summary,b.body,b.lang,b.status,b.slug,b.published,b.created,b.topics,COALESCE(u.name,'') name,p.handle FROM blog_posts b LEFT JOIN users u ON u.id=b.user_id LEFT JOIN profiles p ON p.user_id=b.user_id WHERE b.id=?").bind(id).first(); return r && { ...r, ownerId: r.user_id, pending: r.status === "pending" }; },
    async approve(env, it) { await env.DB.prepare("UPDATE blog_posts SET status='live',published=COALESCE(NULLIF(published,0),?),note='',updated=? WHERE id=?").bind(now(), now(), it.id).run(); return { before: { status: it.status, published: it.published }, after: { status: "live" } }; },
    async reject(env, it, reason) { await env.DB.prepare("UPDATE blog_posts SET status='rejected',note=?,updated=? WHERE id=?").bind(txt(reason, 300), now(), it.id).run(); return { before: { status: it.status, published: it.published }, after: { status: "rejected" } }; },
    async undo(env, b, id) { await env.DB.prepare("UPDATE blog_posts SET status=?,published=?,updated=? WHERE id=?").bind(b.status || "pending", b.published || 0, now(), id).run(); },
  },
  wiki: {
    async load(db, id) { const r = await db.prepare("SELECT r.id,r.term,r.lang,r.body,r.summary,r.status,r.user_id,r.created,COALESCE(u.name,'') name FROM wiki_rev r LEFT JOIN users u ON u.id=r.user_id WHERE r.id=?").bind(id).first(); return r && { ...r, title: `${r.term} (${r.lang})`, ownerId: r.user_id || null, pending: r.status === "pending" }; },
    async approve(env, it) {
      const db = env.DB, prev = await db.prepare("SELECT id FROM wiki_rev WHERE term=? AND lang=? AND status='live'").bind(it.term, it.lang).first();
      await db.batch([db.prepare("UPDATE wiki_rev SET status='old' WHERE term=? AND lang=? AND status='live'").bind(it.term, it.lang), db.prepare("UPDATE wiki_rev SET status='live' WHERE id=?").bind(it.id)]);
      if (it.user_id) await evalBadges(env, it.user_id); return { before: { status: it.status, prevLive: prev?.id || 0 }, after: { status: "live" } };
    },
    async reject(env, it) { await env.DB.prepare("UPDATE wiki_rev SET status='rejected' WHERE id=?").bind(it.id).run(); return { before: { status: it.status }, after: { status: "rejected" } }; },
    async undo(env, b, id) { const db = env.DB; await db.prepare("UPDATE wiki_rev SET status=? WHERE id=?").bind(b.status || "pending", id).run(); if (b.prevLive) await db.prepare("UPDATE wiki_rev SET status='live' WHERE id=?").bind(b.prevLive).run(); },
  },
  entity: {
    async load(db, id) { const r = await db.prepare("SELECT r.id,r.eid,r.data,r.summary,r.status,r.user_id,r.created,COALESCE(u.name,'') name FROM entity_rev r LEFT JOIN users u ON u.id=r.user_id WHERE r.id=?").bind(id).first(); let d = {}; try { d = JSON.parse(r?.data || "{}"); } catch { /* leer */ } return r && { ...r, title: d.name || r.eid, body: ((d.desc || {}).en || (d.desc || {}).de || ""), ownerId: r.user_id || null, pending: r.status === "pending" }; },
    async approve(env, it) {
      const db = env.DB, prev = await db.prepare("SELECT id FROM entity_rev WHERE eid=? AND status='live'").bind(it.eid).first();
      await db.batch([db.prepare("UPDATE entity_rev SET status='old' WHERE eid=? AND status='live'").bind(it.eid), db.prepare("UPDATE entity_rev SET status='live' WHERE id=?").bind(it.id)]);
      if (it.user_id) await evalBadges(env, it.user_id); return { before: { status: it.status, prevLive: prev?.id || 0 }, after: { status: "live" } };
    },
    async reject(env, it) { await env.DB.prepare("UPDATE entity_rev SET status='rejected' WHERE id=?").bind(it.id).run(); return { before: { status: it.status }, after: { status: "rejected" } }; },
    async undo(env, b, id) { const db = env.DB; await db.prepare("UPDATE entity_rev SET status=? WHERE id=?").bind(b.status || "pending", id).run(); if (b.prevLive) await db.prepare("UPDATE entity_rev SET status='live' WHERE id=?").bind(b.prevLive).run(); },
  },
  cert: {
    async load(db, id) { const [uid, eid] = String(id).split(":"); const r = await db.prepare("SELECT c.user_id,c.eid,c.year,c.url,k.status,k.created,u.name FROM cert_check k JOIN certs c ON c.user_id=k.user_id AND c.eid=k.eid JOIN users u ON u.id=c.user_id WHERE k.user_id=? AND k.eid=?").bind(+uid, eid || "").first(); return r && { ...r, id, title: `${r.eid}${r.year ? " · " + r.year : ""}`, body: r.url || "", ownerId: r.user_id, pending: r.status === "pending" }; },
    async approve(env, it) { await env.DB.prepare("UPDATE cert_check SET status='verified',via='editor',created=? WHERE user_id=? AND eid=?").bind(now(), it.user_id, it.eid).run(); return { before: { status: it.status }, after: { status: "verified" } }; },
    async reject(env, it) { await env.DB.prepare("UPDATE cert_check SET status='rejected',via='editor',created=? WHERE user_id=? AND eid=?").bind(now(), it.user_id, it.eid).run(); return { before: { status: it.status }, after: { status: "rejected" } }; },
    async undo(env, b, id) { const [uid, eid] = String(id).split(":"); await env.DB.prepare("UPDATE cert_check SET status=? WHERE user_id=? AND eid=?").bind(b.status || "pending", +uid, eid).run(); },
  },
  comment: {
    async load(db, id) { const r = await db.prepare("SELECT c.id,c.vid,c.lang,c.body,c.status,c.user_id,c.created,COALESCE(u.name,'') name,(SELECT COUNT(*) FROM reports x WHERE x.comment_id=c.id) reports FROM comments c LEFT JOIN users u ON u.id=c.user_id WHERE c.id=?").bind(id).first(); return r && { ...r, title: `${r.reports}× gemeldet`, ownerId: r.user_id, pending: true }; },
    async hide(env, it) { await env.DB.prepare("UPDATE comments SET status='hidden' WHERE id=?").bind(it.id).run(); return { before: { status: it.status }, after: { status: "hidden" } }; },
    async resolve(env, it) { const rows = (await env.DB.prepare("SELECT user_id,created FROM reports WHERE comment_id=?").bind(it.id).all()).results || []; await env.DB.prepare("DELETE FROM reports WHERE comment_id=?").bind(it.id).run(); return { before: { reports: rows.map((r) => [r.user_id, r.created]) }, after: { reports: 0 } }; },
    async undo(env, b, id) { const db = env.DB; if (b.status) await db.prepare("UPDATE comments SET status=? WHERE id=?").bind(b.status, id).run(); for (const [u, c] of b.reports || []) await db.prepare("INSERT OR IGNORE INTO reports(comment_id,user_id,created) VALUES(?,?,?)").bind(id, u, c).run(); },
  },
  expert_report: {   // Meldungen zu Publisher-Anfragen/Antworten: erledigen = Meldungen verwerfen; Entfernen/Schliessen bleibt beim Admin
    async load(db, id) { const [rid, rep] = String(id).split(":").map(Number); const r = await db.prepare("SELECT e.id,e.title,e.description,e.status,e.user_id,e.lang,(SELECT COUNT(*) FROM expert_request_reports x WHERE x.request_id=e.id AND x.reply_id=?) reports,(SELECT body FROM expert_request_replies WHERE id=?) reply FROM expert_requests e WHERE e.id=?").bind(rep || 0, rep || 0, rid).first().catch(() => null); return r && { ...r, id, body: r.reply || r.description || "", ownerId: r.user_id, name: "", pending: r.reports > 0, rid, rep: rep || 0 }; },
    async resolve(env, it) { const rows = (await env.DB.prepare("SELECT user_id,reason,created FROM expert_request_reports WHERE request_id=? AND reply_id=?").bind(it.rid, it.rep).all()).results || []; await env.DB.prepare("DELETE FROM expert_request_reports WHERE request_id=? AND reply_id=?").bind(it.rid, it.rep).run(); return { before: { reports: rows.map((r) => [r.user_id, r.reason, r.created]) }, after: { reports: 0 } }; },
    async undo(env, b, id) { const [rid, rep] = String(id).split(":").map(Number); for (const [u, rs, c] of b.reports || []) await env.DB.prepare("INSERT OR IGNORE INTO expert_request_reports(request_id,user_id,reply_id,reason,created) VALUES(?,?,?,?,?)").bind(rid, u, rep || 0, rs || "", c || 0).run(); },
  },
};
for (const k of ["podcast", "video"]) A[k] = {   // Ablehnen laeuft ueber die bestehende Admin-Route (entfernt auch den Entwurf bei Spreaker/YouTube)
  async load(db, id) { const t = k === "podcast" ? "pod_episodes" : "yt_videos"; const r = await db.prepare(`SELECT e.id,e.title,e.description,e.topics,e.lang,e.status,e.user_id,e.created,COALESCE(u.name,'') name FROM ${t} e LEFT JOIN users u ON u.id=e.user_id WHERE e.id=?`).bind(id).first(); return r && { ...r, body: r.description, ownerId: r.user_id, pending: ["review", "submitted"].includes(r.status) }; },
  async reject(env, it, reason, user) {
    const path = `/api/admin/${k}/reject`, J = (d, s = 200) => new Response(JSON.stringify(d), { status: s });
    const res = await (k === "podcast" ? handlePodcast : handleVideo)(env, new Request("https://x" + path, { method: "POST", body: JSON.stringify({ id: it.id, note: reason }) }), new URL("https://x" + path), path, { ...user, admin: true, _viaEditor: true }, J);
    if (!res || res.status !== 200) throw Object.assign(new Error("reject_failed"), { code: "server" });
    return { before: { status: it.status }, after: { status: "rejected" } };
  },
};

const lookup = async (db, kind, id) => (A[kind] ? await A[kind].load(db, kind === "cert" || kind === "expert_report" ? String(id) : +id) : null);
const itemPerm = async (db, it, kind) => ({ ownerId: it.ownerId, orgIds: it.ownerId ? await orgIdsOf(db, it.ownerId) : [], topics: topicsOf(kind, it), lang: it.lang || "" });
const modeOf = (p) => (p.ok ? (p.propose ? "propose" : "do") : "no");

// ---- Entscheidung: ausfuehren oder als Empfehlung speichern ----
export async function decide(env, user, { kind, id, action, reason = "", viaProposal = 0, legacy = false }) {
  const db = env.DB;
  if (!A[kind] || !KIND_ACTIONS[kind].includes(action)) return { status: 400, body: { error: "unsupported" } };
  const actor = await loadActor(db, user), it = await lookup(db, kind, id);
  if (!it) return { status: 404, body: { error: "not_found" } };
  const perm = can(actor, ACT[action], await itemPerm(db, it, kind));
  if (!perm.ok) return { status: 403, body: { error: perm.why } };
  if (action === "reject" && !legacy && !txt(reason, 300) && roleOf(actor) !== "admin") return { status: 400, body: { error: "reason_required" } };
  if (action === "escalate" || perm.propose) {   // Eskalation und Moderator-Empfehlungen: nur gespeichert
    const pid = (await db.prepare("INSERT INTO edit_proposals(ts,user_id,role,action,kind,item_id,reason) VALUES(?,?,?,?,?,?,?) RETURNING id").bind(now(), actor.id, roleOf(actor), ACT[action], kind, String(id), txt(reason, 300)).first())?.id;
    if (action === "escalate") await logEdit(db, actor, ACT[action], kind, id, { reason });
    return { status: 200, body: { ok: true, proposed: true, proposal: pid } };
  }
  if (!A[kind][action]) return { status: 400, body: { error: "unsupported" } };
  if (!it.pending && action !== "hide" && !(legacy && (kind === "wiki" || kind === "entity"))) return { status: 409, body: { error: "not_pending" } };
  let r; try { r = await A[kind][action](env, it, txt(reason, 300), actor); } catch (e) { return { status: 500, body: { error: e.code || "server" } }; }
  const logId = await logEdit(db, actor, ACT[action], kind, id, { reason: viaProposal ? `${reason} (Empfehlung #${viaProposal})` : reason, before: r.before, after: r.after });
  return { status: 200, body: { ok: true, log: logId } };
}

// ---- Bearbeiten (blog): klein = Titel/Zusammenfassung/Themen, voll = auch Text; voll wird protokolliert und der Autor benachrichtigt ----
const MINOR = new Set(["title", "summary", "topics"]), FULL = new Set(["title", "summary", "topics", "body"]);
export async function editItem(env, user, { kind, id, level, fields = {}, reason = "", viaProposal = 0 }) {
  const db = env.DB;
  if (kind !== "blog") return { status: 400, body: { error: "unsupported", hint: "open_editor" } };
  const action = level === "full" ? "content.edit_full" : "content.edit_minor", allowed = level === "full" ? FULL : MINOR;
  const keys = Object.keys(fields).filter((k) => allowed.has(k));
  if (!keys.length || Object.keys(fields).some((k) => !allowed.has(k))) return { status: 400, body: { error: "bad_fields" } };
  const actor = await loadActor(db, user), it = await A.blog.load(db, +id);
  if (!it) return { status: 404, body: { error: "not_found" } };
  const perm = can(actor, action, await itemPerm(db, it, "blog"));
  if (!perm.ok) return { status: 403, body: { error: perm.why } };
  if (perm.propose) {
    const pid = (await db.prepare("INSERT INTO edit_proposals(ts,user_id,role,action,kind,item_id,reason,payload) VALUES(?,?,?,?,?,?,?,?) RETURNING id").bind(now(), actor.id, roleOf(actor), action, kind, String(id), txt(reason, 300), JSON.stringify({ level, fields })).first())?.id;
    return { status: 200, body: { ok: true, proposed: true, proposal: pid } };
  }
  const val = { title: txt(fields.title, 160), summary: txt(fields.summary, 400), body: String(fields.body ?? "").slice(0, 60000), topics: JSON.stringify((Array.isArray(fields.topics) ? fields.topics : []).map((x) => txt(x, 60)).filter(Boolean).slice(0, 12)) };
  if (keys.includes("title") && !val.title) return { status: 400, body: { error: "bad_fields" } };
  const before = {}, after = {};
  for (const k of keys) { before[k] = String(it[k] ?? "").slice(0, 300); after[k] = String(val[k]).slice(0, 300); }
  await db.prepare(`UPDATE blog_posts SET ${keys.map((k) => `${k}=?`).join(",")},updated=? WHERE id=?`).bind(...keys.map((k) => val[k]), now(), it.id).run();
  const logId = await logEdit(db, actor, action, kind, id, { reason: viaProposal ? `${reason} (Empfehlung #${viaProposal})` : reason, before, after });
  await recordRev(db, actor, it, { title: keys.includes("title") ? val.title : it.title, summary: keys.includes("summary") ? val.summary : it.summary, body: keys.includes("body") ? val.body : it.body, topics: keys.includes("topics") ? val.topics : (it.topics || "[]") }, reason);
  if (level === "full" && roleOf(actor) === "editor" && it.ownerId) await notify(env, it.ownerId, "system", "Dein Beitrag wurde von der Redaktion bearbeitet", `<p>Die Redaktion von M365.FM hat deinen Beitrag „${esc(it.title)}“ überarbeitet. Grund: ${esc(txt(reason, 300) || "–")}</p>`, `edit:${logId}`);
  return { status: 200, body: { ok: true, log: logId } };
}
// ---- Versionsverlauf (wie ein Wiki): Blog ueber content_rev, Wiki/Entitaeten ueber ihre Revisionstabellen ----
async function recordRev(db, actor, it, st, reason, action = "edit") {
  const ts = now(), ins = db.prepare("INSERT INTO content_rev(kind,item_id,user_id,role,action,reason,title,summary,body,topics,ts) VALUES('blog',?,?,?,?,?,?,?,?,?,?)");
  if (!(await db.prepare("SELECT 1 x FROM content_rev WHERE kind='blog' AND item_id=?").bind(String(it.id)).first()))   // Ursprungsfassung vor der ersten Redaktionsaenderung
    await ins.bind(String(it.id), it.ownerId || 0, "author", "baseline", "Fassung vor der Redaktion", it.title || "", it.summary || "", it.body || "", it.topics || "[]", it.updated || it.created || ts).run();
  await ins.bind(String(it.id), actor.id, roleOf(actor), action, String(reason || "").slice(0, 300), st.title || "", st.summary || "", st.body || "", st.topics || "[]", ts).run();
}
const entText = (d) => [d.name, d.desc?.en && "EN: " + d.desc.en, d.desc?.de && "DE: " + d.desc.de, d.long?.en && "\n" + d.long.en].filter(Boolean).join("\n");
const hv = (r) => ({ id: r.id, ts: r.ts, user: r.name || "", role: r.role || "", action: r.action || "edit", reason: r.reason || "", title: r.title || "", summary: r.summary || "", body: String(r.body || "").slice(0, 20000), status: r.status || "" });
// Liefert { versions (neueste zuerst), current, ownerId } oder null
export async function versionsOf(db, kind, id) {
  if (kind === "blog") {
    const it = await A.blog.load(db, +id); if (!it) return null;
    const rows = (await db.prepare("SELECT r.id,r.ts,r.role,r.action,r.reason,r.title,r.summary,r.body,COALESCE(u.name,'') name FROM content_rev r LEFT JOIN users u ON u.id=r.user_id WHERE r.kind='blog' AND r.item_id=? ORDER BY r.id DESC LIMIT 30").bind(String(id)).all()).results || [];
    return { versions: rows.map(hv), current: rows[0]?.id || 0, ownerId: it.ownerId, it };
  }
  if (kind === "wiki" || kind === "entity") {
    const it = await A[kind].load(db, +id); if (!it) return null;
    const rows = kind === "wiki"
      ? (await db.prepare("SELECT r.id,r.created ts,r.status,r.summary reason,r.body,r.user_id,COALESCE(u.name,'') name,COALESCE(u.role,'user') role FROM wiki_rev r LEFT JOIN users u ON u.id=r.user_id WHERE r.term=? AND r.lang=? ORDER BY r.created DESC,r.id DESC LIMIT 30").bind(it.term, it.lang).all()).results || []
      : (await db.prepare("SELECT r.id,r.created ts,r.status,r.summary reason,r.data,r.user_id,COALESCE(u.name,'') name,COALESCE(u.role,'user') role FROM entity_rev r LEFT JOIN users u ON u.id=r.user_id WHERE r.eid=? ORDER BY r.created DESC,r.id DESC LIMIT 30").bind(it.eid).all()).results || [];
    const vs = rows.map((r) => { let d = {}; if (r.data) { try { d = JSON.parse(r.data); } catch { /* leer */ } } return { ...hv({ ...r, title: kind === "wiki" ? it.term : d.name || it.eid, body: r.data ? entText(d) : r.body, action: "edit" }), authorId: r.user_id }; });
    return { versions: vs, current: vs.find((v) => v.status === "live")?.id || 0, ownerId: it.ownerId, it };
  }
  return null;
}

// Zuruecksetzen: Editor nur auf Basis einer Redaktionsaenderung (aktuelle Fassung stammt von einem Editor), Admin jederzeit
export async function revertTo(env, user, kind, id, revId) {
  const db = env.DB, v = await versionsOf(db, kind, id);
  if (!v) return { status: 404, body: { error: "not_found" } };
  const actor = await loadActor(db, user), role = roleOf(actor), target = v.versions.find((x) => x.id === +revId);
  if (!target) return { status: 404, body: { error: "not_found" } };
  if (role !== "admin" && role !== "editor") return { status: 403, body: { error: "forbidden" } };
  const perm = can(actor, "content.edit_full", await itemPerm(db, v.it, kind));
  if (!perm.ok || perm.propose) return { status: 403, body: { error: perm.why || "forbidden" } };
  if (target.id === v.current) return { status: 409, body: { error: "already_current" } };
  const cur = v.versions.find((x) => x.id === v.current);
  if (role !== "admin") {   // Editor: nur Redaktionsaenderungen zuruecknehmen
    const curRole = kind === "blog" ? cur?.role : (await db.prepare("SELECT role FROM users WHERE id=?").bind(cur?.authorId || 0).first())?.role;
    if (curRole !== "editor") return { status: 403, body: { error: "not_editor_edit" } };
  }
  const reason = `Zurückgesetzt auf Version #${target.id}`;
  if (kind === "blog") {
    const tr = await db.prepare("SELECT title,summary,body,topics FROM content_rev WHERE id=?").bind(target.id).first();
    await db.prepare("UPDATE blog_posts SET title=?,summary=?,body=?,topics=?,updated=? WHERE id=?").bind(tr.title, tr.summary, tr.body, tr.topics, now(), +id).run();
    await recordRev(db, actor, v.it, tr, reason, "revert");
  } else {
    const t = kind === "wiki" ? "wiki_rev" : "entity_rev", cond = kind === "wiki" ? "term=? AND lang=?" : "eid=?", args = kind === "wiki" ? [v.it.term, v.it.lang] : [v.it.eid];
    const row = await db.prepare(`SELECT status FROM ${t} WHERE id=?`).bind(target.id).first();
    if (!row || !["old", "live"].includes(row.status)) return { status: 409, body: { error: "not_revertable" } };
    await db.batch([db.prepare(`UPDATE ${t} SET status='old' WHERE ${cond} AND status='live'`).bind(...args), db.prepare(`UPDATE ${t} SET status='live' WHERE id=?`).bind(target.id)]);
  }
  const logId = await logEdit(db, actor, "content.edit_full", kind, id, { reason, before: { version: v.current }, after: { version: target.id } });
  if (role === "editor" && v.ownerId && kind === "blog") await notify(env, v.ownerId, "system", "Dein Beitrag wurde von der Redaktion bearbeitet", `<p>Die Redaktion hat deinen Beitrag „${esc(v.it.title)}“ auf eine frühere Fassung zurückgesetzt.</p>`, `edit:${logId}`);
  return { status: 200, body: { ok: true, log: logId } };
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
  const inScope = (x) => !actor.scope || (x.topics || []).some((t) => actor.scope.topics.has(t)) && (!actor.scope.langs.size || !x.lang || actor.scope.langs.has(x.lang));
  const vis = roleOf(actor) === "editor" ? out.filter(inScope) : out.slice();   // Fach-Editor: nur eigener Themenbereich; Eintraege ohne Thema nur fuer allgemeine Editoren
  out.length = 0; out.push(...vis);
  for (const x of out) {   // je Aktion: do | propose | no (fuer die Schaltflaechen); Eigentuemer/Firma wirken ueber can()
    const ip = { ownerId: x.authorId, orgIds: [], topics: x.topics || [], lang: x.lang }; x.actions = {};
    for (const a of KIND_ACTIONS[x.kind]) { const p = can(actor, ACT[a], ip); x.actions[a] = modeOf(p); }
    x.own = actor.id === x.authorId;
  }
  return out;
}

const history = async (db, kind, id) => (await db.prepare("SELECT l.id,l.ts,l.role,l.action,l.reason,l.undone,COALESCE(u.name,'') name FROM edit_log l LEFT JOIN users u ON u.id=l.user_id WHERE l.kind=? AND l.item_id=? ORDER BY l.ts DESC LIMIT 20").bind(kind, String(id)).all().catch(() => ({ results: [] }))).results || [];

export async function itemView(env, user, kind, id) {
  const db = env.DB, it = await lookup(db, kind, id); if (!it) return null;
  const actor = await loadActor(db, user), ip = await itemPerm(db, it, kind), actions = {};
  for (const a of KIND_ACTIONS[kind]) actions[a] = modeOf(can(actor, ACT[a], ip));
  const props = (await db.prepare("SELECT id,ts,role,action,reason,status FROM edit_proposals WHERE kind=? AND item_id=? ORDER BY ts DESC LIMIT 10").bind(kind, String(id)).all()).results || [];
  return { kind, id: String(id), title: it.title || "", body: String(it.body || it.summary || "").slice(0, 4000), summary: it.summary || "", lang: it.lang || "", status: it.status || "", author: it.name || "", handle: it.handle || "", authorId: it.ownerId || null,
    source: { created: it.created || 0, lang: it.lang || "", kind }, history: await history(db, kind, id), proposals: props, actions, editable: kind === "blog" };
}

export async function listProposals(db, status = "open") {
  return (await db.prepare("SELECT p.id,p.ts,p.role,p.action,p.kind,p.item_id,p.reason,p.payload,p.status,COALESCE(u.name,'') name FROM edit_proposals p LEFT JOIN users u ON u.id=p.user_id WHERE p.status=? ORDER BY p.ts LIMIT 200").bind(status).all()).results || [];
}

async function settleProposal(env, user, pid, confirm) {
  const db = env.DB, p = await db.prepare("SELECT * FROM edit_proposals WHERE id=? AND status='open'").bind(pid).first();
  if (!p) return { status: 404, body: { error: "not_found" } };
  const actor = await loadActor(db, user);
  if (p.user_id === actor.id && roleOf(actor) !== "admin") return { status: 403, body: { error: "own_content" } };
  if (confirm && !["editor", "admin"].includes(roleOf(actor))) return { status: 403, body: { error: "forbidden" } };
  if (confirm && p.action === "review.escalate") return { status: 400, body: { error: "unsupported" } };   // Eskalationen werden erledigt, nicht ausgefuehrt
  if (!confirm && roleOf(actor) === "moderator") return { status: 403, body: { error: "forbidden" } };
  let res = { status: 200, body: { ok: true } };
  if (confirm) {
    const inv = Object.entries(ACT).find(([, v]) => v === p.action)?.[0];
    if (p.kind === "i18n") res = await runProposal(env, actor, p);
    else if (p.action.startsWith("content.edit")) { const pl = JSON.parse(p.payload || "{}"); res = await editItem(env, actor, { kind: p.kind, id: p.item_id, level: pl.level, fields: pl.fields, reason: p.reason, viaProposal: p.id }); }
    else if (inv) res = await decide(env, actor, { kind: p.kind, id: p.item_id, action: inv, reason: p.reason || "Empfehlung bestaetigt", viaProposal: p.id });
    else res = { status: 400, body: { error: "unsupported" } };
    if (res.status !== 200) return res;
  }
  await db.prepare("UPDATE edit_proposals SET status=?,decided_by=?,decided_ts=? WHERE id=?").bind(confirm ? "executed" : "dismissed", actor.id, now(), pid).run();
  return res;
}

// Rueckgaengig (Admin): hide/approve/reject anhand des protokollierten Zustands davor
export async function undoLog(env, user, id) {
  const db = env.DB, row = await db.prepare("SELECT * FROM edit_log WHERE id=?").bind(id).first();
  if (!row) return { status: 404, body: { error: "not_found" } };
  if (row.undone) return { status: 409, body: { error: "already_undone" } };
  if (!["review.approve", "review.reject", "review.hide", "report.resolve"].includes(row.action) || !A[row.kind]?.undo) return { status: 400, body: { error: "not_undoable" } };
  let b = {}; try { b = JSON.parse(row.before || "{}"); } catch { /* leer */ }
  await A[row.kind].undo(env, b, row.kind === "cert" || row.kind === "expert_report" ? row.item_id : +row.item_id);
  await db.prepare("UPDATE edit_log SET undone=1 WHERE id=?").bind(id).run();
  await logEdit(db, user, "admin.undo", row.kind, row.item_id, { reason: `Rückgängig: #${id} ${row.action}`, before: row.after, after: row.before });
  return { status: 200, body: { ok: true } };
}

export async function handleEditor(env, request, url, path, user, J) {
  const db = env.DB, method = request.method, NS = { "cache-control": "no-store" }, R = (r) => J(r.body, r.status, NS);
  const body = async () => await request.json().catch(() => ({}));
  if (path.startsWith("/api/admin/editlog") || path.startsWith("/api/admin/editor-scope")) {
    if (!user?.admin) return J({ error: "forbidden" }, 403, NS);
    let m;
    if (path === "/api/admin/editlog" && method === "GET") {
      const lim = Math.min(+url.searchParams.get("limit") || 100, 300), kind = url.searchParams.get("kind") || "", who = +url.searchParams.get("user") || 0;
      const rows = (await db.prepare("SELECT l.id,l.ts,l.user_id,l.role,l.action,l.kind,l.item_id,l.reason,l.before,l.after,l.undone,COALESCE(u.name,'') name FROM edit_log l LEFT JOIN users u ON u.id=l.user_id WHERE (?='' OR l.kind=?) AND (?=0 OR l.user_id=?) ORDER BY l.id DESC LIMIT ?").bind(kind, kind, who, who, lim).all()).results || [];
      const props = await listProposals(db, "open");
      return J({ items: rows.map((r) => ({ ...r, undoable: !r.undone && ["review.approve", "review.reject", "review.hide", "report.resolve"].includes(r.action) })), proposals: props }, 200, NS);
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
    if ((m = /^\/api\/admin\/editlog\/undo\/(\d+)$/.exec(path)) && method === "POST") return R(await undoLog(env, user, +m[1]));
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
      return J({ versions: v.versions, current: v.current }, 200, NS);
    }
  }
  if (!isStaff(user)) return J({ error: user ? "forbidden" : "login" }, user ? 403 : 401, NS);
  const role = roleOf(user);
  if (path === "/api/editor/queue" && method === "GET") {
    const kind = url.searchParams.get("kind") || "", lang = url.searchParams.get("lang") || "";
    if (kind && !KINDS.includes(kind)) return J({ error: "bad_request" }, 400, NS);
    const sc = role === "editor" ? await scopeOf(db, user.id) : null;
    return J({ role, scope: sc ? { subject: true, topics: [...sc.topics], auto: sc.auto, extra: sc.extra, langs: [...sc.langs] } : { subject: false }, kinds: KINDS, modKinds: [...MOD_KINDS], items: await queue(db, user, kind, lang), proposals: role === "moderator" ? [] : await listProposals(db) }, 200, NS);
  }
  if (path === "/api/editor/item" && method === "GET") {
    const kind = url.searchParams.get("kind") || "", v = A[kind] ? await itemView(env, user, kind, url.searchParams.get("id") || "") : null;
    return v ? J({ item: v }, 200, NS) : J({ error: "not_found" }, 404, NS);
  }
  if (path === "/api/editor/decide" && method === "POST") { const b = await body(); return R(await decide(env, user, { kind: String(b.kind || ""), id: String(b.id || ""), action: String(b.action || ""), reason: txt(b.reason, 300) })); }
  if (path === "/api/editor/edit" && method === "POST") { const b = await body(); return R(await editItem(env, user, { kind: String(b.kind || ""), id: String(b.id || ""), level: b.level === "full" ? "full" : "minor", fields: b.fields && typeof b.fields === "object" ? b.fields : {}, reason: txt(b.reason, 300) })); }
  if (path === "/api/editor/proposals" && method === "GET") return J({ proposals: role === "moderator" ? [] : await listProposals(db, url.searchParams.get("status") === "done" ? "executed" : "open") }, 200, NS);
  if (path.startsWith("/api/editor/i18n/")) {   // Sprachfassungen: Absatz speichern, Verlauf, Zuruecksetzen, neu uebersetzen vormerken
    const q = (k) => url.searchParams.get(k) || "";
    if (path === "/api/editor/i18n/overrides" && method === "GET") return J({ overrides: await currentOverrides(db, q("kind"), q("item"), q("lang")) }, 200, NS);
    if (path === "/api/editor/i18n/history" && method === "GET") {
      const h = await unitHistory(db, q("kind"), q("item"), q("lang"), q("unit")), actor = await loadActor(db, user), perm = can(actor, "content.edit_full", { ownerId: null, orgIds: [], topics: [], lang: q("lang"), i18n: true });
      return J({ ...h, canRevert: perm.ok && !perm.propose }, 200, NS);
    }
    const b = method === "POST" ? await body() : {};
    if (path === "/api/editor/i18n/save" && method === "POST") return R(await saveUnit(env, user, { kind: String(b.kind || ""), item: String(b.item || ""), lang: String(b.lang || ""), unit: String(b.unit || ""), text: b.text, prev: b.prev, reason: txt(b.reason, 300) }));
    if (path === "/api/editor/i18n/revert" && method === "POST") return R(await revertUnit(env, user, { kind: String(b.kind || ""), item: String(b.item || ""), lang: String(b.lang || ""), unit: String(b.unit || ""), rev: b.rev }));
    if (path === "/api/editor/i18n/retranslate" && method === "POST") return R(await requestRetranslate(env, user, { kind: String(b.kind || ""), item: String(b.item || ""), lang: String(b.lang || ""), units: b.units }));
    return J({ error: "not_found" }, 404, NS);
  }
  if (path === "/api/editor/history" && method === "GET") {
    const kind = url.searchParams.get("kind") || "", v = ["blog", "wiki", "entity"].includes(kind) ? await versionsOf(db, kind, url.searchParams.get("id") || "") : null;
    if (!v) return J({ error: "not_found" }, 404, NS);
    const actor = await loadActor(db, user), perm = can(actor, "content.edit_full", await itemPerm(db, v.it, kind));
    return J({ versions: v.versions, current: v.current, canRevert: perm.ok && !perm.propose }, 200, NS);
  }
  if (path === "/api/editor/revert" && method === "POST") { const b = await body(); return R(await revertTo(env, user, String(b.kind || ""), String(b.id || ""), b.rev)); }
  if (path === "/api/editor/applications" && method === "GET") return role === "moderator" ? J({ error: "forbidden" }, 403, NS) : J({ items: await listApplications(db, user) }, 200, NS);
  let m;
  if ((m = /^\/api\/editor\/applications\/(\d+)\/(confirm|reject|override)$/.exec(path)) && method === "POST") return R(await decideApplication(env, user, +m[1], m[2], await body()));
  if ((m = /^\/api\/editor\/proposals\/(\d+)\/(confirm|dismiss)$/.exec(path)) && method === "POST") return R(await settleProposal(env, user, +m[1], m[2] === "confirm"));
  return J({ error: "not_found" }, 404, NS);
}
export { emailFor };
