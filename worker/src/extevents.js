import { baseIds } from "./entities.js";
import { similarName } from "./events.js";

const now = () => Math.floor(Date.now() / 1000);
const safeUrl = (value) => { try { const u = new URL(String(value || "")); return u.protocol === "https:" && !u.username && !u.password && !/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(u.href) && ![...u.searchParams.keys()].some((key) => /email|address/i.test(key)) ? u.href.slice(0, 500) : ""; } catch { return ""; } };
const clean = (value, max = 180) => String(value || "").replace(/[<>]/g, "").replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "").replace(/\s+/g, " ").trim().slice(0, max);
const parse = (value, fallback) => { try { return JSON.parse(value); } catch { return fallback; } };

export async function ensureExternalEventSchema(db) {
  const columns = new Set((await db.prepare("PRAGMA table_info(events)").all()).results.map((x) => x.name));
  if (!columns.has("source")) await db.prepare("ALTER TABLE events ADD COLUMN source TEXT NOT NULL DEFAULT ''").run();
  if (!columns.has("organizer_name")) await db.prepare("ALTER TABLE events ADD COLUMN organizer_name TEXT NOT NULL DEFAULT ''").run();
  if (!columns.has("cfs_close")) await db.prepare("ALTER TABLE events ADD COLUMN cfs_close TEXT NOT NULL DEFAULT ''").run();
}

function publicData(item) {
  const sessions = (Array.isArray(item.sessions) ? item.sessions : []).slice(0, 300).flatMap((session) => {
    const title = clean(session.title, 140), speakers = (Array.isArray(session.speakers) ? session.speakers : []).slice(0, 20).flatMap((speaker) => {
      const name = clean(speaker.n || speaker.name, 100);
      if (!name) return [];
      const links = (Array.isArray(speaker.links) ? speaker.links : []).map(safeUrl).filter(Boolean).slice(0, 8);
      return [{ n: name, s: "confirmed", o: 1, ...(links.length ? { links } : {}) }];
    });
    if (!title) return [];
    return [{ title, start: clean(session.start, 32), end: clean(session.end, 32), room: clean(session.room, 100), speakers }];
  });
  const sources = (Array.isArray(item.sources) ? item.sources : []).slice(0, 20).flatMap((source) => {
    const name = clean(source.source, 60), extId = clean(source.ext_id, 200);
    if (!name || !extId) return [];
    return [{ source: name, ext_id: extId, url: safeUrl(source.url) }];
  });
  return {
    sources, title: clean(item.title, 180), start: clean(item.start, 32), end: clean(item.end, 32),
    mode: ["online", "onsite", "hybrid"].includes(item.mode) ? item.mode : "online",
    location: clean(item.location, 160), country: clean(item.country, 80), url: safeUrl(item.url),
    organizer_name: clean(item.organizer_name, 120), topics: Array.isArray(item.topics) ? item.topics.slice(0, 12).map((x) => clean(x, 80)) : [],
    cfs_close: clean(item.cfs_close, 32), sessions,
  };
}

export async function importExternalEvents(env) {
  const db = env.DB;
  await ensureExternalEventSchema(db);
  const response = await fetch(`${env.SITE}/ext_events.json`, { cf: { cacheTtl: 0 } });
  if (!response.ok) return { imported: 0, skipped: true };
  const payload = await response.json();
  const items = Array.isArray(payload.items) ? payload.items : [];
  const t = now();
  let imported = 0;
  for (const raw of items.slice(0, 1000)) {
    const item = publicData(raw), fp = clean(raw.fp, 64), hash = clean(raw.hash, 64);
    if (!/^[a-f0-9]{32,64}$/i.test(fp) || !/^[a-f0-9]{32,64}$/i.test(hash) || !item.title || !/^\d{4}-\d{2}-\d{2}/.test(item.start)) continue;
    const existing = await db.prepare("SELECT hash FROM event_import WHERE fp=?").bind(fp).first();
    if (existing?.hash === hash) {
      await db.prepare("UPDATE event_import SET last_seen=? WHERE fp=?").bind(t, fp).run();
      for (const source of item.sources) {
        await db.prepare("INSERT OR IGNORE INTO event_source(source,ext_id,fp,url) VALUES(?,?,?,?)")
          .bind(source.source, source.ext_id, fp, source.url).run();
      }
      continue;
    }
    await db.prepare("INSERT INTO event_import(fp,data,hash,status,first_seen,last_seen) VALUES(?,?,?,'new',?,?) ON CONFLICT(fp) DO UPDATE SET data=excluded.data,hash=excluded.hash,last_seen=excluded.last_seen,status=CASE WHEN event_import.status='gone' THEN 'new' ELSE event_import.status END")
      .bind(fp, JSON.stringify(item), hash, t, t).run();
    for (const source of item.sources) {
      await db.prepare("INSERT INTO event_source(source,ext_id,fp,url) VALUES(?,?,?,?) ON CONFLICT(source,ext_id) DO UPDATE SET fp=excluded.fp,url=excluded.url")
        .bind(source.source, source.ext_id, fp, source.url).run();
    }
    imported++;
  }
  return { imported };
}

