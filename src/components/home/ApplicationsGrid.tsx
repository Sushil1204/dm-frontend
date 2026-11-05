import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { resolveMedia } from "@/lib/media";
import type { Application } from "@/payload-types";

export function ApplicationsGrid({
  eyebrow,
  heading,
  body,
  applications,
}: {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  applications: Application[];
}) {
  if (applications.length === 0) return null;

  return (
    <section className="bg-surface-muted">
      <div className="shell py-20 lg:py-28">
        <SectionHeading eyebrow={eyebrow} title={heading} lead={body} as="h2" />

        <div className="mt-12 grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[240px]">
          {applications.map((app, index) => {
            const image = resolveMedia(app.cardImage ?? null);
            const src = image?.url || `/media/application-${(index % 5) + 1}.png`;
            const large = index === 0;

            return (
              <Reveal
                key={app.id}
                delay={(index % 3) * 0.07}
                className={large ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}
              >
                <Link
                  href={`/applications/${app.slug ?? ""}`}
                  className="group relative block h-full overflow-hidden rounded-[var(--radius-card)] border border-border"
                >
                  <Image
                    src={src}
                    alt={image?.alt || `${app.name} — illustrative placeholder`}
                    fill
                    sizes={
                      large
                        ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    }
                    className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/88 via-primary/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3
                      className={`font-display font-semibold text-white ${large ? "text-2xl lg:text-3xl" : "text-lg"}`}
                    >
                      {app.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 max-w-md text-sm text-white/75">
                      {app.shortDescription}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                      Explore sector
                      <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
