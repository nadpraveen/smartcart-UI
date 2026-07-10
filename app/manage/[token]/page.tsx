"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ManagePageClient() {
  const {token} = useParams();
  const router = useRouter();


  console.log("token", token)

  useEffect(() => {
    if (!token) return;
    router.replace(`/onboarding/${token}`);
  }, [token, router]);

  return null;
}
