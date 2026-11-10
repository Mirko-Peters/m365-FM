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
  connected_by INTEGER NOT NULL DEFAULT 0,   -- users.id des Admins, dessen LinkedIn-Zugang hier liegt (Konto loeschen/zusammenfuehren: src/linkedin_events.js, identities.js)
  updated INTEGER NOT NULL DEFAULT 0
);
-- Eine Zeile je m365.fm-Event. Sie entsteht VOR dem LinkedIn-Aufruf als Reservierung (status 'pending', urn leer): event_id ist der Primaerschluessel,
-- ein Doppelklick, ein zweiter Reiter oder eine Wiederholung nach einem Fehler kann deshalb nie einen zweiten LinkedIn-Event anlegen.
CREATE TABLE IF NOT EXISTS linkedin_events (
  event_id INTEGER PRIMARY KEY,              -- events.id (AUTOINCREMENT, wird nie neu vergeben)
  urn TEXT NOT NULL DEFAULT '',              -- urn:li:event:<id>, leer solange reserviert
  url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',    -- pending (reserviert oder Ausgang unklar) | published | cancelled
  hash TEXT NOT NULL DEFAULT '',             -- Hash der zuletzt gesendeten Nutzlast (Erkennung "m365.fm-Event geaendert")
  handle TEXT NOT NULL DEFAULT '',           -- Stand beim Veroeffentlichen: bleibt lesbar, wenn das m365.fm-Event geloescht wird (verwaister LinkedIn-Event, weiter absagbar)
  title TEXT NOT NULL DEFAULT '',
  starts INTEGER NOT NULL DEFAULT 0,         -- Beginn in UTC-Millisekunden, wie an LinkedIn gesendet
  ends INTEGER NOT NULL DEFAULT 0,           -- Ende in UTC-Millisekunden: danach gibt es an einem verwaisten LinkedIn-Event nichts mehr abzusagen
  published_by INTEGER NOT NULL DEFAULT 0,   -- users.id (0 nach Kontoloeschung)
  published INTEGER NOT NULL,
  updated INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_linkedin_events_urn ON linkedin_events(urn) WHERE urn<>'';
