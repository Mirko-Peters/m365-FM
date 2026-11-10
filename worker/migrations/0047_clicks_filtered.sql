-- Mensch oder Bot (Nummer 0047: 0045 = episode_urls_detail (main) und PR #337 (event_review), 0046 = PR #341 (event_entity)).
-- Bot-Klicks werden nicht mehr nur weggelassen, sondern getrennt gezaehlt: clicks = echte Klicks, clicks_filtered = gefilterte Klicks
-- (Bots, Link-Scanner, Vorschau-Abrufe, Vorabruf). Es bleibt bei Tageszaehlern: keine IP, keine Browserkennung, kein Cookie, nichts je Person.
-- Die Tabellen haben keine Nutzer-Spalte; mergeStatements/deleteAccount muessen sie nicht anfassen.
ALTER TABLE sponsor_clicks_daily ADD COLUMN clicks_filtered INTEGER NOT NULL DEFAULT 0;
ALTER TABLE ad_stats_daily ADD COLUMN clicks_filtered INTEGER NOT NULL DEFAULT 0;
ALTER TABLE ad_house_stats ADD COLUMN clicks_filtered INTEGER NOT NULL DEFAULT 0;

-- Suchbegriffe und Position der gesponserten Seiten (Google Search Console; tools/sponsor_metrics.py -> /api/internal/sponsor-metrics).
-- Eine Zeile je Platzierung, Tag, Suchbegriff und Seite. position = durchschnittliche Position an diesem Tag (gewichtet wird beim Lesen mit impressions).
-- Quelle und Messart stehen in jeder Zeile; Google blendet seltene (anonymisierte) Suchbegriffe aus, die Summe kann daher kleiner sein als bei den Seitenzahlen.
CREATE TABLE IF NOT EXISTS sponsor_queries_daily (
  placement_id TEXT NOT NULL,
  day TEXT NOT NULL,
  query TEXT NOT NULL,
  page TEXT NOT NULL,
  clicks REAL NOT NULL DEFAULT 0 CHECK(clicks >= 0),
  impressions REAL NOT NULL DEFAULT 0 CHECK(impressions >= 0),
  position REAL NOT NULL DEFAULT 0 CHECK(position >= 0),
  source TEXT NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN ('measured','estimated','manual')),
  fetched_at INTEGER NOT NULL,
  PRIMARY KEY(placement_id, day, query, page, source)
);
CREATE INDEX IF NOT EXISTS idx_sponsor_queries_day ON sponsor_queries_daily(placement_id, day);
