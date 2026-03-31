"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Clinical Analysis",
    des: "We begin by diagnosing your practice’s digital footprint and patient acquisition workflows.",
    num: "01"
  },
  {
    title: "Precision Strategy",
    des: "Leveraging proprietary data to isolate high-intent patients specifically for your specialties.",
    num: "02"
  },
  {
    title: "Editorial Execution",
    des: "Crafting narratives of authority and trust that position your clinic as the absolute standard of care.",
    num: "03"
  },
  {
    title: "Continuous Optimisation",
    des: "Refining the acquisition pipeline through rigorous performance metrics and patient feedback loops.",
    num: "04"
  }
];

export function ApproachSection() {
  return (
    <section className="py-20 md:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-3xl md:text-4xl font-display font-medium text-primary">The Methodology</h2>
          <p className="mt-4 text-foreground/70 font-body text-base md:text-lg max-w-xl mx-auto">
            A systematic, data-driven approach to medical marketing that prioritizes sustainable growth over vanity metrics.
          </p>
        </motion.div>

        <div className="space-y-10 md:space-y-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${
                i % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="w-full md:w-1/2 flex justify-center text-[5rem] sm:text-[7rem] md:text-[10rem] font-display font-bold text-surface-container-high leading-none select-none">
                {step.num}
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="text-xl sm:text-2xl font-display text-primary">{step.title}</h3>
                <p className="text-foreground/70 font-body leading-relaxed text-base md:text-lg">
                  {step.des}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
