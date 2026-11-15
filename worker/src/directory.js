const now = () => Math.floor(Date.now() / 1000);
const EID = /^[a-z0-9-]{2,48}$/;
const LANG = /^[a-z]{2}$/;
const PROGRAMS = ["mvp", "mct", "rd", "msa", "ms_employee", "partner", "gde"];
const MODES = ["online", "onsite", "hybrid"];
const list = (value) => { try { const parsed = JSON.parse(value || "[]"); return Array.isArray(parsed) ? parsed : []; } catch { return []; } };
const text = (value) => String(value || "").trim();
const finite = (value) => value === null || value === undefined || value === "" ? null : Number.isFinite(Number(value)) ? Number(value) : null;
const ready = new WeakSet();
const GEO_FINAL = new Set(["OK", "ZERO_RESULTS", "INVALID_REQUEST"]);   // endgueltige Google-Antworten
const GEO_STOP = new Set(["REQUEST_DENIED", "OVER_DAILY_LIMIT", "OVER_QUERY_LIMIT"]);   // Backfill fuer diesen Lauf beenden
const CITY_REGEO = "directory_city_regeo";   // meta: alte stadtgenaue Punkte einmal verworfen (siehe ensureDirectoryCols)

export function roundCoordinates(lat, lng) {
  const latitude = finite(lat), longitude = finite(lng);
  if (latitude === null || longitude === null || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  const latStep = 0.02, lngStep = latStep / Math.max(0.25, Math.cos(latitude * Math.PI / 180));
  return {
    lat: Math.max(-90, Math.min(90, Math.round(latitude / latStep) * latStep)),
    lng: Math.max(-180, Math.min(180, Math.round(longitude / lngStep) * lngStep)),
  };
}

const isCityType = (type) => type === "locality" || type === "postal_town" || String(type).startsWith("administrative_area_level_");
const component = (result, kinds) => (result?.address_components || []).find((x) => kinds.some((kind) => (x.types || []).includes(kind)))?.long_name || "";

async function geocodeOnce(env, address) {
  const params = new URLSearchParams({ address, key: env.GOOGLE_GEOCODING_KEY });
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`, { signal: AbortSignal.timeout(6000) });
  const result = await response.json();
  const status = text(result?.status) || "ERROR";
  return { status, first: status === "OK" ? result.results?.[0] || null : null };
}

export async function geocodeAddress(env, address, previous = {}, precision = "address") {
  const value = text(address);
  if (value && value === previous.geo_address && previous.geo_at)
    return { lat: finite(previous.lat), lng: finite(previous.lng), city: (precision === "city" ? previous.geo_city : previous.geo_city || previous.city) || "", geo_precision: previous.geo_precision || "", geo_address: value, geo_at: previous.geo_at, status: "CACHED", calls: 0 };
  if (!value || !env.GOOGLE_GEOCODING_KEY) return { lat: null, lng: null, geo_precision: "", geo_address: value, geo_at: 0, status: "NO_KEY", calls: 0 };
  let status = "ERROR", calls = 0;
  try {
    calls++;
    let first;
    ({ status, first } = await geocodeOnce(env, value));
    const city = component(first, ["locality", "postal_town"]);
    // Stadtgenau: ist der Treffer feiner als eine Stadt (Strasse, Gebaeude, PLZ), nicht diesen Punkt runden, sondern die Stadt selbst
    // geocodieren. Sonst wuerde eine Strasse aus dem privaten Freitextfeld als (gerundeter) Punkt veroeffentlicht. Ohne Stadt: keine Koordinaten.
    if (first && precision === "city" && Array.isArray(first.types) && !first.types.some(isCityType)) {
      if (!city) first = null;
      else {
        // Region mitsenden (Springfield, Massachusetts statt Springfield, Illinois); Status zuruecksetzen, damit ein Fehler hier voruebergehend bleibt
        const query = [...new Set([city, component(first, ["administrative_area_level_1"]), component(first, ["country"])].filter(Boolean))].join(", ");
        calls++; status = "ERROR";
        ({ status, first } = await geocodeOnce(env, query));
      }
    }
    const point = first?.geometry?.location;
    const coords = point && precision === "city" ? roundCoordinates(point.lat, point.lng) : point && { lat: point.lat, lng: point.lng };
    if (coords && finite(coords.lat) !== null && finite(coords.lng) !== null && (precision !== "city" || city))
      return { ...coords, city, geo_precision: precision, geo_address: value, geo_at: now(), status, calls };
  } catch {}
  // Endgueltige Antwort ohne Treffer: merken, damit dieselbe Adresse nicht erneut abgefragt wird. Voruebergehende Fehler (REQUEST_DENIED ohne
  // Abrechnung, OVER_*-Kontingent, UNKNOWN_ERROR, Zeitueberschreitung): geo_at=0 und keine Adresse, damit Speichern und Backfill es spaeter
  // erneut versuchen. Sonst blieben z. B. alle Eintraege aus der Zeit ohne Google-Abrechnung fuer immer ohne Koordinaten.
  return GEO_FINAL.has(status) ? { lat: null, lng: null, geo_precision: "", geo_address: value, geo_at: now(), status, calls }
    : { lat: null, lng: null, geo_precision: "", geo_address: "", geo_at: 0, status, calls };
}

export async function recordGeocodeStatus(db, geo, address = geo?.geo_address || "") {
  if (!geo?.status || geo.status === "CACHED" || geo.status === "NO_KEY") return;
  const timestamp = now(), denied = geo.status === "REQUEST_DENIED";
  await db.prepare(`INSERT INTO directory_geocode_state(id,status,checked_at,paused,retry_after,probe_address)
    VALUES(1,?,?,?, ?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status,checked_at=excluded.checked_at,
    paused=CASE WHEN excluded.status='OK' THEN 0 WHEN excluded.status='REQUEST_DENIED' THEN 1 ELSE directory_geocode_state.paused END,
    retry_after=CASE WHEN excluded.status='OK' THEN 0 WHEN excluded.status='REQUEST_DENIED' THEN excluded.retry_after ELSE directory_geocode_state.retry_after END,
    probe_address=CASE WHEN excluded.status='REQUEST_DENIED' THEN excluded.probe_address WHEN excluded.status='OK' THEN '' ELSE directory_geocode_state.probe_address END`)
    .bind(geo.status, timestamp, denied ? 1 : 0, denied ? timestamp + 86400 : 0, denied ? text(address) : "").run();
}

export async function ensureDirectoryCols(db) {
  if (ready.has(db)) return;
  for (const [table, column] of [
    ["profile_private", "map_public INTEGER NOT NULL DEFAULT 0"],
    ["profile_private", "lat REAL"],
    ["profile_private", "lng REAL"],
    ["profile_private", "geo_precision TEXT NOT NULL DEFAULT ''"],
    ["profile_private", "geo_address TEXT NOT NULL DEFAULT ''"],
    ["profile_private", "geo_at INTEGER NOT NULL DEFAULT 0"],
    ["profile_private", "geo_city TEXT NOT NULL DEFAULT ''"],
    ["events", "lat REAL"],
    ["events", "lng REAL"],
    ["events", "geo_precision TEXT NOT NULL DEFAULT ''"],
    ["events", "geo_address TEXT NOT NULL DEFAULT ''"],
    ["events", "geo_at INTEGER NOT NULL DEFAULT 0"],
    ["events", "city TEXT NOT NULL DEFAULT ''"],
  ]) {
    const name = column.split(" ")[0];
    try { await db.prepare(`SELECT ${name} FROM ${table} LIMIT 1`).first(); }
    catch { try { await db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column}`).run(); } catch {} }
  }
  // Einmalig (meta-Markierung statt Migrationsdatei): stadtgenaue Punkte aus der Zeit vor der Stadt-Regel verwerfen. Damals wurde ein
  // Strassen-/PLZ-Treffer aus dem privaten Freitextfeld nur gerundet; Cache (gleiche Adresse) und Backfill (nur geo_at=0) haetten ihn nie
  // ersetzt. Danach geocodiert der Backfill diese Zeilen stadtgenau neu (hoechstens 50 Aufrufe je Lauf). Ein Batch = eine Transaktion.
  try {
    if (!(await db.prepare("SELECT 1 x FROM meta WHERE k=?").bind(CITY_REGEO).first())) {
      const reset = "SET lat=NULL,lng=NULL,geo_precision='',geo_address='',geo_at=0 WHERE geo_precision='city' AND NOT EXISTS (SELECT 1 FROM meta WHERE k=?)";
      await db.batch([
        db.prepare(`UPDATE profile_private ${reset}`).bind(CITY_REGEO),
        db.prepare(`UPDATE org_locations ${reset}`).bind(CITY_REGEO),
        db.prepare("INSERT OR IGNORE INTO meta(k,v) VALUES(?,?)").bind(CITY_REGEO, String(now())),
      ]);
    }
  } catch {}
  ready.add(db);
}

