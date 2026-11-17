// Datenschutz nach Kontoloeschung, Privatstellen und Bann (Sicherheitspruefung K21-K45, Entscheidung Mirko 11/2026):
// Inhalte (Blogbeitraege, Bewertungen, Speaker-Eintraege, Wiki- und Entitaets-Beitraege) bleiben bei M365.FM, aber ANONYM ("Former member",
// kein Name, keine Kurzzeile, kein Profil-Link, kein Handle). Personenbezogenes (Profil, Personen-Entitaet aus dem Profil, Kontakt) verschwindet
// aus allen oeffentlichen Wegen: Profil-Export-Zwischenspeicher, Suchindex (und damit Vectorize), Entitaets-Export, Uebersetzungs-Export.
// Anonymisierte Zeilen tragen eine negative user_id (-<Zeilen-ID>): eindeutig (UNIQUE(user_id, slug) bzw. UNIQUE(show, user_id)) und ohne
// Bezug zu einem Konto - IDs werden mit AUTOINCREMENT nie neu vergeben, negative nie.
export const FORMER = "Former member";

// Konto-Schluessel fuer den Seitenbau (Runde 8): Exporte mit Profil-Bezug (Profile, Feed, Shows, Gaeste, Bibliothek, Podcast, Video) tragen je
// Eintrag ak = HMAC(Konto-ID, Adresse). Kommt ein Export beim Seitenbau aus data/cache (Ausfall), behaelt site_fetch.scrub nur Eintraege, deren
// Adresse UND Schluessel zum frischen Profil-Export passen - uebernimmt ein anderes Konto die Adresse, passt der Schluessel nicht mehr. Die
// Konto-ID selbst bleibt verborgen, und alte und neue Adresse eines Kontos sind ueber den Schluessel nicht verknuepfbar (Adresse im HMAC).
// ak(uid, handle) -> 16 Hex-Zeichen oder undefined (kein Geheimnis gesetzt, fehlende Werte: Feld entfaellt, der Seitenbau prueft dann den Namen).
export async function acctKeys(env) {
  const sec = String(env?.SESSION_SECRET || "");
  if (!sec || !globalThis.crypto?.subtle) return async () => undefined;
  const enc = new TextEncoder(), memo = new Map();
  const key = await crypto.subtle.importKey("raw", enc.encode("acct-key:" + sec), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return async (uid, handle) => {
    if (!uid || !handle) return undefined;
    const k = `${uid}:${handle}`;
    if (!memo.has(k)) memo.set(k, [...new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(k))).slice(0, 8)].map((b) => b.toString(16).padStart(2, "0")).join(""));
    return memo.get(k);
  };
}
// Eintraege eines Exports mit user_id: ak setzen, user_id entfernen (die Konto-ID ist nicht oeffentlich)
export async function withAcctKeys(env, rows, uidKey = "user_id") {
  const ak = await acctKeys(env), out = [];
  for (const r of rows) { const { [uidKey]: uid, ...x } = r; const k = await ak(uid, x.handle); out.push(k ? { ...x, ak: k } : x); }
  return out;
}

// Oeffentliche Profile kommen aus einem Zwischenspeicher (Cron alle 30 Minuten). Wird etwas Oeffentliches privat, gesperrt oder geloescht,
// verwerfen wir ihn sofort; der naechste Abruf baut ihn neu (profiles.js refreshProfilesExport filtert public=1 und banned=0).
// Generationszaehler (meta profiles_export_gen): refreshProfilesExport schreibt den Zwischenspeicher nur, wenn seit seinem Start keine
// Invalidierung kam - sonst schriebe ein laufender Export (Cron oder Abruf) die Fassung von vor der Loeschung/dem Privatstellen zurueck.
export const EXPORT_GEN = "profiles_export_gen";
export async function invalidateProfileExport(db) {
  await db.prepare("INSERT INTO meta(k,v) VALUES(?,'1') ON CONFLICT(k) DO UPDATE SET v=CAST(CAST(v AS INTEGER)+1 AS TEXT)").bind(EXPORT_GEN).run().catch(() => {});
  await db.prepare("DELETE FROM export_cache WHERE k='profiles'").run().catch(() => {});
}
export async function profileExportGen(db) {
  return String((await db.prepare("SELECT v FROM meta WHERE k=?").bind(EXPORT_GEN).first().catch(() => null))?.v ?? "0");
}

