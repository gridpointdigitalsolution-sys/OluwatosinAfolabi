"use client";

import { useState, useEffect } from "react";
import { Trash2, BookOpen, X } from "lucide-react";
import { getSavedQuotes, deleteQuote, clearAllQuotes } from "@/lib/storage";
import { useToast } from "@/components/Toast";
import type { SavedQuote } from "@/lib/types";

interface SavedQuotesGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  refreshKey?: number;
}

export default function SavedQuotesGallery({
  isOpen,
  onClose,
  refreshKey,
}: SavedQuotesGalleryProps) {
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) setQuotes(getSavedQuotes());
  }, [isOpen, refreshKey]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleDelete(id: string) {
    deleteQuote(id);
    setQuotes(getSavedQuotes());
    showToast("Removed", "info");
  }

  function handleClearAll() {
    if (!window.confirm("Clear all saved quotes? This cannot be undone.")) return;
    clearAllQuotes();
    setQuotes([]);
    showToast("All quotes cleared", "info");
  }

  return (
    <div className="fixed inset-0 z-40 bg-navy/95 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Top bar */}
        <div className="flex justify-between items-start mb-8">
          <h2 className="font-playfair text-2xl md:text-3xl text-gold">
            Your Saved Quotes
          </h2>
          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              aria-label="Close saved quotes"
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gold/40 hover:bg-gold/10 text-gold transition-colors"
            >
              <X size={18} />
            </button>
            {quotes.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="font-lato text-xs text-red-400 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {quotes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <BookOpen size={40} className="text-white/30" />
            <p className="font-lato text-white/60 italic text-center max-w-xs">
              No saved quotes yet. Generate one and tap the heart to save.
            </p>
          </div>
        )}

        {/* Grid */}
        {quotes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quotes.map((q) => (
              <div
                key={q.id}
                className="bg-navy border border-gold/30 rounded-lg p-5 flex flex-col gap-1"
              >
                {/* Theme tag */}
                <span className="self-start font-lato text-xs text-gold border border-gold/40 rounded-full px-3 py-0.5 mb-2">
                  ★ {q.theme}
                </span>

                {/* Quote */}
                <p className="font-playfair italic text-lg text-white leading-relaxed">
                  &ldquo;{q.quote}&rdquo;
                </p>

                {/* Verse text */}
                {q.verseText && (
                  <p className="font-lato text-sm text-light-gold/80 italic mt-3 leading-relaxed">
                    {q.verseText}
                  </p>
                )}

                {/* Reference */}
                <p className="font-lato font-bold text-gold text-xs uppercase tracking-wider mt-1">
                  {q.verseReference}
                </p>

                {/* Footer: date + delete */}
                <div className="flex items-center justify-between mt-4">
                  <span className="font-lato text-xs text-white/40">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    type="button"
                    aria-label="Delete this quote"
                    onClick={() => handleDelete(q.id)}
                    className="text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