function inBbox(item, bbox) {
  if (!bbox || item.lat === null || item.lng === null) return !bbox;
  const [west, south, east, north] = bbox;
  return item.lng >= west && item.lng <= east && item.lat >= south && item.lat <= north;
}

// Alle oeffentlichen Eintraege (ungefiltert); Obergrenzen nur als Schutz, Filter und Seiten folgen danach
const MAX_ROWS = 5000;
async function allDirectoryItems(env) {
  const db = env.DB;
  const [people, orgs, events] = await Promise.all([
    db.prepare(`SELECT p.user_id,u.name,u.lang,p.handle,p.headline,p.job,p.country,pp.geo_city city,pp.map_public,pp.lat,pp.lng,pp.geo_precision
      FROM profiles p JOIN users u ON u.id=p.user_id AND u.banned=0
      LEFT JOIN profile_private pp ON pp.user_id=p.user_id
      WHERE p.public=1 AND p.handle IS NOT NULL ORDER BY p.updated DESC LIMIT ${MAX_ROWS}`).all(),
    db.prepare(`SELECT id,handle,name,tagline,country,public FROM orgs WHERE public=1 AND unclaimed=0 ORDER BY created DESC LIMIT ${MAX_ROWS}`).all(),
    db.prepare(`SELECT id,handle,title,summary,start,end,mode,location,country,url,lang,topics,city,lat,lng,geo_precision
      FROM events WHERE public=1 AND COALESCE(NULLIF(end,''),start)>=? ORDER BY start LIMIT ${MAX_ROWS}`).bind(new Date().toISOString().slice(0, 10)).all(),
  ]);
  const result = [];
  const personRows = people.results || [];
  const progRows = personRows.length ? (await db.prepare("SELECT p.owner_id,p.program FROM programs p JOIN profiles x ON x.user_id=p.owner_id AND x.public=1 WHERE p.owner_type='u' AND p.verified=1").all()).results || [] : [];
  const topicRows = personRows.length ? (await db.prepare("SELECT e.owner_id,e.eid FROM expertise e JOIN profiles x ON x.user_id=e.owner_id AND x.public=1 WHERE e.owner_type='u'").all()).results || [] : [];
  const programs = new Map(), topics = new Map();
  for (const row of progRows) (programs.get(row.owner_id) || programs.set(row.owner_id, []).get(row.owner_id)).push(row.program);
  for (const row of topicRows) (topics.get(row.owner_id) || topics.set(row.owner_id, []).get(row.owner_id)).push(row.eid);
  for (const row of personRows) {
    const showLocation = !!row.map_public, personTopics = topics.get(row.user_id) || [], personPrograms = programs.get(row.user_id) || [];
    result.push({
      id: `u:${row.handle}`, type: "expert", name: row.name, headline: row.headline || row.job || "", url: `${env.SITE}/community/u/${row.handle}/`,
      country: showLocation ? row.country : "", city: showLocation ? row.city : "", lang: row.lang || "", topics: personTopics, programs: personPrograms,
      lat: showLocation ? finite(row.lat) : null, lng: showLocation ? finite(row.lng) : null, geo_precision: showLocation ? row.geo_precision || "" : "",
      mode: "", address: "",
    });
  }
  const orgRows = orgs.results || [];
  const orgLocations = (await db.prepare("SELECT l.id,l.org_id,l.label,l.address,l.city,l.country,l.lat,l.lng,l.geo_precision FROM org_locations l JOIN orgs o ON o.id=l.org_id AND o.public=1 WHERE l.public=1 ORDER BY l.org_id,l.id").all()).results || [];
  const orgTopics = (await db.prepare("SELECT e.owner_id,e.eid FROM expertise e JOIN orgs o ON o.id=e.owner_id AND o.public=1 WHERE e.owner_type='o'").all()).results || [];
  const orgPrograms = (await db.prepare("SELECT p.owner_id,p.program FROM programs p JOIN orgs o ON o.id=p.owner_id AND o.public=1 WHERE p.owner_type='o' AND p.verified=1").all()).results || [];
  const locationsByOrg = new Map(), topicsByOrg = new Map(), programsByOrg = new Map();
  for (const row of orgLocations) (locationsByOrg.get(row.org_id) || locationsByOrg.set(row.org_id, []).get(row.org_id)).push(row);
  for (const row of orgTopics) (topicsByOrg.get(row.owner_id) || topicsByOrg.set(row.owner_id, []).get(row.owner_id)).push(row.eid);
  for (const row of orgPrograms) (programsByOrg.get(row.owner_id) || programsByOrg.set(row.owner_id, []).get(row.owner_id)).push(row.program);
  for (const org of orgRows) {
    const locations = locationsByOrg.get(org.id) || [];
    const listingLocations = locations.length ? locations : [{ country: org.country, city: "", address: "", lat: null, lng: null, geo_precision: "" }];
    for (const location of listingLocations) result.push({
      id: `o:${org.handle}:${location.id || "main"}`, type: "company", name: org.name, headline: org.tagline || "", url: `${env.SITE}/community/c/${org.handle}/`,
      country: location.country || org.country, city: location.city || "", lang: "", topics: topicsByOrg.get(org.id) || [], programs: programsByOrg.get(org.id) || [],
      lat: finite(location.lat), lng: finite(location.lng), geo_precision: location.geo_precision || "", mode: "", address: location.address || "",
    });
  }
  for (const row of events.results || []) result.push({
    id: `e:${row.handle}`, type: "event", name: row.title, headline: row.summary || "", url: `${env.SITE}/community/events/${row.handle}/`,
    country: row.country || "", city: row.mode === "online" ? "" : row.city || "", lang: row.lang || "", topics: list(row.topics), programs: [],
    lat: row.mode === "online" ? null : finite(row.lat), lng: row.mode === "online" ? null : finite(row.lng), geo_precision: row.geo_precision || "",
    mode: row.mode, address: row.mode === "online" ? "" : row.location || "", start: row.start, end: row.end, online: row.mode === "online",
  });
  return result;
}

