import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, FileText, Folder, FolderOpen } from 'lucide-react'
import { chaptersUnder, tree, type TreeNode } from '../lib/registry'
import { Bi, UiText } from './Bi'
import { SubjectIcon } from './SubjectIcon'

const currentId = (pathname: string) => decodeURIComponent(pathname).replace(/^\/+|\/+$/g, '')

function TreeItem({
  node,
  activeId,
  isOpenFn,
  toggle,
  onNavigate,
}: {
  node: TreeNode
  activeId: string
  isOpenFn: (id: string) => boolean
  toggle: (id: string) => void
  onNavigate: () => void
}) {
  const hasChildren = node.children.length > 0
  const isOpen = isOpenFn(node.id)
  const isActive = activeId === node.id
  const isEmptySubject = node.kind === 'subject' && chaptersUnder(node).length === 0

  let icon
  if (node.kind === 'subject') icon = <SubjectIcon name={node.subject?.icon} size={17} />
  else if (hasChildren) icon = isOpen ? <FolderOpen size={16} aria-hidden /> : <Folder size={16} aria-hidden />
  else icon = <FileText size={16} aria-hidden />

  return (
    <li className={`tree-item depth-${Math.min(node.path.length, 4)}`}>
      <div className={`tree-row ${isActive ? 'is-active' : ''} ${node.kind === 'subject' ? 'is-subject' : ''}`}>
        {hasChildren ? (
          <button
            type="button"
            className={`tree-toggle ${isOpen ? 'is-open' : ''}`}
            aria-label={isOpen ? 'Collapse' : 'Expand'}
            aria-expanded={isOpen}
            onClick={() => toggle(node.id)}
          >
            <ChevronRight size={14} />
          </button>
        ) : (
          <span className="tree-toggle-spacer" />
        )}
        <Link
          to={`/${node.id}`}
          className="tree-link"
          aria-current={isActive ? 'page' : undefined}
          onClick={onNavigate}
        >
          <span className="tree-icon">{icon}</span>
          <Bi text={node.title} className="tree-label" layout="stack" />
          {isEmptySubject && (
            <span className="tree-badge">
              <UiText en="soon" bn="শীঘ্রই" />
            </span>
          )}
        </Link>
      </div>
      {hasChildren && isOpen && (
        <ul className="tree-children">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              activeId={activeId}
              isOpenFn={isOpenFn}
              toggle={toggle}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()
  const activeId = currentId(pathname)
  // Explicit open/closed choices; anything not listed is open only if it is or contains the active page.
  const [overrides, setOverrides] = useState<Map<string, boolean>>(() => new Map())
  const [lastActive, setLastActive] = useState(activeId)
  if (lastActive !== activeId) {
    setLastActive(activeId)
    setOverrides((prev) => new Map([...prev].filter(([id]) => !(activeId === id || activeId.startsWith(`${id}/`)))))
  }

  const containsActive = (id: string) => activeId === id || activeId.startsWith(`${id}/`)
  const isOpen = (id: string) => overrides.get(id) ?? containsActive(id)
  const toggle = (id: string) => setOverrides((prev) => new Map(prev).set(id, !isOpen(id)))

  return (
    <>
      <div className={`scrim ${open ? 'is-visible' : ''}`} onClick={onClose} aria-hidden />
      <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-label="Subjects">
        <p className="sidebar-heading">
          <UiText en="Subjects" bn="বিষয়সমূহ" />
        </p>
        <nav>
          <ul className="tree">
            {tree.map((node) => (
              <TreeItem
                key={node.id}
                node={node}
                activeId={activeId}
                isOpenFn={isOpen}
                toggle={toggle}
                onNavigate={onClose}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
