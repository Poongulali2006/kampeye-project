import React, { useState } from 'react';
import { 
  User, Settings, Bell, Globe, Mic, Shield, 
  ChevronRight, LogOut, HelpCircle, FileText,
  Volume2, VolumeX
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const ProfilePage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [voiceLockEnabled, setVoiceLockEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isVoiceLockActive, setIsVoiceLockActive] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleVoiceLockToggle = () => {
    setVoiceLockEnabled(!voiceLockEnabled);
    if (!voiceLockEnabled) {
      // Simulate voice lock activation
      setIsVoiceLockActive(true);
    }
  };

  const startVoiceUnlock = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      setIsVoiceLockActive(false);
    }, 3000);
  };

  const settingsItems = [
    {
      icon: Globe,
      label: t('language'),
      value: language === 'en' ? 'English' : 'தமிழ்',
      action: () => setLanguage(language === 'en' ? 'ta' : 'en'),
    },
    {
      icon: Bell,
      label: t('notifications'),
      toggle: true,
      value: notificationsEnabled,
      action: () => setNotificationsEnabled(!notificationsEnabled),
    },
    {
      icon: Mic,
      label: t('voiceControl'),
      toggle: true,
      value: voiceLockEnabled,
      action: handleVoiceLockToggle,
    },
  ];

  const menuItems = [
    { icon: Shield, label: 'Privacy Policy', href: '#' },
    { icon: FileText, label: 'Terms of Service', href: '#' },
    { icon: HelpCircle, label: 'Help & Support', href: '#' },
    { icon: LogOut, label: 'Sign Out', href: '#', danger: true },
  ];

  // Voice Lock Overlay
  if (isVoiceLockActive && voiceLockEnabled) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-8">
          <div className={`relative w-32 h-32 mx-auto ${isListening ? 'animate-pulse' : ''}`}>
            <div className="absolute inset-0 rounded-full bg-primary/20" />
            <div className="absolute inset-2 rounded-full bg-primary/30" />
            <div className="absolute inset-4 rounded-full bg-primary/40 flex items-center justify-center">
              {isListening ? (
                <Volume2 size={40} className="text-primary animate-pulse" />
              ) : (
                <VolumeX size={40} className="text-muted-foreground" />
              )}
            </div>
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-primary/50 animate-ping" />
                <div className="absolute inset-0 rounded-full border-2 border-primary animate-pulse" />
              </>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gradient">
              {isListening ? t('analyzing') : t('voiceLockActive')}
            </h2>
            <p className="text-muted-foreground">
              {isListening ? 'Verifying your voice...' : t('speakToUnlock')}
            </p>
          </div>

          {!isListening && (
            <Button 
              onClick={startVoiceUnlock}
              className="gradient-primary text-primary-foreground px-8 py-6 rounded-2xl text-lg font-semibold glow-primary"
            >
              <Mic className="mr-2" size={20} />
              {t('speakToUnlock')}
            </Button>
          )}

          <Button 
            variant="ghost" 
            onClick={() => setIsVoiceLockActive(false)}
            className="text-muted-foreground"
          >
            Use PIN instead
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl border border-white/10">
        <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center glow-primary">
          <User size={36} className="text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">User Name</h2>
          <p className="text-sm text-muted-foreground">user@email.com</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
              Level 3
            </span>
            <span className="text-xs text-muted-foreground">650 XP</span>
          </div>
        </div>
      </div>

      {/* Voice Lock Status */}
      {voiceLockEnabled && (
        <div className="p-4 bg-success/10 border border-success/30 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
              <Mic size={20} className="text-success" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-success">{t('voiceLockActive')}</p>
              <p className="text-xs text-muted-foreground">Your app is secured with voice recognition</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsVoiceLockActive(true)}
              className="text-success"
            >
              Test
            </Button>
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {t('settings')}
        </h3>
        
        <div className="bg-card rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
          {settingsItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className="w-full flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                  <Icon size={20} className="text-primary" />
                </div>
                <span className="flex-1 text-left font-medium">{item.label}</span>
                {item.toggle ? (
                  <Switch checked={item.value as boolean} />
                ) : (
                  <>
                    <span className="text-sm text-muted-foreground">{item.value as string}</span>
                    <ChevronRight size={18} className="text-muted-foreground" />
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-card rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              className={`w-full flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors ${
                item.danger ? 'text-destructive' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-xl ${item.danger ? 'bg-destructive/20' : 'bg-muted/50'} flex items-center justify-center`}>
                <Icon size={20} className={item.danger ? 'text-destructive' : 'text-muted-foreground'} />
              </div>
              <span className="flex-1 text-left font-medium">{item.label}</span>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          );
        })}
      </div>

      {/* App Version */}
      <p className="text-center text-xs text-muted-foreground py-4">
        KAMP EYE v1.0.0 • Made with ❤️ for Cyber Safety
      </p>
    </div>
  );
};

export default ProfilePage;
