"use client";

import MobileContainer from "@/components/layout/MobileContainer";
import { useStore, FoodPreference, Mode, PlanType } from "@/store/useStore";
import { authApi } from "@/lib/api/auth";
import { preferencesApi } from "@/lib/api/preferences";
import { userApi } from "@/lib/api/user";
import { useRouter } from "next/navigation";
import { useState, useEffect, useSyncExternalStore, Suspense } from "react";
import { Check } from "lucide-react";
// import { getChannel } from "@/lib/utils/channel";
import { useSearchParams } from "next/navigation";

const ALLERGIES = ["lactose", "nuts", "gluten"] as const;
const FAMILY_COUNT_OPTIONS = [1, 2, 3, 4];
const emptySubscribe = () => () => { };
const clientSnapshot = () => true;
const serverSnapshot = () => false;

function OnboardingFallback() {
  return (
    <MobileContainer>
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    </MobileContainer>
  );
}

function OnboardingPageContent() {
  const router = useRouter();
  const {
    user,
    foodPreference,
    householdAllergies,
    familyMemberCount,
    deliveryAddress,
    preferences,
    setFoodPreference,
    setHouseholdAllergies,
    setFamilyMemberCount,
    setDeliveryAddress,
    setPreferences,
    loadProfile,
    loadPrefs,
    setUserAfterAuth,
  } = useStore();

  const searchParams = useSearchParams();
  const ch = searchParams.get("ch");

  const mounted = useSyncExternalStore(
    emptySubscribe,
    clientSnapshot,
    serverSnapshot,
  );
  const [dataLoaded, setDataLoaded] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [localName, setLocalName] = useState("");
  const [localCount, setLocalCount] = useState<number>(familyMemberCount);
  const [localCountCustom, setLocalCountCustom] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [localFoodPref, setLocalFoodPref] =
    useState<FoodPreference>(foodPreference);
  const [localAllergies, setLocalAllergies] =
    useState<string[]>(householdAllergies);

  const [localBudget, setLocalBudget] = useState(preferences.budget);
  const [localMode, setLocalMode] = useState<Mode>(preferences.mode);
  const [localPlanType, setLocalPlanType] = useState<PlanType>(
    preferences.planType,
  );

  const [localAddress, setLocalAddress] = useState(deliveryAddress.address);
  const [localLandmark, setLocalLandmark] = useState(deliveryAddress.landmark);
  const [localPincode, setLocalPincode] = useState(deliveryAddress.pincode);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;

    const init = async () => {
      // Partner flow: auto-login via findOrCreate before loading profile
      if (ch === "partner") {
        const phone = searchParams.get("phone");
        if (phone) {
          try {
            const data = await authApi.partnerLogin({ phone });
            setUserAfterAuth(data);
          } catch (err) {
            console.error("Partner login failed", err);
          }
        }
      }

      await Promise.all([loadProfile(), loadPrefs()]);
      if (cancelled) return;

      const state = useStore.getState();
      setLocalName(state.user.name);
      setLocalCount(state.familyMemberCount);
      setLocalFoodPref(state.foodPreference);
      setLocalAllergies(state.householdAllergies);
      setLocalBudget(state.preferences.budget);
      setLocalMode(state.preferences.mode);
      setLocalPlanType(state.preferences.planType);
      setLocalAddress(state.deliveryAddress.address);
      setLocalLandmark(state.deliveryAddress.landmark);
      setLocalPincode(state.deliveryAddress.pincode);
      setDataLoaded(true);
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [mounted, ch, searchParams, loadProfile, loadPrefs, setUserAfterAuth]);

  useEffect(() => {
    if (dataLoaded && !user.isLoggedIn) {
      router.replace("/signup");
    }
  }, [dataLoaded, user.isLoggedIn, router]);

  const toggleAllergy = (item: string) => {
    setLocalAllergies((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item],
    );
  };

  const handleCountChange = (value: number) => {
    if (value === 5) {
      setShowCustomInput(true);
      setLocalCount(5);
      setLocalCountCustom("");
    } else {
      setShowCustomInput(false);
      setLocalCount(value);
      setLocalCountCustom("");
    }
  };

  const canContinueStep1 = localName?.trim()?.length >= 1 && localCount > 0;
  const canContinueStep2 = localBudget >= 100;

  const handleSubmitStep1 = () => {
    if (!canContinueStep1) return;
    setFoodPreference(localFoodPref);
    setHouseholdAllergies(localAllergies);
    const finalCount = showCustomInput
      ? Math.max(5, parseInt(localCountCustom) || 5)
      : localCount;
    setFamilyMemberCount(finalCount);
    setStep(2);
  };

  const handleSubmitStep2 = () => {
    if (!canContinueStep2) return;
    setPreferences({
      budget: localBudget,
      mode: localMode,
      planType: localPlanType,
    });
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!localAddress.trim() || !localPincode.trim()) return;

    setSubmitting(true);
    setSubmitError("");

    const finalCount = showCustomInput
      ? Math.max(5, parseInt(localCountCustom) || 5)
      : localCount;

    const deliveryAddr = {
      address: localAddress.trim(),
      landmark: localLandmark.trim(),
      pincode: localPincode.trim(),
    };

    setDeliveryAddress(deliveryAddr);

    try {
      await Promise.all([
        preferencesApi.save({
          budget: localBudget,
          mode: localMode,
          planType: localPlanType,
        }),
        userApi.updateProfile({
          name: localName.trim(),
          foodPreference: localFoodPref,
          householdAllergies: localAllergies,
          familyMemberCount: finalCount,
          deliveryAddress: deliveryAddr,
        }),
      ]);
      if (ch && ch === "whatsapp") {
        window.location.href = "https://wa.me/917893984343";
      } else if (ch === "partner") {
        const phone = searchParams.get("phone");
        router.push(`/cart?ch=partner&phone=${phone}`);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setSubmitError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (!dataLoaded || !user.isLoggedIn) {
    return (
      <MobileContainer>
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <div className="p-5 pb-28 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Smart Grocery 🧠</h1>
          <p className="text-sm text-gray-500">Set up your household</p>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${s < step
                    ? "bg-primary text-white"
                    : s === step
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
              >
                {s < step ? <Check size={16} /> : s}
              </div>
              <span
                className={`text-xs font-medium ${s <= step ? "text-gray-800" : "text-gray-400"
                  }`}
              >
                {s === 1 ? "Family" : s === 2 ? "Prefs" : "Address"}
              </span>
              {s < 3 && (
                <div
                  className={`flex-1 h-0.5 ${s < step ? "bg-primary" : "bg-gray-200"
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-500 block mb-1.5">
                Your Name
              </label>
              <input
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                placeholder="Enter your name"
                className="w-full border border-border rounded-xl p-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-1.5">
                Family Members Count
              </label>
              <div className="flex gap-2 flex-wrap">
                {FAMILY_COUNT_OPTIONS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleCountChange(n)}
                    className={`w-12 h-12 rounded-xl border text-sm font-medium transition active:scale-95 ${localCount === n && !showCustomInput
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-200"
                      }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleCountChange(5)}
                  className={`w-12 h-12 rounded-xl border text-sm font-medium transition active:scale-95 ${showCustomInput
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-200"
                    }`}
                >
                  5+
                </button>
              </div>
              {showCustomInput && (
                <input
                  type="number"
                  min={5}
                  value={localCountCustom}
                  onChange={(e) => setLocalCountCustom(e.target.value)}
                  placeholder="Enter exact count"
                  className="mt-2 w-full border border-border rounded-xl p-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
                />
              )}
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-1.5">
                Food Preference
              </label>
              <div className="flex gap-2">
                {(["veg", "non-veg", "both"] as FoodPreference[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setLocalFoodPref(opt)}
                    className={`flex-1 p-3 rounded-xl border text-sm font-medium capitalize transition active:scale-95 ${localFoodPref === opt
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-200"
                      }`}
                  >
                    {opt === "veg"
                      ? "🥦 Veg"
                      : opt === "non-veg"
                        ? "🍗 Non-Veg"
                        : "🍽️ Both"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-1.5">
                Allergies
              </label>
              <div className="flex gap-2 flex-wrap">
                {ALLERGIES.map((item) => {
                  const active = localAllergies.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAllergy(item)}
                      className={`px-4 py-2.5 rounded-xl border text-sm font-medium capitalize transition active:scale-95 ${active
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-200"
                        }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-500 block mb-1.5">
                Budget: ₹{localBudget}
              </label>
              <input
                type="range"
                min={500}
                max={10000}
                step={100}
                value={localBudget}
                onChange={(e) => setLocalBudget(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-1.5">Mode</label>
              <div className="flex gap-2">
                {(["budget", "balanced", "premium"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setLocalMode(m)}
                    className={`flex-1 p-3 rounded-xl border text-sm font-medium capitalize transition active:scale-95 ${localMode === m
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-200"
                      }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-1.5">
                Plan Type
              </label>
              <div className="flex gap-2">
                {(["weekly", "monthly"] as PlanType[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setLocalPlanType(p)}
                    className={`flex-1 p-3 rounded-xl border text-sm font-medium capitalize transition active:scale-95 ${localPlanType === p
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-200"
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-500 block mb-1.5">
                Full Address
              </label>
              <textarea
                value={localAddress}
                onChange={(e) => setLocalAddress(e.target.value)}
                placeholder="House/Flat no., Street, Area, City"
                rows={3}
                className="w-full border border-border rounded-xl p-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm resize-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-1.5">
                Landmark (optional)
              </label>
              <input
                value={localLandmark}
                onChange={(e) => setLocalLandmark(e.target.value)}
                placeholder="Nearby landmark"
                className="w-full border border-border rounded-xl p-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-1.5">
                Pincode
              </label>
              <input
                value={localPincode}
                onChange={(e) =>
                  setLocalPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="6-digit pincode"
                maxLength={6}
                inputMode="numeric"
                className="w-full border border-border rounded-xl p-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
              />
            </div>
          </div>
        )}

        {submitError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center">
            {submitError}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 max-w-md mx-auto shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {step > 1 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={submitting}
            className="flex-1 bg-gray-100 text-gray-700 p-4 rounded-2xl font-medium active:scale-95 transition disabled:opacity-50"
          >
            ← Back
          </button>
        )}

        {step < 3 ? (
          <button
            onClick={step === 1 ? handleSubmitStep1 : handleSubmitStep2}
            disabled={
              (step === 1 && !canContinueStep1) ||
              (step === 2 && !canContinueStep2) ||
              submitting
            }
            className="flex-1 bg-primary text-white p-4 rounded-2xl font-medium shadow-lg active:scale-95 transition disabled:opacity-50"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={
              !localAddress.trim() || !localPincode.trim() || submitting
            }
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-2xl font-medium shadow-lg active:scale-95 transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>

      {submitting && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
            <span className="text-sm font-medium">
              Saving your information...
            </span>
          </div>
        </div>
      )}
    </MobileContainer>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingFallback />}>
      <OnboardingPageContent />
    </Suspense>
  );
}
