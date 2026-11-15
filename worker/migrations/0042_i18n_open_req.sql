-- Sprachfassungen (#319): Absatz-Ansicht fuer einen Eintrag anfordern. Der Seitenbau veroeffentlicht Einheiten und Quell-Anker (docs/i18n-units) nur fuer
-- veraltete, schon bearbeitete und hier angeforderte Eintraege; ohne Anforderung gaebe es fuer eine korrekte, aber schlechte Maschinenfassung nie einen ersten
-- Handtext. Bewusst ohne Personenbezug (kein Nutzer): nur der Schluessel des oeffentlichen Eintrags und die Zeit; Anforderungen gelten 30 Tage.
CREATE TABLE IF NOT EXISTS i18n_open_req (
  kind TEXT NOT NULL,
  item TEXT NOT NULL,
  lang TEXT NOT NULL,
  ts INTEGER NOT NULL,
  PRIMARY KEY (kind, item, lang)
);
