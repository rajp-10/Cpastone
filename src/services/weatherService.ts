// Weather Service using OpenWeatherMap API
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo_key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherResponse {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    description: string;
    icon: string;
    windSpeed: number;
    visibility: number;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    description: string;
    icon: string;
    precipitation: number;
  }>;
  packingSuggestions: string[];
  travelTip: string;
}

export async function getWeatherData(city: string, days: number = 7): Promise<WeatherResponse> {
  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`),
      fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&cnt=${days * 8}`)
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      return getMockWeatherData(city);
    }

    const current = await currentRes.json();
    const forecastData = await forecastRes.json();

    // Process forecast - get one entry per day
    const dailyForecast: Record<string, typeof forecastData.list[0]> = {};
    forecastData.list.forEach((item: { dt_txt: string; main: { temp_max: number; temp_min: number }; weather: Array<{ description: string; icon: string }>; pop: number }) => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyForecast[date]) {
        dailyForecast[date] = item;
      } else {
        if (item.main.temp_max > dailyForecast[date].main.temp_max) {
          dailyForecast[date].main.temp_max = item.main.temp_max;
        }
        if (item.main.temp_min < dailyForecast[date].main.temp_min) {
          dailyForecast[date].main.temp_min = item.main.temp_min;
        }
      }
    });

    const forecast = Object.entries(dailyForecast).slice(0, 7).map(([date, item]) => ({
      date,
      high: Math.round(item.main.temp_max),
      low: Math.round(item.main.temp_min),
      description: item.weather[0]?.description || 'Clear',
      icon: `https://openweathermap.org/img/wn/${item.weather[0]?.icon}@2x.png`,
      precipitation: Math.round(item.pop * 100),
    }));

    const temp = Math.round(current.main.temp);
    const packingSuggestions = getPackingSuggestions(temp, current.weather[0]?.description);

    return {
      current: {
        temp,
        feels_like: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        description: current.weather[0]?.description || 'Clear sky',
        icon: `https://openweathermap.org/img/wn/${current.weather[0]?.icon}@2x.png`,
        windSpeed: Math.round(current.wind?.speed * 3.6), // m/s to km/h
        visibility: Math.round((current.visibility || 10000) / 1000),
      },
      forecast,
      packingSuggestions,
      travelTip: getTravelTip(temp, current.weather[0]?.main),
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return getMockWeatherData(city);
  }
}

function getPackingSuggestions(temp: number, description: string): string[] {
  const suggestions: string[] = [];
  
  if (temp > 35) {
    suggestions.push('Pack light cotton clothes and breathable fabrics');
    suggestions.push('Sunscreen SPF 50+ is essential');
    suggestions.push('Carry a reusable water bottle');
    suggestions.push('Wide-brim hat and sunglasses recommended');
  } else if (temp > 25) {
    suggestions.push('Light comfortable clothing recommended');
    suggestions.push('Sunscreen and sunglasses');
    suggestions.push('Light rain jacket just in case');
  } else if (temp > 15) {
    suggestions.push('Layer up with light jacket');
    suggestions.push('Comfortable walking shoes');
    suggestions.push('Mix of light and medium clothes');
  } else if (temp > 5) {
    suggestions.push('Warm jacket and sweaters');
    suggestions.push('Thermal innerwear recommended');
    suggestions.push('Waterproof boots if rain expected');
  } else {
    suggestions.push('Heavy winter coat essential');
    suggestions.push('Thermal layers, gloves, scarf, and hat');
    suggestions.push('Waterproof and windproof outerwear');
  }

  if (description?.toLowerCase().includes('rain')) {
    suggestions.push('Umbrella or rain poncho');
    suggestions.push('Waterproof bag for electronics');
  }

  suggestions.push('Portable charger for devices');
  suggestions.push('Basic first aid kit');

  return suggestions;
}

function getTravelTip(temp: number, condition: string): string {
  if (temp > 38) return '🔥 Extreme heat! Stay hydrated, avoid midday sun, and seek air-conditioned spots.';
  if (temp > 30) return '☀️ Hot weather — carry water, wear sunscreen, and take breaks in shade.';
  if (temp > 20) return '🌤️ Pleasant weather — perfect for outdoor activities and sightseeing!';
  if (temp > 10) return '🧥 Cool weather — ideal for exploring. Layer up for evenings.';
  if (condition?.toLowerCase().includes('rain')) return '🌧️ Rainy season — carry umbrella, wear waterproof shoes, and check road conditions.';
  return '❄️ Cold weather — dress in layers and warm up with local hot beverages!';
}

export function getMockWeatherData(city: string): WeatherResponse {
  const cityWeather: Record<string, { temp: number; desc: string; icon: string }> = {
    'goa': { temp: 28, desc: 'sunny with sea breeze', icon: '01d' },
    'delhi': { temp: 32, desc: 'hazy sunshine', icon: '02d' },
    'mumbai': { temp: 30, desc: 'partly cloudy', icon: '03d' },
    'jaipur': { temp: 33, desc: 'clear sky', icon: '01d' },
    'kerala': { temp: 27, desc: 'light rain possible', icon: '10d' },
    'shimla': { temp: 15, desc: 'cool and pleasant', icon: '02d' },
    'manali': { temp: 8, desc: 'cold and clear', icon: '01d' },
    'agra': { temp: 31, desc: 'sunny', icon: '01d' },
    'varanasi': { temp: 29, desc: 'warm and humid', icon: '02d' },
    'rajasthan': { temp: 35, desc: 'hot and dry', icon: '01d' },
  };

  const cityKey = Object.keys(cityWeather).find(k => 
    city.toLowerCase().includes(k)
  ) || 'delhi';
  
  const weather = cityWeather[cityKey] || { temp: 28, desc: 'pleasant weather', icon: '02d' };

  return {
    current: {
      temp: weather.temp,
      feels_like: weather.temp + 2,
      humidity: 65,
      description: weather.desc,
      icon: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
      windSpeed: 18,
      visibility: 10,
    },
    forecast: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
      high: weather.temp + Math.floor(Math.random() * 5),
      low: weather.temp - Math.floor(Math.random() * 8) - 3,
      description: ['Sunny', 'Partly Cloudy', 'Clear', 'Light Rain', 'Mostly Clear'][Math.floor(Math.random() * 5)],
      icon: `https://openweathermap.org/img/wn/${['01d', '02d', '03d', '10d'][Math.floor(Math.random() * 4)]}@2x.png`,
      precipitation: Math.floor(Math.random() * 30),
    })),
    packingSuggestions: getPackingSuggestions(weather.temp, weather.desc),
    travelTip: getTravelTip(weather.temp, weather.desc),
  };
}
