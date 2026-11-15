import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { backfillDirectoryGeocodes, directoryItems, ensureDirectoryCols, geocodeAddress, handleDirectory, roundCoordinates } from "../src/directory.js";
import { deleteUserData, saveOrgLocations } from "../src/profiles.js";
import worker from "../src/index.js";
import { sha256hex } from "../src/util.js";

async function database() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(file, dir), "utf8"));
  const db = wrap(raw);
  await ensureDirectoryCols(db);
  return { db, raw };
}

// Eigener D1-Schein je Aufruf (wie ein neuer Worker-Isolate: ensureDirectoryCols laeuft dort erneut)
function wrap(raw) {
  return { prepare(sql) {
    const statement = raw.prepare(sql); let args = [];
    const out = {
      bind(...values) { args = values; return out; },
      all: async () => ({ results: statement.all(...args) }),
      first: async () => statement.get(...args) ?? null,
      run: async () => { const result = statement.run(...args); return { meta: { changes: Number(result.changes), last_row_id: Number(result.lastInsertRowid) } }; },
    };
    return out;
  }, async batch(statements) { for (const statement of statements) await statement.run(); } };
}

test("directory: Personen-Koordinaten werden auf ungefähr zwei Kilometer gerundet", () => {
  const rounded = roundCoordinates(52.520008, 13.404954);
  assert.ok(Math.abs(rounded.lat - 52.52) < 0.0001);
  assert.ok(Math.abs(rounded.lng - 13.41) < 0.001);
  assert.equal(roundCoordinates(91, 0), null);
  assert.equal(roundCoordinates(0, 181), null);
});

test("directory: Geocoding nutzt den Adress-Cache und sendet nur die übergebene Stadt", async () => {
  const oldFetch = globalThis.fetch; let calls = 0, requestUrl;
  globalThis.fetch = async (url) => {
    calls++; requestUrl = new URL(url);
    return { json: async () => ({ status: "OK", results: [{ geometry: { location: { lat: 52.520008, lng: 13.404954 } }, address_components: [{ long_name: "Berlin", types: ["locality"] }] }] }) };
  };
  try {
    const env = { GOOGLE_GEOCODING_KEY: "test-key" };
    const cached = await geocodeAddress(env, "Berlin, Germany", { geo_address: "Berlin, Germany", geo_at: 10, lat: 52.52, lng: 13.4, geo_precision: "city" }, "city");
    assert.equal(calls, 0);
    assert.equal(cached.geo_at, 10);
    const fresh = await geocodeAddress(env, "Berlin, Germany", {}, "city");
    assert.equal(calls, 1);
    assert.equal(requestUrl.searchParams.get("address"), "Berlin, Germany");
    assert.equal(requestUrl.searchParams.get("key"), "test-key");
    assert.deepEqual({ lat: fresh.lat, lng: fresh.lng }, roundCoordinates(52.520008, 13.404954));
    assert.equal(fresh.city, "Berlin");
    assert.equal(fresh.geo_precision, "city");
    const failedCache = await geocodeAddress(env, "Berlin, Germany", { city: "Private Street 4, 10115 Berlin", geo_city: "", geo_address: "Berlin, Germany", geo_at: 20, lat: null, lng: null }, "city");
    assert.equal(calls, 1);
    assert.equal(failedCache.lat, null);
    assert.equal(failedCache.city, "");
  } finally { globalThis.fetch = oldFetch; }
});

