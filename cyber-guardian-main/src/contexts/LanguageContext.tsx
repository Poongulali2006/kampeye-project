import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ta';

interface Translations {
  [key: string]: {
    en: string;
    ta: string;
  };
}

export const translations: Translations = {
  appName: { en: 'KAMP EYE', ta: 'காம்ப் ஐ' },
  tagline: { en: 'Your Cyber Guardian', ta: 'உங்கள் சைபர் பாதுகாவலர்' },
  home: { en: 'Home', ta: 'முகப்பு' },
  scanner: { en: 'Scanner', ta: 'ஸ்கேனர்' },
  alerts: { en: 'Alerts', ta: 'எச்சரிக்கைகள்' },
  learn: { en: 'Learn', ta: 'கற்றல்' },
  profile: { en: 'Profile', ta: 'சுயவிவரம்' },
  securityScore: { en: 'Security Score', ta: 'பாதுகாப்பு மதிப்பெண்' },
  protected: { en: 'Protected', ta: 'பாதுகாக்கப்பட்டது' },
  scanNow: { en: 'Scan Now', ta: 'இப்போது ஸ்கேன் செய்' },
  recentAlerts: { en: 'Recent Alerts', ta: 'சமீபத்திய எச்சரிக்கைகள்' },
  viewAll: { en: 'View All', ta: 'அனைத்தும் காண்க' },
  appsSafe: { en: 'Apps Safe', ta: 'பயன்பாடுகள் பாதுகாப்பு' },
  threatsBlocked: { en: 'Threats Blocked', ta: 'தடுக்கப்பட்ட அச்சுறுத்தல்கள்' },
  scamsDetected: { en: 'Scams Detected', ta: 'கண்டறியப்பட்ட மோசடிகள்' },
  quickActions: { en: 'Quick Actions', ta: 'விரைவு செயல்கள்' },
  scanApps: { en: 'Scan Apps', ta: 'ஆப்ஸ் ஸ்கேன்' },
  checkMessages: { en: 'Check Messages', ta: 'செய்திகள் சோதி' },
  voiceLock: { en: 'Voice Lock', ta: 'குரல் பூட்டு' },
  learnSafety: { en: 'Learn Safety', ta: 'பாதுகாப்பு கற்றல்' },
  riskLevel: { en: 'Risk Level', ta: 'ஆபத்து நிலை' },
  low: { en: 'Low', ta: 'குறைவு' },
  medium: { en: 'Medium', ta: 'நடுத்தர' },
  high: { en: 'High', ta: 'அதிக' },
  permissions: { en: 'Permissions', ta: 'அனுமதிகள்' },
  storage: { en: 'Storage', ta: 'சேமிப்பு' },
  encryption: { en: 'Encryption', ta: 'குறியாக்கம்' },
  scamLikelihood: { en: 'Scam Likelihood', ta: 'மோசடி சாத்தியம்' },
  suspicious: { en: 'Suspicious', ta: 'சந்தேகத்திற்குரிய' },
  phishing: { en: 'Phishing', ta: 'ஃபிஷிங்' },
  safe: { en: 'Safe', ta: 'பாதுகாப்பானது' },
  unsafe: { en: 'Unsafe', ta: 'பாதுகாப்பற்றது' },
  dailyChallenge: { en: 'Daily Challenge', ta: 'தினசரி சவால்' },
  startQuiz: { en: 'Start Quiz', ta: 'வினாடி வினா தொடங்கு' },
  progress: { en: 'Progress', ta: 'முன்னேற்றம்' },
  badges: { en: 'Badges', ta: 'பேட்ஜ்கள்' },
  settings: { en: 'Settings', ta: 'அமைப்புகள்' },
  language: { en: 'Language', ta: 'மொழி' },
  notifications: { en: 'Notifications', ta: 'அறிவிப்புகள்' },
  voiceControl: { en: 'Voice Control', ta: 'குரல் கட்டுப்பாடு' },
  enableVoiceLock: { en: 'Enable Voice Lock', ta: 'குரல் பூட்டை இயக்கு' },
  voiceLockActive: { en: 'Voice Lock Active', ta: 'குரல் பூட்டு செயலில்' },
  speakToUnlock: { en: 'Speak to Unlock', ta: 'திறக்க பேசுங்கள்' },
  analyzing: { en: 'Analyzing...', ta: 'பகுப்பாய்வு செய்கிறது...' },
  scanning: { en: 'Scanning...', ta: 'ஸ்கேன் செய்கிறது...' },
  reportScam: { en: 'Report Scam', ta: 'மோசடி புகார்' },
  blockNumber: { en: 'Block Number', ta: 'எண்ணைத் தடு' },
  markSafe: { en: 'Mark Safe', ta: 'பாதுகாப்பு குறி' },
  voiceAssistant: { en: 'Voice Assistant', ta: 'குரல் உதவியாளர்' },
  monitoring24hr: { en: '24/7 Monitoring', ta: '24/7 கண்காணிப்பு' },
  tapToSpeak: { en: 'Tap to Speak', ta: 'பேச தட்டவும்' },
  listening: { en: 'Listening...', ta: 'கேட்கிறது...' },
  processing: { en: 'Processing...', ta: 'செயலாக்குகிறது...' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
