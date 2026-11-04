CREATE TABLE IF NOT EXISTS sponsor_manual_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  org_id INTEGER NOT NULL,
  placement TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('bing_ai', 'linkedin_newsletter')),
  metric TEXT NOT NULL CHECK (metric IN ('ai_citations', 'impressions', 'clicks')),
  period TEXT NOT NULL,
  value REAL NOT NULL CHECK (value >= 0),
  link TEXT NOT NULL DEFAULT '',
  proof_key TEXT NOT NULL,
  entered_by INTEGER NOT NULL,
  updated INTEGER NOT NULL,
  UNIQUE (org_id, placement, source, metric, period)
);
CREATE INDEX IF NOT EXISTS idx_sponsor_manual_org_period
  ON sponsor_manual_metrics(org_id, period);
