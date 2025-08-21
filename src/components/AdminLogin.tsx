import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Building2, Mail, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminLogin: React.FC = () => {
  const [propertyId, setPropertyId] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { setScreen, loginAdmin, state } = useApp();
  const { currentTheme } = useTheme();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!propertyId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Property ID",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitted(true);
    
    // Show success message first
    toast({
      title: "Magic link sent!",
      description: "Check your email for the login link",
      variant: "default"
    });

    // Simulate sending email and auto-login after delay
    setTimeout(() => {
      // loginAdmin(propertyId);
    }, 2000);
  };

  if (isSubmitted) {
    setScreen('employee-login');
    return null; // Prevent rendering the form again
    // return (
    //   // <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-6">
    //   //   <div className="w-full max-w-md text-center space-y-6">
    //   //     <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow animate-pulse">
    //   //       <Mail className="h-10 w-10 text-primary-foreground" />
    //   //     </div>
          
    //   //     <div className="space-y-2">
    //   //       <h2 className="text-2xl font-bold text-foreground">Check Your Email</h2>
    //   //       <p className="text-muted-foreground">
    //   //         A magic login link has been sent to your email address for Property ID: <span className="font-mono font-semibold">{propertyId}</span>
    //   //       </p>
    //   //     </div>

    //   //     {state.isLoading && (
    //   //       <div className="flex items-center justify-center gap-2 text-primary">
    //   //         <Loader2 className="h-4 w-4 animate-spin" />
    //   //         <span className="text-sm">Logging you in...</span>
    //   //       </div>
    //   //     )}

    //   //     <Button 
    //   //       variant="outline" 
    //   //       onClick={() => {
    //   //         setIsSubmitted(false);
    //   //         setPropertyId('');
    //   //         setScreen('welcome');
    //   //       }}
    //   //       className="w-full"
    //   //     >
    //   //       <ArrowLeft className="h-4 w-4" />
    //   //       Back to Home
    //   //     </Button>
    //   //   </div>
    //   // </div>
    //   <div>Hello world</div>
    // );
  }

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
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Property Login</h1>
              <p className="text-muted-foreground mt-2">
                Enter your Property ID to receive a secure login link
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="propertyId" className="text-sm font-medium text-foreground">
                Property ID
              </label>
              <Input
                id="propertyId"
                type="text"
                placeholder="Enter your property ID"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="h-14 text-lg"
                autoComplete="off"
                autoFocus
              />
              <p className="text-sm text-muted-foreground">
                This is typically a 4-8 character code provided by your organization
              </p>
            </div>

            <Button 
              type="submit" 
              variant="tablet"
              size="tablet"
              className="w-full"
              disabled={!propertyId.trim() || state.isLoading}
            >
              {state.isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending Magic Link...
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5" />
                  Send Magic Link
                </>
              )}
            </Button>
          </form>

          {/* Info */}
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>🔒 Secure passwordless authentication</p>
            <p>📧 Check your email including spam folder</p>
          </div>
        </div>
      </div>
    </div>
  );
};