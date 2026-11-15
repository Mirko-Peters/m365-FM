import { test } from "node:test";
import assert from "node:assert/strict";
import { handleMail } from "../src/mail.js";

function testDb(address) {
  return {
    prepare(sql) {
      let params = [];
      const stmt = {
        bind(...values) { params = values; return stmt; },
        async first() {
          if (sql.includes("FROM mail_addr WHERE user_id=? AND verified=1")) return params[0] === 7 ? address : null;
          if (sql.includes("FROM ratelimit WHERE k=?")) return null;
          return null;
        },
        async run() { return { meta: { changes: 1 } }; },
      };
      return stmt;
    },
    async batch() {},
  };
}

async function call(env, user) {
  const request = new Request("https://api-dub.m365.fm/api/admin/mail/test", { method: "POST" });
  const url = new URL(request.url);
  return handleMail(env, request, url, url.pathname, user, (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } }),
  );
}

test("admin mail test sends only to the admin's verified notification address", async () => {
  let sent;
  const env = {
    DB: testDb({ email: "admin@example.com" }),
    EMAIL: { send: async (message) => { sent = message; return { messageId: "test-message" }; } },
    MAIL_FROM: "M365.FM <system@m365.fm>",
  };
  const response = await call(env, { id: 7, admin: true });
  assert.equal(response.status, 200);
  assert.deepEqual(JSON.parse(await response.text()), { ok: true, status: 200 });
  assert.equal(sent.to, "admin@example.com");
  assert.match(sent.subject, /Admin-Testmail/);
});

test("admin mail test rejects non-admins and admins without a verified address", async () => {
  let sends = 0;
  const env = { DB: testDb(null), EMAIL: { send: async () => { sends++; return { messageId: "test-message" }; } } };
  const unauthenticated = await call(env, null);
  assert.equal(unauthenticated.status, 401);
  const forbidden = await call(env, { id: 7, admin: false });
  assert.equal(forbidden.status, 403);
  const missingAddress = await call(env, { id: 7, admin: true });
  assert.equal(missingAddress.status, 409);
  assert.deepEqual(JSON.parse(await missingAddress.text()), { error: "email_unverified" });
  assert.equal(sends, 0);
});
