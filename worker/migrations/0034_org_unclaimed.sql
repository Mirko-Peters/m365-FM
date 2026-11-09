-- Firma und Entitaet sind immer ein Paar (Beschluss 6.11.2026). Wird eine Community-Firma aus einer Entitaet erzeugt und hat noch
-- keinen Inhaber, ist sie unbeansprucht: kein oeffentliches Profil, keine Seite im Seitenbau, nicht im Export, nicht beitretbar.
-- Die Entitaetsseite bleibt die einzige oeffentliche Seite; wer sie per #309-Verfahren (Firmen-E-Mail) oder Admin uebernimmt, wird Inhaber (unclaimed=0).
ALTER TABLE orgs ADD COLUMN unclaimed INTEGER NOT NULL DEFAULT 0;
