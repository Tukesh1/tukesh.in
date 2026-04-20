import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, getAllPosts } from "../../../data/post";
import { siteMetadata } from "../../../data/siteMetadata";
import { MDXContent } from "../../../components/mdx-content";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const { metadata } = post;
  const url = `${siteMetadata.siteUrl}/post/${slug}`;
  const ogImage = metadata.image
    ? `${siteMetadata.siteUrl}${metadata.image}`
    : `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`;

  return {
    title: metadata.title,
    description: metadata.description,
    authors: [{ name: siteMetadata.author, url: siteMetadata.siteUrl }],
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url,
      siteName: siteMetadata.title,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [siteMetadata.author],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [ogImage],
      creator: "@sarifInsaan",
    },
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": `${siteMetadata.siteUrl}/feed.xml`,
      },
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const url = `${siteMetadata.siteUrl}/post/${slug}`;
  const ogImage = post.metadata.image
    ? `${siteMetadata.siteUrl}${post.metadata.image}`
    : `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metadata.title,
    description: post.metadata.description,
    image: ogImage,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      "@id": `${siteMetadata.siteUrl}/#person`,
      name: siteMetadata.author,
      url: siteMetadata.siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: siteMetadata.author,
      url: siteMetadata.siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingTime}M`,
    inLanguage: "en-US",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteMetadata.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteMetadata.siteUrl}/post`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.metadata.title,
        item: url,
      },
    ],
  };

  return (
    <React.Fragment>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Clean Medium-style layout */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back navigation - subtle and minimal */}
        <div className="mb-8 sm:mb-12">
          <Link
            href="/post"
            className="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Posts
          </Link>
        </div>

        {/* Article header - clean and focused */}
        <header className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4 sm:mb-6">
            {post.metadata.title}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            {post.metadata.description}
          </p>

          <dl className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] sm:text-xs text-gray-500 dark:text-gray-500">
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Published</dt>
              <dd>
                <time dateTime={post.createdAt}>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </dd>
            </div>
            <span aria-hidden="true" className="text-gray-300 dark:text-gray-700">·</span>
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Reading time</dt>
              <dd>{post.readingTime} min read</dd>
            </div>
            <span aria-hidden="true" className="text-gray-300 dark:text-gray-700">·</span>
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Word count</dt>
              <dd>{post.wordCount.toLocaleString()} words</dd>
            </div>
          </dl>
        </header>

        {/* Article content */}
        <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none prose-gray dark:prose-invert">
          <MDXContent source={post.content} />
        </div>

        {/* Minimal footer */}
        <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/post"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            ← More posts
          </Link>
        </footer>
      </article>
    </React.Fragment>
  );
}
