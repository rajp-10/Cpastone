import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, Map, TrendingUp, Activity, Shield, Globe, Star, Award } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function AdminPage() {
  const navigate = useNavigate();
  const { theme, user, savedTrips } = useStore();

  if (!user?.email?.includes('admin')) {
    navigate('/dashboard');
    return null;
  }

  const destinationData = [
    { name: 'Goa', trips: 45 },
    { name: 'Rajasthan', trips: 38 },
    { name: 'Kerala', trips: 32 },
    { name: 'Manali', trips: 28 },
    { name: 'Dubai', trips: 22 },
    { name: 'Bali', trips: 19 },
    { name: 'Agra', trips: 16 },
    { name: 'Varanasi', trips: 14 },
  ];

  const monthlyData = [
    { month: 'Jan', users: 120, trips: 89 },
    { month: 'Feb', users: 145, trips: 112 },
    { month: 'Mar', users: 180, trips: 156 },
    { month: 'Apr', users: 220, trips: 198 },
    { month: 'May', users: 195, trips: 167 },
    { month: 'Jun', users: 260, trips: 234 },
    { month: 'Jul', users: 310, trips: 287 },
    { month: 'Aug', users: 290, trips: 265 },
  ];

  const interestData = [
    { name: 'Beaches', value: 30, color: '#06b6d4' },
    { name: 'Historical', value: 25, color: '#f59e0b' },
    { name: 'Adventure', value: 20, color: '#ef4444' },
    { name: 'Nature', value: 15, color: '#10b981' },
    { name: 'Food', value: 10, color: '#8b5cf6' },
  ];

  const statCards = [
    { label: 'Total Users', value: '2,847', change: '+12%', icon: <Users size={22} />, color: 'from-blue-500 to-cyan-600' },
    { label: 'Trips Generated', value: '12,456', change: '+28%', icon: <Map size={22} />, color: 'from-indigo-500 to-purple-600' },
    { label: 'AI Queries/Day', value: '1,234', change: '+45%', icon: <Activity size={22} />, color: 'from-pink-500 to-rose-600' },
    { label: 'Avg Rating', value: '4.8/5', change: '+0.2', icon: <Star size={22} />, color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className={`min-h-screen pt-16 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="bg-linear-to-r from-slate-800 to-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={28} className="text-indigo-400" />
            <h1 className="text-3xl font-bold text-white font-display">Admin Dashboard</h1>
          </div>
          <p className="text-slate-400">Platform analytics and user management</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(stat => (
            <div key={stat.label} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center text-white mb-3`}>
                {stat.icon}
              </div>
              <div className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{stat.label}</span>
                <span className="text-xs text-green-500 font-semibold">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
            <h3 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Monthly Growth</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} name="Users" />
                <Line type="monotone" dataKey="trips" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} name="Trips" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
            <h3 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Popular Interests</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie data={interestData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                    {interestData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {interestData.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>{item.name}</span>
                    <span className={`text-sm font-bold ml-auto ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
          <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <Globe size={20} className="text-indigo-500" />
            Top Destinations
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={destinationData} layout="horizontal">
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="trips" fill="#6366f1" radius={[6, 6, 0, 0]} name="Trips" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Trips Table */}
        <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
          <h3 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Recent Trips</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`text-xs uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                  {['Destination', 'Days', 'Travelers', 'Budget', 'Date', 'Status'].map(h => (
                    <th key={h} className="text-left py-2 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {savedTrips.slice(0, 5).map((trip, i) => (
                  <tr key={trip.id} className={`border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-50'}`}>
                    <td className={`py-3 px-3 font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{trip.destination}</td>
                    <td className={`py-3 px-3 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{trip.days}</td>
                    <td className={`py-3 px-3 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{trip.travelers}</td>
                    <td className={`py-3 px-3 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>₹{trip.budget?.toLocaleString()}</td>
                    <td className={`py-3 px-3 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                      {new Date(trip.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Active</span>
                    </td>
                  </tr>
                ))}
                {savedTrips.length === 0 && (
                  <tr>
                    <td colSpan={6} className={`py-8 text-center text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>
                      No trips yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
