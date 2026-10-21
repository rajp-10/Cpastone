import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  MapPin, Users, DollarSign, Calendar, Plane, Sparkles,
  ChevronRight, ChevronLeft, CheckCircle2, Loader2,
  TrendingUp, Clock, Globe
} from 'lucide-react';
import { useStore } from '../store/useStore';
import API from "../services/api";
import type { GeneratedTripResponse } from '../services/tripService';
import { getWeatherData } from '../services/weatherService';
import { INTEREST_OPTIONS, TRANSPORT_OPTIONS, CURRENCIES, POPULAR_DESTINATIONS } from '../data/destinations';
import { buildDestinationFallbackItinerary, enrichItineraryWithKnownPlaces, findKnownDestination } from '../data/placeKnowledge';
import toast from 'react-hot-toast';

const DEMO_ITINERARY_GOA = {
  itinerary: [
    {
      day: 1,
      date: new Date().toISOString().split('T')[0],
      theme: "Arrival & North Goa Beaches",
      morning: [
        {
          name: "Calangute Beach",
          description: "Queen of Beaches — the largest and most popular beach in North Goa with golden sands and water sports.",
          duration: "2 hours",
          cost: 500,
          rating: 4.3,
          image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
          location: "Calangute, North Goa",
          lat: 15.5440,
          lng: 73.7554,
          type: "beach"
        },
        {
          name: "Baga Beach",
          description: "Famous for water sports, beach shacks, and vibrant nightlife. Try parasailing and jet skiing.",
          duration: "1.5 hours",
          cost: 1500,
          rating: 4.4,
          image: "https://images.unsplash.com/photo-1587922546307-776227941871?w=800&q=80",
          location: "Baga, North Goa",
          lat: 15.5557,
          lng: 73.7516,
          type: "beach"
        }
      ],
      afternoon: [
        {
          name: "Fort Aguada",
          description: "17th-century Portuguese fort with a lighthouse offering panoramic views of the Arabian Sea.",
          duration: "2 hours",
          cost: 100,
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
          location: "Candolim, North Goa",
          lat: 15.4937,
          lng: 73.7701,
          type: "historical"
        },
        {
          name: "Anjuna Flea Market",
          description: "Iconic Wednesday flea market with handicrafts, clothes, jewelry, and local artifacts.",
          duration: "2 hours",
          cost: 0,
          rating: 4.2,
          image: "https://images.unsplash.com/photo-1582972236019-ea4af5ffe587?w=800&q=80",
          location: "Anjuna, North Goa",
          lat: 15.5800,
          lng: 73.7400,
          type: "shopping"
        }
      ],
      evening: [
        {
          name: "Tito's Lane, Baga",
          description: "Goa's famous nightlife street with bars, clubs, and live music venues.",
          duration: "3 hours",
          cost: 1200,
          rating: 4.1,
          image: "https://images.unsplash.com/photo-1560877098-e7f3b8a2c86e?w=800&q=80",
          location: "Tito's Lane, Baga",
          lat: 15.5550,
          lng: 73.7520,
          type: "nightlife"
        }
      ],
      restaurants: [
        {
          name: "Infantaria Bakery & Restaurant",
          cuisine: "Goan, Portuguese",
          priceRange: "₹600-1000 per person",
          rating: 4.6,
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
          mustTry: "Prawn Balchão & Bebinca",
          location: "Calangute-Baga Road",
          lat: 15.5450,
          lng: 73.7540
        },
        {
          name: "Britto's Restaurant",
          cuisine: "Goan Seafood",
          priceRange: "₹800-1500 per person",
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80",
          mustTry: "Goan Fish Curry & King Prawns",
          location: "Baga Beach Road",
          lat: 15.5555,
          lng: 73.7518
        }
      ],
      dailyExpense: 4500,
      tips: ["Carry sunscreen SPF 50+", "Bargain at flea markets", "Avoid peak hours at popular beaches"],
      localTransport: "Rent a scooter (₹300-400/day) or use local taxis"
    },
    {
      day: 2,
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      theme: "Old Goa Heritage & South Goa",
      morning: [
        {
          name: "Basilica of Bom Jesus",
          description: "UNESCO World Heritage Site housing the mortal remains of St. Francis Xavier. Built in 1605, a masterpiece of Baroque architecture.",
          duration: "1.5 hours",
          cost: 0,
          rating: 4.7,
          image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80",
          location: "Old Goa",
          lat: 15.5009,
          lng: 73.9116,
          type: "historical"
        },
        {
          name: "Se Cathedral",
          description: "Largest church in Asia, dedicated to St. Catherine. Remarkable Portuguese Baroque architecture.",
          duration: "1 hour",
          cost: 0,
          rating: 4.6,
          image: "https://images.unsplash.com/photo-1582996226989-7feea21a9a68?w=800&q=80",
          location: "Old Goa",
          lat: 15.5019,
          lng: 73.9108,
          type: "historical"
        }
      ],
      afternoon: [
        {
          name: "Colva Beach",
          description: "Pristine 2.4 km long beach with white sand and clear waters, perfect for swimming and relaxation.",
          duration: "2.5 hours",
          cost: 200,
          rating: 4.4,
          image: "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=800&q=80",
          location: "Colva, South Goa",
          lat: 15.2793,
          lng: 73.9189,
          type: "beach"
        },
        {
          name: "Dudhsagar Falls",
          description: "One of India's tallest waterfalls (310m) — a spectacular sight surrounded by thick forests.",
          duration: "3 hours",
          cost: 800,
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800&q=80",
          location: "Mollem, South Goa",
          lat: 15.3140,
          lng: 74.3144,
          type: "nature"
        }
      ],
      evening: [
        {
          name: "Panjim City Walk",
          description: "Explore the colorful Latin Quarter (Fontainhas) with Portuguese-era heritage houses and local cafes.",
          duration: "2 hours",
          cost: 0,
          rating: 4.3,
          image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
          location: "Fontainhas, Panjim",
          lat: 15.4989,
          lng: 73.8278,
          type: "culture"
        }
      ],
      restaurants: [
        {
          name: "Viva Panjim",
          cuisine: "Authentic Goan",
          priceRange: "₹500-900 per person",
          rating: 4.7,
          image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80",
          mustTry: "Pork Vindaloo & Feni Cocktail",
          location: "Fontainhas, Panjim",
          lat: 15.4985,
          lng: 73.8271
        }
      ],
      dailyExpense: 3800,
      tips: ["Book Dudhsagar jeep safari in advance", "Best time for Old Goa sightseeing: 9am-12pm", "Try local Goan feni responsibly"],
      localTransport: "Hire a day taxi (₹1500-2500 for Old Goa + South Goa tour)"
    }
  ],
  hotels: [
    {
      name: "Novotel Goa Candolim",
      stars: 5,
      pricePerNight: 8500,
      currency: "INR",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      location: "Candolim Beach Road, North Goa",
      amenities: ["Pool", "WiFi", "Spa", "Restaurant", "Bar", "Beach Access", "AC", "Gym"],
      description: "Luxury beachside resort with stunning Arabian Sea views, infinity pool, and world-class amenities.",
      bookingUrl: "https://booking.com",
      lat: 15.5102,
      lng: 73.7654
    },
    {
      name: "Vivanta Goa, Panaji",
      stars: 5,
      pricePerNight: 12000,
      currency: "INR",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
      location: "Panaji, Goa",
      amenities: ["Pool", "WiFi", "Spa", "Fine Dining", "Bar", "Yoga", "Gym", "Airport Transfer"],
      description: "Award-winning luxury hotel in the heart of Panaji with exceptional dining and wellness facilities.",
      bookingUrl: "https://booking.com",
      lat: 15.4990,
      lng: 73.8278
    },
    {
      name: "The Lalit Golf & Spa Resort",
      stars: 5,
      pricePerNight: 15000,
      currency: "INR",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      location: "Canacona, South Goa",
      amenities: ["Golf Course", "Private Beach", "Spa", "Multiple Restaurants", "Pool", "Tennis"],
      description: "Opulent beachfront resort surrounded by a coconut grove with a private beach and championship golf course.",
      bookingUrl: "https://booking.com",
      lat: 15.0097,
      lng: 74.0021
    },
    {
      name: "Zostel Goa (Budget Option)",
      stars: 2,
      pricePerNight: 800,
      currency: "INR",
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
      location: "Anjuna, North Goa",
      amenities: ["WiFi", "Common Kitchen", "Social Events", "Lockers", "AC Rooms"],
      description: "Popular backpacker hostel in Anjuna with great community vibe, social events, and budget-friendly rates.",
      bookingUrl: "https://zostel.com",
      lat: 15.5800,
      lng: 73.7400
    }
  ],
  packingList: [
    { category: "Clothing", items: ["Swimwear (2-3 sets)", "Light cotton T-shirts", "Beach shorts/skirts", "Evening outfit", "Flip flops", "Comfortable sandals", "Light rain jacket"], icon: "👕" },
    { category: "Beach Essentials", items: ["Sunscreen SPF 50+", "Beach towel", "Sunglasses", "Wide-brim hat", "Waterproof bag", "Aloe vera gel"], icon: "🏖️" },
    { category: "Documents", items: ["Government ID (Aadhaar/Passport)", "Hotel booking printouts", "Travel insurance", "Cash in small denominations", "Emergency contacts"], icon: "📄" },
    { category: "Electronics", items: ["Smartphone + charger", "Waterproof phone case", "Camera", "Power bank", "Universal adapter"], icon: "📱" },
    { category: "Health & Safety", items: ["ORS sachets (for heat)", "Insect repellent", "Antacids", "Band-aids", "Hand sanitizer", "Prescription medications"], icon: "💊" },
    { category: "Local Tips", items: ["Download offline Goa map", "Save emergency numbers: 100, 108", "Keep hotel card for taxis", "Download PhonePe/GPay for payments"], icon: "💡" },
  ],
  budgetBreakdown: {
    hotel: 20000,
    food: 12000,
    transport: 8000,
    activities: 6000,
    shopping: 5000,
    miscellaneous: 3000,
    total: 54000,
    currency: "INR",
    alternatives: [
      { category: "Hotel", original: 20000, cheaper: 6000, tip: "Stay in a guesthouse in Calangute or a hostel in Anjuna" },
      { category: "Food", original: 12000, cheaper: 6000, tip: "Eat at local beach shacks and chai stalls instead of restaurants" },
      { category: "Transport", original: 8000, cheaper: 3500, tip: "Rent a scooter instead of taxis for full flexibility" },
    ]
  }
};

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, isAuthenticated, setCurrentTrip, setGeneratedItinerary, setGeneratedHotels,
    setWeatherData, setPackingList, setBudgetBreakdown, setIsGenerating, saveTrip } = useStore();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    destination: '',
    travelers: 2,
    budget: 25000,
    currency: 'INR',
    days: 5,
    startDate: new Date(),
    endDate: new Date(Date.now() + 5 * 86400000),
    transport: 'flight',
    interests: [] as string[],
    language: 'en',
  });

  const calendarProps = {
    todayButton: 'Today',
    fixedHeight: true,
    showPopperArrow: false,
    calendarClassName: 'trip-calendar',
    dateFormat: 'dd/MM/yyyy',
    renderCustomHeader: ({ date, decreaseMonth, increaseMonth, changeYear, prevMonthButtonDisabled, nextMonthButtonDisabled }: {
      date: Date;
      decreaseMonth: () => void;
      increaseMonth: () => void;
      changeYear: (year: number) => void;
      prevMonthButtonDisabled: boolean;
      nextMonthButtonDisabled: boolean;
    }) => (
      <div className="trip-calendar-header">
        <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled} aria-label="Previous month">
          <ChevronLeft size={16} />
        </button>
        <div className="trip-calendar-title">
          <strong>{date.toLocaleDateString('en-US', { month: 'long' })}</strong>
          <select
            value={date.getFullYear()}
            onChange={(event) => changeYear(Number(event.target.value))}
            aria-label="Select year"
          >
            {Array.from({ length: 11 }, (_, index) => new Date().getFullYear() + index).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled} aria-label="Next month">
          <ChevronRight size={16} />
        </button>
      </div>
    ),
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const toggleInterest = (id: string) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id],
    }));
  };

  const handleGenerate = async () => {
    if (!form.destination.trim()) {
      toast.error('Please enter a destination!');
      return;
    }
    if (form.interests.length === 0) {
      toast.error('Please select at least one interest!');
      return;
    }

    setLoading(true);
    setIsGenerating(true);

    const toastId = toast.loading('🤖 AI is crafting your perfect itinerary...');

    try {
      // Fetch weather data in parallel
      const weatherPromise = getWeatherData(form.destination, form.days);
      
      let itineraryData: Omit<GeneratedTripResponse, 'trip'>;
      let persistedTrip: GeneratedTripResponse['trip'] | undefined;
      
      try {
        // Try Gemini AI first
        const token = localStorage.getItem("token");

const response = await API.post<GeneratedTripResponse>(
    "/trips/",
    {
        title: `${form.destination} Trip`,
destination: form.destination,
budget: form.budget,
travelers: form.travelers,
start_date: form.startDate.toISOString().split("T")[0],
end_date: new Date(
    form.startDate.getTime() + form.days * 24 * 60 * 60 * 1000
).toISOString().split("T")[0]
    },
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
);

        ({ trip: persistedTrip, ...itineraryData } = response.data);
      } catch (aiError) {
        console.warn('Using demo data:', aiError);
        // Use demo data if Gemini fails (no API key or quota exceeded)
        itineraryData = buildDestinationFallbackItinerary(
          form.destination,
          form.days,
          form.startDate.toISOString().split('T')[0],
          form.budget,
          form.currency,
        );
        toast.dismiss(toastId);
        toast.loading('Using verified local places. Add a Gemini API key for full AI generation.', { id: toastId, duration: 3000 });
      }

      const weatherData = await weatherPromise;

      // Store in state
      setGeneratedItinerary(itineraryData.itinerary || []);
      setGeneratedHotels(itineraryData.hotels || []);
      setWeatherData(weatherData);
      setPackingList(itineraryData.packingList || []);
      setBudgetBreakdown(itineraryData.budgetBreakdown || null);

      const knownDestination = findKnownDestination(form.destination);
      const tripData = {
        id: persistedTrip ? String(persistedTrip.id) : Date.now().toString(),
        userId: 'user',
        destination: form.destination,
        country: knownDestination?.country || 'India',
        travelers: form.travelers,
        budget: form.budget,
        currency: form.currency,
        days: form.days,
        startDate: form.startDate.toISOString().split('T')[0],
        endDate: new Date(form.startDate.getTime() + form.days * 86400000).toISOString().split('T')[0],
        transport: form.transport,
        interests: form.interests,
        itinerary: itineraryData.itinerary || [],
        hotels: itineraryData.hotels || [],
        weather: weatherData,
        packingList: itineraryData.packingList || [],
        totalCost: itineraryData.budgetBreakdown?.total || form.budget,
        createdAt: persistedTrip?.created_at || new Date().toISOString(),
      };

      setCurrentTrip(tripData);
      saveTrip(tripData as any);

      toast.dismiss(toastId);
      toast.success('✅ Your AI itinerary is ready! Exploring now...', { duration: 3000 });

      navigate('/itinerary');
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  const updateDuration = (days: number) => {
    setForm(prev => ({
      ...prev,
      days,
      endDate: new Date(prev.startDate.getTime() + days * 86400000),
    }));
  };

  const popularDests = POPULAR_DESTINATIONS.slice(0, 8);

  return (
    <div className={`min-h-screen pt-16 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="bg-linear-to-r from-teal-700 via-emerald-600 to-orange-500 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm mb-4"
          >
            <Sparkles size={14} className="text-yellow-400" />
            AI-Powered Trip Planner
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-white font-display mb-3"
          >
            {t('dashboard.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg"
          >
            {t('dashboard.subtitle')}
          </motion.p>

          {/* Step indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-6"
          >
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s ? 'bg-white text-indigo-600' : 'bg-white/20 text-white'
                }`}>
                  {step > s ? <CheckCircle2 size={16} /> : s}
                </div>
                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-white' : 'bg-white/30'}`} />}
              </div>
            ))}
          </motion.div>
          <div className="flex justify-center gap-16 mt-2 text-white/60 text-xs">
            <span>Destination</span>
            <span>Preferences</span>
            <span>Interests</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Destination & Basics */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <MapPin className="text-indigo-500" size={22} />
                  Where do you want to go?
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                      {t('dashboard.destination')} *
                    </label>
                    <input
                      type="text"
                      value={form.destination}
                      onChange={e => setForm({ ...form, destination: e.target.value })}
                      placeholder={t('dashboard.destination_placeholder')}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>

                  {/* Quick destination suggestions */}
                  <div>
                    <p className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                      🔥 Popular Destinations:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Goa', 'Rajasthan', 'Kerala', 'Manali', 'Agra', 'Varanasi', 'Andaman', 'Bali', 'Dubai', 'Singapore'].map(dest => (
                        <button
                          key={dest}
                          onClick={() => setForm({ ...form, destination: dest + (dest === 'Goa' || dest === 'Rajasthan' || dest === 'Kerala' || dest === 'Manali' || dest === 'Agra' || dest === 'Varanasi' ? ', India' : '') })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                            form.destination.includes(dest)
                              ? 'bg-indigo-600 text-white'
                              : theme === 'dark'
                              ? 'bg-slate-700 text-slate-300 hover:bg-indigo-900 hover:text-indigo-300'
                              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                          }`}
                        >
                          {dest}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <TrendingUp className="text-indigo-500" size={22} />
                  Trip Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Travelers */}
                  <div>
                    <label className={`text-sm font-medium mb-2 flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                      <Users size={15} />
                      {t('dashboard.travelers')}
                    </label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setForm(prev => ({ ...prev, travelers: Math.max(1, prev.travelers - 1) }))}
                        className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 font-bold text-xl flex items-center justify-center hover:bg-indigo-200 transition-colors">−</button>
                      <span className={`text-xl font-bold w-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{form.travelers}</span>
                      <button onClick={() => setForm(prev => ({ ...prev, travelers: Math.min(20, prev.travelers + 1) }))}
                        className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 font-bold text-xl flex items-center justify-center hover:bg-indigo-200 transition-colors">+</button>
                    </div>
                  </div>

                  {/* Days */}
                  <div>
                    <label className={`text-sm font-medium mb-2 flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                      <Clock size={15} />
                      {t('dashboard.days')}
                    </label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateDuration(Math.max(1, form.days - 1))}
                        className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 font-bold text-xl flex items-center justify-center hover:bg-purple-200 transition-colors">−</button>
                      <span className={`text-xl font-bold w-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{form.days}</span>
                      <button onClick={() => updateDuration(Math.min(30, form.days + 1))}
                        className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 font-bold text-xl flex items-center justify-center hover:bg-purple-200 transition-colors">+</button>
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className={`text-sm font-medium mb-2 flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                      <DollarSign size={15} />
                      {t('dashboard.budget')}
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={form.currency}
                        onChange={e => setForm({ ...form, currency: e.target.value })}
                        className={`px-3 py-2.5 rounded-xl border text-sm ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                      >
                        {CURRENCIES.map(c => (
                          <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={form.budget}
                        onChange={e => setForm({ ...form, budget: parseInt(e.target.value) || 0 })}
                        className={`flex-1 px-3 py-2.5 rounded-xl border text-sm ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                        min={0}
                      />
                    </div>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className={`text-sm font-medium mb-2 flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                      <Calendar size={15} />
                      {t('dashboard.start_date')}
                    </label>
                    <DatePicker
                      selected={form.startDate}
                      onChange={(date) => {
                        const startDate = date ? new Date(date.setHours(0, 0, 0, 0)) : new Date();
                        setForm(prev => ({
                          ...prev,
                          startDate,
                          endDate: new Date(startDate.getTime() + prev.days * 86400000),
                        }));
                      }}
                      minDate={new Date()}
                      className={`w-full px-3 py-2.5 rounded-xl border text-sm ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                      {...calendarProps}
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className={`text-sm font-medium mb-2 flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                      <Calendar size={15} />
                      End Date
                    </label>
                    <DatePicker
                      selected={form.endDate}
                      onChange={(date) => {
                        if (!date) return;
                        const endDate = new Date(date.setHours(0, 0, 0, 0));
                        const days = Math.max(1, Math.min(30, Math.round((endDate.getTime() - form.startDate.getTime()) / 86400000)));
                        setForm(prev => ({ ...prev, endDate, days }));
                      }}
                      minDate={form.startDate}
                      maxDate={new Date(form.startDate.getTime() + 30 * 86400000)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-sm ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                      {...calendarProps}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (!form.destination.trim()) { toast.error('Please enter a destination!'); return; }
                    setStep(2);
                  }}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 text-white font-bold shadow-lg hover:shadow-teal-500/30"
                >
                  Continue
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Transport & Preferences */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <Plane className="text-indigo-500" size={22} />
                  {t('dashboard.transport')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TRANSPORT_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setForm({ ...form, transport: opt.id })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        form.transport === opt.id
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                          : theme === 'dark'
                          ? 'border-slate-700 hover:border-slate-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{opt.icon}</div>
                      <div className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{opt.label}</div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{opt.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trip Summary Preview */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-indigo-50 border-indigo-100'}`}>
                <h3 className={`font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-indigo-900'}`}>
                  <Globe size={18} />
                  Trip Summary
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Destination', value: form.destination || 'Not set', icon: '📍' },
                    { label: 'Travelers', value: `${form.travelers} people`, icon: '👥' },
                    { label: 'Duration', value: `${form.days} days`, icon: '📅' },
                    { label: 'Budget', value: `${CURRENCIES.find(c => c.code === form.currency)?.symbol}${form.budget.toLocaleString()}`, icon: '💰' },
                  ].map(item => (
                    <div key={item.label} className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-slate-700' : 'bg-white'}`}>
                      <div className="text-xl mb-1">{item.icon}</div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{item.label}</div>
                      <div className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-xl border font-medium ${
                    theme === 'dark' ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>
                  <ChevronLeft size={18} />
                  Back
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(3)}
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 text-white font-bold shadow-lg"
                >
                  Continue
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {t('dashboard.interests')}
                </h2>
                <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                  Select all that apply — AI will tailor your itinerary accordingly
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {INTEREST_OPTIONS.map(interest => (
                    <motion.button
                      key={interest.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggleInterest(interest.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                        form.interests.includes(interest.id)
                          ? `border-transpaarent bg-linear-to-r ${interest.color} text-white shadow-lg`
                          : theme === 'dark'
                          ? 'border-slate-700 hover:border-slate-500 text-slate-300'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="text-2xl mb-1">{interest.icon}</div>
                      <div className="font-semibold text-sm">{interest.label}</div>
                      {form.interests.includes(interest.id) && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 size={16} className="text-white" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
                <p className={`text-xs mt-3 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>
                  {form.interests.length} selected
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-xl border font-medium ${
                    theme === 'dark' ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>
                  <ChevronLeft size={18} />
                  Back
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 text-white font-bold text-lg shadow-xl hover:shadow-teal-500/30 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 size={22} className="animate-spin" />
                      {t('dashboard.generating')}
                    </>
                  ) : (
                    <>
                      <Sparkles size={22} />
                      {t('dashboard.generate')}
                      <ChevronRight size={20} />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
