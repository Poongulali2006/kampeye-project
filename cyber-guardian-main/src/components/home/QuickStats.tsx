import React from 'react';
import { CheckCircle2, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: 'success' | 'warning' | 'destructive';
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color }) => {
  const colorClasses = {
    success: 'bg-success/10 border-success/20 text-success',
    warning: 'bg-warning/10 border-warning/20 text-warning',
    destructive: 'bg-destructive/10 border-destructive/20 text-destructive',
  };

  const iconBgClasses = {
    success: 'bg-success/20',
    warning: 'bg-warning/20',
    destructive: 'bg-destructive/20',
  };

  return (
    <div className={`flex-1 p-4 rounded-2xl border ${colorClasses[color]} backdrop-blur-sm`}>
      <div className={`w-10 h-10 rounded-xl ${iconBgClasses[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground font-medium mt-1">{label}</p>
    </div>
  );
};

const QuickStats: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex gap-3">
      <StatCard
        icon={<CheckCircle2 size={20} />}
        value={24}
        label={t('appsSafe')}
        color="success"
      />
      <StatCard
        icon={<ShieldAlert size={20} />}
        value={12}
        label={t('threatsBlocked')}
        color="warning"
      />
      <StatCard
        icon={<AlertTriangle size={20} />}
        value={3}
        label={t('scamsDetected')}
        color="destructive"
      />
    </div>
  );
};

export default QuickStats;
