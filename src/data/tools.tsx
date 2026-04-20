import React from "react";
import { DiVisualstudio, DiCode } from "react-icons/di";
import { SiReplit } from "react-icons/si";

export interface Tool {
  name: string;
  icon: React.ReactElement;
}

export const TOOLS: Tool[] = [
  {
    name: "VS Code",
    icon: <DiVisualstudio className="text-indigo-600 dark:text-indigo-400" />,
  },
  {
    name: "Replit",
    icon: <SiReplit className="text-indigo-600 dark:text-indigo-400" />,
  },
  {
    name: "Cursor",
    icon: <DiCode className="text-indigo-600 dark:text-indigo-400" />,
  },
];
