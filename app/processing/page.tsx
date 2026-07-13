"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MobileContainer from "@/components/layout/MobileContainer";
import { getAccessToken } from "@/lib/api/client";
import { getChannel } from "@/lib/utils/channel";

const BASE = "https://smart-cart-backend-b039.onrender.com";

export default function ProcessingPage() {
  const router = useRouter();

  useEffect(() => {
    const confirmOrder = async () => {
      const token = getAccessToken();
      try {
        const res = await fetch(`${BASE}/api/v1/orders/confirm-order`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) {
          if (getChannel() === "whatsapp") {
            window.location.href = "https://wa.me/917893984343";
          } else {
            router.push("/");
          }
        } else {
          router.replace("/checkout");
        }
      } catch {
        router.replace("/checkout");
      }
    };

    confirmOrder();
  }, [router]);

  return (
    <MobileContainer>
      <div className="flex flex-col items-center justify-center h-[80vh]">
        {/* LOADER */}
        <div className="w-16 h-16 border-4 border-primary border-t-transparent 
                        rounded-full animate-spin mb-4" />

        <h2 className="text-lg font-semibold">
          Processing Payment...
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Please wait
        </p>
      </div>
    </MobileContainer>
  );
}
