import React, { useEffect } from "react";
import { X, Tag } from "lucide-react";

interface VinayakaPopupProps {
  show: boolean;
  onClose: () => void;
  onClaim?: () => void;
}

const VinayakaPopup: React.FC<VinayakaPopupProps> = ({
  show,
  onClose,
  onClaim,
}) => {
  // Close popup on ESC key
  useEffect(() => {
    if (!show) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [show, onClose]);

  // Close popup when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!show) return null;

  const handleClaim = () => {
    if (onClaim) onClaim();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl overflow-hidden shadow-2xl max-w-md w-full animate-fade-in-up">
        <div className="absolute -top-8 -right-8 w-20 h-20 bg-orange-200 rounded-full opacity-30"></div>
        <div className="absolute -bottom-6 -left-6 w-14 h-14 bg-amber-300 rounded-full opacity-40"></div>
        <button
          onClick={onClose}
          type="button"
          aria-label="Close popup"
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-orange-100 transition-colors"
        >
          <X size={20} className="text-gray-700" />
        </button>

        {/* Ganesh Image */}
        <div className="relative h-40 bg-gradient-to-r from-amber-200 to-orange-200 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBmaWxsPSIjZjU5NDIzIj48cGF0aCBkPSJNNDQ4IDI1NmMwLTEwNi4xLTg1LjktMTkyLTE5Mi0xOTJTNjQgMTQ5LjkgNjQgMjU2YzAgMTA2LjEgODUuOSAxOTIgMTkyIDE5MnMxOTItODUuOSAxOTItMTkyem0tMzI1LjIgMjUuNGMtMS44LTguNi0zLjItMTcuNS0zLjItMjUuNHMwLjQtMTYuOCAyLTI1LjRjLTguOSA1LjEtMTUgMTIuNS0xOC43IDIxLjQtMy43IDguOS00IDI0LjYgMCAzMy4yIDQgOC42IDEwLjIgMTUuNiAxOC43IDIxLjQgMS42LTguNiAyLTE3LjUgMi0yNS40cy0wLjQtMTYuOC0yLTI1LjR6bTEzNC40IDBjLTEuOC04LjYtMy4yLTE3LjUtMy4yLTI1LjRzMC40LTE2LjggMi0yNS40Yy04LjkgNS4xLTE1IDEyLjUtMTguNyAyMS40LTMuNyA4LjktNCAyNC42IDAgMzMuMiA0IDguNiAxMC4yIDE1LjYgMTguNyAyMS40IDEuNi04LjYgMi0xNy41IDItMjUuNHMtMC40LTE2LjgtMi0yNS40em0xMzQuNCAwYy0xLjgtOC42LTMuMi0xNy41LTMuMi0yNS40czAuNC0xNi44IDItMjUuNGMtOC45IDUuMS0xNSAxMi41LTE4LjcgMjEuNC0zLjcgOC45LTQgMjQuNiAwIDMzLjIgNCA4LjYgMTAuMiAxNS42IDE4LjcgMjEuNCAxLjYtOC42IDItMTcuNSAyLTI1LjRzLTAuNC0xNi44LTItMjUuNHptLTY3LjIgMTI4LjJjLTIzLjkgMC00My4zLTE5LjQtNDMuMy00My4zcy0xOS40LTQzLjMtNDMuMy00My4zLTQzLjMgMTkuNC00My4zIDQzLjMgMTkuNCA0My4zIDQzLjMgNDMuM2M3LjEgMCAxMy45LTEuNyAyMC0zLjUgMi4zIDIuMyA0LjkgNC40IDcuOCA2LjMgMTEuNCA3LjQgMjUuMyAxMS44IDQwLjIgMTEuOHMyOC44LTQuNCA0MC4yLTExLjhjMi45LTEuOSA1LjUtNCA3LjgtNi4zIDYuMSAxLjggMTIuOSAzLjUgMjAgMy41eiIvPjwvc3ZnPg==')] opacity-20"></div>
          <img
            src="https://static.vecteezy.com/system/resources/previews/012/005/594/non_2x/lord-ganesha-illustration-png.png"
            alt="Lord Ganesh"
            className="h-32 w-32 object-contain"
          />
        </div>

        <div className="relative z-10 p-8 text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full mb-4">
            <Tag size={16} className="mr-2" />
            <span className="font-bold">LIMITED TIME OFFER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">
            Vinayaka Chavithi – Special Lunch Menu Offer
          </h2>
          <p className="text-gray-700 mb-6">
            Celebrate the festival with our exclusive lunch menu offer.
            <br />
            Enjoy authentic flavors and festive vibes!
          </p>
          <button
            onClick={handleClaim}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Claim This Offer
          </button>
          <p className="text-xs text-center text-gray-500 mt-4">
            * This offer is exclusive for Vinayaka Chavithi. Treat your family!
          </p>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px) scale(0.95);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default VinayakaPopup;
