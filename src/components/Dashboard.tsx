'use client';

import { 
  MessageCircle, 
  TrendingUp, 
  Cloud, 
  Camera, 
  FileText, 
  Users,
  Thermometer,
  Droplets
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ setActiveTab }: DashboardProps) {
  const { t } = useTranslation();
  const features = [
    {
      title: t('assistant.title'),
      description: 'Get instant answers about crops, weather, and farming practices',
      icon: MessageCircle,
      color: 'bg-blue-500',
      stats: 'Available 24/7',
      tabKey: 'assistant'
    },
    {
      title: t('mandi.title'),
      description: 'Real-time market prices for your crops across different mandis',
      icon: TrendingUp,
      color: 'bg-green-500',
      stats: '500+ Markets',
      tabKey: 'mandi'
    },
    {
      title: t('weather.title'),
      description: 'Get weather forecasts and alerts for your farming area',
      icon: Cloud,
      color: 'bg-yellow-500',
      stats: '5-day forecast',
      tabKey: 'weather'
    },
    {
      title: t('crop.title'),
      description: t('crop.subtitle'),
      icon: Camera,
      color: 'bg-red-500',
      stats: '95% Accuracy',
      tabKey: 'crop-detection'
    },
    {
      title: t('schemes.title'),
      description: 'Browse and apply for farmer welfare schemes and subsidies',
      icon: FileText,
      color: 'bg-purple-500',
      stats: '50+ Schemes',
      tabKey: 'schemes'
    }
  ];

  const quickStats = [
    { label: 'Today\'s Temperature', value: '28°C', icon: Thermometer },
    { label: 'Humidity', value: '65%', icon: Droplets },
    { label: 'Active Farmers', value: '1000+', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-4 md:p-8">
        <h1 className="text-xl md:text-3xl font-bold mb-2 text-white drop-shadow-md">Welcome to Farmer Support App</h1>
        <p className="text-sm md:text-lg text-green-50 font-medium">
          Your comprehensive digital companion for modern farming. Access AI-powered insights, 
          market prices, weather updates, and government schemes all in one place.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Icon className="h-8 w-8 text-gray-500" />
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Today&apos;s Farming Tips</h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <p className="text-gray-800 font-medium">
              <strong className="text-gray-900">Weather Alert:</strong> Light rain expected tomorrow. Good time for sowing if soil conditions are right.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-gray-800 font-medium">
              <strong className="text-gray-900">Market Update:</strong> Wheat prices showing upward trend. Consider timing your sales accordingly.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <p className="text-gray-800 font-medium">
              <strong className="text-gray-900">Seasonal Tip:</strong> This is the ideal time for soil testing. Use our Soil Health feature to get recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}