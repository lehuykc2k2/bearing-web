import type { Product, Category, Settings } from '@/types'

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Vòng bi cầu',    slug: 'vong-bi-cau',    sort_order: 1, created_at: '' },
  { id: 'cat-2', name: 'Vòng bi đũa',    slug: 'vong-bi-dua',    sort_order: 2, created_at: '' },
  { id: 'cat-3', name: 'Vòng bi kim',    slug: 'vong-bi-kim',    sort_order: 3, created_at: '' },
  { id: 'cat-4', name: 'Vòng bi chặn',   slug: 'vong-bi-chan',   sort_order: 4, created_at: '' },
  { id: 'cat-5', name: 'Vòng bi tự lựa', slug: 'vong-bi-tu-lua', sort_order: 5, created_at: '' },
]

const cat1 = mockCategories[0]
const cat2 = mockCategories[1]
const cat3 = mockCategories[2]
const cat4 = mockCategories[3]
const cat5 = mockCategories[4]

const base = {
  ma_san_pham: '',
  ma_vong_bi: '',
  duong_kinh_trong: null,
  duong_kinh_ngoai: null,
  chieu_day: null,
  images: [] as string[],
  variants: [] as Product['variants'],
  description_html: '',
  spec_image_url: '',
  spec_notes: '',
}

