import React from 'react';
import { Phone, MessageSquare, Mail, ChevronRight, AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Alert {
  id: string;
  type: 'call' | 'sms' | 'email';
  title: string;
  description: string;
  risk: 'low' | 'medium' | 'high';
  time: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'call',
    title: '+91 98765 43210',
    description: 'Suspected spam caller - lottery scam',
    risk: 'high',
    time: '2 min ago',
  },
  {
    id: '2',
    type: 'sms',
    title: 'Bank Alert',
    description: 'Phishing attempt detected - fake OTP request',
    risk: 'high',
    time: '15 min ago',
  },
  {
    id: '3',
    type: 'email',
    title: 'Prize Winner!',
    description: 'Suspicious email from unknown sender',
    risk: 'medium',
    time: '1 hour ago',
  },
];

interface RecentAlertsProps {
  onViewAll: () => void;
}

const RecentAlerts: React.FC<RecentAlertsProps> = ({ onViewAll }) => {
  const { t } = useLanguage();

  const getIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'sms': return MessageSquare;
      case 'email': return Mail;
      default: return AlertTriangle;
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high': return <ShieldAlert className="text-destructive" size={18} />;
      case 'medium': return <AlertTriangle className="text-warning" size={18} />;
      default: return <ShieldCheck className="text-success" size={18} />;
    }
  };

  const getRiskClasses = (risk: string) => {
    switch (risk) {
      case 'high': return 'border-l-destructive bg-destructive/5';
      case 'medium': return 'border-l-warning bg-warning/5';
      default: return 'border-l-success bg-success/5';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {t('recentAlerts')}
        </h3>
        <button 
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {t('viewAll')}
          <ChevronRight size={14} />
        </button>
      </div>
      
      <div className="space-y-2">
        {mockAlerts.map((alert) => {
          const Icon = getIcon(alert.type);
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border-l-4 ${getRiskClasses(alert.risk)} bg-card/50 backdrop-blur border border-white/5`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm truncate">{alert.title}</p>
                    {getRiskIcon(alert.risk)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{alert.description}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-2">{alert.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentAlerts;
