import React from "react";
import {
  DiReact,
  DiNodejs,
  DiMongodb,
  DiPython,
  DiGit,
  DiCss3,
  DiHtml5,
} from "react-icons/di";
import { SiNextdotjs } from "react-icons/si";

export interface Skill {
  title: string;
  icon: React.ReactElement;
  subskills: string;
}

export const SKILLS: Skill[] = [
  {
    title: "Web Design & Development",
    icon: <DiHtml5 className="text-orange-500" />,
    subskills: "HTML, CSS, JavaScript, TypeScript",
  },
  {
    title: "Frontend JavaScript Frameworks",
    icon: <DiReact className="text-cyan-400" />,
    subskills: "Angular, React, Vue.js",
  },
  {
    title: "Backend JavaScript Frameworks",
    icon: <DiNodejs className="text-green-600" />,
    subskills: "Node.js, Express.js, NestJS",
  },
  {
    title: "Scripting Languages",
    icon: <DiPython className="text-yellow-400" />,
    subskills: "Python, Rust",
  },
  {
    title: "Database Management",
    icon: <DiMongodb className="text-green-700" />,
    subskills: "Postgres, TypeORM, MongoDB, Mongoose",
  },
  {
    title: "UI/UX Design",
    icon: <DiCss3 className="text-blue-400" />,
    subskills: "Adobe XD, Figma, Sketch",
  },
  {
    title: "Data Processing & Machine Learning",
    icon: <SiNextdotjs className="text-black dark:text-white" />,
    subskills: "LangChain, scikit-learn, TensorFlow, Keras",
  },
  {
    title: "Version Control",
    icon: <DiGit className="text-orange-600" />,
    subskills: "Git, GitHub",
  },
];
