"use client";

import { Plus, Minus, Trash2, Ban } from "lucide-react";
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

type CartItem = {
  id: number;
  name: string;
  image: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
  product: string;
  options: BrandOption[];
  dontSuggest?: boolean;
};

export default function ProductCard({
  item,
  onRemove,
  onUpdateQty,
  onOpenBrandPopup,
  onToggleDontSuggest,
}: {
  item: CartItem;
  onRemove: (item: CartItem) => void;
  onUpdateQty: (item: CartItem, delta: number) => void;
  onOpenBrandPopup?: (item: CartItem) => void;
  onToggleDontSuggest: (item: CartItem) => void;
}) {
  const qty = item.quantity || 1;
  const total = item.price * qty;
  const isExcluded = item.dontSuggest;

  if (isExcluded) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-4 flex flex-col justify-center items-center text-center space-y-2 h-full min-h-[220px] transition-all">
        <div className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
          <Ban size={16} />
        </div>
        <p className="text-xs text-gray-700 font-semibold">Excluded</p>
        <p className="text-[10px] text-gray-400 max-w-[120px] truncate">{item.name}</p>
        <button
          onClick={() => onToggleDontSuggest(item)}
          className="mt-2 bg-primary text-white text-xs px-3 py-1.5 rounded-xl font-medium shadow-sm hover:bg-primary/95 transition active:scale-95"
        >
          Undo
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-3 flex flex-col justify-between h-full min-h-[220px] space-y-2">
      <div>
        <div className="w-full h-24 rounded-xl overflow-hidden bg-gray-100 mb-2">
          <img
            src={item.image || getProductImage(item.category)}
            className="w-full h-full object-cover"
            alt={item.name}
          />
        </div>

        <p className="text-sm font-medium leading-tight line-clamp-2">
          {item.name}
        </p>

        <p className="text-xs text-gray-500">
          {qty} {item.unit}
        </p>

        <p className="text-xs text-gray-500">
          ₹{item.price} x {qty}
        </p>

        {item.options?.length > 1 && onOpenBrandPopup && (
          <button
            onClick={() => onOpenBrandPopup(item)}
            className="mt-2 w-full text-xs border border-blue-400 rounded-lg px-2 py-1.5 text-gray-700 font-medium hover:bg-blue-50 transition active:scale-95"
          >
            Change Brand ({item.options.length} options)
          </button>
        )}
      </div>

      <div>
        <p className="text-sm font-semibold mb-2">₹{total}</p>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 border rounded-lg px-2 py-1">
            <button onClick={() => onUpdateQty(item, -1)}>
              <Minus size={14} />
            </button>
            <span className="text-sm font-medium">{qty}</span>
            <button onClick={() => onUpdateQty(item, +1)}>
              <Plus size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleDontSuggest(item)}
              title="Don't suggest this item"
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <Ban size={14} />
            </button>
            <button
              onClick={() => onRemove(item)}
              title="Remove from cart"
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
