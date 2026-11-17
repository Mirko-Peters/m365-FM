-- Altbestand (Datenschutz Runde 8): Adressen, die keinem Profil mehr gehoeren. Der alte Code (vor privacy.js releaseHandleOps/forgetImporter)
-- liess bei Kontoloeschung UND Adresswechsel Speaker-Eintraege {h,n}, Blog-Abos (blog_follows.handle), die Speaker-Identitaet
-- (speaker_ref.handle) und Creator-Abos (push_topics/email_topics kind 'creator', topic_id = Adresse) auf der alten Adresse stehen. Speichert
-- ein anderes Mitglied die Adresse spaeter, erbte es Namen, Link, Bearbeitungsrecht (events.js: x.h === meine Adresse), offene Einladungen und
-- Abonnenten. Neuer Code raeumt nur Faelle NACH dem Deploy auf; diese Migration
-- einmal fuer den Bestand. Bewusst als Migration und nicht als Cron-Schritt: setup.mjs spielt sie VOR dem Deploy ein (kein Zeitfenster, in dem
-- jemand die Adresse uebernimmt, bevor der Nachtrag lief), D1 fuehrt sie genau einmal aus, und die Hilfstabellen werden am Ende entfernt. Erneut
-- ausgefuehrt aendert sie nichts (alle Bedingungen pruefen "Adresse ohne Profil", danach gibt es keine solchen Eintraege mehr).
--
-- "Ohne Profil": kein profiles-Eintrag (oeffentlich oder privat) mit genau dieser Adresse. Zuerst wird je Adresse h das Konto gesucht, das sie
-- frueher trug (Hilfstabelle mig0055_handle, am Ende wieder entfernt):
--  1. Merker person_entity aus 0054 (eid = Adresse). user_id > 0 mit vorhandenem Konto: dieses Konto. user_id 0 oder Konto weg: geloescht, KEIN
--     weiterer Rueckgriff (ein gleichnamiges anderes Mitglied ist nicht die geloeschte Person).
--  2. ohne Merker: genau ein vorhandenes Konto mit bestaetigtem Anspruch (entity_claims, status verified) auf die eid = Adresse.
--  3. sonst: genau ein vorhandenes, nicht zusammengefuehrtes Konto, dessen Name (ohne Gross-/Kleinschreibung) einem Namen der Speaker-Eintraege bzw.
--     der Speaker-Identitaet mit dieser Adresse entspricht. Fehlt der Merker, weil ownedEntity fuer die alte Adresse nie eine Entitaet anlegte (Adresse
--     war schon Repo-Entitaet, Profil aelter als ownedEntity oder beim Anlegen privat), bleibt der Eintrag so beim Konto. Ein Irrtum bei gleichem
--     Namen veroeffentlicht nichts Neues; eine Anonymisierung waere dagegen nicht umkehrbar.
-- Danach je Eintrag mit so einer Adresse h:
--  a) Konto gefunden und es hat heute eine Adresse nh: wie releaseHandleOps mit neuer Adresse - h -> nh, e = h -> nh; Name, Status, Token bleiben.
--     Blog-Abos, Speaker-Identitaet (speaker_ref.handle), Creator-Abos (push_topics/email_topics kind 'creator') und unversandte Creator-Meldungen
--     (topic_queue) ziehen ebenfalls auf nh um.
--  b) Konto gefunden, aber ohne Adresse: wie releaseHandleOps ohne neue Adresse - h, t und e = h fallen weg, der Eintrag bleibt mit uid an das Konto
--     gebunden (Name und Status bleiben; nur dieses Konto kann ihn wieder beanspruchen, events.js speakerMatches/claim).
--  b') Name mehrerer vorhandener Konten (mehrdeutig): wie b, aber ohne uid - Name und Status bleiben, keine Adresse.
--  c) kein Konto (geloescht): offene Einladungen (s = 'invited') werden verworfen, alle anderen wie privacy.js anonSpeaker zu
--     {n:'Former member', s, anon:1} - ohne Name, Adresse, Entitaet, Token und Kennungen.
-- Abos und Speaker-Identitaet auf eine Adresse ohne Profil, die nicht umziehen konnten (b, c), fallen weg bzw. verlieren die Bindung. Creator-Abos auf
-- Firmen-Adressen (orgs.handle) bleiben unberuehrt.
-- Reihenfolge der Liste bleibt (json_each nach key, Aggregat ueber die geordnete Unterabfrage).
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
-- mehrdeutig (Name mehrerer vorhandener Konten): nicht anonymisieren, nur die Adress-Bindung loesen (wie b, aber ohne uid)
UPDATE mig0055_handle SET src = 'ambig'
WHERE src = '' AND (SELECT COUNT(DISTINCT u.id) FROM users u JOIN mig0055_name x ON x.nk = lower(trim(u.name))
                    WHERE x.h = mig0055_handle.h AND u.merged_into IS NULL) > 1;
