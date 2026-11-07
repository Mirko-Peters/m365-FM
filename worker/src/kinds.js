// Branche (Typ industry) und Job/Rolle (Typ job) als Entitaeten: Auswahl im Profil, Dubletten-Schutz beim Neuanlegen.
// Neuanlage laeuft ueber den bestehenden Entitaets-Weg (POST /api/entity): Neulinge landen als 'pending' in der Verwaltung, Vertrauenswuerdige sind sofort live.
import { entityMap } from "./entities.js";

export const KIND_TYPES = ["industry", "job"];
const ID = /^[a-z0-9-]{2,48}$/;

// Vergleichsform eines Namens: Kleinschreibung, ohne Akzente und Sonderzeichen ("Marketing-Manager" = "marketing manager")
export const normName = (s) => String(s || "").normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "");

// Vorhandene Entitaet gleichen Typs mit gleichem normalisiertem Namen oder Alias (andere ID), live oder wartend; sonst null
export async function findDuplicate(env, id, data) {
  if (!KIND_TYPES.includes(data?.type)) return null;
  const keys = new Set([data.name, ...(data.aliases || [])].map(normName).filter(Boolean));
  const hit = (e, eid) => eid !== id && e?.type === data.type && [e.name, ...(e.aliases || [])].map(normName).some((k) => k && keys.has(k));
  for (const [eid, e] of await entityMap(env)) if (hit(e, eid)) return eid;
  const pend = (await env.DB.prepare("SELECT eid,data FROM entity_rev WHERE status='pending'").all().catch(() => ({ results: [] }))).results || [];
  for (const r of pend) { try { if (hit(JSON.parse(r.data), r.eid)) return r.eid; } catch { /* defekte Zeile */ } }
  return null;
}

// Auswahl pruefen: nur vorhandene Entitaeten des Typs (live/Basis) oder eigene, noch wartende Neuanlagen; keine Dubletten, hoechstens max
export async function checkKindIds(env, user, list, type, max) {
  const map = await entityMap(env), out = [];
  for (const raw of (Array.isArray(list) ? list : []).slice(0, max + 5)) {
    const id = String(raw || "").toLowerCase().trim();
    if (!ID.test(id)) return { err: "bad_" + type };
    let ok = map.get(id)?.type === type;
    if (!ok && user) {
      const mine = await env.DB.prepare("SELECT data FROM entity_rev WHERE eid=? AND user_id=? AND status='pending' ORDER BY created DESC LIMIT 1").bind(id, user.id).first();
      try { ok = !!mine && JSON.parse(mine.data).type === type; } catch { ok = false; }
    }
    if (!ok) return { err: "bad_" + type };
    if (!out.includes(id)) out.push(id);
  }
  if (out.length > max) return { err: "too_many_" + type };
  return { list: out };
}
