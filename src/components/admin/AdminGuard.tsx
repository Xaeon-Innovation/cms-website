"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin) {
        // Redirect non-admins or unauthenticated users to the sign-in page
        router.push("/auth/signin");
      } else {
        setAuthorized(true);
      }
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !authorized) {
    return (
      <div className="flex bg-surface min-h-screen items-center justify-center text-primary-container">
        {/* Simple fade-in luxury loader */}
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin"></div>
          <p className="text-sm font-['Inter'] tracking-widest uppercase">Authorizing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
