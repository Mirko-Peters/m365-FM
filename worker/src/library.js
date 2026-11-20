// Copilot-Bibliothek: Prompts, Agenten-Anweisungen, KQL/DAX/PowerShell, Flows, Adaptive Cards ... teilen, upvoten, versionieren
import { limitTopics } from "./sponsor_extra.js";
import { cleanText, rateLimit, isLang } from "./util.js";
import { baseIds } from "./entities.js";

export const LIB_KINDS = ["prompt", "instructions", "agent", "skill", "plugin", "manifest", "copilotstudio", "flow", "powerapp", "kql", "dax", "excel", "graph", "powershell", "adaptivecard", "other"];
const now = () => Math.floor(Date.now() / 1000);
const txt = (s, n) => cleanText(s, n).replace(/[<>]/g, "").replace(/https?:\/\/\S+/gi, "").replace(/\s+/g, " ").trim();
const okLang = (l) => l === "en" || isLang(l);
const slugify = (t) => t.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
const parse = (s, d) => { try { return JSON.parse(s); } catch { return d; } };
const FIELDS = "id,slug,kind,title,summary,body,link,lang,topics,version,status,created,updated,published";
export const LINK_REQUIRED = ["plugin"];                 // Plugins brauchen einen https-Link (Repo, Store, Doku)
let linkOk = false;
async function ensureLink(db) {
  if (linkOk) return;
  try { await db.prepare("SELECT link FROM lib_items LIMIT 1").first(); } catch { try { await db.prepare("ALTER TABLE lib_items ADD COLUMN link TEXT NOT NULL DEFAULT ''").run(); } catch {} }
  try { await db.prepare("SELECT reviewed FROM lib_items LIMIT 1").first(); } catch { try { await db.prepare("ALTER TABLE lib_items ADD COLUMN reviewed INTEGER NOT NULL DEFAULT 0").run(); } catch {} }   // Migration 0054
  try { await db.prepare("SELECT origin FROM lib_items LIMIT 1").first(); } catch { try { await db.prepare("ALTER TABLE lib_items ADD COLUMN origin TEXT NOT NULL DEFAULT ''").run(); } catch {} }   // Migration 0054
  linkOk = true;
}
const BAD_HOST = /(^|\.)(bit\.ly|t\.co|tinyurl\.com|goo\.gl|is\.gd|ow\.ly|buff\.ly|cutt\.ly|rebrand\.ly|shorturl\.at)$/i;
function cleanLink(v) { v = String(v || "").trim(); if (!v) return ""; try { const u = new URL(v); if (u.protocol !== "https:" || v.length > 300 || u.username || u.password || BAD_HOST.test(u.hostname)) return null; return u.href; } catch { return null; } }
const view = (r) => ({ ...r, topics: parse(r.topics, []) });

export async function deleteUserLibrary(db, uid) {
  await db.batch([db.prepare("DELETE FROM lib_votes WHERE item_id IN (SELECT id FROM lib_items WHERE user_id=?) OR user_id=?").bind(uid, uid), db.prepare("DELETE FROM lib_items WHERE user_id=?").bind(uid)]);
}

