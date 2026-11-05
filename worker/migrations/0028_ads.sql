-- #281 Werbeplaetze direkt buchen: Banner (TKP), Firmenkarte (pro Klick), Lead-Formular (pro Lead), PayPal (Orders v2 / Invoicing v2).
-- Nummer 0028: 0025 = PR #280 (user_identities), 0026 = PR #234 (Event-Import), 0027 = MVP-Tracker.

-- Plaetze/Produkte: Preis je Seitentyp im Admin aenderbar (kein Code noetig). kind: cpm = Preis je 1.000 Einblendungen, cpc = je Klick, cpl = je Lead.
CREATE TABLE IF NOT EXISTS ad_products (
  id TEXT PRIMARY KEY,                       -- banner_top | banner_mid | banner_bottom | company_card | lead_form
  kind TEXT NOT NULL CHECK(kind IN ('cpm','cpc','cpl')),
  slot TEXT NOT NULL CHECK(slot IN ('top','mid','bottom')),
  width INTEGER NOT NULL DEFAULT 0,
  height INTEGER NOT NULL DEFAULT 0,
  mobile_width INTEGER NOT NULL DEFAULT 0,
  mobile_height INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  sort INTEGER NOT NULL DEFAULT 0,
  updated INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS ad_prices (
  product TEXT NOT NULL,
  page_type TEXT NOT NULL CHECK(page_type IN ('episode','lang','entity','blog','other')),
  price_cents INTEGER NOT NULL CHECK(price_cents >= 0),
  active INTEGER NOT NULL DEFAULT 1,
  updated INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(product, page_type)
);
-- Regeln und Aufschlaege (Prozent/Cent als Zahl), ebenfalls im Admin aenderbar
CREATE TABLE IF NOT EXISTS ad_settings (k TEXT PRIMARY KEY, v TEXT NOT NULL, updated INTEGER NOT NULL DEFAULT 0);

INSERT OR IGNORE INTO ad_products(id,kind,slot,width,height,mobile_width,mobile_height,sort) VALUES
  ('banner_top','cpm','top',728,90,320,100,1),
  ('banner_mid','cpm','mid',300,250,300,250,2),
  ('banner_bottom','cpm','bottom',728,90,320,100,3),
  ('company_card','cpc','mid',0,0,0,0,4),
  ('lead_form','cpl','mid',0,0,0,0,5);
-- Einfuehrungspreise (Mirko, 5.11.2026): oben 40 €, Mitte 25 €, unten 15 € TKP; Firmenkarte 0,80 € je Klick; Lead 20 € (freies Profil).
-- Seitentypen: Show-Folgen, Sprachseiten, Entitaeten und Blogbeitraege (Mirko, 5.11.2026: alle Inhaltsseiten inkl. Blog).
INSERT OR IGNORE INTO ad_prices(product,page_type,price_cents,active) VALUES
  ('banner_top','episode',4000,1),('banner_top','lang',4000,1),('banner_top','entity',4000,1),('banner_top','blog',4000,1),
  ('banner_mid','episode',2500,1),('banner_mid','lang',2500,1),('banner_mid','entity',2500,1),('banner_mid','blog',2500,1),
  ('banner_bottom','episode',1500,1),('banner_bottom','lang',1500,1),('banner_bottom','entity',1500,1),('banner_bottom','blog',1500,1),
  ('company_card','episode',80,1),('company_card','lang',80,1),('company_card','entity',80,1),('company_card','blog',80,1),
  ('lead_form','episode',2000,1),('lead_form','lang',2000,1),('lead_form','entity',2000,1),('lead_form','blog',2000,1);
INSERT OR IGNORE INTO ad_settings(k,v) VALUES
  ('min_impressions','10000'),('min_clicks','1'),('min_leads','1'),
  ('topic_pct','25'),('exclusive_pct','50'),('runtime3_pct','10'),('runtime6_pct','20'),
  ('lead_expert_cents','1000'),('lead_premium_cents','500'),('premium_included_leads','10'),
  ('vat_pct','19'),('reverse_charge','0'),('invoice_due_days','14'),('intro_prices','1');

-- Lead-Preisstufe je Firma (freies Profil 20 €, Expert-Profil 10 €, Premium 5 € nach den enthaltenen Leads); setzt der Admin
CREATE TABLE IF NOT EXISTS ad_accounts (
  org_id INTEGER PRIMARY KEY,
  plan TEXT NOT NULL DEFAULT 'free' CHECK(plan IN ('free','expert','premium')),
  included_leads INTEGER NOT NULL DEFAULT 0,
  updated INTEGER NOT NULL DEFAULT 0
);

-- Buchung = Kampagne. Preis wird nur auf dem Server berechnet (price_json = Positionen). Start nur bei pay_status=paid UND creative_status=approved.
CREATE TABLE IF NOT EXISTS ad_bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,                 -- Go-Link /go/<code>
  org_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  product TEXT NOT NULL,
  page_types TEXT NOT NULL DEFAULT '',       -- kommagetrennt
  topics TEXT NOT NULL DEFAULT '',           -- Entitaets-IDs, kommagetrennt (leer = alle passenden Seiten)
  exclusive INTEGER NOT NULL DEFAULT 0,
  months INTEGER NOT NULL DEFAULT 1,
  quantity INTEGER NOT NULL,                 -- Einblendungen (cpm), Klicks (cpc) oder Leads (cpl), im Voraus bezahlt
  delivered INTEGER NOT NULL DEFAULT 0,      -- verbraucht (abgerechnete Einheiten)
  start TEXT,
  end TEXT,
  target_url TEXT NOT NULL DEFAULT '',
  alt TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  banner_url TEXT NOT NULL DEFAULT '',
  banner_w INTEGER NOT NULL DEFAULT 0,
  banner_h INTEGER NOT NULL DEFAULT 0,
  mobile_url TEXT NOT NULL DEFAULT '',
  mobile_w INTEGER NOT NULL DEFAULT 0,
  mobile_h INTEGER NOT NULL DEFAULT 0,
  price_json TEXT NOT NULL DEFAULT '{}',
  net_cents INTEGER NOT NULL DEFAULT 0,
  tax_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EUR',
  billing_json TEXT NOT NULL DEFAULT '{}',   -- Firma, Adresse, USt-ID, E-Mail
  pay_method TEXT NOT NULL DEFAULT 'paypal' CHECK(pay_method IN ('paypal','invoice')),
  pay_status TEXT NOT NULL DEFAULT 'pending' CHECK(pay_status IN ('pending','approved','paid','denied','refunded','cancelled')),
  paypal_order_id TEXT NOT NULL DEFAULT '',
  paypal_capture_id TEXT NOT NULL DEFAULT '',
  paypal_invoice_id TEXT NOT NULL DEFAULT '',
  invoice_url TEXT NOT NULL DEFAULT '',
  creative_status TEXT NOT NULL DEFAULT 'pending' CHECK(creative_status IN ('pending','approved','rejected')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','awaiting','active','paused','ended','cancelled')),
  reject_reason TEXT NOT NULL DEFAULT '',
  lang TEXT NOT NULL DEFAULT 'en',
  paid_at INTEGER NOT NULL DEFAULT 0,
  approved_at INTEGER NOT NULL DEFAULT 0,
  created INTEGER NOT NULL,
  updated INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ad_bookings_serve ON ad_bookings(status, product);
CREATE INDEX IF NOT EXISTS idx_ad_bookings_org ON ad_bookings(org_id, created);
CREATE INDEX IF NOT EXISTS idx_ad_bookings_order ON ad_bookings(paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_ad_bookings_invoice ON ad_bookings(paypal_invoice_id);

-- Zaehler ohne Cookies und ohne Personenbezug: je Kampagne, Platz, Seitentyp, Land (Cloudflare cf.country, nur der Laendercode) und Tag
CREATE TABLE IF NOT EXISTS ad_stats_daily (
  day TEXT NOT NULL,
  booking_id INTEGER NOT NULL,
  slot TEXT NOT NULL,
  page_type TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'XX',
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  leads INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(day, booking_id, slot, page_type, country)
);
-- Hausanzeigen (M365Con, Services, Werben/Sponsoring, Hausanzeigen aus dem Admin): dieselben cookiefreien Zaehler, dazu Sprache der Seite
CREATE TABLE IF NOT EXISTS ad_house_stats (
  day TEXT NOT NULL,
  house TEXT NOT NULL,                       -- m365con | services | advertise | sponsor | x<id> (ad_house)
  slot TEXT NOT NULL,                        -- top | mid | mid2 | bottom
  page_type TEXT NOT NULL,
  lang TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'XX',
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(day, house, slot, page_type, lang, country)
);
CREATE INDEX IF NOT EXISTS idx_ad_house_stats_house ON ad_house_stats(house, day);
CREATE INDEX IF NOT EXISTS idx_ad_stats_booking ON ad_stats_daily(booking_id, day);

-- Leads (Kontakt zu Firma X): Einwilligung Pflicht; ungueltige/doppelte Leads werden gutgeschrieben (nicht verbraucht)
CREATE TABLE IF NOT EXISTS ad_leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL,
  org_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  consent_text TEXT NOT NULL,
  page TEXT NOT NULL DEFAULT '',
  lang TEXT NOT NULL DEFAULT 'en',
  email_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','duplicate','disputed','credited')),
  charged INTEGER NOT NULL DEFAULT 1,
  dispute_reason TEXT NOT NULL DEFAULT '',
  mailed INTEGER NOT NULL DEFAULT 0,
  created INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ad_leads_org ON ad_leads(org_id, created);
CREATE INDEX IF NOT EXISTS idx_ad_leads_dup ON ad_leads(booking_id, email_hash, created);

-- PayPal-Webhooks: Idempotenz ueber die Event-ID
CREATE TABLE IF NOT EXISTS paypal_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  resource_id TEXT NOT NULL DEFAULT '',
  booking_id INTEGER NOT NULL DEFAULT 0,
  received INTEGER NOT NULL,
  processed INTEGER NOT NULL DEFAULT 0,
  result TEXT NOT NULL DEFAULT ''
);

-- Hausanzeigen aus dem Admin (Rueckfall vor den fest eingebauten Hausanzeigen der Seite)
CREATE TABLE IF NOT EXISTS ad_house (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slot TEXT NOT NULL CHECK(slot IN ('top','mid','bottom')),
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  cta TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL,
  langs TEXT NOT NULL DEFAULT '',            -- leer = alle Sprachen
  start TEXT,
  end TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created INTEGER NOT NULL
);
