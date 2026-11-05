import { getPayload } from "payload";

import type {
  Application,
  HomepageSetting,
  Material,
  ManufacturingSetting,
  CompanySetting,
  Page,
  Resource,
  SiteSetting,
  HeaderSetting,
  SeoSetting,
  ThemeSetting,
} from "@/payload-types";
import config from "@payload-config";

/**
 * Server-side content access for the public site.
 * Every read is wrapped so a missing/unreachable database degrades to a
 * documented fallback instead of crashing a page or the production build.
 */

export async function getPayloadClient() {
  return getPayload({ config });
}

async function safe<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[cms] ${label} unavailable — using fallback content.`, error);
    return fallback;
  }
}

/**
 * Payload synthesises a defaults-filled global even when no row exists yet
 * (id stays undefined). Use the rich DEFAULT_* copy until a row is saved.
 */
function pickGlobal<T extends { id?: unknown }>(doc: T, fallback: T): T {
  return doc && doc.id != null ? doc : fallback;
}

/* ---------- Approved identity defaults (see product.md §4) ---------- */

export const DEFAULT_SITE: SiteSetting = {
  id: 0,
  companyName: "Daman Plastics",
  tagline: "Reliable Quality, Global Trust",
  logo: null,
  contact: {
    email: "enquiries@example.com",
    phone: null,
    address: null,
    hours: null,
  },
  socialLinks: [],
  footerDescription:
    "Polymer compounding partner developing application-focused material solutions for manufacturing teams.",
  copyrightText: null,
  demoNotice: true,
  announcement: {
    enabled: false,
    message: null,
    ctaLabel: null,
    ctaUrl: null,
  },
};

export const DEFAULT_HEADER: HeaderSetting = {
  id: 0,
  navItems: [
    { label: "Company", url: "/company" },
    {
      label: "Materials",
      url: "/materials",
      children: [
        { label: "PVC compounds", url: "/materials/pvc-compounds" },
        { label: "TPE compounds", url: "/materials/tpe-compounds" },
        { label: "TPV compounds", url: "/materials/tpv-compounds" },
        { label: "Filled PP compounds", url: "/materials/filled-pp-compounds" },
      ],
    },
    {
      label: "Applications",
      url: "/applications",
      children: [
        { label: "Wire and cable", url: "/applications/wire-and-cable" },
        { label: "Automotive and mobility", url: "/applications/automotive-mobility" },
        { label: "Electrical and electronics", url: "/applications/electrical-electronics" },
        { label: "Industrial components", url: "/applications/industrial-components" },
      ],
    },
    { label: "Manufacturing & Quality", url: "/manufacturing-quality" },
    { label: "Resources", url: "/resources" },
    { label: "Contact", url: "/contact" },
  ],
  ctaLabel: "Request a Quote",
  ctaUrl: "/request-a-quote",
  sticky: true,
};

export const DEFAULT_SEO: SeoSetting = {
  id: 0,
  metaTitle: "Daman Plastics — Engineered polymer compounds",
  titleTemplate: "%s | Daman Plastics",
  defaultDescription:
    "Application-focused polymer compounds developed with process consistency and technical collaboration in mind. Illustrative demo content.",
  socialImage: null,
  canonicalUrl: null,
  noindex: true,
  organizationSchema: true,
};

export const DEFAULT_THEME: ThemeSetting = {
  id: 0,
  preset: "navy",
  accentOverride: {
    enabled: false,
    accent: null,
    primary: null,
    background: null,
  },
};

export const DEFAULT_HOMEPAGE: HomepageSetting = {
  id: 0,
  hero: {
    eyebrow: "Engineered polymer materials",
    headline: "Materials engineered around your manufacturing needs.",
    body: "Application-focused polymer compounds, developed with process consistency and technical collaboration in mind.",
    primaryCta: { label: "Explore Materials", url: "/materials" },
    secondaryCta: { label: "Discuss Your Requirement", url: "/contact" },
    video: null,
    mobileVideo: null,
    poster: null,
    videoSettings: { autoplay: true, loop: true },
    proofPoints: [
      { label: "Application-focused", note: "Formulated around your process" },
      { label: "Controlled batches", note: "Documented workflow" },
      { label: "Technical dialogue", note: "Requirement review with engineers" },
      { label: "Documentation", note: "Datasheets on request" },
    ],
  },
  sections: {
    capabilityStrip: {
      items: [
        {
          label: "Polymer compounding",
          note: "Thermoplastics formulated for repeatable processing",
        },
        {
          label: "Application engineering",
          note: "Material selection support for your end use",
        },
        {
          label: "Batch consistency",
          note: "Controls from intake through dispatch",
        },
        {
          label: "Technical partnership",
          note: "Samples, datasheets and formulation input",
        },
      ],
    },
    intro: {
      eyebrow: "Who we are",
      heading: "A compounding partner built around process reliability",
      body: "Daman Plastics develops polymer compounds for manufacturers who need consistent processing and a technical counterpart, not just a supplier. We work from your application and processing method towards a formulation that behaves the same way, batch after batch.",
      image: null,
      linkLabel: "About the company",
      linkUrl: "/company",
    },
    materialsSection: {
      eyebrow: "Material portfolio",
      heading: "Compounds for demanding production",
      body: "Explore representative material families across common engineering requirements — each with processing notes, application tags and a direct route to the technical team.",
      linkLabel: "View all materials",
      linkUrl: "/materials",
      featuredMaterials: null,
    },
    applicationsSection: {
      eyebrow: "Application sectors",
      heading: "Where our compounds go to work",
      body: "From automotive components to consumer products, the right compound depends on how the part is made and what it must survive.",
      featuredApplications: null,
    },
    compounding: {
      eyebrow: "Custom compounding",
      heading: "From your requirement to a formulation",
      body: "Every enquiry starts with the application, the processing method and the expectations for the finished part. From there we move through a short, transparent workflow towards a compound you can validate on your own line.",
      steps: [
        {
          title: "Requirement review",
          body: "Application, processing method, performance expectations and volumes — reviewed together.",
        },
        {
          title: "Formulation proposal",
          body: "A starting formulation with material options, trade-offs and documentation.",
        },
        {
          title: "Trial and sample",
          body: "Sample compound produced under controlled conditions for your evaluation.",
        },
        {
          title: "Validation and scale-up",
          body: "Feedback loop on your line, then transition into repeat production.",
        },
      ],
      ctaLabel: "Discuss your specification",
      ctaUrl: "/request-a-quote",
    },
    processSection: {
      eyebrow: "How we work",
      heading: "A controlled path from intake to dispatch",
      body: "Five stages, each with a clear output — so everyone knows what happens next.",
      steps: [
        {
          title: "Requirement review",
          body: "Application and process data captured, expectations aligned.",
        },
        {
          title: "Formulation",
          body: "Compound design matched to the target properties and processing window.",
        },
        {
          title: "Compounding",
          body: "Batch production under documented process controls.",
        },
        {
          title: "Testing",
          body: "Checks against the agreed specification before release.",
        },
        {
          title: "Dispatch",
          body: "Documented handover with batch records and technical documentation.",
        },
      ],
      linkLabel: "Manufacturing & quality",
      linkUrl: "/manufacturing-quality",
    },
    qualitySection: {
      eyebrow: "Quality",
      heading: "Quality built into the workflow",
      body: "Checks are placed where they matter — at intake, during processing and before release. Detailed equipment lists and standards are published once confirmed by the client.",
      image: null,
      points: [
        {
          title: "In-process control",
          body: "Key parameters recorded during compounding for every batch.",
        },
        {
          title: "Batch documentation",
          body: "Traceable records linking raw materials to the finished lot.",
        },
        {
          title: "Specification checks",
          body: "Finished compound verified against the agreed requirements.",
        },
        {
          title: "Application-led testing",
          body: "Testing priorities set by how the material will be processed and used.",
        },
      ],
      linkLabel: "Quality workflow",
      linkUrl: "/manufacturing-quality",
    },
    resourcesSection: {
      eyebrow: "Resources",
      heading: "Technical resources",
      body: "Brochures, technical notes and datasheets — available to download as they are published.",
      items: null,
      ctaLabel: "Browse the resource library",
      ctaUrl: "/resources",
      requestNote: "Technical documents can also be requested directly.",
    },
    closingCta: {
      heading: "Have a material requirement to solve?",
      body: "Tell us about the application, the processing method and what the material needs to do. We will come back with technical questions and next steps.",
      primaryLabel: "Request a quote",
      primaryUrl: "/request-a-quote",
      secondaryLabel: "Contact us",
      secondaryUrl: "/contact",
    },
  },
};

export const DEFAULT_COMPANY: CompanySetting = {
  id: 0,
  pageTitle: "An engineering-led compounding partner",
  intro:
    "Daman Plastics develops dependable polymer compounds for demanding manufacturing applications — an engineering-led partner for procurement teams, designers and production partners.",
  story: null,
  principles: [],
  capabilities: [],
  image: null,
  milestoneNote: null,
};

export const DEFAULT_MANUFACTURING: ManufacturingSetting = {
  id: 0,
  pageTitle: "Process control from intake to dispatch",
  intro:
    "A consistent compounding workflow with checkpoints at intake, in-process control and finished-product review. Details below are illustrative and pending client confirmation.",
  processStages: [],
  qualityWorkflow: [],
  testCapabilities: [],
  equipment: [],
  certifications: [],
};

/* ------------------------------ Read helpers ------------------------------ */

export interface SiteGlobals {
  site: SiteSetting;
  header: HeaderSetting;
  seo: SeoSetting;
  theme: ThemeSetting;
}

export async function getSiteGlobals(): Promise<SiteGlobals> {
  return safe(
    "site globals",
    async () => {
      const payload = await getPayloadClient();
      const [site, header, seo, theme] = await Promise.all([
        payload.findGlobal({ slug: "site-settings" }),
        payload.findGlobal({ slug: "header-settings" }),
        payload.findGlobal({ slug: "seo-settings" }),
        payload.findGlobal({ slug: "theme-settings" }),
      ]);
      return {
        site: pickGlobal(site, DEFAULT_SITE),
        header: pickGlobal(header, DEFAULT_HEADER),
        seo: pickGlobal(seo, DEFAULT_SEO),
        theme: pickGlobal(theme, DEFAULT_THEME),
      };
    },
    { site: DEFAULT_SITE, header: DEFAULT_HEADER, seo: DEFAULT_SEO, theme: DEFAULT_THEME },
  );
}

export async function getHomepageSettings(): Promise<HomepageSetting> {
  return safe(
    "homepage settings",
    async () => {
      const payload = await getPayloadClient();
      const doc = await payload.findGlobal({ slug: "homepage-settings", depth: 1 });
      return pickGlobal(doc, DEFAULT_HOMEPAGE);
    },
    DEFAULT_HOMEPAGE,
  );
}

export async function getCompanyContent(): Promise<CompanySetting> {
  return safe(
    "company settings",
    async () => {
      const payload = await getPayloadClient();
      const doc = await payload.findGlobal({ slug: "company-settings", depth: 1 });
      return pickGlobal(doc, DEFAULT_COMPANY);
    },
    DEFAULT_COMPANY,
  );
}

export async function getManufacturingContent(): Promise<ManufacturingSetting> {
  return safe(
    "manufacturing settings",
    async () => {
      const payload = await getPayloadClient();
      const doc = await payload.findGlobal({ slug: "manufacturing-settings", depth: 1 });
      return pickGlobal(doc, DEFAULT_MANUFACTURING);
    },
    DEFAULT_MANUFACTURING,
  );
}

export async function getPublishedMaterials(opts: { limit?: number } = {}): Promise<Material[]> {
  return safe(
    "materials",
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: "materials",
        where: { published: { equals: true } },
        sort: "sortOrder",
        limit: opts.limit ?? 50,
        depth: 1,
      });
      return result.docs as Material[];
    },
    [],
  );
}

export async function getFeaturedMaterials(limit = 6): Promise<Material[]> {
  const materials = await getPublishedMaterials();
  const featured = materials.filter((m) => m.featured);
  return (featured.length > 0 ? featured : materials).slice(0, limit);
}

export async function getMaterialBySlug(slug: string): Promise<Material | null> {
  return safe(
    `material ${slug}`,
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: "materials",
        where: { and: [{ slug: { equals: slug } }, { published: { equals: true } }] },
        limit: 1,
        depth: 1,
      });
      return (result.docs[0] as Material | undefined) ?? null;
    },
    null,
  );
}

export async function getPublishedApplications(): Promise<Application[]> {
  return safe(
    "applications",
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: "applications",
        where: { published: { equals: true } },
        sort: "sortOrder",
        limit: 50,
        depth: 1,
      });
      return result.docs as Application[];
    },
    [],
  );
}

export async function getApplicationBySlug(slug: string): Promise<Application | null> {
  return safe(
    `application ${slug}`,
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: "applications",
        where: { and: [{ slug: { equals: slug } }, { published: { equals: true } }] },
        limit: 1,
        depth: 1,
      });
      return (result.docs[0] as Application | undefined) ?? null;
    },
    null,
  );
}

export async function getMaterialsForApplication(applicationId: number | string): Promise<Material[]> {
  return safe(
    "materials for application",
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: "materials",
        where: {
          and: [
            { applications: { contains: applicationId } },
            { published: { equals: true } },
          ],
        },
        sort: "sortOrder",
        limit: 50,
        depth: 1,
      });
      return result.docs as Material[];
    },
    [],
  );
}

export async function getPublicResources(limit = 20): Promise<Resource[]> {
  return safe(
    "resources",
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: "resources",
        where: { visibility: { equals: "public" } },
        sort: "-publishDate",
        limit,
        depth: 1,
      });
      return result.docs as Resource[];
    },
    [],
  );
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  return safe(
    `page ${slug}`,
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: "pages",
        where: { and: [{ slug: { equals: slug } }, { published: { equals: true } }] },
        limit: 1,
        depth: 1,
      });
      return (result.docs[0] as Page | undefined) ?? null;
    },
    null,
  );
}

export type { MediaOrId } from "./media";
export { resolveMedia } from "./media";