// Personen-Entitaeten aus dem eigenen Profil: genau die, die profiles.js ownedEntity mit Typ person angelegt hat (Tabelle person_entity,
// Migration 0054; nur ownedEntity schreibt sie - keine Zusammenfassung oder kein Typ, den ein Mitglied in einem Vorschlag selbst setzen kann).
// Ausgeblendet, solange ihr Inhaber kein oeffentliches, nicht gesperrtes Profil mit genau dieser Adresse hat: privat gestellt, gesperrt, Adresse
// geaendert, zusammengefuehrt (banned=2) oder geloescht (user_id 0, die Zeile bleibt dauerhaft als Merker: sonst holte importEntitiesFromSite die
// Person aus dem letzten Seitenbau zurueck; aufheben nur per Admin, entities.js releasePersonEntity). Sie erscheinen in keinem oeffentlichen Weg; kommt das Profil zurueck, sind sie wieder da.
export const HIDDEN_PERSON_SQL = "SELECT pe.eid FROM person_entity pe" +
  " WHERE NOT EXISTS (SELECT 1 FROM profiles p JOIN users u ON u.id=p.user_id AND u.banned=0 WHERE p.user_id=pe.user_id AND p.handle=pe.eid AND p.public=1)";
export async function hiddenPersonEids(db) {
  try { return new Set(((await db.prepare(HIDDEN_PERSON_SQL).all()).results || []).map((r) => r.eid)); } catch { return new Set(); }
}
// Eine id: Schreibwege (POST /api/entity, Freigaben in editor.js und votes.js) lehnen verborgene Personen-Entitaeten ab (K41/B)
export async function isHiddenPerson(db, eid) {
  try { return !!(await db.prepare(HIDDEN_PERSON_SQL + " AND pe.eid=?").bind(eid).first()); } catch { return false; }
}

// Suchindex: Profilseiten (alle Sprachen, auch Blog unter /community/u/<h>/) und die Personen-Entitaet der Adresse sofort als entfernt markieren.
// syncSearchVectors (search.js) loescht danach die Vektoren (Vectorize); importSearchIndex holt sie nicht zurueck (publicHandleGuard).
export async function forgetSearchPerson(db, handle) {
  if (!handle) return;
  await db.prepare("UPDATE search_doc SET gone=1 WHERE gone=0 AND (instr(url,?)>0 OR (type='person' AND instr(url,?)>0))")
    .bind(`/community/u/${handle}/`, `/entity/${handle}/`).run().catch(() => {});
}

// Nur die Seite einer Entitaet (z. B. alte Profil-Adresse, die inzwischen ein anderes Mitglied traegt: dessen Profilseiten bleiben)
export async function forgetSearchEntity(db, eid) {
  if (!eid) return;
  await db.prepare("UPDATE search_doc SET gone=1 WHERE gone=0 AND instr(url,?)>0").bind(`/entity/${eid}/`).run().catch(() => {});
}

// Ein Profil verlaesst die Oeffentlichkeit (privat, gesperrt, Adresse geaendert, geloescht): Export-Zwischenspeicher und Suchindex sofort
export async function forgetPublicPerson(db, handle) {
  await invalidateProfileExport(db);
  await forgetSearchPerson(db, handle);
}

// Eintrag eines Speakers, dessen Konto geloescht wurde: bleibt im Programm (Inhalt bei M365.FM), aber ohne Name, Handle, Entitaet, Einladung
export const anonSpeaker = (x) => ({ n: FORMER, s: x.s, anon: 1 });
export const isFormer = (n) => String(n || "").trim().toLowerCase() === FORMER.toLowerCase();

// Profil-Adresse wird frei (geaendert oder entfernt): Speaker-Eintraege, Speaker-Identitaet und Blog-Abos gehen NICHT an einen spaeteren
// Inhaber der alten Adresse, sondern wandern mit (neue Adresse) bzw. verlieren die Bindung (keine Adresse mehr; der Name bleibt, das Konto
// besteht ja weiter). Ohne neue Adresse bleibt der Eintrag an das Konto gebunden (uid): nur dieses Konto kann ihn spaeter wieder beanspruchen
// (events.js speakerMatches/claim), und loescht es sich, wird er anonymisiert (eventmerge.js forgetImporter). Gleiche Ersetzung wie beim
// Zusammenfuehren (identities.js). Liefert Anweisungen fuer db.batch.
export async function releaseHandleOps(db, oldH, newH, uid = 0) {
  if (!oldH || oldH === newH) return [];
  const H = (h) => `"h":"${h}"`, E = (h) => `"e":"${h}"`;
  if (newH) return [
    db.prepare("UPDATE event_sessions SET speakers=replace(replace(speakers,?,?),?,?) WHERE instr(speakers,?)>0").bind(H(oldH), H(newH), E(oldH), E(newH), H(oldH)),
    db.prepare("UPDATE speaker_ref SET handle=? WHERE handle=?").bind(newH, oldH),
    db.prepare("UPDATE OR IGNORE blog_follows SET handle=? WHERE handle=?").bind(newH, oldH), db.prepare("DELETE FROM blog_follows WHERE handle=?").bind(oldH),
  ];
  return [...(await mapSpeakers(db, oldH, ({ h, e, t, ...x }) => ({ ...x, ...(e && e !== oldH ? { e } : {}), ...(uid ? { uid } : {}) }))),
    db.prepare("UPDATE speaker_ref SET handle='' WHERE handle=?").bind(oldH), db.prepare("DELETE FROM blog_follows WHERE handle=?").bind(oldH)];
}

