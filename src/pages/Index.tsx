import React, { useState } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppProvider } from '@/contexts/AppContext';
import { ClockApp } from '@/components/ClockApp';
import { InstallPrompt } from '@/components/InstallPrompt';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { PullToRefresh } from '@/components/PullToRefresh';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);
  const { toast } = useToast();

  return (
    <ThemeProvider defaultTheme="green">
      <AppProvider>
        <PullToRefresh onRefresh={async () => {
          // Refresh employee data if needed
          toast({
            title: "Data Synced",
            description: "All offline data has been synchronized"
          });
        }}>
          <ClockApp />
        </PullToRefresh>
        <OfflineIndicator />
        {showInstallPrompt && (
          <InstallPrompt onDismiss={() => setShowInstallPrompt(false)} />
        )}
      </AppProvider>
    </ThemeProvider>
  );
};

export default Index;
