import type { BudgetBreakdown, DayItinerary, Hotel, PackingItem } from '../store/useStore';

export interface DatabaseTrip {
  id: number;
  title: string;
  destination: string;
  budget: number;
  travelers: number;
  start_date: string;
  end_date: string;
  itinerary: string | null;
  created_at: string;
}

export interface GeneratedTripResponse {
  trip: DatabaseTrip;
  itinerary: DayItinerary[];
  hotels: Hotel[];
  packingList: PackingItem[];
  budgetBreakdown: BudgetBreakdown;
}
