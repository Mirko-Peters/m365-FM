// Messung je Cron-Aufgabe (D1-Kosten, Punkt 10): eine duenne Huelle um die D1-Bindung zaehlt meta.rows_read und meta.rows_written der
// Antworten von all(), run() und batch(); track() (index.js) schreibt die Summe als rr/rw in cron_runs.info. first() liefert in D1 keine
// meta-Angaben und zaehlt deshalb nicht mit (meist Punktabfragen). Die verbrauchsgenaue Zahl je Tag zeigt der Workflow cf-usage.yml.
// Nur im Cron, nie in Anfragen. Statements gehen unverpackt an batch(); WeakMap-Merker je Datenbank nutzen rawDb().
export const RAW = Symbol.for("m365.d1.raw");
export const rawDb = (db) => (db && db[RAW]) || db;

export function meterDb(db, m) {
  if (!db || typeof db.prepare !== "function") return db;
  const add = (res) => {
    const x = res && res.meta;
    if (x) { m.rr += Number(x.rows_read) || 0; m.rw += Number(x.rows_written) || 0; }
    return res;
  };
  const wrap = (st) => {
    if (!st || typeof st !== "object") return st;
    return {
      [RAW]: st,
      bind: (...a) => wrap(st.bind(...a)),
      first: (...a) => st.first(...a),
      all: async (...a) => add(await st.all(...a)),
      run: async (...a) => add(await st.run(...a)),
      raw: (...a) => st.raw(...a),
    };
  };
  return {
    [RAW]: db,
    prepare: (sql) => wrap(db.prepare(sql)),
    batch: async (stmts) => {
      const res = await db.batch((stmts || []).map((s) => (s && s[RAW]) || s));
      if (Array.isArray(res)) res.forEach(add);
      return res;
    },
    exec: (...a) => db.exec(...a),
    dump: (...a) => db.dump(...a),
    withSession: (...a) => db.withSession(...a),
  };
}
