CREATE TABLE IF NOT EXISTS pwa_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event TEXT NOT NULL,
  lang TEXT NOT NULL,
  source TEXT NOT NULL,
  created INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_pwa_events_event ON pwa_events(event, lang, source);
CREATE TABLE IF NOT EXISTS pwa_sub_sources (
  kind TEXT NOT NULL,
  identifier TEXT NOT NULL,
  lang TEXT NOT NULL,
  source TEXT NOT NULL,
  created INTEGER NOT NULL,
  PRIMARY KEY (kind, identifier)
);
CREATE INDEX IF NOT EXISTS idx_pwa_sub_sources_source ON pwa_sub_sources(kind, lang, source);