// Alle Sessions mit einem Speaker-Eintrag h=<handle> (oder uid=<Konto>, siehe releaseHandleOps): Eintraege mit fn umschreiben (Anweisungen fuer db.batch).
// Beides in EINEM Durchlauf: zwei getrennte Durchlaeufe schrieben dieselbe Session mit veraltetem Stand und verloeren die erste Aenderung.
export async function mapSpeakers(db, handle, fn, skip = new Set(), uid = 0) {
  const ops = [], hit = (x) => (!!handle && x?.h === handle) || (!!uid && x?.uid === uid);
  const kh = handle ? `"h":"${handle}"` : "", ku = uid ? `"uid":${uid}` : "";
  if (!kh && !ku) return ops;
  for (const r of (await db.prepare("SELECT id,speakers FROM event_sessions WHERE (?1<>'' AND instr(speakers,?1)>0) OR (?2<>'' AND instr(speakers,?2)>0)").bind(kh, ku).all()).results || []) {
    if (skip.has(r.id)) continue;
    let sp; try { sp = JSON.parse(r.speakers); } catch { continue; }
    if (!Array.isArray(sp) || !sp.some(hit)) continue;
    ops.push(db.prepare("UPDATE event_sessions SET speakers=? WHERE id=?").bind(JSON.stringify(sp.map((x) => (hit(x) ? fn(x) : x))), r.id));
  }
  return ops;
}

// Kontoloeschung (profiles.js deleteUserData): Speaker-Eintraege, die nur per Name an eine Personen-Entitaet des Kontos gebunden sind ({n, e} ohne h,
// z. B. von speakersCheck/linkSpeakerEntities), anonymisieren - sonst behielten sie den Namen und zeigten nach einer Uebernahme der Adresse auf die
// Entitaet des neuen Inhabers (Runde 6). Eintraege mit h gehoeren einem (anderen) Profil und bleiben. Anweisungen fuer db.batch.
export async function anonEntitySpeakerOps(db, eids) {
  const set = new Set(eids.filter(Boolean)), ops = [], seen = new Set();
  if (!set.size) return ops;
  const hit = (x) => !!x && typeof x === "object" && !x.h && set.has(x.e);
  for (const eid of set) {
    for (const r of (await db.prepare("SELECT id,speakers FROM event_sessions WHERE instr(speakers,?)>0").bind(`"e":"${eid}"`).all()).results || []) {
      if (seen.has(r.id)) continue; seen.add(r.id);
      let sp; try { sp = JSON.parse(r.speakers); } catch { continue; }
      if (!Array.isArray(sp) || !sp.some(hit)) continue;
      ops.push(db.prepare("UPDATE event_sessions SET speakers=? WHERE id=?").bind(JSON.stringify(sp.map((x) => (hit(x) ? anonSpeaker(x) : x))), r.id));
    }
  }
  return ops;
}

// Uebersetzungen geloeschter Inhalte mitloeschen (item_tr ist die Quelle, translation die Kopie - beide, sonst kaeme die Kopie beim naechsten
// importTranslations zurueck). where waehlt die Zeilen der Tabelle, deren id die item_id ist (K21).
export function dropTranslationOps(db, kind, table, where, ...b) {
  return [db.prepare(`DELETE FROM item_tr WHERE kind=? AND item_id IN (SELECT id FROM ${table} WHERE ${where})`).bind(kind, ...b),
    db.prepare(`DELETE FROM translation WHERE kind=? AND item_id IN (SELECT CAST(id AS TEXT) FROM ${table} WHERE ${where})`).bind(kind, ...b)];
}
