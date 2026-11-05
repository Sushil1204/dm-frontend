import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";

export function ClosingCta({
  heading,
  body,
  primaryLabel,
  primaryUrl,
  secondaryLabel,
  secondaryUrl,
}: {
  heading?: string | null;
  body?: string | null;
  primaryLabel?: string | null;
  primaryUrl?: string | null;
  secondaryLabel?: string | null;
  secondaryUrl?: string | null;
}) {
  if (!heading) return null;

  return (
    <section className="border-t border-border bg-surface">
      <div className="shell py-20 lg:py-24">
        <Reveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-balance font-display text-h2 font-semibold tracking-tight">
                {heading}
              </h2>
              {body ? <p className="mt-4 text-lead text-muted">{body}</p> : null}
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              {primaryLabel && primaryUrl ? (
                <ButtonLink href={primaryUrl} variant="primary">
                  {primaryLabel}
                </ButtonLink>
              ) : null}
              {secondaryLabel && secondaryUrl ? (
                <ButtonLink href={secondaryUrl} variant="secondary">
                  {secondaryLabel}
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
