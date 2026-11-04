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
  locked_fields TEXT NOT NULL DEFAULT '[]',
  changes TEXT NOT NULL DEFAULT '[]',
  gone_at INTEGER NOT NULL DEFAULT 0,
  prev_status TEXT NOT NULL DEFAULT '',
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
CREATE INDEX IF NOT EXISTS idx_event_import_event ON event_import(event_id, last_seen);
CREATE TABLE IF NOT EXISTS event_speaker_block (
  name_norm TEXT NOT NULL,
  event_fp TEXT NOT NULL DEFAULT '',
  created INTEGER NOT NULL,
  created_by INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (name_norm, event_fp)
);
