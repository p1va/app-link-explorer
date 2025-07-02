import { Suspense } from "react"
import LinkDiscovery from "@/components/link-discovery"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { generateAppLinkToolStructuredData, generateBreadcrumbStructuredData } from "./structured-data"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  const appToolSchema = generateAppLinkToolStructuredData()
  const breadcrumbSchema = generateBreadcrumbStructuredData()

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <main className="min-h-screen p-4 md:p-8 lg:p-12 font-sans relative">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appToolSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

        <div className="absolute top-4 right-4 md:top-8 md:right-8 lg:top-12 lg:right-12">
          <ModeToggle />
        </div>
        <div className="container mx-auto max-w-4xl">
          <header className="flex flex-col items-center mb-8 mt-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-center mb-4">App Link Explorer</h1>
            <p className="text-center text-lg max-w-2xl text-muted-foreground">
              Discover which iOS and Android apps are linked to a website. Check Universal Links and App Links
              configuration instantly.
            </p>
          </header>

          <section aria-labelledby="how-it-works" className="mb-12">
            <h2 id="how-it-works" className="text-2xl font-bold mb-4 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">1. Enter A Domain</h3>
                <p className="text-muted-foreground">Type any website domain to check its app link configuration</p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">2. Instant Analysis</h3>
                <p className="text-muted-foreground">We'll check both Android App Links and iOS Universal Links</p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">3. Discover Apps</h3>
                <p className="text-muted-foreground">See all mobile apps connected to the domain with detailed info</p>
              </div>
            </div>
          </section>

          <Suspense fallback={<div className="text-center p-8">Loading link discovery tool...</div>}>
            <LinkDiscovery />
          </Suspense>

          {/* New Gallery Section */}
          <section aria-labelledby="gallery-section" className="mb-12 p-6 bg-muted/30 rounded-lg border mt-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 id="gallery-section" className="text-2xl font-bold mb-2">
                  Browse Our Gallery
                </h2>
                <p className="text-muted-foreground max-w-xl">
                  Explore our curated collection of websites with app links. Discover how different industries implement
                  Universal Links and App Links.
                </p>
              </div>
              <Link
                href="/gallery"
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                View Gallery <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <footer className="mt-16 text-center text-sm text-muted-foreground">
            <p>App Link Explorer helps developers verify mobile app link configurations.</p>
            <p className="mt-2">© {new Date().getFullYear()} App Link Explorer. All rights reserved.</p>
          </footer>
        </div>
      </main>
    </ThemeProvider>
  )
}
