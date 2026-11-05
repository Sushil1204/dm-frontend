import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getPublicResources } from "@/lib/cms";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Brochures, technical notes and datasheets — request technical information or download published documents.",
};

const typeLabels: Record<string, string> = {
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
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function ResourcesPage() {
  const resources = await getPublicResources(50);

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Technical documents"
        lead="Published brochures, technical notes and datasheets. Private documents are never listed here — request anything you cannot find."
        actions={
          <>
            <ButtonLink href="/contact" variant="primary">
              Request information
            </ButtonLink>
            <ButtonLink href="/request-a-quote" variant="secondary">
              Request a quote
            </ButtonLink>
          </>
        }
      />

      <section className="bg-surface">
        <div className="shell py-16 lg:py-20">
          {resources.length > 0 ? (
            <ul>
              {resources.map((resource, index) => (
                <Reveal key={resource.id} delay={index * 0.05}>
                  <li>
                    <a
                      href={resource.url || undefined}
                      target={resource.url ? "_blank" : undefined}
                      rel={resource.url ? "noopener noreferrer" : undefined}
                      className="group flex flex-wrap items-baseline gap-x-8 gap-y-2 border-t border-border py-6 transition-colors duration-200 last:border-b hover:bg-surface-muted/60"
                    >
                      <span className="w-32 shrink-0 font-mono text-meta uppercase tracking-widest text-accent">
                        {typeLabels[resource.resourceType] ?? resource.resourceType}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-base font-semibold">
                          {resource.title}
                        </span>
                        <span className="mt-1 block max-w-2xl text-sm text-muted">
                          {resource.summary}
                        </span>
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
                        ↓
                      </span>
                    </a>
                  </li>
                </Reveal>
              ))}
            </ul>
          ) : (
            <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-surface-muted px-8 py-12">
              <p className="font-display text-lg font-semibold">No public documents yet.</p>
              <p className="mt-2 max-w-xl text-sm text-muted">
                Technical documents can be requested directly — the team will send the
                relevant datasheets for your application.
              </p>
              <div className="mt-6">
                <ButtonLink href="/contact" variant="primary" size="sm">
                  Request information
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
