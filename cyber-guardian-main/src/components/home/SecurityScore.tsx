import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SecurityScoreProps {
  score: number;
}

const SecurityScore: React.FC<SecurityScoreProps> = ({ score }) => {
  const { t } = useLanguage();
  
  const getScoreColor = () => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreGradient = () => {
    if (score >= 80) return 'from-success/20 to-success/5';
    if (score >= 50) return 'from-warning/20 to-warning/5';
    return 'from-destructive/20 to-destructive/5';
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getScoreGradient()} p-6 border border-white/10`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-success/10 rounded-full blur-2xl" />
      </div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium mb-1">{t('securityScore')}</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-5xl font-bold ${getScoreColor()}`}>{score}</span>
            <span className="text-2xl text-muted-foreground font-medium">/100</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <CheckCircle size={16} className="text-success" />
            <span className="text-sm font-medium text-success">{t('protected')}</span>
          </div>
        </div>
        
        <div className="relative w-28 h-28">
          {/* Circular Progress */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/30"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${score * 2.64} 264`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--success))" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Shield Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-card/80 backdrop-blur flex items-center justify-center border border-white/10">
              <Shield size={26} className="text-primary animate-pulse-slow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityScore;