-- heutige Adresse des gefundenen Kontos
UPDATE mig0055_handle SET nh = COALESCE((SELECT p.handle FROM profiles p WHERE p.user_id = mig0055_handle.uid AND COALESCE(p.handle, '') <> ''), '')
WHERE uid IS NOT NULL;
UPDATE event_sessions SET speakers = (
  SELECT json_group_array(json(v)) FROM (
    SELECT CASE
      WHEN o.h IS NULL THEN CASE WHEN j.type IN ('object', 'array') THEN j.value ELSE json_quote(j.value) END
      WHEN o.uid IS NOT NULL AND o.nh <> '' THEN
        CASE WHEN json_extract(j.value, '$.e') = o.h THEN json_set(j.value, '$.h', o.nh, '$.e', o.nh) ELSE json_set(j.value, '$.h', o.nh) END
      WHEN o.uid IS NOT NULL THEN json_set(
        CASE WHEN json_extract(j.value, '$.e') = o.h THEN json_remove(j.value, '$.h', '$.t', '$.e') ELSE json_remove(j.value, '$.h', '$.t') END,
        '$.uid', o.uid)
      WHEN o.src = 'ambig' THEN
        CASE WHEN json_extract(j.value, '$.e') = o.h THEN json_remove(j.value, '$.h', '$.t', '$.e') ELSE json_remove(j.value, '$.h', '$.t') END
      WHEN json_extract(j.value, '$.s') = 'invited' THEN NULL
      WHEN json_extract(j.value, '$.s') IS NULL THEN json_object('n', 'Former member', 'anon', 1)
      ELSE json_object('n', 'Former member', 's', json_extract(j.value, '$.s'), 'anon', 1)
    END v, j.key k
    FROM json_each(event_sessions.speakers) j
    LEFT JOIN mig0055_handle o ON j.type = 'object' AND json_type(CASE WHEN j.type = 'object' THEN j.value END, '$.h') = 'text'
      AND o.h = json_extract(CASE WHEN j.type = 'object' THEN j.value END, '$.h')
    ORDER BY j.key
  ) WHERE v IS NOT NULL
)
WHERE json_valid(speakers) AND json_type(speakers) = 'array' AND EXISTS (
  SELECT 1 FROM json_each(event_sessions.speakers) j
  WHERE j.type = 'object' AND json_type(CASE WHEN j.type = 'object' THEN j.value END, '$.h') = 'text'
    AND json_extract(CASE WHEN j.type = 'object' THEN j.value END, '$.h') IN (SELECT h FROM mig0055_handle)
);
-- Blog-Abos: auf die heutige Adresse des Kontos umziehen (a), Rest auf eine Adresse ohne Profil weg (wie releaseHandleOps und deleteUserData)
UPDATE OR IGNORE blog_follows SET handle = (SELECT o.nh FROM mig0055_handle o WHERE o.h = blog_follows.handle)
WHERE handle IN (SELECT h FROM mig0055_handle WHERE nh <> '');
DELETE FROM blog_follows WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.handle = blog_follows.handle);
-- Speaker-Identitaet: umziehen (a), sonst Bindung loesen (der Import verknuepfte sie sonst mit dem naechsten Inhaber, eventmerge.js linkHandle)
UPDATE speaker_ref SET handle = COALESCE((SELECT o.nh FROM mig0055_handle o WHERE o.h = speaker_ref.handle), '')
WHERE handle <> '' AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.handle = speaker_ref.handle);
-- Creator-Abos anderer Mitglieder und unversandte Creator-Meldungen: umziehen (a), sonst weg - nicht fuer Firmen-Adressen
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
-- deleteUserData seit Runde 8. Sonst erbte der naechste Inhaber der Adresse (ownedEntity, gleiche eid) die Abonnenten der geloeschten Person.
DELETE FROM push_topics WHERE kind = 'entity' AND topic_id IN (SELECT eid FROM person_entity WHERE user_id = 0);
DELETE FROM email_topics WHERE kind = 'entity' AND topic_id IN (SELECT eid FROM person_entity WHERE user_id = 0);
DELETE FROM mail_topic_follows WHERE eid IN (SELECT eid FROM person_entity WHERE user_id = 0);
