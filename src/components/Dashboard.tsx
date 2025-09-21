'use client';

import { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  TrendingUp, 
  Cloud, 
  Camera, 
  FileText, 
  MapPin,
  Thermometer,
  Droplets
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    location: string;
    country: string;
  };
}

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ setActiveTab }: DashboardProps) {
  const { t } = useTranslation();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await fetch('/api/weather');
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };
  const features = [
    {
      title: t('assistant.title'),
      description: t('dashboard.aiAssistantDesc'),
      icon: MessageCircle,
      color: 'bg-blue-500',
      stats: t('dashboard.availableAlways'),
      tabKey: 'assistant'
    },
    {
      title: t('mandi.title'),
      description: t('dashboard.mandiPricesDesc'),
      icon: TrendingUp,
      color: 'bg-green-500',
      stats: t('dashboard.marketsCount'),
      tabKey: 'mandi'
    },
    {
      title: t('weather.title'),
      description: t('dashboard.weatherAlertsDesc'),
      icon: Cloud,
      color: 'bg-yellow-500',
      stats: t('dashboard.forecastDays'),
      tabKey: 'weather'
    },
    {
      title: t('crop.title'),
      description: t('dashboard.cropHealthDesc'),
      icon: Camera,
      color: 'bg-red-500',
      stats: t('dashboard.accuracy'),
      tabKey: 'crop-detection'
    },
    {
      title: t('schemes.title'),
      description: t('dashboard.governmentSchemesDesc'),
      icon: FileText,
      color: 'bg-purple-500',
      stats: t('dashboard.schemesCount'),
      tabKey: 'schemes'
    }
  ];

  const quickStats = [
    { 
      label: t('dashboard.location'), 
      value: weatherData ? `${weatherData.current.location}, ${weatherData.current.country}` : null, 
      icon: MapPin,
      isLoading: !weatherData
    },
    { 
      label: t('dashboard.temperature'), 
      value: weatherData ? `${weatherData.current.temperature}°C` : null, 
      icon: Thermometer,
      isLoading: !weatherData
    },
    { 
      label: t('dashboard.humidity'), 
      value: weatherData ? `${weatherData.current.humidity}%` : null, 
      icon: Droplets,
      isLoading: !weatherData
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-4 md:p-8">
        <h1 className="text-xl md:text-3xl font-bold mb-2 text-white drop-shadow-md">{t('dashboard.welcome')}</h1>
        <p className="text-sm md:text-lg text-green-50 font-medium">
          {t('dashboard.description')}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-700 font-medium mb-2">{stat.label}</p>
                  {stat.isLoading ? (
                    <div className="space-y-2">
                      <div className="h-8 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  )}
                </div>
                <div className="ml-4">
                  {stat.isLoading ? (
                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                  ) : (
                    <Icon className="h-8 w-8 text-gray-500" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div 
              key={index} 
              onClick={() => setActiveTab(feature.tabKey)}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 cursor-pointer hover:scale-105 hover:border-gray-300 group"
            >
              <div className="flex items-start space-x-4">
                <div className={`${feature.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 text-sm font-medium mb-3">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full border border-gray-200">
                      {feature.stats}
                    </span>
                    <span className="text-xs text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to open →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips Section */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('dashboard.todaysTips')}</h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <p className="text-gray-800 font-medium">
              <strong className="text-gray-900">{t('dashboard.weatherAlert')}:</strong> {t('dashboard.lightRainTip')}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-gray-800 font-medium">
              <strong className="text-gray-900">{t('dashboard.marketUpdate')}:</strong> {t('dashboard.wheatPriceTip')}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <p className="text-gray-800 font-medium">
              <strong className="text-gray-900">{t('dashboard.seasonalTip')}:</strong> {t('dashboard.soilTestTip')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}