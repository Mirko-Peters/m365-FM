CREATE TABLE IF NOT EXISTS push_topics (
  endpoint TEXT NOT NULL,
  kind TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  lang TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  user_id INTEGER,
  created INTEGER NOT NULL,
  PRIMARY KEY (endpoint, kind, topic_id)
);
CREATE INDEX IF NOT EXISTS idx_push_topics_topic ON push_topics(kind, topic_id);
CREATE TABLE IF NOT EXISTS email_topics (
  user_id INTEGER NOT NULL,
  kind TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  lang TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  created INTEGER NOT NULL,
  PRIMARY KEY (user_id, kind, topic_id)
);
CREATE INDEX IF NOT EXISTS idx_email_topics_topic ON email_topics(kind, topic_id);
ALTER TABLE push_subs ADD COLUMN digest INTEGER NOT NULL DEFAULT 1;
ALTER TABLE events ADD COLUMN tz TEXT NOT NULL DEFAULT 'Europe/Berlin';
CREATE INDEX IF NOT EXISTS idx_event_sessions_start ON event_sessions(status, start);
CREATE TABLE IF NOT EXISTS topic_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel TEXT NOT NULL,
  recipient TEXT NOT NULL,
  lang TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  kind TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  item_key TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL,
  created INTEGER NOT NULL,
  expires INTEGER NOT NULL,
  sent INTEGER NOT NULL DEFAULT 0,
  UNIQUE (channel, recipient, kind, topic_id, item_key)
);
CREATE INDEX IF NOT EXISTS idx_topic_queue_pending ON topic_queue(sent, created);
CREATE TABLE IF NOT EXISTS topic_deliveries (
  channel TEXT NOT NULL,
  recipient TEXT NOT NULL,
  local_day TEXT NOT NULL,
  kind TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  created INTEGER NOT NULL,
  PRIMARY KEY (channel, recipient, local_day, kind, topic_id)
);
CREATE TABLE IF NOT EXISTS topic_seen (
  source_key TEXT PRIMARY KEY,
  created INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS topic_recipient_state (
  channel TEXT NOT NULL,
  recipient TEXT NOT NULL,
  not_before INTEGER NOT NULL DEFAULT 0,
  updated INTEGER NOT NULL,
  PRIMARY KEY (channel, recipient)
);
