import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading, TextLink } from "@/components/ui/SectionHeading";
import { resolveMedia } from "@/lib/media";
import type { Media } from "@/payload-types";

type Props = {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  image?: Media | number | null;
  linkLabel?: string | null;
  linkUrl?: string | null;
};

export function IntroSection({ eyebrow, heading, body, image, linkLabel, linkUrl }: Props) {
  const media = resolveMedia(image ?? null);
  const src = media?.url || "/media/intro.png";

  return (
    <section className="bg-surface-muted">
      <div className="shell grid items-center gap-10 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={heading}
            lead={body}
            as="h2"
          />
          {linkLabel && linkUrl ? (
            <div className="mt-7">
              <TextLink href={linkUrl}>{linkLabel}</TextLink>
            </div>
          ) : null}
        </Reveal>

        <Reveal delay={0.12}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
            <Image
              src={src}
              alt={media?.alt || "Illustrative placeholder — factory and laboratory environment"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
