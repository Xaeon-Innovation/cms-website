import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/context/AuthContext";
import { ConditionalRootChrome } from "@/components/layout/ConditionalRootChrome";
import { PageLoaderOverlay } from "@/components/layout/PageLoaderOverlay";
import { getGlobalTheme } from "@/lib/siteTheme";
import { getSiteUrl } from "@/lib/siteUrl";
import { defaultKeywords } from "@/lib/seoCopy";
import RootJsonLd from "@/components/seo/RootJsonLd";

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

const siteUrl = getSiteUrl();
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Creative Multi Solutions | Medical Marketing Agency Dubai & UAE",
    template: "%s | Creative Multi Solutions",
  },
  description:
    "Dubai marketing agency specializing in medical marketing and digital marketing for UAE hospitals and clinics. Grow B2B partnerships, patient acquisition, and visibility — including Creative Mobadra perks for patients.",
  keywords: [...defaultKeywords],
  authors: [{ name: "Creative Multi Solutions" }],
  creator: "Creative Multi Solutions",
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon", sizes: "any" }],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  other: {
    "msapplication-TileImage": "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: siteUrl,
    siteName: "Creative Multi Solutions",
    title: "Creative Multi Solutions | Medical Marketing Dubai & UAE",
    description:
      "Medical marketing, digital marketing, and patient growth for UAE healthcare. B2B lead generation, hospital partnerships, and Creative Mobadra for patients.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Creative Multi Solutions — medical marketing in Dubai and the UAE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Multi Solutions | Medical Marketing Dubai & UAE",
    description:
      "Medical marketing, digital marketing, and patient acquisition for UAE hospitals and clinics. Creative Mobadra patient program.",
    images: ["/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    ...(googleVerification ? { google: googleVerification } : {}),
    ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
  },
};

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
      <body className="flex min-h-full flex-col">
        <RootJsonLd />
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
          <ConditionalRootChrome>{children}</ConditionalRootChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
