import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <main className="min-h-screen p-4 md:p-8 lg:p-12 font-sans relative">
        <div className="absolute top-4 right-4 md:top-8 md:right-8 lg:top-12 lg:right-12">
          <ModeToggle />
        </div>
        <div className="container mx-auto max-w-4xl">
          {children}
          <footer className="mt-16 text-center text-sm text-muted-foreground">
            <p>App Link Explorer helps developers verify mobile app link configurations.</p>
            <p className="mt-2">© {new Date().getFullYear()} App Link Explorer. All rights reserved.</p>
          </footer>
        </div>
      </main>
    </ThemeProvider>
  )
}
