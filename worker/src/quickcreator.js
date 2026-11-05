// QuickCreator "HTTP Exporter" -> Blog von M365.FM. QuickCreator schickt fertige Beitraege per POST (JSON, Inhalt als HTML)
// mit "Authorization: Bearer <Token>" an /api/blog/quickcreator. Der Token steht nur als Worker-Secret QUICKCREATOR_TOKEN.
// Neue Beitraege kommen als 'pending' an (Freigabe in der Verwaltung unter Blog-Pruefung), Autor ist das Profil aus
// QUICKCREATOR_AUTHOR (Standard mirko-p). Ein erneuter Export derselben postId erneuert den Beitrag, solange ihn niemand im
// Editor geaendert hat (wie contentblog.js). Nichts wird geloescht. Das HTML wird hier streng bereinigt, weil der Seitenbau
// uebernommenes HTML unveraendert ausgibt (site_blog.py).
import { ensureSectionCols } from "./sections.js";
import { isLang } from "./util.js";

const now = () => Math.floor(Date.now() / 1000);
const clean = (s, n) => String(s ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, n);
const plain = (s, n) => clean(String(s ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " "), n);
const slugify = (t) => String(t || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const LANG = /^[a-z]{2}$/;

// ---------- HTML bereinigen (Allowlist) ----------
const KEEP = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "a", "strong", "b", "em", "i", "u", "s", "blockquote", "code", "pre",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "img", "figure", "figcaption", "br", "hr", "span", "div", "sup", "sub", "dl", "dt", "dd", "mark", "small"]);
const DROP_WITH_CONTENT = new Set(["script", "style", "iframe", "object", "embed", "noscript", "template", "svg", "math", "form", "select", "textarea", "button", "video", "audio", "canvas", "head", "title"]);
const ATTRS = { a: ["href", "title"], img: ["src", "alt", "title", "width", "height"], th: ["colspan", "rowspan"], td: ["colspan", "rowspan"], ol: ["start"] };
const okUrl = (u, img) => img ? /^https:\/\//i.test(u) : /^(https?:\/\/|\/|#|mailto:)/i.test(u);

export function sanitizeHtml(html) {
  let s = String(html || "").replace(/<!--[\s\S]*?-->/g, "");
  for (const t of DROP_WITH_CONTENT) s = s.replace(new RegExp(`<${t}\\b[\\s\\S]*?<\\/${t}\\s*>`, "gi"), "");
  return s.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (m, tag, rest) => {
    const t = tag.toLowerCase(), closing = m[1] === "/";
    if (!KEEP.has(t)) return "";
    if (closing) return `</${t}>`;
    const out = [];
    for (const a of rest.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g)) {
      const name = a[1].toLowerCase(), val = (a[3] ?? a[4] ?? a[5] ?? "").replace(/[\u0000-\u001f]/g, "").trim();
      if (!(ATTRS[t] || []).includes(name)) continue;
      if ((name === "href" || name === "src") && !okUrl(val, t === "img")) continue;
      if ((name === "width" || name === "height" || name === "colspan" || name === "rowspan" || name === "start") && !/^\d{1,4}$/.test(val)) continue;
      out.push(`${name}="${val.replace(/&(?!(?:[a-z]+|#\d+|#x[0-9a-f]+);)/gi, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")}"`);
    }
    if (t === "img" && !out.some((x) => x.startsWith("src="))) return "";
    if (t === "a" && /^https?:/i.test((out.find((x) => x.startsWith("href=")) || "").slice(6))) out.push('rel="noopener"');
    if (t === "img") out.push('loading="lazy"');
    return `<${t}${out.length ? " " + out.join(" ") : ""}>`;
  }).replace(/\n{3,}/g, "\n\n").trim();
}

// ---------- Token pruefen (laufzeitkonstant) ----------
async function sameToken(a, b) {
  const enc = new TextEncoder(), [x, y] = await Promise.all([a, b].map((v) => crypto.subtle.digest("SHA-256", enc.encode(String(v)))));
  const u = new Uint8Array(x), v = new Uint8Array(y); let d = 0;
  for (let i = 0; i < u.length; i++) d |= u[i] ^ v[i];
  return d === 0;
}

async function ensureTable(db) {
  await db.prepare("CREATE TABLE IF NOT EXISTS quickcreator_import (ext_id TEXT PRIMARY KEY, post_id INTEGER NOT NULL, hash TEXT NOT NULL, imported INTEGER NOT NULL)").run();
}

const pick = (b, ...keys) => { for (const k of keys) if (b[k] !== undefined && b[k] !== null && b[k] !== "") return b[k]; return undefined; };
async function hashOf(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].slice(0, 12).map((x) => x.toString(16).padStart(2, "0")).join("");
}

