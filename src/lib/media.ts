import type { Media } from "@/payload-types";

export type MediaOrId = Media | number | null | undefined;

/** Resolve an upload field to a media doc (with depth:1) or null. */
export function resolveMedia(value: MediaOrId): Media | null {
  if (value && typeof value === "object") return value;
  return null;
}

/** Public file URL for a media doc, or null. */
export function mediaUrl(value: MediaOrId): string | null {
  return resolveMedia(value)?.url ?? null;
}
