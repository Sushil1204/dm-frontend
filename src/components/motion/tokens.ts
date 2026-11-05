import type { Variants } from "motion/react";

/**
 * Central motion tokens. Every route shares these — no one-off timings.
 * Durations follow design.md: micro 120–220ms, cards/menus 180–280ms,
 * section reveals 450–700ms, route transitions 180–300ms.
 */
export const durations = {
  micro: 0.18,
  control: 0.24,
  reveal: 0.6,
  route: 0.24,
  ambient: 16,
} as const;

export const easings = {
  enter: [0.22, 1, 0.36, 1] as const,
  state: [0.4, 0, 0.2, 1] as const,
};

export const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
} satisfies Variants;

export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.reveal, ease: easings.enter },
  },
} satisfies Variants;

export const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: durations.reveal, ease: easings.enter },
  },
} satisfies Variants;

/** Masked image reveal — clip-path wipe, no layout-thrashing properties. */
export const imageReveal = {
  hidden: { opacity: 0, clipPath: "inset(0 0 12% 0)", scale: 1.03 },
  show: {
    opacity: 1,
    clipPath: "inset(0 0 0% 0)",
    scale: 1,
    transition: { duration: 0.75, ease: easings.enter },
  },
} satisfies Variants;

export const slidePanel = {
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: durations.control, ease: easings.enter },
  },
  exit: {
    opacity: 0,
    x: 24,
    transition: { duration: durations.micro, ease: easings.state },
  },
} satisfies Variants;

/** Hero load choreography (staggered entrance; heading is never hidden long). */
export const heroItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easings.enter },
  },
} satisfies Variants;

export const heroStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
} satisfies Variants;
