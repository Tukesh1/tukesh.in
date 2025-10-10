import React from "react";
import Link from 'next/link';
import Image from 'next/image';

interface Certification {
  title: string;
  date: string;
  link?: string;
  icon?: string;
  iconImage?: string;
}

const certifications: Certification[] = [
  {
    title: "AWS Academy Cloud Foundations",
    date: "2024-09",
    link: "https://www.credly.com/badges/6d28d30a-a8cf-4213-8a8c-d3da867faf1b/public_url",
    iconImage: "/assets/aws-cloud.png"
  },
//   {
//     title: "Python",
//     date: "2024-07",
//     link: "https://www.hackerrank.com/certificates/2647d4f9550b",
//     icon: "�"
//   },
  {
    title: "Mastering Data Structure and Algorithms",
    date: "2024-05",
    link: "https://ninjasfiles.s3.amazonaws.com/certificate3164967230bd583dd9e20b02bb7f61c48e59cda.pdf",
    icon: "🥷"
  }
];

interface CertificationItemProps {
  certification: Certification;
}

function CertificationItem({ certification }: CertificationItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + '-01'); // Add day for proper parsing
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const ItemContent = (
    <div className="group flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-0 text-balance text-sm sm:text-base md:text-lg font-medium text-gray-900 dark:text-white py-2 sm:py-1">
      <span className="mr-2 hidden h-1.5 w-1.5 bg-gray-900 dark:bg-white transition-all group-hover:h-5 group-hover:bg-yellow-400 sm:block"></span>
      <span className="mr-0 sm:mr-1.5 flex-shrink-0 transition-colors group-hover:text-yellow-400 leading-relaxed flex items-center gap-2">
        {certification.iconImage ? (
          <div className="w-5 h-5 sm:w-6 sm:h-6 relative flex-shrink-0">
            <Image 
              src={certification.iconImage} 
              alt={`${certification.title} badge`}
              fill
              className="object-contain rounded-sm"
              sizes="24px"
            />
          </div>
        ) : certification.icon ? (
          <span className="text-base">{certification.icon}</span>
        ) : null}
        <span className={certification.link ? "underline decoration-2 underline-offset-2" : ""}>
          {certification.title}
        </span>
      </span>
      <span className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-zinc-500 font-normal">
        ({formatDate(certification.date)})
      </span>
    </div>
  );

  if (certification.link) {
    return (
      <Link 
        href={certification.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {ItemContent}
      </Link>
    );
  }

  return <div>{ItemContent}</div>;
}

export function Certifications() {
  return (
    <div className="flex flex-col gap-2 sm:gap-1 md:gap-2">
      {certifications.map((certification, index) => (
        <CertificationItem key={index} certification={certification} />
      ))}
    </div>
  );
}