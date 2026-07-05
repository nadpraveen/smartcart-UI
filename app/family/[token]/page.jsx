"use client";

import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useStore } from "@/store/useStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SessionRedirect from "@/components/ui/sessionRedirect";

export default function FamilyTokenPage() {
  const { sessionToken } = useParams();
  const router = useRouter();
  const setUserAfterAuth = useStore((state) => state.setUserAfterAuth);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof sessionToken !== "string") return;

    let cancelled = false;

    const generateAccessToken = async () => {
      try {
        const data = await authApi.generateSecureToken({ sessionToken });

        if (cancelled) return;

        setUserAfterAuth(data);
        router.replace("/family");
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof ApiError
            ? err.message
            : "Unable to verify this family link. Please try again.",
        );
      }
    };

    generateAccessToken();

    return () => {
      cancelled = true;
    };
  }, [sessionToken, router, setUserAfterAuth]);

  return <SessionRedirect error={error} />;
}
