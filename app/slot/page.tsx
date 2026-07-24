"use client";

import MobileContainer from "@/components/layout/MobileContainer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SlotPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const searchParams = useSearchParams();
  const ch = searchParams.get("ch");
  const phone = searchParams.get("phone");

  const navPath = `/checkout?ch=${ch ? ch : ""}&phone=${phone ? phone : ""}`;

  const slots = [
    {
      id: "quick",
      label: "⚡ Quick Delivery (Within 45 mins)",
      subtext: "Delivered instantly • Extra ₹29",
      isQuick: true,
    },
    {
      id: "slot1",
      label: "Tomorrow • 7 AM - 9 AM",
      subtext: "Standard delivery • Free",
    },
    {
      id: "slot2",
      label: "Tomorrow • 9 AM - 12 PM",
      subtext: "Standard delivery • Free",
    },
    {
      id: "slot3",
      label: "Tomorrow • 12 PM - 3 PM",
      subtext: "Standard delivery • Free",
    },
    {
      id: "slot4",
      label: "Tomorrow • 6 PM - 9 PM",
      subtext: "Standard delivery • Free",
    },
  ];

  return (
    <MobileContainer>
      <div className="p-5 space-y-4 pb-28">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Select Delivery Slot
          </h1>
          <p className="text-sm text-gray-500">
            Choose when you want your items delivered
          </p>
        </div>

        <div className="space-y-3">
          {slots.map((slot) => {
            const isSelected = selected === slot.label;
            return (
              <button
                key={slot.id}
                onClick={() => setSelected(slot.label)}
                className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-md active:scale-98"
                    : slot.isQuick
                      ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 hover:border-amber-400 hover:shadow-sm"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="space-y-1">
                  <p
                    className={`font-semibold text-sm ${isSelected ? "text-white" : slot.isQuick ? "text-amber-800" : "text-gray-800"}`}
                  >
                    {slot.label}
                  </p>
                  <p
                    className={`text-xs ${isSelected ? "text-white/85" : "text-gray-500"}`}
                  >
                    {slot.subtext}
                  </p>
                </div>
                {slot.isQuick && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? "bg-white text-primary" : "bg-amber-100 text-amber-700 border border-amber-200"}`}
                  >
                    FASTEST
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          disabled={!selected}
          onClick={() => router.push(navPath)}
          className="w-full bg-primary text-white p-4 rounded-2xl mt-4 font-semibold shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
        >
          Continue to Payment
        </button>
      </div>
    </MobileContainer>
  );
}
