-- Spreaker-Folge <-> kanonische m365.fm-Adresse. url kommt aus spreaker-urls.json des Seitenbaus (Cron importEpisodeUrls),
-- url_on_spreaker/status/checked_at aus data/spreaker_urls_state.json (taeglicher GitHub-Workflow spreaker-urls.yml).
-- status: ok | differs | missing (Spreaker-Folge ohne Seite) | skipped (nicht veroeffentlicht) | error | unknown
CREATE TABLE IF NOT EXISTS episode_urls (
  spreaker_episode_id TEXT PRIMARY KEY,
  show_id INTEGER NOT NULL DEFAULT 0,
  lang TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  url_on_spreaker TEXT NOT NULL DEFAULT '',
  checked_at INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'unknown'
);
CREATE INDEX IF NOT EXISTS idx_episode_urls_status ON episode_urls(status);
CREATE INDEX IF NOT EXISTS idx_episode_urls_show ON episode_urls(show_id);
