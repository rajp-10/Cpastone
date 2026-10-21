export interface Place {
  id: string;
  name: string;
  category: string;
  description: string;

  image: string;

  latitude: number;
  longitude: number;

  duration: string;

  estimatedCost: number;

  rating: number;

  famousFor: string[];

  bestTime: string;

  tips: string[];
}

export interface Destination {
  id: string;

  name: string;

  state?: string;

  country: string;

  heroImage: string;

  description: string;

  famousFoods: string[];

  famousPlaces: Place[];

  localTransport: string[];

  bestSeason: string;

  airport: string;

  railwayStation: string;

  languages: string[];

  currency: string;
}