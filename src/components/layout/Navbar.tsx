"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Menu, Moon, Sun, X } from "lucide-react";
import { flushSync } from "react-dom";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const shouldHide = pathname?.startsWith("/admin") || pathname?.startsWith("/auth");

  useEffect(() => {
    try {
      setIsLight((localStorage.getItem("cms-mode") ?? "dark") === "light");
    } catch {
      // ignore
    }
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/mobadra", label: "Creative Mobadra" },
    { href: "/reviews", label: "Reviews" },
  ];

  const applyMode = (nextIsLight: boolean) => {
    try {
      if (nextIsLight) {
        localStorage.setItem("cms-mode", "light");
        document.documentElement.setAttribute("data-mode", "light");
      } else {
        localStorage.setItem("cms-mode", "dark");
        document.documentElement.setAttribute("data-mode", "dark");
      }
    } catch {
      // ignore
    }
  };

  const toggleLight = (triggerEl?: HTMLElement | null) => {
    const el = triggerEl;

    const apply = () => {
      setIsLight((prev) => {
        const next = !prev;
        applyMode(next);
        return next;
      });
    };

    // Fallback (no button geometry, or no View Transitions support)
    const doc = document as unknown as {
      startViewTransition?: (cb: () => void) => { ready?: Promise<void> };
    };
    if (!el || typeof doc.startViewTransition !== "function") {
      apply();
      return;
    }

    const { top, left, width, height } = el.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    );

    // IMPORTANT: must be invoked with `document` as receiver (avoid "Illegal invocation")
    const transition = doc.startViewTransition(() => {
      flushSync(apply);
    });

    transition?.ready?.then?.(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 420,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  // Hide Navbar on auth and admin routes (after hooks)
  if (shouldHide) {
    return null;
  }

  return (
    <nav className="fixed top-0 w-full z-50 glass ghost-border border-b backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center group min-w-0" onClick={() => setIsOpen(false)}>
          <img src="/assets/longlogo.png" alt="Creative Multi Solutions" className="h-8 sm:h-10 max-w-[180px] sm:max-w-none object-contain drop-shadow-[0_0_15px_rgba(232,197,131,0.15)] transition-transform group-hover:scale-[1.02]" />
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "text-sm font-body transition-colors hover:text-primary-fixed",
                pathname === link.href ? "text-primary-fixed border-b-2 border-primary-fixed pb-[2px] font-medium" : "text-foreground/80"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            onClick={(e) => toggleLight(e.currentTarget)}
            className={cn(
              "inline-flex items-center justify-center rounded-sm border px-2.5 py-2 transition-colors",
              "border-outline-variant/20 bg-surface-container-low text-foreground/80 hover:bg-surface-container hover:text-primary-fixed"
            )}
            aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
            title={isLight ? "Dark mode" : "Light mode"}
          >
            {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <Link href="/contact">
            <Button variant="primary" size="sm">
              Contact Us
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-sm border border-outline-variant/20 bg-surface-container-low p-2 text-foreground/80"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-outline-variant/10 bg-surface-container-low/95 backdrop-blur-xl">
          <div className="px-4 py-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                // No reliable geometry when closing menu; still toggles with fallback
                toggleLight(null);
                setIsOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 rounded-sm px-3 py-3 text-sm font-body transition-colors",
                "text-foreground/80 hover:bg-surface-container hover:text-primary-fixed"
              )}
            >
              {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span>{isLight ? "Dark mode" : "Light mode"}</span>
            </button>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-sm px-3 py-3 text-sm font-body transition-colors",
                  pathname === link.href
                    ? "bg-primary-container/10 text-primary-fixed"
                    : "text-foreground/80 hover:bg-surface-container hover:text-primary-fixed"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setIsOpen(false)} className="pt-2">
              <Button variant="primary" className="w-full">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
