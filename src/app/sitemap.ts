import type { MetadataRoute } from "next";

import { getPublishedApplications, getPublishedMaterials } from "@/lib/cms";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [materials, applications] = await Promise.all([
    getPublishedMaterials(),
    getPublishedApplications(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/company`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/materials`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/applications`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/manufacturing-quality`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/resources`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/request-a-quote`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const materialRoutes: MetadataRoute.Sitemap = materials
    .filter((m) => m.slug)
    .map((m) => ({
      url: `${BASE}/materials/${m.slug}`,
      lastModified: new Date(m.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const applicationRoutes: MetadataRoute.Sitemap = applications
    .filter((a) => a.slug)
    .map((a) => ({
      url: `${BASE}/applications/${a.slug}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...materialRoutes, ...applicationRoutes];
}
