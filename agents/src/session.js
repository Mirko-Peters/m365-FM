export const MEMORY_TTL = 30 * 24 * 60 * 60 * 1000;
export const emptyMemory = () => ({ context: {}, steps: [], expiresAt: 0 });
export function memoryOnUse(memory, now = Date.now()) {
  const expired = !memory.expiresAt || memory.expiresAt <= now;
  return {
    memory: { ...(expired ? emptyMemory() : memory), expiresAt: now + MEMORY_TTL },
    schedule: expired,
  };
}
export function memoryOnExpiry(memory, now = Date.now()) {
  return memory.expiresAt > now
    ? { memory, delay: Math.ceil((memory.expiresAt - now) / 1000) }
    : { memory: emptyMemory(), delay: 0 };
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
  if (!response.ok) throw new Error("Community-Zugriff fehlgeschlagen");
  const message = await response.json();
  if (message.error || !message.result) throw new Error("Community-MCP fehlgeschlagen");
  return message.result;
}

export async function sessionOwner(authorization) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(authorization || "anonymous"));
  return Array.from(new Uint8Array(hash), x => x.toString(16).padStart(2, "0")).join("");
}

// Zusätzlich zur Signatur prüft der Worker den unveränderlichen Eigentümer im DO.
// Der Token selbst wird weder in Props noch im Gedächtnis oder in Logs gespeichert.
async function signature(id, authorization) {
  const key = await crypto.subtle.importKey("raw",
    new TextEncoder().encode(authorization || "anonymous"), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(id));
  return Array.from(new Uint8Array(bytes), x => x.toString(16).padStart(2, "0")).join("");
}

export async function sealSession(id, authorization) {
  return `${id}.${await signature(id, authorization)}`;
}

export async function openSession(value, authorization) {
  const match = /^([a-f0-9]{64})\.([a-f0-9]{64})$/.exec(value);
  if (!match) return null;
  const expected = await signature(match[1], authorization);
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
