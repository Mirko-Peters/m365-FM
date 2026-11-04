# Erkundung externer Event-Quellen (2026-11-04)

Dieser Lauf ruft nur robots.txt, Nutzungsbedingungen/Quellenhinweise und MCP-Metadaten ab. Er lädt keine Event- oder Speaker-Datensätze.

## Community Days

- **robots**: https://www.communitydays.org/robots.txt — unavailable
  - URLError: <urlopen error [Errno -5] No address associated with hostname>
- **policy**: https://www.communitydays.org/terms-of-use — unavailable
  - URLError: <urlopen error [Errno -5] No address associated with hostname>
- **docs**: https://www.communitydays.org/guides/mcp-server — unavailable
  - URLError: <urlopen error [Errno -5] No address associated with hostname>
- **Community Days MCP-Tools**: nicht abrufbar — URLError: <urlopen error [Errno -5] No address associated with hostname>

## PnP

- **robots**: https://pnp.github.io/robots.txt — unavailable
  - URLError: <urlopen error [Errno -5] No address associated with hostname>
- **policy**: https://github.com/pnp/pnp.github.io — ok
  - Repository-Seite erreichbar; keine Nutzungsbedingungen extrahiert.
- **docs**: https://raw.githubusercontent.com/pnp/pnp.github.io/main/static/ical/INDEX.md — ok
  - # DO NOT DELETE The ics and json versions of the calendar will automatically build and update using workflow actions.

## developers.events

- **robots**: https://developers.events/robots.txt — unavailable
  - URLError: <urlopen error [Errno -5] No address associated with hostname>
- **policy**: https://raw.githubusercontent.com/scraly/developers-conferences-agenda/main/LICENSE-CONTENT — ok
  - Creative Commons Attribution-NonCommercial 4.0
- **docs**: https://developers.events/ — unavailable
  - URLError: <urlopen error [Errno -5] No address associated with hostname>

## Sessionize

- **robots**: https://sessionize.com/robots.txt — unavailable
  - URLError: <urlopen error [Errno -5] No address associated with hostname>
- **policy**: https://sessionize.com/terms-of-service — unavailable
  - URLError: <urlopen error [Errno -5] No address associated with hostname>
- **docs**: https://sessionize.com/playbook/api — unavailable
  - URLError: <urlopen error [Errno -5] No address associated with hostname>

## Global AI Community

- **robots**: https://globalai.community/robots.txt — unavailable
  - URLError: <urlopen error [Errno -5] No address associated with hostname>
- **policy**: https://globalai.community/terms — unavailable
  - URLError: <urlopen error [Errno -5] No address associated with hostname>
- **docs**: https://globalai.community/events/ — unavailable
  - URLError: <urlopen error [Errno -5] No address associated with hostname>

## Vorläufige Richtlinienhinweise

- Vorrecherche: Community Days beschreibt den MCP-Dienst als read-only für veröffentlichte Event-, Session- und Speaker-Fakten; die Tool-IDs und Schemas müssen im Action-Erkundungslauf bestätigt werden.
- Für PnP wurden öffentliche JSON/ICS-Kalenderdateien und `Allow: /` in der Repository-robots.txt dokumentiert; die JSON-Datei meldet `lastRetrieved=2024-04-24` und ist damit veraltet. Eine Datenlizenz ist nicht bestätigt.
- developers.events kennzeichnet Event-Inhalte mit CC BY-NC 4.0. Das ist keine MIT-Freigabe für die Daten; bis zur Zweckprüfung bleibt die Quelle aus.
- Sessionize dokumentiert nur vom Veranstalter veröffentlichte, eventbezogene Read-only-Endpunkte. Keine Endpoints werden geraten.
- Vorrecherche: Global AI Community warnt in den Nutzungsbedingungen vor dem Sammeln von Daten anderer Mitglieder; die Quelle bleibt aus, bis HQ einen Feed oder Export freigibt.

## Freigabestatus

Ungeprüfte oder nicht erreichbare robots-/Nutzungsbedingungen sind keine Erlaubnis. Erst nach manueller Prüfung `EVENTS_POLICY_APPROVED=1` und die jeweiligen `EVENTS_*`-Variablen setzen.
Global AI Community bleibt standardmäßig deaktiviert; vor Aktivierung ist die angefragte Freigabe/Feed-Auskunft von Global AI HQ abzuwarten.
