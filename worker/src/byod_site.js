// Blog auf der eigenen Domain ausliefern (BLOG_OWN_DOMAIN.md): Startseite = Beitragsliste, /<slug>/ = Beitrag, /feed.xml, /sitemap.xml, /robots.txt.
// Nur fuer Hosts mit Status 'active' in blog_domains, nur fuer oeffentliche Profile ohne Sperre. Die Seiten setzen keine Cookies, laden kein Skript,
// keine Schrift und keine fremden Bilder (Content-Security-Policy). Ohne Treffer: null (der Aufrufer antwortet neutral mit 404, nie mit einer Weiterleitung).
import { esc } from "./util.js";
import { normHost, isOwnHost } from "./byod_rules.js";

const SLUG = /^[a-z0-9][a-z0-9-]{0,100}$/;
const DEFAULT_INDEX_VOTES = 10;   // wie INDEX_VOTES in site_blog.py (Regel: Beitrag erst ab 10 Upvotes in Index und Sitemap)
const IMG_HOST = "https://img.m365.fm/";   // Bilder nur aus dem eigenen R2-Bucket (CLAUDE.md)
const CSP = "default-src 'none'; img-src https://img.m365.fm data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
const parse = (s, d) => { try { return JSON.parse(s); } catch { return d; } };

// Kleine Oberflaechentexte (en/de, alle anderen Sprachen zeigen Englisch; die Beitraege selbst bleiben in ihrer Sprache)
const TX = {
  en: { by: "By", sources: "Sources", posts: "Posts", empty: "No posts yet.", rss: "RSS feed", imprint: "Legal notice", privacy: "Privacy", hosted: "Hosted on", platform_legal: "Legal notice of m365.fm", platform_privacy: "Privacy policy of m365.fm",
    cn: "citation needed", more: "Read the full post on m365.fm", nocookie: "This site sets no cookies and loads no third-party content.", updated: "Updated", home: "Home", notfound: "Page not found", back: "Back to the blog" },
  de: { by: "Von", sources: "Quellen", posts: "Beiträge", empty: "Noch keine Beiträge.", rss: "RSS-Feed", imprint: "Impressum", privacy: "Datenschutz", hosted: "Gehostet auf", platform_legal: "Impressum von m365.fm", platform_privacy: "Datenschutzerklärung von m365.fm",
    cn: "Beleg fehlt", more: "Den ganzen Beitrag auf m365.fm lesen", nocookie: "Diese Seite setzt keine Cookies und lädt keine Inhalte von Dritten.", updated: "Aktualisiert", home: "Startseite", notfound: "Seite nicht gefunden", back: "Zurück zum Blog" },
};
const tx = (lang) => TX[lang === "de" ? "de" : "en"];
const iso = (ts) => new Date(ts * 1000).toISOString().slice(0, 10);
const rfc = (ts) => new Date(ts * 1000).toUTCString();
const ldJson = (o) => JSON.stringify(o).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");

