import React from "react";
import type { Metadata } from "next";
import {
  Briefcase,
  Wrench,
  Award,
  Layers,
  Github as GithubIcon,
} from "lucide-react";

import { ToolStack } from "@/components/about/toolstack";
import { Github } from "@/components/about/github";
import { Skills } from "@/components/about/skills";
import { Certifications } from "@/components/about/certifications";
import { WorkExperience } from "@/components/about/experience";
import { Panel, PanelContent, PanelHeader } from "@/components/panel";
import { siteMetadata } from "@/data/siteMetadata";

export const metadata: Metadata = {
  title: siteMetadata.pages.about.title,
  description: siteMetadata.pages.about.description,
  openGraph: {
    title: siteMetadata.pages.about.title,
    description: siteMetadata.pages.about.description,
    url: `${siteMetadata.siteUrl}/about`,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.pages.about.title,
    description: siteMetadata.pages.about.description,
    images: [siteMetadata.socialBanner],
    creator: "@sarifInsaan",
  },
  alternates: {
    canonical: `${siteMetadata.siteUrl}/about`,
  },
};

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  bodyClassName?: string;
}

function Section({ icon, title, children, bodyClassName }: SectionProps) {
  const id = title.toLowerCase();
  return (
    <section id={id} className="mt-12 first:mt-0 max-w-4xl mx-auto scroll-mt-24">
      <Panel>
        <PanelHeader>
          <div className="flex items-center gap-2 hover:text-teal-600 hover:dark:text-teal-400 transition-colors">
            <span className="text-sm [&>svg]:size-4">{icon}</span>
            <span className="font-bold uppercase text-xs tracking-wider relative -bottom-px">
              {title}
            </span>
          </div>
        </PanelHeader>
        <PanelContent className={bodyClassName}>{children}</PanelContent>
      </Panel>
    </section>
  );
}

export default function About() {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="sr-only">About {siteMetadata.author} - Skills, Experience, and Certifications</h1>
        <Section icon={<Briefcase />} title="Experience" bodyClassName="p-0">
          <WorkExperience />
        </Section>

        <Section icon={<Wrench />} title="Skills">
          <Skills />
        </Section>

        <Section icon={<Award />} title="Certifications">
          <div className="mt-4 sm:mt-7 flex flex-col gap-3 sm:gap-5">
            <Certifications />
          </div>
        </Section>

        <Section icon={<Layers />} title="Stack">
          <ToolStack />
        </Section>

        <Section icon={<GithubIcon />} title="GitHub">
          <Github />
        </Section>
      </div>
    </section>
  );
}
