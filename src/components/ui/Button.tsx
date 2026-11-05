import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type ButtonVariant = "primary" | "accent" | "secondary" | "inverse" | "text";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] text-[0.95rem] font-medium leading-none transition-[background-color,color,border-color,opacity,transform] duration-200 ease-[var(--ease-out-soft)] focus-visible:outline-2 focus-visible:outline-offset-3 active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-[color-mix(in_srgb,var(--primary),#fff_14%)]",
  accent:
    "bg-accent text-accent-foreground hover:bg-[color-mix(in_srgb,var(--accent),#000_12%)]",
  secondary:
    "border border-foreground/25 bg-transparent text-foreground hover:border-foreground/60 hover:bg-foreground/5",
  inverse:
    "bg-surface text-primary hover:bg-[color-mix(in_srgb,var(--surface),var(--primary)_8%)]",
  text: "rounded-none px-0 py-0 text-foreground hover:text-accent underline-offset-4 hover:underline",
};

const sizes = {
  md: "px-6 py-3.5",
  sm: "px-4 py-2.5 text-sm",
  lg: "px-7 py-4",
  none: "",
};

export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: keyof typeof sizes = "md",
  className = "",
) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
}

type CommonProps = {
  variant?: ButtonVariant;
  size?: keyof typeof sizes;
  children: ReactNode;
  className?: string;
};

/** Anchor styled as a button (internal routes). */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: CommonProps & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">) {
  return (
    <Link href={href} className={buttonClassName(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

/** Actual <button> for form actions. */
export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  children,
  ...rest
}: CommonProps & {
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button type={type} className={buttonClassName(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
