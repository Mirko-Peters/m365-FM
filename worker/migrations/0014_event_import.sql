ALTER TABLE events ADD COLUMN source TEXT NOT NULL DEFAULT '';
ALTER TABLE events ADD COLUMN organizer_name TEXT NOT NULL DEFAULT '';
ALTER TABLE events ADD COLUMN cfs_close TEXT NOT NULL DEFAULT '';
CREATE TABLE IF NOT EXISTS event_import (
  fp TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','approved','rejected','merged','gone')),
  event_id INTEGER,
  reviewed_by INTEGER,
  first_seen INTEGER NOT NULL,
  last_seen INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_event_import_status ON event_import(status, last_seen);
CREATE TABLE IF NOT EXISTS event_source (
  source TEXT NOT NULL,
  ext_id TEXT NOT NULL,
  fp TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (source, ext_id)
);
CREATE INDEX IF NOT EXISTS idx_event_source_fp ON event_source(fp);
