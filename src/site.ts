import { use } from "react";
import { homepage, nav, pages, type Doc, type NavItem } from "virtual:docs";

export { nav };

export const siteName = "Valar Docs";

// pagePath maps a URL path to its page: "/" shows the homepage, and a trailing
// slash (nginx adds one when serving a page's directory) is ignored.
export function pagePath(pathname: string): string {
  const path = pathname.replace(/\/+$/, "");
  return path || homepage;
}

export const paths = ["/", ...Object.keys(pages)];

const loaded = new Map<string, Doc>();
const loading = new Map<string, Promise<Doc>>();
const firstPath = typeof window === "undefined" ? undefined : pagePath(window.location.pathname);

// loadDoc fetches a page's content, or returns undefined for unknown paths.
export function loadDoc(path: string): Promise<Doc> | undefined {
  const load = pages[path];
  if (!load) return undefined;
  let promise = loading.get(path);
  if (!promise) {
    promise = load().then(
      ({ default: doc }) => {
        loaded.set(path, doc);
        return doc;
      },
      (error: unknown) => {
        loading.delete(path);
        // A deploy replaced the page chunks since this tab loaded: get the page from the server instead.
        if (typeof window === "undefined" || path === firstPath) throw error;
        window.location.assign(path);
        return new Promise<Doc>(() => {});
      },
    );
    loading.set(path, promise);
  }
  return promise;
}

export function useDoc(path: string): Doc | undefined {
  const promise = loadDoc(path);
  return loaded.get(path) ?? (promise && use(promise));
}

const sequence: NavItem[] = nav.flatMap(({ title, path, items }) => (path ? [{ title, path }, ...items] : items));

export function neighbours(path: string): { previous?: NavItem; next?: NavItem } {
  const index = sequence.findIndex((item) => item.path === path);
  return index < 0 ? {} : { previous: sequence[index - 1], next: sequence[index + 1] };
}

export function pageTitle(pathname: string, doc: Doc | undefined): string {
  if (!doc) return `Page not found – ${siteName}`;
  if (pathname === "/") return siteName;
  const path = pagePath(pathname);
  return `${sequence.find((item) => item.path === path)?.title ?? doc.title} – ${siteName}`;
}