test("directory: öffentliche Liste filtert und gibt Personenadresse nur stadtgenau frei", async () => {
  const { db, raw } = await database(), now = Math.floor(Date.now() / 1000), future = new Date(Date.now() + 86400000).toISOString().slice(0, 10), past = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  raw.exec(`INSERT INTO users(id,provider,sub,name,lang,created) VALUES(1,'test','1','Ada Example','de',${now}),(2,'test','2','Bea Example','en',${now});
    INSERT INTO profiles(user_id,public,handle,headline,job,country,updated) VALUES(1,1,'ada-example','Copilot consultant','Consultant','Germany',${now}),(2,1,'bea-example','MVP','Engineer','Germany',${now});
    INSERT INTO profile_private(user_id,city,zip,street,map_public,lat,lng,geo_precision,geo_address,geo_at,geo_city) VALUES(1,'Private Street 4, 10115 Berlin','10115','Private Street 4',1,52.52,13.4,'city','Private Street 4, 10115 Berlin, Germany',${now},'Berlin'),(2,'Munich','80331','Other Private Street',0,48.1,11.5,'city','Munich, Germany',${now},'Munich');
    INSERT INTO expertise(owner_type,owner_id,eid,level) VALUES('u',1,'copilot-studio',3);
    INSERT INTO programs(owner_type,owner_id,program,year,verified) VALUES('u',1,'mvp',2026,1);
    INSERT INTO events(handle,owner_id,title,start,mode,location,country,lang,public,created,updated) VALUES('future-online',1,'Future online event','${future}','online','Online','Germany','en',1,${now},${now}),('past-event',1,'Past event','${past}','onsite','Hall','Germany','en',1,${now},${now});`);
  const env = { DB: db, SITE: "https://www.m365.fm" };
  const exact = await directoryItems(env, { type: "expert", topic: "copilot-studio", program: "mvp", country: "Germany", city: "Berlin", lang: "de" });
  assert.equal(exact.length, 1);
  assert.equal(exact[0].url, "https://www.m365.fm/community/u/ada-example/");
  assert.equal(exact[0].lat, 52.52);
  assert.equal(exact[0].city, "Berlin");
  assert.equal(Object.hasOwn(exact[0], "street"), false);
  assert.equal(Object.hasOwn(exact[0], "zip"), false);
  const hidden = (await directoryItems(env, { type: "expert", q: "Bea" }))[0];
  assert.equal(hidden.city, "");
  assert.equal(hidden.lat, null);
  const online = (await directoryItems(env, { type: "event" }))[0];
  assert.equal(online.online, true);
  assert.equal(online.lat, null);
  const response = await handleDirectory(env, new Request("https://api.example.test/api/directory?type=expert&limit=1"), new URL("https://api.example.test/api/directory?type=expert&limit=1"), (body, status, headers) => ({ body, status, headers }));
  assert.equal(response.status, 200);
  assert.equal(response.body.total, 2);
  assert.equal(response.body.items.length, 1);
  assert.equal(response.body.has_more, true);
  assert.equal(response.headers["cache-control"], "public, max-age=300");
  assert.equal((await directoryItems(env, { type: "event" })).some((item) => item.name === "Past event"), false);
  raw.close();
});

test("directory: Geocode-Backfill verarbeitet höchstens 50 Einträge pro Lauf", async () => {
  const { db, raw } = await database(), now = Math.floor(Date.now() / 1000);
  const user = raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(?,?,?,?,?)");
  const profile = raw.prepare("INSERT INTO profiles(user_id,public,handle,country,updated) VALUES(?,1,?,'Germany',?)");
  const privateProfile = raw.prepare("INSERT INTO profile_private(user_id,city,map_public) VALUES(?,?,1)");
  for (let i = 1; i <= 55; i++) {
    user.run(i, "test", String(i), "Person " + i, now);
    profile.run(i, "person-" + i, now);
    privateProfile.run(i, "City " + i);
  }
  const oldFetch = globalThis.fetch; let calls = 0;
  globalThis.fetch = async () => { calls++; return { json: async () => ({ status: "ZERO_RESULTS", results: [] }) }; };
  try {
    const result = await backfillDirectoryGeocodes({ DB: db, GOOGLE_GEOCODING_KEY: "test-key" });
    assert.ok(result.updated <= 50);
    assert.ok(calls <= 50);
  } finally { globalThis.fetch = oldFetch; raw.close(); }
});

test("directory: REQUEST_DENIED pausiert den Backfill bis eine Google-Antwort OK ist", async () => {
  const { db, raw } = await database(), now = Math.floor(Date.now() / 1000);
  const user = raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(?,?,?,?,?)");
  const profile = raw.prepare("INSERT INTO profiles(user_id,public,handle,country,updated) VALUES(?,1,?,'Germany',?)");
  const privateProfile = raw.prepare("INSERT INTO profile_private(user_id,city,map_public) VALUES(?,?,1)");
  for (let id = 1; id <= 55; id++) {
    user.run(id, "test", String(id), `Person ${id}`, now);
    profile.run(id, `person-${id}`, now);
    privateProfile.run(id, `City ${id}`);
  }
  const oldFetch = globalThis.fetch; let calls = 0, status = "REQUEST_DENIED";
  globalThis.fetch = async () => { calls++; return { json: async () => ({ status, results: [] }) }; };
  try {
    const env = { DB: db, GOOGLE_GEOCODING_KEY: "test-key" };
    const denied = await backfillDirectoryGeocodes(env);
    assert.equal(denied.updated, 1);
    assert.equal(calls, 1);
    assert.equal((await db.prepare("SELECT paused FROM directory_geocode_state WHERE id=1").first()).paused, 1);
    const paused = await backfillDirectoryGeocodes(env);
    assert.equal(paused.paused, true);
    assert.equal(calls, 1);
    raw.exec("UPDATE directory_geocode_state SET retry_after=0 WHERE id=1");
    status = "OK";
    const callsBeforeProbe = calls;
    await backfillDirectoryGeocodes(env);
    assert.ok(calls - callsBeforeProbe <= 50);
    assert.equal((await db.prepare("SELECT paused FROM directory_geocode_state WHERE id=1").first()).paused, 0);
  } finally { globalThis.fetch = oldFetch; raw.close(); }
});

