import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Globe, Camera, Save, Bell, Shield, Trash2, Key } from 'lucide-react';
import { useStore } from '../store/useStore';
import { LANGUAGES } from '../i18n';
import i18n from '../i18n';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { theme, user, setUser, savedTrips, language, setLanguage } = useStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    language: language,
  });

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setUser({ ...user!, name: form.name, email: form.email, language: form.language });
    setLanguage(form.language);
    i18n.changeLanguage(form.language);
    setEditing(false);
    toast.success('Profile updated!');
  };

  const stats = [
    { label: 'Trips Planned', value: savedTrips.length.toString(), icon: '✈️' },
    { label: 'Countries', value: new Set(savedTrips.map(t => t.country || 'India')).size.toString(), icon: '🌍' },
    { label: 'Days Traveled', value: savedTrips.reduce((s, t) => s + (t.days || 0), 0).toString(), icon: '📅' },
    { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).getFullYear().toString() : '2024', icon: '🏆' },
  ];

  return (
    <div className={`min-h-screen pt-16 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header Banner */}
      <div className="h-40 bg-linear-to-r from-teal-700 via-emerald-600 to-orange-500 relative">
        <div className="absolute inset-0 hero-pattern" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Avatar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 mb-6">
          <div className="relative">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff&size=150`}
              alt={user?.name}
              className="w-28 h-28 rounded-2xl border-4 border-white dark:border-slate-800 shadow-xl object-cover"
            />
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg hover:bg-indigo-700 transition-colors">
              <Camera size={14} />
            </button>
          </div>
          <div className="flex-1 sm:pb-2">
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user?.name}</h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{user?.email}</p>
          </div>
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              editing
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {editing ? <><Save size={16} /> Save Changes</> : <><User size={16} /> Edit Profile</>}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map(stat => (
            <div key={stat.label} className={`p-4 rounded-2xl border text-center ${
              theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'
            }`}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
              <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-4">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              <h2 className={`font-bold text-lg mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <User size={20} className="text-indigo-500" />
                Personal Information
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Full Name', field: 'name', icon: <User size={16} />, type: 'text' },
                  { label: 'Email', field: 'email', icon: <Mail size={16} />, type: 'email' },
                ].map(({ label, field, icon, type }) => (
                  <div key={field}>
                    <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                      {label}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
                      <input
                        type={type}
                        value={form[field as keyof typeof form]}
                        onChange={e => setForm({ ...form, [field]: e.target.value })}
                        disabled={!editing}
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm transition-all ${
                          editing
                            ? theme === 'dark'
                              ? 'bg-slate-700 border-indigo-500 text-white'
                              : 'bg-white border-indigo-300 text-gray-900'
                            : theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-slate-300'
                            : 'bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                      />
                    </div>
                  </div>
                ))}

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                    Preferred Language
                  </label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={form.language}
                      onChange={e => setForm({ ...form, language: e.target.value })}
                      disabled={!editing}
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm transition-all ${
                        editing
                          ? theme === 'dark'
                            ? 'bg-slate-700 border-indigo-500 text-white'
                            : 'bg-white border-indigo-300 text-gray-900'
                          : theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-slate-300'
                          : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    >
                      {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.nativeName} ({lang.name})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              <h2 className={`font-bold text-lg mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <Shield size={20} className="text-indigo-500" />
                Security
              </h2>
              <div className="space-y-3">
                <button className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors ${
                  theme === 'dark' ? 'border-slate-700 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <Key size={18} className="text-indigo-500" />
                    <div className="text-left">
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Change Password</div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Last changed: Never</div>
                    </div>
                  </div>
                  <span className="text-indigo-500 text-sm">→</span>
                </button>
                <button className={`w-full flex items-center justify-between p-3 rounded-xl border border-red-100 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors`}>
                  <div className="flex items-center gap-3">
                    <Trash2 size={18} className="text-red-500" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-red-600">Delete Account</div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Permanently delete all data</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Notifications */}
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              <h3 className={`font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <Bell size={18} className="text-indigo-500" />
                Notifications
              </h3>
              {[
                { label: 'Trip Reminders', desc: 'Alerts before your trip', enabled: true },
                { label: 'Weather Alerts', desc: 'Weather updates for destinations', enabled: true },
                { label: 'Deal Alerts', desc: 'Price drops and offers', enabled: false },
                { label: 'Newsletter', desc: 'Travel tips and inspiration', enabled: false },
              ].map(notif => (
                <div key={notif.label} className="flex items-center justify-between py-2.5">
                  <div>
                    <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{notif.label}</div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>{notif.desc}</div>
                  </div>
                  <button className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${notif.enabled ? 'bg-indigo-600' : theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform mt-0.5 ${notif.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>

            {/* Recent Trips Preview */}
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              <h3 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Recent Trips</h3>
              {savedTrips.slice(0, 3).length > 0 ? (
                <div className="space-y-3">
                  {savedTrips.slice(0, 3).map(trip => (
                    <div key={trip.id} className={`flex items-center gap-3 p-2 rounded-xl ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-50'}`}>
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-sm">✈️</div>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{trip.destination}</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>{trip.days} days · {trip.travelers} people</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>No trips yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
