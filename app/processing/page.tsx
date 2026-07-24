"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import MobileContainer from "@/components/layout/MobileContainer";
import { getAccessToken } from "@/lib/api/client";
import { getChannel } from "@/lib/utils/channel";
import { useSearchParams } from "next/navigation";

const BASE = "https://smart-cart-backend-b039.onrender.com";

function ProcessingFallback() {
  return (
    <MobileContainer>
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    </MobileContainer>
  );
}

function ProcessingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ch = searchParams.get("ch");
  const phone = searchParams.get("phone");

  const navPath = `/success?ch=${ch ? ch : ""}&phone=${phone ? phone : ""}`;

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
            router.push(navPath);
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
        <div
          className="w-16 h-16 border-4 border-primary border-t-transparent 
                        rounded-full animate-spin mb-4"
        />

        <h2 className="text-lg font-semibold">Processing Payment...</h2>

        <p className="text-sm text-gray-500 mt-1">Please wait</p>
      </div>
    </MobileContainer>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={<ProcessingFallback />}>
      <ProcessingPageContent />
    </Suspense>
  );
}
