import type { ReactNode } from "react";

import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";

export function PageHeader({
  eyebrow,
  title,
  lead,
  breadcrumbs,
  actions,
}: {
  eyebrow?: string | null;
  title: string;
  lead?: string | null;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
}) {
  return (
    <>
      {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      <header className="border-b border-border bg-surface-muted">
        <div className="shell flex flex-col gap-6 py-14 lg:py-20">
          <div className="max-w-3xl">
            {eyebrow ? <p className="eyebrow text-accent">{eyebrow}</p> : null}
            <h1 className="mt-4 text-balance font-display text-h1 font-semibold tracking-tight">
              {title}
            </h1>
            {lead ? <p className="mt-5 max-w-2xl text-lead text-muted">{lead}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </header>
    </>
  );
}
