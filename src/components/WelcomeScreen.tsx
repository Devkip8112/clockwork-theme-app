import React from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Building2, Users, Settings } from 'lucide-react';
export const WelcomeScreen: React.FC = () => {
  const {
    setScreen
  } = useApp();
  const {
    currentTheme,
    themes,
    setTheme
  } = useTheme();
  return <div className="min-h-screen bg-gradient-surface flex flex-col">
      {/* Header with theme selector */}
      <div className="flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center gap-3">
          <img src={currentTheme.logo} alt={currentTheme.name} className="h-8 md:h-12 w-auto object-contain" />
          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-foreground">{currentTheme.name}</h1>
            <p className="text-sm text-muted-foreground">{currentTheme.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground hidden md:block" />
          <select value={currentTheme.id} onChange={e => setTheme(e.target.value)} className="text-sm bg-secondary text-secondary-foreground rounded-lg px-3 py-2 border border-border focus:ring-2 focus:ring-ring focus:outline-none">
            {themes.map(theme => <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>)}
          </select>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 text-center">
          {/* Logo and welcome */}
          <div className="space-y-4">
            <div className="mx-auto w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <Building2 className="h-12 w-12 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Welcome to TimeTracker
              </h1>
              <p className="text-lg text-muted-foreground">
                Professional clock-in system for property management
              </p>
            </div>
          </div>

          {/* User type selection */}
          <div className="space-y-4">
            <div className="grid gap-4">
              <Button variant="tablet" size="tablet" onClick={() => setScreen('admin-login')} className="w-full">
                <Building2 className="h-6 w-6" />
                Access your Property
              </Button>
              
              {/* <Button variant="outline" size="tablet" onClick={() => setScreen('employee-login')} className="w-full">
                <Users className="h-6 w-6" />
                Employee Access
              </Button> */}
            </div>
          </div>

          {/* Features info */}
          <div className="text-sm text-muted-foreground space-y-2 pt-4">
            
            
            <p>🔒 Secure access management</p>
          </div>
        </div>
      </div>
    </div>;
};