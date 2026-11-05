import type { Metadata } from "next";

import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { getApplicationBySlug, getMaterialBySlug, getPublishedApplications, getPublishedMaterials } from "@/lib/cms";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Share your material requirement, application and processing method — the team follows up with technical questions and next steps.",
};

type Props = { searchParams: Promise<{ material?: string; application?: string }> };

export default async function QuotePage({ searchParams }: Props) {
  const params = await searchParams;

  const [materials, applications, prefillMaterial, prefillApplication] = await Promise.all([
    getPublishedMaterials(),
    getPublishedApplications(),
    params.material ? getMaterialBySlug(params.material) : null,
    params.application ? getApplicationBySlug(params.application) : null,
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Request a quote"
        title="Have a material requirement to solve?"
        lead="The more you share about the application, the processing method and the volumes, the faster the technical conversation starts. Fields marked with an asterisk are required."
      />

      <section className="bg-surface">
        <div className="shell grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
          <div className="lg:col-span-7">
            <EnquiryForm
              variant="quote"
              sourcePath="/request-a-quote"
              materialOptions={materials.map((m) => ({ id: m.id, name: m.name }))}
              applicationOptions={applications.map((a) => ({ id: a.id, name: a.name }))}
              defaultMaterialId={prefillMaterial?.id ?? null}
              defaultApplicationId={prefillApplication?.id ?? null}
            />
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-[var(--radius-card)] border border-border bg-surface-muted p-7">
              <p className="eyebrow text-accent">What happens next</p>
              <ol className="mt-4 space-y-5">
                <li className="flex gap-4">
                  <span className="font-mono text-meta text-accent">01</span>
                  <p className="text-sm leading-relaxed text-muted">
                    The enquiry is stored and reviewed — usually with a few technical
                    questions about your line and target properties.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="font-mono text-meta text-accent">02</span>
                  <p className="text-sm leading-relaxed text-muted">
                    A formulation direction or sample plan is proposed for your evaluation.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="font-mono text-meta text-accent">03</span>
                  <p className="text-sm leading-relaxed text-muted">
                    Feedback from your tooling feeds the next iteration until the compound
                    behaves as expected.
                  </p>
                </li>
              </ol>

              <div className="mt-6 border-t border-border pt-6 text-sm text-muted">
                {prefillMaterial ? (
                  <p>
                    Prefilled from{" "}
                    <span className="font-medium text-foreground">{prefillMaterial.name}</span>.
                  </p>
                ) : null}
                {prefillApplication ? (
                  <p className={prefillMaterial ? "mt-1" : undefined}>
                    Application:{" "}
                    <span className="font-medium text-foreground">
                      {prefillApplication.name}
                    </span>
                    .
                  </p>
                ) : null}
                {!prefillMaterial && !prefillApplication ? (
                  <p>
                    Tip: start from a material or application page to prefill the relevant
                    fields automatically.
                  </p>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
