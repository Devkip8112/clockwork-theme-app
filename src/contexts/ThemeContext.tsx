import React, { createContext, useContext, useState, useEffect } from 'react';
import { logoGreen, logoBlue, logoDark } from '@/assets';

export interface CompanyTheme {
  id: string;
  name: string;
  className: string;
  logo: string;
  primaryColor: string;
  description: string;
}

const themes: CompanyTheme[] = [
  {
    id: 'green',
    name: 'EcoProperty Management',
    className: '',
    logo: logoGreen,
    primaryColor: 'hsl(142, 76%, 36%)',
    description: 'Sustainable property solutions'
  },
  {
    id: 'blue',
    name: 'TechSpace Properties',
    className: 'theme-blue',
    logo: logoBlue,
    primaryColor: 'hsl(217, 91%, 60%)',
    description: 'Innovation in property management'
  },
  {
    id: 'dark',
    name: 'Premium Estates',
    className: 'theme-dark',
    logo: logoDark,
    primaryColor: 'hsl(263, 70%, 65%)',
    description: 'Luxury property management'
  }
];

interface ThemeContextType {
  currentTheme: CompanyTheme;
  setTheme: (themeId: string) => void;
  themes: CompanyTheme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'green' 
}) => {
  const [currentTheme, setCurrentTheme] = useState<CompanyTheme>(
    themes.find(t => t.id === defaultTheme) || themes[0]
  );

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  useEffect(() => {
    // Apply theme class to document root
    const root = document.documentElement;
    
    // Remove all theme classes
    themes.forEach(theme => {
      if (theme.className) {
        root.classList.remove(theme.className);
      }
    });
    
    // Add current theme class
    if (currentTheme.className) {
      root.classList.add(currentTheme.className);
    }
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};