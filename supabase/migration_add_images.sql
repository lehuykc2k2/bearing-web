-- =============================================
-- MIGRATION: Thêm cột images (mảng ảnh sản phẩm)
-- Chạy trong Supabase SQL Editor (sau schema.sql)
-- =============================================

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS images TEXT[] NOT NULL DEFAULT '{}';
