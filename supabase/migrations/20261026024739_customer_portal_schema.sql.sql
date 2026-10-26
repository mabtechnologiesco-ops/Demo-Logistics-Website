/*
# Customer Portal Schema

## Purpose
Adds a customer login portal where authenticated clients can view their personal
shipment history, saved delivery addresses, and active invoices.

## New Tables

### shipments
Stores a client's shipment records.
- id (uuid, PK)
- user_id (uuid, FK -> auth.users, defaults to auth.uid()) — owner
- tracking_number (text) — shipment tracking reference
- origin (text) — pickup location
- destination (text) — delivery location
- service_type (text) — e.g. 'Road Freight', 'Sea Freight', 'Express'
- status (text) — e.g. 'Pending', 'In Transit', 'Delivered', 'Delayed'
- weight_kg (numeric) — shipment weight
- created_at (timestamptz)
- updated_at (timestamptz)
- delivered_at (timestamptz, nullable)

### saved_addresses
Stores a client's reusable delivery addresses.
- id (uuid, PK)
- user_id (uuid, FK -> auth.users, defaults to auth.uid()) — owner
- label (text) — friendly name e.g. 'Warehouse A'
- recipient_name (text)
- street (text)
- city (text)
- country (text)
- postal_code (text, nullable)
- phone (text, nullable)
- is_default (boolean, default false)
- created_at (timestamptz)

### invoices
Stores a client's invoices.
- id (uuid, PK)
- user_id (uuid, FK -> auth.users, defaults to auth.uid()) — owner
- invoice_number (text) — invoice reference
- shipment_id (uuid, FK -> shipments, nullable) — linked shipment
- amount (numeric) — invoice total
- currency (text, default 'USD')
- status (text) — e.g. 'Unpaid', 'Paid', 'Overdue', 'Cancelled'
- issue_date (date)
- due_date (date, nullable)
- created_at (timestamptz)

## Security
- RLS enabled on all three tables.
- Grants: SELECT, INSERT, UPDATE, DELETE to `authenticated` only (the portal requires sign-in).
- Four owner-scoped policies per table (select/insert/update/delete) using auth.uid() = user_id.
- user_id columns default to auth.uid() so client inserts that omit user_id still satisfy WITH CHECK.
- service_role granted all verbs for potential server-side use.
- Indexes on user_id for fast per-user queries.

## Notes
1. This is a multi-user (sign-in required) schema. The frontend must build the full
   auth flow (sign-up + sign-in) so the authenticated session exists.
2. No demo data is seeded — the portal starts empty for each new account.
*/

-- ── shipments ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  tracking_number text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  service_type text NOT NULL DEFAULT 'Road Freight',
  status text NOT NULL DEFAULT 'Pending',
  weight_kg numeric(10,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  delivered_at timestamptz
);

ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON shipments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON shipments TO service_role;

CREATE INDEX IF NOT EXISTS idx_shipments_user_id ON shipments(user_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON shipments(created_at DESC);

DROP POLICY IF EXISTS "select_own_shipments" ON shipments;
CREATE POLICY "select_own_shipments" ON shipments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_shipments" ON shipments;
CREATE POLICY "insert_own_shipments" ON shipments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_shipments" ON shipments;
CREATE POLICY "update_own_shipments" ON shipments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_shipments" ON shipments;
CREATE POLICY "delete_own_shipments" ON shipments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ── saved_addresses ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  recipient_name text NOT NULL,
  street text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  postal_code text,
  phone text,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE saved_addresses ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON saved_addresses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON saved_addresses TO service_role;

CREATE INDEX IF NOT EXISTS idx_saved_addresses_user_id ON saved_addresses(user_id);

DROP POLICY IF EXISTS "select_own_addresses" ON saved_addresses;
CREATE POLICY "select_own_addresses" ON saved_addresses FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_addresses" ON saved_addresses;
CREATE POLICY "insert_own_addresses" ON saved_addresses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_addresses" ON saved_addresses;
CREATE POLICY "update_own_addresses" ON saved_addresses FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_addresses" ON saved_addresses;
CREATE POLICY "delete_own_addresses" ON saved_addresses FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ── invoices ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number text NOT NULL,
  shipment_id uuid REFERENCES shipments(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'Unpaid',
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON invoices TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON invoices TO service_role;

CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_shipment_id ON invoices(shipment_id);

DROP POLICY IF EXISTS "select_own_invoices" ON invoices;
CREATE POLICY "select_own_invoices" ON invoices FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_invoices" ON invoices;
CREATE POLICY "insert_own_invoices" ON invoices FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_invoices" ON invoices;
CREATE POLICY "update_own_invoices" ON invoices FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_invoices" ON invoices;
CREATE POLICY "delete_own_invoices" ON invoices FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
