# [App Link Explorer](https://applinkexplorer.vercel.app/)

A web tool available [here](https://applinkexplorer.vercel.app/) to help visualize which iOS / Android apps are bound to a particular domain via **Universal Links** (iOS) and **App Links** (Android).  
Enter a domain, hit _Analyse_ and the app instantly fetches the public association files (`.well-known/apple-app-site-association`, `assetlinks.json`) and displays the list of connected mobile applications.

---

## Prerequisites

1. **Node.js ≥ 18** (the project is tested with Node 18 & 20).
2. **pnpm ≥ 8** – the preferred package-manager for this repository. If you do not have it yet:

```bash
npm install -g pnpm
```

---

## Local development

```bash
# 1. Install dependencies
pnpm install

# 2. Start the dev server (http://localhost:3000 by default)
pnpm run dev

# The app will reload automatically when you edit source files.
```

### Linting

```bash
pnpm run lint
```

### Type checking

TypeScript is configured with `strict: true`. While `next build` will perform a type-check anyway, you can run it manually:

```bash
pnpm exec tsc --noEmit
```

### MCP Servers for coding assistants

If using a coding assitant enabled with MCP a `.mcp.json` contain a few used during development. No installation step is needed for Playwright.
For the Typescript LSP `go`, a LSP MCP adapter and the TS LPS need to be installed.

```bash
pnpm install -g typescript typescript-language-server
```
this can be tested with
```bash
typescript-language-server --stdio
```

For the go-based MCP adapter for LSPs

```bash
go install github.com/isaacphi/mcp-language-server@latest
```

which can be tested using

```bash
mcp-language-server \
   --workspace . \
   --lsp typescript-language-server \
   -- --stdio
```

---

## Production build

Create an optimised production build and start the server:

```bash
pnpm run build   # generates the `.next` output
pnpm run start   # starts Next.js in production mode
```

By default the server listens on **port 3000** (set `PORT` to override).

---

## Project structure (high-level)

```
├─ app/               # Next.js App Router routes & layouts
│  ├─ (app)/          # main marketing / landing pages
│  ├─ (domain)/       # dynamic pages per-domain (/[domain])
│  └─ api/            # route handlers (Edge compatible)
│
├─ components/        # reusable UI components & widgets
├─ hooks/             # React hooks
├─ lib/               # small helper libraries (no React here)
├─ styles/            # Tailwind base & globals
└─ public/            # static assets served from the web root
```

---

## Environment variables

The application does **not** require any secrets or environment variables out of the box. Should you add runtime configuration later, remember to update this section and use **Next.js’s built-in env support** (`NEXT_PUBLIC_*`, server variables, etc.).

---

## Deploying

Any platform that supports a standard Next.js deployment will work (Vercel, Netlify, Cloudflare Pages, Fly.io, Render, …).

1. Ensure `pnpm run build` succeeds locally.
2. Configure your platform to run the following build & start commands:

   • **Build:** `pnpm run build`  
   • **Start:** `pnpm run start`

3. (Optional) Set `NODE_ENV=production` and any other env-vars you may add.