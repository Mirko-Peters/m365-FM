-- Copilot-Bibliothek (library.js): Kennzeichen "von der Redaktion geprueft" (Nummer 0054: 0053 = yt_upload_session). Nur additiv.
--   reviewed  0 = normaler Eintrag (Standard, Altbestand), 1 = von der Redaktion geprueft (importLibrarySeed setzt es fuer die Start-Eintraege,
--             die ein unabhaengiger Pruefer durchgesehen hat). Nur ein solcher Eintrag steht ohne 10 Upvotes im Google-Index (site_library.is_indexable);
--             Mitglieder koennen das Kennzeichen nicht setzen (/api/library/save schreibt die Spalte nie).
ALTER TABLE lib_items ADD COLUMN reviewed INTEGER NOT NULL DEFAULT 0;
