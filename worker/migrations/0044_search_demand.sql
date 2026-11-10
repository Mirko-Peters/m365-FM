-- Suchbegriffe anonym zaehlen, Luecken erkennen, Uebersetzung auf Nachfrage (Issue #156; Logik in src/search_demand.js).
-- Bewusst OHNE Personenbezug: keine IP, kein Konto, keine Uhrzeit (nur der UTC-Tag). Aufbewahrung 12 Monate (taeglicher Cron um 06:00).
-- search_q: eine Zeile je Tag, Seitensprache und normalisiertem Begriff. zero = die zuletzt gezaehlte Suche hatte keinen Treffer.
-- cls: '' = noch nicht eingeordnet, sonst own | translation_gap | content_gap | unavailable (hoechstens einmal je Tag und Sprache, im Cron).
-- docs: bei translation_gap die passenden Inhalte der anderen Sprache als JSON [{k,i,t,p}] (Art, Schluessel, Titel, Pfad ohne Sprachpraefix).
CREATE TABLE IF NOT EXISTS search_q (
  day TEXT NOT NULL,
  lang TEXT NOT NULL,
  q_norm TEXT NOT NULL,
  n INTEGER NOT NULL DEFAULT 0,
  zero INTEGER NOT NULL DEFAULT 0,
  cls TEXT NOT NULL DEFAULT '',
  docs TEXT NOT NULL DEFAULT '[]',
  PRIMARY KEY (day, lang, q_norm)
);
CREATE INDEX IF NOT EXISTS idx_search_q_term ON search_q(lang, q_norm);
CREATE INDEX IF NOT EXISTS idx_search_q_cls ON search_q(cls, day);
-- tr_demand: Warteschlange "Uebersetzung auf Nachfrage" je Inhalt und Zielsprache (nur Begriffe ueber der Missbrauchsschwelle SEARCH_DEMAND_MIN
-- Suchen an mindestens 2 Tagen). searches/days = Summe der Suchen bzw. Zahl der Tage dieser Begriffe. status: open | translated | waiting_budget | failed.
-- tries = Uebersetzungsversuche (Haiku-Aufrufe) dieser Zeile; nach 3 voruebergehenden Fehlern wird sie failed (kein endloses Wiederholen).
-- kind blog/podcast/video/entity uebersetzt der Worker (autotr.js runTrDemand, item_tr/ent_tr); episode/lblog die Python-Skripte des Seitenbaus
-- (Reihenfolge aus GET /api/search/demand-export); page ist nur ein Hinweis fuer die Redaktion.
CREATE TABLE IF NOT EXISTS tr_demand (
  kind TEXT NOT NULL,
  item TEXT NOT NULL,
  lang TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  path TEXT NOT NULL DEFAULT '',
  searches INTEGER NOT NULL DEFAULT 0,
  days INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open',
  info TEXT NOT NULL DEFAULT '',
  tries INTEGER NOT NULL DEFAULT 0,
  first_seen TEXT NOT NULL DEFAULT '',
  last_seen TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (kind, item, lang)
);
CREATE INDEX IF NOT EXISTS idx_tr_demand_status ON tr_demand(status, searches);
