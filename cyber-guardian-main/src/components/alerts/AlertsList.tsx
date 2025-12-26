import React, { useState } from 'react';
import { Phone, MessageSquare, Mail, ShieldAlert, ShieldCheck, AlertTriangle, Ban, Flag, CheckCircle2, ChevronDown, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface Alert {
  id: string;
  type: 'call' | 'sms' | 'email';
  title: string;
  description: string;
  content?: string;
  risk: 'low' | 'medium' | 'high';
  scamLikelihood: number;
  time: string;
  reasons: string[];
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'call',
    title: '+91 98765 43210',
    description: 'Suspected spam caller - lottery scam',
    risk: 'high',
    scamLikelihood: 95,
    time: '2 min ago',
    reasons: ['Unknown number', 'Matches known scam pattern', 'Multiple reports from users'],
  },
  {
    id: '2',
    type: 'sms',
    title: 'Bank Alert - OTP Required',
    description: 'Phishing attempt detected',
    content: 'Dear customer, your account will be blocked. Share OTP 847291 to verify. Click: bit.ly/secure-bank',
    risk: 'high',
    scamLikelihood: 98,
    time: '15 min ago',
    reasons: ['Suspicious URL shortener', 'Urgency tactics', 'Requests sensitive information'],
  },
  {
    id: '3',
    type: 'email',
    title: 'Congratulations! You Won ₹50 Lakhs!',
    description: 'Prize scam email from unknown sender',
    content: 'You have been selected as winner. Send processing fee of ₹5000 to claim prize...',
    risk: 'high',
    scamLikelihood: 99,
    time: '1 hour ago',
    reasons: ['Advance fee request', 'Too good to be true', 'Unknown sender domain'],
  },
  {
    id: '4',
    type: 'sms',
    title: 'Delivery Update',
    description: 'Package tracking notification',
    risk: 'low',
    scamLikelihood: 5,
    time: '3 hours ago',
    reasons: ['Legitimate sender', 'No suspicious links', 'Expected delivery'],
  },
];

const AlertsList: React.FC = () => {
  const { t } = useLanguage();
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

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
      case 'high': return <ShieldAlert className="text-destructive" size={20} />;
      case 'medium': return <AlertTriangle className="text-warning" size={20} />;
      default: return <ShieldCheck className="text-success" size={20} />;
    }
  };

  const getRiskClasses = (risk: string) => {
    switch (risk) {
      case 'high': return 'border-l-destructive bg-destructive/5';
      case 'medium': return 'border-l-warning bg-warning/5';
      default: return 'border-l-success bg-success/5';
    }
  };

  const getLikelihoodColor = (likelihood: number) => {
    if (likelihood >= 70) return 'text-destructive';
    if (likelihood >= 40) return 'text-warning';
    return 'text-success';
  };

  const filteredAlerts = filter === 'all' 
    ? mockAlerts 
    : mockAlerts.filter(a => a.risk === filter);

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'high', 'medium', 'low'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as typeof filter)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              filter === f 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)} Risk
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const Icon = getIcon(alert.type);
          const isExpanded = expandedAlert === alert.id;

          return (
            <div
              key={alert.id}
              className={`rounded-2xl border-l-4 ${getRiskClasses(alert.risk)} bg-card/50 backdrop-blur border border-white/5 overflow-hidden transition-all duration-300`}
            >
              <button
                onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold truncate">{alert.title}</p>
                      {getRiskIcon(alert.risk)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    
                    {/* Scam Likelihood */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">{t('scamLikelihood')}:</span>
                      <span className={`text-sm font-bold ${getLikelihoodColor(alert.scamLikelihood)}`}>
                        {alert.scamLikelihood}%
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 ml-auto">{alert.time}</span>
                    </div>
                  </div>
                  <ChevronDown 
                    size={18} 
                    className={`text-muted-foreground transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} 
                  />
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 animate-fade-in">
                  {alert.content && (
                    <div className="p-3 bg-muted/30 rounded-xl border border-white/5">
                      <p className="text-sm text-muted-foreground italic">"{alert.content}"</p>
                    </div>
                  )}

                  {/* Why it's suspicious */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">{t('suspicious')} because:</p>
                    <ul className="space-y-1">
                      {alert.reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <AlertTriangle size={12} className="text-warning flex-shrink-0" />
                          <span className="text-muted-foreground">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="destructive" size="sm" className="flex-1 rounded-xl">
                      <Ban size={14} className="mr-1" />
                      {t('blockNumber')}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                      <Flag size={14} className="mr-1" />
                      {t('reportScam')}
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-xl">
                      <CheckCircle2 size={14} className="mr-1" />
                      {t('markSafe')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsList;
