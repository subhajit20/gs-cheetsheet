# Content Guide

How to turn a set of class notes into a cheat sheet for this portal. Follow this exactly so every chapter looks and behaves the same.

**Reference chapter:** [`src/content/polity/preamble.ts`](src/content/polity/preamble.ts) uses every block type. When in doubt, copy its patterns.

---

## 1. Where files go

All content lives in `src/content/`. Folders become the navigation tree; the folder and file names become the URL. Example layout (today only `polity/preamble.ts` and the `_subject.ts` files exist):

```
src/content/
├── schema.ts                      ← types + helpers (do not edit when adding content)
├── polity/                        ← subject folder  → /polity
│   ├── _subject.ts                ← subject metadata (required, one per subject)
│   ├── preamble.ts                ← chapter         → /polity/preamble
│   └── fundamental-rights/        ← chapter with sub-topics
│       ├── index.ts               ← the chapter itself → /polity/fundamental-rights
│       ├── article-14.ts          ← sub-topic       → /polity/fundamental-rights/article-14
│       └── article-19.ts
└── history/
    ├── _subject.ts
    └── modern/                    ← grouping folder with no content of its own
        ├── _folder.ts             ← optional: bilingual name + order for the folder
        └── revolt-of-1857.ts      → /history/modern/revolt-of-1857
```

| File | Purpose | Helper |
| --- | --- | --- |
| `<subject>/_subject.ts` | Subject title, description, icon, colour, order | `defineSubject` |
| `<...>/<chapter>.ts` | One chapter / topic cheat sheet | `defineChapter` |
| `<...>/<folder>/index.ts` | A chapter that also has sub-topics in the same folder | `defineChapter` |
| `<...>/<folder>/_folder.ts` | Optional name/order for a grouping folder without content. Without it, the folder name is title-cased (`modern` → "Modern") | `defineFolder` |

**Adding a chapter = adding one file.** No code, route or menu edits. The sidebar, breadcrumbs, subject page, search, and previous/next links pick it up automatically.

### Naming rules

- Lowercase kebab-case, English: `fundamental-rights.ts`, `revolt-of-1857.ts`. The name becomes the URL, so don't rename published files.
- Nest as deep as needed (subject › chapter › sub-topic › …).
- The import path to `schema.ts` depends on depth: `'../schema'` in a subject folder, `'../../schema'` one level deeper, and so on.

## 2. Bilingual text (`Bi`)

Every piece of visible text is an object with both languages:

```ts
{ en: 'Added by the 42nd Amendment, 1976', bn: '৪২তম সংশোধনী, ১৯৭৬-এ যুক্ত' }
```

Rules:

- **Always fill both `en` and `bn`.** If a translation is genuinely missing, the English shows as a fallback, but treat that as a bug to fix.
- Bengali uses **Bengali numerals** (১৯৪৯, ৪২তম, অনুচ্ছেদ ১৪) and standard exam terminology (সার্বভৌম, মৌলিক অধিকার, নির্দেশমূলক নীতি…). Keep proper nouns recognisable: `কেশবানন্দ ভারতী`.
- Keep the same facts in both languages, sentence for sentence. The "both" view shows them side by side, so they should line up.
- Inline marks (both languages):
  - `**bold**` for key terms: names, article numbers, the "answer word".
  - `==highlight==` for the one fact per block that must be memorised (dates, counts, case years). Use sparingly, at most 1–2 per block.
- Use `’` or `\'` for apostrophes inside single-quoted strings (`'Nehru\'s'`).

## 3. Subject file

```ts
import { defineSubject } from '../schema'

export default defineSubject({
  title: { en: 'Indian Polity', bn: 'ভারতীয় রাষ্ট্রব্যবস্থা' },
  description: {
    en: 'Constitution, Parliament, judiciary, rights and governance.',
    bn: 'সংবিধান, সংসদ, বিচারব্যবস্থা, অধিকার ও শাসনব্যবস্থা।',
  },
  icon: 'landmark', // landmark | scroll | globe | rupee | flask | leaf | palette | newspaper | book
  accent: 'indigo', // indigo | amber | emerald | sky | rose | teal | violet | orange
  order: 1,         // position on the home page and sidebar
})
```

