import type { CollectionConfig } from "payload";

import { editorWrite } from "@/lib/access";

export const Resources: CollectionConfig = {
  slug: "resources",
  admin: {
    group: "Catalogue",
    defaultColumns: ["title", "resourceType", "visibility", "publishDate"],
  },
  access: {
    read: ({ req }) =>
      req.user ? true : { visibility: { equals: "public" } },
    create: editorWrite,
    update: editorWrite,
    delete: editorWrite,
  },
  upload: {
    staticDir: "dist/uploads/resources",
    mimeTypes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "application/zip",
    ],
  },
  defaultSort: "-publishDate",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
    },
    {
      name: "resourceType",
      type: "select",
      required: true,
      defaultValue: "technical-note",
      options: [
        { label: "Brochure", value: "brochure" },
        { label: "Technical note", value: "technical-note" },
        { label: "Technical data sheet (TDS)", value: "tds" },
        { label: "Safety data sheet (SDS)", value: "sds" },
        { label: "Certificate", value: "certificate" },
        { label: "Case study", value: "case-study" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "relatedMaterials",
      type: "relationship",
      relationTo: "materials",
      hasMany: true,
    },
    {
      name: "relatedApplications",
      type: "relationship",
      relationTo: "applications",
      hasMany: true,
    },
    {
      name: "publishDate",
      type: "date",
      required: true,
      admin: { position: "sidebar", date: { pickerAppearance: "dayOnly" } },
    },
    {
      name: "visibility",
      type: "select",
      required: true,
      defaultValue: "public",
      options: [
        { label: "Public", value: "public" },
        { label: "Private", value: "private" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "metaTitle",
      type: "text",
      admin: { description: "Optional SEO title." },
    },
    {
      name: "metaDescription",
      type: "textarea",
      admin: { description: "Optional SEO description." },
    },
  ],
};
