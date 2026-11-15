// Feldzuordnung fuer Programm-Portale (MVP-Tracker, #231): format=mvp (Microsoft MVP) und format=gde (Google Developer Experts / Advocu).
// Nur Abbildung und Pruefung - es wird nichts an ein Portal gesendet. Fuer das MVP-Portal gibt es keine offizielle Schnittstelle;
// der Status "im Portal" wird deshalb lokal gefuehrt (contributions.portal).
//
// Aktivitaetstypen, Rollen, Zielgruppen, Feldnamen und Pruefregeln sind uebernommen aus
// carlosazaustre/advocu-mcp-server ("Unified Activity Reporting"), src/types/mvp/*.ts, src/interfaces/mvp/*.ts,
// src/mvpServer.ts, src/server.ts und src/types/{ContentType,EventFormat}.ts:
//
//   MIT License
//   Copyright (c) 2025 Carlos Azaustre
//   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
//   files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy,
//   modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
//   is furnished to do so, subject to the following conditions:
//   The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
//   OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
//   LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
//   IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// Nicht uebernommen: das Eintragen ueber die inoffizielle Portal-Schnittstelle mit kopiertem Bearer-Token.

export const MVP_PORTAL_URL = "https://mvp.microsoft.com/";
export const MVP_AUDIENCES = ["Developer", "Technical Decision Maker", "Business Decision Maker", "Student", "IT Pro", "End User"];
export const MVP_TYPES = {
  "Video": { typeName: "Video", roles: ["Host", "Presenter", "Speaker"] },
  "Blog": { typeName: "Blog", roles: ["Author", "Co-Author", "Contributor"] },
  "Speaking (Conference)": { typeName: "Speaking", roles: ["Speaker", "Panelist", "Moderator", "Presenter"] },
  "Book/E-book": { typeName: "Book", roles: ["Author", "Co-Author", "Contributor"] },
};
export const MVP_ROLES = [...new Set(Object.values(MVP_TYPES).flatMap((t) => t.roles))];
// Typ-Zuordnung nach Beitragsart (#231, Kommentar vom 5.11.); Kategorie nur als Rueckfall fuer Arten ohne eigene Zuordnung
const MVP_BY_KIND = { video: "Video", podcast: "Video", blog: "Blog", article: "Blog", session: "Speaking (Conference)", book: "Book/E-book" };
const MVP_BY_CATEGORY = { "Video/Webcast/Podcast": "Video", "Blog": "Blog", "Speaker/Presenter": "Speaking (Conference)", "Book/E-book": "Book/E-book" };
export const MVP_LIMITS = { title: [1, 100], description: 1000 };

export const EVENT_FORMATS = ["In-Person", "Virtual", "Hybrid"];
export const GDE_LIMITS = { title: [3, 200], description: 2000 };
const GDE_CONTENT = { video: "Videos", podcast: "Podcasts", blog: "Articles", article: "Articles", book: "Books", github: "Demos" };
const GDE_EVENTS = { session: "public-speaking", workshop: "workshop", mentoring: "mentoring" };

const day = (t) => new Date((Number(t) || 0) * 1000).toISOString().slice(0, 10);
const int = (v) => Math.max(0, Math.floor(Number(v) || 0));
const isHttps = (u) => { try { return new URL(u).protocol === "https:"; } catch { return false; } };
function list(v) { if (Array.isArray(v)) return v; try { const x = JSON.parse(v || "[]"); return Array.isArray(x) ? x : []; } catch { return []; } }

export function mvpType(row) {
  return MVP_BY_KIND[row.kind] || MVP_BY_CATEGORY[row.category] || "";
}

export function mvpDefaultRole(type, kind) {
  if (type === "Video") return kind === "podcast" ? "Host" : "Presenter";
  if (type === "Speaking (Conference)") return "Speaker";
  return type ? "Author" : "";
}

