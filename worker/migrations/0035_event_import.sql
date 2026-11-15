-- Event-Import (Community Days, Sessionize) und Zusammenfuehrung von Dubletten (Events, Sessions, Speaker).
-- Nie hart loeschen: zusammengefuehrte Zeilen behalten merged_into und lassen sich ueber merge_log zuruecknehmen.
-- Woran man Zeilen in events erkennt (auch fuer andere Module, z. B. LinkedIn-Events):
--   importiert      source<>''  (communitydays | sessionize); unclaimed=1 solange kein Veranstalter uebernommen hat (owner_id=0)
--   vergangen       retired=1   (nur Import; bleibt public=1)
--   zusammengefuehrt merged_into<>0 (ID des verbleibenden Events) und public=0; ueber die Adress-Routen nicht erreichbar. Zeilen, die der Import gleich
--                   beim Anlegen zusammengefuehrt hat, tragen eine technische Adresse (handle beginnt mit '~') und belegen keine echte
--   von Hand gepflegt edited_at>0 oder owner_id<>0 oder org_id gesetzt: Importe aendern die Inhalte dann nicht mehr
--   geloescht       keine Zeile mehr; fuer Import-Events bleibt eine Loeschmarke in event_tombstone
-- Unbekanntes bei Import-Events: free=-1 (Preis unbekannt, wird nicht als kostenlos ausgegeben), tz='' (Zeitzone unbekannt, keine Session-Erinnerungen)

ALTER TABLE events ADD COLUMN source TEXT NOT NULL DEFAULT '';          -- '' (Mitglied) | communitydays | sessionize
ALTER TABLE events ADD COLUMN source_url TEXT NOT NULL DEFAULT '';
ALTER TABLE events ADD COLUMN url_key TEXT NOT NULL DEFAULT '';         -- normalisierte eigene Webseite des Events (nie Listen-, Feed- oder Profil-URL)
ALTER TABLE events ADD COLUMN name_key TEXT NOT NULL DEFAULT '';        -- normalisierter Name ohne Jahr/Edition/Rechtsform
ALTER TABLE events ADD COLUMN city_key TEXT NOT NULL DEFAULT '';
ALTER TABLE events ADD COLUMN unclaimed INTEGER NOT NULL DEFAULT 0;     -- 1 = importiert, owner_id=0, kann beansprucht werden
ALTER TABLE events ADD COLUMN organizer_name TEXT NOT NULL DEFAULT '';   -- Veranstaltername aus dem Import (solange kein Konto Veranstalter ist)
ALTER TABLE events ADD COLUMN retired INTEGER NOT NULL DEFAULT 0;       -- 1 = vorbei (Import), nicht geloescht
ALTER TABLE events ADD COLUMN merged_into INTEGER NOT NULL DEFAULT 0;
ALTER TABLE events ADD COLUMN sessionize_api TEXT NOT NULL DEFAULT '';  -- GEHEIM: Sessionize-API-ID, nie in Antworten an Dritte
ALTER TABLE events ADD COLUMN sessionize_synced INTEGER NOT NULL DEFAULT 0;
ALTER TABLE events ADD COLUMN sessionize_state TEXT NOT NULL DEFAULT '';   -- '' | ok | partial (Rest folgt im naechsten Lauf) | Fehlercode
ALTER TABLE events ADD COLUMN keys_v INTEGER NOT NULL DEFAULT 0;        -- Version der Schluessel (name_key/url_key/city_key); 0 = noch nicht berechnet (Rueckfuellung im Import-Lauf)
ALTER TABLE events ADD COLUMN edited_at INTEGER NOT NULL DEFAULT 0;     -- letzte Bearbeitung von Hand (Formular/MCP); >0 = Importe ueberschreiben nichts
CREATE INDEX IF NOT EXISTS idx_ev_namekey ON events(name_key);
CREATE INDEX IF NOT EXISTS idx_ev_urlkey ON events(url_key);

ALTER TABLE event_sessions ADD COLUMN title_key TEXT NOT NULL DEFAULT '';
ALTER TABLE event_sessions ADD COLUMN sessionize_id TEXT NOT NULL DEFAULT '';
ALTER TABLE event_sessions ADD COLUMN merged_into INTEGER NOT NULL DEFAULT 0;
ALTER TABLE event_sessions ADD COLUMN edited_fields TEXT NOT NULL DEFAULT '';   -- von Hand geaenderte Felder (kommagetrennt); der Sessionize-Abgleich laesst sie stehen
CREATE INDEX IF NOT EXISTS idx_es_titlekey ON event_sessions(event_id, title_key);

