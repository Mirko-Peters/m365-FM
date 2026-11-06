-- Leads des Sponsor-Lead-Formulars (laufendes Sponsoring in data/sponsorships.json, ohne Werbebuchung): booking_id = 0, sponsor = Entitaets-id der Firma,
-- assigned = Community-Handle des Betreuers. Nur Schema, keine Daten.
ALTER TABLE ad_leads ADD COLUMN sponsor TEXT NOT NULL DEFAULT '';
ALTER TABLE ad_leads ADD COLUMN assigned TEXT NOT NULL DEFAULT '';