test("directory: neu angelegte Firmenstandorte bleiben nach dem Speichern öffentlich", async () => {
  const { db, raw } = await database(), now = Math.floor(Date.now() / 1000);
  raw.exec("INSERT INTO orgs(handle,name,public,created) VALUES('example-co','Example Co',1," + now + ")");
  await saveOrgLocations({ DB: db }, 1, [{ id: 0, label: "Berlin", city: "Berlin", country: "Germany", address: "", public: 1 }]);
  const location = raw.prepare("SELECT public,city,country FROM org_locations WHERE org_id=1").get();
  assert.equal(location.public, 1);
  assert.equal(location.city, "Berlin");
  assert.equal(location.country, "Germany");
  raw.close();
});

test("directory: voruebergehende Geocoding-Fehler werden nicht gemerkt, endgueltige schon", async () => {
  const oldFetch = globalThis.fetch; let status = "REQUEST_DENIED", calls = 0;
  globalThis.fetch = async () => { calls++; return { json: async () => ({ status, results: [] }) }; };
  try {
    const env = { GOOGLE_GEOCODING_KEY: "test-key" };
    for (const s of ["REQUEST_DENIED", "OVER_DAILY_LIMIT", "OVER_QUERY_LIMIT", "UNKNOWN_ERROR"]) {
      status = s;
      const geo = await geocodeAddress(env, "Berlin, Germany", {}, "city");
      assert.equal(geo.geo_at, 0, `${s}: spaeter erneut versuchen`);
      assert.equal(geo.geo_address, "", `${s}: kein Cache-Treffer beim naechsten Speichern`);
    }
    status = "ZERO_RESULTS";
    const none = await geocodeAddress(env, "Nowhere, Germany", {}, "city");
    assert.ok(none.geo_at > 0);
    const before = calls;
    assert.equal((await geocodeAddress(env, "Nowhere, Germany", none, "city")).status, "CACHED");
    assert.equal(calls, before, "endgueltig ohne Treffer: dieselbe Adresse wird nicht erneut abgefragt");
  } finally { globalThis.fetch = oldFetch; }
});

test("directory: Backfill fuer Events nimmt die Stadt von Google, nicht den Veranstaltungsort; OVER_* beendet den Lauf", async () => {
  const { db, raw } = await database(), now = Math.floor(Date.now() / 1000), future = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  raw.exec(`INSERT INTO events(handle,owner_id,title,start,mode,location,country,public,created,updated) VALUES
    ('messe',1,'Messe','${future}','onsite','Messe Muenchen, Am Messesee 2, 81829 Muenchen','Germany',1,${now},${now}),
    ('halle',1,'Halle','${future}','onsite','Halle 7, Koeln','Germany',1,${now},${now})`);
  const oldFetch = globalThis.fetch; let status = "OVER_QUERY_LIMIT", calls = 0;
  globalThis.fetch = async () => { calls++; return { json: async () => status === "OK"
    ? { status, results: [{ geometry: { location: { lat: 48.13, lng: 11.69 } }, address_components: [{ long_name: "München", types: ["locality"] }] }] }
    : { status, results: [] } }; };
  try {
    const env = { DB: db, GOOGLE_GEOCODING_KEY: "test-key" };
    await backfillDirectoryGeocodes(env);
    assert.equal(calls, 1, "OVER_QUERY_LIMIT beendet den Lauf");
    assert.equal(raw.prepare("SELECT COUNT(*) n FROM events WHERE geo_at=0").get().n, 2, "beide Events bleiben fuer den naechsten Lauf offen");
    status = "OK";
    await backfillDirectoryGeocodes(env);
    const messe = raw.prepare("SELECT city,lat,geo_address FROM events WHERE handle='messe'").get();
    assert.equal(messe.city, "München");
    assert.ok(messe.lat !== null);
    assert.equal(messe.geo_address, "Messe Muenchen, Am Messesee 2, 81829 Muenchen, Germany");
  } finally { globalThis.fetch = oldFetch; raw.close(); }
});

