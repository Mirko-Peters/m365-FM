// Creator-Videos (youtube.js), Befunde K35/K36: confirm bindet nur das Video der eigenen Upload-Sitzung (serverseitige upload_url + Tag
// m365fm-<nonce>), videos.delete trifft nie ein anderes Kanalvideo, abgebrochene Uploads raeumt der Cron bei YouTube auf, Kontoloeschung
// entfernt eigene private Uploads. YouTube ist ein Nachbau im Speicher (Sitzungen, Videos, Aufrufprotokoll).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import W from "../src/index.js";
import { makeSession } from "../src/util.js";
import { pollVideos } from "../src/youtube.js";

const API = "https://api-dub.m365.fm", SITE = "https://www.m365.fm", YT = "https://yt.test";
const ENTS = [{ id: "teams", type: "product", name: "Microsoft Teams" }];
const NOW = () => Math.floor(Date.now() / 1000);

// ---------- YouTube-Nachbau ----------
let yt;
function resetYt() { yt = { videos: new Map(), sessions: new Map(), calls: [], n: 0, status: null }; }
resetYt();
const vid = (n) => ("V" + String(n).padStart(10, "0")).slice(0, 11);
function addVideo(id, { title = "Kanalfolge", description = "Folge des Kanals", tags = [], privacy = "private", publishedAt = "2024-01-01T00:00:00Z" } = {}) {
  yt.videos.set(id, { id, snippet: { title, description, tags, publishedAt }, status: { privacyStatus: privacy } });
}
// Browser laedt die Datei in die Sitzung hoch (was assets/video.js per PUT tut): YouTube legt das Video mit den Metadaten der Sitzung an
function browserUpload(url) {
  const s = yt.sessions.get(url); s.done = true; s.id = vid(++yt.n + 500);
  addVideo(s.id, { ...s.meta.snippet, tags: s.meta.snippet.tags || [], privacy: s.meta.status.privacyStatus, publishedAt: new Date().toISOString() });
  return s.id;
}
const json = (o, status = 200, h = {}) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json", ...h } });
const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init = {}) => {
  const u = String(input?.url || input), method = (init.method || "GET").toUpperCase();
  if (u.startsWith(SITE + "/") && (u.endsWith("/entities.json") || u.endsWith("/entities-src.json"))) return json({ entities: ENTS });
  if (/^https:\/\/(www|api-dub)\.m365\.fm\//.test(u)) return new Response("{}", { status: 404 });
  if (!u.startsWith(YT)) return realFetch(input, init);
  const url = new URL(u), h = Object.fromEntries(Object.entries(init.headers || {}).map(([k, v]) => [k.toLowerCase(), v]));
  yt.calls.push({ method, path: url.pathname, q: url.search, auth: h.authorization || "", range: h["content-range"] || "" });
  if (url.pathname === "/token") return json({ access_token: "AT-test" });
  if (h.authorization !== "Bearer AT-test") return json({ error: "auth" }, 401);
  if (url.pathname === "/upload/youtube/v3/videos" && url.searchParams.get("upload_id")) {   // Sitzungs-URL
    const s = yt.sessions.get(u); if (!s || s.cancelled) return json({}, 404);
    if (method === "DELETE") { s.cancelled = true; return new Response("", { status: 499 }); }
    if (yt.status) return new Response("", { status: yt.status });
    return s.done ? json({ id: s.id, kind: "youtube#video" }) : new Response("", { status: 308 });
  }
  if (url.pathname === "/upload/youtube/v3/videos" && method === "POST") {
    const loc = `${YT}/upload/youtube/v3/videos?uploadType=resumable&upload_id=S${yt.sessions.size + 1}`;
    yt.sessions.set(loc, { meta: JSON.parse(init.body), size: +h["x-upload-content-length"] });
    return new Response("", { status: 200, headers: { location: loc } });
  }
  if (url.pathname === "/youtube/v3/videos" && method === "GET") return json({ items: (url.searchParams.get("id") || "").split(",").filter((x) => yt.videos.has(x)).map((x) => yt.videos.get(x)) });
  if (url.pathname === "/youtube/v3/videos" && method === "DELETE") { const id = url.searchParams.get("id"); return yt.videos.delete(id) ? new Response(null, { status: 204 }) : json({}, 404); }
  return json({ error: "unknown" }, 400);
};
const deletes = () => yt.calls.filter((c) => c.method === "DELETE" && c.path === "/youtube/v3/videos").map((c) => new URL(YT + c.path + c.q).searchParams.get("id"));
const sessionDeletes = () => yt.calls.filter((c) => c.method === "DELETE" && c.q.includes("upload_id"));

// ---------- Worker mit D1 (node:sqlite, alle Migrationen) ----------
async function mk(extra = {}) {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = {
    prepare(sql) { const st = raw.prepare(sql); let a = []; const o = { bind(...x) { a = x; return o; }, all: async () => ({ results: st.all(...a) }), first: async () => st.get(...a) ?? null, run: async () => { const r = st.run(...a); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; } }; return o; },
    batch: async (l) => { raw.exec("BEGIN"); try { const out = []; for (const s of l) out.push(await s.run()); raw.exec("COMMIT"); return out; } catch (e) { raw.exec("ROLLBACK"); throw e; } },
  };
  const env = { DB: db, SESSION_SECRET: "test-secret-0123456789", API, SITE, CRON_KEY: "cron-test", YT_API: YT, YT_TOKEN_URL: YT + "/token", YT_CLIENT_ID: "c", YT_CLIENT_SECRET: "s", YT_REFRESH_TOKEN: "r", ...extra };
  for (const [id, name, role] of [[1, "Admin", "admin"], [2, "Edi", "editor"], [4, "Angreifer", "user"], [6, "Mitglied", "user"]]) {
    raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(?,?,?,?,?,1)").run(id, "t", "s" + id, name, role);
    raw.prepare("INSERT INTO profiles(user_id,handle,public,updated) VALUES(?,?,1,1)").run(id, "user-" + id);
  }
  resetYt();
  return { raw, env };
}
async function call(env, uid, method, path, body) {
  const h = { "x-requested-with": "m365", origin: SITE, ...(uid ? { cookie: `m365s=${await makeSession(env, uid)}` } : {}), ...(body ? { "content-type": "application/json" } : {}) };
  const r = await W.fetch(new Request(API + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined }), env, { waitUntil() {} });
  return { s: r.status, j: await r.json().catch(() => null) };
}
const INIT = { title: "Mein Video ueber Teams", description: "Eine Beschreibung mit genug Zeichen fuer die Pruefung.", lang: "de", topics: ["teams"], rights: true, size: 1234, type: "video/mp4" };
const row = (raw, id) => ({ ...raw.prepare("SELECT id,status,video_id,upload_url,nonce,size FROM yt_videos WHERE id=?").get(id) });

