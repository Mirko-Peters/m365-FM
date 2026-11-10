-- Spreaker-Adressen: Titel der Folge und was abweicht (Feldnamen, z. B. "episode_link,description_html") fuer die klickbaren Listen im Admin-Reiter.
-- Beides schreibt spreaker_urls.py in data/spreaker_urls_state.json (t, f); importEpisodeUrls uebernimmt es. Spalten mit Standardwert.
ALTER TABLE episode_urls ADD COLUMN title TEXT NOT NULL DEFAULT '';
ALTER TABLE episode_urls ADD COLUMN fields TEXT NOT NULL DEFAULT '';
