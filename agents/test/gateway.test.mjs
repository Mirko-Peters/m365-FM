import { test } from "node:test";
import assert from "node:assert/strict";
import { createGateway } from "../src/gateway.js";
import { sealSession } from "../src/session.js";
import community from "./community.js";
import { handleMcp } from "../../worker/src/mcp.js";

const signingSecret = crypto.randomUUID() + crypto.randomUUID();
const auth = ["Bearer", "m365_test-member-a"].join(" ");
const env = { SESSION_SIGNING_SECRET: signingSecret, COMMUNITY: community };
const ok = { fetch: async () => Response.json({ ok: true }) };
const agent = { ownsSession: async () => true, bindSession: async () => true };
const lookup = async () => agent;
const request = (authorization = auth, session, body) => new Request("https://api-dub.m365.fm/agent/mcp", {
  method: "POST",
  headers: {
    ...(authorization === null ? {} : { authorization }),
    ...(session ? { "mcp-session-id": session } : {}),
    "content-type": "application/json",
  },
  body: JSON.stringify(body || { jsonrpc: "2.0", id: 1, method: "tools/list" }),
});
const assertStatus = (response, status) => {
  assert.equal(response.status, status);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), "*");
};

test("Fantasie- und kleingeschriebene Bearer-Header werden vor Werkzeugen und Kontext mit 401 abgewiesen", async () => {
  let reached = false;
  const gateway = createGateway({ fetch() { reached = true; throw new Error("Nicht erwartet"); } }, lookup);
  for (const header of [
    ["Bearer", "foo"].join(" "),
    ["bearer", "m365_test-member-a"].join(" "),
    ["Bearer", "m365_"].join(" "),
    ["Bearer", "", "m365_test-member-a"].join(" "),
    "",
  ]) {
    for (const body of [
      { jsonrpc: "2.0", id: 1, method: "tools/list" },
      { jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "context_set", arguments: { event: "42" } } },
    ]) {
      assertStatus(await gateway.fetch(request(header, undefined, body), env), 401);
    }
  }
  assert.equal(reached, false);
});

test("Test-Gegenstelle behandelt nicht erkannte Header wie handleMcp anonym statt als ungültige Tokens", async () => {
  for (const header of [["Bearer", "foo"].join(" "), ["bearer", "m365_test-member-a"].join(" ")]) {
    for (const message of [
      { jsonrpc: "2.0", id: 1, method: "initialize", params: {} },
      { jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "save_event", arguments: {} } },
    ]) {
      const req = request(header, undefined, message);
      const actual = await handleMcp({}, req.clone(), () => assert.fail("Kein Nutzer erwartet"), () => assert.fail("Kein Schreiben erwartet"));
      const mocked = await community.fetch(req);
      assert.equal(actual.status, 200);
      assert.equal(mocked.status, actual.status);
      if (message.method === "tools/call") {
        assert.deepEqual((await mocked.json()).result, (await actual.json()).result);
      }
    }
  }
});

test("Nur HTTP 401 und JSON-RPC -32001 sind Authentifizierungsfehler", async () => {
  const gateway = createGateway(ok, lookup);
  for (const [status, message, expected] of [
    [401, { error: "invalid_token" }, 401],
    [200, { error: { code: -32001 } }, 401],
    [403, { error: "forbidden" }, 503],
    [500, { error: "server" }, 503],
    [503, { error: "unavailable" }, 503],
    [200, { error: { code: -32603 } }, 503],
    [200, {}, 503],
  ]) {
    const binding = { fetch: async () => Response.json(message, { status }) };
    assertStatus(await gateway.fetch(request(), { ...env, COMMUNITY: binding }), expected);
  }
  for (const binding of [
    { fetch: async () => new Response("Ungültiges JSON") },
    { fetch: async () => { throw new Error("Community nicht erreichbar"); } },
  ]) {
    assertStatus(await gateway.fetch(request(), { ...env, COMMUNITY: binding }), 503);
  }
  assertStatus(await gateway.fetch(request(), env), 200);
  assertStatus(await gateway.fetch(request(["Bearer", "m365_revoked"].join(" ")), env), 401);
});

test("DO-Lookup, Eigentümerprüfung und Sitzungserstellung liefern bei Ausfall 503 mit CORS", async () => {
  const session = await sealSession("a".repeat(64), auth, signingSecret);
  const fail = async () => { throw new Error("DO nicht erreichbar"); };
  for (const getAgent of [fail, async () => ({ ...agent, ownsSession: fail })]) {
    assertStatus(await createGateway(ok, getAgent).fetch(request(auth, session), env), 503);
  }
  assertStatus(await createGateway(ok, async () => ({ ...agent, ownsSession: async () => false })).fetch(request(auth, session), env), 404);
  assertStatus(await createGateway({ fetch: fail }, lookup).fetch(request(), env), 503);
  const initialized = { fetch: async () => new Response(null, { headers: { "mcp-session-id": "a".repeat(64) } }) };
  assertStatus(await createGateway(initialized, async () => ({ ...agent, bindSession: fail })).fetch(request(), env), 503);
});

test("Ohne ausreichend langes Worker-Secret werden auch anonyme Anfragen nicht bedient", async () => {
  const gateway = createGateway(ok, lookup);
  for (const secret of [undefined, "", "zu-kurz"]) {
    for (const authorization of [auth, null]) {
      assertStatus(await gateway.fetch(request(authorization), { ...env, SESSION_SIGNING_SECRET: secret }), 503);
    }
  }
});
