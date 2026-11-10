// Event <-> Event-Entitaet (Migration 0046): ein Event der Events-Liste gehoert zu einer Entitaet vom Typ event ("Microsoft Ignite 2026" -> microsoft-ignite).
// Die Entitaet haelt die Beschreibung, die Events liefern Termine, Sessions und Speaker. Zwei Spalten am Event: entity (ID) und entity_state:
//   ''          noch nicht entschieden - der Cron darf einen Vorschlag eintragen        suggested  automatischer Vorschlag (Namensvergleich), NICHT oeffentlich
//   proposed    vom Veranstalter im Event-Formular gewaehlt, NICHT oeffentlich            confirmed  vom Admin bestaetigt oder gesetzt: nur das erscheint oeffentlich
//   rejected    Vorschlag vom Admin abgelehnt (entity bleibt Merkzettel)                 none       bewusst keine Zuordnung (der Cron laesst das Event in Ruhe)
// Oeffentlich wird die Zuordnung ausschliesslich ueber den Export /api/events/export (events.js evViews: nur entity_state='confirmed'); ob das Event selbst
// oeffentlich ist, entscheidet dort weiter events.public (Pruefliste neuer Events, Zusammenfuehren, Loeschen). Rechte: Veranstalter ueber canManage(), Admin ueber perm.js gate().
import { canManage, similarName } from "./events.js";
import { entityMap } from "./entities.js";
import { normEventName, runBatch, hash24 } from "./eventmerge.js";
import { gate, logEdit } from "./perm.js";
import { rateLimit } from "./util.js";

export const ENTITY_ROUTE = /^\/api\/(admin\/)?events\/entity$/;
export const STATES = ["", "suggested", "proposed", "confirmed", "rejected", "none"];
const EID = /^[a-z0-9][a-z0-9-]{1,79}$/;
const SCAN_MAX = 2000;   // hoechstens so viele Events ohne Entscheidung je Lauf (nur Namensvergleich im Speicher, geschrieben werden nur Treffer)

// Event-Entitaeten, die man waehlen kann (nicht veraltet, nicht ersetzt)
export async function eventEntities(env) {
  return [...(await entityMap(env)).values()].filter((e) => e && e.type === "event" && EID.test(e.id || "") && e.name && !e.outdated && !e.replaced_by)
    .map((e) => ({ id: e.id, name: String(e.name), aliases: Array.isArray(e.aliases) ? e.aliases.map(String) : [] })).sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
}

// ---------------------------------------------------------------- Namensvergleich (rein, ohne Datenbank)
// Zusatzwoerter, die einen Event-Namen nicht zu einem anderen Event machen ("Ignite" = "Microsoft Ignite" = "Microsoft Ignite Online")
const SOFT = new Set(["microsoft", "ms", "online", "virtual", "live", "conference", "conf", "summit", "event", "annual", "global", "hybrid", "digital"]);
const RANK = { name: 3, similar: 2, contains: 1 };
const toks = (s) => normEventName(s).key.split(" ").filter(Boolean);
const subset = (a, b) => a.every((t) => b.includes(t));
const contiguous = (hay, needle) => needle.length > 0 && hay.some((_, i) => needle.every((t, j) => hay[i + j] === t));
// Wie gut passt ein Event-Titel zu einem Entitaetsnamen? '' | name (gleich bis auf Jahr, Edition und Zusatzwoerter) | similar (kleiner Tippfehler, similarName aus events.js) | contains (Name steckt im Titel)
export function nameHow(title, name) {
  const k = toks(title), e = toks(name); if (!k.length || !e.length) return "";
  const kk = k.join(" "), ek = e.join(" ");
  if (kk === ek) return "name";
  if (subset(k, e) && e.filter((t) => !k.includes(t)).every((t) => SOFT.has(t)) && k.some((t) => t.length >= 4 && !SOFT.has(t))) return "name";   // "Ignite 2026" -> "Microsoft Ignite"
  if (subset(e, k) && k.filter((t) => !e.includes(t)).every((t) => SOFT.has(t)) && e.some((t) => t.length >= 4 && !SOFT.has(t))) return "name";   // "Microsoft Ignite Online" -> "Microsoft Ignite"
  if (k.length >= 2 && e.length >= 2 && ek.length >= 8 && similarName(kk, ek)) return "similar";
  if (ek.length >= 6 && contiguous(k, e) && e.some((t) => t.length >= 4 && !SOFT.has(t))) return "contains";   // "M365Con DACH 2026" -> "M365Con"
  return "";
}
// Beste Entitaet zu einem Event-Titel: { id, how } oder null. Mehrere gleich gute, verschiedene Entitaeten = nicht eindeutig = kein Vorschlag.
export function matchEntity(title, ents) {
  let best = null, tie = false;
  for (const e of ents) {
    let how = "";
    for (const nm of [e.name, ...(e.aliases || [])]) { const h = nameHow(title, nm); if (RANK[h] > (RANK[how] || 0)) how = h; }
    if (!how) continue;
    if (!best || RANK[how] > RANK[best.how]) { best = { id: e.id, how }; tie = false; } else if (RANK[how] === RANK[best.how] && e.id !== best.id) tie = true;
  }
  return best && !tie ? best : null;
}

