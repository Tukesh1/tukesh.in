/**
 * Icon Map — maps string keys (used in JSON data files) to React icon components.
 *
 * To add a new icon:
 *  1. Install the icon library (e.g. `npm install react-icons`)
 *  2. Import the icon component below
 *  3. Add a new entry to ICON_COMPONENT_MAP with any key you choose
 *  4. Use that key in the corresponding JSON file (skills.json, tools.json, socials.json)
 */

import React from "react";
import {
  DiReact,
  DiNodejs,
  DiMongodb,
  DiPython,
  DiGit,
  DiCss3,
  DiHtml5,
  DiVisualstudio,
  DiCode,
} from "react-icons/di";
import { SiNextdotjs, SiReplit } from "react-icons/si";
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from "@/components/icons";

/**
 * Maps icon key strings to React component constructors (React.ElementType).
 * Used by socials, where the component receives an icon as a constructor.
 */
export const ICON_COMPONENT_MAP: Record<string, React.ElementType> = {
  // Devicons
  DiReact,
  DiNodejs,
  DiMongodb,
  DiPython,
  DiGit,
  DiCss3,
  DiHtml5,
  DiVisualstudio,
  DiCode,
  // Simple Icons
  SiNextdotjs,
  SiReplit,
  // Custom portfolio icons
  GitHubIcon,
  XIcon,
  LinkedInIcon,
  InstagramIcon,
};

/**
 * Resolves an icon key to its React element (instantiated), with className applied.
 * Used by skills and tools where components receive a pre-rendered ReactElement.
 * Falls back to a neutral "?" span if the key is unknown.
 */
export function resolveIcon(
  key: string,
  className?: string
): React.ReactElement {
  const Component = ICON_COMPONENT_MAP[key];
  if (!Component) {
    console.warn(`[icon-map] Unknown icon key: "${key}"`);
    return <span aria-hidden="true">?</span>;
  }
  return <Component className={className} />;
}

/**
 * Resolves an icon key to its React component constructor (React.ElementType).
 * Used by socials, where <SocialLink icon={Icon} /> renders the component itself.
 * Falls back to a neutral fragment component if the key is unknown.
 */
export function resolveIconComponent(key: string): React.ElementType {
  const Component = ICON_COMPONENT_MAP[key];
  if (!Component) {
    console.warn(`[icon-map] Unknown icon key: "${key}"`);
    function UnknownIcon() { return <span aria-hidden="true">?</span>; }
    return UnknownIcon;
  }
  return Component;
}
