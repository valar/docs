import { readdir, readFile } from "node:fs/promises";
import { dirname, join, normalize } from "node:path/posix";
import { sep } from "node:path";
import type { NavGroup } from "virtual:docs";

// routeFor maps a content file to its URL path: "api/builds.md" is served at
// "/api/builds", "stacks/index.md" at "/stacks".
export function routeFor(file: string): string {
  return "/" + file.replace(/\.md$/, "").replace(/(^|\/)index$/, "");
}

export interface LinkTarget {
  file: string;
  hash: string;
}

// resolveLink finds the content file a Markdown link points to, or returns null
// for links that don't point to a Markdown file. As in docsify, bare paths
// resolve from the content root; ./ and ../ paths resolve from the linking page.
export function resolveLink(href: string, from: string, exists: (file: string) => boolean): LinkTarget | null {
  if (/^([a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)) return null;
  const [path = "", hash = ""] = href.split("#", 2);
  if (!path.endsWith(".md")) return null;
  const relative = normalize(join(dirname(from), path));
  const candidates = path.startsWith("/") ? [path.slice(1)] : path.startsWith(".") ? [relative] : [normalize(path), relative];
  return { file: candidates.find(exists) ?? candidates[0]!, hash };
}

export interface SidebarEntry {
  title: string;
  file?: string;
  items: { title: string; file: string }[];
}

// parseSidebar reads _sidebar.md: top-level entries are groups (optionally
// linked to a page), indented entries are the pages in the group.
export function parseSidebar(source: string): SidebarEntry[] {
  const groups: SidebarEntry[] = [];
  for (const line of source.split("\n")) {
    if (!line.trim()) continue;
    const match = /^(\s*)[*-]\s+(?:\[([^\]]+)\]\(([^)\s]+)\)|(.+))$/.exec(line);
    if (!match) throw new Error(`_sidebar.md: cannot parse "${line}"`);
    const [, indent, title, href, label] = match;
    const file = href?.replace(/^\.?\//, "");
    if (!indent) {
      groups.push({ title: (title ?? label)!.trim(), file, items: [] });
    } else if (groups.length && title && file) {
      groups.at(-1)!.items.push({ title, file });
    } else {
      throw new Error(`_sidebar.md: "${line.trim()}" must be a link below a group`);
    }
  }
  return groups;
}

export function navFor(sidebar: SidebarEntry[]): NavGroup[] {
  return sidebar.map(({ title, file, items }) => ({
    title,
    ...(file && { path: routeFor(file) }),
    items: items.map((item) => ({ title: item.title, path: routeFor(item.file) })),
  }));
}

export interface Site {
  files: string[];
  sidebar: SidebarEntry[];
}

export async function loadSite(dir: string): Promise<Site> {
  const entries = await readdir(dir, { recursive: true });
  const files = entries
    .map((entry) => entry.split(sep).join("/"))
    .filter((file) => file.endsWith(".md") && file !== "_sidebar.md")
    .sort();
  const sidebar = parseSidebar(await readFile(join(dir, "_sidebar.md"), "utf8"));
  return { files, sidebar };
}
