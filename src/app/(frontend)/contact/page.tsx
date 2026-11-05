import type { Metadata } from "next";
import Link from "next/link";

import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { getSiteGlobals } from "@/lib/cms";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the Daman Plastics team about a material requirement, technical question or documentation request.",
};

export default async function ContactPage() {
  const { site } = await getSiteGlobals();
  const contact = site.contact;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the technical team"
        lead="Tell us about the application, the processing method and what the material needs to do. Enquiries are stored in the CMS and reviewed by the team."
      />

      <section className="bg-surface">
        <div className="shell grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
          <div className="lg:col-span-7">
            <EnquiryForm variant="contact" sourcePath="/contact" />
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-[var(--radius-card)] border border-border bg-surface-muted p-7">
              <p className="eyebrow text-accent">Direct details</p>
              <ul className="mt-4 space-y-4 text-sm">
                {contact?.email ? (
                  <li>
                    <span className="block font-medium text-foreground">Email</span>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-muted underline-offset-4 hover:text-foreground hover:underline"
                    >
                      {contact.email}
                    </a>
                  </li>
                ) : null}
                {contact?.phone ? (
                  <li>
                    <span className="block font-medium text-foreground">Phone</span>
                    <span className="text-muted">{contact.phone}</span>
                  </li>
                ) : null}
                {contact?.hours ? (
                  <li>
                    <span className="block font-medium text-foreground">Hours</span>
                    <span className="text-muted">{contact.hours}</span>
                  </li>
                ) : null}
                {contact?.address ? (
                  <li>
                    <span className="block font-medium text-foreground">Address</span>
                    <span className="whitespace-pre-line text-muted">{contact.address}</span>
                  </li>
                ) : null}
                {!contact?.email && !contact?.phone && !contact?.address ? (
                  <li className="text-muted">
                    Contact details are published here once supplied by the client.
                  </li>
                ) : null}
              </ul>

              <div className="mt-6 border-t border-border pt-6">
                <p className="text-sm leading-relaxed text-muted">
                  Prefer a structured request? The quote form captures processing method,
                  specification and volumes in one go.
                </p>
                <Link
                  href="/request-a-quote"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent"
                >
                  Go to the quote form
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
