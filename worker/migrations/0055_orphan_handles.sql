-- Altbestand (Datenschutz Runde 8-10): Adressen, die keinem Profil mehr gehoeren. Der alte Code (vor privacy.js releaseHandleOps/forgetImporter)
-- liess bei Kontoloeschung UND Adresswechsel Speaker-Eintraege {h,n}, Blog-Abos (blog_follows.handle), die Speaker-Identitaet
-- (speaker_ref.handle) und Creator-Abos (push_topics/email_topics kind 'creator', topic_id = Adresse) auf der alten Adresse stehen. Speichert
-- ein anderes Mitglied die Adresse spaeter, erbte es Namen, Link, Bearbeitungsrecht (events.js: x.h === meine Adresse), offene Einladungen und
-- Abonnenten. Neuer Code raeumt nur Faelle NACH dem Deploy auf; diese Migration einmal fuer den Bestand. Bewusst als Migration und nicht als
-- Cron-Schritt: setup.mjs spielt sie VOR dem Deploy ein (kein Zeitfenster, in dem jemand die Adresse uebernimmt, bevor der Nachtrag lief), D1
-- fuehrt sie genau einmal aus. Erneut ausgefuehrt aendert sie nichts (alle Bedingungen pruefen "Adresse ohne Profil", danach gibt es keine
-- solchen Eintraege mehr; die Sicherung behaelt je Zeile das erste Original).
--
-- Runde 10: Die Migration entfernt nichts unumkehrbar und anonymisiert niemanden. "Former member" entsteht nur bei echten Kontoloeschungen
-- nach dem Deploy (profiles.js deleteUserData), nie durch diese Migration.
--
-- SICHERUNG mig0055_backup (bleibt dauerhaft, nicht oeffentlich: keine API liest sie, nur die D1-Sicherung exportiert sie). Vor jeder Aenderung
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
--   UPDATE event_sessions SET speakers = (SELECT b.wert FROM mig0055_backup b WHERE b.tabelle = 'event_sessions' AND b.schluessel = CAST(event_sessions.id AS TEXT))
--     WHERE CAST(id AS TEXT) IN (SELECT schluessel FROM mig0055_backup WHERE tabelle = 'event_sessions');
--   UPDATE speaker_ref SET handle = (SELECT json_extract(b.wert, '$.handle') FROM mig0055_backup b WHERE b.tabelle = 'speaker_ref' AND b.schluessel = CAST(speaker_ref.id AS TEXT))
--     WHERE CAST(id AS TEXT) IN (SELECT schluessel FROM mig0055_backup WHERE tabelle = 'speaker_ref');
--   INSERT OR IGNORE INTO blog_follows(user_id, handle, created) SELECT json_extract(wert, '$.user_id'), json_extract(wert, '$.handle'),
--     json_extract(wert, '$.created') FROM mig0055_backup WHERE tabelle = 'blog_follows';
--   INSERT OR IGNORE INTO push_topics(endpoint, kind, topic_id, lang, timezone, user_id, created) SELECT json_extract(wert, '$.endpoint'),
--     json_extract(wert, '$.kind'), json_extract(wert, '$.topic_id'), json_extract(wert, '$.lang'), json_extract(wert, '$.timezone'),
--     json_extract(wert, '$.user_id'), json_extract(wert, '$.created') FROM mig0055_backup WHERE tabelle = 'push_topics';
--   INSERT OR IGNORE INTO email_topics(user_id, kind, topic_id, lang, timezone, created) SELECT json_extract(wert, '$.user_id'), json_extract(wert, '$.kind'),
--     json_extract(wert, '$.topic_id'), json_extract(wert, '$.lang'), json_extract(wert, '$.timezone'), json_extract(wert, '$.created')
--     FROM mig0055_backup WHERE tabelle = 'email_topics';
--   INSERT OR REPLACE INTO topic_queue(id, channel, recipient, lang, timezone, kind, topic_id, item_key, title, body, url, created, expires, sent)
--     SELECT json_extract(wert, '$.id'), json_extract(wert, '$.channel'), json_extract(wert, '$.recipient'), json_extract(wert, '$.lang'),
--     json_extract(wert, '$.timezone'), json_extract(wert, '$.kind'), json_extract(wert, '$.topic_id'), json_extract(wert, '$.item_key'),
--     json_extract(wert, '$.title'), json_extract(wert, '$.body'), json_extract(wert, '$.url'), json_extract(wert, '$.created'),
--     json_extract(wert, '$.expires'), json_extract(wert, '$.sent') FROM mig0055_backup WHERE tabelle = 'topic_queue';
--   INSERT OR IGNORE INTO mail_topic_follows(user_id, eid, created, active) SELECT json_extract(wert, '$.user_id'), json_extract(wert, '$.eid'),
--     json_extract(wert, '$.created'), json_extract(wert, '$.active') FROM mig0055_backup WHERE tabelle = 'mail_topic_follows';
-- Umgezogene Abos (auf die heutige Adresse des Kontos) bleiben dabei stehen; zurueck kommen die alten Zeilen daneben.
--
-- "Ohne Profil": kein profiles-Eintrag (oeffentlich oder privat) mit genau dieser Adresse. Zuerst wird je Adresse h das Konto gesucht, das sie
-- frueher trug (Hilfstabelle mig0055_handle, am Ende wieder entfernt):
--  1. Merker person_entity aus 0054 (eid = Adresse). user_id > 0 mit vorhandenem Konto: dieses Konto. user_id 0 oder Konto weg: kein Konto, KEIN
--     weiterer Rueckgriff (ein gleichnamiges anderes Mitglied ist nicht die geloeschte Person).
--  2. ohne Merker: genau ein vorhandenes Konto mit bestaetigtem Anspruch (entity_claims, status verified) auf die eid = Adresse.
--  3. sonst: genau ein vorhandenes, nicht zusammengefuehrtes Konto, dessen Name (ohne Gross-/Kleinschreibung) einem Namen der Speaker-Eintraege bzw.
--     der Speaker-Identitaet mit dieser Adresse entspricht. Name mehrerer Konten (mehrdeutig) gilt als "kein Konto gefunden".
-- Danach je Speaker-Eintrag mit so einer Adresse h:
--  a) Konto gefunden und es hat heute eine Adresse nh: wie releaseHandleOps mit neuer Adresse - h -> nh, e = h -> nh; Name, Status, Token bleiben.
--     Blog-Abos, Speaker-Identitaet (speaker_ref.handle), Creator-Abos (push_topics/email_topics kind 'creator') und unversandte Creator-Meldungen
--     (topic_queue) ziehen ebenfalls auf nh um.
--  b) Konto gefunden, aber ohne Adresse: wie releaseHandleOps ohne neue Adresse - h, t und e = h fallen weg, der Eintrag bleibt mit uid an das Konto
--     gebunden (Name und Status bleiben; nur dieses Konto kann ihn wieder beanspruchen, events.js speakerMatches/claim).
--  c) kein Konto gefunden (geloescht, Merker ohne Konto, mehrdeutiger Name): nur die Adressbindung loesen - h, t und e = h fallen weg, Name n,
--     Status s und alle uebrigen Felder bleiben. Offene Einladungen (s = 'invited') bleiben ebenfalls stehen und verlieren nur h und t, damit
--     niemand sie ueber die Adresse annehmen kann.
-- Blog-Abos, Speaker-Identitaet und Creator-Abos auf eine Adresse ohne Profil, die nicht umziehen konnten (b, c), fallen weg bzw. verlieren die
-- Bindung - jeweils mit Sicherung. Creator-Abos auf Firmen-Adressen (orgs.handle) bleiben unberuehrt.
-- Reihenfolge der Liste bleibt (json_each nach key, Aggregat ueber die geordnete Unterabfrage); kein Eintrag wird entfernt.
CREATE TABLE IF NOT EXISTS mig0055_backup (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tabelle TEXT NOT NULL,
  schluessel TEXT NOT NULL,
  wert TEXT NOT NULL,
  zeit INTEGER NOT NULL,
  UNIQUE (tabelle, schluessel)
);
CREATE TABLE IF NOT EXISTS mig0055_handle (h TEXT PRIMARY KEY, src TEXT NOT NULL DEFAULT '', uid INTEGER, nh TEXT NOT NULL DEFAULT '');
CREATE TABLE IF NOT EXISTS mig0055_name (h TEXT NOT NULL, nk TEXT NOT NULL, PRIMARY KEY (h, nk));
DELETE FROM mig0055_handle;
DELETE FROM mig0055_name;
INSERT OR IGNORE INTO mig0055_handle(h)
SELECT json_extract(CASE WHEN j.type = 'object' THEN j.value END, '$.h') FROM event_sessions s,
  json_each(CASE WHEN json_valid(s.speakers) AND json_type(s.speakers) = 'array' THEN s.speakers ELSE '[]' END) j
