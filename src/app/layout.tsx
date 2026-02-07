import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/content/site";
import { siteConfig } from "@/lib/site";
import { fontBody, fontDisplay, fontLogo } from "./fonts";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: `${site.brandName} · ${site.tagline}`,
  description: site.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${site.brandName} · ${site.tagline}`,
    description: site.description,
    url: siteConfig.siteUrl,
    siteName: site.brandName,
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.brandName} · ${site.tagline}`,
    description: site.description,
  },
  icons: {
    icon: "/brand/mark.svg",
    apple: "/brand/mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${fontBody.variable} ${fontDisplay.variable} ${fontLogo.variable}`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
