import React, { useState, useEffect } from 'react';
import { Network } from '@capacitor/network';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const checkNetwork = async () => {
      const status = await Network.getStatus();
      setIsOnline(status.connected);
    };

    checkNetwork();

    const setupListener = async () => {
      const listener = await Network.addListener('networkStatusChange', (status) => {
        setIsOnline(status.connected);
      });

      return () => {
        listener.remove();
      };
    };

    setupListener();
  }, []);

  if (isOnline) return null;

  return (
    <Badge variant="destructive" className="gap-1">
      <WifiOff className="h-3 w-3" />
      {t('offline.indicator')}
    </Badge>
  );
};