// Quotes als Objekte an Personen-Entitaeten: Uebernahme aus quotes.json des Seitenbaus (Cron) und Export fuer Seitenbau, Agenten und MCP.
import { readJson, sourceState } from "./srcmeta.js";
// Nichts wird geloescht: Zitate, die aus der Datei verschwinden, bleiben in D1 (status bleibt), nur neue und geaenderte werden geschrieben.
// D1-Kosten: quotes.json aendert sich nur mit einem Seitenbau. Unveraenderte Datei (meta quotes_src) -> kein weiterer Zugriff; sonst schreibt der
// UPSERT nur Zitate, deren Felder sich geaendert haben (vorher: alle ~2.800 Zeilen alle 30 Minuten).
export async function importQuotesFromSite(env) {
  let list = [], text = "";
  try { const r = await readJson(await fetch(env.SITE + "/quotes.json", { cf: { cacheTtl: 600 } })); list = r.json.quotes || []; text = r.text; } catch { return { skipped: "quotes.json nicht erreichbar" }; }
  const ok = list.filter((q) => q && /^[0-9]+-[0-9]+$/.test(q.id || "") && /^[a-z0-9][a-z0-9-]{1,79}$/.test(q.person || "") && q.text && q.lang);
  if (!ok.length) return { imported: 0, file: list.length };
  const db = env.DB, t = Math.floor(Date.now() / 1000);
  const src = await sourceState(db, "quotes_src", text);
  if (src.same) return { skipped: "unveraendert", imported: 0, file: list.length };
  for (let i = 0; i < ok.length; i += 50)
    await db.batch(ok.slice(i, i + 50).map((q) => db.prepare("INSERT INTO quote(id,person_eid,text,lang,episode_id,episode_slug,time_s,about,src,created) VALUES(?,?,?,?,?,?,?,?, 'site', ?) ON CONFLICT(id) DO UPDATE SET person_eid=excluded.person_eid,text=excluded.text,lang=excluded.lang,episode_id=excluded.episode_id,episode_slug=excluded.episode_slug,time_s=excluded.time_s,about=excluded.about WHERE quote.src='site' AND (quote.person_eid IS NOT excluded.person_eid OR quote.text IS NOT excluded.text OR quote.lang IS NOT excluded.lang OR quote.episode_id IS NOT excluded.episode_id OR quote.episode_slug IS NOT excluded.episode_slug OR quote.time_s IS NOT excluded.time_s OR quote.about IS NOT excluded.about)")
      .bind(q.id, q.person, String(q.text).slice(0, 1200), q.lang, String(q.episode_id || ""), String(q.episode_slug || ""), Number.isFinite(+q.time_s) && q.time_s !== null ? Math.round(+q.time_s) : null, JSON.stringify((q.about || []).slice(0, 8)), t)));
  await src.commit();
  return { imported: ok.length, file: list.length };
}

export async function handleQuotes(env, url, J) {
  const p = (url.searchParams.get("person") || "").toLowerCase(), l = (url.searchParams.get("lang") || "").toLowerCase();
  const w = ["status='live'"], b = [];
  if (/^[a-z0-9][a-z0-9-]{1,79}$/.test(p)) { w.push("person_eid=?"); b.push(p); }
  if (/^[a-z]{2}$/.test(l)) { w.push("lang=?"); b.push(l); }
  const rows = (await env.DB.prepare(`SELECT id,person_eid person,text,lang,episode_id,episode_slug,time_s,about FROM quote WHERE ${w.join(" AND ")} ORDER BY person_eid,episode_id,id LIMIT 5000`).bind(...b).all().catch(() => ({ results: [] }))).results || [];
  return J({ quotes: rows.map((r) => ({ ...r, about: JSON.parse(r.about || "[]") })) }, 200, { "cache-control": "public, max-age=300" });
}
