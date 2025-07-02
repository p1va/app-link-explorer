# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Android Link Discovery UI, a Next.js application that allows users to discover which iOS and Android apps are linked to a website. It checks Universal Links (iOS) and App Links (Android) configurations by analyzing domain files like `.well-known/apple-app-site-association` and `.well-known/assetlinks.json`.

## Development Commands

- **Development server**: `pnpm dev` (Next.js dev server on port 3000)
- **Build**: `pnpm build` (Next.js production build)
- **Linting**: `pnpm lint` (Next.js ESLint)
- **Start production**: `pnpm start` (serves built application)

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Theming**: next-themes with light/dark mode support
- **State Management**: React hooks (useState, useEffect)
- **Server Actions**: Next.js server actions for API calls
- **Font**: Geist Sans font family

### Project Structure
```
app/
├── (domain)/[domain]/page.tsx    # Dynamic domain-specific pages
├── (marketing)/gallery/          # Gallery pages with opengraph
├── actions.ts                    # Server actions for link discovery
├── api/og/route.tsx             # OpenGraph image generation
├── layout.tsx                   # Root layout with metadata
├── page.tsx                     # Homepage
└── structured-data.tsx          # JSON-LD schema generation

components/
├── ui/                          # shadcn/ui components
├── link-discovery.tsx           # Main link discovery component
├── android-apps-visualization.tsx
├── apple-apps-visualization.tsx
├── *-app-card.tsx              # App card components
└── theme-provider.tsx          # Theme context provider
```

### Key Components

**LinkDiscovery Component** (`components/link-discovery.tsx`):
- Main interactive component for domain input and results display
- Uses Next.js routing to update URL with domain parameter
- Handles both Android and iOS app link discovery
- Shows loading states, error handling, and results visualization

**Server Actions** (`app/actions.ts`):
- `checkUniversalLinks()` - Main server action that fetches and analyzes app link files
- Returns `DiscoveryResult` with Android and Apple data
- Includes request logging and error handling

**App Visualizations**:
- `AndroidAppsVisualization` - Displays Android app link results
- `AppleAppsVisualization` - Displays iOS Universal Link results
- Both components show app cards with metadata when available

## UI System

Built with shadcn/ui components providing:
- Consistent design system with CSS variables
- Dark/light theme support via next-themes
- Responsive design with mobile-first approach
- Accessible components with proper ARIA attributes

## Configuration

**Next.js Config** (`next.config.mjs`):
- ESLint and TypeScript errors ignored during builds (for v0.dev deployment)
- Images unoptimized for static deployment

**TypeScript**: Strict mode enabled with path aliases (`@/*` maps to root)

**Tailwind**: Custom theme extending shadcn/ui design tokens

## v0.dev Integration

This project is auto-synced with v0.dev:
- Changes made in v0.dev are automatically pushed to this repository
- Deployed on Vercel with continuous deployment
- ESLint/TypeScript build errors are ignored for seamless deployment

## Development Notes

- Uses pnpm as package manager
- Server components and client components clearly separated
- SEO optimized with comprehensive metadata and structured data
- OpenGraph images generated dynamically via API route
- Gallery feature for showcasing example domains