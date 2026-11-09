// Welche gezogenen Inhalte (feed_items) oeffentlich erscheinen duerfen - eine Stelle fuer alle Abfragen.
// GitHub-Aktivitaet (Commits, PRs, Stars aus github.com/<user>.atom) erscheint nirgends auf der Website: weder im Feed, auf Profil-
// und Firmenseiten, eigenen Inhaltsseiten (/community/feed/<id>-<slug>/), Sitemaps, Suche noch in Benachrichtigungen. Stattdessen
// gibt es woechentliche Meilenstein-Beitraege im Blog. Der Kanal selbst bleibt als Profil-Link erlaubt (profiles.js KINDS) und als
// Quelle fuer MVP-Nachweise (contributions.js liest den Feed dort selbst). Zeilen werden nicht geloescht, nur ausgeblendet.
export const PRIVATE_FEED_KINDS = Object.freeze(["github"]);

export const isPublicFeedKind = (kind) => !PRIVATE_FEED_KINDS.includes(String(kind || "").toLowerCase());

// Fenster des oeffentlichen Feeds in Tagen: /api/feed/export (und damit der Seitenbau) zeigt nur Eintraege, die juenger sind.
// Aelteres bekaeme nie eine Seite, deshalb entsteht daraus auch kein Kurzpost (contrib_sources.js publishAsPost).
export const FEED_DAYS = 120;

const list = () => PRIVATE_FEED_KINDS.map((k) => `'${k}'`).join(",");

// Bedingung auf die Kanal-Art, wenn channels schon verbunden ist (z. B. "c.kind")
export const publicKindSql = (col = "c.kind") => `${col} NOT IN (${list()})`;

// Bedingung auf den Inhalt ohne JOIN: sein Kanal ist keine private Art (alias = Tabellenname oder Alias von feed_items)
export const publicItemSql = (alias = "i") => `${alias}.channel_id NOT IN (SELECT id FROM channels WHERE kind IN (${list()}))`;

// Gleicher Link = gleicher Inhalt, eine Stelle fuer Tracker (Dedupe), Kurzposts und den Abruf der Profil-Kanaele.
// YouTube-Video-ID aus jeder Adresse desselben Videos: youtube.com samt Unterdomains (www, m, music), youtu.be, youtube-nocookie.com.
export function youtubeId(u) {
  const h = String(u.hostname || "").toLowerCase().replace(/^www\./, ""), s = u.pathname.split("/").filter(Boolean);
  if (h === "youtu.be") return /^[\w-]{11}$/.test(s[0] || "") ? s[0] : "";
  if (h === "youtube.com" || h.endsWith(".youtube.com") || h === "youtube-nocookie.com") {
    const v = u.searchParams.get("v"); if (/^[\w-]{11}$/.test(v || "")) return v;
    const m = /^\/(?:shorts|embed|live|v)\/([\w-]{11})(?:[/?#]|$)/.exec(u.pathname); return m ? m[1] : "";
  }
  return "";
}

// Kanonische URL fuer den Vergleich (ohne Schema, ohne www/m., Tracking-Parameter, #, abschliessenden /); YouTube auf watch?v=ID
export function canonUrl(raw) {
  let u; try { u = new URL(String(raw || "").trim()); } catch { return ""; }
  const id = youtubeId(u); if (id) return `youtube.com/watch?v=${id}`;
  const q = [...u.searchParams.entries()].filter(([k]) => !/^(utm_|mc_|fbclid|gclid|igshid|ref$|ref_|source$|trk|si$|feature$)/i.test(k)).sort(([a], [b]) => (a < b ? -1 : 1));
  const path = u.pathname.replace(/\/+$/, "");
  return `${u.hostname.toLowerCase().replace(/^www\./, "").replace(/^m\./, "")}${path}${q.length ? "?" + q.map(([k, v]) => `${k}=${v}`).join("&") : ""}`.toLowerCase();
}

// Adressen, unter denen derselbe Link in feed_items stehen kann (exakter Vergleich ueber den eindeutigen Index auf url): YouTube liefert
// watch?v= oder /shorts/, von Hand kommen youtu.be und m.youtube.com dazu.
export function sameLinks(raw) {
  let u; try { u = new URL(raw); } catch { return [raw]; }
  const id = youtubeId(u);
  return id ? [...new Set([raw, `https://www.youtube.com/watch?v=${id}`, `https://youtu.be/${id}`, `https://www.youtube.com/shorts/${id}`, `https://m.youtube.com/watch?v=${id}`, `https://music.youtube.com/watch?v=${id}`])] : [raw];
}

// feed_items.hidden als zwei unabhaengige Schalter: Bit 1 = von der Moderation ausgeblendet, Bit 2 = vom Mitglied zurueckgezogen (Kurzpost).
// 0 sichtbar, 1 Moderation, 2 zurueckgezogen, 3 beides. Jede Seite setzt und loescht nur ihren eigenen Schalter - so macht weder das Mitglied
// eine Sperre rueckgaengig noch die Redaktion mit Aus- und Einblenden etwas oeffentlich, das das Mitglied zurueckgezogen hat.
export const HIDDEN_MOD = 1, HIDDEN_OWN = 2;
