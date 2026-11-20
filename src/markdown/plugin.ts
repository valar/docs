import { existsSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import type { Plugin } from "vite";
import { renderDoc } from "./render.ts";
import { loadSite, navFor, routeFor } from "./site.ts";

const id = "virtual:docs";
const resolvedId = "\0" + id;

// docs serves the Markdown pages in `dir`: `virtual:docs` lists the pages and the
// sidebar, and each page compiles to a module holding its HTML.
export function docs({ dir, homepage }: { dir: string; homepage: string }): Plugin {
  const root = resolve(dir);
  return {
    name: "valar-docs",
    resolveId: (source) => (source === id ? resolvedId : undefined),
    async load(source) {
      if (source !== resolvedId) return;
      const { files, sidebar } = await loadSite(root);
      this.addWatchFile(join(root, "_sidebar.md"));
      const pages = files.map((file) => `  ${JSON.stringify(routeFor(file))}: () => import(${JSON.stringify(`/${dir}/${file}`)}),`);
      return [
        `export const homepage = ${JSON.stringify(routeFor(homepage))};`,
        `export const nav = ${JSON.stringify(navFor(sidebar))};`,
        `export const pages = {\n${pages.join("\n")}\n};`,
      ].join("\n");
    },
    async transform(code, source) {
      if (!source.startsWith(root + sep) || !source.endsWith(".md")) return;
      const file = relative(root, source).split(sep).join("/");
      const { title, description, html } = await renderDoc(code, file, (target) => existsSync(join(root, target)));
      return { code: `export default ${JSON.stringify({ title, description, html })};`, map: null };
    },
    configureServer(server) {
      const reload = (file: string) => {
        if (!file.startsWith(root + sep)) return;
        const module = server.moduleGraph.getModuleById(resolvedId);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", reload);
      server.watcher.on("unlink", reload);
    },
  };
}
