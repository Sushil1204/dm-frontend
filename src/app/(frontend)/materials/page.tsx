import type { Metadata } from "next";

import { MaterialCard } from "@/components/home/MaterialsPortfolio";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { getPublishedMaterials } from "@/lib/cms";
import type { MaterialCategory } from "@/payload-types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Materials",
  description:
    "Representative polymer compound families — PVC, TPE, TPV, filled PP and custom formulations. Illustrative demo catalogue.",
};

const accentDot: Record<string, string> = {
  green: "bg-mol-green",
  purple: "bg-mol-purple",
  orange: "bg-mol-orange",
  yellow: "bg-mol-yellow",
  navy: "bg-primary",
};

export default async function MaterialsPage() {
  const materials = await getPublishedMaterials();

  const categories = new Map<string, MaterialCategory>();
  for (const material of materials) {
    if (material.category && typeof material.category === "object") {
      categories.set(material.category.slug ?? material.category.name, material.category);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Material portfolio"
        title="Compounds organised by family"
        lead="Browse representative material families across common engineering requirements. Each page carries processing notes, application tags and a direct route to the technical team."
        actions={
          <ButtonLink href="/request-a-quote" variant="primary">
            Request a quote
          </ButtonLink>
        }
      />

      <section className="bg-surface">
        <div className="shell py-14">
          {categories.size > 0 ? (
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {[...categories.values()].map((category) => (
                <li key={category.id} className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={`h-2.5 w-2.5 rounded-full ${accentDot[category.accent] ?? "bg-accent"}`}
                  />
                  <span className="text-sm font-medium text-foreground">{category.name}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((material, index) => (
              <Reveal key={material.id} delay={(index % 3) * 0.08}>
                <MaterialCard material={material} index={index} />
              </Reveal>
            ))}
          </div>

          {materials.length === 0 ? (
            <p className="text-muted">No published materials yet — check back soon.</p>
          ) : null}
        </div>
      </section>
    </>
  );
}
