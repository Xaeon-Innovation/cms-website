"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

import {
  getEmployees,
  getEmployeeSettings,
  type Employee as DbEmployee,
} from "@/lib/firestore/employees";

export default function AboutPage() {
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<DbEmployee[]>([]);
  const [departmentOrder, setDepartmentOrder] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setTeamLoading(true);
        setTeamError(null);
        const [data, settings] = await Promise.all([
          getEmployees(),
          getEmployeeSettings(),
        ]);
        if (mounted) {
          setEmployees(data);
          setDepartmentOrder(settings.departmentOrder);
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to load team";
        if (mounted) setTeamError(message);
      } finally {
        if (mounted) setTeamLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  /** Single list (no department headings); order follows admin department order, then member order. */
  const sortedTeam = useMemo(() => {
    const deptRank = (d: string) => {
      const i = departmentOrder.indexOf(d);
      return i === -1 ? Number.POSITIVE_INFINITY : i;
    };
    return [...employees].sort((a, b) => {
      const da = deptRank(a.department || "Team");
      const db = deptRank(b.department || "Team");
      if (da !== db) return da - db;
      const ao = typeof a.order === "number" ? a.order : Number.POSITIVE_INFINITY;
      const bo = typeof b.order === "number" ? b.order : Number.POSITIVE_INFINITY;
      if (ao !== bo) return ao - bo;
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [departmentOrder, employees]);

  return (
    <div className="bg-surface pt-28 md:pt-32 pb-20 md:pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-0 relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <Badge className="mb-4">Our Identity</Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium text-primary">Creative Multi Solutions</h1>
          <p className="text-base md:text-xl text-foreground/70 font-body leading-relaxed">
            We exist at the intersection of medical science and human emotion. By curating clinical excellence, we guide patients to top-tier healthcare professionals.
          </p>
        </motion.div>
      </section>

      {/* Prize / team banner — between identity hero & Who We Are */}
      <section
        className="relative mt-16 md:mt-20 w-full min-h-[min(72vh,36rem)] md:min-h-[min(75vh,40rem)]"
        aria-label="Team recognition"
      >
        <Image
          src="/assets/prize.jpeg"
          alt="Creative Multi Solutions team with partners at an award presentation"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden />
        <div className="relative z-10 flex min-h-[min(72vh,36rem)] md:min-h-[min(75vh,40rem)] max-w-7xl mx-auto items-center px-4 py-16 sm:px-6 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
            className="max-w-3xl"
          >
            <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-white/70">
              Creative Multi Solutions
            </p>
            <h2 className="font-display text-3xl font-medium leading-[1.15] text-white sm:text-4xl md:text-5xl lg:text-[2.75rem] lg:leading-tight">
              Empowered by People
              <br />
              <span className="text-white/90">Driven by Passion</span>
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="bg-surface-container py-24 mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h2 className="text-4xl font-display font-medium text-primary">Who We Are</h2>
            <p className="mt-6 text-lg leading-relaxed text-foreground/70 font-body md:text-xl">
              We are Creative Multi Solutions, the first company in the Emirates
              that provides the best marketing services and brand advertising. We
              achieve goals. We care about establishing, growing and developing
              companies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Event / community banner — between Who We Are & Core Values */}
      <section
        className="relative w-full min-h-[min(68vh,30rem)] md:min-h-[min(72vh,36rem)]"
        aria-label="Events and community"
      >
        <Image
          src="/assets/event.jpeg"
          alt="Creative Multi Solutions hosting a workshop with Creative Mobadra and Creative Way Event branding"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden />
        <div className="relative z-10 flex min-h-[min(68vh,30rem)] md:min-h-[min(72vh,36rem)] max-w-7xl mx-auto items-center justify-end px-4 py-14 sm:px-6 md:py-20">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="ml-auto w-full max-w-md text-right sm:max-w-lg md:max-w-xl"
          >
            <p className="font-body text-lg leading-relaxed text-white md:text-xl">
              We step into the room, not only with strategy on slides, but with programs, workshops, and initiatives
              like{" "}
              <span className="font-medium text-white">Creative Mobadra</span> that turn marketing expertise into
              real-world impact for clinics and communities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Values / Dual Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-20 md:mt-28">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-medium text-primary">Core Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Clinical Growth", desc: "Sustainable patient acquisition strategies." },
            { title: "Empathetic Care", desc: "We prioritize patient well-being over metrics." },
            { title: "Unshakable Trust", desc: "Editorial transparency in all medical marketing." }
          ].map((val, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Card className="h-full bg-surface-container-high/40">
                <CardContent className="p-8 space-y-4 pt-8">
                  <h3 className="text-2xl font-display text-primary">{val.title}</h3>
                  <p className="text-foreground/70 font-body">{val.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Employees */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-20 md:mt-28">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-medium text-primary">Our Team</h2>
          <p className="mt-4 text-foreground/70 font-body">The people behind the work.</p>
        </div>

        {teamLoading ? (
          <div className="flex items-center justify-center py-16 opacity-70">
            <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin" />
          </div>
        ) : teamError ? (
          <div className="text-center py-12 text-foreground/60 font-body text-sm">{teamError}</div>
        ) : employees.length === 0 ? (
          <div className="text-center py-12 text-foreground/40 font-body text-sm italic">No team members yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {sortedTeam.map((emp, i) => (
              <motion.div
                key={emp.id || emp.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.4) }}
              >
                <Card className="group h-full w-full p-0 overflow-hidden bg-surface-container-high/40 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20">
                  <CardContent className="p-0">
                    <div className="p-5 pb-3 flex justify-center">
                      <div className="size-32 md:size-36 rounded-full overflow-hidden bg-surface-container-low ring-1 ring-outline-variant/20">
                        <Image
                          src={emp.imageUrl}
                          alt={emp.name}
                          width={512}
                          height={512}
                          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                        />
                      </div>
                    </div>
                    <div className="px-4 pb-5 md:px-5 md:pb-6 space-y-1 text-center">
                      <div className="font-display text-primary text-lg leading-snug">{emp.name}</div>
                      <div className="font-body text-foreground/70 text-sm leading-snug">{emp.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
