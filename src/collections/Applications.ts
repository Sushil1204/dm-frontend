import type { CollectionConfig } from "payload";

import { editorWrite, publishedRead } from "@/lib/access";
import { autoSlug } from "@/lib/slug";

export const Applications: CollectionConfig = {
  slug: "applications",
  admin: {
    group: "Catalogue",
    defaultColumns: ["name", "featured", "sortOrder", "published"],
  },
  access: {
    read: publishedRead,
    create: editorWrite,
    update: editorWrite,
    delete: editorWrite,
  },
  defaultSort: "sortOrder",
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      hooks: { beforeChange: [autoSlug("name")] },
      admin: { position: "sidebar", description: "URL segment — auto-filled from the name." },
    },
    {
      name: "shortDescription",
      type: "textarea",
      required: true,
      admin: { description: "1–2 sentences for cards and tiles." },
    },
    {
      name: "overview",
      type: "richText",
      admin: {
        description: "Typical component requirements and material considerations.",
      },
    },
    {
      name: "cardImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "typicalComponents",
      type: "array",
      admin: { description: "Example components made in this sector (illustrative)." },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "note", type: "text" },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar" },
    },
    {
      name: "published",
      type: "checkbox",
      defaultValue: true,
      admin: { position: "sidebar" },
    },
  ],
};
