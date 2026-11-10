// Spreaker-Folge <-> kanonische m365.fm-Adresse (Tabelle episode_urls, Migration 0043).
// Der Worker speichert und zeigt die Zuordnung; die Korrektur bei Spreaker macht der GitHub-Workflow spreaker-urls.yml (der Worker hat den
// Spreaker-Token nur als Deploy-Momentaufnahme, die ablaeuft). Zwei Quellen: spreaker-urls.json der Website (Adresse je Folge) und
// data/spreaker_urls_state.json im Repo (Wert bei Spreaker, Status, Zeitpunkt, letzter Lauf).
const STATE_URL = "https://raw.githubusercontent.com/Mirko-Peters/m365-FM/main/data/spreaker_urls_state.json";
const STATUSES = new Set(["ok", "differs", "missing", "skipped", "error"]);

export async function importEpisodeUrls(env) {
  const db = env.DB;
  let list = [];
  try { list = ((await (await fetch(env.SITE + "/spreaker-urls.json", { cf: { cacheTtl: 600 } })).json()).items || []); } catch { return { skipped: "spreaker-urls.json nicht erreichbar" }; }
  const ok = list.filter((x) => x && /^\d+$/.test(String(x.spreaker_episode_id)) && /^https:\/\/www\.m365\.fm\//.test(x.url || "") && /^[a-z]{2}$/.test(x.lang || ""));
  if (ok.length < 100) return { skipped: "Zuordnung zu klein", file: list.length };
  for (let i = 0; i < ok.length; i += 50)
    await db.batch(ok.slice(i, i + 50).map((x) => db.prepare("INSERT INTO episode_urls(spreaker_episode_id,show_id,lang,slug,url) VALUES(?,?,?,?,?) ON CONFLICT(spreaker_episode_id) DO UPDATE SET show_id=excluded.show_id,lang=excluded.lang,slug=excluded.slug,url=excluded.url")
      .bind(String(x.spreaker_episode_id), +x.show_id || 0, x.lang, String(x.slug || "").slice(0, 200), x.url)));
  // Eine Folge, deren Adresse sich seit dem letzten Abgleich geaendert hat, ist wieder offen (Wert bei Spreaker passt nicht mehr zur Adresse).
  await db.prepare("UPDATE episode_urls SET status='differs' WHERE status='ok' AND url<>'' AND rtrim(url_on_spreaker,'/')<>rtrim(url,'/')").run().catch(() => 0);
  let st = null;
  try { st = await (await fetch(env.EPISODE_URLS_STATE || STATE_URL, { cf: { cacheTtl: 300 } })).json(); } catch { /* Zustand noch nicht im Repo */ }
  let applied = 0;
  if (st?.episodes) {
    const rows = Object.entries(st.episodes).filter(([id, v]) => /^\d+$/.test(id) && v && STATUSES.has(v.s));
    const t = (s) => { const n = Date.parse(s || ""); return Number.isFinite(n) ? Math.floor(n / 1000) : 0; };
    for (let i = 0; i < rows.length; i += 50)
      await db.batch(rows.slice(i, i + 50).map(([id, v]) => db.prepare("INSERT INTO episode_urls(spreaker_episode_id,show_id,url_on_spreaker,checked_at,status) VALUES(?,?,?,?,?) ON CONFLICT(spreaker_episode_id) DO UPDATE SET url_on_spreaker=excluded.url_on_spreaker,checked_at=excluded.checked_at,status=excluded.status")
        .bind(id, +v.h || 0, String(v.u || "").slice(0, 500), t(v.c), v.s)));
    applied = rows.length;
    if (st.run) await db.prepare("INSERT INTO meta(k,v) VALUES('episode_urls_run',?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").bind(JSON.stringify(st.run).slice(0, 2000)).run().catch(() => 0);
  }
  return { imported: ok.length, state: applied };
}

export async function episodeUrlsOverview(db) {
  const counts = {};
  for (const r of (await db.prepare("SELECT status, COUNT(*) n FROM episode_urls GROUP BY status").all().catch(() => ({ results: [] }))).results || []) counts[r.status] = r.n;
  const differs = (await db.prepare("SELECT spreaker_episode_id id, lang, url, url_on_spreaker FROM episode_urls WHERE status='differs' ORDER BY spreaker_episode_id DESC LIMIT 20").all().catch(() => ({ results: [] }))).results || [];
  let run = null; try { run = JSON.parse((await db.prepare("SELECT v FROM meta WHERE k='episode_urls_run'").first().catch(() => null))?.v || "null"); } catch { /* leer */ }
  return { ok: counts.ok || 0, differs: counts.differs || 0, missing: counts.missing || 0, skipped: counts.skipped || 0, error: counts.error || 0, unknown: counts.unknown || 0, total: Object.values(counts).reduce((a, b) => a + b, 0), differs_sample: differs, last_run: run };
}
