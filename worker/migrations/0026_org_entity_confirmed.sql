-- Firmenkonto <-> Firmen-Entitaet bestaetigt: nur bestaetigte Verknuepfungen zeigen die oeffentlichen Mitglieder der Community-Firma
-- auf der Entitaetsseite (Personen) und als employee im Schema.org-Knoten der Entitaet. Automatische Verknuepfung ueber den Namen
-- bleibt unbestaetigt (0); bestaetigt (1) wird sie, wenn Inhaber/Admin der Firma die Entitaet waehlt und die Entitaet beansprucht hat
-- (oder Redaktion/Admin), oder wenn die Firma die Entitaet beim Anlegen selbst erzeugt hat.
ALTER TABLE org_entity ADD COLUMN confirmed INTEGER NOT NULL DEFAULT 0;
-- Bestand: bestaetigt, wenn ein aktiver Inhaber/Admin der Firma die Entitaet bestaetigt beansprucht hat (z. B. beim Anlegen erzeugte Entitaet, M365.FM-Firmen)
UPDATE org_entity SET confirmed=1 WHERE EXISTS (
  SELECT 1 FROM entity_claims c JOIN org_members m ON m.user_id=c.user_id
  WHERE c.eid=org_entity.eid AND c.status='verified' AND m.org_id=org_entity.org_id AND m.status='active' AND m.role IN ('owner','admin'));
