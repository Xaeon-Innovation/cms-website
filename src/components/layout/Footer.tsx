"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth")) {
    return null;
  }

  return (
    <footer className="bg-surface-container-lowest mt-auto border-t border-outline-variant/20 pt-16 pb-8 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        
        <div className="space-y-4 col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center">
            <img src="/assets/longlogo.png" alt="Creative Multi Solutions" className="h-12 object-contain drop-shadow-[0_0_15px_rgba(232,197,131,0.15)]" />
          </Link>
          <p className="text-foreground/70 font-body max-w-sm mt-4 leading-relaxed">
            Creative Multi Solutions. We don't just market; we move people. Empowering high-end patient acquisition & humanitarian care.
          </p>
          <div className="mt-4">
             <Badge variant="outline">Dubai, U.A.E</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-display text-lg text-primary">Solutions</h4>
          <ul className="space-y-2 text-foreground/70 font-body text-sm">
            <li><Link href="/services" className="hover:text-primary transition-colors">Patient Acquisition</Link></li>
            <li><Link href="/services" className="hover:text-primary transition-colors">Healthcare Branding</Link></li>
            <li><Link href="/mobadra" className="hover:text-primary transition-colors text-primary-fixed">Creative Mobadra</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-display text-lg text-primary">Company</h4>
          <ul className="space-y-2 text-foreground/70 font-body text-sm">
            <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
            <li><Link href="/reviews" className="hover:text-primary transition-colors">Patient Reviews</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li className="pt-4"><Link href="/auth/signin" className="hover:text-primary transition-colors text-xs opacity-50">Admin Login</Link></li>
          </ul>
        </div>
        
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center text-xs text-foreground/40 font-body transition-colors">
        <p>© {new Date().getFullYear()} Creative Multi Solutions. All Rights Reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
