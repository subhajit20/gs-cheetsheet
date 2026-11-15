import { Link, useOutletContext } from 'react-router-dom'
import { ArrowRight, Columns2, History, Keyboard, Printer, Search } from 'lucide-react'
import { ancestorsOf, chaptersUnder, getNode, totalChapters, tree, type TreeNode } from '../lib/registry'
import { getRecent, useT } from '../lib/prefs'
import { Bi, UiText } from '../components/Bi'
import { SubjectIcon } from '../components/SubjectIcon'

export function HomePage() {
  const { openSearch } = useOutletContext<{ openSearch: () => void }>()
  const t = useT()
  const recent = getRecent()
    .map((id) => getNode(id))
    .filter((n): n is TreeNode => n?.kind === 'chapter')

  return (
    <div className="page home">
      <section className="hero">
        <p className="eyebrow">
          <UiText en="General Studies · Bilingual revision" bn="সাধারণ জ্ঞান · দ্বিভাষিক রিভিশন" />
        </p>
        <h1>
          <UiText en="Revise every GS chapter in minutes." bn="প্রতিটি অধ্যায় মিনিটে রিভিশন করো।" />
        </h1>
        <p className="hero-sub">
          <UiText
            en="Exam-focused cheat sheets in English and বাংলা: key points, must-remember facts, exam traps, mnemonics and quick tables."
            bn="ইংরেজি ও বাংলায় পরীক্ষাভিত্তিক চিট শিট: মূল বিষয়, মনে রাখার তথ্য, পরীক্ষার ফাঁদ, স্মৃতি-কৌশল ও সংক্ষিপ্ত সারণি।"
          />
        </p>
        <button type="button" className="hero-search" onClick={openSearch}>
          <Search size={18} aria-hidden />
          <span>
            <UiText en='Search e.g. "Preamble", "42nd Amendment", "প্রস্তাবনা"' bn='খুঁজুন যেমন "প্রস্তাবনা", "৪২তম সংশোধনী"' />
          </span>
          <kbd>/</kbd>
        </button>
        <div className="hero-stats">
          <span>
            <strong>{tree.length}</strong> <UiText en="subjects" bn="বিষয়" />
          </span>
          <span>
            <strong>{totalChapters}</strong>{' '}
            <UiText en={totalChapters === 1 ? 'chapter ready' : 'chapters ready'} bn="অধ্যায় প্রস্তুত" />
          </span>
          <span>
            <strong>2</strong> <UiText en="languages" bn="ভাষা" />
          </span>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="home-section">
          <h2 className="section-label">
            <History size={16} aria-hidden /> <UiText en="Continue revising" bn="রিভিশন চালিয়ে যাও" />
          </h2>
          <ul className="recent-list">
            {recent.map((n) => (
              <li key={n.id}>
                <Link to={`/${n.id}`} className="recent-item">
                  <span className="recent-trail">
                    {ancestorsOf(n)
                      .slice(0, -1)
                      .map((a) => t(a.title))
                      .join(' › ')}
                  </span>
                  <span className="recent-title">{t(n.title)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="home-section">
        <h2 className="section-label">
          <UiText en="Subjects" bn="বিষয়সমূহ" />
        </h2>
        <ul className="subject-grid">
          {tree.map((s) => {
            const count = chaptersUnder(s).length
            return (
              <li key={s.id}>
                <Link to={`/${s.id}`} className={`subject-card accent-${s.subject?.accent ?? 'indigo'}`}>
                  <span className="subject-card-icon">
                    <SubjectIcon name={s.subject?.icon} size={22} />
                  </span>
                  <Bi text={s.title} className="subject-card-title" layout="stack" />
                  {s.subject && <Bi text={s.subject.description} className="subject-card-desc" layout="stack" />}
                  <span className={`subject-card-count ${count ? '' : 'is-empty'}`}>
                    {count ? (
                      <>
                        {count} <UiText en={count === 1 ? 'chapter' : 'chapters'} bn="অধ্যায়" />
                        <ArrowRight size={14} aria-hidden />
                      </>
                    ) : (
                      <UiText en="Coming soon" bn="শীঘ্রই আসছে" />
                    )}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="home-section tips">
        <div className="tip">
          <Columns2 size={18} aria-hidden />
          <div>
            <strong>
              <UiText en="Read side by side" bn="পাশাপাশি পড়ো" />
            </strong>
            <p>
              <UiText
                en="Switch EN / বাংলা / both from the top bar. Your choice is remembered."
                bn="উপরের বার থেকে EN / বাংলা / দুটোই বেছে নাও। পছন্দ মনে রাখা হয়।"
              />
            </p>
          </div>
        </div>
        <div className="tip">
          <Keyboard size={18} aria-hidden />
          <div>
            <strong>
              <UiText en="Search instantly" bn="সঙ্গে সঙ্গে খোঁজো" />
            </strong>
            <p>
              <UiText en="Press / or Ctrl K anywhere to search all subjects." bn="যেকোনো জায়গা থেকে / বা Ctrl K চাপো।" />
            </p>
          </div>
        </div>
        <div className="tip">
          <Printer size={18} aria-hidden />
          <div>
            <strong>
              <UiText en="Print for last-minute revision" bn="শেষ মুহূর্তের জন্য প্রিন্ট করো" />
            </strong>
            <p>
              <UiText
                en="Every chapter has a clean, paper-friendly print layout."
                bn="প্রতিটি অধ্যায়ের পরিষ্কার প্রিন্ট লেআউট আছে।"
              />
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
