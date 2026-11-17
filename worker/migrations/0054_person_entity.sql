-- Personen-Entitaeten aus dem eigenen Profil (worker/src/profiles.js ownedEntity mit Typ person, Sicherheitspruefung K41): eid = Profil-Adresse,
-- user_id = Inhaber. Nur ownedEntity schreibt diese Tabelle; privacy.js HIDDEN_PERSON_SQL blendet die Entitaet aus, solange der Inhaber kein
-- oeffentliches Profil mit genau dieser Adresse hat. Beim Loeschen des Kontos bleibt die Zeile mit user_id 0 als Merker (Entitaet bleibt verborgen,
-- importEntitiesFromSite legt sie nicht aus dem letzten Seitenbau neu an). Additiv bis auf verwaiste Owner-Ansprueche geloeschter Konten (unten);
-- diese stehen vorher vollstaendig in der Sicherung mig0054_backup.
--
-- SICHERUNG mig0054_backup (bleibt dauerhaft, nicht oeffentlich: keine API liest sie, nur die D1-Sicherung exportiert sie). Vor dem Loeschen
-- steht dort jede entfernte Zeile: tabelle = 'entity_claims', schluessel = eid, wert = alle Spalten als JSON, zeit = Unix-Sekunden des Laufs.
-- UNIQUE (tabelle, schluessel): ein zweiter Lauf behaelt das erste Original.
-- ZURUECKSPIELEN (in D1: wrangler d1 execute m365-dub --remote --command "..."; einzelne Zeilen mit zusaetzlichem "AND schluessel = '<eid>'").
-- Achtung: der Anspruch gehoert einem geloeschten Konto - zurueckgespielt ist er wieder verwaist; deshalb moeglichst nur einzelne Zeilen.
--   INSERT OR IGNORE INTO entity_claims(eid, user_id, status, via, created, verified_via, verified_domain, fwd_mask)
--     SELECT json_extract(wert, '$.eid'), json_extract(wert, '$.user_id'), json_extract(wert, '$.status'), json_extract(wert, '$.via'),
--     json_extract(wert, '$.created'), json_extract(wert, '$.verified_via'), json_extract(wert, '$.verified_domain'), json_extract(wert, '$.fwd_mask')
--     FROM mig0054_backup WHERE tabelle = 'entity_claims';
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
-- Altbestand (Runde 7): Konten, die VOR dieser Migration geloescht wurden. Die alte Loeschung setzte entity_rev.user_id auf 0 und liess den
-- bestaetigten Owner-Anspruch mit der alten Konto-ID stehen; die Bedingung oben (r.user_id = c.user_id) trifft dann nicht. Erste Fassung von
-- ownedEntity (Selbst verwaltet, Typ person) mit user_id 0 und ein Anspruch auf ein nicht mehr vorhandenes Konto: Merker mit user_id 0 (Entitaet
-- verborgen wie nach deleteUserData) und den verwaisten Anspruch entfernen (der naechste Inhaber der Adresse erbt ihn nicht). Ebenso bestaetigte
-- manuelle Ansprueche (via='manual', Admin-Freigabe) eines geloeschten Kontos: ownedEntity legt sie nicht an, Altdaten koennen sie aber haben.
INSERT OR IGNORE INTO person_entity(eid, user_id, created)
SELECT c.eid, 0, c.created FROM entity_claims c
JOIN entity_rev r ON r.id = (SELECT MIN(x.id) FROM entity_rev x WHERE x.eid = c.eid AND x.status IN ('live', 'old'))
WHERE c.via IN ('owner', 'manual') AND c.status = 'verified' AND r.user_id = 0 AND r.summary = 'Selbst verwaltet'
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = c.user_id)
  AND (CASE WHEN json_valid(r.data) THEN json_extract(r.data, '$.type') END) = 'person';
CREATE TABLE IF NOT EXISTS mig0054_backup (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tabelle TEXT NOT NULL,
  schluessel TEXT NOT NULL,
  wert TEXT NOT NULL,
  zeit INTEGER NOT NULL,
  UNIQUE (tabelle, schluessel)
);
INSERT OR IGNORE INTO mig0054_backup(tabelle, schluessel, wert, zeit)
SELECT 'entity_claims', eid, json_object('eid', eid, 'user_id', user_id, 'status', status, 'via', via, 'created', created,
  'verified_via', verified_via, 'verified_domain', verified_domain, 'fwd_mask', fwd_mask), CAST(strftime('%s', 'now') AS INTEGER)
FROM entity_claims WHERE via IN ('owner', 'manual') AND status = 'verified'
  AND eid IN (SELECT eid FROM person_entity WHERE user_id = 0)
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = entity_claims.user_id);
DELETE FROM entity_claims WHERE via IN ('owner', 'manual') AND status = 'verified'
  AND eid IN (SELECT eid FROM person_entity WHERE user_id = 0)
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = entity_claims.user_id);
