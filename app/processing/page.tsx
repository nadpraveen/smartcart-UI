"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MobileContainer from "@/components/layout/MobileContainer";

export default function ProcessingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/success");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

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