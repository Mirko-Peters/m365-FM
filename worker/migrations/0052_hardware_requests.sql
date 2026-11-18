-- Hardware-Sponsoring (/hardware/): Bewerbungen von Herstellern, die Geraete fuer einen unabhaengigen Test bereitstellen (Nummer 0052: 0051 = clicks_filtered).
-- Status: open (neu), committed (zugesagt), received (Geraet da), published (Test online), declined (abgelehnt). Personenbezogen: nur Admin, Loeschen moeglich.
CREATE TABLE IF NOT EXISTS hardware_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  product TEXT NOT NULL,
  product_url TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'other',
  quantity INTEGER NOT NULL DEFAULT 1,
  ship_by TEXT NOT NULL DEFAULT '',
  offers TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  lang TEXT NOT NULL DEFAULT 'en',
  source TEXT NOT NULL DEFAULT '',
  created INTEGER NOT NULL,
  sent INTEGER NOT NULL DEFAULT 0,
  err TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  status_updated INTEGER,
  accept_sent INTEGER NOT NULL DEFAULT 0,   -- 1 = Zusage-Mail mit Lieferadresse wurde gesendet (nur einmal)
  accept_err TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_hardware_requests_created ON hardware_requests(created);
