import { createContext, useContext } from 'react'
import type { Bi } from '../content/schema'

export type Lang = 'en' | 'bn' | 'both'
export type Theme = 'light' | 'dark' | 'system'

export interface Prefs {
  lang: Lang
  setLang: (lang: Lang) => void
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const PrefsContext = createContext<Prefs | null>(null)

export function usePrefs(): Prefs {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error('usePrefs must be used inside <PrefsProvider>')
  return ctx
}

/** Picks a single-language string (for attributes, titles, aria labels). */
export function useT() {
  const { lang } = usePrefs()
  return (text: Bi) => (lang === 'bn' ? text.bn : text.en)
}

export const STORAGE = {
  lang: 'gs.lang',
  theme: 'gs.theme',
  recent: 'gs.recent',
} as const

export function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return v && (allowed as readonly string[]).includes(v) ? (v as T) : fallback
  } catch {
    return fallback
  }
}

export function getRecent(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE.recent) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function pushRecent(id: string) {
  try {
    const next = [id, ...getRecent().filter((x) => x !== id)].slice(0, 6)
    localStorage.setItem(STORAGE.recent, JSON.stringify(next))
  } catch {
    /* storage unavailable (private mode) */
  }
}
