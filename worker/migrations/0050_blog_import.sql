-- Blog-Import (BLOG_OWN_DOMAIN.md, Teil 3): welche Beitraege eines fremden Feeds ein Mitglied schon als Entwurf uebernommen hat.
-- item_key = guid (sonst Adresse) des Feed-Eintrags; je Mitglied und Eintrag nur einmal. mode: excerpt (Titel, Kurzfassung, Quelle) | full (Volltext).
-- rights = 1, wenn das Mitglied fuer den Volltext bestaetigt hat, die Rechte an diesem Text zu haben (Nachweis; zusaetzlich im Audit-Protokoll).
-- Der Beitrag selbst steht in blog_posts (status draft, note "import:<host> ..."); hier steht nur die Herkunft.
CREATE TABLE IF NOT EXISTS blog_import_items (
  user_id INTEGER NOT NULL,
  item_key TEXT NOT NULL,
  source_url TEXT NOT NULL,
  feed_url TEXT NOT NULL,
  post_id INTEGER NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('excerpt','full')),
  rights INTEGER NOT NULL DEFAULT 0,
  imported INTEGER NOT NULL,
  PRIMARY KEY (user_id, item_key),
  CHECK (mode <> 'full' OR rights = 1)
);
CREATE INDEX IF NOT EXISTS idx_blog_import_post ON blog_import_items(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_import_day ON blog_import_items(user_id, imported);
