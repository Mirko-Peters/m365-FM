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
