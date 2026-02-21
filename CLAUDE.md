# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the official documentation site for the **Valar** cloud platform. It is a static site built with [Docsify](https://docsify.js.org/), served as plain Markdown files with client-side rendering. The site itself is deployed on the Valar platform (static constructor).

## Valar Platform Context

Valar is a serverless container orchestration platform. Understanding the platform helps write accurate documentation.

- Users interact with Valar through a CLI and a token-secured HTTP REST API.
- The platform model is: **users → projects → services → builds → deployments**.
- Services are built from source using **constructors** (called "stacks" in docs): docker, golang, python, node, node-static, static.
- Services run in sandboxed containers. Cold start is under 200ms; warm instances are reused.
- The API covers: projects, builds, deployments, services, routes (host aliases), domains (custom domains + TLS), env (encrypted environment variables), and cron (scheduled requests).
- Supporting capabilities include custom domain binding, permission management (namespace-based ACLs), and scheduled invocations.

## Local Development

No build step is required. To preview locally, serve the root directory with any static file server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js (npx)
npx serve .
```

Then open `http://localhost:8000` in a browser. Docsify renders Markdown client-side, so changes to `.md` files are visible on refresh.

## Deployment

Pushes to `master` trigger automatic deployment via GitHub Actions (`.github/workflows/valar.yml`), which uses `valar/action@v2` with a `VALAR_TOKEN` secret. The deployment config is in `.valar.yml` (static constructor, project `valar`, service `docs`).

## Architecture

- **`index.html`** — Docsify entry point; configures theme color (`#EE0043`), homepage (`getting-started/cli-setup.md`), sidebar loading, and Prism.js syntax highlighting (bash, go).
- **`_sidebar.md`** — Defines the navigation structure. Must be updated when adding/removing/renaming pages.
- **`vue.css`** — Custom Docsify theme stylesheet (Atkinson Hyperlegible font).
- **`getting-started/`** — Beginner guides: CLI setup, logical model, service creation, publishing, log inspection.
- **`advanced-topics/`** — Custom domains, permissions, scheduled invocations.
- **`stacks/`** — Runtime constructor docs (docker, golang, python, node, node-static, static).
- **`img/`** — Logo and image assets.

## Content Conventions

- All documentation is plain Markdown; Docsify-specific features (e.g., `?> ` for tips, `!> ` for warnings) are available.
- Code examples use fenced code blocks with language hints (`bash`, `go`).
- When adding a new page, add a corresponding entry in `_sidebar.md`.
