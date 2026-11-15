# Transkripte der Podcastfolgen (VoiceStudio-Kette)

Eine Datei je Spreaker-Episode: `<spreaker_episode_id>.vtt` (bevorzugt, mit Zeitmarken) oder `<spreaker_episode_id>.txt`.

- Sprache und Wortlaut wie im Skript, das VoiceStudio gesprochen hat.
- VTT: Kopfzeile `WEBVTT`, ein Cue je VoiceStudio-Stück; Start und Ende ergeben sich aus den Stücklängen plus den eingefügten Pausen (200 ms zwischen Sätzen, 600 ms bei Abschnittswechseln).
- Öffentlich über die eigene Domain: der Seitenbau legt die Datei neben die Folgenseite, `https://www.m365.fm/show/episodes/<slug>/transcript.vtt` und `transcript.txt` (die .txt entsteht aus der .vtt, wenn sie fehlt). Die Dateien liegen im R2-Bucket, der Site-Worker liefert sie mit `noindex` und CORS aus. Index: `https://www.m365.fm/show/transcripts.txt` (Spreaker-ID → Dateien: `/show/transcripts.json`).

Nach dem Push setzt der Workflow `podcast-transcripts.yml` (`tools/apply_podcast_transcripts.py`) die `transcript_url` der Episode bei Spreaker auf die m365.fm-Adresse, sobald sie live antwortet (HEAD 200). Bis dahin bekommt ein neuer Entwurf ohne Transkript die raw-URL (`https://raw.githubusercontent.com/Mirko-Peters/m365-dub-downloader/main/transcripts/podcast/<datei>`); ein späterer Lauf (alle 6 Stunden) stellt um. Protokoll: `APPLIED.txt`.
