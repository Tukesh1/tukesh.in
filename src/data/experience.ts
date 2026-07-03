import experienceData from "./json/experience.json";

export interface Experience {
  company: string;
  role: string;
  duration: string;
  location: string;
  current?: boolean;
  /** Markdown-flavoured strings. Supports **bold** and [link](url). */
  details: string[];
  skills: string[];
}

export const EXPERIENCES: Experience[] = experienceData as Experience[];
