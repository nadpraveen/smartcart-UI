"use client";

/* ===== WHATSAPP SESSION PAGE =====
 * Landing page for users coming from WhatsApp links.
 * Flow:
 *   1. Read UUID from URL params
 *   2. Call backend to validate session + get JWT
 *   3. Store tokens exactly like normal login (setUserAfterAuth)
 *   4. Redirect to the page matching requestedAction
 *
 * This page is PUBLIC (no auth guard). It IS the auth entry point
 * for WhatsApp users — converts a temp session into a full JWT session.
 */
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { apiClient, ApiError } from "@/lib/api/client";
import MobileContainer from "@/components/layout/MobileContainer";

/* Map backend requestedAction → frontend route */
const ACTION_ROUTES: Record<string, string> = {
  family: "/family",
  preferences: "/preferences",
  cart: "/cart",
};

export default function SessionPage() {
  const params = useParams<{ uuid: string }>();
  const router = useRouter();
  const { setUserAfterAuth } = useStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const exchangeSession = async () => {
      const uuid = params.uuid;
      if (!uuid) return;

      try {
        /* Call backend to validate session and get JWT */
        const data = await apiClient.get(
          `/api/v1/whatsapp/session/${uuid}`,
        );

        if (cancelled) return;

        /* Store JWT in cookies + Zustand (same as login) */
        setUserAfterAuth(data);

        /* Redirect to the intended page */
        const target = ACTION_ROUTES[data.requestedAction] || "/";
        router.replace(target);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof ApiError
            ? err.message
            : "Something went wrong. Please try again.";
        setError(message);
      }
    };

    exchangeSession();

    return () => {
      cancelled = true;
    };
  }, [params.uuid]);

  return (
    <MobileContainer>
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        {!error ? (
          /* Loading state */
          <div className="text-center">
            <div
              className="animate-spin w-10 h-10 border-4 border-primary 
                          border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-500 text-sm">
              Verifying your session...
            </p>
          </div>
        ) : (
          /* Error state */
          <div className="text-center max-w-sm">
            <p className="text-5xl mb-4">⚠️</p>
            <h2 className="text-lg font-semibold mb-2">Session Error</h2>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <p className="text-xs text-gray-400">
              Please go back to WhatsApp and request a new link.
            </p>
          </div>
        )}
      </div>
    </MobileContainer>
  );
}
