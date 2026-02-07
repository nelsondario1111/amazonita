import { site } from "@/content/site";

export default function SiteFooter() {
  return (
    <footer className="py-10 text-center text-sm text-black/50">
      © {new Date().getFullYear()} <span className="font-logo uppercase">{site.brandName}</span>{" "}
      · {site.tagline}
    </footer>
  );
}
