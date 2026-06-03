-- =============================================
-- MIGRATION: Rich content HTML cho mô tả & thông số
-- Chạy trong Supabase SQL Editor
-- =============================================

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS description_html TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS spec_image_url   TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS spec_notes       TEXT NOT NULL DEFAULT '';

-- Migrate: chuyển description text cũ sang description_html
UPDATE products
SET description_html = '<p>' || replace(description, E'\n', '</p><p>') || '</p>'
WHERE description <> ''
  AND description_html = '';
