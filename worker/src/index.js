// Community-API (Cloudflare Worker + D1): Login (Google/Microsoft), Kommentare, Abzeichen, Kurator, Push, E-Mail
import { json, cors, cookie, makeSession, readSession, readSessionInfo, sha256hex, cleanText, cleanName, randomToken, rateLimit, isLang, esc, b64u, sign, verify, audit, aiBudgetStatus, reportExternalAiUsage } from "./util.js";
import { evalBadges, stats, topUsers, badgesFor, award } from "./badges.js";
import { runDigest, runPushDigest } from "./digest.js";
import { sendMail } from "./mailer.js";
import { handleEntity, importEntitiesFromSite } from "./entities.js";
import { importLegacyBlog } from "./legacyblog.js";
import { importContentBlog } from "./contentblog.js";
import { handleA2a } from "./a2a.js";
import { handleAdminPanel } from "./adminpanel.js";
import { handleLinkedinEvents, oauthStartLE, oauthCallbackLE, deleteUserLinkedin } from "./linkedin_events.js";
import { handleSponsor, handleSponsorLink } from "./sponsor.js";
import { handleAds, handlePaypalWebhook } from "./ads.js";
import { handleSponsorOrders } from "./sponsor_orders.js";
import { autoTranslateItems, autoTranslateEntities, runTrQueue } from "./autotr.js";
import { syncLiveEvents } from "./liveevents.js";
import { syncContentTopics, handleTopics } from "./topics.js";
import { importQuotesFromSite, handleQuotes } from "./quotes.js";
import { importEpisodes, importTranslations, handleRegister } from "./register.js";
import { importSearchIndex, syncSearchVectors, handleSearch } from "./search.js";
import { entityMap } from "./entities.js";
import { handleProfiles, deleteUserData, refreshProfilesExport } from "./profiles.js";
import { handleClaimVerify } from "./claimverify.js";
import { handleOrgPair } from "./orgpair.js";
import { handleEvents, deleteUserEvents, ensureM365Con, claimLinkedinEntity, purgeEntityClaimReview } from "./events.js";
import { handleVotes } from "./votes.js";
import { handleQa, deleteUserQa } from "./qa.js";
import { handleBlog, deleteUserBlog } from "./blog.js";
import { handleUpdates, pollUpdates } from "./updates.js";
import { ensurePastEvents, linkSpeakers, linkSpeakerEntities } from "./pastevents.js";
import { handleLibrary, deleteUserLibrary } from "./library.js";
import { handleOrgOffers } from "./orgoffers.js";
import { handleWish, seedRoadmap } from "./wish.js";
import { handleShows, syncShows } from "./shows.js";
import { handleMediakit } from "./mediakit.js";
import { handleMail, flushOutbox, notify } from "./mail.js";
import { handleReviews } from "./reviews.js";
import { handleEntityInvite, remindInvites } from "./entinvite.js";
import { handleDemo } from "./demo.js";
import { handleGuests, deleteUserGuests } from "./guests.js";
import { handleExpertRequests, deleteUserExpertRequests, syncExpertVectors, closeExpiredExpertRequests } from "./expert_requests.js";
import { handlePodcast, deleteUserPodcast, pollPodcast } from "./podcast.js";
import { handleVideo, deleteUserVideos, pollVideos } from "./youtube.js";
import { handleMcp, handleTokens, deleteUserTokens } from "./mcp.js";
import { handleSeo } from "./seo_api.js";
import { handleCredits, deleteUserGuestCredits } from "./credits.js";
import { handleNotes } from "./notes.js";
import { handlePoints } from "./points.js";
import { handleMessages, purgeMessages, deleteUserMessages } from "./messages.js";
import { refreshFeeds, refreshFollowers } from "./feeds.js";
import { autoTranslate, translateStatus, uiI18nExport } from "./translate.js";
import { handleWiki } from "./wiki.js";
import { syncExpertise } from "./levels.js";
import { backfillDirectoryGeocodes, ensureDirectoryCols, handleDirectory } from "./directory.js";
import { handleTopicSubscriptions, dispatchTopicNotifications, queueTopicArticles, queueSessionReminders } from "./topic_notifications.js";
import { savePushSubscription } from "./push.js";
import { handleContributions, refreshContributions } from "./contributions.js";
import { findUserByIdentity, createUserWithIdentity, linkIdentity, mergeProof, handleIdentities, MERGE_WINDOW, freshSession, reloginFor } from "./identities.js";

