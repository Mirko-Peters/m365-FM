CREATE TABLE IF NOT EXISTS expert_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  topics TEXT NOT NULL,
  format TEXT NOT NULL,
  lang TEXT NOT NULL,
  deadline TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_expert_request_status ON expert_requests(status, deadline, created);
CREATE INDEX IF NOT EXISTS idx_expert_request_user ON expert_requests(user_id, created);
CREATE TABLE IF NOT EXISTS expert_request_replies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  created INTEGER NOT NULL,
  UNIQUE (request_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_expert_request_reply_request ON expert_request_replies(request_id, created);
CREATE INDEX IF NOT EXISTS idx_expert_request_reply_user ON expert_request_replies(user_id, created);
CREATE TABLE IF NOT EXISTS expert_request_reports (
  request_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  reply_id INTEGER NOT NULL DEFAULT 0,
  reason TEXT NOT NULL DEFAULT '',
  created INTEGER NOT NULL,
  PRIMARY KEY (request_id, user_id, reply_id)
);
CREATE INDEX IF NOT EXISTS idx_expert_request_report_request ON expert_request_reports(request_id, created);
