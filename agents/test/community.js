// Lokale Gegenstelle: echte MCP-Definitionen, kontrollierte API-Antworten.
import { handleMcp, needsToken } from "../../worker/src/mcp.js";

let calls = [];
export default {
  async fetch(request) {
    const message = await request.json();
    const auth = request.headers.get("authorization") || "";
    const authenticated = /^Bearer\x20m365_/.test(auth);
    if (authenticated && !["m365_test-member-a", "m365_test-member-b"].includes(auth.slice(7).trim())) {
      return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32001, message: "invalid token" } }, { status: 401 });
    }
    if (["initialize", "tools/list"].includes(message.method) ||
        (message.method === "tools/call" && needsToken({ name: message.params.name }) && !authenticated)) {
      return handleMcp({}, new Request(request.url, {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(message),
      }), () => { throw new Error("Kein Nutzer erwartet"); }, () => { throw new Error("Kein Schreiben erwartet"); });
    }
    let result;
    if (message.method === "tools/call") {
      const { name, arguments: args } = message.params;
      if (name === "list_events") result = { content: [{ type: "text", text: JSON.stringify({ calls }) }] };
      else {
        calls.push({ name, args, member: auth.endsWith("test-member-a") ? "a" : "b" });
        result = { content: [{ type: "text", text: JSON.stringify({ ok: true, id: calls.length }) }] };
      }
    } else if (message.method === "test/reset") {
      calls = [];
      result = {};
    }
    return Response.json({ jsonrpc: "2.0", id: message.id, result });
  },
};
