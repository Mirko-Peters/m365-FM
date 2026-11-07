// #279: Mehrere Anmeldungen je Profil (user_identities) und Zusammenfuehren doppelter Konten.
// Regeln: eine Identitaet (Anbieter + Kennung) gehoert genau einem Konto; die letzte Anmeldung ist nicht entfernbar;
// kein Abgleich ueber E-Mail; Zusammenfuehren nur mit frischem Nachweis beider Konten in derselben Sitzung (< 10 Min);
// gesperrte Konten werden nicht zusammengefuehrt; Rollen (admin, editor) des Quellkontos werden nie uebertragen.
import { cookie, sign, verify, rateLimit, audit, readSessionInfo } from "./util.js";
import { evalBadges } from "./badges.js";

export const MERGE_WINDOW = 600;   // Sekunden: frische Anmeldung mit beiden Konten
const now = () => Math.floor(Date.now() / 1000);
// Neue Identitaet anlegen; eine verwaiste Zeile (Konto inzwischen geloescht, z. B. vom alten Worker vor dem Deploy) wird uebernommen,
// eine Zeile mit lebendem Besitzer nie (kein Uebernahmeweg). Ohne das blieb die Anmeldung am geloeschten Konto haengen.
const IDENTITY_UPSERT = "INSERT INTO user_identities(user_id,provider,sub,created) VALUES(?,?,?,?) ON CONFLICT(provider,sub) DO UPDATE SET user_id=excluded.user_id WHERE NOT EXISTS (SELECT 1 FROM users WHERE id=user_identities.user_id)";
const adminSub = (env, provider, sub) => (env.ADMIN_SUBS || "").split(",").map((s) => s.trim()).includes(`${provider}:${sub}`);

// Frische Anmeldung der aktuellen Sitzung (< MERGE_WINDOW): noetig fuer Verknuepfen, Entfernen und Zusammenfuehren. Sonst koennte eine
// alte oder entwendete Sitzung eine fremde Anmeldung anhaengen und die des Inhabers entfernen (dauerhafte Uebernahme).
export async function freshSession(env, request, user) {
  const sess = await readSessionInfo(env, request);
  return !!sess && sess.uid === user.id && now() - sess.iat <= MERGE_WINDOW;
}
export async function reloginFor(db, user) {
  return (await db.prepare("SELECT provider FROM user_identities WHERE user_id=? ORDER BY created,id LIMIT 1").bind(user.id).first())?.provider || user.provider;
}

let ensured = false;
// Sicherheitsnetz, falls Migration 0025 noch nicht angewendet ist (wie die uebrigen ensure*-Funktionen)
export async function ensureIdentities(db) {
  if (ensured) return;
  try { await db.prepare("SELECT 1 FROM user_identities LIMIT 1").first(); }
  catch {
    await db.prepare("CREATE TABLE IF NOT EXISTS user_identities (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, provider TEXT NOT NULL, sub TEXT NOT NULL, created INTEGER NOT NULL, UNIQUE (provider, sub))").run();
    await db.prepare("CREATE INDEX IF NOT EXISTS idx_user_identities_user ON user_identities(user_id)").run();
    await db.prepare("INSERT OR IGNORE INTO user_identities(user_id,provider,sub,created) SELECT id,provider,sub,created FROM users").run();
  }
  try { await db.prepare("SELECT merged_into FROM users LIMIT 1").first(); }
  catch {
    for (const c of ["merged_into INTEGER", "merged_at INTEGER NOT NULL DEFAULT 0"]) { try { await db.prepare(`ALTER TABLE users ADD COLUMN ${c}`).run(); } catch { /* Spalte existiert schon */ } }
  }
  ensured = true;
}

