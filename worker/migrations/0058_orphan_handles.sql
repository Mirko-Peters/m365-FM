-- Altbestand (Datenschutz Runde 8-10): Adressen, die keinem Profil mehr gehoeren. Der alte Code (vor privacy.js releaseHandleOps/forgetImporter)
-- liess bei Kontoloeschung UND Adresswechsel Speaker-Eintraege {h,n}, Blog-Abos (blog_follows.handle), die Speaker-Identitaet
-- (speaker_ref.handle) und Creator-Abos (push_topics/email_topics kind 'creator', topic_id = Adresse) auf der alten Adresse stehen. Speichert
-- ein anderes Mitglied die Adresse spaeter, erbte es Namen, Link, Bearbeitungsrecht (events.js: x.h === meine Adresse), offene Einladungen und
-- Abonnenten. Neuer Code raeumt nur Faelle NACH dem Deploy auf; diese Migration einmal fuer den Bestand. Bewusst als Migration und nicht als
-- Cron-Schritt: setup.mjs spielt sie VOR dem Deploy ein (kein Zeitfenster, in dem jemand die Adresse uebernimmt, bevor der Nachtrag lief), D1
-- fuehrt sie genau einmal aus. Erneut ausgefuehrt aendert sie nichts (alle Bedingungen pruefen "Adresse ohne Profil und ohne Firma", danach gibt es keine
-- solchen Eintraege mehr; die Sicherung behaelt je Zeile das erste Original).
--
-- Runde 10: Die Migration entfernt nichts unumkehrbar und anonymisiert niemanden. "Former member" entsteht nur bei echten Kontoloeschungen
-- nach dem Deploy (profiles.js deleteUserData), nie durch diese Migration.
--
-- Runde 12 (Entscheidung Dev-Chef): Die Migration zieht NICHTS mehr automatisch auf ein Konto um - weder ueber den Merker person_entity
-- (eine Adresse kann frueher nacheinander mehrere Inhaber gehabt haben; der Merker kennt nur einen davon und kann den falschen nennen) noch
-- ueber Namen (eine Namensvetterin ist nicht die fruehere Inhaberin) noch ueber Ansprueche (ein Anspruch auf eine gleichnamige Firmen- oder
-- Fremd-Entitaet ist nicht die Adresse). Fuer jede Adresse, die heute keinem Profil und keiner Firma gehoert, wird nur die Adressbindung
-- geloest bzw. das Abo entfernt, jeweils mit Sicherung. Wer seine Talks wieder verknuepfen will, nutzt den vorhandenen Beanspruchen-Weg
-- ("Bist du das?" / "Das bin ich", /api/speaker/suggest und /api/speaker/claim, events.js speakerMatches: Eintraege ohne Adresse mit
-- aehnlichem Namen werden mit dem eigenen Profil verknuepft und als Speaker-Anfrage bestaetigt). Abonnenten und Speaker-Identitaet stellt ein Admin bei Bedarf einzeln aus der Sicherung wieder her
-- (siehe ZURUECKSPIELEN; dabei die alte Adresse von Hand auf die heutige Adresse des richtigen Kontos setzen).
--
-- SICHERUNG mig0058_backup (bleibt dauerhaft, nicht oeffentlich: keine API liest sie, nur die D1-Sicherung exportiert sie). Vor jeder Aenderung
-- steht dort die Originalzeile: tabelle, schluessel, wert (Originalzeile als JSON), zeit (Unix-Sekunden des Laufs). Schluessel und Wert je Tabelle:
--   event_sessions      schluessel = id                           wert = die ganze alte speakers-Liste (JSON-Text, unveraendert)
--   speaker_ref         schluessel = id                           wert = {id, handle}
--   blog_follows        schluessel = [user_id, handle]            wert = {user_id, handle, created}
--   push_topics         schluessel = [endpoint, kind, topic_id]   wert = alle Spalten
--   email_topics        schluessel = [user_id, kind, topic_id]    wert = alle Spalten
--   topic_queue         schluessel = id                           wert = alle Spalten
--   mail_topic_follows  schluessel = [user_id, eid]               wert = alle Spalten
-- ZURUECKSPIELEN (in D1: wrangler d1 execute m365-dub --remote --command "..."; einzelne Zeilen mit zusaetzlichem "AND b.schluessel = '...'"
-- bzw. "WHERE schluessel = '...'"). Achtung: ein vollstaendiges Zurueckspielen stellt auch die alte Adressbindung wieder her - wer die Adresse
-- inzwischen traegt, erbt dann wieder; deshalb moeglichst nur einzelne Zeilen.
--   UPDATE event_sessions SET speakers = (SELECT b.wert FROM mig0058_backup b WHERE b.tabelle = 'event_sessions' AND b.schluessel = CAST(event_sessions.id AS TEXT))
--     WHERE CAST(id AS TEXT) IN (SELECT schluessel FROM mig0058_backup WHERE tabelle = 'event_sessions');
--   UPDATE speaker_ref SET handle = (SELECT json_extract(b.wert, '$.handle') FROM mig0058_backup b WHERE b.tabelle = 'speaker_ref' AND b.schluessel = CAST(speaker_ref.id AS TEXT))
--     WHERE CAST(id AS TEXT) IN (SELECT schluessel FROM mig0058_backup WHERE tabelle = 'speaker_ref');
--   INSERT OR IGNORE INTO blog_follows(user_id, handle, created) SELECT json_extract(wert, '$.user_id'), json_extract(wert, '$.handle'),
--     json_extract(wert, '$.created') FROM mig0058_backup WHERE tabelle = 'blog_follows';
--   INSERT OR IGNORE INTO push_topics(endpoint, kind, topic_id, lang, timezone, user_id, created) SELECT json_extract(wert, '$.endpoint'),
--     json_extract(wert, '$.kind'), json_extract(wert, '$.topic_id'), json_extract(wert, '$.lang'), json_extract(wert, '$.timezone'),
--     json_extract(wert, '$.user_id'), json_extract(wert, '$.created') FROM mig0058_backup WHERE tabelle = 'push_topics';
--   INSERT OR IGNORE INTO email_topics(user_id, kind, topic_id, lang, timezone, created) SELECT json_extract(wert, '$.user_id'), json_extract(wert, '$.kind'),
--     json_extract(wert, '$.topic_id'), json_extract(wert, '$.lang'), json_extract(wert, '$.timezone'), json_extract(wert, '$.created')
--     FROM mig0058_backup WHERE tabelle = 'email_topics';
--   INSERT OR REPLACE INTO topic_queue(id, channel, recipient, lang, timezone, kind, topic_id, item_key, title, body, url, created, expires, sent)
--     SELECT json_extract(wert, '$.id'), json_extract(wert, '$.channel'), json_extract(wert, '$.recipient'), json_extract(wert, '$.lang'),
--     json_extract(wert, '$.timezone'), json_extract(wert, '$.kind'), json_extract(wert, '$.topic_id'), json_extract(wert, '$.item_key'),
--     json_extract(wert, '$.title'), json_extract(wert, '$.body'), json_extract(wert, '$.url'), json_extract(wert, '$.created'),
--     json_extract(wert, '$.expires'), json_extract(wert, '$.sent') FROM mig0058_backup WHERE tabelle = 'topic_queue';
--   INSERT OR IGNORE INTO mail_topic_follows(user_id, eid, created, active) SELECT json_extract(wert, '$.user_id'), json_extract(wert, '$.eid'),
--     json_extract(wert, '$.created'), json_extract(wert, '$.active') FROM mig0058_backup WHERE tabelle = 'mail_topic_follows';
-- Zurueck kommen die alten Zeilen mit der alten Adresse. Gehoert die Adresse inzwischen jemand anderem, vor dem Einspielen den Wert der
-- Adresse (handle bzw. topic_id, in event_sessions das Feld h) auf die heutige Adresse des richtigen Kontos aendern.
--
-- "Ohne Profil und ohne Firma": kein profiles-Eintrag (oeffentlich oder privat) und kein orgs-Eintrag mit genau dieser Adresse. Die Adressen
-- stehen waehrend des Laufs in der Hilfstabelle mig0058_handle (am Anfang geleert, am Ende entfernt). Fuer jede solche Adresse h:
--  - Speaker-Eintraege mit h: nur die Adressbindung loesen - h, t und e = h fallen weg; Name n, Status s und alle uebrigen Felder bleiben.
--    Offene Einladungen (s = 'invited') bleiben ebenfalls stehen und verlieren nur h und t, damit niemand sie ueber die Adresse annehmen kann.
--    Kein Eintrag wird entfernt, keiner wird an ein Konto gebunden (kein uid), niemand wird "Former member".
--  - Blog-Abos (blog_follows.handle = h): weg.
--  - Speaker-Identitaet (speaker_ref.handle = h): Adresse geleert (der Import verknuepfte sie sonst mit dem naechsten Inhaber, eventmerge.js linkHandle).
--  - Creator-Abos (push_topics/email_topics kind 'creator', topic_id = h) und unversandte Creator-Meldungen (topic_queue, sent = 0): weg.
--    Versandte Meldungen bleiben.
-- Reihenfolge der Speaker-Liste bleibt (json_each nach key, Aggregat ueber die geordnete Unterabfrage).
CREATE TABLE IF NOT EXISTS mig0058_backup (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tabelle TEXT NOT NULL,
  schluessel TEXT NOT NULL,
  wert TEXT NOT NULL,
  zeit INTEGER NOT NULL,
  UNIQUE (tabelle, schluessel)
);
CREATE TABLE IF NOT EXISTS mig0058_handle (h TEXT PRIMARY KEY);
DELETE FROM mig0058_handle;
INSERT OR IGNORE INTO mig0058_handle(h)
SELECT json_extract(CASE WHEN j.type = 'object' THEN j.value END, '$.h') FROM event_sessions s,
  json_each(CASE WHEN json_valid(s.speakers) AND json_type(s.speakers) = 'array' THEN s.speakers ELSE '[]' END) j
