import type { SavedQuote } from "@/lib/types";

const KEY = "pastor-quotes-saved-v1";

function genId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function persist(quotes: SavedQuote[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(quotes));
  } catch {
    // quota exceeded or private-mode restriction — silently ignore
  }
}

export function getSavedQuotes(): SavedQuote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedQuote[]) : [];
  } catch {
    return [];
  }
}

export function saveQuote(
  quote: Omit<SavedQuote, "id" | "createdAt">
): SavedQuote {
  const saved: SavedQuote = { ...quote, id: genId(), createdAt: Date.now() };
  if (typeof window === "undefined") return saved;
  const quotes = getSavedQuotes();
  persist([saved, ...quotes]);
  return saved;
}

export function deleteQuote(id: string): void {
  if (typeof window === "undefined") return;
  persist(getSavedQuotes().filter((q) => q.id !== id));
}

export function clearAllQuotes(): void {
  if (typeof window === "undefined") return;
  persist([]);
}

export function isQuoteSaved(quote: string, verseReference: string): boolean {
  if (typeof window === "undefined") return false;
  return getSavedQuotes().some(
    (q) => q.quote === quote && q.verseReference === verseReference
  );
}
