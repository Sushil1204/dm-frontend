import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="bg-surface">
      <div className="shell flex flex-col items-start gap-6 py-28 lg:py-36">
        <p className="eyebrow text-accent">404</p>
        <h1 className="max-w-xl font-display text-h1 font-semibold tracking-tight">
          That page could not be found.
        </h1>
        <p className="max-w-lg text-lead text-muted">
          The link may be outdated, or the page has not been published yet. Try the material
          portfolio or get in touch directly.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/" variant="primary">
            Back to home
          </ButtonLink>
          <ButtonLink href="/materials" variant="secondary">
            Browse materials
          </ButtonLink>
        </div>
        <p className="text-sm text-muted">
          Or{" "}
          <Link href="/contact" className="text-accent underline underline-offset-4">
            contact the team
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
