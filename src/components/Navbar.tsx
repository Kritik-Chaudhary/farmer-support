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
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <div className="flex items-center space-x-1 md:space-x-2 flex-shrink min-w-0 overflow-hidden">
            <Leaf className="h-5 w-5 md:h-8 md:w-8 text-green-600 flex-shrink-0" />
            <div className="min-w-0 overflow-hidden">
              <h1 className="text-xs sm:text-sm md:text-xl font-bold text-gray-900 truncate leading-tight">
                {t('nav.appName')}
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-600 font-medium md:hidden truncate leading-tight">{t('nav.tagline')}</p>
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
          <div className="md:hidden flex items-center space-x-1 flex-shrink-0">
            <span className="text-xs font-semibold text-green-800 bg-green-100 border border-green-200 px-2 py-1 rounded-full whitespace-nowrap">
              {tabs.find(tab => tab.id === activeTab)?.name}
            </span>
            <div className="flex-shrink-0">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}