-- Branche und Job/Rolle als Entitaeten (Typen industry und job): Auswahl im Mitglieds- und Firmenprofil.
-- Neue Eintraege entstehen ueber den bestehenden Entitaets-Weg (POST /api/entity: entity_rev, bei Neulingen 'pending' bis zur Freigabe in der Verwaltung).
-- Oeffentlich (Profilseite, Entitaetsseite, Export) wirkt eine Auswahl erst, wenn die Entitaet live ist; vorher sieht nur die auswaehlende Person sie.
CREATE TABLE IF NOT EXISTS profile_industry (
  user_id INTEGER NOT NULL,
  eid TEXT NOT NULL,
  PRIMARY KEY (user_id, eid)
);
CREATE INDEX IF NOT EXISTS idx_profile_industry_eid ON profile_industry(eid);
CREATE TABLE IF NOT EXISTS profile_job (
  user_id INTEGER PRIMARY KEY,
  eid TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_profile_job_eid ON profile_job(eid);
CREATE TABLE IF NOT EXISTS org_industry (
  org_id INTEGER NOT NULL,
  eid TEXT NOT NULL,
  PRIMARY KEY (org_id, eid)
);
CREATE INDEX IF NOT EXISTS idx_org_industry_eid ON org_industry(eid);
