"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createLead } from "@/lib/firestore/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialLinksRow } from "@/components/social/SocialLinksRow";
import {
  emptySocialLinks,
  fetchContactSettings,
  resolveSocialLinks,
  type SiteContactSettings,
} from "@/lib/siteContactSettings";

const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  service: z.enum(["acquisition", "social", "seo", "other"]),
  message: z.string().optional(),
});

const FALLBACK: Pick<SiteContactSettings, "phone" | "email" | "address"> = {
  phone: "+971503859003",
  email: "info@creativemultisolutions.com",
  address: "AlWadi Building, Office 203\nSheikh Zaid Road, Dubai, U.A.E",
};

export default function ContactPageClient({ mapSlot }: { mapSlot: ReactNode }) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [contact, setContact] = useState<SiteContactSettings | null>(null);

  useEffect(() => {
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
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: { service: "acquisition" },
  });

  const onSubmit = async (values: z.infer<typeof leadSchema>) => {
    setSubmitting(true);
    await createLead(values);
    setSuccess(true);
    reset();
    setSubmitting(false);
  };

  const phone = contact?.phone?.trim() || FALLBACK.phone;
  const email = contact?.email?.trim() || FALLBACK.email;
  const address = contact?.address?.trim() || FALLBACK.address;
  const socialLinks = resolveSocialLinks(contact?.social ?? emptySocialLinks());

  return (
    <div className="bg-surface pb-20 pt-28 md:pb-24 md:pt-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 md:gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <h1 className="font-display text-4xl font-medium text-primary sm:text-5xl">Get in Touch</h1>
            <p className="font-body text-base text-foreground/70 md:text-lg">
              Ready to transform your patient acquisition? We bring the finest digital strategies directly to your
              clinic doors.
            </p>
          </div>

          <div className="max-w-2xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-14 sm:gap-y-0 sm:items-start">
              <section className="flex min-h-0 flex-col gap-3">
                <h4 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary-fixed">
                  Headquarters
                </h4>
                <p className="whitespace-pre-line font-body text-[0.9375rem] leading-[1.65] text-foreground/85">
                  {address}
                </p>
              </section>
              <section className="flex min-h-0 flex-col gap-3">
                <h4 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary-fixed">
                  Contact lines
                </h4>
                <dl className="m-0 space-y-4 p-0 font-body text-[0.9375rem] leading-[1.65]">
                  <div className="m-0">
                    <dt className="mb-1 text-[0.6875rem] font-medium uppercase tracking-wider text-foreground/55">
                      Email
                    </dt>
                    <dd className="m-0">
                      <a
                        href={`mailto:${email}`}
                        className="text-primary-fixed underline-offset-[3px] transition-colors hover:underline"
                      >
                        {email}
                      </a>
                    </dd>
                  </div>
                  <div className="m-0">
                    <dt className="mb-1 text-[0.6875rem] font-medium uppercase tracking-wider text-foreground/55">
                      Phone
                    </dt>
                    <dd className="m-0">
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="text-primary-fixed underline-offset-[3px] transition-colors hover:underline"
                      >
                        {phone}
                      </a>
                    </dd>
                  </div>
                </dl>
              </section>
            </div>

            {socialLinks.length > 0 && (
              <section className="mt-10 border-t border-outline-variant/20 pt-8">
                <h4 className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary-fixed">
                  Follow us
                </h4>
                <SocialLinksRow links={socialLinks} className="gap-3.5" />
              </section>
            )}
          </div>

          {mapSlot}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="rounded-sm border-t-2 border-primary-fixed bg-surface-container p-6 shadow-2xl sm:p-8 md:p-12">
            <h3 className="mb-8 font-display text-2xl text-foreground">Direct Consultation Request</h3>

            {success ? (
              <div className="space-y-4 py-8 text-center">
                <h3 className="font-display text-2xl text-primary">Message Sent</h3>
                <p className="font-body text-foreground/80">
                  Our medical acquisition team will review your details and contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Input
                    placeholder="Full Name or Clinic Name"
                    error={!!errors.name}
                    {...register("name")}
                  />
                  {errors.name && (
                    <span className="mt-1 block px-2 text-[11px] text-error">{errors.name.message}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <Input
                      placeholder="Email Address"
                      type="email"
                      error={!!errors.email}
                      {...register("email")}
                    />
                    {errors.email && (
                      <span className="mt-1 block px-2 text-[11px] text-error">{errors.email.message}</span>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="Phone (WhatsApp preferred)"
                      type="tel"
                      error={!!errors.phone}
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <span className="mt-1 block px-2 text-[11px] text-error">{errors.phone.message}</span>
                    )}
                  </div>
                </div>

                <div>
                  <select
                    className="h-12 w-full rounded-sm border border-outline-variant/25 bg-surface-container-low px-4 font-body text-foreground transition-[background-color,border-color,box-shadow] duration-200 placeholder:text-outline-variant/70 hover:border-outline-variant/45 hover:bg-surface-container-low/90 focus-visible:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary/70 focus-visible:shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
                    {...register("service")}
                  >
                    <option value="acquisition">Patient Acquisition Funnels</option>
                    <option value="social">Social Media Branding</option>
                    <option value="seo">Medical SEO & Website</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>

                <div>
                  <textarea
                    placeholder="Tell us about your clinic's goals..."
                    className="flex min-h-[140px] w-full resize-none rounded-sm border border-outline-variant/25 bg-surface-container-low px-4 py-3 font-body text-base text-foreground transition-[background-color,border-color,box-shadow] duration-200 placeholder:text-outline-variant/70 hover:border-outline-variant/45 hover:bg-surface-container-low/90 focus-visible:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary/70 focus-visible:shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
                    {...register("message")}
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                  {submitting ? "Sending..." : "Request Consultation"}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
