import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  const cyan = '#0BADE8'
  const pink = '#E5197E'

  const balls = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180)
    return { x: 16 + 10 * Math.cos(angle), y: 16 + 10 * Math.sin(angle), isPink: i % 2 === 1 }
  })

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#061A30',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14.5" stroke={cyan} strokeWidth="2.2" />
          <circle cx="16" cy="16" r="5.5" stroke={cyan} strokeWidth="1.8" />
          {balls.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r="2.3" fill={b.isPink ? pink : cyan} />
          ))}
          <circle cx="16" cy="16" r="1.5" fill="white" />
        </svg>
      </div>
    ),
    { ...size },
  )
}
