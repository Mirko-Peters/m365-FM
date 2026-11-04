import { baseIds } from "./entities.js";
import { similarName } from "./events.js";

const now = () => Math.floor(Date.now() / 1000);
const sourceKey = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
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
    cfs_close: clean(item.cfs_close, 32), sessions, gone: !!item.gone,
  };
}

function autoSourceSet(env) {
  return new Set(String(env.EVENTS_AUTO_SOURCES ?? "communitydays").split(",").map(sourceKey).filter(Boolean));
}

function isAutoSource(env, data) {
  const allowed = autoSourceSet(env), sources = data.sources || [];
  return sources.length > 0 && sources.every((source) => allowed.has(sourceKey(source.source)));
}

async function possibleDuplicates(db, data) {
  const events = (await db.prepare("SELECT id,handle,title,start,url FROM events WHERE public=1 ORDER BY start DESC LIMIT 3000").all()).results || [];
  return events.filter((event) => {
    if (!similarName(data.title, event.title)) return false;
    const a = Date.parse((data.start || "").slice(0, 10)), b = Date.parse((event.start || "").slice(0, 10));
    return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 86400000;
  }).map(({ id, handle, title, start, url }) => ({ id, handle, title, start, url }));
}

function changeLog(value, t, fields, action = "update") {
  const log = parse(value, []);
  log.push({ at: t, source: "community_days", action, fields: [...new Set(fields)].slice(0, 30) });
  return JSON.stringify(log.slice(-20));
}

const eventFields = ["title", "start", "end", "mode", "location", "country", "url", "organizer_name", "cfs_close", "topics"];
const normalized = (value) => JSON.stringify(value);
const sourceSpeakers = (speakers) => (speakers || []).map(({ n, links }) => ({ n, ...(links?.length ? { links } : {}) }));

async function syncSessions(db, eventId, oldData, data, locked, t) {
  const oldSessions = oldData.sessions || [], nextSessions = data.sessions || [], changes = [];
  const rows = (await db.prepare("SELECT id,title,start,end,room,speakers,status FROM event_sessions WHERE event_id=?").bind(eventId).all()).results || [];
  const byKey = new Map(rows.map((row) => [`${row.title}\n${row.start}`, row]));
  const oldRows = new Map();
  for (const old of oldSessions) {
    const row = byKey.get(`${old.title}\n${old.start || ""}`);
    if (row) oldRows.set(normalized(old), row);
  }
  for (const [key, row] of oldRows) {
    const old = oldSessions.find((session) => normalized(session) === key);
    const oldSpeakers = (old.speakers || []).map((speaker) => ({ n: speaker.n, s: "confirmed", o: 1, ...(speaker.links?.length ? { links: speaker.links } : {}) }));
    const currentSpeakers = parse(row.speakers, []);
    for (const [field, current, previous] of [
      ["title", row.title, old.title], ["start", row.start, old.start || ""], ["end", row.end, old.end || ""],
      ["room", row.room, old.room || ""], ["speakers", sourceSpeakers(currentSpeakers), sourceSpeakers(oldSpeakers)],
    ]) {
      if (normalized(current) !== normalized(previous)) locked.add(`session:${row.id}:${field}`);
    }
  }
  for (const old of oldSessions) {
    const row = byKey.get(`${old.title}\n${old.start || ""}`);
    if (!row) continue;
    const stillPresent = nextSessions.some((session) => session.title === old.title && (session.start || "") === (old.start || ""));
    if (!stillPresent) {
      await db.prepare("UPDATE event_sessions SET status='gone' WHERE id=? AND status<>'gone'").bind(row.id).run();
      changes.push(`session:${row.id}:gone`);
    }
  }
  for (const session of nextSessions) {
    let row = byKey.get(`${session.title}\n${session.start || ""}`);
    if (!row) {
      const inserted = await db.prepare("INSERT INTO event_sessions(event_id,title,abstract,start,end,room,track,level,lang,topics,speakers,recording_url,status,proposer_id,created) VALUES(?,?,'',?,?,?,'','','en','[]',?,'','live',0,?)")
        .bind(eventId, session.title, session.start || "", session.end || "", session.room || "", JSON.stringify(session.speakers || []), t).run();
      row = { id: inserted.meta.last_row_id };
      byKey.set(`${session.title}\n${session.start || ""}`, row);
      changes.push(`session:${row.id}:created`);
      continue;
    }
    const values = {
      title: session.title, start: session.start || "", end: session.end || "", room: session.room || "",
      speakers: JSON.stringify((() => {
        const previousSpeakers = parse(row.speakers, []);
        const current = (session.speakers || []).map((speaker) => {
          const previous = previousSpeakers.find((item) => item.n === speaker.n) || {};
          return { n: speaker.n, s: previous.s || "confirmed", o: previous.o || 1,
            ...(speaker.links?.length ? { links: speaker.links } : {}),
            ...(["h", "e", "hidden"].filter((key) => previous[key] !== undefined).reduce((out, key) => ({ ...out, [key]: previous[key] }), {})) };
        });
        for (const previous of previousSpeakers) {
          if (!current.some((speaker) => speaker.n === previous.n)) current.push({ ...previous, hidden: true });
        }
        return current;
      })()),
    };
    const set = [], args = [];
    for (const [field, value] of Object.entries(values)) {
      if (locked.has(`session:${row.id}:${field}`)) continue;
      if (field === "speakers" ? normalized(sourceSpeakers(parse(row.speakers, []))) !== normalized(sourceSpeakers(JSON.parse(value))) : row[field] !== value) {
        set.push(`${field}=?`); args.push(value); changes.push(`session:${row.id}:${field}`);
      }
    }
    if (row.status !== "live") { set.push("status='live'"); changes.push(`session:${row.id}:status`); }
    if (set.length) await db.prepare(`UPDATE event_sessions SET ${set.join(",")} WHERE id=?`).bind(...args, row.id).run();
  }
  return { locked: [...locked], changes };
}