// Konto zu einer Anmeldung: zuerst user_identities, dann (alte Konten) users.provider/sub
export async function findUserByIdentity(db, provider, sub) {
  await ensureIdentities(db);
  const u = await db.prepare("SELECT u.* FROM user_identities i JOIN users u ON u.id=i.user_id WHERE i.provider=? AND i.sub=?").bind(provider, sub).first();
  if (u) return u;
  const legacy = await db.prepare("SELECT * FROM users WHERE provider=? AND sub=?").bind(provider, sub).first();
  if (!legacy) return null;
  await db.prepare(IDENTITY_UPSERT).bind(legacy.id, provider, sub, legacy.created || now()).run();
  return legacy;
}

export async function createUserWithIdentity(db, provider, sub, name) {
  await ensureIdentities(db);
  const t = now(), r = await db.prepare("INSERT INTO users(provider,sub,name,created) VALUES(?,?,?,?)").bind(provider, sub, name, t).run();
  const id = r.meta.last_row_id;
  await db.prepare(IDENTITY_UPSERT).bind(id, provider, sub, t).run();
  return db.prepare("SELECT * FROM users WHERE id=?").bind(id).first();
}

// Callback mit Verknuepfungsabsicht: Identitaet an den angemeldeten Nutzer haengen statt ein Konto anzulegen
export async function linkIdentity(env, user, provider, sub) {
  const db = env.DB, owner = await findUserByIdentity(db, provider, sub);
  if (!owner) {
    await db.prepare(IDENTITY_UPSERT).bind(user.id, provider, sub, now()).run();
    await audit(db, user.id, "identity-link", provider);
    return { status: "ok" };
  }
  if (owner.id === user.id) return { status: "already" };
  if (owner.banned || owner.merged_into) return { status: "banned" };
  return { status: "merge", source: owner.id };
}

// Nachweis "diese Sitzung hat soeben auch Konto <source> kontrolliert" (signiert, 10 Minuten)
export async function mergeProof(env, target, source) {
  const body = `${target}.${source}.${now()}`;
  return `${body}.${await sign(env.SESSION_SECRET, "merge|" + body)}`;
}
async function readMergeProof(env, request, target) {
  const m = /(?:^|;\s*)m365m=([^;]+)/.exec(request.headers.get("cookie") || "");
  if (!m) return null;
  const [t0, s0, at, sig] = m[1].split(".");
  if (!sig || !(await verify(env.SESSION_SECRET, `merge|${t0}.${s0}.${at}`, sig))) return null;
  if (+t0 !== target || !(+s0 > 0) || now() - +at > MERGE_WINDOW || +at > now() + 60) return null;
  return { source: +s0, at: +at };
}
const clearProof = () => ({ "set-cookie": cookie("m365m", "", 0) });

const COUNTS = {
  comments: "SELECT COUNT(*) n FROM comments WHERE user_id=?",
  likes: "SELECT COUNT(*) n FROM likes WHERE user_id=?",
  badges: "SELECT COUNT(*) n FROM user_badges WHERE user_id=?",
  posts: "SELECT COUNT(*) n FROM blog_posts WHERE user_id=?",
  contributions: "SELECT COUNT(*) n FROM contributions WHERE user_id=?",
  library: "SELECT COUNT(*) n FROM lib_items WHERE user_id=?",
  media: "SELECT (SELECT COUNT(*) FROM pod_episodes WHERE user_id=?1)+(SELECT COUNT(*) FROM yt_videos WHERE user_id=?1) n",
  events: "SELECT COUNT(*) n FROM events WHERE owner_id=?",
  orgs: "SELECT COUNT(*) n FROM org_members WHERE user_id=?",
  edits: "SELECT (SELECT COUNT(*) FROM wiki_rev WHERE user_id=?1)+(SELECT COUNT(*) FROM entity_rev WHERE user_id=?1) n",
  signins: "SELECT COUNT(*) n FROM user_identities WHERE user_id=?",
};
export async function mergeCounts(db, uid) {
  const out = {};
  for (const [k, sql] of Object.entries(COUNTS)) out[k] = Number((await db.prepare(sql).bind(uid).first().catch(() => null))?.n || 0);
  return out;
}

