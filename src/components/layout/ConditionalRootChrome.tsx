"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BackToTopButton } from "@/components/layout/BackToTopButton";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

/**
 * Admin and auth routes use a full-height shell without the public navbar/footer
 * or the top offset reserved for the fixed navbar.
 */
export function ConditionalRootChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBareRoute =
    Boolean(pathname?.startsWith("/admin")) || Boolean(pathname?.startsWith("/auth"));
  const showPublicChrome = !isBareRoute;

  return (
    <>
      {showPublicChrome ? <Navbar /> : null}
      <main className={cn("min-h-0 flex-1", showPublicChrome && "pt-20")}>{children}</main>
      {showPublicChrome ? <BackToTopButton /> : null}
      {showPublicChrome ? <Footer /> : null}
    </>
  );
}