const J = (body, status = 200, headers = {}) => ({ body, status, headers });
const get = (env, query) => { const url = new URL(`https://api.example.test/api/directory?${query}`); return handleDirectory(env, new Request(url), url, J); };

test("directory: API liefert Filterwerte (facets) ueber alle Eintraege, nicht nur die geladene Seite", async () => {
  const { db, raw } = await database(), now = Math.floor(Date.now() / 1000);
  const user = raw.prepare("INSERT INTO users(id,provider,sub,name,lang,created) VALUES(?,?,?,?,?,?)");
  const profile = raw.prepare("INSERT INTO profiles(user_id,public,handle,country,updated) VALUES(?,1,?,?,?)");
  const privateProfile = raw.prepare("INSERT INTO profile_private(user_id,city,map_public,geo_city) VALUES(?,?,1,?)");
  const places = [["Germany", "Berlin"], ["Germany", "berlin"], ["France", "Paris"], ["Japan", "Tokyo"]];
  places.forEach(([country, city], index) => {
    const id = index + 1;
    user.run(id, "test", String(id), `Person ${id}`, index === 3 ? "ja" : "de", now);
    profile.run(id, `person-${id}`, country, now - index);
    privateProfile.run(id, city, city);
  });
  raw.exec("INSERT INTO expertise(owner_type,owner_id,eid,level) VALUES('u',4,'purview',2); INSERT INTO programs(owner_type,owner_id,program,year,verified) VALUES('u',4,'mct',2026,1)");
  const env = { DB: db, SITE: "https://www.m365.fm" };
  const first = await get(env, "limit=1&facets=1");
  assert.equal(first.body.items.length, 1);
  assert.deepEqual(first.body.facets.country, ["France", "Germany", "Japan"]);
  assert.deepEqual(first.body.facets.city, ["Berlin", "Paris", "Tokyo"], "Berlin/berlin nur einmal");
  assert.deepEqual(first.body.facets.topic, ["purview"]);
  assert.deepEqual(first.body.facets.program, ["mct"]);
  assert.deepEqual(first.body.facets.lang, ["de", "ja"]);
  const filtered = await get(env, "country=France&facets=1");
  assert.equal(filtered.body.total, 1);
  assert.deepEqual(filtered.body.facets.country, ["France", "Germany", "Japan"], "nach einer Auswahl bleiben die anderen Werte waehlbar");
  assert.equal(Object.hasOwn((await get(env, "limit=1")).body, "facets"), false, "facets nur auf Anfrage (facets=1)");
  raw.close();
});

test("directory: nicht-GET auf /api/directory ergibt 405 statt Laufzeitfehler", async () => {
  const { db, raw } = await database();
  const env = { DB: db, SITE: "https://www.m365.fm" };
  for (const path of ["/api/directory", "/api/directory/key"]) {
    const url = new URL(`https://api.example.test${path}`);
    const response = await handleDirectory(env, new Request(url, { method: "POST" }), url, J);
    assert.equal(response?.status, 405, path);
  }
  const response = await worker.fetch(new Request("https://api-dub.m365.fm/api/directory", { method: "POST", headers: { "x-requested-with": "m365" } }), env, { waitUntil() {} });
  assert.equal(response.status, 405);
  raw.close();
});

test("directory: mehr als 300 Personen und 200 Firmen werden vollstaendig gelistet", async () => {
  const { db, raw } = await database(), now = Math.floor(Date.now() / 1000);
  const user = raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(?,?,?,?,?)");
  const profile = raw.prepare("INSERT INTO profiles(user_id,public,handle,country,updated) VALUES(?,1,?,'Germany',?)");
  const org = raw.prepare("INSERT INTO orgs(handle,name,public,country,created) VALUES(?,?,1,'Germany',?)");
  raw.exec("BEGIN");
  for (let id = 1; id <= 320; id++) { user.run(id, "test", String(id), `Person ${id}`, now); profile.run(id, `person-${id}`, now - id); }
  for (let id = 1; id <= 220; id++) org.run(`org-${id}`, `Org ${id}`, now - id);
  raw.exec("COMMIT");
  const env = { DB: db, SITE: "https://www.m365.fm" };
  assert.equal((await directoryItems(env, { type: "expert" })).length, 320);
  assert.equal((await directoryItems(env, { type: "company" })).length, 220);
  assert.equal((await get(env, "limit=100")).body.total, 540);
  raw.close();
});

