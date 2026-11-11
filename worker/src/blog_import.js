// Blog-Import (BLOG_OWN_DOMAIN.md): RSS- oder Atom-Feed einer bestehenden Seite einlesen -> ENTWUERFE im Blog des Mitglieds. Nie automatisch veroeffentlicht.
// Regeln: Quelle immer als {{ref|...}} im Text; Bilder werden nie kopiert (nur gezaehlt, Hinweis im Entwurf); Volltext nur mit der ausdruecklichen Bestaetigung
// "Ich habe die Rechte an diesen Texten" (Standard: nur Titel, Kurzfassung und Quelle). Hinter dem Schalter BYOD (Standard aus).
import { cleanText, BOT_UA, rateLimit, audit, isLang } from "./util.js";
import { byodOn, normHost, isOwnHost } from "./byod_rules.js";
import { sanitize, MAX_BODY } from "./wiki.js";
import { slugify } from "./blog.js";
import { ensureSectionCols } from "./sections.js";

const MAX_ITEMS = 30, MAX_PICK = 20, MAX_FEED = 800000, MAX_HTML = 60000, DAY_CAP = 60;
const now = () => Math.floor(Date.now() / 1000);
const okLang = (l) => l === "en" || isLang(l);
const dec = (s) => String(s).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Math.min(+n, 0x10ffff))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(Math.min(parseInt(n, 16), 0x10ffff)))
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
const tag = (blk, name) => { const m = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i").exec(blk); return m ? m[1] : ""; };
const plain = (s, n) => cleanText(dec(s).replace(/<[^>]*>/g, " ").replace(/https?:\/\/\S+/gi, "").replace(/\s+/g, " ").trim(), n).replace(/[<>{}\[\]|]/g, "");

// ---------- Feed-Adresse und Abruf ----------
// https, ordentlicher Hostname (keine IP, kein localhost), nicht m365.fm selbst, keine Zugangsdaten. -> geprueft Adresse oder ""
export function feedUrl(raw) {
  const s = String(raw ?? "").trim(); if (!s || s.length > 300) return "";
  let u; try { u = new URL(s); } catch { return ""; }
  const h = normHost(u.hostname);
  if (u.protocol !== "https:" || u.username || u.password || !h || isOwnHost(h)) return "";
  u.hash = ""; return u.href;
}

async function readCapped(r, max) {
  if (!r.body || !r.body.getReader) return (await r.text()).slice(0, max);
  const rd = r.body.getReader(), dc = new TextDecoder(); let out = "", n = 0;
  for (;;) { const { done, value } = await rd.read(); if (done) break; n += value.length; out += dc.decode(value, { stream: true }); if (n >= max) { try { await rd.cancel(); } catch {} break; } }
  return out.slice(0, max);
}
export async function fetchFeed(raw, fetchImpl = fetch) {
  const url = feedUrl(raw); if (!url) return { error: "bad_feed_url" };
  const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 7000);
  try {
    const r = await fetchImpl(url, { signal: ctl.signal, redirect: "follow", headers: { "user-agent": BOT_UA, accept: "application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8" } });
    if (!feedUrl(r.url || url)) return { error: "bad_feed_url" };   // Weiterleitung auf einen unzulaessigen Host
    if (!r.ok) return { error: "feed_http" };
    const xml = await readCapped(r, MAX_FEED);
    if (!/<(rss|feed|rdf:RDF)[\s>]/i.test(xml.slice(0, 5000))) return { error: "not_a_feed" };
    return { url, xml };
  } catch { return { error: "feed_unreachable" }; } finally { clearTimeout(to); }
}

// ---------- Feed lesen ----------
// -> { title, items: [{ key, title, url, t, summary, html, images }] }. Nur https-Beitragsadressen; html ist der Inhalt des Feeds (content:encoded / Atom content), hoechstens 60.000 Zeichen.
export function parseImportFeed(xml, max = MAX_ITEMS) {
  const head = xml.replace(/<(item|entry)[\s>][\s\S]*$/i, "");
  const title = plain(tag(head, "title"), 140);
  const blocks = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) || [], items = [], seen = new Set();
  for (const b of blocks) {
    if (items.length >= max) break;
    const alt = /<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i.exec(b) || /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']alternate["']/i.exec(b) || /<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i.exec(b);
    let link = alt ? dec(alt[1]).trim() : dec(tag(b, "link")).trim();
    try { const u = new URL(link); const h = normHost(u.hostname); if (u.protocol !== "https:" || u.username || u.password || !h) continue; u.hash = ""; link = u.href; } catch { continue; }
    if (link.length > 400) continue;
    const t0 = plain(tag(b, "title"), 200).replace(/\s+/g, " ");
    const ds = dec(tag(b, "pubDate") || tag(b, "published") || tag(b, "updated") || tag(b, "dc:date")).trim();
    let t = Date.parse(ds); t = Number.isFinite(t) ? Math.floor(t / 1000) : now();
    const rawHtml = tag(b, "content:encoded") || tag(b, "content"), html = dec(rawHtml).slice(0, MAX_HTML);
    const summary = plain(tag(b, "summary") || tag(b, "description") || rawHtml, 600);
    const key = cleanText(dec(tag(b, "guid") || tag(b, "id")).trim() || link, 400);
    if (seen.has(key)) continue; seen.add(key);
    items.push({ key, title: t0, url: link, t: Math.min(t, now()), summary, html, images: (html.match(/<img\b/gi) || []).length });
  }
  return { title, items };
}