// Alle Zeilen des Quellkontos S auf das Zielkonto T umschreiben (eine atomare D1-Batch).
// Konflikte bei UNIQUE/PRIMARY KEY: die Zeile von T bleibt; Stimmen, Mitgliedschaften und Einstellungen von S entfallen dann,
// Inhalte (Blog/Bibliothek) werden mit "-<S>" am Slug umbenannt statt verworfen; Profil und Handle von T bleiben.
export async function mergeStatements(db, S, T) {
  const q = (sql, ...a) => db.prepare(sql).bind(...a);
  const prof = async (id) => db.prepare("SELECT user_id,handle FROM profiles WHERE user_id=?").bind(id).first();
  const sp = await prof(S), tp = await prof(T), sh = sp?.handle || "", th = tp?.handle || "";
  const st = [];
  const simple = (table, col = "user_id", extra = "") => st.push(q(`UPDATE ${table} SET ${col}=? WHERE ${col}=?${extra}`, T, S));
  const set = (table, col = "user_id", extra = "") => st.push(q(`UPDATE OR IGNORE ${table} SET ${col}=? WHERE ${col}=?${extra}`, T, S), q(`DELETE FROM ${table} WHERE ${col}=?${extra}`, S));
  const keepT = (table, col = "user_id", extra = "") => st.push(q(`UPDATE OR IGNORE ${table} SET ${col}=? WHERE ${col}=?${extra}`, T, S));   // eine Zeile je Konto: T gewinnt, Rest bleibt am stillgelegten S

  st.push(q("UPDATE user_identities SET user_id=? WHERE user_id=?", T, S));
  // Inhalte und Autorschaft (ohne Eindeutigkeit je Nutzer)
  for (const t of ["comments", "curators", "wiki_rev", "entity_rev", "entity_q", "entity_a", "push_subs", "push_topics", "points_spent", "api_tokens",
    "entity_claims", "episode_notes", "pod_episodes", "yt_videos", "guest_listings", "shows", "wish", "expert_requests", "mail_outbox"]) simple(t);
  simple("events", "owner_id"); simple("event_sessions", "proposer_id"); simple("event_roles", "added_by"); simple("entity_invites", "by_user");
  // Einlader: Einladungen von S gehoeren T; ist S selbst eingeladen worden, zaehlt das nur, wenn T noch keinen Einlader hat (kein doppeltes Zaehlen)
  st.push(q("UPDATE invite_success SET inviter_user_id=? WHERE inviter_user_id=?", T, S));
  st.push(q("DELETE FROM invite_success WHERE invitee_user_id=? AND EXISTS (SELECT 1 FROM invite_success x WHERE x.invitee_user_id=?)", S, T));
  st.push(q("UPDATE invite_success SET invitee_user_id=? WHERE invitee_user_id=?", T, S));
  st.push(q("DELETE FROM invite_success WHERE inviter_user_id=invitee_user_id"));
  simple("msg_messages", "from_id"); simple("sponsor_manual_metrics", "entered_by"); simple("tr_queue", "requested_by");
  // Blog und Bibliothek: UNIQUE(user_id, slug) -> Slug von S bei Kollision umbenennen
  for (const t of ["blog_posts", "lib_items"]) {
    // Zusatz -<S>-<id>: die id ist eindeutig, so kollidiert der neue Slug weder bei S noch bei T (ein schlichtes -<S> konnte es, dann scheiterte der ganze Batch)
    st.push(q(`UPDATE ${t} SET slug=slug||'-'||?||'-'||id WHERE user_id=? AND slug IN (SELECT slug FROM ${t} WHERE user_id=?)`, String(S), S, T));
    simple(t);
  }
  // Stimmen, Meldungen, Abos, Mitgliedschaften: doppelte Eintraege entfallen
  for (const t of ["user_badges", "likes", "reports", "wiki_reports", "edit_votes", "entity_a_votes", "email_topics", "item_votes", "blog_votes", "pod_votes",
    "yt_votes", "lib_votes", "wish_votes", "review_helpful", "event_attendees", "event_transfers", "item_guests", "blog_coauthors", "mail_prefs",
    "mail_topic_follows", "contribution_ignored", "msg_bonus", "certs", "cert_check", "expert_request_reports"]) set(t);
  st.push(q("DELETE FROM likes WHERE user_id=? AND comment_id IN (SELECT id FROM comments WHERE user_id=?)", T, T));   // eigene Kommentare liken geht nicht
  st.push(q("DELETE FROM reports WHERE user_id=? AND comment_id IN (SELECT id FROM comments WHERE user_id=?)", T, T));
  st.push(q("DELETE FROM blog_coauthors WHERE user_id=? AND post_id IN (SELECT id FROM blog_posts WHERE user_id=?)", T, T));
  // Rollen in Firmen und Events: die staerkere Firmenrolle gilt
  const rank = (a) => `(CASE ${a} WHEN 'owner' THEN 5 WHEN 'admin' THEN 4 WHEN 'editor' THEN 3 WHEN 'events' THEN 2 ELSE 1 END)`;
  st.push(q(`UPDATE org_members SET role=(SELECT s.role FROM org_members s WHERE s.org_id=org_members.org_id AND s.user_id=?)
    WHERE user_id=? AND EXISTS (SELECT 1 FROM org_members s WHERE s.org_id=org_members.org_id AND s.user_id=? AND ${rank("s.role")}>${rank("org_members.role")})`, S, T, S));
  st.push(q("UPDATE org_members SET status='active' WHERE user_id=? AND status<>'active' AND org_id IN (SELECT org_id FROM org_members WHERE user_id=? AND status='active')", T, S));
  // Event-Rollen ebenso: die staerkere Rolle von S gilt (gleich starke, aber andere Rollen: die von T bleibt)
  const erank = (a) => `(CASE ${a} WHEN 'organisator' THEN 4 WHEN 'co-organisator' THEN 3 WHEN 'helfer' THEN 1 ELSE 2 END)`;
  st.push(q(`UPDATE event_roles SET role=(SELECT s.role FROM event_roles s WHERE s.event_id=event_roles.event_id AND s.user_id=?)
    WHERE user_id=? AND EXISTS (SELECT 1 FROM event_roles s WHERE s.event_id=event_roles.event_id AND s.user_id=? AND ${erank("s.role")}>${erank("event_roles.role")})`, S, T, S));
  set("org_members"); set("event_roles");
  // Programme und Expertise: bestaetigte Angaben von S uebernehmen
  for (const t of ["programs", "expertise"]) {
    st.push(q(`UPDATE ${t} SET verified=1 WHERE owner_type='u' AND owner_id=? AND verified=0 AND ${t === "programs" ? "program" : "eid"} IN (SELECT ${t === "programs" ? "program" : "eid"} FROM ${t} WHERE owner_type='u' AND owner_id=? AND verified=1)`, T, S));
    set(t, "owner_id", " AND owner_type='u'");
  }
  set("expertise_evidence", "owner_id");
  st.push(q("DELETE FROM expertise_score WHERE owner_id=?", S));   // wird alle 30 Minuten neu berechnet
  // Gegenseitige Bestaetigungen und Empfehlungen; Selbst-Bestaetigungen entfallen
  for (const [t, a, b] of [["endorsements", "owner_id", "by_id"], ["cert_endorse", "owner_id", "by_id"], ["recommendations", "author_id", "subject_id"], ["msg_blocks", "user_id", "blocked_id"]]) {
    set(t, a); set(t, b); st.push(q(`DELETE FROM ${t} WHERE ${a}=? AND ${b}=?`, T, T));
  }
  // Kanaele und Feed-Eintraege (UNIQUE(owner_type, owner_id, url)): Eintraege doppelter Kanaele auf den Kanal von T umhaengen
  st.push(q("UPDATE OR IGNORE channels SET owner_id=? WHERE owner_type='u' AND owner_id=?", T, S));
  st.push(q(`UPDATE feed_items SET channel_id=(SELECT t.id FROM channels s JOIN channels t ON t.owner_type='u' AND t.owner_id=? AND t.url=s.url WHERE s.id=feed_items.channel_id)
    WHERE channel_id IN (SELECT id FROM channels WHERE owner_type='u' AND owner_id=?)`, T, S));
  st.push(q("DELETE FROM channels WHERE owner_type='u' AND owner_id=?", S));
  simple("feed_items", "owner_id", " AND owner_type='u'");
  // MVP-Beitraege: Quellen (UNIQUE(user_id,url)) zusammenlegen, Beitraege mit gleicher URL bei T belassen
  st.push(q("UPDATE OR IGNORE contribution_sources SET user_id=? WHERE user_id=?", T, S));
  st.push(q(`UPDATE contributions SET source_id=(SELECT t.id FROM contribution_sources s JOIN contribution_sources t ON t.user_id=? AND t.url=s.url WHERE s.id=contributions.source_id)
    WHERE source_id IN (SELECT id FROM contribution_sources WHERE user_id=?)`, T, S));
  st.push(q("DELETE FROM contribution_sources WHERE user_id=?", S));
  set("contributions");
  // Rezensionen: je Show eine; die von S wird ausgeblendet, nicht geloescht
  keepT("show_reviews"); st.push(q("UPDATE show_reviews SET status='merged' WHERE user_id=?", S));
  keepT("expert_request_replies");
  // Nachrichten: Gespraech zwischen S und T entfaellt; Gespraeche mit derselben Person werden zusammengelegt
  st.push(q("DELETE FROM msg_messages WHERE thread_id IN (SELECT id FROM msg_threads WHERE (a_id=? AND b_id=?) OR (a_id=? AND b_id=?))", S, T, T, S));
  st.push(q("DELETE FROM msg_threads WHERE (a_id=? AND b_id=?) OR (a_id=? AND b_id=?)", S, T, T, S));
  const other = "(CASE WHEN s.a_id=? THEN s.b_id ELSE s.a_id END)", twin = `(t.a_id=? AND t.b_id=${other}) OR (t.b_id=? AND t.a_id=${other})`;
  st.push(q(`UPDATE msg_messages SET thread_id=(SELECT t.id FROM msg_threads s JOIN msg_threads t ON ${twin} WHERE s.id=msg_messages.thread_id)
    WHERE thread_id IN (SELECT s.id FROM msg_threads s JOIN msg_threads t ON ${twin} WHERE s.a_id=? OR s.b_id=?)`, T, S, T, S, T, S, T, S, S, S));
  st.push(q(`UPDATE msg_threads SET last=MAX(last,(SELECT COALESCE(MAX(created),0) FROM msg_messages m WHERE m.thread_id=msg_threads.id)) WHERE a_id=? OR b_id=?`, T, T));
  st.push(q(`DELETE FROM msg_threads WHERE id IN (SELECT s.id FROM msg_threads s JOIN msg_threads t ON ${twin} WHERE s.a_id=? OR s.b_id=?)`, T, S, T, S, S, S));
  st.push(q("UPDATE OR IGNORE msg_threads SET a_id=? WHERE a_id=?", T, S), q("UPDATE OR IGNORE msg_threads SET b_id=? WHERE b_id=?", T, S));
  // Themen-Benachrichtigungen per E-Mail (Empfaenger = Nutzer-ID als Text)
  for (const t of ["topic_queue", "topic_deliveries", "topic_recipient_state"]) {
    st.push(q(`UPDATE OR IGNORE ${t} SET recipient=? WHERE channel='email' AND recipient=?`, String(T), String(S)), q(`DELETE FROM ${t} WHERE channel='email' AND recipient=?`, String(S)));
  }
  // Ein Datensatz je Konto: der von T bleibt; Profil (mit Handle) wandert nur, wenn T keins hat
  if (sp && !tp) { simple("profiles"); set("profile_i18n"); }
  else if (sp && tp && sh && !th) { st.push(q("UPDATE profiles SET handle=NULL WHERE user_id=?", S), q("UPDATE profiles SET handle=? WHERE user_id=?", sh, T)); }
  else if (sh && th && sh !== th) {   // Handle von S zeigt kuenftig auf T: Blog-Abos und Speaker-Eintraege umhaengen
    st.push(q("UPDATE OR IGNORE blog_follows SET handle=? WHERE handle=?", th, sh), q("DELETE FROM blog_follows WHERE handle=?", sh));
    st.push(q("UPDATE event_sessions SET speakers=replace(speakers,?,?) WHERE instr(speakers,?)>0", `"h":"${sh}"`, `"h":"${th}"`, `"h":"${sh}"`));
  }
  set("blog_follows");
  if (th || sh) st.push(q("DELETE FROM blog_follows WHERE user_id=? AND handle=?", T, th || sh));
  for (const t of ["profile_private", "profile_company", "user_prefs", "msg_prefs", "expert_settings", "profile_job"]) keepT(t);
  // Branchen (#304, bis zu 5 je Profil): wie das Profil gilt die Auswahl von T; hat T keine, uebernimmt T die von S
  st.push(q("UPDATE profile_industry SET user_id=? WHERE user_id=? AND NOT EXISTS (SELECT 1 FROM profile_industry WHERE user_id=?)", T, S, T));
  st.push(q("DELETE FROM entity_claim_mail WHERE claim_user=?", S));   // #309: offene Einmal-Links des stillgelegten Kontos gelten nicht weiter (sie sind an claim_user gebunden)
  keepT("images", "owner_id", " AND kind='u'");
  keepT("mail_addr"); st.push(q("DELETE FROM mail_addr WHERE user_id=?", S));   // stillgelegtes Konto bekommt keine E-Mails
  // Quellkonto stilllegen (nicht loeschen): banned=2, keine Rolle, Kennung frei fuer UNIQUE(provider, sub)
  st.push(q("UPDATE users SET merged_into=? WHERE merged_into=?", T, S));   // frueher in S zusammengefuehrte Konten zeigen jetzt auf T (Loeschung erfasst sie)
  st.push(q("UPDATE users SET banned=2,role='user',merged_into=?,merged_at=?,provider='merged',sub=? WHERE id=?", T, now(), `${S}>${T}`, S));
  return st;
}

