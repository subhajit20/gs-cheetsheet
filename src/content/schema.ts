/**
 * Content schema for the cheat sheet portal.
 *
 * Every content file in `src/content/<subject>/...` default-exports one of the
 * shapes below, wrapped in `defineSubject` or `defineChapter` so TypeScript
 * checks it. See CONTENT_GUIDE.md for the full authoring rules.
 */

/**
 * Text in both languages. Supports two inline marks:
 * `**bold**` for key terms and `==highlight==` for must-remember facts.
 */
export interface Bi {
  en: string
  bn: string
}

/** A table cell: plain text/number (same in both languages) or bilingual text. */
export type Cell = string | number | Bi

export type SubjectIcon =
  | 'landmark'
  | 'scroll'
  | 'globe'
  | 'rupee'
  | 'flask'
  | 'leaf'
  | 'palette'
  | 'newspaper'
  | 'book'

export type Accent = 'indigo' | 'amber' | 'emerald' | 'sky' | 'rose' | 'teal' | 'violet' | 'orange'

export interface Subject {
  title: Bi
  description: Bi
  icon: SubjectIcon
  accent: Accent
  /** Lower numbers appear first. */
  order: number
}

/** Optional `_folder.ts` metadata for a folder that groups chapters but has no content of its own. */
export interface Folder {
  title: Bi
  order?: number
}

export interface TextBlock {
  type: 'text'
  text: Bi
}

export interface KeyPointsBlock {
  type: 'keyPoints'
  title?: Bi
  items: Bi[]
}

export interface RememberBlock {
  type: 'remember'
  title?: Bi
  text: Bi
}

export interface TrapsBlock {
  type: 'traps'
  title?: Bi
  items: { wrong: Bi; right: Bi }[]
}

export interface MnemonicBlock {
  type: 'mnemonic'
  title?: Bi
  /** The memory phrase itself, e.g. "The Elephant Brings Fresh Water". */
  phrase: Bi
  /** What each letter/word of the phrase stands for. */
  breakdown: { key: string; meaning: Bi }[]
  note?: Bi
}

export interface TableBlock {
  type: 'table'
  title?: Bi
  columns: Bi[]
  rows: Cell[][]
  note?: Bi
}

export interface TimelineBlock {
  type: 'timeline'
  title?: Bi
  items: { date: string; event: Bi }[]
}

export interface QuoteBlock {
  type: 'quote'
  text: Bi
  by: Bi
}

export interface QuizBlock {
  type: 'quiz'
  title?: Bi
  items: { q: Bi; a: Bi }[]
}

export type Block =
  | TextBlock
  | KeyPointsBlock
  | RememberBlock
  | TrapsBlock
  | MnemonicBlock
  | TableBlock
  | TimelineBlock
  | QuoteBlock
  | QuizBlock

export type BlockType = Block['type']

export interface Section {
  /** Optional stable anchor; defaults to a slug of `title.en`. */
  id?: string
  title: Bi
  blocks: Block[]
}

export interface Chapter {
  title: Bi
  /** One-line quick revision summary shown at the top of the chapter. */
  oneLiner: Bi
  /** Lower numbers appear first within the parent folder. */
  order?: number
  /** Extra search keywords (any language). */
  tags?: string[]
  /** Where the notes came from, e.g. "Class notes, Batch A". */
  source?: string
  /** ISO date of the last content update, e.g. "2026-11-15". */
  updated?: string
  sections: Section[]
}

export const defineSubject = (subject: Subject): Subject => subject
export const defineChapter = (chapter: Chapter): Chapter => chapter
export const defineFolder = (folder: Folder): Folder => folder
