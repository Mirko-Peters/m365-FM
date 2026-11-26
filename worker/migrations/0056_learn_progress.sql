-- Lernfortschritt im Lernpfad je Nutzer und Pfad (worker/src/learnprogress.js, Seite: assets/learnprogress.js). Nummer 0056: 0055 = learn_quiz.
-- Geschrieben wird nur nach dem Opt-in "Lernfortschritt speichern" auf der Seite und nur bei einer Aenderung (POST ohne Aenderung schreibt nichts).
-- Eine Zeile je (user_id, path), WITHOUT ROWID mit Primaerschluessel und ohne Zusatzindex: genau 1 geschriebene Zeile je Speichern.
-- Speicherfrist: bis zum Zuruecksetzen (DELETE: leerer Stand mit neuer Epoche ep), bis zur Kontoloeschung (deleteUserLearn) oder 24 Monate ohne
-- Aenderung (monatliches Aufraeumen im Tageslauf, purgeLearnProgress).
CREATE TABLE IF NOT EXISTS learn_progress (
  user_id INTEGER NOT NULL,
  path    TEXT    NOT NULL,              -- Lernpfad (PATH_RX, nur Pfade aus learnquiz.js COURSE)
  state   TEXT    NOT NULL DEFAULT '{}', -- normalisiertes JSON {g:{id:{r,rt,a,h,l,pc,at}},c:{...},v:{vid:s}}, alle Zeiten Serversekunden
  ep      INTEGER NOT NULL DEFAULT 0,    -- Ruecksetz-Epoche (Serversekunden des letzten Zuruecksetzens)
  updated INTEGER NOT NULL,              -- Serverzeit in ms der letzten Aenderung, dient als Version (optimistische Sperre)
  PRIMARY KEY (user_id, path)
) WITHOUT ROWID;
