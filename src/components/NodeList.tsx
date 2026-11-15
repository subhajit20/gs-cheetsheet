import { Link } from 'react-router-dom'
import { ChevronRight, FileText, Folder } from 'lucide-react'
import { chaptersUnder, type TreeNode } from '../lib/registry'
import { Bi, UiText } from './Bi'

/** Cards for the direct children of a subject or folder. */
export function NodeList({ nodes }: { nodes: TreeNode[] }) {
  return (
    <ul className="node-list">
      {nodes.map((n) => {
        const nested = chaptersUnder(n).length
        return (
          <li key={n.id}>
            <Link to={`/${n.id}`} className="node-card">
              <span className="node-card-icon" aria-hidden>
                {n.children.length ? <Folder size={18} /> : <FileText size={18} />}
              </span>
              <span className="node-card-body">
                <Bi text={n.title} className="node-card-title" layout="stack" />
                {n.chapter && <Bi text={n.chapter.oneLiner} className="node-card-desc" layout="stack" />}
                <span className="node-card-meta">
                  {n.chapter && (
                    <span>
                      {n.chapter.sections.length}{' '}
                      <UiText en={n.chapter.sections.length === 1 ? 'section' : 'sections'} bn="অংশ" />
                    </span>
                  )}
                  {nested > 0 && (
                    <span>
                      {nested} <UiText en={nested === 1 ? 'sub-topic' : 'sub-topics'} bn="উপ-বিষয়" />
                    </span>
                  )}
                </span>
              </span>
              <ChevronRight size={18} aria-hidden className="node-card-arrow" />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