WHERE j.type = 'object' AND json_type(CASE WHEN j.type = 'object' THEN j.value END, '$.h') = 'text'
  AND json_extract(CASE WHEN j.type = 'object' THEN j.value END, '$.h') <> '';
INSERT OR IGNORE INTO mig0055_handle(h) SELECT handle FROM blog_follows WHERE handle <> '';
INSERT OR IGNORE INTO mig0055_handle(h) SELECT handle FROM speaker_ref WHERE handle <> '';
INSERT OR IGNORE INTO mig0055_handle(h) SELECT topic_id FROM push_topics WHERE kind = 'creator' AND topic_id <> '';
INSERT OR IGNORE INTO mig0055_handle(h) SELECT topic_id FROM email_topics WHERE kind = 'creator' AND topic_id <> '';
INSERT OR IGNORE INTO mig0055_handle(h) SELECT topic_id FROM topic_queue WHERE kind = 'creator' AND sent = 0 AND topic_id <> '';
DELETE FROM mig0055_handle WHERE EXISTS (SELECT 1 FROM profiles p WHERE p.handle = mig0055_handle.h);
-- 1. Merker
UPDATE mig0055_handle SET src = 'pe',
  uid = (SELECT u.id FROM person_entity pe JOIN users u ON u.id = pe.user_id WHERE pe.eid = mig0055_handle.h AND pe.user_id > 0)
