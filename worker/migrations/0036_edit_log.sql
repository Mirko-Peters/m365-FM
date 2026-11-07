-- Redaktions-Protokoll (Editor- und Moderatoren-Backend, Stufe 1): jede Entscheidung und jede Bearbeitung mit Rolle, Grund und Vorher/Nachher.
-- users.role kennt jetzt user | moderator | editor | admin (Textspalte, keine Aenderung am Schema noetig).
CREATE TABLE IF NOT EXISTS edit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT NOT NULL,
  action TEXT NOT NULL,          -- review.approve | review.reject | review.hide | review.escalate | report.resolve | content.edit_minor | content.edit_full | ...
  kind TEXT NOT NULL,            -- blog | wiki | entity | comment | podcast | video | cert | expert_report ...
  item_id TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  before TEXT NOT NULL DEFAULT '',   -- Kurzfassung/JSON des Zustands davor (fuer Rueckgaengig)
  after TEXT NOT NULL DEFAULT '',
  undone INTEGER NOT NULL DEFAULT 0,
  day INTEGER NOT NULL DEFAULT 0     -- Tag (ts/86400) fuer das Tageslimit
);
CREATE INDEX IF NOT EXISTS edit_log_user_day ON edit_log(user_id, day);
CREATE INDEX IF NOT EXISTS edit_log_item ON edit_log(kind, item_id, ts);
CREATE INDEX IF NOT EXISTS edit_log_ts ON edit_log(ts);
-- Empfehlungen von Moderatoren (und Eskalationen): werden von Editoren/Admins bestaetigt oder verworfen, erst dann ausgefuehrt.
CREATE TABLE IF NOT EXISTS edit_proposals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT NOT NULL,
  action TEXT NOT NULL,
  kind TEXT NOT NULL,
  item_id TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  payload TEXT NOT NULL DEFAULT '',        -- JSON fuer vorgeschlagene Bearbeitungen
  status TEXT NOT NULL DEFAULT 'open',   -- open | executed | dismissed
  decided_by INTEGER,
  decided_ts INTEGER
);
CREATE INDEX IF NOT EXISTS edit_proposals_open ON edit_proposals(status, ts);
-- Fach-Editoren: Editor MIT Zeile hier sieht und entscheidet nur Eintraege, deren Themen-Entitaeten sich mit der bestaetigten Expertise schneiden
-- (Stufe Experte oder hoeher, bzw. belegt/bestaetigt; Selbstangaben zaehlen nicht). Editor OHNE Zeile = allgemeiner Editor (sieht alles).
-- topics/langs: optionale manuelle Ergaenzungen (JSON-Listen) zu den automatisch abgeleiteten Themen.
CREATE TABLE IF NOT EXISTS editor_scope (
  user_id INTEGER PRIMARY KEY,
  topics TEXT NOT NULL DEFAULT '[]',
  langs TEXT NOT NULL DEFAULT '[]',
  updated INTEGER NOT NULL DEFAULT 0
);