// Filterwerte ueber alle Eintraege (vor Filter und Seiten), damit die Auswahllisten nicht nur die geladene Seite zeigen
export function directoryFacets(items) {
  const facets = {};
  for (const key of ["country", "city", "topic", "program", "lang"]) {
    const seen = new Map();
    for (const item of items) for (const raw of key === "topic" ? item.topics || [] : key === "program" ? item.programs || [] : [item[key]]) {
      const value = text(raw), id = value.toLocaleLowerCase();
      if (value && !seen.has(id)) seen.set(id, value);
    }
    facets[key] = [...seen.values()].sort();
  }
  return facets;
}

function filterDirectory(result, filters = {}) {
  const type = text(filters.type);
  if (type && !["expert", "company", "event"].includes(type)) throw new Error("bad_type");
  const lang = text(filters.lang);
  if (lang && !LANG.test(lang)) throw new Error("bad_lang");
  const topic = text(filters.topic);
  if (topic && !EID.test(topic)) throw new Error("bad_topic");
  const program = text(filters.program);
  if (program && !PROGRAMS.includes(program)) throw new Error("bad_program");
  const mode = text(filters.mode);
  if (mode && !MODES.includes(mode)) throw new Error("bad_mode");
  let bbox = null;
  if (filters.bbox) {
    bbox = String(filters.bbox).split(",").map(Number);
    if (bbox.length !== 4 || bbox.some((x) => !Number.isFinite(x)) || bbox[0] < -180 || bbox[2] > 180 || bbox[1] < -90 || bbox[3] > 90 || bbox[0] > bbox[2] || bbox[1] > bbox[3]) throw new Error("bad_bbox");
  }
  const q = text(filters.q).toLocaleLowerCase();
  const country = text(filters.country).toLocaleLowerCase(), city = text(filters.city).toLocaleLowerCase();
  const filtered = result.filter((item) =>
    (!type || item.type === type) && (!topic || item.topics.includes(topic)) && (!program || item.programs.includes(program)) &&
    (!lang || item.lang === lang) && (!country || item.country.toLocaleLowerCase() === country) &&
    (!city || item.city.toLocaleLowerCase() === city) && (!mode || (item.type === "event" && (mode === "onsite" ? item.mode !== "online" : item.mode === mode))) &&
    (!q || `${item.name} ${item.headline} ${item.city} ${item.country} ${item.topics.join(" ")} ${item.programs.join(" ")}`.toLocaleLowerCase().includes(q)) &&
    inBbox(item, bbox));
  filtered.sort((a, b) => (a.type === "event" && b.type === "event" ? String(a.start).localeCompare(String(b.start)) : a.name.localeCompare(b.name)));
  return filtered;
}

