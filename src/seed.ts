/**
 * Idempotent demo seed: admin user, media, catalogue, resources,
 * globals and the privacy-policy page. Run with `npm run seed`.
 *
 * Safe to re-run — every record is matched by slug/filename/email.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { CollectionSlug } from "payload";

if (existsSync(".env")) process.loadEnvFile(".env");

const { default: config } = await import("@payload-config");
const { getPayload } = await import("payload");
const { DEFAULT_COMPANY, DEFAULT_HOMEPAGE, DEFAULT_HEADER, DEFAULT_MANUFACTURING, DEFAULT_SEO, DEFAULT_SITE } =
  await import("@/lib/cms");

const stripId = <T extends { id?: unknown }>(value: T): Omit<T, "id"> => {
  const rest = { ...value };
  delete (rest as { id?: unknown }).id;
  return rest;
};

const payload = await getPayload({ config });

type AnyDoc = { id: number | string; [k: string]: unknown };

/* ------------------------------- helpers ------------------------------- */

async function findBySlug(collection: CollectionSlug, slug: string): Promise<AnyDoc | null> {
  const result = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  return (result.docs[0] as unknown as AnyDoc | undefined) ?? null;
}

async function upsertBySlug(
  collection: CollectionSlug,
  slug: string,
  data: Record<string, unknown>,
): Promise<AnyDoc> {
  const existing = await findBySlug(collection, slug);
  if (existing) {
    return (await payload.update({
      collection,
      id: existing.id,
      data: data as never,
    })) as unknown as AnyDoc;
  }
  return (await payload.create({
    collection,
    data: { ...data, slug } as never,
  })) as unknown as AnyDoc;
}

async function upsertMedia(filename: string, alt: string): Promise<AnyDoc | null> {
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  });
  if (existing.docs[0]) return existing.docs[0] as unknown as AnyDoc;

  const filePath = path.join(process.cwd(), "public", "media", filename);
  if (!existsSync(filePath)) {
    console.warn(`[seed] missing file public/media/${filename} — run npm run placeholders first`);
    return null;
  }
  const data = readFileSync(filePath);
  return (await payload.create({
    collection: "media",
    data: { alt },
    file: { data, mimetype: "image/png", name: filename, size: data.length },
  })) as unknown as AnyDoc;
}

async function upsertBrandLogo(): Promise<AnyDoc | null> {
  const filename = "daman-plastics-logo.png";
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  });
  if (existing.docs[0]) return existing.docs[0] as unknown as AnyDoc;
  const filePath = path.join(process.cwd(), "public", "brand", filename);
  if (!existsSync(filePath)) return null;
  return (await payload.create({
    collection: "media",
    data: { alt: "Daman Plastics logo" },
    file: { data: readFileSync(filePath), mimetype: "image/png", name: filename, size: readFileSync(filePath).length },
  })) as unknown as AnyDoc;
}

