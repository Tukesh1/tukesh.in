import type { MetadataRoute } from "next";
import { siteMetadata } from "../data/siteMetadata";
import { getAllPosts } from "../data/post";

type Route = { path: string; changeFrequency: "daily" | "weekly" | "monthly" | "yearly"; priority: number };

const ROUTES: Route[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.9 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/post", changeFrequency: "weekly", priority: 0.8 },
  { path: "/activity", changeFrequency: "daily", priority: 0.6 },
  { path: "/guestbook", changeFrequency: "daily", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteMetadata.siteUrl;
  const now = new Date();

  const staticEntries = ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const postEntries = getAllPosts().map((post) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries];
}
