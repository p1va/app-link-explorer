"use client"
import LinkDiscovery from "@/components/link-discovery"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DomainPage() {
  const params = useParams()
  const domain = typeof params.domain === "string" ? params.domain : ""

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <main className="min-h-screen p-4 md:p-8 lg:p-12 font-sans relative">
        <div className="absolute top-4 right-4 md:top-8 md:right-8 lg:top-12 lg:right-12">
          <ModeToggle />
        </div>
        <div className="container mx-auto max-w-4xl">
          {/* Back to Home button */}
          <div className="mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          <header className="flex flex-col items-center mb-8 mt-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-center mb-4">App Link Explorer</h1>
            {domain && (
              <p className="text-center text-lg max-w-2xl text-muted-foreground">
                Exploring app links for <span className="font-semibold">{domain}</span>
              </p>
            )}
          </header>

          <LinkDiscovery />

          <footer className="mt-16 text-center text-sm text-muted-foreground">
            <p>App Link Explorer helps developers verify mobile app link configurations.</p>
            <p className="mt-2">© {new Date().getFullYear()} App Link Explorer. All rights reserved.</p>
          </footer>
        </div>
      </main>
    </ThemeProvider>
  )
}
