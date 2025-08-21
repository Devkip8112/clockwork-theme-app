import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MobileOptimizedButton } from '@/components/MobileOptimizedButton';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Clock3, Clock9, CheckCircle, Timer, Activity, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { storeClockEntry } from '@/utils/offline';
export const EmployeeDashboard: React.FC = () => {
  const {
    state,
    logout,
    clockIn,
    clockOut
  } = useApp();
  const {
    currentTheme
  } = useTheme();
  const {
    toast
  } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState(30); // 30 seconds for demo

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          handleDone();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdownTimer);
  }, []);
  const handleClockIn = async () => {
    const entry = {
      id: Date.now().toString(),
      employeeId: state.userId || 'temp-id',
      employeeName: state.userName || 'Unknown',
      type: 'clock-in' as const,
      timestamp: new Date().toISOString(),
      propertyId: state.adminData?.propertyId || 'temp-property'
    };

    // Store offline first
    await storeClockEntry(entry);
    
    // Then update app state
    clockIn();
    
    toast({
      title: "Clocked In Successfully",
      description: `Good ${getTimeOfDayGreeting()}, ${state.userName}!`,
    });
  };

  const handleClockOut = async () => {
    const entry = {
      id: Date.now().toString(),
      employeeId: state.userId || 'temp-id',
      employeeName: state.userName || 'Unknown',
      type: 'clock-out' as const,
      timestamp: new Date().toISOString(),
      propertyId: state.adminData?.propertyId || 'temp-property'
    };

    // Store offline first
    await storeClockEntry(entry);
    
    // Then update app state
    clockOut();
    
    toast({
      title: "Clocked Out Successfully",
      description: "Thank you for your hard work!",
    });
  };
  const handleDone = () => {
    toast({
      title: "Session Complete",
      description: "Automatically logged out",
      variant: "default"
    });
    logout();
  };
  const getTimeOfDayGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };
  const lastClockEntry = state.clockEntries[0];
  const isCurrentlyClockedIn = lastClockEntry?.type === 'in';
  return <div className="min-h-screen bg-gradient-surface">
      {/* Header with auto-logout timer */}
      <div className="bg-card shadow-elegant border-b border-border">
        <div className="flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-3">
            <img src={currentTheme.logo} alt={currentTheme.name} className="h-8 w-auto object-contain" />
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-foreground">{currentTheme.name}</h1>
              <p className="text-sm text-muted-foreground">Employee Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Timer className="h-4 w-4 text-warning" />
            <span className="text-muted-foreground">Auto-logout in</span>
            <span className="font-mono font-bold text-warning">{countdown}s</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        {/* Welcome section */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Hello, {state.userName}
          </h2>
          <div className="space-y-1">
            <p className="text-lg text-muted-foreground">{formatDate(currentTime)}</p>
            <p className="text-3xl font-bold font-mono text-primary">{formatTime(currentTime)}</p>
          </div>
        </div>

        {/* Status indicator */}
        {lastClockEntry && <div className="mb-6 flex justify-center">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-elegant ${isCurrentlyClockedIn ? 'bg-success text-success-foreground' : 'bg-secondary text-secondary-foreground'}`}>
              <Activity className={`h-5 w-5 ${isCurrentlyClockedIn ? 'animate-pulse' : ''}`} />
              <span className="font-semibold">
                Currently {isCurrentlyClockedIn ? 'Clocked In' : 'Clocked Out'}
              </span>
              {isCurrentlyClockedIn && <div className="w-2 h-2 bg-success-foreground rounded-full animate-pulse" />}
            </div>
          </div>}

        {/* Action buttons */}
        <div className="space-y-4 mb-6">
          <MobileOptimizedButton 
            variant="default" 
            touchSize="xl" 
            onClick={handleClockIn} 
            className="w-full bg-success hover:bg-success/90 text-success-foreground"
          >
            <Clock3 className="h-8 w-8" />
            Clock In
          </MobileOptimizedButton>
          
          <MobileOptimizedButton 
            variant="default" 
            touchSize="xl" 
            onClick={handleClockOut} 
            className="w-full bg-warning hover:bg-warning/90 text-warning-foreground"
          >
            <Clock9 className="h-8 w-8" />
            Clock Out
          </MobileOptimizedButton>
          
          <MobileOptimizedButton 
            variant="outline" 
            touchSize="large" 
            onClick={handleDone} 
            className="w-full"
          >
            <CheckCircle className="h-6 w-6" />
            Done
          </MobileOptimizedButton>
        </div>

        {/* Auto-logout warning */}
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Auto-logout Active</p>
              <p className="text-muted-foreground">
                This session will automatically end in <span className="font-mono font-bold">{countdown} seconds</span> for security.
              </p>
            </div>
          </div>
        </div>

        {/* Today's activity */}
        {state.clockEntries.length > 0 && <div className="bg-card rounded-xl p-4 shadow-elegant">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Today's Activity
            </h3>
            
            <div className="space-y-2">
              {state.clockEntries.slice(0, 3).map(entry => <div key={entry.id} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${entry.type === 'in' ? 'bg-success' : 'bg-warning'}`} />
                    <span className="text-sm font-medium">
                      {entry.type === 'in' ? 'Clocked In' : 'Clocked Out'}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {entry.timestamp.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
                  </span>
                </div>)}
            </div>
          </div>}

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground mt-6 space-y-1">
          
          <p>• Tap "Clock Out" when you finish</p>
          <p>• Tap "Done" to complete your session</p>
        </div>
      </div>
    </div>;
};