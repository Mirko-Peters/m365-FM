// Pruefliste fuer neue Events (Migration 0045): Zustand events.review = approved | pending | rejected | draft.
// Ein Event zur Pruefung (pending) hat public=0 und erscheint deshalb in keiner oeffentlichen Abfrage (Seite, Export, Sitemap, Suche, Erinnerungen, MCP-Listen).
// Neu zur Pruefung kommen: Events des Scrapers (Community Days, Sessionize-Import: eventmerge.js insertEvent) und Events von Mitgliedern, die noch nicht
// "bestaetigt" sind (memberReview, aufgerufen von events.js). Ein Admin uebernimmt oder lehnt ab (decideReview, Route /api/admin/events/review).
import { roleOf } from "./perm.js";
import { trustedUser } from "./entities.js";
import { ownedEntity } from "./profiles.js";
import { dayDiff } from "./eventmerge.js";

const now = () => Math.floor(Date.now() / 1000);
export const REVIEW_STATES = ["approved", "pending", "rejected", "draft"];
export const reviewOf = (ev) => (REVIEW_STATES.includes(ev?.review) ? ev.review : "approved");

// "Bestaetigtes Mitglied" - keine neue Regel, sondern das vorhandene Vertrauensmodell (entities.js trustedUser, dieselbe Schwelle wie bei Wiki, Entitaeten,
// Firmenangeboten und Kurzposts): Admin, Editor, bestaetigtes Programm (MVP, MCT, Regional Director, MSA, Microsoft-Mitarbeiter) oder mindestens 25 Punkte.
// Dazu jede Redaktionsrolle von perm.js roleOf(): auch Moderatoren zaehlen immer als bestaetigt.
export async function confirmedMember(db, user) {
  if (!user) return false;
  if (roleOf(user) !== "user") return true;
  return trustedUser(db, user);
}

// Zustand eines Events, das ein Mitglied im Formular (oder per MCP save_event) speichert. prev = vorhandene Zeile oder null, wantPublic = "oeffentlich" angehakt.
// Ein bereits freigegebenes Event bleibt freigegeben (Bearbeiten ist keine neue Pruefung). Ein abgelehntes bleibt abgelehnt: das hebt nur ein Admin auf.
// Rueckgabe { review, public } - public ist nur 1, wenn das Event freigegeben ist.
export async function memberReview(db, user, prev, wantPublic) {
  const cur = prev ? reviewOf(prev) : null;
  if (cur === "approved") return { review: "approved", public: wantPublic ? 1 : 0 };
  if (cur === "rejected") return { review: "rejected", public: 0 };
  const ok = await confirmedMember(db, user);
  if (!wantPublic) return { review: cur || (ok ? "approved" : "draft"), public: 0 };   // Entwurf: bleibt unsichtbar; ein bestaetigtes Mitglied muss nichts einreichen
  return ok ? { review: "approved", public: 1 } : { review: "pending", public: 0 };
}

export const countReview = async (db) => (await db.prepare("SELECT COUNT(*) n FROM events WHERE review='pending' AND merged_into=0").first().catch(() => null))?.n || 0;

