import { siteMetadata } from "@/data/siteMetadata";

interface StructuredDataProps {
  type: 'person' | 'website' | 'organization' | 'profilePage';
  pageUrl?: string;
  pageTitle?: string;
  pageDescription?: string;
}

export function StructuredData({
  type,
  pageUrl = siteMetadata.siteUrl,
  pageTitle = siteMetadata.title,
  pageDescription = siteMetadata.description
}: StructuredDataProps) {
  const generatePersonSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": siteMetadata.author,
    "url": siteMetadata.siteUrl,
    "email": siteMetadata.social.email,
    "image": `${siteMetadata.siteUrl}/assets/profile.png`,
    "jobTitle": "Frontend Developer & AI Engineer",
    "description": "Frontend Developer & AI Engineer creating responsive web applications and AI-powered solutions",
    "sameAs": [
      siteMetadata.social.githubLink,
      siteMetadata.social.linkedinLink,
      siteMetadata.social.x,
    ],
    "knowsAbout": [
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
      "AI"
    ],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "GL BAJAJ Institute of Technology & Management",
      "sameAs": "https://www.glbajaj.edu.in/"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    }
  });

  const generateWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteMetadata.title,
    "description": siteMetadata.description,
    "url": siteMetadata.siteUrl,
    "author": {
      "@type": "Person",
      "name": siteMetadata.author,
      "url": siteMetadata.siteUrl
    },
    "publisher": {
      "@type": "Person",
      "name": siteMetadata.author
    }
  });

  // Google Rich Results supports ProfilePage for personal/portfolio sites.
  // See: https://developers.google.com/search/docs/appearance/structured-data/profile-page
  const generateProfilePageSchema = () => ({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": `${siteMetadata.author} — Portfolio`,
    "description": siteMetadata.description,
    "url": siteMetadata.siteUrl,
    "dateCreated": "2024-01-01T00:00:00+05:30",
    "dateModified": new Date().toISOString(),
    "mainEntity": {
      "@type": "Person",
      "@id": `${siteMetadata.siteUrl}/#person`,
      "name": siteMetadata.author,
      "url": siteMetadata.siteUrl,
      "image": `${siteMetadata.siteUrl}/assets/profile.png`,
      "jobTitle": "Frontend Developer & AI Engineer",
      "description": siteMetadata.pages.home.description,
      "sameAs": [
        siteMetadata.social.githubLink,
        siteMetadata.social.linkedinLink,
        siteMetadata.social.x,
      ]
    }
  });

  const generateWebPageSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageTitle,
    "description": pageDescription,
    "url": pageUrl,
    "author": {
      "@type": "Person",
      "name": siteMetadata.author,
      "url": siteMetadata.siteUrl
    },
    "publisher": {
      "@type": "Person",
      "name": siteMetadata.author
    },
    "isPartOf": {
      "@type": "WebSite",
      "name": siteMetadata.title,
      "url": siteMetadata.siteUrl
    }
  });

  const generateOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteMetadata.title,
    "url": siteMetadata.siteUrl,
    "logo": `${siteMetadata.siteUrl}/favicon.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "email": siteMetadata.social.email,
      "contactType": "customer support"
    },
    "sameAs": [
      siteMetadata.social.githubLink,
      siteMetadata.social.linkedinLink,
      siteMetadata.social.x,
    ]
  });

  let schema;
  switch (type) {
    case 'person':
      schema = generatePersonSchema();
      break;
    case 'website':
      schema = generateWebsiteSchema();
      break;
    case 'profilePage':
      schema = generateProfilePageSchema();
      break;
    case 'organization':
      schema = generateOrganizationSchema();
      break;
    default:
      schema = generateWebPageSchema();
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}