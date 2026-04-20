# Contributing

Thanks for your interest in improving this portfolio! Contributions of all sizes are welcome — bug reports, typo fixes, accessibility improvements, new features, docs clarifications, or performance wins.

## Ground rules

- **Be kind.** Treat everyone with respect. Low-quality drive-by PRs (e.g. inflating dependencies, cosmetic-only diffs) will be closed.
- **Keep it simple.** This project is deliberately small. New dependencies need a clear justification.
- **Match the style.** Follow the existing patterns, naming, and file layout. When in doubt, look at how similar things are already done.

## Getting started

```bash
# 1. Fork and clone
git clone https://github.com/<your-username>/tukesh.in.git
cd tukesh.in

# 2. Install
npm install

# 3. Create a branch
git checkout -b fix/clear-description

# 4. Run the dev server
npm run dev
```

Before opening a PR, please run:

```bash
npm run lint      # must pass
npm run build     # must succeed
```

## What kind of PRs are welcome?

| Type                  | Welcome?          |
| --------------------- | ----------------- |
| Bug fixes             | Yes, please       |
| Accessibility fixes   | Yes, please       |
| Performance wins      | Yes, please       |
| Documentation         | Yes, please       |
| New small features    | Open an issue first |
| Large refactors       | Open an issue first |
| Color / theme changes | Generally no — the palette is intentional |
| New dependencies      | Open an issue first |

## Commit & PR style

- **Commit messages:** imperative mood, lowercase, present tense. Examples: `fix broken OG image path`, `extract projects data into data file`, `add 404 page`.
- **One concern per PR.** Don't mix a bug fix with a refactor.
- **Describe the why.** In the PR body, explain the motivation, not just the changes. Screenshots or before/after GIFs are great for UI work.

## Reporting a bug

Open an issue with:

1. What you expected to happen.
2. What actually happened.
3. Steps to reproduce (minimal).
4. Environment: OS, browser, Node version.

## Reporting a security issue

Please don't open a public issue. Email **tukeshkrraju1011@gmail.com** with the details.

---

Thanks again! ✨
