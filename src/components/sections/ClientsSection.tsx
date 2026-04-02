"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

type ClientLogo = {
  name: string;
  src: string;
  widthClassName: string;
};

const clients: ClientLogo[] = [
  {
    name: "Dubai Police",
    src: "/assets/clients/Dubai-police-logo-vector.png",
    widthClassName: "w-44",
  },
  {
    name: "Client 1",
    src: "/assets/clients/Picture1.png",
    widthClassName: "w-36",
  },
  {
    name: "Client 2",
    src: "/assets/clients/Picture2.png",
    widthClassName: "w-36",
  },
  {
    name: "Client 12",
    src: "/assets/clients/Picture12.png",
    widthClassName: "w-36",
  },
  {
    name: "Client 13",
    src: "/assets/clients/Picture13.png",
    widthClassName: "w-36",
  },
  {
    name: "Client 14",
    src: "/assets/clients/Picture14.png",
    widthClassName: "w-40",
  },
  {
    name: "Client 16",
    src: "/assets/clients/Picture16.png",
    widthClassName: "w-40",
  },
  {
    name: "Client 18",
    src: "/assets/clients/Picture18.png",
    widthClassName: "w-40",
  },
];

const ORBIT_PERIOD = 42000;

function getDesktopOrbitMetrics(stage: HTMLDivElement) {
  const { width, height } = stage.getBoundingClientRect();

  return {
    cx: width / 2 + Math.min(width * 0.06, 72),
    cy: height / 2,
    rx: Math.min(width * 0.39, 470),
    ry: Math.min(height * 0.31, 210),
  };
}

function getDepth(sinY: number, cosX: number) {
  const t = (sinY + 1) / 2;
  const baseScale = 0.7 + t * 0.34;

  return {
    scale: cosX > 0 ? Math.max(baseScale, 1) : baseScale,
    opacity: 0.2 + t * 0.72,
    zIndex: Math.round(2 + t * 10),
  };
}

export function ClientsSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationStartRef = useRef<number | null>(null);

  const offsets = useMemo(
    () => clients.map((_, index) => (index / clients.length) * Math.PI * 2),
    []
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let frameId = 0;

    const render = (timestamp: number) => {
      if (!animationStartRef.current) {
        animationStartRef.current = timestamp;
      }

      const baseAngle =
        (((timestamp - animationStartRef.current) % ORBIT_PERIOD) / ORBIT_PERIOD) *
        Math.PI *
        2;
      const { cx, cy, rx, ry } = getDesktopOrbitMetrics(stage);

      itemRefs.current.forEach((item, index) => {
        if (!item) return;

        const angle = baseAngle + offsets[index];
        const x = cx + rx * Math.cos(angle);
        const y = cy + ry * Math.sin(angle);
        const depth = getDepth(Math.sin(angle), Math.cos(angle));

        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        item.style.transform = `translate(-50%, -50%) scale(${depth.scale.toFixed(3)})`;
        item.style.opacity = depth.opacity.toFixed(3);
        item.style.zIndex = `${depth.zIndex}`;
      });

      frameId = window.requestAnimationFrame(render);
    };

    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [offsets]);

  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_68%_at_50%_50%,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_56%,rgba(0,0,0,0)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-fixed/10 blur-xl md:h-96 md:w-96" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-fixed/15 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.28em] text-primary-fixed/70 backdrop-blur-sm">
            Our Clients
          </span>
          <h2 className="mt-6 text-3xl sm:text-4xl font-display font-medium leading-tight text-primary md:text-5xl">
            Brands We&apos;ve
            <br />
            Worked With
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 tracking-[0.08em] text-foreground/60 md:text-base md:leading-8">
            Let&apos;s craft something that carries meaning, reflects your identity,
            and leaves a lasting impression.
          </p>
        </motion.div>

        <div
          ref={stageRef}
          className="relative mt-16 hidden h-[34rem] w-full overflow-hidden md:block"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-outline-variant/20" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-6 text-center">
            <h3 className="text-3xl font-display font-medium leading-tight text-primary">
              Trusted by organizations that value clarity, craft, and impact.
            </h3>
          </div>

          {clients.map((client, index) => (
            <div
              key={client.src}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-outline-variant/20 bg-surface-container-low/60 px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-sm transition-transform duration-300"
            >
              <img
                src={client.src}
                alt={client.name}
                className={`h-auto max-h-14 ${client.widthClassName} object-contain`}
              />
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:hidden"
        >
          {clients.map((client) => (
            <div
              key={`${client.name}-mobile`}
              className="flex min-h-24 items-center justify-center rounded-2xl border border-outline-variant/20 bg-surface-container-low/60 px-4 py-5 backdrop-blur-sm"
            >
              <img
                src={client.src}
                alt={client.name}
                className="h-auto max-h-10 w-auto object-contain"
              />
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
