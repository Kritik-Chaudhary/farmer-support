import axios from 'axios';
import { NextRequest } from 'next/server';

// Weather data interface
interface WeatherData {
  current: {
    temperature: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    weather: { main: string; description: string; icon: string };
    wind: { speed: number; deg: number };
    location: string;
    country: string;
  };
  forecast: Array<{
    date: string;
    temperature: { min: number; max: number };
    weather: { main: string; description: string };
    humidity: number;
  }>;
  alerts: Array<{
    type: string;
    severity: string;
    message: string;
    icon: string;
  }>;
}

// Mandi price data interface
interface MandiPriceData {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

// Helper function to fetch weather data (server-side)
export async function fetchWeatherData(): Promise<WeatherData | null> {
  try {
    // For server-side calls, we'll make a direct call to our weather API logic
    // We'll import and call the weather API logic directly to avoid network calls
    const { GET } = await import('../app/api/weather/route');
    const request = new NextRequest(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/weather`);
    const response = await GET(request);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// Helper function to fetch mandi prices (server-side)
export async function fetchMandiPrices(params: {
  state?: string;
  commodity?: string;
  district?: string;
}): Promise<{ data: MandiPriceData[]; total: number } | null> {
  try {
    // For server-side calls, we'll make a direct call to our mandi API logic
    const { GET } = await import('../app/api/mandi-prices/route');
    
    // Create URL with query parameters
    const queryParams = new URLSearchParams();
    if (params.state) queryParams.append('state', params.state);
    if (params.commodity) queryParams.append('commodity', params.commodity);
    if (params.district) queryParams.append('district', params.district);
    
    const url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/mandi-prices?${queryParams.toString()}`;
    const request = new NextRequest(url);
    const response = await GET(request);
    const data = await response.json();
    
    return {
      data: data.data || [],
      total: data.total || 0
    };
  } catch (error) {
    console.error('Error fetching mandi prices:', error);
    return null;
  }
}

// Helper function to format weather data for chatbot response
export function formatWeatherForChat(weatherData: WeatherData, language: string = 'en'): string {
  const { current, forecast, alerts } = weatherData;
  
  const translations = {
    en: {
      currentWeather: 'Current Weather',
      location: 'Location',
      temperature: 'Temperature',
      feelsLike: 'Feels like',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      forecast: '5-Day Forecast',
      alerts: 'Weather Alerts',
      today: 'Today',
      tomorrow: 'Tomorrow',
      highTemp: 'High',
      lowTemp: 'Low'
    },
    hi: {
      currentWeather: 'वर्तमान मौसम',
      location: 'स्थान',
      temperature: 'तापमान',
      feelsLike: 'महसूस होता है',
      humidity: 'नमी',
      windSpeed: 'हवा की गति',
      forecast: '5-दिन का पूर्वानुमान',
      alerts: 'मौसम चेतावनी',
      today: 'आज',
      tomorrow: 'कल',
      highTemp: 'अधिकतम',
      lowTemp: 'न्यूनतम'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  let weatherText = `${t.currentWeather}:\n`;
  weatherText += `${t.location}: ${current.location}\n`;
  weatherText += `${t.temperature}: ${current.temperature}°C (${t.feelsLike} ${current.feels_like}°C)\n`;
  weatherText += `${t.humidity}: ${current.humidity}%\n`;
  weatherText += `${t.windSpeed}: ${current.wind.speed} m/s\n`;
  weatherText += `Condition: ${current.weather.description}\n\n`;

  if (forecast.length > 0) {
    weatherText += `${t.forecast}:\n`;
    forecast.slice(0, 3).forEach((day, index) => {
      const dayLabel = index === 0 ? t.today : index === 1 ? t.tomorrow : day.date;
      weatherText += `${dayLabel}: ${t.highTemp} ${day.temperature.max}°C, ${t.lowTemp} ${day.temperature.min}°C - ${day.weather.description}\n`;
    });
  }

  if (alerts.length > 0) {
    weatherText += `\n${t.alerts}:\n`;
    alerts.forEach(alert => {
      weatherText += `${alert.icon} ${alert.message}\n`;
    });
  }

  return weatherText;
}

// Helper function to format mandi prices for chatbot response
export function formatMandiPricesForChat(
  mandiData: { data: MandiPriceData[]; total: number },
  commodity?: string,
  language: string = 'en'
): string {
  const { data, total } = mandiData;
  
  const translations = {
    en: {
      mandiPrices: 'Market Prices',
      commodity: 'Commodity',
      market: 'Market',
      location: 'Location',
      minPrice: 'Min Price',
      maxPrice: 'Max Price',
      modalPrice: 'Modal Price',
      perQuintal: '₹/Quintal',
      noData: 'No price data available',
      showingResults: 'Showing',
      results: 'results',
      date: 'Date'
    },
    hi: {
      mandiPrices: 'मंडी भाव',
      commodity: 'वस्तु',
      market: 'बाजार',
      location: 'स्थान',
      minPrice: 'न्यूनतम मूल्य',
      maxPrice: 'अधिकतम मूल्य',
      modalPrice: 'मोडल मूल्य',
      perQuintal: '₹/क्विंटल',
      noData: 'कोई मूल्य डेटा उपलब्ध नहीं',
      showingResults: 'दिखा रहे हैं',
      results: 'परिणाम',
      date: 'दिनांक'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  if (!data || data.length === 0) {
    return `${t.noData}${commodity ? ` for ${commodity}` : ''}.`;
  }

  let pricesText = `${t.mandiPrices}${commodity ? ` - ${commodity}` : ''}:\n`;
  pricesText += `${t.showingResults} ${Math.min(data.length, 5)} ${t.results}:\n\n`;

  // Show top 5 results
  data.slice(0, 5).forEach((price, index) => {
    pricesText += `${index + 1}. ${price.commodity} - ${price.market}, ${price.district}\n`;
    pricesText += `   ${t.modalPrice}: ₹${price.modal_price} ${t.perQuintal}\n`;
    pricesText += `   ${t.minPrice}: ₹${price.min_price}, ${t.maxPrice}: ₹${price.max_price}\n`;
    pricesText += `   ${t.date}: ${price.arrival_date}\n\n`;
  });

  if (data.length > 5) {
    pricesText += `... and ${data.length - 5} more results available.`;
  }

  return pricesText;
}

// Helper function to detect if a message is asking for weather
export function isWeatherQuery(message: string): boolean {
  const weatherKeywords = [
    'weather', 'temperature', 'rain', 'humidity', 'wind', 'forecast', 
    'climate', 'hot', 'cold', 'sunny', 'cloudy', 'storm',
    'मौसम', 'तापमान', 'बारिश', 'नमी', 'हवा', 'पूर्वानुमान'
  ];
  
  return weatherKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );
}

// Helper function to detect if a message is asking for mandi prices
export function isMandiPriceQuery(message: string): boolean {
  const priceKeywords = [
    'price', 'mandi', 'market', 'rate', 'cost', 'sell', 'buy',
    'भाव', 'मंडी', 'बाजार', 'दर', 'कीमत', 'मूल्य'
  ];
  
  return priceKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );
}

// Helper function to extract commodity from message
export function extractCommodity(message: string): string | undefined {
  const commonCommodities = [
    'rice', 'wheat', 'maize', 'onion', 'potato', 'tomato', 'chilli', 'turmeric',
    'mustard', 'jowar', 'bajra', 'gram', 'arhar', 'moong', 'urad', 'masur',
    'banana', 'mango', 'coconut', 'groundnut', 'soybean', 'sunflower',
    'cotton', 'sugarcane', 'garlic', 'ginger', 'grapes', 'papaya',
    'cauliflower', 'cabbage', 'brinjal', 'peas',
    'चावल', 'गेहूं', 'मक्का', 'प्याज', 'आलू', 'टमाटर', 'मिर्च', 'हल्दी'
  ];

  const lowerMessage = message.toLowerCase();
  return commonCommodities.find(commodity => 
    lowerMessage.includes(commodity.toLowerCase())
  );
}

// Helper function to extract state from message
export function extractState(message: string): string | undefined {
  const stateMap: Record<string, string> = {
    'punjab': 'PB',
    'haryana': 'HR',
    'uttar pradesh': 'UP', 
    'up': 'UP',
    'maharashtra': 'MH',
    'gujarat': 'GJ',
    'rajasthan': 'RJ',
    'karnataka': 'KK',
    'tamil nadu': 'TN',
    'andhra pradesh': 'AP',
    'telangana': 'TL',
    'west bengal': 'WB',
    'bihar': 'BI',
    'madhya pradesh': 'MP',
    'mp': 'MP',
    'delhi': 'DL',
    'पंजाब': 'PB',
    'हरियाणा': 'HR',
    'उत्तर प्रदेश': 'UP',
    'महाराष्ट्र': 'MH',
    'गुजरात': 'GJ',
    'राजस्थान': 'RJ'
  };

  const lowerMessage = message.toLowerCase();
  for (const [stateName, stateCode] of Object.entries(stateMap)) {
    if (lowerMessage.includes(stateName.toLowerCase())) {
      return stateCode;
    }
  }

  return undefined;
}