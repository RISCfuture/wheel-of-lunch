export type PriceLevel = "PRICE_LEVEL_UNSPECIFIED" |
    "PRICE_LEVEL_FREE" |
    "PRICE_LEVEL_INEXPENSIVE" |
    "PRICE_LEVEL_MODERATE" |
    "PRICE_LEVEL_EXPENSIVE" |
    "PRICE_LEVEL_VERY_EXPENSIVE";

export function priceLevelToNumber(priceLevel: PriceLevel): number | null{
  switch (priceLevel) {
    case "PRICE_LEVEL_UNSPECIFIED":
      return null;
    case "PRICE_LEVEL_FREE":
      return 0;
    case "PRICE_LEVEL_INEXPENSIVE":
      return 1;
    case "PRICE_LEVEL_MODERATE":
      return 2;
    case "PRICE_LEVEL_EXPENSIVE":
      return 3;
    case "PRICE_LEVEL_VERY_EXPENSIVE":
      return 4;
    default:
      return null;
  }
}

export interface Place {
  id: string
  displayName: {
    text: string
  };
  formattedAddress: string;
  rating: number
  priceLevel: PriceLevel;
  googleMapsUri: string;
  regularOpeningHours: {
    openNow: boolean;
  };
  location: Coordinate
  photos: {
    name: string
  }[]
  types: string[]
}

export type Restaurant = Omit<Place, "photos" | "displayName" | "regularOpeningHours"> & {
  distance: number;
  isOpen: boolean;
  photoUrl?: string;
  name: string
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}