export async function handleQuickCreator(env, request, url, path, J) {
  if (path !== "/api/blog/quickcreator") return null;
  if (request.method !== "POST" && request.method !== "PUT") return J({ error: "method" }, 405);
  const secret = String(env.QUICKCREATOR_TOKEN || "");
  if (!secret) return J({ error: "not_configured" }, 503);
  const auth = request.headers.get("authorization") || "", given = auth.replace(/^Bearer\s+/i, "").trim() || (request.headers.get("x-api-key") || "").trim();
  if (!given || !(await sameToken(given, secret))) return J({ error: "unauthorized" }, 401);

  const b = await request.json().catch(() => null);
  if (!b || typeof b !== "object") return J({ error: "bad_json" }, 400);
  const ext = clean(pick(b, "postId", "id"), 80), title = plain(pick(b, "title"), 140);
  const raw = String(pick(b, "content", "html") || "");
  if (!ext || title.length < 5 || raw.length < 50) return J({ error: "missing_fields", need: ["postId", "title", "content"] }, 400);
  if (raw.length > 900000) return J({ error: "too_large" }, 413);
  const html = sanitizeHtml(raw);
  if (plain(html, 100000).length < 200) return J({ error: "too_short" }, 400);
  const rawLang = String(pick(b, "lang", "language", "locale") || url.searchParams.get("lang") || "en").toLowerCase();
  const lang = rawLang.slice(0, 2);   // "en-US" -> "en"
  if (!LANG.test(rawLang.split(/[-_]/)[0]) || !(lang === "en" || isLang(lang))) return J({ error: "bad_lang" }, 400);
  const summary = plain(pick(b, "metaDescription", "description", "excerpt", "summary") || "", 300);
  const slug = slugify(pick(b, "slug") || title) || "post";
  let pub = Number(pick(b, "publishTime", "publishedAt", "publish_time")) || 0;
  if (pub > 1e12) pub = Math.floor(pub / 1000);   // QuickCreator schickt Millisekunden
  if (pub < 946684800 || pub > now() + 366 * 86400) pub = 0;

  const db = env.DB; await ensureSectionCols(db); await ensureTable(db);
  const handle = String(env.QUICKCREATOR_AUTHOR || "mirko-p").toLowerCase();
  const owner = await db.prepare("SELECT p.user_id uid FROM profiles p JOIN users u ON u.id=p.user_id AND u.banned=0 WHERE p.handle=?").bind(handle).first();
  if (!owner) return J({ error: "author_missing", handle }, 500);
  const uid = owner.uid, t = now(), hash = await hashOf(JSON.stringify([title, summary, html, slug, lang]));
  const prev = await db.prepare("SELECT post_id,hash,imported FROM quickcreator_import WHERE ext_id=?").bind(ext).first();
  const base = (handle, l, s) => `${env.SITE || ""}${l === "en" ? "" : "/" + l}/community/u/${handle}/blog/${s}/`;

  if (prev) {
    const cur = await db.prepare("SELECT id,slug,lang,status,updated FROM blog_posts WHERE id=?").bind(prev.post_id).first();
    if (cur) {
      if (cur.updated > prev.imported) return J({ ok: true, id: cur.id, status: cur.status, unchanged: "edited_on_site", url: base(handle, cur.lang, cur.slug) });
      if (prev.hash === hash) return J({ ok: true, id: cur.id, status: cur.status, unchanged: "same_content", url: base(handle, cur.lang, cur.slug) });
      await db.prepare("UPDATE blog_posts SET title=?,summary=?,html=?,lang=?,updated=? WHERE id=?").bind(title, summary, html, lang, t, cur.id).run();
      await db.prepare("UPDATE quickcreator_import SET hash=?,imported=? WHERE ext_id=?").bind(hash, t, ext).run();
      return J({ ok: true, id: cur.id, status: cur.status, updated: true, url: base(handle, lang, cur.slug) });
    }
    await db.prepare("DELETE FROM quickcreator_import WHERE ext_id=?").bind(ext).run();   // Beitrag wurde auf der Seite geloescht: neu anlegen
  }

  let s = slug, n = 1;
  while (await db.prepare("SELECT 1 x FROM blog_posts WHERE user_id=? AND slug=?").bind(uid, s).first()) s = `${slug.slice(0, 72)}-${++n}`;
  await db.prepare("INSERT INTO blog_posts(user_id,slug,title,summary,body,html,lang,topics,keypoints,faq,status,note,created,updated,published) VALUES(?,?,?,?,'',?,?,'[]','[]','[]','pending','quickcreator',?,?,?)")
    .bind(uid, s, title, summary, html, lang, t, t, pub).run();
  const row = await db.prepare("SELECT id FROM blog_posts WHERE user_id=? AND slug=?").bind(uid, s).first();
  await db.prepare("INSERT INTO quickcreator_import(ext_id,post_id,hash,imported) VALUES(?,?,?,?)").bind(ext, row.id, hash, t).run();
  return J({ ok: true, id: row.id, status: "pending", created: true, url: base(handle, lang, s) }, 201);
}
