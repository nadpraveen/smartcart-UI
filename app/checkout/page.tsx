"use client";

import { useRouter } from "next/navigation";
import MobileContainer from "@/components/layout/MobileContainer";
import { useStore } from "@/store/useStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { preferences } = useStore();

  const handlePay = () => {
    router.push("/processing");
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

        {/* ADDRESS */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Delivery Address</p>
          <p className="font-medium mt-1">
            Praveen Kumar, Rajahmundry, AP
          </p>
        </div>

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
              ₹{preferences.budget}
            </span>
          </div>
        </div>

        {/* PAY BUTTON */}
        <button
          onClick={handlePay}
          className="w-full bg-primary text-white p-4 rounded-2xl 
                     font-medium shadow active:scale-95 transition"
        >
          Pay Now →
        </button>

      </div>
    </MobileContainer>
  );
}