WHERE EXISTS (SELECT 1 FROM person_entity pe WHERE pe.eid = mig0055_handle.h);
-- 2. bestaetigter Anspruch genau eines vorhandenen Kontos
UPDATE mig0055_handle SET src = 'claim',
  uid = (SELECT MIN(c.user_id) FROM entity_claims c JOIN users u ON u.id = c.user_id WHERE c.eid = mig0055_handle.h AND c.status = 'verified')
WHERE src = '' AND (SELECT COUNT(DISTINCT c.user_id) FROM entity_claims c JOIN users u ON u.id = c.user_id
                    WHERE c.eid = mig0055_handle.h AND c.status = 'verified') = 1;
-- 3. Name genau eines vorhandenen Kontos
INSERT OR IGNORE INTO mig0055_name(h, nk)
SELECT json_extract(CASE WHEN j.type = 'object' THEN j.value END, '$.h'), lower(trim(json_extract(CASE WHEN j.type = 'object' THEN j.value END, '$.n')))
FROM event_sessions s, json_each(CASE WHEN json_valid(s.speakers) AND json_type(s.speakers) = 'array' THEN s.speakers ELSE '[]' END) j
WHERE j.type = 'object' AND json_type(CASE WHEN j.type = 'object' THEN j.value END, '$.h') = 'text'
  AND json_type(CASE WHEN j.type = 'object' THEN j.value END, '$.n') = 'text'
  AND json_extract(CASE WHEN j.type = 'object' THEN j.value END, '$.h') IN (SELECT h FROM mig0055_handle WHERE src = '');
