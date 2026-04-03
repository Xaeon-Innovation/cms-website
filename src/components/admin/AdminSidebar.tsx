"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads Pipeline", icon: Users },
  { href: "/admin/employees", label: "Employees", icon: Users },
  { href: "/admin/media", label: "Media", icon: MessageSquare },
  { href: "/admin/mobadra-requests", label: "Mobadra Requests", icon: HeartHandshake },
  { href: "/admin/reviews", label: "Review Moderation", icon: MessageSquare },
  { href: "/admin/settings", label: "Platform Settings", icon: Settings },
];

type AdminSidebarProps = {
  mobile?: boolean;
};

export function AdminSidebar({ mobile = false }: AdminSidebarProps) {
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  return (
    <div className={cn("bg-surface-container-low flex flex-col border-outline-variant/10", mobile ? "min-h-full" : "w-64 min-h-screen border-r")}>
      <div className="h-20 flex items-center px-6 border-b border-outline-variant/10">
        <div className="w-8 h-8 rounded-sm bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold text-[10px] mr-3">
          CMS
        </div>
        <span className="font-display font-medium text-lg text-primary tracking-wide">Admin Portal</span>
      </div>

      <div className="flex-1 space-y-2 px-4 py-6 text-sm font-body">
        <Link
          href="/"
          className="mb-5 flex items-center justify-center gap-2 rounded-sm border-2 border-primary/35 bg-primary-container/15 px-3 py-2.5 text-center text-sm font-semibold text-primary shadow-sm transition-colors hover:border-primary hover:bg-primary-container/25"
        >
          <Home className="h-4 w-4 shrink-0" aria-hidden />
          View public site
        </Link>
        <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-widest text-foreground/40">
          Management
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors",
                isActive 
                  ? "bg-primary-container/10 text-primary-container border border-primary-container/20" 
                  : "text-foreground/70 hover:bg-surface-container hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-outline-variant/10 font-body">
        <div className="px-3 mb-4 text-xs text-foreground/60 truncate">
          {user?.email}
        </div>
        <button 
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-sm text-error/80 hover:bg-error-container/20 hover:text-error transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Secure Logout
        </button>
      </div>
    </div>
  );
}

export function AdminMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-sm border border-outline-variant/20 bg-surface-container px-3 py-2 text-sm text-foreground/80"
        aria-label={isOpen ? "Close admin navigation" : "Open admin navigation"}
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        <span className="max-w-[5rem] truncate capitalize">
          {pathname?.split("/").filter(Boolean).pop() || "Menu"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 max-h-[min(70vh,28rem)] w-[min(calc(100vw-2rem),20rem)] overflow-y-auto overflow-x-hidden rounded-sm border border-outline-variant/10 bg-surface-container-low shadow-2xl">
          <AdminSidebar mobile />
        </div>
      )}
    </div>
  );
}
