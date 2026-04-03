"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/AdminSidebar";
import { ThemeId, ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Home } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const HEADER_H = "h-20"; /* 5rem — keep in sync with pt offset below */

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>("clinical-authority");
  const [savedTheme, setSavedTheme] = useState<ThemeId>("clinical-authority");
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [themeSavedOk, setThemeSavedOk] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "theme"));
        const t = (snap.data()?.theme as ThemeId | undefined) ?? "clinical-authority";
        if (cancelled) return;
        setSavedTheme(t);
        setSelectedTheme(t);
        document.documentElement.setAttribute("data-theme", t);
        if (!document.documentElement.getAttribute("data-mode")) {
          document.documentElement.setAttribute("data-mode", "dark");
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const saveGlobalTheme = async () => {
    setIsSavingTheme(true);
    setThemeSavedOk(false);
    try {
      await setDoc(doc(db, "settings", "theme"), { theme: selectedTheme }, { merge: true });
      setSavedTheme(selectedTheme);
      document.documentElement.setAttribute("data-theme", selectedTheme);
      setThemeSavedOk(true);
      setTimeout(() => setThemeSavedOk(false), 2500);
    } finally {
      setIsSavingTheme(false);
    }
  };

  const hasUnsavedTheme = selectedTheme !== savedTheme;

  return (
    <AdminGuard>
      <div className="min-h-dvh w-full bg-surface-container-lowest">
        <aside
          className={cn(
            "fixed left-0 top-0 z-40 hidden h-dvh w-64 flex-col border-r border-outline-variant/10",
            "bg-surface-container-low md:flex md:flex-col"
          )}
        >
          <AdminSidebar />
        </aside>

        <div className="min-h-dvh w-full md:pl-64">
          <header
            className={cn(
              "fixed left-0 right-0 top-0 z-30 flex items-center justify-between gap-2 border-b border-outline-variant/10",
              "bg-surface-container-low px-3 backdrop-blur-md sm:gap-3 sm:px-6 md:left-64 md:px-8",
              HEADER_H
            )}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <Link
                href="/"
                aria-label="View public site"
                className={cn(
                  "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-sm border-2 border-primary/40",
                  "bg-primary-container/15 px-2.5 text-xs font-semibold text-primary shadow-sm sm:gap-2 sm:px-3 sm:text-sm",
                  "transition-colors hover:border-primary hover:bg-primary-container/25"
                )}
              >
                <Home className="h-4 w-4 shrink-0" aria-hidden />
                <span className="hidden sm:inline">View site</span>
              </Link>
              <h2 className="truncate font-display text-sm text-primary sm:text-base md:text-xl">
                CMS Admin Portal
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
              <ThemeSwitcher
                value={selectedTheme}
                onChange={(t) => setSelectedTheme(t)}
                persistLocal={false}
              />
              <span className="hidden text-right text-xs font-body text-foreground/50 lg:inline lg:min-w-[8.5rem]">
                {selectedTheme.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
              <Button
                variant="primary"
                size="sm"
                disabled={!hasUnsavedTheme || isSavingTheme}
                onClick={saveGlobalTheme}
                className="shrink-0"
              >
                <span className="hidden sm:inline">{isSavingTheme ? "Saving..." : "Save"}</span>
                <span className="sm:hidden">{isSavingTheme ? "…" : "Save"}</span>
              </Button>
              {themeSavedOk && (
                <span className="hidden text-xs font-body text-primary-fixed md:inline">Saved</span>
              )}
              <AdminMobileNav />
            </div>
          </header>

          <main
            className={cn(
              "box-border h-dvh w-full overflow-y-auto overscroll-contain px-4 pb-10 pt-20 sm:px-6 md:px-8 md:pt-24"
            )}
          >
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
