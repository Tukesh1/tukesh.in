"use client"
import React, { useState } from "react";
import { Briefcase, GraduationCap } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";

const experiences = [
   {
    company: "AfterQuery Experts",
    role: "Software Engineering Bash/Linux ",
    duration: "2025 - Present",
    location: "Freelance, Remote",
    details: [
      <>Contributed in <strong> <a href="https://www.tbench.ai/" target="_blank" rel="noopener noreferrer">Terminal Bench</a></strong> benchmarking by creating relevant tasks and solutions</>,
      <>Designed multi-step command-line development exercises (e.g., debugging, refactoring, data processing, build automation).</>,
      <>Wrote clear, detailed documentation to describe objectives and requirements.</>,
      <>Developed deterministic test suites and solutions</>,
      <>Developed reproducible and isolated tests environments in <strong>using bash scripts</strong></>,
    ],
    skills: ["Python", "Docker", "Golang", "QA", "Bash", "Linux"],
  },
  {
    company: "Alignerr",
    role: "AI Coding Trainer (Freelance) ",
    duration: "2024 - 2025",
    location: "Freelance, Remote",
    details: [
      <>Trained AI to code in <strong>Python</strong>, <strong>JavaScript</strong>, and <strong>C++</strong></>,
      <>Debugged and optimized code for better performance</>,
      <>Documented code and provided feedback to the team</>,
      <>Containerized project environments using <strong>Docker</strong>, creating <strong>build.sh</strong> and <strong>run.sh</strong> scripts to automate builds, tests, and deployments.</>,
      <>Developed reproducible and isolated test environments in <strong>Docker</strong>, ensuring consistent results across local and <strong>CI/CD</strong> pipelines.</>,
    ],
    skills: ["Python", "Docker", "Golang", "Debugging"],
  },
  {
    company: "WebSoft solution",
    role: "Web Developer Intern",
    duration: "2023 - 2024",
    location: "Remote",
    details: [
      <>Developed and maintained web applications using <strong>React</strong> and <strong>Node.js</strong></>,
      <>Collaborated with cross-functional teams to deliver high-quality products</>,
      <>Implemented responsive UI with <strong>Tailwind CSS</strong></>,
      <>Worked in an <strong>agile</strong> environment and participated in code reviews</>,
    ],
    skills: ["React", "Node.js", "Tailwind CSS", "Next.js"],
  },
];

const educations = [
  {
    school: "GL Bajaj Institute of Technology & Management",
    degree: "B.Tech, Computer Science and Engineering",
    result: "7.3 CGPA",
    duration: "2021 - 2025",
    details: [
      <>Graduated with <strong>7.17 CGPA</strong> in <strong>Computer Science and Engineering</strong></>,
      <>Completed projects in <strong>web development</strong> and <strong>machine learning</strong></>,
      <>Active member of the <strong>coding club</strong> and <strong>hackathons</strong></>,
    ],
    skills: ["Web Development", "Machine Learning", "C++", "DSA"],
  },
  {
    school: "Subhash Chandra Bose Universal School",
    degree: "Secondary, PCM",
    result: "69%",
    duration: "2018 - 2020",
    details: [
      <>Completed secondary education with <strong>69%</strong> in <strong>Physics</strong>, <strong>Chemistry</strong>, <strong>Mathematics</strong></>,
      <>Participated in <strong>Maths exhibitions</strong> and <strong>olympiads</strong></>,
    ],
    skills: ["Physics", "Chemistry", "Mathematics", "Olympiads"],
  },
];

export function WorkExperience() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div>
      <div className="relative pl-6">
        <div className="absolute left-0 top-0 h-full w-0.5 bg-neutral-700" style={{ minHeight: 80 }} />
        {experiences.map((exp, idx) => (
          <div
            key={exp.company}
            className="mb-8 flex items-start gap-4 transition-all duration-300 "
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="absolute -left-3 mt-0.6 flex size-6 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 shadow-sm" aria-hidden="true">
              <Briefcase className="size-4" />
            </div>
            <div>
              <div className="font-semibold text-base text-gray-900 dark:text-white">{exp.company}</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">{exp.role} <br />
                <span className="text-xs text-neutral-400 dark:text-neutral-400">({exp.duration})</span></div>
              <div className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-400 mb-1">
                <FaMapMarkerAlt /> {exp.location}
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${hovered === idx ? 'max-h-none opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
                style={{ minHeight: 0 }}
              >
                <div className="bg-white dark:bg-dark-bg border border-neutral-200 dark:border-neutral-700 rounded p-3 mt-1">
                  <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-700 dark:text-neutral-200">
                    {exp.details.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                  {exp.skills && (
                    <ul className="flex flex-wrap gap-1.5 pt-2">
                      {exp.skills.map((skill, i) => (
                        <li key={i} className="inline-flex items-center rounded-lg border bg-muted/50 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">{skill}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Educations() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div>
      <div className="relative pl-6">
        <div className="absolute left-0 top-0 h-full w-0.5 bg-neutral-700" style={{ minHeight: 80 }} />
        {educations.map((edu, idx) => (
          <div
            key={edu.school}
            className="mb-8 flex items-start gap-4 transition-all duration-300"
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="absolute -left-3 mt-0.6 flex size-6 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 shadow-sm" aria-hidden="true">
              <GraduationCap className="size-4" />
            </div>
            <div>
              <div className="font-semibold text-base text-gray-900 dark:text-white">{edu.school}</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">{edu.degree}</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">{edu.duration} </div>
              <div className="text-xs text-neutral-400 dark:text-neutral-400 mb-1">{edu.result}</div>
              <div
                className={`overflow-hidden transition-all duration-300 ${hovered === idx ? 'max-h-none opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
                style={{ minHeight: 0 }}
              >
                <div className="bg-white dark:bg-dark-bg border border-neutral-200 dark:border-neutral-700 rounded p-3 mt-1">
                  <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-700 dark:text-neutral-200">
                    {edu.details.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                  {edu.skills && (
                    <ul className="flex flex-wrap gap-1.5 pt-2">
                      {edu.skills.map((skill, i) => (
                        <li key={i} className="inline-flex items-center rounded-lg border bg-muted/50 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">{skill}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
