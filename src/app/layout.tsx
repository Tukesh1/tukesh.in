import "./globals.css";
import type { Metadata } from "next";
import { cn } from "../lib/utils";
import { ThemeProvider } from "../components/theme-provider";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

import { TailwindIndicator } from "../components/tailwind-indicator";
import { Space_Grotesk } from "next/font/google";
import { siteMetadata } from "../data/siteMetadata";
import { StructuredData } from "../components/structured-data";
import Script from "next/script";

const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.author }],
  creator: siteMetadata.author,
  publisher: siteMetadata.author,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [
      {
        url: siteMetadata.socialBanner,
        width: 1200,
        height: 630,
        alt: `${siteMetadata.title} - Frontend Developer & AI Engineer`,
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [siteMetadata.socialBanner],
    creator: "@sarifInsaan",
  },
  alternates: {
    canonical: siteMetadata.siteUrl,
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="google-site-verification" content="xkBWbb9OnEAZEfrakVYXOpIcFlAH5qEA66FtywraJfI" />
        <meta name="dmca-site-verification" content="K1ZuK2dONXZSR1dadCtDc1lxcUkwUT090" />
        <link rel="preconnect" href="https://opengraph.githubassets.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://opengraph.githubassets.com" />
      </head>
      <body
        className={cn(
          "mx-auto min-h-screen max-w-4xl antialiased dark:bg-dark-bg dark:text-gray-100",
          space_grotesk.className,
        )}
      >
        <StructuredData type="person" />
        <StructuredData type="website" />
        <StructuredData type="profilePage" />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // default to dark mode, can be light, dark, system
          enableSystem
          disableTransitionOnChange
        >
          <main className="mx-4  px-2 md:px-0 lg:mx-auto flex flex-col justify-between min-h-screen">
            <Header />
            {children}
            <Footer />
          </main>
          <TailwindIndicator />
        </ThemeProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-P36W5PCJC2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P36W5PCJC2');
          `}
        </Script>
      </body>
    </html>
  );
}
