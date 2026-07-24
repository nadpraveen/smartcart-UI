"use client";

import { useRouter } from "next/navigation";
import MobileContainer from "@/components/layout/MobileContainer";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ch = searchParams.get("ch");
  const phone = searchParams.get("phone");

  useEffect(() => {
    if (!ch) return;

    if (ch === "partner") {
      try {
        window.close();
      } catch {
        // Ignore errors if the browser blocks closing the tab.
      }

      if (typeof window !== "undefined" && !window.closed) {
        router.replace("/");
      }
      return;
    }

    const timer = window.setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [ch, router]);

  return (
    <MobileContainer>
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6">
        {/* SUCCESS ICON */}
        <div
          className="w-20 h-20 rounded-full bg-green-100 
                        flex items-center justify-center text-3xl mb-4"
        >
          ✅
        </div>

        <h2 className="text-xl font-semibold">Order Confirmed 🎉</h2>

        <p className="text-sm text-gray-500 mt-2">
          Your smart cart has been placed successfully
        </p>

        {/* <button
          onClick={() => router.push("/")}
          className="mt-6 bg-primary text-white px-6 py-3 rounded-xl"
        >
          Back to Home
        </button> */}
      </div>
    </MobileContainer>
  );
}
