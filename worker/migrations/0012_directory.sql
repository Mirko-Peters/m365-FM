CREATE TABLE IF NOT EXISTS org_locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  org_id INTEGER NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  public INTEGER NOT NULL DEFAULT 0,
  lat REAL,
  lng REAL,
  geo_precision TEXT NOT NULL DEFAULT '',
  geo_address TEXT NOT NULL DEFAULT '',
  geo_at INTEGER NOT NULL DEFAULT 0,
  updated INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_org_locations_public ON org_locations(org_id,public);
