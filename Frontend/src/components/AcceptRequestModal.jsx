import { useState, useEffect } from "react";

/**
 * Accept Request Confirmation Modal
 * Shows request details and confirms acceptance with distance calculation
 */
export default function AcceptRequestModal({ isOpen, onClose, onConfirm, request, isProcessing }) {
  const [response, setResponse] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setResponse("");
    }
  }, [isOpen]);

  if (!isOpen || !request) return null;

  const handleConfirm = () => {
    onConfirm(response);
  };

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isProcessing) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white shadow-[0_25px_60px_rgba(241,122,146,0.25)] relative">
        {/* Close Button */}
        {!isProcessing && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-md transition-all hover:bg-gray-200 hover:text-gray-900 hover:scale-110"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#31101e]">
              Accept Blood Request
            </h2>
            <p className="mt-1 text-sm text-[#7c4a5e]">
              Confirm acceptance and provide response message
            </p>
          </div>

          {/* Request Details */}
          <div className="mb-6 space-y-4">
            {/* Blood Group & Units */}
            <div className="rounded-2xl border border-pink-100 bg-pink-50/50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#ff4d6d]">
                Request Details
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[#7c4a5e]">Blood Group</p>
                  <p className="text-lg font-bold text-[#ff4d6d]">
                    {request.bloodGroup}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7c4a5e]">Units Required</p>
                  <p className="text-lg font-bold text-[#31101e]">
                    {request.unitsRequired}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7c4a5e]">Urgency</p>
                  <p className="text-sm font-semibold text-[#ff4d6d]">
                    {request.urgency}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7c4a5e]">Component</p>
                  <p className="text-sm font-medium text-[#5c283a]">
                    {request.component || "WHOLE_BLOOD"}
                  </p>
                </div>
              </div>
            </div>

            {/* Distance Info Notice */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-xs font-semibold text-blue-900">
                    Distance Calculation
                  </p>
                  <p className="mt-1 text-xs text-blue-700">
                    Distance between hospital and blood bank will be calculated and displayed after acceptance.
                  </p>
                </div>
              </div>
            </div>

            {/* Response Message */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#31101e]">
                Response Message <span className="text-[#7c4a5e]">(Optional)</span>
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Enter your response message for the hospital..."
                className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm text-[#31101e] placeholder-[#b89aa8] focus:border-[#ff4d6d] focus:outline-none focus:ring-2 focus:ring-[#ff4d6d]/20"
                rows="3"
                disabled={isProcessing}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="flex-1 rounded-full bg-gradient-to-r from-[#1b8a4b] to-[#22a85a] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(27,138,75,0.3)] transition hover:shadow-[0_8px_25px_rgba(27,138,75,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                "✓ Confirm & Accept"
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 rounded-full border border-pink-200 bg-white px-6 py-3 text-sm font-semibold text-[#5c283a] transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
