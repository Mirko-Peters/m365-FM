"""Erkundet robots.txt, Nutzungsbedingungen und Community-Days-MCP-Metadaten."""
import html
import json
import re
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

import scrape_events as scraper

ROOT = Path(__file__).resolve().parents[1]
SOURCES = {
    "Community Days": {
        "robots": "https://www.communitydays.org/robots.txt",
        "policy": "https://www.communitydays.org/terms-of-use",
        "docs": "https://www.communitydays.org/guides/mcp-server",
    },
    "PnP": {
        "robots": "https://pnp.github.io/robots.txt",
        "policy": "https://github.com/pnp/pnp.github.io",
        "docs": "https://raw.githubusercontent.com/pnp/pnp.github.io/main/static/ical/INDEX.md",
    },
    "developers.events": {
        "robots": "https://developers.events/robots.txt",
        "policy": "https://raw.githubusercontent.com/scraly/developers-conferences-agenda/main/LICENSE-CONTENT",
        "docs": "https://developers.events/",
    },
    "Sessionize": {
        "robots": "https://sessionize.com/robots.txt",
        "policy": "https://sessionize.com/terms-of-service",
        "docs": "https://sessionize.com/playbook/api",
    },
    "Global AI Community": {
        "robots": "https://globalai.community/robots.txt",
        "policy": "https://globalai.community/terms",
        "docs": "https://globalai.community/events/",
    },
}


class PageText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts, self.skip = [], 0
    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "svg"):
            self.skip += 1
    def handle_endtag(self, tag):
        if tag in ("script", "style", "svg") and self.skip:
            self.skip -= 1
    def handle_data(self, data):
        if not self.skip:
            self.parts.append(data)


def read_url(url):
    try:
        body = scraper.get(url, "text/plain,text/html,application/json")
        raw = body.decode("utf-8", "replace")
        page = PageText()
        page.feed(raw)
        text = " ".join(page.parts) if "<html" in raw.lower() else html.unescape(raw)
        text = re.sub(r"\s+", " ", text).strip()
        if "LICENSE-CONTENT" in url:
            match = re.search(r"Creative Commons Attribution-NonCommercial 4\.0", text, re.I)
            text = match.group(0) if match else "Lizenzhinweis abgerufen; Details nicht übernommen."
        elif "github.com/" in url and "<html" in raw.lower():
            text = "Repository-Seite erreichbar; keine Nutzungsbedingungen extrahiert."
        return {"status": "ok", "text": text[:300]}
    except Exception as exc:
        return {"status": "unavailable", "text": f"{type(exc).__name__}: {exc}"}


def discover():
    results = {name: {key: {"url": url, **read_url(url)} for key, url in values.items()}
               for name, values in SOURCES.items()}
    try:
        tools, _ = scraper.community_tools()
        results["Community Days"]["mcp_tools"] = [
            {"name": tool.get("name", ""), "description": tool.get("description", ""),
             "inputSchema": tool.get("inputSchema", {})} for tool in tools
        ]
    except Exception as exc:
        results["Community Days"]["mcp_tools"] = {"status": "unavailable", "error": f"{type(exc).__name__}: {exc}"}
    return {"checked": datetime.now(timezone.utc).isoformat(timespec="seconds"), "sources": results}


def markdown(report):
    rows = [f"# Erkundung externer Event-Quellen ({report['checked'][:10]})", "",
            "Dieser Lauf ruft nur robots.txt, Nutzungsbedingungen/Quellenhinweise und MCP-Metadaten ab. Er lädt keine Event- oder Speaker-Datensätze.", ""]
    for name, values in report["sources"].items():
        rows.extend([f"## {name}", ""])
        for key in ("robots", "policy", "docs"):
            result = values[key]
            excerpt = re.sub(r"\s+", " ", result["text"]).strip()[:300]
            rows.extend([f"- **{key}**: {result['url']} — {result['status']}", f"  - {excerpt or '(kein Inhalt verfügbar)'}"])
        tools = values.get("mcp_tools")
        if isinstance(tools, list):
            rows.extend(["- **Community Days MCP-Tools**: " + (", ".join(x["name"] for x in tools) or "(keine)"),
                         "  - Namen und Eingabeschemata stammen aus `tools/list`; die Event-Tools wurden nicht aufgerufen."])
        elif tools:
            rows.append(f"- **Community Days MCP-Tools**: nicht abrufbar — {tools.get('error', '')}")
        rows.append("")
    rows.extend(["## Vorläufige Richtlinienhinweise", "",
                 "- Vorrecherche: Community Days beschreibt den MCP-Dienst als read-only für veröffentlichte Event-, Session- und Speaker-Fakten; die Tool-IDs und Schemas müssen im Action-Erkundungslauf bestätigt werden.",
                 "- Für PnP wurden öffentliche JSON/ICS-Kalenderdateien und `Allow: /` in der Repository-robots.txt dokumentiert; die JSON-Datei meldet `lastRetrieved=2024-04-24` und ist damit veraltet. Eine Datenlizenz ist nicht bestätigt.",
                 "- developers.events kennzeichnet Event-Inhalte mit CC BY-NC 4.0. Das ist keine MIT-Freigabe für die Daten; bis zur Zweckprüfung bleibt die Quelle aus.",
                 "- Sessionize dokumentiert nur vom Veranstalter veröffentlichte, eventbezogene Read-only-Endpunkte. Keine Endpoints werden geraten.",
                 "- Vorrecherche: Global AI Community warnt in den Nutzungsbedingungen vor dem Sammeln von Daten anderer Mitglieder; die Quelle bleibt aus, bis HQ einen Feed oder Export freigibt.", ""])
    rows.extend(["## Freigabestatus", "",
                 "Ungeprüfte oder nicht erreichbare robots-/Nutzungsbedingungen sind keine Erlaubnis. Erst nach manueller Prüfung `EVENTS_POLICY_APPROVED=1` und die jeweiligen `EVENTS_*`-Variablen setzen.",
                 "Global AI Community bleibt standardmäßig deaktiviert; vor Aktivierung ist die angefragte Freigabe/Feed-Auskunft von Global AI HQ abzuwarten.", ""])
    return "\n".join(rows)


def main():
    report = discover()
    (ROOT / "reports" / "events-discovery.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", "utf-8")
    (ROOT / "reports" / "events-discovery.md").write_text(markdown(report), "utf-8")
    print(markdown(report))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