// ---------- HTML -> Wiki-Markup (kleine sichere Teilmenge) ----------
// Erlaubt: Ueberschriften (## und ###), Absaetze, Listen, Zitate, fett, kursiv. Links werden zu Text, Bilder entfallen (nur gezaehlt), Skripte und Formulare fallen weg.
export function htmlToWiki(html, max = MAX_BODY - 400) {
  let s = String(html || "").replace(/<(script|style|iframe|noscript|form|svg|object|embed|template|head)\b[\s\S]*?<\/\1\s*>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ");
  const images = (s.match(/<img\b/gi) || []).length;
  s = s.replace(/<img\b[^>]*>/gi, " ").replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi, "**$2**").replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi, "*$2*")
    .replace(/<h[12]\b[^>]*>([\s\S]*?)<\/h[12]\s*>/gi, "\n\n## $1\n\n").replace(/<h[3-6]\b[^>]*>([\s\S]*?)<\/h[3-6]\s*>/gi, "\n\n### $1\n\n")
    .replace(/<li\b[^>]*>/gi, "\n- ").replace(/<\/(ul|ol)\s*>/gi, "\n\n").replace(/<blockquote\b[^>]*>/gi, "\n\n\u0001 ").replace(/<\/blockquote\s*>/gi, "\n\n")
    .replace(/<(br|hr)\b[^>]*\/?>/gi, "\n").replace(/<\/(p|div|section|article|pre|table|tr|figure|figcaption)\s*>/gi, "\n\n").replace(/<[^>]+>/g, "");
  s = dec(s).replace(/\{\{|\}\}|\[\[|\]\]/g, "").replace(/https?:\/\/\S+/gi, "").replace(/www\.\S+/gi, "").replace(/[<>]/g, "").replace(/\u0001/g, ">").replace(/\r/g, "").replace(/[ \t ]+/g, " ");
  const lines = s.split("\n").map((l) => l.trim()), out = [];
  for (const l of lines) { if (!l) { if (out.length && out[out.length - 1] !== "") out.push(""); continue; } out.push(l.replace(/^[-*]\s*$/, "")); }
  let text = out.join("\n").replace(/\n{3,}/g, "\n\n").trim(), truncated = false;
  if (text.length > max) { truncated = true; text = text.slice(0, max); const i = text.lastIndexOf("\n\n"); if (i > max * 0.6) text = text.slice(0, i); text = text.trim(); }
  return { body: text, images, truncated };
}

// ---------- Entwurf bauen ----------
const SRC = { en: "Originally published at", de: "Ursprünglich veröffentlicht bei" };
const refTitle = (s) => String(s).replace(/[|{}\[\]]/g, " ").replace(/\s+/g, " ").trim().slice(0, 200);
export function buildDraft(item, { mode, lang }) {
  const host = normHost(new URL(item.url).hostname).replace(/^www\./, ""), date = new Date(item.t * 1000).toISOString().slice(0, 10);
  const attr = `${SRC[lang === "de" ? "de" : "en"]} {{ref|${refTitle(item.title)}|${item.url}|${host}|${date}}}.`;
  let body, excerptOnly = mode !== "full", images = 0, truncated = false;
  if (mode === "full" && item.html) { const w = htmlToWiki(item.html); images = w.images; truncated = w.truncated; body = w.body ? `${attr}\n\n${w.body}` : ""; if (!body) excerptOnly = true; }
  else excerptOnly = true;
  if (excerptOnly) body = item.summary ? `${attr}\n\n${item.summary}` : attr;
  const sb = sanitize(body); if (sb.err) return { error: sb.err };
  const note = [`import:${host}`, excerptOnly ? (mode === "full" ? "no_full_text" : "excerpt") : "full", images ? `images_not_copied:${images}` : "", truncated ? "truncated" : ""].filter(Boolean).join(" ");
  return { title: item.title.slice(0, 140), summary: item.summary.slice(0, 300), body: sb.body, note, excerptOnly, images, truncated };
}

