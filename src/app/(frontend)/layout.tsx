import type { Metadata } from "next";
import { DM_Sans, IBM_Plex_Mono, Manrope } from "next/font/google";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSiteGlobals } from "@/lib/cms";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
});

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { site, seo } = await getSiteGlobals();
  const baseUrl = (seo.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
    .replace(/\/$/, "");
  const title = seo.metaTitle || "Daman Plastics — Engineered polymer compounds";
  const description = seo.defaultDescription ?? undefined;
  const socialImage = seo.socialImage && typeof seo.socialImage === "object" ? seo.socialImage.url : null;

  return {
    title: {
      default: title,
      template: seo.titleTemplate || "%s | Daman Plastics",
    },
    description,
    metadataBase: new URL(baseUrl),
    icons: {
      icon: [
        { url: "/brand/favicon.ico" },
        { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
        { url: "/brand/favicon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/brand/favicon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/brand/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      siteName: site.companyName || "Daman Plastics",
      title,
      description,
      url: baseUrl,
      images: socialImage ? [{ url: socialImage }] : undefined,
    },
    robots: seo.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

const jsonLdScript = (data: Record<string, unknown>) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { site, header, seo, theme } = await getSiteGlobals();
  const baseUrl = (seo.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
    .replace(/\/$/, "");

  const overrides = theme.accentOverride?.enabled
    ? {
        ...(theme.accentOverride.accent ? { "--accent": theme.accentOverride.accent } : {}),
        ...(theme.accentOverride.primary ? { "--primary": theme.accentOverride.primary } : {}),
        ...(theme.accentOverride.background
          ? { "--background": theme.accentOverride.background }
          : {}),
      }
    : {};

  const organizationSchema =
    seo.organizationSchema && site.companyName
      ? {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.companyName,
          slogan: site.tagline ?? undefined,
          url: baseUrl,
          email: site.contact?.email ?? undefined,
        }
      : null;

  return (
    <html
      lang="en"
      data-theme={theme.preset === "teal" ? "teal" : "navy"}
      style={overrides as React.CSSProperties}
      className={`${manrope.variable} ${dmSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <MotionConfig reducedMotion="user">
          {site.announcement?.enabled && site.announcement.message ? (
            <AnnouncementBar announcement={site.announcement} />
          ) : null}
          <SiteHeader header={header} site={site} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter site={site} header={header} />
        </MotionConfig>
        {organizationSchema ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationSchema) }}
          />
        ) : null}
      </body>
    </html>
  );
}
