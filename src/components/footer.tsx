import { siteMetadata } from "@/data/siteMetadata";
import { Menagerie } from "@/components/menagerie";

export function Footer() {
  return (
    <footer className="pt-8 pb-24">
      <div className="w-full border-t border-gray-200 dark:border-gray-800" />

      <div className="mx-auto max-w-4xl px-4 mt-6">
        <Menagerie />
      </div>

      <div className="mx-auto max-w-4xl px-4 mt-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <span
          role="img"
          aria-label={siteMetadata.author}
          title={siteMetadata.author}
          className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm"
        >
          TK
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
          <span className="hidden md:inline-block text-gray-300 dark:text-gray-700">•</span>
          <a
            href="//www.dmca.com/Protection/Status.aspx?ID=2d1bfc6e-c9f3-473a-b8a4-0e26504c1da5"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            DMCA
          </a>
        </div>
      </div>
    </footer>
  );
}
