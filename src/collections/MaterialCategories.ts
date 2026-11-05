import type { CollectionConfig } from "payload";

import { editorWrite, publishedRead } from "@/lib/access";
import { autoSlug } from "@/lib/slug";

export const MaterialCategories: CollectionConfig = {
  slug: "material-categories",
  admin: {
    group: "Catalogue",
    description:
      "Material families (e.g. PVC compounds, TPE compounds). Reorder, hide or delete freely — the site adapts.",
    defaultColumns: ["name", "accent", "sortOrder", "published"],
  },
  access: {
    read: publishedRead,
    create: editorWrite,
    update: editorWrite,
    delete: editorWrite,
  },
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
      name: "description",
      type: "textarea",
      admin: { description: "One short paragraph shown on overview pages." },
    },
    {
      name: "accent",
      type: "select",
      required: true,
      defaultValue: "green",
      options: [
        { label: "Molecular green", value: "green" },
        { label: "Molecular purple", value: "purple" },
        { label: "Molecular orange", value: "orange" },
        { label: "Molecular yellow", value: "yellow" },
        { label: "Daman navy", value: "navy" },
      ],
      admin: {
        description:
          "Marker colour used for this family. Restrained accent — never all four at once in a single component.",
      },
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
