"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ManagePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");

  useEffect(() => {
    if (!token) return;
    router.replace(`/onboarding/${token}`);
  }, [token, router]);

  return null;
}
