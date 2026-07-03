import React from "react";
import socialsData from "./json/socials.json";
import { resolveIconComponent } from "./icon-map";

export interface Social {
  label: string;
  href: string;
  icon: React.ElementType;
}

export const SOCIALS: Social[] = socialsData.map((s) => ({
  label: s.label,
  href: s.href,
  icon: resolveIconComponent(s.icon),
}));
