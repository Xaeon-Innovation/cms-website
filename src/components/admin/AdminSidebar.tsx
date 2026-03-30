"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Users, HeartHandshake, MessageSquare, Settings, LogOut } from "lucide-react";
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

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  return (
    <div className="w-64 bg-surface-container-low min-h-screen flex flex-col border-r border-outline-variant/10">
      <div className="h-20 flex items-center px-6 border-b border-outline-variant/10">
        <div className="w-8 h-8 rounded-sm bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold text-[10px] mr-3">
          CMS
        </div>
        <span className="font-display font-medium text-lg text-primary tracking-wide">Admin Portal</span>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2 text-sm font-body">
        <div className="px-2 mb-4 text-xs font-semibold text-foreground/40 uppercase tracking-widest">
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
