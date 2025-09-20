'use client';

import { 
  MessageCircle, 
  TrendingUp, 
  Cloud, 
  Camera, 
  FileText, 
  LayoutDashboard
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard', name: 'Home', icon: LayoutDashboard },
    { id: 'assistant', name: 'Assistant', icon: MessageCircle },
    { id: 'mandi', name: 'Prices', icon: TrendingUp },
    { id: 'weather', name: 'Weather', icon: Cloud },
    { id: 'crop-detection', name: 'Crop', icon: Camera },
    { id: 'schemes', name: 'Schemes', icon: FileText },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="grid grid-cols-6 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center space-y-1 relative ${
                isActive 
                  ? 'text-green-700' 
                  : 'text-gray-600'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-600"></div>
              )}
              <Icon className={`${isActive ? 'h-5 w-5' : 'h-4 w-4'}`} />
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-semibold'}`}>{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}