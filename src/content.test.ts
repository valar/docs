// @vitest-environment node
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { renderDoc, type RenderedDoc } from "./markdown/render";
import { loadSite, type Site } from "./markdown/site";

// Checks the real pages in content/: what the sidebar and links point at must exist.
const dir = resolve("content");
let site: Site;
const docs = new Map<string, RenderedDoc>();
const sources = new Map<string, string>();

beforeAll(async () => {
  site = await loadSite(dir);
  const files = new Set(site.files);
  for (const file of site.files) {
    const source = await readFile(join(dir, file), "utf8");
    sources.set(file, source);
    docs.set(file, await renderDoc(source, file, (target) => files.has(target)));
  }
});

describe("content", () => {
  it("has pages", () => {
    expect(site.files.length).toBeGreaterThan(0);
  });

  it("lists only existing pages in the sidebar", () => {
    const entries = site.sidebar.flatMap((group) => [...(group.file ? [group.file] : []), ...group.items.map((item) => item.file)]);
    expect(entries.length).toBeGreaterThan(0);
    expect(entries.filter((file) => !site.files.includes(file))).toEqual([]);
  });

  it("links only to existing pages and headings", () => {
    const broken = [...docs].flatMap(([file, doc]) =>
      doc.links
        .filter((link) => !docs.has(link.file) || (link.hash && !docs.get(link.file)!.ids.includes(link.hash)))
        .map((link) => `${file}: ${link.href}`),
    );
    expect(broken).toEqual([]);
  });

  it("gives every page a title", () => {
    expect([...docs].filter(([file, doc]) => doc.title === file).map(([file]) => file)).toEqual([]);
  });

  it("uses GitHub alerts instead of docsify's ?> and !> callouts", () => {
    expect([...sources].filter(([, source]) => /^\s*[?!]> /m.test(source)).map(([file]) => file)).toEqual([]);
  });
});
