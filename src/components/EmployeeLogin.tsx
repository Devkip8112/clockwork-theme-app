import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Users, Loader2, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const EmployeeLogin: React.FC = () => {
  const [accessCode, setAccessCode] = useState('');
  const { setScreen, loginEmployee, state } = useApp();
  const { currentTheme } = useTheme();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (accessCode.length !== 6) {
      toast({
        title: "Invalid access code",
        description: "Please enter a 6-digit access code",
        variant: "destructive"
      });
      return;
    }

    if (!/^\d{6}$/.test(accessCode)) {
      toast({
        title: "Invalid format",
        description: "Access code must contain only numbers",
        variant: "destructive"
      });
      return;
    }

    try {
      await loginEmployee(accessCode);
    } catch (error) {
      toast({
        title: "Access Denied",
        description: "Invalid employee access code. Please check and try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setAccessCode(value);
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Button variant="ghost" onClick={() => setScreen('welcome')}>
          <ArrowLeft className="h-5 w-5" />
          Back
        </Button>
        
        <div className="flex items-center gap-3">
          <img 
            src={currentTheme.logo} 
            alt={currentTheme.name}
            className="h-8 w-auto object-contain"
          />
          <span className="font-semibold text-foreground hidden md:block">{currentTheme.name}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-elegant">
              <Users className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Employee Access</h1>
              <p className="text-muted-foreground mt-2">
                Enter your 6-digit personal access code
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="accessCode" className="text-sm font-medium text-foreground">
                Access Code
              </label>
              <div className="relative">
                <Input
                  id="accessCode"
                  type="text"
                  placeholder="123456"
                  value={accessCode}
                  onChange={handleInputChange}
                  className="h-16 text-2xl text-center font-mono tracking-widest pr-12"
                  maxLength={6}
                  autoComplete="off"
                  autoFocus
                />
                <KeyRound className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Enter 6-digit code</span>
                <span className={`font-mono ${accessCode.length === 6 ? 'text-success' : ''}`}>
                  {accessCode.length}/6
                </span>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="tablet"
              size="tablet"
              className="w-full"
              disabled={accessCode.length !== 6 || state.isLoading}
            >
              {state.isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Users className="h-5 w-5" />
                  Clock In / Out
                </>
              )}
            </Button>
          </form>

          {/* Demo codes info */}
          <div className="text-center p-4 bg-secondary rounded-xl">
            <p className="text-sm font-medium text-secondary-foreground mb-2">Valid Access Codes:</p>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <span className="bg-background px-2 py-1 rounded">123456</span>
              <span className="bg-background px-2 py-1 rounded">122334</span>
              <span className="bg-background px-2 py-1 rounded">135798</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Any other code will be rejected</p>
          </div>

          {/* Info */}
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>🔒 Secure employee authentication</p>
            <p>⚡ Quick access to clock functions</p>
          </div>
        </div>
      </div>
    </div>
  );
};