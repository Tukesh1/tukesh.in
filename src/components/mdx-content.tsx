import { compile, run } from "@mdx-js/mdx";
import * as jsxRuntime from "react/jsx-runtime";
import * as jsxDevRuntime from "react/jsx-dev-runtime";
import Image from "next/image";
import { CodeBlock } from "./mdx/code-block";
import { mdxOptions } from "../lib/mdx-plugins";

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="group scroll-mt-24 mt-12 mb-5 text-3xl sm:text-4xl font-bold tracking-tight first:mt-0 text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="group scroll-mt-24 mt-10 mb-4 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="group scroll-mt-24 mt-8 mb-3 text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className="group scroll-mt-24 mt-6 mb-2 text-lg sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="mb-6 text-[17px] sm:text-[18px] leading-[1.75] text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-6 ml-6 list-disc space-y-2 text-[17px] sm:text-[18px] leading-[1.75] text-gray-700 dark:text-gray-300 marker:text-gray-400 dark:marker:text-gray-600" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-6 ml-6 list-decimal space-y-2 text-[17px] sm:text-[18px] leading-[1.75] text-gray-700 dark:text-gray-300 marker:text-gray-400 dark:marker:text-gray-600" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="pl-1" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className="my-8 border-l-[3px] border-teal-500/70 dark:border-teal-400/70 pl-5 italic text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed [&>p]:mb-0 [&>p]:text-inherit"
      {...props}
    />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr
      className="my-12 border-0 text-center before:content-['·_·_·'] before:tracking-[0.5em] before:text-gray-400 dark:before:text-gray-600"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => <CodeBlock {...props} />,
  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement> & { "data-language"?: string }) => {
    const isBlock = "data-language" in props || className?.includes("language-");
    if (isBlock) {
      return <code className={className} {...props}>{children}</code>;
    }
    return (
      <code
        className="rounded-md bg-gray-100 dark:bg-gray-800/80 px-1.5 py-0.5 text-[0.9em] font-mono text-gray-900 dark:text-gray-100 before:content-none after:content-none"
        {...props}
      >
        {children}
      </code>
    );
  },
  img: ({ src, alt, width, height, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (typeof src !== "string") return null;
    const w = typeof width === "number" ? width : 1200;
    const h = typeof height === "number" ? height : 630;
    return (
      <figure className="my-8 sm:my-10">
        <Image
          src={src}
          alt={alt ?? ""}
          width={w}
          height={h}
          className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-800"
          {...props}
        />
        {alt ? (
          <figcaption className="mt-3 text-center text-sm text-gray-500 dark:text-gray-500 italic">
            {alt}
          </figcaption>
        ) : null}
      </figure>
    );
  },
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = props.href?.startsWith("http");
    return (
      <a
        className="font-medium text-gray-900 dark:text-gray-100 underline decoration-gray-300 dark:decoration-gray-600 underline-offset-[3px] decoration-2 hover:decoration-teal-500 dark:hover:decoration-teal-400 transition-colors"
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      />
    );
  },
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-8 -mx-4 sm:mx-0 overflow-x-auto">
      <table className="min-w-full text-sm sm:text-base border-collapse" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="border-b border-gray-300 dark:border-gray-700" {...props} />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="border-b border-gray-200 dark:border-gray-800 last:border-0" {...props} />
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-4 py-3 text-gray-700 dark:text-gray-300" {...props} />
  ),
  input: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    if (props.type === "checkbox") {
      return (
        <input
          {...props}
          className="mr-2 -translate-y-[1px] accent-teal-500"
          disabled
        />
      );
    }
    return <input {...props} />;
  },
};

const isDev = process.env.NODE_ENV === "development";
const runtime = isDev ? jsxDevRuntime : jsxRuntime;

// Renders an MDX string via @mdx-js/mdx directly, so we can pick the JSX
// runtime (dev vs prod) that matches React's current mode. next-mdx-remote
// hardcodes the prod runtime, which breaks under React 19 dev mode.
export async function MDXContent({ source }: { source: string }) {
  const compiled = await compile(source, {
    outputFormat: "function-body",
    development: isDev,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    remarkPlugins: mdxOptions.remarkPlugins as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rehypePlugins: mdxOptions.rehypePlugins as any,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod = await run(String(compiled), runtime as any);
  const MDXDefault = mod.default as React.ComponentType<{ components: typeof components }>;

  return (
    <div className="mdx-content w-full">
      <MDXDefault components={components} />
    </div>
  );
}
