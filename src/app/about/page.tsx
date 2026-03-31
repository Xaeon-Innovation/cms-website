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

type EmployeeGroup = {
  groupName: string;
  employees: DbEmployee[];
};

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
      } catch (e: any) {
        if (mounted) setTeamError(e?.message || "Failed to load team");
      } finally {
        if (mounted) setTeamLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const employeeGroups = useMemo<EmployeeGroup[]>(() => {
    const map = new Map<string, DbEmployee[]>();
    for (const e of employees) {
      const key = e.department || "Team";
      const list = map.get(key) || [];
      list.push(e);
      map.set(key, list);
    }
    const groups = Array.from(map.entries()).map(([groupName, list]) => ({
      groupName,
      employees: [...list].sort((a, b) => {
        const ao = typeof a.order === "number" ? a.order : Number.POSITIVE_INFINITY;
        const bo = typeof b.order === "number" ? b.order : Number.POSITIVE_INFINITY;
        if (ao !== bo) return ao - bo;
        return (a.name || "").localeCompare(b.name || "");
      }),
    }));

    // Stable, friendly ordering of departments.
    return groups.sort((a, b) => {
      const aIndex = departmentOrder.indexOf(a.groupName);
      const bIndex = departmentOrder.indexOf(b.groupName);
      const aRank = aIndex === -1 ? Number.POSITIVE_INFINITY : aIndex;
      const bRank = bIndex === -1 ? Number.POSITIVE_INFINITY : bIndex;

      if (aRank !== bRank) return aRank - bRank;
      return a.groupName.localeCompare(b.groupName);
    });
  }, [departmentOrder, employees]);

  return (
    <div className="bg-surface pt-32 pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 mb-32 relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <Badge className="mb-4">Our Identity</Badge>
          <h1 className="text-5xl md:text-6xl font-display font-medium text-primary">Creative Multi Solutions</h1>
          <p className="text-lg md:text-xl text-foreground/70 font-body leading-relaxed">
            We exist at the intersection of medical science and human emotion. By curating clinical excellence, we guide patients to top-tier healthcare professionals.
          </p>
        </motion.div>
      </section>

      {/* Who We Are */}
      <section className="bg-surface-container py-24 mb-32">
        <div className="max-w-7xl mx-auto px-6">
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

      {/* Team Values / Dual Mission */}
      <section className="max-w-7xl mx-auto px-6">
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
      <section className="max-w-7xl mx-auto px-6 mt-28">
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
          <div className="space-y-16">
            {employeeGroups.map((group, groupIdx) => (
              <motion.div
                key={group.groupName}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: groupIdx * 0.05 }}
                className="space-y-6"
              >
                <h3 className="text-2xl md:text-3xl font-display text-primary-container">{group.groupName}</h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center">
                  {group.employees.map((emp) => (
                    <Card
                      key={`${group.groupName}-${emp.id || emp.name}`}
                      className="group w-full max-w-[260px] p-0 overflow-hidden bg-surface-container-high/40 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20"
                    >
                      <CardContent className="p-0">
                        <div className="p-5 pb-3 flex justify-center">
                          <div className="size-32 md:size-36 rounded-full overflow-hidden bg-surface-container-low ring-1 ring-outline-variant/20">
                            <Image
                              src={emp.imageUrl}
                              alt={emp.name}
                              width={512}
                              height={512}
                              className="h-full w-full object-cover object-center grayscale contrast-125 brightness-95 transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                            />
                          </div>
                        </div>
                        <div className="px-4 pb-5 md:px-5 md:pb-6 space-y-1 text-center">
                          <div className="font-display text-primary text-lg leading-snug">{emp.name}</div>
                          <div className="font-body text-foreground/70 text-sm leading-snug">{emp.role}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
