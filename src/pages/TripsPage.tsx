import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Users, DollarSign, Download, Trash2,
  Eye, Plus, Search, Filter, Clock, Star
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { generatePDF } from '../services/pdfService';
import toast from 'react-hot-toast';

export default function TripsPage() {
  const navigate = useNavigate();
  const { theme, savedTrips, deleteTrip, setCurrentTrip, setGeneratedItinerary, setGeneratedHotels, setWeatherData, setPackingList, setBudgetBreakdown } = useStore();
  const [search, setSearch] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);

  const filteredTrips = savedTrips.filter(trip =>
    trip.destination?.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewTrip = (trip: any) => {
    setCurrentTrip(trip);
    setGeneratedItinerary(trip.itinerary || []);
    setGeneratedHotels(trip.hotels || []);
    setWeatherData(trip.weather || null);
    setPackingList(trip.packingList || []);
    setBudgetBreakdown(null);
    navigate('/itinerary');
  };

  const handleDownload = async (trip: any) => {
    setDownloading(trip.id);
    try {
      await generatePDF(trip, trip.itinerary || [], trip.hotels || [], trip.weather, trip.packingList || [], null);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('Download failed');
    }
    setDownloading(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this trip?')) {
      deleteTrip(id);
      toast.success('Trip deleted');
    }
  };

  return (
    <div className={`min-h-screen pt-16 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-600 to-orange-500 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-white font-display mb-2">My Trips</h1>
          <p className="text-white/70">All your AI-generated travel plans in one place</p>
          <div className="flex gap-4 mt-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm text-white text-sm`}>
              <MapPin size={16} />
              {savedTrips.length} trips saved
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Search & Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
            New Trip
          </button>
        </div>

        {filteredTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-6xl animate-float">🗺️</div>
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {search ? 'No trips found' : 'No trips yet'}
            </h3>
            <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
              {search ? 'Try a different search' : 'Plan your first AI-powered trip!'}
            </p>
            {!search && (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors mt-2"
              >
                <Plus size={18} />
                Plan Your First Trip
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredTrips.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className={`rounded-2xl overflow-hidden border ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'
                  }`}
                >
                  {/* Cover Image */}
                  <div className="relative h-44">
                    <img
                      src={trip.itinerary?.[0]?.morning?.[0]?.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'}
                      alt={trip.destination}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-xl">{trip.destination}</h3>
                      <p className="text-white/70 text-xs">{new Date(trip.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        trip.days <= 3 ? 'bg-green-500' : trip.days <= 7 ? 'bg-blue-500' : 'bg-purple-500'
                      } text-white`}>
                        {trip.days} Days
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { icon: <Users size={13} />, value: `${trip.travelers} people` },
                        { icon: <DollarSign size={13} />, value: `${trip.currency || 'INR'} ${(trip.budget || 0).toLocaleString()}` },
                        { icon: <Calendar size={13} />, value: trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A' },
                      ].map((item, j) => (
                        <div key={j} className={`flex items-center gap-1 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                          <span className="text-indigo-500">{item.icon}</span>
                          {item.value}
                        </div>
                      ))}
                    </div>

                    {/* Interests */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(trip.interests || []).slice(0, 3).map(interest => (
                        <span key={interest} className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {interest}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewTrip(trip)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors"
                      >
                        <Eye size={15} />
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(trip)}
                        disabled={downloading === trip.id}
                        className={`p-2.5 rounded-xl border transition-colors ${
                          theme === 'dark' ? 'border-slate-600 hover:bg-slate-700 text-slate-300' : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        {downloading === trip.id ? (
                          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Download size={15} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(trip.id)}
                        className="p-2.5 rounded-xl border border-red-100 hover:bg-red-50 text-red-500 transition-colors dark:border-red-900/50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
