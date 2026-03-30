"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

function Counter({ target, label }: { target: number; label: string }) {
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
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16); 
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div ref={ref} className="text-center space-y-2 p-8">
      <div className="text-5xl md:text-7xl font-display font-medium text-primary-fixed">
        {count.toLocaleString()}+
      </div>
      <div className="text-sm font-body text-foreground/70 uppercase tracking-widest">{label}</div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-24 bg-surface-container relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-outline-variant/10">
        <Counter target={300} label="Organizations" />
        <Counter target={20} label="Years Expertise" />
        <Counter target={6000} label="Happy Patients" />
      </div>
    </section>
  );
}
