import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { MaterialCard } from "@/components/home/MaterialsPortfolio";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/SectionHeading";
import {
  getApplicationBySlug,
  getMaterialsForApplication,
  getPublishedApplications,
  resolveMedia,
} from "@/lib/cms";
import { RichText } from "@/lib/rich-text";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const applications = await getPublishedApplications();
  return applications
    .map((app) => (app.slug ? { slug: app.slug } : null))
    .filter((x): x is { slug: string } => Boolean(x));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const application = await getApplicationBySlug(slug);
  if (!application) return { title: "Application not found" };
  return {
    title: application.name,
    description: application.shortDescription,
    openGraph: { title: application.name, description: application.shortDescription },
  };
}

export default async function ApplicationDetailPage({ params }: Props) {
  const { slug } = await params;
  const application = await getApplicationBySlug(slug);
  if (!application) notFound();

  const heroImage = resolveMedia(application.heroImage ?? application.cardImage ?? null);
  const heroSrc = heroImage?.url || "/media/application-1.png";
  const materials = await getMaterialsForApplication(application.id);

  return (
    <>
      <PageHeader
        eyebrow="Application sector"
        title={application.name}
        lead={application.shortDescription}
        breadcrumbs={[
          { label: "Applications", href: "/applications" },
          { label: application.name },
        ]}
        actions={
          <>
            <ButtonLink href={`/request-a-quote?application=${application.slug}`} variant="primary">
              Discuss your application
            </ButtonLink>
            <ButtonLink href="/applications" variant="secondary">
              All applications
            </ButtonLink>
          </>
        }
      />

      <section className="bg-surface">
        <div className="shell grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface-muted">
              <Image
                src={heroSrc}
                alt={heroImage?.alt || `${application.name} — illustrative placeholder`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </div>

            <div className="mt-10">
              <RichText content={application.overview} />
            </div>

            {application.typicalComponents?.length ? (
              <div className="mt-10">
                <h2 className="font-display text-h3">Example components</h2>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {application.typicalComponents.map((component, index) => (
                    <li key={index} className="rounded-[var(--radius-card)] border border-border p-5">
                      <p className="font-display text-sm font-semibold">{component.name}</p>
                      {component.note ? (
                        <p className="mt-1.5 text-sm text-muted">{component.note}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-28 rounded-[var(--radius-card)] border border-border bg-surface-muted p-7">
              <p className="eyebrow text-accent">How we work</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Share the component, the processing method and the environment the part must
                survive. The team comes back with material options, trade-offs and the
                documentation you need for approval.
              </p>
              <div className="mt-6">
                <ButtonLink
                  href={`/request-a-quote?application=${application.slug ?? ""}`}
                  variant="primary"
                  className="w-full"
                >
                  Start a technical discussion
                </ButtonLink>
              </div>
              <div className="mt-6 border-t border-border pt-6">
                <TextLink href="/materials">Browse all materials</TextLink>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {materials.length > 0 ? (
        <section className="border-t border-border bg-surface-muted">
          <div className="shell py-16 lg:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-accent">Materials</p>
                <h2 className="mt-3 font-display text-h3">
                  Compounds suited to {application.name.toLowerCase()}
                </h2>
              </div>
              <TextLink href="/materials">View all materials</TextLink>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {materials.map((material, index) => (
                <MaterialCard key={material.id} material={material} index={index} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
