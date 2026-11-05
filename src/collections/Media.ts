import type { CollectionConfig } from "payload";

import { editorWrite } from "@/lib/access";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Content",
    description: "Images and video used across the public website.",
  },
  access: {
    read: () => true,
    create: editorWrite,
    update: editorWrite,
    delete: editorWrite,
  },
  upload: {
    staticDir: "dist/uploads/media",
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/svg+xml",
      "video/mp4",
      "video/webm",
    ],
    adminThumbnail: ({ doc }) => (doc?.mimeType as string)?.startsWith("image/") ? String(doc?.url ?? "") : null,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      defaultValue: "Industrial material photograph",
      admin: { description: "Describe the image for screen readers and search engines." },
    },
    {
      name: "caption",
      type: "text",
      admin: { description: "Optional visible caption." },
    },
    {
      name: "usageNote",
      type: "text",
      admin: {
        description: "Internal note: where this asset is used, or that it is a placeholder awaiting client photography.",
      },
    },
  ],
};
