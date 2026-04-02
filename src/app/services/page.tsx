"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Magnetic } from "@/components/ui/magnetic";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { ArrowRight, Briefcase, Calendar, Globe, Stethoscope } from "lucide-react";

const categories = [
  {
    id: "medical-marketing",
    title: "Medical Marketing Services",
    desc: "Marketing specialists for hospitals, specialized clinics, and medical centers. Let us achieve your goals and increase profits practically.",
    imageFile: "medical.png",
  },
  {
    id: "online-marketing",
    title: "Digital Marketing",
    desc: "Comprehensive digital strategies to expand your reach, build your brand, and convert views into loyal patients.",
    imageFile: "digital (2).png",
  },
  {
    id: "events-organizing",
    title: "Events Organizing & Managing",
    desc: "Professional event management ensuring flawless execution from conceptualization to post-event media.",
    imageFile: "Events Organizing & Managing.png",
  },
  {
    id: "consultancy",
    title: "Consultancy",
    desc: "Strategic guidance to elevate your team's performance, operations, and standard of care.",
    imageFile: "Consultancy.png",
  },
] as const;

function serviceImageSrc(imageFile: string) {
  return `/assets/services/${encodeURIComponent(imageFile)}`;
}

type ServiceId = (typeof categories)[number]["id"];

function ServiceTitleIcon({ id }: { id: ServiceId }) {
  const c = "w-8 h-8 sm:w-9 sm:h-9 text-primary";
  switch (id) {
    case "medical-marketing":
      return <AnimatedIcon icon={<Stethoscope className={c} />} animation="pulse" />;
    case "online-marketing":
      return <AnimatedIcon icon={<Globe className={c} />} animation="spin" />;
    case "events-organizing":
      return <AnimatedIcon icon={<Calendar className={c} />} animation="shake" delay={0.5} />;
    case "consultancy":
      return <AnimatedIcon icon={<Briefcase className={c} />} animation="float" />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

export default function ServicesPage() {
  return (
    <div className="bg-surface pt-28 md:pt-32 pb-20 md:pb-24 relative overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -right-[10%] w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[500px] md:h-[500px] rounded-full bg-primary/20 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], x: [0, -100, 0], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] -left-[10%] w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[600px] md:h-[600px] rounded-full bg-secondary/30 blur-[150px]"
        />
        <motion.div
          animate={{ y: [0, -50, 0], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] right-[20%] w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] rounded-full bg-primary-container/40 blur-[100px]"
        />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20 md:mb-24 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <Badge className="mb-4 shadow-sm border border-primary/20">Our Expertise</Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium text-primary">
              Comprehensive Medical Marketing
            </h1>
            <p className="text-base md:text-xl text-foreground/70 font-body leading-relaxed">
              Elevating healthcare brands through targeted patient acquisition, digital dominance, flawless events, and strategic consultancy.
            </p>
          </motion.div>
        </section>

        {/* Services — title, description, alternating image */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 md:space-y-24">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, type: "spring", bounce: 0.25 }}
              className={`flex flex-col gap-8 md:gap-12 md:flex-row md:items-center ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <motion.div
                className="w-full md:w-1/2 md:min-w-0 flex flex-col items-center justify-center text-center px-2 sm:px-4"
                initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, type: "spring", bounce: 0.2, delay: 0.05 }}
              >
                <div className="flex max-w-xl flex-col items-center gap-5">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                    className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-surface-container shadow-md flex items-center justify-center border border-primary/20 ring-2 ring-primary/5"
                  >
                    <ServiceTitleIcon id={category.id} />
                  </motion.div>
                  <div className="min-w-0 space-y-4">
                    <motion.h2
                      className="text-3xl md:text-4xl font-display text-primary tracking-tight text-balance"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: 0.12 }}
                    >
                      {category.title}
                    </motion.h2>
                    <motion.p
                      className="text-base md:text-lg text-foreground/70 font-body leading-relaxed text-pretty"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: 0.2 }}
                    >
                      {category.desc}
                    </motion.p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="relative w-full md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-outline-variant/25 bg-surface-container group ring-1 ring-primary/10 transition-shadow duration-300 hover:ring-primary/25 hover:shadow-2xl"
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.2, delay: 0.08 }}
              >
                <Image
                  src={serviceImageSrc(category.imageFile)}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-secondary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.12)] dark:shadow-[inset_0_0_80px_rgba(0,0,0,0.35)]"
                  aria-hidden
                />
              </motion.div>
            </motion.div>
          ))}
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-24 md:mt-40 text-center pb-12 md:pb-20">
          <Magnetic intensity={0.1}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="px-6 py-10 sm:px-8 sm:py-12 md:p-20 bg-surface-container-high shadow-2xl rounded-3xl space-y-6 md:space-y-8 border border-white/10 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <h2 className="text-3xl md:text-4xl font-display text-primary relative z-10">
                Ready to accelerate your practice&apos;s growth?
              </h2>
              <p className="text-foreground/80 relative z-10 max-w-xl mx-auto text-base md:text-lg">
                Get in touch with our specialists today and let us craft a bespoke strategy tailored to your clinic&apos;s unique goals.
              </p>

              <Link href="/contact" className="inline-block relative z-10 mt-6 pointer-events-auto">
                <Magnetic intensity={0.3}>
                  <Button variant="primary" size="lg" className="shadow-xl w-full sm:w-auto py-5 px-8 rounded-full text-base md:text-lg group-hover:bg-primary-dark transition-all">
                    Start Your Journey <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Magnetic>
              </Link>
            </motion.div>
          </Magnetic>
        </section>
      </div>
    </div>
  );
}