-- Quellen eines Events / einer Session (mehrere moeglich). ref ist bei Sessionize-Endpunkten ein Hash, nie die API-ID selbst.
CREATE TABLE IF NOT EXISTS event_source (
  event_id INTEGER NOT NULL,
  kind TEXT NOT NULL,            -- communitydays | sessionize_api | sessionize_event (Quellen des Events selbst, nie ein Speaker-Profil) | key (Ersatz-Kennung) | sessionize_mention (nur Hinweis fuer die Warteschlange)
  ref TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  url_key TEXT NOT NULL DEFAULT '',
  name_key TEXT NOT NULL DEFAULT '',   -- der Datensatz, wie ihn die Quelle zuletzt lieferte: Name (normalisiert) ...
  day TEXT NOT NULL DEFAULT '',        -- ... und Tag. Daran wird derselbe Datensatz wiedererkannt, auch wenn das Event hier umbenannt, verschoben oder zusammengefuehrt wurde.
  hash TEXT NOT NULL DEFAULT '',       -- Inhalts-Hash des zuletzt gelesenen Stands: nur eine Aenderung in der Quelle wird in ein ungepflegtes Import-Event uebernommen
  first_seen INTEGER NOT NULL,
  last_seen INTEGER NOT NULL,
  PRIMARY KEY (event_id, kind, ref)
);
CREATE INDEX IF NOT EXISTS idx_evs_ref ON event_source(kind, ref);
CREATE INDEX IF NOT EXISTS idx_evs_url ON event_source(url_key);
CREATE TABLE IF NOT EXISTS session_source (
  session_id INTEGER NOT NULL,
  kind TEXT NOT NULL,
  ref TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  hash TEXT NOT NULL DEFAULT '',   -- Inhalts-Hash des zuletzt eingespielten Stands (unveraenderte Sessions werden uebersprungen)
  first_seen INTEGER NOT NULL,
  last_seen INTEGER NOT NULL,
  PRIMARY KEY (session_id, kind, ref)
);
CREATE INDEX IF NOT EXISTS idx_ses_ref ON session_source(kind, ref);

-- Speaker-Identitaet ueber Quellen hinweg; Sessions verweisen mit "r" im speakers-JSON darauf.
-- Datensparsam: nur was angezeigt oder fuer den idempotenten Abgleich gebraucht wird (Name, Sessionize-Kennung, verknuepftes Profil).
-- Keine Kurzvorstellung, kein Slogan, keine Link-Listen, keine Fotos.
CREATE TABLE IF NOT EXISTS speaker_ref (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  name_key TEXT NOT NULL DEFAULT '',
  sessionize_id TEXT NOT NULL DEFAULT '',
  handle TEXT NOT NULL DEFAULT '',         -- verknuepftes Mitgliedsprofil (nur nach starkem Nachweis, nie allein ueber den Namen)
  merged_into INTEGER NOT NULL DEFAULT 0,
  created INTEGER NOT NULL,
  updated INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sref_name ON speaker_ref(name_key);
CREATE INDEX IF NOT EXISTS idx_sref_sz ON speaker_ref(sessionize_id);

-- Admin-Warteschlange "Moegliche Dubletten": unsichere Treffer werden nie automatisch zusammengefuehrt
CREATE TABLE IF NOT EXISTS dedupe_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,                      -- event | session | speaker
  a_id INTEGER NOT NULL,
  b_id INTEGER NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',     -- open | merged | separate (dauerhaft: wird nie wieder automatisch zusammengefuehrt)
  created INTEGER NOT NULL,
  decided INTEGER NOT NULL DEFAULT 0,
  decided_by INTEGER NOT NULL DEFAULT 0,
  UNIQUE (kind, a_id, b_id)
);
-- Protokoll jeder Zusammenfuehrung inkl. Vorher-Stand, damit sie rueckgaengig gemacht werden kann
CREATE TABLE IF NOT EXISTS merge_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,
  from_id INTEGER NOT NULL,
  into_id INTEGER NOT NULL,
  snapshot TEXT NOT NULL DEFAULT '{}',
  auto INTEGER NOT NULL DEFAULT 0,
  by_user INTEGER NOT NULL DEFAULT 0,
  created INTEGER NOT NULL,
  undone INTEGER NOT NULL DEFAULT 0
);
-- Vorschau des Sessionize-Profil-Imports: bestaetigt wird nur, was der Server selbst gelesen hat
CREATE TABLE IF NOT EXISTS import_preview (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  data TEXT NOT NULL,
  created INTEGER NOT NULL
);
-- Antwort-Cache und Hoeflichkeitsabstand fuer Abrufe externer Quellen
CREATE TABLE IF NOT EXISTS import_cache (
  url TEXT PRIMARY KEY,
  body TEXT NOT NULL DEFAULT '',
  status INTEGER NOT NULL DEFAULT 0,
  fetched INTEGER NOT NULL
);
-- Beanspruchen eines importierten (herrenlosen) Events
CREATE TABLE IF NOT EXISTS event_claims (
  event_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending | approved | rejected
  created INTEGER NOT NULL,
  PRIMARY KEY (event_id, user_id)
);
-- Loeschmarken: ein geloeschtes Import-Event kommt mit dem naechsten Lauf nicht zurueck.
-- kind = Quellenart (communitydays | sessionize_event | sessionize_api), 'url' (ref = url_key) oder 'name' (ref = name_key|city_key).
-- day = Tag des geloeschten Events: dieselbe Adresse in einem anderen Jahr ist eine neue Ausgabe und wird wieder importiert.
-- Vom Veranstalter geloeschte Sessions: kind = 'session', ref = Hash aus Quellenart und Kennung der Session (die Kennung kann einen Namen enthalten), day = ''.
-- Bewusst ohne Nutzerbezug (kein "geloescht von"): die Tabelle muss bei Konto-Zusammenfuehrung und -Loeschung nicht angefasst werden.
CREATE TABLE IF NOT EXISTS event_tombstone (
  kind TEXT NOT NULL,
  ref TEXT NOT NULL,
  day TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  created INTEGER NOT NULL,
  PRIMARY KEY (kind, ref, day)
);
