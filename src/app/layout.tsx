import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import "./globals.css";
import Script from "next/script";

export const dynamic = "force-dynamic";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Creative Multi Solutions - Medical Marketing",
  description: "Bespoke medical marketing and patient acquisition.",
};

import { AuthProvider } from "@/context/AuthContext";
import { BackToTopButton } from "@/components/layout/BackToTopButton";
import { PageLoaderOverlay } from "@/components/layout/PageLoaderOverlay";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getGlobalTheme } from "@/lib/siteTheme";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalTheme = await getGlobalTheme();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoSerif.variable} h-full antialiased dark`}
      data-theme={globalTheme}
      data-mode="dark"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col pt-20">
        <Script
          id="cms-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var m = localStorage.getItem('cms-mode') || 'dark';
    document.documentElement.setAttribute('data-mode', m === 'light' ? 'light' : 'dark');
  } catch (e) {
    document.documentElement.setAttribute('data-mode', 'dark');
  }
})();
`,
          }}
        />
        <AuthProvider>
          <PageLoaderOverlay />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <BackToTopButton />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
