"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getMediaSettings } from "@/lib/firestore/media";

const words = ["Growth", "Acquisition", "Excellence", "Patients"];
const HERO_VIDEO_FALLBACK = "/assets/videos/13820343_3840_2160_30fps.mp4";

function getVideoMimeType(src: string) {
  const cleanSrc = src.split("?")[0]?.toLowerCase() || "";
  if (cleanSrc.endsWith(".webm")) return "video/webm";
  return "video/mp4";
}

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const [videoSrc, setVideoSrc] = useState(
    process.env.NEXT_PUBLIC_VIDEO_HERO_URL || HERO_VIDEO_FALLBACK
  );

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % words.length), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const settings = await getMediaSettings();
        const src = settings?.homeVideos?.hero;
        if (mounted && src) setVideoSrc(src);
      } catch {
        // ignore; fallback stays
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-surface pt-20"
    >
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video 
          key={videoSrc}
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="metadata"
          className="absolute min-w-full min-h-full object-cover top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-80"
        >
          <source src={videoSrc} type={getVideoMimeType(videoSrc)} />
        </video>
        {/* Dark overlay for text contrast and premium feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/50 z-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass ghost-border mb-4 max-w-full">
            <span className="w-2 h-2 rounded-full bg-primary-fixed" />
            <span className="text-xs sm:text-sm font-body text-primary-fixed uppercase tracking-wider">Creative Multi Solutions</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-medium text-foreground leading-[1.1] max-w-4xl">
            Where Clinics Find{" "}
            <span className="text-primary inline-block min-w-[180px] sm:min-w-[220px] md:min-w-[280px]">
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

          <p className="text-base md:text-xl text-foreground/70 font-body max-w-2xl mx-auto mt-6 leading-relaxed">
            Bridging the gap between specialized healthcare and those who seek it most. We curate journeys of clinical perfection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 pt-4 sm:pt-8 w-full">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto">
                Start Acquiring Patients
              </Button>
            </Link>
            <Link href="/mobadra" className="w-full sm:w-auto">
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
