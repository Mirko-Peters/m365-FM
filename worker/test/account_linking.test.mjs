// #279: Mehrere Anmeldungen je Profil (user_identities), Verknuepfen, Entfernen und Zusammenfuehren doppelter Konten.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import W from "../src/index.js";
import { sign } from "../src/util.js";

async function d1() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = {
    prepare(sql) {
      const st = raw.prepare(sql); let args = [];
      const o = {
        bind(...a) { args = a; return o; },
        all: async () => ({ results: st.all(...args) }),
        first: async () => st.get(...args) ?? null,
        run: async () => { const r = st.run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; },
      };
      return o;
    },
    batch: async (list) => { raw.exec("BEGIN"); try { const out = []; for (const s of list) out.push(await s.run()); raw.exec("COMMIT"); return out; } catch (e) { raw.exec("ROLLBACK"); throw e; } },
    exec: async (sql) => raw.exec(sql),
  };
  return { db, raw };
}

const API = "https://api-dub.m365.fm", SITE = "https://www.m365.fm", RET = SITE + "/de/community/#c-page";
const ENV = {
  SESSION_SECRET: "test-secret-0123456789", API, SITE,
  GOOGLE_CLIENT_ID: "g", GOOGLE_CLIENT_SECRET: "gs", MS_CLIENT_ID: "m", MS_CLIENT_SECRET: "ms",
  LINKEDIN_CLIENT_ID: "l", LINKEDIN_CLIENT_SECRET: "ls", GH_OAUTH_CLIENT_ID: "h", GH_OAUTH_CLIENT_SECRET: "hs",
};
// Anbieter-Attrappe: der Code ist zugleich Zugriffstoken; aus ihm folgt die Kennung (sub) und der Name
const PROFILE = {
  "gh-anna": { id: 1001, login: "anna", name: "Anna Example" }, "go-anna": { sub: "g-anna", name: "Anna Example" },
  "li-anna": { sub: "l-anna", name: "Anna Example" }, "ms-anna": { sub: "m-anna", name: "Anna Example" },
};
const mockFetch = async (url, init = {}) => {
  const u = String(url);
  if (/oauth2\.googleapis\.com\/token|login\.microsoftonline\.com\/.*\/token|linkedin\.com\/oauth\/v2\/accessToken|github\.com\/login\/oauth\/access_token/.test(u)) {
    return new Response(JSON.stringify({ access_token: new URLSearchParams(init.body).get("code") }), { headers: { "content-type": "application/json" } });
  }
  if (/openidconnect\.googleapis|graph\.microsoft\.com|api\.linkedin\.com|api\.github\.com\/user/.test(u)) {
    const code = new Headers(init.headers).get("authorization").replace("Bearer ", "");
    return new Response(JSON.stringify(PROFILE[code]), { headers: { "content-type": "application/json" } });
  }
  throw new Error("unerwarteter Abruf " + u);
};
const realFetch = globalThis.fetch;
globalThis.fetch = (url, init) => (/^https?:\/\/(api-dub|www)\.m365\.fm/.test(String(url)) ? realFetch(url, init) : mockFetch(url, init));

const cookieOf = (res, name) => {
  for (const c of res.headers.getSetCookie()) { const m = new RegExp(`^${name}=([^;]*)`).exec(c); if (m) return m[1]; }
  return null;
};
const providerOf = (code) => ({ gh: "github", go: "google", li: "linkedin", ms: "microsoft" }[code.slice(0, 2)]);

async function signIn(env, code) {
  const p = providerOf(code);
  const r = await W.fetch(new Request(`${API}/auth/login/${p}?return=${encodeURIComponent(RET)}`), env);
  const state = new URL(r.headers.get("location")).searchParams.get("state"), o = cookieOf(r, "m365o");
  const cb = await W.fetch(new Request(`${API}/auth/callback/${p}?code=${code}&state=${state}`, { headers: { cookie: `m365o=${o}` } }), env);
  assert.equal(cb.status, 302, "Anmeldung " + code);
  return cookieOf(cb, "m365s");
}
const uidOf = (s) => +s.split(".")[0];
async function call(env, method, path, cookies, body, extra = {}) {
  const headers = { "x-requested-with": "m365", origin: SITE, cookie: cookies, ...extra };
  if (body) headers["content-type"] = "application/json";
  const r = await W.fetch(new Request(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined }), env);
  return { r, s: r.status, j: await r.clone().json().catch(() => null) };
}
// Verknuepfen: Start per API (mit Sitzung), dann Callback des Anbieters mit state-Cookie und Sitzung
async function link(env, sess, code, { callbackSess = sess } = {}) {
  const start = await call(env, "POST", "/api/me/identities/link", `m365s=${sess}`, { provider: providerOf(code), return: RET });
  assert.equal(start.s, 200, JSON.stringify(start.j));
  const loc = new URL(start.j.url), o = cookieOf(start.r, "m365o");
  assert.equal(loc.searchParams.get("redirect_uri"), `${API}/auth/callback/${providerOf(code)}`, "Callback-URL bleibt unveraendert");
  const cookie = `m365o=${o}` + (callbackSess ? `; m365s=${callbackSess}` : "");
  const cb = await W.fetch(new Request(`${API}/auth/callback/${providerOf(code)}?code=${code}&state=${loc.searchParams.get("state")}`, { headers: { cookie } }), env);
  const where = cb.headers.get("location") ? new URL(cb.headers.get("location")) : null;
  return { cb, status: where?.searchParams.get("link"), proof: cookieOf(cb, "m365m"), where };
}
async function staleSession(env, uid) {   // gueltige Sitzung, aber vor einer Stunde angemeldet
  const exp = Math.floor(Date.now() / 1000) + 60 * 86400 - 3600, body = `${uid}.${exp}`;
  return `${body}.${await sign(env.SESSION_SECRET, body)}`;
}

