import ZoomableImage from './ZoomableImage'

interface Props {
  ma_san_pham?:      string
  ma_vong_bi?:       string
  duong_kinh_trong?: number | null
  duong_kinh_ngoai?: number | null
  chieu_day?:        number | null
  spec_image_url?:   string | null
  spec_notes?:       string | null
}

/* Sơ đồ mặt cắt vòng bi (SVG, không cần file ảnh bên ngoài) */
function BearingDiagram({
  d, D, B,
}: { d?: number | null; D?: number | null; B?: number | null }) {
  const cx = 88
  const cy = 90
  const rOuter = 68
  const rOuterWall = 56
  const rInnerWall = 30
  const rInner = 18
  const ballCount = 8
  const rBallOrbit = (rOuterWall + rInnerWall) / 2
  const rBall = (rOuterWall - rInnerWall) / 2 - 1

  const balls = Array.from({ length: ballCount }, (_, i) => {
    const angle = (i * 2 * Math.PI) / ballCount - Math.PI / 2
    return {
      x: cx + rBallOrbit * Math.cos(angle),
      y: cy + rBallOrbit * Math.sin(angle),
    }
  })

  return (
    <svg
      viewBox="0 0 176 200"
      className="w-full max-w-[200px] mx-auto"
      aria-hidden="true"
    >
      {/* --- mặt cắt vòng ngoài --- */}
      <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="#2c2a7c" strokeWidth="12" strokeOpacity="0.18" />
      <circle cx={cx} cy={cy} r={rOuterWall} fill="none" stroke="#2c2a7c" strokeWidth="12" strokeOpacity="0.55" />

      {/* --- bi --- */}
      {balls.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r={rBall}
          fill="#e5e8ea" stroke="#2c2a7c" strokeWidth="1.2" strokeOpacity="0.55" />
      ))}

      {/* --- mặt cắt vòng trong --- */}
      <circle cx={cx} cy={cy} r={rInnerWall} fill="none" stroke="#2c2a7c" strokeWidth="12" strokeOpacity="0.55" />
      <circle cx={cx} cy={cy} r={rInner} fill="none" stroke="#2c2a7c" strokeWidth="12" strokeOpacity="0.18" />

      {/* lỗ bore */}
      <circle cx={cx} cy={cy} r={rInner - 6} fill="white" />

      {/* === annotation d (bore) === */}
      {d && (
        <>
          {/* mũi tên ngang qua bore */}
          <line x1={cx - (rInner - 6)} y1={cy} x2={cx + (rInner - 6)} y2={cy}
            stroke="#c51c23" strokeWidth="1" markerEnd="url(#arr-r)" markerStart="url(#arr-l)" />
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fontWeight="700" fill="#c51c23">
            d={d}mm
          </text>
        </>
      )}

      {/* === annotation D (OD) === */}
      {D && (
        <>
          <line x1={cx} y1={cy - rOuter} x2={cx} y2={cy - rInner + 6}
            stroke="#c51c23" strokeWidth="1" markerEnd="url(#arr-u)" markerStart="url(#arr-d)" strokeDasharray="2 1" />
          <text x={cx + 4} y={cy - rOuter / 2 - 2} textAnchor="start" fontSize="9" fontWeight="700" fill="#c51c23">
            D={D}mm
          </text>
        </>
      )}

      {/* === annotation B (width) — hiển thị ở dưới dạng text === */}
      {B && (
        <text x={cx} y={188} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#2c2a7c">
          B = {B} mm
        </text>
      )}

      {/* Arrowhead markers */}
      <defs>
        <marker id="arr-r" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <polygon points="0,0 4,2.5 0,5" fill="#c51c23" />
        </marker>
        <marker id="arr-l" markerWidth="5" markerHeight="5" refX="0" refY="2.5" orient="auto-start-reverse">
          <polygon points="0,0 4,2.5 0,5" fill="#c51c23" />
        </marker>
        <marker id="arr-u" markerWidth="5" markerHeight="5" refX="2.5" refY="0" orient="auto">
          <polygon points="0,4 2.5,0 5,4" fill="#c51c23" />
        </marker>
        <marker id="arr-d" markerWidth="5" markerHeight="5" refX="2.5" refY="4" orient="auto-start-reverse">
          <polygon points="0,4 2.5,0 5,4" fill="#c51c23" />
        </marker>
      </defs>
    </svg>
  )
}

