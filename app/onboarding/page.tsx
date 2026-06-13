"use client";

import MobileContainer from "@/components/layout/MobileContainer";
import { useRouter } from "next/navigation";
import { Users, ShoppingCart, Sparkles } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  return (
    <MobileContainer>
      <div className="p-5 pb-28 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">
            Smart Grocery 🧠
          </h1>
          <p className="text-sm text-gray-500">
            Manage your household smartly
          </p>
        </div>

        {/* Smart Banner */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 
                        text-white p-5 rounded-2xl shadow-md">
          <p className="text-sm opacity-80">
            AI Powered Planning
          </p>
          <h2 className="text-lg font-semibold mt-1">
            Generate your monthly grocery in seconds
          </h2>

          <button
            onClick={() => router.push("/preferences")}
            className="mt-3 bg-white text-black px-4 py-2 rounded-xl text-sm font-medium"
          >
            Generate Cart →
          </button>
        </div>

        {/* FEATURE BLOCKS */}
        <div className="grid grid-cols-2 gap-4">

          {/* Family */}
          <div
            onClick={() => router.push("/family")}
            className="bg-white p-4 rounded-2xl shadow-sm active:scale-95 transition"
          >
            <Users className="mb-2 text-primary" />
            <p className="font-medium text-sm">Family</p>
            <p className="text-xs text-gray-500">
              Manage members
            </p>
          </div>

          {/* Orders */}
          <div
            onClick={() => router.push("/orders")}
            className="bg-white p-4 rounded-2xl shadow-sm active:scale-95 transition"
          >
            <ShoppingCart className="mb-2 text-primary" />
            <p className="font-medium text-sm">Orders</p>
            <p className="text-xs text-gray-500">
              View past carts
            </p>
          </div>

          {/* Insights */}
          <div
            onClick={() => router.push("/cart")}
            className="bg-white p-4 rounded-2xl shadow-sm active:scale-95 transition"
          >
            <Sparkles className="mb-2 text-primary" />
            <p className="font-medium text-sm">Smart Cart</p>
            <p className="text-xs text-gray-500">
              View generated cart
            </p>
          </div>

        </div>

      </div>
    </MobileContainer>
  );
}