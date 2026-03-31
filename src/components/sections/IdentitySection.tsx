"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type AnimatedStatProps = {
  label: string;
  target: number;
  suffix?: string;
};

function AnimatedStat({ label, target, suffix = "" }: AnimatedStatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.35 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 1800;
    const increment = target / (duration / 16);
    const timer = window.setInterval(() => {
      start += increment;

      if (start >= target) {
        setCount(target);
        window.clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => window.clearInterval(timer);
  }, [inView, target]);

  return (
    <div ref={ref} className="glass ghost-border rounded-sm p-5 sm:p-6 md:p-8 space-y-2">
      <div className="text-3xl font-display text-primary md:text-4xl">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm font-body uppercase tracking-wider text-foreground/60">
        {label}
      </div>
    </div>
  );
}

export function IdentitySection() {
  return (
    <section className="py-20 md:py-32 bg-surface-container-low relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-primary">
              We Don't Just Market. <br/>
              <span className="text-foreground">We Move People.</span>
            </h2>
            <p className="text-base md:text-lg text-foreground/70 font-body leading-relaxed max-w-lg">
              Medical marketing is built on authority. Our editorial approach crafts a narrative of excellence that resonates with high-value patient demographics, ensuring your practice is discovered by those who value clinical mastery.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            {[
              { label: "Partner Health Centers", target: 10, suffix: "+" },
              { label: "Patients Reached", target: 7000, suffix: "+" },
              { label: "Retention Rate", target: 95, suffix: "%" },
              { label: "Clinical Excellence", target: 100, suffix: "%" }
            ].map((stat, i) => (
              <AnimatedStat
                key={i}
                label={stat.label}
                target={stat.target}
                suffix={stat.suffix}
              />
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
