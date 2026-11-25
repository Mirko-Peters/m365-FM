// Cron-Protokoll (cron_runs) je Aufgabe, aus index.js ausgelagert (eigenes Modul: das Worker-Hauptmodul exportiert nur den Handler).
import { meterDb } from "./d1meter.js";

// Lauf protokollieren; ein Fehler bricht die uebrigen Aufgaben nicht ab. D1-Kosten: eine Zeile am Ende (vorher INSERT beim Start und UPDATE am
// Ende); ein uebersprungener Lauf (Ergebnis mit skipped, ohne geschriebene Zeile) wird tagsueber nicht protokolliert, die Verwaltung zeigt dann den
// letzten echten Lauf. Im Tageslauf (daily, 06:00) bekommt auch eine uebersprungene Aufgabe ihre Zeile: so bleibt jede Aufgabe (auch dauerhaft
// uebersprungene wie importLibrarySeed oder syncSearchVectors ohne Binding) mit hoechstens 7 Tagen Abstand in der Betriebsansicht. Fehler werden
// immer protokolliert. info beginnt mit rr/rw = gelesene/geschriebene D1-Zeilen der Aufgabe (d1meter.js).
// Langsame Aufgaben: dauert fn laenger als TRACK_SLOW_MS, schreibt track sofort eine Startzeile (finished=0, Verwaltung: "laeuft") und ergaenzt sie am
// Ende per UPDATE. Bricht das Laufzeitende die Aufgabe ab oder haengt sie (D1 "overloaded", contentblog.js), bleibt diese Zeile stehen wie frueher.
export const TRACK_SLOW_MS = 20000;
export async function track(env, name, fn, { daily = false, slowMs = TRACK_SLOW_MS } = {}) {
  const t0 = Math.floor(Date.now() / 1000), m = { rr: 0, rw: 0 }, e = Object.create(env);
  e.DB = meterDb(env.DB, m);
  let ok = 1, info = "", r, startRow = null;
  const timer = setTimeout(() => {
    startRow = env.DB.prepare("INSERT INTO cron_runs(name,started) VALUES(?,?) RETURNING id").bind(name, t0).first().then((x) => x?.id ?? null, () => null);
  }, slowMs);
  try { r = await fn(e); } catch (err) { ok = 0; info = String(err && err.message || err).slice(0, 300); console.error("cron", name, info); } finally { clearTimeout(timer); }
  if (ok && !daily && !startRow && r && typeof r === "object" && r.skipped !== undefined && !m.rw) return;
  if (ok) info = JSON.stringify({ rr: m.rr, rw: m.rw, ...(r && typeof r === "object" ? (Array.isArray(r) ? { r } : r) : r === undefined ? {} : { r }) }).slice(0, 300);
  const id = startRow ? await startRow : null, end = Math.floor(Date.now() / 1000);
  if (id) await env.DB.prepare("UPDATE cron_runs SET finished=?,ok=?,info=? WHERE id=?").bind(end, ok, info, id).run().catch(() => 0);
  else await env.DB.prepare("INSERT INTO cron_runs(name,started,finished,ok,info) VALUES(?,?,?,?,?)").bind(name, t0, end, ok, info).run().catch(() => 0);   // Tabelle fehlt bis zur Migration
}