The subject `description` appears on its home-page card and under the subject page heading. Chapter cards on the subject page show only chapter titles. A subject with no chapters shows a "Coming soon" placeholder automatically.

## 4. Chapter file

```ts
import { defineChapter } from '../schema'

export default defineChapter({
  title: { en: 'Preamble', bn: 'প্রস্তাবনা' },
  oneLiner: { en: '…one sentence…', bn: '…এক বাক্যে…' }, // required
  order: 1,                       // position inside its folder (optional, else alphabetical)
  tags: ['42nd amendment', 'প্রস্তাবনা'], // extra search keywords, any language (optional)
  source: 'Class notes · Polity',  // optional
  updated: '2026-11-15',           // optional, ISO date
  sections: [
    {
      id: 'exam-traps',            // optional anchor; defaults to slug of title.en
      title: { en: 'Exam traps', bn: 'পরীক্ষার ফাঁদ' },
      blocks: [ /* blocks, see below */ ],
    },
  ],
})
```

- **`title`**: the only text on the chapter's card on subject, folder and sub-topic listings. Cards are heading-only, so make the title self-explanatory ("Fundamental Rights", not "Chapter 3").
- **`oneLiner`**: the whole chapter in one sentence, shown at the top of the chapter page as "One-line revision" and searched. It is **not** shown on listing cards. Answer *who / what / when / how many* in it.
- **`sections`**: become the "On this page" table of contents and search results. Use 5–10 sections per chapter.

## 5. Block types

Pick the block that matches the *purpose* of the note. Default titles are shown in brackets; every `title` is optional and overrides the default.

### `text`: short explanation paragraph

Use rarely. Cheat sheets prefer lists and tables.

```ts
{ type: 'text', text: { en: '…', bn: '…' } }
```

### `keyPoints`: bullet list of facts [Key points / মূল বিষয়]

The default block for notes. One fact per item, ideally one line.

```ts
{
  type: 'keyPoints',
  title: { en: 'Legal status in one glance', bn: 'এক নজরে আইনি অবস্থান' }, // optional
  items: [
    { en: 'It is **non-justiciable**.', bn: 'এটি **বিচারযোগ্য নয়**।' },
  ],
}
```

### `remember`: single must-remember callout [Remember this / মনে রাখো]

One fact students must not forget. Use 1–3 per chapter, not more.

```ts
{ type: 'remember', text: { en: 'The date is ==26 November 1949==.', bn: 'তারিখটি ==২৬ নভেম্বর ১৯৪৯==।' } }
```

### `traps`: exam traps and common mistakes [Exam traps & common mistakes]

Each item pairs the **wrong** statement (what examiners use as a distractor) with the **right** one.

```ts
{
  type: 'traps',
  items: [
    {
      wrong: { en: 'The Preamble has never been amended.', bn: 'প্রস্তাবনা কখনও সংশোধিত হয়নি।' },
      right: { en: 'Amended **once**, by the **42nd** Amendment (1976).', bn: '**একবার** সংশোধিত, **৪২তম** সংশোধনীতে (১৯৭৬)।' },
    },
  ],
}
```

### `mnemonic`: memory trick [Mnemonic / মনে রাখার কৌশল]

`phrase` is the trick itself. `breakdown` maps each key letter/word to its meaning. Write a **real Bengali mnemonic** in `phrase.bn` when possible (e.g. `সারা সকাল ধরে গান সাধা`). Otherwise explain the English one in Bengali.

```ts
{
  type: 'mnemonic',
  title: { en: 'Mnemonic: the 5 liberties', bn: 'স্মৃতি-কৌশল: ৫টি স্বাধীনতা' },
  phrase: { en: 'The Elephant Brings Fresh Water', bn: 'চিন্তা করে মত দাও, বিশ্বাস ও ধর্ম মেনে উপাসনা করো' },
  breakdown: [
    { key: 'T', meaning: { en: 'Thought', bn: 'চিন্তা' } },
    { key: 'E', meaning: { en: 'Expression', bn: 'মতপ্রকাশ' } },
  ],
  note: { en: 'Optional extra hint', bn: 'ঐচ্ছিক অতিরিক্ত টিপস' },
}
```

