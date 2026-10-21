import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  language: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  userId: string;
  destination: string;
  country: string;
  travelers: number;
  budget: number;
  currency: string;
  days: number;
  startDate: string;
  endDate: string;
  transport: string;
  interests: string[];
  itinerary: DayItinerary[];
  hotels: Hotel[];
  weather: WeatherData | null;
  packingList: PackingItem[];
  totalCost: number;
  createdAt: string;
  lat?: number;
  lng?: number;
}

export interface DayItinerary {
  day: number;
  date: string;
  theme: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
  restaurants: Restaurant[];
  dailyExpense: number;
  tips: string[];
  localTransport: string;
}

export interface Activity {
  name: string;
  description: string;
  duration: string;
  cost: number;
  rating: number;
  image: string;
  location: string;
  lat?: number;
  lng?: number;
  type: string;
}

export interface Restaurant {
  name: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  image: string;
  mustTry: string;
  location: string;
  lat?: number;
  lng?: number;
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
  bookingUrl: string;
  lat?: number;
  lng?: number;
}

export interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    description: string;
    icon: string;
    windSpeed: number;
    visibility: number;
  };
  forecast: ForecastDay[];
  packingSuggestions: string[];
  travelTip: string;
}

export interface ForecastDay {
  date: string;
  high: number;
  low: number;
  description: string;
  icon: string;
  precipitation: number;
}

export interface PackingItem {
  category: string;
  items: string[];
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface BudgetBreakdown {
  hotel: number;
  food: number;
  transport: number;
  activities: number;
  shopping: number;
  miscellaneous: number;
  total: number;
  currency: string;
  alternatives: BudgetAlternative[];
}

export interface BudgetAlternative {
  category: string;
  original: number;
  cheaper: number;
  tip: string;
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  
  // Theme
  theme: 'light' | 'dark';
  
  // Language
  language: string;
  
  // Current trip planning
  currentTrip: Partial<Trip> | null;
  generatedItinerary: DayItinerary[] | null;
  generatedHotels: Hotel[] | null;
  weatherData: WeatherData | null;
  packingList: PackingItem[] | null;
  budgetBreakdown: BudgetBreakdown | null;
  
  // Trip history
  savedTrips: Trip[];
  
  // Chat
  chatMessages: ChatMessage[];
  
  // Loading states
  isGenerating: boolean;
  isLoadingWeather: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  toggleTheme: () => void;
  setLanguage: (lang: string) => void;
  setCurrentTrip: (trip: Partial<Trip> | null) => void;
  setGeneratedItinerary: (itinerary: DayItinerary[] | null) => void;
  setGeneratedHotels: (hotels: Hotel[] | null) => void;
  setWeatherData: (data: WeatherData | null) => void;
  setPackingList: (list: PackingItem[] | null) => void;
  setBudgetBreakdown: (budget: BudgetBreakdown | null) => void;
  saveTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  setIsGenerating: (v: boolean) => void;
  setIsLoadingWeather: (v: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      theme: 'light',
      language: 'en',
      currentTrip: null,
      generatedItinerary: null,
      generatedHotels: null,
      weatherData: null,
      packingList: null,
      budgetBreakdown: null,
      savedTrips: [],
      chatMessages: [],
      isGenerating: false,
      isLoadingWeather: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      logout: () => set({
        user: null,
        isAuthenticated: false,
        token: null,
        currentTrip: null,
        generatedItinerary: null,
        generatedHotels: null,
        weatherData: null,
        packingList: null,
        budgetBreakdown: null,
        chatMessages: [],
      }),
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
      setLanguage: (language) => set({ language }),
      setCurrentTrip: (trip) => set({ currentTrip: trip }),
      setGeneratedItinerary: (itinerary) => set({ generatedItinerary: itinerary }),
      setGeneratedHotels: (hotels) => set({ generatedHotels: hotels }),
      setWeatherData: (data) => set({ weatherData: data }),
      setPackingList: (list) => set({ packingList: list }),
      setBudgetBreakdown: (budget) => set({ budgetBreakdown: budget }),
      saveTrip: (trip) => set((state) => ({
        savedTrips: [trip, ...state.savedTrips.filter(t => t.id !== trip.id)]
      })),
      deleteTrip: (id) => set((state) => ({
        savedTrips: state.savedTrips.filter(t => t.id !== id)
      })),
      addChatMessage: (message) => set((state) => ({
        chatMessages: [...state.chatMessages, message]
      })),
      clearChat: () => set({ chatMessages: [] }),
      setIsGenerating: (v) => set({ isGenerating: v }),
      setIsLoadingWeather: (v) => set({ isLoadingWeather: v }),
    }),
    {
      name: 'travel-planner-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        theme: state.theme,
        language: state.language,
        savedTrips: state.savedTrips,
        chatMessages: state.chatMessages,
      }),
    }
  )
);
