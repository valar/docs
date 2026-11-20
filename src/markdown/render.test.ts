// @vitest-environment node
import { describe, expect, it } from "vitest";
import { renderDoc, slugger } from "./render";
import { parseSidebar, resolveLink, routeFor } from "./site";

const files = new Set(["api/builds.md", "api/artifacts.md", "stacks/index.md", "stacks/docker.md"]);
const exists = (file: string) => files.has(file);

describe("resolveLink", () => {
  const cases = [
    { name: "bare paths resolve from the content root", href: "api/builds.md", from: "api/artifacts.md", want: { file: "api/builds.md", hash: "" } },
    { name: "relative paths resolve from the page", href: "../api/builds.md#list-builds", from: "stacks/docker.md", want: { file: "api/builds.md", hash: "list-builds" } },
    { name: "bare paths fall back to the page's folder", href: "docker.md", from: "stacks/index.md", want: { file: "stacks/docker.md", hash: "" } },
    { name: "absolute paths resolve from the content root", href: "/stacks/index.md", from: "api/builds.md", want: { file: "stacks/index.md", hash: "" } },
    { name: "missing pages are still reported", href: "api/missing.md", from: "api/builds.md", want: { file: "api/missing.md", hash: "" } },
    { name: "external links are left alone", href: "https://console.valar.dev", from: "api/builds.md", want: null },
    { name: "in-page anchors are left alone", href: "#errors", from: "api/index.md", want: null },
  ];
  for (const tc of cases) {
    it(tc.name, () => expect(resolveLink(tc.href, tc.from, exists)).toEqual(tc.want));
  }
});

describe("routeFor", () => {
  it("drops .md and index", () => {
    expect(routeFor("getting-started/cli-setup.md")).toBe("/getting-started/cli-setup");
    expect(routeFor("stacks/index.md")).toBe("/stacks");
  });
});

describe("slugger", () => {
  it("matches docsify's heading ids", () => {
    const slug = slugger();
    expect(slug("Enabling &amp; disabling the schedule")).toBe("enabling-amp-disabling-the-schedule");
    expect(slug("The <code>valar</code> CLI")).toBe("the-valar-cli");
    expect(slug("2 Steps")).toBe("_2-steps");
    expect(slug("Errors")).toBe("errors");
    expect(slug("Errors")).toBe("errors-1");
  });
});

describe("parseSidebar", () => {
  it("reads groups, linked groups and pages in order", () => {
    const sidebar = parseSidebar("* Getting started\n    * [Setup](getting-started/cli-setup.md)\n* [Stacks](stacks/index.md)\n    * [docker](stacks/docker.md)\n");
    expect(sidebar).toEqual([
      { title: "Getting started", file: undefined, items: [{ title: "Setup", file: "getting-started/cli-setup.md" }] },
      { title: "Stacks", file: "stacks/index.md", items: [{ title: "docker", file: "stacks/docker.md" }] },
    ]);
  });

  it("rejects lines it can't place", () => {
    expect(() => parseSidebar("    * [Orphan](a.md)")).toThrow(/below a group/);
  });
});

describe("renderDoc", () => {
  it("rewrites links to other pages and records them", async () => {
    const doc = await renderDoc("# Builds\n\nSee [artifacts](api/artifacts.md#upload) and [stacks](../stacks/index.md).", "api/builds.md", exists);
    expect(doc.html).toContain('<a href="/api/artifacts#upload">artifacts</a>');
    expect(doc.html).toContain('<a href="/stacks">stacks</a>');
    expect(doc.links.map((link) => link.file)).toEqual(["api/artifacts.md", "stacks/index.md"]);
  });

  it("takes the title from the first heading and the description from the first paragraph", async () => {
    const doc = await renderDoc("# The `valar` CLI\n\n> Aside.\n\nInstall **it** & run it.\n", "a.md", exists);
    expect(doc.title).toBe("The valar CLI");
    expect(doc.description).toBe("Install it & run it.");
  });

  it("gives headings ids and links them to themselves", async () => {
    const doc = await renderDoc("# Title\n\n## Enabling & disabling\n", "a.md", exists);
    expect(doc.ids).toEqual(["title", "enabling-amp-disabling"]);
    expect(doc.html).toContain('<h2 id="enabling-amp-disabling"><a href="#enabling-amp-disabling">Enabling &amp; disabling</a></h2>');
  });

  it("highlights code at build time", async () => {
    const doc = await renderDoc('```go\nfunc main() {}\n```\n\n```\nplain <text>\n```\n', "a.md", exists);
    expect(doc.html).toMatch(/<pre class="shiki github-light" tabindex="0"><code><span class="line"><span style="color:#[0-9A-F]+">func/);
    expect(doc.html).toContain("plain &#x3C;text>");
  });

  it("renders GitHub tables", async () => {
    const doc = await renderDoc("| Key | Value |\n| --- | --- |\n| a | b |\n", "a.md", exists);
    expect(doc.html).toContain('<div class="table-scroll"><table>');
    expect(doc.html).toContain("<td>b</td>");
  });

  it("renders GitHub alerts as callouts and other quotes as quotes", async () => {
    const doc = await renderDoc("> [!WARNING]\n> Don't [push](api/builds.md).\n\n> **Important**: plain\n", "a.md", exists);
    expect(doc.html).toContain('<blockquote class="alert alert-warning">\n<p class="alert-title">Warning</p>\n<p>Don&#39;t <a href="/api/builds">push</a>.</p>');
    expect(doc.html).toContain("<blockquote>\n<p><strong>Important</strong>: plain</p>");
  });
});
