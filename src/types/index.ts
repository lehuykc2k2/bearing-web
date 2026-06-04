export interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
  created_at: string
}

export interface ProductVariant {
  thuong_hieu: string   // thương hiệu: NSK, SKF, FAG, D&X...
  gia:         number   // giá biến thể (0 = liên hệ)
  ton_kho:     string   // tồn kho (ví dụ: "100", "Còn hàng", "Hết hàng")
}

export interface Product {
  id:                string
  name:              string
  slug:              string
  price:             number         // giá mặc định (dùng khi không có variants)
  short_description: string
  description:       string
  category_id:       string | null
  image_url:         string
  images:            string[]
  is_visible:        boolean
  sort_order:        number
  // Trường kỹ thuật
  ma_san_pham:       string
  ma_vong_bi:        string
  duong_kinh_trong:  number | null
  duong_kinh_ngoai:  number | null
  chieu_day:         number | null
  // Biến thể (nhiều thương hiệu)
  variants:          ProductVariant[]
  // Nội dung phong phú HTML
  description_html:  string
  spec_image_url:    string
  spec_notes:        string
  created_at:        string
  updated_at:        string
  category?:         Category
}

export interface Settings {
  shop_name:           string
  company_name:        string
  slogan:              string
  company_description: string
  phone:               string
  email:               string
  tax_code:            string
  address:             string
  business_hours:      string
  zalo:                string
  facebook:            string
  messenger:           string
  banner_title:        string
  banner_sub:          string
}
