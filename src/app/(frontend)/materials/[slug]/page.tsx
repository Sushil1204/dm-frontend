import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MaterialCard } from "@/components/home/MaterialsPortfolio";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/SectionHeading";
import { getMaterialBySlug, getPublishedMaterials, resolveMedia } from "@/lib/cms";
import { RichText } from "@/lib/rich-text";
import type { Application, Material, MaterialCategory } from "@/payload-types";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const materials = await getPublishedMaterials();
  return materials
    .map((material) => (material.slug ? { slug: material.slug } : null))
    .filter((x): x is { slug: string } => Boolean(x));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const material = await getMaterialBySlug(slug);
  if (!material) return { title: "Material not found" };
  return {
    title: material.name,
    description: material.summary,
    openGraph: { title: material.name, description: material.summary },
  };
}

function categoryOf(material: Material): MaterialCategory | null {
  return material.category && typeof material.category === "object" ? material.category : null;
}

export default async function MaterialDetailPage({ params }: Props) {
  const { slug } = await params;
  const material = await getMaterialBySlug(slug);
  if (!material) notFound();

  const category = categoryOf(material);
  const heroImage = resolveMedia(material.heroImage ?? material.cardImage ?? null);
  const heroSrc = heroImage?.url || "/media/material-1.png";
  const apps = (material.applications ?? []).filter(
    (app): app is Application => Boolean(app && typeof app === "object"),
  );
  const standards = material.standards ?? [];

  const related = (await getPublishedMaterials())
    .filter((m) => m.id !== material.id)
    .slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={category?.name ?? "Material"}
        title={material.name}
        lead={material.summary}
        breadcrumbs={[
          { label: "Materials", href: "/materials" },
          { label: material.name },
        ]}
        actions={
          <>
            <ButtonLink href={`/request-a-quote?material=${material.slug}`} variant="primary">
              Discuss this material
            </ButtonLink>
            <ButtonLink href="/materials" variant="secondary">
              All materials
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
                alt={heroImage?.alt || `${material.name} — illustrative placeholder`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </div>

            <div className="mt-10">
              <RichText content={material.description} />
            </div>

            {material.characteristics?.length ? (
              <div className="mt-10">
                <h2 className="font-display text-h3">Typical characteristics</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {material.characteristics.map((item, index) => (
                    <li key={index} className="flex gap-3 text-sm text-muted">
                      <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {material.grades?.length ? (
              <div className="mt-10">
                <h2 className="font-display text-h3">Grades</h2>
                <dl className="mt-5 divide-y divide-border border-y border-border">
                  {material.grades.map((grade, index) => (
                    <div key={index} className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8">
                      <dt className="w-56 shrink-0 font-display text-sm font-semibold">
                        {grade.name}
                      </dt>
                      <dd className="text-sm text-muted">
                        {grade.description || "Details on request."}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {material.technicalData?.length ? (
              <div className="mt-10">
                <h2 className="font-display text-h3">Technical data</h2>
                <table className="mt-5 w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 pr-4 font-medium">Property</th>
                      <th className="py-3 pr-4 font-medium">Value</th>
                      <th className="py-3 font-medium">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {material.technicalData.map((row, index) => (
                      <tr key={index} className="border-b border-border/70">
                        <td className="py-3 pr-4 text-foreground">{row.label}</td>
                        <td className="py-3 pr-4 text-muted">{row.value}</td>
                        <td className="py-3 text-muted">{row.unit || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-3 text-meta text-muted">
                  {material.technicalData[0]?.disclaimer ||
                    "Illustrative data — confirm with the manufacturer before relying on values."}
                </p>
              </div>
            ) : null}

            {standards.length > 0 ? (
              <div className="mt-10">
                <h2 className="font-display text-h3">Standards & approvals</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {standards.map((standard, index) => (
                    <li key={index}>
                      <span className="font-medium text-foreground">{standard.name}</span>
                      {standard.note ? ` — ${standard.note}` : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-28 rounded-[var(--radius-card)] border border-border bg-surface-muted p-7">
              {material.processingNotes ? (
                <>
                  <p className="eyebrow text-accent">Processing</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {material.processingNotes}
                  </p>
                  <div className="mt-6 border-t border-border pt-6" />
                </>
              ) : null}

              {apps.length > 0 ? (
                <>
                  <p className="eyebrow text-accent">Typical applications</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {apps.map((app) => (
                      <li key={app.id}>
                        <Link
                          href={`/applications/${app.slug ?? ""}`}
                          className="inline-block rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
                        >
                          {app.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 border-t border-border pt-6" />
                </>
              ) : null}

              {material.datasheet && typeof material.datasheet === "object" ? (
                <div className="mb-6">
                  <p className="eyebrow text-accent">Documentation</p>
                  <div className="mt-3">
                    <TextLink href={material.datasheet.url || "/resources"}>
                      {material.datasheet.title}
                    </TextLink>
                  </div>
                </div>
              ) : null}

              <ButtonLink
                href={`/request-a-quote?material=${material.slug ?? ""}`}
                variant="primary"
                className="w-full"
              >
                Request pricing & samples
              </ButtonLink>
              <p className="mt-3 text-meta text-muted">
                Share your processing method and volumes — the team replies with technical
                questions and next steps.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-border bg-surface-muted">
          <div className="shell py-16 lg:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-h3">Related materials</h2>
              <TextLink href="/materials">View all materials</TextLink>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <MaterialCard key={item.id} material={item} index={index} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
