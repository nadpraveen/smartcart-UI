"use client";

import MobileContainer from "@/components/layout/MobileContainer";
import { useStore } from "@/store/useStore";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const ADMIN_PHONE = process.env.NEXT_PUBLIC_ADMIN_PHONE || "";

export default function AdminPage() {
  const router = useRouter();
  const { user } = useStore();

  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!user.isLoggedIn || user.phone !== ADMIN_PHONE)) {
      router.replace("/");
    }
  }, [mounted, user.isLoggedIn, user.phone, router]);

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      setMessageType("error");
      setMessage("Name and Phone are required");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await apiClient.post("/api/v1/users/register", { name: name.trim(), phone: `91${phone.trim()}` });
      setMessageType("success");
      setMessage("Saved successfully");
    } catch (err: any) {
      setMessageType("error");
      setMessage(err?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleRunCron = async () => {
    setRunning(true);
    setMessage("");

    try {
      await apiClient.get("/api/v1/cron/greet-cron");
      setMessageType("success");
      setMessage("CRON job triggered successfully");
    } catch (err: any) {
      setMessageType("error");
      setMessage(err?.message || "Failed to run CRON");
    } finally {
      setRunning(false);
    }
  };

  if (!mounted) return null;

  if (!user.isLoggedIn || user.phone !== ADMIN_PHONE) {
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
      <div className="p-5 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Admin Panel 🛡️</h1>
          <p className="text-sm text-gray-500">Manage admin settings</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500 block mb-1.5">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border border-border rounded-xl p-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 block mb-1.5">Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter phone number"
              inputMode="numeric"
              className="w-full border border-border rounded-xl p-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-primary text-white p-4 rounded-2xl font-medium shadow-lg active:scale-95 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={handleRunCron}
            disabled={running}
            className="flex-1 bg-orange-500 text-white p-4 rounded-2xl font-medium shadow-lg active:scale-95 transition disabled:opacity-50"
          >
            {running ? "Running..." : "Run CRON"}
          </button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl text-sm text-center ${messageType === "success"
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600"
              }`}
          >
            {message}
          </div>
        )}
      </div>
    </MobileContainer>
  );
}
