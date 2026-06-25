import { siteMetadata } from "@/data/siteMetadata";
import { ALL_PROJECTS } from "@/data/projects";
import { EXPERIENCES } from "@/data/experience";
import { SKILLS } from "@/data/skills";
import { CERTIFICATIONS } from "@/data/certifications";
import { NextResponse } from "next/server";

export async function GET() {
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

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
