# Transkripte der Podcastfolgen (VoiceStudio-Kette)

Eine Datei je Spreaker-Episode: `<spreaker_episode_id>.vtt` (bevorzugt, mit Zeitmarken) oder `<spreaker_episode_id>.txt`.

- Sprache und Wortlaut wie im Skript, das VoiceStudio gesprochen hat.
- VTT: Kopfzeile `WEBVTT`, ein Cue je VoiceStudio-Stück; Start und Ende ergeben sich aus den Stücklängen plus den eingefügten Pausen (200 ms zwischen Sätzen, 600 ms bei Abschnittswechseln).
- Öffentlich über `https://raw.githubusercontent.com/Mirko-Peters/m365-dub-downloader/main/transcripts/podcast/<datei>`.

Nach dem Push setzt der Workflow `podcast-transcripts.yml` (`tools/apply_podcast_transcripts.py`) die `transcript_url` der Episode bei Spreaker, auch bei Entwürfen. Protokoll: `APPLIED.txt`.