export async function directoryItems(env, filters = {}) {
  return filterDirectory(await allDirectoryItems(env), filters);
}

export async function handleDirectory(env, request, url, J) {
  const path = url.pathname.replace(/\/+$/, "");
  if (path === "/api/directory/key" && request.method === "GET")
    return J({ key: env.GOOGLE_MAPS_API_KEY || "" }, 200, { "cache-control": "public, max-age=300" });
  if (path !== "/api/directory" && path !== "/api/directory/key") return null;
  if (request.method !== "GET") return J({ error: "method_not_allowed" }, 405, { allow: "GET" });
  let all, items;
  try { all = await allDirectoryItems(env); items = filterDirectory(all, Object.fromEntries(url.searchParams)); }
  catch (error) { return J({ error: error.message || "bad_request" }, 400); }
  const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get("limit"), 10) || 30));
  const page = Math.max(1, Math.min(10000, parseInt(url.searchParams.get("page"), 10) || 1));
  const start = (page - 1) * limit;
  const body = { items: items.slice(start, start + limit), total: items.length, page, limit, has_more: start + limit < items.length };
  // facets wachsen mit allen Orten/Themen: nur auf Anfrage (die Seite einmal beim Laden), nicht bei jeder Seite oder MCP-Suche
  if (url.searchParams.get("facets") === "1") body.facets = directoryFacets(all);
  return J(body, 200, { "cache-control": "public, max-age=300" });
}

