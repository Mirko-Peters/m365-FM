import { rateLimit, sha256hex } from "./util.js";

const TYPES = new Set(["episode", "dub_episode", "entity", "person", "glossary", "blog", "event", "show", "page"]);
const now = () => Math.floor(Date.now() / 1000);
const ftsReady = new WeakMap();
const hash = (value) => {
  let h = 5381;
  for (const c of String(value)) h = ((h << 5) + h + c.charCodeAt(0)) | 0;
  return (h >>> 0).toString(16);
};
const meta = (db, key) => db.prepare("SELECT v FROM meta WHERE k=?").bind(key).first();
const setMeta = (db, key, value) => db.prepare(
  "INSERT INTO meta(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v WHERE meta.v<>excluded.v",
).bind(key, String(value)).run();

async function initializeSearchFts(db) {
  const schema = await db.prepare("SELECT sql FROM sqlite_schema WHERE type='table' AND name='search_fts'").first();
  const saved = await meta(db, "search_fts_tokenizer");
  if (schema?.sql) {
    const tokenizer = /tokenize\s*=\s*['"]?(trigram|unicode61)/i.exec(schema.sql)?.[1]?.toLowerCase() || "unicode61";
    await setMeta(db, "search_fts_tokenizer", tokenizer);
    return tokenizer;
  }
  const preferred = saved?.v === "unicode61" ? "unicode61" : "trigram";
  try {
    await db.prepare(`CREATE VIRTUAL TABLE IF NOT EXISTS search_fts USING fts5(title,keywords,summary,tokenize='${preferred}')`).run();
    await setMeta(db, "search_fts_tokenizer", preferred);
    return preferred;
  } catch (error) {
    if (preferred !== "trigram" || !/no such tokenizer:\s*trigram|unknown tokenizer.*trigram|tokenizer.*trigram.*(?:unknown|not found)/i.test(String(error?.message || error))) throw error;
    await db.prepare("CREATE VIRTUAL TABLE IF NOT EXISTS search_fts USING fts5(title,keywords,summary,tokenize='unicode61')").run();
    await setMeta(db, "search_fts_tokenizer", "unicode61");
    return "unicode61";
  }
}

async function ensureSearchFts(db) {
  let ready = ftsReady.get(db);
  if (!ready) {
    ready = initializeSearchFts(db);
    ftsReady.set(db, ready);
  }
  try { return await ready; }
  catch (error) { ftsReady.delete(db); throw error; }
}

async function getJson(env, path) {
  try {
    const response = await fetch(env.SITE + path, { cf: { cacheTtl: 600 } });
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}

function normalizeDoc(doc, siteOrigin) {
  if (!doc || typeof doc.id !== "string" || !doc.id || typeof doc.title !== "string" || !doc.title ||
      typeof doc.url !== "string" || typeof doc.lang !== "string" || !TYPES.has(doc.type)) return null;
  try {
    const url = new URL(doc.url);
    if (url.protocol !== "https:" || url.origin !== siteOrigin || url.username || url.password) return null;
  } catch {
    return null;
  }
  let grp = "";
  if (doc.group) {
    try {
      const group = new URL(doc.group);
      if (group.protocol === "https:" && group.origin === siteOrigin) grp = `${group.origin}${group.pathname.replace(/\/+$/, "") || "/"}`;
    } catch { /* ungueltige Gruppierung ignorieren */ }
  }
  const entities = Array.isArray(doc.entities) ? doc.entities.slice(0, 10).map((id) => String(id).trim()).filter(Boolean) : [];
  const image = String(doc.image || "");
  return {
    id: doc.id,
    url: doc.url,
    lang: doc.lang,
    type: doc.type,
    title: doc.title.slice(0, 500),
    summary: String(doc.summary || "").slice(0, 300),
    keywords: String(doc.keywords || "").slice(0, 500),
    entities: entities.join(","),
    date: /^\d{4}-\d{2}-\d{2}$/.test(doc.date || "") ? doc.date : "",
    image: image.startsWith("https://img.m365.fm/") ? image.slice(0, 2000) : "",
    grp,
  };
}

function normalizeSearchText(value) {
  return String(value || "").toLocaleLowerCase().normalize("NFKD").replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
}

function normalizeTitle(value) {
  return ` ${normalizeSearchText(value)} `;
}

async function currentRows(db, ids) {
  const rows = new Map();
  if (!ids.length) return rows;
  const found = await db.prepare("SELECT id,h,gone,title_norm FROM search_doc WHERE id IN (SELECT value FROM json_each(?))")
    .bind(JSON.stringify(ids)).all();
  for (const row of found.results || []) rows.set(row.id, row);
  return rows;
}

async function backfillSearchTitleNorm(db) {
  const rows = (await db.prepare("SELECT id,title FROM search_doc WHERE title_norm='' AND gone=0 LIMIT 1000").all()).results || [];
  const updates = rows.map((row) => db.prepare("UPDATE search_doc SET title_norm=? WHERE id=? AND title_norm=''")
    .bind(normalizeTitle(row.title), row.id));
  for (let i = 0; i < updates.length; i += 99) await db.batch(updates.slice(i, i + 99));
  return rows.length;
}

export async function importSearchIndex(env) {
  const db = env.DB;
  const manifest = await getJson(env, "/search/manifest.json");
  if (!manifest || !/^\d{4}-\d{2}-\d{2}$/.test(manifest.generated || "") ||
      !Number.isInteger(manifest.parts) || manifest.parts < 1 || manifest.parts > 1000) {
    return { skipped: "Suchmanifest nicht erreichbar oder ungueltig" };
  }
  await backfillSearchTitleNorm(db);
  const tokenizer = await ensureSearchFts(db);
  const ftsRows = await db.prepare("SELECT COUNT(*) n FROM search_fts").first();
  const docRows = await db.prepare("SELECT COUNT(*) n FROM search_doc").first();
  if (!ftsRows?.n && docRows?.n) await db.prepare("UPDATE search_doc SET h='' WHERE h<>''").run();
  const cycle = await sha256hex(JSON.stringify(manifest));
  const oldCycle = (await meta(db, "search_import_cycle"))?.v;
  const previous = oldCycle === cycle ? +(await meta(db, "search_import_part"))?.v || 0 : 0;
  const part = previous % manifest.parts + 1;
  const json = await getJson(env, `/search/part-${part}.json`);
  if (!json || json.part !== part || !Array.isArray(json.docs) || json.docs.length > 2000) {
    return { skipped: `Suchindex-Teil ${part} nicht erreichbar oder ungueltig` };
  }

  const siteOrigin = new URL(env.SITE).origin;
  const docs = json.docs.map((doc) => normalizeDoc(doc, siteOrigin)).filter(Boolean);
  const existing = await currentRows(db, docs.map((doc) => doc.id));
  const statements = [];
  const timestamp = now();
  let changed = 0;
  for (const doc of docs) {
    const h = hash(JSON.stringify(doc));
    const titleNorm = normalizeTitle(doc.title);
    const old = existing.get(doc.id);
    if (old?.h === h && !old.gone) {
      if (old.title_norm !== titleNorm) {
        statements.push(db.prepare("UPDATE search_doc SET title_norm=? WHERE id=? AND title_norm<>?")
          .bind(titleNorm, doc.id, titleNorm));
      }
      continue;
    }
    statements.push(db.prepare(
      "INSERT INTO search_doc(id,url,lang,type,title,title_norm,summary,keywords,entities,date,image,h,gone,updated,grp) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,0,?,?) " +
      "ON CONFLICT(id) DO UPDATE SET url=excluded.url,lang=excluded.lang,type=excluded.type,title=excluded.title,title_norm=excluded.title_norm,summary=excluded.summary,keywords=excluded.keywords,entities=excluded.entities,date=excluded.date,image=excluded.image,h=excluded.h,gone=0,updated=excluded.updated,grp=excluded.grp " +
      "WHERE search_doc.h<>excluded.h OR search_doc.gone=1",
    ).bind(doc.id, doc.url, doc.lang, doc.type, doc.title, titleNorm, doc.summary, doc.keywords, doc.entities, doc.date, doc.image, h, timestamp, doc.grp));
    statements.push(db.prepare("DELETE FROM search_fts WHERE rowid=(SELECT rowid FROM search_doc WHERE id=?)").bind(doc.id));
    statements.push(db.prepare("INSERT INTO search_fts(rowid,title,keywords,summary) SELECT rowid,?,?,? FROM search_doc WHERE id=?").bind(doc.title, doc.keywords, doc.summary, doc.id));
    changed++;
  }
  for (let i = 0; i < statements.length; i += 99) await db.batch(statements.slice(i, i + 99));

  const ids = [...new Set(docs.map((doc) => doc.id))];
  await setMeta(db, `search_ids_part_${part}`, JSON.stringify({ cycle, ids }));
  await setMeta(db, "search_import_cycle", cycle);
  await setMeta(db, "search_import_part", part);

  if (part === manifest.parts && (await meta(db, "search_complete_cycle"))?.v !== cycle) {
    const seen = new Set();
    for (let i = 1; i <= manifest.parts; i++) {
      const source = await meta(db, `search_ids_part_${i}`);
      const snapshot = source ? JSON.parse(source.v) : null;
      if (snapshot?.cycle !== cycle || !Array.isArray(snapshot.ids)) return { part, changed, tokenizer, skipped: "Suchindex-Durchlauf unvollstaendig" };
      for (const id of snapshot.ids) seen.add(id);
    }
    const indexed = (await db.prepare("SELECT id FROM search_doc WHERE gone=0").all()).results || [];
    const missing = indexed.filter((row) => !seen.has(row.id)).map((row) => row.id);
    const gone = missing.map((id) => db.prepare("UPDATE search_doc SET gone=1 WHERE id=? AND gone=0").bind(id));
    for (let i = 0; i < gone.length; i += 100) await db.batch(gone.slice(i, i + 100));
    await setMeta(db, "search_complete_cycle", cycle);
    return { part, changed, gone: missing.length, tokenizer };
  }
  return { part, changed, tokenizer };
}

function trigramQuery(query) {
  const words = query.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
  const wordGrams = words.slice(0, 8).map((word) => {
    const chars = Array.from(word);
    const grams = [...new Set(Array.from({ length: Math.max(0, chars.length - 2) }, (_, i) => chars.slice(i, i + 3).join("")))];
    return grams.length <= 3 ? grams : [grams[0], grams[Math.floor((grams.length - 1) / 2)], grams.at(-1)];
  });
  const grams = new Set();
  for (const list of wordGrams) for (const gram of list) if (grams.size < 24) grams.add(gram);
  for (let i = 3; i < Math.max(...wordGrams.map((list) => list.length), 0) && grams.size < 24; i++) {
    for (const list of wordGrams) if (list[i]) grams.add(list[i]);
  }
  return [...grams].map((gram) => `"${gram.replaceAll('"', '""')}"`).join(" OR ");
}

function filtersSql(filters) {
  const clauses = [], values = [];
  if (filters.lang) { clauses.push("d.lang=?"); values.push(filters.lang); }
  if (filters.type) { clauses.push("d.type=?"); values.push(filters.type); }
  if (filters.entity) { clauses.push("instr(','||d.entities||',', ','||?||',')>0"); values.push(filters.entity); }
  if (filters.year) { clauses.push("substr(d.date,1,4)=?"); values.push(filters.year); }
  return { sql: clauses.length ? ` AND ${clauses.join(" AND ")}` : "", values };
}

const FACETS = ["main", "type", "lang", "entity", "year"];
function filtersForFacet(filters, facet) {
  return { ...filters, ...(facet === "main" ? {} : { [facet]: "" }) };
}

function candidateQuery(tokenizer, query, normalizedQuery, filters, pref) {
  const short = Array.from(query).length < 3;
  const params = [];
  const expression = tokenizer === "trigram"
    ? trigramQuery(query)
    : query.split(/\s+/).filter(Boolean).map((term) => `"${term.replaceAll('"', '""')}"`).join(" OR ");
  const ctes = [];
  const contexts = [];
  for (const [index, facet] of FACETS.entries()) {
    const contextFilters = filtersForFacet(filters, facet);
    const key = JSON.stringify(contextFilters);
    const existing = contexts.find((context) => context.key === key);
    if (existing) existing.mask |= 1 << index;
    else contexts.push({ key, filters: contextFilters, mask: 1 << index });
  }
  const branches = [];
  for (const context of contexts) {
    const filter = filtersSql(context.filters);
    const name = `candidates_${branches.length}`;
    if (short) {
      const exact = ` ${normalizedQuery} `;
      const prefix = ` ${normalizedQuery}`;
      const matches = [
        { priority: 3, condition: "instr(d.title_norm,?)>0", values: [exact] },
        { priority: 2, condition: "instr(d.title_norm,?)>0 AND instr(d.title_norm,?)=0", values: [prefix, exact] },
      ];
      if (/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(normalizedQuery)) {
        matches.push({
          priority: 1,
          condition: "instr(d.title_norm,?)>0 AND instr(d.title_norm,?)=0",
          values: [normalizedQuery, prefix],
        });
      }
      const candidates = matches.map(({ priority, condition, values }) => {
        params.push(...values, ...filter.values);
        return `SELECT * FROM (SELECT d.rowid,0 score,${priority} exact FROM search_doc d ` +
          `WHERE d.gone=0 AND ${condition}${filter.sql} ORDER BY d.rowid LIMIT 1000)`;
      });
      ctes.push(`${name} AS MATERIALIZED (SELECT rowid,score,exact FROM (${candidates.join(" UNION ALL ")}) ORDER BY exact DESC LIMIT 1000)`);
    } else if (tokenizer === "trigram") {
      ctes.push(
        `${name} AS MATERIALIZED (SELECT d.rowid,bm25(search_fts,10,5,1) score,CASE WHEN instr(lower(d.title),lower(?))>0 THEN 1 ELSE 0 END exact ` +
        `FROM search_fts INNER JOIN search_doc d ON d.rowid=search_fts.rowid WHERE search_fts MATCH ? AND d.gone=0${filter.sql} ` +
        "ORDER BY exact DESC,score ASC LIMIT 1000)",
      );
      params.push(query, expression, ...filter.values);
    } else {
      if (!ctes.some((cte) => cte.startsWith("matched AS MATERIALIZED"))) {
        ctes.push("matched AS MATERIALIZED (SELECT rowid,bm25(search_fts,10,5,1) score FROM search_fts WHERE search_fts MATCH ?)");
        params.push(expression);
      }
      ctes.push(
        `${name} AS MATERIALIZED (SELECT d.rowid,COALESCE(m.score,0) score,CASE WHEN instr(lower(d.title),lower(?))>0 THEN 1 ELSE 0 END exact ` +
        `FROM search_doc d LEFT JOIN matched m ON m.rowid=d.rowid WHERE d.gone=0 AND (m.rowid IS NOT NULL OR instr(lower(d.title),lower(?))>0)${filter.sql} ` +
        "ORDER BY exact DESC,score ASC LIMIT 1000)",
      );
      params.push(query, query, ...filter.values);
    }
    branches.push(`SELECT rowid,score,exact,${context.mask} scope FROM ${name}`);
  }
  if (!short && pref && !filters.lang) {
    const filter = filtersSql({ ...filters, lang: pref });
    const name = "candidates_pref";
    if (tokenizer === "trigram") {
      ctes.push(
        `${name} AS MATERIALIZED (SELECT d.rowid,bm25(search_fts,10,5,1) score,CASE WHEN instr(lower(d.title),lower(?))>0 THEN 1 ELSE 0 END exact ` +
        `FROM search_fts INNER JOIN search_doc d ON d.rowid=search_fts.rowid WHERE search_fts MATCH ? AND d.gone=0${filter.sql} ` +
        "ORDER BY exact DESC,score ASC LIMIT 300)",
      );
      params.push(query, expression, ...filter.values);
    } else {
      ctes.push(
        `${name} AS MATERIALIZED (SELECT d.rowid,COALESCE(m.score,0) score,CASE WHEN instr(lower(d.title),lower(?))>0 THEN 1 ELSE 0 END exact ` +
        `FROM search_doc d LEFT JOIN matched m ON m.rowid=d.rowid WHERE d.gone=0 AND d.lang=? AND (m.rowid IS NOT NULL OR instr(lower(d.title),lower(?))>0)${filtersSql(filters).sql} ` +
        "ORDER BY exact DESC,score ASC LIMIT 300)",
      );
      params.push(query, pref, query, ...filtersSql(filters).values);
    }
    branches.push(`SELECT rowid,score,exact,1 scope FROM ${name}`);
  }
  ctes.push(`eligible AS (${branches.join(" UNION ALL ")})`);
  ctes.push(
    "ranked AS (SELECT rowid,MIN(score) score,MAX(exact) exact," +
    FACETS.map((facet, index) => `MAX(scope & ${1 << index}) ${facet}`).join(",") +
    " FROM eligible GROUP BY rowid)",
  );
  const sql = `WITH ${ctes.join(",")} SELECT d.id,d.url,d.lang,d.type,d.title,d.summary,d.date,d.image,d.entities,d.grp,r.score,r.main AS in_main,r.type AS in_type,r.lang AS in_lang,r.entity AS in_entity,r.year AS in_year FROM ranked r INNER JOIN search_doc d ON d.rowid=r.rowid`;
  return { sql, params };
}

function normalizeWord(word) {
  return word.toLocaleLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .normalize("NFD").replace(/\p{M}/gu, "");
}

function trigrams(value, cache) {
  const key = normalizeWord(value);
  if (cache.has(key)) return cache.get(key);
  const chars = Array.from(`^${key}$`);
  const out = new Set();
  for (let i = 0; i < chars.length - 2; i++) out.add(chars.slice(i, i + 3).join(""));
  cache.set(key, out);
  return out;
}

function dice(a, b, cache) {
  const key = `${normalizeWord(a)}|${normalizeWord(b)}`;
  if (cache.has(key)) return cache.get(key);
  if (normalizeWord(a) === normalizeWord(b)) return 1;
  const left = trigrams(a, cache), right = trigrams(b, cache);
  let common = 0;
  for (const gram of left) if (right.has(gram)) common++;
  const score = left.size + right.size ? 2 * common / (left.size + right.size) : 0;
  cache.set(key, score);
  return score;
}

function titleSimilarity(query, title, cache) {
  const q = normalizeWord(query), titleText = normalizeWord(title);
  const queryWords = (q.match(/[\p{L}\p{N}]+/gu) || [q]).slice(0, 8);
  const titleWords = (titleText.match(/[\p{L}\p{N}]+/gu) || [titleText]).slice(0, 30);
  const best = queryWords.map((word) => Math.max(...titleWords.map((candidate) => dice(word, candidate, cache))));
  return best.reduce((sum, score) => sum + score, 0) / Math.max(1, best.length);
}

function resultPath(row) {
  if (row.grp) return row.grp;
  let path;
  try { path = new URL(row.url).pathname; } catch { path = row.url; }
  const prefix = `/${row.lang}`;
  if (path === prefix || path === `${prefix}/`) path = "/";
  else if (path.startsWith(`${prefix}/`)) path = path.slice(prefix.length);
  return path.replace(/\/+$/, "") || "/";
}

function rankCandidates(rows, query, pref) {
  const similarityCache = new Map();
  const scores = rows.map((row) => Number(row.score) || 0);
  const min = Math.min(...scores, 0), max = Math.max(...scores, 0);
  for (const row of rows) {
    const similarity = titleSimilarity(query, row.title, similarityCache);
    const bm25 = max === min ? 1 : (max - Number(row.score || 0)) / (max - min);
    row.rank = similarity * 100 + bm25 * 10 +
      (similarity >= 0.4 && ["person", "entity"].includes(row.type) ? 16 : 0) +
      (pref && row.lang === pref ? 12 : 0);
  }
  rows.sort((a, b) => b.rank - a.rank || a.title.localeCompare(b.title));
  return rows;
}

function dedupeLanguages(rows, pref) {
  const byPath = new Map();
  for (const row of rows) {
    const path = resultPath(row), previous = byPath.get(path);
    const priority = (item) => item.lang === pref && pref ? 2 : item.lang === "en" ? 1 : 0;
    if (!previous || priority(row) > priority(previous) ||
        (priority(row) === priority(previous) && row.rank > previous.rank)) byPath.set(path, row);
  }
  return [...byPath.values()].sort((a, b) => b.rank - a.rank || a.title.localeCompare(b.title));
}

function countFacet(rows, scope, field) {
  const counts = {};
  for (const row of rows) {
    if (!row[`in_${scope}`]) continue;
    const value = field === "year" ? row.date?.slice(0, 4) : row[field];
    if (value) counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

function countEntityFacet(rows) {
  const counts = {};
  for (const row of rows) {
    if (!row.in_entity) continue;
    for (const entity of new Set((row.entities || "").split(",").filter(Boolean))) counts[entity] = (counts[entity] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 15));
}

export async function handleSearch(env, request, url, J) {
  if (request.method !== "GET") return J({ error: "bad_request" }, 405);
  const q = (url.searchParams.get("q") || "").replace(/\p{Cc}/gu, "").trim().replace(/\s+/g, " ");
  const qLength = Array.from(q).length;
  if (qLength < 1 || qLength > 100) return J({ error: "bad_request" }, 400);
  const rawPage = url.searchParams.get("page"), rawSize = url.searchParams.get("size");
  const page = rawPage === null ? 1 : Number(rawPage), size = rawSize === null ? 20 : Number(rawSize);
  if (!Number.isSafeInteger(page) || page < 1 || page > 100000 || !Number.isInteger(size) || size < 1 || size > 50) return J({ error: "bad_request" }, 400);
  const year = url.searchParams.get("year") || "";
  if (year && !/^\d{4}$/.test(year)) return J({ error: "bad_request" }, 400);
  const filters = {
    lang: url.searchParams.get("lang") || "",
    type: url.searchParams.get("type") || "",
    entity: url.searchParams.get("entity") || "",
    year,
  };
  const pref = url.searchParams.get("pref") || "";
  const day = new Date().toISOString().slice(0, 10);
  const ipHash = await sha256hex(`${request.headers.get("cf-connecting-ip") || ""}|${day}|${env.SESSION_SECRET || ""}`);
  if (!(await rateLimit(env.DB, `search:${ipHash}`, 60, 60))) return J({ error: "rate_limit" }, 429);
  const normalizedQuery = normalizeSearchText(q);
  if (!/[\p{L}\p{N}]/u.test(q) || !normalizedQuery) {
    return J({ q, total: 0, page, results: [], facets: { type: {}, lang: {}, entity: {}, year: {} } }, 200, { "cache-control": "public, max-age=300" });
  }

  const tokenizer = await ensureSearchFts(env.DB);
  const candidates = candidateQuery(tokenizer, q, normalizedQuery, filters, pref);
  const rawRows = (await env.DB.prepare(candidates.sql).bind(...candidates.params).all()).results || [];
  const ranked = rankCandidates(rawRows, q, pref);
  const rowsFor = (scope) => {
    const rows = ranked.filter((row) => row[`in_${scope}`]);
    return filters.lang && scope !== "lang" ? rows : dedupeLanguages(rows, pref);
  };
  const resultRows = rowsFor("main");
  const results = resultRows.slice((page - 1) * size, page * size).map(({ url, title, summary, type, lang, date, image }) => ({ url, title, summary, type, lang, date, image }));
  return J({
    q, total: resultRows.length, page,
    results,
    facets: {
      type: countFacet(rowsFor("type"), "type", "type"),
      lang: countFacet(rowsFor("lang"), "lang", "lang"),
      entity: countEntityFacet(rowsFor("entity")),
      year: countFacet(rowsFor("year"), "year", "year"),
    },
  }, 200, { "cache-control": "public, max-age=300" });
}