WHERE j.type = 'object' AND json_type(CASE WHEN j.type = 'object' THEN j.value END, '$.h') = 'text'
  AND json_extract(CASE WHEN j.type = 'object' THEN j.value END, '$.h') <> '';
INSERT OR IGNORE INTO mig0058_handle(h) SELECT handle FROM blog_follows WHERE handle <> '';
INSERT OR IGNORE INTO mig0058_handle(h) SELECT handle FROM speaker_ref WHERE handle <> '';
INSERT OR IGNORE INTO mig0058_handle(h) SELECT topic_id FROM push_topics WHERE kind = 'creator' AND topic_id <> '';
INSERT OR IGNORE INTO mig0058_handle(h) SELECT topic_id FROM email_topics WHERE kind = 'creator' AND topic_id <> '';
INSERT OR IGNORE INTO mig0058_handle(h) SELECT topic_id FROM topic_queue WHERE kind = 'creator' AND sent = 0 AND topic_id <> '';
DELETE FROM mig0058_handle WHERE EXISTS (SELECT 1 FROM profiles p WHERE p.handle = mig0058_handle.h)
  OR EXISTS (SELECT 1 FROM orgs g WHERE g.handle = mig0058_handle.h);
-- Sicherung der betroffenen Speaker-Listen (ganze Liste je Session)
INSERT OR IGNORE INTO mig0058_backup(tabelle, schluessel, wert, zeit)
SELECT 'event_sessions', CAST(id AS TEXT), speakers, CAST(strftime('%s', 'now') AS INTEGER) FROM event_sessions
WHERE json_valid(speakers) AND json_type(speakers) = 'array' AND EXISTS (
  SELECT 1 FROM json_each(event_sessions.speakers) j
  WHERE j.type = 'object' AND json_type(CASE WHEN j.type = 'object' THEN j.value END, '$.h') = 'text'
    AND json_extract(CASE WHEN j.type = 'object' THEN j.value END, '$.h') IN (SELECT h FROM mig0058_handle)
);
UPDATE event_sessions SET speakers = (
  SELECT json_group_array(json(v)) FROM (
    SELECT CASE
      WHEN o.h IS NULL THEN CASE WHEN j.type IN ('object', 'array') THEN j.value ELSE json_quote(j.value) END
      WHEN json_extract(j.value, '$.e') = o.h THEN json_remove(j.value, '$.h', '$.t', '$.e')
      ELSE json_remove(j.value, '$.h', '$.t')
    END v, j.key k
    FROM json_each(event_sessions.speakers) j
    LEFT JOIN mig0058_handle o ON j.type = 'object' AND json_type(CASE WHEN j.type = 'object' THEN j.value END, '$.h') = 'text'
      AND o.h = json_extract(CASE WHEN j.type = 'object' THEN j.value END, '$.h')
    ORDER BY j.key
  )
)
WHERE json_valid(speakers) AND json_type(speakers) = 'array' AND EXISTS (
  SELECT 1 FROM json_each(event_sessions.speakers) j
  WHERE j.type = 'object' AND json_type(CASE WHEN j.type = 'object' THEN j.value END, '$.h') = 'text'
    AND json_extract(CASE WHEN j.type = 'object' THEN j.value END, '$.h') IN (SELECT h FROM mig0058_handle)
);
-- Blog-Abos auf eine Adresse ohne Profil und Firma: weg (wie releaseHandleOps und deleteUserData), vorher Sicherung
INSERT OR IGNORE INTO mig0058_backup(tabelle, schluessel, wert, zeit)
SELECT 'blog_follows', json_array(user_id, handle), json_object('user_id', user_id, 'handle', handle, 'created', created), CAST(strftime('%s', 'now') AS INTEGER) FROM blog_follows
WHERE handle IN (SELECT h FROM mig0058_handle);
DELETE FROM blog_follows WHERE handle IN (SELECT h FROM mig0058_handle);
-- Speaker-Identitaet: Bindung loesen, vorher Sicherung
INSERT OR IGNORE INTO mig0058_backup(tabelle, schluessel, wert, zeit)
SELECT 'speaker_ref', CAST(id AS TEXT), json_object('id', id, 'handle', handle), CAST(strftime('%s', 'now') AS INTEGER) FROM speaker_ref
WHERE handle IN (SELECT h FROM mig0058_handle);
UPDATE speaker_ref SET handle = '' WHERE handle IN (SELECT h FROM mig0058_handle);
-- Creator-Abos anderer Mitglieder und unversandte Creator-Meldungen: weg, vorher Sicherung
INSERT OR IGNORE INTO mig0058_backup(tabelle, schluessel, wert, zeit)
SELECT 'push_topics', json_array(endpoint, kind, topic_id), json_object('endpoint', endpoint, 'kind', kind, 'topic_id', topic_id, 'lang', lang, 'timezone', timezone, 'user_id', user_id, 'created', created), CAST(strftime('%s', 'now') AS INTEGER) FROM push_topics
WHERE kind = 'creator' AND topic_id IN (SELECT h FROM mig0058_handle);
INSERT OR IGNORE INTO mig0058_backup(tabelle, schluessel, wert, zeit)
SELECT 'email_topics', json_array(user_id, kind, topic_id), json_object('user_id', user_id, 'kind', kind, 'topic_id', topic_id, 'lang', lang, 'timezone', timezone, 'created', created), CAST(strftime('%s', 'now') AS INTEGER) FROM email_topics
WHERE kind = 'creator' AND topic_id IN (SELECT h FROM mig0058_handle);
INSERT OR IGNORE INTO mig0058_backup(tabelle, schluessel, wert, zeit)
SELECT 'topic_queue', CAST(id AS TEXT), json_object('id', id, 'channel', channel, 'recipient', recipient, 'lang', lang, 'timezone', timezone, 'kind', kind, 'topic_id', topic_id, 'item_key', item_key,
  'title', title, 'body', body, 'url', url, 'created', created, 'expires', expires, 'sent', sent), CAST(strftime('%s', 'now') AS INTEGER) FROM topic_queue
