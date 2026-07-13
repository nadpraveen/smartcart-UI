"use client";

import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useStore } from "@/store/useStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SessionRedirect from "@/components/ui/sessionRedirect";
import { getChannel } from "@/lib/utils/channel";

export default function CheckoutTokenPage() {
  const { token } = useParams();
  const router = useRouter();
  const setUserAfterAuth = useStore((state) => state.setUserAfterAuth);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof token !== "string") return;

    let cancelled = false;

    const generateAccessToken = async () => {
      try {
        const data = await authApi.generateSecureToken({ sessionToken: token });

        if (cancelled) return;
        setUserAfterAuth(data?.response);
        const ch = getChannel();
        router.replace(ch === "whatsapp" ? "/checkout?channel=whatsapp" : "/checkout");
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof ApiError
            ? err.message
            : "Unable to verify this checkout link. Please try again.",
        );
      }
    };

    generateAccessToken();

    return () => {
      cancelled = true;
    };
  }, [token, router, setUserAfterAuth]);

  return <SessionRedirect error={error} />;
}
