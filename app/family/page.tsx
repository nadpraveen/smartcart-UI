"use client";

import MobileContainer from "@/components/layout/MobileContainer";
import { useStore } from "@/store/useStore";
import { useState, useEffect } from "react";
import AddMemberModal from "@/components/modals/AddMemberModal";

export default function FamilyPage() {
  const { family, deleteMember } = useStore();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <MobileContainer>
      <div className="p-5 pb-28 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">Family 👨‍👩‍👧</h1>
          <p className="text-sm text-gray-500">Manage your household members</p>
        </div>

        {/* Summary Card */}
        <div
          className="bg-gradient-to-br from-indigo-500 to-purple-500 
                        text-white p-5 rounded-2xl shadow-md"
        >
          <p className="text-sm opacity-80">Total Members</p>
          <p className="text-3xl font-semibold mt-1">{family.length}</p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-2 gap-4">
          {family.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl p-4 shadow-sm space-y-2"
            >
              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full bg-indigo-100 
                              text-indigo-600 flex items-center justify-center font-semibold"
              >
                {m.gender === "male" ? "M" : "F"}
              </div>

              <div>
                <p className="font-medium capitalize">{m.gender}</p>
                <p className="text-xs text-gray-500">
                  {m.age} yrs • {m.diet}
                </p>
                {m.isGuest && (
                  <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                    Guest
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between text-xs mt-2">
                <button
                  onClick={() => {
                    setSelected(m);
                    setOpen(true);
                  }}
                  className="text-blue-500"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteMember(m.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Add */}
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 
                     max-w-[360px] w-[90%]
                     bg-primary text-white p-4 rounded-2xl 
                     font-medium shadow-lg active:scale-95 transition"
        >
          + Add Member
        </button>

        {/* Modal */}
        {open && (
          <AddMemberModal
            existing={selected}
            onClose={() => {
              setOpen(false);
              setSelected(null);
            }}
          />
        )}
      </div>
    </MobileContainer>
  );
}
