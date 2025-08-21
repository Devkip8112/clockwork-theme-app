import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { syncOfflineData } from '@/utils/offline';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWA();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    if (isOnline && !isSyncing) {
      handleSync();
    }
  }, [isOnline]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncOfflineData();
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isOnline && !isSyncing && !lastSyncTime) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge 
        variant={isOnline ? "secondary" : "destructive"}
        className="flex items-center gap-2 px-3 py-2"
      >
        {isSyncing ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Syncing...
          </>
        ) : isOnline ? (
          <>
            <Wifi className="h-4 w-4" />
            Online
            {lastSyncTime && (
              <span className="text-xs opacity-75">
                • Synced {lastSyncTime.toLocaleTimeString()}
              </span>
            )}
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            Offline Mode
          </>
        )}
      </Badge>
    </div>
  );
};