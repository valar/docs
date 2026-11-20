# <img alt="docs" src="https://user-images.githubusercontent.com/3391295/80893907-b70a0a80-8cd6-11ea-9bb6-2f39a8ccd63a.png" height="24">

This repository contains the source of the documentation site for Valar. Everyone is welcome to file new issues and PRs to improve this project.

The pages are Markdown files in [`content/`](content), and [`content/_sidebar.md`](content/_sidebar.md) lists them in the sidebar.
The site is built with React, Vite and Tailwind CSS, and every page is prerendered to static HTML.

```bash
npm install
npm run dev        # http://localhost:5173
npm test
npm run build      # static site in dist/
```
