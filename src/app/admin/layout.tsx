"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

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
          <header className="h-20 bg-surface-container-low border-b border-outline-variant/10 flex items-center px-8 z-10 sticky top-0 backdrop-blur-md">
             <h2 className="font-display text-primary text-xl">CMS Admin Portal</h2>
          </header>
          
          <main className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