// ---------- K35 ----------
test("K35: confirm bindet kein fremdes privates Kanalvideo; Loeschen, Ablauf und Ablehnung erreichen es nicht", async () => {
  const { raw, env } = await mk();
  const FOREIGN = "EPISODE0001"; addVideo(FOREIGN);   // frueher oeffentliche Folge, jetzt privat; ID oeffentlich bekannt
  const i = await call(env, 4, "POST", "/api/video/init", INIT);
  assert.equal(i.s, 200); assert.ok(!("nonce" in i.j));
  const r0 = row(raw, i.j.id);
  assert.equal(r0.status, "uploading"); assert.equal(r0.upload_url, i.j.upload_url); assert.equal(r0.size, 1234); assert.match(r0.nonce, /^[0-9a-f]{32}$/);
  assert.deepEqual(yt.sessions.get(i.j.upload_url).meta.snippet.tags, ["m365fm-" + r0.nonce]);   // Marker am Video der Sitzung
  // Sitzung nie benutzt, fremde ID gemeldet: die Sitzung ist offen (308) -> abgelehnt
  assert.equal((await call(env, 4, "POST", "/api/video/confirm", { id: i.j.id, video_id: FOREIGN })).j.error, "verify");
  // Sitzung kann die ID nicht nennen (Statusabfrage gestoert): fremdes Video ohne Marker der Zeile -> abgelehnt
  yt.status = 500;
  assert.equal((await call(env, 4, "POST", "/api/video/confirm", { id: i.j.id, video_id: FOREIGN })).j.error, "verify");
  yt.status = null;
  // Sitzung fertig hochgeladen, Browser meldet trotzdem die fremde ID -> abgelehnt (die Sitzung bestimmt die ID)
  const own = browserUpload(i.j.upload_url);
  assert.equal((await call(env, 4, "POST", "/api/video/confirm", { id: i.j.id, video_id: FOREIGN })).j.error, "verify");
  assert.deepEqual([row(raw, i.j.id).status, row(raw, i.j.id).video_id], ["uploading", ""]);
  // Loeschen der eigenen Zeile trifft nur die eigene Sitzung, nie das fremde Video
  assert.equal((await call(env, 4, "POST", "/api/video/delete", { id: i.j.id })).s, 200);
  assert.deepEqual(deletes(), [own]); assert.ok(yt.videos.has(FOREIGN));
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM yt_videos").get().n, 0);
});

