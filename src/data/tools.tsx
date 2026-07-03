import React from "react";
import toolsData from "./json/tools.json";
import { resolveIcon } from "./icon-map";

export interface Tool {
  name: string;
  icon: React.ReactElement;
}

export const TOOLS: Tool[] = toolsData.map((t) => ({
  name: t.name,
  icon: resolveIcon(t.icon, t.iconColor),
}));
