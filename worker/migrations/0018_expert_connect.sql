ALTER TABLE expert_requests ADD COLUMN hide_outlet INTEGER NOT NULL DEFAULT 0;
ALTER TABLE expert_requests ADD COLUMN reach TEXT NOT NULL DEFAULT '';
ALTER TABLE expert_requests ADD COLUMN audience TEXT NOT NULL DEFAULT 'all';
ALTER TABLE expert_requests ADD COLUMN mode TEXT NOT NULL DEFAULT 'match';
ALTER TABLE expert_requests ADD COLUMN held_reason TEXT NOT NULL DEFAULT '';
ALTER TABLE expert_request_replies ADD COLUMN kind TEXT NOT NULL DEFAULT 'match';
ALTER TABLE expert_request_replies ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE contributions ADD COLUMN expert_request_id INTEGER;
CREATE UNIQUE INDEX IF NOT EXISTS idx_contribution_expert_request ON contributions(expert_request_id) WHERE expert_request_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS expert_settings (
  user_id INTEGER PRIMARY KEY,
  opt_in INTEGER NOT NULL DEFAULT 0,
  formats TEXT NOT NULL DEFAULT '[]',
  langs TEXT NOT NULL DEFAULT '[]',
  notify TEXT NOT NULL DEFAULT 'push',
  contact_pref TEXT NOT NULL DEFAULT 'platform',
  contact_value TEXT NOT NULL DEFAULT '',
  paused_until INTEGER NOT NULL DEFAULT 0,
  updated INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_expert_settings_opt_in ON expert_settings(opt_in, paused_until);
CREATE TABLE IF NOT EXISTS expert_vectors (
  user_id INTEGER PRIMARY KEY,
  vid TEXT NOT NULL UNIQUE,
  h TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS expert_request_vectors (
  request_id INTEGER PRIMARY KEY,
  vid TEXT NOT NULL UNIQUE,
  h TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS moderation_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_id INTEGER NOT NULL DEFAULT 0,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id INTEGER NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  created INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_moderation_log_target ON moderation_log(target_type, target_id, created);
