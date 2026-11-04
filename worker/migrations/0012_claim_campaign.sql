CREATE TABLE IF NOT EXISTS entity_contact_lang (eid TEXT PRIMARY KEY, lang TEXT NOT NULL DEFAULT 'en');
CREATE TABLE IF NOT EXISTS claim_campaign_invites (
  eid TEXT PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  created INTEGER NOT NULL,
  sent_at INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'sending',
  reminded INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_claim_campaign_created ON claim_campaign_invites(created);