export async function mergeAccounts(env, S, T) {
  const db = env.DB, counts = await mergeCounts(db, S);
  const providers = ((await db.prepare("SELECT provider FROM user_identities WHERE user_id=?").bind(S).all()).results || []).map((r) => r.provider);
  await db.batch(await mergeStatements(db, S, T));
  await audit(db, T, "account-merge", String(S), JSON.stringify({ into: T, providers, counts }));
  await evalBadges(env, T).catch(() => 0);
  return counts;
}

async function primaryAfterUnlink(env, user, rest) {
  // Neue Hauptanmeldung (users.provider/sub): nie eine Admin-Kennung (ADMIN_SUBS) an ein Konto geben, das kein Admin ist
  const ok = rest.filter((r) => user.admin || !adminSub(env, r.provider, r.sub));
  return ok[0] || null;
}

export async function handleIdentities(env, request, url, path, user, J, viaToken) {
  const db = env.DB, method = request.method;
  if (path !== "/api/me/identities" && path !== "/api/me/merge" && !/^\/api\/me\/identities\/\d+$/.test(path)) return null;
  if (viaToken) return J({ error: "forbidden" }, 403);   // nur mit Browser-Sitzung, nie per KI-Token
  if (!user) return J({ error: "login" }, 401);
  await ensureIdentities(db);
  if (path === "/api/me/identities" && method === "GET") {
    const rows = (await db.prepare("SELECT id,provider,sub,created FROM user_identities WHERE user_id=? ORDER BY created,id").bind(user.id).all()).results || [];
    return J({ identities: rows.map((r) => ({ id: r.id, provider: r.provider, created: r.created, primary: r.provider === user.provider && r.sub === user.sub })) }, 200, { "cache-control": "no-store" });
  }
  let m;
  if ((m = /^\/api\/me\/identities\/(\d+)$/.exec(path)) && method === "DELETE") {
    if (!(await freshSession(env, request, user))) return J({ error: "fresh", relogin: await reloginFor(db, user) }, 403);
    if (!(await rateLimit(db, `idu:${user.id}`, 10, 3600))) return J({ error: "rate" }, 429);
    const rows = (await db.prepare("SELECT id,provider,sub FROM user_identities WHERE user_id=? ORDER BY created,id").bind(user.id).all()).results || [];
    const row = rows.find((r) => r.id === +m[1]);
    if (!row) return J({ error: "not_found" }, 404);
    if (rows.length <= 1) return J({ error: "last" }, 400);
    const ops = [db.prepare("DELETE FROM user_identities WHERE id=? AND user_id=?").bind(row.id, user.id)];
    if (row.provider === user.provider && row.sub === user.sub) {
      const next = await primaryAfterUnlink(env, user, rows.filter((r) => r.id !== row.id));
      if (!next) return J({ error: "primary" }, 400);
      ops.push(db.prepare("UPDATE users SET provider=?,sub=? WHERE id=?").bind(next.provider, next.sub, user.id));
    }
    await db.batch(ops);
    await audit(db, user.id, "identity-unlink", row.provider);
    return J({ ok: true });
  }
  if (path === "/api/me/merge") {
    const sess = await readSessionInfo(env, request), proof = await readMergeProof(env, request, user.id);
    const src = proof ? await db.prepare("SELECT id,name,role,banned,merged_into,created,provider,sub FROM users WHERE id=?").bind(proof.source).first() : null;
    if (method === "DELETE") return J({ ok: true }, 200, clearProof());
    if (!proof || !src || src.id === user.id) return method === "GET" ? J({ pending: false }) : J({ error: "no_proof" }, 403, clearProof());
    if (src.banned || src.merged_into) return J(method === "GET" ? { pending: false, error: "banned" } : { error: "banned" }, method === "GET" ? 200 : 403, clearProof());
    // Ein Admin ueber ADMIN_SUBS (Worker-Secret) nie in ein Konto ohne Admin-Rechte zusammenfuehren: die Anmeldung wanderte mit, die
    // Hauptanmeldung des Ziels bliebe, und der Inhaber saesse ohne Admin-Zugang da (nur per Secret-Aenderung zu beheben). Richtig herum
    // geht es: mit dem Admin-Konto anmelden und das andere hineinziehen. (Eine Admin-Rolle in users.role entfaellt mit Hinweis, s. role_dropped.)
    const srcIds = (await db.prepare("SELECT provider,sub FROM user_identities WHERE user_id=?").bind(src.id).all()).results || [];
    if (!user.admin && (adminSub(env, src.provider, src.sub) || srcIds.some((r) => adminSub(env, r.provider, r.sub))))
      return J(method === "GET" ? { pending: false, error: "admin_source" } : { error: "admin_source" }, method === "GET" ? 200 : 403, clearProof());
    const fresh = !!sess && sess.uid === user.id && now() - sess.iat <= MERGE_WINDOW && now() - proof.at <= MERGE_WINDOW;
    const relogin = await reloginFor(db, user);
    if (method === "GET") {
      return J({ pending: true, fresh, relogin, source: { name: src.name, created: src.created, role_dropped: src.role !== "user" && src.role !== user.role }, counts: await mergeCounts(db, src.id) }, 200, { "cache-control": "no-store" });
    }
    if (method !== "POST") return J({ error: "method_not_allowed" }, 405);
    const b = await request.json().catch(() => ({}));
    if (b.confirm !== true) return J({ error: "bad_request" }, 400);
    if (!fresh) return J({ error: "fresh", relogin }, 403);
    if (!(await rateLimit(db, `idm:${user.id}`, 5, 3600))) return J({ error: "rate" }, 429);
    const moved = await mergeAccounts(env, src.id, user.id);
    return J({ ok: true, moved }, 200, clearProof());
  }
  return J({ error: "method_not_allowed" }, 405);
}
