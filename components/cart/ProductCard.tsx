"use client";

import { useState } from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import { getProductImage } from "@/lib/productImages";

export default function ProductCard({
  item,
  onRemove,
  onUpdateQty,
}: any) {
  const qty = item.quantity || 1;
  const total = item.price * qty;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-3 space-y-2">

      {/* IMAGE */}
      <div className="w-full h-24 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={item.image || getProductImage(item)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* NAME */}
      <p className="text-sm font-medium leading-tight">
        {item.name}
      </p>

      {/* QUANTITY */}
      <p className="text-xs text-gray-500">
        {qty} {item.unit || ""}
      </p>

      {/* PRICE BREAKDOWN */}
      <p className="text-xs text-gray-500">
        ₹{item.price} × {qty}
      </p>

      <p className="text-sm font-semibold">
        ₹{total}
      </p>

      {/* CONTROLS */}
      <div className="flex justify-between items-center mt-2">

        {/* QTY CONTROL */}
        <div className="flex items-center gap-2 border rounded-lg px-2 py-1">
          <button onClick={() => onUpdateQty(item, -1)}>
            <Minus size={14} />
          </button>

          <span className="text-sm">{qty}</span>

          <button onClick={() => onUpdateQty(item, +1)}>
            <Plus size={14} />
          </button>
        </div>

        {/* REMOVE */}
        <button onClick={() => onRemove(item)}>
          <Trash2 size={14} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}