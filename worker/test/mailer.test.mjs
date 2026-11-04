import { test } from "node:test";
import assert from "node:assert/strict";
import { mailReady, sendMail } from "../src/mailer.js";

const message = {
  to: "member@example.com",
  subject: "Test",
  html: "<p>Hello</p>",
  text: "Hello",
  headers: { "List-Unsubscribe": "<https://www.m365.fm/unsubscribe>", "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
};

test("mailer uses Cloudflare binding and logs no recipient address", async () => {
  const oldFetch = globalThis.fetch, oldLog = console.log;
  const logs = [];
  let payload, fetched = false;
  globalThis.fetch = async () => { fetched = true; };
  console.log = (...args) => logs.push(args.join(" "));
  try {
    const env = { MAIL_FROM: "M365.FM <system@m365.fm>", EMAIL: { send: async (value) => { payload = value; return { messageId: "cf-message-1" }; } }, RESEND_API_KEY: "fallback-key" };
    assert.equal(mailReady(env), true);
    const result = await sendMail(env, message);
    assert.deepEqual(result, { ok: true, status: 200, messageId: "cf-message-1" });
    assert.deepEqual(payload, { ...message, from: { email: "system@m365.fm", name: "M365.FM" } });
    assert.equal(fetched, false, "Cloudflare binding has priority over Resend");
    assert.ok(logs.some((line) => line.includes("cf-message-1")));
    assert.ok(logs.every((line) => !line.includes(message.to)));
  } finally {
    globalThis.fetch = oldFetch;
    console.log = oldLog;
  }
});

test("mailer falls back to Resend when the binding is absent", async () => {
  const oldFetch = globalThis.fetch, oldLog = console.log;
  const logs = [];
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, options };
    return new Response(JSON.stringify({ id: "resend-message-1" }), { status: 202 });
  };
  console.log = (...args) => logs.push(args.join(" "));
  try {
    const env = { MAIL_FROM: "M365.FM <system@m365.fm>", RESEND_API_KEY: "fallback-key" };
    assert.equal(mailReady(env), true);
    const result = await sendMail(env, message);
    assert.deepEqual(result, { ok: true, status: 202, messageId: "resend-message-1" });
    assert.equal(request.url, "https://api.resend.com/emails");
    assert.deepEqual(JSON.parse(request.options.body), { ...message, from: env.MAIL_FROM });
    assert.ok(logs.some((line) => line.includes("resend-message-1")));
    assert.ok(logs.every((line) => !line.includes(message.to)));
  } finally {
    globalThis.fetch = oldFetch;
    console.log = oldLog;
  }
});

test("mailer stays off without either provider", async () => {
  const oldFetch = globalThis.fetch;
  let fetched = false;
  globalThis.fetch = async () => { fetched = true; };
  try {
    assert.equal(mailReady({}), false);
    assert.deepEqual(await sendMail({}, message), { ok: false, status: 0 });
    assert.equal(fetched, false);
  } finally {
    globalThis.fetch = oldFetch;
  }
});

test("mailer returns binding failures with status and logs no recipient address", async () => {
  const oldLog = console.error;
  const logs = [];
  console.error = (...args) => logs.push(args.join(" "));
  try {
    const env = { EMAIL: { send: async () => { const error = new Error(message.to); error.code = "E_RATE_LIMIT_EXCEEDED"; error.status = 429; throw error; } } };
    assert.deepEqual(await sendMail(env, message), { ok: false, status: 429 });
    assert.ok(logs.every((line) => !line.includes(message.to)));
  } finally {
    console.error = oldLog;
  }
});