// ---------- Start-Eintraege (data/library_seed*/ -> worker/src/library_seed.json, tools/build_library_seed.py) ----------
// Einmaliger, wiederholbarer Import unter dem Profil LIB_SEED_HANDLE: ohne Tageslimit (Mitglieder: 20 neue Eintraege je 24 h), mit denselben Pruefungen wie
// /api/library/save (Art, Titel, Text 20 bis 20000 Zeichen, Link, Themen muessen Entitaeten sein). Er fasst nur eigene Zeilen an (origin 'seed'); ein Eintrag mit
// gleichem Slug von Hand (origin '') wird abgelehnt (slug_taken) und nie ueberschrieben. Unveraenderte Eintraege bleiben unberuehrt, geaenderte werden
// aktualisiert (Version +1 bei neuem Text), nichts wird geloescht und status bleibt, wie er ist (Moderation). Je Lauf hoechstens `cap` Schreibvorgaenge in einem
// db.batch (Cron nur um :00 und :30, nicht in der 15-Minuten-Reihe). Das Profil wird beim ersten Lauf festgehalten (meta lib_seed_uid): wechselt der Inhaber der
// Kennung, passiert nichts mehr. Ist alles eingespielt, merkt sich meta lib_seed_done die Pruefsumme der Datei; bis sich die Datei aendert, laeuft nichts mehr.
const fnv = (s, h = 0x811c9dc5) => { for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h; };
const seedSig = (seed) => { let h = 0x811c9dc5; for (const x of seed) h = fnv(`${x.kind}|${x.title}|${x.summary}|${x.lang}|${x.body}|${x.link}|${(x.topics || []).join(",")}|${x.reviewed ? 1 : 0}\n`, h); return `${seed.length}:${h.toString(16)}`; };
export async function importLibrarySeed(env, seed, { cap = 40 } = {}) {
  const db = env.DB; await ensureLink(db);
  const handle = String(env.LIB_SEED_HANDLE || "").trim().toLowerCase();
  if (!handle) return { skipped: "LIB_SEED_HANDLE fehlt" };
  const sig = seedSig(seed), meta = async (k) => (await db.prepare("SELECT v FROM meta WHERE k=?").bind(k).first())?.v;
  if ((await meta("lib_seed_done")) === sig) return { skipped: "fertig, Datei unveraendert", total: seed.length, pending: 0 };
  const pr = await db.prepare("SELECT p.user_id FROM profiles p JOIN users u ON u.id=p.user_id AND u.banned=0 WHERE p.handle=? AND p.public=1").bind(handle).first();
  if (!pr) return { skipped: "Profil nicht oeffentlich oder Kennung unbekannt", handle };
  const uid = pr.user_id, pinned = await meta("lib_seed_uid");
  if (pinned && pinned !== String(uid)) return { skipped: "Inhaber der Kennung hat gewechselt", handle };
  const known = await baseIds(env), t = now();
  const have = new Map(((await db.prepare("SELECT id,slug,kind,title,summary,body,link,lang,topics,reviewed,origin FROM lib_items WHERE user_id=?").bind(uid).all()).results || []).map((r) => [r.slug, r]));
  const out = { pending: 0, created: 0, updated: 0, same: 0, total: seed.length, rejected: [] }, seen = new Set(), stmts = [];
  for (const raw of seed) {
    const title = txt(raw.title || "", 140), summary = txt(raw.summary || "", 300), kind = String(raw.kind || ""), lang = String(raw.lang || "en");
    const link = cleanLink(raw.link), body = String(raw.body || "").replace(/\r\n/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, 20000);
    const topics = [...new Set((Array.isArray(raw.topics) ? raw.topics : []).map(String))].slice(0, 10), slug = slugify(title);
    const cur = have.get(slug);
    const why = title.length < 5 || !slug ? "title" : !LIB_KINDS.includes(kind) ? "bad_kind" : !okLang(lang) ? "bad_lang" : link === null ? "bad_link" : LINK_REQUIRED.includes(kind) && !link ? "need_link"
      : body.length < 20 ? "too_short" : !topics.length || topics.some((x) => !known.has(x)) ? "bad_topic" : cur && cur.origin !== "seed" ? "slug_taken" : seen.has(slug) ? "dup_slug" : "";
    if (why) { out.rejected.push({ title: title.slice(0, 60), why }); continue; }
    seen.add(slug);
    const rev = raw.reviewed ? 1 : 0, tj = JSON.stringify(topics);
    if (cur && cur.kind === kind && cur.title === title && cur.summary === summary && cur.body === body && (cur.link || "") === (link || "") && cur.lang === lang && cur.topics === tj && cur.reviewed === rev) { out.same++; continue; }
    if (out.created + out.updated >= cap) { out.pending++; continue; }
    if (cur) {
      stmts.push(db.prepare("UPDATE lib_items SET kind=?,title=?,summary=?,body=?,link=?,lang=?,topics=?,reviewed=?,version=version+?,updated=? WHERE id=?").bind(kind, title, summary, body, link || "", lang, tj, rev, cur.body !== body ? 1 : 0, t, cur.id));
      out.updated++;
    } else {
      stmts.push(db.prepare("INSERT INTO lib_items(user_id,slug,kind,title,summary,body,link,lang,topics,reviewed,origin,version,status,created,updated,published) VALUES(?,?,?,?,?,?,?,?,?,?,'seed',1,'live',?,?,?)").bind(uid, slug, kind, title, summary, body, link || "", lang, tj, rev, t, t, t));
      out.created++;
    }
  }
  stmts.push(db.prepare("INSERT OR IGNORE INTO meta(k,v) VALUES('lib_seed_uid',?)").bind(String(uid)));
  if (!out.pending && !out.rejected.length) stmts.push(db.prepare("INSERT INTO meta(k,v) VALUES('lib_seed_done',?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").bind(sig));
  await db.batch(stmts);
  return out;
}

