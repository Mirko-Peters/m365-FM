CREATE TABLE IF NOT EXISTS sponsor_links (
  code TEXT PRIMARY KEY,
  org_id INTEGER NOT NULL,
  placement_id TEXT NOT NULL,
  target_url TEXT NOT NULL,
  utm TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sponsor_links_placement
  ON sponsor_links(placement_id, active);

CREATE TABLE IF NOT EXISTS sponsor_clicks_daily (
  day TEXT NOT NULL,
  code TEXT NOT NULL,
  surface TEXT NOT NULL,
  country TEXT NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(day, code, surface, country)
);
CREATE INDEX IF NOT EXISTS idx_sponsor_clicks_code_day
  ON sponsor_clicks_daily(code, day);
