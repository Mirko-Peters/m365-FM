-- Mediadaten-Downloader (src/mediakit.js): Anfragen nach dem PDF, fuer die Nachverfolgung durch den Admin
CREATE TABLE IF NOT EXISTS mediakit_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, company TEXT NOT NULL, email TEXT NOT NULL, lang TEXT NOT NULL, source TEXT NOT NULL DEFAULT '', created INTEGER NOT NULL, sent INTEGER NOT NULL DEFAULT 0, err TEXT NOT NULL DEFAULT '');
