"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { getProductImage } from "@/lib/productImages";

type BrandOption = {
  id: number;
  product: string;
  brand: string;
  variant: string;
  image: string;
  price: number;
  total: number;
  unit: string;
  qty: string;
};

export default function BrandPopup({
  category,
  product,
  options,
  currentBrandId,
  onSelect,
  onClose,
}: {
  category: string;
  product: string;
  options: BrandOption[];
  currentBrandId: number;
  onSelect: (option: BrandOption) => void;
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
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl w-full max-w-[420px] max-h-[70vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b z-10">
          <div>
            <h3 className="font-semibold text-sm">Change Brand</h3>
            <p className="text-xs text-gray-400">{product}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {options.map((option) => {
            const isActive = option.id === currentBrandId;
            return (
              <button
                key={option.id}
                onClick={() => {
                  if (!isActive) onSelect(option);
                }}
                disabled={isActive}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition ${
                  isActive
                    ? "border-primary bg-primary/5 cursor-default"
                    : "border-gray-200 hover:border-gray-300 active:scale-[0.98]"
                }`}
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={option.image || getProductImage(category)}
                    className="w-full h-full object-cover"
                    alt={option.brand}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold">{option.brand}</p>
                  <p className="text-xs text-gray-500">
                    {option.variant} | {option.qty}
                  </p>
                  <p className="text-sm font-bold mt-0.5">\u20b9{option.price}</p>
                </div>
                {isActive ? (
                  <span className="text-xs font-semibold text-primary shrink-0">
                    Selected
                  </span>
                ) : (
                  <span className="text-xs font-medium text-gray-500 shrink-0">
                    Select
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
