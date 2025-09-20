'use client';

import { 
  MessageCircle, 
  TrendingUp, 
  Cloud, 
  Camera, 
  FileText, 
  LayoutDashboard,
  Leaf
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { t } = useTranslation();
  
  const tabs = [
    { id: 'dashboard', name: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'assistant', name: t('nav.aiAssistant'), icon: MessageCircle },
    { id: 'mandi', name: t('nav.mandiPrices'), icon: TrendingUp },
    { id: 'weather', name: t('nav.weather'), icon: Cloud },
    { id: 'crop-detection', name: t('nav.cropHealth'), icon: Camera },
    { id: 'schemes', name: t('nav.schemes'), icon: FileText },
  ];

  return (
    <nav className="bg-white shadow-lg border-b-4 border-green-600 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <div className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">
                {t('nav.appName')}
              </h1>
              <p className="text-xs text-gray-700 font-medium md:hidden">{t('nav.tagline')}</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-600 text-white font-semibold'
                        : 'text-gray-700 font-medium hover:bg-green-50 hover:text-green-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </div>
            <LanguageSelector />
          </div>

          {/* Mobile - Current Page Indicator and Language Selector */}
          <div className="md:hidden flex items-center space-x-2">
            <span className="text-sm font-semibold text-green-800 bg-green-100 border border-green-200 px-3 py-1 rounded-full">
              {tabs.find(tab => tab.id === activeTab)?.name}
            </span>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
}