test("Migration: user_identities wird aus users gefuellt, users.provider/sub bleiben", async () => {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:"), dir = new URL("../migrations/", import.meta.url);
  const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  for (const f of files.filter((f) => f < "0025")) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  raw.exec("INSERT INTO users(provider,sub,name,created) VALUES('google','g1','A',1),('github','42','B',2)");
  for (const f of files.filter((f) => f >= "0025")) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  assert.deepEqual(raw.prepare("SELECT user_id,provider,sub FROM user_identities ORDER BY user_id").all().map((r) => ({ ...r })),
    [{ user_id: 1, provider: "google", sub: "g1" }, { user_id: 2, provider: "github", sub: "42" }]);
  assert.equal(raw.prepare("SELECT provider FROM users WHERE id=1").get().provider, "google");
});

test("Verknuepfen: zweite Anmeldung haengt am angemeldeten Konto, Login damit landet im selben Konto", async () => {
  const { db, raw } = await d1(), env = { ...ENV, DB: db };
  const sess = await signIn(env, "gh-anna"), uid = uidOf(sess);
  const l = await link(env, sess, "go-anna");
  assert.equal(l.cb.status, 302);
  assert.equal(l.status, "ok");
  assert.equal(l.where.hash, "#c-page");
  assert.equal(cookieOf(l.cb, "m365s"), null, "Verknuepfen legt keine neue Sitzung an");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM users").get().n, 1, "kein zweites Konto");
  assert.deepEqual(raw.prepare("SELECT provider FROM user_identities WHERE user_id=? ORDER BY id").all(uid).map((r) => r.provider), ["github", "google"]);
  // Login nur mit Google (neue Sitzung) -> dasselbe Konto
  const s2 = await signIn(env, "go-anna");
  assert.equal(uidOf(s2), uid);
  // Liste ohne Kennungen, Hauptanmeldung markiert
  const list = await call(env, "GET", "/api/me/identities", `m365s=${s2}`);
  assert.deepEqual(list.j.identities.map((i) => [i.provider, i.primary]), [["github", true], ["google", false]]);
  assert.ok(!JSON.stringify(list.j).includes("g-anna") && !JSON.stringify(list.j).includes("1001"), "keine Anbieter-Kennungen in der Antwort");
  // Erneut verknuepfen -> already
  assert.equal((await link(env, s2, "go-anna")).status, "already");
});

test("Verknuepfen: state ist an die Sitzung gebunden, CSRF-Header und Login noetig", async () => {
  const { db, raw } = await d1(), env = { ...ENV, DB: db };
  const sess = await signIn(env, "gh-anna");
  // ohne Sitzung im Callback: Ablehnung, keine Identitaet
  const noSess = await link(env, sess, "go-anna", { callbackSess: null });
  assert.equal(noSess.cb.status, 400);
  // andere Sitzung desselben Nutzers (neu angemeldet): Ablehnung
  await new Promise((r) => setTimeout(r, 1100));
  const other = await signIn(env, "gh-anna");
  assert.notEqual(other, sess);
  assert.equal((await link(env, sess, "go-anna", { callbackSess: other })).cb.status, 400);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM user_identities WHERE provider='google'").get().n, 0);
  // ohne x-requested-with (CSRF-Schutz wie im restlichen Worker)
  const r = await W.fetch(new Request(API + "/api/me/identities/link", { method: "POST", headers: { cookie: `m365s=${sess}`, "content-type": "application/json" }, body: JSON.stringify({ provider: "google" }) }), env);
  assert.equal(r.status, 400);
  assert.equal((await call(env, "POST", "/api/me/identities/link", "", { provider: "google" })).s, 401);
  assert.equal((await call(env, "POST", "/api/me/identities/link", `m365s=${sess}`, { provider: "__proto__" })).s, 400);
  // Ruecksprung nur auf die eigene Website
  const ext = await call(env, "POST", "/api/me/identities/link", `m365s=${sess}`, { provider: "google", return: "https://evil.example/" });
  const o = cookieOf(ext.r, "m365o"), val = o.slice(0, o.lastIndexOf("."));
  assert.equal(new TextDecoder().decode(Uint8Array.from(atob(val.split("|")[1].replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))), SITE + "/");
});

test("Entfernen: letzte Anmeldung bleibt, Hauptanmeldung wechselt, entfernte Anmeldung legt danach ein neues Konto an", async () => {
  const { db, raw } = await d1(), env = { ...ENV, DB: db };
  const sess = await signIn(env, "gh-anna"), uid = uidOf(sess);
  let list = (await call(env, "GET", "/api/me/identities", `m365s=${sess}`)).j.identities;
  assert.equal((await call(env, "DELETE", `/api/me/identities/${list[0].id}`, `m365s=${sess}`)).j.error, "last");
  await link(env, sess, "go-anna");
  list = (await call(env, "GET", "/api/me/identities", `m365s=${sess}`)).j.identities;
  const gh = list.find((i) => i.provider === "github"), go = list.find((i) => i.provider === "google");
  assert.equal((await call(env, "DELETE", `/api/me/identities/${gh.id}`, `m365s=${sess}`)).s, 200);
  assert.deepEqual({ ...raw.prepare("SELECT provider,sub FROM users WHERE id=?").get(uid) }, { provider: "google", sub: "g-anna" });
  assert.equal((await call(env, "DELETE", `/api/me/identities/${go.id}`, `m365s=${sess}`)).j.error, "last");
  // fremde Identitaet nicht entfernbar
  const other = await signIn(env, "li-anna");
  const otherId = raw.prepare("SELECT id FROM user_identities WHERE provider='linkedin'").get().id;
  assert.equal((await call(env, "DELETE", `/api/me/identities/${otherId}`, `m365s=${sess}`)).s, 404);
  // GitHub ist jetzt frei: Anmeldung damit legt ein eigenes Konto an
  const again = await signIn(env, "gh-anna");
  assert.notEqual(uidOf(again), uid);
  assert.notEqual(uidOf(again), uidOf(other));
});