export async function eventImportCandidates(db, limit = 100) {
  const rows = (await db.prepare("SELECT fp,data,hash,status,event_id,first_seen,last_seen FROM event_import WHERE status='new' ORDER BY first_seen,fp LIMIT ?").bind(limit).all()).results || [];
  const events = (await db.prepare("SELECT id,handle,title,start,url FROM events WHERE public=1 ORDER BY start DESC LIMIT 3000").all()).results || [];
  return rows.map((row) => {
    const data = parse(row.data, {});
    const dupes = events.filter((event) => {
      if (!similarName(data.title, event.title)) return false;
      const a = Date.parse((data.start || "").slice(0, 10)), b = Date.parse((event.start || "").slice(0, 10));
      return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 86400000;
    }).map(({ id, handle, title, start, url }) => ({ id, handle, title, start, url }));
    return { ...row, data, duplicates: dupes };
  });
}

export async function externalSpeakerRows(db) {
  const rows = (await db.prepare("SELECT e.id event_id,e.title event_title,s.id session_id,s.title session_title,s.speakers FROM events e JOIN event_sessions s ON s.event_id=e.id WHERE e.source<>'' ORDER BY e.start DESC,s.start LIMIT 200").all()).results || [];
  return rows.flatMap((row) => parse(row.speakers, []).flatMap((speaker) => speaker.n ? [{
    event_id: row.event_id, event_title: row.event_title, session_id: row.session_id, session_title: row.session_title,
    name: speaker.n, hidden: !!speaker.hidden,
  }] : []));
}

export async function hideExternalSpeaker(db, eventId, sessionId, name, hidden) {
  const row = await db.prepare("SELECT s.speakers FROM event_sessions s JOIN events e ON e.id=s.event_id WHERE s.id=? AND e.id=? AND e.source<>''").bind(sessionId, eventId).first();
  if (!row) return { error: "not_found" };
  const speakers = parse(row.speakers, []);
  const speaker = speakers.find((item) => item.n === name);
  if (!speaker) return { error: "not_found" };
  speaker.hidden = hidden;
  await db.prepare("UPDATE event_sessions SET speakers=? WHERE id=?").bind(JSON.stringify(speakers), sessionId).run();
  return { ok: true, hidden };
}

function sessionStatements(db, eventId, data, proposerId, timestamp) {
  return (data.sessions || []).slice(0, 300).map((session) => db.prepare(
    "INSERT INTO event_sessions(event_id,title,abstract,start,end,room,track,level,lang,topics,speakers,recording_url,status,proposer_id,created) SELECT ?,?, '',?,?,?,'','','en','[]',?,'','live',?,? WHERE NOT EXISTS (SELECT 1 FROM event_sessions WHERE event_id=? AND title=? AND start=?)")
    .bind(eventId, clean(session.title, 140), clean(session.start, 32), clean(session.end, 32), clean(session.room, 100),
      JSON.stringify((session.speakers || []).slice(0, 20)), proposerId, timestamp, eventId, clean(session.title, 140), clean(session.start, 32)));
}

