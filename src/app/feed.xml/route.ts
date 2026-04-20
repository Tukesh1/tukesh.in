import { siteMetadata } from "../../data/siteMetadata";
import { getAllPosts } from "../../data/post";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPosts();
  const siteUrl = siteMetadata.siteUrl;
  const buildDate = new Date().toUTCString();

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/post/${post.slug}`;
      const pubDate = new Date(post.createdAt).toUTCString();
      const title = escapeXml(post.metadata.title ?? post.slug);
      const description = escapeXml(post.metadata.description ?? "");
      return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(siteMetadata.social.email)} (${escapeXml(siteMetadata.author)})</author>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteMetadata.title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteMetadata.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
