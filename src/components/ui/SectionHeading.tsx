import Link from "next/link";
import type { ReactNode } from "react";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`.trim()}>{children}</p>;
}

type SectionHeadingProps = {
  eyebrow?: string | null;
  title: ReactNode;
  lead?: string | null;
  align?: "left" | "center";
  /** Renders as h2 by default; pass "h1" for page titles. */
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  as: Heading = "h2",
  className = "",
  id,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-4 ${alignment} ${className}`.trim()}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Heading id={id} className="text-h2 max-w-3xl">
        {title}
      </Heading>
      {lead ? <p className="text-lead text-muted max-w-2xl">{lead}</p> : null}
    </div>
  );
}

type TextLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

/** Quiet inline link with a subtle arrow that shifts on hover. */
export function TextLink({ href, children, className = "" }: TextLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1.5 font-medium text-accent transition-colors duration-200 hover:text-foreground ${className}`.trim()}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-200 ease-[var(--ease-out-soft)] group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
