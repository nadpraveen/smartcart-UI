"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MobileContainer from "@/components/layout/MobileContainer";
import { useStore } from "@/store/useStore";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { setUserAfterAuth } = useStore();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleSendOtp = () => {
    if (name.length >= 2 && phone.length === 10) setStep(2);
  };

  const handleOtpChange = (idx: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value.slice(0, 1);
    setOtp(newOtp);
    if (value && idx < 3) inputRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  /* Submit OTP → call backend register → save tokens → redirect home */
  const handleVerify = async () => {
    setError("");
    setIsLoading(true);
    try {
      const data = await authApi.register({ name, phone, otp: otp.join("") });
      setUserAfterAuth(data);
      router.push("/onboarding");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileContainer>
      <div className="flex flex-col justify-center min-h-screen px-6">
        {step === 1 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl font-semibold mb-2">Create Account 👋</h1>
            <p className="text-gray-500 mb-6 text-sm">
              Smart grocery planning starts here
            </p>

            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-border rounded-xl p-3 mb-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
              autoFocus
            />

            <div
              className="flex items-center border border-border rounded-xl p-3 mb-4
                          focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20
                          transition"
            >
              <span className="text-gray-500 mr-2 text-sm">+91</span>
              <input
                placeholder="Phone number"
                maxLength={10}
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
                className="flex-1 outline-none bg-transparent text-sm"
              />
            </div>

            <button
              onClick={handleSendOtp}
              disabled={name.length < 2 || phone.length !== 10}
              className="bg-primary text-white w-full p-3 rounded-xl font-medium shadow active:scale-95 transition disabled:opacity-50"
            >
              Send OTP
            </button>

            <p className="text-sm text-center text-gray-500 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium">
                Login
              </Link>
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={() => {
                setStep(1);
                setOtp(["", "", "", ""]);
              }}
              className="flex items-center gap-1 text-gray-500 mb-4 text-sm"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <h2 className="text-xl font-semibold mb-2">Enter OTP</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Sent to +91 {phone}
            </p>

            <div className="flex gap-3 justify-center mb-6">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  maxLength={1}
                  value={otp[idx]}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-14 h-14 text-center text-xl font-semibold rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <button
              onClick={handleVerify}
              disabled={otp.join("").length !== 4 || isLoading}
              className="bg-primary text-white w-full p-3 rounded-xl font-medium shadow active:scale-95 transition disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify & Sign Up"}
            </button>

            <button
              onClick={() => {
                setStep(1);
                setOtp(["", "", "", ""]);
              }}
              className="text-sm text-gray-500 mt-4 w-full text-center"
            >
              Change phone number?
            </button>
          </motion.div>
        )}
      </div>
    </MobileContainer>
  );
}
