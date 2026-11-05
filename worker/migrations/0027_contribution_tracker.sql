-- MVP-Tracker (#231): Portal-Status wird lokal gefuehrt (keine Portal-Schnittstelle), Pruefstatus fuer Sessions,
-- Felder fuer das MVP-Portal (format=mvp) und Advocu/GDE (format=gde). portal_desc ist die vom Mitglied selbst
-- geschriebene Portal-Beschreibung, kein Volltext aus Feeds.
ALTER TABLE contributions ADD COLUMN portal INTEGER NOT NULL DEFAULT 0;
ALTER TABLE contributions ADD COLUMN portal_at INTEGER NOT NULL DEFAULT 0;
ALTER TABLE contributions ADD COLUMN review TEXT NOT NULL DEFAULT '';
ALTER TABLE contributions ADD COLUMN portal_desc TEXT NOT NULL DEFAULT '';
ALTER TABLE contributions ADD COLUMN role TEXT NOT NULL DEFAULT '';
ALTER TABLE contributions ADD COLUMN audience TEXT NOT NULL DEFAULT '[]';
ALTER TABLE contributions ADD COLUMN area TEXT NOT NULL DEFAULT '';
ALTER TABLE contributions ADD COLUMN attendees INTEGER NOT NULL DEFAULT 0;
ALTER TABLE contributions ADD COLUMN live_views INTEGER NOT NULL DEFAULT 0;
ALTER TABLE contributions ADD COLUMN sessions INTEGER NOT NULL DEFAULT 0;
ALTER TABLE contributions ADD COLUMN event_format TEXT NOT NULL DEFAULT '';
ALTER TABLE contributions ADD COLUMN country TEXT NOT NULL DEFAULT '';
-- Beginn des eigenen Berichtsjahrs (Monat 1-12, Standard April = MVP-Jahr), in den vorhandenen Nutzer-Einstellungen
ALTER TABLE user_prefs ADD COLUMN report_start INTEGER NOT NULL DEFAULT 4;
CREATE INDEX IF NOT EXISTS idx_contributions_public ON contributions(user_id, public, review, published DESC);
