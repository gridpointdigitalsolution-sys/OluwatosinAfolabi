export interface SavedQuote {
  id: string;
  theme: string;
  quote: string;
  verseText: string;
  verseReference: string;
  createdAt: number;
}

export interface GeneratedQuote {
  theme: string;
  quote: string;
  verseText: string;
  verseReference: string;
}

export type ApiSuccess = { ok: true; data: GeneratedQuote };
export type ApiError = { ok: false; error: string };
export type ApiResponse = ApiSuccess | ApiError;

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  text: string;
}
