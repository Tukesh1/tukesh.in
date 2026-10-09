import { avatarData, type AnimationName } from "./strobi.avatar"

export const STROBI_ANIMATIONS = Object.keys(
  avatarData.animations
) as AnimationName[]

export const STROBI_CTA = "data-strobi-cta"
export const STROBI_CTA_SELECTOR = `[${STROBI_CTA}]`
export const STROBI_EVENT = "strobi:react"

export type ReactionName = AnimationName

export type Hint = {
  kicker: string
  text: string
  mood: AnimationName
}

const ALLOWED = new Set<string>(STROBI_ANIMATIONS)

export function isAnimationName(value: string): value is AnimationName {
  return ALLOWED.has(value)
}

export function reactStrobi(animation: AnimationName) {
  if (typeof window === "undefined") return
  if (!ALLOWED.has(animation)) return
  window.dispatchEvent(new CustomEvent(STROBI_EVENT, { detail: animation }))
}

export function hasFinePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

export const REACTION_HINT: Record<string, Hint> = {
  waking: {
    kicker: "I'm up",
    text: "Hover something. I'll walk over and tell you what it actually is — not the headline.",
    mood: "waking",
  },
  idle: {
    kicker: "your move",
    text: "Shipping now is git-brief and nimo. Or just sign the guestbook if you're passing through.",
    mood: "idle",
  },
  curious: {
    kicker: "this?",
    text: "Skip the PDF. Open a project if you want to know how I work.",
    mood: "curious",
  },
  excited: {
    kicker: "yes this",
    text: "Open it. This is the interesting path.",
    mood: "excited",
  },
  celebrate: {
    kicker: "I saw that",
    text: "It's on the wall. Scroll — people leave better notes than you think.",
    mood: "celebrate",
  },
  confused: {
    kicker: "didn't land",
    text: "GitHub sign-in first, keep it short, try again. I can't post it for you.",
    mood: "confused",
  },
  drowsy: {
    kicker: "still here",
    text: "No rush. Guestbook is the low-effort way to leave a trace.",
    mood: "drowsy",
  },
  sleeping: {
    kicker: "zzz",
    text: "Move. I'll catch up.",
    mood: "sleeping",
  },
  laughing: {
    kicker: "okay okay",
    text: "You booped me. Now look at git-brief before you bounce.",
    mood: "laughing",
  },
}

export const CTA_HINT: Record<string, Hint> = {
  resume: {
    kicker: "the PDF",
    text: "Hiring loops still want this. If you're just looking, git-brief says more about how I work.",
    mood: "bored",
  },
  email: {
    kicker: "just write me",
    text: "Don't pitch on LinkedIn. A short 'I want to build X' here actually gets a reply.",
    mood: "listening",
  },
  "git-brief": {
    kicker: "I built this for me",
    text: "I was typing standup every morning from work I'd already done. git-brief writes it from git.",
    mood: "proud",
  },
  "nimo-code-review-agent": {
    kicker: "code stays on the runner",
    text: "nimo reviews the PR inside GitHub Actions. Nothing leaves the job. That's the whole point.",
    mood: "working",
  },
  "codexp-ai": {
    kicker: "what I'm chewing on",
    text: "I got tired of onboarding by reading the whole repo. It explains it, diagrams it, answers it.",
    mood: "excited",
  },
  "school-attendance-management-system": {
    kicker: "Go + React, for real schools",
    text: "Attendance, check-ins, class org. I built the API in Go and the UI in TypeScript.",
    mood: "working",
  },
  tracode: {
    kicker: "one dashboard, three sites",
    text: "LeetCode, CodeChef, Codeforces in one place. I got tired of bouncing between tabs.",
    mood: "curious",
  },
  kreelab: {
    kicker: "freelance, shipped",
    text: "Marketing site for Kreelab. CMS, admin, the client-facing stuff. Not a tutorial repo.",
    mood: "proud",
  },
  "git-repo-analyzer": {
    kicker: "health of a repo, in English",
    text: "GitHub API plus OpenAI. Contributor patterns, not another star count.",
    mood: "searching",
  },
  "spam-mail-prediction": {
    kicker: "old-school ML",
    text: "Sklearn, NLP, ensemble. I wanted to see if classic spam detection still holds up.",
    mood: "thinking",
  },
  "cli-atm-mini-project": {
    kicker: "C++, file-backed",
    text: "A CLI ATM. Auth, deposits, a transaction log on disk. Early OOP muscle memory.",
    mood: "idle",
  },
  "training-schedule-management-system": {
    kicker: "schedules in C++",
    text: "Trainer allocation and reports. DSA homework that actually had to persist.",
    mood: "working",
  },
  project: {
    kicker: "I built this",
    text: "Expand it if you want the how, not the headline.",
    mood: "curious",
  },
  projects: {
    kicker: "don't read all of them",
    text: "git-brief if you hate standup. nimo if your PRs need a second pair of eyes. That's the shortlist.",
    mood: "working",
  },
  guestbook: {
    kicker: "leave something",
    text: "A hello, a rec, a bug you hit. Silent tabs don't tell me you were here.",
    mood: "happy",
  },
  signin: {
    kicker: "GitHub only",
    text: "One note per person. I want real names on the wall, not spam.",
    mood: "listening",
  },
  sign: {
    kicker: "keep it human",
    text: "A memory travels further than a pitch. I actually read these.",
    mood: "playful",
  },
  "nav-home": {
    kicker: "back to shipping",
    text: "Home is git-brief and nimo. Everything else can wait.",
    mood: "idle",
  },
  "nav-about": {
    kicker: "the long version",
    text: "Jobs, then skills, then paper. Skim experience if you're hiring, then bounce to projects.",
    mood: "thinking",
  },
  "nav-projects": {
    kicker: "skip my bio",
    text: "This is the proof. Expand git-brief or nimo if you only have a minute.",
    mood: "proud",
  },
  "nav-post": {
    kicker: "I don't write much",
    text: "When I do, it's whatever I got stuck on. Newest usually maps to what I'm building.",
    mood: "thinking",
  },
  "nav-activity": {
    kicker: "unfiltered week",
    text: "Commits, hours, quiet days. I don't tidy this. Click a row if you want the trail.",
    mood: "searching",
  },
  experience: {
    kicker: "jobs I sat in",
    text: "The timeline hiring people ask for. Expand a role if you care how the year went — projects is still louder.",
    mood: "listening",
  },
  skills: {
    kicker: "the daily kit",
    text: "React, TypeScript, Node. I listed these because filters ask. The repos are the actual sentence.",
    mood: "working",
  },
  certifications: {
    kicker: "paper for the forms",
    text: "Useful if a portal asked. I wouldn't start here. The GitHub calendar below is more honest.",
    mood: "bored",
  },
  stack: {
    kicker: "what stays open",
    text: "Not a laundry list. This is what I actually ship with.",
    mood: "idle",
  },
  github: {
    kicker: "I ship in bursts",
    text: "Quiet weeks happen. Don't read the green squares — open a project instead.",
    mood: "searching",
  },
  post: {
    kicker: "a longer thought",
    text: "I don't post often. If you like the how, newest is usually what I'm chewing on.",
    mood: "thinking",
  },
  activity: {
    kicker: "today vs the week",
    text: "The numbers aren't a pitch. Open a commit if you want the trail.",
    mood: "searching",
  },
  "social-github": {
    kicker: "this is the real one",
    text: "github.com/tukesh1 — code, issues, the messy bits. Stars optional.",
    mood: "proud",
  },
  "social-x": {
    kicker: "fewer filters",
    text: "@sarifInsaan. Shorter, less polite. Don't pitch here either.",
    mood: "playful",
  },
  "social-linkedin": {
    kicker: "the polite version",
    text: "Fine if you're hiring. If you want to build something, email is faster.",
    mood: "listening",
  },
  "social-instagram": {
    kicker: "off the clock",
    text: "tukesh.__ — not READMEs. Don't look for architecture diagrams here.",
    mood: "happy",
  },
}

