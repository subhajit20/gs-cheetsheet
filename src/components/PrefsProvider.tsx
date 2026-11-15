import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { PrefsContext, readStored, STORAGE, type Lang, type Theme } from '../lib/prefs'

const LANGS = ['en', 'bn', 'both'] as const
const THEMES = ['light', 'dark', 'system'] as const

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => readStored(STORAGE.lang, LANGS, 'both'))
  const [theme, setTheme] = useState<Theme>(() => readStored(STORAGE.theme, THEMES, 'system'))

  useEffect(() => {
    localStorage.setItem(STORAGE.lang, lang)
    document.documentElement.dataset.lang = lang
  }, [lang])

  useEffect(() => {
    localStorage.setItem(STORAGE.theme, theme)
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && media.matches)
      document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    }
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [theme])

  const value = useMemo(() => ({ lang, setLang, theme, setTheme }), [lang, theme])
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
}