// Daten zweier Konten anlegen: T (Ziel) und S (Quelle) mit Ueberschneidungen bei UNIQUE-Schluesseln
function seed(raw, T, S) {
  raw.exec(`INSERT INTO users(id,provider,sub,name,created) VALUES(900,'google','g-carl','Carl C.',1)`);
  const C = 900, x = (sql, ...a) => raw.prepare(sql).run(...a);
  x("INSERT INTO comments(id,vid,lang,user_id,body,created) VALUES(1,'vid01','de',?,'T',1),(2,'vid01','de',?,'S1',2),(3,'vid01','de',?,'S2',3),(4,'vid01','de',?,'C',4)", T, S, S, C);
  x("INSERT INTO likes(comment_id,user_id,created) VALUES(4,?,1),(4,?,1),(1,?,1),(2,?,1)", T, S, S, T);   // beide liken C; S liked T, T liked S
  x("INSERT OR IGNORE INTO user_badges(user_id,badge,earned) VALUES(?,'newcomer',1),(?,'newcomer',1),(?,'first_comment',1)", T, S, S);
  x("INSERT INTO profiles(user_id,public,handle,updated) VALUES(?,1,'anna',1),(?,1,'anna-old',1)", T, S);
  x("INSERT INTO profile_i18n(user_id,lang) VALUES(?,'en')", S);
  x("INSERT INTO blog_posts(user_id,slug,title,created,updated) VALUES(?,'hello','T',1,1),(?,'hello','S',1,1),(?,'other','S2',1,1)", T, S, S);
  x("INSERT INTO orgs(id,handle,name,created) VALUES(7,'acme','Acme',1)");
  x("INSERT INTO org_members(org_id,user_id,role,status,created) VALUES(7,?,'member','pending',1),(7,?,'owner','active',1)", T, S);
  x("INSERT INTO endorsements(owner_id,eid,by_id,created) VALUES(?,'copilot',?,1),(?,'copilot',?,1),(?,'copilot',?,1)", T, S, T, C, S, C);
  x("INSERT INTO msg_threads(id,a_id,b_id,created,last) VALUES(1,?,?,1,5),(2,?,?,1,6),(3,?,?,1,7)", T, C, C, S, T, S);
  x("INSERT INTO msg_messages(thread_id,from_id,body,created) VALUES(1,?,'t-c',5),(2,?,'s-c',6),(3,?,'t-s',7)", T, S, T);
  x("INSERT INTO contribution_sources(id,user_id,kind,url,created) VALUES(1,?,'blog','https://blog.example/feed',1),(2,?,'blog','https://blog.example/feed',1)", T, S);
  x("INSERT INTO contributions(user_id,source_id,title,url,published,kind,created) VALUES(?,2,'Post A','https://blog.example/a',1,'blog',1),(?,1,'Post B','https://blog.example/b',1,'blog',1),(?,2,'Post B dup','https://blog.example/b',1,'blog',1)", S, T, S);
  // 0036 (eigene Quellen): S hat zwei Kurzposts - einer haengt an einem Beitrag, den es bei T unter derselben URL schon gibt - und eine Loeschmarke
  x("INSERT INTO channels(id,owner_type,owner_id,kind,url) VALUES(50,'u',?,'blog','https://www.m365.fm/community/u/anna-old/blog/')", S);
  x("INSERT INTO feed_items(id,channel_id,owner_type,owner_id,url,title,published,origin) VALUES(501,50,'u',?,'https://blog.example/a','Post A',1,'kurzpost'),(502,50,'u',?,'https://blog.example/b','Post B dup',1,'kurzpost')", S, S);
  x("UPDATE contributions SET feed_item_id=501, canon='blog.example/a', guid='g-a', ctype='Book', teaser='Teaser A' WHERE user_id=? AND url='https://blog.example/a'", S);
  x("UPDATE contributions SET feed_item_id=502 WHERE user_id=? AND url='https://blog.example/b'", S);
  x("UPDATE contribution_sources SET mode='publish', seeded=1, topics='[\"copilot\"]' WHERE user_id=?", S);
  x("INSERT INTO contribution_ignored(user_id,url,created) VALUES(?,'https://blog.example/gone',1)", S);
  x("INSERT INTO item_votes(item_id,user_id,created) VALUES(501,?,1),(502,?,1)", C, C);
  x("INSERT INTO mail_addr(user_id,email,verified,created) VALUES(?,'t@example.com',1,1),(?,'s@example.com',1,1)", T, S);
  x("INSERT INTO blog_follows(user_id,handle,created) VALUES(?,'anna-old',1),(?,'anna',1),(?,'anna-old',1)", C, C, T);
  x("INSERT INTO show_reviews(show,user_id,rating,created,updated) VALUES('m365',?,5,1,1),('m365',?,4,1,1)", T, S);
  x("INSERT INTO email_topics(user_id,kind,topic_id,lang,created) VALUES(?,'entity','copilot','de',1),(?,'entity','copilot','de',1),(?,'entity','teams','de',1)", T, S, S);
  x("INSERT INTO topic_recipient_state(channel,recipient,not_before,updated) VALUES('email',?,0,1)", String(S));
  x("INSERT INTO events(id,handle,owner_id,title,start,created,updated) VALUES(5,'meetup',?,'Meetup','2027-01-01',1,1)", S);
  x("INSERT INTO event_sessions(event_id,title,speakers,proposer_id,created) VALUES(5,'Talk','[{\"h\":\"anna-old\",\"n\":\"Anna\"}]',?,1)", S);
  x("INSERT INTO programs(owner_type,owner_id,program,verified) VALUES('u',?,'mvp',0),('u',?,'mvp',1)", T, S);
  x("INSERT INTO expertise_score(owner_id,eid,score,updated) VALUES(?,'copilot',5,1)", S);
}

async function twoAccounts(env) {
  const tSess = await signIn(env, "gh-anna"), sSess = await signIn(env, "li-anna");
  assert.notEqual(uidOf(tSess), uidOf(sSess));
  return { tSess, T: uidOf(tSess), S: uidOf(sSess) };
}

