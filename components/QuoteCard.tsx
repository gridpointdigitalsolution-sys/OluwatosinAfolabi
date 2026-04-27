"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import html2canvas from "html2canvas";
import { Download, Share2, Copy, Heart, Check } from "lucide-react";
import { useToast } from "@/components/Toast";
import { saveQuote, isQuoteSaved } from "@/lib/storage";
import type { GeneratedQuote } from "@/lib/types";

interface QuoteCardProps {
  quote: GeneratedQuote;
  onSaved?: () => void;
}

export default function QuoteCard({ quote, onSaved }: QuoteCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const [saved, setSaved] = useState(() =>
    isQuoteSaved(quote.quote, quote.verseReference)
  );
  const [copied, setCopied] = useState(false);

  async function handleDownload() {
    const el = document.getElementById("quote-card-export");
    if (!el) return;
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: "#0D1B2A",
        useCORS: true,
        allowTaint: true,
      });
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `pastor-quote-${quote.theme}-${Date.now()}.jpg`;
      link.click();
      showToast("Downloaded successfully ✦", "success");
    } catch {
      showToast("Download failed. Please try again.", "error");
    }
  }

  async function handleShare() {
    const shareText = `"${quote.quote}"\n\n${quote.verseReference}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Pastor's Daily Quote", text: shareText, url: window.location.href });
      } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        showToast("Copied — paste anywhere to share", "info");
      } catch {
        showToast("Unable to copy. Please copy manually.", "error");
      }
    }
  }

  async function handleCopy() {
    const text = `"${quote.quote}"\n\n${quote.verseText}\n— ${quote.verseReference}\n\n— Pastor Mrs. Oluwatosin Afolabi`;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard ✦", "success");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Unable to copy. Please try again.", "error");
    }
  }

  function handleSave() {
    if (saved || isQuoteSaved(quote.quote, quote.verseReference)) {
      setSaved(true);
      return;
    }
    saveQuote(quote);
    setSaved(true);
    showToast("Saved to your collection ✦", "success");
    onSaved?.();
  }

  return (
    <div className="w-full animate-fade-up">
      {/* ── Exportable card ── */}
      <div
        id="quote-card-export"
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl mx-auto card-glow"
        style={{
          maxWidth: 540,
          background: "linear-gradient(160deg,#0f2235 0%,#0D1B2A 55%,#091520 100%)",
          border: "1.5px solid rgba(201,168,76,0.55)",
        }}
      >
        {/* Watermark image */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="relative w-3/4 h-3/4 opacity-[0.06]">
            <Image src="/pastor.jpg.png" alt="" fill className="object-contain" aria-hidden />
          </div>
        </div>

        {/* Radial inner glow */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(201,168,76,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Corner brackets */}
        <div className="absolute top-5 left-5 w-9 h-9 border-t-2 border-l-2 border-gold/50 rounded-tl-md pointer-events-none" />
        <div className="absolute top-5 right-5 w-9 h-9 border-t-2 border-r-2 border-gold/50 rounded-tr-md pointer-events-none" />
        <div className="absolute bottom-5 left-5 w-9 h-9 border-b-2 border-l-2 border-gold/50 rounded-bl-md pointer-events-none" />
        <div className="absolute bottom-5 right-5 w-9 h-9 border-b-2 border-r-2 border-gold/50 rounded-br-md pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-8 md:px-14 py-12 gap-7">
          {/* Theme badge */}
          <span
            className="text-navy text-xs font-lato font-bold uppercase tracking-widest px-4 py-1 rounded-full"
            style={{ background: "linear-gradient(135deg,#F5E6A3,#C9A84C)" }}
          >
            {quote.theme}
          </span>

          {/* Top flourish */}
          <div className="flex items-center gap-3 w-full justify-center">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/50 max-w-[60px]" />
            <span className="text-gold text-lg">✦</span>
            <span className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/50 max-w-[60px]" />
          </div>

          {/* Quote */}
          <p className="font-playfair italic text-xl md:text-2xl text-white/95 leading-relaxed">
            &ldquo;{quote.quote}&rdquo;
          </p>

          {/* Verse text */}
          {quote.verseText && (
            <p className="font-lato text-sm text-light-gold/75 leading-relaxed max-w-sm italic">
              {quote.verseText}
            </p>
          )}

          {/* Verse reference */}
          <p
            className="font-lato font-bold text-xs uppercase tracking-[0.2em]"
            style={{
              background: "linear-gradient(135deg,#F5E6A3,#C9A84C)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {quote.verseReference}
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 w-full justify-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/30 max-w-[40px]" />
            <span className="text-gold/50 text-xs">✦</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/30 max-w-[40px]" />
          </div>

          {/* Signature */}
          <p
            className="font-playfair italic text-base md:text-lg"
            style={{
              background: "linear-gradient(135deg,#F5E6A3 0%,#C9A84C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            — Pastor Mrs. Oluwatosin Afolabi
          </p>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex flex-row justify-center gap-3 mt-7 flex-wrap">
        <button type="button" onClick={handleDownload} className="btn-gold">
          <Download size={15} /> Download
        </button>
        <button type="button" onClick={handleShare} className="btn-gold">
          <Share2 size={15} /> Share
        </button>
        <button type="button" onClick={handleCopy} className="btn-gold">
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saved}
          className="btn-gold"
          style={saved ? { borderColor: "rgba(201,168,76,0.3)", opacity: 0.5, cursor: "not-allowed", transform: "none" } : {}}
        >
          {saved ? <Check size={15} /> : <Heart size={15} />}
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
