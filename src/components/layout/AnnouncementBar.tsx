"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { SiteSetting } from "@/payload-types";

type Announcement = NonNullable<SiteSetting["announcement"]>;

const STORAGE_KEY = "dp-announcement-dismissed";

export function AnnouncementBar({ announcement }: { announcement: Announcement }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      dismissed = false;
    }
    if (dismissed) return;
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* storage unavailable — dismissal stays in-memory */
    }
  };

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.div
          key="announcement"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
          className="relative z-50 overflow-hidden bg-primary text-primary-foreground"
        >
          <div className="shell flex min-h-10 items-center justify-between gap-4 py-2 text-sm">
            <p className="flex-1">{announcement.message}</p>
            <div className="flex items-center gap-3">
              {announcement.ctaLabel && announcement.ctaUrl ? (
                <Link
                  href={announcement.ctaUrl}
                  className="underline underline-offset-4 hover:opacity-80"
                >
                  {announcement.ctaLabel}
                </Link>
              ) : null}
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss announcement"
                className="rounded p-1 transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path
                    d="M1 1l12 12M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
