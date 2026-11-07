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

-- Automatische und per Abstimmung vergebene Rollen: role_source '' (nie entschieden) | manual (Admin) | auto_mvp | auto_mct | vote.
-- Bestehende Editoren behalten ihre Rolle ('' zaehlt wie manuell: die Automatik fasst sie nie an).
ALTER TABLE users ADD COLUMN role_source TEXT NOT NULL DEFAULT '';
-- Versionsverlauf fuer Inhalte ohne eigene Revisionstabelle (Blog-Beitraege); Wiki und Entitaeten nutzen wiki_rev/entity_rev.
CREATE TABLE IF NOT EXISTS content_rev (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,
  item_id TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT NOT NULL,            -- author | editor | moderator | admin (Rolle zum Zeitpunkt der Aenderung)
  action TEXT NOT NULL,          -- baseline | edit | revert
  reason TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  topics TEXT NOT NULL DEFAULT '[]',
  ts INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS content_rev_item ON content_rev(kind, item_id, id);
-- Bewerbungen um die Rolle Editor/Moderator mit Bestaetigung durch andere Editoren
CREATE TABLE IF NOT EXISTS editor_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  role TEXT NOT NULL,            -- editor | moderator
  motivation TEXT NOT NULL,
  topics TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'open',   -- open | approved | rejected
  created INTEGER NOT NULL,
  decided_by INTEGER,
  decided_ts INTEGER,
  reason TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS editor_applications_open ON editor_applications(status, created);
CREATE TABLE IF NOT EXISTS editor_votes (
  app_id INTEGER NOT NULL,
  voter_id INTEGER NOT NULL,
  ts INTEGER NOT NULL,
  PRIMARY KEY (app_id, voter_id)
);

-- Sprachfassungen: einmal uebersetzen, danach von Redakteuren pro Absatz anpassen. Der Seitenbau liest die Texte aus /api/i18n/overrides
-- (data/i18n_overrides/<kind>/<lang>.json). Jede Aenderung ist versioniert (wer, wann, warum, Diff, Zuruecksetzen).
CREATE TABLE IF NOT EXISTS i18n_override (
  kind TEXT NOT NULL,            -- lblog | episode | notes
  item TEXT NOT NULL,            -- Slug (Blog-Pakete: content/<slug>)
  lang TEXT NOT NULL,
  unit TEXT NOT NULL,            -- Absatz-ID (T, D, Q1, A1, 1..n; episode: title, summary; notes: n0..)
  text TEXT NOT NULL,
  by INTEGER NOT NULL,
  ts INTEGER NOT NULL,
  PRIMARY KEY (kind, item, lang, unit)
);
CREATE TABLE IF NOT EXISTS i18n_override_rev (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,
  item TEXT NOT NULL,
  lang TEXT NOT NULL,
  unit TEXT NOT NULL,
  text TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT NOT NULL,            -- machine (Ursprungsfassung) | editor | moderator | admin
  action TEXT NOT NULL,          -- baseline | edit | revert
  reason TEXT NOT NULL DEFAULT '',
  ts INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS i18n_override_rev_unit ON i18n_override_rev(kind, item, lang, unit, id);
-- Wunsch "Geaenderte Absaetze neu uebersetzen": nur vermerkt, ein spaeterer Workflow-Lauf mit --stale holt die Wuensche ab (kein API-Aufruf im Worker)
CREATE TABLE IF NOT EXISTS i18n_retranslate_req (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,
  item TEXT NOT NULL,
  lang TEXT NOT NULL,
  units TEXT NOT NULL DEFAULT '[]',
  by INTEGER NOT NULL,
  ts INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',   -- open | done
  UNIQUE (kind, item, lang, status)
);
