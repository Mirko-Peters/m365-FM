// Spreaker-Folge <-> kanonische m365.fm-Adresse (Tabelle episode_urls, Migration 0043).
// Der Worker speichert und zeigt die Zuordnung; die Korrektur bei Spreaker macht der GitHub-Workflow spreaker-urls.yml (der Worker hat den
// Spreaker-Token nur als Deploy-Momentaufnahme, die ablaeuft). Zwei Quellen: spreaker-urls.json der Website (Adresse je Folge) und
// data/spreaker_urls_state.json im Repo (Wert bei Spreaker, Status, Zeitpunkt, letzter Lauf).
import { readJson, sourceState } from "./srcmeta.js";

const STATE_URL = "https://raw.githubusercontent.com/Mirko-Peters/m365-FM/main/data/spreaker_urls_state.json";
const STATUSES = new Set(["ok", "differs", "missing", "skipped", "error"]);

// D1-Kosten: der Cron laeuft alle 30 Minuten, die Quellen aendern sich aber hoechstens mit einem Seitenbau bzw. dem taeglichen Workflow.
// Beide Dateien gehen in einen Fingerabdruck (meta episode_urls_src); ist er unveraendert, endet der Lauf ohne weitere D1-Abfrage.
// Sonst schreiben beide UPSERTs nur Zeilen, deren Werte sich wirklich geaendert haben (WHERE ... IS NOT excluded...).
export async function importEpisodeUrls(env) {
  const db = env.DB;
  let list = [], listText = "";
  try { const r = await readJson(await fetch(env.SITE + "/spreaker-urls.json", { cf: { cacheTtl: 600 } })); list = r.json.items || []; listText = r.text; } catch { return { skipped: "spreaker-urls.json nicht erreichbar" }; }
  const ok = list.filter((x) => x && /^\d+$/.test(String(x.spreaker_episode_id)) && /^https:\/\/www\.m365\.fm\//.test(x.url || "") && /^[a-z]{2}$/.test(x.lang || ""));
  if (ok.length < 100) return { skipped: "Zuordnung zu klein", file: list.length };
  let st = null, stText = "";
  try { const r = await readJson(await fetch(env.EPISODE_URLS_STATE || STATE_URL, { cf: { cacheTtl: 300 } })); st = r.json; stText = r.text; } catch { /* Zustand noch nicht im Repo */ }
  const src = await sourceState(db, "episode_urls_src", listText + "\u0001" + stText);
  if (src.same) return { skipped: "unveraendert", imported: 0, state: 0 };
  let written = 0;
  const changes = (res) => (res || []).reduce((a, x) => a + (x?.meta?.changes || 0), 0);
  for (let i = 0; i < ok.length; i += 50)
    written += changes(await db.batch(ok.slice(i, i + 50).map((x) => db.prepare("INSERT INTO episode_urls(spreaker_episode_id,show_id,lang,slug,url) VALUES(?,?,?,?,?) ON CONFLICT(spreaker_episode_id) DO UPDATE SET show_id=excluded.show_id,lang=excluded.lang,slug=excluded.slug,url=excluded.url WHERE episode_urls.show_id IS NOT excluded.show_id OR episode_urls.lang IS NOT excluded.lang OR episode_urls.slug IS NOT excluded.slug OR episode_urls.url IS NOT excluded.url")
      .bind(String(x.spreaker_episode_id), +x.show_id || 0, x.lang, String(x.slug || "").slice(0, 200), x.url))));
  let applied = 0;
  if (st?.episodes) {
    const rows = Object.entries(st.episodes).filter(([id, v]) => /^\d+$/.test(id) && v && STATUSES.has(v.s));
    const t = (s) => { const n = Date.parse(s || ""); return Number.isFinite(n) ? Math.floor(n / 1000) : 0; };
    for (let i = 0; i < rows.length; i += 50)
      written += changes(await db.batch(rows.slice(i, i + 50).map(([id, v]) => db.prepare("INSERT INTO episode_urls(spreaker_episode_id,show_id,url_on_spreaker,checked_at,status,title,fields) VALUES(?,?,?,?,?,?,?) ON CONFLICT(spreaker_episode_id) DO UPDATE SET url_on_spreaker=excluded.url_on_spreaker,checked_at=excluded.checked_at,status=excluded.status,title=CASE WHEN excluded.title<>'' THEN excluded.title ELSE episode_urls.title END,fields=excluded.fields WHERE episode_urls.url_on_spreaker IS NOT excluded.url_on_spreaker OR episode_urls.checked_at IS NOT excluded.checked_at OR episode_urls.status IS NOT excluded.status OR (excluded.title<>'' AND episode_urls.title IS NOT excluded.title) OR episode_urls.fields IS NOT excluded.fields")
        .bind(id, +v.h || 0, String(v.u || "").slice(0, 500), t(v.c), v.s, String(v.t || "").slice(0, 200), Array.isArray(v.f) ? v.f.filter((x) => /^[a-z_]{1,40}$/.test(x)).join(",") : ""))));
    applied = rows.length;
    if (st.run) await db.prepare("INSERT INTO meta(k,v) VALUES('episode_urls_run',?) ON CONFLICT(k) DO UPDATE SET v=excluded.v WHERE meta.v<>excluded.v").bind(JSON.stringify(st.run).slice(0, 2000)).run().catch(() => 0);
  }
  // Erst nach dem Zustand: eine Folge, deren Adresse sich seit dem letzten Abgleich geaendert hat, ist wieder offen (Wert bei Spreaker passt nicht
  // mehr zur Adresse). Vorher gesetzt, wuerde der noch alte Zustand ("ok" mit der alten Adresse) es im selben Import wieder zuruecksetzen.
  // Schlaegt dieses UPDATE fehl (z. B. D1 overloaded), bleibt der Fingerabdruck ungespeichert: der naechste Lauf rechnet neu, statt "unveraendert".
  const diffOk = await db.prepare("UPDATE episode_urls SET status='differs' WHERE status='ok' AND url<>'' AND rtrim(url_on_spreaker,'/')<>rtrim(url,'/')").run().then(() => true, () => false);
  if (diffOk) await src.commit();
  return { imported: ok.length, state: applied, written, ...(diffOk ? {} : { retry: "differs-Abgleich fehlgeschlagen" }) };
}

export async function episodeUrlsOverview(db) {
  const counts = {};
  for (const r of (await db.prepare("SELECT status, COUNT(*) n FROM episode_urls GROUP BY status").all().catch(() => ({ results: [] }))).results || []) counts[r.status] = r.n;
  const differs = (await db.prepare("SELECT spreaker_episode_id id, lang, url, url_on_spreaker FROM episode_urls WHERE status='differs' ORDER BY spreaker_episode_id DESC LIMIT 20").all().catch(() => ({ results: [] }))).results || [];
  let run = null; try { run = JSON.parse((await db.prepare("SELECT v FROM meta WHERE k='episode_urls_run'").first().catch(() => null))?.v || "null"); } catch { /* leer */ }
  return { ok: counts.ok || 0, differs: counts.differs || 0, missing: counts.missing || 0, skipped: counts.skipped || 0, error: counts.error || 0, unknown: counts.unknown || 0, total: Object.values(counts).reduce((a, b) => a + b, 0), differs_sample: differs, last_run: run };
}

// Liste je Status fuer die klickbaren Kacheln im Admin-Reiter (nur Admin, adminpanel.js): Titel, Sprache/Show, Wert bei Spreaker, Soll-Adresse, was abweicht.
const LIST_STATUS = new Set(["ok", "differs", "missing", "skipped", "error", "unknown"]);
export async function episodeUrlsList(db, status, offset = 0, q = "") {
  if (!LIST_STATUS.has(status)) return { error: "bad_status" };
  const off = Math.max(0, Math.min(100000, Math.floor(+offset || 0))), like = "%" + String(q || "").trim().slice(0, 80).replace(/[%_]/g, "") + "%";
  const where = "status=? AND (?='%%' OR title LIKE ? OR url LIKE ? OR spreaker_episode_id LIKE ?)";
  const total = (await db.prepare(`SELECT COUNT(*) n FROM episode_urls WHERE ${where}`).bind(status, like, like, like, like).first().catch(() => null))?.n || 0;
  const items = ((await db.prepare(`SELECT spreaker_episode_id id, show_id, lang, slug, title, url, url_on_spreaker, fields, checked_at FROM episode_urls WHERE ${where} ORDER BY show_id, CAST(spreaker_episode_id AS INTEGER) DESC LIMIT 100 OFFSET ?`)
    .bind(status, like, like, like, like, off).all().catch(() => ({ results: [] }))).results || []).map((r) => ({ ...r, fields: r.fields ? r.fields.split(",") : [], spreaker: "https://www.spreaker.com/episode/" + r.id }));
  return { status, total, offset: off, items };
}
