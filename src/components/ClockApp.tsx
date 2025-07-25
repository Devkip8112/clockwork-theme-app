import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { WelcomeScreen } from './WelcomeScreen';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { EmployeeLogin } from './EmployeeLogin';
import { EmployeeDashboard } from './EmployeeDashboard';

export const ClockApp: React.FC = () => {
  const { state } = useApp();

  const renderScreen = () => {
    // Check URL hash for employee access
    const isEmployeeRoute = window.location.hash === '#employee';
    
    if (isEmployeeRoute) {
      return <EmployeeLogin />;
    }

    switch (state.currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
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