WHERE kind = 'creator' AND sent = 0 AND topic_id IN (SELECT h FROM mig0058_handle);
DELETE FROM push_topics WHERE kind = 'creator' AND topic_id IN (SELECT h FROM mig0058_handle);
DELETE FROM email_topics WHERE kind = 'creator' AND topic_id IN (SELECT h FROM mig0058_handle);
DELETE FROM topic_queue WHERE kind = 'creator' AND sent = 0 AND topic_id IN (SELECT h FROM mig0058_handle);
DROP TABLE mig0058_handle;
-- Themen-Abos anderer Mitglieder auf Personen-Entitaeten von Konten, die vor dem Deploy geloescht wurden (Merker user_id 0 aus 0057): weg, wie
-- deleteUserData seit Runde 8 (mit Sicherung). Sonst erbte der naechste Inhaber der Adresse (ownedEntity, gleiche eid) die Abonnenten der geloeschten Person.
INSERT OR IGNORE INTO mig0058_backup(tabelle, schluessel, wert, zeit)
SELECT 'push_topics', json_array(endpoint, kind, topic_id), json_object('endpoint', endpoint, 'kind', kind, 'topic_id', topic_id, 'lang', lang, 'timezone', timezone, 'user_id', user_id, 'created', created), CAST(strftime('%s', 'now') AS INTEGER) FROM push_topics
WHERE kind = 'entity' AND topic_id IN (SELECT eid FROM person_entity WHERE user_id = 0);
INSERT OR IGNORE INTO mig0058_backup(tabelle, schluessel, wert, zeit)
SELECT 'email_topics', json_array(user_id, kind, topic_id), json_object('user_id', user_id, 'kind', kind, 'topic_id', topic_id, 'lang', lang, 'timezone', timezone, 'created', created), CAST(strftime('%s', 'now') AS INTEGER) FROM email_topics
WHERE kind = 'entity' AND topic_id IN (SELECT eid FROM person_entity WHERE user_id = 0);
INSERT OR IGNORE INTO mig0058_backup(tabelle, schluessel, wert, zeit)
SELECT 'mail_topic_follows', json_array(user_id, eid), json_object('user_id', user_id, 'eid', eid, 'created', created, 'active', active), CAST(strftime('%s', 'now') AS INTEGER) FROM mail_topic_follows
WHERE eid IN (SELECT eid FROM person_entity WHERE user_id = 0);
DELETE FROM push_topics WHERE kind = 'entity' AND topic_id IN (SELECT eid FROM person_entity WHERE user_id = 0);
DELETE FROM email_topics WHERE kind = 'entity' AND topic_id IN (SELECT eid FROM person_entity WHERE user_id = 0);
DELETE FROM mail_topic_follows WHERE eid IN (SELECT eid FROM person_entity WHERE user_id = 0);
