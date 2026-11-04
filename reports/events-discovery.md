# Erkundung externer Event-Quellen (2026-11-04)

Dieser Lauf ruft nur robots.txt, Nutzungsbedingungen/Quellenhinweise und MCP-Metadaten ab. Er lädt keine Event- oder Speaker-Datensätze.

## Community Days

- **robots**: https://www.communitydays.org/robots.txt — unavailable
  - URLError: <urlopen error [Errno -5] No address associated with hostname>
- **policy**: https://www.communitydays.org/terms-of-use — unavailable
  - URLError: <urlopen error [Errno -5] No address associated with hostname>
- **privacy**: https://www.communitydays.org/privacy-policy — unavailable
  - URLError: <urlopen error [Errno -5] No address associated with hostname>
- **docs**: https://www.communitydays.org/guides/mcp-server — unavailable
  - URLError: <urlopen error [Errno -5] No address associated with hostname>

## Community Days MCP

- **robots**: https://mcp.communitydays.org/robots.txt — unavailable
  - URLError: <urlopen error [Errno -5] No address associated with hostname>
- **policy**: https://www.communitydays.org/terms-of-use — unavailable
  - URLError: <urlopen error [Errno -5] No address associated with hostname>
- **Community Days MCP-Tools**: nicht abrufbar — URLError: <urlopen error [Errno -5] No address associated with hostname>

## Vorläufige Richtlinienhinweise

- Dieser Scraper verwendet ausschließlich den Community-Days-MCP-Server; Sessions und Speaker werden über dessen veröffentlichte Eventdaten bezogen.

## Freigabestatus

Nicht erreichbare robots.txt- oder Richtlinienseiten sind keine Erlaubnis. Der Event-Abruf bleibt bis zur manuellen Prüfung und Freigabe mit `EVENTS_POLICY_APPROVED=1` deaktiviert.
