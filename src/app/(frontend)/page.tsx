import { ApplicationsGrid } from "@/components/home/ApplicationsGrid";
import { CapabilityStrip } from "@/components/home/CapabilityStrip";
import { ClosingCta } from "@/components/home/ClosingCta";
import { CompoundingFeature } from "@/components/home/CompoundingFeature";
import { HeroVideo } from "@/components/home/HeroVideo";
import { IntroSection } from "@/components/home/IntroSection";
import { MaterialsPortfolio } from "@/components/home/MaterialsPortfolio";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { QualitySection } from "@/components/home/QualitySection";
import { ResourcesPreview } from "@/components/home/ResourcesPreview";
import {
  DEFAULT_HOMEPAGE,
  getFeaturedMaterials,
  getHomepageSettings,
  getPublicResources,
  getPublishedApplications,
} from "@/lib/cms";
import type { Application, Resource } from "@/payload-types";

export const revalidate = 60;

function asObjects<T>(value: (T | number)[] | null | undefined): T[] {
  return (value ?? []).filter((item): item is T => Boolean(item && typeof item === "object"));
}

export default async function HomePage() {
  const settings = await getHomepageSettings();
  const sections = settings.sections ?? {};
  const hero = settings.hero ?? DEFAULT_HOMEPAGE.hero;

  const featuredFromCms = asObjects<Application>(
    sections.applicationsSection?.featuredApplications,
  );
  const resourcesFromCms = asObjects<Resource>(sections.resourcesSection?.items);

  const [materials, applications, resources] = await Promise.all([
    getFeaturedMaterials(6),
    featuredFromCms.length > 0
      ? Promise.resolve(featuredFromCms.slice(0, 5))
      : getPublishedApplications().then((docs) => docs.slice(0, 5)),
    resourcesFromCms.length > 0
      ? Promise.resolve(resourcesFromCms.slice(0, 4))
      : getPublicResources(4),
  ]);

  const intro = sections.intro ?? {};
  const materialsSection = sections.materialsSection ?? {};
  const applicationsSection = sections.applicationsSection ?? {};
  const compounding = sections.compounding ?? {};
  const processSection = sections.processSection ?? {};
  const qualitySection = sections.qualitySection ?? {};
  const resourcesSection = sections.resourcesSection ?? {};
  const closingCta = sections.closingCta ?? {};

  return (
    <>
      <HeroVideo hero={hero} />

      <CapabilityStrip items={sections.capabilityStrip?.items ?? []} />

      <IntroSection
        eyebrow={intro.eyebrow}
        heading={intro.heading}
        body={intro.body}
        image={intro.image}
        linkLabel={intro.linkLabel}
        linkUrl={intro.linkUrl}
      />

      <MaterialsPortfolio
        eyebrow={materialsSection.eyebrow}
        heading={materialsSection.heading}
        body={materialsSection.body}
        linkLabel={materialsSection.linkLabel}
        linkUrl={materialsSection.linkUrl}
        materials={materials}
      />

      <ApplicationsGrid
        eyebrow={applicationsSection.eyebrow}
        heading={applicationsSection.heading}
        body={applicationsSection.body}
        applications={applications}
      />

      <CompoundingFeature
        eyebrow={compounding.eyebrow}
        heading={compounding.heading}
        body={compounding.body}
        steps={compounding.steps ?? []}
        ctaLabel={compounding.ctaLabel}
        ctaUrl={compounding.ctaUrl}
      />

      <ProcessSteps
        eyebrow={processSection.eyebrow}
        heading={processSection.heading}
        body={processSection.body}
        steps={processSection.steps ?? []}
        linkLabel={processSection.linkLabel}
        linkUrl={processSection.linkUrl}
      />

      <QualitySection
        eyebrow={qualitySection.eyebrow}
        heading={qualitySection.heading}
        body={qualitySection.body}
        image={qualitySection.image}
        points={qualitySection.points ?? []}
        linkLabel={qualitySection.linkLabel}
        linkUrl={qualitySection.linkUrl}
      />

      <ResourcesPreview
        eyebrow={resourcesSection.eyebrow}
        heading={resourcesSection.heading}
        body={resourcesSection.body}
        items={resources}
        ctaLabel={resourcesSection.ctaLabel}
        ctaUrl={resourcesSection.ctaUrl}
        requestNote={resourcesSection.requestNote}
      />

      <ClosingCta
        heading={closingCta.heading}
        body={closingCta.body}
        primaryLabel={closingCta.primaryLabel}
        primaryUrl={closingCta.primaryUrl}
        secondaryLabel={closingCta.secondaryLabel}
        secondaryUrl={closingCta.secondaryUrl}
      />
    </>
  );
}
