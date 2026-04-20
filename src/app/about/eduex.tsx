"use client";
import React, { useState } from "react";
import { Briefcase, ChevronDown } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { cn } from "@/lib/utils";

const experiences = [
  {
    company: "Accenture",
    role: "Associate Software Developer",
    duration: "2026 — Present",
    location: "Gurgaon, India",
    current: true,
    details: [
      <>Developed and maintained web applications using <strong>React</strong> and <strong>Node.js</strong>.</>,
      <>Collaborated with cross-functional teams to deliver high-quality products.</>,
      <>Implemented responsive UI with <strong>Bootstrap</strong>.</>,
      <>Worked in an <strong>agile</strong> environment and participated in code reviews.</>,
    ],
    skills: ["React", "Node.js", "Bootstrap", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS"],
  },
  {
    company: "AfterQuery Experts",
    role: "Software Engineering — Bash/Linux",
    duration: "2025 — 2026",
    location: "Freelance, Remote",
    current: false,
    details: [
      <>Contributed to <strong><a href="https://www.tbench.ai/" target="_blank" rel="noopener noreferrer">Terminal Bench</a></strong> benchmarking by creating relevant tasks and solutions.</>,
      <>Designed multi-step command-line development exercises (debugging, refactoring, data processing, build automation).</>,
      <>Wrote clear, detailed documentation describing objectives and requirements.</>,
      <>Developed deterministic test suites and reference solutions.</>,
      <>Built reproducible, isolated test environments with <strong>bash scripts</strong>.</>,
    ],
    skills: ["Python", "Docker", "Golang", "QA", "Bash", "Linux"],
  },
  {
    company: "Alignerr",
    role: "AI Coding Trainer",
    duration: "2024 — 2025",
    location: "Freelance, Remote",
    details: [
      <>Trained AI to code in <strong>Python</strong>, <strong>JavaScript</strong>, and <strong>C++</strong>.</>,
      <>Debugged and optimized code for better performance.</>,
      <>Documented code and provided feedback to the team.</>,
      <>Containerized project environments using <strong>Docker</strong>, creating <strong>build.sh</strong> / <strong>run.sh</strong> scripts to automate builds, tests and deployments.</>,
      <>Developed reproducible test environments in <strong>Docker</strong>, ensuring consistent results across local and <strong>CI/CD</strong> pipelines.</>,
    ],
    skills: ["Python", "Docker", "Golang", "Debugging"],
  },
  {
    company: "WebSoft Solution",
    role: "Web Developer Intern",
    duration: "2023 — 2024",
    location: "Remote",
    details: [
      <>Developed and maintained web applications using <strong>React</strong> and <strong>Node.js</strong>.</>,
      <>Collaborated with cross-functional teams to deliver high-quality products.</>,
      <>Implemented responsive UI with <strong>Tailwind CSS</strong>.</>,
      <>Worked in an <strong>agile</strong> environment and participated in code reviews.</>,
    ],
    skills: ["React", "Node.js", "Tailwind CSS", "Next.js"],
  },
];

export function WorkExperience() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-dashed divide-gray-200 dark:divide-gray-800">
      {experiences.map((exp, idx) => {
        const isOpen = open === idx;
        return (
          <div key={exp.company} className="relative">
            {/* header row */}
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : idx)}
              aria-expanded={isOpen}
              aria-controls={`exp-details-${idx}`}
              className="w-full text-left px-4 py-5 grid grid-cols-[auto_1fr_auto] items-start gap-4 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/40"
            >
              <div
                className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-neutral-700 shadow-sm dark:border-gray-800 dark:bg-dark-bg dark:text-neutral-200"
                aria-hidden="true"
              >
                <Briefcase className="size-4" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-base text-gray-900 dark:text-white">
                    {exp.company}
                  </span>
                  {exp.current && (
                    <span className="inline-flex items-center gap-1 rounded border border-teal-600/30 px-1.5 py-0.5 font-mono text-[10px] text-teal-600 dark:text-teal-400">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-75" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-teal-500" />
                      </span>
                      now
                    </span>
                  )}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-300">{exp.role}</div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
                  <span className="font-mono">{exp.duration}</span>
                  <span className="inline-flex items-center gap-1">
                    <FaMapMarkerAlt className="size-3" /> {exp.location}
                  </span>
                </div>
              </div>

              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-neutral-400 transition-transform mt-1",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            {/* details */}
            <div
              id={`exp-details-${idx}`}
              role="region"
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-5 pl-[3.75rem]">
                  <ul className="list-disc space-y-1.5 pl-4 text-[13px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {exp.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {exp.skills.map((skill) => (
                      <li
                        key={skill}
                        className="inline-flex items-center rounded border border-gray-200 dark:border-gray-800 px-1.5 py-0.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
