// Writes dist/<path>/index.html for every page, so nginx can serve each one as a
// plain file. Runs after the client build (dist/) and the server build (dist-server/).
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const title = "<title>Valar Docs</title>";
const root = '<div id="root"></div>';

export async function prerender({ template, render, paths, outDir }) {
  if (!template.includes(title) || !template.includes(root)) throw new Error(`template needs ${title} and ${root}`);
  const files = [];
  for (const path of paths) {
    const page = await render(path);
    const file = join(outDir, path, "index.html");
    // Replacer functions, because page content may contain "$&" and similar patterns.
    const html = template.replace(title, () => page.head).replace(root, () => `<div id="root">${page.html}</div>`);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
    files.push(file);
  }
  return files;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = await import(pathToFileURL(resolve("dist-server/entry-server.js")).href);
  const template = await readFile("dist/index.html", "utf8");
  const files = await prerender({ template, render: server.render, paths: server.paths, outDir: "dist" });
  for (const file of files) {
    if (!(await readFile(file, "utf8")).includes('<div id="root"><')) throw new Error(`${file} was not rendered`);
  }
  if (files.length !== server.paths.length) throw new Error(`wrote ${files.length} of ${server.paths.length} pages`);
  console.log(`Prerendered ${files.length} pages.`);
}
