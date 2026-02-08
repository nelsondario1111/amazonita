const whatsappNumber = "XXXXXXXXXXX";
const defaultSiteUrl = "https://amazonita.vercel.app";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl).replace(/\/+$/, "");
const openGraphImage = `${siteUrl}/opengraph-image.png`;

export const siteConfig = {
  siteUrl,
  openGraphImage,
  email: "hello@laamazonita.com",
  whatsappNumber,
  whatsappLink: `https://wa.me/${whatsappNumber}`,
  socials: {
    instagram: "#",
    tiktok: "#",
    facebook: "#",
  },
} as const;

export function getWhatsAppLink(message?: string) {
  if (!message) return siteConfig.whatsappLink;
  return `${siteConfig.whatsappLink}?text=${encodeURIComponent(message)}`;
}
