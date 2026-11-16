import { Fragment, type ElementType, type ReactNode } from 'react'
import type { Bi as BiText } from '../content/schema'
import { usePrefs } from '../lib/prefs'

/** Renders `**bold**` and `==highlight==` marks. */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|==[^=]+==)/g)
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>
        if (p.startsWith('==') && p.endsWith('==')) return <mark key={i}>{p.slice(2, -2)}</mark>
        return <Fragment key={i}>{p}</Fragment>
      })}
    </>
  )
}

interface BiProps {
  text: BiText
  /** Element wrapping the whole thing. */
  as?: ElementType
  className?: string
  /**
   * `columns` puts the two languages side by side (stacks on narrow screens);
   * `stack` always puts Bengali under English (headings, table cells);
   * `inline` keeps both on one line separated by a dot (eyebrows, captions).
   */
  layout?: 'columns' | 'stack' | 'inline'
}

export function Bi({ text, as: Tag = 'span', className = '', layout = 'columns' }: BiProps) {
  const { lang } = usePrefs()
  if (lang !== 'both' || text.en === text.bn) {
    const value = (lang === 'both' ? text.en : text[lang]) || text.en
    return (
      <Tag className={className} lang={lang === 'bn' ? 'bn' : 'en'}>
        <Inline text={value} />
      </Tag>
    )
  }
  return (
    <Tag className={`bi bi-${layout} ${className}`}>
      <span lang="en" className="bi-en">
        <Inline text={text.en} />
      </span>
      <span lang="bn" className="bi-bn">
        <Inline text={text.bn} />
      </span>
    </Tag>
  )
}

/** Short UI labels in the active language (English in "both" mode). */
export function UiText({ en, bn }: { en: ReactNode; bn: ReactNode }) {
  const { lang } = usePrefs()
  return <>{lang === 'bn' ? bn : en}</>
}
