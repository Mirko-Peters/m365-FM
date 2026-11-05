import { CommunityError, isMemberAuthorization, upstream, sessionOwner, openSession, sealSession } from "./session.js";

export const PATH = "/agent/mcp";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "Mcp-Session-Id",
};
const unavailable = () => new Response("Agent unavailable", { status: 503, headers: cors });

export function createGateway(handler, getAgentByName) {
  return {
    async fetch(request, env, ctx) {
      if (new URL(request.url).pathname !== PATH) return new Response("Not found", { status: 404 });
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
      const auth = request.headers.get("authorization") || "";
      if (request.headers.has("authorization") && !isMemberAuthorization(auth)) {
        return new Response("Unauthorized", { status: 401, headers: cors });
      }
      if (typeof env.SESSION_SIGNING_SECRET !== "string" || env.SESSION_SIGNING_SECRET.length < 32) return unavailable();
      try {
        // Auch Gedächtniszugriffe prüfen den Token erneut: Widerruf wirkt sofort.
        if (auth) await upstream(env.COMMUNITY, auth, "initialize", { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "community-agent", version: "1.0.0" } });
      } catch (error) {
        return error instanceof CommunityError && error.status === 401
          ? new Response("Unauthorized", { status: 401, headers: cors }) : unavailable();
      }
      try {
        const headers = new Headers(request.headers);
        const owner = await sessionOwner(auth);
        const session = headers.get("mcp-session-id");
        if (session) {
          const id = await openSession(session, auth, env.SESSION_SIGNING_SECRET);
          if (!id) return new Response("Unknown session", { status: 404, headers: cors });
          const agent = await getAgentByName(env.MCP_OBJECT, `streamable-http:${id}`);
          if (!await agent.ownsSession(owner)) return new Response("Unknown session", { status: 404, headers: cors });
          headers.set("mcp-session-id", id);
        }
        const response = await handler.fetch(new Request(request, { headers }), env, ctx);
        const output = new Headers(response.headers);
        for (const [key, value] of Object.entries(cors)) output.set(key, value);
        const id = output.get("mcp-session-id");
        if (id) {
          const agent = await getAgentByName(env.MCP_OBJECT, `streamable-http:${id}`);
          if (!await agent.bindSession(owner, !!auth)) return new Response("Unknown session", { status: 404, headers: cors });
          output.set("mcp-session-id", await sealSession(id, auth, env.SESSION_SIGNING_SECRET));
        }
        return new Response(response.body, { status: response.status, headers: output });
      } catch {
        return unavailable();
      }
    },
  };
}
