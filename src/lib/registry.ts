import type { Bi, Chapter, Folder, Section, Subject } from '../content/schema'
import { slugify, titleFromSlug } from './text'

export type NodeKind = 'subject' | 'folder' | 'chapter'

export interface TreeNode {
  /** URL path without leading slash, e.g. "polity/preamble". */
  id: string
  path: string[]
  kind: NodeKind
  title: Bi
  order: number
  subject?: Subject
  chapter?: Chapter
  children: TreeNode[]
  parent?: TreeNode
}

const subjectFiles = import.meta.glob<Subject>('../content/*/_subject.ts', {
  eager: true,
  import: 'default',
})

const folderFiles = import.meta.glob<Folder>('../content/*/**/_folder.ts', {
  eager: true,
  import: 'default',
})

const chapterFiles = import.meta.glob<Chapter>(
  ['../content/*/**/*.ts', '!../content/*/_subject.ts', '!../content/*/**/_folder.ts'],
  { eager: true, import: 'default' },
)

const segmentsOf = (file: string) => file.replace('../content/', '').replace(/\.ts$/, '').split('/')

function buildTree(): TreeNode[] {
  const byId = new Map<string, TreeNode>()
  const roots: TreeNode[] = []

  const ensure = (path: string[]): TreeNode => {
    const id = path.join('/')
    const existing = byId.get(id)
    if (existing) return existing
    const slug = path[path.length - 1]
    const node: TreeNode = {
      id,
      path,
      kind: path.length === 1 ? 'subject' : 'folder',
      title: { en: titleFromSlug(slug), bn: titleFromSlug(slug) },
      order: Number.MAX_SAFE_INTEGER,
      children: [],
    }
    byId.set(id, node)
    if (path.length === 1) {
      roots.push(node)
    } else {
      const parent = ensure(path.slice(0, -1))
      node.parent = parent
      parent.children.push(node)
    }
    return node
  }

  for (const [file, subject] of Object.entries(subjectFiles)) {
    const node = ensure(segmentsOf(file).slice(0, 1))
    node.subject = subject
    node.title = subject.title
    node.order = subject.order
  }

  for (const [file, folder] of Object.entries(folderFiles)) {
    const path = segmentsOf(file).slice(0, -1)
    if (path.length < 2) continue
    const node = ensure(path)
    node.title = folder.title
    node.order = folder.order ?? Number.MAX_SAFE_INTEGER
  }

  for (const [file, chapter] of Object.entries(chapterFiles)) {
    const segments = segmentsOf(file)
    const path = segments[segments.length - 1] === 'index' ? segments.slice(0, -1) : segments
    if (path.length < 2) continue
    const node = ensure(path)
    node.kind = 'chapter'
    node.chapter = chapter
    node.title = chapter.title
    node.order = chapter.order ?? Number.MAX_SAFE_INTEGER
  }

  const sortRec = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => a.order - b.order || a.title.en.localeCompare(b.title.en))
    nodes.forEach((n) => sortRec(n.children))
  }
  sortRec(roots)
  return roots
}

export const tree = buildTree()

const index = new Map<string, TreeNode>()
const walk = (nodes: TreeNode[]) =>
  nodes.forEach((n) => {
    index.set(n.id, n)
    walk(n.children)
  })
walk(tree)

export const getNode = (id: string) => index.get(id.replace(/^\/+|\/+$/g, ''))

export const allNodes = () => [...index.values()]

export const ancestorsOf = (node: TreeNode): TreeNode[] => {
  const chain: TreeNode[] = []
  for (let n: TreeNode | undefined = node; n; n = n.parent) chain.unshift(n)
  return chain
}

/** All chapter nodes below `node` (depth-first, in display order). */
export const chaptersUnder = (node: TreeNode): TreeNode[] =>
  node.children.flatMap((c) => [...(c.kind === 'chapter' ? [c] : []), ...chaptersUnder(c)])

export const subjectOf = (node: TreeNode): TreeNode => ancestorsOf(node)[0]

export const sectionId = (section: Section) => section.id ?? slugify(section.title.en)

export const totalChapters = allNodes().filter((n) => n.kind === 'chapter').length
