CREATE TABLE IF NOT EXISTS workers_ai_daily (
  day TEXT PRIMARY KEY,
  neurons INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS ai_review_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,
  item_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  created INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  UNIQUE(kind,item_id)
);
CREATE INDEX IF NOT EXISTS idx_ai_review_queue_status ON ai_review_queue(status,created);
