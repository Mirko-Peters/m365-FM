-- Creator-Videos (youtube.js), Sicherheitsbefunde K35/K36 (Nummer 0053: 0052 = hardware_requests). Nur additiv.
-- Neuer Status 'abandoned': abgebrochener Upload, den der Cron bei YouTube nicht bereinigen konnte (Zeile bleibt als Hinweis, nicht in /api/video/mine).
-- Die resumable Upload-Sitzung, die der Worker mit dem Kanal-Token anlegt, bleibt serverseitig nachvollziehbar:
--   upload_url  Sitzungs-URL von YouTube (Location aus init). Nur fuer den Worker (Status abfragen, abbrechen), nie in einer Antwort.
--               Wird nach confirm geleert. Altbestand vor 0053: '' (kein Verweis).
--   size        angemeldete Dateigroesse (fuer die Statusabfrage "Content-Range: bytes */<size>")
--   nonce       Zufallswert der Sitzung; steht als Tag "m365fm-<nonce>" am Video. confirm bindet und videos.delete loescht nur ein Video
--               mit dem Tag der eigenen Zeile. Altbestand: '' (Pruefung ueber Credit-Zeile und Upload-Zeitpunkt, sonst nur gemeldet).
ALTER TABLE yt_videos ADD COLUMN upload_url TEXT NOT NULL DEFAULT '';
ALTER TABLE yt_videos ADD COLUMN size INTEGER NOT NULL DEFAULT 0;
ALTER TABLE yt_videos ADD COLUMN nonce TEXT NOT NULL DEFAULT '';
