-- LinkedIn-Events (Mirko, nur per Klick im Admin): Verbindung zur LinkedIn-Seite "M365 Show" und je m365.fm-Event der veroeffentlichte LinkedIn-Event.
-- Tokens liegen nur verschluesselt (AES-GCM, siehe src/linkedin_events.js), nie im Klartext und nie im Log.
CREATE TABLE IF NOT EXISTS linkedin_conn (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  org_urn TEXT NOT NULL DEFAULT '',          -- urn:li:organization:<id>, erst nach der Auswahl
  org_name TEXT NOT NULL DEFAULT '',
  access_enc TEXT NOT NULL DEFAULT '',       -- iv.ciphertext (base64url)
  refresh_enc TEXT NOT NULL DEFAULT '',
  expires INTEGER NOT NULL DEFAULT 0,        -- Ablauf des Access-Tokens (Unix-Sekunden)
  scope TEXT NOT NULL DEFAULT '',
  connected_by INTEGER NOT NULL DEFAULT 0,
  updated INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS linkedin_events (
  event_id INTEGER PRIMARY KEY,              -- events.id
  urn TEXT NOT NULL,                         -- urn:li:event:<id>
  url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'published',  -- published | cancelled
  hash TEXT NOT NULL DEFAULT '',             -- Hash der zuletzt gesendeten Nutzlast (Erkennung "m365.fm-Event geaendert")
  published_by INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL,
  updated INTEGER NOT NULL
);
