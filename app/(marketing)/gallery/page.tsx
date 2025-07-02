import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { GalleryContent } from "@/components/gallery-content"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "App Link Gallery | Universal Link Discovery",
  description: "Browse our curated collection of websites with Universal Links and App Links implementations.",
}

export default function GalleryPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <main className="min-h-screen p-4 md:p-8 lg:p-12 font-sans relative">
        <div className="absolute top-4 right-4 md:top-8 md:right-8 lg:top-12 lg:right-12">
          <ModeToggle />
        </div>
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          <header className="flex flex-col items-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-center mb-4">App Link Gallery</h1>
            <p className="text-center text-lg max-w-2xl text-muted-foreground">
              Browse our curated collection of websites with Universal Links and App Links implementations.
            </p>
          </header>

          <Suspense fallback={<div className="text-center p-8">Loading gallery...</div>}>
            <GalleryContent />
          </Suspense>

          <footer className="mt-16 text-center text-sm text-muted-foreground">
            <p>App Link Explorer helps developers verify mobile app link configurations.</p>
            <p className="mt-2">© {new Date().getFullYear()} App Link Explorer. All rights reserved.</p>
          </footer>
        </div>
      </main>
    </ThemeProvider>
  )
}
