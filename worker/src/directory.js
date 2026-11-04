const now = () => Math.floor(Date.now() / 1000);
const EID = /^[a-z0-9-]{2,48}$/;
const LANG = /^[a-z]{2}$/;
const PROGRAMS = ["mvp", "mct", "rd", "msa", "ms_employee", "partner"];
const MODES = ["online", "onsite", "hybrid"];
const list = (value) => { try { const parsed = JSON.parse(value || "[]"); return Array.isArray(parsed) ? parsed : []; } catch { return []; } };
const text = (value) => String(value || "").trim();
const finite = (value) => value === null || value === undefined || value === "" ? null : Number.isFinite(Number(value)) ? Number(value) : null;
const ready = new WeakSet();

export function roundCoordinates(lat, lng) {
  const latitude = finite(lat), longitude = finite(lng);
  if (latitude === null || longitude === null || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  const latStep = 0.02, lngStep = latStep / Math.max(0.25, Math.cos(latitude * Math.PI / 180));
  return {
    lat: Math.max(-90, Math.min(90, Math.round(latitude / latStep) * latStep)),
    lng: Math.max(-180, Math.min(180, Math.round(longitude / lngStep) * lngStep)),
  };
}

export async function geocodeAddress(env, address, previous = {}, precision = "address") {
  const value = text(address);
  if (value && value === previous.geo_address && previous.geo_at)
    return { lat: finite(previous.lat), lng: finite(previous.lng), city: (precision === "city" ? previous.geo_city : previous.geo_city || previous.city) || "", geo_precision: previous.geo_precision || "", geo_address: value, geo_at: previous.geo_at };
  if (!value || !env.GOOGLE_GEOCODING_KEY) return { lat: null, lng: null, geo_precision: "", geo_address: value, geo_at: 0 };
  const params = new URLSearchParams({ address: value, key: env.GOOGLE_GEOCODING_KEY });
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`, { signal: AbortSignal.timeout(6000) });
    const result = await response.json();
    const first = result?.status === "OK" ? result.results?.[0] : null;
    const point = first?.geometry?.location;
    const city = (first?.address_components || []).find((x) => x.types.includes("locality") || x.types.includes("postal_town"))?.long_name || "";
    const coords = point && precision === "city" ? roundCoordinates(point.lat, point.lng) : point && { lat: point.lat, lng: point.lng };
    if (coords && finite(coords.lat) !== null && finite(coords.lng) !== null && (precision !== "city" || city))
      return { ...coords, city, geo_precision: precision, geo_address: value, geo_at: now() };
  } catch {}
  return { lat: null, lng: null, geo_precision: "", geo_address: value, geo_at: now() };
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
  ready.add(db);
}

function inBbox(item, bbox) {
  if (!bbox || item.lat === null || item.lng === null) return !bbox;
  const [west, south, east, north] = bbox;
  return item.lng >= west && item.lng <= east && item.lat >= south && item.lat <= north;
}

export async function directoryItems(env, filters = {}) {
  const db = env.DB;
  const [people, orgs, events] = await Promise.all([
    db.prepare(`SELECT p.user_id,u.name,u.lang,p.handle,p.headline,p.job,p.country,pp.geo_city city,pp.map_public,pp.lat,pp.lng,pp.geo_precision
      FROM profiles p JOIN users u ON u.id=p.user_id AND u.banned=0
      LEFT JOIN profile_private pp ON pp.user_id=p.user_id
      WHERE p.public=1 AND p.handle IS NOT NULL ORDER BY p.updated DESC LIMIT 300`).all(),
    db.prepare("SELECT id,handle,name,tagline,country,public FROM orgs WHERE public=1 ORDER BY created DESC LIMIT 200").all(),
    db.prepare(`SELECT id,handle,title,summary,start,end,mode,location,country,url,lang,topics,city,lat,lng,geo_precision
      FROM events WHERE public=1 AND COALESCE(NULLIF(end,''),start)>=? ORDER BY start LIMIT 300`).bind(new Date().toISOString().slice(0, 10)).all(),
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

export async function handleDirectory(env, request, url, J) {
  const path = url.pathname.replace(/\/+$/, "");
  if (path === "/api/directory/key" && request.method === "GET")
    return J({ key: env.GOOGLE_MAPS_API_KEY || "" }, 200, { "cache-control": "public, max-age=300" });
  if (path !== "/api/directory" || request.method !== "GET") return null;
  let items;
  try { items = await directoryItems(env, Object.fromEntries(url.searchParams)); }
  catch (error) { return J({ error: error.message || "bad_request" }, 400); }
  const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get("limit"), 10) || 30));
  const page = Math.max(1, Math.min(10000, parseInt(url.searchParams.get("page"), 10) || 1));
  const start = (page - 1) * limit;
  return J({ items: items.slice(start, start + limit), total: items.length, page, limit, has_more: start + limit < items.length },
    200, { "cache-control": "public, max-age=300" });
}

export async function backfillDirectoryGeocodes(env) {
  if (!env.GOOGLE_GEOCODING_KEY) return { skipped: true, updated: 0 };
  const db = env.DB, today = new Date().toISOString().slice(0, 10);
  await ensureDirectoryCols(db);
  const rows = [
    ...((await db.prepare(`SELECT 'u' kind,p.user_id id,pp.city city,pp.geo_city geo_city,p.country country,pp.lat lat,pp.lng lng,pp.geo_at geo_at,pp.geo_address geo_address,pp.geo_precision geo_precision
      FROM profiles p JOIN profile_private pp ON pp.user_id=p.user_id WHERE p.public=1 AND pp.map_public=1 AND pp.city<>'' AND pp.geo_at=0 LIMIT 50`).all()).results || []),
    ...((await db.prepare(`SELECT 'o' kind,id,address,city,country,lat,lng,geo_at,geo_address,geo_precision FROM org_locations
      WHERE public=1 AND geo_at=0 AND (city<>'' OR address<>'') LIMIT 50`).all()).results || []),
    ...((await db.prepare(`SELECT 'e' kind,id,location city,country,lat,lng,geo_at,geo_address,geo_precision FROM events
      WHERE public=1 AND mode<>'online' AND location<>'' AND COALESCE(NULLIF(end,''),start)>=? AND geo_at=0 LIMIT 50`).bind(today).all()).results || []),
  ].slice(0, 50);
  let updated = 0;
  for (const row of rows) {
    const address = row.kind === "u" ? `${row.city}, ${row.country}` : `${row.address || row.city}, ${row.country}`;
    const geo = await geocodeAddress(env, address, row, row.kind === "u" || (!row.address && row.city) ? "city" : "address");
    const table = row.kind === "u" ? "profile_private" : row.kind === "o" ? "org_locations" : "events", idCol = row.kind === "u" ? "user_id" : "id";
    const fillCity = row.kind === "e" || row.kind === "o";
    await db.prepare(`UPDATE ${table} SET lat=?,lng=?,geo_precision=?,geo_address=?,geo_at=?${fillCity ? ",city=?" : ""}${row.kind === "u" ? ",geo_city=?" : ""} WHERE ${idCol}=?`)
      .bind(geo.lat, geo.lng, geo.geo_precision, geo.geo_address, geo.geo_at, ...(fillCity ? [row.city || geo.city || ""] : []), ...(row.kind === "u" ? [geo.city || ""] : []), row.id).run();
    updated++;
  }
  return { updated };
}
