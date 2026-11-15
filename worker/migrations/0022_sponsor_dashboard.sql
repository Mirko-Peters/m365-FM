CREATE TABLE IF NOT EXISTS sponsor_placements (
  id TEXT PRIMARY KEY,
  org_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  channel TEXT NOT NULL CHECK(channel IN ('podcast_video','website','press','event','app')),
  langs TEXT NOT NULL DEFAULT '',
  start TEXT,
  end TEXT,
  refs TEXT NOT NULL DEFAULT '{}',
  created INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sponsor_placements_org
  ON sponsor_placements(org_id, start, end);

CREATE TABLE IF NOT EXISTS sponsor_metrics_daily (
  placement_id TEXT NOT NULL,
  day TEXT NOT NULL,
  metric TEXT NOT NULL,
  dim TEXT NOT NULL DEFAULT '',
  value REAL NOT NULL CHECK(value >= 0),
  source TEXT NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN ('measured','estimated','manual')),
  fetched_at INTEGER NOT NULL,
  PRIMARY KEY(placement_id, day, metric, dim, source)
);
CREATE INDEX IF NOT EXISTS idx_sponsor_metrics_day
  ON sponsor_metrics_daily(placement_id, day, metric);

CREATE TABLE IF NOT EXISTS sponsor_manual_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  placement_id TEXT NOT NULL,
  source TEXT NOT NULL CHECK(source IN ('bing_ai','press_portal')),
  metric TEXT NOT NULL CHECK(
    (source='bing_ai' AND metric='ai_citations') OR
    (source='press_portal' AND metric IN ('views','clicks'))
  ),
  period TEXT NOT NULL,
  value REAL NOT NULL CHECK(value >= 0),
  link TEXT NOT NULL DEFAULT '',
  proof_key TEXT NOT NULL,
  entered_by INTEGER NOT NULL,
  updated INTEGER NOT NULL,
  UNIQUE(placement_id, source, metric, period)
);
CREATE INDEX IF NOT EXISTS idx_sponsor_manual_placement_period
  ON sponsor_manual_metrics(placement_id, period);