export async function handleBlogImport(env, request, url, path, user, J) {
  if (path !== "/api/byod/import/preview" && path !== "/api/byod/import/save") return null;
  if (request.method !== "POST") return J({ error: "method_not_allowed" }, 405);
  if (!byodOn(env)) return J({ error: "disabled" }, 404);
  if (!user) return J({ error: "login" }, 401);
  const db = env.DB, b = await request.json().catch(() => ({}));
  const known = async (keys) => new Set(((await db.prepare(`SELECT item_key FROM blog_import_items WHERE user_id=? AND item_key IN (${keys.map(() => "?").join(",") || "''"})`).bind(user.id, ...keys).all()).results || []).map((r) => r.item_key));

  if (path === "/api/byod/import/preview") {
    if (!(await rateLimit(db, `byodimpv:${user.id}`, 20, 3600))) return J({ error: "rate_limit" }, 429);
    const f = await fetchFeed(b.feed_url); if (f.error) return J({ error: f.error }, 400);
    const p = parseImportFeed(f.xml); if (!p.items.length) return J({ error: "no_items" }, 400);
    const have = await known(p.items.map((i) => i.key));
    return J({ ok: true, feed: { url: f.url, title: p.title }, items: p.items.map((i) => ({ key: i.key, title: i.title, url: i.url, date: new Date(i.t * 1000).toISOString().slice(0, 10), summary: i.summary.slice(0, 200), has_full: i.html.length > 200, images: i.images, imported: have.has(i.key) })) });
  }

  // save
  if (!(await rateLimit(db, `byodimps:${user.id}`, 10, 3600))) return J({ error: "rate_limit" }, 429);
  const mode = b.mode === "full" ? "full" : "excerpt", lang = String(b.lang || "en");
  if (mode === "full" && b.rights !== true) return J({ error: "rights_required" }, 400);   // Volltext nur mit der Bestaetigung der Rechte
  if (!okLang(lang)) return J({ error: "bad_lang" }, 400);
  const keys = [...new Set((Array.isArray(b.keys) ? b.keys : []).map((k) => String(k)).filter(Boolean))].slice(0, MAX_PICK);
  if (!keys.length) return J({ error: "nothing_selected" }, 400);
  const t = now(), day = (await db.prepare("SELECT COUNT(*) n FROM blog_import_items WHERE user_id=? AND imported>?").bind(user.id, t - 86400).first()).n;
  if (day + keys.length > DAY_CAP) return J({ error: "rate_limit" }, 429);
  const f = await fetchFeed(b.feed_url); if (f.error) return J({ error: f.error }, 400);   // der Inhalt kommt immer frisch vom Feed, nie vom Browser
  const byKey = new Map(parseImportFeed(f.xml).items.map((i) => [i.key, i]));
  await ensureSectionCols(db);
  const have = await known(keys), created = [], skipped = [];
  for (const k of keys) {
    const it = byKey.get(k);
    if (!it) { skipped.push({ key: k, reason: "not_in_feed" }); continue; }
    if (have.has(k)) { skipped.push({ key: k, reason: "already_imported" }); continue; }
    if (it.title.length < 5) { skipped.push({ key: k, reason: "title_short" }); continue; }
    const d = buildDraft(it, { mode, lang }); if (d.error) { skipped.push({ key: k, reason: d.error }); continue; }
    let slug = slugify(it.title) || "post", n = 1;
    while (await db.prepare("SELECT 1 x FROM blog_posts WHERE user_id=? AND slug=?").bind(user.id, slug).first()) slug = `${(slugify(it.title) || "post").slice(0, 52)}-${++n}`;
    const r = await db.prepare("INSERT INTO blog_posts(user_id,slug,title,summary,body,lang,topics,keypoints,faq,status,note,created,updated,published) VALUES(?,?,?,?,?,?,'[]','[]','[]','draft',?,?,?,0)")
      .bind(user.id, slug, d.title, d.summary, d.body, lang, d.note, Math.min(it.t, t), t).run();   // created = Datum des Originals: zaehlt nicht zum Tageslimit des Blogs
    await db.prepare("INSERT INTO blog_import_items(user_id,item_key,source_url,feed_url,post_id,mode,rights,imported) VALUES(?,?,?,?,?,?,?,?)").bind(user.id, k, it.url, f.url, r.meta.last_row_id, d.excerptOnly ? "excerpt" : "full", d.excerptOnly ? 0 : 1, t).run();
    created.push({ id: r.meta.last_row_id, slug, title: d.title, mode: d.excerptOnly ? "excerpt" : "full", images_not_copied: d.images, truncated: d.truncated });
  }
  if (created.length) await audit(db, user.id, "blog.import", f.url, `${mode} rights=${mode === "full" ? 1 : 0} n=${created.length}`);
  return J({ ok: true, created, skipped, status: "draft" });
}