test("Zusammenfuehren: Vorschau mit Zaehlern, alle Tabellen auf das Ziel, UNIQUE-Konflikte, Quelle stillgelegt, Protokoll", async () => {
  const { db, raw } = await d1(), env = { ...ENV, DB: db };
  const { tSess, T, S } = await twoAccounts(env);
  seed(raw, T, S);
  const l = await link(env, tSess, "li-anna");
  assert.equal(l.status, "merge");
  assert.ok(l.proof, "Nachweis-Cookie fuer das zweite Konto");
  const ck = `m365s=${tSess}; m365m=${l.proof}`;
  const pre = await call(env, "GET", "/api/me/merge", ck);
  assert.equal(pre.j.pending, true);
  assert.equal(pre.j.fresh, true);
  assert.equal(pre.j.counts.comments, 2);
  assert.equal(pre.j.counts.posts, 2);
  assert.equal(pre.j.counts.badges, 2);
  assert.equal(pre.j.counts.signins, 1);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM comments WHERE user_id=?").get(T).n, 1, "Vorschau aendert nichts");
  assert.equal((await call(env, "POST", "/api/me/merge", ck, { confirm: false })).s, 400);
  const done = await call(env, "POST", "/api/me/merge", ck, { confirm: true });
  assert.equal(done.s, 200, JSON.stringify(done.j));
  assert.equal(cookieOf(done.r, "m365m"), "", "Nachweis wird geloescht");
  const one = (sql, ...a) => raw.prepare(sql).get(...a);
  const all = (sql, ...a) => raw.prepare(sql).all(...a).map((r) => ({ ...r }));
  // Quelle stillgelegt, nicht geloescht
  assert.deepEqual({ ...one("SELECT banned,merged_into,provider,role FROM users WHERE id=?", S) }, { banned: 2, merged_into: T, provider: "merged", role: "user" });
  assert.equal(one("SELECT COUNT(*) n FROM user_identities WHERE user_id=?", S).n, 0);
  assert.deepEqual(all("SELECT provider FROM user_identities WHERE user_id=? ORDER BY id", T).map((r) => r.provider), ["github", "linkedin"]);
  // Inhalte
  assert.equal(one("SELECT COUNT(*) n FROM comments WHERE user_id=?", T).n, 3);
  const bs = all("SELECT slug FROM blog_posts WHERE user_id=? ORDER BY slug", T).map((r) => r.slug);
  assert.equal(bs.length, 3); assert.equal(bs[0], "hello"); assert.match(bs[1], new RegExp(`^hello-${S}-\\d+$`)); assert.equal(bs[2], "other");
  assert.equal(one("SELECT owner_id FROM events WHERE id=5").owner_id, T);
  assert.equal(one("SELECT proposer_id FROM event_sessions").proposer_id, T);
  assert.match(one("SELECT speakers FROM event_sessions").speakers, /"h":"anna"/);
  // Likes: doppelte entfallen, Likes auf eigene Kommentare entfallen
  assert.deepEqual(all("SELECT comment_id,user_id FROM likes ORDER BY comment_id"), [{ comment_id: 4, user_id: T }]);
  assert.deepEqual(all("SELECT badge FROM user_badges WHERE user_id=? AND badge IN ('newcomer','first_comment') ORDER BY badge", T).map((r) => r.badge), ["first_comment", "newcomer"]);
  assert.equal(one("SELECT COUNT(*) n FROM user_badges WHERE user_id=?", S).n, 0);
  // Profil und Handle von T bleiben; das Profil von S bleibt am stillgelegten Konto (ausgeblendet)
  assert.equal(one("SELECT handle FROM profiles WHERE user_id=?", T).handle, "anna");
  assert.equal(one("SELECT handle FROM profiles WHERE user_id=?", S).handle, "anna-old");
  assert.equal(one("SELECT COUNT(*) n FROM profile_i18n WHERE user_id=?", T).n, 0);
  // Firma: staerkere Rolle und aktiver Status
  assert.deepEqual(all("SELECT user_id,role,status FROM org_members WHERE org_id=7"), [{ user_id: T, role: "owner", status: "active" }]);
  // Bestaetigungen: Selbst-Bestaetigung entfaellt, doppelte von C entfaellt
  assert.deepEqual(all("SELECT owner_id,by_id FROM endorsements"), [{ owner_id: T, by_id: 900 }]);
  // Nachrichten: Gespraech T-S entfaellt, S-C wird mit T-C zusammengelegt
  assert.deepEqual(all("SELECT id,a_id,b_id FROM msg_threads"), [{ id: 1, a_id: T, b_id: 900 }]);
  assert.deepEqual(all("SELECT thread_id,body FROM msg_messages ORDER BY created"), [{ thread_id: 1, body: "t-c" }, { thread_id: 1, body: "s-c" }]);
  assert.equal(one("SELECT last FROM msg_threads WHERE id=1").last, 6);
  // MVP-Beitraege: Quelle zusammengelegt, doppelte URL entfaellt
  assert.deepEqual(all("SELECT id,user_id FROM contribution_sources"), [{ id: 1, user_id: T }]);
  assert.deepEqual(all("SELECT title,user_id,source_id FROM contributions ORDER BY title"), [{ title: "Post A", user_id: T, source_id: 1 }, { title: "Post B", user_id: T, source_id: 1 }]);
  // 0036: neue Spalten wandern mit, der Kurzpost des doppelten Beitrags haengt jetzt am Eintrag von T, beide Kurzposts gehoeren T
  assert.deepEqual(all("SELECT title,feed_item_id,canon,guid,ctype,teaser FROM contributions ORDER BY title"), [{ title: "Post A", feed_item_id: 501, canon: "blog.example/a", guid: "g-a", ctype: "Book", teaser: "Teaser A" }, { title: "Post B", feed_item_id: 502, canon: "", guid: "", ctype: "", teaser: "" }]);
  assert.deepEqual(all("SELECT id,owner_id,origin FROM feed_items ORDER BY id"), [{ id: 501, owner_id: T, origin: "kurzpost" }, { id: 502, owner_id: T, origin: "kurzpost" }]);
  assert.equal(one("SELECT owner_id FROM channels WHERE id=50").owner_id, T);
  assert.equal(one("SELECT mode FROM contribution_sources WHERE id=1").mode, "track", "bei gleicher Quelle bleibt die Einstellung von T");
  assert.deepEqual(all("SELECT user_id,url FROM contribution_ignored"), [{ user_id: T, url: "https://blog.example/gone" }]);
  // E-Mail: Adresse von T bleibt, stillgelegtes Konto bekommt keine Post
  assert.deepEqual(all("SELECT user_id,email FROM mail_addr"), [{ user_id: T, email: "t@example.com" }]);
  assert.deepEqual(all("SELECT handle FROM blog_follows WHERE user_id=900"), [{ handle: "anna" }]);
  assert.equal(one("SELECT COUNT(*) n FROM blog_follows WHERE user_id=?", T).n, 0, "kein Abo des eigenen Blogs");
  assert.deepEqual(all("SELECT user_id,status FROM show_reviews ORDER BY user_id"), [{ user_id: T, status: "published" }, { user_id: S, status: "merged" }]);
  assert.deepEqual(all("SELECT topic_id FROM email_topics WHERE user_id=? ORDER BY topic_id", T).map((r) => r.topic_id), ["copilot", "teams"]);
  assert.equal(one("SELECT recipient FROM topic_recipient_state").recipient, String(T));
  assert.equal(one("SELECT verified FROM programs WHERE owner_id=? AND program='mvp'", T).verified, 1);
  assert.equal(one("SELECT COUNT(*) n FROM expertise_score WHERE owner_id=?", S).n, 0);
  // Protokoll
  const a = one("SELECT user_id,action,target,detail FROM audit WHERE action='account-merge'");
  assert.equal(a.user_id, T); assert.equal(a.target, String(S)); assert.match(a.detail, /"linkedin"/);
  // Login mit der Anmeldung des alten Kontos landet im Zielkonto
  assert.equal(uidOf(await signIn(env, "li-anna")), T);
  // Nachweis ist verbraucht
  assert.equal((await call(env, "GET", "/api/me/merge", `m365s=${tSess}`)).j.pending, false);
  // Kontoloeschung von T entfernt auch das stillgelegte Konto
  assert.equal((await call(env, "DELETE", "/api/me", `m365s=${tSess}`)).s, 200);
  assert.equal(one("SELECT COUNT(*) n FROM users WHERE id IN (?,?)", T, S).n, 0);
  assert.equal(one("SELECT COUNT(*) n FROM user_identities").n, 0);
  // ... und alles aus dem MVP-Tracker samt Kurzposts, ihrem Kanal und den Stimmen darauf (0012, 0036)
  for (const t of ["contributions", "contribution_sources", "contribution_ignored", "feed_items", "channels", "item_votes"]) assert.equal(one(`SELECT COUNT(*) n FROM ${t}`).n, 0, t);
});

