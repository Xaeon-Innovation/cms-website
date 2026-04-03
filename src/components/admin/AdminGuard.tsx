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
      <div className="flex min-h-[100dvh] w-full items-center justify-center bg-surface text-primary-container">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-primary" />
          <p className="text-sm font-['Inter'] tracking-widest uppercase">Authorizing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