const COLS = "id,handle,title,start,end,mode,city,location,country,source,source_url,url,owner_id,org_id,organizer_name,name_key,url_key,city_key,unclaimed,review,public,created";
// Liste fuer den Admin: Events zur Pruefung (aelteste zuerst) mit Quelle, Link und moeglichen Dubletten; dazu die zuletzt abgelehnten (zum Zurueckholen)
export async function listReview(db, limit = 100) {
  const total = await countReview(db);
  const rows = (await db.prepare(`SELECT ${COLS} FROM events WHERE review='pending' AND merged_into=0 ORDER BY created,id LIMIT ?`).bind(limit).all()).results || [];
  const rejected = (await db.prepare("SELECT id,handle,title,start,source,review_at FROM events WHERE review='rejected' AND merged_into=0 ORDER BY review_at DESC,id DESC LIMIT 20").all()).results || [];
  const ids = JSON.stringify(rows.map((r) => r.id)), j = (a) => JSON.stringify([...new Set(a.filter(Boolean))]);
  const [q, sim, owners] = rows.length ? await db.batch([
    db.prepare("SELECT a_id,b_id,reason FROM dedupe_queue WHERE kind='event' AND status='open' AND (a_id IN (SELECT value FROM json_each(?1)) OR b_id IN (SELECT value FROM json_each(?1)))").bind(ids),
    db.prepare("SELECT id,handle,title,start,review,public,name_key,url_key FROM events WHERE merged_into=0 AND id NOT IN (SELECT value FROM json_each(?1)) AND ((name_key<>'' AND name_key IN (SELECT value FROM json_each(?2))) OR (url_key<>'' AND url_key IN (SELECT value FROM json_each(?3)))) LIMIT 300")
      .bind(ids, j(rows.map((r) => r.name_key)), j(rows.map((r) => r.url_key))),
    db.prepare("SELECT id,name FROM users WHERE id IN (SELECT value FROM json_each(?))").bind(j(rows.map((r) => r.owner_id))),
  ]) : [{ results: [] }, { results: [] }, { results: [] }];
  const other = new Map(), pairs = q.results || [];
  const otherIds = pairs.flatMap((p) => [p.a_id, p.b_id]).filter((id) => !rows.some((r) => r.id === id));
  if (otherIds.length) for (const r of (await db.prepare("SELECT id,handle,title,start,review,public FROM events WHERE id IN (SELECT value FROM json_each(?))").bind(JSON.stringify([...new Set(otherIds)])).all()).results || []) other.set(r.id, r);
  const name = new Map((owners.results || []).map((u) => [u.id, u.name])), pub = (e, reason) => ({ id: e.id, handle: e.handle, title: e.title, start: e.start, state: e.review || "approved", visible: !!e.public, reason });
  const items = rows.map((r) => {
    const dup = new Map();
    for (const p of pairs) { const o = p.a_id === r.id ? p.b_id : p.b_id === r.id ? p.a_id : 0; if (o && other.get(o)) dup.set(o, pub(other.get(o), p.reason || "queue")); }
    for (const e of sim.results || []) {
      if (dup.has(e.id)) continue;
      if (r.url_key && e.url_key === r.url_key) dup.set(e.id, pub(e, "url"));
      else if (r.name_key && e.name_key === r.name_key && (dayDiff(r.start, e.start) ?? 9) <= 1) dup.set(e.id, pub(e, "name+day"));
    }
    return { id: r.id, handle: r.handle, title: r.title, start: r.start, end: r.end, mode: r.mode, place: [r.city || r.location, r.country].filter(Boolean).join(", "),
      source: r.source || "member", source_url: r.source_url || "", url: r.url || "", organizer: r.owner_id ? name.get(r.owner_id) || "" : r.organizer_name || "", unclaimed: !!r.unclaimed, created: r.created, dupes: [...dup.values()].slice(0, 5) };
  });
  return { total, items, rejected: rejected.map((r) => ({ id: r.id, handle: r.handle, title: r.title, start: r.start, source: r.source || "member", at: r.review_at })) };
}

// Entscheidung des Admins. approve: pending oder rejected -> approved und oeffentlich (ein Event ganz ohne Datum bleibt verborgen, bis ein Datum da ist: eventmerge.js fillEvent),
// reject: pending -> rejected (bleibt versteckt; die Zeile bleibt als Merkzettel, damit der Import es nicht noch einmal anlegt). Liefert { ok, review, before } oder { error }.
export async function decideReview(env, id, action, t = now()) {
  const db = env.DB, ev = await db.prepare("SELECT * FROM events WHERE id=? AND merged_into=0").bind(+id || 0).first();
  if (!ev) return { error: "not_found" };
  const cur = reviewOf(ev);
  if (action === "approve") {
    if (cur !== "pending" && cur !== "rejected") return { error: "not_pending" };
    const r = await db.prepare("UPDATE events SET review='approved',review_at=?,public=?,updated=? WHERE id=? AND review=? AND merged_into=0").bind(t, ev.start ? 1 : 0, t, ev.id, cur).run();
    if (Number(r.meta?.changes || 0) !== 1) return { error: "not_pending" };
    // Von einem Mitglied eingetragen: jetzt, wo es oeffentlich ist, bekommt es wie frueher gleich beim Speichern seine Entitaet (Seite des Events fuer Verknuepfungen)
    if (ev.owner_id && ev.start) await ownedEntity(env, { id: ev.owner_id }, { eid: ev.handle, type: "event", name: ev.title, en: `${ev.title} is an event in the Microsoft community, starting ${ev.start}.`, de: `${ev.title} ist eine Veranstaltung der Microsoft-Community, Beginn ${ev.start}.`, web: String(ev.url || "").startsWith("https://") ? ev.url : "" });
    return { ok: true, review: "approved", before: cur, handle: ev.handle, title: ev.title };
  }
  if (action === "reject") {
    if (cur !== "pending") return { error: "not_pending" };
    const r = await db.prepare("UPDATE events SET review='rejected',review_at=?,public=0,updated=? WHERE id=? AND review='pending' AND merged_into=0").bind(t, t, ev.id).run();
    if (Number(r.meta?.changes || 0) !== 1) return { error: "not_pending" };
    return { ok: true, review: "rejected", before: cur, handle: ev.handle, title: ev.title };
  }
  return { error: "bad_action" };
}
