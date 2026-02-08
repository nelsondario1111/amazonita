const whatsappNumber = "XXXXXXXXXXX";

export const siteConfig = {
  siteUrl: "https://laamazonita.com",
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
