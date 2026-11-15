import type { Bi } from '../content/schema'
import { allNodes, ancestorsOf, sectionId, type TreeNode } from './registry'
import { blockText, stripMarks } from './text'

export interface SearchResult {
  node: TreeNode
  /** Breadcrumb trail of titles, e.g. Polity › Preamble. */
  trail: Bi[]
  section?: { id: string; title: Bi }
  snippet?: string
  score: number
}

interface Entry {
  node: TreeNode
  trail: Bi[]
  section?: { id: string; title: Bi }
  title: string
  body: string
  rawBody: string[]
  boost: number
}

const norm = (s: string) => stripMarks(s).toLowerCase().normalize('NFC')

let entries: Entry[] | null = null

function buildEntries(): Entry[] {
  const out: Entry[] = []
  for (const node of allNodes()) {
    const trail = ancestorsOf(node).map((n) => n.title)
    const tags = node.chapter?.tags?.join(' ') ?? ''
    const oneLiner = node.chapter ? [node.chapter.oneLiner.en, node.chapter.oneLiner.bn] : []
    out.push({
      node,
      trail,
      title: norm(`${node.title.en} ${node.title.bn} ${tags}`),
      body: norm(oneLiner.join(' ')),
      rawBody: oneLiner.map(stripMarks),
      boost: node.kind === 'chapter' ? 3 : 2,
    })
    for (const section of node.chapter?.sections ?? []) {
      const raw = section.blocks.flatMap(blockText).map(stripMarks)
      out.push({
        node,
        trail,
        section: { id: sectionId(section), title: section.title },
        title: norm(`${section.title.en} ${section.title.bn}`),
        body: norm(raw.join(' ')),
        rawBody: raw,
        boost: 1,
      })
    }
  }
  return out
}

function snippetFor(raw: string[], terms: string[]): string | undefined {
  for (const line of raw) {
    const lower = line.toLowerCase()
    const hit = terms.map((t) => lower.indexOf(t)).find((i) => i >= 0)
    if (hit === undefined) continue
    const start = Math.max(0, hit - 40)
    const end = Math.min(line.length, hit + 100)
    return `${start > 0 ? '…' : ''}${line.slice(start, end)}${end < line.length ? '…' : ''}`
  }
  return undefined
}

export function search(query: string, limit = 20): SearchResult[] {
  const terms = norm(query).split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  entries ??= buildEntries()

  const results: SearchResult[] = []
  for (const e of entries) {
    let score = 0
    let ok = true
    for (const t of terms) {
      const inTitle = e.title.includes(t)
      const inBody = e.body.includes(t)
      if (!inTitle && !inBody) {
        ok = false
        break
      }
      score += (inTitle ? 5 : 0) + (inBody ? 1 : 0)
    }
    if (!ok) continue
    results.push({
      node: e.node,
      trail: e.trail,
      section: e.section,
      snippet: snippetFor(e.rawBody, terms),
      score: score * e.boost,
    })
  }
  return results.sort((a, b) => b.score - a.score).slice(0, limit)
}
