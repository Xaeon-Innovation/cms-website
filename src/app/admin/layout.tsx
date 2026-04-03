import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata: Metadata = {
  title: { absolute: "CMS Admin Portal" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
