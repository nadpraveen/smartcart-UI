"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MobileContainer from "@/components/layout/MobileContainer";
import { useStore } from "@/store/useStore";
import { apiClient } from "@/lib/api/client";
import { useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartTotal, deliveryAddress, user } = useStore();

  const [activeCart, setActiveCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const searchParams = useSearchParams();

  const ch = searchParams.get("ch");
  const phone = searchParams.get("phone");

  const navPath = `/processing?ch=${ch ? ch : ""}&phone=${phone ? phone : ""}`;

  /* Fetch the user's cart from the backend on mount */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await apiClient.get("/api/v1/carts/");
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
      await apiClient.get("/api/v1/orders/confirm-order");
      if (window.location.search.includes("ch=whatsapp")) {
        window.location.href = "https://wa.me/917893984343";
      } else {
        router.push(navPath);
      }
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
          <p className="text-sm text-gray-500">Confirm your order details</p>
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
            {deliveryAddress?.address
              ? `${user.name}, ${deliveryAddress.address}${deliveryAddress.landmark ? `, ${deliveryAddress.landmark}` : ""}, ${deliveryAddress.pincode}`
              : "No address set"}
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
          <p className="text-sm text-gray-500 mb-2">Payment Method</p>

          <div className="space-y-2">
            {["UPI", "Card", "Cash on Delivery"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedPayment(m)}
                className={`w-full text-left p-3 rounded-xl text-sm border transition active:scale-95 ${
                  selectedPayment === m
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between text-sm">
            <span>Total</span>
            <span className="font-semibold">₹{displayTotal}</span>
          </div>
        </div>

        {/* CONFIRM BUTTON */}
        <button
          onClick={handleConfirmOrder}
          disabled={loading || displayTotal === 0 || !selectedPayment}
          className="w-full bg-primary text-white p-4 rounded-2xl 
                     font-medium shadow active:scale-95 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Confirm Order →"}
        </button>
      </div>
    </MobileContainer>
  );
}
