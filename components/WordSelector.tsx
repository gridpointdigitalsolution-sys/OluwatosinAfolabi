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
      <h2 className="font-playfair text-xl md:text-2xl text-gold text-center mb-6">
        Choose a theme for today&apos;s quote
      </h2>

      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {words.map((word) => {
          const selected = word === selectedWord;
          return (
            <button
              key={word}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(word)}
              className={[
                "px-4 py-2 md:px-5 md:py-2.5 rounded-full border-2",
                "font-lato font-medium text-sm md:text-base",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy",
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : selected
                  ? "border-gold bg-gold text-navy shadow-lg shadow-gold/30"
                  : "border-gold/40 text-light-gold bg-transparent hover:border-gold hover:bg-gold/10",
              ].join(" ")}
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
}