// ---------- Wiki-Markup -> HTML (Spiegel von site_learn.wiki_render, ohne Skript, mit Bildern nur aus dem R2-Bucket) ----------
const INL = /\{\{img\|([^{}|]*)\|([^{}]*)\}\}|\{\{ref\|([^{}]*)\}\}|\{\{cn\}\}|\[\[([a-z0-9-]{2,48})(?:\|([^\[\]]{1,80}))?\]\]|\*\*([^*]+?)\*\*|\*([^*\s][^*]*?)\*/;
export function wikiToHtml(body, { site, lang = "en" } = {}) {
  const t = tx(lang), refs = [], keys = new Map(), seen = new Set();
  const inline = (text) => {
    let out = "";
    while (text) {
      const m = INL.exec(text);
      if (!m) { out += esc(text); break; }
      out += esc(text.slice(0, m.index));
      const g = m[0];
      if (g.startsWith("{{img|")) {
        const u = m[1].trim(), alt = m[2].trim();
        out += u.startsWith(IMG_HOST) && !/["'<>\s]/.test(u) ? `<img src="${esc(u)}" alt="${esc(alt)}" loading="lazy" decoding="async" style="max-width:100%;height:auto">` : `<em>${esc(alt)}</em>`;   // fremde Bildhosts: nur der Alt-Text
      } else if (g.startsWith("{{ref|")) {
        const p = m[3].split("|"); while (p.length < 4) p.push("");
        const k = p[1] + "|" + p[0]; let n = keys.get(k);
        if (!n) { refs.push({ title: p[0], url: p[1], pub: p[2], date: p[3] }); n = refs.length; keys.set(k, n); }
        const idattr = seen.has(n) ? "" : ` id="fn-${n}"`; seen.add(n);
        out += `<sup><a href="#ref-${n}"${idattr}>[${n}]</a></sup>`;
      } else if (g === "{{cn}}") out += `<sup>[${esc(t.cn)}]</sup>`;
      else if (m[4]) out += `<a href="${esc(site)}/entity/${m[4]}/" rel="noopener">${esc(m[5] || m[4])}</a>`;
      else if (m[6] !== undefined) out += `<strong>${inline(m[6])}</strong>`;
      else out += `<em>${inline(m[7])}</em>`;
      text = text.slice(m.index + g.length);
    }
    return out;
  };
  const out = []; let para = [], list = null, hn = 0;
  const flushL = () => { if (list) { out.push(`</${list}>`); list = null; } };
  const flushP = () => {
    if (!para.length) return;
    const joined = para.join(" "), vm = /^\{\{viz\|([a-z]+)\|([^|]*)\|(.*)\}\}$/.exec(joined);
    if (vm) {   // Infografik: ohne Skript bleibt die Liste (barrierefrei)
      const lis = vm[3].split(";").slice(0, 13).map((it) => it.split("~").slice(0, 3).map((x) => x.trim()).filter(Boolean)).filter((p) => p.length).map((p) => `<li>${esc(p.join(" · "))}</li>`);
      if (lis.length) out.push(`<figure><figcaption>${esc(vm[2])}</figcaption><ul>${lis.join("")}</ul></figure>`);
    } else out.push(`<p>${inline(joined)}</p>`);
    para = [];
  };
  for (const ln of String(body || "").split("\n")) {
    if (!ln.trim()) { flushP(); flushL(); continue; }
    let m = /^(#{2,3})\s+(.+)$/.exec(ln);
    if (m) { flushP(); flushL(); const lv = m[1].length === 2 ? 2 : 3; out.push(`<h${lv} id="h-${++hn}">${inline(m[2])}</h${lv}>`); continue; }   // die Seite setzt den Titel als einzige h1
    m = /^(-|\d+\.)\s+(.+)$/.exec(ln);
    if (m) { flushP(); const tag = m[1] === "-" ? "ul" : "ol"; if (list !== tag) { flushL(); out.push(`<${tag}>`); list = tag; } out.push(`<li>${inline(m[2])}</li>`); continue; }
    m = /^>\s?(.+)$/.exec(ln);
    if (m) { flushP(); flushL(); out.push(`<blockquote><p>${inline(m[1])}</p></blockquote>`); continue; }
    flushL(); para.push(ln.trim());
  }
  flushP(); flushL();
  let html = out.join("");
  if (refs.length) {
    const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; } };
    const safe = (u) => { try { const x = new URL(u); return x.protocol === "https:" ? x.href : ""; } catch { return ""; } };
    html += `<h2>${esc(t.sources)}</h2><ol>` + refs.map((r, i) => {
      const u = safe(r.url), label = r.title + (r.pub ? " – " + r.pub : "") + (r.date ? " (" + r.date + ")" : "");
      return `<li id="ref-${i + 1}"><a href="#fn-${i + 1}" aria-label="↑">↑</a> ${esc(label)}${u ? ` · <a href="${esc(u)}" rel="nofollow ugc noopener" target="_blank">${esc(host(u))}</a>` : ""}</li>`;
    }).join("") + "</ol>";
  }
  return { html, refs };
}

