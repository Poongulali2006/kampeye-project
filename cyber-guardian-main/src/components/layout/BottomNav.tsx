import React from 'react';
import { Home, Shield, Bell, BookOpen, User, Mic } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'scanner', icon: Shield, label: t('scanner') },
    { id: 'voice', icon: Mic, label: 'KAMP', special: true },
    { id: 'alerts', icon: Bell, label: t('alerts') },
    { id: 'profile', icon: User, label: t('profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`nav-item flex-1 max-w-[80px] ${isActive ? 'active' : 'text-muted-foreground'}`}
            >
              {(item as any).special ? (
                <div className={`relative -mt-4 p-3 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'gradient-primary glow-primary scale-110' 
                    : 'bg-primary/80'
                }`}>
                  <Icon 
                    size={24} 
                    className="text-white"
                    strokeWidth={2.5}
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse border-2 border-background" />
                </div>
              ) : (
                <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/20' : ''}`}>
                  <Icon 
                    size={22} 
                    className={`transition-all duration-300 ${isActive ? 'text-primary' : ''}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
              )}
              <span className={`text-[10px] font-medium transition-all duration-300 ${isActive ? 'text-primary' : ''} ${(item as any).special ? 'text-primary' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
