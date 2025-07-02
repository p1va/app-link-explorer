import type React from "react"
import { GeistSans } from "../fonts"
import "../globals.css"

export default function MarketingLayout({
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