const PROVIDERS = {
  google: {
    auth: "https://accounts.google.com/o/oauth2/v2/auth", token: "https://oauth2.googleapis.com/token",
    info: "https://openidconnect.googleapis.com/v1/userinfo", scope: "openid profile", id: (e) => e.GOOGLE_CLIENT_ID, secret: (e) => e.GOOGLE_CLIENT_SECRET,
  },
  microsoft: {
    auth: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize", token: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    info: "https://graph.microsoft.com/oidc/userinfo", scope: "openid profile", id: (e) => e.MS_CLIENT_ID, secret: (e) => e.MS_CLIENT_SECRET,
  },
  linkedin: {   // "Sign In with LinkedIn using OpenID Connect"
    auth: "https://www.linkedin.com/oauth/v2/authorization", token: "https://www.linkedin.com/oauth/v2/accessToken",
    info: "https://api.linkedin.com/v2/userinfo", scope: "openid profile email", id: (e) => e.LINKEDIN_CLIENT_ID, secret: (e) => e.LINKEDIN_CLIENT_SECRET,
  },
  github: {    // OAuth 2.0 ohne OIDC: Token als JSON anfordern, Profil von api.github.com/user, sub = stabile numerische ID (nie der Login-Name)
    auth: "https://github.com/login/oauth/authorize", token: "https://github.com/login/oauth/access_token",
    info: "https://api.github.com/user", scope: "read:user", id: (e) => e.GH_OAUTH_CLIENT_ID, secret: (e) => e.GH_OAUTH_CLIENT_SECRET,
    noPrompt: true, tokenHeaders: { accept: "application/json" },
    infoHeaders: { "user-agent": "m365fm", accept: "application/vnd.github+json", "x-github-api-version": "2022-11-28" },
    profile: (info) => ({ sub: info && info.id != null ? String(info.id) : "", name: (info && (info.name || info.login)) || "" }),
  },
};
const VID = /^[A-Za-z0-9_-]{5,24}$/;
const okCl = (vid, lang) => isLang(lang) || (lang === "en" && /^(blog|podcast|video|lib)\d+$/.test(vid));   // Blog-Beitraege gibt es auch auf Englisch
const now = () => Math.floor(Date.now() / 1000);
const ip = (r) => r.headers.get("cf-connecting-ip") || "0";
const html = (body, status = 200) => new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><body style="font-family:system-ui;max-width:32em;margin:12vh auto;padding:0 16px;line-height:1.5">${body}`, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });

// "Mirko Peters" -> "Mirko P." (Datenschutz: nur Vorname + Initiale als Standard)
function shortName(full) {
  const p = cleanName(full).split(" ").filter(Boolean);
  if (p.length < 2) return p[0] || "User";
  return `${p[0]} ${[...p[p.length - 1]][0]}.`;
}
const safeReturn = (env, u) => { try { const x = new URL(u); return x.origin === env.SITE ? x.href : env.SITE + "/"; } catch { return env.SITE + "/"; } };
const isAdmin = (env, u) => u.role === "admin" || (env.ADMIN_SUBS || "").split(",").map((s) => s.trim()).includes(`${u.provider}:${u.sub}`);

const firstName = (full) => cleanName(full).split(" ").filter(Boolean)[0] || "";
async function namePrefs(db, user) {
  const r = await db.prepare("SELECT real_name,name_mode FROM user_prefs WHERE user_id=?").bind(user.id).first();
  const pr = await db.prepare("SELECT handle FROM profiles WHERE user_id=?").bind(user.id).first();
  const real = r?.real_name || "";
  return { name_mode: r?.name_mode || "short", name_opts: { short: real ? shortName(real) : "", full: real, first: firstName(real), handle: pr?.handle || "" } };
}
// Rechnet den Anzeigenamen aus dem gewaehlten Modus; liefert null bei "custom" (dann gilt der eingegebene Name)
async function applyNameMode(db, user, b) {
  const mode = ["short", "full", "first", "handle", "custom"].includes(b.name_mode) ? b.name_mode : null;
  if (!mode) return null;
  const { name_opts: o } = await namePrefs(db, user);
  await db.prepare("INSERT INTO user_prefs(user_id,name_mode) VALUES(?,?) ON CONFLICT(user_id) DO UPDATE SET name_mode=excluded.name_mode").bind(user.id, mode).run();
  if (mode === "custom") return null;
  return cleanName(o[mode]) || null;
}

async function upsertUser(env, provider, sub, name) {
  const db = env.DB;
  // #279: zuerst die verknuepften Anmeldungen (user_identities), dann users.provider/sub; sonst neues Konto mit erster Identitaet
  let u = await findUserByIdentity(db, provider, sub);
  if (!u) u = await createUserWithIdentity(db, provider, sub, shortName(name));
  const rn = cleanName(name);
  if (rn) await env.DB.prepare("INSERT INTO user_prefs(user_id,real_name) VALUES(?,?) ON CONFLICT(user_id) DO UPDATE SET real_name=excluded.real_name").bind(u.id, rn).run();
  await evalBadges(env, u.id);
  return u;
}

// OAuth-Start (Anmeldung oder Verknuepfung): signiertes state-Cookie m365o = state|Ruecksprung[|Verknuepfungsabsicht].
// Die Redirect-URI bleibt fuer beide Faelle /auth/callback/<anbieter> (keine neuen URIs bei den Anbietern noetig).
async function oauthStart(env, provider, ret, intent = "") {
  const P = PROVIDERS[provider], state = randomToken(16);
  const val = `${state}|${b64u.enc(new TextEncoder().encode(ret))}${intent ? "|" + intent : ""}`;
  const q = new URLSearchParams({ client_id: P.id(env), redirect_uri: `${env.API}/auth/callback/${provider}`, response_type: "code", scope: P.scope, state, ...(provider === "linkedin" || P.noPrompt ? {} : { prompt: "select_account" }) });
  return { location: `${P.auth}?${q}`, setCookie: cookie("m365o", `${val}.${await sign(env.SESSION_SECRET, val)}`, 600) };
}

async function auth(env, request, url, path) {
  const m = /^\/auth\/(login|callback)\/(google|microsoft|linkedin|github)$/.exec(path);
  if (path === "/auth/dev" && env.DEV_LOGIN === "1") {
    const u = await upsertUser(env, "dev", url.searchParams.get("name") || "dev", url.searchParams.get("name") || "Dev User");
    return new Response(null, { status: 302, headers: { location: safeReturn(env, url.searchParams.get("return") || env.SITE), "set-cookie": cookie("m365s", await makeSession(env, u.id), 5184000) } });
  }
  if (path === "/auth/youtube/connect") {
    // Einmalige Kanal-Freigabe (m365 Show): Upload/Löschen + YouTube Analytics (Sponsor-Dashboard #173).
    // Google zeigt danach auf www.m365.fm/callback einen Code; den trägt Mirko im Workflow „YouTube verbinden (einmalig)“ ein.
    if (!env.YT_CLIENT_ID) return html("<p>YouTube not configured.</p>", 503);
    const q = new URLSearchParams({ client_id: env.YT_CLIENT_ID, redirect_uri: "https://www.m365.fm/callback", response_type: "code",
      scope: "https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/yt-analytics.readonly",
      access_type: "offline", prompt: "consent", include_granted_scopes: "true" });
    return new Response(null, { status: 302, headers: { location: `https://accounts.google.com/o/oauth2/v2/auth?${q}`, "cache-control": "no-store" } });
  }
  if (path === "/auth/linkedin-events/start" || path === "/auth/linkedin-events/callback") {   // einmalige Verbindung der LinkedIn-Seite, nur Admin
    const sess = await readSessionInfo(env, request), admin = sess ? await me(env, sess.uid) : null;
    if (!admin?.admin) return html("<p>Admin login required.</p>", 403);
    const back = (r) => new Response(null, { status: 302, headers: { location: `${env.SITE}/admin/?li=${r}#li`, "set-cookie": cookie("m365le", "", 0) } });
    if (path.endsWith("/start")) { const o = await oauthStartLE(env, admin); return o.error ? html("<p>LinkedIn not configured.</p>", 503) : new Response(null, { status: 302, headers: { location: o.location, "set-cookie": o.setCookie } }); }
    const r = await oauthCallbackLE(env, request, url, admin);
    return back(r.ok ? "ok" : r.error);
  }
  if (!m) return null;
  const P = PROVIDERS[m[2]];
  if (!P.id(env) || !P.secret(env)) return html("<p>Login not configured.</p>", 503);
  const redirect = `${env.API}/auth/callback/${m[2]}`;
  if (m[1] === "login") {
    const o = await oauthStart(env, m[2], safeReturn(env, url.searchParams.get("return") || env.SITE));
    return new Response(null, { status: 302, headers: { location: o.location, "set-cookie": o.setCookie } });
  }
  // callback
  const c = /(?:^|;\s*)m365o=([^;]+)/.exec(request.headers.get("cookie") || "");
  const code = url.searchParams.get("code"), st = url.searchParams.get("state");
  if (!c || !code || !st) return html("<p>Login failed (missing data). Please try again.</p>", 400);
  const dot = c[1].lastIndexOf("."), val = c[1].slice(0, dot);
  if (!(await verify(env.SESSION_SECRET, val, c[1].slice(dot + 1))) || val.split("|")[0] !== st) return html("<p>Login failed (invalid state).</p>", 400);
  const ret = safeReturn(env, new TextDecoder().decode(b64u.dec(val.split("|")[1])));
  const tr = await fetch(P.token, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", ...(P.tokenHeaders || {}) },
    body: new URLSearchParams({ code, client_id: P.id(env), client_secret: P.secret(env), redirect_uri: redirect, grant_type: "authorization_code" }) });
  if (!tr.ok) return html("<p>Login failed (token).</p>", 400);
  const tok = await tr.json().catch(() => ({}));
  if (!tok || !tok.access_token) return html("<p>Login failed (token).</p>", 400);   // GitHub meldet Fehler mit Status 200 und {error}
  const ir = await fetch(P.info, { headers: { authorization: `Bearer ${tok.access_token}`, ...(P.infoHeaders || {}) } });
  if (!ir.ok) return html("<p>Login failed (profile).</p>", 400);
  const raw = await ir.json().catch(() => null);
  const info = P.profile ? P.profile(raw) : { sub: raw && raw.sub ? String(raw.sub) : "", name: raw && (raw.name || raw.given_name) };
  if (!info.sub) return html("<p>Login failed.</p>", 400);
  const intent = val.split("|")[2] || "";
  if (intent) {   // #279: weitere Anmeldung an das angemeldete Konto haengen; state ist an genau diese Sitzung gebunden (Hash), max. 10 Minuten
    const sess = await readSessionInfo(env, request), [lu, lt, lh] = intent.slice(1).split(".");
    const ok = intent[0] === "L" && sess && sess.uid === +lu && now() - +lt <= MERGE_WINDOW && (await sha256hex(sess.raw)).slice(0, 32) === lh;
    const cur = ok ? await me(env, sess.uid) : null;
    if (!cur) return html("<p>Linking failed (session expired). Please sign in and try again.</p>", 400);
    const r = await linkIdentity(env, cur, m[2], info.sub);
    const target = new URL(ret); target.searchParams.set("link", r.status);
    const lh2 = new Headers({ location: target.href });
    lh2.append("set-cookie", cookie("m365o", "", 0));
    if (r.status === "merge") lh2.append("set-cookie", cookie("m365m", await mergeProof(env, cur.id, r.source), MERGE_WINDOW));
    return new Response(null, { status: 302, headers: lh2 });
  }
  const u = await upsertUser(env, m[2], info.sub, info.name || "User");
  if (u.banned) return html("<p>This account is blocked.</p>", 403);
  const h = new Headers({ location: ret });
  if (m[2] === "linkedin") {
    const target = new URL(ret), claim = target.searchParams.get("claim");
    const match = claim === "linkedin" && /^\/(?:[a-z]{2}\/)?entity\/([a-z0-9][a-z0-9-]{1,78})\/?$/i.exec(target.pathname);
    if (match) {
      const result = await claimLinkedinEntity(env, u, raw, match[1]);
      if (result.error === "claimed") {
        const response = html("<p>Dieses Profil wurde bereits beansprucht.</p>", 409);
        response.headers.append("set-cookie", cookie("m365s", await makeSession(env, u.id), 5184000));
        response.headers.append("set-cookie", cookie("m365o", "", 0));
        return response;
      }
      target.searchParams.delete("claim");
      target.searchParams.set("claim_result", result.status || result.error || "pending");
      h.set("location", target.href);
    }
  }
  h.append("set-cookie", cookie("m365s", await makeSession(env, u.id), 5184000));
  h.append("set-cookie", cookie("m365o", "", 0));
  return new Response(null, { status: 302, headers: h });
}

