import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { getPageBySlug } from "@/lib/cms";
import { RichText } from "@/lib/rich-text";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: "Page not found" };
  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || page.intro || undefined,
  };
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <>
      <PageHeader
        eyebrow={page.pageType === "legal" ? "Legal" : undefined}
        title={page.title}
        lead={page.intro}
        breadcrumbs={[{ label: page.title }]}
      />
      <section className="bg-surface">
        <div className="shell max-w-3xl py-16 lg:py-20">
          <RichText content={page.content} />
        </div>
      </section>
    </>
  );
}
