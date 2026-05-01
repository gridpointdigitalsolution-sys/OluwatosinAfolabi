"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Share2, Copy, Heart, Check } from "lucide-react";
import { useToast } from "@/components/Toast";
import { saveQuote, isQuoteSaved } from "@/lib/storage";
import type { GeneratedQuote } from "@/lib/types";

interface QuoteCardProps {
  quote: GeneratedQuote;
  onSaved?: () => void;
}

// Load an image element from a URL (returns null on failure)
// No crossOrigin — same-origin image, crossOrigin attr causes load failure on
// servers that don't send CORS headers (Hostinger static files)
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Cross-browser rounded rectangle — ctx.roundRect() missing in older browsers
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x,     y + h, x,     y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x,     y,     x + r, y,         r);
  ctx.closePath();
}

// Wrap + draw centered text on canvas, return y after last line
function drawWrapped(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  startY: number,
  maxW: number,
  lineHeight: number
): number {
  ctx.textAlign = "center";  // always center — never inherit stale value
  const words = text.split(" ");
  let line = "";
  let y = startY;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, cx, y);
      y += lineHeight;
      line = word;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, cx, y);
    y += lineHeight;
  }
  return y;
}

async function buildDownloadCanvas(quote: GeneratedQuote): Promise<HTMLCanvasElement> {
  const W = 1080;
  const PAD = 90;
  const INNER = W - PAD * 2;
  const cx = W / 2;

  // ── Pre-measure height ──
  const measure = document.createElement("canvas");
  measure.width = W; measure.height = 200;
  const mc = measure.getContext("2d")!;

  function measureH(text: string, font: string, lh: number): number {
    mc.font = font;
    const words = text.split(" ");
    let line = ""; let rows = 1;
    for (const w of words) {
      const t = line ? `${line} ${w}` : w;
      if (mc.measureText(t).width > INNER && line) { rows++; line = w; }
      else line = t;
    }
    return rows * lh;
  }

  const QUOTE_FONT  = "italic bold 40px Georgia,serif";
  const VERSE_FONT  = "italic 28px Georgia,serif";
  const quoteH  = measureH(`"${quote.quote}"`, QUOTE_FONT, 58) + 16;
  const verseH  = quote.verseText ? measureH(quote.verseText, VERSE_FONT, 44) + 16 : 0;
  // Extra space for the site URL at the bottom
  const H = PAD + 48 + 40 + 36 + 20 + quoteH + verseH + 44 + 36 + 60 + 40 + PAD + 20;

  // ── Real canvas ──
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.textBaseline = "top";

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0f2235");
  bg.addColorStop(0.55, "#0D1B2A");
  bg.addColorStop(1, "#091520");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ── Pastor image watermark ──
  const pastorImg = await loadImage("/pastor.jpg.png");
  if (pastorImg) {
    const imgAspect = pastorImg.naturalWidth / pastorImg.naturalHeight;
    const drawW = W * 0.72;
    const drawH = drawW / imgAspect;
    const imgX = (W - drawW) / 2;
    const imgY = (H - drawH) / 2;
    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.drawImage(pastorImg, imgX, imgY, drawW, drawH);
    ctx.restore();
  }

  // Inner radial glow
  const glow = ctx.createRadialGradient(cx, H * 0.35, 0, cx, H * 0.35, W * 0.55);
  glow.addColorStop(0, "rgba(201,168,76,0.10)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Outer border
  ctx.strokeStyle = "rgba(201,168,76,0.58)";
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, W - 4, H - 4);

  // Corner brackets
  const BL = 64, BT = 4;
  ctx.strokeStyle = "rgba(201,168,76,0.55)";
  ctx.lineWidth = BT;
  const M = 30; // margin from edge
  const brackets = [
    [M, M, 1, 1], [W - M, M, -1, 1],
    [M, H - M, 1, -1], [W - M, H - M, -1, -1],
  ] as const;
  for (const [bx, by, dx, dy] of brackets) {
    ctx.beginPath(); ctx.moveTo(bx + dx * 14, by); ctx.lineTo(bx + dx * BL, by); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx, by + dy * 14); ctx.lineTo(bx, by + dy * BL); ctx.stroke();
  }

  // ── Gold gradient helper ──
  function goldGrad(x1 = cx - 180, x2 = cx + 180) {
    const g = ctx.createLinearGradient(x1, 0, x2, 0);
    g.addColorStop(0, "#F5E6A3"); g.addColorStop(1, "#C9A84C");
    return g;
  }
  function fadeLine(spread = 130, y: number) {
    const g = ctx.createLinearGradient(cx - spread, 0, cx + spread, 0);
    g.addColorStop(0, "rgba(201,168,76,0)");
    g.addColorStop(0.5, "rgba(201,168,76,0.55)");
    g.addColorStop(1, "rgba(201,168,76,0)");
    ctx.fillStyle = g;
    ctx.fillRect(cx - spread, y, spread * 2, 2);
    ctx.fillStyle = "#C9A84C";
    ctx.font = "bold 26px serif";
    ctx.textAlign = "center";
    ctx.fillText("✦", cx, y + 4);
  }

  let y = PAD;

  // Theme badge pill
  const badgeW = 240, badgeH2 = 48, badgeR = 24;
  const badgeX = cx - badgeW / 2;
  const pillGrad = ctx.createLinearGradient(badgeX, 0, badgeX + badgeW, 0);
  pillGrad.addColorStop(0, "#F5E6A3"); pillGrad.addColorStop(1, "#C9A84C");
  ctx.fillStyle = pillGrad;
  roundRect(ctx, badgeX, y, badgeW, badgeH2, badgeR);
  ctx.fill();
  ctx.fillStyle = "#0D1B2A";
  ctx.font = "bold 22px Arial,sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(quote.theme.toUpperCase(), cx, y + badgeH2 / 2);
  ctx.textBaseline = "top";
  y += badgeH2 + 36;

  // Top flourish
  fadeLine(130, y);
  y += 40;

  // Quote text
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = QUOTE_FONT;
  ctx.textAlign = "center";
  y = drawWrapped(ctx, `“${quote.quote}”`, cx, y, INNER, 58);
  y += 28;

  // Verse text
  if (quote.verseText) {
    ctx.fillStyle = "rgba(245,230,163,0.78)";
    ctx.font = VERSE_FONT;
    y = drawWrapped(ctx, quote.verseText, cx, y, INNER - 60, 44);
    y += 16;
  }

  // Verse reference
  ctx.fillStyle = goldGrad();
  ctx.font = "bold 26px Arial,sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(quote.verseReference.toUpperCase(), cx, y);
  y += 48;

  // Bottom flourish
  fadeLine(90, y);
  y += 48;

  // Signature
  ctx.fillStyle = goldGrad(cx - 260, cx + 260);
  ctx.font = "italic 32px Georgia,serif";
  ctx.textAlign = "center";
  ctx.fillText(`— Pastor Mrs. Oluwatosin Afolabi`, cx, y);
  y += 50;

  // Site URL watermark at bottom
  ctx.fillStyle = "rgba(201,168,76,0.35)";
  ctx.font = "600 18px Arial,sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("pastormrsoluwatosinafolabi.com", cx, y);

  return canvas;
}

