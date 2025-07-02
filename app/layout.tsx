import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "./fonts"
import "./globals.css"

export const metadata: Metadata = {
  title: "Universal Link Discovery | Check App Links for iOS and Android",
  description:
    "Discover which iOS and Android apps are linked to your website with our Universal Link and App Links checker tool. Verify app configurations instantly.",
  keywords: "universal links, app links, deep links, iOS, Android, app discovery, mobile app links",
  authors: [{ name: "App Link Explorer" }],
  creator: "App Link Explorer",
  publisher: "App Link Explorer",
  openGraph: {
    type: "website",
    title: "Android App Links Discovery | Apple Universal Links Discovery | Check App Links for iOS and Android",
    description:
      "Discover which iOS and Android apps are linked to your website with our Universal Link and App Links checker tool. Verify app configurations instantly.",
    siteName: "App Link Explorer",
    images: [
      {
        url: "https://applinkexplorer.vercel.app/api/og",
        width: 1200,
        height: 630,
        alt: "App Link Explorer - Discover connected apps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "App Link Discovery | Check App Links for iOS and Android",
    description:
      "Discover which iOS and Android apps are linked to your website with our Universal Link and App Links checker tool. Verify app configurations instantly.",
    images: ["https://applinkexplorer.vercel.app/api/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://applinkexplorer.vercel.app",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>{children}</body>
    </html>
  )
}
