"use client";

/* ===== WHATSAPP REDIRECT OVERLAY =====
 * Shown after a successful batch save of family members.
 * Redirects the user back to their WhatsApp conversation
 * using the wa.me link, which works on both mobile (opens
 * the WhatsApp app) and desktop (opens WhatsApp Web).
 */

const WA_PHONE = "917893984343";
const WA_LINK = `https://wa.me/${WA_PHONE}`;

export default function WhatsappRedirect({ onClose }: { onClose: () => void }) {
  /* Redirect to WhatsApp — wa.me handles mobile vs desktop automatically */
  const goToWhatsApp = () => {
    window.location.href = WA_LINK;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl text-center space-y-4">
        {/* Success icon */}
        <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto text-2xl">
          ✓
        </div>

        <h2 className="text-lg font-bold">Members Saved!</h2>
        <p className="text-sm text-gray-500">
          All family members have been saved successfully.
        </p>

        {/* Primary action — go back to WhatsApp */}
        <button
          onClick={goToWhatsApp}
          className="w-full bg-green-500 text-white p-3 rounded-xl font-medium hover:bg-green-600 transition active:scale-95"
        >
          Back to WhatsApp
        </button>

        {/* Secondary — stay on the page */}
        <button onClick={onClose} className="w-full p-2 text-sm text-gray-500 hover:text-gray-700 transition">
          Stay here
        </button>
      </div>
    </div>
  );
}
