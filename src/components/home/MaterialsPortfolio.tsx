import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading, TextLink } from "@/components/ui/SectionHeading";
import { resolveMedia } from "@/lib/media";
import type { Application, Material, MaterialCategory } from "@/payload-types";

const accentText: Record<string, string> = {
  green: "text-mol-green",
  purple: "text-mol-purple",
  orange: "text-mol-orange",
  yellow: "text-mol-yellow",
  navy: "text-primary",
};

function categoryOf(material: Material): MaterialCategory | null {
  return material.category && typeof material.category === "object" ? material.category : null;
}

/** Image-led material card — used on the homepage, materials page and detail cross-links. */
export function MaterialCard({ material, index = 0 }: { material: Material; index?: number }) {
  const category = categoryOf(material);
  const image = resolveMedia(material.cardImage ?? null);
  const src = image?.url || `/media/material-${(index % 6) + 1}.png`;
  const apps = (material.applications ?? []).filter(
    (app): app is Application => Boolean(app && typeof app === "object"),
  );

  return (
    <Link
      href={`/materials/${material.slug ?? ""}`}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface transition-[border-color,box-shadow] duration-200 hover:border-accent/60 hover:shadow-[0_10px_30px_rgba(16,42,114,0.08)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        <Image
          src={src}
          alt={image?.alt || `${material.name} — illustrative placeholder`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        {category ? (
          <p className={`eyebrow ${accentText[category.accent] ?? "text-accent"}`}>
            {category.name}
          </p>
        ) : null}
        <h3 className="mt-3 font-display text-lg font-semibold leading-snug">
          {material.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{material.summary}</p>

        {apps.length > 0 ? (
          <p className="mt-4 text-meta text-muted">
            {apps
              .slice(0, 3)
              .map((app) => app.name)
              .join(" · ")}
          </p>
        ) : null}

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
          View material
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export function MaterialsPortfolio({
  eyebrow,
  heading,
  body,
  linkLabel,
  linkUrl,
  materials,
}: {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  linkLabel?: string | null;
  linkUrl?: string | null;
  materials: Material[];
}) {
  if (materials.length === 0) return null;

  return (
    <section className="bg-surface">
      <div className="shell py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={eyebrow} title={heading} lead={body} as="h2" />
          {linkLabel && linkUrl ? (
            <div className="pb-2">
              <TextLink href={linkUrl}>{linkLabel}</TextLink>
            </div>
          ) : null}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((material, index) => (
            <Reveal key={material.id} delay={(index % 3) * 0.08}>
              <MaterialCard material={material} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
