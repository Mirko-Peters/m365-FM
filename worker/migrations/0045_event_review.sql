-- Pruefliste fuer neue Events (Mirko, 10.11.): ein neues Event aus dem Scraper (Community Days, Sessionize-Import) oder von einem noch nicht bestaetigten Mitglied
-- ist erst sichtbar, wenn ein Admin es uebernimmt. Der Zustand steht in einer Spalte, "oeffentlich" bleibt events.public (alle bestehenden Abfragen mit public=1
-- blenden ein Event zur Pruefung deshalb ohne weitere Aenderung aus: Seite, Export, Sitemap, Suche, Erinnerungen, MCP-Listen).
--   approved  freigegeben - Altbestand und alles, was nie geprueft werden musste (Standardwert: durch diese Migration verschwindet nichts)
--   pending   zur Pruefung: public=0, im Admin unter Freigaben
--   rejected  abgelehnt: bleibt versteckt (public=0) und die Zeile bleibt stehen. Quelle, Adresse und Name kennt der Import-Abgleich (eventmerge.js findEvent) daran
--             weiter und legt das Event nicht noch einmal an; ein Admin kann es spaeter doch uebernehmen
--   draft     Entwurf eines nicht bestaetigten Mitglieds (public=0), noch nicht eingereicht: wird mit "oeffentlich" speichern zu pending
-- review_at = Zeitpunkt der Entscheidung eines Admins (0 = nie entschieden: Altbestand oder automatisch freigegeben). Wer entschieden hat, steht im Redaktionsprotokoll
-- (edit_log) - deshalb gibt es hier keine Spalte mit Nutzerbezug und nichts fuer Konto-Zusammenfuehrung oder -Loeschung.
ALTER TABLE events ADD COLUMN review TEXT NOT NULL DEFAULT 'approved';
ALTER TABLE events ADD COLUMN review_at INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_ev_review ON events(review) WHERE review<>'approved';
