import {NextRequest, NextResponse} from "next/server";
import {Coordinate, Place, priceLevelToNumber, Restaurant} from "@/types";
import { formatNumber } from "@/utils/formatters";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

function placeToRestaurant(place: Place, distance: number, isOpen: boolean): Restaurant {
  return {
    ...place,
    name: place.displayName.text,
    distance: Math.round(distance),
    isOpen,
    photoUrl: place.photos?.[0]
        ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxWidthPx=400&key=${GOOGLE_PLACES_API_KEY}`
        : undefined,
  };
}

export async function GET(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
      return NextResponse.json(
          {error: "Latitude and longitude are required"},
          {status: 400}
      );
    }
    const location = {latitude: parseFloat(lat), longitude: parseFloat(lng)}

    if (!GOOGLE_PLACES_API_KEY) {
      // Fallback to mock data for development
      const mockRestaurants = generateMockRestaurants();
      return NextResponse.json({restaurants: mockRestaurants});
    }

    const placesResponse = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.price_level,places.googleMapsUri,places.regularOpeningHours.openNow,places.location,places.photos.name,places.types"
      },
      body: JSON.stringify({
        languageCode: "en",
        includedTypes: ["restaurant"],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: location,
            radius: 1000.0
          }
        }
      })
    });
    const placesData = await placesResponse.json();

    if (!placesData.places) {
      throw new Error("Failed to fetch places data");
    }

    // Filter and process restaurants
    const restaurants: Restaurant[] = [];

    for (const place of (placesData.places as Place[])) {
      // Skip restaurants without required data
      if (!place.displayName || !place.formattedAddress || !place.location) continue;

      // Skip restaurants without opening hours data
      if (!place.regularOpeningHours) continue;

      const priceLevel = priceLevelToNumber(place.priceLevel)
      // Skip if price level is too high (we want $$ or less, which is 1-2)
      if (priceLevel && priceLevel > 2) continue;

      const isOpen = place.regularOpeningHours.openNow;

        // Calculate approximate walking distance (straight line * 1.3 for streets)
        const distance = calculateDistance(
            location,
            place.location
        ) * 1.3;

        // Only include walkable restaurants (under 1km) that are currently open
        if (distance <= 1000 && isOpen) {
          restaurants.push(placeToRestaurant(place, distance, isOpen));
        }
    }

    // Shuffle the restaurants and limit to 10
    const shuffledRestaurants = restaurants.sort(() => Math.random() - 0.5);
    const finalRestaurants = shuffledRestaurants.slice(0, 10);

    return NextResponse.json({restaurants: finalRestaurants});
  } catch (error) {
    console.error("Error fetching restaurants:", error);

    // Return mock data as fallback
    const mockRestaurants = generateMockRestaurants();
    return NextResponse.json({restaurants: mockRestaurants});
  }
}

function calculateDistance(pos1: Coordinate, pos2: Coordinate): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = pos1.latitude * Math.PI / 180;
  const φ2 = pos2.latitude * Math.PI / 180;
  const Δφ = (pos2.latitude - pos1.latitude) * Math.PI / 180;
  const Δλ = (pos2.longitude - pos1.longitude) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function generateMockRestaurants(): Restaurant[] {
  const mockData = [
    "Joe's Pizza", "Burger Palace", "Taco Bell", "Subway", "Thai Garden",
    "Italian Bistro", "Chinese Express", "Indian Spice", "Mediterranean Café", "Sushi Roll",
    "Corner Deli", "Fresh Salads", "Noodle House", "Sandwich Shop", "Grill & Bar",
    "Coffee Bistro", "Wrap Station", "Soup Kitchen", "Bakery Café", "Food Truck"
  ];

  // Generate more restaurants than needed, filter to only open ones, then shuffle and slice
  const allRestaurants: Restaurant[] = mockData.map((name, index) => ({
    id: `mock-${index}`,
    name,
    formattedAddress: `${formatNumber(100 + index * 10)} Main St`,
    rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10, // Always provide a rating
    priceLevel: "PRICE_LEVEL_INEXPENSIVE",
    distance: Math.floor(Math.random() * 800) + 100,
    isOpen: Math.random() > 0.25, // 75% chance of being open
    types: ["restaurant", "food", "establishment"],
    googleMapsUri: "https://maps.google.com/?q=" + encodeURIComponent(name),
    location: {
      latitude: 40.7128 + (Math.random() - 0.5) * 0.1, // Random offset around NYC
      longitude: -74.0060 + (Math.random() - 0.5) * 0.1 // Random offset around NYC
    }
  }));

  // Filter to only open restaurants, shuffle, and limit to 10
  const openRestaurants = allRestaurants.filter(r => r.isOpen);
  const shuffledRestaurants = openRestaurants.sort(() => Math.random() - 0.5);
  return shuffledRestaurants.slice(0, 10);
}
