import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { WelcomeScreen } from './WelcomeScreen';
import { AdminRegistration } from './AdminRegistration';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { EmployeeLogin } from './EmployeeLogin';
import { EmployeeDashboard } from './EmployeeDashboard';

export const ClockApp: React.FC = () => {
  const { state } = useApp();
  const { setTheme } = useTheme();

  // Set theme based on admin's brand selection
  React.useEffect(() => {
    if (state.adminData?.brandTheme) {
      setTheme(state.adminData.brandTheme);
    }
  }, [state.adminData?.brandTheme, setTheme]);

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'admin-registration':
        return <AdminRegistration />;
      case 'admin-login':
        return <AdminLogin />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'employee-login':
        return <EmployeeLogin />;
      case 'employee-dashboard':
        return <EmployeeDashboard />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="font-sans antialiased">
      {renderScreen()}
    </div>
  );
};