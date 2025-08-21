import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppProvider } from '@/contexts/AppContext';
import { ClockApp } from '@/components/ClockApp';

const Index = () => {
  return (
    <ThemeProvider defaultTheme="green">
      <AppProvider>
        <ClockApp />
      </AppProvider>
    </ThemeProvider>
  );
};

export default Index;
