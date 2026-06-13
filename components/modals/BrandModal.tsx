"use client";

export default function BrandModal({
  item,
  onClose,
  onSelect,
}: any) {
  const brands = item.alternatives || [];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50">

      <div className="bg-white w-full rounded-t-2xl p-5">

        <h2 className="font-semibold mb-4">
          Choose another brand
        </h2>

        <div className="space-y-3">
          {brands.map((b: any, i: number) => (
            <div
              key={i}
              onClick={() => onSelect(b)}
              className="p-3 border rounded-xl cursor-pointer"
            >
              {b.name} – ₹{b.price}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full p-3 text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}