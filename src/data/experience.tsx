import React from "react";

export interface Experience {
  company: string;
  role: string;
  duration: string;
  location: string;
  current?: boolean;
  details: React.ReactNode[];
  skills: string[];
}

export const EXPERIENCES: Experience[] = [
  {
    company: "Accenture",
    role: "Associate Software Developer",
    duration: "2026 — Present",
    location: "Gurgaon, India",
    current: true,
    details: [
      <>
        Developed and maintained web applications using <strong>React</strong>{" "}
        and <strong>Node.js</strong>.
      </>,
      <>Collaborated with cross-functional teams to deliver high-quality products.</>,
      <>
        Implemented responsive UI with <strong>Bootstrap</strong>.
      </>,
      <>
        Worked in an <strong>agile</strong> environment and participated in code
        reviews.
      </>,
    ],
    skills: [
      "React",
      "Node.js",
      "Bootstrap",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
    ],
  },
  {
    company: "AfterQuery Experts",
    role: "Software Engineering — Bash/Linux",
    duration: "2025 — 2026",
    location: "Freelance, Remote",
    details: [
      <>
        Contributed to{" "}
        <strong>
          <a
            href="https://www.tbench.ai/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terminal Bench
          </a>
        </strong>{" "}
        benchmarking by creating relevant tasks and solutions.
      </>,
      <>
        Designed multi-step command-line development exercises (debugging,
        refactoring, data processing, build automation).
      </>,
      <>Wrote clear, detailed documentation describing objectives and requirements.</>,
      <>Developed deterministic test suites and reference solutions.</>,
      <>
        Built reproducible, isolated test environments with{" "}
        <strong>bash scripts</strong>.
      </>,
    ],
    skills: ["Python", "Docker", "Golang", "QA", "Bash", "Linux"],
  },
  {
    company: "Alignerr",
    role: "AI Coding Trainer",
    duration: "2024 — 2025",
    location: "Freelance, Remote",
    details: [
      <>
        Trained AI to code in <strong>Python</strong>, <strong>JavaScript</strong>,
        and <strong>C++</strong>.
      </>,
      <>Debugged and optimized code for better performance.</>,
      <>Documented code and provided feedback to the team.</>,
      <>
        Containerized project environments using <strong>Docker</strong>,
        creating <strong>build.sh</strong> / <strong>run.sh</strong> scripts to
        automate builds, tests and deployments.
      </>,
      <>
        Developed reproducible test environments in <strong>Docker</strong>,
        ensuring consistent results across local and <strong>CI/CD</strong>{" "}
        pipelines.
      </>,
    ],
    skills: ["Python", "Docker", "Golang", "Debugging"],
  },
  {
    company: "WebSoft Solution",
    role: "Web Developer Intern",
    duration: "2023 — 2024",
    location: "Remote",
    details: [
      <>
        Developed and maintained web applications using <strong>React</strong>{" "}
        and <strong>Node.js</strong>.
      </>,
      <>Collaborated with cross-functional teams to deliver high-quality products.</>,
      <>
        Implemented responsive UI with <strong>Tailwind CSS</strong>.
      </>,
      <>
        Worked in an <strong>agile</strong> environment and participated in code
        reviews.
      </>,
    ],
    skills: ["React", "Node.js", "Tailwind CSS", "Next.js"],
  },
];
