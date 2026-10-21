import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Star, Clock, DollarSign, ChevronDown, ChevronUp,
  Download, Map, Hotel, Cloud, Package, Utensils, Navigation,
  AlertCircle, Sun, Sunrise, Sunset, ArrowLeft, Share2,
  ExternalLink, ChevronRight
} from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import { generatePDF } from '../services/pdfService';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createCustomIcon(color: string, emoji: string) {
  return L.divIcon({
    html: `<div style="background:${color};width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
      <span style="transform:rotate(45deg);font-size:16px;">${emoji}</span>
    </div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

const SECTION_COLORS = {
  hotel: '#6366f1',
  morning: '#f59e0b',
  afternoon: '#10b981',
  evening: '#8b5cf6',
  restaurant: '#ef4444',
};

function MapAutoView({
  center,
  markers,
}: {
  center?: [number, number];
  markers: Array<{ lat: number; lng: number }>;
}) {
  const map = useMap();
  const markerKey = markers.map(marker => `${marker.lat},${marker.lng}`).join('|');

  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 0.8 });
      return;
    }

    if (markers.length > 1) {
      const bounds = L.latLngBounds(markers.map(marker => [marker.lat, marker.lng]));
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 13 });
      return;
    }

    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 13);
    }
  }, [center, map, markerKey]);

  return null;
}

export default function ItineraryPage() {
  const navigate = useNavigate();
  const { theme, currentTrip, generatedItinerary, generatedHotels, weatherData, packingList, budgetBreakdown } = useStore();
  const [activeTab, setActiveTab] = useState<'itinerary' | 'hotels' | 'weather' | 'budget' | 'packing' | 'map'>('itinerary');
  const [expandedDay, setExpandedDay] = useState<number>(1);
  const [selectedMapCenter, setMapCenter] = useState<[number, number] | undefined>();
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setMapCenter(undefined);
  }, [currentTrip?.destination]);

  if (!currentTrip || !generatedItinerary) {
    return (
      <div className={`min-h-screen pt-16 flex items-center justify-center ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>No Trip Planned Yet</h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Create a new trip to see your itinerary</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold mx-auto hover:bg-indigo-700"
          >
            <ArrowLeft size={18} />
            Plan a Trip
          </button>
        </div>
      </div>
    );
  }

  // Collect all map markers
  const allMarkers: Array<{ lat: number; lng: number; name: string; type: string; emoji: string }> = [];
  
  generatedItinerary.forEach(day => {
    [...day.morning, ...day.afternoon, ...day.evening].forEach(act => {
      if (act.lat && act.lng) {
        allMarkers.push({ lat: act.lat, lng: act.lng, name: act.name, type: act.type || 'attraction', emoji: '📍' });
      }
    });
    day.restaurants.forEach(r => {
      if (r.lat && r.lng) {
        allMarkers.push({ lat: r.lat, lng: r.lng, name: r.name, type: 'restaurant', emoji: '🍽️' });
      }
    });
  });

  generatedHotels?.forEach(h => {
    if (h.lat && h.lng) {
      allMarkers.push({ lat: h.lat, lng: h.lng, name: h.name, type: 'hotel', emoji: '🏨' });
    }
  });

  const centerLat = allMarkers.length > 0 ? allMarkers.reduce((s, m) => s + m.lat, 0) / allMarkers.length : 20.5937;
  const centerLng = allMarkers.length > 0 ? allMarkers.reduce((s, m) => s + m.lng, 0) / allMarkers.length : 78.9629;

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await generatePDF(currentTrip, generatedItinerary, generatedHotels || [], weatherData, packingList || [], budgetBreakdown);
      toast.success('📄 PDF downloaded successfully!');
    } catch (e) {
      toast.error('PDF generation failed. Please try again.');
    }
    setDownloading(false);
  };

  const tabs = [
    { id: 'itinerary', label: 'Itinerary', icon: <Navigation size={16} /> },
    { id: 'map', label: 'Map', icon: <Map size={16} /> },
    { id: 'hotels', label: 'Hotels', icon: <Hotel size={16} /> },
    { id: 'weather', label: 'Weather', icon: <Cloud size={16} /> },
    { id: 'budget', label: 'Budget', icon: <DollarSign size={16} /> },
    { id: 'packing', label: 'Packing', icon: <Package size={16} /> },
  ];

  const handleShare = async () => {
    if (!currentTrip) return;

    const shareText = `🌍 My AI Travel Plan\n\nDestination: ${currentTrip.destination}, ${currentTrip.country || ''}`.trim() +
      `\nDuration: ${currentTrip.days} Days\nTravelers: ${currentTrip.travelers}\nBudget: ${currentTrip.currency} ${currentTrip.budget?.toLocaleString()}\n\nGenerated using Smart Travel AI.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Trip to ${currentTrip.destination}`,
          text: shareText,
          url: window.location.href,
        });
        return;
      }

      await navigator.clipboard.writeText(shareText);
      toast.success('Trip copied to clipboard!');
    } catch (error: unknown) {
      if (
        error instanceof DOMException &&
        (error.name === 'AbortError' || error.name === 'NotAllowedError')
      ) {
        return;
      }
      toast.error('Unable to share trip.');
    }
  };

  const budgetChartData = budgetBreakdown ? [
    { name: 'Hotel', value: budgetBreakdown.hotel, color: '#6366f1' },
    { name: 'Food', value: budgetBreakdown.food, color: '#f59e0b' },
    { name: 'Transport', value: budgetBreakdown.transport, color: '#10b981' },
    { name: 'Activities', value: budgetBreakdown.activities, color: '#8b5cf6' },
    { name: 'Shopping', value: budgetBreakdown.shopping, color: '#ef4444' },
    { name: 'Misc', value: budgetBreakdown.miscellaneous, color: '#6b7280' },
  ] : [];

  return (
    <div className={`min-h-screen pt-16 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Trip Header */}
      <div className="bg-linear-to-r from-teal-700 via-emerald-600 to-orange-500 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <button onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1 text-white/70 hover:text-white text-sm mb-2 transition-colors">
                <ArrowLeft size={16} />
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-white font-display flex items-center gap-2">
                <MapPin size={28} />
                {currentTrip.destination}
              </h1>
              <div className="flex flex-wrap gap-4 mt-2 text-white/80 text-sm">
                <span>📅 {currentTrip.days} Days</span>
                <span>👥 {currentTrip.travelers} Travelers</span>
                <span>💰 {currentTrip.currency} {currentTrip.budget?.toLocaleString()}</span>
                <span>✈️ {currentTrip.transport}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-sm hover:bg-gray-100 transition-all shadow-lg disabled:opacity-60"
              >
                {downloading ? (
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                Download PDF
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`sticky top-16 z-30 border-b ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide gap-1 py-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : theme === 'dark'
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {/* ITINERARY TAB */}
          {activeTab === 'itinerary' && (
            <motion.div key="itinerary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-4">
                {generatedItinerary.map((day) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: day.day * 0.05 }}
                    className={`rounded-2xl border overflow-hidden ${
                      theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'
                    }`}
                  >
                    {/* Day Header */}
                    <button
                      onClick={() => setExpandedDay(expandedDay === day.day ? -1 : day.day)}
                      className={`w-full flex items-center justify-between p-5 transition-all ${
                        expandedDay === day.day
                          ? 'bg-linear-to-r from-teal-600 to-emerald-600 text-white'
                          : theme === 'dark'
                          ? 'hover:bg-slate-700 text-white'
                          : 'hover:bg-gray-50 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${
                          expandedDay === day.day ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          {day.day}
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-lg">Day {day.day} — {day.theme}</div>
                          <div className={`text-sm ${expandedDay === day.day ? 'text-white/70' : theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                            {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} · ₹{day.dailyExpense?.toLocaleString() || 'N/A'} estimated
                          </div>
                        </div>
                      </div>
                      {expandedDay === day.day ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    <AnimatePresence>
                      {expandedDay === day.day && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 space-y-6">
                            {/* Time Slots */}
                            {[
                              { label: 'Morning', icon: <Sunrise size={18} />, activities: day.morning, color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                              { label: 'Afternoon', icon: <Sun size={18} />, activities: day.afternoon, color: 'from-green-400 to-emerald-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                              { label: 'Evening', icon: <Sunset size={18} />, activities: day.evening, color: 'from-purple-400 to-pink-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                            ].map(slot => slot.activities && slot.activities.length > 0 && (
                              <div key={slot.label}>
                                <div className={`flex items-center gap-2 mb-3 text-sm font-bold`}>
                                  <div className={`p-1.5 rounded-lg bg-linear-to-br ${slot.color} text-white`}>
                                    {slot.icon}
                                  </div>
                                  <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{slot.label}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {slot.activities.map((act, i) => (
                                    <motion.div
                                      key={i}
                                      whileHover={{ scale: 1.01 }}
                                      className={`rounded-xl overflow-hidden border ${
                                        theme === 'dark' ? 'border-slate-600' : 'border-gray-100'
                                      }`}
                                    >
                                      <div className="relative h-44 overflow-hidden">
                                        <img
                                          src={act.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'}
                                          alt={act.name}
                                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'; }}
                                        />
                                        <div className="absolute inset-0 bg-lineaer-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-2 left-2 right-2">
                                          <h4 className="text-white font-bold text-sm">{act.name}</h4>
                                        </div>
                                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
                                          <Star size={10} className="text-yellow-400 fill-yellow-400" />
                                          <span className="text-white text-xs">{act.rating}</span>
                                        </div>
                                        {act.lat && act.lng && (
                                          <button
                                            onClick={() => {
                                              setActiveTab('map');
                                              setMapCenter([act.lat!, act.lng!]);
                                            }}
                                            className="absolute top-2 left-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-full p-1.5 transition-colors"
                                          >
                                            <MapPin size={12} />
                                          </button>
                                        )}
                                      </div>
                                      <div className={`p-3 ${theme === 'dark' ? 'bg-slate-700' : 'bg-white'}`}>
                                        <p className={`text-xs leading-relaxed mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
                                          {act.description}
                                        </p>
                                        <div className="flex items-center justify-between text-xs">
                                          <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                                            <Clock size={11} /> {act.duration}
                                          </span>
                                          <span className={`flex items-center gap-1 font-semibold ${act.cost === 0 ? 'text-green-600' : theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                            <DollarSign size={11} />
                                            {act.cost === 0 ? 'Free' : `₹${act.cost?.toLocaleString()}`}
                                          </span>
                                        </div>
                                        <div className={`flex items-center gap-1 mt-1 text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>
                                          <MapPin size={10} />
                                          {act.location}
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            ))}

                            {/* Restaurants */}
                            {day.restaurants && day.restaurants.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-3 text-sm font-bold">
                                  <div className="p-1.5 rounded-lg bg-linear-to-br from-red-400 to-pink-500 text-white">
                                    <Utensils size={18} />
                                  </div>
                                  <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Recommended Restaurants</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {day.restaurants.map((rest, i) => (
                                    <div key={i} className={`flex gap-3 p-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-100'}`}>
                                      <img
                                        src={rest.image || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80'}
                                        alt={rest.name}
                                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                                        onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80'; }}
                                      />
                                      <div className="min-w-0">
                                        <div className={`font-semibold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{rest.name}</div>
                                        <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{rest.cuisine}</div>
                                        <div className="flex items-center gap-1 mt-0.5">
                                          <Star size={10} className="text-yellow-400 fill-yellow-400" />
                                          <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{rest.rating}</span>
                                          <span className={`text-xs ml-1 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>· {rest.priceRange}</span>
                                        </div>
                                        <div className="text-xs text-indigo-500 mt-0.5">🍴 Must try: {rest.mustTry}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Tips & Transport */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {day.tips && day.tips.length > 0 && (
                                <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-700' : 'bg-yellow-50 border border-yellow-100'}`}>
                                  <div className="flex items-center gap-2 mb-2 font-semibold text-sm text-yellow-700 dark:text-yellow-400">
                                    <AlertCircle size={16} />
                                    Local Tips
                                  </div>
                                  <ul className="space-y-1">
                                    {day.tips.map((tip, i) => (
                                      <li key={i} className={`text-xs flex gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
                                        <span>•</span>{tip}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {day.localTransport && (
                                <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-700' : 'bg-blue-50 border border-blue-100'}`}>
                                  <div className="flex items-center gap-2 mb-2 font-semibold text-sm text-blue-700 dark:text-blue-400">
                                    <Navigation size={16} />
                                    Local Transport
                                  </div>
                                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>{day.localTransport}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* MAP TAB */}
          {activeTab === 'map' && (
            <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className={`rounded-2xl overflow-hidden border ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`} style={{ height: '600px' }}>
                    <MapContainer
                      center={selectedMapCenter || [centerLat, centerLng]}
                      zoom={12}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <MapAutoView center={selectedMapCenter} markers={allMarkers} />
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      />
                      <Polyline
  positions={allMarkers.map(marker => [marker.lat, marker.lng])}
  pathOptions={{
    color: "#4F46E5",
    weight: 4,
    opacity: 0.8,
  }}
/>
                      {allMarkers.map((marker, i) => (
                        <Marker
                          key={i}
                          position={[marker.lat, marker.lng]}
                          icon={createCustomIcon(
                            marker.type === 'hotel' ? SECTION_COLORS.hotel :
                            marker.type === 'restaurant' ? SECTION_COLORS.restaurant :
                            SECTION_COLORS.morning,
                            marker.emoji
                          )}
                        >
                          <Popup>
                            <div className="p-1">
                              <p className="font-bold text-sm">{marker.name}</p>
                              <p className="text-xs text-gray-500 capitalize">{marker.type}</p>
                              <a
                                href={`https://www.google.com/maps/search/${encodeURIComponent(marker.name)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-indigo-600 flex items-center gap-1 mt-1 hover:underline"
                              >
                                <ExternalLink size={10} />
                                Open in Google Maps
                              </a>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>

                  {/* Map Legend */}
                  <div className={`mt-4 p-4 rounded-xl border flex flex-wrap gap-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                    {[
                      { color: SECTION_COLORS.morning, label: 'Attractions', emoji: '📍' },
                      { color: SECTION_COLORS.restaurant, label: 'Restaurants', emoji: '🍽️' },
                      { color: SECTION_COLORS.hotel, label: 'Hotels', emoji: '🏨' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: item.color }} />
                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>{item.emoji} {item.label}</span>
                      </div>
                    ))}
                    <span className={`text-xs ml-auto ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>
                      {allMarkers.length} locations plotted
                    </span>
                  </div>
                </div>

                {/* Location List */}
                <div className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className={`p-4 border-b font-bold ${theme === 'dark' ? 'border-slate-700 text-white' : 'border-gray-100 text-gray-900'}`}>
                    📍 All Locations ({allMarkers.length})
                  </div>
                  <div className="overflow-y-auto" style={{ maxHeight: '560px' }}>
                    {allMarkers.map((marker, i) => (
                      <div
                        key={i}
                        role="button"
                        tabIndex={0}
                        onClick={() => setMapCenter([marker.lat, marker.lng])}
                        onKeyDown={event => {
                          if (event.key === 'Enter' || event.key === ' ') setMapCenter([marker.lat, marker.lng]);
                        }}
                        className={`w-full text-left p-3 border-b cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors ${theme === 'dark' ? 'border-slate-700' : 'border-gray-50'}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{marker.emoji}</span>
                          <div>
                            <p className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{marker.name}</p>
                            <p className={`text-xs capitalize ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>{marker.type}</p>
                          </div>
                          <a
                            href={`https://www.google.com/maps/search/${encodeURIComponent(marker.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={event => event.stopPropagation()}
                            className="ml-auto text-indigo-500 hover:text-indigo-600"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* HOTELS TAB */}
          {activeTab === 'hotels' && (
            <motion.div key="hotels" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(generatedHotels || []).map((hotel, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                    className={`rounded-2xl overflow-hidden border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}
                  >
                    <div className="relative h-52">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'; }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded-full bg-yellow-400 text-gray-900 text-xs font-bold">
                          {'⭐'.repeat(hotel.stars)}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-xs font-bold">{hotel.rating}</span>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <h3 className="text-white font-bold text-lg">{hotel.name}</h3>
                        <p className="text-white/70 text-sm flex items-center gap-1">
                          <MapPin size={12} /> {hotel.location}
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className={`text-sm mb-3 leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
                        {hotel.description}
                      </p>
                      
                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {hotel.amenities.map(amenity => (
                          <span key={amenity} className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-indigo-50 text-indigo-700'
                          }`}>
                            {amenity}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>Per Night</p>
                          <p className="text-2xl font-bold text-indigo-600">
                            ₹{hotel.pricePerNight?.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {hotel.lat && hotel.lng && (
                            <button
                              onClick={() => {
                                setActiveTab('map');
                                setMapCenter([hotel.lat!, hotel.lng!]);
                              }}
                              className={`p-2.5 rounded-xl border transition-colors ${theme === 'dark' ? 'border-slate-600 hover:bg-slate-700 text-slate-300' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                            >
                              <Map size={16} />
                            </button>
                          )}
                          <a
                            href={hotel.bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors"
                          >
                            Book Now
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* WEATHER TAB */}
          {activeTab === 'weather' && weatherData && (
            <motion.div key="weather" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Weather */}
                <div className="lg:col-span-1">
                  <div className="bg-linear-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white">
                    <p className="text-white/70 text-sm mb-1">{currentTrip.destination}</p>
                    <div className="flex items-center gap-4 mb-4">
                      <img src={weatherData.current.icon} alt="weather" className="w-16 h-16" />
                      <div>
                        <div className="text-5xl font-bold">{weatherData.current.temp}°C</div>
                        <div className="text-white/80 capitalize">{weatherData.current.description}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Feels Like', value: `${weatherData.current.feels_like}°C`, icon: '🌡️' },
                        { label: 'Humidity', value: `${weatherData.current.humidity}%`, icon: '💧' },
                        { label: 'Wind', value: `${weatherData.current.windSpeed} km/h`, icon: '💨' },
                        { label: 'Visibility', value: `${weatherData.current.visibility} km`, icon: '👁️' },
                      ].map(item => (
                        <div key={item.label} className="bg-white/10 rounded-xl p-3">
                          <div className="text-lg">{item.icon}</div>
                          <div className="text-xs text-white/70">{item.label}</div>
                          <div className="font-bold text-sm">{item.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-white/10 rounded-xl">
                      <p className="text-sm">{weatherData.travelTip}</p>
                    </div>
                  </div>
                </div>

                {/* Forecast & Packing */}
                <div className="lg:col-span-2 space-y-4">
                  {/* 7-Day Forecast */}
                  <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <h3 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      📅 {currentTrip.days}-Day Forecast
                    </h3>
                    <div className="space-y-2">
                      {weatherData.forecast.slice(0, currentTrip.days).map((day, i) => (
                        <div key={i} className={`flex items-center justify-between p-2.5 rounded-xl ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-50'}`}>
                          <span className={`text-sm w-24 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
                            {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </span>
                          <img src={day.icon} alt="" className="w-8 h-8" />
                          <span className={`text-xs flex-1 mx-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} capitalize`}>
                            {day.description}
                          </span>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="text-red-500">{day.high}°</span>
                            <span className={theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}>/</span>
                            <span className="text-blue-500">{day.low}°</span>
                          </div>
                          {day.precipitation > 0 && (
                            <span className="text-xs text-blue-500 ml-2">💧{day.precipitation}%</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Packing Suggestions */}
                  <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <h3 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      🧳 Weather-Based Packing Tips
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {weatherData.packingSuggestions.map((tip, i) => (
                        <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-green-50'}`}>
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* BUDGET TAB */}
          {activeTab === 'budget' && budgetBreakdown && (
            <motion.div key="budget" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <h3 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Budget Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={budgetChartData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                      {budgetChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, '']} />
                  </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <h3 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Cost Breakdown</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={budgetChartData}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {budgetChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Budget Items */}
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <h3 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Detailed Costs</h3>
                  <div className="space-y-3">
                    {budgetChartData.map(item => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>{item.name}</span>
                        </div>
                        <span className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          ₹{item.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className={`pt-3 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-100'} flex justify-between`}>
                      <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Total</span>
                      <span className="font-bold text-indigo-600 text-lg">₹{budgetBreakdown.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Alternatives */}
                {budgetBreakdown.alternatives && (
                  <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <h3 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      💡 Money-Saving Alternatives
                    </h3>
                    <div className="space-y-4">
                      {budgetBreakdown.alternatives.map((alt, i) => (
                        <div key={i} className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-700' : 'bg-green-50 border border-green-100'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{alt.category}</span>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-red-500 line-through">₹{alt.original.toLocaleString()}</span>
                              <ChevronRight size={14} className="text-gray-400" />
                              <span className="text-green-600 font-bold">₹{alt.cheaper.toLocaleString()}</span>
                            </div>
                          </div>
                          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>💡 {alt.tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* PACKING TAB */}
          {activeTab === 'packing' && (
            <motion.div key="packing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(packingList || []).map((category, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{category.icon}</span>
                      <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{category.category}</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {category.items.map((item, j) => (
                        <li key={j} className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
                          <span className="w-4 h-4 rounded border-2 border-indigo-300 shrink-0 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-sm bg-indigo-500" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