test("K35: normaler Weg - Video der eigenen Sitzung wird gebunden (auch ohne ID vom Browser) und nur dieses geloescht", async () => {
  const { raw, env } = await mk();
  const i = await call(env, 6, "POST", "/api/video/init", INIT), own = browserUpload(i.j.upload_url);
  const c = await call(env, 6, "POST", "/api/video/confirm", { id: i.j.id });   // ID kommt aus der Sitzung
  assert.equal(c.s, 200);
  assert.deepEqual([row(raw, i.j.id).status, row(raw, i.j.id).video_id, row(raw, i.j.id).upload_url], ["submitted", own, ""]);
  assert.equal((await call(env, 6, "POST", "/api/video/confirm", { id: i.j.id, video_id: own })).j.error, "not_found");   // nur einmal
  // zweite Zeile mit derselben ID geht nicht (atomar im UPDATE)
  const j = await call(env, 1, "POST", "/api/video/init", INIT); browserUpload(j.j.upload_url);
  raw.prepare("UPDATE yt_videos SET nonce=? WHERE id=?").run(row(raw, i.j.id).nonce, j.j.id);
  raw.prepare("UPDATE yt_videos SET upload_url='' WHERE id=?").run(j.j.id);
  assert.equal((await call(env, 1, "POST", "/api/video/confirm", { id: j.j.id, video_id: own })).j.error, "duplicate");
  assert.equal((await call(env, 6, "POST", "/api/video/delete", { id: i.j.id })).s, 200);
  assert.deepEqual(deletes(), [own]);
});

