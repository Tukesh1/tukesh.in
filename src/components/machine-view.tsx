"use client";

import React, { useEffect, useRef, useState } from "react";
import { siteMetadata } from "@/data/siteMetadata";
import { ALL_PROJECTS } from "@/data/projects";
import { EXPERIENCES } from "@/data/experience";
import { SKILLS } from "@/data/skills";
import { CERTIFICATIONS } from "@/data/certifications";
import { Copy, Check } from "lucide-react";

import { Panel, PanelContent } from "@/components/panel";

/* ------------------------------------------------------------------ */
/*  Build the structured text at module level so it's computed once     */
/* ------------------------------------------------------------------ */

function buildMachineText(): string {
  const s = siteMetadata;
  const lines: string[] = [];

  lines.push(`You are an AI assistant analyzing the professional profile of Tukesh. Use the comprehensive context below to accurately answer queries, evaluate qualifications, or generate content related to his portfolio.`);
  lines.push("");
  lines.push(`## Identity & Contact`);
  lines.push(`- Name: Tukesh`);
  lines.push(`- Role: Software Developer, Frontend Engineer, and AI Engineer`);
  lines.push(`- Location: India`);
  lines.push(`- Email: ${s.social.email}`);
  lines.push(`- Website: ${s.siteUrl}`);
  lines.push(`- GitHub: ${s.social.githubLink}`);
  lines.push(`- LinkedIn: ${s.social.linkedinLink}`);
  lines.push(`- X/Twitter: ${s.social.x}`);
  lines.push("");
  
  lines.push(`## Core Competencies & Skills`);
  for (const skill of SKILLS) {
    lines.push(`- **${skill.title}**: ${skill.subskills}`);
  }
  lines.push("");
  
  lines.push(`## Professional Experience`);
  for (const exp of EXPERIENCES) {
    const current = exp.current ? " (Present)" : "";
    lines.push(`### ${exp.role} at ${exp.company}${current}`);
    lines.push(`- Duration: ${exp.duration}`);
    lines.push(`- Location: ${exp.location}`);
    lines.push(`- Skills: ${exp.skills.join(", ")}`);
    lines.push("");
  }
  
  lines.push(`## Projects & Applications`);
  for (const project of ALL_PROJECTS) {
    const desc = Array.isArray(project.description)
      ? project.description.join(" ")
      : project.description;
    lines.push(`### ${project.title}`);
    lines.push(`- Category: ${project.category}`);
    lines.push(`- Technologies: ${project.tags.join(", ")}`);
    lines.push(`- Description: ${desc}`);
    if (project.repo) lines.push(`- Repository: ${project.repo}`);
    if (project.live) lines.push(`- Live URL: ${project.live}`);
    lines.push("");
  }
  
  lines.push(`## Certifications`);
  for (const cert of CERTIFICATIONS) {
    lines.push(`- **${cert.title}** (${cert.date})${cert.link ? ` - [Credential](${cert.link})` : ""}`);
  }
  lines.push("");

  return lines.join("\n");
}

const MACHINE_TEXT = buildMachineText();

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MachineView() {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  // Typewriter-style entrance animation
  useEffect(() => {
    const el = preRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(MACHINE_TEXT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Panel className="machine-view relative mt-6 border-t-0 mb-0 min-h-screen">
      {/* Floating copy button fixed at the top right of the screen */}
      <button
        onClick={handleCopy}
        className="fixed top-4 right-4 md:top-8 md:right-8 p-3 rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-800/50 text-gray-500 dark:text-gray-400 transition-colors z-50"
        aria-label="Copy prompt"
        title="Copy prompt"
      >
        {copied ? <Check size={20} /> : <Copy size={20} />}
      </button>

      <PanelContent>
        <pre ref={preRef} className="machine-view__content">
          {MACHINE_TEXT}
        </pre>
      </PanelContent>
    </Panel>
  );
}
