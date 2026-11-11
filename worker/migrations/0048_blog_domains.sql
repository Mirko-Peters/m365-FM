-- Blog auf der eigenen Domain ("Bring your own domain", BLOG_OWN_DOMAIN.md). Alles hinter dem Schalter BYOD (Standard "0").
-- blog_domains: je Mitglied eine Domain (am Anfang; die Grenze steht im Code, nicht hier). status:
--   pending  = eingetragen, wartet auf den DNS-Eintrag
--   verified = Besitz nachgewiesen (CNAME auf unser Ziel oder TXT-Token gefunden)
--   active   = wird ausgeliefert (Cloudflare meldet Hostname und Zertifikat als active, Impressum-Link vorhanden)
--   blocked  = von der Redaktion gesperrt, wird nie ausgeliefert
-- token: Pruef-Token fuer den optionalen TXT-Eintrag _m365fm-verify.<domain> (Wert "m365fm-verify=<token>").
-- cf_id / cf_status / cf_ssl: Custom Hostname bei Cloudflare (nur mit Worker-Secrets CF_API_TOKEN und CF_ZONE_ID; sonst leer).
-- imprint_url / privacy_url: Impressum und Datenschutz des Autors (https), Pflicht fuer die Aktivierung.
CREATE TABLE IF NOT EXISTS blog_domains (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','verified','active','blocked')),
  token TEXT NOT NULL,
  cf_id TEXT NOT NULL DEFAULT '',
  cf_status TEXT NOT NULL DEFAULT '',
  cf_ssl TEXT NOT NULL DEFAULT '',
  imprint_url TEXT NOT NULL DEFAULT '',
  privacy_url TEXT NOT NULL DEFAULT '',
  error TEXT NOT NULL DEFAULT '',
  created INTEGER NOT NULL,
  updated INTEGER NOT NULL,
  checked INTEGER NOT NULL DEFAULT 0,
  verified_at INTEGER NOT NULL DEFAULT 0,
  activated_at INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_blog_domains_user ON blog_domains(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_domains_status ON blog_domains(status, checked);

-- blog_revenue: Erloese auf Blog-Domains, nach Art getrennt (Mirko 11.11.2026). NUR VORBEREITET: keine Auszahlung, keine Auszahlungstabelle.
--   kind banner_ad  = Banner-Werbung auf den Seiten des Blogs: 70 % Autor, 30 % M365.FM (author_bp 7000, platform_bp 3000)
--   kind sponsoring = Sponsoring-Pakete, Sponsoren-Beitraege, Themen-/Entitaets-Sponsoring: bleibt zu 100 % bei M365.FM (author_bp 0)
-- Betraege in Cent der Waehrung, Anteile in Basispunkten (10000 = 100 %). Der Rundungsrest bleibt bei der Plattform (byod_revenue.js).
CREATE TABLE IF NOT EXISTS blog_revenue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  domain_id INTEGER NOT NULL DEFAULT 0,
  kind TEXT NOT NULL CHECK (kind IN ('banner_ad','sponsoring')),
  period TEXT NOT NULL,
  gross_cents INTEGER NOT NULL CHECK (gross_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'EUR',
  author_bp INTEGER NOT NULL,
  platform_bp INTEGER NOT NULL,
  author_cents INTEGER NOT NULL,
  platform_cents INTEGER NOT NULL,
  ref TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','reviewed','void')),
  created INTEGER NOT NULL,
  CHECK (author_bp + platform_bp = 10000),
  CHECK (kind <> 'sponsoring' OR author_bp = 0),
  CHECK (author_cents + platform_cents = gross_cents)
);
CREATE INDEX IF NOT EXISTS idx_blog_revenue_user ON blog_revenue(user_id, period);