test("Zusammenfuehren: ohne frische Anmeldung beider Konten abgelehnt", async () => {
  const { db, raw } = await d1(), env = { ...ENV, DB: db };
  const { tSess, T, S } = await twoAccounts(env);
  raw.prepare("INSERT INTO comments(vid,lang,user_id,body,created) VALUES('vid01','de',?,'S',1)").run(S);
  const stale = await staleSession(env, T);
  assert.equal((await call(env, "POST", "/api/me/identities/link", `m365s=${stale}`, { provider: "linkedin", return: RET })).j.error, "fresh");   // Verknuepfen braucht schon eine frische Anmeldung
  const l = await link(env, tSess, "li-anna");   // Nachweis mit frischer Sitzung, Zusammenfuehren dann mit der alten
  assert.equal(l.status, "merge");
  const ck = `m365s=${stale}; m365m=${l.proof}`;
  const pre = await call(env, "GET", "/api/me/merge", ck);
  assert.equal(pre.j.pending, true);
  assert.equal(pre.j.fresh, false);
  assert.equal(pre.j.relogin, "github");
  const no = await call(env, "POST", "/api/me/merge", ck, { confirm: true });
  assert.equal(no.s, 403); assert.equal(no.j.error, "fresh");
  // ohne Nachweis des zweiten Kontos
  const fresh = await signIn(env, "gh-anna");
  const none = await call(env, "POST", "/api/me/merge", `m365s=${fresh}`, { confirm: true });
  assert.equal(none.s, 403); assert.equal(none.j.error, "no_proof");
  // gefaelschter / fremder Nachweis
  assert.equal((await call(env, "POST", "/api/me/merge", `m365s=${fresh}; m365m=${T}.${S}.${Math.floor(Date.now() / 1000)}.AAAA`, { confirm: true })).j.error, "no_proof");
  const otherTarget = await signIn(env, "ms-anna");
  assert.equal((await call(env, "POST", "/api/me/merge", `m365s=${otherTarget}; m365m=${l.proof}`, { confirm: true })).j.error, "no_proof");
  // abgelaufener Nachweis (aelter als 10 Minuten)
  const old = `${T}.${S}.${Math.floor(Date.now() / 1000) - 700}`, oldProof = `${old}.${await sign(env.SESSION_SECRET, "merge|" + old)}`;
  assert.equal((await call(env, "POST", "/api/me/merge", `m365s=${fresh}; m365m=${oldProof}`, { confirm: true })).j.error, "no_proof");
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM comments WHERE user_id=?").get(S).n, 1, "nichts verschoben");
  assert.equal(raw.prepare("SELECT banned FROM users WHERE id=?").get(S).banned, 0);
  // nach erneuter Anmeldung mit dem Zielkonto (frisch) klappt es mit demselben Nachweis
  const ok = await call(env, "POST", "/api/me/merge", `m365s=${fresh}; m365m=${l.proof}`, { confirm: true });
  assert.equal(ok.s, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM comments WHERE user_id=?").get(T).n, 1);
});

test("Zusammenfuehren: gesperrte Konten nie, Admin-Rolle wird nicht uebertragen", async () => {
  const { db, raw } = await d1(), env = { ...ENV, DB: db };
  // gesperrtes Quellkonto
  let { tSess, S } = await twoAccounts(env);
  raw.prepare("UPDATE users SET banned=1 WHERE id=?").run(S);
  const l = await link(env, tSess, "li-anna");
  assert.equal(l.status, "banned");
  assert.equal(l.proof, null);
  assert.equal(raw.prepare("SELECT user_id FROM user_identities WHERE provider='linkedin'").get().user_id, S, "Identitaet bleibt beim gesperrten Konto");
  // Admin im Quellkonto -> Ziel bleibt "user"
  const e2 = { ...ENV, DB: (await d1()).db }, r2 = e2.DB;
  ({ tSess, S } = await twoAccounts(e2));
  const T = uidOf(tSess);
  await r2.prepare("UPDATE users SET role='admin' WHERE id=?").bind(S).run();
  let m = await link(e2, tSess, "li-anna");
  const pre = await call(e2, "GET", "/api/me/merge", `m365s=${tSess}; m365m=${m.proof}`);
  assert.equal(pre.j.source.role_dropped, true);
  assert.equal((await call(e2, "POST", "/api/me/merge", `m365s=${tSess}; m365m=${m.proof}`, { confirm: true })).s, 200);
  assert.equal((await r2.prepare("SELECT role FROM users WHERE id=?").bind(T).first()).role, "user");
  assert.equal((await r2.prepare("SELECT role FROM users WHERE id=?").bind(S).first()).role, "user");
  assert.equal((await call(e2, "GET", "/api/me", `m365s=${tSess}`)).j.user.admin, false);
  // Admin im Zielkonto bleibt Admin
  const e3 = { ...ENV, DB: (await d1()).db };
  const a = await twoAccounts(e3);
  await e3.DB.prepare("UPDATE users SET role='admin' WHERE id=?").bind(a.T).run();
  m = await link(e3, a.tSess, "li-anna");
  assert.equal((await call(e3, "POST", "/api/me/merge", `m365s=${a.tSess}; m365m=${m.proof}`, { confirm: true })).s, 200);
  assert.equal((await e3.DB.prepare("SELECT role FROM users WHERE id=?").bind(a.T).first()).role, "admin");
});

test("Hauptanmeldung: eine ADMIN_SUBS-Kennung wird beim Entfernen nie Hauptanmeldung eines Nicht-Admins", async () => {
  const { db, raw } = await d1(), env = { ...ENV, DB: db, ADMIN_SUBS: "google:g-anna" };
  const sess = await signIn(env, "gh-anna"), uid = uidOf(sess);
  await link(env, sess, "go-anna");
  const gh = raw.prepare("SELECT id FROM user_identities WHERE provider='github'").get().id;
  const r = await call(env, "DELETE", `/api/me/identities/${gh}`, `m365s=${sess}`);
  assert.equal(r.j.error, "primary");
  assert.equal(raw.prepare("SELECT provider FROM users WHERE id=?").get(uid).provider, "github");
});

test("Zusammenfuehren: ein ADMIN_SUBS-Konto nie in ein Konto ohne Admin-Rechte, richtig herum geht es", async () => {
  const { db, raw } = await d1(), env = { ...ENV, DB: db, ADMIN_SUBS: "linkedin:l-anna" };
  const sSess = await signIn(env, "li-anna"), S = uidOf(sSess);   // Admin nur ueber ADMIN_SUBS, Rolle "user"
  const tSess = await signIn(env, "gh-anna"), T = uidOf(tSess);
  let m = await link(env, tSess, "li-anna");
  assert.equal(m.status, "merge");
  const pre = await call(env, "GET", "/api/me/merge", `m365s=${tSess}; m365m=${m.proof}`);
  assert.deepEqual([pre.j.pending, pre.j.error], [false, "admin_source"]);
  const post = await call(env, "POST", "/api/me/merge", `m365s=${tSess}; m365m=${m.proof}`, { confirm: true });
  assert.deepEqual([post.s, post.j.error], [403, "admin_source"]);
  assert.equal(raw.prepare("SELECT user_id FROM user_identities WHERE provider='linkedin'").get().user_id, S, "Admin-Anmeldung bleibt beim Admin-Konto");
  assert.equal((await call(env, "GET", "/api/me", `m365s=${await signIn(env, "li-anna")}`)).j.user.admin, true);
  // richtig herum: als Admin anmelden und das andere Konto hineinziehen
  m = await link(env, sSess, "gh-anna");
  assert.equal(m.status, "merge");
  assert.equal((await call(env, "POST", "/api/me/merge", `m365s=${sSess}; m365m=${m.proof}`, { confirm: true })).s, 200);
  assert.equal(raw.prepare("SELECT merged_into FROM users WHERE id=?").get(T).merged_into, S);
  assert.equal((await call(env, "GET", "/api/me", `m365s=${await signIn(env, "gh-anna")}`)).j.user.admin, true);
});

test("Verwaiste Anmeldung (Konto vom alten Worker geloescht) wird beim naechsten Login uebernommen, nie eine lebende", async () => {
  const { db, raw } = await d1(), env = { ...ENV, DB: db };
  const first = uidOf(await signIn(env, "go-anna"));
  raw.prepare("DELETE FROM users WHERE id=?").run(first);   // alter Worker: loescht users, kennt user_identities nicht
  const sess = await signIn(env, "go-anna"), uid = uidOf(sess);
  assert.notEqual(uid, first);
  assert.equal(raw.prepare("SELECT user_id FROM user_identities WHERE provider='google' AND sub='g-anna'").get().user_id, uid);
  assert.deepEqual((await call(env, "GET", "/api/me/identities", `m365s=${sess}`)).j.identities.map((i) => i.provider), ["google"]);
  // eine Anmeldung mit lebendem Besitzer wird nie umgehaengt
  const other = uidOf(await signIn(env, "gh-anna"));
  await db.prepare("INSERT INTO user_identities(user_id,provider,sub,created) VALUES(?,?,?,?) ON CONFLICT(provider,sub) DO UPDATE SET user_id=excluded.user_id WHERE NOT EXISTS (SELECT 1 FROM users WHERE id=user_identities.user_id)").bind(other, "google", "g-anna", 1).run();
  assert.equal(raw.prepare("SELECT user_id FROM user_identities WHERE provider='google' AND sub='g-anna'").get().user_id, uid);
});

test("Verknuepfen und Entfernen nur mit frischer Anmeldung (alte oder entwendete Sitzung: keine dauerhafte Uebernahme)", async () => {
  const { db, raw } = await d1(), env = { ...ENV, DB: db };
  const sess = await signIn(env, "gh-anna"), uid = uidOf(sess);
  await link(env, sess, "go-anna");
  const old = await staleSession(env, uid);
  const l = await call(env, "POST", "/api/me/identities/link", `m365s=${old}`, { provider: "linkedin", return: RET });
  assert.deepEqual([l.s, l.j.error, l.j.relogin], [403, "fresh", "github"]);
  const gh = raw.prepare("SELECT id FROM user_identities WHERE provider='github'").get().id;
  const d = await call(env, "DELETE", `/api/me/identities/${gh}`, `m365s=${old}`);
  assert.deepEqual([d.s, d.j.error], [403, "fresh"]);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM user_identities WHERE user_id=?").get(uid).n, 2, "nichts veraendert");
  // nach erneuter Anmeldung geht es
  const fresh = await signIn(env, "gh-anna");
  assert.equal((await call(env, "DELETE", `/api/me/identities/${gh}`, `m365s=${fresh}`)).s, 200);
});

test("Kontoloeschung erfasst auch Ketten R -> S -> T (keine Personendaten bleiben zurueck)", async () => {
  const { db, raw } = await d1(), env = { ...ENV, DB: db };
  const rSess = await signIn(env, "ms-anna"), R = uidOf(rSess);
  const sSess = await signIn(env, "go-anna"), S = uidOf(sSess);
  let m = await link(env, sSess, "ms-anna");
  assert.equal((await call(env, "POST", "/api/me/merge", `m365s=${sSess}; m365m=${m.proof}`, { confirm: true })).s, 200);   // R -> S
  const tSess = await signIn(env, "gh-anna"), T = uidOf(tSess);
  m = await link(env, tSess, "go-anna");
  assert.equal((await call(env, "POST", "/api/me/merge", `m365s=${tSess}; m365m=${m.proof}`, { confirm: true })).s, 200);   // S -> T
  assert.deepEqual(raw.prepare("SELECT id,merged_into FROM users ORDER BY id").all().map((u) => [u.id, u.merged_into]), [[R, T], [S, T], [T, null]], "Kette abgeflacht");
  // Altbestand: Kette ohne Abflachung wird trotzdem ganz geloescht
  raw.prepare("UPDATE users SET merged_into=? WHERE id=?").run(S, R);
  assert.equal((await call(env, "DELETE", "/api/me", `m365s=${tSess}`)).s, 200);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM users").get().n, 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM user_identities").get().n, 0);
});

