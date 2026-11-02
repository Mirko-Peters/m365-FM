const EXCLUDED = new Set([
  "search_fts",
  "search_fts_data",
  "search_fts_idx",
  "search_fts_content",
  "search_fts_docsize",
  "search_fts_config",
]);

export function d1BackupTables(rows) {
  return rows.map((row) => row.name)
    .filter((name) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) && !name.startsWith("sqlite_") && !EXCLUDED.has(name));
}

export function d1BackupExportArgs(tables) {
  return ["d1", "export", "m365-dub", "--remote", "--output=backup-d1.sql", ...tables.map((table) => `--table=${table}`)];
}