test("K35: Altbestand mit unplausibler Bindung - Ablauf, Ablehnung und Mitglieds-Loeschen loeschen nichts, Abgleich meldet nur", async () => {
  const { raw, env } = await mk();
  const FOREIGN = "EPISODE0002", LEGIT = "COMMUNITY01", t = NOW();
  addVideo(FOREIGN, { publishedAt: "2024-01-01T00:00:00Z" });
  addVideo(LEGIT, { description: `Text\n\nCommunity video by Mitglied – ${SITE}/community/u/user-6/`, publishedAt: new Date((t - 40 * 86400 + 60) * 1000).toISOString() });
  const ins = (uid, video_id, created, status = "submitted") => Number(raw.prepare("INSERT INTO yt_videos(user_id,title,description,lang,topics,status,video_id,created,updated) VALUES(?,?,?,?,?,?,?,?,?)").run(uid, "Pitch", "Beschreibung", "de", "[]", status, video_id, created, created).lastInsertRowid);
  const bad = ins(4, FOREIGN, t - 40 * 86400), good = ins(6, LEGIT, t - 40 * 86400);
  const p = await pollVideos(env);
  assert.deepEqual(p.suspect, [bad]);
  assert.deepEqual(deletes(), [LEGIT], "Ablauf loescht nur das plausible Mitglieds-Upload");
  assert.ok(yt.videos.has(FOREIGN));
  assert.deepEqual([row(raw, bad).status, row(raw, good).status], ["expired", "expired"]);   // Zeilen bleiben, nichts geloescht
  // Ablehnung durch die Redaktion und Loeschen durch das Mitglied
  const bad2 = ins(4, FOREIGN, t - 3600);
  assert.equal((await call(env, 2, "POST", "/api/admin/video/reject", { id: bad2, note: "nein" })).s, 200);
  const bad3 = ins(4, FOREIGN, t - 3600);
  assert.equal((await call(env, 4, "POST", "/api/video/delete", { id: bad3 })).s, 200);
  assert.deepEqual(deletes(), [LEGIT]); assert.ok(yt.videos.has(FOREIGN));
  // fremdes Video wird oeffentlich: keine Zuschreibung an das Mitglied (kein published, kein Badge)
  const bad4 = ins(4, FOREIGN, t - 3600); yt.videos.get(FOREIGN).status.privacyStatus = "public";
  const p2 = await pollVideos(env);
  assert.deepEqual(p2.suspect, [bad4]);
  assert.equal(row(raw, bad4).status, "submitted");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM user_badges WHERE user_id=4 AND badge='videomaker'").get().n, 0);
});

test("K35: oeffentlich geschaltetes Mitglieds-Video loescht das Mitglied nicht ueber den Kanal-Token", async () => {
  const { raw, env } = await mk();
  const i = await call(env, 6, "POST", "/api/video/init", INIT), own = browserUpload(i.j.upload_url);
  assert.equal((await call(env, 6, "POST", "/api/video/confirm", { id: i.j.id })).s, 200);
  yt.videos.get(own).status.privacyStatus = "public";   // Redaktion hat freigegeben, der Abgleich lief noch nicht
  assert.equal((await call(env, 6, "POST", "/api/video/delete", { id: i.j.id })).j.error, "published");
  assert.deepEqual(deletes(), []); assert.equal(row(raw, i.j.id).status, "submitted");
});

test("K35: confirm hat ein Limit je Konto", async () => {
  const { env } = await mk();
  const i = await call(env, 4, "POST", "/api/video/init", INIT);
  for (let k = 0; k < 10; k++) assert.equal((await call(env, 4, "POST", "/api/video/confirm", { id: i.j.id, video_id: "EPISODE000" + k })).j.error, "verify");
  assert.equal((await call(env, 4, "POST", "/api/video/confirm", { id: i.j.id, video_id: "EPISODE0011" })).s, 429);
});

// ---------- K36 ----------
test("K36: abgebrochener Upload ohne confirm - Cron loescht das fertige Video bzw. bricht die offene Sitzung ab", async () => {
  const { raw, env } = await mk();
  const a = await call(env, 4, "POST", "/api/video/init", INIT), done = browserUpload(a.j.upload_url);   // hochgeladen, confirm absichtlich nie
  const b = await call(env, 6, "POST", "/api/video/init", INIT);   // Sitzung angelegt, Upload nie fertig
  const OTHER = "EPISODE0003"; addVideo(OTHER);
  assert.deepEqual(await pollVideos(env).then((r) => [r.cleaned, r.unresolved]), [0, 0], "juenger als 2 Tage: nichts");
  raw.prepare("UPDATE yt_videos SET created=?").run(NOW() - 2 * 86400 - 1);
  const p = await pollVideos(env);
  assert.equal(p.cleaned, 2);
  assert.deepEqual(deletes(), [done]); assert.ok(!yt.videos.has(done)); assert.ok(yt.videos.has(OTHER));
  assert.equal(sessionDeletes().length, 1); assert.ok(yt.sessions.get(b.j.upload_url).cancelled);
  assert.ok(yt.calls.filter((c) => c.q.includes("upload_id")).every((c) => c.auth === "Bearer AT-test"));
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM yt_videos").get().n, 0);
});