test("Zusammenfuehren: Slug-Umbenennung kollidiert nie, staerkere Event-Rolle von S gilt", async () => {
  const { db, raw } = await d1(), env = { ...ENV, DB: db };
  const { tSess, T, S } = await twoAccounts(env);
  // Zeile mit allen Pflichtspalten (NOT NULL ohne Vorgabe) anlegen
  const put = (t, vals) => {
    const need = raw.prepare(`PRAGMA table_info(${t})`).all().filter((c) => c.notnull && c.dflt_value === null && !c.pk).map((c) => c.name);
    const cols = [...new Set([...Object.keys(vals), ...need])];
    raw.prepare(`INSERT INTO ${t}(${cols.join(",")}) VALUES(${cols.map(() => "?").join(",")})`).run(...cols.map((c) => c in vals ? vals[c] : /^(created|updated|published|start|end|at|ts)$|_at$/.test(c) ? 1 : `${c}-${Math.random().toString(36).slice(2, 8)}`));
  };
  for (const t of ["blog_posts", "lib_items"]) {
    for (const [uid, slug] of [[T, "hello"], [T, `hello-${S}`], [S, "hello"], [S, `hello-${S}`]]) put(t, { user_id: uid, slug });   // beide Faelle aus dem Review
  }
  put("events", { id: 5, owner_id: T });
  raw.prepare("INSERT INTO event_roles(event_id,user_id,role,created) VALUES(5,?,'helfer',1),(5,?,'organisator',1)").run(T, S);
  const m = await link(env, tSess, "li-anna");
  const r = await call(env, "POST", "/api/me/merge", `m365s=${tSess}; m365m=${m.proof}`, { confirm: true });
  assert.equal(r.s, 200, JSON.stringify(r.j));
  for (const t of ["blog_posts", "lib_items"]) {
    const slugs = raw.prepare(`SELECT slug FROM ${t} WHERE user_id=? ORDER BY slug`).all(T).map((x) => x.slug);
    assert.equal(slugs.length, 4); assert.equal(new Set(slugs).size, 4);
  }
  assert.equal(raw.prepare("SELECT role FROM event_roles WHERE event_id=5 AND user_id=?").get(T).role, "organisator");
});

