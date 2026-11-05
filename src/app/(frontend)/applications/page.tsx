import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getPublishedApplications, resolveMedia } from "@/lib/cms";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Applications",
  description:
    "Where Daman Plastics compounds go to work — wire and cable, automotive, electrical and electronics, building, consumer and industrial sectors.",
};

export default async function ApplicationsPage() {
  const applications = await getPublishedApplications();

  return (
    <>
      <PageHeader
        eyebrow="Application sectors"
        title="Materials in the context of your part"
        lead="The right compound depends on how the part is made and what it must survive. Explore the sectors we develop for — each entry links to typical component considerations and related materials."
        actions={
          <ButtonLink href="/request-a-quote" variant="primary">
            Discuss your application
          </ButtonLink>
        }
      />

      <section className="bg-surface">
        <div className="shell py-16 lg:py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((app, index) => {
              const image = resolveMedia(app.cardImage ?? null);
              const src = image?.url || `/media/application-${(index % 5) + 1}.png`;
              return (
                <Reveal key={app.id} delay={(index % 3) * 0.08}>
                  <Link
                    href={`/applications/${app.slug ?? ""}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface transition-[border-color,box-shadow] duration-200 hover:border-accent/60 hover:shadow-[0_10px_30px_rgba(16,42,114,0.08)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
                      <Image
                        src={src}
                        alt={image?.alt || `${app.name} — illustrative placeholder`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="font-display text-lg font-semibold">{app.name}</h2>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                        {app.shortDescription}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                        Explore sector
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          {applications.length === 0 ? (
            <p className="text-muted">No published applications yet — check back soon.</p>
          ) : null}
        </div>
      </section>
    </>
  );
}
