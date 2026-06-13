export type ProjectCategory = "web" | "ai-ml" | "cli" | "agents";

export interface Project {
  title: string;
  category: ProjectCategory;
  tags: string[];
  description: string | string[];
  thumbnail?: string;
  repo?: string;
  live?: string;
  period: {
    start: string;
    end?: string;
  };
  /** Featured projects surface on the homepage. */
  featured?: boolean;
  /** Short one-liner for homepage cards. Falls back to first description line. */
  tagline?: string;
}

export const WEB_APPS: Project[] = [
  {
    title: "nimo-code-review-agent",
    category: "agents",
    tags: ["TypeScript", "GitHub Actions", "AI", "Docker", "LLMs"],
    description: [
      "Privacy-first AI code reviewer running directly inside GitHub Actions.",
      "Provides rich inline comments, security vulnerability checks, and complete PR summaries.",
      "Fully customizable, allowing teams to inject their own specific coding standards and rules.",
    ],
    tagline:
      "Automated, tailored, and context-aware AI code reviews directly in your GitHub workflow.",
    thumbnail: "/assets/project/nimo.png",
    repo: "https://github.com/Tukesh1/nimo-code-review-agent",
    featured: true,
    period: { start: "06. 2026" },
  },
  {
    title: "codexp-ai",
    category: "web",
    tags: ["Next.js", "TypeScript", "AI", "LLM"],
    description: [
      "AI-powered platform that explains, documents, and visualizes source code.",
      "Helps developers understand and onboard to unfamiliar codebases faster.",
      "Generates instant docs, diagrams, and repo Q&A.",
    ],
    tagline:
      "Explain, document, and visualize any codebase with instant docs, diagrams, and Q&A.",
    repo: "https://github.com/Tukesh1/codexp-ai",
    featured: true,
    period: { start: "10. 2025" },
  },
  {
    title: "School Attendance Management System",
    category: "web",
    tags: ["React", "Go", "Tailwind CSS", "TypeScript", "SQLite"],
    description: [
      "Full-stack school attendance management system built with Go and React/TypeScript.",
      "Real-time attendance tracking and student check-ins.",
      "Student management with class organization and role-based access.",
      "Comprehensive reporting and exportable attendance records.",
    ],
    thumbnail: "/assets/project/student-management-interface.png",
    repo: "https://github.com/Tukesh1/student-api",
    period: { start: "08. 2025", end: "08. 2025" },
  },
  {
    title: "Tracode",
    category: "web",
    tags: [
      "React",
      "Vite",
      "Tailwind CSS",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
    ],
    description: [
      "Unified dashboard to track coding progress across LeetCode, CodeChef, and Codeforces.",
      "Real-time progress tracking with visual analytics and charts.",
      "Friendly competition features to compare progress with others.",
      "Aggregates data from multiple coding platforms into a single clean interface.",
      "Built with React, Vite, Tailwind CSS and a Node.js/Express backend.",
    ],
    thumbnail: "/assets/project/tracode.png",
    repo: "https://github.com/tukesh1/tracode",
    featured: true,
    period: { start: "11. 2024" },
  },
  {
    title: "Kreelab",
    category: "web",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    description: [
      "Professional marketing website built for Kreelab as a freelance project.",
      "Dynamic content management and an intuitive admin panel.",
      "Smooth animations and responsive UI to represent the client's brand.",
      "Client-focused development delivering measurable business results.",
    ],
    thumbnail: "/assets/project/kreelab.png",
    repo: "https://github.com/Tukesh1/kreelab",
    period: { start: "05. 2024", end: "06. 2024" },
  },
];

export const AI_ML_PROJECTS: Project[] = [
  {
    title: "Git-Repo-Analyzer",
    category: "ai-ml",
    tags: ["Python", "Flask", "GitHub API", "OpenAI API"],
    description: [
      "Analyzes GitHub repositories to surface insights on code health and project activity.",
      "Detects contributor patterns and trends across commits and pull requests.",
      "Uses GitHub API and OpenAI to generate natural-language summaries of metrics.",
      "Helps team leads make data-driven decisions about their codebases.",
    ],
    thumbnail: "/assets/project/git-repo.png",
    repo: "https://github.com/Tukesh1/Git-Repo-Analyzer",
    period: { start: "01. 2025", end: "01. 2025" },
  },
  {
    title: "Spam Mail Prediction",
    category: "ai-ml",
    tags: ["Machine Learning", "Python", "Scikit-learn", "NLP"],
    description: [
      "Advanced spam detection system built using machine learning and NLP techniques.",
      "Ensemble approach combining multiple algorithms for robust classification.",
      "Extensive text preprocessing and sender reputation analysis.",
      "Real-time testing interface that explains why emails are classified.",
    ],
    thumbnail: "/assets/project/spam-mail.png",
    repo: "https://github.com/Tukesh1/spam-mail-predection-using-ML",
    period: { start: "11. 2024", end: "11. 2024" },
  },
];

export const CLI_PROJECTS: Project[] = [
  {
    title: "CLI-ATM-Mini-Project",
    category: "cli",
    tags: ["C++", "OOP", "File Handling"],
    description: [
      "Command-line ATM system implemented in C++ demonstrating OOP principles.",
      "Features user authentication, balance inquiry, deposits, and withdrawals.",
      "Persists transaction history using file handling for auditability.",
    ],
    thumbnail: "https://opengraph.githubassets.com/1/Tukesh1/CLI-ATM-Mini-Project-",
    repo: "https://github.com/Tukesh1/CLI-ATM-Mini-Project-",
    period: { start: "02. 2023", end: "02. 2023" },
  },
  {
    title: "Training Schedule Management System",
    category: "cli",
    tags: ["C++", "File Handling", "DSA"],
    description: [
      "System to manage training schedules with trainer allocation and reporting.",
      "Implements optimized algorithms to generate efficient schedules and reports.",
      "Includes features for trainer assignment and performance tracking.",
    ],
    thumbnail:
      "https://opengraph.githubassets.com/1/tukesh1/Training-Schedule-Management-System",
    repo: "https://github.com/Tukesh1/Training-Schedule-Management-System",
    period: { start: "06. 2024", end: "07. 2024" },
  },
];

export const ALL_PROJECTS: Project[] = [
  ...WEB_APPS,
  ...AI_ML_PROJECTS,
  ...CLI_PROJECTS,
];

export const FEATURED_PROJECTS = ALL_PROJECTS.filter((p) => p.featured);

/** Normalize a Project into the shape consumed by <ProjectItem />. */
export function toProjectItem(project: Project) {
  return {
    id: project.title.toLowerCase().replace(/\s+/g, "-"),
    title: project.title,
    period: project.period,
    link: project.repo,
    skills: project.tags,
    description: project.description,
    thumbnail: project.thumbnail,
    isExpanded: false,
  };
}
