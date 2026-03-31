"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Hide Navbar on auth and admin routes
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth")) {
    return null;
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/mobadra", label: "Creative Mobadra" },
    { href: "/reviews", label: "Reviews" },
  ];

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
