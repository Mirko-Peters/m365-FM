-- Altbestand (Datenschutz Runde 8): Adressen, die keinem Profil mehr gehoeren. Der alte Code (vor privacy.js releaseHandleOps/forgetImporter)
-- liess bei Kontoloeschung UND Adresswechsel Speaker-Eintraege {h,n}, Blog-Abos (blog_follows.handle) und die Speaker-Identitaet
-- (speaker_ref.handle) auf der alten Adresse stehen. Speichert ein anderes Mitglied die Adresse spaeter, erbte es Namen, Link, Bearbeitungsrecht
-- (events.js: x.h === meine Adresse), offene Einladungen und Abonnenten. Neuer Code raeumt nur Faelle NACH dem Deploy auf; diese Migration
-- einmal fuer den Bestand. Bewusst als Migration und nicht als Cron-Schritt: setup.mjs spielt sie VOR dem Deploy ein (kein Zeitfenster, in dem
-- jemand die Adresse uebernimmt, bevor der Nachtrag lief), D1 fuehrt sie genau einmal aus, und jede Anweisung ist fuer sich atomar. Erneut
-- ausgefuehrt aendert sie nichts (alle Bedingungen pruefen "Adresse ohne Profil", danach gibt es keine solchen Eintraege mehr).
--
-- "Ohne Profil": kein profiles-Eintrag (oeffentlich oder privat) mit genau dieser Adresse. Pro Speaker-Eintrag mit so einer Adresse h:
--  a) h war die fruehere Adresse eines noch bestehenden Kontos (Merker person_entity aus 0054, eid = Adresse, user_id > 0, Konto vorhanden):
--     wie releaseHandleOps ohne neue Adresse - h, Einladungstoken t und die Entitaet e = h fallen weg, der Eintrag bleibt mit uid an das Konto
--     gebunden (Name und Status bleiben; nur dieses Konto kann ihn wieder beanspruchen, events.js speakerMatches/claim).
--  b) sonst (Konto geloescht oder Herkunft unbekannt): offene Einladungen (s = 'invited') werden verworfen, alle anderen wie privacy.js anonSpeaker
--     zu {n:'Former member', s, anon:1} - ohne Name, Adresse, Entitaet, Token und Kennungen.
-- Reihenfolge der Liste bleibt (json_each nach key, Aggregat ueber die geordnete Unterabfrage).
UPDATE event_sessions SET speakers = (
  SELECT json_group_array(json(v)) FROM (
    SELECT CASE
      WHEN o.h IS NULL THEN CASE WHEN j.type IN ('object', 'array') THEN j.value ELSE json_quote(j.value) END
      WHEN o.uid IS NOT NULL THEN json_set(
        CASE WHEN json_extract(j.value, '$.e') = o.h THEN json_remove(j.value, '$.h', '$.t', '$.e') ELSE json_remove(j.value, '$.h', '$.t') END,
        '$.uid', o.uid)
      WHEN json_extract(j.value, '$.s') = 'invited' THEN NULL
      WHEN json_extract(j.value, '$.s') IS NULL THEN json_object('n', 'Former member', 'anon', 1)
      ELSE json_object('n', 'Former member', 's', json_extract(j.value, '$.s'), 'anon', 1)
    END v, j.key k
    FROM json_each(event_sessions.speakers) j
    LEFT JOIN (
      SELECT x.h, (SELECT pe.user_id FROM person_entity pe JOIN users u ON u.id = pe.user_id WHERE pe.eid = x.h AND pe.user_id > 0) uid
      FROM (SELECT DISTINCT json_extract(jj.value, '$.h') h FROM json_each(event_sessions.speakers) jj
            WHERE jj.type = 'object' AND COALESCE(json_extract(jj.value, '$.h'), '') <> '') x
      WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.handle = x.h)
    ) o ON j.type = 'object' AND o.h = json_extract(j.value, '$.h')
    ORDER BY j.key
  ) WHERE v IS NOT NULL
)
WHERE json_valid(speakers) AND json_type(speakers) = 'array' AND EXISTS (
  SELECT 1 FROM json_each(event_sessions.speakers) j
  WHERE j.type = 'object' AND COALESCE(json_extract(j.value, '$.h'), '') <> ''
    AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.handle = json_extract(j.value, '$.h'))
);
-- Blog-Abos auf eine Adresse ohne Profil: weg (wie releaseHandleOps ohne neue Adresse und deleteUserData)
DELETE FROM blog_follows WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.handle = blog_follows.handle);
-- Speaker-Identitaet mit einer Adresse ohne Profil: Bindung loesen (der Import verknuepft sie sonst mit dem naechsten Inhaber, eventmerge.js linkHandle)
UPDATE speaker_ref SET handle = '' WHERE handle <> '' AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.handle = speaker_ref.handle);
-- Themen-Abos anderer Mitglieder auf Personen-Entitaeten von Konten, die vor dem Deploy geloescht wurden (Merker user_id 0 aus 0054): weg, wie
-- deleteUserData seit Runde 8. Sonst erbte der naechste Inhaber der Adresse (ownedEntity, gleiche eid) die Abonnenten der geloeschten Person.
DELETE FROM push_topics WHERE kind = 'entity' AND topic_id IN (SELECT eid FROM person_entity WHERE user_id = 0);
DELETE FROM email_topics WHERE kind = 'entity' AND topic_id IN (SELECT eid FROM person_entity WHERE user_id = 0);
DELETE FROM mail_topic_follows WHERE eid IN (SELECT eid FROM person_entity WHERE user_id = 0);
