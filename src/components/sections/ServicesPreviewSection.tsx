"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

const services = [
  {
    title: "Medical Marketing",
    desc: "Dedicated marketing specialists for hospitals and clinics. We focus on increasing new patients, advertising your core services, and improving your brand's digital image.",
    tag: "Healthcare Growth",
    videoSrc: "/assets/videos/Gold_particles_converging_202603292000.mp4"
  },
  {
    title: "Digital Marketing",
    desc: "End-to-end online solutions including Google & Social Ads, custom application design, and comprehensive brand development to connect with your audience.",
    tag: "Online Presence",
    videoSrc: "/assets/videos/Luminous_point_emitting_202603292002.mp4"
  },
  {
    title: "Events Organising and Managing",
    desc: "Professional organization and flawless execution of medical exhibitions, conferences, and specialized courses to elevate your industry presence.",
    tag: "Professional Events",
    videoSrc: "/assets/videos/Lines_forming_architectural_202603292002.mp4"
  }
];

export function ServicesPreviewSection() {
  return (
    <section className="py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-4"
        >
          <h2 className="text-4xl font-display font-medium text-primary">Precision Expertise</h2>
          <p className="text-foreground/70 font-body text-lg">
            A bespoke suite of solutions tailored for medical institutions that refuse to compromise on quality.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((svc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Card className="h-full min-h-[420px] hover:-translate-y-2 transition-transform duration-500 overflow-hidden relative group border-outline-variant/20 shadow-xl">
                {svc.videoSrc && (
                  <>
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 group-hover:opacity-70 transition-opacity duration-700"
                    >
                      <source src={svc.videoSrc} type="video/mp4" />
                    </video>
                    {/* Dark gradient to ensure text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high via-surface-container-high/60 to-surface-container-high/10 z-0 pointer-events-none" />
                  </>
                )}
                
                <div className="relative z-10 flex flex-col h-full p-2">
                  <CardHeader className="pt-4 pb-0">
                    <Badge variant="outline" className="w-fit mb-4 bg-surface/50 backdrop-blur-md">{svc.tag}</Badge>
                    <CardTitle className="text-primary-fixed">{svc.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="mt-auto pb-4">
                    <CardDescription className="text-foreground/80 leading-relaxed drop-shadow-sm">{svc.desc}</CardDescription>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
