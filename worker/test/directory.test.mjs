import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { backfillDirectoryGeocodes, directoryItems, ensureDirectoryCols, geocodeAddress, handleDirectory, roundCoordinates } from "../src/directory.js";
import { saveOrgLocations } from "../src/profiles.js";

async function database() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(file, dir), "utf8"));
  const db = { prepare(sql) {
    const statement = raw.prepare(sql); let args = [];
    const out = {
      bind(...values) { args = values; return out; },
      all: async () => ({ results: statement.all(...args) }),
      first: async () => statement.get(...args) ?? null,
      run: async () => { const result = statement.run(...args); return { meta: { changes: Number(result.changes), last_row_id: Number(result.lastInsertRowid) } }; },
    };
    return out;
  } };
  await ensureDirectoryCols(db);
  return { db, raw };
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
