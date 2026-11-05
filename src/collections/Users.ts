import type { CollectionConfig } from "payload";

import { isAdmin } from "@/lib/access";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "role"],
    group: "Settings",
  },
  auth: true,
  access: {
    read: ({ req, id }) =>
      Boolean(req.user) &&
      (isAdmin(req.user) || (id !== undefined && req.user?.id === id)),
    create: async ({ req }) => {
      if (req.user) return isAdmin(req.user);
      // Allow the first-user bootstrap screen on a fresh database.
      try {
        const { totalDocs } = await req.payload.count({
          collection: "users",
        });
        return totalDocs === 0;
      } catch {
        return false;
      }
    },
    update: ({ req, id }) =>
      Boolean(req.user) && (isAdmin(req.user) || req.user?.id === id),
    delete: ({ req }) => isAdmin(req.user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      admin: { position: "sidebar" },
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      access: {
        // Only admins may assign or change roles.
        update: ({ req }) => isAdmin(req.user),
        create: ({ req }) => isAdmin(req.user) || !req.user,
      },
      admin: {
        position: "sidebar",
        description: "Admins manage users and settings. Editors manage content.",
      },
    },
  ],
};
