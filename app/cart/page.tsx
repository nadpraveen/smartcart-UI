"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MobileContainer from "@/components/layout/MobileContainer";
import { useStore } from "@/store/useStore";
import { generateCart } from "@/lib/api/cart";
import ProductCard from "@/components/cart/ProductCard";
import Skeleton from "@/components/ui/Skeleton";
import BrandModal from "@/components/modals/BrandModal";

export default function CartPage() {
  const router = useRouter();
  const { family, preferences } = useStore();

  const [cart, setCart] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // ✅ FETCH CART FROM BACKEND
  useEffect(() => {
    const fetchCart = async () => {
      const res = await generateCart({
        budget: preferences.budget,
        family,
      });

      setCart(res.cart || []);
      setInsights(res.insights || []);
      setTotal(res.total || 0);
      setLoading(false);
    };

    fetchCart();
  }, []);

  // 👉 group by category
  const grouped = cart.reduce((acc: any, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // ======================
  // 🔥 INTERACTIONS
  // ======================

  const handleRemove = (item: any) => {
    setCart((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleQty = (item: any, delta: number) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              quantity: Math.max(1, (i.quantity || 1) + delta),
            }
          : i,
      ),
    );
  };

  const handleChangeBrand = (item: any) => {
    setSelectedItem(item);
  };

  const handleSelectBrand = (newItem: any) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === selectedItem.id ? { ...newItem, quantity: i.quantity } : i,
      ),
    );
    setSelectedItem(null);
  };

  // ======================

  if (!loading && cart.length === 0) {
    return (
      <MobileContainer>
        <div className="p-5 text-center">
          <p className="text-gray-400">No items found</p>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <div className="p-5 pb-32">
        {/* HEADER */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Your Smart Cart 🧠</h2>
          <p className="text-sm text-gray-500">
            Optimized for your family, budget, and preferences
          </p>
        </div>

        {loading ? (
          <Skeleton />
        ) : (
          <>
            {/* MODE SWITCH */}
            <div className="flex gap-2 mb-4">
              {["budget", "balanced", "premium"].map((m) => (
                <button
                  key={m}
                  className="flex-1 border rounded-xl p-2 text-sm"
                >
                  {m}
                </button>
              ))}
            </div>

            {/* CART ITEMS */}
            {Object.keys(grouped).map((cat) => (
              <div key={cat} className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {cat}
                </h3>

                <div className="space-y-3">
                  {grouped[cat].map((item: any) => (
                    <ProductCard
                      key={`${cat}-${item.name}`}
                      item={item}
                      onRemove={handleRemove}
                      onUpdateQty={handleQty}
                      onChangeBrand={handleChangeBrand}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* BUDGET */}
            <div className="mt-6 p-4 rounded-xl bg-white shadow-sm">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Budget</span>
                <span className="font-medium">
                  ₹{total} / ₹{preferences.budget}
                </span>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-primary rounded-full"
                  style={{
                    width: `${Math.min(
                      (total / preferences.budget) * 100,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* INSIGHTS */}
            <div className="mt-6">
              <h3 className="font-medium mb-2">AI Insights 🧠</h3>

              <div className="bg-gradient-to-br from-indigo-50 to-white border border-border p-4 rounded-xl space-y-2">
                {insights.map((text, i) => (
                  <div
                    key={i}
                    className="text-sm text-gray-700 flex gap-2 items-start"
                  >
                    <span className="text-primary">•</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* STICKY FOOTER */}
      {!loading && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[420px] w-full bg-white p-4 border-t">
          <div className="flex justify-between mb-2">
            <span>Total</span>
            <span className="font-semibold">₹{total}</span>
          </div>

          <button
            className="w-full bg-primary text-white p-3 rounded-xl"
            onClick={() => router.push("/checkout")}
          >
            Checkout →
          </button>
        </div>
      )}

      {/* BRAND MODAL */}
      {selectedItem && (
        <BrandModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSelect={handleSelectBrand}
        />
      )}
    </MobileContainer>
  );
}
