import type { Metadata } from "next";
import Image from "next/image";

import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getCompanyContent, resolveMedia } from "@/lib/cms";
import { RichText } from "@/lib/rich-text";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Company",
  description:
    "An engineering-led compounding partner — positioning, working principles and capabilities. Illustrative demo content.",
};

export default async function CompanyPage() {
  const company = await getCompanyContent();
  const image = resolveMedia(company.image ?? null);
  const src = image?.url || "/media/intro.png";

  return (
    <>
      <PageHeader
        eyebrow="Company"
        title={company.pageTitle || "Company"}
        lead={company.intro}
        actions={
          <>
            <ButtonLink href="/request-a-quote" variant="primary">
              Start a conversation
            </ButtonLink>
            <ButtonLink href="/manufacturing-quality" variant="secondary">
              Manufacturing & quality
            </ButtonLink>
          </>
        }
      />

      <section className="bg-surface">
        <div className="shell grid items-start gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface-muted">
              <Image
                src={src}
                alt={image?.alt || "Illustrative placeholder — factory and laboratory environment"}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {company.milestoneNote ? (
              <p className="mt-4 text-meta text-muted">{company.milestoneNote}</p>
            ) : null}
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <h2 className="font-display text-h3">Our story</h2>
              <RichText content={company.story} className="mt-4" />
              {!company.story ? (
                <p className="mt-4 leading-relaxed text-muted">
                  Daman Plastics develops dependable polymer compounds for demanding
                  manufacturing applications — working from your application and processing
                  method towards a formulation that behaves the same way, batch after batch.
                </p>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>

      {company.principles?.length ? (
        <section className="border-t border-border bg-surface-muted">
          <div className="shell py-16 lg:py-20">
            <h2 className="font-display text-h3">How we work</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {company.principles.map((principle, index) => (
                <Reveal key={index} delay={(index % 3) * 0.08}>
                  <div className="h-full rounded-[var(--radius-card)] border border-border bg-surface p-6">
                    <span
                      aria-hidden="true"
                      className={`block h-2.5 w-2.5 rounded-full ${index % 3 === 0 ? "bg-accent" : index % 3 === 1 ? "bg-mol-purple" : "bg-mol-orange"}`}
                    />
                    <h3 className="mt-4 font-display text-base font-semibold">
                      {principle.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{principle.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {company.capabilities?.length ? (
        <section className="border-t border-border bg-surface">
          <div className="shell py-16 lg:py-20">
            <h2 className="font-display text-h3">Capabilities</h2>
            <dl className="mt-8 divide-y divide-border border-y border-border">
              {company.capabilities.map((capability, index) => (
                <div key={index} className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-10">
                  <dt className="w-72 shrink-0 font-display text-sm font-semibold">
                    {capability.title}
                  </dt>
                  <dd className="text-sm leading-relaxed text-muted">{capability.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}
    </>
  );
}