INSERT OR IGNORE INTO mig0055_name(h, nk) SELECT handle, lower(trim(name)) FROM speaker_ref WHERE handle IN (SELECT h FROM mig0055_handle WHERE src = '');
DELETE FROM mig0055_name WHERE nk IN ('', 'former member');
UPDATE mig0055_handle SET src = 'name',
  uid = (SELECT MIN(u.id) FROM users u JOIN mig0055_name x ON x.nk = lower(trim(u.name)) WHERE x.h = mig0055_handle.h AND u.merged_into IS NULL)
WHERE src = '' AND (SELECT COUNT(DISTINCT u.id) FROM users u JOIN mig0055_name x ON x.nk = lower(trim(u.name))
                    WHERE x.h = mig0055_handle.h AND u.merged_into IS NULL) = 1;
-- heutige Adresse des gefundenen Kontos
UPDATE mig0055_handle SET nh = COALESCE((SELECT p.handle FROM profiles p WHERE p.user_id = mig0055_handle.uid AND COALESCE(p.handle, '') <> ''), '')
WHERE uid IS NOT NULL;
-- Sicherung der betroffenen Speaker-Listen (ganze Liste je Session)
INSERT OR IGNORE INTO mig0055_backup(tabelle, schluessel, wert, zeit)
SELECT 'event_sessions', CAST(id AS TEXT), speakers, CAST(strftime('%s', 'now') AS INTEGER) FROM event_sessions
WHERE json_valid(speakers) AND json_type(speakers) = 'array' AND EXISTS (
  SELECT 1 FROM json_each(event_sessions.speakers) j
  WHERE j.type = 'object' AND json_type(CASE WHEN j.type = 'object' THEN j.value END, '$.h') = 'text'
    AND json_extract(CASE WHEN j.type = 'object' THEN j.value END, '$.h') IN (SELECT h FROM mig0055_handle)
);
UPDATE event_sessions SET speakers = (
  SELECT json_group_array(json(v)) FROM (
    SELECT CASE
      WHEN o.h IS NULL THEN CASE WHEN j.type IN ('object', 'array') THEN j.value ELSE json_quote(j.value) END
      WHEN o.uid IS NOT NULL AND o.nh <> '' THEN
        CASE WHEN json_extract(j.value, '$.e') = o.h THEN json_set(j.value, '$.h', o.nh, '$.e', o.nh) ELSE json_set(j.value, '$.h', o.nh) END
      WHEN o.uid IS NOT NULL THEN json_set(
        CASE WHEN json_extract(j.value, '$.e') = o.h THEN json_remove(j.value, '$.h', '$.t', '$.e') ELSE json_remove(j.value, '$.h', '$.t') END,
        '$.uid', o.uid)
      ELSE CASE WHEN json_extract(j.value, '$.e') = o.h THEN json_remove(j.value, '$.h', '$.t', '$.e') ELSE json_remove(j.value, '$.h', '$.t') END
    END v, j.key k
    FROM json_each(event_sessions.speakers) j
    LEFT JOIN mig0055_handle o ON j.type = 'object' AND json_type(CASE WHEN j.type = 'object' THEN j.value END, '$.h') = 'text'
      AND o.h = json_extract(CASE WHEN j.type = 'object' THEN j.value END, '$.h')
    ORDER BY j.key
  )
)
WHERE json_valid(speakers) AND json_type(speakers) = 'array' AND EXISTS (
  SELECT 1 FROM json_each(event_sessions.speakers) j
  WHERE j.type = 'object' AND json_type(CASE WHEN j.type = 'object' THEN j.value END, '$.h') = 'text'
    AND json_extract(CASE WHEN j.type = 'object' THEN j.value END, '$.h') IN (SELECT h FROM mig0055_handle)
);
-- Blog-Abos: auf die heutige Adresse des Kontos umziehen (a), Rest auf eine Adresse ohne Profil weg (wie releaseHandleOps und deleteUserData), vorher Sicherung
INSERT OR IGNORE INTO mig0055_backup(tabelle, schluessel, wert, zeit)
SELECT 'blog_follows', json_array(user_id, handle), json_object('user_id', user_id, 'handle', handle, 'created', created), CAST(strftime('%s', 'now') AS INTEGER) FROM blog_follows
WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.handle = blog_follows.handle);
UPDATE OR IGNORE blog_follows SET handle = (SELECT o.nh FROM mig0055_handle o WHERE o.h = blog_follows.handle)
WHERE handle IN (SELECT h FROM mig0055_handle WHERE nh <> '');
DELETE FROM blog_follows WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.handle = blog_follows.handle);
-- Speaker-Identitaet: umziehen (a), sonst Bindung loesen (der Import verknuepfte sie sonst mit dem naechsten Inhaber, eventmerge.js linkHandle)
INSERT OR IGNORE INTO mig0055_backup(tabelle, schluessel, wert, zeit)
SELECT 'speaker_ref', CAST(id AS TEXT), json_object('id', id, 'handle', handle), CAST(strftime('%s', 'now') AS INTEGER) FROM speaker_ref
WHERE handle <> '' AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.handle = speaker_ref.handle);
UPDATE speaker_ref SET handle = COALESCE((SELECT o.nh FROM mig0055_handle o WHERE o.h = speaker_ref.handle), '')
WHERE handle <> '' AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.handle = speaker_ref.handle);
-- Creator-Abos anderer Mitglieder und unversandte Creator-Meldungen: umziehen (a), sonst weg - nicht fuer Firmen-Adressen
INSERT OR IGNORE INTO mig0055_backup(tabelle, schluessel, wert, zeit)
SELECT 'push_topics', json_array(endpoint, kind, topic_id), json_object('endpoint', endpoint, 'kind', kind, 'topic_id', topic_id, 'lang', lang, 'timezone', timezone, 'user_id', user_id, 'created', created), CAST(strftime('%s', 'now') AS INTEGER) FROM push_topics
WHERE kind = 'creator' AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.handle = push_topics.topic_id)
  AND NOT EXISTS (SELECT 1 FROM orgs g WHERE g.handle = push_topics.topic_id);
