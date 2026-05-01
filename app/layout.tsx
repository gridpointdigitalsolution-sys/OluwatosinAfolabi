import type { Metadata, Viewport } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import Link from "next/link";
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
    "Faith-filled daily quotes and KJV Bible verses for inspiration, hope, and spiritual renewal — by Pastor Mrs. Oluwatosin Afolabi.",
  keywords: ["christian quotes", "bible verses", "daily devotional", "pastor quotes", "faith", "KJV"],
  icons: {
    icon: "/pastor.jpg.png",
    apple: "/pastor.jpg.png",
    shortcut: "/pastor.jpg.png",
  },
  openGraph: {
    title: "Daily Quotes by Pastor Mrs. Oluwatosin Afolabi",
    description:
      "Faith-filled daily quotes and KJV Bible verses for inspiration, hope, and spiritual renewal.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <body className="bg-navy text-white antialiased">
        {children}

        {/* Global footer */}
        <footer className="border-t border-white/5 mt-12 py-10 px-4">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-5">
            {/* Logo mark */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold/60" />
              <span className="text-gold text-sm">✦</span>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold/60" />
            </div>

            {/* Links */}
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              {[
                { href: "/about",   label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms",   label: "Terms of Use" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="nav-link text-xs">
                  {label}
                </Link>
              ))}
            </nav>

            <p className="font-lato text-xs text-white/25 text-center">
              © {new Date().getFullYear()} Pastor Mrs. Oluwatosin Afolabi · All quotes prayerfully generated
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
