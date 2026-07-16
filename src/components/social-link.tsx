import Link from "next/link";
import React from "react";

export interface Props {
  className?: string;
  href: string;
  icon: React.ElementType;
  children?: React.ReactNode;
  "aria-label"?: string;
}

export function SocialLink({
  className,
  href,
  children,
  icon: Icon,
  "aria-label": ariaLabel,
}: Props) {
  return (
    <div className={`flex ${className || ""}`}>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="group flex text-sm font-medium transition"
      >
        <Icon
          className="group-hover:fill-primary h-6 w-6 flex-none fill-zinc-500 hover:fill-zinc-200 transition"
          aria-hidden="true"
        />
        {children && <span className="ml-4">{children}</span>}
      </Link>
    </div>
  );
}
