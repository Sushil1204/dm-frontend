import type { FieldHook } from "payload";

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

/**
 * Field hook for auto-populating a slug from another field.
 * An explicitly entered slug always wins; otherwise it is derived
 * from `sourceField` (falls back to the original document's value).
 */
export function autoSlug(sourceField = "name"): FieldHook {
  return ({ value, data, originalDoc }) => {
    if (typeof value === "string" && value.length > 0) return slugify(value);
    const source =
      (data as Record<string, unknown> | undefined)?.[sourceField] ??
      (originalDoc as Record<string, unknown> | undefined)?.[sourceField];
    return typeof source === "string" && source.length > 0 ? slugify(source) : value;
  };
}
