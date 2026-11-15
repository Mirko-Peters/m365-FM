-- Lead-Status fuer Mirkos Nachverfolgung (Admin): open | in_progress | closed_lost | closed_won, plus Zeitpunkt der letzten Aenderung.
-- ad_leads hat schon eine Spalte status (Abrechnung: new/duplicate/disputed/credited, CHECK) -> dort heisst die neue Spalte lead_status.
ALTER TABLE mediakit_requests ADD COLUMN status TEXT NOT NULL DEFAULT 'open';
ALTER TABLE mediakit_requests ADD COLUMN status_updated INTEGER;
ALTER TABLE ad_leads ADD COLUMN lead_status TEXT NOT NULL DEFAULT 'open';
ALTER TABLE ad_leads ADD COLUMN lead_status_updated INTEGER;
