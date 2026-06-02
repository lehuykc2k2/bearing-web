-- =============================================
-- SCHEMA HOÀN CHỈNH – WEBSITE BÁN VÒNG BI D&X
-- Chạy toàn bộ file này trong Supabase SQL Editor
-- (Dùng cho project mới hoàn toàn)
-- =============================================

-- ── 1. CẤU HÌNH SHOP ──────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

INSERT INTO settings (key, value) VALUES
  ('shop_name',    'D&X Bearings'),
  ('slogan',       'More Stable – More Efficient – More At Ease'),
  ('phone',        '0909 123 456'),
  ('address',      '123 Đường Công Nghiệp, KCN Tân Bình, TP.HCM'),
  ('zalo',         '0909123456'),
  ('facebook',     ''),
  ('messenger',    ''),
  ('banner_title', 'D&X Rolling Bearings'),
  ('banner_sub',   'Chuyên cung cấp vòng bi chính hãng – Ổn định, hiệu quả, bền bỉ')
ON CONFLICT (key) DO NOTHING;

-- ── 2. DANH MỤC ───────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  slug       TEXT        NOT NULL UNIQUE,
  sort_order INT         NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO categories (name, slug, sort_order) VALUES
  ('Vòng bi cầu',    'vong-bi-cau',    1),
  ('Vòng bi đũa',    'vong-bi-dua',    2),
  ('Vòng bi kim',    'vong-bi-kim',    3),
  ('Vòng bi chặn',   'vong-bi-chan',   4),
  ('Vòng bi tự lựa', 'vong-bi-tu-lua', 5)
ON CONFLICT (slug) DO NOTHING;

-- ── 3. SẢN PHẨM ───────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT        NOT NULL,
  slug              TEXT        NOT NULL UNIQUE,
  price             BIGINT      NOT NULL DEFAULT 0,
  short_description TEXT        NOT NULL DEFAULT '',
  description       TEXT        NOT NULL DEFAULT '',
  category_id       UUID        REFERENCES categories(id) ON DELETE SET NULL,
  image_url         TEXT        NOT NULL DEFAULT '',
  is_visible        BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order        INT         NOT NULL DEFAULT 0,
  -- Trường kỹ thuật
  ma_san_pham       TEXT        NOT NULL DEFAULT '',
  ma_vong_bi        TEXT        NOT NULL DEFAULT '',
  duong_kinh_trong  NUMERIC,
  duong_kinh_ngoai  NUMERIC,
  chieu_day         NUMERIC,
  -- Mảng ảnh sản phẩm
  images            TEXT[]      NOT NULL DEFAULT '{}',
  -- Biến thể thương hiệu: [{thuong_hieu, gia, ton_kho}]
  variants          JSONB       NOT NULL DEFAULT '[]'::jsonb,
  -- Timestamps
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index tìm kiếm theo mã
CREATE INDEX IF NOT EXISTS idx_products_ma_san_pham ON products(ma_san_pham);
CREATE INDEX IF NOT EXISTS idx_products_ma_vong_bi  ON products(ma_vong_bi);
CREATE INDEX IF NOT EXISTS idx_products_category    ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_visible     ON products(is_visible);

-- Tự cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── 4. ROW LEVEL SECURITY ─────────────────────
ALTER TABLE settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;

-- Settings
DROP POLICY IF EXISTS "settings_public_read"  ON settings;
DROP POLICY IF EXISTS "settings_admin_write"  ON settings;
CREATE POLICY "settings_public_read"  ON settings FOR SELECT USING (TRUE);
CREATE POLICY "settings_admin_write"  ON settings FOR ALL    USING (auth.role() = 'authenticated');

-- Categories
DROP POLICY IF EXISTS "categories_public_read"  ON categories;
DROP POLICY IF EXISTS "categories_admin_write"  ON categories;
CREATE POLICY "categories_public_read"  ON categories FOR SELECT USING (TRUE);
CREATE POLICY "categories_admin_write"  ON categories FOR ALL    USING (auth.role() = 'authenticated');

-- Products: khách chỉ xem sản phẩm đang hiện
DROP POLICY IF EXISTS "products_public_read"  ON products;
DROP POLICY IF EXISTS "products_admin_all"    ON products;
CREATE POLICY "products_public_read"  ON products FOR SELECT USING (is_visible = TRUE);
CREATE POLICY "products_admin_all"    ON products FOR ALL    USING (auth.role() = 'authenticated');

-- ── 5. STORAGE BUCKET ────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', TRUE)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "product_images_public_read"  ON storage.objects;
DROP POLICY IF EXISTS "product_images_admin_write"  ON storage.objects;
DROP POLICY IF EXISTS "product_images_admin_delete" ON storage.objects;

CREATE POLICY "product_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "product_images_admin_write"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "product_images_admin_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products' AND auth.role() = 'authenticated');
