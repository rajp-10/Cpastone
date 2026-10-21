import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Sparkles, Map, Cloud, DollarSign, Hotel, FileDown,
  Star, ChevronRight, Globe2, Shield, Zap, Users,
  ArrowRight, Play, CheckCircle2, TrendingUp, Award,
  MessageCircle, Camera, Leaf
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { POPULAR_DESTINATIONS, TESTIMONIALS } from '../data/destinations';

function StatCard({ value, label, icon }: { value: string; label: string; icon: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-white/70 text-sm">{label}</div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) {
  const { theme } = useStore();
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className={`p-6 rounded-2xl border transition-all cursor-default ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700 hover:border-indigo-500'
          : 'bg-white border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-xl'
      }`}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
        <div className="text-white">{icon}</div>
      </div>
      <h3 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{desc}</p>
    </motion.div>
  );
}

function DestinationCard({ dest }: { dest: typeof POPULAR_DESTINATIONS[0] }) {
  const { theme } = useStore();
  const [imgError, setImgError] = useState(false);
  
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={imgError ? 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80' : dest.image}
          alt={dest.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm ${
            dest.category === 'india' ? 'bg-orange-500/80' : 'bg-blue-500/80'
          }`}>
            {dest.category === 'india' ? '🇮🇳 India' : '🌍 International'}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-bold">{dest.rating}</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-xl">{dest.name}</h3>
          <p className="text-white/80 text-sm">{dest.country}{dest.state ? `, ${dest.state}` : ''}</p>
        </div>
      </div>
      <div className={`p-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <p className={`text-sm mb-3 line-clamp-2 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
          {dest.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {dest.tags.slice(0, 3).map(tag => (
            <span key={tag} className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-indigo-50 text-indigo-700'
            }`}>
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>Avg Budget</p>
            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{dest.avgBudget}</p>
          </div>
          <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
            🗓️ {dest.bestTime.split(',')[0]}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof TESTIMONIALS[0] }) {
  const { theme } = useStore();
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`p-6 rounded-2xl border ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-100 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className={`text-sm leading-relaxed mb-4 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
        "{testimonial.text}"
      </p>
      <div className="flex items-center gap-3">
        <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{testimonial.name}</p>
          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{testimonial.location}</p>
          <p className="text-xs text-indigo-500 font-medium">{testimonial.trip}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const { t } = useTranslation();
  const { theme, isAuthenticated } = useStore();
  const [activeTab, setActiveTab] = useState<'india' | 'international'>('india');
  const [currentBg, setCurrentBg] = useState(0);

  const heroImages = [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=80',
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=80',
    'https://images.unsplash.com/photo-1477587458883-47145ed6979b?w=1600&q=80',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80',
    'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1600&q=80',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredDests = POPULAR_DESTINATIONS.filter(d => d.category === activeTab);

  const features = [
    { icon: <Sparkles size={22} />, title: t('landing.feature_ai'), desc: t('landing.feature_ai_desc'), color: 'from-indigo-500 to-purple-600' },
    { icon: <Cloud size={22} />, title: t('landing.feature_weather'), desc: t('landing.feature_weather_desc'), color: 'from-cyan-500 to-blue-600' },
    { icon: <DollarSign size={22} />, title: t('landing.feature_budget'), desc: t('landing.feature_budget_desc'), color: 'from-green-500 to-emerald-600' },
    { icon: <Hotel size={22} />, title: t('landing.feature_hotels'), desc: t('landing.feature_hotels_desc'), color: 'from-amber-500 to-orange-600' },
    { icon: <Map size={22} />, title: t('landing.feature_maps'), desc: t('landing.feature_maps_desc'), color: 'from-rose-500 to-red-600' },
    { icon: <FileDown size={22} />, title: t('landing.feature_pdf'), desc: t('landing.feature_pdf_desc'), color: 'from-purple-500 to-pink-600' },
    { icon: <MessageCircle size={22} />, title: 'AI Chat Assistant', desc: 'Get travel advice, destination tips, and local recommendations from our AI travel expert', color: 'from-teal-500 to-green-600' },
    { icon: <Camera size={22} />, title: 'Photography Spots', desc: 'Discover the best photography spots with real location images for every destination', color: 'from-pink-500 to-rose-600' },
    { icon: <Leaf size={22} />, title: 'Eco-Friendly Travel', desc: 'Plan sustainable trips with eco-friendly accommodation and activity recommendations', color: 'from-lime-500 to-green-600' },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Images */}
        {heroImages.map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: idx === currentBg ? 1 : 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img src={img} alt="Hero" className="w-full h-full object-cover" />
          </motion.div>
        ))}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Floating Elements */}
        <div className="absolute top-32 right-10 animate-float hidden lg:block">
          <div className="glass rounded-2xl p-4 text-white shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium">AI is generating...</span>
            </div>
            <div className="text-sm font-semibold">Day 3 — Rajasthan</div>
            <div className="text-xs text-white/70">Amber Fort → City Palace → Jantar Mantar</div>
          </div>
        </div>

        <div className="absolute bottom-32 right-20 animate-float hidden lg:block" style={{ animationDelay: '1.5s' }}>
          <div className="glass rounded-2xl p-4 text-white shadow-2xl">
            <div className="flex items-center gap-2 mb-1">
              <Cloud size={14} className="text-cyan-400" />
              <span className="text-xs">Weather Alert</span>
            </div>
            <div className="text-sm font-bold">28°C — Partly Cloudy</div>
            <div className="text-xs text-white/70">Perfect for sightseeing! 🌤️</div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6"
            >
              <Sparkles size={16} className="text-yellow-400" />
              Powered by Google Gemini AI
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white font-display leading-tight mb-6"
            >
              {t('landing.hero_title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/80 mb-8 leading-relaxed max-w-2xl"
            >
              {t('landing.hero_subtitle')}
            </motion.p>

            {/* Tricolor accent for India */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5 }}
              className="w-24 h-1 rounded-full mb-8 origin-left"
              style={{ background: 'linear-gradient(to right, #FF9933, #FFFFFF, #138808)' }}
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all shadow-2xl hover:shadow-teal-500/30 hover:scale-105 active:scale-95"
              >
                <Sparkles size={20} />
                {t('landing.hero_cta')}
                <ArrowRight size={18} />
              </Link>
              <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold text-lg hover:bg-white/20 transition-all">
                <Play size={18} className="fill-white" />
                {t('landing.hero_cta2')}
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-6 text-white/70 text-sm"
            >
              {[
                { icon: <Shield size={14} />, text: 'Secure & Private' },
                { icon: <Zap size={14} />, text: 'AI-Powered Planning' },
                { icon: <Globe2 size={14} />, text: '14 Languages Supported' },
                { icon: <CheckCircle2 size={14} />, text: 'Free to Start' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-1.5">
                  <div className="text-green-400">{item.icon}</div>
                  {item.text}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2"
          >
            <div className="w-1 h-3 rounded-full bg-white/60" />
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative py-16 bg-gradient-to-r from-teal-700 via-emerald-600 to-orange-500 animate-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '2.5L+', label: t('landing.stats_trips'), icon: '✈️' },
              { value: '195+', label: t('landing.stats_countries'), icon: '🌍' },
              { value: '50K+', label: t('landing.stats_users'), icon: '👥' },
              { value: '4.9★', label: t('landing.stats_rating'), icon: '⭐' },
            ].map(stat => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-4"
            >
              <TrendingUp size={16} />
              Everything You Need
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`text-4xl font-bold font-display mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              {t('landing.features_title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}
            >
              {t('landing.features_subtitle')}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <FeatureCard {...f} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-4xl font-bold font-display mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              {t('landing.destinations_title')}
            </motion.h2>
            <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
              {t('landing.destinations_subtitle')}
            </p>

            {/* India tricolor accent */}
            <div className="flex justify-center mt-4 mb-8">
              <div className="h-1 w-32 rounded-full" style={{ background: 'linear-gradient(to right, #FF9933, #FFFFFF, #138808)', border: '1px solid #e5e7eb' }} />
            </div>

            {/* Tabs */}
            <div className="inline-flex rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 mb-8">
              {[
                { key: 'india', label: '🇮🇳 India', emoji: '' },
                { key: 'international', label: '🌍 International', emoji: '' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'india' | 'international')}
                  className={`px-6 py-2.5 text-sm font-semibold transition-all ${
                    activeTab === tab.key
                      ? 'bg-indigo-600 text-white'
                      : theme === 'dark'
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDests.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <DestinationCard dest={dest} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className={`text-4xl font-bold font-display mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              How It Works
            </h2>
            <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
              Plan your perfect trip in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-teal-400 to-orange-400" />

            {[
              { step: '01', icon: '✍️', title: 'Enter Trip Details', desc: 'Tell us your destination, dates, budget, interests, and travel preferences.' },
              { step: '02', icon: '🤖', title: 'AI Generates Itinerary', desc: 'Our Gemini AI creates a personalized day-by-day travel plan with real places and costs.' },
              { step: '03', icon: '🗺️', title: 'Explore & Download', desc: 'View on interactive maps, check weather, book hotels, and download your PDF guide.' },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`text-center p-8 rounded-2xl relative ${
                  theme === 'dark' ? 'bg-slate-800' : 'bg-white shadow-lg'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Step {step.step}</div>
                <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold font-display mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('landing.testimonials_title')}
            </h2>
            <div className="flex justify-center items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
              ))}
              <span className={`ml-2 font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>4.9 out of 5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TestimonialCard testimonial={t} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-emerald-600 to-orange-500 animate-gradient" />
        <div className="absolute inset-0 hero-pattern" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-6xl mb-6 animate-float">✈️</div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white font-display mb-6">
              {t('landing.cta_title')}
            </h2>
            <p className="text-xl text-white/80 mb-10">
              {t('landing.cta_subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-white text-indigo-700 font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 active:scale-95"
              >
                <Sparkles size={20} />
                {t('landing.cta_button')}
                <ChevronRight size={20} />
              </Link>
              <Link
                to="/chat"
                className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold text-lg hover:bg-white/20 transition-all"
              >
                <MessageCircle size={20} />
                Chat with AI
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-gray-900 border-gray-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                  <Map size={18} className="text-white" />
                </div>
                <span className="text-white font-bold text-lg">Smart Travel AI</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI-powered travel planning for India and beyond. Plan smarter, travel better.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <div className="h-1 w-6 rounded-full bg-orange-500" />
                <div className="h-1 w-6 rounded-full bg-white" />
                <div className="h-1 w-6 rounded-full bg-green-500" />
                <span className="text-gray-400 text-xs ml-1">Proudly Indian 🇮🇳</span>
              </div>
            </div>
            {[
              {
                title: 'Product',
                links: ['Dashboard', 'AI Itinerary', 'Weather', 'Hotels', 'Maps', 'PDF Export'],
              },
              {
                title: 'Destinations',
                links: ['Goa', 'Rajasthan', 'Kerala', 'Manali', 'Dubai', 'Bali'],
              },
              {
                title: 'Languages',
                links: ['हिंदी', 'தமிழ்', 'తెలుగు', 'বাংলা', 'मराठी', 'ಕನ್ನಡ'],
              },
            ].map(section => (
              <div key={section.title}>
                <h4 className="text-white font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link}>
                      <span className="text-gray-400 text-sm hover:text-white cursor-pointer transition-colors">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 Smart AI Travel Planner. Built with ❤️ for Indian travelers.
            </p>
            <div className="flex items-center gap-2">
              <Award size={14} className="text-yellow-500" />
              <span className="text-gray-400 text-sm">Best Travel App 2024 — Powered by Google Gemini</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
