import type { Metadata } from "next";
import Image from "next/image";

import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getManufacturingContent, resolveMedia } from "@/lib/cms";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Manufacturing & Quality",
  description:
    "Process control from intake to dispatch — compounding workflow, quality steps and testing approach. Illustrative, pending client confirmation.",
};

export default async function ManufacturingPage() {
  const content = await getManufacturingContent();
  const image = resolveMedia(null);
  const src = image?.url || "/media/manufacturing.png";

  const verifiedTests = (content.testCapabilities ?? []).filter((test) => test.verified);
  const verifiedCerts = (content.certifications ?? []).filter((cert) => cert.verified);

  return (
    <>
      <PageHeader
        eyebrow="Manufacturing & quality"
        title={content.pageTitle || "Manufacturing & quality"}
        lead={content.intro}
        actions={
          <ButtonLink href="/request-a-quote" variant="primary">
            Request a quote
          </ButtonLink>
        }
      />

      {content.processStages?.length ? (
        <section className="bg-surface">
          <div className="shell py-16 lg:py-20">
            <h2 className="font-display text-h3">Compounding process</h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {content.processStages.map((stage, index) => (
                <Reveal key={index} delay={(index % 5) * 0.07}>
                  <li className="h-full border-t-2 border-accent pt-5">
                    <span className="font-mono text-meta uppercase tracking-widest text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 font-display text-base font-semibold">{stage.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{stage.body}</p>
                    {stage.detail ? (
                      <p className="mt-2 text-meta text-muted">{stage.detail}</p>
                    ) : null}
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section className="border-t border-border bg-surface-muted">
        <div className="shell grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <Reveal>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
              <Image
                src={src}
                alt="Manufacturing line — illustrative placeholder"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div>
            <h2 className="font-display text-h3">Quality workflow</h2>
            {content.qualityWorkflow?.length ? (
              <ul className="mt-6 space-y-5">
                {content.qualityWorkflow.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-accent"
                    />
                    <div>
                      <p className="font-display text-sm font-semibold">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-muted">
                The quality workflow is published once confirmed by the client.
              </p>
            )}
          </div>
        </div>
      </section>

      {verifiedTests.length > 0 ? (
        <section className="border-t border-border bg-surface">
          <div className="shell py-16 lg:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-h3">Testing capabilities</h2>
              <p className="text-meta text-muted">Confirmed entries only</p>
            </div>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {verifiedTests.map((test, index) => (
                <li key={index} className="rounded-[var(--radius-card)] border border-border p-5">
                  <p className="font-display text-sm font-semibold">{test.name}</p>
                  {test.description ? (
                    <p className="mt-1.5 text-sm text-muted">{test.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {verifiedCerts.length > 0 ? (
        <section className="border-t border-border bg-surface-muted">
          <div className="shell py-16 lg:py-20">
            <h2 className="font-display text-h3">Certifications</h2>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              {verifiedCerts.map((cert, index) => (
                <li key={index} className="font-medium text-foreground">
                  {cert.name}
                  {cert.issuer ? <span className="text-muted"> — {cert.issuer}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
