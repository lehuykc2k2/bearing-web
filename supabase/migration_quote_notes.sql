-- Migration: Thêm cột notes vào quote_requests
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS notes TEXT;
