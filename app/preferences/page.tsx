"use client";

import { useStore, Mode, PlanType } from "@/store/useStore";
import MobileContainer from "@/components/layout/MobileContainer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PreferencesPage() {
  const {
    preferences,
    family,
    setPreferences,
    setSelectedMembers,
    setPlanType,
  } = useStore();

  const router = useRouter();

  // ===== STATE =====
  const [budget, setBudget] = useState<number>(preferences.budget);
  const [mode, setMode] = useState<Mode>(preferences.mode);
  const [planTypeState, setPlanTypeState] =
    useState<PlanType>("monthly");

  const [selected, setSelected] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // ===== EFFECTS (ALL HOOKS FIRST) =====
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const defaultSelected = family.map((m) => m.id);
    setSelected(defaultSelected);
  }, [family]);

  // ===== HANDLERS =====
  const toggleMember = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleGenerate = () => {
    setPreferences({ budget, mode });
    setSelectedMembers(selected);
    setPlanType(planTypeState);

    router.push("/cart");
  };

  // ✅ IMPORTANT: AFTER all hooks
  if (!mounted) {
    return (
      <MobileContainer>
        <div className="p-5 text-center text-gray-400">
          Loading...
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <div className="p-5 pb-24 space-y-6">

        {/* HEADER */}
        <div>
          <h2 className="text-xl font-semibold">
            Preferences ⚙️
          </h2>
          <p className="text-sm text-gray-500">
            Customize your smart cart
          </p>
        </div>

        {/* BUDGET */}
        <div>
          <label className="text-sm text-gray-500">
            Budget: ₹{budget}
          </label>

          <input
            type="range"
            min="500"
            max="10000"
            step="100"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full mt-2"
          />
        </div>

        {/* MODE */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Mode</p>

          <div className="flex gap-2">
            {(["budget", "balanced", "premium"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 p-3 rounded-xl border ${
                  mode === m
                    ? "bg-primary text-white"
                    : "border-border"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* PLAN TYPE */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Plan Type</p>

          <div className="flex gap-2">
            {(["weekly", "monthly"] as PlanType[]).map((p) => (
              <button
                key={p}
                onClick={() => setPlanTypeState(p)}
                className={`flex-1 p-3 rounded-xl border ${
                  planTypeState === p
                    ? "bg-primary text-white"
                    : "border-border"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* MEMBER SELECTION */}
        <div>
          <p className="text-sm text-gray-500 mb-2">
            Select Members
          </p>

          <div className="space-y-2">
            {family.map((m) => (
              <div
                key={m.id}
                onClick={() => toggleMember(m.id)}
                className={`flex justify-between items-center p-3 rounded-xl cursor-pointer ${
                  selected.includes(m.id)
                    ? "bg-primary text-white"
                    : "bg-white border border-border"
                }`}
              >
                <div>
                  <p className="capitalize">
                    {m.gender}
                  </p>
                  <p className="text-xs opacity-70">
                    {m.age} yrs
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={selected.includes(m.id)}
                  readOnly
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleGenerate}
          disabled={selected.length === 0}
          className={`w-full p-4 rounded-2xl text-white font-medium transition ${
            selected.length === 0
              ? "bg-gray-300"
              : "bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md active:scale-95"
          }`}
        >
          Generate Smart Cart 🧠
        </button>

      </div>
    </MobileContainer>
  );
}