async function deleteAccount(env, id) {
  const db = env.DB;
  await db.batch([
    db.prepare("DELETE FROM entity_claim_review WHERE eid IN (SELECT eid FROM entity_claims WHERE user_id=?)").bind(id),
    db.prepare("DELETE FROM entity_claim_mail WHERE claim_user=?").bind(id),
    db.prepare("DELETE FROM entity_claims WHERE user_id=? AND status<>'verified'").bind(id),
    db.prepare("DELETE FROM likes WHERE user_id=? OR comment_id IN (SELECT id FROM comments WHERE user_id=?)").bind(id, id),
    db.prepare("DELETE FROM reports WHERE user_id=? OR comment_id IN (SELECT id FROM comments WHERE user_id=?)").bind(id, id),
    db.prepare("DELETE FROM comments WHERE user_id=?").bind(id), db.prepare("DELETE FROM user_badges WHERE user_id=?").bind(id),
    db.prepare("DELETE FROM push_topics WHERE user_id=? OR endpoint IN (SELECT endpoint FROM push_subs WHERE user_id=?)").bind(id, id), db.prepare("DELETE FROM email_topics WHERE user_id=?").bind(id),
    db.prepare("DELETE FROM topic_queue WHERE recipient=? OR recipient IN (SELECT endpoint FROM push_subs WHERE user_id=?)").bind(String(id), id),
    db.prepare("DELETE FROM topic_deliveries WHERE recipient=? OR recipient IN (SELECT endpoint FROM push_subs WHERE user_id=?)").bind(String(id), id),
    db.prepare("DELETE FROM topic_recipient_state WHERE recipient=? OR recipient IN (SELECT endpoint FROM push_subs WHERE user_id=?)").bind(String(id), id),
    db.prepare("DELETE FROM push_subs WHERE user_id=?").bind(id), db.prepare("DELETE FROM wiki_reports WHERE user_id=?").bind(id), db.prepare("DELETE FROM wiki_rev WHERE user_id=? AND status IN ('pending','rejected')").bind(id), db.prepare("UPDATE wiki_rev SET user_id=0 WHERE user_id=?").bind(id), db.prepare("DELETE FROM curators WHERE user_id=?").bind(id), db.prepare("DELETE FROM user_identities WHERE user_id=?").bind(id), db.prepare("DELETE FROM users WHERE id=?").bind(id),
  ]);
  await deleteUserEvents(db, id);
  await deleteUserMessages(db, id); await deleteUserTokens(db, id); await deleteUserQa(db, id); await deleteUserBlog(db, id); await deleteUserLibrary(db, id); await deleteUserPodcast(db, id); await deleteUserVideos(db, id); await deleteUserGuests(db, id); await deleteUserGuestCredits(db, id);
  await deleteUserData(db, id); await deleteUserExpertRequests(env, id);
  await deleteUserLinkedin(db, id);   // LinkedIn-Zugang dieses Admins (verschluesselte Tokens) und "veroeffentlicht von"
}

async function me(env, uid) {
  const u = await env.DB.prepare("SELECT id,provider,sub,name,bio,lang,banned,role,created FROM users WHERE id=?").bind(uid).first();
  if (!u || u.banned) return null;
  const pro = !!(await env.DB.prepare("SELECT 1 x FROM programs WHERE owner_type='u' AND owner_id=? AND verified=1 AND program IN ('mvp','mct','rd','msa','ms_employee') LIMIT 1").bind(uid).first());
  return { ...u, admin: isAdmin(env, u), editor: u.role === "editor", pro };
}

function pubComment(c, mine, liked, badges, admin) {
  return { id: c.id, parent: c.parent_id, user: { id: c.user_id, name: c.name, badges: badges.get(c.user_id) || [] }, body: c.status === "hidden" ? "" : c.body,
    hidden: c.status === "hidden", created: c.created, likes: c.likes, liked: liked.has(c.id), mine: mine === c.user_id, canDelete: mine === c.user_id || admin };
}