export default function ProductSpecSheet({
  ma_san_pham, ma_vong_bi,
  duong_kinh_trong, duong_kinh_ngoai, chieu_day,
  spec_image_url, spec_notes,
}: Props) {
  const rows = [
    { label: 'Mã sản phẩm',      symbol: '—',  value: ma_san_pham        ? String(ma_san_pham) : null },
    { label: 'Mã vòng bi',       symbol: '—',  value: ma_vong_bi          ? String(ma_vong_bi)  : null },
    { label: 'Đường kính lỗ',    symbol: 'd',  value: duong_kinh_trong    != null ? `${duong_kinh_trong} mm` : null },
    { label: 'Đường kính ngoài', symbol: 'D',  value: duong_kinh_ngoai   != null ? `${duong_kinh_ngoai} mm` : null },
    { label: 'Chiều rộng',       symbol: 'B',  value: chieu_day           != null ? `${chieu_day} mm`        : null },
  ].filter(r => r.value)

  if (rows.length === 0 && !spec_image_url && !spec_notes) return null

  const hasDimensions = duong_kinh_trong || duong_kinh_ngoai || chieu_day

  return (
    <section
      className="detail-panel rounded-xl overflow-hidden"
      aria-labelledby="spec-heading"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b" style={{ borderColor: '#e5e8ea', background: '#f7fafc' }}>
        <span className="w-1 h-5 rounded-full" style={{ background: '#2c2a7c' }} />
        <h2 id="spec-heading" className="text-sm font-extrabold uppercase tracking-widest" style={{ color: '#2c2a7c' }}>
          Thông số kỹ thuật
        </h2>
      </div>

      <div className="p-5 flex flex-col sm:flex-row gap-6 items-start">

        {/* Cột trái — sơ đồ */}
        {(spec_image_url || hasDimensions) && (
          <div className="w-full sm:w-[200px] shrink-0">
            {spec_image_url ? (
              <ZoomableImage
                src={spec_image_url}
                alt="Bảng thông số kỹ thuật"
                width={400}
                height={300}
                className="rounded-lg overflow-hidden border"
                imgClassName="w-full object-contain bg-white"
              />
            ) : (
              <div className="rounded-lg border p-3 bg-white" style={{ borderColor: '#e5e8ea' }}>
                <BearingDiagram
                  d={duong_kinh_trong}
                  D={duong_kinh_ngoai}
                  B={chieu_day}
                />
                <p className="text-center text-[10px] mt-1" style={{ color: '#a0a3a6' }}>
                  Sơ đồ minh họa
                </p>
              </div>
            )}
          </div>
        )}

        {/* Cột phải — bảng thông số */}
        {rows.length > 0 && (
          <div className="flex-1 w-full">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: '#e5e8ea' }}>
                  <th className="text-left py-2 pr-3 text-xs font-semibold w-6" style={{ color: '#a0a3a6' }}>
                    Ký hiệu
                  </th>
                  <th className="text-left py-2 pr-3 text-xs font-semibold" style={{ color: '#a0a3a6' }}>
                    Thông số
                  </th>
                  <th className="text-right py-2 text-xs font-semibold" style={{ color: '#a0a3a6' }}>
                    Giá trị
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={i}
                    className="border-b last:border-0"
                    style={{ borderColor: '#eef1f3' }}
                  >
                    <td className="py-2.5 pr-3">
                      {r.symbol !== '—' ? (
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-black"
                          style={{ background: '#2c2a7c', color: 'white' }}
                        >
                          {r.symbol}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-2.5 pr-3 text-sm font-medium" style={{ color: '#5a5c5e' }}>
                      {r.label}
                    </td>
                    <td className="py-2.5 text-right font-bold tabular-nums" style={{ color: '#303030' }}>
                      {r.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ISO note */}
            <p className="mt-3 text-[11px] leading-snug" style={{ color: '#a0a3a6' }}>
              Kích thước theo tiêu chuẩn ISO 15 (vòng bi cầu rãnh sâu). Dung sai thực tế tham khảo catalog nhà sản xuất.
            </p>

            {/* Ghi chú thêm từ admin */}
            {spec_notes && (
              <div className="mt-3 p-3 rounded-lg text-xs leading-relaxed" style={{ background: '#f7fafc', color: '#5a5c5e', borderLeft: '3px solid #2c2a7c' }}>
                {spec_notes}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
