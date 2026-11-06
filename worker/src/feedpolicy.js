// Welche gezogenen Inhalte (feed_items) oeffentlich erscheinen duerfen - eine Stelle fuer alle Abfragen.
// GitHub-Aktivitaet (Commits, PRs, Stars aus github.com/<user>.atom) erscheint nirgends auf der Website: weder im Feed, auf Profil-
// und Firmenseiten, eigenen Inhaltsseiten (/community/feed/<id>-<slug>/), Sitemaps, Suche noch in Benachrichtigungen. Stattdessen
// gibt es woechentliche Meilenstein-Beitraege im Blog. Der Kanal selbst bleibt als Profil-Link erlaubt (profiles.js KINDS) und als
// Quelle fuer MVP-Nachweise (contributions.js liest den Feed dort selbst). Zeilen werden nicht geloescht, nur ausgeblendet.
export const PRIVATE_FEED_KINDS = Object.freeze(["github"]);

export const isPublicFeedKind = (kind) => !PRIVATE_FEED_KINDS.includes(String(kind || "").toLowerCase());

const list = () => PRIVATE_FEED_KINDS.map((k) => `'${k}'`).join(",");

// Bedingung auf die Kanal-Art, wenn channels schon verbunden ist (z. B. "c.kind")
export const publicKindSql = (col = "c.kind") => `${col} NOT IN (${list()})`;

// Bedingung auf den Inhalt ohne JOIN: sein Kanal ist keine private Art (alias = Tabellenname oder Alias von feed_items)
export const publicItemSql = (alias = "i") => `${alias}.channel_id NOT IN (SELECT id FROM channels WHERE kind IN (${list()}))`;
