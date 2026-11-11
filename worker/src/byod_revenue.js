// Erloese auf Blog-Domains nach Art trennen und die Beteiligung ausrechnen (Mirko 11.11.2026). NUR VORBEREITET: keine Auszahlung.
//   banner_ad  = Banner-Werbung (Werbeplaetze) auf den Seiten des Blogs: 70 % Autor, 30 % M365.FM
//   sponsoring = Sponsoring-Pakete, Sponsoren-Beitraege, Themen-/Entitaets-Sponsoring: 100 % bei M365.FM (keine Beteiligung)
export const REVENUE_KINDS = ["banner_ad", "sponsoring"];
export const REVENUE_SPLIT = { banner_ad: { author_bp: 7000, platform_bp: 3000 }, sponsoring: { author_bp: 0, platform_bp: 10000 } };

// Teilt einen Betrag in Cent. Der Rundungsrest (unter 1 Cent) bleibt bei der Plattform. Unbekannte Art oder ungueltiger Betrag: null.
export function splitRevenue(kind, cents) {
  const s = REVENUE_SPLIT[kind];
  if (!s || !Number.isInteger(cents) || cents < 0) return null;
  const author = Math.floor((cents * s.author_bp) / 10000);
  return { kind, gross_cents: cents, author_bp: s.author_bp, platform_bp: s.platform_bp, author_cents: author, platform_cents: cents - author };
}

// Zeile fuer blog_revenue (status 'open'); die Beteiligung wird hier gesetzt, nie vom Aufrufer. Nichts wird ausgezahlt.
export async function recordRevenue(db, { userId, domainId = 0, kind, period, cents, currency = "EUR", ref = "" }, now = () => Math.floor(Date.now() / 1000)) {
  const sp = splitRevenue(kind, cents);
  if (!sp || !userId || !/^\d{4}-(0[1-9]|1[0-2])$/.test(String(period))) return { error: "bad_revenue" };
  if (!/^[A-Z]{3}$/.test(currency)) return { error: "bad_currency" };
  const r = await db.prepare("INSERT INTO blog_revenue(user_id,domain_id,kind,period,gross_cents,currency,author_bp,platform_bp,author_cents,platform_cents,ref,status,created) VALUES(?,?,?,?,?,?,?,?,?,?,?,'open',?)")
    .bind(userId, domainId, kind, period, sp.gross_cents, currency, sp.author_bp, sp.platform_bp, sp.author_cents, sp.platform_cents, String(ref).slice(0, 120), now()).run();
  return { ok: true, id: r.meta.last_row_id, ...sp };
}
