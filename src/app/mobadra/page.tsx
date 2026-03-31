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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Free Transportation", desc: "Safe transit to and from the hospital." },
            { title: "On-Site Coordinators", desc: "Personal assistants deployed to manage logistics." },
            { title: "Fast-Track Check-In", desc: "Bypassing typical bureaucratic waiting times." },
            { title: "Follow-Up Appointments", desc: "Scheduling and monitoring post-treatment." },
            { title: "Patient Support", desc: "24/7 dedicated emotional and logistical hotlines." },
            { title: "Post-Treatment Visits", desc: "Ensuring recovery goes exactly as planned." }
          ].map((srv, i) => (
             <div key={i} className="glass p-8 rounded-sm ghost-border space-y-3">
               <h3 className="text-xl font-display text-primary-container">{srv.title}</h3>
               <p className="text-sm font-body text-foreground/70">{srv.desc}</p>
             </div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
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
                  className={`flex w-full min-h-[120px] bg-surface-container-low px-4 py-3 font-body text-base placeholder:text-outline-variant border-b border-transparent focus-visible:outline-none focus:border-primary focus:bg-surface-container transition-all resize-none ${errors.notes ? "border-error focus:border-error" : ""}`}
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
