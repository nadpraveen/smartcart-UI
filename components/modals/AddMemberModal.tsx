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

  const [name, setName] = useState(existing?.name || "");
  const [age, setAge] = useState(existing?.age || 25);
  const [gender, setGender] = useState(existing?.gender || "male");
  const [diet, setDiet] = useState(existing?.diet || "veg");
  const [isGuest, setIsGuest] = useState(existing?.isGuest || false);
  const [allergies, setAllergies] = useState<string[]>(
    existing?.allergies || [],
  );
  const [additionalInfo, setAdditionalInfo] = useState(existing?.additionalInfo || "");

  const [showAllergyModal, setShowAllergyModal] = useState(false);

  const handleAdd = () => {
    console.log('allergies', allergies); 
    if (existing) {
      updateMember({
        ...existing,
        name,
        age,
        gender,
        diet,
        isGuest,
        allergies,
        additionalInfo,
      });
    } else {
      addMember({
        id: Date.now().toString(),
        name,
        age,
        gender,
        diet,
        isGuest,
        allergies,
        additionalInfo,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-[400px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{existing ? "Edit Member" : "Add Member"}</h2>
        <label className="text-sm text-gray-500">Name:</label>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-xl mb-4"
        />

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
        {/* <div className="flex gap-2 mb-4">
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
        </div> */}

        {/* Diet */}
        {/* <div className="flex gap-2 mb-4">
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
        </div> */}

        {/* Gender Selection */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Gender</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setGender("male")}
              className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all active:scale-95 ${
                gender === "male"
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span>👨</span>
              <span className="text-sm font-medium">Male</span>
            </button>
            <button
              type="button"
              onClick={() => setGender("female")}
              className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all active:scale-95 ${
                gender === "female"
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span>👩</span>
              <span className="text-sm font-medium">Female</span>
            </button>
          </div>
        </div>

        {/* Diet Selection */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Diet Preference</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDiet("veg")}
              className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all active:scale-95 ${
                diet === "veg"
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span>🥦</span>
              <span className="text-sm font-medium">Vegetarian</span>
            </button>
            <button
              type="button"
              onClick={() => setDiet("non-veg")}
              className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all active:scale-95 ${
                diet === "non-veg"
                  ? "bg-red-600 text-white border-red-600 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span>🍗</span>
              <span className="text-sm font-medium">Non-Veg</span>
            </button>
          </div>
        </div>

        {/* Allergies */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Allergies</label>
          <button
            type="button"
            onClick={() => setShowAllergyModal(true)}
            className="w-full p-3 border border-gray-200 bg-white rounded-xl text-left text-sm text-gray-700 flex justify-between items-center hover:bg-gray-50 transition"
          >
            <span>
              {allergies.length > 0
                ? `Allergies: ${allergies.join(", ")}`
                : "Declare allergies (lactose, nuts, gluten...)"}
            </span>
            <span className="text-gray-400">➔</span>
          </button>
        </div>

        {/* Additional Info */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Additional Info / Notes</label>
          <textarea
            placeholder="e.g. Diabetic options, organic milk, likes green apples, notes..."
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm resize-none h-20"
          />
        </div>

        {/* Guest */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-800">Guest Member</p>
            <p className="text-xs text-gray-500">
              Temporary / occasional member
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsGuest(!isGuest)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200
              ${isGuest ? "bg-primary" : "bg-gray-300"}`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200
                ${isGuest ? "translate-x-6" : ""}`}
            />
          </button>
        </div>

        {showAllergyModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-xl w-[90%] max-w-sm">
              <h3 className="font-semibold mb-3">Select Allergies</h3>

              {["lactose", "nuts", "gluten"].map((item) => {
                const active = allergies.includes(item);

                return (
                  <div
                    key={item}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>{item}</span>

                    <button
                      onClick={() => {
                        if (active) {
                          setAllergies(allergies.filter((a) => a !== item));
                        } else {
                          setAllergies([...allergies, item]);
                        }
                      }}
                      className={`w-10 h-5 rounded-full ${
                        active ? "bg-primary" : "bg-gray-300"
                      }`}
                    />
                  </div>
                );
              })}

              <button
                onClick={() => setShowAllergyModal(false)}
                className="mt-4 w-full bg-primary text-white p-2 rounded"
              >
                Done
              </button>
            </div>
          </div>
        )}

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
