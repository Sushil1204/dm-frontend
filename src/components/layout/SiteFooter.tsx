import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import type { HeaderSetting, SiteSetting } from "@/payload-types";

type Props = {
  site: SiteSetting;
  header: HeaderSetting;
};

export function SiteFooter({ site, header }: Props) {
  const year = new Date().getFullYear();
  const company = site.companyName || "Daman Plastics";
  const copyright =
    site.copyrightText?.trim() || `© ${year} ${company}. All rights reserved.`;
  const navItems = header.navItems ?? [];
  const contact = site.contact;

  return (
    <footer className="bg-footer text-white">
      <div className="shell py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-display text-2xl font-semibold tracking-tight">{company}</p>
            <p className="mt-1 font-mono text-meta uppercase tracking-[0.12em] text-white/60">
              {site.tagline}
            </p>
            {site.footerDescription ? (
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
                {site.footerDescription}
              </p>
            ) : null}
            <div className="mt-7">
              <ButtonLink href={header.ctaUrl || "/request-a-quote"} variant="accent" size="sm">
                Start a conversation
              </ButtonLink>
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <div>
              <p className="eyebrow text-white/50">Company</p>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/75">
                {navItems.slice(0, 3).map((item) => (
                  <li key={item.label}>
                    <Link href={item.url} className="transition-colors hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/privacy-policy" className="transition-colors hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="eyebrow text-white/50">Explore</p>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/75">
                {navItems.slice(3).map((item) => (
                  <li key={item.label}>
                    <Link href={item.url} className="transition-colors hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/materials" className="transition-colors hover:text-white">
                    Materials
                  </Link>
                </li>
                <li>
                  <Link href="/applications" className="transition-colors hover:text-white">
                    Applications
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow text-white/50">Contact</p>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/75">
                {contact?.email ? (
                  <li>
                    <a href={`mailto:${contact.email}`} className="transition-colors hover:text-white">
                      {contact.email}
                    </a>
                  </li>
                ) : null}
                {contact?.phone ? <li>{contact.phone}</li> : null}
                {contact?.hours ? <li className="text-white/60">{contact.hours}</li> : null}
                {contact?.address ? (
                  <li className="whitespace-pre-line text-white/60">{contact.address}</li>
                ) : null}
              </ul>
              {site.socialLinks?.length ? (
                <ul className="mt-5 flex flex-wrap gap-4 text-sm text-white/75">
                  {site.socialLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.url}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </nav>

          <div className="lg:col-span-3">
            <p className="eyebrow text-white/50">Request a quote</p>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Share your material requirement, application and processing method — the team
              will follow up with technical questions.
            </p>
            <div className="mt-5">
              <ButtonLink href="/contact" variant="inverse" size="sm">
                Discuss your requirement
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright}</p>
          {site.demoNotice ? <p>Illustrative demo content — figures and claims pending client verification.</p> : null}
        </div>
      </div>
    </footer>
  );
}