// Convert a canvas to a JPEG File object
function canvasToFile(canvas: HTMLCanvasElement, name: string): Promise<File | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) { resolve(null); return; }
        resolve(new File([blob], name, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.95
    );
  });
}

export default function QuoteCard({ quote, onSaved }: QuoteCardProps) {
  const { showToast } = useToast();
  const [saved, setSaved]         = useState(() => isQuoteSaved(quote.quote, quote.verseReference));
  const [copied, setCopied]       = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing]     = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const canvas = await buildDownloadCanvas(quote);
      canvas.toBlob(
        (blob) => {
          if (!blob) { showToast("Download failed — try again", "error"); setDownloading(false); return; }
          const url = URL.createObjectURL(blob);
          const a   = document.createElement("a");
          a.href     = url;
          a.download = `pastor-quote-${quote.theme}-${Date.now()}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showToast("Downloaded successfully ✦", "success");
          setDownloading(false);
        },
        "image/jpeg",
        0.95
      );
    } catch (err) {
      console.error(err);
      showToast("Download failed — try again", "error");
      setDownloading(false);
    }
  }

  async function handleShare() {
    setSharing(true);
    try {
      const siteUrl = window.location.origin;
      const caption = `"${quote.quote}" — ${quote.verseReference}\n\nGet your daily quote: ${siteUrl}`;

      // Build the card image
      const canvas = await buildDownloadCanvas(quote);
      const file = await canvasToFile(canvas, `pastor-quote-${quote.theme}.jpg`);

      if (file) {
        const shareData: ShareData = {
          title: "Pastor's Daily Quote",
          text: caption,
          files: [file],
        };

        // Try sharing with image (mobile — WhatsApp, Instagram, Twitter etc.)
        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }

      // Fallback: share text + link only (if image sharing not supported)
      if (navigator.share) {
        await navigator.share({
          title: "Pastor's Daily Quote",
          text: caption,
          url: siteUrl,
        });
        return;
      }

      // Last resort: copy text + link to clipboard
      await navigator.clipboard.writeText(caption);
      showToast("Copied quote + link — paste to share ✦", "info");
    } catch (err) {
      // AbortError = user cancelled the share sheet — that's fine
      if (err instanceof Error && err.name !== "AbortError") {
        showToast("Share failed — try downloading instead", "error");
      }
    } finally {
      setSharing(false);
    }
  }

  async function handleCopy() {
    const text = `"${quote.quote}"\n\n${quote.verseText}\n— ${quote.verseReference}\n\n— Pastor Mrs. Oluwatosin Afolabi`;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard ✦", "success");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { showToast("Unable to copy", "error"); }
  }

  function handleSave() {
    if (saved) return;
    saveQuote(quote);
    setSaved(true);
    showToast("Saved to your collection ✦", "success");
    onSaved?.();
  }

  return (
    <div className="w-full animate-fade-up">

      {/* ── Visual card (screen) ── */}
      <div
        className="relative overflow-hidden rounded-2xl mx-auto card-glow"
        style={{
          maxWidth: 540,
          background: "linear-gradient(160deg,#0f2235 0%,#0D1B2A 55%,#091520 100%)",
          border: "1.5px solid rgba(201,168,76,0.55)",
        }}
      >
        {/* Pastor photo watermark — faded behind the text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="relative w-4/5 h-4/5 opacity-[0.07]">
            <Image
              src="/pastor.jpg.png"
              alt=""
              fill
              sizes="80vw"
              className="object-contain"
              aria-hidden
            />
          </div>
        </div>

        {/* Inner radial glow */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 30%,rgba(201,168,76,0.09) 0%,transparent 70%)",
          }}
        />

        {/* Corner brackets */}
        <div className="absolute top-5 left-5 w-9 h-9 border-t-2 border-l-2 border-gold/50 rounded-tl-md pointer-events-none z-0" />
        <div className="absolute top-5 right-5 w-9 h-9 border-t-2 border-r-2 border-gold/50 rounded-tr-md pointer-events-none z-0" />
        <div className="absolute bottom-5 left-5 w-9 h-9 border-b-2 border-l-2 border-gold/50 rounded-bl-md pointer-events-none z-0" />
        <div className="absolute bottom-5 right-5 w-9 h-9 border-b-2 border-r-2 border-gold/50 rounded-br-md pointer-events-none z-0" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-8 md:px-14 py-12 gap-6">
          {/* Theme badge */}
          <span
            className="text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full font-lato"
            style={{ background: "linear-gradient(135deg,#F5E6A3,#C9A84C)", color: "#0D1B2A" }}
          >
            {quote.theme}
          </span>

          {/* Flourish */}
          <div className="flex items-center gap-3 w-full justify-center">
            <span className="flex-1 h-px max-w-[60px]" style={{ background: "linear-gradient(to right,transparent,rgba(201,168,76,0.5))" }} />
            <span style={{ color: "#C9A84C", fontSize: "1.1rem" }}>✦</span>
            <span className="flex-1 h-px max-w-[60px]" style={{ background: "linear-gradient(to left,transparent,rgba(201,168,76,0.5))" }} />
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
            <span className="w-10 h-px" style={{ background: "linear-gradient(to right,transparent,rgba(201,168,76,0.3))" }} />
            <span style={{ color: "rgba(201,168,76,0.5)", fontSize: "0.75rem" }}>✦</span>
            <span className="w-10 h-px" style={{ background: "linear-gradient(to left,transparent,rgba(201,168,76,0.3))" }} />
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
        <button type="button" onClick={handleDownload} disabled={downloading} className="btn-gold">
          <Download size={15} />
          {downloading ? "Saving…" : "Download"}
        </button>
        <button type="button" onClick={handleShare} disabled={sharing} className="btn-gold">
          <Share2 size={15} /> {sharing ? "Sharing…" : "Share"}
        </button>
        <button type="button" onClick={handleCopy} className="btn-gold">
          {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied!" : "Copy"}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saved}
          className="btn-gold"
          style={saved ? { borderColor: "rgba(201,168,76,0.3)", opacity: 0.5, cursor: "not-allowed", transform: "none" } : {}}
        >
          {saved ? <Check size={15} /> : <Heart size={15} />} {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
