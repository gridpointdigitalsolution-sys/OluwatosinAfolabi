"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toJpeg } from "html-to-image";
import { Download, Share2, Copy, Heart, Check } from "lucide-react";
import { useToast } from "@/components/Toast";
import { saveQuote, isQuoteSaved } from "@/lib/storage";
import type { GeneratedQuote } from "@/lib/types";

interface QuoteCardProps {
  quote: GeneratedQuote;
  onSaved?: () => void;
}

export default function QuoteCard({ quote, onSaved }: QuoteCardProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const [saved, setSaved] = useState(() =>
    isQuoteSaved(quote.quote, quote.verseReference)
  );
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    const el = exportRef.current;
    if (!el) return;
    setDownloading(true);
    try {
      // html-to-image handles same-origin images without CORS issues
      const dataUrl = await toJpeg(el, {
        quality: 0.95,
        backgroundColor: "#0D1B2A",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `pastor-quote-${quote.theme}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Downloaded successfully ✦", "success");
    } catch (err) {
      console.error("Download error:", err);
      showToast("Download failed — please try again", "error");
    } finally {
      setDownloading(false);
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
    <div className="w-full">
      {/* ── Exportable card (no Next/Image inside — avoids html-to-image CORS) ── */}
      <div
        ref={exportRef}
        className="relative overflow-hidden rounded-2xl mx-auto card-glow"
        style={{
          maxWidth: 540,
          background: "linear-gradient(160deg,#0f2235 0%,#0D1B2A 55%,#091520 100%)",
          border: "1.5px solid rgba(201,168,76,0.55)",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        {/* Radial inner glow — pure CSS, no image needed */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(201,168,76,0.09) 0%, transparent 70%)",
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
            className="text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full"
            style={{
              background: "linear-gradient(135deg,#F5E6A3,#C9A84C)",
              color: "#0D1B2A",
              letterSpacing: "0.15em",
            }}
          >
            {quote.theme}
          </span>

          {/* Top flourish */}
          <div className="flex items-center gap-3 w-full justify-center">
            <span style={{ flex: 1, height: 1, maxWidth: 60, background: "linear-gradient(to right,transparent,rgba(201,168,76,0.5))" }} />
            <span style={{ color: "#C9A84C", fontSize: "1.2rem" }}>✦</span>
            <span style={{ flex: 1, height: 1, maxWidth: 60, background: "linear-gradient(to left,transparent,rgba(201,168,76,0.5))" }} />
          </div>

          {/* Quote */}
          <p
            className="italic text-xl md:text-2xl leading-relaxed"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            &ldquo;{quote.quote}&rdquo;
          </p>

          {/* Verse text */}
          {quote.verseText && (
            <p
              className="text-sm leading-relaxed max-w-sm italic"
              style={{ color: "rgba(245,230,163,0.75)" }}
            >
              {quote.verseText}
            </p>
          )}

          {/* Verse reference */}
          <p
            className="font-bold text-xs uppercase"
            style={{
              background: "linear-gradient(135deg,#F5E6A3,#C9A84C)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "0.2em",
            }}
          >
            {quote.verseReference}
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 w-full justify-center">
            <span style={{ width: 40, height: 1, background: "linear-gradient(to right,transparent,rgba(201,168,76,0.3))" }} />
            <span style={{ color: "rgba(201,168,76,0.5)", fontSize: "0.75rem" }}>✦</span>
            <span style={{ width: 40, height: 1, background: "linear-gradient(to left,transparent,rgba(201,168,76,0.3))" }} />
          </div>

          {/* Signature */}
          <p
            className="italic text-base md:text-lg"
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

      {/* Pastor watermark shown on screen only (outside export div) */}
      <div className="relative -mt-[100%] pointer-events-none z-0 flex items-center justify-center"
        style={{ height: 0 }}>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex flex-row justify-center gap-3 mt-7 flex-wrap">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="btn-gold"
        >
          <Download size={15} />
          {downloading ? "Saving…" : "Download"}
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
