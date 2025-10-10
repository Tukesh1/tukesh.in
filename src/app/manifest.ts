import { MetadataRoute } from 'next'
import { siteMetadata } from '@/data/siteMetadata'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteMetadata.title,
    short_name: 'Tukesh',
    description: siteMetadata.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#1D1E20',
    theme_color: '#1D1E20',
    icons: [
      {
        src: '/favicon.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/favicon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}