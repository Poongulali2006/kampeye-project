import React, { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import SecurityScore from '@/components/home/SecurityScore';
import QuickStats from '@/components/home/QuickStats';
import QuickActions from '@/components/home/QuickActions';
import RecentAlerts from '@/components/home/RecentAlerts';
import AppScanner from '@/components/scanner/AppScanner';
import AlertsList from '@/components/alerts/AlertsList';
import LearningHub from '@/components/learn/LearningHub';
import ProfilePage from '@/components/profile/ProfilePage';
import VoiceAssistant from '@/components/voice/VoiceAssistant';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'scan':
        setActiveTab('scanner');
        break;
      case 'messages':
        setActiveTab('alerts');
        break;
      case 'voice':
        setActiveTab('voice');
        break;
      case 'learn':
        setActiveTab('learn');
        break;
      default:
        break;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6 animate-fade-in">
            <SecurityScore score={85} />
            <QuickStats />
            <QuickActions onAction={handleQuickAction} />
            <RecentAlerts onViewAll={() => setActiveTab('alerts')} />
          </div>
        );
      case 'scanner':
        return (
          <div className="animate-fade-in">
            <AppScanner />
          </div>
        );
      case 'alerts':
        return (
          <div className="animate-fade-in">
            <AlertsList />
          </div>
        );
      case 'learn':
        return (
          <div className="animate-fade-in">
            <LearningHub />
          </div>
        );
      case 'voice':
        return (
          <div className="animate-fade-in">
            <VoiceAssistant />
          </div>
        );
      case 'profile':
        return (
          <div className="animate-fade-in">
            <ProfilePage />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-24 px-4">
          {renderContent()}
        </main>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </LanguageProvider>
  );
};

export default Index;
