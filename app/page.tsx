"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import WordSelector from "@/components/WordSelector";
import QuoteCard from "@/components/QuoteCard";
import SavedQuotesGallery from "@/components/SavedQuotesGallery";
import { ToastProvider, useToast } from "@/components/Toast";
import { THEME_WORDS } from "@/lib/words";
import { getSavedQuotes } from "@/lib/storage";
import type { GeneratedQuote, ApiResponse } from "@/lib/types";
import { Loader2, Sparkles } from "lucide-react";

function scrollToQuote() {
  // Only scroll on mobile (below md breakpoint = 768px)
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    setTimeout(() => {
      document
        .getElementById("quote-display")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }
}

function PageInner() {
  const { showToast } = useToast();

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [currentQuote, setCurrentQuote] = useState<GeneratedQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [savedRefreshKey, setSavedRefreshKey] = useState(0);
  const [savedCount, setSavedCount] = useState(() => getSavedQuotes().length);

  const generateQuote = useCallback(
    async (word: string) => {
      setSelectedWord(word);
      setIsLoading(true);
      setCurrentQuote(null);

      // Scroll immediately on mobile so user sees the loading spinner
      scrollToQuote();

      try {
        const res = await fetch("/api/generate-quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme: word }),
        });

        const data = (await res.json()) as ApiResponse;

        if (!res.ok || !data.ok) {
          showToast(
            data.ok === false ? data.error : "Failed to generate quote — try again",
            "error"
          );
          return;
        }

        setCurrentQuote(data.data);
        showToast("Your quote is ready ✦", "success");
      } catch {
        showToast("Network error — check your connection", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  function handleSaved() {
    setSavedRefreshKey((k) => k + 1);
    setSavedCount(getSavedQuotes().length);
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <Header
        savedCount={savedCount}
        onOpenGallery={() => setGalleryOpen(true)}
      />

      {/* ── Main split section ── */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-12 mb-8">

        {/* Step label */}
        <p className="font-lato text-xs uppercase tracking-[0.3em] text-gold/50 text-center mb-10">
          Tap a theme · Receive your word
        </p>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

          {/* ── Left: word list panel ── */}
          <div className="w-full md:w-64 lg:w-72 flex-shrink-0 glass-card rounded-2xl p-4 md:sticky md:top-6">
            <WordSelector
              words={THEME_WORDS}
              selectedWord={selectedWord}
              onSelect={generateQuote}
              disabled={isLoading}
            />
          </div>

          {/* ── Right: quote display ── */}
          <div
            id="quote-display"
            className="flex-1 min-h-[460px] flex flex-col items-center justify-center scroll-mt-4"
          >
            {/* Loading */}
            {isLoading && (
              <div className="flex flex-col items-center gap-5 py-16">
                <div className="relative">
                  <Loader2 size={56} className="text-gold animate-spin" />
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-20"
                    style={{ background: "rgba(201,168,76,0.4)" }}
                  />
                </div>
                <p className="font-playfair italic text-light-gold/70 text-lg">
                  Crafting your quote with prayer…
                </p>
              </div>
            )}

            {/* Quote card */}
            {!isLoading && currentQuote && (
              <div className="w-full animate-fade-up">
                <QuoteCard quote={currentQuote} onSaved={handleSaved} />
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !currentQuote && (
              <div className="flex flex-col items-center gap-5 py-16 text-center">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center animate-float"
                  style={{
                    background:
                      "radial-gradient(circle,rgba(201,168,76,0.12) 0%,transparent 70%)",
                    border: "1px solid rgba(201,168,76,0.18)",
                  }}
                >
                  <Sparkles size={34} className="text-gold/50" />
                </div>
                <p className="font-playfair italic text-white/30 text-xl">
                  Your daily word awaits
                </p>
                <p className="font-lato text-sm text-white/20">
                  Choose any theme from the list to receive your quote
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <SavedQuotesGallery
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        refreshKey={savedRefreshKey}
      />
    </main>
  );
}

export default function Page() {
  return (
    <ToastProvider>
      <PageInner />
    </ToastProvider>
  );
}
