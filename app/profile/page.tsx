"use client";

import { useStore } from "@/store/useStore";
import MobileContainer from "@/components/layout/MobileContainer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Phone, LogOut, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  /* Auth guard — redirect if not logged in */
  if (!mounted) return null;
  if (!user.isLoggedIn) {
    router.replace("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <MobileContainer>
      <div className="p-5 pb-24 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="text-sm text-gray-500">Manage your account</p>
        </div>

        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-semibold shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold capitalize">{user.name}</p>
            <p className="text-sm text-gray-400">Active</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-border">
            <User size={20} className="text-indigo-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-400">Name</p>
              <p className="font-medium capitalize">{user.name}</p>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </div>

          <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-border">
            <Phone size={20} className="text-indigo-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-400">Phone</p>
              <p className="font-medium">{user.phone}</p>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl text-red-500 font-medium border border-red-200 bg-red-50 hover:bg-red-100 transition active:scale-95"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </MobileContainer>
  );
}
