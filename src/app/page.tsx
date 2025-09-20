'use client';

import { useState } from 'react';
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
        
        <footer className="bg-green-800 text-white py-6 mt-12 mb-16 md:mb-0">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm md:text-base">&copy; 2024 Farmer Support App. Empowering farmers with technology and information.</p>
          </div>
        </footer>
        
        {/* Bottom Navigation for Mobile */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </LanguageProvider>
  );
}
