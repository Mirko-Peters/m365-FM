import { test } from "node:test";
import assert from "node:assert/strict";
import { siteFetch } from "../src/util.js";

const SITE = "https://www.m365.fm";
function withFetch(fn, impl) {
  const old = globalThis.fetch; globalThis.fetch = impl;
  return fn().finally(() => { globalThis.fetch = old; });
}
const bucket = (store, gets = [], meta = {}) => ({ get: async (k) => { gets.push(k); return k in store ? { body: new Response(store[k]).body, customMetadata: meta[k] } : null; } });

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

test("siteFetch: Register aus R2 (seit 16.11.2026 nicht mehr in GitHub Pages)", () => withFetch(async () => {
  const B = bucket({ "pages/episodes-register.json": '{"parts":5}', "pages/episodes-register-3.json": '{"part":3}', "pages/translations-register-ja.json": '{"lang":"ja"}' });
  assert.equal((await (await siteFetch({ SITE, PAGES: B }, "/episodes-register.json")).json()).parts, 5);
  assert.equal((await (await siteFetch({ SITE, PAGES: B }, "/episodes-register-3.json")).json()).part, 3);
  assert.equal((await (await siteFetch({ SITE, PAGES: B }, "/translations-register-ja.json")).json()).lang, "ja");
}, async () => new Response("nf", { status: 404 })));

test("siteFetch: als entfernt markiert (gone=1) oder nach 404 nur Spiegel von GitHub Pages (src=docs) -> 404 bleibt", () => withFetch(async () => {
  const B = bucket({ "pages/a.json": "{}", "pages/b.json": "{}", "pages/c.json": '{"ok":1}' }, [], { "pages/a.json": { gone: "1" }, "pages/b.json": { src: "docs" }, "pages/c.json": {} });
  assert.equal((await siteFetch({ SITE, PAGES: B }, "/a.json")).status, 404);
  assert.equal((await siteFetch({ SITE, PAGES: B }, "/b.json")).status, 404);
  assert.equal((await (await siteFetch({ SITE, PAGES: B }, "/c.json")).json()).ok, 1);
}, async () => new Response("nf", { status: 404 })));

test("siteFetch: Netzfehler -> Spiegel (src=docs) gilt, entfernt markierte nie", () => withFetch(async () => {
  const B = bucket({ "pages/b.json": '{"m":1}', "pages/a.json": "{}" }, [], { "pages/b.json": { src: "docs" }, "pages/a.json": { gone: "1", src: "docs" } });
  const r = await siteFetch({ SITE, PAGES: B }, "/b.json"); assert.equal(r.status, 200); assert.equal((await r.json()).m, 1);
  assert.equal((await siteFetch({ SITE, PAGES: B }, "/a.json")).status, 502);
}, async () => { throw new TypeError("network"); }));

test("siteFetch: Register und Blog-Import nach 404 auch als Spiegel (src=docs, Wettlauf beim Umzug), nie als entfernt markiert", () => withFetch(async () => {
  const B = bucket({ "pages/episodes-register-3.json": '{"part":3}', "pages/translations-register-ja.json": '{"lang":"ja"}', "pages/blog-import/part-2.json": "[2]",
    "pages/translations-blog.json": '{"count":3}', "pages/episodes-register-4.json": "{}", "pages/entities.json": "{}" }, [],
  { "pages/episodes-register-3.json": { src: "docs" }, "pages/translations-register-ja.json": { src: "docs" }, "pages/blog-import/part-2.json": { src: "docs" },
    "pages/translations-blog.json": { src: "docs" }, "pages/episodes-register-4.json": { src: "docs", gone: "1" }, "pages/entities.json": { src: "docs" } });
  assert.equal((await (await siteFetch({ SITE, PAGES: B }, "/episodes-register-3.json")).json()).part, 3);
  assert.equal((await (await siteFetch({ SITE, PAGES: B }, "/translations-register-ja.json")).json()).lang, "ja");
  assert.deepEqual(await (await siteFetch({ SITE, PAGES: B }, "/blog-import/part-2.json")).json(), [2]);
  assert.equal((await (await siteFetch({ SITE, PAGES: B }, "/translations-blog.json")).json()).count, 3);
  assert.equal((await siteFetch({ SITE, PAGES: B }, "/episodes-register-4.json")).status, 404, "gone=1 gilt immer");
  assert.equal((await siteFetch({ SITE, PAGES: B }, "/entities.json")).status, 404, "andere Dateien: Spiegel nach 404 wie bisher nicht");
}, async () => new Response("nf", { status: 404 })));
