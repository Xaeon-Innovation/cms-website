"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createLead } from "@/lib/firestore/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  service: z.enum(["acquisition", "social", "seo", "other"]),
  message: z.string().optional()
});

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: { service: 'acquisition' }
  });

  const onSubmit = async (values: z.infer<typeof leadSchema>) => {
    setSubmitting(true);
    await createLead(values);
    setSuccess(true);
    reset();
    setSubmitting(false);
  };

  return (
    <div className="bg-surface pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Info Column */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-display font-medium text-primary">Get in Touch</h1>
            <p className="text-lg text-foreground/70 font-body">Ready to transform your patient acquisition? We bring the finest digital strategies directly to your clinic doors.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h4 className="font-display text-primary-fixed uppercase tracking-widest text-sm">Headquarters</h4>
              <p className="font-body text-foreground/80 leading-relaxed">
                AlWadi Building, Office 203<br/>
                Sheikh Zaid Road, Dubai, U.A.E
              </p>
            </div>
            <div className="space-y-2">
               <h4 className="font-display text-primary-fixed uppercase tracking-widest text-sm">Contact Lines</h4>
               <p className="font-body text-foreground/80 leading-relaxed">
                 Email: info@creativemultisolutions.com<br/>
                 Phone: +971503859003<br/>
                 Phone: +971542090003
               </p>
            </div>
          </div>
          
          <div className="w-full h-64 bg-surface-container-high rounded-sm flex items-center justify-center opacity-50 ghost-border overflow-hidden">
             <div className="text-xs uppercase tracking-widest font-body text-foreground/40 text-center space-y-2">
               Google Maps Embed Placeholder<br/>
               <span className="text-[10px]">(Requires API Key for 3D View)</span>
             </div>
          </div>
        </motion.div>

        {/* Contact Form Column */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
           <div className="bg-surface-container p-8 md:p-12 rounded-sm border-t-2 border-primary-fixed shadow-2xl">
             <h3 className="text-2xl font-display text-foreground mb-8">Direct Consultation Request</h3>
             
             {success ? (
               <div className="text-center space-y-4 py-8">
                 <h3 className="text-2xl font-display text-primary">Message Sent</h3>
                 <p className="font-body text-foreground/80">Our medical acquisition team will review your details and contact you shortly.</p>
               </div>
             ) : (
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                 <div>
                   <Input placeholder="Full Name or Clinic Name" error={!!errors.name} {...register("name")} />
                   {errors.name && <span className="text-error text-[11px] mt-1 block px-2">{errors.name.message}</span>}
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <Input placeholder="Email Address" type="email" error={!!errors.email} {...register("email")} />
                     {errors.email && <span className="text-error text-[11px] mt-1 block px-2">{errors.email.message}</span>}
                   </div>
                   <div>
                     <Input placeholder="Phone (WhatsApp preferred)" type="tel" error={!!errors.phone} {...register("phone")} />
                     {errors.phone && <span className="text-error text-[11px] mt-1 block px-2">{errors.phone.message}</span>}
                   </div>
                 </div>

                 <div>
                   <select className="w-full bg-surface-container-low h-12 px-4 border-b border-transparent focus:border-primary font-body text-foreground outline-none" {...register("service")}>
                     <option value="acquisition">Patient Acquisition Funnels</option>
                     <option value="social">Social Media Branding</option>
                     <option value="seo">Medical SEO & Website</option>
                     <option value="other">Other Inquiry</option>
                   </select>
                 </div>

                 <div>
                    <textarea 
                      placeholder="Tell us about your clinic's goals..." 
                      className="flex w-full min-h-[140px] bg-surface-container-low px-4 py-3 font-body text-base placeholder:text-outline-variant border-b border-transparent focus-visible:outline-none focus:border-primary focus:bg-surface-container transition-all resize-none"
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
