// T15: Content-Pakete (imports/blog/<sprache>/<slug>.md, im Seitenbau geprueft und gerendert) in blog_posts uebernehmen.
// Quelle: SITE/blog-content/index.json (site_content_blog.py, nur freigegebene Pakete). Neue Beitraege: publish=true -> 'live',
// sonst 'pending' (Freigabe in der Verwaltung, Blog-Pruefung). Geaenderte Pakete (anderer hash) erneuern nur Beitraege, die seit der
// letzten Uebernahme niemand im Editor geaendert hat; ein spaeter gesetztes publish-Flag schaltet einen wartenden Beitrag live.
// Nichts wird geloescht: ein Paket, das aus dem Index verschwindet, laesst den Beitrag unveraendert.
import { ensureSectionCols } from "./sections.js";

const BATCH = 40;
const clean = (s, n) => String(s || "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").slice(0, n);
const vals = (p) => [clean(p.title, 140), clean(p.summary, 300), clean(p.html, 900000), JSON.stringify((p.topics || []).filter((x) => typeof x === "string").slice(0, 10)),
  JSON.stringify((p.faq || []).filter((q) => q && q.q && q.a).slice(0, 10).map((q) => ({ q: clean(q.q, 200), a: clean(q.a, 600) })))];
const SLUG = /^[a-z0-9][a-z0-9-]{1,100}$/, LANG = /^[a-z]{2}$/;

export async function importContentBlog(env, now = () => Math.floor(Date.now() / 1000)) {
  const db = env.DB; await ensureSectionCols(db);
  const idx = await fetch(env.SITE + "/blog-content/index.json", { cf: { cacheTtl: 60 } }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  const items = Array.isArray(idx?.items) ? idx.items : [];
  const res = { created: 0, updated: 0, published: 0, skipped: 0 };
  const owners = new Map();
  // Ein Abfrage-Satz statt einer Abfrage je Paket: bekannte Pakete (content_import + Beitrag) einmal laden. Bei ueber 200 Paketen sparte das
  // im Cron-Lauf hunderte D1-Anfragen (D1 meldete "overloaded", der Lauf blieb in cron_runs auf "laeuft"). Unveraenderte Pakete kosten jetzt nichts.
  const known = new Map();
  for (const r of (await db.prepare("SELECT ci.k k,ci.post_id post_id,ci.hash hash,ci.imported imported,b.status status,b.updated updated FROM content_import ci LEFT JOIN blog_posts b ON b.id=ci.post_id").all()).results || []) known.set(r.k, r);
  res.seen = items.length;
  for (const p of items.slice(0, 500)) {
    if (res.created + res.updated >= BATCH) break;
    const slug = String(p.slug || "").toLowerCase(), lang = String(p.lang || "");
    if (!SLUG.test(slug) || !LANG.test(lang) || !p.title || !p.html || /<\s*(script|iframe|style|form)/i.test(p.html) || !p.hash) { res.skipped++; continue; }
    const k = `${lang}/${slug}`, prev = known.get(k);
    if (prev) {
      if (prev.status == null) { res.skipped++; continue; }   // Beitrag geloescht: nichts neu anlegen
      const edited = prev.updated > prev.imported;   // im Editor oder in der Verwaltung geaendert: Inhalt bleibt, wie er ist (dauerhaft)
      const changed = prev.hash !== String(p.hash) && !edited, promote = p.publish && prev.status === "pending" && !edited;
      if (!changed && !promote) continue;   // nichts zu tun: keine weitere Abfrage
      const t = now(), pub = Number(p.published) || t;
      if (changed) {
        await db.prepare("UPDATE blog_posts SET title=?,summary=?,html=?,topics=?,faq=?,updated=? WHERE id=?").bind(...vals(p), t, prev.post_id).run();
        res.updated++;
      }
      if (promote) {
        await db.prepare("UPDATE blog_posts SET status='live',published=COALESCE(NULLIF(published,0),?),updated=? WHERE id=?").bind(pub, t, prev.post_id).run();
        res.published++;
      }
      await db.prepare("UPDATE content_import SET hash=?,imported=? WHERE k=?").bind(String(p.hash), t, k).run();
      continue;
    }
    const handle = String(p.author || "mirko-p").toLowerCase();
    if (!owners.has(handle)) owners.set(handle, (await db.prepare("SELECT p.user_id uid FROM profiles p JOIN users u ON u.id=p.user_id AND u.banned=0 WHERE p.handle=?").bind(handle).first())?.uid || 0);
    const uid = owners.get(handle);
    if (!uid) { res.skipped++; continue; }
    const t = now(), pub = Number(p.published) || t;
    const ex = await db.prepare("SELECT id FROM blog_posts WHERE user_id=? AND slug=?").bind(uid, slug).first();
    if (ex) { res.skipped++; continue; }   // Slug schon von Hand vergeben: nicht ueberschreiben
    const st = p.publish ? "live" : "pending", v = vals(p);
    await db.prepare("INSERT INTO blog_posts(user_id,slug,title,summary,body,html,lang,topics,keypoints,faq,status,note,created,updated,published) VALUES(?,?,?,?,'',?,?,?,'[]',?,?,'content-import',?,?,?)")
      .bind(uid, slug, v[0], v[1], v[2], lang, v[3], v[4], st, t, t, st === "live" ? pub : 0).run();
    const row = await db.prepare("SELECT id FROM blog_posts WHERE user_id=? AND slug=?").bind(uid, slug).first();
    await db.prepare("INSERT INTO content_import(k,post_id,hash,imported) VALUES(?,?,?,?)").bind(k, row.id, String(p.hash), t).run();
    res.created++; if (st === "live") res.published++;
  }
  return res;
}
