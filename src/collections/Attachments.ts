import type { CollectionConfig } from "payload";

import { isAdmin } from "@/lib/access";

/**
 * Private, non-public files. Stored outside public/ and readable only by
 * admins so enquiry attachments never end up on a public URL.
 */
export const Attachments: CollectionConfig = {
  slug: "attachments",
  admin: {
    group: "Leads",
    description: "Files uploaded with enquiries. Private — never publicly readable.",
    hidden: ({ user }) => !isAdmin(user),
  },
  access: {
    read: ({ req }) => isAdmin(req.user),
    /* Local API calls from the enquiry route bypass access control. */
    create: ({ req }) => isAdmin(req.user),
    update: ({ req }) => isAdmin(req.user),
    delete: ({ req }) => isAdmin(req.user),
  },
  upload: {
    staticDir: "dist/uploads/enquiry-attachments",
    mimeTypes: [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/zip",
      "text/plain",
    ],
  },
  fields: [
    {
      name: "enquiryReference",
      type: "text",
      admin: { readOnly: true, description: "Filled in automatically when the enquiry is saved." },
    },
  ],
};