test("directory: stadtgenaues Geocoding veroeffentlicht die Stadtmitte, nicht eine Strasse aus dem Freitext", async () => {
  const oldFetch = globalThis.fetch, addresses = [];
  globalThis.fetch = async (url) => {
    const address = new URL(url).searchParams.get("address"); addresses.push(address);
    if (address === "Berlin, Germany") return { json: async () => ({ status: "OK", results: [{ types: ["locality", "political"], geometry: { location: { lat: 52.520008, lng: 13.404954 } }, address_components: [{ long_name: "Berlin", types: ["locality", "political"] }, { long_name: "Germany", types: ["country", "political"] }] }] }) };
    if (address.startsWith("Private Street")) return { json: async () => ({ status: "OK", results: [{ types: ["street_address"], geometry: { location: { lat: 52.5711, lng: 13.3088 } }, address_components: [{ long_name: "4", types: ["street_number"] }, { long_name: "Berlin", types: ["locality", "political"] }, { long_name: "Germany", types: ["country", "political"] }] }] }) };
    return { json: async () => ({ status: "OK", results: [{ types: ["route"], geometry: { location: { lat: 1.23, lng: 4.56 } }, address_components: [{ long_name: "Somewhere Road", types: ["route"] }] }] }) };
  };
  try {
    const env = { GOOGLE_GEOCODING_KEY: "test-key" };
    const geo = await geocodeAddress(env, "Private Street 4, 10115 Berlin, Germany", {}, "city");
    assert.deepEqual(addresses, ["Private Street 4, 10115 Berlin, Germany", "Berlin, Germany"]);
    assert.deepEqual({ lat: geo.lat, lng: geo.lng }, roundCoordinates(52.520008, 13.404954));
    assert.notDeepEqual({ lat: geo.lat, lng: geo.lng }, roundCoordinates(52.5711, 13.3088));
    assert.equal(geo.city, "Berlin");
    assert.equal(geo.calls, 2);
    assert.equal(geo.geo_address, "Private Street 4, 10115 Berlin, Germany", "Cache-Schluessel bleibt die Eingabe");
    const exact = await geocodeAddress(env, "Private Street 4, 10115 Berlin, Germany", {}, "address");
    assert.equal(exact.lat, 52.5711, "Firmenadressen (precision address) bleiben genau");
    addresses.length = 0;
    const none = await geocodeAddress(env, "Somewhere Road, Nowhere", {}, "city");
    assert.equal(none.lat, null, "ohne Stadt keine Koordinaten");
    assert.equal(addresses.length, 1);
  } finally { globalThis.fetch = oldFetch; }
});

test("directory: Fehler beim zweiten (Stadt-)Aufruf bleibt voruebergehend und wird spaeter erneut versucht", async () => {
  const { db, raw } = await database(), now = Math.floor(Date.now() / 1000);
  raw.exec(`INSERT INTO users(id,provider,sub,name,created) VALUES(1,'test','1','Ada',${now});
    INSERT INTO profiles(user_id,public,handle,country,updated) VALUES(1,1,'ada','Germany',${now});
    INSERT INTO profile_private(user_id,city,map_public) VALUES(1,'Private Street 4, 10115 Berlin',1)`);
  const oldFetch = globalThis.fetch; let fail = true, calls = 0;
  globalThis.fetch = async (url) => {
    calls++;
    const address = new URL(url).searchParams.get("address");
    if (address.startsWith("Private Street")) return { json: async () => ({ status: "OK", results: [{ types: ["street_address"], geometry: { location: { lat: 52.5711, lng: 13.3088 } }, address_components: [{ long_name: "Berlin", types: ["locality"] }, { long_name: "Germany", types: ["country"] }] }] }) };
    if (fail) throw new Error("timeout");
    return { json: async () => ({ status: "OK", results: [{ types: ["locality"], geometry: { location: { lat: 52.520008, lng: 13.404954 } }, address_components: [{ long_name: "Berlin", types: ["locality"] }, { long_name: "Germany", types: ["country"] }] }] }) };
  };
  try {
    const env = { GOOGLE_GEOCODING_KEY: "test-key" };
    const geo = await geocodeAddress(env, "Private Street 4, 10115 Berlin, Germany", {}, "city");
    assert.equal(geo.status, "ERROR");
    assert.equal(geo.geo_at, 0, "nicht als endgueltig gemerkt");
    assert.equal(geo.geo_address, "");
    calls = 0;
    await geocodeAddress(env, "Private Street 4, 10115 Berlin, Germany", geo, "city");
    assert.equal(calls, 2, "neuer Versuch fragt Google wieder an");
    await backfillDirectoryGeocodes({ DB: db, GOOGLE_GEOCODING_KEY: "test-key" });
    assert.equal(raw.prepare("SELECT geo_at FROM profile_private WHERE user_id=1").get().geo_at, 0);
    fail = false;
    await backfillDirectoryGeocodes({ DB: db, GOOGLE_GEOCODING_KEY: "test-key" });
    const row = raw.prepare("SELECT lat,lng,geo_city,geo_at FROM profile_private WHERE user_id=1").get();
    assert.deepEqual({ lat: row.lat, lng: row.lng }, roundCoordinates(52.520008, 13.404954));
    assert.equal(row.geo_city, "Berlin");
    assert.ok(row.geo_at > 0);
  } finally { globalThis.fetch = oldFetch; raw.close(); }
});

