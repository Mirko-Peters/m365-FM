-- Geschaeftsadresse je Firma im Profil (Wunsch 11.11.2026): privat, nie oeffentlich, getrennt von der Privatadresse (profile_private, Umkreissuche).
-- Dient als Vorbefuellung fuer den Adress-Nachweis bei der Uebernahme einer Firmen-Entitaet. Eine Zeile je Konto und Firma (eid).
CREATE TABLE IF NOT EXISTS profile_business (
  user_id INTEGER NOT NULL,
  eid TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  street TEXT NOT NULL DEFAULT '',
  zip TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  updated INTEGER NOT NULL,
  PRIMARY KEY (user_id, eid)
);
-- Adress-Nachweis zur Uebernahme ohne Firmen-E-Mail: die Redaktion entscheidet (nie automatisch, die Adresse steht oeffentlich im Impressum).
-- Je Entitaet hoechstens eine offene Beanspruchung (entity_claims.eid), daher eid als Schluessel. Wird nach der Entscheidung geloescht (wie entity_claim_review).
-- addr_match: Abgleich mit der Firmenadresse der Repo-Fassung (PLZ + Strasse normalisiert): yes | no | unknown (keine Firmenadresse hinterlegt)
CREATE TABLE IF NOT EXISTS entity_claim_evidence (
  eid TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  street TEXT NOT NULL DEFAULT '',
  zip TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  addr_match TEXT NOT NULL DEFAULT 'unknown',
  created INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ece_user ON entity_claim_evidence(user_id);
