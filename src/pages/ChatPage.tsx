import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Trash2, Download, Sparkles, MapPin, Copy, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateChatResponse } from '../services/geminiAI';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

const SUGGESTED_QUESTIONS = [
  '🏖️ Best beaches to visit in Goa?',
  '💰 Budget trip to Rajasthan for 5 days?',
  '🌿 Best time to visit Kerala backwaters?',
  '🗺️ Hidden gems in North India?',
  '✈️ Visa requirements for Bali from India?',
  '🍛 Must-try foods in different Indian states?',
  '❄️ How to plan a Manali snow trip?',
  '🏯 Complete Golden Triangle tour guide?',
];

export default function ChatPage() {
  const { theme, user, chatMessages, addChatMessage, clearChat, currentTrip } = useStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendMessage = async (text: string = input.trim()) => {
    if (!text || loading) return;
    
    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: text,
      timestamp: new Date().toISOString(),
    };
    
    addChatMessage(userMsg);
    setInput('');
    setLoading(true);

    try {
      const context = currentTrip
        ? `Destination: ${currentTrip.destination}, Duration: ${currentTrip.days} days, Budget: ${currentTrip.currency} ${currentTrip.budget}, Interests: ${currentTrip.interests?.join(', ')}.`
        : undefined;

      const history = chatMessages.map(m => ({ role: m.role, content: m.content }));
      
      const response = await generateChatResponse(text, history, context);

      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(assistantMsg);
    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMessage = error.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
      
      // Add a friendly error message from the assistant
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ **Oops!** I ran into a bit of trouble: ${errorMessage}\n\nPlease check your connection or try again in a moment.`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast.success('Copied!');
  };

  return (
    <div className={`flex flex-col h-screen pt-16 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b px-4 sm:px-6 py-3 flex items-center justify-between ${
        theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              AI Travel Assistant
            </h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                Powered by Google Gemini
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => clearChat()}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-red-400' : 'text-gray-500 hover:bg-gray-100 hover:text-red-500'
            }`}
            title="Clear chat"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-teal-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 animate-float shadow-2xl shadow-teal-500/30">
                <Bot size={36} className="text-white" />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Your AI Travel Expert
              </h2>
              <p className={`text-sm max-w-md ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                Ask me anything about travel! Destinations, budgets, itineraries, visa info, local food, culture — I know it all.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => sendMessage(q.replace(/^[^\w]*/, '').trim())}
                  className={`text-left p-3 rounded-xl text-sm transition-all border ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-indigo-500'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 shadow-sm'
                  }`}
                >
                  {q}
                </motion.button>
              ))}
            </div>

            {currentTrip && (
              <div className={`p-3 rounded-xl border flex items-center gap-2 text-sm ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-indigo-50 border-indigo-100 text-indigo-700'
              }`}>
                <MapPin size={14} />
                Context: Planning trip to {currentTrip.destination} · {currentTrip.days} days
              </div>
            )}
          </div>
        ) : (
          chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-linear-to-br from-teal-500 to-emerald-600 flex items-center justify-center shrink-0 mt-1">
                  <Bot size={16} className="text-white" />
                </div>
              )}

              <div className={`max-w-[80%] group ${msg.role === 'user' ? 'order-first' : ''}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-linear-to-r from-teal-600 to-emerald-600 text-white rounded-br-sm'
                    : theme === 'dark'
                    ? 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm'
                    : 'bg-white border border-gray-100 text-gray-700 shadow-sm rounded-bl-sm'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className={`text-xs ${theme === 'dark' ? 'text-slate-600' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                        theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {copied === msg.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                    </button>
                  )}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 mt-1">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff`}
                    alt="You"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </motion.div>
          ))
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-teal-500 to-emerald-600 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className={`px-4 py-3 rounded-2xl rounded-bl-sm ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-indigo-500 loading-dot" />
                <div className="w-2 h-2 rounded-full bg-indigo-500 loading-dot" />
                <div className="w-2 h-2 rounded-full bg-indigo-500 loading-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={`border-t p-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className={`flex gap-3 items-end max-w-4xl mx-auto rounded-2xl border p-2 transition-all ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700 focus-within:border-indigo-500'
            : 'bg-gray-50 border-gray-200 focus-within:border-indigo-400 focus-within:bg-white shadow-sm'
        }`}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about any destination, travel tips, budgets, visa info..."
            rows={1}
            className={`flex-1 resize-none bg-transparent text-sm outline-none px-2 py-1.5 max-h-32 ${
              theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-gray-900 placeholder-gray-400'
            }`}
            style={{ lineHeight: '1.5' }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 flex items-center justify-center text-white disabled:opacity-40 transition-all shadow-md hover:shadow-teal-500/30 shrink-0"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </motion.button>
        </div>
        <p className={`text-center text-xs mt-2 ${theme === 'dark' ? 'text-slate-600' : 'text-gray-400'}`}>
          Press Enter to send · Shift+Enter for new line · Powered by Gemini AI
        </p>
      </div>
    </div>
  );
}

