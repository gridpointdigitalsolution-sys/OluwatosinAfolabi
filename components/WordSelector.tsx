"use client";

import { useRef, useEffect } from "react";

interface WordSelectorProps {
  words: readonly string[];
  selectedWord: string | null;
  onSelect: (word: string) => void;
  disabled?: boolean;
}

export default function WordSelector({
  words,
  selectedWord,
  onSelect,
  disabled = false,
}: WordSelectorProps) {
  const selectedRef = useRef<HTMLButtonElement | null>(null);

  // Scroll selected word into view inside the list
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedWord]);

  return (
    <div className="flex flex-col h-full">
      {/* Heading */}
      <div className="mb-4 px-1">
        <p className="font-lato text-[10px] uppercase tracking-[0.3em] text-gold/50 mb-1">
          {words.length} themes
        </p>
        <h2
          className="font-playfair font-bold text-lg"
          style={{
            background: "linear-gradient(135deg,#F5E6A3 0%,#C9A84C 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Choose a theme
        </h2>
      </div>

      {/* Scrollable list */}
      <div
        className="flex-1 overflow-y-auto pr-1 space-y-1"
        style={{
          maxHeight: "calc(100vh - 320px)",
          minHeight: 240,
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(201,168,76,0.3) transparent",
        }}
      >
        {words.map((word) => {
          const selected = word === selectedWord;
          return (
            <button
              key={word}
              ref={selected ? selectedRef : null}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(word)}
              aria-pressed={selected}
              className={[
                "w-full text-left px-4 py-2.5 rounded-xl font-lato text-sm font-medium",
                "transition-all duration-150 outline-none flex items-center gap-3 group",
                "focus-visible:ring-2 focus-visible:ring-gold",
                disabled ? "opacity-35 cursor-not-allowed" : "cursor-pointer",
                selected
                  ? "text-navy font-semibold"
                  : "text-white/60 hover:text-gold hover:bg-gold/8",
              ].join(" ")}
              style={
                selected
                  ? {
                      background:
                        "linear-gradient(135deg,#F5E6A3 0%,#C9A84C 70%,#E8C97A 100%)",
                      boxShadow: "0 0 16px rgba(201,168,76,0.4)",
                    }
                  : {}
              }
            >
              {/* Dot indicator */}
              <span
                className={[
                  "w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-150",
                  selected
                    ? "bg-navy"
                    : "bg-gold/25 group-hover:bg-gold/60",
                ].join(" ")}
              />
              {word}
              {selected && (
                <span className="ml-auto text-navy/70 text-xs">✦</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Fade hint at bottom */}
      <div
        className="h-6 -mt-6 pointer-events-none relative z-10 rounded-b-xl"
        style={{
          background: "linear-gradient(to top, rgba(13,27,42,0.9), transparent)",
        }}
      />
    </div>
  );
}
