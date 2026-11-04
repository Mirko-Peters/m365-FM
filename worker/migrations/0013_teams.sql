CREATE TABLE IF NOT EXISTS teams_convs (
  conversation_id TEXT PRIMARY KEY,
  service_url TEXT NOT NULL,
  tenant_id TEXT NOT NULL DEFAULT '',
  conversation_type TEXT NOT NULL DEFAULT '',
  channel_id TEXT NOT NULL DEFAULT '',
  team_id TEXT NOT NULL DEFAULT '',
  recipient_id TEXT NOT NULL DEFAULT '',
  lang TEXT NOT NULL DEFAULT 'en',
  updated INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_teams_convs_updated ON teams_convs(updated);
CREATE TABLE IF NOT EXISTS teams_subscriptions (
  conversation_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  frequency TEXT NOT NULL DEFAULT 'immediate',
  lang TEXT NOT NULL DEFAULT 'en',
  timezone TEXT NOT NULL DEFAULT 'UTC',
  created INTEGER NOT NULL,
  PRIMARY KEY (conversation_id, kind, topic_id)
);
CREATE INDEX IF NOT EXISTS idx_teams_subscriptions_topic ON teams_subscriptions(kind, topic_id);
CREATE TABLE IF NOT EXISTS teams_deliveries (
  conversation_id TEXT NOT NULL,
  event_key TEXT NOT NULL,
  bucket TEXT NOT NULL,
  created INTEGER NOT NULL,
  PRIMARY KEY (conversation_id, event_key, bucket)
);
