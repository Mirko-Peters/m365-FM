-- QuickCreator HTTP Exporter (worker/src/quickcreator.js): Zuordnung QuickCreator-postId -> blog_posts.id, Hash des zuletzt uebernommenen Inhalts.
CREATE TABLE IF NOT EXISTS quickcreator_import (
  ext_id TEXT PRIMARY KEY,
  post_id INTEGER NOT NULL,
  hash TEXT NOT NULL,
  imported INTEGER NOT NULL
);
