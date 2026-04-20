import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPostBySlug, getAllPosts } from "../../../data/post";
import { siteMetadata } from "../../../data/siteMetadata";
import { MDXContent } from "../../../components/mdx-content";
import { ReadingProgress } from "../../../components/reading-progress";
import { SharePost } from "../../../components/share-post";

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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  // Posts are sorted newest → oldest, so "newer" is the previous item.
  const newerPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const olderPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1
      ? allPosts[currentIndex + 1]
      : null;

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

  const wasUpdated = post.updatedAt !== post.createdAt;

  return (
    <React.Fragment>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-10">
          <Link
            href="/post"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All posts
          </Link>
        </div>

        <header className="mb-10 sm:mb-14">
          <dl className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-500">
            <div>
              <dt className="sr-only">Published</dt>
              <dd>
                <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
              </dd>
            </div>
            <span aria-hidden="true" className="text-gray-300 dark:text-gray-700">·</span>
            <div>
              <dt className="sr-only">Reading time</dt>
              <dd>{post.readingTime} min read</dd>
            </div>
            <span aria-hidden="true" className="text-gray-300 dark:text-gray-700">·</span>
            <div>
              <dt className="sr-only">Word count</dt>
              <dd>{post.wordCount.toLocaleString()} words</dd>
            </div>
            {wasUpdated ? (
              <>
                <span aria-hidden="true" className="text-gray-300 dark:text-gray-700">·</span>
                <div>
                  <dt className="sr-only">Updated</dt>
                  <dd>
                    Updated{" "}
                    <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
                  </dd>
                </div>
              </>
            ) : null}
          </dl>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-[1.15] mb-5">
            {post.metadata.title}
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            {post.metadata.description}
          </p>
        </header>

        <MDXContent source={post.content} />

        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="mb-10">
            <SharePost title={post.metadata.title} url={url} twitterVia="sarifInsaan" />
          </div>

          {(newerPost || olderPost) && (
            <nav
              aria-label="Post navigation"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {newerPost ? (
                <Link
                  href={`/post/${newerPost.slug}`}
                  className="group flex flex-col gap-1 rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                >
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-gray-500 dark:text-gray-500">
                    <ArrowLeft className="h-3 w-3" />
                    Newer
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:underline underline-offset-4 decoration-1">
                    {newerPost.metadata.title}
                  </span>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}

              {olderPost ? (
                <Link
                  href={`/post/${olderPost.slug}`}
                  className="group flex flex-col gap-1 rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-right hover:border-gray-400 dark:hover:border-gray-600 transition-colors sm:items-end"
                >
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-gray-500 dark:text-gray-500">
                    Older
                    <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:underline underline-offset-4 decoration-1">
                    {olderPost.metadata.title}
                  </span>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
            </nav>
          )}
        </footer>
      </article>
    </React.Fragment>
  );
}
