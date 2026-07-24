"use client";

import { useEffect } from "react";
import { RefreshCw, X } from "lucide-react";

export default function RegenerateConfirm({
  onConfirm,
  onClose,
}: {
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
            <RefreshCw size={24} className="text-orange-500" />
          </div>

          <h3 className="text-lg font-semibold">Regenerate Cart?</h3>

          <p className="text-sm text-gray-500 leading-relaxed">
            Your cart already has items. Regenerating will replace your current
            cart with a new one.
          </p>

          <div className="flex gap-3 w-full pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition active:scale-95"
            >
              Regenerate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