export async function backfillDirectoryGeocodes(env) {
  if (!env.GOOGLE_GEOCODING_KEY) return { skipped: true, updated: 0 };
  const db = env.DB, today = new Date().toISOString().slice(0, 10);
  await ensureDirectoryCols(db);
  let probes = 0;
  const state = await db.prepare("SELECT status,paused,retry_after,probe_address FROM directory_geocode_state WHERE id=1").first();
  if (state?.paused) {
    if (now() < Number(state.retry_after || 0) || !state.probe_address) return { skipped: true, paused: true, updated: 0 };
    const probe = await geocodeAddress(env, state.probe_address, {}, "address");
    await recordGeocodeStatus(db, probe, state.probe_address);
    if (probe.status !== "OK") return { skipped: true, paused: true, updated: 0 };
    probes = 1;
  }
  const rows = [
    ...((await db.prepare(`SELECT 'u' kind,p.user_id id,pp.city city,pp.geo_city geo_city,p.country country,pp.lat lat,pp.lng lng,pp.geo_at geo_at,pp.geo_address geo_address,pp.geo_precision geo_precision
      FROM profiles p JOIN profile_private pp ON pp.user_id=p.user_id WHERE p.public=1 AND pp.map_public=1 AND pp.city<>'' AND pp.geo_at=0 LIMIT 50`).all()).results || []),
    ...((await db.prepare(`SELECT 'o' kind,id,address,city,country,lat,lng,geo_at,geo_address,geo_precision FROM org_locations
      WHERE public=1 AND geo_at=0 AND (city<>'' OR address<>'') LIMIT 50`).all()).results || []),
    ...((await db.prepare(`SELECT 'e' kind,id,location address,city,country,lat,lng,geo_at,geo_address,geo_precision FROM events
      WHERE public=1 AND mode<>'online' AND location<>'' AND COALESCE(NULLIF(end,''),start)>=? AND geo_at=0 LIMIT 50`).bind(today).all()).results || []),
  ].slice(0, 50 - probes);
  let updated = 0, calls = probes;   // hoechstens 50 Google-Aufrufe je Lauf
  for (const row of rows) {
    const address = row.kind === "u" ? `${row.city}, ${row.country}` : `${row.address || row.city}, ${row.country}`;
    const precision = row.kind === "u" || (!row.address && row.city) ? "city" : "address";
    if (calls + (precision === "city" ? 2 : 1) > 50) break;   // stadtgenau braucht evtl. einen zweiten Aufruf
    const geo = await geocodeAddress(env, address, row, precision);
    calls += geo.calls || 0;
    await recordGeocodeStatus(db, geo, address);
    const table = row.kind === "u" ? "profile_private" : row.kind === "o" ? "org_locations" : "events", idCol = row.kind === "u" ? "user_id" : "id";
    const fillCity = row.kind === "e" || row.kind === "o";
    await db.prepare(`UPDATE ${table} SET lat=?,lng=?,geo_precision=?,geo_address=?,geo_at=?${fillCity ? ",city=?" : ""}${row.kind === "u" ? ",geo_city=?" : ""} WHERE ${idCol}=?`)
      .bind(geo.lat, geo.lng, geo.geo_precision, geo.geo_address, geo.geo_at, ...(fillCity ? [row.city || geo.city || ""] : []), ...(row.kind === "u" ? [geo.city || ""] : []), row.id).run();
    updated++;
    if (GEO_STOP.has(geo.status)) break;   // ohne Abrechnung oder Kontingent: weitere Aufrufe waeren nutzlos
  }
  return { updated };
}
