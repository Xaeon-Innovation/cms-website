"use client";

import { motion, Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Magnetic } from "@/components/ui/magnetic";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { 
  ArrowRight, Stethoscope, TrendingUp, Users, Megaphone, Star, MessageSquare,
  Globe, Smartphone, Video, Camera, Palette, Award, Calendar, Mic, PartyPopper,
  Briefcase, LineChart, BookOpen, Target, HeartPlus, Activity
} from "lucide-react";

export default function ServicesPage() {
  const categories = [
    {
      id: "medical-marketing",
      title: "Medical Marketing Services",
      desc: "Marketing specialists for hospitals, specialized clinics, and medical centers. Let us achieve your goals and increase profits practically.",
      icon: <AnimatedIcon icon={<Stethoscope className="w-10 h-10 text-primary" />} animation="pulse" />,
      features: [
        { name: "Increasing the number of new patients", icon: <TrendingUp className="w-5 h-5 text-primary/70" /> },
        { name: "Following up with patients and increasing specializations", icon: <Users className="w-5 h-5 text-primary/70" /> },
        { name: "Advertising hospital services", icon: <Megaphone className="w-5 h-5 text-primary/70" /> },
        { name: "Advertising qualified doctors", icon: <AnimatedIcon icon={<Award className="w-5 h-5 text-primary/70" />} animation="float" /> },
        { name: "Increasing customer engagement with your brand", icon: <HeartPlus className="w-5 h-5 text-primary/70" /> },
        { name: "Improving your hospital’s image in Google rankings", icon: <AnimatedIcon icon={<Star className="w-5 h-5 text-primary/70" />} animation="shake" /> },
        { name: "Resolving customer problems and complaints", icon: <MessageSquare className="w-5 h-5 text-primary/70" /> },
      ]
    },
    {
      id: "online-marketing",
      title: "Digital Marketing",
      desc: "Comprehensive digital strategies to expand your reach, build your brand, and convert views into loyal patients.",
      icon: <AnimatedIcon icon={<Globe className="w-10 h-10 text-primary" />} animation="spin" />,
      features: [
        { name: "Google Ads", icon: <Target className="w-5 h-5 text-primary/70" /> },
        { name: "Social media Management", icon: <Smartphone className="w-5 h-5 text-primary/70" /> },
        { name: "Social ads", icon: <Megaphone className="w-5 h-5 text-primary/70" /> },
        { name: "Design and programming of mobile applications", icon: <AnimatedIcon icon={<Smartphone className="w-5 h-5 text-primary/70" />} animation="shake" /> },
        { name: "Increase followers and interested", icon: <AnimatedIcon icon={<Users className="w-5 h-5 text-primary/70" />} animation="pulse" /> },
        { name: "Design marketing videos and motion graphics", icon: <Video className="w-5 h-5 text-primary/70" /> },
        { name: "Brand design and development for companies and institutions", icon: <Palette className="w-5 h-5 text-primary/70" /> },
        { name: "Product photography", icon: <Camera className="w-5 h-5 text-primary/70" /> },
        { name: "Logo design", icon: <AnimatedIcon icon={<Palette className="w-5 h-5 text-primary/70" />} animation="float" /> },
        { name: "Developing personal branding and personal signs", icon: <Award className="w-5 h-5 text-primary/70" /> },
        { name: "Celebrity Marketing Service", icon: <Star className="w-5 h-5 text-primary/70" /> },
      ]
    },
    {
      id: "events-organizing",
      title: "Events Organizing & Managing",
      desc: "Professional event management ensuring flawless execution from conceptualization to post-event media.",
      icon: <AnimatedIcon icon={<Calendar className="w-10 h-10 text-primary" />} animation="shake" delay={1} />,
      features: [
        { name: "Organizing exhibitions, events, conferences", icon: <Mic className="w-5 h-5 text-primary/70" /> },
        { name: "Organizing courses and forums", icon: <BookOpen className="w-5 h-5 text-primary/70" /> },
        { name: "Organizing parties and events", icon: <AnimatedIcon icon={<PartyPopper className="w-5 h-5 text-primary/70" />} animation="shake" /> },
        { name: "Photography, montage, and film release", icon: <Camera className="w-5 h-5 text-primary/70" /> },
      ]
    },
    {
      id: "consultancy",
      title: "Consultancy",
      desc: "Strategic guidance to elevate your team's performance, operations, and standard of care.",
      icon: <AnimatedIcon icon={<Briefcase className="w-10 h-10 text-primary" />} animation="float" />,
      features: [
        { name: "Assessment and analysis of corporate training needs", icon: <Activity className="w-5 h-5 text-primary/70" /> },
        { name: "Develop and implement comprehensive training plans for work teams", icon: <AnimatedIcon icon={<BookOpen className="w-5 h-5 text-primary/70" />} animation="float" /> },
        { name: "Training consultant for your company", icon: <Users className="w-5 h-5 text-primary/70" /> },
        { name: "Project support and development", icon: <LineChart className="w-5 h-5 text-primary/70" /> },
        { name: "Measuring companies’ performance with international standards", icon: <Target className="w-5 h-5 text-primary/70" /> },
      ]
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

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

        {/* Categories Layout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-20 md:space-y-32">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              className="flex flex-col lg:flex-row gap-12"
            >
              {/* Category Header (Sticky Sidebar on Desktop) */}
              <div className="lg:w-1/3">
                <div className="space-y-5 lg:sticky lg:top-32">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="w-20 h-20 rounded-2xl bg-surface-container shadow-xl flex items-center justify-center ghost-border border-primary/20"
                  >
                    {category.icon}
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-display text-primary tracking-tight">{category.title}</h2>
                  <p className="text-base md:text-lg text-foreground/70 font-body leading-relaxed">{category.desc}</p>
                </div>
              </div>

              {/* Features Staggered Grid */}
              <div className="lg:w-2/3">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-50px" }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  {category.features.map((feature, idx) => (
                    <motion.div 
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)" }}
                      className="glass bg-white/40 dark:bg-black/20 backdrop-blur-md p-6 rounded-xl border border-white/20 dark:border-white/10 hover:border-primary/30 transition-all flex items-start gap-4"
                    >
                      <div className="mt-1 shrink-0 bg-surface shadow-sm p-2 rounded-full border border-outline-variant/30">
                        {feature.icon}
                      </div>
                      <span className="font-body text-foreground/90 font-medium leading-relaxed">
                        {feature.name}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
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
