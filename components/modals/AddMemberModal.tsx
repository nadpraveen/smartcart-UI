"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";

export default function AddMemberModal({
  onClose,
  existing,
}: {
  onClose: () => void;
  existing?: any;
}) {
  const { addMember, updateMember } = useStore();

  const [age, setAge] = useState(existing?.age || 25);
  const [gender, setGender] = useState(existing?.gender || "male");
  const [diet, setDiet] = useState(existing?.diet || "veg");
  const [isGuest, setIsGuest] = useState(existing?.isGuest || false);

  const handleAdd = () => {
    if (existing) {
      updateMember({
        ...existing,
        age,
        gender,
        diet,
        isGuest,
      });
    } else {
      addMember({
        id: Date.now().toString(),
        age,
        gender,
        diet,
        isGuest,
        allergies: [],
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
      <div className="bg-white w-full max-w-[420px] rounded-t-2xl p-5">
        <h2 className="text-lg font-semibold mb-4">Add Member</h2>

        {/* Age */}
        <label className="text-sm text-gray-500">Age: {age}</label>

        <input
          type="range"
          min="1"
          max="80"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="w-full mb-4"
        />

        {/* Gender */}
        <div className="flex gap-2 mb-4">
          {["male", "female"].map((g) => (
            <button
              key={g}
              onClick={() => setGender(g as any)}
              className={`flex-1 p-2 rounded-xl border ${
                gender === g ? "bg-primary text-white" : ""
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Diet */}
        <div className="flex gap-2 mb-4">
          {["veg", "non-veg"].map((d) => (
            <button
              key={d}
              onClick={() => setDiet(d as any)}
              className={`flex-1 p-2 rounded-xl border ${
                diet === d ? "bg-primary text-white" : ""
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Gust */}

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium">Guest Member</p>
            <p className="text-xs text-gray-500">
              Temporary / occasional member
            </p>
          </div>

          <button
            onClick={() => setIsGuest(!isGuest)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition
      ${isGuest ? "bg-primary" : "bg-gray-300"}`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow transform transition
        ${isGuest ? "translate-x-6" : ""}`}
            />
          </button>
        </div>

        {/* Actions */}
        <button
          onClick={handleAdd}
          className="bg-primary text-white w-full p-3 rounded-xl mb-2"
        >
          {existing ? "Update Member" : "Add Member"}{" "}
        </button>

        <button onClick={onClose} className="w-full p-3 text-sm text-gray-500">
          Cancel
        </button>
      </div>
    </div>
  );
}
