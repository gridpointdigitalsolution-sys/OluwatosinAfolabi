import type { Metadata, Viewport } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Daily Quotes by Pastor Mrs. Oluwatosin Afolabi",
  description:
    "Faith-filled daily quotes and Bible verses for inspiration, hope, and renewal.",
  openGraph: {
    title: "Daily Quotes by Pastor Mrs. Oluwatosin Afolabi",
    description:
      "Faith-filled daily quotes and Bible verses for inspiration, hope, and renewal.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${lato.variable}`}
    >
      <body className="bg-navy text-white antialiased">{children}</body>
    </html>
  );
}
