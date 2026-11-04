import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { ElicitRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { openSession, sealSession, MEMORY_TTL } from "../src/session.js";

let process, url, directory;
const clients = [];
const text = result => JSON.parse(result.content[0].text);
const authorization = token => ["Bearer", token].join(" ");

before(async () => {
  const listener = createServer();
  await new Promise(resolve => listener.listen(0, "127.0.0.1", resolve));
  const port = listener.address().port;
  await new Promise(resolve => listener.close(resolve));
  url = new URL(`http://127.0.0.1:${port}/agent/mcp`);
  directory = await mkdtemp(`${tmpdir()}/m365-agent-test-`);
  process = spawn(globalThis.process.execPath, [
    "node_modules/wrangler/bin/wrangler.js", "dev", "--local",
    "--config", "wrangler.toml", "--config", "test/community.wrangler.toml",
    "--ip", "127.0.0.1", "--port", String(port), "--inspector-port", "0",
    "--persist-to", directory, "--log-level", "error",
  ], {
    cwd: fileURLToPath(new URL("../", import.meta.url)),
    env: { ...globalThis.process.env, WRANGLER_SEND_METRICS: "false" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  process.stdout.on("data", data => { output += data; });
  process.stderr.on("data", data => { output += data; });
  for (let attempt = 0; attempt < 120; attempt++) {
    try {
      if ((await fetch(url, { method: "OPTIONS" })).status === 204) return;
    } catch {}
    if (process.exitCode !== null) throw new Error(output);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error(`Workers-Runtime nicht bereit: ${output}`);
}, { timeout: 90000 });

after(async () => {
  for (const client of clients) await client.close();
  if (process && process.exitCode === null) {
    const closed = new Promise(resolve => process.once("exit", resolve));
    process.kill("SIGTERM");
    await closed;
  }
  if (directory) await rm(directory, { recursive: true, force: true });
});

async function connect(token = "", approval) {
  const client = new Client({ name: "test", version: "1" }, {
    capabilities: approval ? { elicitation: { form: {} } } : {},
  });
  if (approval) client.setRequestHandler(ElicitRequestSchema, approval);
  const transport = new StreamableHTTPClientTransport(url, {
    requestInit: { headers: token ? { Authorization: authorization(token) } : {} },
  });
  clients.push(client);
  await client.connect(transport);
  return { client, transport };
}

test("Sitzungsausweise sind tokengebunden und nicht manipulierbar", async () => {
  const id = "a".repeat(64);
  const signed = await sealSession(id, "member-a");
  assert.equal(await openSession(signed, "member-a"), id);
  assert.equal(await openSession(signed, "member-b"), null);
  assert.equal(await openSession(signed, ""), null);
  assert.equal(await openSession(`${signed.slice(0, -1)}x`, "member-a"), null);
  assert.equal(MEMORY_TTL, 30 * 24 * 60 * 60 * 1000);
});

test("Öffentliche Werkzeuge, keine Schreibwerkzeuge ohne Token", async () => {
  const { client } = await connect();
  const { tools } = await client.listTools();
  assert.ok(tools.some(t => t.name === "list_events"));
  assert.ok(tools.some(t => t.name === "context_get"));
  assert.ok(tools.every(t => t.annotations.readOnlyHint === true));
  assert.ok(!tools.some(t => t.name === "get_my_profile"));
  assert.equal((await client.callTool({ name: "save_event", arguments: {} })).isError, true);
  assert.equal((await client.callTool({ name: "context_set", arguments: { event: "42" } })).isError, true);
});

test("Gedächtnis über Requests erhalten, je Sitzung und Mitglied getrennt, selbst leerbar", async () => {
  const a = await connect("test-member-a");
  const sameMember = await connect("test-member-a");
  const b = await connect("test-member-b");
  await a.client.callTool({ name: "context_set", arguments: { event: "42", company: "7", profile: "me", steps: ["Session anlegen"] } });
  assert.deepEqual(text(await a.client.callTool({ name: "context_get" })), { event: "42", company: "7", profile: "me" });
  assert.deepEqual(text(await sameMember.client.callTool({ name: "context_get" })), {});
  assert.deepEqual(text(await b.client.callTool({ name: "context_get" })), {});
  assert.deepEqual(text(await a.client.callTool({ name: "plan_show" })).steps, ["Session anlegen"]);
  const stolen = await fetch(url, {
    method: "POST",
    headers: { Authorization: authorization("test-member-b"), "mcp-session-id": a.transport.sessionId, "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "context_get" } }),
  });
  assert.equal(stolen.status, 404);
  const rawId = await openSession(a.transport.sessionId, authorization("test-member-a"));
  const forged = await sealSession(rawId, authorization("test-member-b"));
  for (const method of ["POST", "GET", "DELETE"]) {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: authorization("test-member-b"), "mcp-session-id": forged,
        "content-type": "application/json", Accept: "application/json, text/event-stream",
      },
      ...(method === "POST" ? { body: JSON.stringify({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "context_get" } }) } : {}),
    });
    assert.equal(response.status, 404);
  }
  assert.equal(text(await a.client.callTool({ name: "context_get" })).event, "42");
  const revoked = await fetch(url, { headers: { Authorization: authorization("revoked"), "mcp-session-id": a.transport.sessionId } });
  assert.equal(revoked.status, 401);
  await a.client.callTool({ name: "context_clear" });
  assert.deepEqual(text(await a.client.callTool({ name: "context_get" })), {});
  assert.deepEqual(text(await a.client.callTool({ name: "plan_show" })).steps, []);
});

test("Gleichzeitige erste Kontextzugriffe überschreiben keine anderen Felder", async () => {
  const { client } = await connect("test-member-a");
  await Promise.all([
    client.callTool({ name: "context_set", arguments: { event: "42" } }),
    client.callTool({ name: "context_set", arguments: { company: "7" } }),
  ]);
  assert.deepEqual(text(await client.callTool({ name: "context_get" })), { event: "42", company: "7" });
});

test("Event und zwei Sessions: jeder Schreibschritt fragt, Token und Argumente kommen an", async () => {
  const prompts = [];
  const { client } = await connect("test-member-a", async request => {
    prompts.push(request.params);
    return { action: "accept", content: { confirm: true } };
  });
  const event = text(await client.callTool({ name: "save_event", arguments: { title: "Testevent" } }));
  assert.equal(event.ok, true, JSON.stringify({ event, prompts }));
  for (const title of ["Session eins", "Session zwei"]) {
    assert.ok(text(await client.callTool({ name: "save_event_session", arguments: { event_id: event.id, title } })).ok);
  }
  assert.equal(prompts.length, 3);
  assert.ok(prompts[0].message.includes("Testevent"));
  assert.ok(prompts[1].message.includes("Session eins"));
  const { calls } = text(await client.callTool({ name: "list_events" }));
  assert.deepEqual(calls.map(c => c.name), ["save_event", "save_event_session", "save_event_session"]);
  assert.ok(calls.every(c => c.member === "a"));
  assert.equal(calls[1].args.event_id, event.id);
});

test("Ablehnung, fehlende Bestätigung und fehlende Client-Unterstützung verhindern Schreiben", async () => {
  for (const approval of [
    async () => ({ action: "decline" }),
    async () => ({ action: "accept", content: { confirm: false } }),
    undefined,
  ]) {
    const { client } = await connect("test-member-a", approval);
    const before = text(await client.callTool({ name: "list_events" })).calls.length;
    assert.equal((await client.callTool({ name: "save_event", arguments: { title: "Nicht speichern" } })).isError, true);
    assert.equal(text(await client.callTool({ name: "list_events" })).calls.length, before);
  }
});

test("Ungültiges Gedächtnis und andere Routen werden abgewiesen", async () => {
  const { client } = await connect("test-member-a");
  for (const args of [{ unexpected: "x" }, { event: 42 }, { steps: [false] }, { event: "x".repeat(501) }]) {
    assert.equal((await client.callTool({ name: "context_set", arguments: args })).isError, true);
  }
  assert.equal((await fetch(new URL("/mcp", url))).status, 404);
});