// Ein Beitrag -> Aktivitaet mit den Feldnamen des MVP-Portals, dazu die Pruefergebnisse (issues). null, wenn es keinen MVP-Typ gibt.
export function mvpActivity(row) {
  const type = mvpType(row);
  if (!type) return null;
  const def = MVP_TYPES[type], role = def.roles.includes(row.role) ? row.role : mvpDefaultRole(type, row.kind);
  const title = String(row.title || ""), description = String(row.portal_desc || ""), url = String(row.url || "");
  const audience = list(row.audience).filter((a) => MVP_AUDIENCES.includes(a));
  const activity = {
    activityTypeName: type, typeName: def.typeName, date: day(row.published), title, description, url, role,
    targetAudience: audience, technologyFocusArea: String(row.area || ""), additionalTechnologyAreas: [],
  };
  const sessions = int(row.sessions) || 1;
  if (type === "Video") Object.assign(activity, { liveStreamViews: int(row.live_views), onDemandViews: int(row.kind === "podcast" ? row.downloads || row.views : row.views || row.downloads), numberOfSessions: sessions });
  else if (type === "Blog") Object.assign(activity, { numberOfViews: int(row.views) });
  else if (type === "Speaking (Conference)") Object.assign(activity, { inPersonAttendees: int(row.attendees), numberOfSessions: sessions, liveStreamViews: int(row.live_views), onDemandViews: int(row.views) });
  const issues = [];
  if (title.length < MVP_LIMITS.title[0]) issues.push({ field: "title", code: "missing" });
  else if (title.length > MVP_LIMITS.title[1]) issues.push({ field: "title", code: "too_long", limit: MVP_LIMITS.title[1], length: title.length });
  if (!description) issues.push({ field: "description", code: "missing" });
  else if (description.length > MVP_LIMITS.description) issues.push({ field: "description", code: "too_long", limit: MVP_LIMITS.description, length: description.length });
  if (!url) issues.push({ field: "url", code: "missing" });
  else if (!isHttps(url)) issues.push({ field: "url", code: "not_https" });
  if (!audience.length) issues.push({ field: "targetAudience", code: "missing" });
  if (!activity.technologyFocusArea) issues.push({ field: "technologyFocusArea", code: "missing" });
  return { type, ready: !issues.length, issues, activity };
}

// Ein Beitrag -> Advocu-Entwurf (GDE). null, wenn es keine passende Aktivitaetsart gibt.
export function gdeActivity(row) {
  const event = GDE_EVENTS[row.kind], contentType = GDE_CONTENT[row.kind];
  if (!event && !contentType) return null;
  const title = String(row.title || ""), description = String(row.portal_desc || ""), url = String(row.url || "");
  const base = { title, description, activityDate: day(row.published), activityUrl: url };
  let activity, metric;
  if (event) {
    const format = EVENT_FORMATS.includes(row.event_format) ? row.event_format : "";
    metric = int(row.attendees) + int(row.live_views);
    activity = { type: event, ...base, metrics: { attendees: metric }, eventFormat: format, ...(row.country ? { country: String(row.country) } : {}), ...(format && format !== "Virtual" ? { inPersonAttendees: int(row.attendees) } : {}) };
  } else {
    metric = int(row.views || row.downloads);
    activity = { type: "content-creation", ...base, contentType, metrics: { readers: metric } };
  }
  const issues = [];
  if (title.length < GDE_LIMITS.title[0]) issues.push({ field: "title", code: "too_short", limit: GDE_LIMITS.title[0], length: title.length });
  else if (title.length > GDE_LIMITS.title[1]) issues.push({ field: "title", code: "too_long", limit: GDE_LIMITS.title[1], length: title.length });
  if (!description) issues.push({ field: "description", code: "missing" });
  else if (description.length > GDE_LIMITS.description) issues.push({ field: "description", code: "too_long", limit: GDE_LIMITS.description, length: description.length });
  if (!url) issues.push({ field: "activityUrl", code: "missing" });
  else if (!isHttps(url)) issues.push({ field: "activityUrl", code: "not_https" });
  if (metric < 1) issues.push({ field: "metrics", code: "missing" });
  if (event && !activity.eventFormat) issues.push({ field: "eventFormat", code: "missing" });
  if (event && (activity.eventFormat === "In-Person" || activity.eventFormat === "Hybrid") && !activity.country) issues.push({ field: "country", code: "missing" });
  return { type: activity.type, ready: !issues.length, issues, activity };
}
