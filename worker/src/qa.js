// Fragen & Antworten zu Entitaeten: Mitglieder fragen, antworten und stimmen ab; die beste Antwort landet in der FAQ-Box der Entitaetsseite
import { cleanText, esc, rateLimit } from "./util.js";
import { knownIds } from "./entities.js";
import { notify } from "./mail.js";
import { gate, logEdit } from "./perm.js";
import { cacheEnv } from "./staging.js";

const ID = /^[a-z0-9-]{2,48}$/;
const now = () => Math.floor(Date.now() / 1000);
const txt = (s, n) => cleanText(s, n).replace(/[<>]/g, "").replace(/https?:\/\/\S+/gi, "").replace(/\s+/g, " ").trim();
const MIN_VOTES = 2;   // ohne Annahme durch Eigentuemer/Redaktion braucht eine Antwort so viele Stimmen, um in der FAQ-Box zu erscheinen

export async function askQuestion(env, user, eid, q, lang) {
  if (!ID.test(eid || "") || !(await knownIds(env)).has(eid)) return { error: "not_found" };
  q = txt(q, 200); if (q.length < 10) return { error: "too_short" };
  if (!/[?？]$/.test(q)) q += "?";
  if (!(await rateLimit(env.DB, `qa:q:${user.id}`, 5, 86400))) return { error: "rate_limit" };
  const r = await env.DB.prepare("INSERT INTO entity_q(eid,user_id,q,lang,created) VALUES(?,?,?,?,?)").bind(eid, user.id, q, lang === "de" ? "de" : "en", now()).run();
  return { ok: true, id: r.meta?.last_row_id };
}
export async function answerQuestion(env, user, qid, a) {
  const q = await env.DB.prepare("SELECT id,user_id,eid,lang FROM entity_q WHERE id=? AND hidden=0").bind(+qid).first(); if (!q) return { error: "not_found" };
  a = txt(a, 600); if (a.length < 20) return { error: "too_short" };
  if (!(await rateLimit(env.DB, `qa:a:${user.id}`, 10, 86400))) return { error: "rate_limit" };
  const r = await env.DB.prepare("INSERT INTO entity_a(q_id,user_id,a,created) VALUES(?,?,?,?)").bind(q.id, user.id, a, now()).run();
  if (q.user_id !== user.id) {
    const de = q.lang === "de";
    await notify(env, q.user_id, "reply", de ? "Neue Antwort auf deine Frage" : "New answer to your question", `<p>${de ? "Deine Frage zu" : "Your question about"} <b>${esc(q.eid)}</b> ${de ? "wurde beantwortet:" : "has been answered:"}</p><blockquote>${esc(a)}</blockquote><p><a href="${env.SITE}/entity/${encodeURIComponent(q.eid)}/">${de ? "Frage und Antwort ansehen" : "View question and answer"}</a></p>`, `qa:${r.meta?.last_row_id}`);
  }
  return { ok: true, id: r.meta?.last_row_id, eid: q.eid };
}
const canAccept = async (db, user, eid) => !!(user && (user.admin || user.editor || user.pro || (await db.prepare("SELECT 1 x FROM entity_claims WHERE eid=? AND user_id=? AND status='verified'").bind(eid, user.id).first())));

// D1-Kosten: jede Entitaetsseite fragt /api/qa beim Laden ab, meist ohne Anmeldung. Die Antwort fuer Abgemeldete ist fuer alle gleich und liegt
// QA_TTL Sekunden im Kanten-Cache des Rechenzentrums (synthetischer Schluessel, keine Browser-Cache-Angabe: nach der Anmeldung soll die Seite sofort
// den angemeldeten Stand zeigen). Fragen, Antworten, Stimmen, Annahmen und Loeschungen verwerfen den Eintrag dieses Rechenzentrums; andere
// Rechenzentren zeigen Neues spaetestens nach QA_TTL. Das gilt auch fuer Entfernungen (Ausblenden durch die Moderation, Sperre eines Kontos):
// ausserhalb des Rechenzentrums der Moderation bleiben sie fuer Abgemeldete bis zu QA_TTL (5 Minuten) sichtbar. Die Antworten aller Fragen
// kommen in einer Abfrage (vorher eine je Frage).
// Staging und live laufen in derselben Zone (api-staging.m365.fm neben api-dub.m365.fm, wrangler.toml); der Cache-API-Speicher gilt je Zone und
// Rechenzentrum. Der Schluessel traegt deshalb die Umgebung (cacheEnv), sonst saehen Abgemeldete live Testfragen aus der Staging-D1.
const QA_TTL = 300;
export const qaKey = (env, eid) => new Request(`https://dedupe.m365.fm/${cacheEnv(env)}/qa/v1/${encodeURIComponent(eid)}`);
async function dropQaCache(env, eid) { if (eid && globalThis.caches?.default) await globalThis.caches.default.delete(qaKey(env, eid)).catch(() => 0); }