// ---------- Seitenrahmen ----------
const CSS = ":root{--bg:#fff;--fg:#1a1a1a;--mut:#5a5a5a;--ac:#0b5cad;--bd:#d8d8d8}@media (prefers-color-scheme:dark){:root{--bg:#121417;--fg:#e8e8e8;--mut:#a3a3a3;--ac:#7db7f0;--bd:#33363b}}"
  + "*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:1.0625rem/1.65 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}"
  + "main,header,footer{max-width:42rem;margin:0 auto;padding:0 16px}header{padding-top:1.5rem;padding-bottom:.5rem;border-bottom:1px solid var(--bd)}header a{color:var(--fg);font-weight:700;text-decoration:none}"
  + "a{color:var(--ac)}h1{font-size:1.9rem;line-height:1.25;margin:1.2rem 0 .4rem}h2{font-size:1.35rem;margin:1.8rem 0 .4rem}h3{font-size:1.15rem}.mut{color:var(--mut);font-size:.95rem}"
  + "ul.posts{padding:0;list-style:none}ul.posts li{padding:.9rem 0;border-bottom:1px solid var(--bd)}blockquote{margin:1rem 0;padding-left:1rem;border-left:3px solid var(--bd);color:var(--mut)}"
  + "img{max-width:100%;height:auto}footer{margin-top:3rem;padding-top:1rem;padding-bottom:2rem;border-top:1px solid var(--bd);font-size:.9rem;color:var(--mut)}footer p{margin:.3rem 0}";

function shell(ctx, { title, desc, canonical, robots, body, ld, lang }) {
  const t = tx(lang), { dom, site } = ctx, host = dom.domain;
  const legal = lang === "de" ? [`${site}/impressum/`, `${site}/datenschutz/`] : [`${site}/legal/`, `${site}/privacy/`];
  const own = [dom.imprint_url && `<a href="${esc(dom.imprint_url)}" rel="noopener">${esc(t.imprint)}</a>`, dom.privacy_url && `<a href="${esc(dom.privacy_url)}" rel="noopener">${esc(t.privacy)}</a>`].filter(Boolean).join(" · ");
  return `<!doctype html><html lang="${esc(lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>`
    + (desc ? `<meta name="description" content="${esc(desc.slice(0, 160))}">` : "") + `<meta name="robots" content="${robots}"><link rel="canonical" href="${esc(canonical)}">`
    + `<link rel="alternate" type="application/rss+xml" title="${esc(dom.name)}" href="https://${esc(host)}/feed.xml"><meta name="referrer" content="strict-origin-when-cross-origin"><style>${CSS}</style>`
    + (ld ? `<script type="application/ld+json">${ldJson(ld)}</script>` : "") + `</head><body><header><a href="/">${esc(dom.name)}</a></header><main>${body}</main>`
    + `<footer>${own ? `<p>${own}</p>` : ""}<p>${esc(t.hosted)} <a href="${esc(site)}/" rel="noopener">m365.fm</a> · <a href="${esc(legal[0])}" rel="noopener">${esc(t.platform_legal)}</a> · <a href="${esc(legal[1])}" rel="noopener">${esc(t.platform_privacy)}</a> · <a href="/feed.xml">${esc(t.rss)}</a></p><p>${esc(t.nocookie)}</p></footer></body></html>`;
}

const HEAD = (extra = {}) => ({ "cache-control": "public, max-age=0, s-maxage=300, stale-while-revalidate=3600", "content-security-policy": CSP, ...extra });
const html = (status, body, extra) => new Response(body, { status, headers: HEAD({ "content-type": "text/html; charset=utf-8", ...extra }) });

// Aktive Domain samt Autor, oder null. Nur oeffentliche Profile, nicht gesperrte Mitglieder, Status 'active'.
export async function activeDomain(db, host) {
  if (!normHost(host) || normHost(host) !== host || isOwnHost(host)) return null;
  return await db.prepare("SELECT d.id,d.user_id,d.domain,d.imprint_url,d.privacy_url,p.handle,u.name FROM blog_domains d JOIN profiles p ON p.user_id=d.user_id AND p.public=1 AND p.handle IS NOT NULL JOIN users u ON u.id=d.user_id AND u.banned=0 WHERE d.domain=? AND d.status='active'").bind(host).first();
}

