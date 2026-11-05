import type { CollectionConfig } from "payload";

import { editorWrite, publishedRead } from "@/lib/access";
import { autoSlug } from "@/lib/slug";

export const Materials: CollectionConfig = {
  slug: "materials",
  admin: {
    group: "Catalogue",
    defaultColumns: ["name", "category", "featured", "sortOrder", "published"],
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
      name: "category",
      type: "relationship",
      relationTo: "material-categories",
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      admin: { description: "Short card description, 1–2 sentences." },
    },
    {
      name: "description",
      type: "richText",
      admin: { description: "Full detail-page description." },
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
      name: "characteristics",
      type: "array",
      admin: { description: "Typical characteristics — qualitative wording only." },
      fields: [
        {
          name: "text",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "grades",
      type: "array",
      admin: { description: "Optional grade / variant list." },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "description", type: "textarea" },
      ],
    },
    {
      name: "processingNotes",
      type: "textarea",
      admin: { description: "Optional processing guidance." },
    },
    {
      name: "technicalData",
      type: "array",
      admin: {
        description:
          "Optional. Use “Available on request” or “Illustrative data — confirm with manufacturer” until verified values are supplied. Never publish unverified numbers.",
      },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "value", type: "text", required: true },
        { name: "unit", type: "text" },
        { name: "disclaimer", type: "text" },
      ],
    },
    {
      name: "standards",
      type: "array",
      admin: {
        description: "Only add standards or approvals the client has verified. Leave empty otherwise.",
      },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "note", type: "text" },
      ],
    },
    {
      name: "applications",
      type: "relationship",
      relationTo: "applications",
      hasMany: true,
    },
    {
      name: "datasheet",
      type: "relationship",
      relationTo: "resources",
      admin: { description: "Optional datasheet from the resource library." },
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
