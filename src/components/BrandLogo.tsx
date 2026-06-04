import Image from 'next/image'

interface Props {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

const logoSources = {
  light: {
    src: '/logo-white-cropped.png',
    width: 1065,
    height: 396,
  },
  dark: {
    src: '/logo-blue-cropped.png',
    width: 1098,
    height: 422,
  },
} as const

const logoSizes = {
  sm: { width: 112, height: 43 },
  md: { width: 142, height: 55 },
  lg: { width: 190, height: 73 },
} as const

const compactSizes = {
  sm: { width: 88, height: 34 },
  md: { width: 112, height: 43 },
  lg: { width: 146, height: 56 },
} as const

export default function BrandLogo({ variant = 'light', size = 'md', showText = true }: Props) {
  const logo = logoSources[variant]
  const dimensions = showText ? logoSizes[size] : compactSizes[size]

  return (
    <span
      className="relative block shrink-0 select-none"
      style={{ width: dimensions.width, height: dimensions.height }}>
      <Image
        src={logo.src}
        alt={showText ? 'D&X Bearings' : 'D&X'}
        width={logo.width}
        height={logo.height}
        sizes={`${dimensions.width}px`}
        priority={size !== 'lg'}
        className="block h-full w-full object-contain"
      />
    </span>
  )
}
