"use client";

import { useRouter } from "next/navigation";
import MobileContainer from "@/components/layout/MobileContainer";

export default function LoginPage() {
  const router = useRouter();

  return (
    <MobileContainer>
      <div className="flex flex-col justify-center min-h-screen px-6">
        
        <h1 className="text-2xl font-semibold mb-2">
          Welcome back 👋
        </h1>

        <p className="text-gray-500 mb-6">
          Smart grocery planning starts here
        </p>

        <input
          placeholder="Email"
          className="w-full border border-border rounded-xl p-3 mb-3
                     focus:border-primary focus:ring-2 focus:ring-primary/20
                     outline-none transition"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-border rounded-xl p-3 mb-4
                     focus:border-primary focus:ring-2 focus:ring-primary/20
                     outline-none transition"
        />

        <button
          onClick={() => router.push("/onboarding")}
          className="bg-primary text-primary-foreground w-full p-3 rounded-xl 
                     font-medium shadow active:scale-95 transition"
        >
          Login
        </button>

        <button className="mt-4 border border-border rounded-xl p-3 text-sm">
          Continue with Google
        </button>
      </div>
    </MobileContainer>
  );
}