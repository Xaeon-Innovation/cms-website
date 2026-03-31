"use client";

import { useEffect, useState } from "react";

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 240);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={handleBackToTop}
      className={`fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-primary-fixed/20 bg-white/10 text-primary-fixed shadow-[0_12px_32px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-all duration-300 hover:bg-white/15 md:bottom-8 md:right-8 ${
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span className="flex h-full w-full translate-y-1 items-center justify-center text-xl leading-none animate-bounce">
        ^
      </span>
    </button>
  );
}
