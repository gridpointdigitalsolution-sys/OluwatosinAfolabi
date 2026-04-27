"use client";

import Image from "next/image";
import Link from "next/link";
import { BookmarkCheck } from "lucide-react";

interface HeaderProps {
  savedCount?: number;
  onOpenGallery?: () => void;
}

export default function Header({ savedCount = 0, onOpenGallery }: HeaderProps) {
  return (
    <header className="relative w-full overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[
          { top: "15%", left: "8%",  dur: "2.5s", delay: "0s"   },
          { top: "25%", left: "15%", dur: "3.5s", delay: "0.5s" },
          { top: "60%", left: "5%",  dur: "4s",   delay: "1s"   },
          { top: "10%", right: "10%",dur: "3s",   delay: "0.2s" },
          { top: "40%", right: "7%", dur: "2.8s", delay: "0.8s" },
          { top: "70%", right: "12%",dur: "3.8s", delay: "0.4s" },
        ].map((s, i) => (
          <span
            key={i}
            className="star"
            style={{
              top: s.top,
              left: "left" in s ? s.left : undefined,
              right: "right" in s ? s.right : undefined,
              "--dur": s.dur,
              "--delay": s.delay,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Top nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 pt-6 pb-2">
        <div className="flex items-center gap-1">
          <span className="text-gold text-sm select-none">✦</span>
          <span className="font-playfair italic text-light-gold/70 text-sm hidden sm:inline">
            Daily Devotional
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/about"   className="nav-link">About</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
          <Link href="/privacy" className="nav-link hidden sm:inline">Privacy</Link>
        </div>
      </nav>

      {/* Hero section */}
      <div className="relative z-10 flex flex-col items-center text-center pt-10 pb-12 md:pt-14 md:pb-14 px-4">

        {/* Outer glow ring */}
        <div className="relative mb-7">
          <div
            className="relative w-40 h-40 md:w-52 md:h-52 rounded-full gold-ring-glow"
            style={{ padding: 4 }}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src="/pastor.jpg.png"
                alt="Pastor Mrs. Oluwatosin Afolabi"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          {/* Floating sparkle */}
          <span
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-navy text-xs font-bold animate-float"
            style={{ background: "linear-gradient(135deg,#F5E6A3,#C9A84C)" }}
          >
            ✦
          </span>
        </div>

        {/* Label */}
        <p className="font-lato text-xs uppercase tracking-[0.3em] text-gold/60 gold-shimmer mb-3">
          Daily Quotes By
        </p>

        {/* Name */}
        <h1
          className="font-playfair italic font-bold text-3xl md:text-5xl lg:text-6xl leading-tight gold-glow mb-4"
          style={{
            background: "linear-gradient(135deg,#F5E6A3 0%,#C9A84C 50%,#F5E6A3 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Pastor Mrs. Oluwatosin
          <br className="hidden sm:block" />
          {" "}Afolabi
        </h1>

        {/* Ornament */}
        <div className="flex items-center gap-4 my-3">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/60" />
          <span className="text-gold">✦</span>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/60" />
        </div>

        {/* Tagline */}
        <p className="font-lato text-sm md:text-base text-white/50 italic mb-8">
          Walk daily in faith, hope, and boundless grace
        </p>

        {/* Saved button */}
        {onOpenGallery && (
          <button
            type="button"
            onClick={onOpenGallery}
            className="btn-gold"
          >
            <BookmarkCheck size={15} />
            {savedCount > 0 ? `Saved quotes (${savedCount})` : "My saved quotes"}
          </button>
        )}
      </div>

      {/* Bottom gold divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </header>
  );
}
