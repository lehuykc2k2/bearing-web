interface Props {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function BrandLogo({ variant = 'light', size = 'md', showText = true }: Props) {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36
  const isLight = variant === 'light'

  const cyan  = '#2c2a7c'
  const pink  = '#c51c23'
  const white = '#ffffff'
  const dim   = isLight ? 'rgba(255,255,255,0.85)' : '#767778'

  // 6 bearing balls at 60° intervals, radius 10 from center
  const balls = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180)
    return { cx: 16 + 10 * Math.cos(angle), cy: 16 + 10 * Math.sin(angle), pink: i % 2 === 1 }
  })

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Bearing icon */}
      <svg width={iconSize} height={iconSize} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        {/* Outer ring */}
        <circle cx="16" cy="16" r="14.5" stroke={cyan} strokeWidth="2.2" />
        {/* Inner ring */}
        <circle cx="16" cy="16" r="5.5" stroke={cyan} strokeWidth="1.8" />
        {/* Bearing balls */}
        {balls.map((b, i) => (
          <circle key={i} cx={b.cx} cy={b.cy} r="2.3" fill={b.pink ? pink : cyan} />
        ))}
        {/* Center dot */}
        <circle cx="16" cy="16" r="1.5" fill={isLight ? white : cyan} />
      </svg>

      {showText && (
        <div className="leading-none">
          {/* D&X */}
          <div className="flex items-baseline gap-0.5">
            <span
              className="font-black tracking-tight"
              style={{
                fontSize: size === 'sm' ? 15 : size === 'lg' ? 24 : 19,
                color: isLight ? white : cyan,
              }}>
              D
            </span>
            <span
              className="font-black"
              style={{
                fontSize: size === 'sm' ? 14 : size === 'lg' ? 22 : 18,
                color: pink,
              }}>
              &amp;
            </span>
            <span
              className="font-black tracking-tight"
              style={{
                fontSize: size === 'sm' ? 15 : size === 'lg' ? 24 : 19,
                color: isLight ? white : cyan,
              }}>
              X
            </span>
          </div>
          {/* Subtitle */}
          <div
            className="font-bold uppercase tracking-[0.15em]"
            style={{
              fontSize: size === 'sm' ? 7 : size === 'lg' ? 10 : 8,
              color: isLight ? 'rgba(255,255,255,0.78)' : dim,
              marginTop: 1,
            }}>
            Rolling Bearings
          </div>
        </div>
      )}
    </div>
  )
}