export async function decideEventImport(env, user, fp, action, eventId = 0) {
  const db = env.DB;
  await ensureExternalEventSchema(db);
  const row = await db.prepare("SELECT * FROM event_import WHERE fp=? AND status='new'").bind(fp).first();
  if (!row) return { error: "not_found" };
  const data = publicData(parse(row.data, {})), t = now();
  if (action === "reject") {
    await db.prepare("UPDATE event_import SET status='rejected',reviewed_by=?,last_seen=? WHERE fp=?").bind(user.id, t, fp).run();
    return { ok: true, status: "rejected" };
  }
  const topics = await baseIds(env);
  const knownTopics = [...new Set(data.topics.filter((topic) => topics.has(topic)))];
  if (action === "approve") {
    const handle = `ext-${fp.slice(0, 32)}`;
    const old = await db.prepare("SELECT id FROM events WHERE handle=?").bind(handle).first();
    let id = old?.id;
    if (!id) {
      const sources = [...new Set(data.sources.map((x) => x.source))].join(",");
      const inserted = await db.prepare("INSERT INTO events(handle,owner_id,title,summary,about,start,end,mode,location,country,url,tickets_url,free,lang,topics,seeking_sponsor,public,created,updated,source,organizer_name,cfs_close) VALUES(?,0,?,'','',?,?,?,?,?,?,'',1,'en',?,0,1,?,?,?,?,?)")
        .bind(handle, data.title, data.start, data.end, data.mode, data.location, data.country, data.url, JSON.stringify(knownTopics), t, t, sources, data.organizer_name, data.cfs_close).run();
      id = inserted.meta.last_row_id;
    }
    const ops = sessionStatements(db, id, data, 0, t);
    for (let i = 0; i < ops.length; i += 40) await db.batch(ops.slice(i, i + 40));
    const entity = { type: "event", name: data.title, desc: { en: `Community event ${data.title} (${data.start.slice(0, 10)}).` }, web: data.url };
    await db.prepare("INSERT OR IGNORE INTO entity_rev(eid,data,summary,user_id,status,created) VALUES(?,?,?,0,'live',?)")
      .bind(handle, JSON.stringify(entity), "Externer Event-Import", t).run();
    await db.prepare("UPDATE event_import SET status='approved',event_id=?,reviewed_by=?,last_seen=? WHERE fp=?").bind(id, user.id, t, fp).run();
    return { ok: true, status: "approved", event_id: id, handle };
  }
  if (action === "merge" && Number.isSafeInteger(eventId) && eventId > 0) {
    const event = await db.prepare("SELECT id,source,organizer_name FROM events WHERE id=?").bind(eventId).first();
    if (!event) return { error: "not_found" };
    const ops = sessionStatements(db, eventId, data, 0, t);
    for (let i = 0; i < ops.length; i += 40) await db.batch(ops.slice(i, i + 40));
    const sources = [...new Set([...String(event.source || "").split(",").filter(Boolean), ...data.sources.map((x) => x.source)])].join(",");
    const currentTopics = parse((await db.prepare("SELECT topics FROM events WHERE id=?").bind(eventId).first())?.topics, []);
    await db.prepare("UPDATE events SET source=?,organizer_name=CASE WHEN organizer_name='' THEN ? ELSE organizer_name END,cfs_close=CASE WHEN cfs_close='' THEN ? ELSE cfs_close END,topics=?,updated=? WHERE id=?")
      .bind(sources, data.organizer_name, data.cfs_close, JSON.stringify([...new Set([...currentTopics, ...knownTopics])].slice(0, 12)), t, eventId).run();
    await db.prepare("UPDATE event_import SET status='merged',event_id=?,reviewed_by=?,last_seen=? WHERE fp=?").bind(eventId, user.id, t, fp).run();
    return { ok: true, status: "merged", event_id: eventId };
  }
  return { error: "bad_request" };
}

export function sessionContributionDraft(input) {
  return {
    user_id: input.user_id, kind: "session", category: "Speaker/Presenter", public: 0, manual: 0,
    source: `event:${input.fp}`, url: safeUrl(input.url), date: clean(input.date, 32),
  };
}
