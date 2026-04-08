import { MetadataRoute } from 'next'
import { siteMetadata } from '../data/siteMetadata'
import { getAllPosts } from '../data/post'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteMetadata.siteUrl

  // Define all your routes
  const routes = [
    '',
    '/about',
    '/projects',
    '/post',
    '/activity',
    '/resume',
    '/tracode',
  ]

  const sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Add blog posts
  const posts = getAllPosts()
  const postSitemap = posts.map((post) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...sitemap, ...postSitemap]
}