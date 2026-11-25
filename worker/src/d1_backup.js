const EXCLUDED = new Set([
  "search_fts",
  "search_fts_data",
  "search_fts_idx",
  "search_fts_content",
  "search_fts_docsize",
  "search_fts_config",
]);

// FTS5-Tabellen (virtuell) und ihre Schattentabellen kann wrangler d1 export nicht sichern: jede Tabelle mit Namen *_fts bzw. *_fts_<schatten>
// faellt heraus, auch kuenftige (sonst blockiert die erste neue FTS-Tabelle die Sicherung und damit jeden Worker-Deploy).
const FTS = /_fts(_(data|idx|content|docsize|config))?$/;

export function d1BackupTables(rows) {
  return rows.map((row) => row.name)
    .filter((name) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) && !name.startsWith("sqlite_") && !EXCLUDED.has(name) && !FTS.test(name));
}

export function d1BackupExportArgs(tables) {
  return ["d1", "export", "m365-dub", "--remote", "--output=backup-d1.sql", ...tables.map((table) => `--table=${table}`)];
}

// D1-Kosten (Punkt 6): die volle Sicherung liest jede Zeile der Datenbank. setup.mjs sichert deshalb nur noch, wenn Migrationen ausstehen
// (Sicherung vor einer Schemaaenderung bleibt). Ausgabe von `wrangler d1 migrations list --remote`:
//   "pending" = "Migrations to be applied" oder ein Dateiname NNNN_*.sql in der Ausgabe; "none" = "No migrations to apply"; sonst/Fehler "unknown" -> wie bisher sichern.
// Ableitbare Tabellen bleiben in der Sicherung: eine Wiederherstellung ohne sie haette auch kein Schema dieser Tabellen, und d1_migrations
// meldete die Migrationen trotzdem als angewendet.
export function d1PendingMigrations(status, stdout = "", stderr = "") {
  if (status !== 0) return "unknown";
  const out = `${stdout || ""}\n${stderr || ""}`;
  if (/Migrations to be applied|\b\d{4}_[A-Za-z0-9_.-]*\.sql\b/.test(out)) return "pending";
  if (/No migrations to apply/i.test(out)) return "none";
  return "unknown";
}
