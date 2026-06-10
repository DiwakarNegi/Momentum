import { useState, useEffect } from 'react'

export type ColorScheme = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'momentum-theme'

function applyScheme(scheme: ColorScheme) {
  const html = document.documentElement
  if (scheme === 'dark') {
    html.classList.add('dark')
  } else if (scheme === 'light') {
    html.classList.remove('dark')
  } else {
    // system: follow OS preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    html.classList.toggle('dark', prefersDark)
  }
}

export function useDarkMode() {
  const [scheme, setSchemeState] = useState<ColorScheme>(
    () => (localStorage.getItem(STORAGE_KEY) as ColorScheme | null) ?? 'system',
  )

  // Apply on mount and whenever scheme changes
  useEffect(() => {
    applyScheme(scheme)
  }, [scheme])

  // Also listen for OS preference changes when in 'system' mode
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (scheme === 'system') applyScheme('system')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [scheme])

  function setScheme(next: ColorScheme) {
    localStorage.setItem(STORAGE_KEY, next)
    setSchemeState(next)
  }

  return { scheme, setScheme }
}