export const mockProducts: Product[] = [
  { ...base, id: 'p-001', name: 'Vòng bi cầu 6205 D&X', slug: 'vong-bi-cau-6205', price: 35000,  short_description: 'Vòng bi cầu rãnh sâu 1 dãy, 25×52×15mm. Phù hợp máy bơm, động cơ điện.', description: 'Đường kính trong: 25mm\nĐường kính ngoài: 52mm\nChiều rộng: 15mm\nTốc độ tối đa: 13,000 vòng/phút\nTải trọng động: 14.0 kN\nISO 9001', category_id: 'cat-1', image_url: '', is_visible: true, sort_order: 1, created_at: '', updated_at: '', category: cat1 },
  { ...base, id: 'p-002', name: 'Vòng bi cầu 6206 D&X', slug: 'vong-bi-cau-6206', price: 42000,  short_description: 'Vòng bi cầu rãnh sâu 1 dãy, 30×62×16mm. Máy công cụ.', description: 'Đường kính trong: 30mm\nĐường kính ngoài: 62mm\nChiều rộng: 16mm\nTải trọng động: 19.5 kN', category_id: 'cat-1', image_url: '', is_visible: true, sort_order: 2, created_at: '', updated_at: '', category: cat1 },
  { ...base, id: 'p-003', name: 'Vòng bi cầu 6207 D&X', slug: 'vong-bi-cau-6207', price: 55000,  short_description: 'Vòng bi cầu rãnh sâu 1 dãy, 35×72×17mm.', description: 'Đường kính trong: 35mm\nĐường kính ngoài: 72mm\nChiều rộng: 17mm\nTải trọng động: 25.5 kN', category_id: 'cat-1', image_url: '', is_visible: true, sort_order: 3, created_at: '', updated_at: '', category: cat1 },
  { ...base, id: 'p-004', name: 'Vòng bi cầu 6208 D&X', slug: 'vong-bi-cau-6208', price: 68000,  short_description: 'Vòng bi cầu rãnh sâu, 40×80×18mm. Tải trọng cao.', description: 'Đường kính trong: 40mm\nĐường kính ngoài: 80mm\nChiều rộng: 18mm\nTải trọng động: 29.0 kN', category_id: 'cat-1', image_url: '', is_visible: true, sort_order: 4, created_at: '', updated_at: '', category: cat1 },
  { ...base, id: 'p-005', name: 'Vòng bi cầu 6305 D&X', slug: 'vong-bi-cau-6305', price: 48000,  short_description: 'Series 6300 tải nặng, 25×62×17mm.', description: 'Đường kính trong: 25mm\nĐường kính ngoài: 62mm\nChiều rộng: 17mm', category_id: 'cat-1', image_url: '', is_visible: true, sort_order: 5, created_at: '', updated_at: '', category: cat1 },
  { ...base, id: 'p-006', name: 'Vòng bi đũa trụ NJ205 D&X', slug: 'vong-bi-dua-nj205', price: 120000, short_description: 'Vòng bi đũa trụ NJ205, 25×52×15mm. Chịu tải hướng kính cao.', description: 'Loại: NJ (có gờ 1 phía)\nĐường kính trong: 25mm\nĐường kính ngoài: 52mm\nTải trọng động: 28.5 kN', category_id: 'cat-2', image_url: '', is_visible: true, sort_order: 6, created_at: '', updated_at: '', category: cat2 },
  { ...base, id: 'p-007', name: 'Vòng bi đũa côn 30205 D&X', slug: 'vong-bi-dua-con-30205', price: 98000, short_description: 'Vòng bi đũa côn 30205, chịu tải hỗn hợp.', description: 'Đường kính trong: 25mm\nĐường kính ngoài: 52mm\nChiều rộng: 16.25mm', category_id: 'cat-2', image_url: '', is_visible: true, sort_order: 7, created_at: '', updated_at: '', category: cat2 },
  { ...base, id: 'p-008', name: 'Vòng bi kim NK25/20 D&X', slug: 'vong-bi-kim-nk25-20', price: 85000, short_description: 'Vòng bi kim NK25/20, đường kính 25mm. Kết cấu nhỏ gọn.', description: 'Đường kính lỗ trục: 25mm\nĐường kính ngoài: 33mm\nChiều dài: 20mm', category_id: 'cat-3', image_url: '', is_visible: true, sort_order: 8, created_at: '', updated_at: '', category: cat3 },
  { ...base, id: 'p-009', name: 'Vòng bi chặn 51105 D&X', slug: 'vong-bi-chan-51105', price: 55000, short_description: 'Vòng bi chặn 1 chiều 51105, 25×42×11mm. Chịu tải dọc trục.', description: 'Đường kính trong: 25mm\nĐường kính ngoài: 42mm\nChiều cao: 11mm\nTải trọng động: 20.2 kN', category_id: 'cat-4', image_url: '', is_visible: true, sort_order: 9, created_at: '', updated_at: '', category: cat4 },
  { ...base, id: 'p-010', name: 'Vòng bi tự lựa 22205 D&X', slug: 'vong-bi-tu-lua-22205', price: 195000, short_description: 'Vòng bi tự lựa đũa 22205, 25×52×18mm. Tải nặng, bù lệch tâm.', description: 'Đường kính trong: 25mm\nĐường kính ngoài: 52mm\nChiều rộng: 18mm\nGóc tự lựa: ±2.5°\nTải trọng động: 43.0 kN', category_id: 'cat-5', image_url: '', is_visible: true, sort_order: 10, created_at: '', updated_at: '', category: cat5 },
  { ...base, id: 'p-011', name: 'Vòng bi cầu 6210 ZZ D&X', slug: 'vong-bi-cau-6210-zz', price: 125000, short_description: 'Vòng bi cầu 6210 ZZ che chắn 2 mặt, 50×90×20mm.', description: 'Đường kính trong: 50mm\nĐường kính ngoài: 90mm\nChiều rộng: 20mm\nCó mỡ bôi trơn sẵn\nTải trọng động: 35.0 kN', category_id: 'cat-1', image_url: '', is_visible: true, sort_order: 11, created_at: '', updated_at: '', category: cat1 },
  { ...base, id: 'p-012', name: 'Vòng bi cầu 6211 2RS D&X', slug: 'vong-bi-cau-6211-2rs', price: 145000, short_description: 'Vòng bi cầu 6211 2RS phớt cao su 2 mặt, 55×100×21mm.', description: 'Đường kính trong: 55mm\nĐường kính ngoài: 100mm\nChiều rộng: 21mm\nChống bụi và nước\nTải trọng động: 43.0 kN', category_id: 'cat-1', image_url: '', is_visible: true, sort_order: 12, created_at: '', updated_at: '', category: cat1 },
  { ...base, id: 'p-013', name: 'Vòng bi đũa trụ NU206 D&X', slug: 'vong-bi-dua-nu206', price: 145000, short_description: 'Vòng bi đũa trụ NU206, 30×62×16mm. Cho phép dịch chuyển dọc trục.', description: 'Đường kính trong: 30mm\nĐường kính ngoài: 62mm\nChiều rộng: 16mm\nTải trọng động: 36.0 kN', category_id: 'cat-2', image_url: '', is_visible: true, sort_order: 13, created_at: '', updated_at: '', category: cat2 },
  { ...base, id: 'p-014', name: 'Vòng bi kim HK2016 D&X', slug: 'vong-bi-kim-hk2016', price: 72000, short_description: 'Vòng bi kim dạng cốc HK2016, 20×26×16mm.', description: 'Đường kính trong: 20mm\nĐường kính ngoài: 26mm\nChiều dài: 16mm', category_id: 'cat-3', image_url: '', is_visible: true, sort_order: 14, created_at: '', updated_at: '', category: cat3 },
  { ...base, id: 'p-015', name: 'Vòng bi tự lựa cầu 1205 D&X', slug: 'vong-bi-tu-lua-cau-1205', price: 110000, short_description: 'Vòng bi tự lựa cầu 2 dãy 1205, 25×52×15mm.', description: 'Đường kính trong: 25mm\nĐường kính ngoài: 52mm\nGóc tự lựa: ±3°', category_id: 'cat-5', image_url: '', is_visible: true, sort_order: 15, created_at: '', updated_at: '', category: cat5 },
]

export const mockSettings: Settings = {
  shop_name:    'D&X Bearings',
  slogan:       'More Stable – More Efficient – More At Ease',
  banner_title: 'D&X Rolling Bearings',
  banner_sub:   'Chuyên cung cấp vòng bi chính hãng – Ổn định, hiệu quả, bền bỉ',
  phone:        '0909 123 456',
  zalo:         '0909123456',
  address:      '123 Đường Công Nghiệp, KCN Tân Bình, TP.HCM',
  facebook:     '',
  messenger:    'https://m.me/dxbearings',
}
