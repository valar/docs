// @vitest-environment node
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { paths, render } from "../src/entry-server";
import { prerender } from "./prerender.js";

const template = await readFile("index.html", "utf8");
let outDir;

beforeAll(async () => {
  outDir = await mkdtemp(join(tmpdir(), "valar-docs-"));
  await prerender({ template, render, paths, outDir });
});

afterAll(() => rm(outDir, { recursive: true, force: true }));

const read = (path) => readFile(join(outDir, path, "index.html"), "utf8");

describe("prerender", () => {
  it("writes one index.html per page and one for /", async () => {
    const pages = (await readdir("content", { recursive: true })).filter((file) => file.endsWith(".md") && !file.endsWith("_sidebar.md"));
    const written = (await readdir(outDir, { recursive: true })).filter((file) => file.endsWith("index.html"));
    expect(written).toHaveLength(pages.length + 1);
    for (const page of pages) {
      const path = page.replace(/\.md$/, "").replace(/(^|\/)index$/, "");
      expect(written).toContain(join(path, "index.html"));
    }
  });

  it("puts the content, title and description in the HTML", async () => {
    const html = await read("api/builds");
    expect(html).toContain("<title>Builds – Valar Docs</title>");
    expect(html).toContain('<meta name="description" content="A build takes a source artifact');
    expect(html).toContain('<h2 id="list-builds">');
    expect(html).toContain("$TOKEN");
    expect(html).toContain('aria-current="page"');
  });

  it("shows the homepage at / and redirects old docsify links from there", async () => {
    const html = await read("");
    expect(html).toContain("<title>Valar Docs</title>");
    expect(html).toContain("Obtaining an API token");
    const script = /<script>(.*?)<\/script>/s.exec(html)[1];
    const location = { hash: "#/api/builds?id=list-builds", replace: vi.fn() };
    new Function("location", script)(location);
    expect(location.replace).toHaveBeenCalledWith("/api/builds#list-builds");
    expect(await read("api/builds")).not.toContain("<script>(");
  });
});
