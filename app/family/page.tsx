"use client";

import MobileContainer from "@/components/layout/MobileContainer";
import { useStore } from "@/store/useStore";
import { useState, useEffect, useCallback } from "react";
import AddMemberModal from "@/components/modals/AddMemberModal";

export default function FamilyPage() {
  const {
    family,
    familyLoading,
    familyError,
    loadFamily,
    deleteMemberLocal,
    saveFamilyMembers,
  } = useStore();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* Load members from backend on mount */
  useEffect(() => {
    if (mounted) loadFamily();
  }, [mounted]);

  /* Handle "Done" — save all members then redirect to WhatsApp */
  const handleDone = useCallback(async () => {
    await saveFamilyMembers();
    // If no error was set during save, redirect to WhatsApp
    if (!useStore.getState().familyError) {
      window.location.href = "https://wa.me/917893984343";
    }
  }, [saveFamilyMembers]);

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
          <p className="text-3xl font-semibold mt-1">
            {familyLoading ? "..." : family.length}
          </p>
        </div>

        {/* Loading state */}
        {familyLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {/* Error state */}
        {familyError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center">
            {familyError}
            <button onClick={loadFamily} className="underline ml-2 font-medium">
              Retry
            </button>
          </div>
        )}

        {/* Members Grid */}
        <div className="grid grid-cols-2 gap-4">
          {!familyLoading && family.map((m) => (
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
                <p className="font-medium capitalize">{m.name || m.gender}</p>
                <p className="text-xs text-gray-500">
                  {m.age} yrs • {m.diet}
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {m.isGuest && (
                    <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-medium">
                      Guest
                    </span>
                  )}
                  {m.additionalInfo && (
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 italic line-clamp-1 max-w-full" title={m.additionalInfo}>
                      📝 {m.additionalInfo}
                    </span>
                  )}
                </div>
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
                  onClick={() => deleteMemberLocal(m.id)}
                  className="text-red-500 disabled:opacity-50"
                  disabled={familyLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state (no members, not loading) */}
        {!familyLoading && !familyError && family.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">👨‍👩‍👧</p>
            <p className="text-sm">No family members yet</p>
            <p className="text-xs mt-1">Add your first member below</p>
          </div>
        )}

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 max-w-md mx-auto shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <button
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
            disabled={familyLoading}
            className="flex-1 bg-gray-100 text-gray-700 p-4 rounded-2xl font-medium active:scale-95 transition disabled:opacity-50"
          >
            + Add Member
          </button>

          <button
            onClick={handleDone}
            disabled={familyLoading || family.length === 0}
            className="flex-1 bg-primary text-white p-4 rounded-2xl font-medium shadow-lg active:scale-95 transition disabled:opacity-50"
          >
            {familyLoading ? "Saving..." : "Done ✓"}
          </button>
        </div>

        {/* Saving overlay */}
        {familyLoading && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
            <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
              <span className="text-sm font-medium">Saving family members...</span>
            </div>
          </div>
        )}

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