export async function handleQa(env, request, url, path, user, J) {
  const db = env.DB, method = request.method;
  const body = async () => request.json().catch(() => ({}));
  if (path === "/api/qa" && method === "GET") {
    const eid = url.searchParams.get("eid") || ""; if (!ID.test(eid)) return J({ error: "bad_request" }, 400);
    const cache = !user && globalThis.caches?.default ? globalThis.caches.default : null;
    if (cache) {
      const hit = await cache.match(qaKey(env, eid)).catch(() => null), data = hit ? await hit.json().catch(() => null) : null;
      if (data) return J(data);
    }
    const qs = (await db.prepare("SELECT q.id,q.q,q.lang,q.created,q.user_id,COALESCE(u.name,'') name FROM entity_q q LEFT JOIN users u ON u.id=q.user_id AND u.banned=0 WHERE q.eid=? AND q.hidden=0 ORDER BY q.created DESC LIMIT 30").bind(eid).all()).results || [];
    const byQ = new Map(qs.map((q) => [q.id, []]));
    if (qs.length) {
      const rows = (await db.prepare("SELECT a.id,a.q_id,a.a,a.created,a.accepted,a.user_id,COALESCE(u.name,'') name,(SELECT COUNT(*) FROM entity_a_votes v WHERE v.a_id=a.id) votes,(SELECT COUNT(*) FROM entity_a_votes v2 WHERE v2.a_id=a.id AND v2.user_id=?) me FROM entity_a a LEFT JOIN users u ON u.id=a.user_id AND u.banned=0 WHERE a.q_id IN (SELECT value FROM json_each(?)) AND a.hidden=0 ORDER BY a.q_id, a.accepted DESC, votes DESC, a.created, a.id").bind(user?.id || 0, JSON.stringify(qs.map((q) => q.id))).all()).results || [];
      for (const a of rows) { const list = byQ.get(a.q_id); if (list && list.length < 10) list.push(a); }
    }
    const out = qs.map((q) => ({ id: q.id, q: q.q, lang: q.lang, name: q.name, created: q.created, own: user?.id === q.user_id, answers: byQ.get(q.id).map((a) => ({ id: a.id, a: a.a, name: a.name, votes: a.votes, me: !!a.me, accepted: !!a.accepted, own: user?.id === a.user_id })) }));
    const data = { questions: out, loggedIn: !!user, canAccept: await canAccept(db, user, eid), min_votes: MIN_VOTES };
    if (cache) await cache.put(qaKey(env, eid), new Response(JSON.stringify(data), { headers: { "content-type": "application/json", "cache-control": `public, max-age=${QA_TTL}` } })).catch(() => 0);
    return J(data);
  }
  if (path === "/api/qa/export" && method === "GET") {   // Top-Antworten fuer die FAQ-Box (statischer Build)
    const rows = (await db.prepare(`SELECT q.eid,q.q,q.lang,a.a,a.accepted,(SELECT COUNT(*) FROM entity_a_votes v WHERE v.a_id=a.id) votes FROM entity_q q JOIN entity_a a ON a.q_id=q.id WHERE q.hidden=0 AND a.hidden=0 ORDER BY q.id, a.accepted DESC, votes DESC`).all()).results || [];
    const seen = new Set(), items = [];
    for (const r of rows) { const k = r.eid + "|" + r.q; if (seen.has(k)) continue; seen.add(k); if (r.accepted || r.votes >= MIN_VOTES) items.push({ eid: r.eid, q: r.q, a: r.a, lang: r.lang }); }
    return J({ items }, 200, { "cache-control": "public, max-age=300" });
  }
  if (!user) return J({ error: "login" }, 401);
  if (path === "/api/qa/ask" && method === "POST") { const b = await body(); const r = await askQuestion(env, user, String(b.eid || ""), b.q, b.lang); if (r.ok) await dropQaCache(env, String(b.eid || "")); return r.error ? J(r, r.error === "rate_limit" ? 429 : 400) : J(r); }
  if (path === "/api/qa/answer" && method === "POST") { const b = await body(); const r = await answerQuestion(env, user, b.qid, b.a); if (r.ok) await dropQaCache(env, r.eid); return r.error ? J(r, r.error === "rate_limit" ? 429 : r.error === "not_found" ? 404 : 400) : J(r); }
  if (path === "/api/qa/vote" && method === "POST") {
    if (!(await rateLimit(db, `qa:v:${user.id}`, 120, 3600))) return J({ error: "rate_limit" }, 429);
    const b = await body(), a = await db.prepare("SELECT a.id,a.user_id,q.eid FROM entity_a a JOIN entity_q q ON q.id=a.q_id WHERE a.id=? AND a.hidden=0").bind(+b.aid).first(); if (!a) return J({ error: "not_found" }, 404);
    if (a.user_id === user.id) return J({ error: "own" }, 400);
    const has = await db.prepare("SELECT 1 x FROM entity_a_votes WHERE a_id=? AND user_id=?").bind(a.id, user.id).first();
    if (has) await db.prepare("DELETE FROM entity_a_votes WHERE a_id=? AND user_id=?").bind(a.id, user.id).run(); else await db.prepare("INSERT INTO entity_a_votes(a_id,user_id,created) VALUES(?,?,?)").bind(a.id, user.id, now()).run();
    await dropQaCache(env, a.eid);
    return J({ ok: true, voted: !has });
  }
  if (path === "/api/qa/accept" && method === "POST") {
    const b = await body(), a = await db.prepare("SELECT a.id,a.q_id,q.eid,a.accepted FROM entity_a a JOIN entity_q q ON q.id=a.q_id WHERE a.id=?").bind(+b.aid).first(); if (!a) return J({ error: "not_found" }, 404);
    if (!(await canAccept(db, user, a.eid))) return J({ error: "forbidden" }, 403);
    await db.batch([db.prepare("UPDATE entity_a SET accepted=0 WHERE q_id=?").bind(a.q_id), db.prepare("UPDATE entity_a SET accepted=? WHERE id=?").bind(a.accepted ? 0 : 1, a.id)]);
    await dropQaCache(env, a.eid);
    return J({ ok: true });
  }
  if (path === "/api/qa/delete" && method === "POST") {
    const b = await body(), isQ = b.kind === "q";
    const row = isQ ? await db.prepare("SELECT q.id,q.user_id,q.eid FROM entity_q q WHERE q.id=?").bind(+b.id).first() : await db.prepare("SELECT a.id,a.user_id,q.eid FROM entity_a a JOIN entity_q q ON q.id=a.q_id WHERE a.id=?").bind(+b.id).first();
    if (!row) return J({ error: "not_found" }, 404);
    if (row.user_id !== user.id) {   // fremde Frage/Antwort ausblenden = Moderation: can(review.hide) mit Fachbereich und eigener Firma, im Protokoll
      if (!(await gate(db, user, "queue.review")).ok) return J({ error: "forbidden" }, 403);   // wie bisher nur Editoren und Admin (Moderatoren: Kommentare und Meldungen ueber die Pruefliste)
      const g = await gate(db, user, "review.hide", { ownerId: row.user_id, topics: [row.eid] }); if (!g.ok) return J({ error: g.why }, 403);
      await logEdit(db, g.actor, "review.hide", isQ ? "qa_q" : "qa_a", row.id, { before: { hidden: 0 }, after: { hidden: 1 } });
    }
    await db.prepare(`UPDATE ${isQ ? "entity_q" : "entity_a"} SET hidden=1 WHERE id=?`).bind(row.id).run();
    await dropQaCache(env, row.eid);
    return J({ ok: true });
  }
  return null;
}
export async function deleteUserQa(db, uid) {
  await db.batch([db.prepare("DELETE FROM entity_a_votes WHERE user_id=?").bind(uid), db.prepare("UPDATE entity_q SET hidden=1,user_id=0 WHERE user_id=?").bind(uid), db.prepare("UPDATE entity_a SET hidden=1,user_id=0 WHERE user_id=?").bind(uid)]);
}
