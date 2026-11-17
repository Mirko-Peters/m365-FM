-- Personen-Entitaeten aus dem eigenen Profil (worker/src/profiles.js ownedEntity mit Typ person, Sicherheitspruefung K41): eid = Profil-Adresse,
-- user_id = Inhaber. Nur ownedEntity schreibt diese Tabelle; privacy.js HIDDEN_PERSON_SQL blendet die Entitaet aus, solange der Inhaber kein
-- oeffentliches Profil mit genau dieser Adresse hat. Beim Loeschen des Kontos bleibt die Zeile mit user_id 0 als Merker (Entitaet bleibt verborgen,
-- importEntitiesFromSite legt sie nicht aus dem letzten Seitenbau neu an). Nur additiv.
CREATE TABLE IF NOT EXISTS person_entity (
  eid TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_person_entity_user ON person_entity(user_id);
-- Bestand: die erste live/old-Fassung der eid stammt von ownedEntity (Zusammenfassung "Selbst verwaltet", Typ person) und vom Inhaber des
-- bestaetigten Owner-Anspruchs. Spaetere Vorschlaege mit derselben Zusammenfassung zaehlen nicht (sonst koennte jedes Mitglied fremde
-- Entitaeten ausblenden).
INSERT OR IGNORE INTO person_entity(eid, user_id, created)
SELECT c.eid, c.user_id, c.created FROM entity_claims c
JOIN entity_rev r ON r.id = (SELECT MIN(x.id) FROM entity_rev x WHERE x.eid = c.eid AND x.status IN ('live', 'old'))
WHERE c.via = 'owner' AND c.status = 'verified' AND r.user_id = c.user_id AND r.summary = 'Selbst verwaltet'
  AND (CASE WHEN json_valid(r.data) THEN json_extract(r.data, '$.type') END) = 'person';
