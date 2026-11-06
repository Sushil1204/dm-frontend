import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Applications } from "./collections/Applications";
import { Attachments } from "./collections/Attachments";
import { Enquiries } from "./collections/Enquiries";
import { MaterialCategories } from "./collections/MaterialCategories";
import { Materials } from "./collections/Materials";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Resources } from "./collections/Resources";
import { Users } from "./collections/Users";
import {
  CompanySettings,
  HeaderSettings,
  ManufacturingSettings,
  SeoSettings,
  SiteSettings,
  ThemeSettings,
} from "./globals/settings";
import { HomepageSettings } from "./globals/homepage";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " — Daman Plastics CMS",
    },
  },
  collections: [
    // Content
    Pages,
    Media,
    // Catalogue
    MaterialCategories,
    Materials,
    Applications,
    Resources,
    // Leads
    Enquiries,
    Attachments,
    // Settings
    Users,
  ],
  globals: [
    SiteSettings,
    HeaderSettings,
    HomepageSettings,
    ThemeSettings,
    SeoSettings,
    CompanySettings,
    ManufacturingSettings,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  sharp,
  upload: {
    // Payload's default fileSize limit is 20 MB, which rejects real photos and any
    // video before storage is even reached. Browsers upload straight to Vercel Blob
    // (clientUploads below), so only the Blob store's own limits apply.
    limits: { fileSize: 100 * 1024 * 1024 },
    abortOnLimit: true,
  },
  plugins: [
    vercelBlobStorage({
      // Enabled only when running against a Vercel Blob store (production/preview).
      // Locally the token is absent, so uploads keep using disk for development.
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      // Uploads go browser → Vercel Blob directly. Without this, every file is proxied
      // through a Vercel Function, whose request body limit (4.5 MB) rejects normal
      // photos and all videos.
      clientUploads: true,
      collections: {
        // Public content: serve straight from the Blob CDN (images, video streaming).
        media: { disablePayloadAccessControl: true },
        // Private uploads: stay behind Payload's admin-only file route.
        attachments: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  graphQL: {
    disable: true,
  },
  telemetry: false,
});
