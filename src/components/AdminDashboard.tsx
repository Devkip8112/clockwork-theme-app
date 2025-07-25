import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  LogOut, 
  Clock, 
  Clock3, 
  Clock9, 
  Building2, 
  Users,
  Activity,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminDashboard: React.FC = () => {
  const { state, logout, clockIn, clockOut } = useApp();
  const { currentTheme } = useTheme();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    clockIn();
    toast({
      title: "Clocked In Successfully",
      description: `Welcome back, ${state.userName}!`,
      variant: "default"
    });
  };

  const handleClockOut = () => {
    clockOut();
    toast({
      title: "Clocked Out Successfully", 
      description: "Have a great day!",
      variant: "default"
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "Session ended successfully",
      variant: "default"
    });
    logout();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const lastClockEntry = state.clockEntries[0];
  const isCurrentlyClockedIn = lastClockEntry?.type === 'in';

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <div className="bg-card shadow-elegant border-b border-border">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <img 
              src={currentTheme.logo} 
              alt={currentTheme.name}
              className="h-10 w-auto object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">{currentTheme.name}</h1>
              <p className="text-sm text-muted-foreground">Administrator Dashboard</p>
            </div>
          </div>
          
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6 max-w-4xl mx-auto">
        {/* Welcome section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {state.userName}
          </h2>
          <p className="text-lg text-muted-foreground">
            Property ID: <span className="font-mono font-semibold">{state.propertyId}</span>
          </p>
        </div>

        {/* Current time */}
        <div className="mb-8 text-center bg-card rounded-2xl p-6 shadow-elegant">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">CURRENT TIME</p>
            <p className="text-4xl font-bold font-mono text-primary">{formatTime(currentTime)}</p>
            <p className="text-sm text-muted-foreground">{formatDate(currentTime)}</p>
          </div>
        </div>

        {/* Status indicator */}
        {lastClockEntry && (
          <div className="mb-8 flex justify-center">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-elegant ${
              isCurrentlyClockedIn 
                ? 'bg-success text-success-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}>
              <Activity className={`h-5 w-5 ${isCurrentlyClockedIn ? 'animate-pulse' : ''}`} />
              <span className="font-semibold">
                Currently {isCurrentlyClockedIn ? 'Clocked In' : 'Clocked Out'}
              </span>
              {isCurrentlyClockedIn && <div className="w-2 h-2 bg-success-foreground rounded-full animate-pulse" />}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Button 
            variant="clock"
            size="clock"
            onClick={handleClockIn}
            className="w-full"
          >
            <Clock3 className="h-8 w-8" />
            Clock In
          </Button>
          
          <Button 
            variant="clock"
            size="clock"
            onClick={handleClockOut}
            className="w-full"
          >
            <Clock9 className="h-8 w-8" />
            Clock Out
          </Button>

          <Button 
            variant="outline"
            size="clock"
            onClick={() => window.open(window.location.origin + '#employee', '_blank')}
            className="w-full"
          >
            <Users className="h-8 w-8" />
            Employee Access
          </Button>
        </div>

        {/* Recent activity */}
        <div className="bg-card rounded-2xl p-6 shadow-elegant">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </h3>
          
          {state.clockEntries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No clock entries yet today</p>
          ) : (
            <div className="space-y-3">
              {state.clockEntries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      entry.type === 'in' ? 'bg-success' : 'bg-warning'
                    }`} />
                    <span className="font-medium">
                      {entry.type === 'in' ? 'Clocked In' : 'Clocked Out'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {entry.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-card rounded-xl p-4 text-center shadow-elegant">
            <Building2 className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Property</p>
            <p className="font-mono font-semibold">{state.propertyId}</p>
          </div>
          
          <div className="bg-card rounded-xl p-4 text-center shadow-elegant">
            <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-semibold capitalize">{state.userRole}</p>
          </div>
          
          <div className="bg-card rounded-xl p-4 text-center shadow-elegant">
            <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Entries</p>
            <p className="font-semibold">{state.clockEntries.length}</p>
          </div>
          
          <div className="bg-card rounded-xl p-4 text-center shadow-elegant">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-semibold text-success">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};