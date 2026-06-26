"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MobileContainer from "@/components/layout/MobileContainer";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useStore();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [mounted, setMounted] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleSendOtp = () => {
    if (phone.length === 10) setStep(2);
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

  const handleVerify = () => {
    setUser({ phone });
    router.push("/");
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
            <h1 className="text-2xl font-semibold mb-2">Welcome back 👋</h1>
            <p className="text-gray-500 mb-6 text-sm">
              Smart grocery planning starts here
            </p>

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
                autoFocus
              />
            </div>

            <button
              onClick={handleSendOtp}
              disabled={phone.length !== 10}
              className="bg-primary text-white w-full p-3 rounded-xl font-medium shadow active:scale-95 transition disabled:opacity-50"
            >
              Send OTP
            </button>

            <p className="text-sm text-center text-gray-500 mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary font-medium">
                Sign up
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

            <button
              onClick={handleVerify}
              disabled={otp.join("").length !== 4}
              className="bg-primary text-white w-full p-3 rounded-xl font-medium shadow active:scale-95 transition disabled:opacity-50"
            >
              Verify & Login
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
