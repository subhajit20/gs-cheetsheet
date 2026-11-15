import { Link } from 'react-router-dom'
import { ChevronRight, House } from 'lucide-react'
import { ancestorsOf, type TreeNode } from '../lib/registry'
import { useT } from '../lib/prefs'

export function Breadcrumbs({ node }: { node: TreeNode }) {
  const t = useT()
  const chain = ancestorsOf(node)
  return (
    <nav className="breadcrumbs no-print" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link to="/" aria-label="Home">
            <House size={15} />
          </Link>
        </li>
        {chain.map((n, i) => (
          <li key={n.id}>
            <ChevronRight size={14} aria-hidden className="crumb-sep" />
            {i === chain.length - 1 ? (
              <span aria-current="page">{t(n.title)}</span>
            ) : (
              <Link to={`/${n.id}`}>{t(n.title)}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
