"use client";

import React from "react";
import { FolderKanban } from "lucide-react";
import { ALL_PROJECTS, toProjectItem } from "@/data/projects";
import { Panel, PanelHeader } from "./panel";
import { CollapsibleList } from "./collapsible-list";
import { ProjectItem } from "./project-item";

const items = ALL_PROJECTS.map(toProjectItem);

export function ProjectsSection() {
  return (
    <Panel id="projects" className="mt-6">
      <PanelHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <FolderKanban className="size-4" />
            <span className="font-bold uppercase text-xs tracking-wider">Projects</span>
          </div>
          <span className="font-mono text-xs text-gray-500 dark:text-gray-400 select-none">
            {items.length}
          </span>
        </div>
      </PanelHeader>

      <CollapsibleList
        items={items}
        max={6}
        keyExtractor={(item) => item.id}
        renderItem={(item) => <ProjectItem project={item} />}
      />
    </Panel>
  );
}
