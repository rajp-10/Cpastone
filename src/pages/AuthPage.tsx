import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Map } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';
import API from "../services/api";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface Props {
  mode: 'login' | 'register';
}

export default function AuthPage({ mode }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser, setToken, theme } = useStore();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === 'register' && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (mode === 'register' && form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
  if (mode === "register") {

    await API.post("/auth/register", {
      username: form.name,
      email: form.email,
      password: form.password,
    });

    toast.success("Account created successfully!");

    navigate("/login");

  } else {

    const formData = new URLSearchParams();

    formData.append("username", form.email);
    formData.append("password", form.password);

    const response = await API.post(
      "/auth/login",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

  const token = response.data.access_token;

localStorage.setItem("token", token);

setToken(token);

setUser({
  id: "1",
  name: form.email.split("@")[0],
  email: form.email,
  language: "en",
  createdAt: new Date().toISOString(),
});

toast.success("Login Successful!");

navigate("/dashboard");
  }

} catch (error: any) {

  toast.error(
    error.response?.data?.detail || "Authentication Failed"
  );

} finally {

  setLoading(false);

}
  }

  const heroImages = [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
    'https://images.unsplash.com/photo-1477587458883-47145ed6979b?w=800&q=80',
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
  ];

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Left — Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={heroImages[Math.floor(Math.random() * heroImages.length)]}
          alt="Travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-teal-950/80 via-emerald-900/60 to-orange-900/40" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Map size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl">Smart Travel AI</span>
          </Link>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm mb-6">
              <Sparkles size={14} className="text-yellow-400" />
              AI-Powered Travel Planning
            </div>
            <h2 className="text-4xl font-bold text-white font-display mb-4">
              Your Dream Trip<br />Starts Here
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Join 50,000+ travelers who plan smarter with AI-generated itineraries for India and beyond.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🗺️', text: 'Real Maps & Locations' },
                { icon: '🤖', text: 'Gemini AI Itineraries' },
                { icon: '🇮🇳', text: '8 Indian Languages' },
                { icon: '📄', text: 'PDF Trip Reports' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-2 text-white/80 text-sm">
                  <span>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {['FF9933', 'FFFFFF', '138808'].map(color => (
              <div key={color} className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: `#${color}` }} />
            ))}
            <span className="text-white/60 text-xs ml-2">Proudly Indian 🇮🇳</span>
          </div>
        </div>
      </div>

      {/* Right — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
              <Map size={18} className="text-white" />
            </div>
            <span className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Smart Travel AI</span>
          </Link>

          <h1 className={`text-3xl font-bold font-display mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {mode === 'login' ? t('auth.login_title') : t('auth.register_title')}
          </h1>
          <p className={`mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
            {mode === 'login' ? t('auth.login_subtitle') : t('auth.register_subtitle')}
          </p>

          {/* Social Login */}
          <div className="mb-6 flex justify-center">
  <GoogleLogin
    onSuccess={async (credentialResponse) => {
  try {
    const googleUser: any = jwtDecode(credentialResponse.credential!);

    const response = await API.post("/auth/google-login", {
      credential: credentialResponse.credential,
    });

    const token = response.data.access_token;

    localStorage.setItem("token", token);

    setToken(token);

    setUser({
      id: googleUser.sub,
      name: googleUser.name,
      email: googleUser.email,
      language: "en",
      createdAt: new Date().toISOString(),
    });

    toast.success("Google Login Successful!");
    navigate("/dashboard");
  } catch (error) {
    toast.error("Google Login Failed");
  }
}}
    onError={() => {
      toast.error("Google Login Failed");
    }}
  />
</div>

          <div className={`flex items-center gap-4 mb-6 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>
            <div className="flex-1 h-px bg-current opacity-30" />
            <span className="text-sm">{t('auth.or')}</span>
            <div className="flex-1 h-px bg-current opacity-30" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                  {t('auth.name')}
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Rahul Sharma"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.name ? 'border-red-400' : ''
                    } ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'}`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="rahul@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.email ? 'border-red-400' : ''
                  } ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.password ? 'border-red-400' : ''
                  } ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {mode === 'register' && (
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                  {t('auth.confirm_password')}
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.confirmPassword ? 'border-red-400' : ''
                    } ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'}`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700">
                  {t('auth.forgot_password')}
                </button>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 text-white font-bold text-base transition-all disabled:opacity-70 hover:from-teal-700 hover:to-emerald-700 shadow-lg hover:shadow-teal-500/30"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {mode === 'login' ? t('auth.login_btn') : t('auth.register_btn')}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <p className={`text-center mt-6 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
            {mode === 'login' ? t('auth.no_account') : t('auth.have_account')}{' '}
            <Link
              to={mode === 'login' ? '/register' : '/login'}
              className="text-indigo-600 font-semibold hover:text-indigo-700"
            >
              {mode === 'login' ? t('auth.register_btn') : t('auth.login_btn')}
            </Link>
          </p>

          {/* Demo credentials */}
          <div className={`mt-6 p-3 rounded-xl border text-xs ${
            theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-blue-50 border-blue-100 text-blue-700'
          }`}>
            <p className="font-semibold mb-1">🧪 Demo Account:</p>
            <p>Email: demo@travelai.com | Password: demo123</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
