"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/AdminSidebar";
import { ThemeId, ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
      {/* -mt-20 counteracts the pt-20 from the global RootLayout body tag */}
      <div className="min-h-screen flex bg-surface-container-lowest -mt-20">
        {/* Sidebar permanently pinned on large screens */}
        <aside className="hidden md:block sticky top-0 h-screen w-64 flex-shrink-0 z-20 border-r border-outline-variant/10">
          <AdminSidebar />
        </aside>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen min-w-0">
          <header className="h-20 bg-surface-container-low border-b border-outline-variant/10 flex items-center justify-between px-4 sm:px-6 md:px-8 gap-4 z-10 sticky top-0 backdrop-blur-md">
             <h2 className="font-display text-primary text-lg sm:text-xl">CMS Admin Portal</h2>
             <div className="flex items-center gap-3">
               <ThemeSwitcher
                 value={selectedTheme}
                 onChange={(t) => setSelectedTheme(t)}
                 persistLocal={false}
               />
               <span className="hidden sm:inline text-xs font-body text-foreground/50 min-w-[8.5rem] text-right">
                 {selectedTheme.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
               </span>
               <Button
                 variant="primary"
                 size="sm"
                 disabled={!hasUnsavedTheme || isSavingTheme}
                 onClick={saveGlobalTheme}
               >
                 {isSavingTheme ? "Saving..." : "Save"}
               </Button>
               {themeSavedOk && <span className="text-primary-fixed text-xs font-body">Saved</span>}
               <AdminMobileNav />
             </div>
          </header>
          
          <main className="flex-1 p-4 sm:p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
