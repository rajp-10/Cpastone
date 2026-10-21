// Google Gemini AI Service
// Using the free Gemini API

// Google Gemini AI Service - Optimized for v1 Stable
import { getWeatherData } from "./weatherService";

const API_VERSION = 'v1beta';
const MODEL_NAMES = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-flash-latest',
];
const BASE_URL = 'https://generativelanguage.googleapis.com';

interface GeminiRequest {
  contents: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>;
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
  };
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;
}

export async function callGemini(prompt: string, history: Array<{ role: 'user' | 'model'; content: string }> = []): Promise<string> {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!GEMINI_API_KEY || GEMINI_API_KEY.startsWith('AIzaSyDemo')) {
    throw new Error('Please provide a valid Gemini API Key in your .env file.');
  }

  // Ensure alternating roles: user, model, user, model...
  const sanitizedContents: GeminiRequest['contents'] = [];
  let lastRole: 'user' | 'model' | null = null;

  // Process history and ensure alternation
  history.forEach(msg => {
    if (msg.role !== lastRole && msg.content.trim()) {
      sanitizedContents.push({
        role: msg.role,
        parts: [{ text: msg.content.trim() }]
      });
      lastRole = msg.role;
    }
  });

  // Always add the current prompt as 'user'
  // If last role was also 'user', we merge or skip (shouldn't happen with correct history)
  if (lastRole === 'user') {
    sanitizedContents[sanitizedContents.length - 1].parts[0].text += `\n\n${prompt}`;
  } else {
    sanitizedContents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });
  }

  const request: GeminiRequest = {
    contents: sanitizedContents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
      topP: 0.95,
      topK: 64
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
    ]
  };

  try {
    let lastError = 'The AI was unable to generate a response.';

    for (const modelName of MODEL_NAMES) {
      const url = `${BASE_URL}/${API_VERSION}/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
        lastError = 'The AI was unable to generate a response.';
        continue;
      }

      const errorData = await response.json().catch(() => ({}));
      lastError = errorData.error?.message || response.statusText;
      if (![404, 429, 500, 503].includes(response.status)) break;
    }

    throw new Error(`Gemini API Error: ${lastError}`);
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
}

export async function generateItinerary(tripDetails: {
  destination: string;
  days: number;
  budget: number;
  currency: string;
  travelers: number;
  transport: string;
  interests: string[];
  startDate: string;
}): Promise<string> {
  const prompt = `You are an expert travel planner. Generate a detailed ${tripDetails.days}-day travel itinerary for ${tripDetails.destination}.

Trip Details:
- Destination: ${tripDetails.destination}
- Duration: ${tripDetails.days} days
- Travelers: ${tripDetails.travelers} people
- Total Budget: ${tripDetails.currency} ${tripDetails.budget}
- Transport: ${tripDetails.transport}
- Interests: ${tripDetails.interests.join(', ')}
- Start Date: ${tripDetails.startDate}

Generate a JSON response with this EXACT structure (no markdown, pure JSON):
{
  "itinerary": [
    {
      "day": 1,
      "date": "2024-01-01",
      "theme": "Arrival & City Exploration",
      "morning": [
        {
          "name": "Place Name",
          "description": "Detailed description",
          "duration": "2 hours",
          "cost": 500,
          "rating": 4.5,
          "image": "https://source.unsplash.com/800x600/?place-name",
          "location": "Full address",
          "lat": 28.6139,
          "lng": 77.2090,
          "type": "attraction"
        }
      ],
      "afternoon": [...],
      "evening": [...],
      "restaurants": [
        {
          "name": "Restaurant Name",
          "cuisine": "Cuisine Type",
          "priceRange": "₹500-800 per person",
          "rating": 4.3,
          "image": "https://source.unsplash.com/800x600/?restaurant-food",
          "mustTry": "Dish Name",
          "location": "Full address",
          "lat": 28.6139,
          "lng": 77.2090
        }
      ],
      "dailyExpense": 3000,
      "tips": ["Safety tip 1", "Local tip 2"],
      "localTransport": "Auto-rickshaw or Metro"
    }
  ],
  "hotels": [
    {
      "name": "Hotel Name",
      "stars": 4,
      "pricePerNight": 3000,
      "currency": "${tripDetails.currency}",
      "rating": 4.2,
      "image": "https://source.unsplash.com/800x600/?hotel-lobby",
      "location": "Hotel Address",
      "amenities": ["WiFi", "Pool", "Restaurant", "AC"],
      "description": "Hotel description",
      "bookingUrl": "https://booking.com",
      "lat": 28.6139,
      "lng": 77.2090
    }
  ],
  "packingList": [
    {
      "category": "Clothing",
      "items": ["T-shirts", "Comfortable shoes"],
      "icon": "👕"
    }
  ],
  "budgetBreakdown": {
    "hotel": 15000,
    "food": 8000,
    "transport": 5000,
    "activities": 4000,
    "shopping": 3000,
    "miscellaneous": 2000,
    "total": 37000,
    "currency": "${tripDetails.currency}",
    "alternatives": [
      {
        "category": "Hotel",
        "original": 15000,
        "cheaper": 8000,
        "tip": "Consider guesthouses or hostels"
      }
    ]
  },
  "generalTips": ["Tip 1", "Tip 2"],
  "bestTimeToVisit": "October to March",
  "localLanguage": "Hindi",
  "currency": "Indian Rupee (INR)",
  "emergencyNumbers": {
    "police": "100",
    "ambulance": "108",
    "tourist_helpline": "1363"
  }
}

IMPORTANT RULES:

1. NEVER invent tourist places.

2. Use ONLY famous and verified tourist attractions.

3. Never repeat the same attraction twice.

4. Never suggest places outside the selected destination.

5. If destination is Rajasthan never mention snow, glaciers, ice mountains or skiing.

6. If destination is Goa include famous beaches, forts, churches, nightlife and seafood.

7. If destination is Kerala include Munnar, Alleppey, Wayanad, Kochi, Varkala and famous backwaters.

8. If destination is Dubai include Burj Khalifa, Dubai Mall, Palm Jumeirah, Desert Safari and Marina.

9. Every hotel must actually exist.

10. Every restaurant must actually exist.

11. Coordinates should closely match the real attraction.

12. Daily expenses must stay within the user's budget.

13. Balance sightseeing, food, relaxation and shopping.

14. Respond ONLY with valid JSON.
`;

  return callGemini(prompt);
}

export async function generateChatResponse(
  message: string,
  history: Array<{ role: string; content: string }>,
  context?: string
): Promise<string> {
  // Enhanced weather detection
  const weatherKeywords = [
    "weather", "temperature", "rain", "forecast", "humidity", "climate", 
    "hot", "cold", "snow", "sunny", "raining", "degree"
  ];

  const isWeatherQuestion = weatherKeywords.some(word =>
    message.toLowerCase().includes(word)
  );

  let weatherContext = "";

  if (isWeatherQuestion) {
    // Better city extraction: "weather in London", "temperature for Paris", "Mumbai weather"
    const cityMatch = 
      message.match(/in\s+([a-zA-Z\s]+)/i) || 
      message.match(/for\s+([a-zA-Z\s]+)/i) ||
      message.match(/([a-zA-Z\s]+)\s+weather/i);

    const city = cityMatch?.[1]?.trim();

    if (city) {
      try {
        const weather = await getWeatherData(city);
        weatherContext = `
[LIVE WEATHER DATA FOR ${city.toUpperCase()}]:
- Temperature: ${weather.current.temp}°C (Feels like ${weather.current.feels_like}°C)
- Condition: ${weather.current.description}
- Humidity: ${weather.current.humidity}%
- Wind: ${weather.current.windSpeed} km/h
- Travel Tip: ${weather.travelTip}
- Packing: ${weather.packingSuggestions.slice(0, 2).join(", ")}
`;
      } catch (e) {
        console.warn("Weather fetch failed, falling back to general knowledge.");
      }
    }
  }

  const systemPrompt = `
You are Smart Travel AI 🤖.

You are NOT Gemini.
You are NOT Google AI.

You are the official AI assistant of the Smart Travel Planner website.

Always introduce yourself as Smart Travel AI.

You can answer general questions across everyday topics, education, science, technology, coding, writing, planning, calculations, and current trip-related topics.

For travel questions, help users with:

✈️ Trip Planning
🌍 Tourist Attractions
🏨 Hotels
🍽 Restaurants
🌦 Live Weather
💰 Budget Planning
🗺 Maps
🧳 Packing Lists
🚖 Local Transport
🎒 Travel Tips

If someone asks "Who are you?" reply:

"I'm Smart Travel AI 🤖, your helpful AI assistant. I can answer general questions and help plan trips, check live weather, recommend hotels, restaurants, tourist attractions, estimate budgets, and more."

Never mention Gemini.
Never mention Google AI.

CORE GUIDELINES:

1. Answer the user's actual question, even when it is not about travel.
2. BE CONCISE: Use short, clear sentences.
3. FORMATTING: Use bullet points and bold text when useful.
4. CONTEXT: Use the trip context when relevant, but do not force it into unrelated answers.
5. WEATHER: Use live weather whenever a travel weather question includes a destination.
6. Be honest when information may be uncertain or outdated, and ask a focused follow-up only when necessary.

Current Trip Context:
${context || "No specific trip planned yet."}

${weatherContext}
`;

const conversationHistory = history.slice(-6).map(msg => ({
    role: (msg.role === 'assistant' || msg.role === 'model') ? 'model' : 'user' as 'model' | 'user',
    content: msg.content
  }));

  // We pass the system prompt as part of the initial context if history is empty, 
  // or wrap the current message with it.
  return callGemini(
    `${systemPrompt}

User:
${message}

Answer as Smart Travel AI.`,
    conversationHistory
);
}

export async function generatePackingList(details: {
  destination: string;
  days: number;
  weather: string;
  interests: string[];
}): Promise<string> {
  const prompt = `Generate a comprehensive packing list for:
- Destination: ${details.destination}
- Duration: ${details.days} days
- Weather: ${details.weather}
- Activities: ${details.interests.join(', ')}

Return JSON:
{
  "packingList": [
    {
      "category": "Category Name",
      "items": ["item1", "item2"],
      "icon": "emoji"
    }
  ]
}`;

  return callGemini(prompt);
}
