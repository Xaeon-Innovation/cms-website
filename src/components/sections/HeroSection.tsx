"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

const words = ["Growth", "Acquisition", "Excellence", "Patients"];

export function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % words.length), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-surface pt-20">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute min-w-full min-h-full object-cover top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-80"
        >
          <source src="/assets/videos/13820343_3840_2160_30fps.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for text contrast and premium feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/50 z-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass ghost-border mb-4">
            <span className="w-2 h-2 rounded-full bg-primary-fixed" />
            <span className="text-sm font-body text-primary-fixed uppercase tracking-wider">Creative Multi Solutions</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-medium text-foreground leading-[1.1] max-w-4xl">
            Where Clinics Find{" "}
            <span className="text-primary inline-block min-w-[280px]">
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {words[index]}
              </motion.span>
            </span>
            <br />
            Where Patients Find Care.
          </h1>

          <p className="text-lg md:text-xl text-foreground/70 font-body max-w-2xl mx-auto mt-6 leading-relaxed">
            Bridging the gap between specialized healthcare and those who seek it most. We curate journeys of clinical perfection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 pt-8">
            <Link href="/contact">
              <Button size="lg" variant="primary" className="w-full sm:w-auto">
                Start Acquiring Patients
              </Button>
            </Link>
            <Link href="/mobadra">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Discover Mobadra
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
