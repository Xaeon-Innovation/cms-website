"use client";

import { useEffect, useRef, useState } from "react";

function getVideoMimeType(src: string) {
  const cleanSrc = src.split("?")[0]?.toLowerCase() || "";
  if (cleanSrc.endsWith(".webm")) return "video/webm";
  return "video/mp4";
}

type LazyAutoplayVideoProps = {
  src: string;
  className?: string;
  poster?: string;
};

/** Mounts and plays only after the element enters the viewport. */
export function LazyAutoplayVideo({ src, className, poster }: LazyAutoplayVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px", threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => {
      // Autoplay can be blocked; muted + playsInline usually works.
    });
  }, [active, src]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      {active ? (
        <video
          ref={videoRef}
          key={src}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster}
          className={className}
        >
          <source src={src} type={getVideoMimeType(src)} />
        </video>
      ) : poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className={className} />
      ) : (
        <div className={className} aria-hidden />
      )}
    </div>
  );
}