/** Minimal one-page PDF (Helvetica) — illustrative document body. */
function makePdf(title: string, lines: string[]): Buffer {
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const textOps = [
    "BT /F1 16 Tf 60 760 Td",
    `(${esc(title)}) Tj`,
    "/F1 11 Tf 0 -34 Td",
    ...lines.map((line, i) => (i === 0 ? `(${esc(line)}) Tj` : `T* (${esc(line)}) Tj`)),
    "ET",
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${textOps.length} >>\nstream\n${textOps}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((obj, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(pdf, "latin1");
}

async function upsertResource(
  filename: string,
  data: Record<string, unknown>,
  pdf: Buffer,
): Promise<AnyDoc> {
  const existing = await payload.find({
    collection: "resources",
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  });
  if (existing.docs[0]) {
    return (await payload.update({
      collection: "resources",
      id: existing.docs[0].id,
      data: data as never,
    })) as unknown as AnyDoc;
  }
  return (await payload.create({
    collection: "resources",
    data: data as never,
    file: { data: pdf, mimetype: "application/pdf", name: filename, size: pdf.length },
  })) as unknown as AnyDoc;
}

const richText = (paragraphs: string[]) => ({
  root: {
    type: "root",
    direction: "ltr" as const,
    format: "" as const,
    indent: 0,
    version: 0,
    children: paragraphs.map((text) => ({
      type: "paragraph",
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
      version: 0,
      children: [{ type: "text", text, format: [] as string[], style: "" as const, version: 0 }],
    })),
  },
});

const log = (msg: string) => console.log(`[seed] ${msg}`);

/* -------------------------------- users -------------------------------- */

const userCount = await payload.count({ collection: "users" });
if (userCount.totalDocs === 0) {
  await payload.create({
    collection: "users",
    data: {
      email: "admin@daman.test",
      password: "DamanDemo123!",
      name: "Demo Administrator",
      role: "admin",
    },
  });
  log("created admin user admin@daman.test (password: DamanDemo123!)");
} else {
  log(`users already present (${userCount.totalDocs}) — skipped admin bootstrap`);
}

/* -------------------------------- media -------------------------------- */

log("uploading media…");
const media = {
  heroPoster: await upsertMedia("hero-poster.png", "Hero visual — illustrative placeholder"),
  intro: await upsertMedia("intro.png", "Company introduction — illustrative placeholder"),
  quality: await upsertMedia("quality.png", "Laboratory testing — illustrative placeholder"),
  manufacturing: await upsertMedia("manufacturing.png", "Manufacturing line — illustrative placeholder"),
  og: await upsertMedia("og-image.png", "Social preview image"),
  logo: await upsertBrandLogo(),
};
const materialImages: AnyDoc[] = [];
for (let i = 1; i <= 6; i++) {
  const doc = await upsertMedia(`material-${i}.png`, `Material card ${i} — illustrative placeholder`);
  if (doc) materialImages.push(doc);
}
const applicationImages: AnyDoc[] = [];
for (let i = 1; i <= 5; i++) {
  const doc = await upsertMedia(
    `application-${i}.png`,
    `Application sector ${i} — illustrative placeholder`,
  );
  if (doc) applicationImages.push(doc);
}
log(`media ready (${Object.values(media).filter(Boolean).length + materialImages.length + applicationImages.length} files)`);

/* ------------------------- material categories -------------------------- */

log("material categories…");
const categoryDefs: { name: string; slug: string; accent: string; description: string }[] = [
  { name: "PVC compounds", slug: "pvc-compounds", accent: "green", description: "Flexible and rigid PVC compounds for extrusion and moulding." },
  { name: "Thermoplastic elastomer (TPE) compounds", slug: "tpe-compounds", accent: "purple", description: "Soft-touch and flexible TPE grades for over-moulding and profiles." },
  { name: "Thermoplastic vulcanizate (TPV) compounds", slug: "tpv-compounds", accent: "orange", description: "Heat- and chemical-resistant TPV compounds for demanding environments." },
  { name: "Thermoplastic olefin (TPO) compounds", slug: "tpo-compounds", accent: "yellow", description: "TPO compounds for impact resistance and low-temperature toughness." },
  { name: "Low-smoke halogen-free / flame-retardant compounds", slug: "lshf-fr-compounds", accent: "navy", description: "LSHF and flame-retardant compound families — confirm suitability per application." },
  { name: "Filled polypropylene compounds", slug: "filled-pp-compounds", accent: "green", description: "Mineral- and talc-filled PP compounds for stiffness and dimensional stability." },
  { name: "Polyolefin compounds", slug: "polyolefin-compounds", accent: "purple", description: "Polyethylene and polyolefin-based compounds for general-duty parts." },
  { name: "Colour and additive masterbatches", slug: "colour-additive-masterbatches", accent: "orange", description: "Colour and functional additive masterbatches for downstream compounding." },
  { name: "Custom-engineered compounds", slug: "custom-engineered-compounds", accent: "navy", description: "Application-specific formulations developed against a customer requirement." },
];
const categories = new Map<string, AnyDoc>();
for (const [index, def] of categoryDefs.entries()) {
  const doc = await upsertBySlug("material-categories", def.slug, {
    name: def.name,
    description: def.description,
    accent: def.accent,
    sortOrder: index,
    published: true,
  });
  categories.set(def.slug, doc);
}
log(`${categories.size} categories`);

/* ----------------------------- applications ----------------------------- */

log("applications…");
const applicationDefs = [
  { name: "Wire and cable", slug: "wire-and-cable", image: 0, shortDescription: "Insulation and jacketing compounds for cable production — flexibility, colour consistency and processing stability." },
  { name: "Automotive and mobility", slug: "automotive-mobility", image: 1, shortDescription: "Compounds for interior, exterior and under-hood components with demanding process windows." },
  { name: "Electrical and electronics", slug: "electrical-electronics", image: 2, shortDescription: "Housing and connector compounds where dimensional stability and surface finish matter." },
  { name: "Building and infrastructure", slug: "building-infrastructure", image: 3, shortDescription: "Profiles, pipes and construction components requiring weatherability and consistent extrusion." },
  { name: "Consumer and household products", slug: "consumer-products", image: 4, shortDescription: "Compounds for everyday products — colour, feel and reliable high-volume moulding." },
  { name: "Industrial components", slug: "industrial-components", image: 0, shortDescription: "Heavy-duty parts and machinery components engineered around wear and load." },
];
const applications = new Map<string, AnyDoc>();
for (const [index, def] of applicationDefs.entries()) {
  const doc = await upsertBySlug("applications", def.slug, {
    name: def.name,
    shortDescription: def.shortDescription,
    overview: richText([
      def.shortDescription,
      "Requirements vary by component and processing method — share your drawing, resin history and target properties to start a technical discussion.",
    ]),
    cardImage: applicationImages[def.image]?.id ?? null,
    featured: index < 5,
    sortOrder: index,
    published: true,
  });
  applications.set(def.slug, doc);
}
log(`${applications.size} applications`);

/* ------------------------------ materials ------------------------------- */

log("materials…");
const materialDefs = [
  {
    name: "PVC Compounds",
    slug: "pvc-compounds",
    category: "pvc-compounds",
    featured: true,
    apps: ["wire-and-cable", "building-infrastructure", "consumer-products"],
    summary: "Flexible and rigid PVC compounds tuned for extrusion, moulding and profile production.",
    characteristics: ["Plasticiser options for flexible grades", "Consistent colour and surface finish", "Extrusion- and moulding-friendly flow"],
    processingNotes: "Confirm processing temperature window and line speed during requirement review.",
  },
  {
    name: "TPE Compounds",
    slug: "tpe-compounds",
    category: "tpe-compounds",
    featured: true,
    apps: ["automotive-mobility", "consumer-products", "industrial-components"],
    summary: "Thermoplastic elastomer compounds for soft-touch, over-moulded and flexible parts.",
    characteristics: ["Soft-touch surface feel", "Over-moulding onto rigid substrates", "Shore hardness range on request"],
    processingNotes: "Substrate compatibility should be validated on your tooling before approval.",
  },
  {
    name: "TPV Compounds",
    slug: "tpv-compounds",
    category: "tpv-compounds",
    featured: true,
    apps: ["automotive-mobility", "building-infrastructure", "industrial-components"],
    summary: "TPV compounds combining elastic behaviour with heat and chemical resistance.",
    characteristics: ["Elastic recovery", "Heat resistance for demanding environments", "Recyclable thermoplastic processing"],
    processingNotes: "Drying and regrind policy agreed per grade during trial production.",
  },
  {
    name: "Filled PP Compounds",
    slug: "filled-pp-compounds",
    category: "filled-pp-compounds",
    featured: true,
    apps: ["automotive-mobility", "industrial-components", "electrical-electronics"],
    summary: "Mineral-filled polypropylene compounds for stiffness, stability and cost-efficient parts.",
    characteristics: ["Improved stiffness and heat deflection", "Good dimensional stability", "Talc or mineral loading options"],
    processingNotes: "Filler loading affects sink marks and weld lines — review gate design with our team.",
  },
  {
    name: "Polyolefin Compounds",
    slug: "polyolefin-compounds",
    category: "polyolefin-compounds",
    featured: true,
    apps: ["consumer-products", "building-infrastructure", "industrial-components"],
    summary: "Polyethylene-based and general-purpose polyolefin compounds for high-volume production.",
    characteristics: ["Easy processing at high throughput", "Moisture-resistant finished parts", "Colour matching available"],
    processingNotes: "Colour target to be agreed against a physical master or reference plaque.",
  },
  {
    name: "Colour & Additive Masterbatch",
    slug: "colour-additive-masterbatch",
    category: "colour-additive-masterbatches",
    featured: true,
    apps: ["consumer-products", "wire-and-cable", "electrical-electronics"],
    summary: "Colour and functional additive masterbatches for consistent dosing in downstream processes.",
    characteristics: ["Carrier options matched to host polymer", "UV, antistatic and slip additive routes", "Batch-to-batch colour consistency"],
    processingNotes: "Dosing rate determined by target let-down ratio and host resin.",
  },
];

const materials: AnyDoc[] = [];
for (const [index, def] of materialDefs.entries()) {
  const category = categories.get(def.category);
  const doc = await upsertBySlug("materials", def.slug, {
    name: def.name,
    category: category?.id ?? null,
    summary: def.summary,
    description: richText([
      def.summary,
      "This material page is illustrative demo content. Final properties, grades and documentation are confirmed per enquiry with the technical team.",
    ]),
    cardImage: materialImages[index % Math.max(materialImages.length, 1)]?.id ?? null,
    heroImage: materialImages[index % Math.max(materialImages.length, 1)]?.id ?? null,
    characteristics: def.characteristics.map((text) => ({ text })),
    processingNotes: def.processingNotes,
    technicalData: [
      { label: "Property values", value: "Available on request", disclaimer: "Illustrative data — confirm with manufacturer" },
    ],
    standards: [],
    applications: def.apps
      .map((slug) => applications.get(slug)?.id)
      .filter((id): id is number => typeof id === "number"),
    featured: def.featured,
    sortOrder: index,
    published: true,
  });
  materials.push(doc);
}
log(`${materials.length} materials`);

/* ------------------------------ resources ------------------------------- */

log("resources…");
const brochure = await upsertResource(
  "daman-plastics-company-brochure.pdf",
  {
    title: "Company & capabilities brochure (illustrative)",
    summary: "Overview of the compounding approach, workflow and documentation — placeholder document for the demo.",
    resourceType: "brochure",
    publishDate: "2026-01-15",
    visibility: "public",
  },
  makePdf("Daman Plastics — Company & Capabilities (Illustrative)", [
    "This is placeholder content generated for the demo website.",
    "Replace with the approved client brochure before launch.",
    "",
    "Reliable Quality, Global Trust.",
  ]),
);
const techNote = await upsertResource(
  "selecting-a-compound-for-your-process.pdf",
  {
    title: "Selecting a compound for your processing method (illustrative)",
    summary: "A short technical note framing material selection around process, tooling and end-use expectations.",
    resourceType: "technical-note",
    publishDate: "2026-02-01",
    visibility: "public",
  },
  makePdf("Selecting a compound for your processing method", [
    "Placeholder technical note for the demo website.",
    "",
    "Start from the processing method, then the end-use requirements,",
    "then the documentation you need for approval.",
    "",
    "Request the full document via the contact page.",
  ]),
);
const privateDoc = await upsertResource(
  "internal-approval-checklist.pdf",
  {
    title: "Internal approval checklist (private)",
    summary: "Example of a private document — only visible to signed-in editors in the admin and to authenticated API reads.",
    resourceType: "technical-note",
    publishDate: "2026-02-10",
    visibility: "private",
  },
  makePdf("Internal approval checklist (private)", ["Not published on the public site."]),
);
log(`resources: ${brochure.title}, ${techNote.title}, ${privateDoc.title}`);

/* -------------------------------- pages -------------------------------- */

log("pages…");
const privacy = await upsertBySlug("pages", "privacy-policy", {
  title: "Privacy Policy",
  pageType: "legal",
  intro: "Illustrative legal placeholder — replace with the approved policy text before launch.",
  content: richText([
    "This privacy policy is placeholder content for the demo website. It describes, in general terms, how an industrial supplier would handle enquiry data: what is collected through the contact and quote forms, why it is used, how long it is kept and who to contact with questions.",
    "No real data collection takes place beyond storing submitted enquiries in the content management system for demonstration purposes.",
    "Replace this text with the client's approved policy before the site goes live.",
  ]),
  published: true,
});
log(`page: ${privacy.id}`);

/* ------------------------------- globals ------------------------------- */

log("globals…");

await payload.updateGlobal({
  slug: "site-settings",
  data: {
    ...stripId(DEFAULT_SITE),
    logo: media.logo?.id ?? null,
    demoNotice: true,
  } as never,
});

await payload.updateGlobal({
  slug: "header-settings",
  data: {
    ...stripId(DEFAULT_HEADER),
    sticky: true,
  } as never,
});

await payload.updateGlobal({
  slug: "seo-settings",
  data: {
    ...stripId(DEFAULT_SEO),
    socialImage: media.og?.id ?? null,
  } as never,
});

const home = DEFAULT_HOMEPAGE;
await payload.updateGlobal({
  slug: "homepage-settings",
  data: {
    hero: {
      ...home.hero,
      poster: media.heroPoster?.id ?? null,
      proofPoints: home.hero.proofPoints,
    },
    sections: {
      ...home.sections,
      intro: { ...home.sections.intro, image: media.intro?.id ?? null },
      qualitySection: { ...home.sections.qualitySection, image: media.quality?.id ?? null },
      materialsSection: {
        ...home.sections.materialsSection,
        featuredMaterials: materials.map((m) => m.id),
      },
      applicationsSection: {
        ...home.sections.applicationsSection,
        featuredApplications: [...applications.values()].map((a) => a.id),
      },
      resourcesSection: {
        ...home.sections.resourcesSection,
        items: [brochure.id, techNote.id],
      },
    },
  } as never,
});

await payload.updateGlobal({
  slug: "company-settings",
  data: {
    ...stripId(DEFAULT_COMPANY),
    image: media.intro?.id ?? null,
  } as never,
});

await payload.updateGlobal({
  slug: "manufacturing-settings",
  data: {
    ...stripId(DEFAULT_MANUFACTURING),
    processStages:
      home.sections.processSection?.steps?.map((step) => ({
        title: step.title ?? "",
        body: step.body ?? "",
      })) ?? [],
    qualityWorkflow:
      home.sections.qualitySection?.points?.map((point) => ({
        title: point.title ?? "",
        body: point.body ?? "",
      })) ?? [],
    testCapabilities: [],
    equipment: [],
    certifications: [],
  } as never,
});

log("globals updated");

console.log("\n[seed] done. Admin: admin@daman.test / DamanDemo123!");
process.exit(0);
