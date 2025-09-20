'use client';

import { useState, useEffect } from 'react';
import { Cloud, AlertCircle, Droplets, Thermometer, Wind, MapPin } from 'lucide-react';

interface WeatherData {
  current: {
    temperature: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    weather: { main: string; description: string; icon: string };
    wind: { speed: number };
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

export default function WeatherAlerts() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [inputCity, setInputCity] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);

  useEffect(() => {
    // Get user's location on component mount
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation || city) {
      fetchWeather();
    }
  }, [userLocation, city]);

  const getUserLocation = () => {
    // Try browser geolocation first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error, falling back to IP detection');
          // If browser location fails, API will use IP detection
          fetchWeather();
        }
      );
    } else {
      // If geolocation not supported, API will use IP detection
      fetchWeather();
    }
  };

  const fetchWeather = async () => {
    setLoading(true);
    try {
      let url = '/api/weather';
      const params = new URLSearchParams();
      
      if (userLocation) {
        params.append('lat', userLocation.lat.toString());
        params.append('lon', userLocation.lon.toString());
      } else if (city) {
        params.append('city', city);
      }
      // If neither location nor city, API will use IP detection
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (inputCity.trim()) {
      setUserLocation(null); // Clear coordinates when searching by city
      setCity(inputCity.trim());
      setInputCity('');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="text-center text-gray-500">No weather data available</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Location Indicator */}
      {weatherData && (
        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg">
          <MapPin className="h-4 w-4 text-blue-600" />
          <span>
            {userLocation ? 
              '📍 Using your current location' : 
              city ? 
                `Showing weather for: ${weatherData.current.location}` : 
                '🌐 Location detected from IP address'
            }
          </span>
        </div>
      )}
      
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter city name..."
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-900 font-medium placeholder-gray-500 bg-white"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Current Weather */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-3xl font-bold mb-2 text-white drop-shadow-md">
              {weatherData.current.location}, {weatherData.current.country}
            </h2>
            <p className="text-3xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">{weatherData.current.temperature}°C</p>
            <p className="text-sm md:text-lg text-blue-50 font-medium">
              Feels like {weatherData.current.feels_like}°C
            </p>
            <p className="text-base md:text-xl capitalize mt-2 text-white font-medium">
              {weatherData.current.weather.description}
            </p>
          </div>
          <div className="text-right">
            <Cloud className="h-16 w-16 md:h-24 md:w-24 text-white/40" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white/20 backdrop-blur rounded-lg p-3 border border-white/30">
            <div className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-white" />
              <div>
                <p className="text-sm text-blue-50 font-medium">Humidity</p>
                <p className="text-lg font-bold text-white">{weatherData.current.humidity}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-3 border border-white/30">
            <div className="flex items-center space-x-2">
              <Wind className="h-5 w-5 text-white" />
              <div>
                <p className="text-sm text-blue-50 font-medium">Wind Speed</p>
                <p className="text-lg font-bold text-white">{weatherData.current.wind.speed} m/s</p>
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-3 border border-white/30">
            <div className="flex items-center space-x-2">
              <Thermometer className="h-5 w-5 text-white" />
              <div>
                <p className="text-sm text-blue-50 font-medium">Pressure</p>
                <p className="text-lg font-bold text-white">{weatherData.current.pressure} hPa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Alerts */}
      {weatherData.alerts && weatherData.alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            Agricultural Weather Alerts
          </h3>
          <div className="space-y-3">
            {weatherData.alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{alert.icon}</span>
                  <div>
                    <p className="font-semibold capitalize">{alert.type.replace(/_/g, ' ')}</p>
                    <p className="text-sm mt-1">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5-Day Forecast */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">5-Day Forecast</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all">
              <p className="font-bold text-sm text-gray-800 mb-2">{day.date}</p>
              <Cloud className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-sm text-gray-700 font-medium capitalize">{day.weather.main}</p>
              <div className="flex justify-center space-x-2 mt-2">
                <span className="text-lg font-bold text-gray-800">{day.temperature.max}°</span>
                <span className="text-sm text-gray-600 font-medium">{day.temperature.min}°</span>
              </div>
              <p className="text-xs font-medium text-blue-600 mt-1">💧 {day.humidity}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}