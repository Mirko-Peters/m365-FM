-- MVP-Tracker: eigene Quellen erweitern (#282). Pro Quelle eine Wahl (mode): track = nur tracken (privat), publish = als Kurzpost
-- im Community-Feed veroeffentlichen, ask = jedes Mal fragen ("Neu gefunden", contributions.review='pending'). Bestehende Quellen
-- behalten ihr bisheriges Verhalten (track). Dedupe ueber kanonische URL (canon) oder GUID; ctype ueberschreibt die MVP-Portal-Kategorie.
ALTER TABLE contribution_sources ADD COLUMN mode TEXT NOT NULL DEFAULT 'track';
ALTER TABLE contribution_sources ADD COLUMN etag TEXT NOT NULL DEFAULT '';
ALTER TABLE contribution_sources ADD COLUMN modified TEXT NOT NULL DEFAULT '';
ALTER TABLE contribution_sources ADD COLUMN last_error TEXT NOT NULL DEFAULT '';
ALTER TABLE contribution_sources ADD COLUMN topics TEXT NOT NULL DEFAULT '[]';
-- seeded: 1 nach dem ersten erfolgreichen Abruf. Bis dahin wird Vorhandenes nur still uebernommen, nie als Kurzpost veroeffentlicht
-- (fetched taugt dafuer nicht: es wird auch bei Fehlversuchen gesetzt).
ALTER TABLE contribution_sources ADD COLUMN seeded INTEGER NOT NULL DEFAULT 0;
ALTER TABLE contributions ADD COLUMN guid TEXT NOT NULL DEFAULT '';
ALTER TABLE contributions ADD COLUMN canon TEXT NOT NULL DEFAULT '';
ALTER TABLE contributions ADD COLUMN ctype TEXT NOT NULL DEFAULT '';
ALTER TABLE contributions ADD COLUMN teaser TEXT NOT NULL DEFAULT '';
ALTER TABLE contributions ADD COLUMN feed_item_id INTEGER NOT NULL DEFAULT 0;
-- Kurzposts: feed_items.origin='kurzpost' (als externer Beitrag gekennzeichnet; sonst gelten die Regeln fuer gezogene Inhalte).
-- feed_items.hidden wird dafuer zu zwei Schaltern: Bit 1 = von der Moderation ausgeblendet, Bit 2 = vom Mitglied zurueckgezogen
-- (0 sichtbar, 1 Moderation, 2 zurueckgezogen, 3 beides; worker/src/feedpolicy.js). Sichtbar bleibt nur hidden=0.
ALTER TABLE feed_items ADD COLUMN origin TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS idx_contributions_canon ON contributions(user_id, canon) WHERE canon<>'';
CREATE INDEX IF NOT EXISTS idx_contributions_guid ON contributions(user_id, guid) WHERE guid<>'';
