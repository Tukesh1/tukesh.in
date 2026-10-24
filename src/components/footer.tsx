import { siteMetadata } from "@/data/siteMetadata";

export function Footer() {
  return (
    <footer className="pt-8 pb-24">
      <div className="w-full border-t border-gray-200 dark:border-gray-800" />

      <div className="mx-auto max-w-4xl px-4 mt-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <span
          role="img"
          aria-label={siteMetadata.author}
          title={siteMetadata.author}
          className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm"
        >
          {siteMetadata.initials}
        </span>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()}&nbsp;
          <a
            href={siteMetadata.social.x}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
          >
            {siteMetadata.author}
          </a>
          <span className="mx-2 text-gray-300 dark:text-gray-700">•</span>
          <span>All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <a href="/sitemap.xml" className="hover:underline">
            sitemap.xml
          </a>
          {siteMetadata.dmca?.badgeUrl && (
            <>
              <span className="hidden md:inline-block text-gray-300 dark:text-gray-700">•</span>
              <a
                href={siteMetadata.dmca.badgeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                DMCA
              </a>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
