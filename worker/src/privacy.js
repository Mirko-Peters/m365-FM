// Datenschutz nach Kontoloeschung, Privatstellen und Bann (Sicherheitspruefung K21-K45, Entscheidung Mirko 11/2026):
// Inhalte (Blogbeitraege, Bewertungen, Speaker-Eintraege, Wiki- und Entitaets-Beitraege) bleiben bei M365.FM, aber ANONYM ("Former member",
// kein Name, keine Kurzzeile, kein Profil-Link, kein Handle). Personenbezogenes (Profil, Personen-Entitaet aus dem Profil, Kontakt) verschwindet
// aus allen oeffentlichen Wegen: Profil-Export-Zwischenspeicher, Suchindex (und damit Vectorize), Entitaets-Export, Uebersetzungs-Export.
// Anonymisierte Zeilen tragen eine negative user_id (-<Zeilen-ID>): eindeutig (UNIQUE(user_id, slug) bzw. UNIQUE(show, user_id)) und ohne
// Bezug zu einem Konto - IDs werden mit AUTOINCREMENT nie neu vergeben, negative nie.
export const FORMER = "Former member";

// Oeffentliche Profile kommen aus einem Zwischenspeicher (Cron alle 30 Minuten). Wird etwas Oeffentliches privat, gesperrt oder geloescht,
// verwerfen wir ihn sofort; der naechste Abruf baut ihn neu (profiles.js refreshProfilesExport filtert public=1 und banned=0).
export async function invalidateProfileExport(db) {
  await db.prepare("DELETE FROM export_cache WHERE k='profiles'").run().catch(() => {});
}

// Selbst verwaltete Personen-Entitaeten (profiles.js ownedEntity: eid = Profil-Adresse, Zusammenfassung "Selbst verwaltet", Typ person), deren
// Inhaber kein oeffentliches, nicht gesperrtes Profil mit genau dieser Adresse (mehr) hat: privat gestellt, gesperrt, Adresse geaendert,
// zusammengefuehrt (banned=2) oder geloescht. Sie erscheinen in keinem oeffentlichen Weg; kommt das Profil zurueck, sind sie wieder da.
export const HIDDEN_PERSON_SQL = "SELECT c.eid FROM entity_claims c WHERE c.via='owner'" +
  " AND EXISTS (SELECT 1 FROM entity_rev r WHERE r.eid=c.eid AND r.summary='Selbst verwaltet' AND (CASE WHEN json_valid(r.data) THEN json_extract(r.data,'$.type') END)='person')" +
  " AND NOT EXISTS (SELECT 1 FROM profiles p JOIN users u ON u.id=p.user_id AND u.banned=0 WHERE p.user_id=c.user_id AND p.handle=c.eid AND p.public=1)";
export async function hiddenPersonEids(db) {
  try { return new Set(((await db.prepare(HIDDEN_PERSON_SQL).all()).results || []).map((r) => r.eid)); } catch { return new Set(); }
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

// Profil-Adresse wird frei (geaendert oder entfernt): Speaker-Eintraege, Speaker-Identitaet und Blog-Abos gehen NICHT an einen spaeteren
// Inhaber der alten Adresse, sondern wandern mit (neue Adresse) bzw. verlieren die Bindung (keine Adresse mehr; der Name bleibt, das Konto
// besteht ja weiter). Gleiche Ersetzung wie beim Zusammenfuehren (identities.js). Liefert Anweisungen fuer db.batch.
export async function releaseHandleOps(db, oldH, newH) {
  if (!oldH || oldH === newH) return [];
  const H = (h) => `"h":"${h}"`, E = (h) => `"e":"${h}"`;
  if (newH) return [
    db.prepare("UPDATE event_sessions SET speakers=replace(replace(speakers,?,?),?,?) WHERE instr(speakers,?)>0").bind(H(oldH), H(newH), E(oldH), E(newH), H(oldH)),
    db.prepare("UPDATE speaker_ref SET handle=? WHERE handle=?").bind(newH, oldH),
    db.prepare("UPDATE OR IGNORE blog_follows SET handle=? WHERE handle=?").bind(newH, oldH), db.prepare("DELETE FROM blog_follows WHERE handle=?").bind(oldH),
  ];
  return [...(await mapSpeakers(db, oldH, ({ h, e, t, ...x }) => (e && e !== oldH ? { ...x, e } : x))),
    db.prepare("UPDATE speaker_ref SET handle='' WHERE handle=?").bind(oldH), db.prepare("DELETE FROM blog_follows WHERE handle=?").bind(oldH)];
}

// Alle Sessions mit einem Speaker-Eintrag h=<handle>: Eintraege mit fn umschreiben (Anweisungen fuer db.batch)
export async function mapSpeakers(db, handle, fn, skip = new Set()) {
  const ops = [];
  for (const r of (await db.prepare("SELECT id,speakers FROM event_sessions WHERE instr(speakers,?)>0").bind(`"h":"${handle}"`).all()).results || []) {
    if (skip.has(r.id)) continue;
    let sp; try { sp = JSON.parse(r.speakers); } catch { continue; }
    if (!Array.isArray(sp) || !sp.some((x) => x?.h === handle)) continue;
    ops.push(db.prepare("UPDATE event_sessions SET speakers=? WHERE id=?").bind(JSON.stringify(sp.map((x) => (x?.h === handle ? fn(x) : x))), r.id));
  }
  return ops;
}

// Uebersetzungen geloeschter Inhalte mitloeschen (item_tr ist die Quelle, translation die Kopie - beide, sonst kaeme die Kopie beim naechsten
// importTranslations zurueck). where waehlt die Zeilen der Tabelle, deren id die item_id ist (K21).
export function dropTranslationOps(db, kind, table, where, ...b) {
  return [db.prepare(`DELETE FROM item_tr WHERE kind=? AND item_id IN (SELECT id FROM ${table} WHERE ${where})`).bind(kind, ...b),
    db.prepare(`DELETE FROM translation WHERE kind=? AND item_id IN (SELECT CAST(id AS TEXT) FROM ${table} WHERE ${where})`).bind(kind, ...b)];
}
