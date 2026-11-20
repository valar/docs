# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the official documentation site for the **Valar** cloud platform, served at docs.valar.dev. The pages are Markdown files in `content/`. The site around them uses the same stack as the Valar console: React 19, TypeScript, Vite 8, React Router 8 and Tailwind CSS 4. Markdown is converted to HTML at build time, and every page is prerendered to its own static HTML file. The site itself is deployed on the Valar platform (`node-static` constructor).

## Valar Platform Context

Valar is a serverless container orchestration platform. Understanding the platform helps write accurate documentation.

- Users interact with Valar through a CLI and a token-secured HTTP REST API.
- The platform model is: **users → projects → services → builds → deployments**.
- Services are built from source using **constructors** (called "stacks" in docs): docker, golang, python, node, node-static, static.
- Services run in sandboxed containers. Cold start is under 200ms; warm instances are reused.
- The API covers: projects, builds, deployments, services, routes (host aliases), domains (custom domains + TLS), env (encrypted environment variables), and cron (scheduled requests).
- Supporting capabilities include custom domain binding, permission management (namespace-based ACLs), and scheduled invocations.

## Commands

```bash
npm install
npm run dev        # http://localhost:5173, reloads on Markdown changes
npm test           # Vitest: content checks, renderer, prerender, UI
npm run lint
npm run typecheck
npm run build      # client build, server build, then one index.html per page in dist/
```

Use npm and commit `package-lock.json`. To check the built site the way nginx serves it (files only, no fallback), run `python3 -m http.server -d dist`.

## Architecture

- **`content/`**: the pages, one Markdown file each. `content/api/builds.md` is served at `/api/builds`, and `content/stacks/index.md` at `/stacks`. `/` shows the homepage, `getting-started/cli-setup.md` (set in `vite.config.ts`).
- **`content/_sidebar.md`**: the sidebar. Top-level entries are groups (a group can link to a page itself), and indented entries are the pages in each group. Its order also sets the previous/next links.
- **`src/markdown/`**: build-time code only. `plugin.ts` is a Vite plugin that exposes `virtual:docs` (page list and sidebar) and compiles each Markdown file to a module holding its HTML. `render.ts` renders with `marked`, highlights code with Shiki, rewrites links between pages to site paths, and gives headings docsify-compatible ids. Nothing in it reaches the client bundle.
- **`src/site.ts`**: page lookup and lazy loading of page content on the client.
- **`src/components/`**: `Layout.tsx` (sidebar, phone menu), modelled on the console's layout, and `DocPage.tsx` (rendered page, previous/next links, not-found page).
- **`src/entry-server.tsx`** and **`scripts/prerender.js`**: the server render and the script that writes `dist/<path>/index.html` for every page. `src/main.tsx` hydrates that HTML.
- **`src/legacy.ts`**: maps old docsify links (`/#/api/builds?id=list-builds`) to the new paths; `/` redirects them.
- **`src/index.css`**: brand tokens (shared with the console) and prose styles for the rendered Markdown.

## Adding a Page

1. Add a Markdown file under `content/`, starting with a `# Title`.
2. Add it to `content/_sidebar.md`.
3. Run `npm test`: it fails if a sidebar entry, a link or a heading anchor points at nothing.

## Content Conventions

- Plain GitHub-flavoured Markdown (tables work). For callouts, use GitHub alerts (`> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`); docsify's `?>` and `!>` are not supported.
- Link to other pages by their file, as docsify did: `[Builds](api/builds.md)` resolves from `content/`, and `./` or `../` paths resolve from the current file. Add `#heading-id` for a section.
- Heading ids follow docsify's rules (lowercase, punctuation dropped, spaces to dashes; `&` becomes `amp`), so old links keep working.
- Code blocks take a language hint (`bash`, `go`, `json`, or any language Shiki knows).

## Deployment

Pushes to `master` deploy via GitHub Actions (`.github/workflows/valar.yml`), which uses `valar/action@v2` with a `VALAR_TOKEN` secret. `.valar.yml` selects the `node-static` constructor (project `valar`, service `docs`): it runs `npm install` and `npm run build`, then serves `dist/` with nginx. nginx serves files only, so every page needs its own prerendered `index.html`; the build fails if one is missing.

Pull requests run lint, typecheck, tests and build (`.github/workflows/check.yml`).
