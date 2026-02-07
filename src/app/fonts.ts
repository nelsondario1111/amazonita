import localFont from "next/font/local";

export const fontBody = localFont({
  src: [
    {
      path: "../fonts/anaktoria/Anaktoria.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

export const fontDisplay = localFont({
  src: [
    {
      path: "../fonts/tan-mon-cheri/TAN-MON CHERI-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

export const fontLogo = localFont({
  src: [
    {
      path: "../fonts/nomad/Nomad.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-logo",
  display: "swap",
});