// ---------------------------------------------------------------- Cron: Vorschlaege eintragen
// 1) Ein Event, in das ein anderes aufgegangen ist (Dublette zusammengefuehrt), erbt die BESTAETIGTE Zuordnung des aufgegangenen, solange es selbst keine Entscheidung hat.
// 2) Events ohne Entscheidung: Namensvergleich mit den Event-Entitaeten -> entity_state='suggested' (nur eindeutige Treffer). Ein Lauf ohne neue Events/Entitaeten kostet zwei Abfragen.
export async function suggestEventEntities(env) {
  const db = env.DB, out = { adopted: 0, scanned: 0, suggested: 0 };
  const a = await db.prepare("UPDATE events SET entity=(SELECT m.entity FROM events m WHERE m.merged_into=events.id AND m.entity_state='confirmed' AND m.entity<>'' ORDER BY m.id LIMIT 1),entity_state='confirmed' WHERE merged_into=0 AND entity_state IN ('','suggested','proposed') AND EXISTS (SELECT 1 FROM events m WHERE m.merged_into=events.id AND m.entity_state='confirmed' AND m.entity<>'')").run();
  out.adopted = Number(a.meta?.changes || 0);
  const [ev, en] = await db.batch([
    db.prepare("SELECT COUNT(*) n, COALESCE(MAX(id),0) m, COALESCE(MAX(updated),0) u FROM events WHERE entity_state='' AND merged_into=0"),
    db.prepare("SELECT COUNT(*) n, COALESCE(MAX(id),0) m FROM entity_rev WHERE status='live' AND json_extract(data,'$.type')='event'"),
  ]);
  const e1 = ev.results?.[0] || {}, e2 = en.results?.[0] || {}, sig = await hash24(JSON.stringify([e1.n, e1.m, e1.u, e2.n, e2.m]));
  if (!e1.n) return out;
  const last = (await db.prepare("SELECT v FROM meta WHERE k='event_entity_scan'").first().catch(() => null))?.v;
  if (last === sig) return out;
  const ents = await eventEntities(env);
  if (ents.length) {
    const rows = (await db.prepare("SELECT id,title FROM events WHERE entity_state='' AND merged_into=0 ORDER BY id LIMIT ?").bind(SCAN_MAX).all()).results || [];
    out.scanned = rows.length;
    const ops = [];
    for (const r of rows) { const m = matchEntity(r.title, ents); if (m) ops.push(db.prepare("UPDATE events SET entity=?,entity_state='suggested' WHERE id=? AND entity_state=''").bind(m.id, r.id)); }
    await runBatch(db, ops, 50); out.suggested = ops.length;
  }
  // Signatur NACH dem Eintragen neu rechnen: die eben bearbeiteten Events zaehlen nicht mehr als "ohne Entscheidung"
  const [ev2] = await db.batch([db.prepare("SELECT COUNT(*) n, COALESCE(MAX(id),0) m, COALESCE(MAX(updated),0) u FROM events WHERE entity_state='' AND merged_into=0")]);
  const f = ev2.results?.[0] || {};
  await db.prepare("INSERT INTO meta(k,v) VALUES('event_entity_scan',?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").bind(await hash24(JSON.stringify([f.n, f.m, f.u, e2.n, e2.m]))).run();
  return out;
}

// ---------------------------------------------------------------- Routen
const view = (r, names, ents) => ({ id: r.id, handle: r.handle, title: r.title, start: r.start, public: !!r.public, entity: r.entity, entity_name: names.get(r.entity) || r.entity, state: r.entity_state, how: r.entity_state === "suggested" ? (matchEntity(r.title, ents)?.how || "") : "" });
const COLS = "id,handle,title,start,public,entity,entity_state";