export const PAGE_HINT: Record<string, Hint> = {
  "/": {
    kicker: "two things are shipping",
    text: "git-brief writes standup from git. nimo reviews PRs in Actions. Hover either and I'll walk over.",
    mood: "idle",
  },
  "/about": {
    kicker: "skim, then leave",
    text: "Experience if you're hiring. Skills is the filter list. Certifications is paper. I'd still end up on projects.",
    mood: "listening",
  },
  "/projects": {
    kicker: "don't read all of them",
    text: "Expand git-brief or nimo. That's the shortlist I give people who only have a minute.",
    mood: "working",
  },
  "/post": {
    kicker: "rare on purpose",
    text: "I write when I'm stuck. Newest usually maps to whatever I'm building.",
    mood: "thinking",
  },
  "/activity": {
    kicker: "I don't tidy this",
    text: "Commits, hours, quiet days. Click a row if you want the trail, not a summary.",
    mood: "searching",
  },
  "/guestbook": {
    kicker: "say something",
    text: "A hello is enough. I read these. Skip the pitch.",
    mood: "happy",
  },
}

export function hintForCta(cta: string | null): Hint {
  if (cta && CTA_HINT[cta]) return CTA_HINT[cta]
  if (cta && !cta.startsWith("nav-") && !cta.startsWith("social-")) {
    return {
      kicker: "I built this",
      text: `${cta.replace(/-/g, " ")}. Expand it if you want the how, not the headline.`,
      mood: "curious",
    }
  }
  return CTA_HINT.project
}

export function hintForPath(pathname: string): Hint {
  if (pathname.startsWith("/post/")) return PAGE_HINT["/post"]
  if (pathname.startsWith("/guestbook")) return PAGE_HINT["/guestbook"]
  if (pathname.startsWith("/projects")) return PAGE_HINT["/projects"]
  if (pathname.startsWith("/about")) return PAGE_HINT["/about"]
  if (pathname.startsWith("/activity")) return PAGE_HINT["/activity"]
  return PAGE_HINT["/"]
}

export function firstContentCta(): HTMLElement | null {
  const nodes = document.querySelectorAll<HTMLElement>(STROBI_CTA_SELECTOR)
  for (const node of nodes) {
    const key = node.getAttribute(STROBI_CTA) ?? ""
    if (key.startsWith("nav-") || key.startsWith("social-")) continue
    const rect = node.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) return node
  }
  return null
}