INSERT OR IGNORE INTO mig0055_backup(tabelle, schluessel, wert, zeit)
SELECT 'email_topics', json_array(user_id, kind, topic_id), json_object('user_id', user_id, 'kind', kind, 'topic_id', topic_id, 'lang', lang, 'timezone', timezone, 'created', created), CAST(strftime('%s', 'now') AS INTEGER) FROM email_topics
WHERE kind = 'creator' AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.handle = email_topics.topic_id)
  AND NOT EXISTS (SELECT 1 FROM orgs g WHERE g.handle = email_topics.topic_id);
INSERT OR IGNORE INTO mig0055_backup(tabelle, schluessel, wert, zeit)
SELECT 'topic_queue', CAST(id AS TEXT), json_object('id', id, 'channel', channel, 'recipient', recipient, 'lang', lang, 'timezone', timezone, 'kind', kind, 'topic_id', topic_id, 'item_key', item_key,
  'title', title, 'body', body, 'url', url, 'created', created, 'expires', expires, 'sent', sent), CAST(strftime('%s', 'now') AS INTEGER) FROM topic_queue
WHERE kind = 'creator' AND sent = 0 AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.handle = topic_queue.topic_id)
  AND NOT EXISTS (SELECT 1 FROM orgs g WHERE g.handle = topic_queue.topic_id);
