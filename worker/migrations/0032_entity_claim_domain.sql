-- Entitaet beanspruchen per Firmen-E-Mail (Domain-Bestaetigung) und "Weitergeben" an Kolleg:innen.
-- entity_claims.status: pending | email_sent | forwarded | verified | rejected
ALTER TABLE entity_claims ADD COLUMN verified_via TEXT NOT NULL DEFAULT '';      -- '' | domain_email | admin
ALTER TABLE entity_claims ADD COLUMN verified_domain TEXT NOT NULL DEFAULT '';
ALTER TABLE entity_claims ADD COLUMN fwd_mask TEXT NOT NULL DEFAULT '';          -- maskierte Adresse der Weitergabe (j***@firma.de)
-- Einmal-Links: nur der Hash des Tokens und der Hash der Adresse werden gespeichert (Klartext-Adresse nie).
CREATE TABLE IF NOT EXISTS entity_claim_mail (
  token_hash TEXT PRIMARY KEY,
  eid TEXT NOT NULL,
  kind TEXT NOT NULL,                 -- verify | forward
  claim_user INTEGER NOT NULL,        -- Anfragende:r
  email_hash TEXT NOT NULL,
  email_mask TEXT NOT NULL,
  domain TEXT NOT NULL,
  expires INTEGER NOT NULL,
  used INTEGER NOT NULL DEFAULT 0,
  created INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ecm_eid ON entity_claim_mail(eid);
CREATE INDEX IF NOT EXISTS idx_ecm_user ON entity_claim_mail(claim_user);
-- Bestehende bestaetigte Claims: Herkunft nachtragen
UPDATE entity_claims SET verified_via=CASE WHEN via='invite' THEN 'invite' WHEN via='owner' THEN 'owner' ELSE 'admin' END WHERE status='verified' AND verified_via='';
