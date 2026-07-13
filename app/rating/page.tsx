"use client";

import MobileContainer from "@/components/layout/MobileContainer";
import { useStore } from "@/store/useStore";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getChannel } from "@/lib/utils/channel";

export default function RatingPage() {
  const router = useRouter();
  const { user } = useStore();

  const [mounted, setMounted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user.isLoggedIn) {
      router.replace("/signup");
    }
  }, [mounted, user.isLoggedIn, router]);

  const handleSubmit = async () => {
    if (rating === 0) return;

    setSubmitting(true);
    setError("");

    try {
      await apiClient.put("/api/v1/carts/rating", { rating, review: review.trim() });
      if (getChannel() === "whatsapp") {
        window.location.href = "https://wa.me/917893984343";
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (!user.isLoggedIn) {
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
      <div className="flex flex-col items-center justify-center min-h-screen px-6 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-5xl">⭐</p>
          <h1 className="text-2xl font-semibold">Rate Your Experience</h1>
          <p className="text-sm text-gray-500">How was your Smart Cart experience?</p>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="transition active:scale-90"
            >
              <Star
                size={36}
                className={`transition-colors ${
                  star <= (hovered || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="w-full max-w-sm space-y-2">
          <label className="text-sm text-gray-500 block">Share your feedback (optional)</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={4}
            maxLength={500}
            className="w-full border border-border rounded-xl p-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm resize-none"
          />
          <p className="text-xs text-gray-400 text-right">{review.length}/500</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center w-full max-w-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={rating === 0 || submitting}
          className="w-full max-w-sm bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-2xl font-medium shadow-lg active:scale-95 transition disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Rating"}
        </button>
      </div>

      {submitting && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
            <span className="text-sm font-medium">Submitting your rating...</span>
          </div>
        </div>
      )}
    </MobileContainer>
  );
}