export async function handleEventEntity(env, request, url, path, user, J) {
  const db = env.DB, method = request.method, body = async () => await request.json().catch(() => ({}));
  // ---- Mitglieder: Liste der waehlbaren Event-Entitaeten (oeffentlich) und Zuordnung am eigenen Event
  if (path === "/api/events/entity") {
    if (method === "GET") return J({ entities: (await eventEntities(env)).map(({ id, name }) => ({ id, name })) }, 200, { "cache-control": "public, max-age=300" });
    if (method !== "POST") return J({ error: "method_not_allowed" }, 405);
    if (!user) return J({ error: "login" }, 401);
    if (!(await rateLimit(db, `event:${user.id}`, 30, 3600))) return J({ error: "rate_limit" }, 429);
    const b = await body(), ev = await db.prepare("SELECT * FROM events WHERE handle=? AND merged_into=0").bind(String(b.handle || "").toLowerCase().trim()).first();
    if (!ev) return J({ error: "not_found" }, 404);
    if (!(await canManage(db, user, ev, "edit"))) return J({ error: "forbidden" }, 403);
    const g = await gate(db, user, "review.approve", { confers: true }), want = String(b.entity ?? "").toLowerCase().trim();
    if (ev.entity_state === "confirmed" && !g.ok) return J({ error: "confirmed" }, 409);   // eine bestaetigte Zuordnung aendert nur ein Admin
    if (want && !(await eventEntities(env)).some((e) => e.id === want)) return J({ error: "bad_entity" }, 400);   // nur Event-Entitaeten
    const entity = want, state = want ? (g.ok ? "confirmed" : "proposed") : "none";
    const r = await db.prepare("UPDATE events SET entity=?,entity_state=? WHERE id=? AND merged_into=0 AND entity=? AND entity_state=?").bind(entity, state, ev.id, ev.entity, ev.entity_state).run();
    if (Number(r.meta?.changes || 0) !== 1) return J({ error: "changed" }, 409);
    if (g.ok) await logEdit(db, g.actor, "review.approve", "event_entity", ev.id, { reason: entity ? "Event-Entität gesetzt (Event-Formular)" : "Event-Entität entfernt (Event-Formular)", before: { entity: ev.entity, state: ev.entity_state }, after: { entity, state, handle: ev.handle } });
    return J({ ok: true, entity, state });
  }
  // ---- Admin: Vorschlaege und Vorschlaege der Veranstalter bestaetigen, aendern, ablehnen; bestaetigte Zuordnungen aendern oder entfernen
  if (path === "/api/admin/events/entity") {
    if (method !== "GET" && method !== "POST") return J({ error: "method_not_allowed" }, 405);
    const b = method === "POST" ? await body() : {}, act = String(b.action || ""), down = act === "reject" || act === "clear";
    const g = await gate(db, user, down ? "review.reject" : "review.approve", { confers: true });
    if (!g.ok) return J({ error: "forbidden" }, 403);   // wie alle /api/admin/events/*-Routen (auch ohne Anmeldung)
    const ents = await eventEntities(env), names = new Map(ents.map((e) => [e.id, e.name]));
    if (method === "GET") {
      await suggestEventEntities(env).catch(() => 0);   // frisch rechnen, damit die Liste nach einem Import nicht bis zum naechsten Cron-Lauf wartet (idempotent, durch Signatur geschuetzt)
      const [q, done, n] = await db.batch([
        db.prepare(`SELECT ${COLS} FROM events WHERE merged_into=0 AND entity_state IN ('suggested','proposed') ORDER BY (entity_state='proposed') DESC,id LIMIT 100`),
        db.prepare(`SELECT ${COLS} FROM events WHERE merged_into=0 AND entity_state='confirmed' ORDER BY start DESC,id DESC LIMIT 100`),
        db.prepare("SELECT COUNT(*) n FROM events WHERE merged_into=0 AND entity_state IN ('suggested','proposed')"),
      ]);
      return J({ entities: ents.map(({ id, name }) => ({ id, name })), open: n.results?.[0]?.n || 0, items: (q.results || []).map((r) => view(r, names, ents)), confirmed: (done.results || []).map((r) => view(r, names, ents)) }, 200, { "cache-control": "no-store" });
    }
    const ev = await db.prepare("SELECT * FROM events WHERE id=? AND merged_into=0").bind(+b.id || 0).first();
    if (!ev) return J({ error: "not_found" }, 404);
    const pick = String(b.entity ?? "").toLowerCase().trim();
    if (pick && !names.has(pick)) return J({ error: "bad_entity" }, 400);
    let entity, state;
    if (act === "confirm") {   // Vorschlag (oder Wunsch des Veranstalters) bestaetigen; mit entity wird die Zuordnung gleich geaendert
      if (!["suggested", "proposed"].includes(ev.entity_state)) return J({ error: "not_open" }, 400);
      entity = pick || ev.entity; state = "confirmed";
    } else if (act === "set") {
      if (!pick) return J({ error: "bad_entity" }, 400);
      entity = pick; state = "confirmed";
    } else if (act === "reject") {
      if (!["suggested", "proposed"].includes(ev.entity_state)) return J({ error: "not_open" }, 400);
      entity = ev.entity; state = "rejected";
    } else if (act === "clear") { entity = ""; state = "none"; }
    else return J({ error: "bad_action" }, 400);
    if (state === "confirmed" && !names.has(entity)) return J({ error: "bad_entity" }, 400);
    const r = await db.prepare("UPDATE events SET entity=?,entity_state=? WHERE id=? AND merged_into=0 AND entity=? AND entity_state=?").bind(entity, state, ev.id, ev.entity, ev.entity_state).run();
    if (Number(r.meta?.changes || 0) !== 1) return J({ error: "changed" }, 409);
    await logEdit(db, g.actor, down ? "review.reject" : "review.approve", "event_entity", ev.id, { reason: { confirm: "Event-Entität bestätigt", set: "Event-Entität gesetzt", reject: "Event-Entität abgelehnt", clear: "Event-Entität entfernt" }[act], before: { entity: ev.entity, state: ev.entity_state }, after: { entity, state, handle: ev.handle, title: ev.title } });
    return J({ ok: true, entity, state });
  }
  return null;
}
