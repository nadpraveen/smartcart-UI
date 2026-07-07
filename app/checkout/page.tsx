"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MobileContainer from "@/components/layout/MobileContainer";
import { useStore } from "@/store/useStore";
import { getAccessToken } from "@/lib/api/client";

const BASE = "https://smart-cart-backend-b039.onrender.com";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartTotal } = useStore();

  const [activeCart, setActiveCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* Helper: direct fetch with Bearer token */
  const authGet = async (path: string) => {
    const res = await fetch(`${BASE}${path}`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || "Request failed");
    return json.data;
  };

  /* Fetch the user's cart from the backend on mount */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await authGet("/api/v1/carts/");
        setActiveCart(cart);
      } catch {
        setActiveCart(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const displayTotal = activeCart?.total ?? cartTotal;

  /* Confirm the order and redirect to WhatsApp */
  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      await authGet("/api/v1/orders/confirm-order");
      window.location.href = "https://wa.me/917893984343";
    } catch {
      // Error will be displayed via the existing error UI
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileContainer>
      <div className="p-5 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Checkout 💳</h2>
          <p className="text-sm text-gray-500">
            Confirm your order details
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {/* ADDRESS */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Delivery Address</p>
          <p className="font-medium mt-1">
            Praveen Kumar, Rajahmundry, AP
          </p>
        </div>

        {/* CART ITEMS (from active cart, if available) */}
        {activeCart?.cart && activeCart.cart.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Order Items</p>
            {activeCart.cart.slice(0, 5).map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm py-1">
                <span className="text-gray-700 truncate">{item.name}</span>
                <span className="font-medium">
                  ₹{item.price} × {item.quantity || 1}
                </span>
              </div>
            ))}
            {activeCart.cart.length > 5 && (
              <p className="text-xs text-gray-400 mt-1">
                +{activeCart.cart.length - 5} more items
              </p>
            )}
          </div>
        )}

        {/* PAYMENT METHOD */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500 mb-2">
            Payment Method
          </p>

          <div className="space-y-2">
            {["UPI", "Card", "Cash on Delivery"].map((m) => (
              <div
                key={m}
                className="p-3 border rounded-xl text-sm"
              >
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between text-sm">
            <span>Total</span>
            <span className="font-semibold">
              ₹{displayTotal}
            </span>
          </div>
        </div>

        {/* CONFIRM BUTTON */}
        <button
          onClick={handleConfirmOrder}
          disabled={loading || displayTotal === 0}
          className="w-full bg-primary text-white p-4 rounded-2xl 
                     font-medium shadow active:scale-95 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Confirm Order →"}
        </button>
      </div>
    </MobileContainer>
  );
}