test("K36: Sitzung nicht abfragbar - Zeile bleibt fuer den naechsten Lauf, nach 9 Tagen als 'abandoned' (nicht geloescht, nicht in mine)", async () => {
  const { raw, env } = await mk();
  const a = await call(env, 4, "POST", "/api/video/init", INIT); browserUpload(a.j.upload_url);
  yt.status = 500; raw.prepare("UPDATE yt_videos SET created=?").run(NOW() - 3 * 86400);
  assert.deepEqual(await pollVideos(env).then((r) => [r.cleaned, r.unresolved]), [0, 0]);
  assert.equal(row(raw, a.j.id).status, "uploading");
  // Mitglied loescht per API/MCP: Zeile bleibt, bis der Cron die Sitzung bereinigt hat
  assert.deepEqual((await call(env, 4, "POST", "/api/video/delete", { id: a.j.id })).j, { ok: true, pending: true });
  assert.equal(row(raw, a.j.id).status, "uploading");
  raw.prepare("UPDATE yt_videos SET created=?").run(NOW() - 10 * 86400);
  assert.equal((await pollVideos(env)).unresolved, 1);
  assert.equal(row(raw, a.j.id).status, "abandoned");
  assert.deepEqual((await call(env, 4, "GET", "/api/video/mine")).j.items, []);
  assert.deepEqual(deletes(), []);
});

test("K36: Kontoloeschung entfernt eigene private Uploads bei YouTube (gebunden und abgebrochen), fremde Kanalvideos bleiben", async () => {
  const { raw, env } = await mk();
  const OTHER = "EPISODE0004"; addVideo(OTHER);
  const a = await call(env, 6, "POST", "/api/video/init", INIT), mine = browserUpload(a.j.upload_url);
  assert.equal((await call(env, 6, "POST", "/api/video/confirm", { id: a.j.id, video_id: mine })).s, 200);
  raw.prepare("UPDATE ratelimit SET n=0").run();
  const b = await call(env, 6, "POST", "/api/video/init", INIT), half = browserUpload(b.j.upload_url);   // ohne confirm
  raw.prepare("INSERT INTO yt_videos(user_id,title,description,lang,topics,status,video_id,created,updated) VALUES(6,'Alt','x','de','[]','submitted',?,1,1)").run(OTHER);   // unplausible Altbindung
  assert.equal((await call(env, 6, "DELETE", "/api/me")).s, 200);
  assert.deepEqual(deletes().sort(), [half, mine].sort());
  assert.ok(yt.videos.has(OTHER));
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM yt_videos WHERE user_id=6").get().n, 0);
});

test("K36: Tageslimit fuer neue Upload-Sitzungen ueber alle Mitglieder (Kontingent des Kanal-Projekts)", async () => {
  const { raw, env } = await mk({ YT_INIT_PER_DAY: "2" });
  assert.equal((await call(env, 4, "POST", "/api/video/init", INIT)).s, 200);
  assert.equal((await call(env, 6, "POST", "/api/video/init", INIT)).s, 200);
  raw.prepare("INSERT INTO users(id,provider,sub,name,role,created) VALUES(9,'t','s9','Neu','user',1)").run();
  raw.prepare("INSERT INTO profiles(user_id,handle,public,updated) VALUES(9,'user-9',1,1)").run();
  const n = yt.sessions.size, r = await call(env, 9, "POST", "/api/video/init", INIT);
  assert.equal(r.s, 429); assert.equal(yt.sessions.size, n, "keine Sitzung bei YouTube angelegt");
  assert.equal((await call(env, 1, "POST", "/api/video/init", INIT)).s, 200);   // Admin ausgenommen
});

test("Quelltext: kein Ausgabeweg nennt upload_url oder nonce", () => {
  const src = readFileSync(new URL("../src/youtube.js", import.meta.url), "utf-8");
  assert.ok(!/const PUB = "[^"]*(upload_url|nonce)/.test(src));
  assert.ok(!/J\(\{[^}]*(upload_url: v\.|nonce)/.test(src));
});
