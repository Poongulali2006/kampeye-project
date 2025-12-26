import React from 'react';
import { Shield, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30 safe-area-pt">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
              <Shield size={22} className="text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gradient">{t('appName')}</h1>
            <p className="text-[10px] text-muted-foreground font-medium">{t('tagline')}</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary px-3 py-2 rounded-xl"
        >
          <Globe size={16} className="text-primary" />
          <span className="text-sm font-semibold">{language === 'en' ? 'தமிழ்' : 'EN'}</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
