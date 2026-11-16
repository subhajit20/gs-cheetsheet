import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CalendarDays, FilePlus2, Printer, Zap } from 'lucide-react'
import type { Chapter } from '../content/schema'
import { chaptersUnder, getNode, sectionId, subjectOf, type TreeNode } from '../lib/registry'
import { pushRecent, useT } from '../lib/prefs'
import { Bi, UiText } from '../components/Bi'
import { BlockView } from '../components/Blocks'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { NodeList } from '../components/NodeList'
import { SubjectIcon } from '../components/SubjectIcon'
import { NotFoundPage } from './NotFoundPage'

function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · GS Cheat Sheets`
  }, [title])
}

function Toc({ chapter }: { chapter: Chapter }) {
  return (
    <ol className="toc-list">
      {chapter.sections.map((s) => (
        <li key={sectionId(s)}>
          <a href={`#${sectionId(s)}`}>
            <Bi text={s.title} layout="stack" />
          </a>
        </li>
      ))}
    </ol>
  )
}

function ChapterView({ node, chapter }: { node: TreeNode; chapter: Chapter }) {
  const subject = subjectOf(node)
  const siblings = chaptersUnder(subject)
  const idx = siblings.findIndex((n) => n.id === node.id)
  const prev = siblings[idx - 1]
  const next = siblings[idx + 1]

  useEffect(() => pushRecent(node.id), [node.id])

  return (
    <article className="chapter">
      <header className="page-head">
        <p className="eyebrow">
          <SubjectIcon name={subject.subject?.icon} size={15} /> <Bi text={subject.title} layout="inline" />
        </p>
        <Bi text={chapter.title} as="h1" className="page-title" layout="stack" />
        <div className="page-meta">
          <span>
            {chapter.sections.length} <UiText en="sections" bn="অংশ" />
          </span>
          {chapter.updated && (
            <span>
              <CalendarDays size={14} aria-hidden /> {chapter.updated}
            </span>
          )}
          {chapter.source && <span>{chapter.source}</span>}
          <button type="button" className="btn btn-ghost btn-sm no-print" onClick={() => window.print()}>
            <Printer size={15} /> <UiText en="Print" bn="প্রিন্ট" />
          </button>
        </div>
      </header>

      <section className="one-liner" aria-label="One-line revision">
        <span className="one-liner-label">
          <Zap size={15} aria-hidden /> <UiText en="One-line revision" bn="এক লাইনে রিভিশন" />
        </span>
        <Bi text={chapter.oneLiner} as="p" />
      </section>

      <details className="toc-mobile no-print">
        <summary>
          <UiText en="On this page" bn="এই পাতায়" />
        </summary>
        <Toc chapter={chapter} />
      </details>

      <div className="chapter-grid">
        <div className="chapter-body">
          {chapter.sections.map((s) => (
            <section key={sectionId(s)} id={sectionId(s)} className="chapter-section">
              <h2 className="section-title">
                <a href={`#${sectionId(s)}`} className="anchor" aria-hidden tabIndex={-1}>
                  #
                </a>
                <Bi text={s.title} layout="stack" />
              </h2>
              {s.blocks.map((b, i) => (
                <BlockView key={i} block={b} />
              ))}
            </section>
          ))}

          {node.children.length > 0 && (
            <section className="chapter-section">
              <h2 className="section-title">
                <UiText en="Sub-topics" bn="উপ-বিষয়" />
              </h2>
              <NodeList nodes={node.children} />
            </section>
          )}

          <nav className="pager no-print" aria-label="Chapter navigation">
            {prev ? (
              <Link to={`/${prev.id}`} className="pager-link">
                <ArrowLeft size={16} aria-hidden />
                <span>
                  <small>
                    <UiText en="Previous" bn="আগের" />
                  </small>
                  <Bi text={prev.title} layout="stack" />
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link to={`/${next.id}`} className="pager-link pager-next">
                <span>
                  <small>
                    <UiText en="Next" bn="পরের" />
                  </small>
                  <Bi text={next.title} layout="stack" />
                </span>
                <ArrowRight size={16} aria-hidden />
              </Link>
            )}
          </nav>
        </div>

        <aside className="toc no-print" aria-label="On this page">
          <p className="toc-heading">
            <UiText en="On this page" bn="এই পাতায়" />
          </p>
          <Toc chapter={chapter} />
        </aside>
      </div>
    </article>
  )
}

function FolderView({ node }: { node: TreeNode }) {
  const subject = node.kind === 'subject' ? node.subject : undefined
  const count = chaptersUnder(node).length
  return (
    <div className={`folder accent-${subject?.accent ?? 'indigo'}`}>
      <header className="page-head folder-head">
        {node.kind === 'subject' && (
          <span className="folder-icon">
            <SubjectIcon name={subject?.icon} size={26} />
          </span>
        )}
        <div>
          <Bi text={node.title} as="h1" className="page-title" layout="stack" />
          {subject && <Bi text={subject.description} as="p" className="page-desc" layout="stack" />}
          <div className="page-meta">
            <span>
              {count} <UiText en={count === 1 ? 'chapter' : 'chapters'} bn="অধ্যায়" />
            </span>
          </div>
        </div>
      </header>

      {node.children.length > 0 ? (
        <NodeList nodes={node.children} />
      ) : (
        <div className="empty-state">
          <FilePlus2 size={32} aria-hidden />
          <h2>
            <UiText en="Chapters coming soon" bn="অধ্যায় শীঘ্রই আসছে" />
          </h2>
          <p>
            <UiText
              en="Cheat sheets for this subject are being prepared from class notes. Check back soon — meanwhile, try Polity › Preamble."
              bn="ক্লাস নোট থেকে এই বিষয়ের চিট শিট তৈরি হচ্ছে। শীঘ্রই দেখো — ততক্ষণ রাষ্ট্রবিজ্ঞান › প্রস্তাবনা পড়ে নাও।"
            />
          </p>
          <Link to="/polity/preamble" className="btn btn-primary">
            <UiText en="Open a sample chapter" bn="একটি নমুনা অধ্যায় খোলো" /> <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      )}
    </div>
  )
}

export function NodePage() {
  const { '*': splat = '' } = useParams()
  const node = getNode(decodeURIComponent(splat))
  const t = useT()
  useDocumentTitle(node ? t(node.title) : 'Not found')

  if (!node) return <NotFoundPage />
  return (
    <div className="page">
      <Breadcrumbs node={node} />
      {node.chapter ? <ChapterView key={node.id} node={node} chapter={node.chapter} /> : <FolderView node={node} />}
    </div>
  )
}
