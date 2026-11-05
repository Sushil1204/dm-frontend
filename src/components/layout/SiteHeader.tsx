"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { durations, easings, slidePanel } from "@/components/motion/tokens";
import { buttonClassName } from "@/components/ui/Button";
import type { HeaderSetting, SiteSetting } from "@/payload-types";

type Props = {
  header: HeaderSetting;
  site: SiteSetting;
};

function useActivePath() {
  const pathname = usePathname();
  const isActive = useCallback(
    (url: string) => {
      if (url === "/") return pathname === "/";
      return pathname === url || pathname.startsWith(`${url}/`);
    },
    [pathname],
  );
  return { pathname, isActive };
}

export function SiteHeader({ header, site }: Props) {
  const { pathname, isActive } = useActivePath();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

  /* Header surface transition on scroll (state initialised after first frame). */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* Close menus when the route changes (adjust state during render). */
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpenMenu(null);
    setDrawerOpen(false);
  }

  /* Escape closes dropdown or drawer; outside click closes dropdown. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        if (drawerOpen) setDrawerOpen(false);
      }
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (openMenu && !target.closest("[data-desktop-nav]")) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [openMenu, drawerOpen]);

  /* Drawer: lock scroll, manage focus, restore on close. */
  useEffect(() => {
    if (!drawerOpen) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const toggleButton = toggleButtonRef.current;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const panel = drawerRef.current;
    const first = panel?.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    first?.focus();

    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusables.length === 0) return;
      const firstEl = focusables[0]!;
      const lastEl = focusables[focusables.length - 1]!;
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener("keydown", trap);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", trap);
      (previousFocus ?? toggleButton)?.focus?.();
    };
  }, [drawerOpen]);

  const logoUrl = site.logo && typeof site.logo === "object" ? site.logo.url : null;
  const logoAlt = `${site.companyName} logo`;
  const navItems = header.navItems ?? [];

  return (
    <>
    <header
      className={`sticky top-0 z-40 bg-surface/95 backdrop-blur-md transition-[border-color,box-shadow] duration-200 ${
        scrolled ? "border-b border-border shadow-[0_1px_12px_rgba(16,42,114,0.06)]" : "border-b border-transparent"
      }`}
      data-sticky={header.sticky ? "true" : "false"}
    >
      <div className="shell flex h-[var(--header-height)] items-center justify-between gap-6">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label={`${site.companyName} — home`}
        >
          <Image
            src={logoUrl || "/brand/daman-plastics-logo.png"}
            alt={logoAlt}
            width={2172}
            height={724}
            sizes="(min-width: 1024px) 192px, 168px"
            className="h-14 w-auto object-contain lg:h-16"
            priority
          />
        </Link>

        <nav
          aria-label="Primary"
          data-desktop-nav
          className="hidden items-center gap-7 lg:flex"
        >
          {navItems.map((item) => {
            const hasChildren = (item.children?.length ?? 0) > 0;
            const active = isActive(item.url);

            if (!hasChildren) {
              return (
                <Link
                  key={item.label}
                  href={item.url}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-2 text-[0.92rem] font-medium transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 hover:text-accent hover:after:scale-x-100 ${
                    active ? "text-accent after:scale-x-100" : "text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }

            const open = openMenu === item.label;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-haspopup="true"
                  onClick={() => setOpenMenu(open ? null : item.label)}
                  className={`relative flex items-center gap-1.5 py-2 text-[0.92rem] font-medium transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:bg-accent after:transition-transform after:duration-200 ${
                    active
                      ? "text-accent after:scale-x-100"
                      : "text-foreground after:scale-x-0 hover:text-accent hover:after:scale-x-100"
                  }`}
                >
                  {item.label}
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  >
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </button>

                <AnimatePresence>
                  {open ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: durations.control, ease: easings.enter }}
                      className="absolute left-0 top-full z-50 pt-3"
                    >
                      <ul className="min-w-56 rounded-[var(--radius-card)] border border-border bg-surface p-2 shadow-[0_12px_32px_rgba(16,42,114,0.10)]">
                        {item.children?.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.url}
                              className="block rounded-md px-3 py-2.5 text-sm text-foreground transition-colors duration-150 hover:bg-surface-muted hover:text-accent"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Wrap so `hidden` is not overridden by the button's own inline-flex. */}
          <div className="hidden md:block">
            <Link
              href={header.ctaUrl || "/request-a-quote"}
              className={buttonClassName("primary", "sm")}
            >
              {header.ctaLabel || "Request a Quote"}
            </Link>
          </div>
          <button
            ref={toggleButtonRef}
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-foreground transition-colors duration-200 hover:bg-surface-muted lg:hidden"
            aria-expanded={drawerOpen}
            aria-controls="mobile-navigation"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            onClick={() => setDrawerOpen((v) => !v)}
          >
            <span className="sr-only">{drawerOpen ? "Close menu" : "Open menu"}</span>
            <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
              {drawerOpen ? (
                <path d="M1 1l18 12M19 1L1 13" stroke="currentColor" strokeWidth="1.6" fill="none" />
              ) : (
                <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" strokeWidth="1.6" fill="none" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>

    {/* Rendered outside the header: its backdrop-filter would otherwise
        become the containing block for this fixed drawer. */}
    <AnimatePresence>
      {drawerOpen ? (
          <motion.div
            key="mobile-drawer"
            className="fixed inset-0 z-50 lg:hidden"
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default bg-primary/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: durations.micro }}
            />
            <motion.aside
              id="mobile-navigation"
              ref={drawerRef}
              variants={slidePanel}
              className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-surface shadow-2xl"
              aria-label="Mobile navigation"
            >
              <div className="flex h-[var(--header-height)] items-center justify-between border-b border-border px-6">
                <Image
                  src={logoUrl || "/brand/daman-plastics-logo.png"}
                  alt={`${site.companyName} logo`}
                  width={2172}
                  height={724}
                  sizes="168px"
                  className="h-14 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-md border border-border transition-colors hover:bg-surface-muted"
                >
                  <svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </button>
              </div>

              <motion.nav
                aria-label="Mobile"
                className="flex-1 overflow-y-auto px-6 py-8"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              >
                <ul className="flex flex-col">
                  {navItems.map((item) => (
                    <motion.li
                      key={item.label}
                      variants={{
                        hidden: { opacity: 0, x: 16 },
                        show: { opacity: 1, x: 0, transition: { duration: durations.control, ease: easings.enter } },
                      }}
                      className="border-b border-border"
                    >
                      <Link
                        href={item.url}
                        aria-current={isActive(item.url) ? "page" : undefined}
                        className={`block py-4 font-display text-xl font-semibold transition-colors ${
                          isActive(item.url) ? "text-accent" : "text-foreground hover:text-accent"
                        }`}
                      >
                        {item.label}
                      </Link>
                      {item.children?.length ? (
                        <ul className="mb-3 flex flex-col gap-1 pl-1">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <Link
                                href={child.url}
                                className="block py-1.5 text-sm text-muted transition-colors hover:text-foreground"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </motion.li>
                  ))}
                </ul>
              </motion.nav>

              <div className="border-t border-border p-6">
                <Link
                  href={header.ctaUrl || "/request-a-quote"}
                  className={`${buttonClassName("primary", "md")} w-full`}
                  onClick={() => setDrawerOpen(false)}
                >
                  {header.ctaLabel || "Request a Quote"}
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
    </AnimatePresence>
    </>
  );
}
