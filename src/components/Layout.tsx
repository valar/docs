import { Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { nav, pagePath } from "../site";
import { Logo } from "./Logo";

// The underline below each item grows on hover; the current page gets a red dot in the gutter.
const navItem =
  "relative my-2 block w-fit after:relative after:top-0.5 after:block after:h-[3px] after:w-0 after:bg-vred after:transition-[width] after:duration-500 after:ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] hover:after:w-full motion-reduce:after:transition-none";
const currentItem = "before:absolute before:-left-4 before:text-vred before:content-['•']";
const groupLabel = "text-xs font-bold uppercase tracking-widest text-gray-400";

function NavItem({ to, className, children, onNavigate }: { to: string; className: string; children: ReactNode; onNavigate?: () => void }) {
  const current = pagePath(useLocation().pathname) === to;
  return (
    <Link to={to} onClick={onNavigate} aria-current={current ? "page" : undefined} className={`${navItem} ${className} ${current ? currentItem : ""}`}>
      {children}
    </Link>
  );
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Documentation">
      {nav.map((group) => (
        <div key={group.title} className="mt-6 first:mt-0">
          {group.path ? (
            <NavItem to={group.path} onNavigate={onNavigate} className={`${groupLabel} hover:text-white`}>
              {group.title}
            </NavItem>
          ) : (
            <p className={`${groupLabel} my-2`}>{group.title}</p>
          )}
          {group.items.map((item) => (
            <NavItem key={item.path} to={item.path} onNavigate={onNavigate} className="text-white">
              {item.title}
            </NavItem>
          ))}
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex w-fit items-center gap-3">
      <Logo />
      <span className="rounded-sm bg-white px-1.5 py-0.5 text-xs font-bold uppercase tracking-widest text-vblue">Docs</span>
    </Link>
  );
}

function MobileMenu({ onClose, onNavigate }: { onClose: () => void; onNavigate: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-30 overflow-y-auto bg-vblue px-6 py-5 text-white sm:px-12 lg:hidden"
    >
      <div className="mb-8 flex items-center justify-between">
        <Brand />
        <button ref={closeButton} type="button" aria-label="Close menu" onClick={onClose} className="-m-2.5 p-2.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <Navigation onNavigate={onNavigate} />
    </div>
  );
}

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButton.current?.focus();
  }, []);
  const leaveMenu = useCallback(() => setMenuOpen(false), []);
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="hidden w-72 shrink-0 bg-vblue lg:block">
        <aside className="sticky top-0 h-dvh overflow-y-auto px-8 py-8 text-white">
          <div className="mt-2 mb-8">
            <Brand />
          </div>
          <Navigation />
        </aside>
      </div>

      <header className="flex items-center justify-between bg-vblue px-6 py-5 text-white sm:px-12 lg:hidden">
        <Brand />
        <button
          ref={menuButton}
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="-m-2.5 p-2.5"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>
      {menuOpen && <MobileMenu onClose={closeMenu} onNavigate={leaveMenu} />}

      <main className="min-w-0 flex-1">
        <Suspense>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
