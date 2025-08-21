import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

interface InstallPromptProps {
  onDismiss: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ onDismiss }) => {
  const { installApp, canInstall } = usePWA();

  if (!canInstall) return null;

  const handleInstall = async () => {
    await installApp();
    onDismiss();
  };

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 border-primary/20 bg-card/95 backdrop-blur-sm md:left-auto md:right-4 md:w-96">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Download className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-card-foreground">Install TimeTracker Pro</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Add TimeTracker Pro to your home screen for quick access and offline functionality.
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={handleInstall}
                size="sm"
                className="flex-1"
              >
                Install App
              </Button>
              <Button 
                onClick={onDismiss}
                variant="outline"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};