function getFallbackResponse(question: string): string {
  const q = question.toLowerCase();
  
  if (q.includes('goa')) {
    return `## 🏖️ Goa — India's Beach Paradise

**Best Time to Visit:** November to February (dry season)

**Top Beaches:**
- **Baga Beach** — Water sports, beach shacks, nightlife
- **Anjuna Beach** — Hippie vibes, flea markets
- **Palolem Beach** — Serene, crescent-shaped, perfect for swimming
- **Morjim Beach** — Turtle nesting, quiet and beautiful

**Must-Do Activities:**
- Water sports at Baga (parasailing ₹800, jet ski ₹700)
- Old Goa churches (Basilica of Bom Jesus — UNESCO site)
- Dudhsagar Waterfall trek (₹2500 per person with jeep)
- Anjuna Flea Market (every Wednesday)
- Goan food tour — fish curry, prawn vindaloo, bebinca

**Budget Tips:**
- 🏠 Stay in Anjuna or Vagator for cheaper guesthouses (₹800-1500/night)
- 🍽️ Eat at local beach shacks (₹200-400/meal)
- 🛵 Rent a scooter (₹300-400/day) instead of taxis
- 🎫 Most beaches are free entry

**Getting There:**
- ✈️ Goa International Airport (Mopa) — direct flights from major cities
- 🚂 Madgaon Railway Station — well-connected to Mumbai & Bengaluru`;
  }
  
  if (q.includes('rajasthan') || q.includes('jaipur')) {
    return `## 🏰 Rajasthan — Land of Kings

**Top Cities:**
- **Jaipur** (Pink City) — Amber Fort, City Palace, Hawa Mahal
- **Jodhpur** (Blue City) — Mehrangarh Fort, Umaid Bhawan Palace  
- **Udaipur** (City of Lakes) — Lake Pichola, City Palace
- **Jaisalmer** (Golden City) — Sand dunes, camel safaris

**5-Day Budget Estimate:** ₹15,000–25,000 per person

**Must Experiences:**
- 🐪 Camel safari in Jaisalmer sand dunes
- 🏯 Amber Fort light & sound show (₹200)
- 🛍️ Johari Bazaar for jewelry & handicrafts
- 🍛 Dal Baati Churma — the iconic Rajasthani dish
- 🌅 Sunrise at Mehrangarh Fort

**Best Time:** October to March (pleasant weather, 15-25°C)`;
  }

  if (q.includes('kerala')) {
    return `## 🌴 Kerala — God's Own Country

**Top Attractions:**
- **Alleppey Backwaters** — Houseboat stays (₹5,000-15,000/night)
- **Munnar Tea Gardens** — Scenic hill station, 1600m altitude
- **Periyar Wildlife Sanctuary** — Tiger reserve, elephant sightings
- **Kovalam & Varkala Beaches** — Cliff beaches, Ayurveda retreats
- **Wayanad** — Tribal culture, waterfalls, wildlife

**Best Time:** September to March (post-monsoon lush green)

**Budget for 6 Days:**
- Budget: ₹20,000-25,000 per person
- Mid-range: ₹35,000-50,000 per person
- Luxury: ₹80,000+ per person

**Don't Miss:**
- 🐘 Thrissur Pooram festival (April-May)
- 🎭 Kathakali classical dance performance
- 🧘 Authentic Ayurveda massage in Kovalam
- 🍛 Kerala Sadhya (traditional feast on banana leaf)`;
  }

  if (q.includes('budget')) {
    return `## 💰 Smart Budget Travel Tips for India

**Daily Budget Categories:**
- 🎒 Backpacker: ₹1,000-2,000/day
- 🏨 Mid-range: ₹3,000-6,000/day
- 💎 Luxury: ₹10,000+/day

**Money-Saving Tips:**
1. **Stay:** Use hostels (Zostel, Goibibo), guesthouses, or OYO budget rooms
2. **Food:** Eat at local dhabas and thali restaurants (₹100-200/meal)
3. **Transport:** Use Indian Railways sleeper class for overnight travel
4. **Activities:** Visit monuments on free/discounted days
5. **Shopping:** Buy from government emporiums for fixed prices

**Apps to Use:**
- 🚂 IRCTC — Train booking
- 🛤️ Redbus — Bus booking
- 🏠 MakeMyTrip / Goibibo — Hotel deals
- 📱 Google Pay / PhonePe — UPI payments (accepted everywhere)

**Hidden Costs to Budget For:**
- Entry fees (₹50-1000 per monument)
- Local transport between sites
- Tips for guides (10-15%)
- Travel insurance`;
  }

  return `## 🗺️ Your AI Travel Assistant

I'm here to help you plan the perfect trip! Here's what I can help with:

**Ask me about:**
- 📍 **Destinations** — Best places to visit, hidden gems
- 💰 **Budget Planning** — Cost estimates, money-saving tips  
- 🗓️ **Itineraries** — Day-by-day trip planning
- 🌤️ **Best Time to Visit** — Weather and seasons
- 🍛 **Local Food** — Must-try dishes and restaurants
- ✈️ **Getting There** — Flights, trains, buses
- 🛂 **Visa & Docs** — Requirements for international travel
- 🏨 **Accommodation** — Hotels, guesthouses, homestays

**Popular questions:**
- "Plan a 5-day Goa trip for ₹20,000"
- "Best hill stations near Bengaluru?"
- "What to pack for Manali in December?"
- "Rajasthan itinerary for 7 days"

Add your Gemini API key in the .env file for real AI-powered responses! 🤖`;
}
