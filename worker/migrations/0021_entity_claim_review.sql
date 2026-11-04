-- LinkedIn-Bild und Mailadresse nur bis zur Admin-Entscheidung vorhalten.
CREATE TABLE IF NOT EXISTS entity_claim_review (
  eid TEXT PRIMARY KEY,
  email TEXT NOT NULL DEFAULT '',
  picture TEXT NOT NULL DEFAULT '',
  created INTEGER NOT NULL
);
