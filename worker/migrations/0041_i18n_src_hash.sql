-- Vertrag i18n-overrides v1 (i18n_overrides.py, Punkt 2): jeder Handtext traegt den Quell-Anker ("sh", 8 Hex-Zeichen) des englischen Quelltexts,
-- den die Redaktion beim Speichern vor sich hatte. Der Worker rechnet ihn nicht selbst: die Oberflaeche schickt ihn mit, der Export gibt ihn aus.
-- Auch im Verlauf, damit ein Zuruecksetzen auf eine aeltere Handfassung deren Anker wiederherstellt.
ALTER TABLE i18n_override ADD COLUMN src_hash TEXT NOT NULL DEFAULT '';
ALTER TABLE i18n_override_rev ADD COLUMN src_hash TEXT NOT NULL DEFAULT '';
