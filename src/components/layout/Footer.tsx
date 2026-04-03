"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { SocialLinksRow } from "@/components/social/SocialLinksRow";
import {
  emptySocialLinks,
  fetchContactSettings,
  resolveSocialLinks,
  type SiteContactSettings,
} from "@/lib/siteContactSettings";

const FALLBACK_CONTACT: Pick<SiteContactSettings, "phone" | "email" | "address"> = {
  phone: "+971503859003",
  email: "info@creativemultisolutions.com",
  address: "AlWadi Building, Office 203, Sheikh Zaid Road, Dubai, U.A.E",
};

export function Footer() {
  const pathname = usePathname();
  const [contact, setContact] = useState<SiteContactSettings | null>(null);

  useEffect(() => {
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth")) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchContactSettings();
        if (!cancelled) setContact(data);
      } catch {
        if (!cancelled) setContact(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth")) {
    return null;
  }

  const phone = contact?.phone?.trim() || FALLBACK_CONTACT.phone;
  const email = contact?.email?.trim() || FALLBACK_CONTACT.email;
  const address = contact?.address?.trim() || FALLBACK_CONTACT.address;
  const socialLinks = resolveSocialLinks(contact?.social ?? emptySocialLinks());

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-outline-variant/20 bg-surface-container-lowest pb-8 pt-12 md:pt-16">
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-4 md:gap-12">
        <div className="col-span-1 space-y-4 md:col-span-2">
          <Link href="/" className="flex items-center">
            <img
              src="/assets/longlogo.png"
              alt="Creative Multi Solutions"
              className="h-10 max-w-[220px] object-contain drop-shadow-[0_0_15px_rgba(232,197,131,0.15)] md:h-12"
            />
          </Link>
          <p className="mt-4 max-w-sm font-body leading-relaxed text-foreground/70">
            Creative Multi Solutions. We don&apos;t just market; we move people. Empowering high-end patient
            acquisition &amp; humanitarian care.
          </p>
          <div className="mt-4 space-y-3">
            <Badge variant="outline">Dubai, U.A.E</Badge>
            <div className="font-body text-sm text-foreground/65">
              <p className="leading-relaxed">{address}</p>
              <p className="mt-2">
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-primary-fixed">
                  {phone}
                </a>
              </p>
              <p className="mt-1">
                <a href={`mailto:${email}`} className="hover:text-primary-fixed">
                  {email}
                </a>
              </p>
            </div>
            <SocialLinksRow links={socialLinks} className="pt-1" />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-display text-lg text-primary">Solutions</h4>
          <ul className="space-y-2 font-body text-sm text-foreground/70">
            <li>
              <Link href="/services" className="transition-colors hover:text-primary">
                Patient Acquisition
              </Link>
            </li>
            <li>
              <Link href="/services" className="transition-colors hover:text-primary">
                Healthcare Branding
              </Link>
            </li>
            <li>
              <Link href="/mobadra" className="text-primary-fixed transition-colors hover:text-primary">
                Creative Mobadra
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-display text-lg text-primary">Company</h4>
          <ul className="space-y-2 font-body text-sm text-foreground/70">
            <li>
              <Link href="/about" className="transition-colors hover:text-primary">
                Our Story
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="transition-colors hover:text-primary">
                Patient Reviews
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-primary">
                Contact
              </Link>
            </li>
            <li className="pt-4">
              <Link href="/auth/signin" className="text-xs opacity-50 transition-colors hover:text-primary">
                Admin Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-outline-variant/10 px-4 pt-8 font-body text-xs text-foreground/40 transition-colors sm:px-6 md:mt-16">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <p>© {new Date().getFullYear()} Creative Multi Solutions. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 md:mt-0">
            <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 border-t border-outline-variant/10 pt-6 md:justify-start">
          <span className="text-foreground/50">Website developed by</span>
          <Link
            href="https://xaeons.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center opacity-85 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest"
          >
            <Image
              src="/assets/xaeon.png"
              alt="XAEON"
              width={140}
              height={36}
              className="h-7 w-auto object-contain object-left sm:h-8"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
