"use client";

import { useState } from "react";
import { MapPin, Loader2, Utensils } from "lucide-react";
import RouletteWheel from "@/components/RouletteWheel";
import { Restaurant } from "@/types";
import { formatRestaurantCount } from "@/utils/formatters";

export default function Home() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        fetchRestaurants(latitude, longitude);
      },
      () => {
        setError("Unable to retrieve your location. Please try again.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const fetchRestaurants = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/restaurants?lat=${lat}&lng=${lng}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch restaurants");
      }
      
      setRestaurants(data.restaurants || []);
    } catch {
      setError("Failed to fetch nearby restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Utensils className="w-10 h-10 text-orange-500" />
            Wheel of Lunch
          </h1>
          <p className="text-gray-600">Spin the wheel to discover your next meal!</p>
        </header>

        <main className="space-y-8">
          {!location && (
            <div className="text-center">
              <button
                onClick={getLocation}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MapPin className="w-5 h-5" />
                )}
                {loading ? "Finding your location..." : "Find Nearby Restaurants"}
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
              {error}
            </div>
          )}

          {location && loading && (
            <div className="text-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                <p className="text-gray-600">Finding nearby restaurants...</p>
              </div>
            </div>
          )}

          {location && restaurants.length > 0 && !loading && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                {formatRestaurantCount(restaurants.length)}
              </p>
              <RouletteWheel restaurants={restaurants} />
            </div>
          )}

          {location && restaurants.length === 0 && !loading && (
            <div className="text-center">
              <p className="text-gray-600">No suitable restaurants found nearby. Try expanding your search area.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}