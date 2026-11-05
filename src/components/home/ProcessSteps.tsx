"use client";

import { motion } from "motion/react";

import { fadeUp, stagger } from "@/components/motion/tokens";
import { SectionHeading, TextLink } from "@/components/ui/SectionHeading";

type Step = { title?: string | null; body?: string | null };

export function ProcessSteps({
  eyebrow,
  heading,
  body,
  steps,
  linkLabel,
  linkUrl,
}: {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  steps: Step[];
  linkLabel?: string | null;
  linkUrl?: string | null;
}) {
  const visible = (steps ?? []).filter((step) => step?.title);
  if (visible.length === 0) return null;

  return (
    <section className="border-t border-border bg-surface">
      <div className="shell py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={eyebrow} title={heading} lead={body} as="h2" />
          {linkLabel && linkUrl ? (
            <div className="pb-2">
              <TextLink href={linkUrl}>{linkLabel}</TextLink>
            </div>
          ) : null}
        </div>

        <motion.ol
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6"
        >
          {visible.map((step, index) => (
            <motion.li key={`${step.title}-${index}`} variants={fadeUp} className="relative">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-accent font-mono text-sm font-semibold text-accent">
                  {index + 1}
                </span>
                {index < visible.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="hidden h-px flex-1 bg-border lg:block"
                  />
                ) : null}
              </div>
              <h3 className="mt-5 font-display text-base font-semibold leading-snug">
                {step.title}
              </h3>
              {step.body ? (
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              ) : null}
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
