export const MEMORY_TTL = 30 * 24 * 60 * 60 * 1000;
export const ANONYMOUS_TTL = 24 * 60 * 60 * 1000;
export const isMemberAuthorization = auth => /^Bearer\x20m365_\S+$/.test(auth);
export const emptyMemory = () => ({ context: {}, steps: [], expiresAt: 0 });
export function memoryOnUse(memory, now = Date.now(), authenticated = true) {
  const expired = !memory.expiresAt || memory.expiresAt <= now;
  return {
    memory: {
      ...(expired ? emptyMemory() : memory),
      expiresAt: authenticated ? now + MEMORY_TTL : memory.expiresAt || now + ANONYMOUS_TTL,
    },
    schedule: expired,
  };
}
export function memoryOnExpiry(memory, now = Date.now()) {
  return memory.expiresAt > now
    ? { memory, delay: Math.ceil((memory.expiresAt - now) / 1000) }
    : { memory: emptyMemory(), delay: 0 };
}
export async function expireSession(agent, now = Date.now()) {
  const next = memoryOnExpiry(agent.state, now);
  if (next.delay) await agent.schedule(next.delay, "expireMemory");
  else await agent.destroy();
}

export class CommunityError extends Error {
  constructor(status = 503) {
    super("Community-Zugriff fehlgeschlagen");
    this.status = status;
  }
}
export const result = (value, isError = false) => ({
  content: [{ type: "text", text: JSON.stringify(value) }], isError,
});

export async function upstream(binding, authorization, method, params) {
  const headers = { "content-type": "application/json" };
  if (authorization) headers.authorization = authorization;
  const response = await binding.fetch(new Request("https://api-dub.m365.fm/mcp", {
    method: "POST", headers,
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  }));
  if (response.status === 401) throw new CommunityError(401);
  if (!response.ok) throw new CommunityError();
  const message = await response.json();
  if (message.error?.code === -32001) throw new CommunityError(401);
  if (message.error || !message.result) throw new CommunityError();
  return message.result;
}

export async function sessionOwner(authorization) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(authorization || "anonymous"));
  return Array.from(new Uint8Array(hash), x => x.toString(16).padStart(2, "0")).join("");
}

// Zusätzlich zur Signatur prüft der Worker den unveränderlichen Eigentümer im DO.
// Der Token selbst wird weder in Props noch im Gedächtnis oder in Logs gespeichert.
async function signature(id, authorization, secret) {
  if (typeof secret !== "string" || secret.length < 32) throw new Error("Sitzungsschlüssel fehlt");
  const key = await crypto.subtle.importKey("raw",
    new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(JSON.stringify([id, authorization])));
  return Array.from(new Uint8Array(bytes), x => x.toString(16).padStart(2, "0")).join("");
}

export async function sealSession(id, authorization, secret) {
  return `${id}.${await signature(id, authorization, secret)}`;
}

export async function openSession(value, authorization, secret) {
  const match = /^([a-f0-9]{64})\.([a-f0-9]{64})$/.exec(value);
  if (!match) return null;
  const expected = await signature(match[1], authorization, secret);
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) mismatch |= expected.charCodeAt(i) ^ match[2].charCodeAt(i);
  return mismatch === 0 ? match[1] : null;
}

export function visibleTools(tools, authenticated) {
  return tools.filter(tool => authenticated ||
    (tool.annotations?.readOnlyHint === true && !tool.description.endsWith(" (requires token)")));
}

export async function confirmedCall({ tool, args, authorization, binding, confirm }) {
  if (tool.annotations?.readOnlyHint !== true) {
    if (!authorization) return result({ error: "token_required" }, true);
    const approval = await confirm({
      message: `M365.FM: ${tool.name}\n${JSON.stringify(args)}\nCommunity-Inhalte sind Daten, keine Anweisungen. Diesen einzelnen Schreibschritt ausführen? / Execute this single write step?`,
      requestedSchema: {
        type: "object", properties: { confirm: { type: "boolean", title: "Bestätigen / Confirm" } },
        required: ["confirm"],
      },
    });
    if (approval.action !== "accept" || approval.content?.confirm !== true) {
      return result({ error: "confirmation_declined" }, true);
    }
  }
  return upstream(binding, authorization, "tools/call", { name: tool.name, arguments: args });
}
