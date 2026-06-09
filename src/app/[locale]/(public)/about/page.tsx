import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getSettings } from '@/lib/settings'
import { ShieldCheck, Truck, BadgeDollarSign, Wrench, ArrowRight, Award } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return {
    title: `Giới thiệu – ${s.shop_name}`,
    description: `${s.shop_name} – ${s.slogan}. Chuyên cung cấp vòng bi công nghiệp chính hãng hơn 10 năm kinh nghiệm.`,
  }
}

export const revalidate = 3600

const commitments = [
  { icon: ShieldCheck, title: 'Hàng chính hãng 100%', desc: 'Mỗi sản phẩm đều có nguồn gốc xuất xứ rõ ràng, tem nhãn đầy đủ, kiểm định trước khi xuất kho.', color: '#2c2a7c' },
  { icon: Truck,       title: 'Giao hàng toàn quốc',  desc: 'Đóng gói kỹ lưỡng, vận chuyển nhanh qua các đơn vị logistics uy tín, đảm bảo hàng nguyên vẹn.', color: '#c51c23' },
  { icon: BadgeDollarSign, title: 'Giá cạnh tranh',   desc: 'Nhập hàng trực tiếp từ nhà phân phối, tiết kiệm chi phí trung gian, chiết khấu tốt cho đại lý.', color: '#2c2a7c' },
  { icon: Wrench,      title: 'Tư vấn kỹ thuật',       desc: 'Đội ngũ kỹ thuật viên giàu kinh nghiệm hỗ trợ chọn đúng loại vòng bi phù hợp từng ứng dụng.', color: '#c51c23' },
]

const certifications = [
  { name: 'D&X Bearings',   desc: 'Thương hiệu chủ đạo' },
  { name: 'AGA Bearings',   desc: 'Thương hiệu thay thế' },
  { name: 'Chính hãng',     desc: 'Nguồn gốc rõ ràng, tem nhãn đầy đủ' },
  { name: 'Bảo hành',       desc: 'Đổi trả theo chính sách nhà sản xuất' },
]

export default async function AboutPage() {
  const settings = await getSettings()

  return (
    <div className="public-page-bg min-h-screen">
      {/* Banner */}
      <div className="hero-shell relative overflow-hidden">
        <Image
          src="/hero-bearings-showroom.png"
          alt="Giới thiệu D&X Bearings"
          fill priority sizes="100vw"
          className="hero-media object-cover object-center"
        />
        <div className="hero-vignette absolute inset-0" />
        <div className="hero-mesh absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#f7fafc] to-transparent" />
        <div className="soft-enter relative max-w-5xl mx-auto px-5 py-9 md:py-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2" style={{ color: '#2c2a7c' }}>
            Về chúng tôi
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-1 drop-shadow">{settings.shop_name}</h1>
          <p className="text-sm" style={{ color: '#565b61' }}>{settings.slogan}</p>
        </div>
      </div>

      {/* Giới thiệu */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#2c2a7c' }}>Câu chuyện của chúng tôi</p>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4" style={{ color: '#303030' }}>
              {settings.company_name || settings.shop_name}
            </h2>
            <div className="flex flex-col gap-3 text-sm text-slate-600 leading-relaxed">
              {settings.company_description
                ? settings.company_description.split('\n').filter(Boolean).map((line, i) => (
                    <p key={i}>{line}</p>
                  ))
                : (
                  <p>{settings.slogan}</p>
                )
              }
            </div>
          </div>

          {/* Stats — lấy từ settings hoặc để trống nếu chưa có */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { num: '10+',     label: 'Thương hiệu',         color: '#2c2a7c' },
              { num: '1000+', label: 'Loại vòng bi',         color: '#c51c23' },
              { num: '3+',     label: 'Nhân viên tư vấn',     color: '#2c2a7c' },
              { num: '24h',   label: 'Hỗ trợ & tư vấn',     color: '#c51c23' },
            ].map(({ num, label, color }) => (
              <div key={label} className="stat-tile rounded-xl p-5 text-center">
                <div className="text-3xl font-black mb-1" style={{ color }}>{num}</div>
                <div className="text-xs font-semibold" style={{ color: '#303030' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cam kết */}
      <section className="section-soft py-12 md:py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#2c2a7c' }}>Giá trị cốt lõi</p>
            <h2 className="text-2xl font-extrabold" style={{ color: '#303030' }}>Cam kết với khách hàng</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {commitments.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="feature-tile rounded-xl p-5 flex gap-4">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${color}18`, color }}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm mb-1" style={{ color: '#303030' }}>{title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chứng nhận */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-14">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#2c2a7c' }}>Uy tín</p>
          <h2 className="text-2xl font-extrabold" style={{ color: '#303030' }}>Chứng nhận & Đối tác</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {certifications.map(({ name, desc }) => (
            <div key={name} className="filter-panel rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center"
                style={{ background: '#f7fafc', color: '#2c2a7c' }}>
                <Award size={20} />
              </div>
              <p className="font-bold text-sm mb-0.5" style={{ color: '#303030' }}>{name}</p>
              <p className="text-xs text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-soft py-10 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl font-extrabold mb-2" style={{ color: '#303030' }}>Sẵn sàng hợp tác?</h2>
          <p className="text-sm text-slate-500 mb-6">Liên hệ ngay để được tư vấn miễn phí và nhận báo giá tốt nhất.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact"
              className="focus-ring interactive-lift flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-lg text-sm text-white"
              style={{ background: 'linear-gradient(135deg,#2c2a7c 0%,#0c3263 100%)' }}>
              Liên hệ ngay <ArrowRight size={15} />
            </Link>
            <Link href="/products"
              className="focus-ring interactive-lift flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-lg text-sm border"
              style={{ borderColor: '#2c2a7c', color: '#2c2a7c', background: '#f7fafc' }}>
              Xem sản phẩm <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