async function applyApprovedUpdate(env, existing, data, hash, t) {
  const db = env.DB, oldData = parse(existing.data, {});
  const event = await db.prepare("SELECT * FROM events WHERE id=?").bind(existing.event_id).first();
  if (!event) return;
  const locked = new Set(parse(existing.locked_fields, [])), known = new Set(await baseIds(env));
  const fields = {
    title: data.title, start: data.start, end: data.end, mode: data.mode, location: data.location, country: data.country,
    url: data.url, organizer_name: data.organizer_name, cfs_close: data.cfs_close,
    topics: JSON.stringify([...new Set(data.topics.filter((topic) => known.has(topic)))]),
  };
  const previous = { ...oldData, topics: JSON.stringify([...new Set((oldData.topics || []).filter((topic) => known.has(topic)))]) };
  const current = { ...event, topics: normalized(parse(event.topics, [])) };
  const updates = [], changed = [];
  for (const field of eventFields) {
    const oldValue = field === "topics" ? previous.topics : (previous[field] || "");
    const currentValue = field === "topics" ? current.topics : (current[field] || "");
    if (normalized(currentValue) !== normalized(oldValue)) locked.add(field);
    if (!locked.has(field) && normalized(currentValue) !== normalized(fields[field])) {
      updates.push(`${field}=?`); changed.push(field);
    }
  }
  const sessions = await syncSessions(db, event.id, oldData, data, locked, t);
  if (updates.length) {
    updates.push("updated=?");
    await db.prepare(`UPDATE events SET ${updates.join(",")} WHERE id=?`).bind(...eventFields.filter((field) => changed.includes(field)).map((field) => fields[field]), t, event.id).run();
  } else if (sessions.changes.length || existing.status === "gone") {
    await db.prepare("UPDATE events SET updated=? WHERE id=?").bind(t, event.id).run();
  }
  const log = changed.concat(sessions.changes, existing.status === "gone" ? ["status"] : [], sessions.locked.length ? ["locked_fields"] : []);
  await db.prepare("UPDATE event_import SET data=?,hash=?,locked_fields=?,changes=?,status='approved',gone_at=0,last_seen=? WHERE fp=?")
    .bind(JSON.stringify(data), hash, JSON.stringify(sessions.locked), changeLog(existing.changes, t, log), t, existing.fp).run();
}

