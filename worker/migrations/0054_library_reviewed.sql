-- Copilot-Bibliothek (library.js): Kennzeichen "von der Redaktion geprueft" (Nummer 0054: 0053 = yt_upload_session). Nur additiv.
--   reviewed  0 = normaler Eintrag (Standard, Altbestand), 1 = von der Redaktion geprueft (importLibrarySeed setzt es fuer die Start-Eintraege,
--             die ein unabhaengiger Pruefer durchgesehen hat). Nur ein solcher Eintrag steht ohne 10 Upvotes im Google-Index (site_library.is_indexable);
--             Mitglieder koennen das Kennzeichen nicht setzen; /api/library/save nimmt es bei jeder Bearbeitung zurueck.
--   origin    '' = von einem Mitglied angelegt (Standard, Altbestand), 'seed' = vom Import angelegt. Der Import fasst nur Zeilen mit origin 'seed' an;
--             eine Bearbeitung ueber /api/library/save macht den Eintrag wieder zum eigenen (origin '').
ALTER TABLE lib_items ADD COLUMN reviewed INTEGER NOT NULL DEFAULT 0;
ALTER TABLE lib_items ADD COLUMN origin TEXT NOT NULL DEFAULT '';
