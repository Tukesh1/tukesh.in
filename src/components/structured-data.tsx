import { siteMetadata } from "@/data/siteMetadata";

type StructuredDataType = "person" | "website" | "profilePage";

interface StructuredDataProps {
  type: StructuredDataType;
}

export function StructuredData({ type }: StructuredDataProps) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteMetadata.author,
    url: siteMetadata.siteUrl,
    email: siteMetadata.social.email,
    image: `${siteMetadata.siteUrl}/assets/profile.png`,
    jobTitle: "Frontend Developer & AI Engineer",
    description:
      "Frontend Developer & AI Engineer creating responsive web applications and AI-powered solutions",
    sameAs: [
      siteMetadata.social.githubLink,
      siteMetadata.social.linkedinLink,
      siteMetadata.social.x,
    ],
    knowsAbout: [
      "React",
      "TypeScript",
      "Node.js",
      "JavaScript",
      "Web Development",
      "Full Stack Development",
      "Software Engineering",
      "MongoDB",
      "Express.js",
      "Next.js",
      "Tailwind CSS",
      "Python",
      "Machine Learning",
      "AI",
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "GL BAJAJ Institute of Technology & Management",
      sameAs: "https://www.glbajaj.edu.in/",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    author: {
      "@type": "Person",
      name: siteMetadata.author,
      url: siteMetadata.siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: siteMetadata.author,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteMetadata.siteUrl}/post?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // Google Rich Results supports ProfilePage for personal/portfolio sites.
  // See: https://developers.google.com/search/docs/appearance/structured-data/profile-page
  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${siteMetadata.author} — Portfolio`,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    dateCreated: "2024-01-01T00:00:00+05:30",
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@type": "Person",
      "@id": `${siteMetadata.siteUrl}/#person`,
      name: siteMetadata.author,
      url: siteMetadata.siteUrl,
      image: `${siteMetadata.siteUrl}/assets/profile.png`,
      jobTitle: "Frontend Developer & AI Engineer",
      description: siteMetadata.pages.home.description,
      sameAs: [
        siteMetadata.social.githubLink,
        siteMetadata.social.linkedinLink,
        siteMetadata.social.x,
      ],
    },
  };

  const schemas = {
    person: personSchema,
    website: websiteSchema,
    profilePage: profilePageSchema,
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas[type]) }}
    />
  );
}
