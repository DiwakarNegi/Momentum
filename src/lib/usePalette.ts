import { useState, useEffect } from 'react'

export type PaletteId = 'warm' | 'violet' | 'forest' | 'ocean' | 'clay' | 'mocha'

const STORAGE_KEY = 'momentum-palette'

export const THEMES = [
  { id: 'warm'   as PaletteId, label: 'Warm Beige',  bg: '#14110c', accent: '#a7cdaf' },
  { id: 'violet' as PaletteId, label: 'Violet Noir', bg: '#100c16', accent: '#c3b1f5' },
  { id: 'forest' as PaletteId, label: 'Forest',      bg: '#0e1311', accent: '#8fd4a6' },
  { id: 'ocean'  as PaletteId, label: 'Ocean',       bg: '#0b101a', accent: '#8fb8ee' },
  { id: 'clay'   as PaletteId, label: 'Clay',        bg: '#17100d', accent: '#f0a98f' },
  { id: 'mocha'  as PaletteId, label: 'Mocha',       bg: '#141009', accent: '#e8c279' },
]

export const DISPLAY_FONTS = ['Bricolage Grotesque', 'Hanken Grotesk', 'Figtree']

export function usePalette() {
  const [palette, setPaletteState] = useState<PaletteId>(
    () => (localStorage.getItem(STORAGE_KEY) as PaletteId | null) ?? 'warm',
  )
  const [displayFont, setDisplayFontState] = useState<string>(
    () => localStorage.getItem('momentum-font') ?? 'Bricolage Grotesque',
  )

  useEffect(() => {
    const html = document.documentElement
    if (palette === 'warm') {
      html.removeAttribute('data-palette')
    } else {
      html.setAttribute('data-palette', palette)
    }
  }, [palette])

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--font-display',
      `'${displayFont}', 'Figtree', system-ui, sans-serif`,
    )
  }, [displayFont])

  function setPalette(next: PaletteId) {
    localStorage.setItem(STORAGE_KEY, next)
    setPaletteState(next)
  }

  function setDisplayFont(next: string) {
    localStorage.setItem('momentum-font', next)
    setDisplayFontState(next)
  }

  return { palette, setPalette, displayFont, setDisplayFont }
}
