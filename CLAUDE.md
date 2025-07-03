# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the App Link Discovery UI, a Next.js application that starting from a URL allows users to discover which iOS and Android apps (if any) are linked to a website. It checks Universal Links (iOS) and App Links (Android) configurations by analyzing domain files like `.well-known/apple-app-site-association` and `.well-known/assetlinks.json`.

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

## MCP Servers

### Playwright

Provides automated browser testing capabilities for comprehensive UI testing:

#### Core Capabilities
- **Navigation**: Load and navigate between pages
- **Interaction**: Click buttons, fill forms, select options
- **Assertions**: Verify page content and functionality
- **Screenshots**: Capture visual states for verification
- **Accessibility**: Get detailed page snapshots with element references

#### Tested Scenarios
The smoke test demonstrates a complete user flow:

1. **Homepage Loading**: Successfully loads at `http://localhost:3000` with all UI elements
2. **Domain Input**: Text input accepts domain names (tested with "facebook.com")
3. **Analysis Execution**: "Check" button triggers the link discovery process
4. **Results Display**: Navigation to `/facebook.com` with comprehensive results:
   - ✅ Android: 12 apps found with valid configuration
   - ✅ Apple: 39 iOS apps found with Universal Links, Web Credentials, and Handoff
   - ✅ Technical details showing successful API calls (200ms-263ms response times)

#### Key Testing Insights
- **Browser State**: Playwright maintains browser state between actions (no need to reload)
- **Element References**: Each UI element gets a unique ref (e.g., `e43` for textbox) for precise targeting
- **Real-time Feedback**: Button states change dynamically (disabled/enabled based on input)
- **Tab Navigation**: Both Android and Apple tabs function correctly with full data display
- **Performance**: Analysis completes quickly with detailed technical logs

#### Usage Notes from Testing
- Use `browser_navigate` to load pages
- `browser_click` and `browser_type` for form interactions  
- `browser_snapshot` provides detailed accessibility tree (better than screenshots for element targeting)
- `browser_take_screenshot` for visual verification
- Response size can be large - consider pagination for complex pages
- The MCP server automatically handles browser lifecycle and state management

### TypeScript Language Server Protocol

Provides precise code navigation and analysis tools for TypeScript/JavaScript codebases:

- `mcp__ts-lsp__definition`: Retrieves the complete source code definition of any symbol (function, type, constant, etc.) from your codebase. Essential for understanding function implementations and their structure.

- `mcp__ts-lsp__references`: Locates all usages and references of a symbol throughout the codebase. Critical for impact analysis before refactoring - shows exactly where functions are used and how changes might affect other parts of the code.

- `mcp__ts-lsp__diagnostics`: Provides diagnostic information for a specific file, including warnings and errors. Use to verify that your changes compile correctly and don't introduce type errors.

- `mcp__ts-lsp__hover`: Display documentation, type hints, or other hover information for a given location. Useful for understanding types and getting inline documentation.

- `mcp__ts-lsp__rename_symbol`: Rename a symbol across a project safely, updating all references automatically.

- `mcp__ts-lsp__edit_file`: Allows making multiple text edits to a file based on line numbers. Provides a more reliable and context-economical way to edit code compared to string-based replacements.

#### Usage Notes from Testing

The LSP tools are particularly valuable for:
- **Code exploration**: `definition` and `references` make it easy to understand how functions relate to each other
- **Refactoring safety**: `references` shows the impact of changes before making them
- **Code quality**: `diagnostics` catches compilation errors immediately
- **Large codebases**: Much more efficient than text-based searches for understanding code structure

**Best practices**:
1. Use `definition` first to understand what you're working with
2. Use `references` to see usage patterns and potential impact
3. Use `diagnostics` after making changes to ensure code still compiles
4. The tools work better than grep/search for understanding code relationships and dependencies