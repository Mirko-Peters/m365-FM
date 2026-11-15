-- #279: Mehrere Anmeldungen (Google, Microsoft, LinkedIn, GitHub) an einem Community-Profil.
-- Eine Identitaet (Anbieter + Kennung) gehoert genau einem Konto. users.provider/sub bleiben aus Kompatibilitaet
-- (ADMIN_SUBS, Anzeige) als "Hauptanmeldung" stehen; die Anmeldung sucht zuerst hier.
CREATE TABLE IF NOT EXISTS user_identities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  provider TEXT NOT NULL,
  sub TEXT NOT NULL,
  created INTEGER NOT NULL,
  UNIQUE (provider, sub)
);
CREATE INDEX IF NOT EXISTS idx_user_identities_user ON user_identities(user_id);
INSERT OR IGNORE INTO user_identities(user_id, provider, sub, created) SELECT id, provider, sub, created FROM users;

-- Zusammengefuehrte Konten werden stillgelegt (banned=2), nicht geloescht; merged_into zeigt auf das Zielkonto.
ALTER TABLE users ADD COLUMN merged_into INTEGER;
ALTER TABLE users ADD COLUMN merged_at INTEGER NOT NULL DEFAULT 0;
