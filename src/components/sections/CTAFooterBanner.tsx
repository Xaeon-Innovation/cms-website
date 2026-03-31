"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTAFooterBanner() {
  return (
    <section className="bg-surface">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* Clinic Side */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="p-8 sm:p-12 md:p-20 lg:p-32 flex flex-col justify-center bg-surface-container-high border-b lg:border-b-0 lg:border-r border-outline-variant/10 relative group"
        >
          <div className="max-w-md mx-auto xl:ml-auto xl:mr-16 space-y-8 relative z-10 w-full">
             <div className="text-sm font-body text-primary-fixed uppercase tracking-wider">For Medical Practices</div>
             <h2 className="text-3xl md:text-4xl font-display font-medium text-foreground">
               Elevate Your Clinic's Footprint.
             </h2>
             <Link href="/contact" className="inline-block mt-4">
               <Button variant="primary" size="lg" className="w-full sm:w-auto mt-4 group-hover:tracking-wider transition-all">
                 Request Consultation <ArrowRight className="ml-2 w-4 h-4" />
               </Button>
             </Link>
          </div>
          {/* Hover highlight layer */}
          <div className="absolute inset-0 bg-primary-fixed/0 group-hover:bg-primary-fixed/5 transition-colors duration-500 pointer-events-none" />
        </motion.div>

        {/* Patient Side */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
         className="p-8 sm:p-12 md:p-20 lg:p-32 flex flex-col justify-center bg-surface-container-lowest relative group"
        >
          <div className="max-w-md mx-auto xl:mr-auto xl:ml-16 space-y-8 relative z-10 w-full">
             <div className="text-sm font-body text-primary-fixed uppercase tracking-wider">For Patients</div>
             <h2 className="text-3xl md:text-4xl font-display font-medium text-foreground">
               Find the Care You Deserve.
             </h2>
             <Link href="/mobadra" className="inline-block mt-4">
               <Button variant="secondary" size="lg" className="w-full sm:w-auto mt-4">
                 Join Mobadra Initiative <ArrowRight className="ml-2 w-4 h-4" />
               </Button>
             </Link>
          </div>
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 pointer-events-none" />
        </motion.div>

      </div>
    </section>
  );
}