### `table`: articles, cases, dates, comparisons [Quick table / সংক্ষিপ্ত সারণি]

`columns` are bilingual headers. Each row is an array of cells, one per column. A cell is either `Bi` text or a plain string/number when it is the same in both languages (counts, years, article numbers). The first column is bold, so put the "lookup key" there.

```ts
{
  type: 'table',
  title: { en: 'Landmark cases', bn: 'গুরুত্বপূর্ণ মামলা' },
  columns: [{ en: 'Case', bn: 'মামলা' }, { en: 'Held', bn: 'রায়' }, { en: 'Count', bn: 'সংখ্যা' }],
  rows: [
    [{ en: 'Kesavananda Bharati (1973)', bn: 'কেশবানন্দ ভারতী (১৯৭৩)' }, { en: 'Preamble is part', bn: 'প্রস্তাবনা অংশ' }, 3],
  ],
  note: { en: 'Optional footnote', bn: 'ঐচ্ছিক টীকা' },
}
```

### `timeline`: chronological events [Timeline / সময়রেখা]

`date` is a plain string shown in both languages, e.g. `'13 Dec 1946'`, `'1976'`, `'c. 321 BCE'`.

```ts
{
  type: 'timeline',
  items: [{ date: '22 Jan 1947', event: { en: 'Objectives Resolution adopted.', bn: 'উদ্দেশ্য প্রস্তাব গৃহীত।' } }],
}
```

### `quote`: original text or a famous quotation

```ts
{ type: 'quote', text: { en: '"Identity card of the Constitution"', bn: '"সংবিধানের পরিচয়পত্র"' }, by: { en: 'N.A. Palkhivala', bn: 'এন. এ. পালকিওয়ালা' } }
```

### `quiz`: self-test questions [Self-test / নিজেকে যাচাই করো]

Answers stay hidden until tapped and always appear in print. Put 3–6 MCQ-style questions in the last section.

```ts
{
  type: 'quiz',
  items: [{ q: { en: 'Which amendment added "Secular"?', bn: 'কোন সংশোধনী "ধর্মনিরপেক্ষ" যোগ করে?' }, a: { en: '42nd (1976).', bn: '৪২তম (১৯৭৬)।' } }],
}
```

## 6. Converting notes → cheat sheet: checklist

1. **Create the file** in the right subject/chapter folder (section 1).
2. **Write `oneLiner`** first. If you can't summarise the chapter in one sentence, re-read the notes.
3. **Group the notes into 5–10 sections**, in this usual order:
   1. Text / definition / at a glance (table or key points)
   2. Origin, history, dates (`timeline`)
   3. Core concepts (`table` of term → meaning → exam note)
   4. Articles / cases / committees (`table`)
   5. Amendments, numbers, lists (`keyPoints` + `mnemonic`)
   6. Famous quotes (`table` or `quote`)
   7. **Exam traps** (`traps`)
   8. **Quick revision** (`keyPoints` recap + `quiz`)
4. **Capture every exam-relevant fact** from the notes: dates, article numbers, amendment numbers, case names + years, counts, "who said what", sources/borrowed features. If the notes have it, the cheat sheet has it.
5. Every number or list students must memorise gets a `remember` or a `mnemonic`.
6. Every "students often confuse X with Y" goes into `traps`.
7. Translate everything to Bengali (section 2 rules).
8. Add `tags` for alternative search words (abbreviations, Bengali names, case names).
9. Run `npm run build`. TypeScript will flag any missing field or wrong block shape. Open the chapter with `npm run dev` and check it in **EN**, **বাংলা**, **both** and print preview.

## 7. Style rules

- Short lines. One fact per bullet. No long paragraphs.
- Be exact: "42nd Amendment Act, 1976", not "an amendment in the 70s".
- Prefer tables for anything with 3+ parallel items (articles, cases, sources).
- Don't repeat the same fact in many blocks. The exceptions are the final quick-revision recap and the traps.
- Verify facts against a standard text (e.g. Laxmikanth for Polity) before publishing.
