// worker/setup-staging.mjs: Schutz vor Live-Namen und Eintragen der Staging-D1-ID nur im Staging-Block. Kein Aufruf von Cloudflare.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { guard, withStagingId, STAGING_DB, LIVE_DB } from "../setup-staging.mjs";

const TOML = readFileSync(new URL("../wrangler.toml", import.meta.url), "utf-8");

test("die echte wrangler.toml besteht den Staging-Schutz", () => {
  assert.deepEqual(guard(TOML), []);
  assert.equal(STAGING_DB, "m365-dub-staging"); assert.notEqual(STAGING_DB, LIVE_DB);
});

test("Live-Namen im Staging-Abschnitt werden gefunden", () => {
  const bad = (from, to) => { const i = TOML.lastIndexOf(from); assert.ok(i >= 0, from); return TOML.slice(0, i) + to + TOML.slice(i + from.length); };   // letzte Stelle = Staging-Block
  assert.ok(guard(bad('database_name = "m365-dub-staging"', 'database_name = "m365-dub"')).length);
  assert.ok(guard(bad('pattern = "api-staging.m365.fm"', 'pattern = "api-dub.m365.fm"')).length);
  assert.ok(guard(bad('API = "https://api-staging.m365.fm"', 'API = "https://api-dub.m365.fm"')).length);
  assert.ok(guard(bad('SITE = "https://staging.m365.fm"', 'SITE = "https://www.m365.fm"')).length);
  assert.ok(guard(bad('name = "m365-dub-community-staging"', 'name = "m365-dub-community"')).length);
  assert.ok(guard(TOML + '\n[env.staging.ai]\nbinding = "AI"\n').length);
  assert.ok(guard(TOML + '\n[[env.staging.vectorize]]\nbinding = "VEC"\nindex_name = "m365-search"\n').length);
  assert.ok(guard(TOML + '\n[env.staging.triggers]\ncrons = ["0 6 * * *"]\n').length);
  assert.ok(guard(TOML + '\n[[env.staging.send_email]]\nname = "EMAIL"\n').length);
  assert.ok(guard("name = 'x'\n").length, "ohne [env.staging] kein Deploy");
});

test("Kommentare mit Live-Namen im Staging-Abschnitt stoeren nicht", () => {
  assert.deepEqual(guard(TOML.replace("[env.staging.observability]", "# nicht api-dub.m365.fm, nicht m365-dub\n[env.staging.observability]")), []);
});

test("withStagingId aendert nur den Staging-Block", () => {
  const out = withStagingId(TOML, "11111111-2222-3333-4444-555555555555");
  assert.equal((out.match(/database_id = "11111111-2222-3333-4444-555555555555"/g) || []).length, 1);
  const i = out.indexOf("[[env.staging.d1_databases]]");
  assert.match(out.slice(i), /database_id = "11111111/);
  assert.equal(out.slice(0, i), TOML.slice(0, i), "Live-Teil unveraendert");
});

test("setup.mjs (Live) ersetzt weiter nur das erste database_id und AI_GATEWAY_ID, nie den Staging-Block", () => {
  const live = TOML.replace(/database_id = "[^"]*"/, 'database_id = "LIVE-ID"').replace(/AI_GATEWAY_ID = "[^"]*"/, 'AI_GATEWAY_ID = "gw"');
  const i = live.indexOf("[env.staging]");
  assert.equal(live.slice(i), TOML.slice(TOML.indexOf("[env.staging]")), "Staging-Abschnitt bleibt gleich");
  assert.ok(TOML.indexOf('database_id = "REPLACE_WITH_D1_ID"') < i, "Live-Eintrag steht vor dem Staging-Block");
});

test("der Staging-Abschnitt ist der letzte der Datei", () => {
  const i = TOML.indexOf("\n[env.staging]");
  const rest = TOML.slice(i + 1).split("\n").filter((l) => /^\[/.test(l));
  for (const h of rest) assert.match(h, /^\[\[?env\.staging/, "danach nur noch Staging-Abschnitte: " + h);
});
