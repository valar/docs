import { Marked, Renderer, type Token, type Tokens } from "marked";
import { bundledLanguages, createHighlighter, type Highlighter } from "shiki";
import type { Doc } from "virtual:docs";
import { resolveLink, routeFor, type LinkTarget } from "./site.ts";

const theme = "github-light";
let highlighter: Promise<Highlighter> | undefined;

const alerts: Record<string, string> = { NOTE: "Note", TIP: "Tip", IMPORTANT: "Important", WARNING: "Warning", CAUTION: "Caution" };

export interface RenderedDoc extends Doc {
  ids: string[];
  links: (LinkTarget & { href: string })[];
}

// slugger reproduces docsify's heading ids, so old ?id= links still land on
// the same heading.
export function slugger() {
  const seen = new Map<string, number>();
  return (html: string) => {
    const slug = html
      .trim()
      .replace(/[A-Z]+/g, (s) => s.toLowerCase())
      .replace(/<[^>]+>/g, "")
      .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "")
      .replace(/\s/g, "-")
      .replace(/-+/g, "-")
      .replace(/^(\d)/, "_$1");
    const count = seen.get(slug) ?? 0;
    seen.set(slug, count + 1);
    return count ? `${slug}-${count}` : slug;
  };
}

function plain(tokens: Token[]): string {
  return tokens
    .map((token) => ("tokens" in token && token.tokens ? plain(token.tokens) : token.type === "html" ? "" : "text" in token ? token.text : ""))
    .join("");
}

function excerpt(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.lastIndexOf(" ", max - 1);
  return clean.slice(0, cut > 0 ? cut : max - 1) + "…";
}

// renderDoc turns a content file into HTML, rewriting links to other pages to
// their site paths and highlighting code blocks.
export async function renderDoc(source: string, file: string, exists: (file: string) => boolean): Promise<RenderedDoc> {
  const shiki = await (highlighter ??= createHighlighter({ themes: [theme], langs: [] }));
  const marked = new Marked({ gfm: true });
  const slug = slugger();
  const ids: string[] = [];
  const links: RenderedDoc["links"] = [];
  const langs = new Set<string>();
  const alertOf = new Map<Token, string>();

  const tokens = marked.lexer(source);
  marked.walkTokens(tokens, (token) => {
    if (token.type === "code" && token.lang) langs.add(token.lang.split(/\s/)[0]!);
    if (token.type === "link") {
      const target = resolveLink(token.href, file, exists);
      if (!target) return;
      links.push({ ...target, href: token.href });
      token.href = routeFor(target.file) + (target.hash && `#${target.hash}`);
    }
    if (token.type === "blockquote" && token.tokens) {
      const first = token.tokens[0];
      const match = first?.type === "paragraph" && /^\[!(\w+)\][^\S\n]*(\n|$)/.exec(first.raw);
      if (match && match[1]!.toUpperCase() in alerts) {
        alertOf.set(token, match[1]!.toUpperCase());
        token.tokens.splice(0, 1, ...marked.lexer(first.raw.slice(match[0].length)));
      }
    }
  });
  await Promise.all(
    [...langs].filter((lang) => lang in bundledLanguages && !shiki.getLoadedLanguages().includes(lang)).map((lang) => shiki.loadLanguage(lang as keyof typeof bundledLanguages)),
  );

  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens);
        const id = slug(html);
        ids.push(id);
        const inner = depth > 1 && !html.includes("<a ") ? `<a href="#${id}">${html}</a>` : html;
        return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
      },
      code({ text, lang }) {
        const name = lang?.split(/\s/)[0] ?? "";
        return shiki.codeToHtml(text, {
          lang: shiki.getLoadedLanguages().includes(name) ? name : "text",
          theme,
          transformers: [{ pre: (node) => void delete node.properties.style }],
        });
      },
      blockquote(token) {
        const alert = alertOf.get(token);
        if (!alert) return false;
        const body = this.parser.parse(token.tokens);
        return `<blockquote class="alert alert-${alert.toLowerCase()}">\n<p class="alert-title">${alerts[alert]}</p>\n${body}</blockquote>\n`;
      },
      table(token) {
        return `<div class="table-scroll">${Renderer.prototype.table.call(this, token)}</div>\n`;
      },
    },
  });

  const heading = tokens.find((token): token is Tokens.Heading => token.type === "heading" && token.depth === 1);
  const paragraph = tokens.find((token): token is Tokens.Paragraph => token.type === "paragraph");
  return {
    title: heading ? plain(heading.tokens) : file,
    description: paragraph ? excerpt(plain(paragraph.tokens)) : "",
    html: marked.parser(tokens),
    ids,
    links,
  };
}
