"use client";

import MobileContainer from "@/components/layout/MobileContainer";
import {
  Menu,
  Bell,
  Mic,
  ShoppingCart,
  Truck,
  Package,
  Repeat,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  return (
    <MobileContainer>
      <div className="p-4 pb-28 space-y-5">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <Menu />
          <h1 className="font-semibold text-lg">Smart App</h1>
          <Bell />
        </div>

        {/* GREETING */}
        <div>
          <p className="text-sm text-gray-500">Good Morning 👋</p>
          <p className="text-lg font-semibold">
            How can I help you today?
          </p>
        </div>

        {/* SEARCH / AI BOX */}
        <div className="flex items-center bg-white p-3 rounded-xl shadow-sm gap-3">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            🤖
          </div>
          <input
            placeholder="Ask Smart AI anything..."
            className="flex-1 outline-none text-sm"
          />
          <div className="bg-primary text-white p-2 rounded-full">
            <Mic size={16} />
          </div>
        </div>

        {/* QUICK SUGGESTIONS */}
        <div className="flex gap-2 overflow-x-auto text-xs">
          {["Grocery for 4", "Monthly plan", "Healthy food"].map((t) => (
            <div
              key={t}
              className="px-3 py-1 bg-muted rounded-full whitespace-nowrap"
            >
              {t}
            </div>
          ))}
        </div>

        {/* SERVICES GRID */}
        <div className="grid grid-cols-4 gap-3">

          {[
            { icon: "🛒", label: "Smart Grocery", path: "/cart" },
            { icon: "👥", label: "Family", path: "/family" },
            { icon: "📋", label: "Orders", path: "/orders" },
            { icon: "📦", label: "Parcels" },
            { icon: "🚚", label: "Delivery" },
            { icon: "🔁", label: "Repeat" },
            { icon: "🥦", label: "Healthy" },
            { icon: "💰", label: "Budget" },
            { icon: "⚡", label: "Quick Buy" },
            { icon: "👤", label: "Profile" },
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => item.path && router.push(item.path)}
              className={`bg-white rounded-xl p-3 text-center shadow-sm transition-all ${item.path ? "cursor-pointer hover:shadow-md active:scale-95" : ""
                }`}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="text-xs font-medium">{item.label}</p>
            </div>
          ))}

        </div>

        {/* SMART GROCERY BANNER */}
        <div className="bg-gradient-to-r from-green-100 to-green-50 
                        rounded-2xl p-4 flex justify-between items-center">

          <div>
            <h2 className="font-semibold text-sm">
              Smart Grocery Planner 🧠
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Plan groceries in seconds
            </p>

            <button className="mt-2 bg-green-500 text-white px-3 py-1 rounded-lg text-xs" onClick={() => router.push("/preferences")}>
              Plan Now →
            </button>
          </div>

          <div className="text-4xl">
            🛒
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        <div>
          <div className="flex justify-between mb-2">
            <p className="text-sm font-medium">
              Recommendations ✨
            </p>
            <span className="text-xs text-primary">
              See all
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-w-[140px] bg-white rounded-xl p-3 shadow-sm"
              >
                <p className="text-xs text-gray-500">
                  Monthly Grocery
                </p>
                <p className="text-sm font-medium">
                  ₹2000 Plan
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 
                      max-w-[420px] w-full bg-white border-t 
                      flex justify-around py-3 text-xs">

        <div className="flex flex-col items-center text-primary text-3xl">
          🏠
          {/* Home */}
        </div>

        <div className="flex flex-col items-center text-gray-400 text-3xl">
          🤖
          {/* AI */}
        </div>

        <div className="flex flex-col items-center text-gray-400 text-3xl">
          📋
          {/* Orders */}
        </div>

        <div className="flex flex-col items-center text-gray-400 text-3xl">
          👤
          {/* Profile */}
        </div>

      </div>
    </MobileContainer>
  );
}