async function markExternalGone(env, existing, data, hash, t) {
  const db = env.DB;
  if (existing.event_id) {
    await db.prepare("UPDATE events SET updated=? WHERE id=?").bind(t, existing.event_id).run();
    const oldData = parse(existing.data, {}), rows = (await db.prepare("SELECT id,title,start FROM event_sessions WHERE event_id=?").bind(existing.event_id).all()).results || [];
    for (const session of oldData.sessions || []) {
      const row = rows.find((item) => item.title === session.title && item.start === (session.start || ""));
      if (row) await db.prepare("UPDATE event_sessions SET status='gone' WHERE id=?").bind(row.id).run();
    }
  }
  await db.prepare("UPDATE event_import SET data=?,hash=?,status='gone',gone_at=CASE WHEN gone_at=0 THEN ? ELSE gone_at END,last_seen=?,changes=? WHERE fp=?")
    .bind(JSON.stringify(data), hash, t, t, changeLog(existing.changes, t, ["gone"], "gone"), existing.fp).run();
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
    const existing = await db.prepare("SELECT * FROM event_import WHERE fp=?").bind(fp).first();
    for (const source of item.sources) {
      await db.prepare("INSERT INTO event_source(source,ext_id,fp,url) VALUES(?,?,?,?) ON CONFLICT(source,ext_id) DO UPDATE SET fp=excluded.fp,url=excluded.url")
        .bind(source.source, source.ext_id, fp, source.url).run();
    }
    if (item.gone) {
      if (existing?.status === "gone" && existing.hash === hash) {
        await db.prepare("UPDATE event_import SET last_seen=? WHERE fp=?").bind(t, fp).run();
        continue;
      }
      if (existing) await markExternalGone(env, existing, item, hash, t);
      else await db.prepare("INSERT INTO event_import(fp,data,hash,status,gone_at,first_seen,last_seen) VALUES(?,?,?,'gone',?,?,?)")
        .bind(fp, JSON.stringify(item), hash, t, t, t).run();
      imported++;
      continue;
    }
    if (existing?.hash === hash) {
      await db.prepare("UPDATE event_import SET last_seen=? WHERE fp=?").bind(t, fp).run();
      if (existing.status === "new" && isAutoSource(env, item) && !(await possibleDuplicates(db, item)).length)
        await decideEventImport(env, { id: 0 }, fp, "approve", 0, true);
      continue;
    }
    await db.prepare("INSERT INTO event_import(fp,data,hash,status,first_seen,last_seen) VALUES(?,?,?,'new',?,?) ON CONFLICT(fp) DO UPDATE SET data=excluded.data,hash=excluded.hash,last_seen=excluded.last_seen,status=CASE WHEN event_import.status='gone' THEN 'approved' ELSE event_import.status END")
      .bind(fp, JSON.stringify(item), hash, t, t).run();
    const current = existing && (existing.status === "approved" || existing.status === "gone");
    if (current && existing.event_id && isAutoSource(env, item)) {
      await applyApprovedUpdate(env, existing, item, hash, t);
    } else if (isAutoSource(env, item) && !(await possibleDuplicates(db, item)).length &&
               (!existing || existing.status === "new")) {
      await decideEventImport(env, { id: 0 }, fp, "approve", 0, true);
    }
    imported++;
  }
  return { imported };
}

export async function eventImportCandidates(db, limit = 100) {
  const rows = (await db.prepare("SELECT fp,data,hash,status,event_id,first_seen,last_seen FROM event_import WHERE status='new' ORDER BY first_seen,fp LIMIT ?").bind(limit).all()).results || [];
  return rows.map((row) => {
    const data = parse(row.data, {});
    return { ...row, data };
  });
}

export async function eventImportAutomatic(db, limit = 20) {
  const rows = (await db.prepare("SELECT fp,data,changes,last_seen FROM event_import WHERE status='approved' AND reviewed_by=0 ORDER BY last_seen DESC LIMIT ?").bind(limit).all()).results || [];
  return rows.map((row) => ({ ...row, data: parse(row.data, {}), changes: parse(row.changes, []) }));
}

export async function eventImportCandidatesWithDuplicates(db, limit = 100) {
  const rows = await eventImportCandidates(db, limit);
  return Promise.all(rows.map(async (row) => ({ ...row, duplicates: await possibleDuplicates(db, row.data) })));
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
      JSON.stringify((session.speakers || []).slice(0, 20).map((speaker) => ({
        n: clean(speaker.n || speaker.name, 100), s: "confirmed", o: 1,
        ...(Array.isArray(speaker.links) && speaker.links.length ? { links: speaker.links.map(safeUrl).filter(Boolean) } : {}),
      }))), proposerId, timestamp, eventId, clean(session.title, 140), clean(session.start, 32)));
}

export async function decideEventImport(env, user, fp, action, eventId = 0, automatic = false) {
  const db = env.DB;
  await ensureExternalEventSchema(db);
  const row = await db.prepare("SELECT * FROM event_import WHERE fp=? AND status='new'").bind(fp).first();
  if (!row) return { error: "not_found" };
  const data = publicData(parse(row.data, {})), t = now();
  if (automatic && (!isAutoSource(env, data) || (await possibleDuplicates(db, data)).length)) return { error: "duplicate" };
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
    const changes = automatic ? changeLog(row.changes, t, ["title", "start", "end", "mode", "location", "sessions"], "create") : row.changes;
    await db.prepare("UPDATE event_import SET status='approved',event_id=?,reviewed_by=?,locked_fields='[]',changes=?,last_seen=? WHERE fp=?")
      .bind(id, automatic ? 0 : user.id, changes, t, fp).run();
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
