# Customization Guide

This portfolio is designed so almost every change happens in one folder: **`src/data/json/`**. You should never need to touch component code to personalise it.

> **New to JSON?** JSON is just a configuration file format. No TypeScript or React knowledge is needed to edit these files.

---

## 1. Site metadata

File: [`src/data/json/site.json`](./src/data/json/site.json)

```json
{
  "title": "Your Name",
  "author": "Your Name",
  "siteUrl": "https://yoursite.com",
  "socialBanner": "/assets/social-banner.png",
  "description": "Short tagline shown in <meta> and OG cards.",
  "keywords": ["Portfolio", "Developer", "React", "TypeScript"],
  "social": {
    "email": "you@example.com",
    "x": "https://x.com/your-handle",
    "linkedinLink": "https://www.linkedin.com/in/your-profile/",
    "githubLink": "https://github.com/your-username"
  },
  "handles": {
    "github": "your-username",
    "wakatime": "your-wakatime-id"
  },
  "pages": { }
}
```

Everything that references your name, domain, or social handles reads from here.

---

## 2. Projects

File: [`src/data/json/projects.json`](./src/data/json/projects.json)

Each object in the array is a project:

```json
{
  "title": "Project name",
  "category": "web",
  "tags": ["React", "TypeScript"],
  "description": [
    "Bullet 1.",
    "Bullet 2."
  ],
  "tagline": "One-liner shown on the home page when featured.",
  "thumbnail": "/assets/project/your-image.png",
  "repo": "https://github.com/you/repo",
  "live": "https://your-demo.com",
  "featured": true,
  "period": { "start": "10. 2025" }
}
```

**Valid `category` values:** `"web"` · `"ai-ml"` · `"cli"` · `"agents"`

- Set `"featured": true` on your top 2–3 projects — they appear in the home-page "Cool Stuff I'm Working On" section automatically.
- Omit `"end"` in `period` for ongoing projects.
- `"thumbnail"` can be a local asset (`/assets/project/…`) or GitHub's OG image endpoint (`https://opengraph.githubassets.com/1/<user>/<repo>`).

---

## 3. Experience

File: [`src/data/json/experience.json`](./src/data/json/experience.json)

```json
{
  "company": "Company Name",
  "role": "Your Role",
  "duration": "2024 — Present",
  "location": "City, Country",
  "current": true,
  "details": [
    "Developed apps using **React** and **Node.js**.",
    "Contributed to **[Project Name](https://example.com)** benchmarking."
  ],
  "skills": ["React", "Node.js", "TypeScript"]
}
```

`details` supports lightweight markdown:
- **Bold**: `**text**`
- **Links**: `[link text](https://url.com)`

---

## 4. Skills

File: [`src/data/json/skills.json`](./src/data/json/skills.json)

```json
{
  "title": "Frontend JavaScript Frameworks",
  "icon": "DiReact",
  "iconColor": "text-cyan-400",
  "subskills": "Angular, React, Vue.js"
}
```

`icon` is a key from the icon map (see below). `iconColor` is a Tailwind CSS class.

---

## 5. Tools

File: [`src/data/json/tools.json`](./src/data/json/tools.json)

```json
{
  "name": "VS Code",
  "icon": "DiVisualstudio",
  "iconColor": "text-indigo-600 dark:text-indigo-400"
}
```

---

## 6. Social links

File: [`src/data/json/socials.json`](./src/data/json/socials.json)

```json
{
  "label": "GitHub",
  "href": "https://github.com/your-username",
  "icon": "GitHubIcon"
}
```

Each entry becomes an icon in the hero section.

---

## 7. Certifications

File: [`src/data/json/certifications.json`](./src/data/json/certifications.json)

```json
{
  "title": "AWS Academy Cloud Foundations",
  "date": "2024-09",
  "link": "https://www.credly.com/badges/...",
  "iconImage": "/assets/aws-cloud.png"
}
```

Use `"iconImage"` for an image badge, or `"icon"` for an emoji (e.g. `"🥷"`).

---

## 8. Available icons

Icons are referenced by string key in the JSON files. The full registry is in [`src/data/icon-map.tsx`](./src/data/icon-map.tsx).

**Currently available keys:**

| Key | Library |
|-----|---------|
| `DiReact`, `DiNodejs`, `DiMongodb`, `DiPython`, `DiGit`, `DiCss3`, `DiHtml5`, `DiVisualstudio`, `DiCode` | `react-icons/di` |
| `SiNextdotjs`, `SiReplit` | `react-icons/si` |
| `GitHubIcon`, `XIcon`, `LinkedInIcon`, `InstagramIcon` | Custom (`src/components/icons`) |

**To add a new icon:**
1. Find the icon name on [react-icons.github.io](https://react-icons.github.io/react-icons/)
2. Add the import and a new entry to `ICON_COMPONENT_MAP` in `src/data/icon-map.tsx`
3. Use the key string in the relevant JSON file

---

## 9. Blog posts

Drop `.mdx` files into `src/content/post/`. Frontmatter:

```mdx
---
title: "My first post"
description: "Short summary shown in /post list and <meta>."
createdAt: "2025-01-15"
updatedAt: "2025-01-16"
---

Normal markdown and MDX below…
```

Styling of headings, code blocks, tables, etc. lives in [`src/components/mdx-content.tsx`](./src/components/mdx-content.tsx).

---

## 10. Images & assets

Everything under `public/` is served from `/`. Replace:

- `public/favicon.png`
- `public/assets/profile.png` — hero avatar
- `public/assets/social-banner.png` — 1200×630 OG card
- `public/assets/overview.png` — README screenshot
- `public/resume.pdf`
- `public/assets/project/*.png` — project thumbnails

If you add a new external image domain, whitelist it in [`next.config.ts`](./next.config.ts).

---

## 11. Navigation

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

## 12. Theme & typography

Colors live in `tailwind.config.js` and `src/app/globals.css`. The only custom color is `dark-bg` (`#1D1E20`); everything else uses Tailwind defaults.

Font is [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk), loaded via `next/font` in `src/app/layout.tsx` and wired to Tailwind's `font-sans` via the `--font-space-grotesk` CSS variable.

---

## 13. Activity feed (`/activity`)

Pulls from GitHub search API (commits + PRs) and WakaTime (daily coding summaries). To enable:

```bash
# .env.local
GITHUB_TOKEN=ghp_xxx          # optional; fine-grained, Contents + Metadata read
WAKATIME_API_KEY=waka_xxx     # required for coding stats
```

Revalidates every 60s (`export const revalidate = 60` in `src/app/activity/page.tsx`).

If you don't want this page, delete `src/app/activity/`, remove the `"/activity"` entry from `header.tsx`, and drop the route from `src/app/sitemap.ts`.

---

## 14. Analytics

Google Analytics is wired up in [`src/app/layout.tsx`](./src/app/layout.tsx) with ID `G-P36W5PCJC2`. Replace it with yours or delete the two `<Script>` tags.
