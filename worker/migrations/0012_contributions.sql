CREATE TABLE IF NOT EXISTS contribution_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  kind TEXT NOT NULL,
  url TEXT NOT NULL,
  feed TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  public INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created INTEGER NOT NULL,
  fetched INTEGER NOT NULL DEFAULT 0,
  fails INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, url)
);
CREATE INDEX IF NOT EXISTS idx_contribution_sources_poll ON contribution_sources(active, fails, fetched);
CREATE INDEX IF NOT EXISTS idx_contribution_sources_user ON contribution_sources(user_id, created);

CREATE TABLE IF NOT EXISTS contributions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  source_id INTEGER,
  title TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  published INTEGER NOT NULL,
  kind TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  topics TEXT NOT NULL DEFAULT '[]',
  views INTEGER NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  metrics_updated INTEGER NOT NULL DEFAULT 0,
  public INTEGER NOT NULL DEFAULT 0,
  manual INTEGER NOT NULL DEFAULT 0,
  topics_edited INTEGER NOT NULL DEFAULT 0,
  created INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_contributions_user_url ON contributions(user_id, url) WHERE url<>'';
CREATE INDEX IF NOT EXISTS idx_contributions_user_date ON contributions(user_id, published DESC);
CREATE INDEX IF NOT EXISTS idx_contributions_metrics ON contributions(metrics_updated, kind);
CREATE TABLE IF NOT EXISTS contribution_ignored (
  user_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  created INTEGER NOT NULL,
  PRIMARY KEY(user_id, url)
);
