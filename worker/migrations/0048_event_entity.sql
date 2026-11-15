-- Event <-> Event-Entitaet (Mirko, 10.11.): ein Event der Events-Liste (z. B. "Microsoft Ignite 2026") gehoert zu einer Entitaet vom Typ event (z. B. "microsoft-ignite").
-- Die Entitaet haelt die Beschreibung, die Events liefern die Termine, Sessions und Speaker: keine Doppelpflege. Zwei Spalten am Event, keine neue Tabelle
-- (und damit nichts fuer Kontoloeschung oder -Zusammenfuehrung: wer entschieden hat, steht im Redaktionsprotokoll edit_log).
--   entity        ID der Event-Entitaet ('' = keine)
--   entity_state  '' (noch nicht entschieden: die automatische Zuordnung darf einen Vorschlag eintragen)
--                 suggested  automatischer Vorschlag (Namensvergleich, evententity.js) - nicht oeffentlich
--                 proposed   vom Veranstalter im Event-Formular gewaehlt - nicht oeffentlich
--                 confirmed  vom Admin bestaetigt oder gesetzt - NUR dieser Zustand erscheint oeffentlich (Export, Seiten, Schema.org)
--                 rejected   Vorschlag vom Admin abgelehnt (entity bleibt als Merkzettel, wird nie wieder vorgeschlagen, nie oeffentlich)
--                 none       bewusst keine Zuordnung (Admin oder Veranstalter hat sie entfernt); die automatische Zuordnung laesst das Event in Ruhe
-- Ob das Event selbst oeffentlich ist, regelt weiter events.public (und die Pruefliste der neuen Events): ein nicht oeffentliches Event steht nie auf einer Entitaetsseite.
ALTER TABLE events ADD COLUMN entity TEXT NOT NULL DEFAULT '';
ALTER TABLE events ADD COLUMN entity_state TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS idx_ev_entity ON events(entity) WHERE entity<>'';
