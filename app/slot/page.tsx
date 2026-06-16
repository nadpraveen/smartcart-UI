"use client";

import MobileContainer from "@/components/layout/MobileContainer";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SlotPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  const slots = [
    "Tomorrow • 7 AM - 9 AM",
    "Tomorrow • 9 AM - 12 PM",
    "Tomorrow • 12 PM - 3 PM",
    "Tomorrow • 6 PM - 9 PM",
  ];

  return (
    <MobileContainer>
      <div className="p-5 space-y-4">
        <h1 className="text-xl font-semibold">Select Delivery Slot</h1>

        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => setSelected(slot)}
            className={`w-full p-3 rounded-xl border text-left ${
              selected === slot ? "bg-primary text-white" : ""
            }`}
          >
            {slot}
          </button>
        ))}

        <button
          disabled={!selected}
          onClick={() => router.push("/checkout")}
          className="w-full bg-primary text-white p-3 rounded-xl mt-4 disabled:opacity-50"
        >
          Continue to Payment
        </button>
      </div>
    </MobileContainer>
  );
}