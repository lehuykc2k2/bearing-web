-- Add configurable company information for footer/contact sections.
INSERT INTO settings (key, value) VALUES
  ('company_name',        'CÔNG TY TNHH THƯƠNG MẠI & KỸ THUẬT D&X VIETNAM'),
  ('company_description', 'Chuyên kinh doanh và phân phối vòng bi, phớt, dây curoa và phụ tùng công nghiệp chính hãng.'),
  ('email',               'contact@dxbearings.vn'),
  ('tax_code',            '0319139983'),
  ('business_hours',      '8h-17h Thứ 2 - Thứ 7')
ON CONFLICT (key) DO NOTHING;
