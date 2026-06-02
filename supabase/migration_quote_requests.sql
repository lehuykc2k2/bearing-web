-- Migration: Tạo bảng quote_requests cho form báo giá
CREATE TABLE IF NOT EXISTS quote_requests (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  phone       TEXT        NOT NULL,
  product_id  UUID        REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT,
  message     TEXT,
  status      TEXT        NOT NULL DEFAULT 'new',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index để admin lọc theo status và sort theo thời gian
CREATE INDEX IF NOT EXISTS idx_quote_requests_status     ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);

-- RLS
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Ai cũng có thể gửi yêu cầu báo giá
CREATE POLICY "Public can insert quote_requests"
  ON quote_requests FOR INSERT
  TO public
  WITH CHECK (true);

-- Chỉ admin (authenticated) mới đọc và cập nhật được
CREATE POLICY "Authenticated can read quote_requests"
  ON quote_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update quote_requests"
  ON quote_requests FOR UPDATE
  TO authenticated
  USING (true);