test("directory: zweiter Stadt-Aufruf nennt die Region (gleichnamige Staedte)", async () => {
  const oldFetch = globalThis.fetch, addresses = [];
  globalThis.fetch = async (url) => {
    const address = new URL(url).searchParams.get("address"); addresses.push(address);
    const components = [{ long_name: "Springfield", types: ["locality"] }, { long_name: "Massachusetts", types: ["administrative_area_level_1"] }, { long_name: "United States", types: ["country"] }];
    return { json: async () => ({ status: "OK", results: [{ types: addresses.length === 1 ? ["postal_code"] : ["locality"], geometry: { location: { lat: 42.1015, lng: -72.5898 } }, address_components: components }] }) };
  };
  try {
    const geo = await geocodeAddress({ GOOGLE_GEOCODING_KEY: "test-key" }, "Springfield, MA 01103, United States", {}, "city");
    assert.deepEqual(addresses, ["Springfield, MA 01103, United States", "Springfield, Massachusetts, United States"]);
    assert.equal(geo.city, "Springfield");
  } finally { globalThis.fetch = oldFetch; }
});

test("directory: Backfill zaehlt den zweiten Stadt-Aufruf zum Limit von 50", async () => {
  const { db, raw } = await database(), now = Math.floor(Date.now() / 1000);
  const user = raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(?,?,?,?,?)");
  const profile = raw.prepare("INSERT INTO profiles(user_id,public,handle,country,updated) VALUES(?,1,?,'Germany',?)");
  const privateProfile = raw.prepare("INSERT INTO profile_private(user_id,city,map_public) VALUES(?,?,1)");
  for (let id = 1; id <= 50; id++) { user.run(id, "test", String(id), `Person ${id}`, now); profile.run(id, `person-${id}`, now); privateProfile.run(id, `Street ${id}, Berlin`); }
  const oldFetch = globalThis.fetch; let calls = 0;
  globalThis.fetch = async (url) => {
    calls++;
    const street = new URL(url).searchParams.get("address").startsWith("Street");
    return { json: async () => ({ status: "OK", results: [{ types: street ? ["street_address"] : ["locality"], geometry: { location: { lat: 52.5, lng: 13.4 } }, address_components: [{ long_name: "Berlin", types: ["locality"] }, { long_name: "Germany", types: ["country"] }] }] }) };
  };
  try {
    const result = await backfillDirectoryGeocodes({ DB: db, GOOGLE_GEOCODING_KEY: "test-key" });
    assert.ok(calls <= 50, `${calls} Aufrufe`);
    assert.equal(result.updated, 25);
  } finally { globalThis.fetch = oldFetch; raw.close(); }
});

test("directory: entfernte Firmenstandorte werden geloescht, auch bei Konto- und Firmenloeschung", async () => {
  const { db, raw } = await database(), now = Math.floor(Date.now() / 1000);
  raw.exec(`INSERT INTO users(id,provider,sub,name,created) VALUES(1,'test','1','Owner',${now});
    INSERT INTO orgs(id,handle,name,public,created) VALUES(1,'example-co','Example Co',1,${now});
    INSERT INTO org_members(org_id,user_id,role,status,created) VALUES(1,1,'owner','active',${now})`);
  await saveOrgLocations({ DB: db }, 1, [
    { id: 0, label: "HQ", city: "Berlin", country: "Germany", address: "Private Street 4", public: 1 },
    { id: 0, label: "Branch", city: "Munich", country: "Germany", address: "Other Street 9", public: 1 },
  ]);
  const [hq, branch] = raw.prepare("SELECT id FROM org_locations WHERE org_id=1 ORDER BY id").all();
  await saveOrgLocations({ DB: db }, 1, [{ id: hq.id, label: "HQ", city: "Berlin", country: "Germany", address: "Private Street 4", public: 1 }]);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM org_locations WHERE id=?").get(branch.id).n, 0, "entfernter Standort samt Adresse geloescht");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM org_locations WHERE id=?").get(hq.id).n, 1);
  await saveOrgLocations({ DB: db }, 1, [{ id: 0, label: "Again", city: "Hamburg", country: "Germany", address: "Third Street 1", public: 1 }]);
  await deleteUserData(db, 1);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM orgs WHERE id=1").get().n, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM org_locations WHERE org_id=1").get().n, 0, "keine verwaisten Standorte mit Adresse");
  raw.close();
});

