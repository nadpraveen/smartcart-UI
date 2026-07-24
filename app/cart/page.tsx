"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MobileContainer from "@/components/layout/MobileContainer";
import { useStore } from "@/store/useStore";
import { apiClient } from "@/lib/api/client";
import { generateCart, regenerateCart } from "@/lib/api/cart";
import ProductCard from "@/components/cart/ProductCard";
import BrandPopup from "@/components/cart/BrandPopup";
import RegenerateConfirm from "@/components/cart/RegenerateConfirm";
import Skeleton from "@/components/ui/Skeleton";
import CategoryChart from "@/components/charts/CategoryChart";
import { useSearchParams } from "next/navigation";

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

function CartFallback() {
  return (
    <MobileContainer>
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    </MobileContainer>
  );
}

function CartPageContent() {
  const router = useRouter();
  const { preferences, setCartState } = useStore();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [mode, setMode] = useState("monthly");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [popupItem, setPopupItem] = useState<CartItem | null>(null);
  const [showRegenConfirm, setShowRegenConfirm] = useState(false);
  const searchParams = useSearchParams();
  const ch = searchParams.get("ch");
  const phone = searchParams.get("phone");

  const navPath = `/slot?ch=${ch ? ch : ""}&phone=${phone ? phone : ""}`

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await generateCart();
        const data = Array.isArray(res) ? res[0] : res;
        const processedCart = [] as any;

        if (data._id) {
          setCart(data?.cart || []);
        } else {
          data?.cart.map((item: any) => {
            if (!item.options) return;
            const cartItem = item.options[0];
            processedCart.push({
              id: cartItem.id,
              name: `${cartItem.brand} ${cartItem.product} ${cartItem.qty}`,
              image: cartItem.image,
              category: item.category,
              quantity: item.quantity,
              unit: item.unit,
              price: cartItem.price,
              total: cartItem.total,
            });

            // return processedCart;
          });

          setCart(processedCart);
        }

        setInsights(data?.insights || []);
        setMode(data.mode);
      } catch {
        setCart([]);
        setInsights([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const grouped = cart.reduce((acc: any, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleRemove = (item: CartItem) => {
    setCart((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleQty = (item: CartItem, delta: number) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, quantity: Math.max(1, (i.quantity || 1) + delta) }
          : i,
      ),
    );
  };

  const handleBrandChange = (item: CartItem, option: BrandOption) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              id: option.id,
              name: `${option.brand} ${item.product}`.trim(),
              image: option.image || i.image,
              price: option.price,
              total: option.total,
            }
          : i,
      ),
    );
    setPopupItem(null);
  };

  const handleToggleDontSuggest = (item: CartItem) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, dontSuggest: !i.dontSuggest } : i,
      ),
    );
  };

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => {
      if (item.dontSuggest) return sum;
      return sum + item.price * (item.quantity || 1);
    }, 0);
    setTotal(newTotal);
    setCartState(
      cart
        .filter((item) => !item.dontSuggest)
        .map((item) => ({
          name: item.name,
          price: item.price,
          category: item.category,
          quantity: item.quantity,
        })),
    );
  }, [cart, setCartState]);

  const handleRegenerate = () => {
    setShowRegenConfirm(true);
  };

  const handleRegenerateConfirmed = async () => {
    setShowRegenConfirm(false);
    setLoading(true);
    try {
      const res = await regenerateCart();
      const data = Array.isArray(res) ? res[0] : res;
      const items = (data?.cart || []).map((item: any) => {
        const defaultOption = item.options?.[0] || {};
        return {
          id: defaultOption.id,
          name: `${defaultOption.brand || ""} ${item.product}`.trim(),
          image: defaultOption.image || "",
          category: item.category,
          quantity: item.quantity || 1,
          unit: item.unit || "",
          price: defaultOption.price || 0,
          total: defaultOption.total || 0,
          product: item.product,
          options: item.options || [],
        };
      });
      setCart(items);
      setInsights(data?.insights || []);
    } catch {
      setCart([]);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  const categoryStats = Object.keys(grouped).map((cat) => {
    const totalCat = grouped[cat].reduce(
      (sum: number, item: CartItem) => sum + item.price * (item.quantity || 1),
      0,
    );
    return { category: cat, value: totalCat };
  });

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
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Your Smart Cart</h2>
          <p className="text-sm text-gray-500">
            Optimized for your family, budget, and preferences
          </p>
        </div>

        {loading ? (
          <Skeleton />
        ) : (
          <>
            <button
              onClick={handleRegenerate}
              className="w-full text-xs bg-primary/10 text-primary rounded-xl p-2 mb-4"
            >
              Regenerate Cart
            </button>

            {Object.keys(grouped).map((cat) => (
              <div key={cat} className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {cat}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {grouped[cat].map((item: CartItem) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      onRemove={handleRemove}
                      onUpdateQty={handleQty}
                      onOpenBrandPopup={setPopupItem}
                      onToggleDontSuggest={handleToggleDontSuggest}
                    />
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-6 bg-white p-4 rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Budget Usage</span>
                <span className="font-medium">
                  ₹{total} /{preferences.budget}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-primary rounded-full"
                  style={{
                    width: `${Math.min((total / preferences.budget) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-400">
                {Math.round((total / preferences.budget) * 100)}% used
              </p>
            </div>

            <CategoryChart data={categoryStats} />

            {insights.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">AI Insights</h3>
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
            )}
          </>
        )}
      </div>

      {!loading && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[420px] w-full bg-white p-4 border-t">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Total</span>
            <span className="font-semibold text-lg">₹{total}</span>
          </div>
          <button
            onClick={async () => {
              if (saving) return;
              setSaving(true);
              try {
                await apiClient.post("/api/v1/carts/update-cart", {
                  cart: cart
                    .filter((item) => !item.dontSuggest)
                    .map((item) => ({
                      id: item.id,
                      name: item.name,
                      category: item.category,
                      quantity: item.quantity,
                      image: item.image,
                      unit: item.unit,
                      price: item.price,
                      total: item.price * item.quantity,
                    })),
                  insights,
                  mode,
                  total,
                });
                if (window.location.search.includes("ch=whatsapp")) {
                  window.location.href = "https://wa.me/917893984343";
                } else {
                  router.push(navPath);
                }
              } catch {
                setSaving(false);
              }
            }}
            disabled={saving}
            className="w-full bg-primary text-white p-3 rounded-xl font-medium active:scale-95 transition disabled:opacity-50"
          >
            {saving ? "Processing..." : "Done \u2192"}
          </button>
        </div>
      )}

      {popupItem && (
        <BrandPopup
          category={popupItem.category}
          product={popupItem.product}
          options={popupItem.options}
          currentBrandId={popupItem.id}
          onSelect={(option) => handleBrandChange(popupItem, option)}
          onClose={() => setPopupItem(null)}
        />
      )}

      {showRegenConfirm && (
        <RegenerateConfirm
          onConfirm={handleRegenerateConfirmed}
          onClose={() => setShowRegenConfirm(false)}
        />
      )}
    </MobileContainer>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<CartFallback />}>
      <CartPageContent />
    </Suspense>
  );
}
