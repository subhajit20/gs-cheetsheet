import type { Bi, Block, Cell, Chapter } from '../content/schema'

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const titleFromSlug = (slug: string) =>
  slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')

export const isBi = (v: unknown): v is Bi =>
  typeof v === 'object' && v !== null && 'en' in v && 'bn' in v

export const stripMarks = (s: string) => s.replace(/\*\*|==/g, '')

const cellText = (c: Cell): string[] => (isBi(c) ? [c.en, c.bn] : [String(c)])
const bi = (b?: Bi): string[] => (b ? [b.en, b.bn] : [])

export function blockText(block: Block): string[] {
  const title = 'title' in block ? bi(block.title) : []
  switch (block.type) {
    case 'text':
      return bi(block.text)
    case 'keyPoints':
      return [...title, ...block.items.flatMap(bi)]
    case 'remember':
      return [...title, ...bi(block.text)]
    case 'traps':
      return [...title, ...block.items.flatMap((i) => [...bi(i.wrong), ...bi(i.right)])]
    case 'mnemonic':
      return [
        ...title,
        ...bi(block.phrase),
        ...block.breakdown.flatMap((b) => [b.key, ...bi(b.meaning)]),
        ...bi(block.note),
      ]
    case 'table':
      return [...title, ...block.columns.flatMap(bi), ...block.rows.flat().flatMap(cellText), ...bi(block.note)]
    case 'timeline':
      return [...title, ...block.items.flatMap((i) => [i.date, ...bi(i.event)])]
    case 'quote':
      return [...bi(block.text), ...bi(block.by)]
    case 'quiz':
      return [...title, ...block.items.flatMap((i) => [...bi(i.q), ...bi(i.a)])]
  }
}

export const chapterText = (chapter: Chapter) =>
  chapter.sections.flatMap((s) => [...bi(s.title), ...s.blocks.flatMap(blockText)])
