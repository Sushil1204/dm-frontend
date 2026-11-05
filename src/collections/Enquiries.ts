import type { CollectionConfig } from "payload";

import { isEditor } from "@/lib/access";

/**
 * Leads captured by the public contact / quote forms. The public can only
 * create enquiries through the validated, rate-limited route handler — the
 * raw REST create endpoint stays locked.
 */
export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  admin: {
    group: "Leads",
    defaultColumns: ["enquiryType", "name", "company", "email", "status", "createdAt"],
  },
  access: {
    read: ({ req }) => isEditor(req.user),
    create: ({ req }) => isEditor(req.user),
    update: ({ req }) => isEditor(req.user),
    delete: ({ req }) => isEditor(req.user),
  },
  timestamps: true,
  fields: [
    {
      name: "enquiryType",
      type: "select",
      required: true,
      defaultValue: "contact",
      options: [
        { label: "General contact", value: "contact" },
        { label: "Quote request", value: "quote" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Reviewing", value: "reviewing" },
        { label: "Replied", value: "replied" },
        { label: "Closed", value: "closed" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "company",
      type: "text",
      required: true,
    },
    {
      name: "phone",
      type: "text",
    },
    {
      name: "country",
      type: "text",
    },
    {
      name: "subject",
      type: "text",
    },
    {
      name: "message",
      type: "textarea",
      /* Contact enquiries need a message; quote requests carry a specification instead. */
      validate: (value: string | null | undefined, { siblingData }) => {
        const enquiryType = (siblingData as { enquiryType?: string } | undefined)?.enquiryType;
        if (enquiryType === "contact" && !value?.trim()) {
          return "Message is required for general contact enquiries.";
        }
        return true;
      },
    },
    {
      name: "material",
      type: "relationship",
      relationTo: "materials",
      admin: { description: "Preselected when submitted from a material page." },
    },
    {
      name: "application",
      type: "relationship",
      relationTo: "applications",
    },
    {
      name: "processingMethod",
      type: "text",
      admin: { description: "Quote forms only, e.g. extrusion, injection moulding." },
    },
    {
      name: "specification",
      type: "textarea",
      admin: { description: "Target properties / specification supplied by the visitor." },
    },
    {
      name: "annualVolume",
      type: "text",
      admin: { description: "Estimated annual volume, free text (never treated as a claim)." },
    },
    {
      name: "attachment",
      type: "relationship",
      relationTo: "attachments",
      admin: { description: "Optional uploaded file (validated MIME type and size)." },
    },
    {
      name: "consentAt",
      type: "date",
      required: true,
      admin: { readOnly: true, description: "Timestamp of the visitor's consent checkbox." },
    },
    {
      name: "internalNotes",
      type: "textarea",
      admin: { description: "Internal only — never shown publicly." },
    },
    {
      name: "sourcePath",
      type: "text",
      admin: { readOnly: true, description: "Page the enquiry was submitted from." },
    },
  ],
};
