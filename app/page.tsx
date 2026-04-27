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

        setTimeout(() => {
          document
            .getElementById("quote-display")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
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
      {/* Header with nav + photo */}
      <Header
        savedCount={savedCount}
        onOpenGallery={() => setGalleryOpen(true)}
      />

      {/* Word selector */}
      <section className="py-14">
        <WordSelector
          words={THEME_WORDS}
          selectedWord={selectedWord}
          onSelect={generateQuote}
          disabled={isLoading}
        />
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-14" />

      {/* Quote display */}
      <section
        id="quote-display"
        className="max-w-2xl mx-auto px-4 mb-20 min-h-[200px] flex flex-col items-center justify-center"
      >
        {isLoading && (
          <div className="flex flex-col items-center py-20 gap-5">
            <div className="relative">
              <Loader2 size={56} className="text-gold animate-spin" />
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: "rgba(201,168,76,0.15)" }}
              />
            </div>
            <p className="font-playfair italic text-light-gold/80 text-lg">
              Crafting your quote with prayer…
            </p>
          </div>
        )}

        {!isLoading && currentQuote && (
          <QuoteCard quote={currentQuote} onSaved={handleSaved} />
        )}

        {!isLoading && !currentQuote && (
          <div className="flex flex-col items-center gap-5 py-16 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center animate-float"
              style={{
                background: "radial-gradient(circle,rgba(201,168,76,0.15) 0%,transparent 70%)",
                border: "1px solid rgba(201,168,76,0.2)",
              }}
            >
              <Sparkles size={32} className="text-gold/60" />
            </div>
            <p className="font-playfair italic text-white/35 text-lg">
              Your daily word awaits
            </p>
            <p className="font-lato text-sm text-white/25">
              Choose a theme above to receive your quote
            </p>
          </div>
        )}
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