test("Zusammenfuehren: Branche und Job (#304) gehen nicht verloren, die Auswahl des Ziels gilt", async () => {
  const { db, raw } = await d1(), env = { ...ENV, DB: db };
  const { tSess, T, S } = await twoAccounts(env);
  raw.prepare("INSERT INTO profile_job(user_id,eid) VALUES(?,?)").run(S, "cio");
  raw.prepare("INSERT INTO profile_industry(user_id,eid) VALUES(?,?),(?,?)").run(S, "aviation", S, "manufacturing");
  let m = await link(env, tSess, "li-anna");
  assert.equal((await call(env, "POST", "/api/me/merge", `m365s=${tSess}; m365m=${m.proof}`, { confirm: true })).s, 200);
  assert.equal(raw.prepare("SELECT eid FROM profile_job WHERE user_id=?").get(T).eid, "cio", "T hatte keinen Job: der von S wird uebernommen");
  assert.deepEqual(raw.prepare("SELECT eid FROM profile_industry WHERE user_id=? ORDER BY eid").all(T).map((r) => r.eid), ["aviation", "manufacturing"]);
  // hat das Ziel schon eine Auswahl, bleibt sie (wie Profil und Handle)
  const e2 = { ...ENV, DB: (await d1()).db }, r2 = e2.DB;
  const a = await twoAccounts(e2);
  await r2.prepare("INSERT INTO profile_job(user_id,eid) VALUES(?,?),(?,?)").bind(a.T, "ceo", a.S, "cio").run();
  await r2.prepare("INSERT INTO profile_industry(user_id,eid) VALUES(?,?),(?,?)").bind(a.T, "energy", a.S, "aviation").run();
  m = await link(e2, a.tSess, "li-anna");
  assert.equal((await call(e2, "POST", "/api/me/merge", `m365s=${a.tSess}; m365m=${m.proof}`, { confirm: true })).s, 200);
  assert.equal((await r2.prepare("SELECT eid FROM profile_job WHERE user_id=?").bind(a.T).first()).eid, "ceo");
  assert.deepEqual(((await r2.prepare("SELECT eid FROM profile_industry WHERE user_id=?").bind(a.T).all()).results || []).map((r) => r.eid), ["energy"]);
  // Loeschen des Ziels entfernt auch die Reste am stillgelegten Konto
  assert.equal((await call(e2, "DELETE", "/api/me", `m365s=${a.tSess}`)).s, 200);
  assert.equal((await r2.prepare("SELECT COUNT(*) n FROM profile_job").first()).n + (await r2.prepare("SELECT COUNT(*) n FROM profile_industry").first()).n, 0);
});

