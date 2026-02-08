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
    locale: site.locale,
    type: "website",
    images: [
      {
        url: `${siteConfig.siteUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: `Open Graph de ${site.brandName}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.brandName} · ${site.tagline}`,
    description: site.description,
    images: [`${siteConfig.siteUrl}/opengraph-image.png`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
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