test("directory: alte stadtgenaue Punkte (vor der Stadt-Regel nur gerundete Strasse) werden einmalig verworfen und stadtgenau neu geocodiert", async () => {
  const { raw } = await database(), now = Math.floor(Date.now() / 1000), street = roundCoordinates(52.5711, 13.3088), centre = roundCoordinates(52.520008, 13.404954);
  // Stand vor diesem Deploy: Spalten vorhanden, keine Einmal-Markierung; Strassentreffer aus dem privaten Freitext nur gerundet, geo_at>0 (Cache-Treffer)
  raw.exec(`DELETE FROM meta;
    INSERT INTO users(id,provider,sub,name,created) VALUES(1,'test','1','Ada',${now});
    INSERT INTO profiles(user_id,public,handle,country,updated) VALUES(1,1,'ada','Germany',${now});
    INSERT INTO profile_private(user_id,city,map_public,lat,lng,geo_precision,geo_address,geo_at,geo_city) VALUES(1,'Private Street 4, 10115 Berlin',1,${street.lat},${street.lng},'city','Private Street 4, 10115 Berlin, Germany',${now - 3600},'Berlin');
    INSERT INTO orgs(id,handle,name,public,created) VALUES(1,'example-co','Example Co',1,${now});
    INSERT INTO org_locations(org_id,label,address,city,country,public,lat,lng,geo_precision,geo_address,geo_at) VALUES(1,'Berlin','','Berlin','Germany',1,${street.lat},${street.lng},'city','Berlin, Germany',${now - 3600})`);
  const oldFetch = globalThis.fetch; let calls = 0;
  globalThis.fetch = async (url) => {
    calls++;
    const isStreet = new URL(url).searchParams.get("address").startsWith("Private Street");
    return { json: async () => ({ status: "OK", results: [{ types: isStreet ? ["street_address"] : ["locality", "political"], geometry: { location: isStreet ? { lat: 52.5711, lng: 13.3088 } : { lat: 52.520008, lng: 13.404954 } },
      address_components: [{ long_name: "Berlin", types: ["locality", "political"] }, { long_name: "Germany", types: ["country", "political"] }] }] }) };
  };
  try {
    const env = { DB: wrap(raw), SITE: "https://www.m365.fm", GOOGLE_GEOCODING_KEY: "test-key" };   // neuer Isolate nach dem Deploy
    const listed = (await (await worker.fetch(new Request("https://api-dub.m365.fm/api/directory?limit=100"), env, { waitUntil() {} })).json()).items;
    assert.equal(listed.length, 2);
    for (const item of listed) assert.equal(item.lat, null, `${item.type}: alter Strassenpunkt wird sofort nicht mehr veroeffentlicht`);
    assert.equal(calls, 0, "die Liste selbst ruft Google nicht auf");
    await backfillDirectoryGeocodes(env);
    assert.equal(calls, 3, "Person: Freitext + Stadt, Firma: Stadt");
    const person = raw.prepare("SELECT lat,lng,geo_precision,geo_at,geo_city FROM profile_private WHERE user_id=1").get();
    assert.deepEqual({ lat: person.lat, lng: person.lng }, centre, "Stadtmitte statt Strassenraster");
    assert.equal(person.geo_precision, "city");
    assert.equal(person.geo_city, "Berlin");
    assert.ok(person.geo_at >= now);
    const location = raw.prepare("SELECT lat,lng,geo_precision,geo_at FROM org_locations WHERE org_id=1").get();
    assert.deepEqual({ lat: location.lat, lng: location.lng }, centre);
    assert.ok(location.geo_at >= now);
    await ensureDirectoryCols(wrap(raw));   // weiterer Isolate: nur einmal verwerfen
    await backfillDirectoryGeocodes({ ...env, DB: wrap(raw) });
    assert.equal(calls, 3, "neu geocodierte Punkte werden nicht erneut verworfen");
    assert.deepEqual({ lat: raw.prepare("SELECT lat FROM profile_private WHERE user_id=1").get().lat }, { lat: centre.lat });
  } finally { globalThis.fetch = oldFetch; raw.close(); }
});

