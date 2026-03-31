"use client";

import { useEffect, useState } from "react";

export function PageLoaderOverlay() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const finishLoading = () => {
      window.setTimeout(() => {
        setIsVisible(false);
        document.body.classList.remove("overflow-hidden");
      }, 300);
    };

    document.body.classList.add("overflow-hidden");

    if (document.readyState === "complete") {
      finishLoading();
      return () => {
        document.body.classList.remove("overflow-hidden");
      };
    }

    window.addEventListener("load", finishLoading, { once: true });

    return () => {
      window.removeEventListener("load", finishLoading);
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-surface transition-opacity duration-500 ${
        isVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <img
        src="/assets/longlogo.png"
        alt="Creative Multi Solutions"
        className="loader-beat h-16 w-auto object-contain md:h-20"
      />
    </div>
  );
}
