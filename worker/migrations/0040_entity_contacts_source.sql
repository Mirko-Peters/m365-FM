-- Herkunft der Kontaktadresse: guest (Podcast-Gast) | speaker (M365Con-Speaker). Bestimmt die Fassung der Einladungsmail (entinvite.js).
-- Spalte mit Standardwert; die Laufzeit-Absicherung in entinvite.js (ensure) legt sie nur an, wenn sie noch fehlt.
ALTER TABLE entity_contacts ADD COLUMN source TEXT NOT NULL DEFAULT 'guest';
