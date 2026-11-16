import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CornerDownLeft, FileText, Search, X } from 'lucide-react'
import { search, type SearchResult } from '../lib/search'
import { useT } from '../lib/prefs'
import { Bi, UiText } from './Bi'

const hrefOf = (r: SearchResult) => `/${r.node.id}${r.section ? `#${r.section.id}` : ''}`

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const t = useT()
  const results = useMemo(() => search(query), [query])

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.select())
  }, [open])

  if (!open) return null

  const go = (r: SearchResult | undefined) => {
    if (!r) return
    navigate(hrefOf(r))
    onClose()
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      go(results[active])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="search-field">
          <Search size={18} aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            placeholder={t({
              en: 'Search topics, articles, facts… e.g. "42nd amendment"',
              bn: 'বিষয়, অনুচ্ছেদ, তথ্য খুঁজুন… যেমন "প্রস্তাবনা"',
            })}
            aria-label="Search"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search">
            <X size={18} />
          </button>
        </div>
        <div className="search-results">
          {query.trim() === '' && (
            <p className="search-empty">
              <UiText
                en="Type in English or বাংলা. Results cover every subject and chapter."
                bn="ইংরেজি বা বাংলায় লিখুন। সব বিষয় ও অধ্যায় থেকে ফল দেখানো হবে।"
              />
            </p>
          )}
          {query.trim() !== '' && results.length === 0 && (
            <p className="search-empty">
              <UiText en="No matches. Try a shorter word." bn="কিছু পাওয়া যায়নি। ছোট শব্দ দিয়ে চেষ্টা করুন।" />
            </p>
          )}
          <ul role="listbox">
            {results.map((r, i) => (
              <li key={hrefOf(r)} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  className={`search-result ${i === active ? 'is-active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r)}
                >
                  <FileText size={16} aria-hidden className="search-result-icon" />
                  <span className="search-result-main">
                    <span className="search-trail">{r.trail.map((x) => t(x)).join(' › ')}</span>
                    <span className="search-title">
                      {r.section ? <Bi text={r.section.title} layout="stack" /> : <Bi text={r.node.title} layout="stack" />}
                    </span>
                    {r.snippet && <span className="search-snippet">{r.snippet}</span>}
                  </span>
                  {i === active && <CornerDownLeft size={14} aria-hidden className="search-enter" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
