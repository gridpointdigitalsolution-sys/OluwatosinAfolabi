"use client";

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
  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Section heading */}
      <div className="flex flex-col items-center mb-10">
        <p className="font-lato text-xs uppercase tracking-[0.3em] text-gold/60 mb-3">
          Step 1
        </p>
        <h2
          className="font-playfair text-2xl md:text-3xl font-bold mb-3"
          style={{
            background: "linear-gradient(135deg,#F5E6A3 0%,#C9A84C 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Choose a theme
        </h2>
        <p className="font-lato text-sm text-white/40 italic">
          Tap any word to receive your personalised devotional quote
        </p>
      </div>

      {/* Pills */}
      <div className="flex flex-wrap justify-center gap-3">
        {words.map((word) => {
          const selected = word === selectedWord;
          return (
            <button
              key={word}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(word)}
              aria-pressed={selected}
              className={[
                "relative px-5 py-2.5 rounded-full font-lato font-semibold text-sm",
                "border-2 transition-all duration-200 outline-none",
                "focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy",
                disabled
                  ? "opacity-35 cursor-not-allowed"
                  : selected
                  ? "border-gold text-navy pill-glow cursor-default scale-105"
                  : "border-gold/40 text-light-gold/80 hover:border-gold hover:text-gold hover:scale-105 hover:shadow-[0_0_16px_rgba(201,168,76,0.35)] cursor-pointer",
              ].join(" ")}
              style={
                selected
                  ? {
                      background:
                        "linear-gradient(135deg,#F5E6A3 0%,#C9A84C 60%,#E8C97A 100%)",
                    }
                  : {}
              }
            >
              {selected && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gold animate-ping opacity-75" />
              )}
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
}
