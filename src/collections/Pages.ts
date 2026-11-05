import type { CollectionConfig } from "payload";

import { editorWrite, publishedRead } from "@/lib/access";
import { autoSlug } from "@/lib/slug";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    group: "Content",
    defaultColumns: ["title", "pageType", "published"],
  },
  access: {
    read: publishedRead,
    create: editorWrite,
    update: editorWrite,
    delete: editorWrite,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      hooks: { beforeChange: [autoSlug("title")] },
      admin: { position: "sidebar", description: "URL segment — auto-filled from the title." },
    },
    {
      name: "pageType",
      type: "select",
      required: true,
      defaultValue: "standard",
      options: [
        { label: "Standard content page", value: "standard" },
        { label: "Legal / policy", value: "legal" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "intro",
      type: "textarea",
      admin: { description: "Optional lead paragraph under the page title." },
    },
    {
      name: "content",
      type: "richText",
      admin: { description: "Main page body. The privacy policy placeholder lives here." },
    },
    {
      name: "published",
      type: "checkbox",
      defaultValue: true,
      admin: { position: "sidebar" },
    },
    {
      type: "group",
      name: "seo",
      admin: { description: "Optional per-page search metadata." },
      fields: [
        { name: "metaTitle", type: "text" },
        { name: "metaDescription", type: "textarea" },
      ],
    },
  ],
};
