export default function BearingPlaceholder({ size = 160 }: { size?: number }) {
  const cx = 50, cy = 50
  const R1 = 44   // outer ring ngoài
  const R2 = 38   // outer ring trong
  const R3 = 22   // inner ring ngoài
  const R4 = 16   // inner ring trong
  const Rm = 30   // tâm balls
  const rb = 5.5  // bán kính ball
  const N  = 8    // số balls

  const balls = Array.from({ length: N }, (_, i) => {
    const angle = (i * 2 * Math.PI) / N - Math.PI / 2
    return { x: cx + Rm * Math.cos(angle), y: cy + Rm * Math.sin(angle) }
  })

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Outer ring gradient */}
        <radialGradient id="outerGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#5cc8f5"/>
          <stop offset="100%" stopColor="#0A2340"/>
        </radialGradient>
        {/* Inner ring gradient */}
        <radialGradient id="innerGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#4ab8e8"/>
          <stop offset="100%" stopColor="#083060"/>
        </radialGradient>
        {/* Ball gradient */}
        <radialGradient id="ballGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#e0f5ff"/>
          <stop offset="40%"  stopColor="#0BADE8"/>
          <stop offset="100%" stopColor="#05527a"/>
        </radialGradient>
        {/* Cage gradient */}
        <linearGradient id="cageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#f97316" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#c2410c" stopOpacity="0.9"/>
        </linearGradient>
        {/* Shine */}
        <radialGradient id="shine" cx="30%" cy="25%" r="50%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#0A2340" floodOpacity="0.4"/>
        </filter>
      </defs>

      {/* === OUTER RING === */}
      {/* Body */}
      <circle cx={cx} cy={cy} r={R1} fill="url(#outerGrad)" filter="url(#shadow)"/>
      {/* Groove (rãnh) */}
      <circle cx={cx} cy={cy} r={R2} fill="#071e35"/>
      {/* Highlight top-left */}
      <circle cx={cx} cy={cy} r={R1} fill="url(#shine)"/>
      {/* Edge detail */}
      <circle cx={cx} cy={cy} r={R1 - 0.5} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
      <circle cx={cx} cy={cy} r={R2 + 0.5} fill="none" stroke="rgba(255,255,255,0.1)"  strokeWidth="0.6"/>

      {/* === CAGE (vành giữ) === */}
      <circle cx={cx} cy={cy} r={Rm} fill="none"
        stroke="url(#cageGrad)" strokeWidth="2.2" strokeDasharray="3.5 2.8" opacity="0.85"/>

      {/* === BALLS === */}
      {balls.map((b, i) => (
        <g key={i} filter="url(#shadow)">
          <circle cx={b.x} cy={b.y} r={rb}     fill="url(#ballGrad)"/>
          {/* highlight nhỏ trên mỗi ball */}
          <circle cx={b.x - rb * 0.3} cy={b.y - rb * 0.35} r={rb * 0.28}
            fill="white" opacity="0.55"/>
        </g>
      ))}

      {/* === INNER RING === */}
      <circle cx={cx} cy={cy} r={R3} fill="url(#innerGrad)" filter="url(#shadow)"/>
      <circle cx={cx} cy={cy} r={R4} fill="#071e35"/>
      <circle cx={cx} cy={cy} r={R3} fill="url(#shine)"/>
      <circle cx={cx} cy={cy} r={R3 - 0.4} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.7"/>
      <circle cx={cx} cy={cy} r={R4 + 0.4} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5"/>

      {/* === LỖ TRỤC === */}
      {/* Bore */}
      <circle cx={cx} cy={cy} r={R4} fill="#040f1c"/>
      {/* Bore highlight */}
      <circle cx={cx - R4*0.25} cy={cy - R4*0.3} r={R4 * 0.3}
        fill="white" opacity="0.06"/>
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="1.2" fill="rgba(11,173,232,0.5)"/>
    </svg>
  )
}
