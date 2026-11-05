"use client";

import { motion } from "motion/react";

import { fadeUp, stagger } from "@/components/motion/tokens";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";

type Step = { title?: string | null; body?: string | null };

export function CompoundingFeature({
  eyebrow,
  heading,
  body,
  steps,
  ctaLabel,
  ctaUrl,
}: {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  steps: Step[];
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}) {
  const visibleSteps = (steps ?? []).filter((step) => step?.title);
  if (visibleSteps.length === 0) return null;

  return (
    <section className="relative isolate overflow-hidden bg-primary text-white">
      {/* Restrained molecular decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <svg className="absolute right-[-6%] top-[-18%] h-[130%] w-[55%] opacity-[0.14]" viewBox="0 0 600 600" fill="none">
          <circle cx="300" cy="300" r="220" stroke="#7B5CFF" strokeWidth="1" />
          <circle cx="300" cy="300" r="150" stroke="#FF8A3D" strokeWidth="1" />
          <circle cx="300" cy="300" r="80" stroke="#FFD23F" strokeWidth="1" />
          <circle cx="300" cy="80" r="10" fill="#7B5CFF" />
          <circle cx="450" cy="300" r="8" fill="#FF8A3D" />
          <circle cx="300" cy="450" r="9" fill="#FFD23F" />
          <circle cx="150" cy="300" r="7" fill="#18A94A" />
          <line x1="300" y1="80" x2="450" y2="300" stroke="#7B5CFF" strokeWidth="1" />
          <line x1="450" y1="300" x2="300" y2="450" stroke="#FF8A3D" strokeWidth="1" />
          <line x1="300" y1="450" x2="150" y2="300" stroke="#FFD23F" strokeWidth="1" />
          <line x1="150" y1="300" x2="300" y2="80" stroke="#18A94A" strokeWidth="1" />
        </svg>
      </div>

      <div className="shell grid gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="lg:col-span-5">
          <Eyebrow className="text-accent">{eyebrow}</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-h2 font-semibold tracking-tight">
            {heading}
          </h2>
          {body ? <p className="mt-5 max-w-lg text-lead text-white/75">{body}</p> : null}
          {ctaLabel && ctaUrl ? (
            <div className="mt-8">
              <ButtonLink href={ctaUrl} variant="accent">
                {ctaLabel}
              </ButtonLink>
            </div>
          ) : null}
        </div>

        <motion.ol
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="lg:col-span-6 lg:col-start-7"
        >
          {visibleSteps.map((step, index) => (
            <motion.li
              key={`${step.title}-${index}`}
              variants={fadeUp}
              className="flex gap-5 border-t border-white/15 py-6 first:border-t-0 first:pt-0"
            >
              <span className="font-mono text-meta uppercase tracking-widest text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                {step.body ? (
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/70">
                    {step.body}
                  </p>
                ) : null}
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
