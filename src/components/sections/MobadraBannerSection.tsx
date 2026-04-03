"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { HeartPulse, CheckCircle2 } from "lucide-react";

export function MobadraBannerSection() {
  return (
    <section className="relative py-20 md:py-32 bg-surface-container-lowest overflow-hidden border-y border-outline-variant/20">
      
      {/* Background Effect */}
      <div className="absolute top-0 right-0 w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] md:w-[800px] md:h-[800px] bg-secondary-container/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      {/* Circle logo watermark — right side, behind content */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 z-[1] hidden h-[min(52vw,26rem)] w-[min(52vw,26rem)] -translate-x-6 -translate-y-1/2 opacity-[0.14] md:block lg:h-[min(48vw,28rem)] lg:w-[min(48vw,28rem)] lg:-translate-x-14 lg:opacity-[0.18]"
        aria-hidden
      >
        <Image
          src="/assets/circlelogo.png"
          alt=""
          fill
          className="object-contain object-right"
          sizes="(max-width: 1024px) 50vw, 28rem"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex flex-col items-start gap-2">
              <span className="text-xl font-bold text-primary/80">Creative Mobadra</span>
              <h2 className="text-3xl md:text-5xl font-display font-medium text-foreground">
                Because Every Patient Deserves More Than A Diagnosis.
              </h2>
            </div>
            
            <p className="text-base md:text-lg text-foreground/80 font-body leading-relaxed">
              The Mobadra Initiative is our humanitarian core. We bridge patients with critical care needs to top-tier hospitals, offering comprehensive support from transportation to post-treatment follow-ups—completely free of charge.
            </p>

            <Link href="/mobadra" className="inline-block mt-4 w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto">
                Join The Initiative <HeartPulse className="ml-2 w-5 h-5"/>
              </Button>
            </Link>
          </motion.div>

          {/* Feature highlights grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              "Free Transport", 
              "On-Site Coordinators", 
              "Fast-Track Check-In", 
              "Dedicated Support",
              "Follow-Up Care",
              "Zero Cost to Patients"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-sm glass border border-secondary/10">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                <span className="font-body text-sm font-medium text-foreground">{item}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
