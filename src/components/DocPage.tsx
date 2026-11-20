import { useEffect, useRef, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import type { NavItem } from "virtual:docs";
import { neighbours, pagePath, pageTitle, useDoc } from "../site";

function PagerLink({ item, label, className = "" }: { item: NavItem; label: string; className?: string }) {
  return (
    <Link to={item.path} className={`group block ${className}`}>
      <span className="block text-xs font-bold uppercase tracking-widest text-gray-500">{label}</span>
      <span className="mt-1 block font-medium text-vrad group-hover:text-vred">{item.title}</span>
    </Link>
  );
}

function Pager({ path }: { path: string }) {
  const { previous, next } = neighbours(path);
  if (!previous && !next) return null;
  return (
    <nav aria-label="Previous and next page" className="mt-16 grid grid-cols-2 gap-6 border-t border-gray-200 pt-6">
      {previous ? <PagerLink item={previous} label="Previous" /> : <span />}
      {next && <PagerLink item={next} label="Next" className="text-right" />}
    </nav>
  );
}

function NotFound() {
  return (
    <>
      <h1 className="text-2xl font-semibold sm:text-3xl">Page not found</h1>
      <p className="mt-8">
        <Link to="/" className="text-vrad hover:text-vred">
          Back to the docs
        </Link>
      </p>
    </>
  );
}

// Scroll to the top, or to the linked heading, after client-side navigation.
function useScrollOnNavigate(pathname: string, hash: string) {
  const shown = useRef(pathname + hash);
  useEffect(() => {
    if (shown.current === pathname + hash) return;
    shown.current = pathname + hash;
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
}

export function DocPage() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const path = pagePath(pathname);
  const doc = useDoc(path);
  const title = pageTitle(pathname, doc);
  useEffect(() => {
    document.title = title;
  }, [title]);
  useScrollOnNavigate(pathname, hash);

  // Links inside the Markdown are plain anchors; route the internal ones client-side.
  function followLink(event: MouseEvent<HTMLElement>) {
    const link = (event.target as Element).closest("a");
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || (url.pathname === window.location.pathname && url.hash)) return;
    event.preventDefault();
    void navigate(url.pathname + url.search + url.hash);
  }

  return (
    <div className="max-w-3xl px-6 py-8 sm:px-12 sm:py-12">
      {doc ? (
        <>
          <article className="prose prose-gray max-w-none" onClick={followLink} dangerouslySetInnerHTML={{ __html: doc.html }} />
          <Pager path={path} />
        </>
      ) : (
        <NotFound />
      )}
    </div>
  );
}
