export interface KnownPlace {
  name: string;
  location: string;
  lat: number;
  lng: number;
  type:
    | "beach"
    | "historical"
    | "nature"
    | "culture"
    | "shopping"
    | "wildlife"
    | "religious"
    | "adventure";
  description: string;
  estimatedCost?: number;
  duration?: string;
  image?: string;
}

export interface KnownRestaurant {
  name: string;
  cuisine: string;
  mustTry: string;
  location: string;
  lat: number;
  lng: number;
  rating?: number;
  priceRange?: string;
}

export interface Hotel {
  name: string;
  stars: number;
  pricePerNight: number;
  currency: string;
  rating: number;
  image: string;
  location: string;
  amenities: string[];
  description: string;
  bookingUrl?: string;
  lat: number;
  lng: number;
}

export interface KnownDestination {
  key: string;
  label: string;
  country: string;
  currency: string;
  places: KnownPlace[];
  restaurants: KnownRestaurant[];
  hotels: Hotel[];
}