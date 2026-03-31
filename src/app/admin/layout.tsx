"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
             <AdminMobileNav />
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
