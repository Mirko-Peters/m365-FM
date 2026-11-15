// Sponsor-Entitaeten sind bei gesponserten Inhalten EXTRA zur Obergrenze von 10 Themen (Pendant zu site_sponsorships.py).
export const GRACE_MONTHS = 6; // Mirko 6.11.2026
// 182 Tage nach "end" (nicht Kalendermonate): Tag 182 zaehlt noch, Tag 183 nicht mehr. Mirko 11.11.2026: dieselbe Karenzzeit gilt fuer alles, was ein laufendes
// Sponsoring zeigt (site_sponsorships._active); Lead-Annahme ueber sponsors.json (ads.js activeSponsor), deren Frist schon der Seitenbau rechnet.
export const GRACE_DAYS = 182;
export const TOPIC_CAP = 10;

const dayMs = (s) => (/^\d{4}-\d{2}-\d{2}/.test(String(s || "")) ? Date.parse(String(s).slice(0, 10) + "T00:00:00Z") : NaN);

// placements: Zeilen aus sponsor_placements dieser Organisation ({start,end}; null = offen). today: ISO-Datum.
export function inSponsorGrace(placements, today) {
  const t = dayMs(today);
  return (placements || []).some((p) => {
    const s = dayMs(p.start), e = dayMs(p.end);
    return !isNaN(t) && (isNaN(s) || s <= t) && (isNaN(e) || t <= e + GRACE_DAYS * 86400000);
  });
}

// Dashboard-Status einer Platzierung am Tag today (Mirko 11.11.2026: einmal gekauft, Dashboard und Zahlen bleiben fuer immer sichtbar):
// "upcoming" vor dem Start, "active" bis einschliesslich "end" (oder unbefristet), "grace" bis end + GRACE_DAYS (wie site_sponsorships.status/grace_end),
// danach "ended". grace_end: ISO-Datum oder null (unbefristet/ungueltig). Die gebuchte Laufzeit (start/end) bleibt unveraendert.
export function sponsorPhase(start, end, today) {
  const t = dayMs(today), s = dayMs(start), e = dayMs(end);
  const graceEnd = isNaN(e) ? null : new Date(e + GRACE_DAYS * 86400000).toISOString().slice(0, 10);
  const status = !isNaN(s) && !isNaN(t) && t < s ? "upcoming" : end == null || isNaN(e) || isNaN(t) || t <= e ? "active" : t <= e + GRACE_DAYS * 86400000 ? "grace" : "ended";
  return { status, grace_end: graceEnd };
}

// ents: [{id,type,rel:[[pred,target]]}]. Liefert [orgEid, ...Produkte] oder [] ausserhalb von Laufzeit + Karenzzeit.
export function sponsorExtraEntities(orgEid, today, placements, ents) {
  if (!orgEid || !inSponsorGrace(placements, today) || !(ents || []).some((e) => e.id === orgEid)) return [];
  const out = [orgEid];
  for (const e of ents) {
    if (out.includes(e.id)) continue;
    if ((e.rel || []).some((r) => r[1] === orgEid && (r[0] === "developed_by" || (r[0] === "part_of" && (e.type === "product" || e.type === "platform"))))) out.push(e.id);
  }
  return out;
}

// Eingabe-Themen: bis zu cap normale Themen plus die Extras (die nicht mitzaehlen). Extras stehen vorn, ohne Doppelte.
export function limitTopics(raw, extras = [], cap = TOPIC_CAP) {
  const ex = [...new Set(extras)], seen = new Set(ex), out = [];
  for (const t of Array.isArray(raw) ? raw : []) if (!seen.has(t) && out.length < cap) { seen.add(t); out.push(t); }
  return [...ex, ...out];
}