async function api(env, request, url, path, asUser, ctx) {
  const method = request.method, J = (d, s = 200, x) => json(d, s, env, request, x);
  if (method === "OPTIONS") return new Response(null, { status: 204, headers: cors(env, request) });
  if (asUser === undefined && method !== "GET" && !["/api/internal/ai-spend", "/api/internal/sponsor-metrics", "/api/email/unsub", "/api/mail/unsub", "/api/topics/email-unsub"].includes(path) && request.headers.get("x-requested-with") !== "m365") return J({ error: "bad_request" }, 400);   // interne Routen per CRON_KEY; Abmeldelinks (RFC 8058) senden keinen Zusatz-Header, alle per Token geschuetzt
  // asUser: vom MCP-Server (Token bereits geprueft) - dann keine Cookie-Sitzung noetig
  const uid = asUser === undefined ? await readSession(env, request) : null, user = asUser === undefined ? (uid ? await me(env, uid) : null) : asUser;
  const need = () => (user ? null : J({ error: "login" }, 401));
  const db = env.DB;

  if (path === "/api/internal/ai-spend") {
    if (method !== "POST") return J({ error: "method_not_allowed" }, 405);
    if (!env.CRON_KEY || request.headers.get("x-cron-key") !== env.CRON_KEY) return J({ error: "forbidden" }, 403);
    const b = await request.json().catch(() => ({}));
    if (b.action === "check") {
      const estimate = Number(b.estimate_eur || 0);
      if (!/^claude-haiku[-a-z0-9.]*$/i.test(String(b.model || "")) || !Number.isFinite(estimate) || estimate < 0 || estimate > 1000) return J({ error: "bad_request" }, 400);
      const status = await aiBudgetStatus(env);
      return J({ ...status, allowed: status.allowed && status.remaining_eur >= estimate });
    }
    const input = Number(b.input_tokens), output = Number(b.output_tokens);
    const cacheRead = Number(b.cache_read_input_tokens ?? 0), cacheWrite = Number(b.cache_creation_input_tokens ?? 0);   // optional: Anteile von input_tokens (Prompt-Cache)
    if (b.action !== "report" || !/^[A-Za-z0-9._:-]{1,100}$/.test(String(b.id || "")) ||
        !/^[a-z0-9_]{1,60}$/i.test(String(b.job || "")) || !/^claude-haiku[-a-z0-9.]*$/i.test(String(b.model || "")) ||
        !Number.isSafeInteger(input) || input < 0 || !Number.isSafeInteger(output) || output < 0 ||
        !Number.isSafeInteger(cacheRead) || cacheRead < 0 || !Number.isSafeInteger(cacheWrite) || cacheWrite < 0 || cacheRead + cacheWrite > input ||
        String(b.lang || "").length > 20) return J({ error: "bad_request" }, 400);
    const status = await reportExternalAiUsage(env, {
      id: b.id, job: b.job, lang: String(b.lang || ""), model: b.model, input_tokens: input, output_tokens: output, batch: b.batch === true,
      cache_read_input_tokens: cacheRead, cache_creation_input_tokens: cacheWrite,
    });
    return J({ ok: true, ...status });
  }

  const sponsor = await handleSponsor(env, request, url, path, J, user);
  if (sponsor) return sponsor;

  if (path === "/api/sponsor/order" || path === "/api/sponsor/orders" || path === "/api/admin/sponsor-orders") {   // Sponsoring-Paket per PayPal-Rechnung
    const so = await handleSponsorOrders(env, request, url, path, user, J);
    if (so) return so;
  }
  if (path.startsWith("/api/ads/") || path.startsWith("/api/admin/ads/")) {   // #281 Werbeplaetze buchen
    const ads = await handleAds(env, request, url, path, user, J, ctx);
    if (ads) return ads;
  }

  const contributions = await handleContributions(env, request, url, path, user, J);
  if (contributions) return contributions;

  if (path === "/api/health") return J({ ok: true }, 200);
  if (path === "/api/directory" || path === "/api/directory/key") {
    await ensureDirectoryCols(db);
    return (await handleDirectory(env, request, url, J)) || J({ error: "not_found" }, 404);
  }
  if (path === "/api/search") return handleSearch(env, request, url, J);
  if (path === "/api/providers") return J({ providers: Object.keys(PROVIDERS).filter((k) => PROVIDERS[k].id(env) && PROVIDERS[k].secret(env)) }, 200, { "cache-control": "public, max-age=300" });
  if (path === "/api/me/li-follow" && method === "POST") {
    if (need()) return need();
    await award(db, user.id, "li_follower");
    return J({ ok: true });
  }
  if (path === "/api/me/identities/link" && method === "POST") {   // #279: weitere Anmeldung verknuepfen (Start des OAuth-Ablaufs)
    if (asUser !== undefined) return J({ error: "forbidden" }, 403);
    if (need()) return need();
    const b = await request.json().catch(() => ({})), P = Object.hasOwn(PROVIDERS, b.provider) ? PROVIDERS[b.provider] : null;
    if (!P || !P.id(env) || !P.secret(env)) return J({ error: "bad_request" }, 400);
    if (!(await freshSession(env, request, user))) return J({ error: "fresh", relogin: await reloginFor(db, user) }, 403);   // wie beim Zusammenfuehren
    if (!(await rateLimit(db, `idl:${user.id}`, 10, 3600))) return J({ error: "rate" }, 429);
    const sess = await readSessionInfo(env, request);
    const o = await oauthStart(env, b.provider, safeReturn(env, b.return || env.SITE), `L${user.id}.${now()}.${(await sha256hex(sess.raw)).slice(0, 32)}`);
    return J({ url: o.location }, 200, { "set-cookie": o.setCookie });
  }
  const ids = await handleIdentities(env, request, url, path, user, J, asUser !== undefined);
  if (ids) return ids;
  if (path === "/api/me") {
    if (method === "GET") return J({ user: user ? { ...(await namePrefs(db, user)), id: user.id, name: user.name, bio: user.bio, lang: user.lang, admin: user.admin, editor: user.editor, provider: user.provider, ...(user.admin || user.editor ? {} : { sub_hint: `${user.provider}:${user.sub}` }), ...(await stats(db, user.id)) } : null });
    if (need()) return need();
    if (method === "POST") {
      const b = await request.json().catch(() => ({}));
      const nm = await applyNameMode(db, user, b);
      const name = nm || cleanName(b.name || user.name) || user.name, bio = cleanText(b.bio ?? user.bio, 280).replace(/https?:\/\/\S+/g, ""), lang = isLang(b.lang) ? b.lang : user.lang;
      await db.prepare("UPDATE users SET name=?,bio=?,lang=? WHERE id=?").bind(name, bio, lang, user.id).run();
      return J({ ok: true });
    }
    if (method === "DELETE") {   // Konto + alle eigenen Daten loeschen (DSGVO), auch frueher zusammengefuehrte (stillgelegte) Konten
      // rekursiv: auch Ketten R -> S -> T aus der Zeit vor dem Abflachen in mergeStatements
      const merged = (await db.prepare("WITH RECURSIVE m(id) AS (SELECT id FROM users WHERE merged_into=? UNION SELECT u.id FROM users u JOIN m ON u.merged_into=m.id) SELECT id FROM m").bind(user.id).all().catch(() => ({ results: [] }))).results || [];
      for (const x of merged) await deleteAccount(env, x.id);
      await deleteAccount(env, user.id);
      return J({ ok: true }, 200, { "set-cookie": cookie("m365s", "", 0) });
    }
  }
  if (path === "/api/logout" && method === "POST") return J({ ok: true }, 200, { "set-cookie": cookie("m365s", "", 0) });

  if (path === "/api/comments" && method === "GET") {
    const vid = url.searchParams.get("vid"), lang = url.searchParams.get("lang");
    if (!VID.test(vid || "") || !okCl(vid, lang)) return J({ error: "bad_request" }, 400);
    const rows = (await db.prepare(
      `SELECT c.id,c.user_id,c.parent_id,c.body,c.status,c.created,u.name,(SELECT COUNT(*) FROM likes l WHERE l.comment_id=c.id) likes
       FROM comments c JOIN users u ON u.id=c.user_id WHERE c.vid=? AND c.lang=? AND u.banned=0 ORDER BY c.created ASC LIMIT 300`).bind(vid, lang).all()).results || [];
    const badges = await badgesFor(db, [...new Set(rows.map((r) => r.user_id))]);
    const liked = new Set(user ? ((await db.prepare("SELECT comment_id FROM likes WHERE user_id=?").bind(user.id).all()).results || []).map((r) => r.comment_id) : []);
    return J({ comments: rows.filter((r) => r.status === "ok" || rows.some((x) => x.parent_id === r.id)).map((r) => pubComment(r, user?.id, liked, badges, user?.admin)) }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/comments" && method === "POST") {
    if (need()) return need();
    const b = await request.json().catch(() => ({}));
    const body = cleanText(b.body, 1500), vid = b.vid, lang = b.lang;
    if (!VID.test(vid || "") || !okCl(vid, lang) || body.length < 2) return J({ error: "bad_request" }, 400);
    if ((body.match(/https?:\/\//gi) || []).length > 2) return J({ error: "links" }, 400);
    if (!(await rateLimit(db, `c20:${user.id}`, 1, 20)) || !(await rateLimit(db, `c24:${user.id}`, 30, 86400))) return J({ error: "rate" }, 429);
    let parent = null;
    if (b.parent) {
      const p = await db.prepare("SELECT id,vid,lang,parent_id FROM comments WHERE id=?").bind(+b.parent).first();
      if (!p || p.vid !== vid || p.lang !== lang) return J({ error: "bad_request" }, 400);
      parent = p.parent_id || p.id;   // nur eine Ebene
    }
    const r = await db.prepare("INSERT INTO comments(vid,lang,user_id,parent_id,body,created) VALUES(?,?,?,?,?,?)").bind(vid, lang, user.id, parent, body, now()).run();
    if (parent) {   // Benachrichtigung an den Autor des Kommentars, auf den geantwortet wurde
      const pa = await db.prepare("SELECT user_id FROM comments WHERE id=?").bind(parent).first();
      if (pa && pa.user_id !== user.id) await notify(env, pa.user_id, "reply", `${user.name} hat auf deinen Kommentar geantwortet`, `<p><b>${esc(user.name)}</b> hat auf deinen Kommentar geantwortet:</p><blockquote style="border-left:3px solid #3E8BC0;margin:0;padding:.2em 1em">${esc(body.slice(0, 400))}</blockquote><p><a href="${env.SITE}/community/">Zur Diskussion / View discussion</a></p>`, `reply:${r.meta.last_row_id}`);
    }
    const earned = await evalBadges(env, user.id);
    return J({ ok: true, id: r.meta.last_row_id, earned });
  }
  let m;
  if ((m = /^\/api\/comments\/(\d+)\/(like|report)$/.exec(path)) && method === "POST") {
    if (need()) return need();
    const id = +m[1], c = await db.prepare("SELECT id,user_id,status FROM comments WHERE id=?").bind(id).first();
    if (!c) return J({ error: "not_found" }, 404);
    if (!(await rateLimit(db, `a60:${user.id}`, 60, 3600))) return J({ error: "rate" }, 429);
    if (m[2] === "like") {
      if (c.user_id === user.id) return J({ error: "own" }, 400);
      const ex = await db.prepare("SELECT 1 x FROM likes WHERE comment_id=? AND user_id=?").bind(id, user.id).first();
      if (ex) await db.prepare("DELETE FROM likes WHERE comment_id=? AND user_id=?").bind(id, user.id).run();
      else { await db.prepare("INSERT INTO likes(comment_id,user_id,created) VALUES(?,?,?)").bind(id, user.id, now()).run(); await evalBadges(env, c.user_id); }
      return J({ ok: true, liked: !ex });
    }
    await db.prepare("INSERT OR IGNORE INTO reports(comment_id,user_id,created) VALUES(?,?,?)").bind(id, user.id, now()).run();
    const n = (await db.prepare("SELECT COUNT(*) n FROM reports WHERE comment_id=?").bind(id).first()).n;
    if (n >= 3 && c.status === "ok") {
      await db.prepare("UPDATE comments SET status='hidden' WHERE id=?").bind(id).run();
      const rs = (await db.prepare("SELECT user_id FROM reports WHERE comment_id=?").bind(id).all()).results || [];
      for (const r of rs) await evalBadges(env, r.user_id);
    }
    return J({ ok: true });
  }
  if ((m = /^\/api\/comments\/(\d+)$/.exec(path)) && method === "DELETE") {
    if (need()) return need();
    const c = await db.prepare("SELECT user_id FROM comments WHERE id=?").bind(+m[1]).first();
    if (!c || (c.user_id !== user.id && !user.admin)) return J({ error: "forbidden" }, 403);
    await db.batch([db.prepare("DELETE FROM likes WHERE comment_id=?").bind(+m[1]), db.prepare("DELETE FROM reports WHERE comment_id=?").bind(+m[1]), db.prepare("DELETE FROM comments WHERE id=? OR parent_id=?").bind(+m[1], +m[1])]);
    return J({ ok: true });
  }

  if (/^\/api\/points(\/|$)/.test(path) || path.startsWith("/api/admin/points/")) { const p = await handlePoints(env, request, url, path, user, J); if (p) return p; }
  if (/^\/api\/msg(\/|$)/.test(path)) { const p = await handleMessages(env, request, url, path, user, J); if (p) { if (user && method !== "GET") await evalBadges(env, user.id).catch(() => 0); return p; } }
  if (path === "/api/admin/org-pair") { const q = await handleOrgPair(env, request, url, path, user, J); if (q) return q; }
  if (/^\/api\/entity\/claim\/(domains|domain|forward|confirm)$/.test(path)) return handleClaimVerify(env, request, url, path, user, J);
  if (/^\/api\/(events?|speaker)(\/|$)/.test(path) || /^\/api\/entity\/claims?(\/|$)/.test(path) || /^\/api\/admin\/entity\/claims?$/.test(path)) { const p = await handleEvents(env, request, url, path, user, J); if (p) { if (user && method !== "GET") await evalBadges(env, user.id).catch(() => 0); return p; } }
  if (path === "/api/ui-i18n" && request.method === "GET") return J(await uiI18nExport(env), 200, { "cache-control": "public, max-age=300" });
  if (path === "/api/admin/translate" && user?.admin) {   // Status und Notaus der Auto-Uebersetzung
    if (request.method === "POST") { const b = await request.json().catch(() => ({})); await env.DB.prepare("INSERT INTO meta(k,v) VALUES('tr_off',?) ON CONFLICT(k) DO UPDATE SET v=excluded.v").bind(b.off ? "1" : "0").run(); }
    return J(await translateStatus(env));
  }
  if (path.startsWith("/api/ai-token")) { const k = await handleTokens(env, request, url, path, user, J); if (k) return k; }
  if (path === "/api/admin/demo") { const q = await handleDemo(env, request, url, path, user, J); if (q) return q; }
  if (path.startsWith("/api/guests/")) { const q = await handleGuests(env, request, url, path, user, J); if (q) return q; }
  if (path.startsWith("/api/expert-requests/") || path.startsWith("/api/admin/expert-requests/") ||
      path.startsWith("/api/expert-calls") || path.startsWith("/api/expert-settings") || path === "/api/experts/search") {
    const q = await handleExpertRequests(env, request, path, user, J, ctx); if (q) return q;
  }
  if (path.startsWith("/api/video/") || path.startsWith("/api/admin/video")) { const q = await handleVideo(env, request, url, path, user, J); if (q) { if (user && method !== "GET") await evalBadges(env, user.id).catch(() => 0); return q; } }
  if (path.startsWith("/api/podcast/") || path.startsWith("/api/admin/podcast")) { const q = await handlePodcast(env, request, url, path, user, J); if (q) { if (user && method !== "GET") await evalBadges(env, user.id).catch(() => 0); return q; } }
  if (path === "/api/updates/export" || path === "/api/admin/updates/poll") { const q = await handleUpdates(env, request, url, path, user, J); if (q) return q; }
  if (path.startsWith("/api/reviews")) { const q = await handleReviews(env, request, url, path, user, J); if (q) return q; }
  if (path.startsWith("/api/entityinvite/")) { const q = await handleEntityInvite(env, request, url, path, user, J); if (q) return q; }
  if (path === "/api/mediakit" || path === "/api/mediakit/summary" || path === "/api/admin/mediakit") { const q = await handleMediakit(env, request, url, path, user, J); if (q) return q; }
  if (path.startsWith("/api/mail/") || path.startsWith("/api/admin/mail")) { const q = await handleMail(env, request, url, path, user, J); if (q) return q; }
  if (path.startsWith("/api/show/") || path.startsWith("/api/admin/show")) { const q = await handleShows(env, request, url, path, user, J); if (q) return q; }
  if (path.startsWith("/api/wish/")) { const q = await handleWish(env, request, url, path, user, J); if (q) return q; }
  if (path.startsWith("/api/orgoffer/")) { const q = await handleOrgOffers(env, request, url, path, user, J); if (q) return q; }
  if (path.startsWith("/api/library/")) { const q = await handleLibrary(env, request, url, path, user, J); if (q) return q; }
  if (path === "/api/blog" || path.startsWith("/api/blog/") || path.startsWith("/api/admin/blog")) { const q = await handleBlog(env, request, url, path, user, J); if (q) { if (user && method !== "GET") await evalBadges(env, user.id).catch(() => 0); return q; } }
  if (path === "/api/qa" || path.startsWith("/api/qa/")) { const q = await handleQa(env, request, url, path, user, J); if (q) return q; }
  if (path.startsWith("/api/notes/")) { const q = await handleNotes(env, request, url, path, user, J); if (q) return q; }
  if (path.startsWith("/api/credit/")) { const q = await handleCredits(env, request, url, path, user, J); if (q) return q; }
  if (path.startsWith("/api/seo/")) { const q = await handleSeo(env, request, url, path, user, J); if (q) return q; }
  if (path.startsWith("/api/edits/")) { const v = await handleVotes(env, request, url, path, user, J); if (v) return v; }
  if (path.startsWith("/api/admin/linkedin/")) return await handleLinkedinEvents(env, request, url, path, user, J);
  if (path.startsWith("/api/admin/panel/")) return await handleAdminPanel(env, request, url, path, user, J);
  if (path.startsWith("/api/entity") || path.startsWith("/api/admin/entity")) { const e = await handleEntity(env, request, url, path, user, J); if (e) return e; }
  if (/^\/api\/(profile|profiles|endorse|cert-endorse|vote|feed|org|orgs|img|recommend)(\/|$)/.test(path) || path === "/api/admin/verify" || path === "/api/admin/cert-queue" || path === "/api/admin/feed-hide") { const p = await handleProfiles(env, request, url, path, user, J); if (p) { if (user && method !== "GET") await evalBadges(env, user.id).catch(() => 0); return p; } }
  if (path === "/api/wiki" || path.startsWith("/api/wiki/") || path.startsWith("/api/admin/wiki")) { const w = await handleWiki(env, request, url, path, user, J); if (w) return w; }

  if (path === "/api/curator" && method === "GET") {
    const lang = url.searchParams.get("lang");
    if (!isLang(lang)) return J({ error: "bad_request" }, 400);
    const d = new Date(), since = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1) / 1000;
    const top = await topUsers(db, lang, since, 5), bm = await badgesFor(db, top.map((t) => t.id));
    const last = await db.prepare("SELECT c.month,c.points,u.id,u.name,u.bio FROM curators c JOIN users u ON u.id=c.user_id WHERE c.lang=? ORDER BY c.month DESC LIMIT 1").bind(lang).first();
    return J({ month: d.toISOString().slice(0, 7), top: top.map((t) => ({ ...t, badges: bm.get(t.id) || [] })), last: last || null }, 200, { "cache-control": "public, max-age=300" });
  }
  if ((m = /^\/api\/u\/(\d+)$/.exec(path)) && method === "GET") {
    const u = await db.prepare("SELECT id,name,bio,lang,created FROM users WHERE id=? AND banned=0").bind(+m[1]).first();
    if (!u) return J({ error: "not_found" }, 404);
    const rc = (await db.prepare("SELECT vid,lang,substr(body,1,160) body,created FROM comments WHERE user_id=? AND status='ok' ORDER BY created DESC LIMIT 5").bind(u.id).all()).results || [];
    const cur = (await db.prepare("SELECT lang,month FROM curators WHERE user_id=? ORDER BY month DESC").bind(u.id).all()).results || [];
    return J({ user: u, ...(await stats(db, u.id)), recent: rc, curator: cur }, 200, { "cache-control": "public, max-age=120" });
  }

  const topicResponse = await handleTopicSubscriptions(env, request, url, path, user, J);
  if (topicResponse) return topicResponse;

  if (path === "/api/push/key" && method === "GET") return J({ key: env.VAPID_PUBLIC || "" });
  if (path === "/api/push/status" && method === "GET") {
    const endpoint = String(url.searchParams.get("endpoint") || "").slice(0, 600);
    if (!/^https:\/\//.test(endpoint)) return J({ error: "bad_request" }, 400);
    const sub = await db.prepare("SELECT user_id,digest FROM push_subs WHERE endpoint=?").bind(endpoint).first();
    const topics = sub ? (await db.prepare("SELECT 1 x FROM push_topics WHERE endpoint=? LIMIT 1").bind(endpoint).first()) : null;
    return J({ registered: !!sub, digest: !!sub?.digest, topics: !!topics }, 200, { "cache-control": "no-store" });
  }
  if (path === "/api/push/subscribe" && method === "POST") {
    const b = await request.json().catch(() => ({}));
    const e = b.endpoint, k = b.keys || {};
    if (!/^https:\/\//.test(e || "") || e.length > 600 || !k.p256dh || !k.auth || !(b.lang === "en" || isLang(b.lang))) return J({ error: "bad_request" }, 400);
    if (!(await rateLimit(db, `ps:${ip(request)}`, 20, 3600))) return J({ error: "rate" }, 429);
    await savePushSubscription(db, {
      endpoint: e, p256dh: String(k.p256dh), auth: String(k.auth), lang: b.lang,
      userId: user?.id ?? null, created: now(), digest: b.digest === 0 ? 0 : 1,
    });
    if (user) await award(db, user.id, "notified");
    return J({ ok: true });
  }
  if (path === "/api/push/digest" && method === "POST") {
    const b = await request.json().catch(() => ({})), endpoint = String(b.endpoint || "").slice(0, 600);
    if (!/^https:\/\//.test(endpoint) || typeof b.on !== "boolean") return J({ error: "bad_request" }, 400);
    const sub = await db.prepare("SELECT user_id FROM push_subs WHERE endpoint=?").bind(endpoint).first();
    if (!sub || (b.on && sub.user_id && sub.user_id !== user?.id)) return J({ error: "bad_subscription" }, 400);
    await db.prepare("UPDATE push_subs SET digest=? WHERE endpoint=?").bind(b.on ? 1 : 0, endpoint).run();
    return J({ ok: true, digest: b.on });
  }
  if (path === "/api/push/unsubscribe" && method === "POST") {
    const b = await request.json().catch(() => ({}));
    if (b.endpoint) await db.batch([db.prepare("DELETE FROM push_topics WHERE endpoint=?").bind(String(b.endpoint)), db.prepare("DELETE FROM topic_queue WHERE channel='push' AND recipient=?").bind(String(b.endpoint)), db.prepare("DELETE FROM topic_deliveries WHERE channel='push' AND recipient=?").bind(String(b.endpoint)), db.prepare("DELETE FROM topic_recipient_state WHERE channel='push' AND recipient=?").bind(String(b.endpoint)), db.prepare("DELETE FROM push_subs WHERE endpoint=?").bind(String(b.endpoint))]);
    return J({ ok: true });
  }

  if (path === "/api/email/subscribe" && method === "POST") {
    const b = await request.json().catch(() => ({}));
    const email = String(b.email || "").trim().toLowerCase();
    if (!/^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,}$/.test(email) || !isLang(b.lang)) return J({ error: "bad_request" }, 400);
    if (!(await rateLimit(db, `em:${ip(request)}`, 5, 3600)) || !(await rateLimit(db, `em:${email}`, 3, 86400))) return J({ error: "rate" }, 429);
    const ex = await db.prepare("SELECT token,confirmed FROM email_subs WHERE email=? AND lang=?").bind(email, b.lang).first();
    if (ex?.confirmed) return J({ ok: true });
    const token = ex?.token || randomToken(18);
    if (!ex) await db.prepare("INSERT INTO email_subs(email,lang,token,confirmed,created) VALUES(?,?,?,0,?)").bind(email, b.lang, token, now()).run();
    const link = `${env.API}/api/email/confirm?token=${encodeURIComponent(token)}&lang=${b.lang}`;
    await sendMail(env, { to: email, subject: "M365.FM – please confirm / bitte bestätigen",
      html: `<p>Please confirm your subscription to new M365.FM episodes (${esc(b.lang)}):</p><p><a href="${link}">${link}</a></p><p>Bitte bestätige dein Abo neuer M365.FM-Folgen. Wenn du das nicht warst, ignoriere diese E-Mail.</p>` });
    return J({ ok: true });
  }
  if (path === "/api/email/confirm" && method === "GET") {
    const t = url.searchParams.get("token") || "", lang = isLang(url.searchParams.get("lang")) ? url.searchParams.get("lang") : "en";
    const r = await db.prepare("UPDATE email_subs SET confirmed=1 WHERE token=?").bind(t).run();
    return html(r.meta.changes ? `<h2>✓ Subscription confirmed</h2><p><a href="${env.SITE}/${lang}/">${env.SITE.replace("https://", "")}</a></p>` : "<p>Link invalid or expired.</p>", r.meta.changes ? 200 : 404);
  }
  if (path === "/api/email/unsub" && (method === "GET" || method === "POST")) {
    const t = url.searchParams.get("token") || "";
    const weekly = await db.prepare("SELECT email FROM mail_weekly_unsub WHERE token=?").bind(t).first().catch(() => null);
    if (weekly && url.searchParams.get("lang") === "all") {
      await db.batch([
        db.prepare("DELETE FROM email_subs WHERE lower(email)=lower(?)").bind(weekly.email),
        db.prepare("INSERT OR REPLACE INTO mail_prefs(user_id,kind,on_) SELECT user_id,'weekly',0 FROM mail_addr WHERE lower(email)=lower(?)").bind(weekly.email),
        db.prepare("DELETE FROM mail_weekly_unsub WHERE email=?").bind(weekly.email),
      ]);
    } else {
      await db.prepare("DELETE FROM email_subs WHERE token=?").bind(t).run();
    }
    return method === "POST" ? new Response("ok") : html("<h2>✓ Unsubscribed</h2><p>You will not receive further e-mails.</p>");
  }

  if (path === "/api/quotes/export" && method === "GET") return handleQuotes(env, url, J);   // Quotes an Personen-Entitaeten (?person=, ?lang=)
  if (path === "/api/topics/export" || path === "/api/admin/panel/topic") { const q = await handleTopics(env, request, url, path, user, J); if (q) return q; }
  if (path === "/api/episodes/export" || path === "/api/translations/export") { const q = await handleRegister(env, request, url, path, user, J); if (q) return q; }
  if (path === "/api/tr-queue" && method === "GET") {   // Vormerkliste fuer die Uebersetzungs-Pipelines (translate_blog.py --queue): nur Schluessel
    const rows = (await db.prepare("SELECT kind,item_id,lang FROM tr_queue WHERE status='open' ORDER BY created LIMIT 5000").all().catch(() => ({ results: [] }))).results || [];
    return J({ items: rows }, 200, { "cache-control": "public, max-age=120" });
  }
  if (path.startsWith("/api/admin/")) {
    const keyOk = env.CRON_KEY && (request.headers.get("x-cron-key") === env.CRON_KEY || url.searchParams.get("key") === env.CRON_KEY);   // Header bevorzugt (Query landet in Logs)
    if ((path === "/api/admin/run-weekly" || path === "/api/admin/run-daily") && keyOk) return J(await runDigest(env, { dry: url.searchParams.get("dry") === "1" }));
    if (!user?.admin) return J({ error: "forbidden" }, 403);
    if (path === "/api/admin/expertise-sync" && method === "POST") { const r = await syncExpertise(env, entityMap); await audit(db, user.id, "expertise-sync", "", JSON.stringify(r)); return J(r); }   // Stufen sofort neu berechnen
    if (path === "/api/admin/reports" && method === "GET") {
      const rows = (await db.prepare("SELECT c.id,c.vid,c.lang,c.body,c.status,c.user_id,(SELECT COUNT(*) FROM reports r WHERE r.comment_id=c.id) n FROM comments c WHERE c.id IN (SELECT comment_id FROM reports) ORDER BY n DESC LIMIT 50").all()).results || [];
      return J({ reports: rows });
    }
    if ((m = /^\/api\/admin\/(hide|show)\/(\d+)$/.exec(path)) && method === "POST") { await db.prepare("UPDATE comments SET status=? WHERE id=?").bind(m[1] === "hide" ? "hidden" : "ok", +m[2]).run(); return J({ ok: true }); }
    if (path === "/api/admin/users" && method === "GET") {
      const q = cleanName(url.searchParams.get("q") || "").replace(/[%_]/g, "");
      const rows = (await db.prepare("SELECT id,name,role,banned FROM users WHERE name LIKE ? ORDER BY (role='editor') DESC, id DESC LIMIT 20").bind(`%${q}%`).all()).results || [];
      return J({ users: rows });
    }
    if ((m = /^\/api\/admin\/role\/(\d+)$/.exec(path)) && method === "POST") {
      const b = await request.json().catch(() => ({})), role = b.role === "editor" ? "editor" : b.role === "admin" ? "admin" : "user";   // Rollen in der Datenbank: user, editor, admin
      await db.prepare("UPDATE users SET role=? WHERE id=?").bind(role, +m[1]).run(); await audit(db, user.id, "role", m[1], role);
      await evalBadges(env, +m[1]);
      return J({ ok: true, role });
    }
    if ((m = /^\/api\/admin\/ban\/(\d+)$/.exec(path)) && method === "POST") { await db.prepare("UPDATE users SET banned=1 WHERE id=?").bind(+m[1]).run(); await audit(db, user.id, "ban", m[1]); return J({ ok: true }); }
  }
  return J({ error: "not_found" }, 404);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url), path = url.pathname.replace(/\/+$/, "") || "/";
    try {
      if (path === "/robots.txt") return new Response("User-agent: *\nDisallow: /go/\n", {
        headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
      });
      if (path.startsWith("/go/")) return await handleSponsorLink(env, request, url, path, ctx);
      if (path === "/paypal/webhook") return await handlePaypalWebhook(env, request);   // #281: Signatur wird vor jeder Aktion bei PayPal geprueft
      if (path.startsWith("/auth/")) return (await auth(env, request, url, path)) || new Response("not found", { status: 404 });
      if (path === "/mcp") return await handleMcp(env, request, (uid) => me(env, uid), (req, user) => api(env, req, new URL(req.url), new URL(req.url).pathname, user, ctx));
      if (path === "/a2a") return await handleA2a(env, request);
      if (path.startsWith("/api/")) return await api(env, request, url, path, undefined, ctx);
      return new Response("M365.FM community API", { status: 200, headers: { "content-type": "text/plain" } });
    } catch (e) {
      const rid = crypto.randomUUID().slice(0, 8);   // Request-ID: steht in der Antwort und im Log (Workers Logs), damit ein gemeldeter Fehler auffindbar ist
      console.error("error", rid, request.method, path, String(e && e.stack || e).slice(0, 600));
      return json({ error: "server", rid }, 500, env, request, { "x-request-id": rid });
    }
  },
  async scheduled(event, env, ctx) {
    // Jede Aufgabe mit Protokoll (cron_runs: Start, Ende, ok, Fehlertext) statt verschluckter Fehler.
    const scheduledAt = event.scheduledTime || Date.now();
    const tick = new Date(scheduledAt);
    if (event.cron === "*/30 * * * *" && tick.getUTCHours() === 6 && tick.getUTCMinutes() === 0) return;
    const T = (name, fn) => ctx.waitUntil(track(env, name, fn));
    if (event.cron === "*/15 * * * *") {
      T("topicSessionReminders", async () => {
        const queued = await queueSessionReminders(env);
        const dispatched = await dispatchTopicNotifications(env);
        return { queued, dispatched };
      });
      return;
    }
    if (event.cron === "0 6 * * *") {
      T("runPushDigest", () => runPushDigest(env));
      T("runDigest", () => runDigest(env, { at: scheduledAt }));
    }
    if (event.cron === "*/30 * * * *") T("runDigest", () => runDigest(env, { at: scheduledAt }));
    T("refreshFeeds", () => refreshFeeds(env));
    T("refreshContributions", () => refreshContributions(env));
    T("pollUpdates", () => pollUpdates(env));
    T("queueTopicArticles", () => queueTopicArticles(env));
    T("dispatchTopicNotifications", () => dispatchTopicNotifications(env));
    T("refreshFollowers", () => refreshFollowers(env));
    T("ensurePastEvents", () => ensurePastEvents(env).then(() => linkSpeakers(env)).then(() => linkSpeakerEntities(env)));
    T("ensureM365Con", () => ensureM365Con(env).then(() => linkSpeakers(env)).then(() => linkSpeakerEntities(env)));
    T("seedRoadmap", () => seedRoadmap(env));
    T("purgeMessages", () => purgeMessages(env.DB));
    T("purgeEntityClaimReview", () => purgeEntityClaimReview(env.DB));
    T("autoTranslate", () => autoTranslate(env));
    T("autoTranslateItems", () => autoTranslateItems(env));
    T("autoTranslateEntities", () => autoTranslateEntities(env, entityMap));
    T("pollPodcast", () => pollPodcast(env));
    T("pollVideos", () => pollVideos(env));
    T("syncShows", () => syncShows(env));
    T("flushOutbox", () => flushOutbox(env));
    T("importLegacyBlog", () => importLegacyBlog(env));
    T("importContentBlog", () => importContentBlog(env));   // T15: Content-Pakete aus imports/blog/
    T("refreshProfilesExport", () => refreshProfilesExport(env));
    T("backfillDirectoryGeocodes", () => backfillDirectoryGeocodes(env));
    T("remindInvites", () => remindInvites(env));
    T("runTrQueue", () => runTrQueue(env, entityMap));
    T("syncLiveEvents", () => syncLiveEvents(env, entityMap));
    T("syncContentTopics", () => syncContentTopics(env));
    T("importEntitiesFromSite", () => importEntitiesFromSite(env));
    T("importQuotesFromSite", () => importQuotesFromSite(env));
    T("importEpisodes", () => importEpisodes(env));
    T("importTranslations", () => importTranslations(env));
    T("importSearchIndex", () => importSearchIndex(env));
    T("syncSearchVectors", () => syncSearchVectors(env));
    T("syncExpertVectors", () => syncExpertVectors(env));
    T("closeExpiredExpertRequests", () => closeExpiredExpertRequests(env));
    T("syncExpertise", () => syncExpertise(env, entityMap));   // */30 kehrt um 06:00 oben zurueck, daher nicht doppelt
    ctx.waitUntil(env.DB.prepare("DELETE FROM cron_runs WHERE started<?").bind(Math.floor(Date.now() / 1000) - 7 * 86400).run().catch(() => 0));
  },
};

async function track(env, name, fn) {   // Lauf protokollieren; ein Fehler bricht die uebrigen Aufgaben nicht ab
  const t0 = Math.floor(Date.now() / 1000); let id = 0;
  try { id = (await env.DB.prepare("INSERT INTO cron_runs(name,started) VALUES(?,?) RETURNING id").bind(name, t0).first())?.id || 0; } catch { /* Tabelle fehlt bis zur Migration */ }
  let ok = 1, info = "";
  try { const r = await fn(); info = r && typeof r === "object" ? JSON.stringify(r).slice(0, 300) : ""; } catch (e) { ok = 0; info = String(e && e.message || e).slice(0, 300); console.error("cron", name, info); }
  if (id) await env.DB.prepare("UPDATE cron_runs SET finished=?,ok=?,info=? WHERE id=?").bind(Math.floor(Date.now() / 1000), ok, info, id).run().catch(() => 0);
}
