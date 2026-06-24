import React from "react";
import { Metadata } from "next";
import { siteMetadata } from "../../data/siteMetadata";
import { ProjectsSection } from "../../components/projects-section";
import { ALL_PROJECTS } from "../../data/projects";

export const metadata: Metadata = {
  title: siteMetadata.pages.projects.title,
  description: siteMetadata.pages.projects.description,
  openGraph: {
    title: siteMetadata.pages.projects.title,
    description: siteMetadata.pages.projects.description,
    url: `${siteMetadata.siteUrl}/projects`,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.pages.projects.title,
    description: siteMetadata.pages.projects.description,
    images: [siteMetadata.socialBanner],
  },
  alternates: {
    canonical: `${siteMetadata.siteUrl}/projects`,
  },
};

export default function Projects() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Projects by Tukesh Kumar",
    description: siteMetadata.pages.projects.description,
    numberOfItems: ALL_PROJECTS.length,
    itemListElement: ALL_PROJECTS.map((project, index) => {
      const url = project.repo ?? project.live ?? `${siteMetadata.siteUrl}/projects`;
      const description = project.tagline
        ?? (Array.isArray(project.description) ? project.description[0] : project.description);
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: project.title,
          description,
          url,
          keywords: project.tags.join(", "),
          author: {
            "@type": "Person",
            name: siteMetadata.author,
            url: siteMetadata.siteUrl,
          },
        },
      };
    }),
  };

  return (
    <React.Fragment>
      <h1 className="sr-only">Projects by {siteMetadata.author}</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <ProjectsSection />
    </React.Fragment>
  );
}
