import type { GlobalConfig } from "payload";

import { adminWrite, editorWrite } from "@/lib/access";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    group: "Settings",
    description: "Company identity, contact details and footer content.",
  },
  access: {
    read: () => true,
    update: editorWrite,
  },
  fields: [
    {
      name: "companyName",
      type: "text",
      required: true,
      defaultValue: "Daman Plastics",
    },
    {
      name: "tagline",
      type: "text",
      required: true,
      defaultValue: "Reliable Quality, Global Trust",
      admin: { description: "Approved tagline — keep as supplied unless the client changes it." },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Full transparent logo. Defaults to the supplied brand asset when empty.",
      },
    },
    {
      name: "contact",
      type: "group",
      fields: [
        { name: "email", type: "email", required: true },
        { name: "phone", type: "text" },
        {
          name: "address",
          type: "textarea",
          admin: {
            description: "Leave empty until a verified address is supplied — empty values are hidden on the site.",
          },
        },
        { name: "hours", type: "text" },
      ],
    },
    {
      name: "socialLinks",
      type: "array",
      admin: { description: "Optional. Leave empty if not confirmed." },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", required: true },
      ],
    },
    {
      name: "footerDescription",
      type: "textarea",
      defaultValue:
        "Polymer compounding partner developing application-focused material solutions for manufacturing teams.",
    },
    {
      name: "copyrightText",
      type: "text",
      admin: { description: "Leave blank to build “© {year} {companyName}” automatically." },
    },
    {
      name: "demoNotice",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description:
          "Show a discreet “Illustrative demo content” note in the footer.",
      },
    },
    {
      name: "announcement",
      type: "group",
      admin: { description: "Optional dismissible strip above the header. Hidden by default." },
      fields: [
        { name: "enabled", type: "checkbox", defaultValue: false },
        { name: "message", type: "text" },
        { name: "ctaLabel", type: "text" },
        { name: "ctaUrl", type: "text" },
      ],
    },
  ],
};

export const HeaderSettings: GlobalConfig = {
  slug: "header-settings",
  label: "Header Settings",
  admin: {
    group: "Settings",
    description: "Navigation items, header CTA and sticky behaviour.",
  },
  access: {
    read: () => true,
    update: editorWrite,
  },
  fields: [
    {
      name: "navItems",
      type: "array",
      required: true,
      admin: { description: "Main navigation. Nested items appear in the Materials mega-menu." },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", required: true },
        {
          name: "children",
          type: "array",
          admin: { description: "Optional dropdown links." },
          fields: [
            { name: "label", type: "text", required: true },
            { name: "url", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "ctaLabel",
      type: "text",
      defaultValue: "Request a Quote",
    },
    {
      name: "ctaUrl",
      type: "text",
      defaultValue: "/request-a-quote",
    },
    {
      name: "sticky",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Sticky header with surface/border transition on scroll." },
    },
  ],
};

export const ThemeSettings: GlobalConfig = {
  slug: "theme-settings",
  label: "Theme Settings",
  admin: {
    group: "Settings",
    description: "Switch the complete visual preset without touching components.",
  },
  access: {
    read: () => true,
    // Brand/theme tokens are admin-only.
    update: adminWrite,
  },
  fields: [
    {
      name: "preset",
      type: "select",
      required: true,
      defaultValue: "navy",
      options: [
        { label: "Theme A — Daman Navy / Molecular Accents", value: "navy" },
        { label: "Theme B — Navy / Technical Teal", value: "teal" },
      ],
      admin: { description: "Applied via data-theme on the root element." },
    },
    {
      name: "accentOverride",
      type: "group",
      admin: {
        description: "Optional approved token overrides. Leave disabled to use preset values.",
      },
      fields: [
        { name: "enabled", type: "checkbox", defaultValue: false },
        { name: "accent", type: "text", admin: { placeholder: "#18A94A" } },
        { name: "primary", type: "text", admin: { placeholder: "#102A72" } },
        { name: "background", type: "text", admin: { placeholder: "#F5F5F1" } },
      ],
    },
  ],
};

export const SeoSettings: GlobalConfig = {
  slug: "seo-settings",
  label: "SEO Settings",
  admin: {
    group: "Settings",
    description: "Search metadata defaults and indexing controls for the demo.",
  },
  access: {
    read: () => true,
    update: editorWrite,
  },
  fields: [
    { name: "metaTitle", type: "text", defaultValue: "Daman Plastics — Engineered polymer compounds" },
    { name: "titleTemplate", type: "text", defaultValue: "%s | Daman Plastics" },
    { name: "defaultDescription", type: "textarea" },
    { name: "socialImage", type: "upload", relationTo: "media" },
    {
      name: "canonicalUrl",
      type: "text",
      admin: { description: "Canonical site origin, e.g. https://example.com (defaults to NEXT_PUBLIC_SITE_URL)." },
    },
    {
      name: "noindex",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description:
          "Demo/staging default: the site is noindexed until approved for public launch.",
      },
    },
    {
      name: "organizationSchema",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Emit Organization structured data built from real CMS content only." },
    },
  ],
};

export const CompanySettings: GlobalConfig = {
  slug: "company-settings",
  label: "Company Page",
  admin: {
    group: "Content",
    description: "Content for the Company page.",
  },
  access: {
    read: () => true,
    update: editorWrite,
  },
  fields: [
    { name: "pageTitle", type: "text", defaultValue: "An engineering-led compounding partner" },
    { name: "intro", type: "textarea" },
    { name: "story", type: "richText" },
    {
      name: "principles",
      type: "array",
      admin: { description: "Mission, vision and working values — qualitative statements only." },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
      ],
    },
    {
      name: "capabilities",
      type: "array",
      admin: { description: "Capability overview list (no numbers unless verified)." },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea" },
      ],
    },
    { name: "image", type: "upload", relationTo: "media" },
    {
      name: "milestoneNote",
      type: "text",
      admin: {
        description: "Timeline milestones are intentionally absent until real milestones are provided.",
      },
    },
  ],
};

export const ManufacturingSettings: GlobalConfig = {
  slug: "manufacturing-settings",
  label: "Manufacturing & Quality",
  admin: {
    group: "Content",
    description: "Process stages, quality workflow, test capabilities and equipment.",
  },
  access: {
    read: () => true,
    update: editorWrite,
  },
  fields: [
    { name: "pageTitle", type: "text", defaultValue: "Process control from intake to dispatch" },
    { name: "intro", type: "textarea" },
    {
      name: "processStages",
      type: "array",
      admin: { description: "Ordered compounding process stages." },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
        { name: "detail", type: "text" },
      ],
    },
    {
      name: "qualityWorkflow",
      type: "array",
      admin: {
        description:
          "Quality steps — only retain stages the client confirms. Kept general and factual.",
      },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
      ],
    },
    {
      name: "testCapabilities",
      type: "array",
      admin: { description: "Test capability entries — marked illustrative until verified." },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "description", type: "textarea" },
        { name: "verified", type: "checkbox", defaultValue: false },
      ],
    },
    {
      name: "equipment",
      type: "array",
      admin: { description: "Equipment / facility gallery entries (illustrative placeholders)." },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "description", type: "textarea" },
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "certifications",
      type: "array",
      admin: {
        description:
          "Hidden on the site unless “verified” is ticked AND a certificate file is supplied. Never fabricate certificates.",
      },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "issuer", type: "text" },
        { name: "file", type: "upload", relationTo: "media" },
        { name: "verified", type: "checkbox", defaultValue: false },
      ],
    },
  ],
};