test("Zusammenfuehren und Loeschen: Tabellen des Event-Imports (#317) – Beanspruchung, Import-Vorschau, gemerkte Speaker-Identitaet", async () => {
  const { db, raw } = await d1(), env = { ...ENV, DB: db };
  const { tSess, T, S } = await twoAccounts(env);
  const x = (sql, ...a) => raw.prepare(sql).run(...a), n = (sql, ...a) => raw.prepare(sql).get(...a).n;
  x("INSERT INTO profiles(user_id,public,handle,updated) VALUES(?,1,'anna-old',1),(?,1,'anna',1)", S, T);
  x("INSERT INTO events(id,handle,owner_id,title,start,created,updated,unclaimed,source) VALUES(5,'herrenlos',0,'Herrenlos','2027-01-01',1,1,1,'communitydays')");
  x("INSERT INTO event_claims(event_id,user_id,status,created) VALUES(5,?,'pending',1)", S);
  x("INSERT INTO import_preview(token,user_id,data,created) VALUES('tok',?,'{\"name\":\"Anna Example\"}',1)", S);
  x("INSERT INTO speaker_ref(name,name_key,handle,created,updated) VALUES('Anna Example','anna example','anna-old',1,1)");
  x("INSERT INTO merge_log(kind,from_id,into_id,by_user,created) VALUES('event',1,2,?,1)", S);
  x("INSERT INTO dedupe_queue(kind,a_id,b_id,status,created,decided_by) VALUES('event',1,2,'separate',1,?)", S);
  const m = await link(env, tSess, "li-anna");
  assert.equal((await call(env, "POST", "/api/me/merge", `m365s=${tSess}; m365m=${m.proof}`, { confirm: true })).s, 200);
  assert.deepEqual(raw.prepare("SELECT event_id,user_id,status FROM event_claims").all().map((r) => ({ ...r })), [{ event_id: 5, user_id: T, status: "pending" }], "offene Beanspruchung wandert zum Ziel");
  assert.equal(n("SELECT COUNT(*) n FROM import_preview"), 0, "Vorschau des stillgelegten Kontos verfaellt");
  assert.equal(raw.prepare("SELECT handle FROM speaker_ref").get().handle, "anna", "gemerkte Speaker-Identitaet zeigt auf das Profil des Ziels");
  assert.equal(raw.prepare("SELECT by_user FROM merge_log").get().by_user, T); assert.equal(raw.prepare("SELECT decided_by FROM dedupe_queue").get().decided_by, T);
  // die Admin-Liste zeigt die Anfrage nun am lebenden Konto
  x("UPDATE users SET role='admin' WHERE id=?", T);
  const claims = await call(env, "GET", "/api/admin/events/claims", `m365s=${tSess}`); assert.equal(claims.s, 200); assert.deepEqual(claims.j.items.map((c) => c.user_id), [T]);
  // Loeschen des Ziels: nichts aus dem Import bleibt am Konto oder seinem Profil haengen
  x("INSERT INTO import_preview(token,user_id,data,created) VALUES('tok2',?,'{}',1)", T);
  assert.equal((await call(env, "DELETE", "/api/me", `m365s=${tSess}`)).s, 200);
  assert.equal(n("SELECT COUNT(*) n FROM event_claims") + n("SELECT COUNT(*) n FROM import_preview") + n("SELECT COUNT(*) n FROM speaker_ref WHERE handle<>''"), 0);
  assert.equal(raw.prepare("SELECT by_user FROM merge_log").get().by_user, 0); assert.equal(raw.prepare("SELECT decided_by FROM dedupe_queue").get().decided_by, 0);
});

test("KI-Token (MCP) duerfen Anmeldungen weder lesen noch aendern", async () => {
  const { db } = await d1(), env = { ...ENV, DB: db };
  const sess = await signIn(env, "gh-anna"), uid = uidOf(sess);
  const tok = await call(env, "POST", "/api/ai-token", `m365s=${sess}`, { label: "t" });
  assert.equal(tok.s, 200);
  const mcp = await W.fetch(new Request(API + "/mcp", { method: "POST", headers: { authorization: `Bearer ${tok.j.token}`, "content-type": "application/json", accept: "application/json, text/event-stream" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }) }), env);
  const text = await mcp.text();
  assert.match(text, /"tools"/, "Werkzeugliste kommt an");
  assert.ok(!/identities|merge/.test(text), "kein MCP-Tool fuer Anmeldungen oder Zusammenfuehren");
  assert.ok(uid > 0);
});
