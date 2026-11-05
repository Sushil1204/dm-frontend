import type { GlobalConfig } from "payload";

import { editorWrite } from "@/lib/access";

export const HomepageSettings: GlobalConfig = {
  slug: "homepage-settings",
  label: "Homepage",
  admin: {
    group: "Content",
    description: "Everything on the homepage, including hero media.",
  },
  access: {
    read: () => true,
    update: editorWrite,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          name: "hero",
          fields: [
            { name: "eyebrow", type: "text", defaultValue: "Engineered polymer materials" },
            {
              name: "headline",
              type: "text",
              required: true,
              defaultValue: "Materials engineered around your manufacturing needs.",
            },
            {
              name: "body",
              type: "textarea",
              defaultValue:
                "Application-focused polymer compounds, developed with process consistency and technical collaboration in mind.",
            },
            {
              name: "primaryCta",
              type: "group",
              fields: [
                { name: "label", type: "text", defaultValue: "Explore Materials" },
                { name: "url", type: "text", defaultValue: "/materials" },
              ],
            },
            {
              name: "secondaryCta",
              type: "group",
              fields: [
                { name: "label", type: "text", defaultValue: "Discuss Your Requirement" },
                { name: "url", type: "text", defaultValue: "/contact" },
              ],
            },
            {
              name: "video",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Optional muted background loop (mp4/webm). When empty, the poster image is shown — the page never leaves an empty hero.",
              },
            },
            {
              name: "mobileVideo",
              type: "upload",
              relationTo: "media",
              admin: { description: "Optional smaller video used on mobile devices." },
            },
            {
              name: "poster",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Poster / fallback image. Also shown when the visitor prefers reduced motion.",
              },
            },
            {
              name: "videoSettings",
              type: "group",
              fields: [
                { name: "autoplay", type: "checkbox", defaultValue: true },
                { name: "loop", type: "checkbox", defaultValue: true },
              ],
            },
            {
              name: "proofPoints",
              type: "array",
              admin: {
                description:
                  "Up to four qualitative proof points. No figures, certifications or claims that are not verified.",
              },
              fields: [
                { name: "label", type: "text", required: true },
                { name: "note", type: "text" },
              ],
            },
          ],
        },
        {
          label: "Sections",
          name: "sections",
          fields: [
            {
              type: "group",
              name: "capabilityStrip",
              fields: [
                {
                  name: "items",
                  type: "array",
                  admin: { description: "Up to four qualitative trust markers. No figures or certifications." },
                  fields: [
                    { name: "label", type: "text", required: true },
                    { name: "note", type: "text" },
                  ],
                },
              ],
            },
            {
              type: "group",
              name: "intro",
              fields: [
                { name: "eyebrow", type: "text", defaultValue: "Who we are" },
                { name: "heading", type: "text", required: true },
                { name: "body", type: "textarea" },
                { name: "image", type: "upload", relationTo: "media" },
                { name: "linkLabel", type: "text", defaultValue: "About the company" },
                { name: "linkUrl", type: "text", defaultValue: "/company" },
              ],
            },
            {
              type: "group",
              name: "materialsSection",
              fields: [
                { name: "eyebrow", type: "text", defaultValue: "Material portfolio" },
                { name: "heading", type: "text", required: true },
                { name: "body", type: "textarea" },
                { name: "linkLabel", type: "text", defaultValue: "View all materials" },
                { name: "linkUrl", type: "text", defaultValue: "/materials" },
                {
                  name: "featuredMaterials",
                  type: "relationship",
                  relationTo: "materials",
                  hasMany: true,
                  admin: { description: "Pick up to six. Falls back to newest published materials." },
                },
              ],
            },
            {
              type: "group",
              name: "applicationsSection",
              fields: [
                { name: "eyebrow", type: "text", defaultValue: "Application sectors" },
                { name: "heading", type: "text", required: true },
                { name: "body", type: "textarea" },
                {
                  name: "featuredApplications",
                  type: "relationship",
                  relationTo: "applications",
                  hasMany: true,
                  admin: { description: "Pick the sectors shown in the editorial grid." },
                },
              ],
            },
            {
              type: "group",
              name: "compounding",
              fields: [
                { name: "eyebrow", type: "text", defaultValue: "Custom compounding" },
                { name: "heading", type: "text", required: true },
                { name: "body", type: "textarea" },
                {
                  name: "steps",
                  type: "array",
                  admin: { description: "Four to five concise steps." },
                  fields: [
                    { name: "title", type: "text", required: true },
                    { name: "body", type: "textarea", required: true },
                  ],
                },
                { name: "ctaLabel", type: "text", defaultValue: "Discuss your specification" },
                { name: "ctaUrl", type: "text", defaultValue: "/request-a-quote" },
              ],
            },
            {
              type: "group",
              name: "processSection",
              fields: [
                { name: "eyebrow", type: "text", defaultValue: "How we work" },
                { name: "heading", type: "text", required: true },
                { name: "body", type: "textarea" },
                {
                  name: "steps",
                  type: "array",
                  admin: { description: "The real process sequence, four to five steps." },
                  fields: [
                    { name: "title", type: "text", required: true },
                    { name: "body", type: "textarea", required: true },
                  ],
                },
                { name: "linkLabel", type: "text", defaultValue: "Manufacturing & quality" },
                { name: "linkUrl", type: "text", defaultValue: "/manufacturing-quality" },
              ],
            },
            {
              type: "group",
              name: "qualitySection",
              fields: [
                { name: "eyebrow", type: "text", defaultValue: "Quality" },
                { name: "heading", type: "text", required: true },
                { name: "body", type: "textarea" },
                { name: "image", type: "upload", relationTo: "media" },
                {
                  name: "points",
                  type: "array",
                  admin: { description: "Testing capability highlights — illustrative until verified." },
                  fields: [
                    { name: "title", type: "text", required: true },
                    { name: "body", type: "textarea" },
                  ],
                },
                { name: "linkLabel", type: "text", defaultValue: "Quality workflow" },
                { name: "linkUrl", type: "text", defaultValue: "/manufacturing-quality" },
              ],
            },
            {
              type: "group",
              name: "resourcesSection",
              fields: [
                { name: "eyebrow", type: "text", defaultValue: "Resources" },
                { name: "heading", type: "text", required: true },
                { name: "body", type: "textarea" },
                {
                  name: "items",
                  type: "relationship",
                  relationTo: "resources",
                  hasMany: true,
                  admin: { description: "Shown when public documents exist." },
                },
                { name: "ctaLabel", type: "text", defaultValue: "Browse the resource library" },
                { name: "ctaUrl", type: "text", defaultValue: "/resources" },
                {
                  name: "requestNote",
                  type: "text",
                  defaultValue: "Technical documents can also be requested directly.",
                },
              ],
            },
            {
              type: "group",
              name: "closingCta",
              fields: [
                { name: "heading", type: "text", defaultValue: "Have a material requirement to solve?" },
                { name: "body", type: "textarea" },
                { name: "primaryLabel", type: "text", defaultValue: "Request a quote" },
                { name: "primaryUrl", type: "text", defaultValue: "/request-a-quote" },
                { name: "secondaryLabel", type: "text", defaultValue: "Contact us" },
                { name: "secondaryUrl", type: "text", defaultValue: "/contact" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
