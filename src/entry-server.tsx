import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { App } from "./App";
import { legacyPath } from "./legacy";
import { loadDoc, pagePath, pageTitle } from "./site";

export { paths } from "./site";

const escape = (text: string) => text.replace(/[&<>"]/g, (char) => `&#${char.charCodeAt(0)};`);

// Old docsify links point at /#/page; send them to the page's own URL.
const redirect = `<script>(function () { var path = (${legacyPath})(location.hash); if (path) location.replace(path); })();</script>`;

// render returns a page's markup and the tags for its <head>.
export async function render(url: string): Promise<{ html: string; head: string }> {
  const doc = await loadDoc(pagePath(url));
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  const head = [
    `<title>${escape(pageTitle(url, doc))}</title>`,
    doc?.description && `<meta name="description" content="${escape(doc.description)}" />`,
    url === "/" && redirect,
  ];
  return { html, head: head.filter(Boolean).join("\n    ") };
}
