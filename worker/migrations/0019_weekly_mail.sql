CREATE TABLE IF NOT EXISTS mail_weekly_delivery (
  address_hash TEXT PRIMARY KEY,
  week_start TEXT NOT NULL,
  status INTEGER NOT NULL DEFAULT 0,
  reserved_at INTEGER NOT NULL,
  sent_at INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS mail_monthly_usage (
  month TEXT PRIMARY KEY,
  sent INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS mail_weekly_unsub (
  email TEXT PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  updated INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS mail_topic_follows (
  user_id INTEGER NOT NULL,
  eid TEXT NOT NULL,
  created INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, eid)
);
