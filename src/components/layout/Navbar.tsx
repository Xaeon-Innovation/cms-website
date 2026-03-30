"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function Navbar() {
  const pathname = usePathname();

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
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <img src="/assets/longlogo.png" alt="Creative Multi Solutions" className="h-10 object-contain drop-shadow-[0_0_15px_rgba(232,197,131,0.15)] transition-transform group-hover:scale-[1.02]" />
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
      </div>
    </nav>
  );
}
