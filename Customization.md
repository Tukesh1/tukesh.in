# Customization Guide

This portfolio is designed so almost every change happens in one folder: **`src/data/`**. You should rarely need to touch component code to personalize it.

---

## 1. Site metadata

File: [`src/data/siteMetadata.ts`](./src/data/siteMetadata.ts)

```ts
export const siteMetadata = {
  title: "Your Name",
  author: "Your Name",
  siteUrl: "https://yoursite.com",
  socialBanner: "/assets/social-banner.png", // 1200×630 PNG in public/assets/
  description: "Short tagline shown in <meta> and OG cards.",
  keywords: ["Portfolio", "Developer", "React", "TypeScript"],
  social: {
    email: "you@example.com",
    x: "https://x.com/your-handle",
    linkedinLink: "https://www.linkedin.com/in/your-profile/",
    githubLink: "https://github.com/your-username",
  },
  handles: {
    github: "your-username",       // drives /about GitHub calendar
    wakatime: "your-wakatime-id",  // drives /activity coding stats
  },
  pages: { /* per-page title + description */ },
};
```

Everything that references your name, domain, or social handles reads from here.

---

## 2. Projects

File: [`src/data/projects.ts`](./src/data/projects.ts)

```ts
export const WEB_APPS: Project[] = [
  {
    title: "Project name",
    category: "web",           // "web" | "ai-ml" | "cli"
    tags: ["React", "TypeScript"],
    description: [
      "Bullet 1.",
      "Bullet 2.",
    ],
    tagline: "One-liner shown on the home page when featured.",
    thumbnail: "/assets/project/your-image.png",
    repo: "https://github.com/you/repo",
    live: "https://your-demo.com", // optional
    featured: true,                // surface on the homepage
    period: { start: "10. 2025" }, // omit `end` for ongoing
  },
];
```

- Set `featured: true` on your top 2-3 projects — they appear in the home-page "Cool Stuff I'm Working On" section automatically.
- The `/projects` page renders everything from `WEB_APPS`, `AI_ML_PROJECTS`, and `CLI_PROJECTS` combined.
- Thumbnails can be local (`/assets/project/…`) or GitHub's OG endpoint (`https://opengraph.githubassets.com/1/<user>/<repo>`).

---

## 3. Experience, skills, tools, certifications

Each lives in its own data file under `src/data/` and is consumed by a matching component under `src/components/about/`.

| What            | Data file                           |
| --------------- | ----------------------------------- |
| Work history    | `src/data/experience.tsx`           |
| Skill grid      | `src/data/skills.tsx`               |
| Tool stack      | `src/data/tools.tsx`                |
| Certifications  | `src/data/certifications.ts`        |

`experience.tsx` supports inline JSX inside `details`, so you can bold things or add links:

```tsx
details: [
  <>Shipped <strong>feature X</strong> using React and Node.</>,
  <>Contributed to <a href="https://example.com">project Y</a>.</>,
],
```

---

## 4. Social links

File: [`src/data/socials.tsx`](./src/data/socials.tsx)

Each entry becomes an icon in the hero. Icons live in [`src/components/icons/index.tsx`](./src/components/icons/index.tsx) — add new ones there and import them.

---

## 5. Blog posts

Drop `.mdx` files into `src/content/post/`. Frontmatter:

```mdx
---
title: "My first post"
description: "Short summary shown in /post list and <meta>."
createdAt: "2025-01-15"   # optional — falls back to file birth time
updatedAt: "2025-01-16"   # optional — falls back to file mtime
---

Normal markdown and MDX below…
```

Styling of headings, code blocks, tables, etc. lives in [`src/components/mdx-content.tsx`](./src/components/mdx-content.tsx).

---

## 6. Images & assets

Everything under `public/` is served from `/`. Replace:

- `public/favicon.png`
- `public/assets/profile.png` — hero avatar
- `public/assets/social-banner.png` — 1200×630 OG card
- `public/assets/overview.png` — README screenshot
- `public/resume.pdf`
- `public/assets/project/*.png` — project thumbnails

If you add a new external image domain, whitelist it in [`next.config.ts`](./next.config.ts).

---

## 7. Navigation

File: [`src/components/header.tsx`](./src/components/header.tsx)

```ts
const navItems = {
  "/": { name: "home" },
  "/about": { name: "about" },
  "/projects": { name: "projects" },
  "/post": { name: "post" },
  "/activity": { name: "activity" },
};
```

Add/remove entries here; each key must match a folder in `src/app/`.

---

## 8. Theme & typography

Colors live in `tailwind.config.js` and `src/app/globals.css`. The only custom color is `dark-bg` (`#1D1E20`); everything else uses Tailwind defaults.

Font is [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk), loaded via `next/font` in `src/app/layout.tsx` and wired to Tailwind's `font-sans` via the `--font-space-grotesk` CSS variable.

---

## 9. Activity feed (`/activity`)

Pulls from GitHub search API (commits + PRs) and WakaTime (daily coding summaries). To enable:

```bash
# .env.local
GITHUB_TOKEN=ghp_xxx          # optional; fine-grained, Contents + Metadata read
WAKATIME_API_KEY=waka_xxx     # required for coding stats
```

Revalidates every 60s (`export const revalidate = 60` in `src/app/activity/page.tsx`).

If you don't want this page, delete `src/app/activity/`, remove the `"/activity"` entry from `header.tsx`, and drop the route from `src/app/sitemap.ts`.

---

## 10. Analytics

Google Analytics is wired up in [`src/app/layout.tsx`](./src/app/layout.tsx) with ID `G-P36W5PCJC2`. Replace it with yours or delete the two `<Script>` tags.
