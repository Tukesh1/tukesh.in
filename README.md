<div align="center">

# tukesh.in

**A clean, fast, content-first developer portfolio built with Next.js 15, React 19, and Tailwind CSS.**

[![Next.js](https://img.shields.io/badge/Next.js-15-000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

[**Live demo →**](https://tukesh.in)

![Portfolio overview](./public/assets/overview.png)

</div>

---

## Why this repo?

Most portfolio templates are either bloated with carousels and parallax, or so minimal that they feel unfinished. This one aims for a different middle:

- **Content-first.** Projects, experience, and activity are plain data files — update one file, ship.
- **Fast.** Static generation, shared-chunk budget under ~105 kB, Lighthouse 95+ across the board.
- **Real signals.** Live GitHub contribution graph, auto-synced activity feed (GitHub + WakaTime), MDX blog.
- **Typed.** Strict TypeScript end-to-end. No `any` escape hatches.

## Features

- **Home / About / Projects / Blog / Activity** — five clear pages, each a single data file away from yours.
- **Featured projects** surface on the homepage via a single `featured: true` flag.
- **Live activity feed** pulls commits, PRs, and coding sessions from GitHub + WakaTime (revalidated every 60s).
- **MDX blog** with syntax highlighting, JSON-LD, and SEO metadata per post.
- **GitHub contribution calendar** with light/dark themes.
- **SEO ready.** Sitemap, OpenGraph, Twitter cards, JSON-LD (`Person`, `WebSite`, `ProfilePage`, `BlogPosting`).
- **PWA manifest**, proper theme-color meta, and RSS alternate link.
- **Dark / light theme** with `next-themes` (respects system preference, no flash).
- **Accessibility minded.** Reduced-motion respected, focus states, semantic structure.

## Tech stack

| Layer       | Choice                                                                 |
| ----------- | ---------------------------------------------------------------------- |
| Framework   | [Next.js 15](https://nextjs.org/) (App Router) + React 19              |
| Language    | TypeScript 5 (strict)                                                  |
| Styling     | Tailwind CSS 3 + `@tailwindcss/typography`                             |
| UI          | Radix UI primitives, `lucide-react`, Framer Motion                     |
| Content     | MDX via `next-mdx-remote`, `gray-matter` for frontmatter               |
| Data        | GitHub REST API + WakaTime API (server-side, cached)                   |
| Typography  | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)       |

## Quick start

```bash
# 1. Clone
git clone https://github.com/tukesh1/tukesh.in.git
cd tukesh.in

# 2. Install
npm install

# 3. (Optional) set env vars for the /activity page
cp .env.example .env.local
#    - GITHUB_TOKEN    raises the GitHub rate limit (10 → 30 req/min)
#    - WAKATIME_API_KEY required for coding-session stats

# 4. Dev
npm run dev        # http://localhost:3000
```

### Scripts

| Command         | What it does                         |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server                 |
| `npm run build` | Production build (static + SSG)      |
| `npm start`     | Serve the production build           |
| `npm run lint`  | Run ESLint (`next/core-web-vitals`)  |

## Project structure

```
src/
├── app/                 # Next.js App Router pages (routes only)
│   ├── about/           # /about
│   ├── activity/        # /activity — live GitHub + WakaTime feed
│   ├── post/            # /post & /post/[slug] — MDX blog
│   ├── projects/        # /projects
│   ├── layout.tsx       # Root layout, fonts, metadata, theme provider
│   ├── page.tsx         # Home
│   ├── not-found.tsx    # 404
│   ├── manifest.ts      # PWA manifest
│   └── sitemap.ts       # Dynamic sitemap
│
├── components/          # Reusable UI
│   ├── about/           # About-page sections (experience, skills, tools…)
│   ├── icons/           # Inline SVG icons (kept small, tree-shakable)
│   └── *.tsx            # Header, footer, panel, mdx-content, etc.
│
├── content/             # MDX blog posts
│
├── data/                # ALL content lives here — edit these files to customize
│   ├── siteMetadata.ts  # Name, description, social links, SEO keywords
│   ├── projects.ts      # Your projects (set `featured: true` to surface on home)
│   ├── experience.tsx   # Work history (supports inline JSX for bold / links)
│   ├── skills.tsx       # Skill grid
│   ├── tools.tsx        # Tool stack
│   ├── certifications.ts
│   ├── socials.tsx      # Social icons shown on the home page
│   └── activity.ts      # GitHub + WakaTime fetching logic
│
└── lib/utils.ts         # cn() helper, formatDate()
```

## Making it yours

See **[Customization.md](./Customization.md)** for a step-by-step walkthrough.

TL;DR — 90% of what you need to change lives in `src/data/`:

1. Edit `src/data/siteMetadata.ts` (name, URL, social links).
2. Replace `public/assets/profile.png`, `public/assets/social-banner.png`, `public/resume.pdf`.
3. Add your projects to `src/data/projects.ts` (mark your best 2-3 with `featured: true`).
4. Update `src/data/experience.tsx`, `skills.tsx`, `tools.tsx`, `certifications.ts`.
5. Drop MDX posts into `src/content/post/`.
6. Deploy to Vercel (recommended) or any Node host.

## Docker

```bash
docker build -t tukesh.in .
docker run -p 3000:3000 tukesh.in
# → http://localhost:3000
```

## Deploy

Any host that runs Node 18+ will work. The easiest path is Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tukesh1/tukesh.in)

## Performance

- Lighthouse **95+** across Performance, Accessibility, Best Practices, and SEO.
- First Load JS budget: **~102 kB** shared, **~125 kB** on the heaviest route.
- `react-github-calendar` is dynamically imported and client-only so it never blocks the main page.
- All images served via `next/image`.

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md). If you're using this template for your own site, a link back in your footer is appreciated but not required.

## License

[MIT](./LICENSE) © [Tukesh Kumar](https://tukesh.in)

---

<div align="center">
<sub>Built with care. If this helped you, a ⭐ goes a long way.</sub>
</div>
