import React from "react";
import skillsData from "./json/skills.json";
import { resolveIcon } from "./icon-map";

export interface Skill {
  title: string;
  icon: React.ReactElement;
  subskills: string;
}

export const SKILLS: Skill[] = skillsData.map((s) => ({
  title: s.title,
  icon: resolveIcon(s.icon, s.iconColor),
  subskills: s.subskills,
}));
