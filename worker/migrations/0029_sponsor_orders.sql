-- #281 Folge: Sponsoring-Pakete von /sponsor/ direkt bestellen und per PayPal-Rechnung (Invoicing v2) bezahlen.
-- Preise kommen aus data/sponsor_pricing.json (dieselbe Datei wie die Seite), der Worker rechnet sie neu; M365Con bleibt "auf Anfrage".
CREATE TABLE IF NOT EXISTS sponsor_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,                 -- sp-...
  org_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  package_json TEXT NOT NULL,                -- bereinigte Auswahl (Ziel, Laufzeit, Themen, Bausteine, Anzahlen)
  price_json TEXT NOT NULL,                  -- Positionen, vom Server berechnet
  net_cents INTEGER NOT NULL,
  tax_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  currency TEXT NOT NULL,
  billing_json TEXT NOT NULL,
  pay_method TEXT NOT NULL DEFAULT 'invoice' CHECK(pay_method IN ('invoice')),
  pay_status TEXT NOT NULL DEFAULT 'pending' CHECK(pay_status IN ('pending','paid','cancelled','refunded')),
  paypal_invoice_id TEXT NOT NULL DEFAULT '',
  invoice_url TEXT NOT NULL DEFAULT '',
  placement_id TEXT NOT NULL DEFAULT '',     -- sponsor_placements.id nach Zahlungseingang (Sponsor-Dashboard #177)
  lang TEXT NOT NULL DEFAULT 'en',
  paid_at INTEGER NOT NULL DEFAULT 0,
  created INTEGER NOT NULL,
  updated INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sponsor_orders_org ON sponsor_orders(org_id, created);
CREATE INDEX IF NOT EXISTS idx_sponsor_orders_invoice ON sponsor_orders(paypal_invoice_id);
