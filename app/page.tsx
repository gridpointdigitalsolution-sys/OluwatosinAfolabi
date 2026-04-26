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
import { BookmarkCheck, Loader2 } from "lucide-react";

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
        showToast("Your quote is ready", "success");

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
    <main className="min-h-screen bg-navy text-white">
      <Header />

      {/* View saved button */}
      <div className="flex justify-center mb-8 px-4">
        <button
          type="button"
          onClick={() => setGalleryOpen(true)}
          className="flex items-center gap-2 font-lato text-sm text-light-gold/70 hover:text-gold underline-offset-4 hover:underline transition-colors"
        >
          <BookmarkCheck size={16} />
          {savedCount > 0
            ? `View saved quotes (${savedCount})`
            : "View saved quotes"}
        </button>
      </div>

      {/* Word selector */}
      <section className="mb-12">
        <WordSelector
          words={THEME_WORDS}
          selectedWord={selectedWord}
          onSelect={generateQuote}
          disabled={isLoading}
        />
      </section>

      {/* Quote display area */}
      <section
        id="quote-display"
        className="max-w-2xl mx-auto px-4 mb-16 min-h-[200px] flex flex-col items-center justify-center"
      >
        {isLoading && (
          <div className="flex flex-col items-center py-16">
            <Loader2 size={48} className="text-gold animate-spin" />
            <p className="font-playfair italic text-gold mt-4 text-lg">
              Generating your quote...
            </p>
          </div>
        )}

        {!isLoading && currentQuote && (
          <QuoteCard quote={currentQuote} onSaved={handleSaved} />
        )}

        {!isLoading && !currentQuote && (
          <p className="font-lato italic text-white/40 mt-12 text-center">
            Tap a theme above to receive your quote
          </p>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center text-white/30 text-xs font-lato py-8 border-t border-white/5">
        © {new Date().getFullYear()} Pastor Mrs. Oluwatosin Afolabi · All quotes prayerfully generated
      </footer>

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
