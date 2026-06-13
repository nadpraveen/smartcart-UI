"use client";

import { useState } from "react";
import { Trash2, RefreshCw } from "lucide-react";
import { getProductImage } from "@/lib/productImages";

export default function ProductCard({
  item,
  onRemove,
  onUpdateQty,
  onChangeBrand,
}: any) {
  const [showWhy, setShowWhy] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">

      {/* TOP */}
      <div className="flex gap-3">

        <img
          src={getProductImage(item.category)}
          className="w-16 h-16 rounded-xl object-cover"
        />

        <div className="flex-1">
          <p className="text-sm font-medium leading-tight">
            {item.name}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            ₹{item.price}
          </p>
        </div>

        {/* REMOVE */}
        <button onClick={() => onRemove(item)}>
          <Trash2 size={16} className="text-gray-400" />
        </button>
      </div>

      {/* QUANTITY */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2 border rounded-xl px-2 py-1">
          <button onClick={() => onUpdateQty(item, -1)}>-</button>
          <span className="text-sm">{item.quantity || 1}</span>
          <button onClick={() => onUpdateQty(item, +1)}>+</button>
        </div>

        {/* CHANGE BRAND */}
        <button
          onClick={() => onChangeBrand(item)}
          className="text-xs text-primary flex items-center gap-1"
        >
          <RefreshCw size={12} />
          Change
        </button>
      </div>

      {/* WHY */}
      <button
        onClick={() => setShowWhy(!showWhy)}
        className="text-xs text-primary"
      >
        Why this?
      </button>

      {showWhy && (
        <div className="text-xs text-gray-600 bg-muted p-2 rounded-lg">
          {generateReason(item)}
        </div>
      )}
    </div>
  );
}

function generateReason(item: any) {
  if (item.category === "protein") return "Added for protein intake";
  if (item.essential) return "Essential household item";
  return "Optimized based on your preferences";
}