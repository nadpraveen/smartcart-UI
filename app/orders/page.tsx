"use client";

import MobileContainer from "@/components/layout/MobileContainer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const orders = [
    { id: 1, total: 2000, date: "May 10" },
    { id: 2, total: 1500, date: "May 15" },
  ];

  return (
    <MobileContainer>
      <div className="p-5 pb-28 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">
            Orders 🛒
          </h1>
          <p className="text-sm text-gray-500">
            Your previous smart carts
          </p>
        </div>

        {/* Orders */}
        <div className="space-y-4">

          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white p-4 rounded-2xl shadow-sm space-y-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    Cart #{o.id}
                  </p>
                  <p className="text-xs text-gray-500">
                    {o.date}
                  </p>
                </div>

                <span className="font-semibold">
                  ₹{o.total}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => router.push("/cart")}
                  className="flex-1 bg-primary text-white text-sm p-2 rounded-lg"
                >
                  View
                </button>

                <button
                  className="flex-1 border text-sm p-2 rounded-lg"
                >
                  Reorder
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </MobileContainer>
  );
}