-- =============================================
-- CONSOLIDATED MIGRATION
-- Run this after schema.sql.
-- Replaces the previous migration_*.sql files.
-- =============================================

BEGIN;

-- 1. Product columns added after the original schema.
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS brand             TEXT    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS ma_san_pham       TEXT    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS ma_vong_bi        TEXT    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS duong_kinh_trong  NUMERIC,
  ADD COLUMN IF NOT EXISTS duong_kinh_ngoai  NUMERIC,
  ADD COLUMN IF NOT EXISTS chieu_day         NUMERIC,
  ADD COLUMN IF NOT EXISTS images            TEXT[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS variants          JSONB   NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS description_html  TEXT    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS spec_image_url    TEXT    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS spec_notes        TEXT    NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_products_brand        ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_ma_san_pham  ON products(ma_san_pham);
CREATE INDEX IF NOT EXISTS idx_products_ma_vong_bi   ON products(ma_vong_bi);

UPDATE products
SET description_html = '<p>' || replace(description, E'\n', '</p><p>') || '</p>'
WHERE description <> ''
  AND description_html = '';

-- 2. Company/contact settings.
INSERT INTO settings (key, value) VALUES
  ('company_name',        'CÔNG TY TNHH THƯƠNG MẠI & KỸ THUẬT D&X VIETNAM'),
  ('company_description', 'Chuyên kinh doanh và phân phối vòng bi, phớt, dây curoa và phụ tùng công nghiệp chính hãng.'),
  ('email',               'contact@dxbearings.vn'),
  ('tax_code',            '0319139983'),
  ('business_hours',      '8h-17h Thứ 2 - Thứ 7')
ON CONFLICT (key) DO NOTHING;

-- 3. Quote requests.
CREATE TABLE IF NOT EXISTS quote_requests (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  phone        TEXT        NOT NULL,
  product_id   UUID        REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT,
  message      TEXT,
  status       TEXT        NOT NULL DEFAULT 'new',
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE INDEX IF NOT EXISTS idx_quote_requests_status     ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert quote_requests" ON quote_requests;
DROP POLICY IF EXISTS "Authenticated can read quote_requests" ON quote_requests;
DROP POLICY IF EXISTS "Authenticated can update quote_requests" ON quote_requests;

CREATE POLICY "Public can insert quote_requests"
  ON quote_requests FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated can read quote_requests"
  ON quote_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update quote_requests"
  ON quote_requests FOR UPDATE
  TO authenticated
  USING (true);

-- 4. Sales contacts.
CREATE TABLE IF NOT EXISTS sales_contacts (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL DEFAULT '',
  phone      TEXT        NOT NULL DEFAULT '',
  zalo       TEXT        NOT NULL DEFAULT '',
  role       TEXT        NOT NULL DEFAULT 'Kinh doanh',
  sort_order INT         NOT NULL DEFAULT 0,
  is_active  BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE sales_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read sales_contacts" ON sales_contacts;
DROP POLICY IF EXISTS "Auth manage sales_contacts" ON sales_contacts;

CREATE POLICY "Public read sales_contacts"
  ON sales_contacts FOR SELECT
  USING (true);

CREATE POLICY "Auth manage sales_contacts"
  ON sales_contacts FOR ALL
  USING (auth.role() = 'authenticated');

INSERT INTO sales_contacts (name, phone, zalo, role, sort_order)
SELECT v.name, v.phone, v.zalo, v.role, v.sort_order
FROM (
  VALUES
    ('Anh Huy',  '0977209391', '0977209391', 'Kinh doanh', 1),
    ('Chị Linh', '0972071512', '0972071512', 'Kinh doanh', 2),
    ('Anh Khoa', '0909123456', '0909123456', 'Kinh doanh', 3)
) AS v(name, phone, zalo, role, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM sales_contacts sc WHERE sc.phone = v.phone
);

-- 5. Optional AGA sample products.
INSERT INTO products (
  name, slug, brand, price, short_description, description,
  category_id, is_visible, sort_order,
  ma_san_pham, ma_vong_bi,
  duong_kinh_trong, duong_kinh_ngoai, chieu_day,
  images, variants
)
SELECT
  v.name,
  v.slug,
  v.brand,
  v.price,
  v.short_description,
  v.description,
  (SELECT id FROM categories WHERE slug = v.category_slug LIMIT 1),
  true,
  v.sort_order,
  v.ma_san_pham,
  v.ma_vong_bi,
  v.duong_kinh_trong,
  v.duong_kinh_ngoai,
  v.chieu_day,
  '{}'::text[],
  '[]'::jsonb
FROM (
  VALUES
    (
      'Vòng bi cầu AGA 6205',
      'vong-bi-cau-aga-6205',
      'AGA',
      185000,
      'Vòng bi cầu rãnh sâu AGA 6205 - d25mm - D52mm - B15mm',
      'Vòng bi cầu rãnh sâu AGA 6205 chính hãng. Phù hợp cho động cơ điện, máy bơm, hộp số công nghiệp nhẹ. Chịu tải hướng tâm tốt, vận hành êm ái.',
      'vong-bi-cau',
      10,
      'AGA-6205',
      '6205',
      25,
      52,
      15
    ),
    (
      'Vòng bi cầu AGA 6305',
      'vong-bi-cau-aga-6305',
      'AGA',
      245000,
      'Vòng bi cầu rãnh sâu AGA 6305 - d25mm - D62mm - B17mm',
      'Vòng bi cầu rãnh sâu AGA 6305 chính hãng. Tải trọng cao hơn series 62xx, thích hợp cho máy nông nghiệp, băng tải, quạt công nghiệp.',
      'vong-bi-cau',
      11,
      'AGA-6305',
      '6305',
      25,
      62,
      17
    ),
    (
      'Vòng bi đũa trụ AGA NU205',
      'vong-bi-dua-aga-nu205',
      'AGA',
      0,
      'Vòng bi đũa trụ AGA NU205 - d25mm - D52mm - B15mm',
      'Vòng bi đũa trụ AGA NU205 chính hãng. Chịu tải hướng tâm rất cao, cho phép dịch chuyển trục dọc. Ứng dụng trong hộp số, máy công cụ, thiết bị nặng.',
      'vong-bi-dua',
      12,
      'AGA-NU205',
      'NU205',
      25,
      52,
      15
    )
) AS v(
  name, slug, brand, price, short_description, description,
  category_slug, sort_order, ma_san_pham, ma_vong_bi,
  duong_kinh_trong, duong_kinh_ngoai, chieu_day
)
WHERE NOT EXISTS (
  SELECT 1 FROM products p WHERE p.ma_san_pham = v.ma_san_pham
)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
