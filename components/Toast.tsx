"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";
import type { ToastMessage, ToastType } from "@/lib/types";

interface ToastContextValue {
  showToast: (text: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const STYLES: Record<ToastType, { border: string; text: string; Icon: React.ElementType }> = {
  success: { border: "border-gold", text: "text-gold", Icon: CheckCircle },
  error: { border: "border-red-400", text: "text-red-300", Icon: XCircle },
  info: { border: "border-white", text: "text-white", Icon: Info },
};

function Toast({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const { border, text, Icon } = STYLES[toast.type];

  useEffect(() => {
    const show = requestAnimationFrame(() => setVisible(true));
    const hide = setTimeout(() => setVisible(false), 2700);
    const remove = setTimeout(() => onRemove(toast.id), 3000);
    return () => {
      cancelAnimationFrame(show);
      clearTimeout(hide);
      clearTimeout(remove);
    };
  }, [toast.id, onRemove]);

  return (
    <div
      className={`
        flex items-center gap-3 bg-navy border ${border} ${text}
        rounded-lg shadow-lg px-4 py-3 font-lato text-sm
        transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
      `}
    >
      <Icon size={16} className="shrink-0" />
      <span>{toast.text}</span>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const counterRef = useRef(0);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((text: string, type: ToastType = "info") => {
    const id = `toast-${Date.now()}-${++counterRef.current}`;
    setToasts((prev) => [...prev, { id, type, text }]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 left-4 sm:left-auto z-50 flex flex-col items-center sm:items-end gap-2 pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