// Antwort fuer host + Pfad, oder null (unbekannt, nicht aktiv, Profil nicht oeffentlich: neutrales 404 durch den Aufrufer)
export async function serveBlog(env, host, rawPath) {
  const db = env.DB, site = String(env.SITE || "https://www.m365.fm").replace(/\/+$/, "");
  host = normHost(host);
  const dom = host ? await activeDomain(db, host) : null; if (!dom) return null;
  const path = typeof rawPath === "string" ? rawPath : "";
  if (!path.startsWith("/") || path.startsWith("//") || /[\\%?#\u0000-\u001f]|\.\./.test(path) || path.length > 140) return html(404, notFoundPage({ dom, site }), { "x-robots-tag": "noindex" });
  const ownCanon = env.BYOD_CANONICAL === "own", need = Math.max(0, Number(env.BYOD_INDEX_VOTES ?? DEFAULT_INDEX_VOTES) || 0);
  const ctx = { dom, site, host };
  const posts = (await db.prepare("SELECT b.id,b.slug,b.title,b.summary,b.body,b.html,b.lang,b.topics,b.keypoints,b.faq,b.published,b.updated,(SELECT COUNT(*) FROM blog_votes v WHERE v.post_id=b.id) votes FROM blog_posts b WHERE b.user_id=? AND b.status='live' ORDER BY b.published DESC, b.id DESC LIMIT 100").bind(dom.user_id).all()).results || [];
  const indexable = (p) => !p.html && p.votes >= need;   // Regel "ab 10 Upvotes"; uebernommene HTML-Beitraege zeigt die Domain nur als Auszug, nie indexierbar
  const platUrl = (p) => `${site}${p.lang === "en" ? "" : "/" + p.lang}/community/u/${dom.handle}/blog/${p.slug}/`;
  const canon = (p) => (ownCanon ? `https://${host}/${p.slug}/` : platUrl(p));
  const lang0 = posts[0]?.lang === "de" ? "de" : "en";

  if (path === "/robots.txt") {
    const sm = ownCanon && posts.some(indexable) ? `Sitemap: https://${host}/sitemap.xml\n` : "";
    return new Response(`User-agent: *\nAllow: /\n${sm}`, { status: 200, headers: HEAD({ "content-type": "text/plain; charset=utf-8" }) });
  }
  if (path === "/sitemap.xml") {
    const items = ownCanon ? posts.filter(indexable) : [];   // mit Canonical auf m365.fm gehoert keine Adresse dieser Domain in eine Sitemap
    if (!items.length) return html(404, notFoundPage(ctx), { "x-robots-tag": "noindex" });
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` + items.map((p) => `<url><loc>${esc(canon(p))}</loc><lastmod>${iso(p.updated || p.published)}</lastmod></url>`).join("") + `</urlset>`,
      { status: 200, headers: HEAD({ "content-type": "application/xml; charset=utf-8" }) });
  }
  if (path === "/feed.xml") {
    const items = posts.slice(0, 30).map((p) => `<item><title>${esc(p.title)}</title><link>${esc(`https://${host}/${p.slug}/`)}</link><guid isPermaLink="true">${esc(`https://${host}/${p.slug}/`)}</guid><pubDate>${rfc(p.published)}</pubDate>${p.summary ? `<description>${esc(p.summary)}</description>` : ""}</item>`).join("");
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(dom.name)}</title><link>https://${esc(host)}/</link><description>${esc(dom.name)}</description><language>${lang0}</language>${items}</channel></rss>`,
      { status: 200, headers: HEAD({ "content-type": "application/rss+xml; charset=utf-8" }) });
  }
  if (path === "/") {
    const t = tx(lang0), any = posts.some(indexable);
    const list = posts.length ? `<ul class="posts">` + posts.map((p) => `<li><a href="/${esc(p.slug)}/"><b>${esc(p.title)}</b></a> <span class="mut">· <time datetime="${iso(p.published)}">${iso(p.published)}</time></span>${p.summary ? `<br>${esc(p.summary)}` : ""}</li>`).join("") + "</ul>" : `<p>${esc(t.empty)}</p>`;
    const canonical = ownCanon ? `https://${host}/` : `${site}/community/u/${dom.handle}/blog/`;
    return html(200, shell(ctx, { title: dom.name, desc: "", canonical, robots: any ? "index,follow" : "noindex,follow", lang: lang0, body: `<h1>${esc(dom.name)}</h1><p class="mut">${esc(t.posts)}</p>${list}`,
      ld: { "@context": "https://schema.org", "@type": "Blog", name: dom.name, url: `https://${host}/`, author: { "@type": "Person", name: dom.name, url: `${site}/community/u/${dom.handle}/` } } }));
  }
  const m = /^\/([a-z0-9][a-z0-9-]*)(\/?)$/.exec(path), slug = m && SLUG.test(m[1]) ? m[1] : "";
  const p = slug ? posts.find((x) => x.slug === slug) : null;
  if (!p) return html(404, notFoundPage(ctx), { "x-robots-tag": "noindex" });
  if (!m[2]) return new Response(null, { status: 301, headers: { location: `/${slug}/`, "cache-control": "public, max-age=3600" } });   // nur auf dieselbe Domain, Slug ist geprueft
  const lang = /^[a-z]{2}$/.test(p.lang) ? p.lang : "en", t = tx(lang);
  const author = `${site}/community/u/${dom.handle}/`;
  const content = p.html ? `<p>${esc(t.more)}: <a href="${esc(platUrl(p))}" rel="noopener">${esc(p.title)}</a></p>` : wikiToHtml(p.body, { site, lang }).html;
  const kp = parse(p.keypoints, []).filter((x) => typeof x === "string").slice(0, 8);
  const fq = parse(p.faq, []).filter((x) => x && typeof x.q === "string" && typeof x.a === "string").slice(0, 10);
  const kpHtml = kp.length ? `<ul>${kp.map((k) => `<li>${esc(k)}</li>`).join("")}</ul>` : "";
  const fqHtml = fq.length ? fq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("") : "";
  const upd = p.updated && iso(p.updated) !== iso(p.published) ? ` · ${esc(t.updated)} <time datetime="${iso(p.updated)}">${iso(p.updated)}</time>` : "";
  const body = `<article><h1>${esc(p.title)}</h1><p class="mut">${esc(t.by)} <a href="${esc(author)}" rel="author noopener">${esc(dom.name)}</a> · <time datetime="${iso(p.published)}">${iso(p.published)}</time>${upd}</p>`
    + `${p.summary ? `<p>${esc(p.summary)}</p>` : ""}${kpHtml}${content}${fqHtml}</article><p><a href="/">${esc(t.back)}</a></p>`;
  const ld = { "@context": "https://schema.org", "@type": "BlogPosting", mainEntityOfPage: canon(p), headline: p.title, description: p.summary || "", inLanguage: lang, datePublished: iso(p.published), dateModified: iso(p.updated || p.published),
    author: { "@type": "Person", name: dom.name, url: author }, isPartOf: { "@type": "Blog", url: `https://${host}/` } };
  return html(200, shell(ctx, { title: `${p.title} – ${dom.name}`, desc: p.summary || "", canonical: canon(p), robots: indexable(p) ? "index,follow" : "noindex,follow", lang, body, ld }), { "content-language": lang });
}

function notFoundPage(ctx) {
  const t = tx("en");
  return shell(ctx, { title: t.notfound, desc: "", canonical: `https://${ctx.dom.domain}/`, robots: "noindex", lang: "en", body: `<h1>${esc(t.notfound)}</h1><p><a href="/">${esc(t.home)}</a></p>` });
}

// Neutrale 404-Antwort fuer unbekannte oder nicht aktive Hosts: kein Hinweis, ob die Domain existiert, keine Weiterleitung
export function unknownHost() {
  return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex", "cache-control": "public, max-age=60" } });
}
