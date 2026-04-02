"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createMobadraRequest } from "@/lib/firestore/mobadra";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Ambulance,
  ArrowUpRight,
  CalendarCheck2,
  ClipboardCheck,
  Headset,
  UserRoundCheck,
} from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Valid phone number required"),
  city: z.string().min(2, "City is required"),
  hospitalNeeded: z.string().min(2, "Hospital requested is required"),
  notes: z.string().optional(),
});

export default function MobadraPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await createMobadraRequest(values);
      setSuccess(true);
      reset();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface pt-28 md:pt-32 pb-20 md:pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20 md:mb-24 relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <div className="inline-flex gap-2 justify-center w-full mb-4">
             <Badge className="font-arabic">مبادرة</Badge>
             <Badge variant="outline">Social Responsibility</Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium text-primary">
            Because Every Patient Deserves More Than a Diagnosis.
          </h1>
          <p className="text-base md:text-xl text-foreground/70 font-body leading-relaxed">
            Our humanitarian initiative connects critical cases with comprehensive healthcare coordination, entirely free of charge.
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="bg-surface-container-low py-16 md:py-24 mb-20 md:mb-24 max-w-7xl mx-auto px-4 sm:px-6 rounded-sm">
        <div className="mb-10 md:mb-14 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-medium text-foreground">
            What Mobadra provides
          </h2>
          <p className="mt-3 text-base md:text-lg text-foreground/70 font-body">
            Practical help, fast coordination, and real follow-through—without cost.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[
            {
              title: "Free Transportation",
              desc: "Safe transit to and from the hospital.",
              icon: Ambulance,
              tags: ["Transport", "Logistics"],
            },
            {
              title: "On-Site Coordinators",
              desc: "Personal assistants deployed to manage the full journey.",
              icon: UserRoundCheck,
              tags: ["Coordination", "Support"],
            },
            {
              title: "Fast-Track Check-In",
              desc: "Help navigating paperwork and reducing waiting time.",
              icon: ClipboardCheck,
              tags: ["Process", "Speed"],
            },
            {
              title: "Follow-Up Appointments",
              desc: "Scheduling and monitoring post‑treatment next steps.",
              icon: CalendarCheck2,
              tags: ["Follow-up", "Care"],
            },
            {
              title: "Patient Support",
              desc: "Dedicated guidance when you need it most.",
              icon: Headset,
              tags: ["24/7", "Hotline"],
            },
            {
              title: "Post-Treatment Visits",
              desc: "Ensuring recovery stays on track after discharge.",
              icon: Activity,
              tags: ["Recovery", "Check-ins"],
            },
          ].map((srv, i) => {
            const Icon = srv.icon;
            return (
              <div
                key={i}
                className={`
                  group relative overflow-hidden glass rounded-sm ghost-border
                  p-5 sm:p-6 md:p-7
                  transition-all duration-300
                  hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.28)]
                  focus-within:-translate-y-1 focus-within:shadow-[0_28px_70px_rgba(0,0,0,0.28)]
                `}
              >
                {/* Ambient glow */}
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full
                    bg-primary/10 blur-3xl opacity-0 transition-opacity duration-300
                    group-hover:opacity-100 group-focus-within:opacity-100
                  "
                />

                {/* Shine sweep */}
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300
                    group-hover:opacity-100 group-focus-within:opacity-100
                  "
                >
                  <div
                    className="
                      absolute -left-1/2 top-0 h-full w-1/2
                      bg-gradient-to-r from-transparent via-white/10 to-transparent
                      skew-x-[-20deg]
                      translate-x-[-30%]
                      group-hover:translate-x-[240%] group-focus-within:translate-x-[240%]
                      transition-transform duration-700 ease-out
                    "
                  />
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-sm border border-outline-variant/20 bg-surface-container-low p-3 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-display font-medium text-foreground">
                      {srv.title}
                    </h3>
                    <p className="mt-1.5 text-sm sm:text-base font-body text-foreground/75 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {srv.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-sm border border-outline-variant/20 bg-surface-container-low px-2.5 py-1 text-xs font-body text-foreground/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-xs font-body text-foreground/50">
                    Included in every request
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("request-coordination");
                      el?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-body text-primary-fixed transition-colors group-hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm"
                    aria-label="Learn more: scroll to the request coordination form"
                  >
                    Learn more <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Application Form */}
      <section
        id="request-coordination"
        className="max-w-3xl mx-auto px-4 sm:px-6 scroll-mt-28 md:scroll-mt-32"
      >
        <div className="p-6 sm:p-8 md:p-12 bg-surface-container-highest rounded-sm">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-display text-primary mb-2">Request Coordination</h2>
            <p className="text-foreground/70 font-body">Submit details for yourself or a loved one in need.</p>
          </div>

          {success ? (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 space-y-4">
               <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto text-3xl">✓</div>
               <h3 className="text-2xl font-display text-primary">Request Received</h3>
               <p className="text-foreground/80 font-body">Our team will contact you shortly to assign a coordinator.</p>
               <Button variant="secondary" onClick={() => setSuccess(false)} className="mt-8">Submit Another Patient</Button>
             </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input placeholder="Patient Name" error={!!errors.name} {...register("name")} />
                  {errors.name && <span className="text-error text-xs mt-1 block px-2">{errors.name.message}</span>}
                </div>
                <div>
                  <Input placeholder="Phone Number" type="tel" error={!!errors.phone} {...register("phone")} />
                  {errors.phone && <span className="text-error text-xs mt-1 block px-2">{errors.phone.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input placeholder="City / Location" error={!!errors.city} {...register("city")} />
                  {errors.city && <span className="text-error text-xs mt-1 block px-2">{errors.city.message}</span>}
                </div>
                <div>
                  <Input placeholder="Hospital Needed" error={!!errors.hospitalNeeded} {...register("hospitalNeeded")} />
                  {errors.hospitalNeeded && <span className="text-error text-xs mt-1 block px-2">{errors.hospitalNeeded.message}</span>}
                </div>
              </div>

              <div>
                <textarea 
                  placeholder="Additional Medical Notes..." 
                  className={`flex w-full min-h-[120px] rounded-sm bg-surface-container-low px-4 py-3 font-body text-base text-foreground placeholder:text-outline-variant/70 border border-outline-variant/25 transition-[background-color,border-color,box-shadow] duration-200 hover:border-outline-variant/45 hover:bg-surface-container-low/90 focus-visible:outline-none focus-visible:border-primary/70 focus-visible:bg-surface-container focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:shadow-[0_18px_60px_rgba(0,0,0,0.18)] resize-none ${errors.notes ? "border-error/70 hover:border-error focus-visible:border-error focus-visible:ring-error/25" : ""}`}
                  {...register("notes")} 
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Coordination Request"}
              </Button>
              <p className="text-xs text-center text-foreground/40 mt-4 leading-relaxed font-body">
                By submitting this form, you confirm the medical emergency is genuine. Mobadra operates completely non-profit.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
