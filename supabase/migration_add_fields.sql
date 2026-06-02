-- =============================================
-- MIGRATION: Thêm trường kỹ thuật và variants
-- Chạy trong Supabase SQL Editor (sau schema.sql)
-- =============================================

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS ma_san_pham      TEXT    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS ma_vong_bi       TEXT    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS duong_kinh_trong NUMERIC,
  ADD COLUMN IF NOT EXISTS duong_kinh_ngoai NUMERIC,
  ADD COLUMN IF NOT EXISTS chieu_day        NUMERIC,
  ADD COLUMN IF NOT EXISTS variants         JSONB   NOT NULL DEFAULT '[]'::jsonb;

-- Index tìm theo mã
CREATE INDEX IF NOT EXISTS idx_products_ma_san_pham ON products(ma_san_pham);
CREATE INDEX IF NOT EXISTS idx_products_ma_vong_bi  ON products(ma_vong_bi);
