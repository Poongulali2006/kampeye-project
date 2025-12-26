import React from 'react';
import { Scan, MessageSquareWarning, Mic, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const { t } = useLanguage();

  const actions = [
    { id: 'scan', icon: Scan, label: t('scanApps'), color: 'bg-primary/20 text-primary hover:bg-primary/30' },
    { id: 'messages', icon: MessageSquareWarning, label: t('checkMessages'), color: 'bg-warning/20 text-warning hover:bg-warning/30' },
    { id: 'voice', icon: Mic, label: t('voiceLock'), color: 'bg-success/20 text-success hover:bg-success/30' },
    { id: 'learn', icon: GraduationCap, label: t('learnSafety'), color: 'bg-accent/20 text-accent hover:bg-accent/30' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {t('quickActions')}
      </h3>
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 ${action.color} border border-white/5 active:scale-95`}
            >
              <Icon size={24} />
              <span className="text-[10px] font-medium text-center leading-tight">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
