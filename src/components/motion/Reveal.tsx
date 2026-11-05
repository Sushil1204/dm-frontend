"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { fadeUp, imageReveal, stagger } from "./tokens";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** How the container reveals its children as they enter the viewport. */
  variant?: "up" | "fade" | "stagger" | "mask";
  /** ms before animation starts (default 0). */
  delay?: number;
};

/**
 * Scroll reveal — triggers once, never re-animates.
 * Content renders in its final position first: if JS or the animation
 * library fails, everything stays visible (opacity defaults to 1 without JS
 * because motion applies initial styles only after hydration).
 */
export function Reveal({ children, className, variant = "up", delay = 0 }: RevealProps) {
  const reducedMotion = useReducedMotion();

  const base =
    variant === "stagger" ? stagger : variant === "fade" ? fadeUp : variant === "mask" ? imageReveal : fadeUp;

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={base}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ delay: delay / 1000 }}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </motion.div>
  );
}

/** Container that staggers direct children when revealed. */
export function RevealStagger({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  );
}

/** Child item for use inside RevealStagger. */
export function RevealItem({
  children,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article" | "section";
}) {
  const reducedMotion = useReducedMotion();
  const Comp = motion[As] as typeof motion.div;

  if (reducedMotion) {
    return <As className={className}>{children}</As>;
  }

  return (
    <Comp className={className} variants={fadeUp}>
      {children}
    </Comp>
  );
}
