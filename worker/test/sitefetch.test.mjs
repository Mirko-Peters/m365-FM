import { test } from "node:test";
import assert from "node:assert/strict";
import { siteFetch } from "../src/util.js";

const SITE = "https://www.m365.fm";
function withFetch(fn, impl) {
  const old = globalThis.fetch; globalThis.fetch = impl;
  return fn().finally(() => { globalThis.fetch = old; });
}
const bucket = (store, gets = []) => ({ get: async (k) => { gets.push(k); return k in store ? { body: new Response(store[k]).body } : null; } });

test("siteFetch: Datei aus GitHub Pages, R2 wird nicht gefragt", () => withFetch(async () => {
  const gets = [];
  const r = await siteFetch({ SITE, PAGES: bucket({}, gets) }, "/episodes.json");
  assert.equal(r.status, 200); assert.equal(await r.text(), '{"site":1}'); assert.deepEqual(gets, []);
}, async () => new Response('{"site":1}', { status: 200 })));

test("siteFetch: 404 auf der Website -> gleiche Datei aus R2 (pages/<pfad>)", () => withFetch(async () => {
  const gets = [];
  const r = await siteFetch({ SITE, PAGES: bucket({ "pages/blog-import/index.json": '{"total":7,"per":50}' }, gets) }, "/blog-import/index.json", { cf: { cacheTtl: 60 } });
  assert.equal(r.status, 200); assert.deepEqual(await r.json(), { total: 7, per: 50 });
  assert.equal(r.headers.get("content-type"), "application/json; charset=utf-8");
  assert.deepEqual(gets, ["pages/blog-import/index.json"]);
}, async () => new Response("nf", { status: 404 })));

test("siteFetch: weder Website noch R2 -> 404 der Website bleibt", () => withFetch(async () => {
  const r = await siteFetch({ SITE, PAGES: bucket({}) }, "/translations-blog.json");
  assert.equal(r.status, 404);
}, async () => new Response("nf", { status: 404 })));

test("siteFetch: Serverfehler (5xx) holt nichts aus R2, ohne Bindung bleibt alles wie bisher", () => withFetch(async () => {
  const gets = [];
  const r = await siteFetch({ SITE, PAGES: bucket({ "pages/x.json": "{}" }, gets) }, "/x.json");
  assert.equal(r.status, 503); assert.deepEqual(gets, []);
  const r2 = await siteFetch({ SITE }, "/x.json"); assert.equal(r2.status, 503);
}, async () => new Response("down", { status: 503 })));

test("siteFetch: Netzfehler -> Rueckfall auf R2", () => withFetch(async () => {
  const r = await siteFetch({ SITE, PAGES: bucket({ "pages/translations-blog.json": '{"count":3}' }) }, "/translations-blog.json");
  assert.equal(r.status, 200); assert.equal((await r.json()).count, 3);
}, async () => { throw new TypeError("network"); }));
