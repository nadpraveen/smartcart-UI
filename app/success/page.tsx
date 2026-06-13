"use client";

import { useRouter } from "next/navigation";
import MobileContainer from "@/components/layout/MobileContainer";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <MobileContainer>
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6">

        {/* SUCCESS ICON */}
        <div className="w-20 h-20 rounded-full bg-green-100 
                        flex items-center justify-center text-3xl mb-4">
          ✅
        </div>

        <h2 className="text-xl font-semibold">
          Order Confirmed 🎉
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Your smart cart has been placed successfully
        </p>

        {/* CTA */}
        <button
          onClick={() => router.push("/")}
          className="mt-6 bg-primary text-white px-6 py-3 rounded-xl"
        >
          Back to Home
        </button>

      </div>
    </MobileContainer>
  );
}