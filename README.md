# GS Cheat Sheets

Bilingual (English + বাংলা) General Studies cheat sheets for government job exam preparation. Subjects are folders, chapters are sub-folders, and every chapter is built from memorisation-friendly blocks: key points, "remember this" callouts, exam traps, mnemonics, tables, timelines and self-tests.

## Features

- **Folder navigation:** sidebar tree (Subject › Chapter › Sub-topic, any depth), breadcrumbs, and subject/chapter landing pages.
- **Bilingual:** switch between English, বাংলা, or both side by side. The choice is remembered. Bengali uses Noto Sans Bengali.
- **Search:** press `/` or `Ctrl K` to search every subject, chapter and section in either language.
- **Print-friendly:** a clean paper layout. Quiz answers are revealed, and navigation is hidden.
- **Dark / light / system theme**, mobile-first layout, no backend.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run lint     # oxlint
npm run preview  # serve the production build
```

## Adding content

Adding a chapter means adding **one file** under `src/content/<subject>/...`. No code changes are needed. See **[CONTENT_GUIDE.md](CONTENT_GUIDE.md)** for the file format and every block type. Use `src/content/polity/preamble.ts` as the reference chapter.

## Project layout

```
src/
├── content/          # all cheat sheet content (one file per chapter) + schema.ts
├── lib/              # content registry (folder tree), search, preferences
├── components/       # layout, sidebar, header, search dialog, block renderers
├── pages/            # home, subject/folder/chapter page, 404
└── styles.css        # design tokens, light/dark themes, print styles
```

## Deploying

`npm run build` outputs a static site in `dist/`. It uses client-side routing (`/polity/preamble`), so the host must serve `index.html` for unknown paths (the default on Netlify/Vercel/Cloudflare Pages with an SPA rewrite). To serve from a sub-path, build with `vite build --base=/sub-path/`.
