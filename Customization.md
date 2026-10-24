# Customization Guide

This portfolio is designed so **almost every change happens in one folder: `src/data/json/`**. You should never need to touch component code to personalise it.

> **New to JSON?** JSON is just a configuration file format. No TypeScript or React knowledge is needed to edit these files.

---

## 1. Site metadata

File: [`src/data/json/site.json`](./src/data/json/site.json)

This is the **single source of truth** for your entire portfolio. Update this file first.

```json
{
  "title": "Your Name",
  "author": "Your Name",
  "initials": "YN",
  "siteUrl": "https://yoursite.com",
  "repoName": "your-repo-name",
  "socialBanner": "/assets/social-banner.png",
  "avatarImage": "/assets/profile.png",
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
    "x": "your-x-handle",
    "wakatime": "your-wakatime-id"
  },

  "home": {
    "typewriterPhrases": [
      "Open Source Contributor",
      "Software Engineer",
      "Always learning, always shipping."
    ],
    "bio": "I'm a developer specializing in <strong>React and TypeScript</strong>.",
    "currentWork": {
      "name": "my-project",
      "url": "https://github.com/you/my-project",
      "description": "a short description of what you're building."
    }
  },

  "profile": {
    "jobTitle": "Software Engineer",
    "pronouns": "their",
    "location": "Your City, Country",
    "country": "US",
    "education": {
      "name": "Your University",
      "url": "https://youruni.edu"
    },
    "knowsAbout": ["React", "TypeScript", "Node.js"]
  },

  "analytics": {
    "googleId": "G-XXXXXXXXXX",
    "gscVerification": "your-google-search-console-token"
  },

  "dmca": {
    "verificationMeta": "your-dmca-meta-token",
    "badgeUrl": "//www.dmca.com/Protection/Status.aspx?ID=your-id"
  },

  "features": {
    "activity": true,
    "guestbook": true,
    "blog": true
  },

  "pages": { }
}
```

### Key fields explained

| Field | Purpose |
|---|---|
| `initials` | 2-letter monogram shown in the footer badge |
| `repoName` | Name of your GitHub repo — used in the header source-code link |
| `avatarImage` | Path to your profile photo (under `public/`) |
| `home.bio` | Bio paragraph on the homepage. Supports `<strong>` tags. |
| `home.typewriterPhrases` | Rotating phrases under your name on the homepage |
| `home.currentWork` | "Currently building X" blurb. Remove the key entirely to hide it. |
| `profile.pronouns` | Used in the AI-readable `/llms.txt` profile text (`his`, `her`, `their`…) |
| `profile.education` | Shown in JSON-LD structured data for SEO. Remove to hide. |
| `analytics.googleId` | Your Google Analytics 4 Measurement ID. Remove to disable tracking. |
| `analytics.gscVerification` | Google Search Console verification token. Remove if not needed. |
| `dmca` | Remove the entire key to hide the DMCA badge from the footer. |
| `handles.x` | Your X/Twitter handle (without `@`) — used in Twitter card `creator` meta |

### Feature flags

Setting a feature to `false` in `site.json` automatically:
- Removes it from the **navigation bar**
- Removes it from **sitemap.xml**

```json
"features": {
  "activity": false,
  "guestbook": false,
  "blog": true
}
```

> **Note**: Setting a feature to `false` only hides the nav link and removes it from the sitemap. Delete the corresponding `src/app/<page>/` folder to fully remove the route.

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

- Set `"featured": true` on your top 2–3 projects — they appear in the home-page "Shipping now" section automatically.
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

To disable the blog entirely, set `"features": { "blog": false }` in `site.json`.

---

## 10. Images & assets

Everything under `public/` is served from `/`. Replace:

- `public/favicon.png`
- `public/assets/profile.png` — hero avatar (update `avatarImage` in `site.json` to match)
- `public/assets/social-banner.png` — 1200×630 OG card
- `public/assets/overview.png` — README screenshot
- `public/resume.pdf`
- `public/assets/project/*.png` — project thumbnails

If you add a new external image domain, whitelist it in [`next.config.ts`](./next.config.ts).

---

## 11. Navigation

Navigation is **automatically generated** from the `features` flags in `site.json`.

The base nav always includes: **home**, **about**, **projects**.

Optional pages controlled by flags:
- `"blog": false` → removes `/post` from nav
- `"activity": false` → removes `/activity` from nav
- `"guestbook": false` → removes `/guestbook` from nav

If you want to add a completely new page, add it to the `BASE_NAV` object in [`src/components/header.tsx`](./src/components/header.tsx).

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

Revalidates every 10 minutes (`export const revalidate = 600` in `src/app/activity/page.tsx`).

To disable: set `"features": { "activity": false }` in `site.json`.

---

## 14. Analytics

Set your Google Analytics 4 Measurement ID in `site.json`:

```json
"analytics": {
  "googleId": "G-XXXXXXXXXX"
}
```

Remove the `analytics` key entirely (or set `googleId` to an empty string) to disable tracking. No `<Script>` tags will be rendered.

---

## 15. Quick checklist for forkers

After forking, here's all you need to update:

- [ ] `src/data/json/site.json` — name, URLs, handles, bio, phrases, analytics
- [ ] `src/data/json/projects.json` — your projects
- [ ] `src/data/json/experience.json` — your work history
- [ ] `src/data/json/skills.json` — your skills
- [ ] `src/data/json/tools.json` — your tools
- [ ] `src/data/json/socials.json` — your social links
- [ ] `src/data/json/certifications.json` — your certs (or clear the array)
- [ ] `public/assets/` — replace avatar, social banner, project thumbnails
- [ ] `public/favicon.png` — your favicon
- [ ] `public/resume.pdf` — your resume
- [ ] `.env.local` — API keys for guestbook / activity (see `.env.example`)
- [ ] `src/content/post/` — replace or delete sample blog posts
