import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Resource } from "@/payload-types";

const typeLabels: Record<Resource["resourceType"], string> = {
  brochure: "Brochure",
  "technical-note": "Technical note",
  tds: "TDS",
  sds: "SDS",
  certificate: "Certificate",
  "case-study": "Case study",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export function ResourcesPreview({
  eyebrow,
  heading,
  body,
  items,
  ctaLabel,
  ctaUrl,
  requestNote,
}: {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  items: Resource[];
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  requestNote?: string | null;
}) {
  const visible = (items ?? [])
    .filter((item) => item?.title)
    .slice(0, 4);

  return (
    <section className="border-t border-border bg-surface">
      <div className="shell py-20 lg:py-24">
        <SectionHeading eyebrow={eyebrow} title={heading} lead={body} as="h2" />

        {visible.length > 0 ? (
          <ul className="mt-10">
            {visible.map((resource, index) => (
              <Reveal key={resource.id} delay={index * 0.06}>
                <li>
                  <a
                    href={resource.url || undefined}
                    target={resource.url ? "_blank" : undefined}
                    rel={resource.url ? "noopener noreferrer" : undefined}
                    className="group flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-border py-5 transition-colors duration-200 last:border-b hover:bg-surface-muted/60"
                  >
                    <span className="font-mono text-meta uppercase tracking-widest text-accent">
                      {typeLabels[resource.resourceType] ?? resource.resourceType}
                    </span>
                    <span className="min-w-0 flex-1 font-display text-base font-semibold">
                      {resource.title}
                    </span>
                    {resource.publishDate ? (
                      <span className="text-meta text-muted">
                        {formatDate(resource.publishDate)}
                      </span>
                    ) : null}
                    <span
                      aria-hidden="true"
                      className="text-accent transition-transform duration-200 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </a>
                </li>
              </Reveal>
            ))}
          </ul>
        ) : (
          <Reveal>
            <div className="mt-10 rounded-[var(--radius-card)] border border-dashed border-border bg-surface-muted px-8 py-10">
              <p className="max-w-xl font-display text-lg font-semibold">
                No public documents published yet.
              </p>
              {requestNote ? (
                <p className="mt-2 max-w-xl text-sm text-muted">{requestNote}</p>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href={ctaUrl || "/resources"} variant="primary" size="sm">
                  {ctaLabel || "Browse the resource library"}
                </ButtonLink>
                <ButtonLink href="/contact" variant="secondary" size="sm">
                  Request information
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        )}

        {visible.length > 0 && ctaLabel && ctaUrl ? (
          <div className="mt-8">
            <ButtonLink href={ctaUrl} variant="text" size="sm">
              {ctaLabel}
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
