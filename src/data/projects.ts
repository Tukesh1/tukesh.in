import projectsData from "./json/projects.json";

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

export const ALL_PROJECTS: Project[] = projectsData as Project[];

export const WEB_APPS = ALL_PROJECTS.filter((p) =>
  ["web", "agents"].includes(p.category)
);
export const AI_ML_PROJECTS = ALL_PROJECTS.filter(
  (p) => p.category === "ai-ml"
);
export const CLI_PROJECTS = ALL_PROJECTS.filter((p) => p.category === "cli");

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
