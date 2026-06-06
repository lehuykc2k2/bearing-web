export type BrandTheme = {
  key: string
  label: string
  shortLabel: string
  bg: string
  text: string
  light: string
  border: string
  gradient: string
}

export const BRAND_THEMES: Record<string, BrandTheme> = {
  'D&X': {
    key: 'D&X',
    label: 'D&X Bearings',
    shortLabel: 'D&X',
    bg: '#2c2a7c',
    text: 'white',
    light: '#f0f4ff',
    border: '#2c2a7c',
    gradient: 'linear-gradient(135deg,#2c2a7c 0%,#0c3263 100%)',
  },
  AGA: {
    key: 'AGA',
    label: 'AGA',
    shortLabel: 'AGA',
    bg: '#ea580c',
    text: 'white',
    light: '#fff7ed',
    border: '#ea580c',
    gradient: 'linear-gradient(135deg,#f97316 0%,#c2410c 100%)',
  },
}

export const DEFAULT_BRAND_THEME: BrandTheme = {
  key: 'OTHER',
  label: '',
  shortLabel: '',
  bg: '#475569',
  text: 'white',
  light: '#f8fafc',
  border: '#cbd5e1',
  gradient: 'linear-gradient(135deg,#64748b 0%,#334155 100%)',
}

export function normalizeBrandKey(brand?: string | null) {
  const key = brand?.trim().toUpperCase()
  if (!key) return null
  if (['D&X', 'DX', 'D-X', 'D X', 'D AND X', 'D&X BEARINGS', 'DX BEARINGS'].includes(key)) return 'D&X'
  if (['AGA', 'AGA BEARINGS'].includes(key)) return 'AGA'
  return null
}

export function getBrandTheme(brand?: string | null): BrandTheme | null {
  const raw = brand?.trim()
  if (!raw) return null

  const normalized = normalizeBrandKey(raw)
  if (normalized) return BRAND_THEMES[normalized]

  return {
    ...DEFAULT_BRAND_THEME,
    key: raw,
    label: raw,
    shortLabel: raw.slice(0, 4).toUpperCase(),
  }
}
