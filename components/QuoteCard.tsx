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
      showToast("Downloaded successfully", "success");
    } catch {
      showToast("Download failed. Please try again.", "error");
    }
  }

  async function handleShare() {
    const shareText = `“${quote.quote}” — ${quote.verseReference}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Pastor’s Daily Quote",
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // user cancelled — not an error
      }
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
    const text = `“${quote.quote}”\n\n${quote.verseText}\n— ${quote.verseReference}\n\n— Pastor Mrs. Oluwatosin Afolabi`;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard", "success");
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
    showToast("Saved to your collection", "success");
    onSaved?.();
  }

  const btnBase =
    "type='button' flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-gold/60 hover:border-gold hover:bg-gold/10 text-gold font-lato text-sm font-medium transition-all";

  return (
    <div className="w-full">
      {/* ── PART A: exportable card ── */}
      <div
        id="quote-card-export"
        ref={cardRef}
        className="relative overflow-hidden bg-navy border-4 border-gold rounded-lg mx-auto flex flex-col items-center justify-center p-8 md:p-10"
        style={{ maxWidth: 500, minHeight: 500 }}
      >
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="relative w-4/5 h-4/5 opacity-20" style={{ filter: "sepia(0.3)" }}>
            <Image
              src="/pastor.jpg"
              alt=""
              fill
              className="object-contain"
              aria-hidden
            />
          </div>
        </div>

        {/* Foreground */}
        <div className="relative z-10 flex flex-col items-center text-center w-full gap-5">
          {/* Ornamental flourish */}
          <div className="flex items-center gap-2 w-full justify-center">
            <span className="flex-1 h-px bg-gold/50 max-w-[60px]" />
            <span className="text-gold text-xs">✦</span>
            <span className="flex-1 h-px bg-gold/50 max-w-[60px]" />
          </div>

          {/* Quote */}
          <p className="font-playfair italic text-xl md:text-2xl text-white leading-relaxed">
            “{quote.quote}”
          </p>

          {/* Verse */}
          <div className="flex flex-col items-center gap-1">
            {quote.verseText && (
              <p className="font-lato text-sm md:text-base text-light-gold/90 leading-relaxed max-w-md mx-auto italic">
                {quote.verseText}
              </p>
            )}
            <p className="font-lato font-bold text-gold text-sm uppercase tracking-wider mt-1">
              {quote.verseReference}
            </p>
          </div>

          {/* Divider + signature */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-[60px] h-px bg-gold" />
            <p className="font-playfair italic text-gold text-base md:text-lg">
              — Pastor Mrs. Oluwatosin Afolabi
            </p>
          </div>
        </div>
      </div>

      {/* ── PART B: action buttons ── */}
      <div className="flex flex-row justify-center gap-3 mt-6 flex-wrap">
        <button
          type="button"
          aria-label="Download quote as image"
          onClick={handleDownload}
          className={btnBase}
        >
          <Download size={16} />
          Download
        </button>

        <button
          type="button"
          aria-label="Share quote"
          onClick={handleShare}
          className={btnBase}
        >
          <Share2 size={16} />
          Share
        </button>

        <button
          type="button"
          aria-label="Copy quote text"
          onClick={handleCopy}
          className={btnBase}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied!" : "Copy"}
        </button>

        <button
          type="button"
          aria-label={saved ? "Quote already saved" : "Save quote"}
          onClick={handleSave}
          disabled={saved}
          className={[
            btnBase,
            saved ? "opacity-50 cursor-not-allowed" : "",
          ].join(" ")}
        >
          {saved ? <Check size={16} /> : <Heart size={16} />}
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
