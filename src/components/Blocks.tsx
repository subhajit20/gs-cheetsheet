import { useState, type ReactNode } from 'react'
import {
  Brain,
  CalendarClock,
  CircleCheck,
  CircleHelp,
  CircleX,
  Eye,
  EyeOff,
  Lightbulb,
  ListChecks,
  ListTodo,
  Quote,
  Table2,
  TriangleAlert,
} from 'lucide-react'
import type {
  Bi as BiText,
  Block,
  KeyPointsBlock,
  McqBlock,
  MnemonicBlock,
  QuizBlock,
  RememberBlock,
  TableBlock,
  TimelineBlock,
  TrapsBlock,
} from '../content/schema'
import { isBi } from '../lib/text'
import { Bi, Inline, UiText } from './Bi'

const DEFAULT_TITLES: Record<string, BiText> = {
  keyPoints: { en: 'Key points', bn: 'মূল বিষয়' },
  remember: { en: 'Remember this', bn: 'মনে রাখো' },
  traps: { en: 'Exam traps & common mistakes', bn: 'পরীক্ষার ফাঁদ ও সাধারণ ভুল' },
  mnemonic: { en: 'Mnemonic', bn: 'মনে রাখার কৌশল' },
  table: { en: 'Quick table', bn: 'সংক্ষিপ্ত সারণি' },
  timeline: { en: 'Timeline', bn: 'সময়রেখা' },
  quiz: { en: 'Self-test', bn: 'নিজেকে যাচাই করো' },
  mcq: { en: 'Practice MCQs', bn: 'অনুশীলনী MCQ' },
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F']

function Card({
  variant,
  icon,
  title,
  children,
  actions,
}: {
  variant: string
  icon: ReactNode
  title: BiText
  children: ReactNode
  actions?: ReactNode
}) {
  return (
    <section className={`block block-${variant}`}>
      <header className="block-head">
        <span className="block-icon" aria-hidden>
          {icon}
        </span>
        <Bi text={title} as="h3" className="block-title" layout="stack" />
        {actions}
      </header>
      <div className="block-body">{children}</div>
    </section>
  )
}

function KeyPoints({ block }: { block: KeyPointsBlock }) {
  return (
    <Card variant="key" icon={<ListChecks size={18} />} title={block.title ?? DEFAULT_TITLES.keyPoints}>
      <ul className="points">
        {block.items.map((item, i) => (
          <li key={i}>
            <Bi text={item} />
          </li>
        ))}
      </ul>
    </Card>
  )
}

function Remember({ block }: { block: RememberBlock }) {
  return (
    <Card variant="remember" icon={<Lightbulb size={18} />} title={block.title ?? DEFAULT_TITLES.remember}>
      <Bi text={block.text} as="p" />
    </Card>
  )
}

function Traps({ block }: { block: TrapsBlock }) {
  return (
    <Card variant="trap" icon={<TriangleAlert size={18} />} title={block.title ?? DEFAULT_TITLES.traps}>
      <ul className="traps">
        {block.items.map((item, i) => (
          <li key={i}>
            <div className="trap-row trap-wrong">
              <CircleX size={16} aria-label="Wrong" />
              <Bi text={item.wrong} />
            </div>
            <div className="trap-row trap-right">
              <CircleCheck size={16} aria-label="Correct" />
              <Bi text={item.right} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function Mnemonic({ block }: { block: MnemonicBlock }) {
  return (
    <Card variant="mnemonic" icon={<Brain size={18} />} title={block.title ?? DEFAULT_TITLES.mnemonic}>
      <Bi text={block.phrase} as="p" className="mnemonic-phrase" />
      <ul className="mnemonic-keys">
        {block.breakdown.map((b, i) => (
          <li key={i}>
            <span className="mnemonic-key">{b.key}</span>
            <Bi text={b.meaning} />
          </li>
        ))}
      </ul>
      {block.note && <Bi text={block.note} as="p" className="block-note" />}
    </Card>
  )
}

function Table({ block }: { block: TableBlock }) {
  return (
    <Card variant="table" icon={<Table2 size={18} />} title={block.title ?? DEFAULT_TITLES.table}>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {block.columns.map((c, i) => (
                <th key={i} scope="col">
                  <Bi text={c} layout="stack" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c}>{isBi(cell) ? <Bi text={cell} layout="stack" /> : <Inline text={String(cell)} />}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.note && <Bi text={block.note} as="p" className="block-note" />}
    </Card>
  )
}

function Timeline({ block }: { block: TimelineBlock }) {
  return (
    <Card variant="timeline" icon={<CalendarClock size={18} />} title={block.title ?? DEFAULT_TITLES.timeline}>
      <ol className="timeline">
        {block.items.map((item, i) => (
          <li key={i}>
            <span className="timeline-date">{item.date}</span>
            <Bi text={item.event} />
          </li>
        ))}
      </ol>
    </Card>
  )
}

function Quiz({ block }: { block: QuizBlock }) {
  const [open, setOpen] = useState<Set<number>>(new Set())
  const allOpen = open.size === block.items.length
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  return (
    <Card
      variant="quiz"
      icon={<CircleHelp size={18} />}
      title={block.title ?? DEFAULT_TITLES.quiz}
      actions={
        <button
          type="button"
          className="btn btn-ghost btn-sm no-print"
          onClick={() => setOpen(allOpen ? new Set() : new Set(block.items.map((_, i) => i)))}
        >
          {allOpen ? <EyeOff size={15} /> : <Eye size={15} />}
          {allOpen ? <UiText en="Hide all" bn="সব লুকাও" /> : <UiText en="Show all" bn="সব দেখাও" />}
        </button>
      }
    >
      <ol className="quiz">
        {block.items.map((item, i) => (
          <li key={i} className={open.has(i) ? 'is-open' : ''}>
            <button type="button" className="quiz-q" aria-expanded={open.has(i)} onClick={() => toggle(i)}>
              <Bi text={item.q} />
              <span className="quiz-hint no-print">
                {open.has(i) ? <UiText en="Hide" bn="লুকাও" /> : <UiText en="Answer" bn="উত্তর" />}
              </span>
            </button>
            <div className="quiz-a">
              <Bi text={item.a} />
            </div>
          </li>
        ))}
      </ol>
    </Card>
  )
}

function McqItem({ item, index }: { item: McqBlock['items'][number]; index: number }) {
  const [picked, setPicked] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const done = revealed || picked !== null
  return (
    <li className={`mcq-item ${done ? 'is-done' : ''}`}>
      <div className="mcq-q">
        <span className="mcq-num">{index + 1}.</span>
        <Bi text={item.q} />
      </div>
      {item.statements && (
        <ol className="mcq-statements">
          {item.statements.map((s, i) => (
            <li key={i}>
              <Bi text={s} />
            </li>
          ))}
        </ol>
      )}
      <ul className="mcq-options">
        {item.options.map((o, i) => {
          const state = !done ? '' : i === item.answer ? 'is-correct' : i === picked ? 'is-wrong' : 'is-dim'
          return (
            <li key={i}>
              <button
                type="button"
                className={`mcq-option ${state} ${i === item.answer ? 'is-answer' : ''}`}
                onClick={() => setPicked(i)}
                disabled={done}
              >
                <span className="mcq-label">{OPTION_LABELS[i]}</span>
                <Bi text={o} />
                {done && i === item.answer && <CircleCheck size={16} aria-label="Correct answer" className="mcq-mark" />}
                {done && i === picked && i !== item.answer && <CircleX size={16} aria-label="Your answer" className="mcq-mark" />}
              </button>
            </li>
          )
        })}
      </ul>
      <div className="mcq-foot">
        {!done && (
          <button type="button" className="btn btn-ghost btn-sm no-print" onClick={() => setRevealed(true)}>
            <Eye size={15} /> <UiText en="Show answer" bn="উত্তর দেখাও" />
          </button>
        )}
        {done && (
          <button
            type="button"
            className="btn btn-ghost btn-sm no-print"
            onClick={() => {
              setPicked(null)
              setRevealed(false)
            }}
          >
            <UiText en="Try again" bn="আবার চেষ্টা করো" />
          </button>
        )}
      </div>
      {item.explanation && (
        <div className="mcq-explain">
          <Bi text={item.explanation} />
        </div>
      )}
    </li>
  )
}

function Mcq({ block }: { block: McqBlock }) {
  return (
    <Card variant="mcq" icon={<ListTodo size={18} />} title={block.title ?? DEFAULT_TITLES.mcq}>
      <ol className="mcq">
        {block.items.map((item, i) => (
          <McqItem key={i} item={item} index={i} />
        ))}
      </ol>
    </Card>
  )
}

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':
      return <Bi text={block.text} as="p" className="block-text" />
    case 'keyPoints':
      return <KeyPoints block={block} />
    case 'remember':
      return <Remember block={block} />
    case 'traps':
      return <Traps block={block} />
    case 'mnemonic':
      return <Mnemonic block={block} />
    case 'table':
      return <Table block={block} />
    case 'timeline':
      return <Timeline block={block} />
    case 'quote':
      return (
        <figure className="block block-quote">
          <Quote size={20} aria-hidden className="quote-icon" />
          <Bi text={block.text} as="blockquote" />
          <figcaption>
            — <Bi text={block.by} layout="inline" />
          </figcaption>
        </figure>
      )
    case 'quiz':
      return <Quiz block={block} />
    case 'mcq':
      return <Mcq block={block} />
  }
}