UPDATE OR IGNORE push_topics SET topic_id = (SELECT o.nh FROM mig0055_handle o WHERE o.h = push_topics.topic_id)
WHERE kind = 'creator' AND topic_id IN (SELECT h FROM mig0055_handle WHERE nh <> '') AND NOT EXISTS (SELECT 1 FROM orgs g WHERE g.handle = push_topics.topic_id);
UPDATE OR IGNORE email_topics SET topic_id = (SELECT o.nh FROM mig0055_handle o WHERE o.h = email_topics.topic_id)
WHERE kind = 'creator' AND topic_id IN (SELECT h FROM mig0055_handle WHERE nh <> '') AND NOT EXISTS (SELECT 1 FROM orgs g WHERE g.handle = email_topics.topic_id);
UPDATE OR IGNORE topic_queue SET topic_id = (SELECT o.nh FROM mig0055_handle o WHERE o.h = topic_queue.topic_id)
WHERE kind = 'creator' AND sent = 0 AND topic_id IN (SELECT h FROM mig0055_handle WHERE nh <> '') AND NOT EXISTS (SELECT 1 FROM orgs g WHERE g.handle = topic_queue.topic_id);
DELETE FROM push_topics WHERE kind = 'creator' AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.handle = push_topics.topic_id)
  AND NOT EXISTS (SELECT 1 FROM orgs g WHERE g.handle = push_topics.topic_id);
DELETE FROM email_topics WHERE kind = 'creator' AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.handle = email_topics.topic_id)
  AND NOT EXISTS (SELECT 1 FROM orgs g WHERE g.handle = email_topics.topic_id);
DELETE FROM topic_queue WHERE kind = 'creator' AND sent = 0 AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.handle = topic_queue.topic_id)
  AND NOT EXISTS (SELECT 1 FROM orgs g WHERE g.handle = topic_queue.topic_id);
DROP TABLE mig0055_name;
DROP TABLE mig0055_handle;
-- Themen-Abos anderer Mitglieder auf Personen-Entitaeten von Konten, die vor dem Deploy geloescht wurden (Merker user_id 0 aus 0054): weg, wie
-- deleteUserData seit Runde 8 (mit Sicherung). Sonst erbte der naechste Inhaber der Adresse (ownedEntity, gleiche eid) die Abonnenten der geloeschten Person.
INSERT OR IGNORE INTO mig0055_backup(tabelle, schluessel, wert, zeit)
SELECT 'push_topics', json_array(endpoint, kind, topic_id), json_object('endpoint', endpoint, 'kind', kind, 'topic_id', topic_id, 'lang', lang, 'timezone', timezone, 'user_id', user_id, 'created', created), CAST(strftime('%s', 'now') AS INTEGER) FROM push_topics
WHERE kind = 'entity' AND topic_id IN (SELECT eid FROM person_entity WHERE user_id = 0);
INSERT OR IGNORE INTO mig0055_backup(tabelle, schluessel, wert, zeit)
SELECT 'email_topics', json_array(user_id, kind, topic_id), json_object('user_id', user_id, 'kind', kind, 'topic_id', topic_id, 'lang', lang, 'timezone', timezone, 'created', created), CAST(strftime('%s', 'now') AS INTEGER) FROM email_topics
WHERE kind = 'entity' AND topic_id IN (SELECT eid FROM person_entity WHERE user_id = 0);
INSERT OR IGNORE INTO mig0055_backup(tabelle, schluessel, wert, zeit)
SELECT 'mail_topic_follows', json_array(user_id, eid), json_object('user_id', user_id, 'eid', eid, 'created', created, 'active', active), CAST(strftime('%s', 'now') AS INTEGER) FROM mail_topic_follows
WHERE eid IN (SELECT eid FROM person_entity WHERE user_id = 0);
DELETE FROM push_topics WHERE kind = 'entity' AND topic_id IN (SELECT eid FROM person_entity WHERE user_id = 0);
DELETE FROM email_topics WHERE kind = 'entity' AND topic_id IN (SELECT eid FROM person_entity WHERE user_id = 0);
DELETE FROM mail_topic_follows WHERE eid IN (SELECT eid FROM person_entity WHERE user_id = 0);
