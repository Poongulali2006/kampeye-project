import React, { useState } from 'react';
import { Shield, Scan, AlertTriangle, CheckCircle, Lock, Camera, Mic, MapPin, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface AppInfo {
  id: string;
  name: string;
  icon: string;
  risk: 'low' | 'medium' | 'high';
  permissions: string[];
  storageRisk: boolean;
  encryptionIssue: boolean;
}

const mockApps: AppInfo[] = [
  { id: '1', name: 'Social App', icon: '📱', risk: 'high', permissions: ['camera', 'microphone', 'location', 'contacts'], storageRisk: true, encryptionIssue: true },
  { id: '2', name: 'Banking App', icon: '🏦', risk: 'low', permissions: ['camera'], storageRisk: false, encryptionIssue: false },
  { id: '3', name: 'Game Pro', icon: '🎮', risk: 'medium', permissions: ['camera', 'storage'], storageRisk: true, encryptionIssue: false },
  { id: '4', name: 'File Manager', icon: '📁', risk: 'medium', permissions: ['storage', 'contacts'], storageRisk: false, encryptionIssue: true },
  { id: '5', name: 'Weather', icon: '🌤️', risk: 'low', permissions: ['location'], storageRisk: false, encryptionIssue: false },
];

const AppScanner: React.FC = () => {
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedApps, setScannedApps] = useState<AppInfo[]>([]);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScannedApps([]);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScannedApps(mockApps);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const getRiskClasses = (risk: string) => {
    switch (risk) {
      case 'high': return 'border-destructive/50 bg-destructive/10';
      case 'medium': return 'border-warning/50 bg-warning/10';
      default: return 'border-success/50 bg-success/10';
    }
  };

  const getRiskBadge = (risk: string) => {
    const classes = {
      high: 'bg-destructive/20 text-destructive border-destructive/30',
      medium: 'bg-warning/20 text-warning border-warning/30',
      low: 'bg-success/20 text-success border-success/30',
    };
    return classes[risk as keyof typeof classes];
  };

  const getPermissionIcon = (perm: string) => {
    switch (perm) {
      case 'camera': return <Camera size={12} />;
      case 'microphone': return <Mic size={12} />;
      case 'location': return <MapPin size={12} />;
      default: return <Lock size={12} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Scanner Header */}
      <div className="text-center space-y-4 py-6">
        <div className={`relative w-32 h-32 mx-auto ${isScanning ? 'animate-pulse' : ''}`}>
          <div className={`absolute inset-0 rounded-full ${isScanning ? 'gradient-primary animate-spin' : 'bg-muted/30'}`} style={{ animationDuration: '3s' }} />
          <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
            <Shield size={48} className={`${isScanning ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
          </div>
          {isScanning && (
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          )}
        </div>
        
        {isScanning ? (
          <div className="space-y-3">
            <p className="text-lg font-semibold text-primary">{t('scanning')}</p>
            <Progress value={scanProgress} className="h-2 w-48 mx-auto" />
            <p className="text-sm text-muted-foreground">{scanProgress}% complete</p>
          </div>
        ) : (
          <Button onClick={startScan} className="gradient-primary text-primary-foreground px-8 py-6 rounded-2xl text-lg font-semibold glow-primary">
            <Scan className="mr-2" size={20} />
            {t('scanNow')}
          </Button>
        )}
      </div>

      {/* Scanned Apps List */}
      {scannedApps.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Scan Results ({scannedApps.length} apps)
            </h3>
            <Button variant="ghost" size="sm" onClick={startScan} className="text-primary">
              <RefreshCw size={14} className="mr-1" />
              Rescan
            </Button>
          </div>

          <div className="space-y-3">
            {scannedApps.map((app) => (
              <div
                key={app.id}
                className={`p-4 rounded-2xl border ${getRiskClasses(app.risk)} backdrop-blur-sm transition-all duration-300`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-2xl">
                    {app.icon}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{app.name}</p>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getRiskBadge(app.risk)}`}>
                        {app.risk} {t('riskLevel')}
                      </span>
                    </div>
                    
                    {/* Permissions */}
                    <div className="flex flex-wrap gap-1">
                      {app.permissions.map((perm) => (
                        <span key={perm} className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-lg text-[10px] text-muted-foreground">
                          {getPermissionIcon(perm)}
                          {perm}
                        </span>
                      ))}
                    </div>

                    {/* Issues */}
                    <div className="flex gap-2">
                      {app.storageRisk && (
                        <span className="flex items-center gap-1 text-[10px] text-warning">
                          <AlertTriangle size={12} />
                          Insecure storage
                        </span>
                      )}
                      {app.encryptionIssue && (
                        <span className="flex items-center gap-1 text-[10px] text-destructive">
                          <Lock size={12} />
                          Weak encryption
                        </span>
                      )}
                      {!app.storageRisk && !app.encryptionIssue && (
                        <span className="flex items-center gap-1 text-[10px] text-success">
                          <CheckCircle size={12} />
                          No issues found
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppScanner;