const mcp = (env, body, token) => worker.fetch(new Request("https://api-dub.m365.fm/mcp", { method: "POST", headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, ...body }) }), env, { waitUntil() {} }).then((response) => response.json());
const toolResult = (reply) => JSON.parse(reply.result.content[0].text);

test("directory: MCP search_directory gibt keine facets aus und bleibt bei vielen Orten klein", async () => {
  const { db, raw } = await database(), now = Math.floor(Date.now() / 1000);
  const user = raw.prepare("INSERT INTO users(id,provider,sub,name,created) VALUES(?,?,?,?,?)");
  const profile = raw.prepare("INSERT INTO profiles(user_id,public,handle,country,updated) VALUES(?,1,?,?,?)");
  const privateProfile = raw.prepare("INSERT INTO profile_private(user_id,city,map_public,geo_city) VALUES(?,?,1,?)");
  raw.exec("BEGIN");
  for (let id = 1; id <= 300; id++) { user.run(id, "test", String(id), `Person ${id}`, now); profile.run(id, `person-${id}`, `Country ${id % 120}`, now - id); privateProfile.run(id, `City ${id}`, `City ${id}`); }
  raw.exec("COMMIT");
  const result = toolResult(await mcp({ DB: db, SITE: "https://www.m365.fm" }, { method: "tools/call", params: { name: "search_directory", arguments: { limit: 1 } } }));
  assert.equal(result.items.length, 1);
  assert.equal(result.total, 300);
  assert.equal(Object.hasOwn(result, "facets"), false, "facets nur fuer die Seite (facets=1), nicht im MCP-Kontext");
  assert.ok(JSON.stringify(result).length < 2000, `${JSON.stringify(result).length} Bytes`);
  raw.close();
});

test("directory: MCP save_org nennt Standort-ids und dass nicht gesendete Standorte geloescht werden", async () => {
  const { db, raw } = await database(), now = Math.floor(Date.now() / 1000), token = `m365_${"a".repeat(40)}`;
  raw.exec(`INSERT INTO meta(k,v) VALUES('entity_source','db');
    INSERT INTO users(id,provider,sub,name,created) VALUES(1,'test','1','Owner',${now});
    INSERT INTO orgs(id,handle,name,public,country,created) VALUES(1,'example-co','Example Co',1,'Germany',${now});
    INSERT INTO org_members(org_id,user_id,role,status,created) VALUES(1,1,'owner','active',${now});
    INSERT INTO org_locations(id,org_id,label,address,city,country,public) VALUES(1,1,'HQ','Private Street 4','Berlin','Germany',0),(2,1,'Branch','','Hamburg','Germany',1)`);
  raw.prepare("INSERT INTO api_tokens(hash,user_id,created) VALUES(?,1,?)").run(await sha256hex(token), now);
  const env = { DB: db, SITE: "https://www.m365.fm" };
  const tool = (await mcp(env, { method: "tools/list" })).result.tools.find((t) => t.name === "save_org");
  assert.ok(tool.inputSchema.properties.locations.items.properties.id, "id fuer bestehende Standorte im Schema");
  assert.match(tool.description, /list_my_orgs/);
  assert.match(tool.description, /not sent are deleted/i);
  // Wie ein Agent nach der Beschreibung: ids aus list_my_orgs lesen und einen Standort ergaenzen
  const existing = toolResult(await mcp(env, { method: "tools/call", params: { name: "list_my_orgs", arguments: {} } }, token)).orgs[0].org.locations;
  assert.deepEqual(existing.map((x) => x.id), [1, 2]);
  const keep = existing.map(({ id, label, address, city, country, public: visible }) => ({ id, label, address, city, country, public: !!visible }));
  const saved = toolResult(await mcp(env, { method: "tools/call", params: { name: "save_org", arguments: { handle: "example-co", name: "Example Co", locations: [...keep, { label: "München", city: "Munich", country: "Germany", public: true }] } } }, token));
  assert.equal(saved.ok, true, JSON.stringify(saved));
  const rows = raw.prepare("SELECT id,label,address,public FROM org_locations WHERE org_id=1 ORDER BY id").all().map((x) => ({ ...x }));
  assert.deepEqual(rows.map((x) => x.label), ["HQ", "Branch", "München"], "mitgesendete Standorte bleiben, der neue kommt dazu");
  assert.deepEqual(rows[0], { id: 1, label: "HQ", address: "Private Street 4", public: 0 }, "privater Standort bleibt privat und behaelt die Adresse");
  raw.close();
});
