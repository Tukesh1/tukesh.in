import type { Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";

// Shiki theme: dual-theme so light/dark modes both look good.
// `globals.css` swaps tokens based on `[data-theme]` via the `html.dark` class.
export const prettyCodeOptions: PrettyCodeOptions = {
  theme: {
    light: "github-light",
    dark: "github-dark-dimmed",
  },
  keepBackground: false,
  defaultLang: {
    block: "plaintext",
    inline: "plaintext",
  },
  // Add a zero-width space to empty lines so `display: grid` preserves
  // their height and alignment.
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className = [
      ...(node.properties.className || []),
      "line--highlighted",
    ];
  },
  onVisitHighlightedChars(node) {
    node.properties.className = [
      ...(node.properties.className || []),
      "word--highlighted",
    ];
  },
};

export const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: "append",
        properties: {
          className: ["heading-anchor"],
          ariaLabel: "Link to section",
        },
      },
    ],
    [rehypePrettyCode, prettyCodeOptions],
  ],
  // React 19 + next-mdx-remote: keep JSX runtime (prod vs dev-runtime) in
  // sync between the compiled MDX output and the React renderer. Without
  // this, dev mode throws "Attempted to render <MDXContent> without
  // development properties".
  development: process.env.NODE_ENV === "development",
} as const;
