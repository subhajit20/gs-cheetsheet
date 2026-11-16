import { Link } from 'react-router-dom'
import { ChevronRight, FileText, Folder } from 'lucide-react'
import type { TreeNode } from '../lib/registry'
import { Bi } from './Bi'

/** Heading-only cards for the direct children of a subject, folder or chapter. */
export function NodeList({ nodes }: { nodes: TreeNode[] }) {
  return (
    <ul className="node-list">
      {nodes.map((n) => (
        <li key={n.id}>
          <Link to={`/${n.id}`} className="node-card">
            <span className="node-card-icon" aria-hidden>
              {n.children.length ? <Folder size={18} /> : <FileText size={18} />}
            </span>
            <Bi text={n.title} as="h3" className="node-card-title" layout="stack" />
            <ChevronRight size={18} aria-hidden className="node-card-arrow" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