export async function handleLibrary(env, request, url, path, user, J) {
  const db = env.DB, method = request.method; await ensureLink(db);

  if (path === "/api/library/export" && method === "GET") {
    const rows = (await db.prepare(
      `SELECT b.id,b.slug,b.kind,b.title,b.summary,b.body,b.link,b.lang,b.topics,b.version,b.reviewed,b.created,b.published,b.updated,p.handle,u.name,(SELECT COUNT(*) FROM lib_votes v WHERE v.item_id=b.id) votes
       FROM lib_items b JOIN profiles p ON p.user_id=b.user_id AND p.public=1 AND p.handle IS NOT NULL JOIN users u ON u.id=b.user_id AND u.banned=0
       WHERE b.status='live' ORDER BY b.published DESC LIMIT 1000`).all()).results || [];
    return J({ items: rows.map((r) => ({ ...r, topics: parse(r.topics, []) })) }, 200, { "cache-control": "public, max-age=300" });
  }
  if (path === "/api/library/votes" && method === "GET") {
    const rows = (await db.prepare("SELECT b.id,(SELECT COUNT(*) FROM lib_votes v WHERE v.item_id=b.id) votes FROM lib_items b WHERE b.status='live'").all()).results || [];
    let mine = [];
    if (user) mine = ((await db.prepare("SELECT item_id FROM lib_votes WHERE user_id=?").bind(user.id).all()).results || []).map((x) => x.item_id);
    return J({ votes: Object.fromEntries(rows.map((r) => [r.id, r.votes])), mine });
  }
  if (!user) return J({ error: "login" }, 401);

  if (path === "/api/library/mine" && method === "GET") {
    const rows = (await db.prepare(`SELECT ${FIELDS},(SELECT COUNT(*) FROM lib_votes v WHERE v.item_id=lib_items.id) votes FROM lib_items WHERE user_id=? ORDER BY updated DESC LIMIT 200`).bind(user.id).all()).results || [];
    const pr = await db.prepare("SELECT handle,public FROM profiles WHERE user_id=?").bind(user.id).first();
    return J({ items: rows.map(view), handle: pr?.handle || "", public: !!pr?.public, kinds: LIB_KINDS });
  }

  if (path === "/api/library/save" && method === "POST") {
    if (!(await rateLimit(db, `lib:${user.id}`, 40, 3600))) return J({ error: "rate_limit" }, 429);
    const b = await request.json().catch(() => ({}));
    const title = txt(b.title || "", 140), summary = txt(b.summary || "", 300), lang = String(b.lang || "en"), kind = String(b.kind || "");
    if (title.length < 5) return J({ error: "title" }, 400);
    if (!LIB_KINDS.includes(kind)) return J({ error: "bad_kind" }, 400);
    if (!okLang(lang)) return J({ error: "bad_lang" }, 400);
    const link = cleanLink(b.link); if (link === null) return J({ error: "bad_link" }, 400);
    if (LINK_REQUIRED.includes(kind) && !link) return J({ error: "need_link" }, 400);
    const body = String(b.body || "").replace(/\r\n/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, 20000);
    if (body.length < 20) return J({ error: "too_short" }, 400);
    const known = await baseIds(env), topics = [];
    for (const t of limitTopics(b.topics)) { if (!known.has(t)) return J({ error: "bad_topic", topic: t }, 400); if (!topics.includes(t)) topics.push(t); }
    const pr = await db.prepare("SELECT handle,public FROM profiles WHERE user_id=?").bind(user.id).first();
    if (!(pr?.public && pr.handle)) return J({ error: "need_profile" }, 400);
    const t = now();
    const cur = b.id ? await db.prepare(`SELECT ${FIELDS} FROM lib_items WHERE id=? AND user_id=?`).bind(+b.id, user.id).first() : null;
    if (b.id && !cur) return J({ error: "not_found" }, 404);
    if (cur) {
      await db.prepare("UPDATE lib_items SET kind=?,title=?,summary=?,body=?,link=?,lang=?,topics=?,reviewed=0,origin='',version=version+?,updated=? WHERE id=?")   // Bearbeiten nimmt "geprueft" zurueck und macht den Eintrag zum eigenen
        .bind(kind, title, summary, body, link, lang, JSON.stringify(topics), cur.body !== body ? 1 : 0, t, cur.id).run();
      return J({ ok: true, id: cur.id, slug: cur.slug });
    }
    const day = (await db.prepare("SELECT COUNT(*) n FROM lib_items WHERE user_id=? AND created>?").bind(user.id, t - 86400).first())?.n || 0;
    if (day >= 20) return J({ error: "rate_limit" }, 429);
    let slug = slugify(title) || "item", n = 1;
    while (await db.prepare("SELECT 1 x FROM lib_items WHERE user_id=? AND slug=?").bind(user.id, slug).first()) slug = `${slugify(title).slice(0, 52) || "item"}-${++n}`;
    const r = await db.prepare("INSERT INTO lib_items(user_id,slug,kind,title,summary,body,link,lang,topics,version,status,created,updated,published) VALUES(?,?,?,?,?,?,?,?,?,1,'live',?,?,?)")
      .bind(user.id, slug, kind, title, summary, body, link, lang, JSON.stringify(topics), t, t, t).run();
    return J({ ok: true, id: r.meta.last_row_id, slug });
  }

  if (path === "/api/library/delete" && method === "POST") {
    const b = await request.json().catch(() => ({}));
    const p = await db.prepare("SELECT id FROM lib_items WHERE id=? AND (user_id=? OR ?=1)").bind(+b.id, user.id, user.admin ? 1 : 0).first();
    if (!p) return J({ error: "not_found" }, 404);
    await db.prepare("DELETE FROM comments WHERE vid=?").bind("lib" + p.id).run();
    await db.batch([db.prepare("DELETE FROM lib_votes WHERE item_id=?").bind(p.id), db.prepare("DELETE FROM lib_items WHERE id=?").bind(p.id)]);
    return J({ ok: true });
  }

  if (path === "/api/library/vote" && method === "POST") {
    if (!(await rateLimit(db, `libv:${user.id}`, 60, 3600))) return J({ error: "rate_limit" }, 429);
    const b = await request.json().catch(() => ({}));
    const p = await db.prepare("SELECT id,user_id FROM lib_items WHERE id=? AND status='live'").bind(+b.id).first();
    if (!p) return J({ error: "not_found" }, 404);
    if (p.user_id === user.id) return J({ error: "own" }, 400);
    const has = await db.prepare("SELECT 1 x FROM lib_votes WHERE item_id=? AND user_id=?").bind(p.id, user.id).first();
    if (has) await db.prepare("DELETE FROM lib_votes WHERE item_id=? AND user_id=?").bind(p.id, user.id).run();
    else await db.prepare("INSERT INTO lib_votes(item_id,user_id,created) VALUES(?,?,?)").bind(p.id, user.id, now()).run();
    return J({ ok: true, votes: (await db.prepare("SELECT COUNT(*) n FROM lib_votes WHERE item_id=?").bind(p.id).first()).n, voted: !has });
  }
  return null;
}
