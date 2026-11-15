CREATE TABLE IF NOT EXISTS ai_spend (
  id TEXT PRIMARY KEY,
  day TEXT NOT NULL,
  model TEXT NOT NULL,
  job TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT '',
  in_tok INTEGER NOT NULL DEFAULT 0,
  out_tok INTEGER NOT NULL DEFAULT 0,
  usd REAL NOT NULL DEFAULT 0,
  reserved_usd REAL NOT NULL DEFAULT 0,
  created INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ai_spend_day ON ai_spend(day, model);
CREATE INDEX IF NOT EXISTS idx_ai_spend_job ON ai_spend(job, day);
