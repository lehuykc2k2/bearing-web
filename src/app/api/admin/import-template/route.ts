import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function GET() {
  const wb = XLSX.utils.book_new()

  // Sheet 1: Dữ liệu
  const headers = [
    'ma_san_pham', 'ten_san_pham', 'loai_vong_bi', 'ma_vong_bi', 'thuong_hieu',
    'duong_kinh_trong_mm', 'duong_kinh_ngoai_mm', 'chieu_day_mm',
    'mo_ta_ngan', 'gia_le', 'ton_kho', 'anh_1', 'noi_bat', 'trang_thai',
  ]

  const sampleRows = [
    ['VB001', 'Vòng bi 6205 NSK', 'Vòng bi cầu', '6205', 'NSK', 25, 52, 15, 'Vòng bi cầu rãnh sâu 1 dãy', 35000, 100, '', 1, 1],
    ['VB002', 'Vòng bi 6206 SKF', 'Vòng bi cầu', '6206', 'SKF', 30, 62, 16, 'Vòng bi rãnh sâu SKF chính hãng', 75000, 50, '', 0, 1],
    ['VB003', 'Vòng bi đũa NJ205', 'Vòng bi đũa', 'NJ205', 'D&X', 25, 52, 15, 'Vòng bi đũa trụ chịu tải cao', 120000, 30, '', 0, 0],
  ]

  const ws = XLSX.utils.aoa_to_sheet([
    ['FILE MẪU IMPORT SẢN PHẨM – VÒNG BI'],
    ['Lưu ý: Chỉ cần điền "ten_san_pham" là đủ. Các cột còn lại tuỳ chọn.'],
    ['trang_thai: 1 = Hiện, 0 = Ẩn  |  noi_bat: 1 = Nổi bật trang chủ, 0 = Không'],
    [],
    headers,
    ...sampleRows,
  ])

  // Style header row
  ws['!cols'] = headers.map((h, i) => ({
    wch: [12, 28, 18, 12, 12, 10, 10, 10, 36, 10, 8, 30, 8, 10][i] ?? 12,
  }))

  XLSX.utils.book_append_sheet(wb, ws, 'Dữ liệu')

  // Sheet 2: Hướng dẫn
  const guide = XLSX.utils.aoa_to_sheet([
    ['CỘT', 'MÔ TẢ', 'VÍ DỤ'],
    ['ma_san_pham',          'Mã nội bộ (tuỳ chọn)',                         'VB001'],
    ['ten_san_pham',         'Tên sản phẩm',                                  'Vòng bi 6205 NSK'],
    ['loai_vong_bi',         'Loại/danh mục (sẽ tự tạo nếu chưa có)',         'Vòng bi cầu'],
    ['ma_vong_bi',           'Mã kỹ thuật của vòng bi',                       '6205'],
    ['thuong_hieu',          'Thương hiệu (NSK, SKF, FAG, D&X...)',            'NSK'],
    ['duong_kinh_trong_mm',  'Đường kính trong (mm)',                          '25'],
    ['duong_kinh_ngoai_mm',  'Đường kính ngoài (mm)',                          '52'],
    ['chieu_day_mm',         'Chiều dày/rộng (mm)',                            '15'],
    ['mo_ta_ngan',           'Mô tả ngắn hiển thị trên card',                 'Vòng bi cầu 1 dãy...'],
    ['gia_le',               'Giá bán lẻ (VND). Để trống = Liên hệ báo giá', '35000'],
    ['ton_kho',              'Số lượng tồn kho (chỉ để lưu tham khảo)',       '100'],
    ['anh_1',                'URL ảnh sản phẩm (tuỳ chọn)',                   'https://...'],
    ['noi_bat',              '1 = Hiển thị trang chủ, 0 = Không',             '1'],
    ['trang_thai',           '1 = Hiện, 0 = Ẩn. Mặc định là Hiện',           '1'],
  ])
  guide['!cols'] = [{ wch: 22 }, { wch: 42 }, { wch: 30 }]
  XLSX.utils.book_append_sheet(wb, guide, 'Hướng dẫn')

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="mau_import_vong_bi.xlsx"',
    },
  })
}
