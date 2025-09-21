'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import AIAssistant from '@/components/AIAssistant';
import MandiPrices from '@/components/MandiPrices';
import WeatherAlerts from '@/components/WeatherAlerts';
import CropDetection from '@/components/CropDetection';
import GovernmentSchemes from '@/components/GovernmentSchemes';
import Dashboard from '@/components/Dashboard';
import LanguageProvider from '@/components/LanguageProvider';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Function to stop any ongoing speech
  const stopGlobalSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      console.log('Global speech stopped due to navigation');
    }
  };

  // Stop speech when changing tabs
  useEffect(() => {
    stopGlobalSpeech();
  }, [activeTab]);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'assistant' && <AIAssistant />}
          {activeTab === 'mandi' && <MandiPrices />}
          {activeTab === 'weather' && <WeatherAlerts />}
          {activeTab === 'crop-detection' && <CropDetection />}
          {activeTab === 'schemes' && <GovernmentSchemes />}
        </main>
        
        {/* Bottom Navigation for Mobile */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </LanguageProvider>
  );
}
