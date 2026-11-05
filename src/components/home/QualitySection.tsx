"use client";

import { motion } from "motion/react";
import Image from "next/image";

import { fadeUp, stagger } from "@/components/motion/tokens";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading, TextLink } from "@/components/ui/SectionHeading";
import { resolveMedia } from "@/lib/media";
import type { Media } from "@/payload-types";

type Point = { title?: string | null; body?: string | null };

function QualityPoints({ points }: { points: Point[] }) {
  return (
    <motion.ul
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2"
    >
      {points.map((point, index) => (
        <motion.li key={`${point.title}-${index}`} variants={fadeUp} className="flex gap-3">
          <span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
          <div>
            <p className="font-display text-sm font-semibold">{point.title}</p>
            {point.body ? (
              <p className="mt-1 text-sm leading-relaxed text-muted">{point.body}</p>
            ) : null}
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}

export function QualitySection({
  eyebrow,
  heading,
  body,
  image,
  points,
  linkLabel,
  linkUrl,
}: {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  image?: Media | number | null;
  points: Point[];
  linkLabel?: string | null;
  linkUrl?: string | null;
}) {
  const media = resolveMedia(image ?? null);
  const src = media?.url || "/media/quality.png";
  const visible = (points ?? []).filter((point) => point?.title);

  return (
    <section className="bg-surface-muted">
      <div className="shell grid items-center gap-10 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <Reveal className="order-2 lg:order-1">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
            <Image
              src={src}
              alt={media?.alt || "Illustrative placeholder â€” laboratory testing"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <SectionHeading eyebrow={eyebrow} title={heading} lead={body} as="h2" />
          </Reveal>

          {visible.length > 0 ? <QualityPoints points={visible} /> : null}

          <Reveal delay={0.1}>
            <div className="mt-7">
              {linkLabel && linkUrl ? <TextLink href={linkUrl}>{linkLabel}</TextLink> : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
