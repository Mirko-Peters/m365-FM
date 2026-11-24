-- Lernpfad-Abschlusstest + Zertifikat ueber Certopus (learnquiz.js, Nummer 0055: 0054 = library_reviewed).
-- learn_quiz_keys: Antwortschluessel (nur hier, nie im oeffentlichen Repo; kommt per POST /api/internal/learn-quiz mit CRON_KEY aus tools/pillar_quiz.py push).
-- active: 1 = wird gezogen. Der Push ist je Pfad massgeblich: nicht mehr uebermittelte Fragen werden stillgelegt (active=0), nie geloescht -
-- offene Versuche mit solchen Fragen bleiben wertbar (zeigt die neue Testseite sie nicht mehr, verwirft start den Versuch und gibt ihn zurueck),
-- und eine stillgelegte ID wird nie neu vergeben.
CREATE TABLE IF NOT EXISTS learn_quiz_keys (
  qid TEXT PRIMARY KEY,                  -- <pillar-id>-<n>, in allen Sprachen gleich
  path TEXT NOT NULL,                    -- Lernpfad, z. B. manufacturing-excellence
  pillar TEXT NOT NULL,                  -- Leitfaden des Pfads
  answer INTEGER NOT NULL,               -- richtige Option 0-3
  why_en TEXT NOT NULL DEFAULT '',
  why_de TEXT NOT NULL DEFAULT '',
  updated INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,     -- 0 = stillgelegt (nicht mehr gezogen, aber noch wertbar)
  created INTEGER NOT NULL DEFAULT 0     -- erster Push dieser ID (nur beim INSERT gesetzt): nur juengere Fragen darf die Testseite ausblenden (pageFilter)
);
CREATE INDEX IF NOT EXISTS idx_learn_quiz_keys_path ON learn_quiz_keys(path, active, pillar);

-- learn_attempts: ein Versuch je Start (gilt 24 h), Ergebnis nach der Abgabe. src = Herkunft der Testseite (utm_source/ref, max 40 Zeichen) fuer den Trichter.
CREATE TABLE IF NOT EXISTS learn_attempts (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  path TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en',
  qids TEXT NOT NULL,                    -- JSON-Liste der gezogenen Fragen
  started INTEGER NOT NULL,
  finished INTEGER NOT NULL DEFAULT 0,   -- 0 = offen
  score INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  passed INTEGER NOT NULL DEFAULT 0,
  detail TEXT NOT NULL DEFAULT '',       -- JSON: gewaehlte Antworten und Ergebnis je Leitfaden
  src TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_learn_attempts_user ON learn_attempts(user_id, path);
CREATE INDEX IF NOT EXISTS idx_learn_attempts_path ON learn_attempts(path, started);

-- learn_certs: ein Zertifikat je Nutzer und Pfad. status: pending (Certopus aus oder noch nicht ausgestellt), issuing (Anfrage laeuft), ok, error.
-- Name und E-Mail nur mit Einwilligung (geht an Certopus); beim Loeschen des Kontos weg.
CREATE TABLE IF NOT EXISTS learn_certs (
  user_id INTEGER NOT NULL,
  path TEXT NOT NULL,
  attempt_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  emails TEXT NOT NULL DEFAULT '[]',     -- JSON: bisher genutzte Empfaenger (ohne bestaetigte Adresse hoechstens 2 verschiedene)
  lang TEXT NOT NULL DEFAULT 'en',
  certopus_id TEXT NOT NULL DEFAULT '',
  cert_url TEXT NOT NULL DEFAULT '',
  pdf_url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  error TEXT NOT NULL DEFAULT '',
  created INTEGER NOT NULL,
  updated INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, path)
);
CREATE INDEX IF NOT EXISTS idx_learn_certs_status ON learn_certs(status, updated);
