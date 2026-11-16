import { Link } from 'react-router-dom'
import { BookMarked, Menu, Monitor, Moon, Search, Sun } from 'lucide-react'
import { usePrefs, type Lang, type Theme } from '../lib/prefs'
import { UiText } from './Bi'

const LANG_OPTIONS: { value: Lang; label: string; title: string }[] = [
  { value: 'en', label: 'EN', title: 'English only' },
  { value: 'bn', label: 'বাংলা', title: 'শুধু বাংলা' },
  { value: 'both', label: 'EN + বাং', title: 'English and Bengali side by side' },
]

const NEXT_THEME: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' }
const THEME_ICON = { light: Sun, dark: Moon, system: Monitor }

export function Header({ onMenu, onSearch }: { onMenu: () => void; onSearch: () => void }) {
  const { lang, setLang, theme, setTheme } = usePrefs()
  const ThemeIcon = THEME_ICON[theme]
  const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)

  return (
    <header className="topbar">
      <button type="button" className="icon-btn menu-btn" onClick={onMenu} aria-label="Open subjects menu">
        <Menu size={20} />
      </button>
      <Link to="/" className="brand">
        <span className="brand-mark" aria-hidden>
          <BookMarked size={18} />
        </span>
        <span className="brand-text">
          GS <span className="brand-sub">Cheat Sheets</span>
        </span>
      </Link>

      <button type="button" className="search-trigger" onClick={onSearch}>
        <Search size={16} aria-hidden />
        <span className="search-trigger-text">
          <UiText en="Search chapters & facts" bn="অধ্যায় ও তথ্য খুঁজুন" />
        </span>
        <kbd>{isMac ? '⌘K' : 'Ctrl K'}</kbd>
      </button>

      <div className="topbar-actions">
        <div className="segmented" role="radiogroup" aria-label="Language">
          {LANG_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={lang === o.value}
              title={o.title}
              className={lang === o.value ? 'is-active' : ''}
              onClick={() => setLang(o.value)}
              lang={o.value === 'bn' ? 'bn' : undefined}
            >
              {o.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setTheme(NEXT_THEME[theme])}
          aria-label={`Theme: ${theme}. Switch to ${NEXT_THEME[theme]}`}
          title={`Theme: ${theme}`}
        >
          <ThemeIcon size={18} />
        </button>
      </div>
    </header>
  )
}
