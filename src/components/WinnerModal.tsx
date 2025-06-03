"use client";

import { useEffect } from "react";
import { X, Trophy, MapPin, Star, DollarSign, Footprints, Clock, RotateCcw, Navigation } from "lucide-react";
import { Restaurant, priceLevelToNumber } from "@/types";
import { formatRating, formatDistance, formatPriceLevel } from "@/utils/formatters";

interface WinnerModalProps {
  winner: Restaurant | null;
  onClose: () => void;
}

export default function WinnerModal({ winner, onClose }: WinnerModalProps) {
  useEffect(() => {
    if (winner) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [winner]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (winner) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [winner, onClose]);

  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md mx-4 w-full animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Celebration icon */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-bounce">
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Winner announcement */}
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Winner!
          </h2>

          <p className="text-gray-600 mb-6">
            Your lunch destination has been chosen
          </p>

          {/* Restaurant details */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 mb-6 border border-orange-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {winner.name}
            </h3>

            <div className="space-y-2 text-gray-700">
              <p className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>{winner.formattedAddress}</span>
              </p>

              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-orange-600" />
                  <span>{formatRating(winner.rating)}</span>
                </span>

                {winner.priceLevel && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-orange-600" />
                    <span>{formatPriceLevel(priceLevelToNumber(winner.priceLevel) || 1)}</span>
                  </span>
                )}

                <span className="flex items-center gap-1">
                  <Footprints className="w-4 h-4 text-orange-600" />
                  <span>{formatDistance(winner.distance)}</span>
                </span>
              </div>

              <div className="flex items-center justify-center gap-1 mt-3">
                <Clock className={`w-4 h-4 ${winner.isOpen ? "text-green-600" : "text-red-600"}`} />
                <span className={winner.isOpen ? "text-green-600" : "text-red-600"}>
                  {winner.isOpen ? "Currently Open" : "Currently Closed"}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Spin Again
            </button>

            <button
              onClick={() => {
                window.open(winner.googleMapsUri, "_blank");
              }}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
