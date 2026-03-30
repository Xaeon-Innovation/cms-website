"use client";

import { motion } from "framer-motion";

export function IdentitySection() {
  return (
    <section className="py-32 bg-surface-container-low relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-display font-medium text-primary">
              We Don't Just Market. <br/>
              <span className="text-foreground">We Move People.</span>
            </h2>
            <p className="text-lg text-foreground/70 font-body leading-relaxed max-w-lg">
              Medical marketing is built on authority. Our editorial approach crafts a narrative of excellence that resonates with high-value patient demographics, ensuring your practice is discovered by those who value clinical mastery.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { label: "Partner Clinics", value: "500+" },
              { label: "Patients Reached", value: "10,000+" },
              { label: "Retention Rate", value: "95%" },
              { label: "Clinical Excellence", value: "100%" }
            ].map((stat, i) => (
              <div key={i} className="glass ghost-border p-8 rounded-sm space-y-2">
                <div className="text-3xl md:text-4xl font-display text-primary">{stat.value}</div>
                <div className="text-sm font-body text-foreground/60 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
