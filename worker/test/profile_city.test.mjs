import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { ensureDirectoryCols } from "../src/directory.js";
import worker from "../src/index.js";
import { sha256hex } from "../src/util.js";

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
  }, async batch(statements) { for (const statement of statements) await statement.run(); } };
  await ensureDirectoryCols(db);
  return { db, raw };
}

const mcp = (env, body, token) => worker.fetch(new Request("https://api-dub.m365.fm/mcp", { method: "POST", headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, ...body }) }), env, { waitUntil() {} }).then((response) => response.json());
const toolResult = (reply) => JSON.parse(reply.result.content[0].text);

test("profile: MCP setzt die Stadt mit Sichtbarkeit und meldet sie in get_my_profile", async () => {
  const { db, raw } = await database(), now = Math.floor(Date.now() / 1000), token = `m365_${"c".repeat(40)}`;
  raw.exec(`INSERT INTO users(id,provider,sub,name,created) VALUES(1,'test','1','Mirko Example',${now});
    INSERT INTO profiles(user_id,public,handle,country,updated) VALUES(1,1,'mirko-example','Germany',${now});
    INSERT INTO profile_private(user_id,city,zip,vis_zip,map_public,lat,lng,geo_precision,geo_at,geo_city) VALUES(1,'Berlin','10115','all',1,52.52,13.4,'city',${now},'Berlin');`);
  raw.prepare("INSERT INTO api_tokens(hash,user_id,created) VALUES(?,1,?)").run(await sha256hex(token), now);
  const env = { DB: db, SITE: "https://www.m365.fm" };
  const tool = (await mcp(env, { method: "tools/list" })).result.tools.find((t) => t.name === "update_my_profile");
  assert.deepEqual(tool.inputSchema.properties.city_visibility.enum, ["all", "contacts", "none"]);
  const bad = toolResult(await mcp(env, { method: "tools/call", params: { name: "update_my_profile", arguments: { city_visibility: "public" } } }, token));
  assert.equal(bad.error, "bad_city_visibility");
  const saved = toolResult(await mcp(env, { method: "tools/call", params: { name: "update_my_profile", arguments: { city: "Stuttgart", city_visibility: "all" } } }, token));
  assert.equal(saved.ok, true, JSON.stringify(saved));
  const row = raw.prepare("SELECT city,vis_city,zip,vis_zip,map_public,lat,geo_at,geo_city FROM profile_private WHERE user_id=1").get();
  assert.deepEqual({ ...row }, { city: "Stuttgart", vis_city: "all", zip: "10115", vis_zip: "all", map_public: 1, lat: null, geo_at: 0, geo_city: "" }, "andere Felder bleiben, Kartenpunkt wird neu berechnet");
  const me = toolResult(await mcp(env, { method: "tools/call", params: { name: "get_my_profile", arguments: {} } }, token));
  assert.equal(me.profile.city, "Stuttgart");
  assert.equal(me.profile.city_visibility, "all");
  toolResult(await mcp(env, { method: "tools/call", params: { name: "update_my_profile", arguments: { city_visibility: "none" } } }, token));
  assert.deepEqual({ ...raw.prepare("SELECT city,vis_city FROM profile_private WHERE user_id=1").get() }, { city: "Stuttgart", vis_city: "none" }, "nur die Sichtbarkeit aendert sich");
  raw.close();
});

test("profile: MCP legt die privaten Kontaktdaten mit Stadt neu an (standardmaessig privat)", async () => {
  const { db, raw } = await database(), now = Math.floor(Date.now() / 1000), token = `m365_${"d".repeat(40)}`;
  raw.exec(`INSERT INTO users(id,provider,sub,name,created) VALUES(2,'test','2','Ada Example',${now});
    INSERT INTO profiles(user_id,public,handle,updated) VALUES(2,1,'ada-example',${now});`);
  raw.prepare("INSERT INTO api_tokens(hash,user_id,created) VALUES(?,2,?)").run(await sha256hex(token), now);
  const env = { DB: db, SITE: "https://www.m365.fm" };
  const saved = toolResult(await mcp(env, { method: "tools/call", params: { name: "update_my_profile", arguments: { city: "  München  " } } }, token));
  assert.equal(saved.ok, true, JSON.stringify(saved));
  assert.deepEqual({ ...raw.prepare("SELECT city,vis_city FROM profile_private WHERE user_id=2").get() }, { city: "München", vis_city: "none" });
  raw.close();
});
